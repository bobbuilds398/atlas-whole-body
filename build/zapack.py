"""Modèle allégé du corps entier (squelette, disques, peau) à partir de Z-Anatomy, et repères des articulations."""
from zalib import *
def group(n):
    side='d' if n.endswith('.r') else 'g' if n.endswith('.l') else ''
    s=lambda k:k+('-'+side if side else '')
    if re.search(r'tooth|incisor|canine|premolar|molar|Arytenoid|Corniculate|Cricoid|Thyroid|nasal septal|alar cartilage|Incus|Malleus|Stapes|Sinus|cells of ethmoid|\.g$|Triradiate',n): return None
    if n.startswith('Intervertebral disc'): return 'disques'
    if re.search(r'Vertebra C|Atlas|Axis',n): return 'cou'
    if 'Vertebra L' in n: return 'lombaire'
    if re.search(r'Vertebra T| rib|Costal cartilage|sternum|Xiphoid',n): return 'thorax'
    if re.search(r'Sacrum|Coccyx',n): return 'sacrum'
    if 'Hip bone' in n: return s('iliaque')
    if re.search(r'Clavicle|Scapula',n): return s('epaule')
    if 'Humerus' in n: return s('humerus')
    if re.search(r'Radius|Ulna',n): return s('avantbras')
    if re.search(r'of hand|metacarpal|Capitate|Hamate|Lunate|Pisiform|Scaphoid|Trapezium|Trapezoid|Triquetrum',n): return s('main')
    if 'Femur' in n: return s('femur')
    if 'Patella' in n: return s('rotule')
    if re.search(r'Tibia|Fibula',n): return s('jambe')
    if re.search(r'of foot|metatarsal|Calcaneus|Talus|Cuboid|cuneiform|Navicular|Sesamoid',n): return s('pied')
    return 'tete'
G={};tot=0
for x in INDEX:
    c=COLL(x)
    if not (c.startswith('1:') or x['name'].startswith('Intervertebral disc')): continue
    g=group(x['name'])
    if g is None: continue
    for m in load(x['name'],smooth=True):
        v,t=m['v'],m['t'];e=np.ptp(v,axis=0);area=float(np.sort(e)[1:].prod())
        tgt=max(60,area/20)
        if g.startswith(('main','pied')): tgt=min(tgt,90)
        if g=='tete': tgt=min(tgt,900)
        v,t=simplify(v,t,min(tgt,2600));G.setdefault(g,[]).append((v,t));tot+=len(t)
sv,st=skin_all();sv,st=simplify(sv,st,30000);G['peau']=[(sv,st)]
print('os',tot,'peau',len(st),file=sys.stderr)
allv=np.concatenate([v for k,L in G.items() if k!='peau' for v,_ in L]);print('bornes',allv.min(0),allv.max(0),file=sys.stderr)
meshes=[];blobb=b''
for g,L in sorted(G.items()):
    cur=[];ct=[];nv=0
    def flush():
        global blobb
        if not cur: return
        v=np.concatenate(cur);t=np.concatenate(ct);b=v.min(0);s=np.maximum(np.ptp(v,axis=0),1e-6)/65534
        q=np.round((v-b)/s-32767).astype('<i2');o=len(blobb);blobb+=q.tobytes();blobb+=b'\0'*((-len(blobb))%4);blobb+=t.astype('<u2').tobytes();blobb+=b'\0'*((-len(blobb))%4)
        meshes.append({'id':g,'o':o,'nv':len(v),'ni':int(t.size),'b':[float(x) for x in (b+32767*s)],'s':[float(x) for x in s]})
    for v,t in L:
        if nv+len(v)>60000: flush();cur=[];ct=[];nv=0
        cur.append(v);ct.append(t+nv);nv+=len(v)
    flush()
htop=V('Humerus')[:,2].max();fem=V('Femur');top=fem[fem[:,2]>fem[:,2].max()-55]
A={'lombaire':mix(cen('Vertebra L4'),cen('Vertebra L5')),'cou':cen('Vertebra C5'),
 'epaule':ext('Humerus','up',frac=.04),'capsule':ext('Humerus','up',frac=.04)+np.array([14,-12,-28.]),'coude':ext('Humerus','down',frac=.04),
 'poignet':cen('Capitate bone'),'pouce':cen('First metacarpal bone'),'main':mix(cen('Middle phalanx of second finger of hand'),cen('Middle phalanx of fourth finger of hand')),
 'hanche':top[np.argsort(top[:,0])[-60:]].mean(0),'genou':cen('Patella'),'genou-art':near('Femur','Tibia',k=200),
 'cheville':cen('Talus'),'talon':cen('Calcaneus'),'hallux':near('First metatarsal bone','Proximal phalanx of first finger of foot')}
A={k:[round(float(x),1) for x in v] for k,v in A.items()}
zmax=float(allv[:,2].max())
json.dump({'anch':A,'h':zmax},open(W+'work/anch.json','w'))
h=json.dumps({'m':meshes},separators=(',',':')).encode();h+=b' '*((-len(h))%4)
out=struct.pack('<I',len(h))+h+blobb
open(W+'work/site/body.b64.txt','w').write(base64.b64encode(out).decode())
print(len(out),A,zmax,file=sys.stderr)
