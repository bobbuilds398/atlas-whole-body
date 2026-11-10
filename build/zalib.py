"""Construction des vues d'articulation à partir de Z-Anatomy (maillages exportés de Startup.blend).
Repère (mm) : x vers la gauche du sujet (droite = x négatif), y vers l'arrière (avant = y négatif), z vers le haut."""
import numpy as np, struct, json, re, os, base64, sys, difflib
import fast_simplification as fs
from scipy.spatial import cKDTree
W='/tmp/claude-0/-home-claude/b309af02-d556-598f-9517-fe97b5f199d6/scratchpad/'
ZA=W+'work/za/'
INDEX=[json.loads(l) for l in open(ZA+'index.jsonl')]
BYN={}
for x in INDEX: BYN.setdefault(x['name'],[]).append(x)
COLL=lambda x:(x['cols'][0][0] if x['cols'] else '')

def find(name,side='r'):
    """nom exact, sinon nom + côté (.r/.l), sinon structure médiane"""
    for c in (name,name+'.'+side):
        if c in BYN: return c
    sug=difflib.get_close_matches(name,[n[:-2] if n[-2:] in('.r','.l') else n for n in BYN],n=4,cutoff=.5)
    raise KeyError('%s ? proches : %s'%(name,sug))

def loop_subdiv(v,t,mi):
    v=v.astype(np.float64);n=len(v);F=len(t)
    e=np.sort(np.concatenate([t[:,[0,1]],t[:,[1,2]],t[:,[2,0]]]),axis=1)
    ue,inv,cnt=np.unique(e,axis=0,return_inverse=True,return_counts=True);inv=inv.ravel()
    eid=inv.reshape(3,F).T
    opp=np.concatenate([t[:,2],t[:,0],t[:,1]])
    osum=np.zeros((len(ue),3));np.add.at(osum,inv,v[opp])
    inter=cnt==2
    ev=.5*(v[ue[:,0]]+v[ue[:,1]])
    ev[inter]=.375*(v[ue[inter,0]]+v[ue[inter,1]])+.125*osum[inter]
    nb=np.zeros((n,3));deg=np.zeros(n)
    np.add.at(nb,ue[:,0],v[ue[:,1]]);np.add.at(nb,ue[:,1],v[ue[:,0]]);np.add.at(deg,ue[:,0],1);np.add.at(deg,ue[:,1],1)
    beta=np.where(deg>3,3/(8*np.maximum(deg,1)),3/16)
    nv=v*(1-deg*beta)[:,None]+nb*beta[:,None]
    bv=np.unique(ue[~inter]);nv[bv]=v[bv]
    a,b,c=t.T;ab=n+eid[:,0];bc=n+eid[:,1];ca=n+eid[:,2]
    T=np.stack([np.stack([a,ab,ca],1),np.stack([ab,b,bc],1),np.stack([ca,bc,c],1),np.stack([ab,bc,ca],1)],1).reshape(-1,3)
    return np.vstack([nv,ev]).astype(np.float32),T.astype(np.int64),np.repeat(mi,4)

_C={}
def load(name,side='r',smooth=True):
    """liste de maillages {v (mm), t, mi, mats} ; les maillages peu denses sont lissés par subdivision"""
    key=(find(name,side),smooth)
    if key in _C: return _C[key]
    out=[]
    for x in BYN[key[0]]:
        z=np.load(ZA+'%d.npz'%x['k']);v=z['v'].astype(np.float32)*1000;t=z['t'].astype(np.int64);mi=z['mi'].astype(np.int64)
        u,inv=np.unique(np.round(v,2),axis=0,return_inverse=True);v=u.astype(np.float32);t=inv.ravel()[t]
        ok=(t[:,0]!=t[:,1])&(t[:,1]!=t[:,2])&(t[:,0]!=t[:,2]);t=t[ok];mi=mi[ok]
        if smooth:
            lv=2 if len(t)<1500 else 1 if len(t)<14000 else 0
            for _ in range(lv): v,t,mi=loop_subdiv(v,t,mi)
        out.append({'v':v,'t':t,'mi':mi,'mats':x['mats'],'name':x['name']})
    _C[key]=out;return out
def V(name,side='r'): return np.concatenate([m['v'] for m in load(name,side,smooth=False)])

DIRS={'up':(0,0,1),'down':(0,0,-1),'front':(0,-1,0),'back':(0,1,0),'lat':(-1,0,0),'med':(1,0,0)}
def vec(d):
    if isinstance(d,str):
        v=np.sum([np.array(DIRS[k],float)*(float(w) if w else 1) for w,k in re.findall(r'([\d.]*)\*?([a-z]+)',d)],axis=0)
    else: v=np.array(d,float)
    return v/np.linalg.norm(v)
def _pts(a,side='r'): return V(a,side) if isinstance(a,str) else np.asarray(a)
def ext(name,d,frac=.02,side='r',where=None):
    v=_pts(name,side)
    if where is not None: v=v[where(v)]
    p=v@vec(d);return v[p>=p.max()-frac*np.ptp(p)].mean(0)
def near(a,b,k=40,side='r'):
    va=_pts(a,side);vb=_pts(b,side);d,i=cKDTree(vb).query(va);o=np.argsort(d)[:k]
    return (va[o].mean(0)+vb[i[o]].mean(0))/2
def snap(name,p,side='r'):
    v=_pts(name,side);return v[cKDTree(v).query(p)[1]]
def mix(p,q,t=.5): return np.array(p)*(1-t)+np.array(q)*t
def off(p,d,mm): return np.array(p)+vec(d)*mm
def cen(name,side='r'): return _pts(name,side).mean(0)
def zband(lo,hi): return lambda v:(v[:,2]>=lo)&(v[:,2]<=hi)
def ins(muscle,which='e',side='r'):
    """centre de la zone d'attache d'un muscle sur l'os : 'o' origine, 'e' terminaison (e1, e2... si plusieurs)"""
    return cen(muscle+'.'+which+side,side)

def simplify(v,t,tgt):
    if tgt<len(t) and len(t)>20:
        v,t=fs.simplify(v.astype(np.float32),t.astype(np.int32),target_count=int(max(tgt,12)))
    return v.astype(np.float32),t.astype(np.int64)
def sub(v,t,mask):
    t=t[mask]
    if not len(t): return v[:0],t
    u,inv=np.unique(t,return_inverse=True);return v[u],inv.reshape(-1,3)

def tube(pts,r,flat=1.,rad=10,up=(0,0,1)):
    pts=np.array(pts,float)
    if len(pts)>2:
        P=np.vstack([pts[0],pts,pts[-1]]);o=[]
        for i in range(1,len(P)-2):
            for s in np.linspace(0,1,8,endpoint=False):
                o.append(.5*((2*P[i])+(-P[i-1]+P[i+1])*s+(2*P[i-1]-5*P[i]+4*P[i+1]-P[i+2])*s*s+(-P[i-1]+3*P[i]-3*P[i+1]+P[i+2])*s**3))
        o.append(pts[-1]);pts=np.array(o)
    else: pts=np.linspace(pts[0],pts[1],8)
    n=len(pts);V_=[];up=np.array(up,float)
    for i in range(n):
        tg=pts[min(i+1,n-1)]-pts[max(i-1,0)];tg/=np.linalg.norm(tg)+1e-9
        s=np.cross(tg,up)
        if np.linalg.norm(s)<1e-3: s=np.cross(tg,[1,0,0])
        s/=np.linalg.norm(s);nn=np.cross(s,tg);rr=r(i/(n-1)) if callable(r) else r
        for j in range(rad):
            a=j/rad*2*np.pi;V_.append(pts[i]+s*np.cos(a)*rr+nn*np.sin(a)*rr*flat)
    T_=[]
    for i in range(n-1):
        for j in range(rad):
            a=i*rad+j;b=i*rad+(j+1)%rad;T_+=[[a,b,a+rad],[b,b+rad,a+rad]]
    return np.array(V_,np.float32),np.array(T_,np.int64)
def blob(p,radii,nu=18,nv=12):
    V_=[];T_=[];rx,ry,rz=radii if np.ndim(radii) else (radii,)*3
    for i in range(nv+1):
        th=np.pi*i/nv
        for j in range(nu):
            ph=2*np.pi*j/nu;V_.append([p[0]+rx*np.sin(th)*np.cos(ph),p[1]+ry*np.sin(th)*np.sin(ph),p[2]+rz*np.cos(th)])
    for i in range(nv):
        for j in range(nu):
            a=i*nu+j;b=i*nu+(j+1)%nu;T_+=[[a,a+nu,b],[b,a+nu,b+nu]]
    return np.array(V_,np.float32),np.array(T_,np.int64)

SKIN=None
def skin_all():
    """peau entière : maillage fermé de BodyParts3D, recalé sur Z-Anatomy (même individu, échelle 1,034)"""
    global SKIN
    if SKIN is None:
        import struct as _s
        D=W+'dl/';nm=dict(l.rstrip('\n').split('\t') for l in open(D+'parts.txt') if '\t' in l);sid=[i for i,n in nm.items() if n=='skin'][0]
        b=open(D+'bp3d/assets/BodyParts3D_data/stl/'+sid+'.stl','rb').read();n=_s.unpack_from('<I',b,80)[0]
        a=np.frombuffer(b,dtype=np.dtype([('n','<f4',3),('v','<f4',(3,3)),('a','<u2')]),count=n,offset=84)
        v=a['v'].reshape(-1,3);u,inv=np.unique(np.round(v,3),axis=0,return_inverse=True);t=inv.reshape(-1,3)[:,::-1].astype(np.int64)
        M=np.load(W+'work/bp2za.npy');v=(np.hstack([u,np.ones((len(u),1))])@M).astype(np.float32)
        SKIN=(v,t)
    return SKIN

class Joint:
    def __init__(s,key,name,sub,cam,dist,view='face'):
        s.key=key;s.S=[];s.M={};s.P=[];s.EX={};s.SYM=[];s.meta={'key':key,'n':name,'sub':sub,'cam':[float(x) for x in cam],'dist':dist,'view':view}
    def add(s,id,label,layer,v,t,color=None,op=None):
        if not any(x['id']==id for x in s.S):
            e={'id':id,'label':label,'layer':layer}
            if color: e['color']=color
            if op is not None: e['op']=op
            s.S.append(e)
        if len(t): s.M.setdefault(id,[]).append((np.asarray(v,np.float32),np.asarray(t,np.int64)))
    def _parts(s,names,side):
        for nm in ([names] if isinstance(names,str) else names):
            for m in load(nm,side): yield m
    def mus(s,id,label,names,side='r',cap=5000,tlabel=None,tp=None):
        """muscle : corps charnu (m-id) et tendons (t-id), séparés d'après les matériaux du modèle"""
        for m in s._parts(names,side):
            ten=np.array([mm=='Tendon' for mm in m['mats']])[m['mi']]
            if tp:                              # tendon non distingué dans le modèle : faces proches de l'attache
                near_=np.zeros(len(m['v']),bool)
                for p_,r_ in tp: near_|=np.linalg.norm(m['v']-np.asarray(p_),axis=1)<r_
                ten|=near_[m['t']].sum(1)>=2
            for mask,pid,lab,lay in ((~ten,'m-'+id,label,'mus'),(ten,'t-'+id,tlabel or 'Tendon : '+label[0].lower()+label[1:],'ten')):
                v,t=sub(m['v'],m['t'],mask)
                if len(t):
                    v,t=simplify(v,t,cap*len(t)/max(len(m['t']),1)+60);s.add(pid,lab,lay,v,t)
    def bone(s,id,label,names,side='r',cap=9000,cart=True,clabel=None):
        """os (id) et son cartilage articulaire (c-id)"""
        for m in s._parts(names,side):
            ca=np.array([mm=='Cartilage' for mm in m['mats']])[m['mi']] if cart else np.zeros(len(m['t']),bool)
            for mask,pid,lab,lay in ((~ca,id,label,'os'),(ca,'c-'+id,clabel or 'Cartilage : '+label[0].lower()+label[1:],'cart')):
                v,t=sub(m['v'],m['t'],mask)
                if len(t):
                    v,t=simplify(v,t,cap*len(t)/max(len(m['t']),1)+40);s.add(pid,lab,lay,v,t)
    def ent(s,id,label,names,side='r'):
        """zone d'attache d'un tendon sur l'os (enthèse), telle que tracée dans le modèle"""
        for nm in ([names] if isinstance(names,str) else names):
            for m in load(nm+side if nm.endswith(('.o','.e')) or re.search(r'\.[oe]\d*$',nm) else nm,side):
                v,t=simplify(m['v'],m['t'],1200);s.add(id,label,'ten',v,t,color='#f3e2b8')
    def real(s,id,label,layer,names,side='r',cap=2500,**k):
        for m in s._parts(names,side):
            v,t=simplify(m['v'],m['t'],cap);s.add(id,label,layer,v,t,**k)
    def tube(s,id,label,layer,pts,r,**k):
        c={x:k.pop(x) for x in ('color','op') if x in k};v,t=tube(pts,r,**k);s.add(id,label,layer,v,t,**c)
    def blob(s,id,label,layer,p,radii,**k):
        v,t=blob(p,radii);s.add(id,label,layer,v,t,**k)
    def skin(s,centers,R,cap=9000):
        v,t=skin_all();m=np.zeros(len(v),bool)
        for c in centers: m|=np.linalg.norm(v-np.asarray(c),axis=1)<R
        v2,t2=sub(v,t,m[t].all(1));v2,t2=simplify(v2,t2,cap);s.add('peau','Peau','peau',v2,t2)
    def ex(s,id,n,d,q): s.EX[id]={'n':n,'d':d,'q':q}
    def sym(s,id,g,t): s.SYM.append({'id':id,'g':g,'t':t})
    def patho(s,id,n,ns,pop,who,pain,txt,ex,warn,zones,foc,skin=None,al=None,view=None,tags=()):
        ids={x['id'] for x in s.S}
        miss=[z for z in zones if z not in ids]
        if miss: print('!! zone absente',s.key,id,miss,file=sys.stderr)
        zones=[z for z in zones if z in ids]
        for e in ex:
            if e not in s.EX: raise KeyError(s.key+' '+id+' ex '+e)
        sy={x['id'] for x in s.SYM}
        for tg in tags:
            if tg not in sy: raise KeyError(s.key+' '+id+' tag '+tg)
        f=lambda L:[[round(float(c),1) for c in p]+[r] for p,r in (L or [])]
        d={'id':id,'n':n,'ns':ns,'pop':pop,'who':who,'pain':pain,'txt':txt,'ex':ex,'warn':warn,'zones':zones,'foc':f(foc),'skin':f(skin if skin is not None else [(p,r*1.9) for p,r in foc[:1]]),'tags':list(tags)}
        if al: d['al']=al
        if view: d['view']=view
        s.P.append(d)
    def write(s,n=12):
        meshes=[];blobb=b''
        for id,L in s.M.items():
            cur=[];ct=[];nv=0
            def flush():
                nonlocal blobb
                if not cur: return
                v=np.concatenate(cur);t=np.concatenate(ct);used=np.unique(t);rm=np.full(len(v),-1);rm[used]=np.arange(len(used));v=v[used];t=rm[t]
                b=v.min(0);sc=np.maximum(np.ptp(v,axis=0),1e-6)/65534;q=np.round((v-b)/sc-32767).astype('<i2')
                o=len(blobb);blobb+=q.tobytes();blobb+=b'\0'*((-len(blobb))%4);blobb+=t.astype('<u2').tobytes();blobb+=b'\0'*((-len(blobb))%4)
                meshes.append({'id':id,'o':o,'nv':len(v),'ni':int(t.size),'b':[float(x) for x in (b+32767*sc)],'s':[float(x) for x in sc]})
            for v,t in L:
                if nv+len(v)>60000: flush();cur=[];ct=[];nv=0
                cur.append(v);ct.append(t+nv);nv+=len(v)
            flush()
        s.P.sort(key=lambda p:-p['pop'])
        assert len(s.P)==n,(s.key,len(s.P))
        untag=[p['id'] for p in s.P if s.SYM and not p['tags']]
        if untag: print('!! sans réponse associée',s.key,untag,file=sys.stderr)
        h=json.dumps({'j':s.meta,'s':s.S,'m':meshes,'p':s.P,'ex':s.EX,'sym':s.SYM},separators=(',',':'),ensure_ascii=False).encode()
        h+=b' '*((-len(h))%4);out=struct.pack('<I',len(h))+h+blobb
        open(W+'work/site/j-'+s.key+'.b64.txt','w').write(base64.b64encode(out).decode())
        tri={}
        for id,L in s.M.items(): tri[id]=sum(len(t) for _,t in L)
        print(s.key,'structures',len(s.S),'tris',sum(tri.values()),'bytes',len(out),'| plus gros :',sorted(tri.items(),key=lambda x:-x[1])[:4],file=sys.stderr)

import ast
def old_texts(key):
    """textes des fiches et des exercices, repris des fichiers d'articulation précédents"""
    tree=ast.parse(open(W+'work/joints/%s.py'%key,encoding='utf8').read());T={};EX={}
    for nd in ast.walk(tree):
        if isinstance(nd,ast.Call) and isinstance(nd.func,ast.Name):
            if nd.func.id=='P' and len(nd.args)>=9:
                a=[ast.literal_eval(x) for x in nd.args[:9]];kw={k.arg:ast.literal_eval(k.value) for k in nd.keywords if k.arg in('al','view')}
                T[a[0]]=dict(n=a[1],ns=a[2],pop=a[3],who=a[4],pain=a[5],txt=a[6],ex=a[7],warn=a[8],**kw)
            if nd.func.id=='E_' and len(nd.args)==4:
                a=[ast.literal_eval(x) for x in nd.args];EX[a[0]]={'n':a[1],'d':a[2],'q':a[3]}
    return T,EX
def _use(s,key=None):
    s.T,ex=old_texts(key or s.key);s.EX.update(ex)
def _p(s,id,zones,foc,skin=None,tags=(),view=None,**over):
    d=dict(s.T[id]);d.update(over);v=view or d.pop('view',None);d.pop('view',None)
    s.patho(id,d['n'],d['ns'],d['pop'],d['who'],d['pain'],d['txt'],d['ex'],d['warn'],zones,foc,skin,al=d.get('al'),view=v,tags=tags)
Joint.use=_use;Joint.p=_p
def has(name,side='r'):
    try: find(name,side);return True
    except KeyError: return False

def I_(muscle,which='e',fallback=None,side='r'):
    """zone d'attache si elle existe dans le modèle, sinon point de repli"""
    for w in (which,which+'1'):
        if (muscle+'.'+w+side) in BYN: return cen(muscle+'.'+w+side,side)
    if fallback is None: raise KeyError('attache absente : '+muscle+' '+which)
    print('   (repli pour',muscle,which,')',file=sys.stderr);return np.asarray(fallback,float)
