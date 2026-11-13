/* SPDX-License-Identifier: MIT AND CC-BY-SA-4.0 — le code est sous MIT ; les textes (PATHO, SYMS, EXTRA, EXO, GLOSS, PHASES, PHDESC) sont sous CC BY-SA 4.0. */
/* Atlas de la hanche — moteur d'origine de la vue hanche (données des fiches incluses dans ce fichier : PATHO, SYMS, EXTRA, EXO). */
window.startHip=function(){

'use strict';
/* langue : textes anglais dans js/hip-en.js (window.HIP_EN), même ordre et mêmes identifiants */
const HE=window.LANG==='en'&&window.HIP_EN?window.HIP_EN:null;
const U=HE?HE.ui:{
  freqIdx:n=>'Indice de fréquence relative : '+n+' sur 100',
  match:n=>(n>1?n+' fiches mentionnent':'1 fiche mentionne')+' ces repères. Elles restent dans l’ordre habituel de la liste. Ce n’est pas un diagnostic : seul un examen permet de trancher.',
  noMatch:'Aucune fiche ne mentionne ces mots. Si la douleur est forte, inhabituelle ou s’aggrave, consultez.',
  seeDef:'Voir la définition',
  noEx:'Aucun exercice ne correspond à ces filtres pour cette douleur. Changez d’étape ou de matériel, ou demandez conseil à un kinésithérapeute.',
  video:'Vidéo : ',search:'Chercher sur YouTube',newTab:' (nouvel onglet)',unverified:'· résultats non vérifiés, préférez les vidéos de kinésithérapeutes',
  rest:'repos ',timer:'Minuteur ',
  howTo:'<span class="tag">Mode d’emploi</span><h2>Choisissez une douleur</h2><ol class="steps"><li>Survolez une structure du modèle ou un numéro : la zone douloureuse se colore avec sa forme exacte.</li><li>Survolez la liste : la même zone apparaît sur le modèle.</li><li>Décrivez ce que vous ressentez dans la recherche : les fiches qui en parlent restent nettes, les autres s’atténuent.</li><li>Cliquez pour verrouiller la sélection et afficher les exercices.</li><li>« Mouvement et coupe » permet de plier la hanche et de voir où ça pince.</li></ol>',
  aka:'Aussi appelé : ',rev:'Fiche non relue par un professionnel de santé · mise à jour le 11 novembre 2026',
  what:'Ce qui se passe',structs:'Structures concernées :',feel:'Ce que vous ressentez',
  exH:'Exercices souvent proposés',exNote:'Exemples généraux. Ils ne remplacent pas un bilan par un médecin ou un kinésithérapeute, qui adapte les exercices à votre cas.',
  allStages:'Toutes les étapes',equip:'Matériel :',back:'Retour à la vue d’ensemble',words:'Mots utiles',
  clickEx:' — cliquez pour les exercices',landmark:'Structure de repère',
  contact:lim=>'Contact : la bosse du col bute sur le bord du cotyle et pince le labrum. Avec ces réglages, le contact commence vers '+lim+'° de flexion.',
  noContact:'Avec cette bosse, aucun contact sur ces réglages.',
  notYet:lim=>'Pas de contact pour l’instant. Avec ces réglages, il apparaît vers '+lim+'° de flexion.',
  healthy:'Hanche saine : le mouvement reste libre. Ajoutez la bosse pour voir ce que provoque un conflit. Ligaments, tendons et muscles sont masqués pendant le mouvement.',
  none:'aucune',active:'active'};
const NO=window.LANG==='en'?'No. ':'N° ';
/* ===== Données : douleurs de hanche, ordre estimé du plus courant au plus rare (indice 0-100, sans chiffre publié) =====
   zones = structures survolables et colorées ; also = colorées seulement ; anchor = position du numéro 3D ; view = direction de la caméra */
const PATHO=[
{id:'coxarthrose',n:'Arthrose de la hanche',al:'Coxarthrose',pop:100,zones:['cart-tete','cart-cotyle','tete'],anchor:[-.85,.35,.65],view:[-6,3,9],
 who:'Surtout après 50 ans, plus tôt après un conflit de hanche ou une dysplasie.',
 pain:'Douleur dans l’aine, parfois jusqu’au genou, raideur au lever, difficulté à enfiler chaussettes et chaussures.',
 txt:'Le cartilage de la tête du fémur et du cotyle s’amincit, l’os se remodèle et la hanche perd de la mobilité, surtout en rotation et en flexion.',
 ex:[
  {n:'Pont fessier',d:'Allongé, genoux pliés, montez le bassin sans cambrer le dos. 3 séries de 10 à 12, sans douleur.',q:'pont fessier exercice kiné arthrose de hanche'},
  {n:'Abduction couchée sur le côté',d:'Jambe du dessus tendue, montée lente jusqu’à 30°. 2 à 3 séries de 10.',q:'abduction hanche allongé sur le côté renforcement moyen fessier'},
  {n:'Vélo d’appartement, résistance faible',d:'15 à 20 minutes, selle assez haute pour ne pas fermer la hanche au-delà de 90°.',q:'vélo d’appartement arthrose de hanche réglage selle'},
  {n:'Glissement du talon',d:'Allongé, glissez le talon vers les fesses puis étendez la jambe. 10 répétitions par côté.',q:'mobilité hanche arthrose exercices doux kinésithérapeute'}],
 warn:'Urgences (15 ou 112) : après une chute, douleur de l’aine ou impossibilité d’appuyer sur la jambe, même si vous arrivez à marcher un peu. Hanche très douloureuse avec fièvre : urgences. Douleur qui réveille chaque nuit, blocage ou aggravation rapide : consultez.'},
{id:'gtps',n:'Douleur du grand trochanter',al:'Tendinopathie des fessiers, bursite trochantérienne',pop:95,zones:['ten-gmed','ten-gmin','burs-troch','gt'],anchor:[-4.3,-.8,-.1],view:[-11,2,3],
 who:'Femmes de 40 à 60 ans, coureurs. Dormir sur le côté et croiser les jambes entretiennent la douleur.',
 pain:'Douleur sur le côté externe de la hanche, vive en dormant sur ce côté, en montant les escaliers ou debout sur une jambe.',
 txt:'Les tendons du moyen et du petit fessier s’insèrent sur le grand trochanter. Ils s’irritent avec la bourse qui les amortit, surtout quand ils sont comprimés.',
 ex:[
  {n:'Isométrique d’abduction contre un mur',d:'Debout, côté douloureux contre le mur, pliez ce genou à 90° et poussez-le doucement contre le mur sans bouger le bassin. 5 tenues de 30 à 45 s.',q:'exercice isométrique moyen fessier tendinopathie trochantérienne'},
  {n:'Pont fessier',d:'Montée lente du bassin, 3 séries de 10, en gardant les genoux alignés.',q:'pont fessier technique kinésithérapeute'},
  {n:'Coquille (clamshell)',d:'Sur le côté, genoux pliés, ouvrez le genou du dessus talons joints. 3 séries de 12.',q:'clamshell exercice moyen fessier'},
  {n:'Planche latérale sur les genoux',d:'Appui sur l’avant-bras, bassin aligné. 3 tenues de 20 à 30 s par côté.',q:'planche latérale genoux moyen fessier tendinopathie'}],
 warn:'Évitez de croiser les jambes, de dormir sur le côté douloureux sans coussin entre les genoux et les étirements qui ramènent la jambe vers l’intérieur. Sans amélioration après 3 mois d’exercices bien suivis, consultez.'},
{id:'cfa',n:'Conflit fémoro-acétabulaire',al:'Conflit de hanche, lésion du labrum',pop:45,zones:['labrum','camov','cart-cotyle'],anchor:[-.05,.85,.95],view:[-4,4,9.5],
 who:'Sportifs de 20 à 40 ans (football, hockey, danse), mais aussi personnes sédentaires.',
 pain:'Douleur de l’aine, main en « C » autour de la hanche, gêne assis longtemps, en position accroupie, parfois claquement ou accrochage.',
 txt:'Une bosse osseuse au niveau de la jonction tête-col ou un cotyle trop couvrant pince le labrum et le cartilage quand la hanche se plie et tourne vers l’intérieur.',
 ex:[
  {n:'Balancier à quatre pattes',d:'Genoux écartés, reculez les fesses vers les talons sans arrondir le dos. 2 séries de 10 dans le confort.',q:'rocking quadrupédie mobilité hanche conflit fémoro-acétabulaire'},
  {n:'Dead bug',d:'Dos à plat, alternez bras et jambe opposés en gardant le bassin immobile. 3 séries de 8 par côté.',q:'dead bug exercice gainage kiné'},
  {n:'Marche latérale avec élastique',d:'Élastique au-dessus des genoux, petits pas en demi-squat. 3 séries de 10 pas.',q:'marche latérale élastique fessiers monster walk'},
  {n:'Squat à amplitude confortable',d:'Descendez jusqu’à la limite de la gêne, pieds légèrement ouverts. 3 séries de 8.',q:'squat technique hanche conflit pincement'}],
 warn:'Évitez la flexion extrême de hanche avec rotation interne. Un blocage ou une dérobade appelle un avis spécialisé.'},
{id:'adducteurs',n:'Douleur de l’aine par les adducteurs',al:'Douleur de l’aine liée aux adducteurs (pubalgie)',pop:55,zones:['ten-addl','m-addl','pubis'],anchor:[2.2,-1.45,1.45],view:[3,1,10],
 who:'Footballeurs, hockeyeurs, escrimeurs, souvent entre 20 et 35 ans.',
 pain:'Douleur à l’intérieur de l’aine et près du pubis, déclenchée par les changements de direction, les frappes et la toux.',
 txt:'Le tendon du long adducteur s’attache sur le pubis. Il supporte de fortes tractions lors des accélérations et des écarts de jambes, et finit par s’irriter.',
 ex:[
  {n:'Serrage d’un ballon entre les genoux',d:'Allongé, genoux pliés, serrez un ballon 5 s. 3 séries de 10, intensité progressive.',q:'squeeze adducteurs ballon isométrique pubalgie'},
  {n:'Copenhagen plank',d:'Appui latéral, jambe du dessus sur un banc. Commencez par la version genou plié, 3 tenues de 15 s.',q:'Copenhagen plank adducteurs progression'},
  {n:'Gainage et dead bug',d:'Le ventre profond protège le pubis. 3 séries de 8 par côté.',q:'gainage transverse pubalgie exercices'}],
 warn:'Reprenez le sport par paliers, sans douleur marquée le lendemain. Boule dans l’aine qui grossit à la toux : consultez, une hernie est possible. Douleur brutale du testicule : urgences (15 ou 112). Douleur avec fièvre ou brûlures urinaires : consultez.'},
{id:'psoas',n:'Tendinopathie du psoas et ressaut interne',al:'Psoas-iliaque, hanche à ressaut interne',pop:35,zones:['ten-psoas','m-psoas','burs-ilio'],anchor:[.45,.85,1.55],view:[-3,3,10],
 who:'Danseurs, coureurs, cyclistes, personnes très assises ou après une prothèse de hanche.',
 pain:'Douleur au pli de l’aine, claquement ressenti en passant de la flexion à l’extension, gêne en montant les escaliers.',
 txt:'Le tendon du psoas-iliaque passe devant l’articulation et sur le bord du pubis. Il frotte sur ces reliefs, avec parfois la bourse placée dessous qui s’enflamme.',
 ex:[
  {n:'Flexion de hanche tenue, assis',d:'Assis, mains posées sur le genou, poussez le genou vers le haut sans bouger. 5 tenues de 30 s, gêne légère acceptée.',q:'isométrique fléchisseurs de hanche assis exercice'},
  {n:'Étirement du psoas en fente',d:'Plus tard, quand la douleur a baissé. Genou au sol, rentrez le bassin et avancez doucement. 3 fois 30 s, sans douleur vive.',q:'étirement psoas fente genou au sol'},
  {n:'Flexion de hanche avec élastique',d:'Assis, élastique autour du pied, montez le genou lentement. 3 séries de 10.',q:'renforcement psoas élastique assis flexion de hanche'},
  {n:'Dead bug',d:'Le bassin reste fixe pendant le mouvement des jambes. 3 séries de 8 par côté.',q:'dead bug exercice gainage kiné'}],
 warn:'Un étirement trop appuyé sur le tendon douloureux peut aggraver la douleur. Après une prothèse de hanche, une douleur de l’aine qui persiste se montre au chirurgien.'},
{id:'piriforme',n:'Syndrome du piriforme',al:'Douleur fessière profonde',pop:20,rule:'nerf',zones:['m-piri','ten-piri','nerf'],anchor:[-.9,.4,-1.4],view:[3,3,-10],
 who:'Personnes assises longtemps, coureurs, cyclistes.',
 pain:'Douleur profonde dans la fesse, parfois irradiant dans l’arrière de la cuisse, majorée assis et en courant.',
 txt:'Le muscle piriforme croise le nerf sciatique derrière l’articulation. Il pourrait l’irriter, mais ce diagnostic reste rare et discuté : une douleur de fesse qui descend dans la jambe vient bien plus souvent du dos.',
 ex:[
  {n:'Étirement en « 4 » couché',d:'Cheville sur le genou opposé, tirez la cuisse vers vous. 3 fois 30 s par côté.',q:'étirement piriforme couché figure 4'},
  {n:'Glissement du nerf sciatique',d:'Assis, étendez le genou tout en relevant la tête, sans provoquer de fourmillements. 10 répétitions.',q:'neurodynamique nerf sciatique glissement exercice'},
  {n:'Coquille (clamshell)',d:'Renforce les rotateurs externes. 3 séries de 12.',q:'clamshell exercice moyen fessier'}],
 warn:'Urgences (15 ou 112) : difficulté à uriner ou fuites, engourdissement entre les jambes, jambe qui faiblit. Une douleur de fesse qui descend sous le genou vient le plus souvent du dos : faites-vous examiner si elle dure plus de quelques semaines.'},
{id:'ischio',n:'Tendinopathie des ischio-jambiers',al:'Douleur de la tubérosité ischiatique',pop:35,zones:['ten-isch','m-isch','ischion'],anchor:[.9,-2.15,-1.5],view:[3,-1,-10],
 who:'Coureurs, sprinteurs, sportifs de fentes, personnes qui s’asseyent sur des sièges durs.',
 pain:'Douleur du bas de la fesse, accentuée assis, en courant vite ou en montant de grands pas.',
 txt:'Les ischio-jambiers naissent par un gros tendon sur l’os où l’on s’assoit. Compression et tractions répétées peuvent l’irriter.',
 ex:[
  {n:'Pont isométrique, talons sur un banc',d:'Poussez les talons, tenue de 30 à 45 s, 4 répétitions.',q:'tendinopathie ischio-jambiers proximale isométrique pont'},
  {n:'Soulevé de terre roumain léger',d:'Dos droit, charge légère, descente lente jusqu’aux genoux. 3 séries de 8.',q:'romanian deadlift ischio-jambiers tendinopathie proximale'},
  {n:'Hip thrust progressif',d:'Dos sur un banc, montez le bassin. 3 séries de 10.',q:'hip thrust technique débutant'}],
 warn:'Évitez les étirements intenses et les sièges durs : un coussin aide. Claquement brutal à l’arrière de la cuisse en glissant jambe tendue (grand écart, ski nautique), avec un grand bleu : consultez dans la semaine, une désinsertion se répare au mieux dans les premières semaines.'},
];
PATHO.push(
{id:'rectus',n:'Tendinopathie du droit fémoral',al:'Insertion sur l’épine iliaque antéro-inférieure',pop:20,zones:['ten-rf'],also:['m-rf'],anchor:[-.2,1.62,1.45],view:[-3,3,10],
 who:'Footballeurs, sprinters, sportifs de frappe et de sauts. Chez l’adolescent, le même geste peut arracher le cartilage de croissance.',
 pain:'Douleur à l’avant de la hanche, en haut de la cuisse, lors des frappes de balle, de la course rapide et de la montée du genou.',
 txt:'Le droit fémoral est le seul muscle du quadriceps qui passe sur la hanche. Son tendon direct s’attache sur l’os iliaque, juste au-dessus du cotyle.',
 ex:[
  {n:'Chaise contre un mur (isométrique)',d:'Dos au mur, cuisses à 60-90°. 4 tenues de 30 s.',q:'chaise contre le mur quadriceps isométrique tendinopathie'},
  {n:'Étirement du quadriceps debout',d:'Talon vers la fesse, bassin neutre, genoux joints. 3 fois 30 s.',q:'étirement quadriceps droit fémoral debout'},
  {n:'Élévation de jambe tendue',d:'Allongé, montez la jambe tendue à 45° lentement. 3 séries de 10.',q:'élévation jambe tendue renforcement quadriceps'}],
 warn:'Avant de forcer, sortez de la phase très douloureuse avec du repos relatif. Claquement à la frappe ou au sprint avec douleur vive et boiterie, surtout chez l’adolescent : consultez rapidement, un arrachement osseux est possible.'},
{id:'itb',n:'Ressaut externe et bandelette ilio-tibiale',al:'Hanche à ressaut externe, tenseur du fascia lata',pop:25,zones:['ten-itb','m-tfl'],anchor:[-4.6,-3,.3],view:[-11,2,3],
 who:'Coureurs, cyclistes, danseurs, adolescents en croissance.',
 pain:'Claquement visible ou audible sur le côté de la hanche, douleur externe à la cuisse, gêne en course.',
 txt:'La bandelette ilio-tibiale est une lame fibreuse tendue du bassin au genou. Elle glisse d’avant en arrière sur le grand trochanter et peut claquer.',
 ex:[
  {n:'Planche latérale',d:'Appui sur l’avant-bras, bassin aligné. 3 tenues de 20 à 40 s par côté.',q:'planche latérale moyen fessier bandelette ilio-tibiale'},
  {n:'Rouleau de massage sur le côté',d:'Rouler doucement sur la face externe de la cuisse. 1 minute, évitez le trochanter.',q:'foam roller tenseur du fascia lata bandelette'},
  {n:'Étirement du tenseur du fascia lata',d:'Jambe croisée derrière, penchez le buste de l’autre côté. 3 fois 30 s.',q:'étirement tenseur du fascia lata'}],
 warn:'Évitez de forcer le massage sur une zone très sensible. Douleur qui persiste au repos ou boiterie : consultez.'},
{id:'si',n:'Douleur sacro-iliaque',al:'Douleur de l’articulation sacro-iliaque',pop:40,zones:['lig-si','sacrum'],anchor:[2.6,3.4,-3],view:[4,3,-10],
 who:'Pendant ou après une grossesse, après une chute sur les fesses, parfois sans cause claire.',
 pain:'Douleur en bas du dos d’un seul côté et dans la fesse, souvent prise pour une douleur de hanche, en se retournant dans le lit ou en montant les marches.',
 txt:'L’articulation sacro-iliaque relie le sacrum à l’os iliaque. Des ligaments puissants la maintiennent, mais elle peut s’irriter et projeter la douleur vers la hanche.',
 ex:[
  {n:'Bascule du bassin couché',d:'Aplatissez le bas du dos puis relâchez. 2 séries de 10.',q:'bascule du bassin couché exercice sacro-iliaque'},
  {n:'Pont fessier avec ballon entre les genoux',d:'Serrez le ballon en montant. 3 séries de 10.',q:'pont fessier ballon entre les genoux sacro-iliaque'},
  {n:'Respiration et transverse',d:'Expirez en rentrant le ventre sous le nombril. 10 cycles, 2 fois par jour.',q:'respiration diaphragmatique transverse exercice'}],
 warn:'Réveils en seconde partie de nuit et raideur du matin de plus de 30 minutes, avant 45 ans : consultez, un rhumatisme inflammatoire est possible. Douleur nocturne intense, fièvre ou perte de poids : consultez rapidement.'},
{id:'dysplasie',n:'Dysplasie de hanche',al:'Cotyle peu profond, couverture insuffisante',pop:15,zones:['toit','cotyle','labrum'],anchor:[-.45,1.4,.3],view:[-6,4,9],
 who:'Adultes jeunes, plus souvent des femmes, parfois avec un antécédent familial.',
 pain:'Douleur de l’aine après l’effort, sensation d’instabilité, fatigue du côté externe de la hanche.',
 txt:'Le cotyle est trop plat ou trop vertical et recouvre mal la tête du fémur. Le labrum et le cartilage supportent des contraintes excessives, et l’arthrose peut s’installer.',
 ex:[
  {n:'Marche latérale avec élastique',d:'Petits pas, genoux légèrement fléchis. 3 séries de 10 pas.',q:'marche latérale élastique fessiers monster walk'},
  {n:'Gainage ventral',d:'Appui sur les avant-bras, corps aligné. 3 tenues de 20 à 30 s.',q:'gainage ventral planche technique'},
  {n:'Natation ou vélo doux',d:'Activités porteuses. 20 à 30 minutes, 2 à 3 fois par semaine.',q:'natation crawl dysplasie hanche activité douce'}],
 warn:'Évitez les flexions extrêmes et les étirements forcés. Un avis chirurgical est utile en cas de douleur persistante.'},
{id:'necrose',rule:'avis',n:'Nécrose de la tête fémorale',al:'Ostéonécrose avasculaire',pop:8,zones:['tete','cart-tete'],anchor:[-.95,-.35,.2],view:[-6,3,9],
 who:'Adultes de 30 à 55 ans, après traitement prolongé par corticoïdes, excès d’alcool ou traumatisme.',
 pain:'Douleur de l’aine ou de la fesse apparue assez vite, parfois nocturne, aggravée à l’appui.',
 txt:'La zone supérieure de la tête fémorale est mal irriguée. L’os meurt puis peut s’affaisser, ce qui abîme le cartilage.',
 ex:[
  {n:'Marche avec deux cannes anglaises',d:'Technique de décharge, uniquement si votre médecin la prescrit.',q:'marche avec cannes anglaises technique'},
  {n:'Vélo sans résistance',d:'10 à 15 minutes, uniquement avec l’accord du médecin.',q:'vélo d’appartement réadaptation hanche sans résistance'},
  {n:'Exercices en piscine',d:'L’eau décharge l’articulation. Séance encadrée recommandée.',q:'aquagym exercices hanche piscine'}],
 warn:'Douleur d’aine d’apparition récente chez une personne à risque : consultez rapidement. Pas d’exercices sans avis médical.'},
{id:'fracture',n:'Fracture de fatigue du col du fémur',al:'Fracture de contrainte',pop:5,rule:'avis',zones:['col','fxline'],anchor:[-1.7,-1.85,.5],view:[-6,3,9],
 who:'Coureurs, militaires, après une hausse brutale de l’entraînement. Plus fréquent en cas d’alimentation insuffisante, de règles absentes ou irrégulières, ou d’os fragile.',
 pain:'Douleur de l’aine ou de la cuisse qui apparaît à l’effort puis persiste au repos, boiterie, douleur qui oblige à s’arrêter de courir de plus en plus tôt.',
 txt:'Des microfissures s’accumulent sur le col du fémur. Si elles traversent l’os, la fracture peut se déplacer.',
 ex:[
  {n:'Marche avec deux cannes anglaises',d:'En attendant l’avis, deux cannes si l’appui fait mal. Ensuite, décharge selon la prescription du médecin.',q:'marche avec cannes anglaises technique'}],
 warn:'Arrêtez tout de suite course et sauts, et consultez dans les 24 à 48 heures. Ne testez pas la douleur en sautant sur la jambe. Si vous ne pouvez plus appuyer : urgences. La radio est souvent normale au début, une IRM est souvent nécessaire.'}
);
/* exercices : e.k garde le nom français, clé de EXM ; textes anglais appliqués dans le même ordre */
PATHO.forEach(p=>p.ex.forEach(x=>{x.k=x.n}));
if(HE)PATHO.forEach(p=>{const e=HE.patho[p.id];if(!e)return;['n','al','who','pain','txt','warn'].forEach(k=>{if(e[k])p[k]=e[k]});
  p.ex.forEach((x,i)=>{x.n=HE.exName[x.k]||x.k;if(e.ex&&e.ex[i])Object.assign(x,e.ex[i])})});
PATHO.sort((a,b)=>b.pop-a.pop);
PATHO.forEach((p,i)=>{p.rank=i+1;p.col='hsl('+(6+i*3.6).toFixed(0)+',94%,'+(56+i*.6).toFixed(0)+'%)';p.hex=new THREE.Color().setStyle(p.col)});
const BY=Object.create(null);PATHO.forEach(p=>BY[p.id]=p);
const OF={};PATHO.forEach(p=>p.zones.forEach(z=>(OF[z]=OF[z]||[]).push(p)));
/* ===== Symptômes en mots courants, noms simples, glossaire ===== */
const SYMS=[
 {id:'aine',g:'w',t:'Dans l’aine ou le pli de la hanche',k:'aine pli devant hanche'},
 {id:'cote',g:'w',t:'Sur le côté de la hanche',k:'cote externe hanche trochanter'},
 {id:'fesse',g:'w',t:'Dans la fesse',k:'fesse fessier derriere'},
 {id:'pubis',g:'w',t:'Au pubis ou à l’intérieur de la cuisse',k:'pubis interieur cuisse adducteur'},
 {id:'dos',g:'w',t:'En bas du dos, d’un seul côté',k:'dos lombaire bassin'},
 {id:'lit',g:'q',t:'Quand je dors sur le côté',k:'dormir nuit lit cote'},
 {id:'assis',g:'q',t:'Quand je reste assis longtemps',k:'assis chaise voiture bureau'},
 {id:'escalier',g:'q',t:'En montant les escaliers',k:'escalier marche monter'},
 {id:'raideur',g:'q',t:'Raideur au lever, difficile de mettre ses chaussettes',k:'raideur lever chaussettes chaussures raide'},
 {id:'claque',g:'q',t:'Ça claque ou ça accroche',k:'claque claquement accroche ressaut craque bloque'},
 {id:'effort',g:'q',t:'En courant ou à l’effort',k:'courir course effort sport marche'},
 {id:'nuit',g:'q',t:'La nuit, même au repos',k:'nuit repos reveille'},
 {id:'descend',g:'q',t:'La douleur descend dans la cuisse ou le genou',k:'descend cuisse genou irradie'},
 {id:'direction',g:'q',t:'En changeant de direction ou en tirant dans un ballon',k:'direction ballon frappe shoot pivot'},
 {id:'instable',g:'q',t:'Impression que la hanche lâche',k:'instable lache instabilite'},
 {id:'fourmi',g:'q',t:'Fourmillements dans la jambe',k:'fourmillements engourdissement sciatique'},
 {id:'boite',g:'q',t:'Je boite ou j’évite d’appuyer',k:'boite boiterie appui poser'},
 {id:'retourne',g:'q',t:'En me retournant dans le lit',k:'retourner retourne lit tourner'}];
const EXTRA={
 coxarthrose:{ns:'Arthrose de la hanche',tags:['aine','raideur','descend','escalier','boite'],fe:['« Ça tire dans l’aine quand je me lève après être resté assis. »','« J’ai du mal à mettre mes chaussettes ou à croiser les jambes. »','« Je démarre raide, puis ça se dégourdit après quelques pas. »']},
 gtps:{ns:'Mal sur le côté de la hanche',tags:['cote','lit','escalier'],fe:['« J’ai mal sur le côté de la hanche, là où l’on pose la main. »','« Impossible de dormir sur ce côté. »','« Ça fait mal quand je reste debout sur une jambe ou que je monte l’escalier. »']},
 cfa:{ns:'Hanche qui se pince',tags:['aine','assis','claque','effort'],fe:['« Je fais un C avec la main autour de la hanche pour montrer où j’ai mal. »','« Ça pince au fond de l’aine quand je ramène le genou vers la poitrine. »','« Je supporte mal la voiture ou le bureau trop longtemps. »']},
 adducteurs:{ns:'Douleur de l’aine, côté intérieur',tags:['pubis','aine','direction','effort'],fe:['« Ça tire à l’intérieur de l’aine quand je change de direction. »','« Tousser ou éternuer fait mal près du pubis. »','« Écarter les jambes devient douloureux. »']},
 psoas:{ns:'Tendon de l’aine qui frotte',tags:['aine','claque','escalier','effort'],fe:['« Je sens un claquement dans le pli de l’aine quand je lève la jambe. »','« Ça fait mal en montant les escaliers ou en sortant de la voiture. »','« Ça tire devant la hanche quand je me redresse. »']},
 piriforme:{ns:'Douleur profonde dans la fesse',tags:['fesse','assis','fourmi','descend','effort'],fe:['« J’ai mal au fond de la fesse, comme une barre. »','« La douleur descend à l’arrière de la cuisse quand je suis assis. »','« Je dois me lever toutes les 20 minutes pour que ça ne s’aggrave pas. »']},
 ischio:{ns:'Mal en bas de la fesse, assis',tags:['fesse','assis','effort'],fe:['« Ça fait mal quand je m’assois sur une chaise dure. »','« Je sens une brûlure en bas de la fesse quand je cours vite. »','« Ça tire quand je me penche pour ramasser quelque chose. »']},
 rectus:{ns:'Mal devant la hanche, haut de cuisse',tags:['aine','effort','direction'],fe:['« Ça tire devant la hanche quand je tape dans un ballon. »','« Lever le genou pour monter un escalier fait mal en haut de la cuisse. »','« Ça fait mal quand je sprinte. »']},
 itb:{ns:'Hanche qui claque sur le côté',tags:['cote','claque','effort'],fe:['« J’entends ou je sens un claquement sur le côté de la hanche quand je marche. »','« Ça frotte sur le côté de la cuisse quand je cours. »','« Je sens la hanche sauter quand je me lève. »']},
 si:{ns:'Douleur du bas du dos et du haut de la fesse',tags:['fesse','dos','retourne','escalier','assis'],fe:['« J’ai mal d’un seul côté, en bas du dos et en haut de la fesse. »','« Je ressens la douleur en me retournant dans le lit. »','« Monter une marche sur la jambe douloureuse est pénible. »']},
 dysplasie:{ns:'Cavité de la hanche trop plate',tags:['aine','instable','effort','cote'],fe:['« J’ai l’impression que la hanche manque de stabilité. »','« L’aine tire après l’effort ou une longue marche. »','« Je me fatigue vite sur le côté de la hanche. »']},
 necrose:{ns:'Os de la tête du fémur mal irrigué',tags:['aine','nuit','boite','fesse'],fe:['« Une douleur est apparue dans l’aine assez vite, sans choc. »','« La nuit, la douleur me réveille. »','« Je boite et j’évite de poser le poids sur cette jambe. »']},
 fracture:{ns:'Petite fracture du col du fémur',tags:['aine','effort','nuit','boite','descend'],fe:['« Ça a commencé à l’effort et ça persiste maintenant au repos. »','« Je dois m’arrêter de courir et la douleur revient de plus en plus tôt. »','« La douleur est dans l’aine ou la cuisse et je boite. »']}};
PATHO.forEach(p=>Object.assign(p,EXTRA[p.id]));
if(HE){PATHO.forEach(p=>{const e=HE.extra[p.id];if(e){p.ns=e.ns;p.fe=e.fe}});SYMS.forEach(s=>{const e=HE.syms[s.id];if(e){s.t=e.t;s.k=e.k}})}
/* terme, définition, expressions repérées dans les textes (expressions régulières, insensibles à la casse) */
const GLOSS=[
 ['Abduction, adduction','Écarter la jambe du corps (abduction), la ramener vers l’intérieur (adduction).',['abduction','adduction']],
 ['Aine','Zone en haut de la cuisse, dans le pli entre le ventre et la cuisse, juste devant l’articulation de la hanche. Une douleur « dans l’aine » vient souvent de la hanche elle-même.',['aine']],
 ['Bourse (bursite)','Petit sac rempli de liquide qui amortit le glissement entre un tendon et l’os. La bursite est son irritation.',['bursite','bourse']],
 ['Cam, pincer','Deux formes de conflit : bosse sur le col du fémur (cam), cotyle trop couvrant (pincer).',['cam','pincer']],
 ['Cotyle','Cavité de l’os du bassin dans laquelle tourne la tête du fémur.',['cotyle']],
 ['Grand trochanter','Bosse osseuse sur le côté de la hanche où s’attachent les fessiers.',['grand trochanter','trochanter']],
 ['Ischio-jambiers','Muscles de l’arrière de la cuisse.',['ischio-jambiers']],
 ['Isométrique','Contraction sans mouvement, par exemple pousser contre un mur.',['isométriques?']],
 ['Labrum','Anneau souple de fibrocartilage qui borde le cotyle et stabilise la hanche.',['labrum']],
 ['Rotation interne, externe','Tourner la pointe du pied vers l’intérieur, vers l’extérieur.',['rotation interne','rotation externe','rotation']],
 ['Tendinopathie','Tendon irrité ou abîmé par des contraintes répétées. Le terme « tendinite » suppose une inflammation, pas toujours présente.',['tendinopathies?']]];
if(HE)GLOSS.splice(0,GLOSS.length,...HE.gloss);
GLOSS.sort((a,b)=>a[0].localeCompare(b[0],window.LANG||'fr'));
/* ===== Exercices : phases 1 douleur vive, 2 reprise, 3 retour au sport ; matériel a=aucun el=élastique ba=ballon bm=banc/mur vp=vélo/piscine ch=charge/rouleau ===== */
const PHASES=['Douleur vive','Reprise','Retour au sport'];
const PHDESC=['Calmer la douleur : mouvements doux et contractions sans mouvement, sans dépasser 3 sur 10.','Renforcer par paliers : plus de séries, plus d’amplitude.','Charges, impacts et gestes du sport, ajoutés un par un.'];
const EQL={el:'Élastique',ba:'Ballon',bm:'Banc ou mur',vp:'Vélo ou piscine',ch:'Haltère ou rouleau'};
if(HE){PHASES.splice(0,PHASES.length,...HE.phases);PHDESC.splice(0,PHDESC.length,...HE.phdesc);Object.assign(EQL,HE.eql)}
const EXM={
 'Pont fessier':{ph:[1,2],eq:'a',dose:'3 × 10',rest:60},
 'Abduction couchée sur le côté':{ph:[2,3],eq:'a',dose:'2 à 3 × 10',rest:45},
 'Vélo d’appartement, résistance faible':{ph:[1,2],eq:'vp',dose:'15 à 20 min',rest:0},
 'Glissement du talon':{ph:[1,2],eq:'a',dose:'10 par côté',rest:30},
 'Isométrique d’abduction contre un mur':{ph:[1,2],eq:'bm',dose:'5 × 30 à 45 s',rest:60,tm:40},
 'Coquille (clamshell)':{ph:[1,2],eq:'a',dose:'3 × 12',rest:45},
 'Planche latérale sur les genoux':{ph:[2],eq:'a',dose:'3 × 20 à 30 s par côté',rest:45,tm:25},
 'Balancier à quatre pattes':{ph:[1,2],eq:'a',dose:'2 × 10',rest:30},
 'Dead bug':{ph:[1,2,3],eq:'a',dose:'3 × 8 par côté',rest:45},
 'Marche latérale avec élastique':{ph:[2,3],eq:'el',dose:'3 × 10 pas',rest:60},
 'Squat à amplitude confortable':{ph:[2,3],eq:'a',dose:'3 × 8',rest:60},
 'Serrage d’un ballon entre les genoux':{ph:[1,2],eq:'ba',dose:'3 × 10 de 5 s',rest:45,tm:5},
 'Copenhagen plank':{ph:[2,3],eq:'bm',dose:'3 × 15 s',rest:60,tm:15},
 'Gainage et dead bug':{ph:[1,2],eq:'a',dose:'3 × 8 par côté',rest:45},
 'Flexion de hanche tenue, assis':{ph:[1,2],eq:'a',dose:'5 × 30 s',rest:45,tm:30},
 'Étirement du psoas en fente':{ph:[2,3],eq:'a',dose:'3 × 30 s',rest:20,tm:30},
 'Flexion de hanche avec élastique':{ph:[2,3],eq:'el',dose:'3 × 10',rest:45},
 'Étirement en « 4 » couché':{ph:[1,2],eq:'a',dose:'3 × 30 s par côté',rest:20,tm:30},
 'Glissement du nerf sciatique':{ph:[1,2],eq:'a',dose:'10 répétitions',rest:30},
 'Pont isométrique, talons sur un banc':{ph:[1,2],eq:'bm',dose:'4 × 30 à 45 s',rest:60,tm:40},
 'Soulevé de terre roumain léger':{ph:[2,3],eq:'ch',dose:'3 × 8',rest:90},
 'Hip thrust progressif':{ph:[2,3],eq:'bm',dose:'3 × 10',rest:60},
 'Étirement du quadriceps debout':{ph:[2,3],eq:'a',dose:'3 × 30 s',rest:20,tm:30},
 'Chaise contre un mur (isométrique)':{ph:[1,2],eq:'bm',dose:'4 × 30 s',rest:60,tm:30},
 'Élévation de jambe tendue':{ph:[1,2],eq:'a',dose:'3 × 10',rest:45},
 'Planche latérale':{ph:[2,3],eq:'a',dose:'3 × 20 à 40 s par côté',rest:45,tm:30},
 'Rouleau de massage sur le côté':{ph:[1,2],eq:'ch',dose:'1 minute',rest:0,tm:60},
 'Étirement du tenseur du fascia lata':{ph:[1,2],eq:'a',dose:'3 × 30 s',rest:20,tm:30},
 'Bascule du bassin couché':{ph:[1,2],eq:'a',dose:'2 × 10',rest:30},
 'Pont fessier avec ballon entre les genoux':{ph:[2],eq:'ba',dose:'3 × 10',rest:45},
 'Respiration et transverse':{ph:[1,2],eq:'a',dose:'10 cycles, 2 fois par jour',rest:0},
 'Gainage ventral':{ph:[2,3],eq:'a',dose:'3 × 20 à 30 s',rest:45,tm:25},
 'Natation ou vélo doux':{ph:[1,2,3],eq:'vp',dose:'20 à 30 min, 2 à 3 fois par semaine',rest:0},
 'Marche avec deux cannes anglaises':{ph:[1],eq:'a',dose:'selon la prescription',rest:0},
 'Vélo sans résistance':{ph:[1],eq:'vp',dose:'10 à 15 min',rest:0},
 'Exercices en piscine':{ph:[1],eq:'vp',dose:'séance encadrée',rest:0}};
/* Vidéos trouvées par recherche YouTube (identifiant et titre repris tels que renvoyés). Les exercices absents gardent un lien de recherche. */
/* Liens directs retirés tant qu'ils ne sont pas vérifiés un par un : voir CONTRIBUTING.md (vidéos). */
const VID={};
/* ===== Scène 3D : utilitaires =====
   Repère : x = médial (+) / latéral (−), y = haut, z = avant. Tête fémorale en (0,0,0), 1 unité ≈ 2,4 cm. */
const T=THREE,V=(x,y,z)=>new T.Vector3(x,y,z),D2=Math.PI*2;
const LAYERS={os:{n:'Os',c:'#e4d9bd',op:1},cart:{n:'Cartilage',c:'#7cc7e3',op:.6},lig:{n:'Ligaments',c:'#d8b45a',op:.8},ten:{n:'Tendons',c:'#efe4c8',op:.92},mus:{n:'Muscles et nerf',c:'#c0665b',op:.2}};
const LV={os:true,cart:true,lig:true,ten:true,mus:true};
const layerName=()=>{if(HE)Object.keys(LAYERS).forEach(k=>{if(HE.layers[k])LAYERS[k].n=HE.layers[k]})};
const S={},root=new T.Group();
const P=V(.8,.58,-.14).normalize();   // axe profond du cotyle (vers le fond de la cavité)
const N=V(-.78,-.55,.29).normalize(); // axe du col fémoral
const Q=(a,b)=>new T.Quaternion().setFromUnitVectors(V(...a).normalize(),(b.isVector3?b:V(...b)).clone().normalize());
const K=v=>()=>v, bel=(w,a=.15,p=.7)=>t=>w*(a+(1-a)*Math.pow(Math.sin(Math.PI*t),p));
function reg(id,label,layer,color,op,ov){
  if(HE&&HE.struct[id])label=HE.struct[id];
  const mat=new T.MeshStandardMaterial({color,roughness:.62,metalness:.02,transparent:true,opacity:op,side:T.DoubleSide});
  return S[id]={id,label,layer,base:new T.Color(color),op:ov?0:op,mat,meshes:[],k:0,ov:!!ov};
}
function put(s,geo,fn){const m=new T.Mesh(geo,s.mat);m.userData.sid=s.id;if(fn)fn(m);root.add(m);s.meshes.push(m);return m}
function mk(pos,idx){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g}
function tube(pts,wf,tf,o={}){
  const seg=o.seg||28,rad=o.rad||14,up=V(...(o.up||[0,0,1])),cv=new T.CatmullRomCurve3(pts.map(p=>V(...p)));
  const pos=[],idx=[],s=new T.Vector3(),n=new T.Vector3();
  for(let i=0;i<=seg;i++){const t=i/seg,c=cv.getPoint(t),tg=cv.getTangent(t);
    s.crossVectors(tg,up);if(s.lengthSq()<1e-4)s.set(1,0,0);s.normalize();n.crossVectors(s,tg).normalize();
    const w=wf(t),h=tf(t);
    for(let j=0;j<rad;j++){const a=j/rad*D2,x=Math.cos(a)*w,y=Math.sin(a)*h;
      pos.push(c.x+s.x*x+n.x*y,c.y+s.y*x+n.y*y,c.z+s.z*x+n.z*y)}}
  for(let i=0;i<seg;i++)for(let j=0;j<rad;j++){const a=i*rad+j,b=i*rad+(j+1)%rad;idx.push(a,a+rad,b,b,a+rad,b+rad)}
  return mk(pos,idx)}
function patch(fn,nu,nv){const pos=[],idx=[];
  for(let i=0;i<=nu;i++)for(let j=0;j<=nv;j++){const p=fn(i/nu,j/nv);pos.push(p.x,p.y,p.z)}
  for(let i=0;i<nu;i++)for(let j=0;j<nv;j++){const a=i*(nv+1)+j,c=a+nv+1;idx.push(a,c,a+1,a+1,c,c+1)}
  return mk(pos,idx)}
function blob(r,sx,sy,sz,x,y,z){const g=new T.SphereGeometry(r,32,20);g.scale(sx,sy,sz);g.translate(x,y,z);return g}
function ringArc(R,tr,arc,dir,pc,gapMode){ // anneau autour de l'axe P ; arc centré sur dir (ou trou centré sur dir)
  const g=new T.TorusGeometry(R,tr,10,56,arc),q=Q([0,0,1],P),l=V(...dir).applyQuaternion(q.clone().invert()),psi=Math.atan2(l.y,l.x);
  g.rotateZ(gapMode?psi+(D2-arc)/2:psi-arc/2);g.applyMatrix4(new T.Matrix4().makeRotationFromQuaternion(q));g.translate(P.x*pc,P.y*pc,P.z*pc);return g}
function cap(r,x,y,z){const g=new T.CircleGeometry(r,24);g.rotateX(Math.PI/2);g.translate(x,y,z);return g}

/* ===== OS ===== */
const bone='#e4d9bd';
let s=reg('tete','Tête du fémur','os',bone,1);
put(s,new T.SphereGeometry(1,48,32));
s=reg('col','Col du fémur','os',bone,1);
put(s,tube([[-.5,-.35,.18],[-1.4,-1,.52],[-2.3,-1.7,.8],[-3,-2.3,.55]],t=>.6+.35*t*t,t=>.52+.3*t*t,{seg:20}));
s=reg('gt','Grand trochanter','os',bone,1);
put(s,blob(1,.75,1.3,.9,-3.5,-1.2,-.3));
s=reg('pt','Petit trochanter','os',bone,1);
put(s,blob(.45,1,1.2,.9,-2.35,-4.3,-.55));
s=reg('diaph','Diaphyse du fémur','os',bone,1);
put(s,tube([[-3.3,-1.6,.1],[-3.2,-4.2,.2],[-2.95,-7,.3],[-2.75,-10,.4]],t=>.8-.14*t,t=>.76-.12*t,{seg:24}));
put(s,cap(.66,-2.75,-10,.4));
s=reg('cotyle','Cotyle (cavité de l\'os iliaque)','os',bone,1);
{const pr=[];[0,.3,.6,.9,1.2,1.47].forEach(a=>pr.push(new T.Vector2(1.13*Math.sin(a),1.13*Math.cos(a))));
 pr.push(new T.Vector2(1.3,.17),new T.Vector2(1.46,.14));
 [1.3,1.1,.85,.6,.3,.01].forEach(b=>pr.push(new T.Vector2(1.62*Math.sin(b),1.62*Math.cos(b))));
 put(s,new T.LatheGeometry(pr,56),m=>m.quaternion.copy(Q([0,1,0],P)))}
s=reg('ilion','Aile iliaque','os',bone,1);
{const L=new T.CatmullRomCurve3([[-.3,1.5,1.4],[-.55,1.45,.5],[-.6,1.5,-.4],[-.1,1.6,-1.1],[.9,1.8,-1.9],[2.2,2.5,-2.5]].map(p=>V(...p)));
 const Up=[[-.9,3.5,1.9],[-1.9,4.7,.9],[-2,5.2,-.3],[-1.2,5,-1.4],[.4,4.5,-2.2],[2.2,3.8,-2.5]],U=new T.CatmullRomCurve3(Up.map(p=>V(...p)));
 put(s,patch((a,v)=>{const l=L.getPoint(a),u=U.getPoint(a),b=-.3*Math.sin(Math.PI*v)*(.5+.5*Math.sin(Math.PI*a));
   return V(l.x*(1-v)+u.x*v+b,l.y*(1-v)+u.y*v,l.z*(1-v)+u.z*v)},36,12));
 put(s,tube(Up,K(.17),K(.17),{seg:40,rad:8}));
 put(s,blob(.24,1,1,1,-.9,3.5,1.9));put(s,blob(.22,1,1,1,-.2,1.5,1.4))}
s=reg('ischion','Ischion et tubérosité ischiatique','os',bone,1);
put(s,tube([[.4,-.7,-.8],[.7,-1.5,-1.3],[.9,-2.1,-1.5]],t=>.65-.05*t,t=>.6-.05*t,{seg:12}));
put(s,blob(.62,1,.85,1,.9,-2.15,-1.5));
s=reg('pubis','Branches du pubis et symphyse','os',bone,1);
put(s,tube([[.5,-.5,.9],[1.3,-.7,1.3],[2.4,-1.1,1.5],[3.3,-1.2,1.6]],t=>.44-.08*t,t=>.4-.08*t,{seg:16}));
put(s,tube([[.9,-2.1,-1.5],[1.7,-2.3,-.6],[2.5,-2.1,.5],[3,-1.6,1.1]],K(.33),K(.3),{seg:18}));
put(s,blob(.5,.8,1.3,.9,3.45,-1.45,1.55));
s=reg('sacrum','Sacrum','os',bone,1);
put(s,tube([[2.7,4.3,-2.5],[3,2.3,-2.8],[3.25,.2,-2.5],[3.5,-1.6,-1.9]],t=>1-.45*t,t=>.5-.2*t,{seg:20}));

/* ===== CARTILAGES ET LABRUM ===== */
s=reg('cart-tete','Cartilage de la tête fémorale','cart','#8fd3ea',.6);
put(s,new T.SphereGeometry(1.045,48,32,0,D2,0,2.05),m=>m.quaternion.copy(Q([0,1,0],P)));
s=reg('cart-cotyle','Cartilage du cotyle','cart','#6fb9d6',.6);
put(s,new T.SphereGeometry(1.09,48,16,0,D2,.38,.95),m=>m.quaternion.copy(Q([0,1,0],P)));
s=reg('labrum','Labrum (bourrelet)','cart','#5ec7a8',.92);
put(s,ringArc(1.16,.13,D2-1,[0,-1,.2],.03,true));

/* ===== ZONES OSSEUSES (apparaissent seulement quand elles sont concernées) ===== */
s=reg('camov','Jonction tête-col (bosse osseuse)','os','#e4d9bd',1,true);
put(s,blob(.36,1,1,1.25,-1.03,-.33,.82));
s=reg('toit','Toit du cotyle (sourcil)','os','#e4d9bd',1,true);
put(s,ringArc(1.3,.2,1.5,[-.3,1,.2],.14,false));
s=reg('fxline','Ligne de fracture du col','os','#e4d9bd',1,true);
{const g=new T.TorusGeometry(.72,.07,8,40);g.applyMatrix4(new T.Matrix4().makeRotationFromQuaternion(Q([0,0,1],N)));g.translate(N.x*2.1,N.y*2.1,N.z*2.1);put(s,g)}
/* ===== LIGAMENTS, BOURSES, TENDONS, MUSCLES, NERF ===== */
LAYERS.lig.n='Ligaments et bourses';
function lig(id,label,paths,w,w2,t,up){const s=reg(id,label,'lig','#d8b45a',.8);
  paths.forEach(p=>put(s,tube(p,u=>w+(w2-w)*u,K(t),{seg:22,rad:10,up})));return s}
function ten(id,label,pts,w,t,up,w2){const s=reg(id,label,'ten','#efe4c8',.92);
  put(s,tube(pts,u=>w+((w2??w)-w)*u,K(t),{seg:18,rad:10,up}));return s}
function mus(id,label,pts,w,t,a,up){const s=reg(id,label,'mus','#c0665b',.2);
  put(s,tube(pts,bel(w,a??.25),bel(t,a??.25),{seg:26,up}));return s}
function sac(id,label,r,sx,sy,sz,x,y,z){const s=reg(id,label,'lig','#9fd0ea',.55);put(s,blob(r,sx,sy,sz,x,y,z));return s}

lig('lig-if','Ligament ilio-fémoral',[[[-.35,1.62,1.35],[-.6,.45,1.1],[-1.5,-.5,1.05],[-2.6,-1.9,.95]]],.3,.62,.07);
lig('lig-pf','Ligament pubo-fémoral',[[[1.1,-.8,1.15],[.1,-1.3,1.1],[-1,-1.8,.8],[-2.2,-2.3,.55]]],.3,.42,.07);
lig('lig-isf','Ligament ischio-fémoral',[[[.7,-1.3,-1.3],[.2,-.2,-1.45],[-.9,.5,-1.2],[-2.3,0,-.7]]],.3,.3,.07);
lig('lig-si','Ligaments sacro-iliaques',[[[2,3.9,-2.9],[2.6,3.4,-3],[3,2.9,-3]],[[2.1,2.6,-2.6],[2.7,2.2,-3],[3.2,1.6,-2.9]]],.3,.3,.06);
sac('burs-troch','Bourse trochantérienne',1,.28,.75,.65,-4.1,-1.1,-.3);
sac('burs-ilio','Bourse ilio-pectinée',1,.3,.7,.22,.3,.5,1.28);

ten('ten-gmed','Tendon du moyen fessier',[[-2.6,1.2,-.55],[-3.3,.2,-.45],[-4,-.55,-.3]],.5,.08,[1,0,0],.38);
ten('ten-gmin','Tendon du petit fessier',[[-2.1,.9,.3],[-2.9,.3,.45],[-3.6,-.5,.5]],.36,.08,[1,0,0],.3);
ten('ten-itb','Bandelette ilio-tibiale',[[-3.1,.4,1],[-4.2,-.4,.7],[-4.65,-1.4,.25],[-4.35,-4,.3],[-3.85,-9.5,.45]],.75,.05,[1,0,0],.6);
ten('ten-rf','Tendon direct du droit fémoral',[[-.15,1.6,1.4],[-.4,.7,1.85]],.28,.12);
ten('ten-psoas','Tendon du psoas-iliaque',[[.9,2,1.35],[.45,.8,1.5],[-.5,-1.2,1.15],[-1.5,-3,.2],[-2.15,-4.05,-.5]],.36,.2);
ten('ten-addl','Tendon du long adducteur',[[2.5,-1.05,1.5],[1.8,-2.4,1.3],[1.4,-3.6,1.1]],.3,.15);
ten('ten-isch','Tendon proximal des ischio-jambiers',[[.9,-2.3,-1.6],[.7,-3.3,-1.8],[.2,-4.4,-1.85]],.38,.28);
ten('ten-piri','Tendon du piriforme',[[-.9,.4,-1.4],[-2.2,.1,-.95],[-3.2,-.3,-.7]],.22,.15);

mus('m-gmed','Moyen fessier',[[-1.3,3.4,-1],[-2,2.2,-.8],[-2.6,1.2,-.55]],.95,.33,.3,[1,0,0]);
mus('m-gmin','Petit fessier',[[-1,2.6,.7],[-1.6,1.7,.55],[-2.1,.9,.3]],.7,.28,.3,[1,0,0]);
mus('m-gmax','Grand fessier',[[1.6,3.2,-2.6],[-.2,1,-2.6],[-1.6,-2.2,-1.9],[-3,-4.2,-1]],1.4,.5,.5);
mus('m-tfl','Tenseur du fascia lata',[[-1,3.3,1.7],[-2,2,1.5],[-3.1,.4,1]],.55,.25,.3,[1,0,0]);
mus('m-rf','Droit fémoral',[[-.4,.7,1.85],[-.9,-1.5,2.15],[-1.4,-5,2.2],[-1.6,-8.5,2]],.7,.55,.35);
mus('m-psoas','Psoas-iliaque',[[1.4,4.3,.6],[1.2,3,1.1],[.9,2,1.35]],.8,.5,.4);
mus('m-addl','Long adducteur',[[1.4,-3.6,1.1],[.3,-6,.9],[-1.8,-8.6,.4]],.6,.35,.3);
mus('m-isch','Ischio-jambiers',[[.2,-4.4,-1.85],[-.6,-6.5,-1.8],[-1.2,-9.5,-1.4]],.85,.55,.3);
mus('m-piri','Piriforme',[[1.8,2,-2.3],[.5,1,-1.8],[-.9,.4,-1.4]],.5,.35,.3);
s=reg('nerf','Nerf sciatique','mus','#e8d36a',.5);
put(s,tube([[1,1.4,-2.45],[.2,-.8,-2.05],[-.7,-3,-1.65],[-1.1,-8,-1.3]],K(.22),K(.22),{seg:24,rad:10}));

Object.values(S).forEach(o=>{o.meshes.forEach(m=>{m.userData.s=o});o.op=LAYERS[o.layer]&&!o.ov?(o.layer==='os'?1:o.op):0});
/* ===== Enveloppe cutanée : hanche, fesse et cuisse, translucide avec contour renforcé ===== */
LAYERS.skin={n:'Peau',c:'#e4b9a1',op:0};LV.skin=true;layerName();
const SK={cx:[1.2,.7,.7,.2,-.05,-.05],cy:[5.4,2.5,-.5,-3.5,-6.5,-10],cz:[-.6,-.95,-1,-.6,-.15,-.2],
  hx:[3.8,4.2,4.2,3.9,3.9,3.8],hz:[3.6,3.9,4.1,3.6,3.45,3.4]};
const along=(a,t)=>{const x=t*(a.length-1),i=Math.min(a.length-2,Math.floor(x)),f=x-i,s=f*f*(3-2*f);return a[i]+(a[i+1]-a[i])*s};
const skinMat=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,
  uniforms:{uC:{value:new T.Color('#e4b9a1')},uA:{value:.26}},
  vertexShader:'varying vec3 vN;varying vec3 vV;varying float vY;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=normalize(-mv.xyz);vY=position.y;gl_Position=projectionMatrix*mv;}',
  fragmentShader:'uniform vec3 uC;uniform float uA;varying vec3 vN;varying vec3 vV;varying float vY;void main(){float f=1.-abs(dot(normalize(vN),normalize(vV)));float rim=pow(f,2.2);float fade=smoothstep(-10.,-7.,vY)*(1.-smoothstep(4.2,5.6,vY));gl_FragColor=vec4(uC*(.6+.4*rim),(uA*.45+rim*uA*1.6)*fade);}'});
const skin=new T.Mesh(tube(SK.cy.map((y,i)=>[SK.cx[i],y,SK.cz[i]]),t=>along(SK.hx,t),t=>along(SK.hz,t),{seg:48,rad:48,up:[0,0,1]}),skinMat);
skin.renderOrder=2;root.add(skin);let skinK=1;
/* ===== Rendu, état, recherche par symptômes, fiches ===== */
const $=id=>document.getElementById(id),cv=$('cv'),view=$('view'),tip=$('tip'),pinsEl=$('pins');
const ren=new T.WebGLRenderer({canvas:cv,antialias:(window.devicePixelRatio||1)<2,alpha:true});
ren.setPixelRatio(Math.min(window.devicePixelRatio||1,2));ren.setClearColor(0,0);
const scene=new T.Scene(),cam=new T.PerspectiveCamera(36,1,.1,100);scene.add(root);
scene.add(new T.HemisphereLight(0xe3ecff,0x2a201b,1.0));
[[0xfff1dd,1.1,-6,8,9],[0x7fb7ff,.5,8,2,-8],[0xffffff,.3,-8,-4,3]].forEach(l=>{const d=new T.DirectionalLight(l[0],l[1]);d.position.set(l[2],l[3],l[4]);scene.add(d)});
const ctl=new T.OrbitControls(cam,cv);ctl.enableDamping=true;ctl.dampingFactor=.08;ctl.minDistance=4;ctl.maxDistance=26;
if(window.ATLAS)window.ATLAS.touchScroll(view,cv,ctl);const hipVis=window.ATLAS?window.ATLAS.watchVisible(view):{on:true};
const HOME={t:V(-1,-.6,.3),o:V(-6,3,10.5)};
let tw=null,aspectK=1;
function fly(t,o){tw={t0:performance.now(),dur:900,t1:t.clone(),o1:o.clone(),ta:ctl.target.clone(),oa:cam.position.clone().sub(ctl.target)}}
function home(){fly(HOME.t,HOME.o.clone().multiplyScalar(aspectK))}
ctl.addEventListener('start',()=>{tw=null});
function fit(){const w=view.clientWidth,h=view.clientHeight;if(!w||!h)return;ren.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();aspectK=Math.max(1,1.1/cam.aspect)*1.4}
new ResizeObserver(fit).observe(view);fit();
ctl.target.copy(HOME.t);cam.position.copy(HOME.t).add(HOME.o.clone().multiplyScalar(aspectK));

/* ----- état ----- */
let hov=null,pinned=null,pinch=false,phase=0,tmr=null,query='',hot=new T.Color('#ff6a3d');
const EQS=new Set(),SEL=new Set(),mv={a:0,b:0,c:0,bump:false,act:false};
const cur=()=>hov||pinned||(pinch?'cfa':null);
const title=p=>p.n; // titre d’origine ; le sous-titre en langage courant est p.ns
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const yt=q=>'https://www.youtube.com/results?search_query='+encodeURIComponent(q);
const PLAY='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3z"/></svg>';

/* ----- couches ----- */
Object.entries(LAYERS).forEach(([k,L])=>{const b=document.createElement('button');b.type='button';b.className='chip';b.style.setProperty('--c',L.c);
  b.setAttribute('aria-pressed','true');b.innerHTML='<i></i>'+L.n;b.onclick=()=>{LV[k]=!LV[k];b.setAttribute('aria-pressed',String(LV[k]))};$('layers').appendChild(b)});

/* ----- liste, recherche, vocabulaire ----- */
PATHO.forEach(p=>{const li=document.createElement('li'),b=document.createElement('button');b.type='button';b.className='item';b.style.setProperty('--c',p.col);
  b.title=U.freqIdx(p.pop);
  b.innerHTML='<span class="rk"><i></i>'+p.rank+'</span><span class="nm"><span class="tt">'+p.ns+'</span><small class="mb"></small></span><span class="ns">'+title(p)+(window.freqWord?' · '+window.freqWord(p.pop):'')+'</span>';
  b.onmouseenter=b.onfocus=()=>setHover(p.id);b.onmouseleave=b.onblur=()=>setHover(null);b.onclick=()=>pin(p.id);
  li.appendChild(b);$('plist').appendChild(li);p.itemEl=b});
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');
const STOP=new Set(['mal','dans','les','des','une','sur','quand','avec','pour','que','qui','mes','mon','pas','est','mais','tres','plus','comme','hanche','douleur']);
function score(p){const q=norm(query).split(/[^a-z0-9]+/).filter(w=>w.length>2&&!STOP.has(w)),tg=new Set(SEL);
  q.forEach(w=>SYMS.forEach(s=>{if(norm(s.t+' '+s.k).includes(w))tg.add(s.id)}));
  let sc=0;p.tags.forEach(t=>{if(tg.has(t))sc++});
  const nm=norm(p.n+' '+p.ns+' '+p.al),fe=norm(p.fe.join(' '));
  q.forEach(w=>{if(nm.includes(w))sc+=2;else if(fe.includes(w))sc+=1});return sc}
/* filtre sans classement : l'ordre de la liste ne change pas, les fiches qui ne mentionnent pas ces repères sont atténuées */
function reorder(){const act=SEL.size>0||norm(query).trim().length>2,sc=new Map(PATHO.map(p=>[p,act?score(p):0]));
  PATHO.forEach(p=>{p.itemEl.classList.toggle('dim',act&&sc.get(p)===0);p.itemEl.querySelector('.mb').textContent=''});
  const n=PATHO.filter(p=>sc.get(p)>0).length;
  $('sres').textContent=act?(n?U.match(n):U.noMatch):''}
SYMS.forEach(s=>{const b=document.createElement('button');b.type='button';b.className='chip';b.setAttribute('aria-pressed','false');b.textContent=s.t;
  b.onclick=()=>{SEL.has(s.id)?SEL.delete(s.id):SEL.add(s.id);b.setAttribute('aria-pressed',String(SEL.has(s.id)));reorder()};$(s.g==='w'?'tw':'tq').appendChild(b)});
$('q').oninput=e=>{query=e.target.value;reorder()};
/* ----- mots utiles : liste, raccourcis, liens dans les textes ----- */
$('glo').innerHTML=GLOSS.map(g=>'<dt data-t="'+g[0]+'">'+g[0]+'</dt><dd>'+g[1]+'</dd>').join('');
const reduceMotion=matchMedia('(prefers-reduced-motion:reduce)').matches;
function openGloss(term){const d=$('gd');d.open=true;const t=[...document.querySelectorAll('#glo dt')].find(x=>x.dataset.t===term);
  (t||d).scrollIntoView({behavior:reduceMotion?'auto':'smooth',block:t?'center':'start'});
  if(t){t.classList.add('flash');setTimeout(()=>t.classList.remove('flash'),2000)}else d.querySelector('summary').focus({preventScroll:true})}
function linkTerms(s,used){let out=s;
  GLOSS.forEach(g=>{if(used.has(g[0]))return;const re=new RegExp('(^|[^\\p{L}])('+g[2].join('|')+')(?=[^\\p{L}]|$)','iu'),m=re.exec(out);if(!m)return;
    used.add(g[0]);const i=m.index+m[1].length;
    out=out.slice(0,i)+'<button type="button" class="tl" data-g="'+g[0]+'" title="'+U.seeDef+'">'+m[2]+'</button>'+out.slice(i+m[2].length)});
  return out}
$('gbtn').onclick=()=>openGloss('*');

/* ----- repères numérotés ----- */
PATHO.forEach(p=>{const b=document.createElement('button');b.type='button';b.className='pin';b.style.setProperty('--c',p.col);b.textContent=p.rank;
  b.setAttribute('aria-label',p.n);p.a3=V(...p.anchor);p.pinEl=b;
  b.onmouseenter=()=>setHover(p.id);b.onmouseleave=()=>setHover(null);b.onclick=()=>pin(p.id);pinsEl.appendChild(b)});
function setHover(id){if(hov===id)return;hov=id;sync()}
function sync(){PATHO.forEach(p=>{p.itemEl.classList.toggle('hov',hov===p.id);p.itemEl.classList.toggle('on',pinned===p.id);p.itemEl.setAttribute('aria-pressed',String(pinned===p.id));
  p.pinEl.classList.toggle('hov',hov===p.id);p.pinEl.classList.toggle('on',pinned===p.id)})}
function pin(id){pinned=id;hov=null;sync();panel();const p=BY[id];
  fly(HOME.t.clone().lerp(p.a3,.55),V(...p.view).multiplyScalar(aspectK));try{history.replaceState(null,'','#hanche/'+id)}catch(e){}}
function unpin(){pinned=null;sync();panel();home();try{history.replaceState(null,'','#hanche')}catch(e){}}

/* ----- fiche et exercices ----- */
function exHTML(p){
  const list=p.ex.filter(e=>{const m=EXM[e.k]||{ph:[1,2,3],eq:'a'};return(!phase||m.ph.includes(phase))&&(!EQS.size||m.eq==='a'||EQS.has(m.eq))});
  if(!list.length)return '<p class="rule">'+U.noEx+'</p>';
  return list.map(e=>{const m=EXM[e.k]||{ph:[],eq:'a',dose:'',rest:0},v=VID[e.k],dose=HE&&HE.dose[m.dose]||m.dose;
    const link=v?'<a class="yt" href="https://www.youtube.com/watch?v='+v.id+'" target="_blank" rel="noopener noreferrer">'+PLAY+U.video+esc(v.t)+'</a>'
      :'<a class="yt" href="'+yt(e.q)+'" target="_blank" rel="noopener noreferrer">'+PLAY+U.search+'<span class="sr"> : '+e.n+U.newTab+'</span></a> <span class="sm">'+U.unverified+'</span>';
    return '<div class="ex"><h4>'+e.n+'</h4><p>'+e.d+'</p><div class="mt"><span>'+dose+'</span>'+(m.rest?'<span>'+U.rest+m.rest+' s</span>':'')
      +'<span>'+m.ph.map(i=>PHASES[i-1]).join(' · ')+'</span>'+(m.eq!=='a'?'<span>'+EQL[m.eq]+'</span>':'')+'</div><div class="act">'
      +(m.tm?'<button type="button" class="tm" data-tm="'+m.tm+'">'+U.timer+m.tm+' s</button>':'')+link+'</div></div>'}).join('')}
function panel(){const d=$('detail'),p=BY[pinned];stopT();
  if(!p){d.innerHTML=U.howTo;return}
  d.style.setProperty('--c',p.col);
  const used=new Set(),lk=s=>linkTerms(s,used);
  const chips=p.zones.concat(p.also||[]).map(z=>'<span class="zc">'+S[z].label+'</span>').join('');
  const bt=(a,t,on)=>'<button type="button" class="chip" '+a+' aria-pressed="'+on+'">'+t+'</button>';
  d.innerHTML='<span class="tag"><i></i>'+NO+p.rank+' · '+(window.freqWord?window.freqWord(p.pop):'')+'</span><h2 tabindex="-1">'+p.ns+'</h2><p class="sub2">'+title(p)+'</p><p class="alias">'+U.aka+p.al+'</p><p class="rev">'+U.rev+'</p>'+(window.warnHTML?window.warnHTML(p.warn):'<div class="warn">'+p.warn+'</div>')+'<h3>'+U.what+'</h3><p>'+lk(p.txt)+'</p><div class="chips"><span class="sm">'+U.structs+'</span> '+chips+'</div>'
   +'<h3>'+U.feel+'</h3><ul class="fe">'+p.fe.map(f=>'<li>'+lk(f)+'</li>').join('')+'</ul><p>'+lk(p.pain)+'</p><p>'+lk(p.who)+'</p>'
   +'<h3>'+U.exH+'</h3><p class="sm">'+U.exNote+'</p><div class="tags" id="phs">'+[U.allStages].concat(PHASES).map((t,i)=>bt('data-ph="'+i+'"',t,phase===i)).join('')+'</div><p class="sm" id="phd">'+(phase?PHDESC[phase-1]:'')+'</p>'
   +'<div class="tags" id="eqs"><span class="sm">'+U.equip+'</span>'+Object.entries(EQL).map(([k,t])=>bt('data-eq="'+k+'"',t,EQS.has(k))).join('')+'</div>'
   +'<div class="rule'+(p.rule==='avis'?' avis':'')+'">'+(window.PAIN_RULES?(Object.hasOwn(window.PAIN_RULES,p.rule)?window.PAIN_RULES[p.rule]:window.PAIN_RULES.standard):'')+'</div>'
   +'<div id="exs">'+exHTML(p)+'</div>'+(window.fixLinkHTML?window.fixLinkHTML(HE?'Hip':'Hanche',p.n):'')+'<p>'+bt('id="back" style="--c:var(--cool)"',U.back,false)+' '+bt('data-g="*" style="--c:var(--cool)"',U.words,false)+'</p>'}
$('detail').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.g){openGloss(b.dataset.g);return}const p=BY[pinned];if(!p)return;
  if(b.dataset.ph!==undefined){phase=+b.dataset.ph;document.querySelectorAll('#phs button').forEach(x=>x.setAttribute('aria-pressed',String(+x.dataset.ph===phase)));$('phd').textContent=phase?PHDESC[phase-1]:'';stopT();$('exs').innerHTML=exHTML(p)}
  else if(b.dataset.eq){const k=b.dataset.eq;EQS.has(k)?EQS.delete(k):EQS.add(k);b.setAttribute('aria-pressed',String(EQS.has(k)));stopT();$('exs').innerHTML=exHTML(p)}
  else if(b.dataset.tm)timer(b);else if(b.id==='back')unpin()});
function stopT(){if(tmr){clearInterval(tmr.i);tmr.b.textContent=tmr.l;tmr.b.classList.remove('run');tmr=null}}
function beep(){try{const a=new(window.AudioContext||window.webkitAudioContext)(),o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);o.frequency.value=880;g.gain.value=.15;o.start();o.stop(a.currentTime+.4)}catch(e){}}
function timer(b){if(tmr&&tmr.b===b){stopT();return}stopT();let n=+b.dataset.tm;tmr={b,l:b.textContent,i:setInterval(()=>{n--;b.textContent=n+' s';if(n<=0){beep();stopT()}},1000)};b.classList.add('run');b.textContent=n+' s'}
panel();reorder();
addEventListener('keydown',e=>{if($('hipview').hidden)return;if(e.key==='Escape'&&pinned)unpin();
  if((e.key==='g'||e.key==='G'||e.key==='?')&&!e.ctrlKey&&!e.metaKey&&!e.altKey&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))openGloss('*')});
/* ===== Sélection à la souris ===== */
const ray=new T.Raycaster(),pt=new T.Vector2();
const allMeshes=()=>Object.values(S).filter(s=>!s.nopick).flatMap(s=>s.meshes).filter(m=>m.visible&&m.material.opacity>.1);
function pick(e){const r=cv.getBoundingClientRect();pt.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(pt,cam);
  const hits=ray.intersectObjects(allMeshes(),false);
  const h=hits.find(x=>OF[x.object.userData.sid]&&x.object.material.opacity>.1)||hits.find(x=>x.object.material.opacity>.5);
  return h?S[h.object.userData.sid]:null}
function showTip(s,e){if(!s){tip.hidden=true;return}
  const l=OF[s.id];tip.innerHTML='<b>'+s.label+'</b><em>'+(l?l.map(title).slice(0,2).join(' · ')+(l.length>2?' …':'')+U.clickEx:U.landmark)+'</em>';
  tip.hidden=false;const r=view.getBoundingClientRect();let x=e.clientX-r.left+14,y=e.clientY-r.top+14;
  x=Math.min(x,r.width-tip.offsetWidth-8);y=Math.min(y,r.height-tip.offsetHeight-8);tip.style.left=Math.max(6,x)+'px';tip.style.top=Math.max(6,y)+'px'}
let down=null;
cv.addEventListener('pointerdown',e=>{down={x:e.clientX,y:e.clientY}});
let pq=null;const doMove=e=>{const s=pick(e);showTip(s,e);cv.style.cursor=s&&OF[s.id]?'pointer':'grab';setHover(s&&OF[s.id]?OF[s.id][0].id:null)};
cv.addEventListener('pointermove',e=>{if(e.buttons||e.pointerType!=='mouse')return;if(pq){pq=e;return}pq=e;requestAnimationFrame(()=>{const ev=pq;pq=null;doMove(ev)})});
cv.addEventListener('pointerleave',()=>{tip.hidden=true;setHover(null)});
cv.addEventListener('pointerup',e=>{if(!down)return;const moved=Math.hypot(e.clientX-down.x,e.clientY-down.y);down=null;if(moved>6)return;
  const s=pick(e);if(s&&OF[s.id])pin(OF[s.id][0].id);else if(e.pointerType!=='mouse')showTip(s,e)});

/* ===== Points de vue ===== */
const VIEWS={face:V(-6,3,10.5),cote:V(-12.5,2,1.5),dos:V(3.5,3,-11)};
const setView=v=>document.querySelectorAll('#views button').forEach(x=>x.setAttribute('aria-pressed',String(x.dataset.v===v)));
document.querySelectorAll('#views button').forEach(b=>b.onclick=()=>{fly(HOME.t,VIEWS[b.dataset.v].clone().multiplyScalar(aspectK));setView(b.dataset.v)});
$('reset').onclick=()=>{home();setView('face')};

/* ===== Mouvement : le fémur pivote autour du centre de la tête ===== */
const FEM=['tete','col','gt','pt','diaph','cart-tete','camov','fxline'],femG=new T.Group();root.add(femG);
FEM.forEach(id=>S[id].meshes.forEach(m=>femG.add(m)));
const BUMP=V(-1.03,-.33,.82),e1=new T.Vector3().crossVectors(P,V(0,1,0)).normalize(),e2=new T.Vector3().crossVectors(P,e1).normalize(),RIM=[];
for(let i=0;i<72;i++){const a=i/72*D2;RIM.push(P.clone().multiplyScalar(.03).addScaledVector(e1,1.16*Math.cos(a)).addScaledVector(e2,1.16*Math.sin(a)))}
const rad=d=>d*Math.PI/180,AX=V(1,0,0),AY=V(0,1,0),AZ=V(0,0,1);
const qa=(ax,a)=>new T.Quaternion().setFromAxisAngle(ax,a);
const quat=(fl,ab,ro)=>qa(AZ,-rad(ab)).multiply(qa(AX,-rad(fl))).multiply(qa(AY,rad(ro)));
function clear(fl,ab,ro){const c=BUMP.clone().applyQuaternion(quat(fl,ab,ro));let m=9;RIM.forEach(r=>{m=Math.min(m,c.distanceTo(r))});return m-.55} // 0,42 bosse + 0,13 labrum
const clipP=new T.Plane(V(0,0,-1),3.5);
function upd(){const fl=+$('r1').value,ab=+$('r2').value,ro=+$('r3').value,cut=+$('r4').value/10;
  mv.bump=$('bump').checked;mv.act=!!(fl||ab||ro||mv.bump);
  $('o1').textContent=fl+'°';$('o2').textContent=ab+'°';$('o3').textContent=ro+'°';$('o4').textContent=cut>=3.4?U.none:U.active;
  femG.quaternion.copy(quat(fl,ab,ro));ren.clippingPlanes=cut>=3.4?[]:[clipP];clipP.constant=cut;
  const m=$('mst');let pc=false;
  if(mv.bump){pc=clear(fl,ab,ro)<0;let lim=null;for(let f=0;f<=130;f++){if(clear(f,ab,ro)<0){lim=f;break}}
    m.textContent=pc?U.contact(lim):lim===null?U.noContact:U.notYet(lim);m.className='mst'+(pc?' bad':'')}
  else{m.textContent=U.healthy;m.className='mst'}
  pinch=pc}
['r1','r2','r3','r4','bump'].forEach(id=>$(id).oninput=upd);
function mvReset(){$('r1').value=0;$('r2').value=0;$('r3').value=0;$('r4').value=35;$('bump').checked=false;upd()}
$('mvr').onclick=mvReset;
$('mvb').onclick=()=>{const open=$('mv').hidden;$('mv').hidden=!open;$('mvb').setAttribute('aria-expanded',String(open));if(!open)mvReset()};
upd();

/* ===== Boucle de rendu ===== */
let last=performance.now(),fc=0;
function frame(now){requestAnimationFrame(frame);if($('hipview').hidden||!hipVis.on){last=now;return}const dt=Math.min(.05,(now-last)/1000);last=now;
  const a=BY[cur()];if(a)hot.copy(a.hex);
  Object.values(S).forEach(s=>{
    const aff=!!a&&(a.zones.includes(s.id)||(a.also||[]).includes(s.id));
    s.k+=((aff?1:0)-s.k)*Math.min(1,dt*9);
    const softOff=mv.act&&(s.layer==='lig'||s.layer==='ten'||s.layer==='mus');
    let b=s.ov?(s.id==='camov'&&mv.bump?1:0):(LV[s.layer]&&!softOff?s.op:0);
    if(a&&!aff)b*=s.layer==='os'?.4:.3;
    const op=b+(1-b)*s.k,m=s.mat;m.opacity=op;m.depthWrite=op>.85;
    m.color.copy(s.base).lerp(hot,s.k);m.emissive.copy(hot).multiplyScalar(s.k*(.3+.18*Math.sin(now*.005)));
    s.meshes.forEach(x=>{x.visible=op>.03})});
  const want=!LV.skin||ren.clippingPlanes.length?0:(cur()?0.04:(mv.act?.3:1));
  skinK+=(want-skinK)*Math.min(1,dt*6);skin.visible=skinK>.01;skinMat.uniforms.uA.value=.26*skinK;
  if(tw){const k=Math.min(1,(now-tw.t0)/tw.dur),e=k*k*(3-2*k),t=tw.ta.clone().lerp(tw.t1,e),o=tw.oa.clone().lerp(tw.o1,e);
    ctl.target.copy(t);cam.position.copy(t).add(o);if(k>=1)tw=null}
  ctl.update();ren.render(scene,cam);
  const w=view.clientWidth,h=view.clientHeight,doOcc=++fc%6===0;
  let solid=null;if(doOcc)solid=allMeshes().filter(m=>S[m.userData.sid].layer==='os'&&!S[m.userData.sid].ov&&m.material.opacity>.8);
  PATHO.forEach(p=>{const v=p.a3.clone().project(cam);p.pinEl.style.transform='translate('+((v.x*.5+.5)*w).toFixed(1)+'px,'+((-v.y*.5+.5)*h).toFixed(1)+'px)';p.pinEl.hidden=v.z>1||mv.act;
    if(doOcc){const d=p.a3.clone().sub(cam.position),L=d.length();ray.set(cam.position,d.normalize());const hh=ray.intersectObjects(solid,false)[0];p.pinEl.classList.toggle('occ',!!hh&&hh.distance<L-.35)}})}
requestAnimationFrame(frame);
const h0=location.hash.replace(/^#(hanche\/?)?/,'');if(BY[h0])pin(h0);
/* ===== Modèle anatomique réel (Z-Anatomy / BodyParts3D), chargé après coup ; les formes procédurales servent de repli ===== */
const NOPICK=['m-ctx','capsule'];
function useModel(buf){
  const jl=new DataView(buf).getUint32(0,true),h=JSON.parse(new TextDecoder().decode(new Uint8Array(buf,4,jl))),base=4+jl,got={};
  (h.new||[]).forEach(n=>{if(!S[n.id])reg(n.id,n.label,n.layer,n.color,n.op)});
  h.m.forEach(m=>{const q=new Int16Array(buf,base+m.o,m.nv*3),p=new Float32Array(m.nv*3);
    for(let i=0;i<p.length;i++)p[i]=m.b[i%3]+q[i]*m.s[i%3];
    const g=new T.BufferGeometry();g.setAttribute('position',new T.BufferAttribute(p,3));
    g.setIndex(new T.BufferAttribute(new Uint16Array(buf,base+m.o+((m.nv*6+3)&~3),m.ni),1));g.computeVertexNormals();
    (got[m.id]=got[m.id]||[]).push(g)});
  Object.keys(got).forEach(id=>{const s=S[id];if(!s)return;
    s.meshes.forEach(x=>{if(x.parent)x.parent.remove(x);x.geometry.dispose()});s.meshes=[];
    got[id].forEach(g=>{const m=new T.Mesh(g,s.mat);m.userData.sid=id;m.userData.s=s;(FEM.includes(id)?femG:root).add(m);s.meshes.push(m)});
    if(NOPICK.includes(id))s.nopick=true});
  if(h.nerve&&S.nerf){const s=S.nerf;s.meshes.forEach(x=>{x.parent.remove(x);x.geometry.dispose()});s.meshes=[];
    const m=put(s,tube(h.nerve,K(.2),K(.2),{seg:32,rad:10}));m.userData.s=s}
  /* repères numérotés : centre de la première zone de chaque pathologie */
  PATHO.forEach(p=>{const s=S[p.zones[0]];if(!s||!s.meshes.length)return;
    const b=new T.Box3();s.meshes.forEach(m=>{m.geometry.computeBoundingBox();b.union(m.geometry.boundingBox)});
    p.a3=b.getCenter(new T.Vector3())});
  /* réglage de la transparence : le modèle réel est bien plus dense que le schéma */
  Object.values(S).forEach(s=>{if(s.layer==='mus'&&s.id!=='nerf'){s.op=s.id==='m-ctx'?.05:.09;s.mat.side=T.FrontSide}});
  S['ten-itb'].op=.3;S['ten-itb'].mat.side=T.FrontSide;if(S.capsule){S.capsule.op=.1;S.capsule.mat.side=T.FrontSide}
  document.body.classList.add('real');
}
if(typeof fetch==='function')fetch('models/hip.b64.txt').then(r=>{if(!r.ok)throw 0;return r.text()}).then(t=>{const s=atob(t.trim()),u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);useModel(u.buffer)}).catch(()=>{});

return {pin:pin,has:id=>!!BY[id]};
};
