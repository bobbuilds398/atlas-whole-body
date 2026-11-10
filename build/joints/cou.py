from zalib import *
Cn=['Atlas (C1)','Axis (C2)','Vertebra C3','Vertebra C4','Vertebra C5','Vertebra C6','Vertebra C7']
C=[cen(n) for n in Cn]
Dn=['Intervertebral disc C2-C3','Intervertebral disc C3-C4','Intervertebral disc C4-C5','Intervertebral disc C5-C6','Intervertebral disc C6-C7','Intervertebral disc C7-T1']
Dk=[cen(n) for n in Dn]
occ=ext('Occipital bone','back+0.6down')
R=vec('lat');Lf=vec('med');B=vec('back');F=vec('front');UP=vec('up');DN=vec('down')
J=Joint('cou','Cou','Colonne cervicale, vue de dos',C[4],520,view='dos')
J.use()
J.bone('cerv','Vertèbres cervicales',Cn,cap=4500,clabel='Cartilage des articulations postérieures')
J.bone('crane','Crâne',['Occipital bone'],cap=5000,cart=False)
for sd in ('r','l'):
    J.bone('crane','Crâne',['Parietal bone','Temporal bone'],side=sd,cap=3000,cart=False)
    J.bone('ctx','Haut du thorax et épaules',['First rib','Second rib','Clavicle','Scapula'],side=sd,cap=2200,cart=False)
J.bone('ctx','Haut du thorax et épaules',['Vertebra T1','Vertebra T2','Vertebra T3','Manubrium of sternum'],cap=2500,cart=False)
J.bone('humerus','Humérus','Humerus',cap=3000,cart=False)
J.real('disques','Disques intervertébraux','cart',Dn,op=.95,cap=1400)
J.real('lnu','Ligament nucal','lig','Nuchal ligament',cap=2500)
J.real('ljaune','Ligaments jaunes','lig','Ligamenta flava',cap=3000,color='#e6cf6a')
for sd in ('r','l'):
    J.mus('trap','Trapèze supérieur','Descending part of trapezius muscle',side=sd)
    J.mus('lev','Élévateur de la scapula','Levator scapulae',side=sd)
    J.mus('scm','Sterno-cléido-mastoïdien','Sternocleidomastoid muscle',side=sd)
    J.mus('spl','Splénius',['Splenius capitis muscle','Splenius colli muscle'],side=sd)
    J.mus('semi','Muscles profonds de la nuque',['Semispinalis colli muscle','Spinalis capitis muscle','Longissimus capitis muscle','Multifidus colli muscle'],side=sd,cap=2500)
    J.mus('scal','Scalènes',['Scalenus anterior muscle','Scalenus medius muscle','Scalenus posterior muscle'],side=sd,cap=2500)
    J.mus('subocc','Muscles sous-occipitaux',['Rectus posterior major capitis muscle','Rectus posterior minor capitis muscle','Obliquus inferior capitis muscle','Obliquus superior capitis muscle'],side=sd,cap=1200)
    J.mus('long','Muscles profonds de l’avant du cou',['Longus colli muscle','Longus capitis muscle'],side=sd,cap=2000)
J.real('moelle','Moelle épinière','nerf','White matter of spinal cord',cap=3500,op=.7)
J.real('plex','Racines et plexus brachial','nerf',['Roots of brachial plexus','Superior trunk of brachial plexus','Middle trunk of brachial plexus','Inferior trunk of brachial plexus','Posterior cord of brachial plexus','Anterior division of superior trunk of brachial plexus','Anterior division of middle trunk of brachial plexus','Anterior division of inferior trunk of brachial plexus'],cap=1500)
J.real('nbras','Nerfs du bras','nerf',['Median nerve','Ulnar nerve','Radial nerve','Musculocutaneous nerve','Axillary nerve'],cap=2000)
so=cen('Rectus posterior major capitis muscle');so_l=cen('Rectus posterior major capitis muscle','l')
arn=[C[1]+R*12+B*14+DN*2,so+B*8+DN*4,occ+R*26+UP*10+B*2,occ+R*30+UP*50+F*4,occ+R*30+UP*95+F*30]
J.tube('arnold','Nerf grand occipital (tracé schématique)','nerf',arn,1.9)
hern=Dk[3]+B*8+R*7
J.blob('hern','Hernie discale, lorsqu’elle existe','cart',hern,(4.5,4,4),color='#ff9a7a')
J.skin([C[3],C[5]+R*90,C[5]+Lf*90,occ+UP*40],190,cap=13000)
allc=np.concatenate([V(n) for n in Cn]);fac=[]
for k in range(1,6):
    c=mix(C[k],C[k+1],.5)+B*9
    for v in (R,Lf): fac.append(snap(allc,c+v*20))
trp=cen('Descending part of trapezius muscle');lv=cen('Levator scapulae');lve=I_('Levator scapulae','e');scm=cen('Sternocleidomastoid muscle')
rt=cen('Roots of brachial plexus');tr=cen('Middle trunk of brachial plexus');sa=cen('Scalenus anterior muscle');hu=ext('Humerus','up')
mdn=V('Median nerve');md_hi=mdn[mdn[:,2]>np.percentile(mdn[:,2],80)].mean(0)
for a in [('nuque','w','Dans la nuque'),('cote','w','Sur un côté du cou'),('epaule','w','Entre le cou et l’épaule'),('tete','w','Derrière la tête'),('omoplate','w','Vers l’omoplate'),('bras','w','Dans le bras'),
 ('tourner','q','En tournant la tête'),('reveil','q','Bloqué au réveil'),('ecran','q','En fin de journée, devant un écran'),('maldetete','q','Avec des maux de tête'),('fourmi','q','Fourmillements dans le bras ou la main'),('decharge','q','Décharges électriques'),('accident','q','Après un accident ou un choc'),('brasleve','q','Bras levé, la main s’engourdit'),('maladroit','q','Mains maladroites, marche instable'),('enlair','q','En regardant en l’air')]: J.sym(*a)
p=J.p
p('cervicalgie',['m-spl','m-semi','m-trap','cerv'],[(C[4]+B*22,48)],[(C[4]+B*45,62)],tags=['nuque','tourner','ecran','omoplate'])
p('torticolis',['m-scm','m-lev','m-spl'],[(scm,42),(lv,40)],[(mix(scm,lv)+R*25,62)],tags=['cote','reveil','tourner'],view='cote')
p('cephalee',['m-subocc','m-semi','cerv'],[(so,26),(so_l,26)],[(occ+UP*8,50),(occ+UP*60+R*20,45)],tags=['tete','nuque','maldetete','ecran'])
p('trapeze',['m-trap'],[(trp+DN*10,48)],[(trp+B*14+UP*6,60)],tags=['epaule','ecran'])
p('arthrose',['c-cerv','disques','cerv'],[(C[4],30),(C[5],28)],[(C[4]+B*45,52)],tags=['nuque','tourner','enlair'])
p('ncb',['plex','nbras','hern','disques'],[(hern,13),(rt,26),(tr,30),(md_hi,45)],[(trp+B*10,55),(hu+DN*40+B*20,60),(hu+DN*140+R*10,60),(hu+DN*260+R*20,55)],tags=['bras','fourmi','epaule','omoplate'])
p('whiplash',['m-scm','m-long','lnu','c-cerv','m-semi'],[(C[3]+B*14,40),(C[3]+F*22,30)],[(C[3]+B*45,60),(C[4]+F*50,40)],tags=['nuque','accident','maldetete','tourner'],view='cote')
p('levator',['m-lev'],[(lve,24),(lv,34)],[(lve+B*20,40)],tags=['omoplate','epaule','tourner'])
p('arnold',['arnold','m-subocc'],[(so+B*8,20),(occ+R*26+UP*10,18)],[(occ+R*24+UP*20,36),(occ+R*30+UP*80+F*10,45)],tags=['tete','decharge'])
p('facettes',['c-cerv','cerv','ljaune'],[(fac[4],12),(fac[6],12)],[(mix(fac[4],fac[6])+B*30+R*6,36)],tags=['cote','tourner','enlair'])
p('defile',['plex','m-scal'],[(tr,28),(sa+DN*20,24)],[(sa+DN*20+R*14+F*25,45),(hu+Lf*10+DN*160,60)],tags=['bras','brasleve','fourmi'],view='face')
p('myelopathie',['moelle','c-cerv','disques'],[(C[4]+B*9,24),(C[5]+B*9,22)],[(C[4]+B*45,45)],tags=['maladroit','nuque'],view='cote')
J.write()
