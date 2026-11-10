/* Atlas du corps — vue corps entier et vues d'articulation.
   Les textes (fiches, exercices, questions, chiffres) sont dans content/*.json ; la géométrie et le placement des douleurs dans models/*.b64.txt.
   La hanche a son propre moteur : js/hip.js. Voir CONTRIBUTING.md. */
fetch('content/corps.json').then(function(r){if(!r.ok)throw new Error('content/corps.json : '+r.status);return r.json()}).then(function(CONTENT){'use strict';
const T=THREE,$=id=>document.getElementById(id);
const REPO='https://github.com/bobbuilds398/atlas-whole-body';
const SRC={};Object.keys(CONTENT.sources).forEach(k=>SRC[k]={t:CONTENT.sources[k].title,u:CONTENT.sources[k].url});
const JOINTS={};Object.keys(CONTENT.joints).forEach(k=>{const j=CONTENT.joints[k];JOINTS[k]={n:j.name,a:j.anchor,g:j.bones}});
/* repères en millimètres (x vers la gauche du sujet, y vers l'arrière, z vers le haut) */
const ANCH=CONTENT.anchors;
const HOME_P=CONTENT.pathologies.filter(p=>JOINTS[p.joint]&&SRC[p.source]&&ANCH[p.anchor]).map(p=>({id:p.id,j:p.joint,a:p.anchor,g:p.bones||[],r:p.radius||.5,v:+p.per100,label:p.display,src:p.source,n:p.name,ns:p.commonName,al:p.alias,base:p.basis,pain:p.whatYouFeel||'',hip:p.hipId}));
HOME_P.sort((a,b)=>b.v-a.v);
const FIG={};HOME_P.forEach(p=>FIG[p.id]=p);
const fr=v=>v.toLocaleString('fr-FR');
const share=p=>p.label||(p.v<1?'environ '+Math.round(p.v*10)+' sur 1 000':fr(p.v)+' sur 100');
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const getJSON=f=>fetch(f).then(r=>{if(!r.ok)throw new Error(f+' : '+r.status);return r.json()});
const issueUrl=(art,fiche)=>REPO+'/issues/new?template=correction.yml&title='+encodeURIComponent('Correction : '+fiche+' ('+art+')')+'&articulation='+encodeURIComponent(art)+'&fiche='+encodeURIComponent(fiche);
const fixLink=(art,fiche)=>'<p class="fix">Une erreur, une précision, une meilleure vidéo ? <a href="'+issueUrl(art,fiche)+'" target="_blank" rel="noopener">Proposer une correction pour cette fiche</a></p>';
const rankCol=i=>'hsl('+(6+i*3.6).toFixed(0)+',94%,'+(56+i*.6).toFixed(0)+'%)';

/* ===== Scène ===== */
const cv=$('b-cv'),view=$('b-view'),tip=$('b-tip'),pinsEl=$('b-pins'),root=$('bodyview');
const ren=new T.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
ren.setPixelRatio(Math.min(window.devicePixelRatio||1,2));ren.setClearColor(0,0);
const scene=new T.Scene(),cam=new T.PerspectiveCamera(30,1,.05,200);
scene.add(new T.HemisphereLight(0xe3ecff,0x2a201b,.75));
[[0xfff1dd,.7,-6,12,14],[0x7fb7ff,.4,10,6,-10],[0xffffff,.2,-8,2,4],[0xdfe8ff,.35,2,-12,3]].forEach(l=>{const d=new T.DirectionalLight(l[0],l[1]);d.position.set(l[2],l[3],l[4]);scene.add(d)});
const ctl=new T.OrbitControls(cam,cv);ctl.enableDamping=true;ctl.dampingFactor=.09;ctl.enablePan=false;ctl.minDistance=1.2;ctl.maxDistance=70;
const P3=a=>new T.Vector3(a[0]*.01,a[2]*.01,-a[1]*.01);
const A3={};Object.keys(ANCH).forEach(k=>A3[k]=P3(ANCH[k]));
const HOME={t:new T.Vector3(0,8.15,0),o:new T.Vector3(-7,2.5,36.5)};
let tw=null,aspectK=1;
function fly(t,o){tw={t0:performance.now(),dur:900,t1:t.clone(),o1:o.clone(),ta:ctl.target.clone(),oa:cam.position.clone().sub(ctl.target)}}
const homeO=()=>HOME.o.clone().multiplyScalar(aspectK);
ctl.addEventListener('start',()=>{tw=null});
function fit(){const w=view.clientWidth,h=view.clientHeight;if(!w||!h)return;ren.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();aspectK=Math.max(1,.62/cam.aspect)}
new ResizeObserver(fit).observe(view);fit();
ctl.target.copy(HOME.t);cam.position.copy(HOME.t).add(homeO());

/* ===== Structures : os du corps entier (toujours présents) et structures de l'articulation ouverte ===== */
const LAYERS={os:{n:'Os',c:'#e4d9bd',op:1},cart:{n:'Cartilages, disques, bourses',c:'#7cc7e3',op:.7},lig:{n:'Ligaments',c:'#d8b45a',op:.85},ten:{n:'Tendons',c:'#efe4c8',op:.95},mus:{n:'Muscles',c:'#c0665b',op:.34},nerf:{n:'Nerfs',c:'#f2d94e',op:.95},peau:{n:'Peau',c:'#9fc4dc',op:.1}};
const LV={os:true,cart:true,lig:true,ten:true,mus:true,nerf:true,peau:true};
const S={},hot=new T.Color('#ff6a3d'),COOL=new T.Color('#7cc7e3');
let skin=null;
function struct(id,label,layer,color,op,jk){
  const L=LAYERS[layer],soft=layer==='mus'||layer==='peau';
  return S[id]=S[id]||{id,label,layer,jk,base:new T.Color(color||L.c),op:op==null?L.op:op,k:0,meshes:[],painted:false,
    mat:new T.MeshStandardMaterial({color:0xffffff,vertexColors:true,roughness:.62,metalness:.02,transparent:layer!=='os',depthWrite:layer!=='peau',side:soft?T.FrontSide:T.DoubleSide})}}
function decode(buf,each){
  const jl=new DataView(buf).getUint32(0,true),h=JSON.parse(new TextDecoder().decode(new Uint8Array(buf,4,jl))),base=4+jl;
  h.m.forEach(m=>{const q=new Int16Array(buf,base+m.o,m.nv*3),p=new Float32Array(m.nv*3);
    for(let i=0;i<m.nv;i++){const x=m.b[0]+q[i*3]*m.s[0],y=m.b[1]+q[i*3+1]*m.s[1],z=m.b[2]+q[i*3+2]*m.s[2];p[i*3]=x*.01;p[i*3+1]=z*.01;p[i*3+2]=-y*.01}
    const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(p,3));
    const src=new Uint16Array(buf,base+m.o+((m.nv*6+3)&~3),m.ni),ix=new Uint16Array(m.ni);
    ix.set(src);
    g.setIndex(new T.BufferAttribute(ix,1));g.computeVertexNormals();each(m.id,g)});
  return h}
function addMesh(s,g){const n=g.attributes.position.count,c=new Float32Array(n*3);
  for(let i=0;i<n;i++){c[i*3]=s.base.r;c[i*3+1]=s.base.g;c[i*3+2]=s.base.b}
  g.setAttribute('color',new T.BufferAttribute(c,3));const me=new T.Mesh(g,s.mat);me.userData.s=s;scene.add(me);s.meshes.push(me);
  if(s.layer==='peau'){me.renderOrder=2;g.setAttribute('w',new T.BufferAttribute(new Float32Array(n),1));
    s.veil=s.veil||new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.FrontSide,uniforms:{c:{value:new T.Color('#ff6a3d')},a:{value:0}},
      vertexShader:'attribute float w;varying float vw;void main(){vw=w;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader:'uniform vec3 c;uniform float a;varying float vw;void main(){if(vw<.02)discard;gl_FragColor=vec4(c,vw*a);}'});
    const ov=new T.Mesh(g,s.veil);ov.renderOrder=4;ov.visible=false;scene.add(ov);(s.over=s.over||[]).push(ov)}}
const b64=t=>{const s=atob(t.trim()),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u.buffer};
const getFile=f=>fetch(f).then(r=>{if(!r.ok)throw 0;return r.text()}).then(b64);
getFile('models/body.b64.txt').then(buf=>{decode(buf,(id,g)=>{
    if(id==='peau'){skin=new T.Mesh(g,new T.MeshStandardMaterial({color:'#9fc4dc',roughness:.9,transparent:true,opacity:.1,depthWrite:false,side:T.FrontSide}));skin.renderOrder=2;scene.add(skin);return}
    const disc=id==='disques';addMesh(struct('os:'+id,disc?'Disques intervertébraux':'Os',disc?'cart':'os',null,disc?1:null,null),g)});
  $('b-load').hidden=true;repaint()})
 .catch(()=>{$('b-load').textContent='Le squelette n’a pas pu être chargé. Les repères numérotés et les fiches restent utilisables.'});

/* halo de la zone, vue corps entier */
const glow=new T.Mesh(new T.SphereGeometry(1,32,20),new T.MeshBasicMaterial({color:hot,transparent:true,opacity:0,depthTest:false,blending:T.AdditiveBlending}));
glow.renderOrder=3;scene.add(glow);let glowK=0;

/* ===== État ===== */
let hov=null,pinned=null,joint=null,data=null,items=[],BY={};
const DATA={},SEL=new Set();let hipOpen=false;
const cur=()=>hov||pinned;
const jointOfGroup=g=>{const b=g.replace(/^os:/,'').replace(/-[dg]$/,'');return Object.keys(JOINTS).find(k=>JOINTS[k].g.includes(b))||null};
const inZone=(p,s)=>!!p&&!!p.zones&&p.zones.includes(s.id);

/* ----- zone douloureuse : poids par sommet autour des foyers, sur les structures en cause ----- */
function paintStruct(s,p){
  const sk=s.layer==='peau',on=sk?!!(p&&p.skin&&p.skin.length):inZone(p,s);if(!on&&!s.painted)return;
  s.painted=on;const F=on?(sk?p.skin:p.foc).map(f=>[f[0]*.01,f[2]*.01,-f[1]*.01,f[3]*.01]):[],hc=p?p.hex:hot,floor=sk?0:(s.layer==='mus'?.3:s.layer==='os'?.1:.26);
  if(sk&&p)s.veil.uniforms.c.value.copy(p.hex);
  s.meshes.forEach(me=>{const g=me.geometry,pos=g.attributes.position.array,n=pos.length/3,col=g.attributes.color,c=col.array,wa=sk?g.attributes.w:null;
    for(let i=0;i<n;i++){let w=0;
      if(on){w=floor;const x=pos[i*3],y=pos[i*3+1],z=pos[i*3+2];
        for(let k=0;k<F.length;k++){const f=F[k],dx=x-f[0],dy=y-f[1],dz=z-f[2],d=Math.sqrt(dx*dx+dy*dy+dz*dz)/f[3];if(d<1){const u=1-d,v=u*u*(3-2*u);if(v>w)w=v}}}
      if(sk)wa.array[i]=w;else{c[i*3]=s.base.r+(hc.r-s.base.r)*w;c[i*3+1]=s.base.g+(hc.g-s.base.g)*w;c[i*3+2]=s.base.b+(hc.b-s.base.b)*w}}
    if(sk)wa.needsUpdate=true;else col.needsUpdate=true})}
let paintedFor=null;
function repaint(){const p=joint&&data?BY[cur()]:null;if(p===paintedFor)return;paintedFor=p;
  Object.values(S).forEach(s=>paintStruct(s,p))}

/* ----- liste et repères ----- */
const listEl=$('b-list');
function buildList(){listEl.innerHTML='';pinsEl.innerHTML='';BY={};SEL.clear();
  items=joint&&data?data.p:(joint?[]:HOME_P);
  const vmax=items.length?(joint?100:items[0].v):1;
  items.forEach((p,i)=>{p.rank=i+1;p.col=rankCol(i);p.hex=new T.Color().setStyle(p.col);BY[p.id]=p;
    if(joint){const c=new T.Vector3();p.foc.forEach(f=>c.add(P3(f)));c.multiplyScalar(1/p.foc.length);let sp=0;p.foc.forEach(f=>{sp=Math.max(sp,P3(f).distanceTo(c)+f[3]*.01)});p.pos=c;p.span=sp}else p.pos=A3[p.a];
    const li=document.createElement('li'),b=document.createElement('button');b.type='button';b.className='item';b.style.setProperty('--c',p.col);
    const f=FIG[p.id],sub=joint?(f?'<b>'+share(f)+'</b> · '+esc(p.n):esc(p.n)):JOINTS[p.j].n+' · <b>'+share(p)+'</b>';
    if(joint)b.title='Indice de fréquence relative dans cette articulation : '+p.pop+' sur 100';
    b.innerHTML='<span class="rk"><i></i>'+p.rank+'</span><span class="nm">'+esc(p.ns)+'</span><span class="jl">'+sub+'</span><span class="bar"><b style="width:'+Math.max(1.5,(joint?p.pop:p.v)/vmax*100).toFixed(1)+'%"></b></span>';
    b.onmouseenter=()=>setHover(p.id);b.onmouseleave=()=>setHover(null);b.onfocus=()=>setHover(p.id);b.onblur=()=>setHover(null);b.onclick=()=>select(p.id);
    li.appendChild(b);listEl.appendChild(li);p.el=b;p.li=li;
    const pn=document.createElement('button');pn.type='button';pn.className='pin';pn.style.setProperty('--c',p.col);pn.textContent=p.rank;pn.setAttribute('aria-label',p.ns);
    pn.onmouseenter=()=>setHover(p.id);pn.onmouseleave=()=>setHover(null);pn.onclick=()=>select(p.id);pinsEl.appendChild(pn);p.pin=pn})}

/* ----- questions : où, quand et comment ----- */
function buildAsk(){const q=$('b-q'),ok=!!(joint&&data&&data.sym&&data.sym.length);q.hidden=!ok;$('b-tw').innerHTML='';$('b-tq').innerHTML='';$('b-sres').textContent='';if(!ok)return;
  data.sym.forEach(s=>{const b=document.createElement('button');b.type='button';b.className='chip';b.setAttribute('aria-pressed','false');b.textContent=s.t;
    b.onclick=()=>{SEL.has(s.id)?SEL.delete(s.id):SEL.add(s.id);b.setAttribute('aria-pressed',String(SEL.has(s.id)));reorder()};$(s.g==='w'?'b-tw':'b-tq').appendChild(b)})}
function reorder(){const sc=p=>(p.tags||[]).filter(t=>SEL.has(t)).length,arr=items.slice().sort((a,b)=>sc(b)-sc(a)||a.rank-b.rank);
  arr.forEach(p=>{listEl.appendChild(p.li);p.el.classList.toggle('dim',SEL.size>0&&!sc(p))});
  const n=arr.filter(p=>sc(p)).length;$('b-sres').textContent=SEL.size?(n?n+' douleur'+(n>1?'s':'')+' correspond'+(n>1?'ent':'')+', classée'+(n>1?'s':'')+' en tête de liste.':'Aucune douleur de la liste ne correspond à ces réponses.'):''}

/* ----- articulations et couches ----- */
const jEl=$('b-joints'),lEl=$('b-layers');
function chip(el,label,fn,col){const b=document.createElement('button');b.type='button';b.className='chip';b.style.setProperty('--c',col||'var(--cool)');b.innerHTML='<i></i>'+label;b.onclick=()=>fn(b);el.appendChild(b);return b}
chip(jEl,'Corps entier',()=>{if(hipOpen)window.openBody();leave()}).dataset.j='';
Object.keys(JOINTS).forEach(k=>{chip(jEl,JOINTS[k].n,()=>{if(k==='hanche'){window.openHip();return}if(hipOpen)window.openBody();enter(k)}).dataset.j=k});
Object.keys(LAYERS).forEach(k=>{chip(lEl,LAYERS[k].n,b=>{LV[k]=!LV[k];b.setAttribute('aria-pressed',String(LV[k]))},LAYERS[k].c).setAttribute('aria-pressed','true')});

const VIEWS={face:[-.25,.12,1],cote:[-1,.1,.25],dos:[.25,.12,-1],dedans:[1,.1,.3],dessous:[-.2,-1,.35],dessus:[-.15,1,.3]};
function flyTo(p){const d=Math.max(data.j.dist*.01,p?p.span*4.4:0)*Math.max(1,aspectK*.8),v=VIEWS[p&&p.view||data.j.view||'face'];
  fly(p?p.pos:P3(data.j.cam),new T.Vector3(v[0],v[1],v[2]).normalize().multiplyScalar(d))}
function setHover(id){hov=id;sync();repaint();panel()}
function select(id){const p=BY[id];if(!joint){if(p.hip){window.openHip(p.hip);return}enter(p.j,id);return}
  pinned=id;hov=null;sync();repaint();panel();flyTo(p)}
function load(j){if(DATA[j])return Promise.resolve(DATA[j]);
  return Promise.all([getFile('models/'+j+'.b64.txt'),getJSON('content/'+j+'.json')]).then(r=>{
    const buf=r[0],C=r[1],jl=new DataView(buf).getUint32(0,true),h=JSON.parse(new TextDecoder().decode(new Uint8Array(buf,4,jl))),map={},geo={},names=C.structures||{};
    h.s.forEach(d=>{d.label=names[d.id]||d.id;map[d.id]=d});
    decode(buf,(id,g)=>{const d=map[id];addMesh(struct(j+':'+id,d.label,d.layer,d.color,d.op,j),g)});
    h.p.forEach(p=>geo[p.id]=p);
    /* fusion : textes de content/<articulation>.json, placement du modèle */
    h.j.n=C.joint.name;h.j.sub=C.joint.subtitle;
    h.ex={};Object.keys(C.exercises||{}).forEach(k=>{const e=C.exercises[k];h.ex[k]={n:e.name,d:e.how,q:e.videoSearch||e.name,video:e.video||''}});
    h.sym=(C.questions||[]).map(q=>({id:q.id,g:q.group==='where'?'w':'q',t:q.text}));
    h.p=(C.pathologies||[]).filter(c=>{if(!geo[c.id])console.warn('Fiche sans placement dans le modèle, ignorée : '+j+'/'+c.id);return !!geo[c.id]}).map(c=>{const g=geo[c.id];
      return {id:c.id,j:j,n:c.name,ns:c.commonName,al:c.alias,pop:+c.frequency||0,who:c.whoIsAffected,pain:c.whatYouFeel,txt:c.whatHappens,warn:c.warning,
        ex:(c.exercises||[]).filter(k=>h.ex[k]),tags:c.answers||[],zones:g.zones.map(z=>j+':'+z),foc:g.foc,skin:g.skin,view:g.view}});
    h.p.sort((a,b)=>b.pop-a.pop);
    return DATA[j]=h})}
function enter(j,pid){if(j==='hanche'){window.openHip();return}
  joint=j;data=null;pinned=null;hov=null;paintedFor=undefined;buildList();buildAsk();sync();panel();
  fly(A3[JOINTS[j].a],new T.Vector3(-.3,.12,1).normalize().multiplyScalar(7*Math.max(1,aspectK*.8)));
  load(j).then(h=>{if(joint!==j)return;data=h;buildList();buildAsk();pinned=pid&&BY[pid]?pid:items[0].id;sync();repaint();panel();flyTo(BY[pinned])},
    ()=>{if(joint===j)$('b-detail').innerHTML='<h2>Vue indisponible</h2><p>Les structures de cette articulation n’ont pas pu être chargées. Vérifiez la connexion puis réessayez.</p>'})}
function leave(){joint=null;data=null;pinned=null;hov=null;buildList();buildAsk();fly(HOME.t,homeO());sync();repaint();panel()}
function sync(){const c=cur();
  items.forEach(p=>{p.el.classList.toggle('on',p.id===pinned);p.el.classList.toggle('hov',p.id===hov);
    p.pin.classList.toggle('on',p.id===pinned);p.pin.classList.toggle('hov',p.id===hov);p.pin.classList.toggle('occ',!!c&&c!==p.id)});
  jEl.querySelectorAll('.chip').forEach(b=>b.setAttribute('aria-pressed',String(hipOpen?b.dataset.j==='hanche':(b.dataset.j||null)===joint)));
  $('g-sub').textContent=hipOpen?'Hanche droite · 13 douleurs fréquentes · faites glisser pour tourner, molette pour zoomer':joint?(data?data.j.sub+' · '+items.length+' douleurs fréquentes · faites glisser pour tourner, molette pour zoomer':JOINTS[joint].n):'Squelette entier vu de face · les douleurs les plus fréquentes, classées par nombre de personnes concernées';
  lEl.hidden=!joint;
  $('b-lh').textContent=joint?JOINTS[joint].n+(data?' · '+items.length+' douleurs fréquentes':''):'Douleurs les plus fréquentes';
  $('b-ln').textContent=joint?'Du plus courant au plus rare. Classement indicatif, il varie selon l’âge et l’activité.':'Toutes articulations confondues, classées par nombre de personnes concernées sur 100.';
  $('b-hint').textContent=joint?'Survolez une structure ou un numéro pour voir la zone douloureuse, cliquez pour afficher les exercices.':'Survolez un numéro ou une ligne pour voir la zone, cliquez pour ouvrir l’articulation.'}

/* ----- fiche ----- */
const YT='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23 12s0-3.6-.5-5.3a2.8 2.8 0 0 0-2-2C18.800 4.200 12 4.200 12 4.200s-6.800 0-8.500.5a2.800 2.800 0 0 0-2 2C1 8.400 1 12 1 12s0 3.600.5 5.300a2.800 2.800 0 0 0 2 2c1.700.5 8.500.5 8.500.5s6.800 0 8.500-.5a2.800 2.800 0 0 0 2-2C23 15.600 23 12 23 12zM9.800 15.500v-7l6 3.500z"/></svg>';
const srcLink=k=>'<a class="yt" href="'+SRC[k].u+'" target="_blank" rel="noopener">'+esc(SRC[k].t)+'</a>';
function figure(f,col){return '<div class="fig" style="--c:'+col+'"><strong>'+share(f)+'</strong><span>personnes concernées</span><p>'+esc(f.base)+'</p><p>Source : '+srcLink(f.src)+'</p></div>'}
function homeCard(p){
  let h='<span class="tag" style="--c:'+p.col+'"><i></i>N° '+p.rank+' · '+JOINTS[p.j].n+'</span><h2>'+esc(p.ns)+'</h2><p class="alias">'+esc(p.al||p.n)+'</p>'+figure(p,p.col);
  if(p.hip)return h+'<p>La hanche dispose de son atlas : 13 douleurs, les muscles, tendons et cartilages en 3D, et des exercices par phase.</p><button type="button" class="open" id="b-open">Ouvrir l’atlas de la hanche</button>';
  return h+'<h3>Ce que l’on ressent</h3><p>'+esc(p.pain)+'</p><p class="ns">Cliquez pour ouvrir l’articulation : structures en cause, zone douloureuse et exercices.</p>'+fixLink(JOINTS[p.j].n,p.n)}
function jointCard(p){
  let h='<span class="tag" style="--c:'+p.col+'"><i></i>N° '+p.rank+' · '+JOINTS[p.j].n+' · fréquence '+p.pop+'/100</span><h2>'+esc(p.ns)+'</h2><p class="alias">'+esc(p.n)+(p.al?' · '+esc(p.al):'')+'</p>';
  if(FIG[p.id])h+=figure(FIG[p.id],p.col);
  h+='<div class="chips" style="--c:'+p.col+'">'+p.zones.map(z=>S[z]?'<span class="zc">'+esc(S[z].label)+'</span>':'').join('')+'</div>';
  h+='<h3>Ce que l’on ressent</h3><p>'+esc(p.pain)+'</p><h3>Ce qui se passe</h3><p>'+esc(p.txt)+'</p><h3>Qui est concerné</h3><p>'+esc(p.who)+'</p>';
  h+='<h3>Exercices</h3><div class="rule">Repère : une gêne jusqu’à 3 ou 4 sur 10 pendant l’exercice est acceptable si elle retombe dans les 24 heures. Au-delà, réduisez.</div>';
  p.ex.forEach(k=>{const e=data.ex[k];h+='<div class="ex"><h4>'+esc(e.n)+'</h4><p>'+esc(e.d)+'</p>'+(/^https:\/\//.test(e.video)?'<a class="yt" href="'+esc(e.video).replace(/"/g,'&quot;')+'" target="_blank" rel="noopener">'+YT+'Voir la vidéo</a>':'<a class="yt" href="https://www.youtube.com/results?search_query='+encodeURIComponent(e.q)+'" target="_blank" rel="noopener">'+YT+'Chercher une vidéo</a>')+'</div>'});
  return h+'<p class="warn">'+esc(p.warn)+'</p>'+fixLink(JOINTS[p.j].n,p.n)}
function rest(){return '<span class="tag" style="--c:var(--cool)"><i></i>Corps entier</span><h2>Où a-t-on mal le plus souvent ?</h2>'+
  '<p>'+HOME_P.length+' douleurs fréquentes des articulations et du dos, classées par nombre de personnes concernées. Chaque numéro sur le squelette correspond à une ligne de la liste.</p>'+
  '<ol class="steps"><li>Survolez une ligne ou un numéro pour voir la zone et le chiffre.</li><li>Cliquez pour ouvrir l’articulation : 12 douleurs, muscles, tendons et ligaments, zone douloureuse détaillée, exercices.</li><li>Les boutons du haut ouvrent directement une articulation.</li></ol>'+
  '<h3>Comment lire les chiffres</h3><p>Chaque chiffre vient d’une étude publiée, citée dans la fiche. Les études ne mesurent pas toutes la même chose : à un instant donné, sur un an, au cours de la vie, ou sur une tranche d’âge. Le classement donne un ordre de grandeur et la base est indiquée à chaque fois.</p>'}
function panel(){const d=$('b-detail'),id=cur();
  if(joint&&!data){d.innerHTML='<span class="tag" style="--c:var(--cool)"><i></i>'+JOINTS[joint].n+'</span><h2>Chargement de l’articulation…</h2><p class="ns">Muscles, tendons et ligaments arrivent.</p>';return}
  d.innerHTML=id&&BY[id]?(joint?jointCard(BY[id]):homeCard(BY[id])):rest();
  const o=$('b-open');if(o)o.onclick=()=>window.openHip(BY[id].hip)}

/* ===== Souris ===== */
const ray=new T.Raycaster(),pt=new T.Vector2();
const involved=s=>items.filter(p=>inZone(p,s));
function pick(e){const r=cv.getBoundingClientRect();pt.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pt,cam);
  const ms=Object.values(S).filter(s=>joint&&data?s.jk===joint:!s.jk).flatMap(s=>s.meshes).filter(m=>m.visible&&m.material.opacity>.1);
  const hits=ray.intersectObjects(ms,false);if(!hits.length)return null;
  if(!joint||!data)return hits[0].object.userData.s;
  const h=hits.find(x=>involved(x.object.userData.s).length&&x.object.userData.s.layer!=='os')||hits.find(x=>involved(x.object.userData.s).length)||hits.find(x=>x.object.material.opacity>.5)||hits[0];
  return h.object.userData.s}
let hs=null,down=null;
cv.addEventListener('pointermove',e=>{if(e.buttons)return;const s=pick(e);hs=s;
  if(!s){tip.hidden=true;cv.style.cursor='';if(joint&&hov){setHover(null)}return}
  const r=view.getBoundingClientRect();let html,clickable;
  if(joint&&data){const l=involved(s);clickable=l.length>0;html='<b>'+esc(s.label)+'</b><em>'+(l.length?l.map(p=>'N° '+p.rank+' '+esc(p.ns)).join('<br>'):'Aucune douleur de la liste')+'</em>';
    const top=l[0]?l[0].id:null;if(top!==hov&&(top||hov))setHover(l.find(p=>p.id===pinned)?null:top)}
  else{const j=jointOfGroup(s.id);clickable=!!j;if(!j){tip.hidden=true;cv.style.cursor='';return}
    const n=j==='hanche'?13:12;html='<b>'+JOINTS[j].n+'</b><em>'+n+' douleurs fréquentes · cliquez pour ouvrir</em>'}
  cv.style.cursor=clickable?'pointer':'';tip.innerHTML=html;tip.hidden=false;
  tip.style.left=Math.min(e.clientX-r.left+14,r.width-230)+'px';tip.style.top=(e.clientY-r.top+14)+'px'});
cv.addEventListener('pointerleave',()=>{tip.hidden=true;hs=null;if(joint&&hov)setHover(null)});
cv.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY]});
cv.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5)return;const s=pick(e);if(!s)return;
  if(joint&&data){const l=involved(s);if(l.length){const i=l.findIndex(p=>p.id===pinned);select(l[(i+1)%l.length].id)}}
  else if(!joint){const j=jointOfGroup(s.id);if(j)enter(j)}});

/* ===== Points de vue ===== */
$('b-views').querySelectorAll('button').forEach(b=>b.onclick=()=>{
  const d=cam.position.distanceTo(ctl.target),v=VIEWS[b.dataset.v];fly(ctl.target,new T.Vector3(v[0],v[1],v[2]).normalize().multiplyScalar(d))});
$('b-reset').onclick=()=>{joint&&data&&BY[pinned]?flyTo(BY[pinned]):fly(HOME.t,homeO())};
addEventListener('keydown',e=>{if(e.key==='Escape'&&!root.hidden&&joint)leave()});

/* ===== Boucle de rendu ===== */
let last=performance.now(),lastLn='';const v3=new T.Vector3(),tmpC=new T.Color(),leadEl=$('b-lead');
function frame(now){requestAnimationFrame(frame);if(root.hidden){last=now;return}
  const dt=Math.min(.05,(now-last)/1000);last=now;
  if(tw){const u=Math.min(1,(now-tw.t0)/tw.dur),e=u<.5?4*u*u*u:1-Math.pow(-2*u+2,3)/2;
    ctl.target.lerpVectors(tw.ta,tw.t1,e);cam.position.copy(ctl.target).add(v3.lerpVectors(tw.oa,tw.o1,e));if(u>=1)tw=null}
  ctl.update();
  const a=BY[cur()],ja=joint&&data?(a||items[0]):null,hj=!joint&&hs?jointOfGroup(hs.id):null;
  const pulse=.5+.5*Math.sin(now/320);
  Object.values(S).forEach(s=>{
    const here=!s.jk||(s.jk===joint&&!!data),on=here&&LV[s.layer]&&!(ja&&!s.jk),sk=s.layer==='peau',aff=!sk&&inZone(ja,s),hovd=!!ja&&hs===s&&!sk;
    let b=on?s.op:0;
    if(on&&ja&&!sk){if(aff)b=s.layer==='mus'?.9:1;else b*=s.layer==='os'?.5:s.layer==='mus'?.3:.4}
    if(on&&hovd)b=Math.max(b,.8);
    if(!s.jk&&s.layer==='cart'&&!ja)b=1;
    s.k+=(b-s.k)*Math.min(1,dt*9);const op=s.k;
    s.mat.opacity=op;s.mat.transparent=sk||op<.995;if(!sk)s.mat.depthWrite=op>.6;const vis=op>.02;s.meshes.forEach(m=>{m.visible=vis;if(!sk)m.renderOrder=op>.6?0:1});
    if(s.over){const v=vis&&!!ja&&s.painted;s.over.forEach(m=>m.visible=v);s.veil.uniforms.a.value=.5+.08*pulse}
    /* teinte : structure en cause (chaude, pulsée), structure survolée (froide), os de la zone survolée en vue corps entier */
    let em=0;tmpC.copy(hot);
    if(aff){em=.16+.14*pulse;tmpC.copy(ja.hex)}
    if(hovd){em=Math.max(em,.3);if(!aff)tmpC.copy(COOL)}
    if(!joint&&!s.jk){if(a&&a.g&&a.g.some(g=>'os:'+g===s.id)){em=.45;tmpC.copy(a.hex)}else if(hj&&jointOfGroup(s.id)===hj&&/-d$|^os:[^-]+$/.test(s.id)){em=.22;tmpC.copy(COOL)}}
    s.em=(s.em||0)+(em-(s.em||0))*Math.min(1,dt*9);s.mat.emissive.copy(tmpC).multiplyScalar(s.em)});
  const ga=!joint?a:null;glowK+=((ga?1:0)-glowK)*Math.min(1,dt*8);
  if(ga){glow.position.copy(A3[ga.a]);glow.scale.setScalar(ga.r*(1+.06*Math.sin(now/260)));glow.material.color.copy(ga.hex)}
  glow.material.opacity=glowK*.5;
  if(skin)skin.visible=!ja;
  const w=view.clientWidth,h=view.clientHeight;
  const vis=[];
  items.forEach(p=>{v3.copy(p.pos).project(cam);const ok=v3.z<1&&Math.abs(v3.x)<1.05&&Math.abs(v3.y)<1.05;p.pin.hidden=!ok;
    if(ok){p.ax=p.px=(v3.x*.5+.5)*w;p.ay=p.py=(-v3.y*.5+.5)*h;vis.push(p)}});
  const c0=cur();
  for(let it=0;it<10;it++)for(let i=0;i<vis.length;i++)for(let k=i+1;k<vis.length;k++){const A=vis[i],B=vis[k];let dx=B.px-A.px,dy=B.py-A.py,d=Math.hypot(dx,dy);
    if(d<27){if(d<.01){dx=Math.cos(k*2.4);dy=Math.sin(k*2.4);d=1}const m=(27-d)/2,ux=dx/d,uy=dy/d,fa=A.id===c0?0:(B.id===c0?2:1),fb=2-fa;A.px-=ux*m*fa;A.py-=uy*m*fa;B.px+=ux*m*fb;B.py+=uy*m*fb}}
  let ln='';
  vis.forEach(p=>{p.pin.style.translate=p.px.toFixed(1)+'px '+p.py.toFixed(1)+'px';
    if(Math.hypot(p.px-p.ax,p.py-p.ay)>9)ln+='<line x1="'+p.ax.toFixed(1)+'" y1="'+p.ay.toFixed(1)+'" x2="'+p.px.toFixed(1)+'" y2="'+p.py.toFixed(1)+'" stroke="'+p.col+'" stroke-opacity="'+(c0&&c0!==p.id?.25:.8)+'"/><circle cx="'+p.ax.toFixed(1)+'" cy="'+p.ay.toFixed(1)+'" r="2.5" fill="'+p.col+'" fill-opacity="'+(c0&&c0!==p.id?.3:1)+'"/>'});
  if(ln!==lastLn){leadEl.innerHTML=ln;lastLn=ln}
  ren.render(scene,cam)}
buildList();sync();panel();requestAnimationFrame(frame);

/* ===== Bascule corps entier / hanche ===== */
let hip=null;
window.openHip=function(id){root.hidden=true;$('hipview').hidden=false;hipOpen=true;if(!hip)hip=window.startHip();
  if(id&&hip&&hip.pin)hip.pin(id);sync();try{history.replaceState(null,'','#hanche')}catch(e){}};
window.openBody=function(){$('hipview').hidden=true;root.hidden=false;hipOpen=false;sync();try{history.replaceState(null,'',location.pathname)}catch(e){}fit()};
if(location.hash==='#hanche')window.openHip();
$('b-src').innerHTML=Object.keys(SRC).map(srcLink).join(' · ');
}).catch(function(e){console.error(e);var d=document.getElementById('b-detail');
  if(d)d.innerHTML='<h2>Chargement impossible</h2><p>Les contenus de l’atlas n’ont pas pu être chargés. La page doit être servie par un serveur web (voir le README), et non ouverte directement comme fichier.</p>'});
