"""Exporte tous les maillages de Z-Anatomy (Startup.blend) en tableaux numpy, avec nom, collections et matériaux par face."""
import bpy,numpy as np,json,os,sys
W='/tmp/claude-0/-home-claude/b309af02-d556-598f-9517-fe97b5f199d6/scratchpad/'
OUT=W+'work/za/';os.makedirs(OUT,exist_ok=True)
bpy.ops.wm.open_mainfile(filepath=W+'dl/za/Z-Anatomy/Startup.blend')
par={}
for c in bpy.data.collections:
    for ch in c.children: par[ch.name]=c.name
def chain(n):
    o=[n]
    while o[-1] in par: o.append(par[o[-1]])
    return o[::-1]
dg=bpy.context.evaluated_depsgraph_get()
import os
start=int(open(OUT+'last').read())+1 if os.path.exists(OUT+'last') else 0
idx=open(OUT+'index.jsonl','a');k=start;import time;t0=time.time();objs=[o for o in bpy.data.objects if o.type=='MESH'];print('meshes',len(objs),file=sys.stderr)
for oi,o in enumerate(objs):
    if oi<start: continue
    open(OUT+'last','w').write(str(oi));k=oi
    try:
        ev=o.evaluated_get(dg);me=ev.to_mesh()
    except Exception as e:
        me=o.data
    if me is None or len(me.vertices)==0: continue
    me.calc_loop_triangles()
    n=len(me.vertices);v=np.empty(n*3,'f4');me.vertices.foreach_get('co',v);v=v.reshape(-1,3).astype('f8')
    M=np.array(o.matrix_world);v=(v@M[:3,:3].T+M[:3,3]).astype('f4')
    nt=len(me.loop_triangles)
    if nt==0: continue
    t=np.empty(nt*3,'i4');me.loop_triangles.foreach_get('vertices',t);t=t.reshape(-1,3)
    mi=np.empty(nt,'i4');me.loop_triangles.foreach_get('material_index',mi)
    mats=[s.material.name if s.material else '' for s in o.material_slots]
    np.savez(OUT+'%d.npz'%k,v=v,t=t,mi=mi.astype('i2'))
    cols=[chain(c.name) for c in o.users_collection]
    idx.write(json.dumps({'k':k,'name':o.name,'cols':cols,'nv':n,'nt':nt,'mats':mats,'c':[round(float(x),4) for x in v.mean(0)],'lo':[round(float(x),4) for x in v.min(0)],'hi':[round(float(x),4) for x in v.max(0)],'parent':o.parent.name if o.parent else None})+'\n');idx.flush()
    try: ev.to_mesh_clear()
    except Exception: pass
idx.close();open(OUT+'DONE','w').write('ok')
print('exported',k,file=sys.stderr)
