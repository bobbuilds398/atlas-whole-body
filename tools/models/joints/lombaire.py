from zalib import *
Ln=['Vertebra L1','Vertebra L2','Vertebra L3','Vertebra L4','Vertebra L5']
L=[cen(n) for n in Ln]
Dn=['Intervertebral disc L1-L2','Intervertebral disc L2-L3','Intervertebral disc L3-L4','Intervertebral disc L4-L5','Intervertebral disc L5-S1']
Dk=[cen(n) for n in Dn]
body=[ext(n,'front',frac=.3) for n in Ln]
sac=cen('Sacrum');hipb='Hip bone'
R=vec('lat');Lf=vec('med');B=vec('back');F=vec('front');UP=vec('up');DN=vec('down')
si=cen('Interosseous sacro-iliac ligament');si_l=cen('Interosseous sacro-iliac ligament','l')
J=Joint('lombaire','Bas du dos','Colonne lombaire et bassin, vus de dos',mix(L[3],sac,.3),720,view='dos')
J.use()
J.bone('lomb','Vertèbres lombaires',Ln,cap=6000,clabel='Cartilage des articulations postérieures et des plateaux')
J.bone('sacrum','Sacrum',['Sacrum','Coccyx'],cap=7000)
J.bone('iliaque','Os iliaques',hipb,cap=7000);J.bone('iliaque','Os iliaques',hipb,side='l',cap=7000)
J.bone('thor','Dernières vertèbres thoraciques et côtes',['Vertebra T11','Vertebra T12','Eleventh rib','Twelfth rib'],cap=2500,cart=False)
J.bone('thor','Dernières vertèbres thoraciques et côtes',['Eleventh rib','Twelfth rib'],side='l',cap=1200,cart=False)
J.bone('femur','Fémurs','Femur',cap=3500,cart=False);J.bone('femur','Fémurs','Femur',side='l',cap=3500,cart=False)
J.real('disques','Disques intervertébraux','cart',Dn+['Intervertebral disc T12-L1','Intervertebral disc T11-T12'],op=.95,cap=1800)
J.real('lse','Ligaments supra-épineux et inter-épineux','lig',['Supraspinous ligament','Interspinous ligaments'],cap=3000)
J.real('ljaune','Ligaments jaunes','lig','Ligamenta flava',cap=3000,color='#e6cf6a')
J.real('llp','Ligament longitudinal postérieur','lig','Posterior longitudinal ligament',cap=2500)
for sd in ('r','l'):
    J.real('lil','Ligaments ilio-lombaires','lig','Iliolumbar ligament',side=sd)
    J.real('lsi','Ligaments sacro-iliaques','lig',['Posterior sacro-iliac ligament','Interosseous sacro-iliac ligament'],side=sd)
    J.real('lst','Ligaments sacro-tubéraux','lig','Sacrotuberous ligament',side=sd,op=.6)
    J.mus('multi','Multifide','Multifidus lumborum muscle',side=sd,cap=4500)
    J.mus('erect','Muscles érecteurs du rachis',['Longissimus thoracis muscle','Iliocostalis lumborum muscle'],side=sd,cap=5000)
    J.mus('ql','Carré des lombes','Quadratus lumborum muscle',side=sd)
    J.mus('psoas','Psoas','Psoas major',side=sd)
J.mus('gmax','Grand fessier','Gluteus maximus muscle');J.mus('gmed','Moyen fessier','Gluteus medius muscle');J.mus('piri','Piriforme','Piriformis muscle')
J.real('dure','Sac dural et queue de cheval','nerf',['Spinal dura','Cauda equina'],cap=3500,op=.55)
J.real('sci','Nerf sciatique','nerf',['Sciatic nerve','Tibial nerve','Common fibular nerve'],cap=3000)
J.real('cru','Nerf fémoral (crural)','nerf','Femoral nerve',cap=2500)
hern=Dk[3]+B*15+R*9
J.blob('hern','Hernie discale, lorsqu’elle existe','cart',hern,(7,6,6),color='#ff9a7a')
J.skin([mix(L[3],sac,.4)],330,cap=12000)
lv=V(Ln[3]);fac=[]
for k in (2,3,4):
    lower=L[k+1] if k<4 else sac+UP*38+F*6
    c=mix(L[k],lower,.5)+B*17
    for v in (R,Lf): fac.append(snap(np.concatenate([V(n) for n in Ln]+[V('Sacrum')]),c+v*17))
pir=cen('Piriformis muscle');fem=cen('Femur');sciv=V('Sciatic nerve')
sc_hi=sciv[sciv[:,2]>np.percentile(sciv[:,2],88)].mean(0);sc_mid=sciv[np.abs(sciv[:,2]-np.percentile(sciv[:,2],45))<25].mean(0)
crv=V('Femoral nerve');cr_hi=crv[crv[:,2]>np.percentile(crv[:,2],85)].mean(0);cr_lo=crv[crv[:,2]<np.percentile(crv[:,2],30)].mean(0)
ql=cen('Quadratus lumborum muscle')
for a in [('barre','w','En barre au milieu du bas du dos'),('uncote','w','D’un seul côté du dos'),('fesse','w','En haut de la fesse'),('jambe','w','Dans la jambe, à l’arrière'),('cuisse','w','À l’avant de la cuisse'),('flanc','w','Dans le flanc'),
 ('brutal','q','Blocage brutal'),('assis','q','Pire assis ou penché en avant'),('cambre','q','Pire debout ou cambré'),('marche','q','Jambes lourdes à la marche'),('toux','q','Pire à la toux'),('matin','q','Raide le matin, mieux en bougeant'),('nuit','q','Réveille la nuit'),('fourmi','q','Fourmillements dans la jambe'),('retourne','q','En se retournant dans le lit'),('age','q','Après 60 ans')]: J.sym(*a)
p=J.p
p('lombalgie',['m-erect','m-multi','lomb','lse'],[(mix(L[3],L[4])+B*25,62)],[(mix(L[3],L[4])+B*60,90)],tags=['barre','uncote','assis','cambre'])
p('lumbago',['m-erect','m-multi','m-ql'],[(L[3]+B*30+R*28,48),(L[3]+B*30+Lf*28,48)],[(L[3]+B*60,100)],tags=['barre','brutal'])
p('sciatique',['hern','sci','disques','dure'],[(hern,16),(sc_hi,36),(sc_mid,70)],[(pir+B*45+DN*10,75),(fem+B*60+UP*60,85),(fem+B*55+DN*60,85),(fem+B*45+DN*200+R*10,85),(fem+B*35+DN*330+R*20,80)],tags=['jambe','fesse','toux','assis','fourmi'])
p('disco',['disques','c-lomb'],[(Dk[3],26),(Dk[4],26)],[(mix(L[3],L[4])+B*60,62)],tags=['barre','assis','matin'])
p('facettes',['c-lomb','lomb','ljaune'],[(f,13) for f in fac[2:]],[(mix(fac[2],fac[4])+B*40,48)],tags=['uncote','cambre'])
p('si',['lsi','sacrum','iliaque'],[(si,32)],[(si+B*45,58)],tags=['fesse','uncote','retourne'])
p('canal',['dure','ljaune','c-lomb'],[(L[2]+B*14,24),(L[3]+B*14,26),(L[4]+B*14,24)],[(L[3]+B*60,62),(fem+B*60+UP*40,85),(fem+B*60+UP*40+Lf*185,85)],tags=['marche','age','cambre','fourmi'])
p('ql',['m-ql'],[(ql,48)],[(ql+B*55+R*15,62)],tags=['flanc','uncote'])
p('cruralgie',['cru','disques','m-psoas'],[(Dk[2]+R*22+B*4,22),(cr_hi,34),(cr_lo,60)],[(fem+F*60+UP*150,75),(fem+F*65+UP*60,80),(fem+F*60+DN*40,75)],tags=['cuisse','nuit','fourmi'],view='face')
p('listhesis',['lomb','disques','c-lomb'],[(L[4],34)],[(L[4]+B*60,52)],tags=['barre','cambre'],view='cote')
p('tassement',['lomb','thor'],[(body[0],28)],[(L[0]+B*60,52)],tags=['brutal','age','barre'],view='cote')
p('spa',['lsi','sacrum','iliaque'],[(si,32),(si_l,32)],[(si+B*45,52),(si_l+B*45,52)],tags=['fesse','matin','nuit'])
J.write()
