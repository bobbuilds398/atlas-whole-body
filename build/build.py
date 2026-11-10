import re
W='/tmp/claude-0/-home-claude/b309af02-d556-598f-9517-fe97b5f199d6/scratchpad/'
s=open(W+'artifact-files/aa353c42-e316-403f-8129-61e03c078d22/index.html',encoding='utf8').read()
css=re.findall(r'<style>(.*?)</style>',s,re.S)[1]
i=s.index('<header class="top">');j=s.index('<script src=')
hipdom=s[i:j]
hipjs=s[s.rindex('<script>')+8:s.rindex('</script>')]
assert hipjs.lstrip().startswith("'use strict'")
# --- vue hanche : même en-tête que les autres articulations, liste des douleurs d'abord, questions ensuite
hipdom,n=re.subn(r'<div>\s*<h1>Atlas de la hanche</h1>\s*<p class="sub">.*?</p>\s*</div>','',hipdom,flags=re.S);assert n==1
m=re.search(r'(\s*<div class="sx">.*?<p class="sm" id="sres" aria-live="polite"></p>\s*</div>)(\s*<ol id="plist"></ol>)',hipdom,re.S);assert m
hipdom=hipdom.replace(m.group(0),m.group(2)+'\n    <details class="glo ask" open><summary>Trouver par ce que l’on ressent</summary>'+m.group(1)+'\n    </details>')
a="function frame(now){requestAnimationFrame(frame);";assert hipjs.count(a)==1
hipjs=hipjs.replace(a,a+"if($('hipview').hidden){last=now;return}")
a="addEventListener('keydown',e=>{";assert hipjs.count(a)==1
hipjs=hipjs.replace(a,a+"if($('hipview').hidden)return;")
assert 'function pin(id)' in hipjs
hipjs="window.startHip=function(){\n"+hipjs+"\nreturn {pin:pin};\n};"
extra='''
/* ===== Vues corps entier et articulations : mêmes jetons et mêmes composants que l'atlas de la hanche ===== */
#g-top{margin-bottom:10px}
#hipview .top{justify-content:flex-start;margin-bottom:12px}
#b-layers{margin:0 auto 12px;max-width:1520px}
#b-cv{position:absolute;inset:0;width:100%;height:100%;display:block;touch-action:none;cursor:grab}
#b-cv:active{cursor:grabbing}
#b-pins{position:absolute;inset:0;pointer-events:none;overflow:hidden}
#b-lead{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;stroke-width:1.5}
#b-reset{position:absolute;right:10px;top:10px;background:rgba(8,13,19,.8);color:var(--fg);border:1px solid var(--line);border-radius:8px;padding:6px 11px;font:500 12px var(--f-body);cursor:pointer}
#b-load{position:absolute;left:12px;right:12px;top:52px;color:var(--muted);font-size:12px;pointer-events:none}
#b-list{list-style:none;margin:0;padding:0}
#b-list .rk{grid-row:span 3}
.jl{color:var(--muted);font-size:12px;line-height:1.3}
.jl b{color:var(--fg);font-weight:600;font-variant-numeric:tabular-nums}
.ask .sx{padding:0}
.ask .tags{margin-bottom:4px}
.fig{border:1px solid var(--line);border-left:3px solid var(--c);background:var(--panel-2);border-radius:8px;padding:10px 12px;margin:10px 0}
.fig strong{display:block;font:700 26px/1.1 var(--f-display);font-variant-numeric:tabular-nums}
.fig span{font:500 11px var(--f-mono);letter-spacing:.08em;text-transform:uppercase;color:var(--muted)}
.detail .fig p{margin:6px 0 0;font-size:12.5px;color:var(--muted)}
.open{display:block;width:100%;margin-top:12px;background:var(--cool);color:#08121a;border:0;border-radius:8px;padding:10px 12px;font:600 14px var(--f-body);cursor:pointer}
.open:hover{filter:brightness(1.08)}
#b-src .yt{font-weight:500;font-size:12px}
.pin.on{box-shadow:0 0 0 4px color-mix(in srgb,var(--c) 40%,transparent)}
'''
top='''<header class="top" id="g-top">
  <div>
    <h1>Atlas du corps</h1>
    <p class="sub" id="g-sub">Squelette entier vu de face · les douleurs les plus fréquentes, classées par nombre de personnes concernées</p>
  </div>
  <div class="tr"><div class="layers" id="b-joints" role="group" aria-label="Articulation affichée"></div></div>
</header>
'''
body_dom='''<div id="bodyview">
<div class="layers" id="b-layers" role="group" aria-label="Couches anatomiques affichées" hidden></div>
<main class="app">
  <section class="list" aria-label="Douleurs classées par fréquence">
    <h2 id="b-lh">Douleurs les plus fréquentes</h2>
    <p class="note" id="b-ln"></p>
    <ol id="b-list"></ol>
    <details class="glo ask" id="b-q" open hidden><summary>Trouver par ce que l’on ressent</summary>
      <p class="gl-h">Où avez-vous mal ?</p><div class="tags" id="b-tw"></div>
      <p class="gl-h">Quand et comment ?</p><div class="tags" id="b-tq"></div>
      <p class="sm" id="b-sres" aria-live="polite"></p>
    </details>
  </section>
  <section class="view" id="b-view">
    <canvas id="b-cv" aria-label="Modèle anatomique en 3D"></canvas>
    <svg id="b-lead" aria-hidden="true"></svg>
    <div id="b-pins"></div>
    <div class="tb"><div class="seg" id="b-views" role="group" aria-label="Point de vue"><button type="button" data-v="face">Face</button><button type="button" data-v="cote">Côté</button><button type="button" data-v="dos">Dos</button><button type="button" data-v="dedans">Dedans</button></div></div>
    <p id="b-load">Chargement du squelette…</p>
    <div class="tip" id="b-tip" hidden></div>
    <div class="hint" id="b-hint"></div>
    <button id="b-reset" type="button" hidden>Recentrer</button>
  </section>
  <aside class="detail" id="b-detail" aria-live="polite"></aside>
</main>
<p class="foot">Sources des chiffres du corps entier : <span id="b-src"></span>. Les parts « sur 100 » tirées des totaux mondiaux sont rapportées à 7,8 milliards d’habitants. Dans chaque articulation, le classement des douleurs est indicatif. Anatomie 3D : formes issues de Z-Anatomy (CC BY-SA 4.0, Gauthier Kervyn et al.), elles-mêmes dérivées de BodyParts3D (© Database Center for Life Science, CC BY-SA 2.1 Japon). Modèle d’un seul individu, simplifié : il ne remplace pas une imagerie. Contenu informatif : il ne remplace pas l’avis d’un médecin ou d’un kinésithérapeute. Les liens vidéo ouvrent une recherche YouTube, à vous de vérifier que la vidéo correspond à votre cas.</p>
</div>
'''
head=s[s.index('<title>'):s.index('<style>',s.index('<title>'))].replace('<title>Atlas de la hanche</title>','<title>Atlas du corps</title>')
out=head+'<style>'+css+extra+'</style>\n'+top+body_dom+'<div id="hipview" hidden>\n'+hipdom+'</div>\n'
out+='<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/build/three.min.js"></script>\n<script src="https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js"></script>\n'
import json
bodyjs=open(W+'work/body.js',encoding='utf8').read().replace('__ANCH__',json.dumps(json.load(open(W+'work/anch.json'))['anch']))
out+='<script>\n'+hipjs+'\n</script>\n<script>\n'+bodyjs+'\n</script>\n'
open(W+'work/site/index.html','w',encoding='utf8').write(out)
print(len(out))
