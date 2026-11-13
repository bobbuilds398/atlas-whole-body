/* Atlas du corps — vue corps entier et vues d'articulation.
   Les textes (fiches, exercices, questions, chiffres) sont dans content/*.json ; la géométrie et le placement des douleurs dans models/*.b64.txt.
   La hanche a son propre moteur : js/hip.js. Voir CONTRIBUTING.md. */
(function () {
  'use strict';
  const L = window.L10N;
  const esc = s =>
    String(s == null ? '' : s).replace(
      /[&<>"']/g,
      c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
    );
  const url = u => (/^https:\/\/[^\s"'<>]+$/.test(String(u || '')) ? String(u) : '#');
  const REPO = 'https://github.com/bobbuilds398/atlas-whole-body';
  const NEW_TAB = '<span class="sr">' + L.newTab + '</span>';
  const PAIN_RULES = L.rules;
  /* niveau d'urgence lu dans le texte de la fiche (expressions propres à chaque langue, voir js/i18n.js) */
  const urgency = t => (L.urgent.test(t) ? 'urgent' : L.rapide.test(t) ? 'rapide' : 'info');
  const URG_LABEL = L.urgLabel;
  window.ATLAS = {
    esc,
    url,
    REPO,
    NEW_TAB,
    PAIN_RULES,
    ruleHTML: r =>
      '<div class="rule' + (r === 'avis' ? ' avis' : '') + '">' + (PAIN_RULES[r] || PAIN_RULES.standard) + '</div>',
    warnHTML: t => {
      const u = urgency(t || '');
      return (
        '<section class="warn ' +
        u +
        '" aria-label="' +
        URG_LABEL[u] +
        '"><h3><span aria-hidden="true">' +
        (u === 'info' ? 'ℹ' : '⚠') +
        '</span> ' +
        URG_LABEL[u] +
        '</h3><p>' +
        esc(t) +
        '</p>' +
        (u === 'urgent' ? '<p class="call">' + L.call + '</p>' : '') +
        '</section>'
      );
    },
    fixLinkHTML: (art, fiche) =>
      '<p class="fix">' +
      L.fixQ +
      ' <a href="' +
      REPO +
      '/issues/new?template=correction.yml&amp;title=' +
      encodeURIComponent('Correction : ' + fiche + ' (' + art + ')') +
      '&amp;articulation=' +
      encodeURIComponent(art) +
      '&amp;fiche=' +
      encodeURIComponent(fiche) +
      '" target="_blank" rel="noopener">' +
      L.fixA +
      NEW_TAB +
      '</a> <span class="sm">' +
      L.fixNote +
      '</span></p>',
    freqWord: pop => L.freq[pop >= 70 ? 0 : pop >= 40 ? 1 : pop >= 15 ? 2 : 3],
    reduceMotion: () => !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches),
    coarse: () => !!(window.matchMedia && matchMedia('(hover: none), (pointer: coarse)').matches),
    /* téléphone : un doigt fait défiler la page, deux doigts tournent et zooment le modèle */
    touchScroll: (view, canvas, ctl) => {
      canvas.style.touchAction = 'pan-y';
      const stop = e => {
        if (e.touches && e.touches.length < 2) e.stopPropagation();
      };
      view.addEventListener('touchstart', stop, { capture: true, passive: true });
      view.addEventListener('touchmove', stop, { capture: true, passive: true });
      if (ctl && ctl.touches && window.THREE) ctl.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
    },
    /* rendu suspendu quand le modèle n'est pas à l'écran */
    watchVisible: el => {
      const st = { on: true };
      if ('IntersectionObserver' in window)
        new IntersectionObserver(e => (st.on = e[e.length - 1].isIntersecting)).observe(el);
      return st;
    },
  };
  window.PAIN_RULES = PAIN_RULES;
  window.warnHTML = window.ATLAS.warnHTML;
  window.fixLinkHTML = window.ATLAS.fixLinkHTML;
  window.freqWord = window.ATLAS.freqWord;
})();
/* contenus : le fichier français fait foi ; en anglais, son texte est remplacé par content/en/<fichier>.json */
function loadContent(name, kind) {
  const get = f =>
    fetch(f).then(function (r) {
      if (!r.ok) throw new Error(f + ' : ' + r.status);
      return r.json();
    });
  const fr = get('content/' + name + '.json');
  if (window.LANG !== 'en') return fr;
  return Promise.all([
    fr,
    get('content/en/' + name + '.json').catch(function (e) {
      console.warn('Texte anglais absent, français affiché : ' + name, e);
      return null;
    }),
  ]).then(function (r) {
    return window.mergeContent(r[0], r[1], kind);
  });
}
loadContent('corps', 'corps')
  .then(function (CONTENT) {
    'use strict';
    const T = THREE,
      $ = id => document.getElementById(id),
      A = window.ATLAS,
      L = window.L10N,
      esc = A.esc,
      url = A.url;
    const SRC = {};
    Object.keys(CONTENT.sources).forEach(
      k => (SRC[k] = { t: CONTENT.sources[k].title, u: CONTENT.sources[k].url }),
    );
    const JOINTS = Object.create(null);
    Object.keys(CONTENT.joints).forEach(k => {
      const j = CONTENT.joints[k];
      JOINTS[k] = { n: j.name, a: j.anchor, g: j.bones };
    });
    /* repères en millimètres (x vers la gauche du sujet, y vers l'arrière, z vers le haut) */
    const ANCH = CONTENT.anchors;
    const GRP = { instant: 0, annee: 1, deformation: 2 },
      GRP_T = L.grp,
      TIER_T = L.tiers;
    const HOME_P = CONTENT.pathologies
      .filter(p => JOINTS[p.joint] && SRC[p.source] && ANCH[p.anchor])
      .map(p => ({
        id: p.id,
        j: p.joint,
        a: p.anchor,
        g: p.bones || [],
        r: p.radius || 0.5,
        v: +p.per100,
        label: p.display,
        src: p.source,
        n: p.name,
        ns: p.commonName,
        al: p.alias,
        base: p.basis,
        pain: p.whatYouFeel || '',
        hip: p.hipId,
        m: GRP[p.measure] !== undefined ? p.measure : 'instant',
        all: p.allAges ? 1 : 0,
      }));
    /* groupes : on ne compare pas une prévalence, des nouveaux cas par an et une déformation */
    const tierOf = p => (p.m !== 'instant' ? 0 : p.v >= 3 ? 0 : p.v >= 1 ? 1 : 2);
    HOME_P.sort((a, b) => GRP[a.m] - GRP[b.m] || tierOf(a) - tierOf(b) || b.all - a.all || b.v - a.v);
    const FIG = {};
    HOME_P.forEach(p => (FIG[p.id] = p));
    const fr = v => v.toLocaleString(L.num);
    const share = p =>
      esc(p.label || (p.v < 1 ? L.per1000(Math.max(1, Math.round(p.v * 10))) : L.per100(fr(Math.round(p.v)))));
    const cap = t => t.charAt(0).toUpperCase() + t.slice(1);
    const fixLink = A.fixLinkHTML;
    /* une seule couleur d'accent pour tous les rangs : le numéro porte le rang, la couleur chaude est réservée à la zone douloureuse */
    const rankCol = () => '#ff7a4d';

    /* ===== Scène ===== */
    const cv = $('b-cv'),
      view = $('b-view'),
      tip = $('b-tip'),
      pinsEl = $('b-pins'),
      root = $('bodyview');
    let ren = null;
    try {
      ren = new T.WebGLRenderer({ canvas: cv, antialias: (window.devicePixelRatio || 1) < 2, alpha: true });
      ren.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      ren.setClearColor(0, 0);
    } catch (e) {
      console.warn('WebGL indisponible', e);
      document.body.classList.add('no3d');
      $('b-load').textContent = L.no3d;
    }
    const RM = A.reduceMotion();
    const onScreen = A.watchVisible(view);
    const scene = new T.Scene(),
      cam = new T.PerspectiveCamera(30, 1, 0.05, 200);
    scene.add(new T.HemisphereLight(0xe3ecff, 0x2a201b, 0.75));
    [
      [0xfff1dd, 0.7, -6, 12, 14],
      [0x7fb7ff, 0.4, 10, 6, -10],
      [0xffffff, 0.2, -8, 2, 4],
      [0xdfe8ff, 0.35, 2, -12, 3],
    ].forEach(l => {
      const d = new T.DirectionalLight(l[0], l[1]);
      d.position.set(l[2], l[3], l[4]);
      scene.add(d);
    });
    const ctl = new T.OrbitControls(cam, cv);
    ctl.enableDamping = true;
    ctl.dampingFactor = 0.09;
    ctl.enablePan = false;
    ctl.minDistance = 1.2;
    ctl.maxDistance = 70;
    if (RM) ctl.enableDamping = false;
    A.touchScroll(view, cv, ctl);
    const P3 = a => new T.Vector3(a[0] * 0.01, a[2] * 0.01, -a[1] * 0.01);
    const A3 = {};
    Object.keys(ANCH).forEach(k => (A3[k] = P3(ANCH[k])));
    const HOME = { t: new T.Vector3(0, 8.15, 0), o: new T.Vector3(-7, 2.5, 36.5) };
    let tw = null,
      aspectK = 1;
    function fly(t, o) {
      tw = {
        t0: performance.now(),
        dur: RM ? 1 : 900,
        t1: t.clone(),
        o1: o.clone(),
        ta: ctl.target.clone(),
        oa: cam.position.clone().sub(ctl.target),
      };
    }
    const homeO = () => HOME.o.clone().multiplyScalar(aspectK);
    ctl.addEventListener('start', () => {
      tw = null;
    });
    function fit() {
      const w = view.clientWidth,
        h = view.clientHeight;
      if (!w || !h) return;
      if (ren) ren.setSize(w, h, false);
      cam.aspect = w / h;
      cam.updateProjectionMatrix();
      aspectK = Math.max(1, 0.62 / cam.aspect);
    }
    new ResizeObserver(fit).observe(view);
    fit();
    ctl.target.copy(HOME.t);
    cam.position.copy(HOME.t).add(homeO());

    /* ===== Structures : os du corps entier (toujours présents) et structures de l'articulation ouverte ===== */
    const LAYERS = {
      os: { n: L.layers.os, c: '#e4d9bd', op: 1 },
      cart: { n: L.layers.cart, c: '#7cc7e3', op: 0.7 },
      syn: { n: L.layers.syn, c: '#8fd3c8', op: 0.6 },
      lig: { n: L.layers.lig, c: '#d8b45a', op: 0.85 },
      ten: { n: L.layers.ten, c: '#efe4c8', op: 0.95 },
      mus: { n: L.layers.mus, c: '#c0665b', op: 0.34 },
      nerf: { n: L.layers.nerf, c: '#f2d94e', op: 0.95 },
      peau: { n: L.layers.peau, c: '#9fc4dc', op: 0.1 },
    };
    const LV = { os: true, cart: true, syn: true, lig: true, ten: true, mus: true, nerf: true, peau: true };
    const S = {},
      hot = new T.Color('#ff6a3d'),
      COOL = new T.Color('#7cc7e3');
    let skin = null,
      skinVeil = null;
    const veilMaterial = () =>
      new T.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        side: T.FrontSide,
        uniforms: { c: { value: new T.Color('#ff6a3d') }, a: { value: 0.5 } },
        vertexShader:
          'attribute float w;varying float vw;void main(){vw=w;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
        fragmentShader:
          'uniform vec3 c;uniform float a;varying float vw;void main(){if(vw<.02)discard;gl_FragColor=vec4(c,vw*a);}',
      });
    function paintSkinVeil(p) {
      if (!skinVeil) return;
      const g = skinVeil.geometry,
        pos = g.attributes.position.array,
        wa = g.attributes.w,
        F = p && p.skin ? p.skin.map(f => [f[0] * 0.01, f[2] * 0.01, -f[1] * 0.01, f[3] * 0.01]) : [];
      for (let i = 0, n = wa.count; i < n; i++) {
        let w = 0;
        const x = pos[i * 3],
          y = pos[i * 3 + 1],
          z = pos[i * 3 + 2];
        for (let k = 0; k < F.length; k++) {
          const f = F[k],
            dx = x - f[0],
            dy = y - f[1],
            dz = z - f[2],
            d = Math.sqrt(dx * dx + dy * dy + dz * dz) / f[3];
          if (d < 1) {
            const u = 1 - d,
              v = u * u * (3 - 2 * u);
            if (v > w) w = v;
          }
        }
        wa.array[i] = w;
      }
      wa.needsUpdate = true;
      if (p) skinVeil.material.uniforms.c.value.copy(p.hex);
    }
    function struct(id, label, layer, color, op, jk) {
      const L = LAYERS[layer],
        soft = layer === 'mus' || layer === 'peau';
      return (S[id] = S[id] || {
        id,
        label,
        layer,
        jk,
        base: new T.Color(color || L.c),
        op: op == null ? L.op : op,
        k: 0,
        meshes: [],
        painted: false,
        mat: new T.MeshStandardMaterial({
          color: 0xffffff,
          vertexColors: true,
          roughness: 0.62,
          metalness: 0.02,
          transparent: layer !== 'os',
          depthWrite: layer !== 'peau',
          side: soft ? T.FrontSide : T.DoubleSide,
        }),
      });
    }
    function decode(buf, each) {
      const jl = new DataView(buf).getUint32(0, true),
        h = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 4, jl))),
        base = 4 + jl;
      h.m.forEach(m => {
        const q = new Int16Array(buf, base + m.o, m.nv * 3),
          p = new Float32Array(m.nv * 3);
        for (let i = 0; i < m.nv; i++) {
          const x = m.b[0] + q[i * 3] * m.s[0],
            y = m.b[1] + q[i * 3 + 1] * m.s[1],
            z = m.b[2] + q[i * 3 + 2] * m.s[2];
          p[i * 3] = x * 0.01;
          p[i * 3 + 1] = z * 0.01;
          p[i * 3 + 2] = -y * 0.01;
        }
        const g = new T.BufferGeometry();
        g.setAttribute('position', new T.BufferAttribute(p, 3));
        const src = new Uint16Array(buf, base + m.o + ((m.nv * 6 + 3) & ~3), m.ni),
          ix = new Uint16Array(m.ni);
        ix.set(src);
        g.setIndex(new T.BufferAttribute(ix, 1));
        g.computeVertexNormals();
        each(m.id, g);
      });
      return h;
    }
    function addMesh(s, g) {
      const n = g.attributes.position.count,
        c = new Float32Array(n * 3);
      for (let i = 0; i < n; i++) {
        c[i * 3] = s.base.r;
        c[i * 3 + 1] = s.base.g;
        c[i * 3 + 2] = s.base.b;
      }
      g.setAttribute('color', new T.BufferAttribute(c, 3));
      const me = new T.Mesh(g, s.mat);
      me.userData.s = s;
      scene.add(me);
      s.meshes.push(me);
      if (s.layer === 'peau') {
        me.renderOrder = 2;
        g.setAttribute('w', new T.BufferAttribute(new Float32Array(n), 1));
        s.veil =
          s.veil ||
          new T.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            side: T.FrontSide,
            uniforms: { c: { value: new T.Color('#ff6a3d') }, a: { value: 0 } },
            vertexShader:
              'attribute float w;varying float vw;void main(){vw=w;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
            fragmentShader:
              'uniform vec3 c;uniform float a;varying float vw;void main(){if(vw<.02)discard;gl_FragColor=vec4(c,vw*a);}',
          });
        const ov = new T.Mesh(g, s.veil);
        ov.renderOrder = 4;
        ov.visible = false;
        scene.add(ov);
        (s.over = s.over || []).push(ov);
      }
    }
    const b64 = t => {
      const s = atob(t.trim()),
        u = new Uint8Array(s.length);
      for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i);
      return u.buffer;
    };
    const getFile = f =>
      fetch(f)
        .then(r => {
          if (!r.ok) throw 0;
          return r.text();
        })
        .then(b64);
    getFile('models/body.b64.txt')
      .then(buf => {
        decode(buf, (id, g) => {
          if (id === 'peau') {
            skin = new T.Mesh(
              g,
              new T.MeshStandardMaterial({
                color: '#9fc4dc',
                roughness: 0.9,
                transparent: true,
                opacity: 0.1,
                depthWrite: false,
                side: T.FrontSide,
              }),
            );
            skin.renderOrder = 2;
            scene.add(skin);
            g.setAttribute('w', new T.BufferAttribute(new Float32Array(g.attributes.position.count), 1));
            skinVeil = new T.Mesh(g, veilMaterial());
            skinVeil.renderOrder = 4;
            skinVeil.visible = false;
            scene.add(skinVeil);
            return;
          }
          const disc = id === 'disques';
          addMesh(
            struct(
              'os:' + id,
              disc ? L.discs : L.bone,
              disc ? 'cart' : 'os',
              null,
              disc ? 1 : null,
              null,
            ),
            g,
          );
        });
        if (ren) $('b-load').hidden = true;
        repaint();
      })
      .catch(() => {
        if (ren)
          $('b-load').textContent = L.skelFail;
      });

    /* halo de la zone, vue corps entier */
    const glow = new T.Mesh(
      new T.SphereGeometry(1, 32, 20),
      new T.MeshBasicMaterial({
        color: hot,
        transparent: true,
        opacity: 0,
        depthTest: false,
        blending: T.AdditiveBlending,
      }),
    );
    glow.renderOrder = 3;
    scene.add(glow);
    let glowK = 0;

    /* ===== État ===== */
    let hov = null,
      pinned = null,
      joint = null,
      data = null,
      items = [],
      BY = Object.create(null);
    const DATA = {},
      SEL = new Set();
    let hipOpen = false;
    const cur = () => hov || pinned;
    const jointOfGroup = g => {
      const b = g.replace(/^os:/, '').replace(/-[dg]$/, '');
      return Object.keys(JOINTS).find(k => JOINTS[k].g.includes(b)) || null;
    };
    const inZone = (p, s) => !!p && !!p.zones && p.zones.includes(s.id);

    /* ----- zone douloureuse : poids par sommet autour des foyers, sur les structures en cause ----- */
    function paintStruct(s, p) {
      const sk = s.layer === 'peau',
        on = sk ? !!(p && p.skin && p.skin.length) : inZone(p, s);
      if (!on && !s.painted) return;
      s.painted = on;
      const F = on
          ? (sk ? p.skin : p.foc).map(f => [f[0] * 0.01, f[2] * 0.01, -f[1] * 0.01, f[3] * 0.01])
          : [],
        hc = p ? p.hex : hot,
        floor = sk ? 0 : s.layer === 'mus' ? 0.3 : s.layer === 'os' ? 0.1 : 0.26;
      if (sk && p) s.veil.uniforms.c.value.copy(p.hex);
      s.meshes.forEach(me => {
        const g = me.geometry,
          pos = g.attributes.position.array,
          n = pos.length / 3,
          col = g.attributes.color,
          c = col.array,
          wa = sk ? g.attributes.w : null;
        for (let i = 0; i < n; i++) {
          let w = 0;
          if (on) {
            w = floor;
            const x = pos[i * 3],
              y = pos[i * 3 + 1],
              z = pos[i * 3 + 2];
            for (let k = 0; k < F.length; k++) {
              const f = F[k],
                dx = x - f[0],
                dy = y - f[1],
                dz = z - f[2],
                d = Math.sqrt(dx * dx + dy * dy + dz * dz) / f[3];
              if (d < 1) {
                const u = 1 - d,
                  v = u * u * (3 - 2 * u);
                if (v > w) w = v;
              }
            }
          }
          if (sk) wa.array[i] = w;
          else {
            c[i * 3] = s.base.r + (hc.r - s.base.r) * w;
            c[i * 3 + 1] = s.base.g + (hc.g - s.base.g) * w;
            c[i * 3 + 2] = s.base.b + (hc.b - s.base.b) * w;
          }
        }
        if (sk) wa.needsUpdate = true;
        else col.needsUpdate = true;
      });
    }
    let paintedFor = null;
    function repaint() {
      const p = joint && data ? BY[cur()] : null;
      if (p === paintedFor) return;
      paintedFor = p;
      Object.values(S).forEach(s => {
        if (s.layer !== 'peau') paintStruct(s, p);
      });
      paintSkinVeil(p);
    }

    /* ----- liste et repères ----- */
    const listEl = $('b-list');
    function buildList() {
      listEl.innerHTML = '';
      pinsEl.innerHTML = '';
      BY = Object.create(null);
      SEL.clear();
      items = joint && data ? data.p : joint ? [] : HOME_P;
      let lastG = null,
        lastT = null;
      items.forEach((p, i) => {
        if (!joint) {
          const t = tierOf(p);
          if (p.m !== lastG) {
            const g = document.createElement('li');
            g.className = 'grp';
            g.innerHTML = esc(GRP_T[p.m][0]) + '<small>' + esc(GRP_T[p.m][1]) + '</small>';
            listEl.appendChild(g);
            lastT = null;
          }
          if (p.m === 'instant' && t !== lastT) {
            const g = document.createElement('li');
            g.className = 'tier';
            g.textContent = TIER_T[t];
            listEl.appendChild(g);
          }
          lastG = p.m;
          lastT = t;
        }
        p.rank = i + 1;
        p.col = rankCol(i);
        p.hex = new T.Color().setStyle(p.col);
        BY[p.id] = p;
        if (joint) {
          const c = new T.Vector3();
          p.foc.forEach(f => c.add(P3(f)));
          c.multiplyScalar(1 / p.foc.length);
          let sp = 0;
          p.foc.forEach(f => {
            sp = Math.max(sp, P3(f).distanceTo(c) + f[3] * 0.01);
          });
          p.pos = c;
          p.span = sp;
        } else p.pos = A3[p.a];
        const li = document.createElement('li'),
          b = document.createElement('button');
        b.type = 'button';
        b.className = 'item';
        b.style.setProperty('--c', p.col);
        const f = FIG[p.id],
          sub = joint
            ? f
              ? '<b>' + share(f) + '</b> · ' + esc(p.n)
              : esc(p.n)
            : esc(JOINTS[p.j].n) + ' · <b>' + share(p) + '</b>';
        b.setAttribute('aria-describedby', 'b-ln');
        b.innerHTML =
          '<span class="rk"><i></i>' +
          p.rank +
          '</span><span class="nm">' +
          esc(p.ns) +
          '</span><span class="jl">' +
          sub +
          (joint ? ' · ' + A.freqWord(p.pop) : '') +
          '</span>';
        b.onmouseenter = () => setHover(p.id);
        b.onmouseleave = () => setHover(null);
        b.onfocus = () => setHover(p.id);
        b.onblur = () => setHover(null);
        b.onclick = () => select(p.id);
        li.appendChild(b);
        listEl.appendChild(li);
        p.el = b;
        p.li = li;
        const pn = document.createElement('button');
        pn.type = 'button';
        pn.className = 'pin';
        pn.style.setProperty('--c', p.col);
        pn.textContent = p.rank;
        pn.setAttribute('aria-label', L.no + p.rank + ' : ' + p.ns);
        pn.tabIndex = -1;
        pn.onmouseenter = () => setHover(p.id);
        pn.onmouseleave = () => setHover(null);
        pn.onclick = () => select(p.id);
        pinsEl.appendChild(pn);
        p.pin = pn;
      });
    }

    /* ----- questions : où, quand et comment ----- */
    $('b-qclear').onclick = () => {
      SEL.clear();
      document.querySelectorAll('#b-q .chip').forEach(b => b.setAttribute('aria-pressed', 'false'));
      reorder();
    };
    function buildAsk() {
      const q = $('b-q'),
        ok = !!(joint && data && data.sym && data.sym.length);
      q.hidden = !ok;
      $('b-tw').innerHTML = '';
      $('b-tq').innerHTML = '';
      $('b-sres').textContent = '';
      if (!ok) return;
      data.sym.forEach(s => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'chip';
        b.setAttribute('aria-pressed', 'false');
        b.textContent = s.t;
        b.onclick = () => {
          SEL.has(s.id) ? SEL.delete(s.id) : SEL.add(s.id);
          b.setAttribute('aria-pressed', String(SEL.has(s.id)));
          reorder();
        };
        $(s.g === 'w' ? 'b-tw' : 'b-tq').appendChild(b);
      });
    }
    /* filtre sans classement : les fiches gardent leur ordre, celles qui ne mentionnent pas les repères choisis sont atténuées */
    function reorder() {
      const sc = p => (p.tags || []).filter(t => SEL.has(t)).length;
      items.forEach(p => p.el.classList.toggle('dim', SEL.size > 0 && !sc(p)));
      const n = items.filter(p => sc(p)).length;
      $('b-sres').textContent = SEL.size ? (n ? L.match(n) : L.noMatch) : '';
      $('b-qclear').hidden = !SEL.size;
    }

    /* ----- articulations et couches ----- */
    const jEl = $('b-joints'),
      lEl = $('b-layers');
    function chip(el, label, fn, col) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'chip';
      b.style.setProperty('--c', col || 'var(--cool)');
      b.innerHTML = '<i aria-hidden="true"></i>' + esc(label);
      b.onclick = () => fn(b);
      el.appendChild(b);
      return b;
    }
    chip(jEl, L.whole, () => {
      if (hipOpen) window.openBody();
      leave();
    }).dataset.j = '';
    Object.keys(JOINTS).forEach(k => {
      chip(jEl, JOINTS[k].n, () => {
        if (k === 'hanche') {
          window.openHip();
          return;
        }
        if (hipOpen) window.openBody();
        enter(k);
      }).dataset.j = k;
    });
    Object.keys(LAYERS).forEach(k => {
      chip(
        lEl,
        LAYERS[k].n,
        b => {
          LV[k] = !LV[k];
          b.setAttribute('aria-pressed', String(LV[k]));
        },
        LAYERS[k].c,
      ).setAttribute('aria-pressed', 'true');
    });

    const VIEWS = {
      face: [-0.25, 0.12, 1],
      cote: [-1, 0.1, 0.25],
      dos: [0.25, 0.12, -1],
      dedans: [1, 0.1, 0.3],
      dessous: [-0.2, -1, 0.35],
      dessus: [-0.15, 1, 0.3],
    };
    function flyTo(p) {
      const d = Math.max(data.j.dist * 0.01, p ? p.span * 4.4 : 0) * Math.max(1, aspectK * 0.8),
        v = VIEWS[(p && p.view) || data.j.view || 'face'];
      fly(p ? p.pos : P3(data.j.cam), new T.Vector3(v[0], v[1], v[2]).normalize().multiplyScalar(d));
    }
    function setHover(id) {
      if (hov === id) return;
      hov = id;
      sync();
      repaint();
      panel();
    }
    function select(id) {
      const p = BY[id];
      if (!joint) {
        if (p.hip) {
          window.openHip(p.hip);
          return;
        }
        enter(p.j, id);
        return;
      }
      pinned = id;
      hov = null;
      sync();
      repaint();
      panel();
      flyTo(p);
      route(true);
      $('b-status').textContent = L.shown + p.ns;
      if (narrow()) {
        $('b-detail').scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
        const h = $('b-detail').querySelector('h2');
        if (h) h.focus({ preventScroll: true });
      }
    }
    const narrow = () => window.matchMedia('(max-width: 1100px)').matches;
    const LOADING = {};
    function evict(keep) {
      Object.values(S).forEach(s => {
        if (!s.jk || s.jk === keep) return;
        s.meshes.concat(s.over || []).forEach(m => {
          scene.remove(m);
          m.geometry.dispose();
        });
        s.mat.dispose();
        if (s.veil) s.veil.dispose();
        delete S[s.id];
      });
      Object.keys(LOADING).forEach(k => {
        if (k !== keep) {
          delete LOADING[k];
          delete DATA[k];
        }
      });
    }
    function load(j) {
      if (LOADING[j]) return LOADING[j];
      return (LOADING[j] = Promise.all([getFile('models/' + j + '.b64.txt'), loadContent(j)])
        .then(r => {
        const buf = r[0],
          C = r[1],
          jl = new DataView(buf).getUint32(0, true),
          h = JSON.parse(new TextDecoder().decode(new Uint8Array(buf, 4, jl))),
          map = {},
          geo = {},
          names = C.structures || {};
        h.p.forEach(p => (geo[p.id] = p));
        /* fusion : textes de content/<articulation>.json, placement du modèle */
        if (!C.joint || !C.joint.name) throw new Error('content/' + j + '.json : joint.name manquant');
        h.j.n = C.joint.name;
        h.j.sub = C.joint.subtitle;
        h.ex = {};
        Object.keys(C.exercises || {}).forEach(k => {
          const e = C.exercises[k];
          h.ex[k] = { n: e.name, d: e.how, q: e.videoSearch || e.name, video: e.video || '' };
        });
        h.sym = (C.questions || []).map(q => ({ id: q.id, g: q.group === 'where' ? 'w' : 'q', t: q.text }));
        h.p = (C.pathologies || [])
          .filter(c => {
            if (!geo[c.id]) console.warn('Fiche sans placement dans le modèle, ignorée : ' + j + '/' + c.id);
            return !!geo[c.id];
          })
          .map(c => {
            const g = geo[c.id];
            return {
              id: c.id,
              j: j,
              n: c.name,
              ns: c.commonName,
              al: c.alias,
              pop: +c.frequency || 0,
              who: c.whoIsAffected,
              pain: c.whatYouFeel,
              txt: c.whatHappens,
              warn: c.warning,
              rule: c.rule || 'standard',
              upd: c.updated || '',
              rev: (c.review && c.review.status) || 'non-relu',
              revBy: (c.review && c.review.by) || '',
              ex: (c.exercises || []).filter(k => h.ex[k]),
              tags: c.answers || [],
              zones: g.zones.map(z => j + ':' + z),
              foc: g.foc,
              skin: g.skin,
              view: g.view,
            };
          });
        h.p.sort((a, b) => b.pop - a.pop);
        h.notice = C.joint.notice || '';
        h.s.forEach(d => {
          d.label = names[d.id] || d.id;
          map[d.id] = d;
        });
        decode(buf, (id, g) => {
          const d = map[id];
          addMesh(struct(j + ':' + id, d.label, d.layer, d.color, d.op, j), g);
        });
        return (DATA[j] = h);
      })
        .catch(e => {
          delete LOADING[j];
          throw e;
        }));
    }
    function enter(j, pid) {
      if (j === 'hanche') {
        window.openHip();
        return;
      }
      joint = j;
      data = null;
      pinned = null;
      hov = null;
      resetPointer();
      paintedFor = undefined;
      if (narrow()) $('b-view').scrollIntoView({ behavior: 'auto', block: 'start' });
      buildList();
      buildAsk();
      sync();
      panel();
      fly(
        A3[JOINTS[j].a],
        new T.Vector3(-0.3, 0.12, 1).normalize().multiplyScalar(7 * Math.max(1, aspectK * 0.8)),
      );
      route(false, pid);
      load(j)
        .then(h => {
          if (joint !== j) return;
          data = h;
          evict(j);
          buildList();
          buildAsk();
          pinned = pid && BY[pid] ? pid : items[0] ? items[0].id : null;
          sync();
          repaint();
          panel();
          flyTo(BY[pinned] || null);
          if (pid) route(true);
        })
        .catch(e => {
          console.error(e);
          if (joint !== j) return;
          $('b-detail').innerHTML = L.unavailable + '<button type="button" class="open" id="b-retry">' + L.retry + '</button>';
          $('b-retry').onclick = () => enter(j, pid);
        });
    }
    function resetPointer() {
      hs = null;
      tip.hidden = true;
      cv.style.cursor = '';
    }
    /* adresse : #genou, #genou/menisque, #hanche, #hanche/gtps */
    function route(replace, pid) {
      const h = joint ? '#' + joint + ((pid || (replace && pinned)) ? '/' + (pid || pinned) : '') : '';
      if (location.hash === h || (!h && !location.hash)) return;
      try {
        history[replace ? 'replaceState' : 'pushState'](null, '', h || location.pathname + location.search);
      } catch (e) {}
    }
    function fromHash() {
      const m = location.hash.slice(1).split('/');
      if (m[0] === 'hanche') {
        window.openHip(m[1]);
        return;
      }
      if (hipOpen) window.openBody(true);
      if (JOINTS[m[0]]) {
        if (joint === m[0] && data && m[1] && BY[m[1]]) select(m[1]);
        else if (joint !== m[0]) enter(m[0], m[1]);
      } else if (joint) leave(true);
    }
    addEventListener('popstate', fromHash);
    function leave(noRoute) {
      joint = null;
      data = null;
      pinned = null;
      hov = null;
      resetPointer();
      if (!noRoute) route(false);
      buildList();
      buildAsk();
      fly(HOME.t, homeO());
      sync();
      repaint();
      panel();
    }
    function sync() {
      const c = cur();
      items.forEach(p => {
        p.el.classList.toggle('on', p.id === pinned);
        p.el.classList.toggle('hov', p.id === hov);
        p.pin.classList.toggle('on', p.id === pinned);
        p.pin.classList.toggle('hov', p.id === hov);
        p.pin.classList.toggle('occ', !!c && c !== p.id);
      });
      jEl.querySelectorAll('.chip').forEach(b => {
        const on = hipOpen ? b.dataset.j === 'hanche' : (b.dataset.j || null) === joint;
        if (on) b.setAttribute('aria-current', 'page');
        else b.removeAttribute('aria-current');
      });
      items.forEach(p => {
        if (p.id === pinned) p.el.setAttribute('aria-current', 'true');
        else p.el.removeAttribute('aria-current');
      });
      const pj = joint && data && BY[pinned];
      document.title = hipOpen
        ? L.hip + ' | ' + L.site
        : joint
          ? JOINTS[joint].n + (pj ? ' – ' + pj.ns : '') + ' | ' + L.site
          : L.site;
      const touch = A.coarse();
      $('g-sub').textContent = hipOpen ? L.subHip : joint ? (data ? L.subJoint(data.j.sub) : JOINTS[joint].n) : L.subHome;
      $('b-notice').hidden = !(joint && data && data.notice);
      $('b-notice').textContent = joint && data ? data.notice || '' : '';
      lEl.hidden = !joint;
      $('b-lh').textContent = joint
        ? JOINTS[joint].n + (data ? ' · ' + L.nPains(items.length) : '')
        : L.mostCommon;
      $('b-ln').textContent = joint ? L.noteJoint : L.noteHome;
      $('b-hint').textContent = joint
        ? touch
          ? L.hintJointTouch
          : L.hintJoint
        : touch
          ? L.hintHomeTouch
          : L.hintHome;
    }

    /* ----- fiche ----- */
    const YT =
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23 12s0-3.6-.5-5.3a2.8 2.8 0 0 0-2-2C18.800 4.200 12 4.200 12 4.200s-6.800 0-8.500.5a2.800 2.800 0 0 0-2 2C1 8.400 1 12 1 12s0 3.600.5 5.300a2.800 2.800 0 0 0 2 2c1.700.5 8.500.5 8.500.5s6.800 0 8.500-.5a2.800 2.800 0 0 0 2-2C23 15.600 23 12 23 12zM9.800 15.500v-7l6 3.500z"/></svg>';
    const srcLink = k =>
      '<a class="yt" href="' +
      esc(url(SRC[k].u)) +
      '" target="_blank" rel="noopener">' +
      esc(SRC[k].t) +
      A.NEW_TAB +
      '</a>';
    function figure(f, col) {
      return (
        '<div class="fig" style="--c:' +
        col +
        '"><strong>' +
        cap(share(f)) +
        '</strong><span>' +
        (f.m === 'annee' ? L.figYear : f.m === 'deformation' ? L.figDef : L.figInst) +
        '</span><p>' +
        esc(f.base) +
        '</p><p>' +
        L.source +
        srcLink(f.src) +
        '</p></div>'
      );
    }
    function homeCard(p) {
      let h =
        '<span class="tag" style="--c:' +
        p.col +
        '"><i></i>' +
        L.marker +
        p.rank +
        ' · ' +
        esc(JOINTS[p.j].n) +
        ' · ' +
        esc(GRP_T[p.m][0]) +
        '</span><h2 tabindex="-1">' +
        esc(p.ns) +
        '</h2><p class="alias">' +
        esc(p.al || p.n) +
        '</p>' +
        figure(p, p.col);
      if (p.hip)
        return (
          h +
          L.hipHome +
          '<button type="button" class="open" id="b-open">' +
          L.openHip +
          '</button>'
        );
      return (
        h +
        '<h3>' +
        L.feel +
        '</h3><p>' +
        esc(p.pain) +
        '</p><button type="button" class="open" id="b-go">' +
        esc(L.goJoint(JOINTS[p.j].n)) +
        '</button>' +
        fixLink(JOINTS[p.j].n, p.n)
      );
    }
    const fdate = d =>
      /^\d{4}-\d\d-\d\d$/.test(d)
        ? new Date(d + 'T12:00:00').toLocaleDateString(L.date.loc, { day: 'numeric', month: 'long', year: 'numeric' })
        : '';
    function revLine(p) {
      const d = fdate(p.upd);
      return (
        '<p class="rev">' +
        (p.rev === 'relu' && p.revBy ? L.revBy(esc(p.revBy)) : L.notRev) +
        (d ? L.updated + d : '') +
        '</p>'
      );
    }
    function jointCard(p) {
      const same = (p.n || '').toLowerCase() === (p.ns || '').toLowerCase();
      let h =
        '<span class="tag" style="--c:' +
        p.col +
        '"><i></i>' +
        L.no +
        p.rank +
        ' · ' +
        esc(JOINTS[p.j].n) +
        ' · ' +
        A.freqWord(p.pop) +
        '</span><h2 tabindex="-1">' +
        esc(p.ns) +
        '</h2><p class="alias">' +
        esc(same ? p.al || '' : p.n + (p.al ? ' · ' + p.al : '')) +
        '</p>' +
        revLine(p) +
        A.warnHTML(p.warn);
      if (FIG[p.id] && FIG[p.id].j === p.j) h += figure(FIG[p.id], p.col);
      h +=
        '<h3>' +
        L.feel +
        '</h3><p>' +
        esc(p.pain) +
        '</p><h3>' +
        L.what +
        '</h3><p>' +
        esc(p.txt) +
        '</p><p class="sm">' +
        L.structs +
        '</p><div class="chips" style="--c:' +
        p.col +
        '">' +
        p.zones.map(z => (S[z] ? '<span class="zc">' + esc(S[z].label) + '</span>' : '')).join('') +
        '</div><h3>' +
        L.who +
        '</h3><p>' +
        esc(p.who) +
        '</p>';
      h +=
        '<h3>' +
        L.exH +
        '</h3><p class="sm">' +
        L.exNote +
        '</p>' +
        A.ruleHTML(p.rule);
      p.ex.forEach(k => {
        const e = data.ex[k],
          v = url(e.video);
        h +=
          '<div class="ex"><h4>' +
          esc(e.n) +
          '</h4><p>' +
          esc(e.d) +
          '</p>' +
          (v !== '#'
            ? '<a class="yt" href="' + esc(v) + '" target="_blank" rel="noopener">' + YT + L.seeVideo + '<span class="sr"> : ' + esc(e.n) + L.newTab + '</span></a>'
            : '<a class="yt" href="https://www.youtube.com/results?search_query=' +
              encodeURIComponent(e.q) +
              '" target="_blank" rel="noopener">' +
              YT +
              L.findVideo +
              '<span class="sr"> : ' +
              esc(e.n) +
              L.ytNewTab +
              '</span></a> <span class="sm">' +
              L.unverified +
              '</span>') +
          '</div>';
      });
      return h + fixLink(JOINTS[p.j].n, p.n);
    }
    function rest() {
      return L.rest + L.restIntro(HOME_P.length) + L.restSteps + L.restFigures;
    }
    function panel() {
      const d = $('b-detail'),
        id = cur();
      if (joint && !data) {
        d.innerHTML =
          '<span class="tag" style="--c:var(--cool)"><i></i>' +
          JOINTS[joint].n +
          '</span>' +
          L.loadingJoint;
        return;
      }
      d.innerHTML = id && BY[id] ? (joint ? jointCard(BY[id]) : homeCard(BY[id])) : rest();
      const o = $('b-open');
      if (o) o.onclick = () => window.openHip(BY[id].hip);
      const g = $('b-go');
      if (g) g.onclick = () => enter(BY[id].j, id);
    }

    /* ===== Souris ===== */
    const ray = new T.Raycaster(),
      pt = new T.Vector2();
    const involved = s => items.filter(p => inZone(p, s));
    function pick(e) {
      const r = cv.getBoundingClientRect();
      pt.set(((e.clientX - r.left) / r.width) * 2 - 1, (-(e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(pt, cam);
      const ms = Object.values(S)
        .filter(s => (joint && data ? s.jk === joint : !s.jk))
        .flatMap(s => s.meshes)
        .filter(m => m.visible && m.material.opacity > 0.1);
      const hits = ray.intersectObjects(ms, false);
      if (!hits.length) return null;
      if (!joint || !data) return hits[0].object.userData.s;
      const h =
        hits.find(x => involved(x.object.userData.s).length && x.object.userData.s.layer !== 'os') ||
        hits.find(x => involved(x.object.userData.s).length) ||
        hits.find(x => x.object.material.opacity > 0.5) ||
        hits[0];
      return h.object.userData.s;
    }
    let hs = null,
      down = null;
    cv.addEventListener('pointermove', e => {
      if (e.buttons) return;
      const s = pick(e);
      hs = s;
      if (!s) {
        tip.hidden = true;
        cv.style.cursor = '';
        if (joint && hov) {
          setHover(null);
        }
        return;
      }
      const r = view.getBoundingClientRect();
      let html, clickable;
      if (joint && data) {
        const l = involved(s);
        clickable = l.length > 0;
        html =
          '<b>' +
          esc(s.label) +
          '</b><em>' +
          (l.length
            ? l.map(p => L.no + p.rank + ' ' + esc(p.ns)).join('<br>')
            : L.noneInList) +
          '</em>';
        const top = l[0] ? l[0].id : null,
          want = l.some(p => p.id === pinned) ? null : top;
        if (want !== hov) setHover(want);
      } else {
        const j = jointOfGroup(s.id);
        clickable = !!j;
        if (!j) {
          tip.hidden = true;
          cv.style.cursor = '';
          return;
        }
        html = '<b>' + esc(JOINTS[j].n) + '</b><em>' + L.tipHome + '</em>';
      }
      cv.style.cursor = clickable ? 'pointer' : '';
      tip.innerHTML = html;
      tip.hidden = false;
      tip.style.left = Math.min(e.clientX - r.left + 14, r.width - 230) + 'px';
      tip.style.top = e.clientY - r.top + 14 + 'px';
    });
    cv.addEventListener('pointerleave', () => {
      tip.hidden = true;
      hs = null;
      if (joint && hov) setHover(null);
    });
    cv.addEventListener('pointerdown', e => {
      down = [e.clientX, e.clientY];
    });
    cv.addEventListener('pointerup', e => {
      if (!down || Math.hypot(e.clientX - down[0], e.clientY - down[1]) > 5) return;
      const s = pick(e);
      if (!s) return;
      if (joint && data) {
        const l = involved(s);
        if (l.length) {
          const i = l.findIndex(p => p.id === pinned);
          select(l[(i + 1) % l.length].id);
        }
      } else if (!joint) {
        const j = jointOfGroup(s.id);
        if (j === 'hanche') window.openHip();
        else if (j) enter(j);
      }
    });

    /* ===== Points de vue ===== */
    $('b-views')
      .querySelectorAll('button')
      .forEach(
        b =>
          (b.onclick = () => {
            const d = cam.position.distanceTo(ctl.target),
              v = VIEWS[b.dataset.v];
            fly(ctl.target, new T.Vector3(v[0], v[1], v[2]).normalize().multiplyScalar(d));
          }),
      );
    $('b-reset').onclick = () => {
      joint && data && BY[pinned] ? flyTo(BY[pinned]) : fly(HOME.t, homeO());
    };
    addEventListener('keydown', e => {
      const a = document.activeElement;
      if (e.key === 'Escape' && !root.hidden && joint && (!a || a === document.body || view.contains(a))) leave();
    });

    /* ===== Boucle de rendu ===== */
    let last = performance.now(),
      lastLn = '';
    const v3 = new T.Vector3(),
      tmpC = new T.Color(),
      leadEl = $('b-lead');
    function frame(now) {
      requestAnimationFrame(frame);
      if (root.hidden || !ren || !onScreen.on) {
        last = now;
        return;
      }
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (tw) {
        const u = Math.min(1, (now - tw.t0) / tw.dur),
          e = u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2;
        ctl.target.lerpVectors(tw.ta, tw.t1, e);
        cam.position.copy(ctl.target).add(v3.lerpVectors(tw.oa, tw.o1, e));
        if (u >= 1) tw = null;
      }
      ctl.update();
      const a = BY[cur()],
        ja = joint && data ? a || items[0] : null,
        hj = !joint && hs ? jointOfGroup(hs.id) : null;
      const pulse = RM ? 1 : 0.5 + 0.5 * Math.sin(now / 320);
      Object.values(S).forEach(s => {
        const here = !s.jk || (s.jk === joint && !!data),
          on = here && LV[s.layer] && !(ja && !s.jk),
          sk = s.layer === 'peau',
          aff = !sk && inZone(ja, s),
          hovd = !!ja && hs === s && !sk;
        let b = on ? s.op : 0;
        if (on && ja && !sk) {
          if (aff) b = s.layer === 'mus' ? 0.9 : 1;
          else b *= s.layer === 'os' ? 0.5 : s.layer === 'mus' ? 0.3 : 0.4;
        }
        if (on && hovd) b = Math.max(b, 0.8);
        if (!s.jk && s.layer === 'cart' && !ja) b = 1;
        s.k += (b - s.k) * Math.min(1, dt * 9);
        const op = s.k;
        s.mat.opacity = op;
        s.mat.transparent = sk || op < 0.995;
        if (!sk) s.mat.depthWrite = op > 0.6;
        const vis = op > 0.02;
        s.meshes.forEach(m => {
          m.visible = vis;
          if (!sk) m.renderOrder = op > 0.6 ? 0 : 1;
        });
        if (s.over) s.over.forEach(m => (m.visible = false));
        /* teinte : structure en cause (chaude, pulsée), structure survolée (froide), os de la zone survolée en vue corps entier */
        let em = 0;
        tmpC.copy(hot);
        if (aff) {
          em = 0.16 + 0.14 * pulse;
          tmpC.copy(ja.hex);
        }
        if (hovd) {
          em = Math.max(em, 0.3);
          if (!aff) tmpC.copy(COOL);
        }
        if (!joint && !s.jk) {
          if (a && a.g && a.g.some(g => 'os:' + g === s.id)) {
            em = 0.45;
            tmpC.copy(a.hex);
          } else if (hj && jointOfGroup(s.id) === hj && /-d$|^os:[^-]+$/.test(s.id)) {
            em = 0.22;
            tmpC.copy(COOL);
          }
        }
        s.em = (s.em || 0) + (em - (s.em || 0)) * Math.min(1, dt * 9);
        s.mat.emissive.copy(tmpC).multiplyScalar(s.em);
      });
      const ga = !joint ? a : null;
      glowK += ((ga ? 1 : 0) - glowK) * Math.min(1, dt * 8);
      if (ga) {
        glow.position.copy(A3[ga.a]);
        glow.scale.setScalar(ga.r * (1 + (RM ? 0 : 0.06 * Math.sin(now / 260))));
        glow.material.color.copy(ga.hex);
      }
      glow.material.opacity = glowK * 0.5;
      if (skin) skin.visible = !ja;
      if (skinVeil) {
        skinVeil.visible = !!ja && LV.peau && !!paintedFor;
        skinVeil.material.uniforms.a.value = 0.5 + 0.08 * pulse;
      }
      const w = view.clientWidth,
        h = view.clientHeight;
      const vis = [];
      items.forEach(p => {
        v3.copy(p.pos).project(cam);
        const ok = v3.z < 1 && Math.abs(v3.x) < 1.05 && Math.abs(v3.y) < 1.05;
        p.pin.hidden = !ok;
        if (ok) {
          p.ax = p.px = (v3.x * 0.5 + 0.5) * w;
          p.ay = p.py = (-v3.y * 0.5 + 0.5) * h;
          vis.push(p);
        }
      });
      const c0 = cur(),
        MIN = A.coarse() ? 36 : 30;
      for (let it = 0; it < 10; it++)
        for (let i = 0; i < vis.length; i++)
          for (let k = i + 1; k < vis.length; k++) {
            const A = vis[i],
              B = vis[k];
            let dx = B.px - A.px,
              dy = B.py - A.py,
              d = Math.hypot(dx, dy);
            if (d < MIN) {
              if (d < 0.01) {
                dx = Math.cos(k * 2.4);
                dy = Math.sin(k * 2.4);
                d = 1;
              }
              const m = (MIN - d) / 2,
                ux = dx / d,
                uy = dy / d,
                fa = A.id === c0 ? 0 : B.id === c0 ? 2 : 1,
                fb = 2 - fa;
              A.px -= ux * m * fa;
              A.py -= uy * m * fa;
              B.px += ux * m * fb;
              B.py += uy * m * fb;
            }
          }
      let ln = '';
      vis.forEach(p => {
        p.pin.style.translate = p.px.toFixed(1) + 'px ' + p.py.toFixed(1) + 'px';
        if (Math.hypot(p.px - p.ax, p.py - p.ay) > 9)
          ln +=
            '<line x1="' +
            p.ax.toFixed(1) +
            '" y1="' +
            p.ay.toFixed(1) +
            '" x2="' +
            p.px.toFixed(1) +
            '" y2="' +
            p.py.toFixed(1) +
            '" stroke="' +
            p.col +
            '" stroke-opacity="' +
            (c0 && c0 !== p.id ? 0.25 : 0.8) +
            '"/><circle cx="' +
            p.ax.toFixed(1) +
            '" cy="' +
            p.ay.toFixed(1) +
            '" r="2.5" fill="' +
            p.col +
            '" fill-opacity="' +
            (c0 && c0 !== p.id ? 0.3 : 1) +
            '"/>';
      });
      if (ln !== lastLn) {
        leadEl.innerHTML = ln;
        lastLn = ln;
      }
      ren.render(scene, cam);
    }
    /* sans WebGL, on garde la liste et les fiches */
    if (!ren) $('b-load').hidden = false;
    buildList();
    sync();
    panel();
    requestAnimationFrame(frame);

    /* ===== Bascule corps entier / hanche ===== */
    let hip = null;
    window.openHip = function (id) {
      root.hidden = true;
      $('hipview').hidden = false;
      hipOpen = true;
      if (!hip) hip = window.startHip();
      if (id && hip && hip.pin && hip.has && hip.has(id)) hip.pin(id);
      else if (!/^#hanche/.test(location.hash))
        try {
          history.pushState(null, '', '#hanche');
        } catch (e) {}
      sync();
    };
    window.openBody = function (noRoute) {
      $('hipview').hidden = true;
      root.hidden = false;
      hipOpen = false;
      sync();
      if (!noRoute && !joint)
        try {
          history.pushState(null, '', location.pathname + location.search);
        } catch (e) {}
      fit();
    };
    if (location.hash) fromHash();
    $('b-src').innerHTML = Object.keys(SRC).map(srcLink).join(' · ');
  })
  .catch(function (e) {
    console.error(e);
    var d = document.getElementById('b-detail');
    if (d) {
      d.innerHTML = window.L10N.loadFail + '<button type="button" class="open" id="b-reload">' + window.L10N.reload + '</button>';
      document.getElementById('b-reload').onclick = function () {
        location.reload();
      };
    }
  });
