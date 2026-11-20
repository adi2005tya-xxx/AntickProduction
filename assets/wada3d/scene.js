/* A real 3D wada: lane, front façade, hinged teak door, courtyard (chowk), carved pillars, balconies, tiled roofs,
   marigold torans, lamps, rangoli, swing. A camera flies in from above, lands in the lane, and walks through the door. */
import * as THREE from 'three';

const $ = s => document.querySelector(s);
const Q = new URLSearchParams(location.search);
const SHOT = Q.get('shot');
const FF = +Q.get('ff') || 1;                      // test only: fast-forward the camera timeline
const emit = (n, d) => window.dispatchEvent(new CustomEvent(n, { detail: d }));
const V = (x, y, z) => new THREE.Vector3(x, y, z);
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const sm = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const ease = x => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };
const lerp = (a, b, t) => a + (b - a) * t;
const rand = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();

async function main() {
  document.documentElement.dataset.stage='start';
  const cv = $('#gl');
  const small = innerWidth < 720;
  const renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(SHOT ? 1 : Math.min(devicePixelRatio || 1, small ? 1.5 : 2));
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xe9b98e, 0.011);
  const camera = new THREE.PerspectiveCamera(55, innerWidth / innerHeight, 0.1, 500);
  const fitCam = () => { camera.aspect = innerWidth / innerHeight; camera.fov = camera.aspect < 1 ? 74 : 55; camera.updateProjectionMatrix(); };
  fitCam();
  addEventListener('resize', () => { renderer.setSize(innerWidth, innerHeight, false); fitCam(); });

  /* ---------- textures (CC0 Poly Haven + the real door photo) ---------- */
  const TL = new THREE.TextureLoader();
  const T = {};
  const names = ['plaster_d', 'plaster_n', 'brick_d', 'brick_n', 'roof_d', 'roof_n', 'floor_d', 'floor_n', 'lane_d', 'lane_n', 'wood_d', 'planks_d'];
  await Promise.all(names.map(async n => {
    const t = await TL.loadAsync('assets/wada3d/' + n + '.jpg');
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    if (n.endsWith('_d')) t.colorSpace = THREE.SRGBColorSpace;
    T[n] = t;
  }));
  const loadImg = src => new Promise((res, rej) => { const i = new Image(); i.onload = () => res(i); i.onerror = rej; i.src = src; });
  const doorImg = await loadImg('assets/wada/vdoor.jpg');
  const ganeshImg = await loadImg('assets/wada/ganeshpatti.jpg');
  document.documentElement.dataset.stage='textures';

  const M = (d, n, o = {}) => new THREE.MeshStandardMaterial({
    map: T[d], normalMap: n ? T[n] : null, roughness: o.r ?? 0.92, metalness: o.m ?? 0,
    color: o.c ?? 0xffffff, emissive: o.e ?? 0x000000, emissiveIntensity: o.ei ?? 1
  });
  const mCream = M('plaster_d', 'plaster_n', { c: 0xfaebd2 });
  const mOchre = M('plaster_d', 'plaster_n', { c: 0xf4dcae });
  const mRose = M('plaster_d', 'plaster_n', { c: 0xdcb8ac });
  const mWhite = M('plaster_d', 'plaster_n', { c: 0xfbf1de });
  const mBrick = M('brick_d', 'brick_n', { c: 0xe8d4c0 });
  const mRoof = M('roof_d', 'roof_n', { c: 0xf4e4d8, r: .8 });
  const mFloor = M('floor_d', 'floor_n', { c: 0xb4b2b6 });
  const mVer = M('floor_d', 'floor_n', { c: 0xd8c8b0 });
  const mLane = M('lane_d', 'lane_n', { c: 0xcfc4b2 });
  const mWood = M('wood_d', null, { c: 0x8a5a40, r: .75 });
  const mWoodDark = M('wood_d', null, { c: 0x4c3022, r: .8 });
  const mPlanks = M('planks_d', null, { c: 0xa07a5a });
  const mBrass = new THREE.MeshStandardMaterial({ color: 0xc99a3e, metalness: .9, roughness: .35 });
  const mLeaf = new THREE.MeshStandardMaterial({ color: 0x2f7a3a, roughness: .8 });

  /* ---------- geometry helpers ---------- */
  const world = new THREE.Group(); scene.add(world);
  function box(w, h, d, m, tile = 2, cast = true) {
    const g = new THREE.BoxGeometry(w, h, d), uv = g.attributes.uv;
    const dims = [[d, h], [d, h], [w, d], [w, d], [w, h], [w, h]];
    for (let f = 0; f < 6; f++) for (let v = 0; v < 4; v++) { const i = f * 4 + v; uv.setXY(i, uv.getX(i) * dims[f][0] / tile, uv.getY(i) * dims[f][1] / tile); }
    const o = new THREE.Mesh(g, m); o.castShadow = cast; o.receiveShadow = true; return o;
  }
  function plane(w, h, m, tile = 2) {
    const g = new THREE.PlaneGeometry(w, h), uv = g.attributes.uv;
    for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) * w / tile, uv.getY(i) * h / tile);
    const o = new THREE.Mesh(g, m); o.receiveShadow = true; return o;
  }
  const flat = o => { o.rotation.x = -Math.PI / 2; return o; };
  const put = (o, x, y, z, parent = world) => { o.position.set(x, y, z); parent.add(o); return o; };

  /* ---------- sky, stars, light ---------- */
  const skyU = { top: { value: new THREE.Color() }, hor: { value: new THREE.Color() }, sunCol: { value: new THREE.Color(0xffb070) }, sunDir: { value: V(-.6, .26, .75).normalize() } };
  const sky = new THREE.Mesh(new THREE.SphereGeometry(300, 32, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false, uniforms: skyU,
    vertexShader: 'varying vec3 vP;void main(){vP=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'uniform vec3 top,hor,sunCol,sunDir;varying vec3 vP;void main(){float h=clamp(vP.y,0.,1.);vec3 c=mix(hor,top,pow(h,.55));float s=max(dot(normalize(vP),sunDir),0.);c+=sunCol*(pow(s,14.)*.55+pow(s,240.)*2.);gl_FragColor=vec4(c,1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'
  }));
  scene.add(sky);
  const starPos = []; for (let i = 0; i < 500; i++) { const a = rand() * 6.283, e = .08 + rand() * 1.2, r = 280; starPos.push(Math.cos(a) * Math.cos(e) * r, Math.sin(e) * r, Math.sin(a) * Math.cos(e) * r); }
  const starGeo = new THREE.BufferGeometry(); starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
  const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xfff2d8, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0, fog: false, depthWrite: false }));
  scene.add(stars);

  const hemi = new THREE.HemisphereLight(0xffd0a0, 0x4a3626, 1); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffc48a, 3); sun.position.set(-45, 30, 55); sun.target.position.set(0, 0, -6);
  sun.castShadow = true; sun.shadow.mapSize.set(small ? 1024 : 2048, small ? 1024 : 2048);
  Object.assign(sun.shadow.camera, { left: -46, right: 46, top: 46, bottom: -46, near: 1, far: 220 });
  sun.shadow.bias = -0.0005; sun.shadow.normalBias = .05;
  scene.add(sun, sun.target);

  /* ---------- ground / lane ---------- */
  put(flat(plane(400, 400, mLane, 2.4)), 0, 0, 0);

  /* ---------- dimensions ---------- */
  const G = 3.6, U = 3.0, TOP = G + U, TH = .7;      // ground height, upper height, top, wall thickness
  const DW = .95, SILL = .45, DOORTOP = 3.1;           // half opening width, sill height, door top

  /* ---------- front façade ---------- */
  const fx = 6.05, fxc = (7 + DW) / 2;
  for (const s of [-1, 1]) {
    put(box(fx, G, TH, mCream), s * fxc, G / 2, -TH / 2);                       // ground wall
    put(box(fx + .02, 1.0, TH + .08, mBrick, 1.6), s * fxc, .5, -TH / 2 + .03);    // brick plinth
  }
  put(box(2 * DW, G - DOORTOP, TH, mCream), 0, (G + DOORTOP) / 2, -TH / 2);        // lintel band
  put(box(14, U, TH, mOchre), 0, G + U / 2, -TH / 2);                              // upper storey
  put(box(14.1, .3, TH + .5, mWhite), 0, G + .15, -TH / 2 + .15);                  // string course
  put(box(14.1, .25, TH + .5, mWhite), 0, TOP - .12, -TH / 2 + .15);               // cornice
  // door frame, sill, steps
  for (const s of [-1, 1]) put(box(.15, DOORTOP - SILL, .62, mWoodDark, 1), s * (DW - .075), (DOORTOP + SILL) / 2, -.31);
  put(box(2 * DW, .16, .62, mWoodDark, 1), 0, DOORTOP - .08, -.31);
  put(box(2 * DW + .3, .45, TH, mFloor, 1.4), 0, .225, -TH / 2);
  put(box(2.9, .22, .95, mFloor, 1.4), 0, .11, .55);
  // painted Ganesh lintel (real photo of a wada lintel)
  {
    const c = document.createElement('canvas'); c.width = 1536; c.height = 300;
    c.getContext('2d').drawImage(ganeshImg, 0, ganeshImg.height * .555, ganeshImg.width, ganeshImg.height * .27, 0, 0, 1536, 300);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    put(new THREE.Mesh(new THREE.PlaneGeometry(2.15, .42), new THREE.MeshStandardMaterial({ map: t, roughness: .8 })), 0, 3.36, .012);
    put(box(2.35, .06, .1, mWoodDark, 1), 0, 3.13, .03); put(box(2.35, .06, .1, mWoodDark, 1), 0, 3.6 - .02, .03);
  }
  // windows on the upper storey
  const winGlow = new THREE.MeshBasicMaterial({ color: 0xffb25c });
  const winDark = new THREE.MeshBasicMaterial({ color: 0x1b0e07 });
  function windowAt(x, y, z, w, h, glow, rotY = 0, parent = world) {
    const g = new THREE.Group();
    g.add(put(box(w + .2, h + .2, .16, mWoodDark, 1), 0, 0, 0, g));
    g.add(put(new THREE.Mesh(new THREE.PlaneGeometry(w, h), glow ? winGlow : winDark), 0, 0, .09, g));
    for (let i = 1; i < 3; i++) put(box(.04, h, .06, mWood, 1), -w / 2 + w * i / 3, 0, .11, g);
    put(box(w, .04, .06, mWood, 1), 0, 0, .11, g);
    g.position.set(x, y, z); g.rotation.y = rotY; parent.add(g); return g;
  }
  for (const x of [-5.4, -3.2, 3.2, 5.4]) windowAt(x, G + 1.5, .03, .9, 1.3, rand() > .35);
  // jharokha (projecting wooden balcony) above the door
  {
    const gx = 0, gy = G, gz = .55;
    put(box(3.0, .16, 1.15, mPlanks, 1.2), gx, gy + .08, gz);
    for (const s of [-1, 1]) { put(box(.14, 2.2, .14, mWoodDark, 1), s * 1.4, gy + 1.25, gz + .5); put(box(.14, 1.6, .14, mWoodDark, 1), s * 1.4, gy + .8, gz - .45); }
    put(box(3.1, .1, .14, mWoodDark, 1), 0, gy + 1.0, gz + .54); put(box(3.1, .1, .14, mWood, 1), 0, gy + .3, gz + .54);
    for (let i = 0; i < 17; i++) put(box(.045, .66, .045, mWood, 1), -1.35 + i * .169, gy + .65, gz + .54);
    for (const s of [-1, 1]) { put(box(.1, .1, 1.05, mWood, 1), s * 1.4, gy + 1.0, gz); for (let i = 0; i < 5; i++) put(box(.045, .66, .045, mWood, 1), s * 1.4, gy + .65, gz - .42 + i * .21); }
    put(box(3.3, .14, 1.5, mWoodDark, 1), gx, gy + 2.4, gz);
    const jr = box(3.6, .12, 1.9, mRoof, 1.4); jr.rotation.x = .16; put(jr, gx, gy + 2.62, gz + .1);
    windowAt(0, G + 1.35, .03, 1.2, 1.9, true);
  }
  // front sloped roof, towards the lane, and towards the courtyard
  { const r = box(14.9, .17, 3.4, mRoof, 1.5); r.rotation.x = .32; put(r, 0, TOP + .55, .05); put(box(14.9, .24, .2, mWoodDark, 1), 0, TOP - .02 + .02, 1.58 - .1); }

  /* ---------- interior shell ---------- */
  const IX = 6.3, BZ = -13.3;                           // inner faces
  put(box(TH, TOP, 14, mCream), -IX - TH / 2, TOP / 2, -7); put(box(TH, TOP, 14, mCream), IX + TH / 2, TOP / 2, -7);
  put(box(14, TOP, TH, mCream), 0, TOP / 2, BZ - TH / 2);
  for (const s of [-1, 1]) { const w = plane(12.6, TOP, mRose, 2.2); w.rotation.y = s > 0 ? -Math.PI / 2 : Math.PI / 2; put(w, s * (IX - .005), TOP / 2, -7); }
  { const w = plane(12.6, TOP, mRose, 2.2); put(w, 0, TOP / 2, BZ + .005); }
  // chowk geometry
  const CX = 3.9, CZ0 = -3.1, CZ1 = -10.9;
  // floors
  const vf = (w, d, x, z) => put(box(w, .45, d, mVer, 1.6), x, .225, z);
  vf(12.6, 2.4, 0, -1.9); vf(12.6, 2.4, 0, -12.1); vf(2.4, 7.8, -5.1, -7); vf(2.4, 7.8, 5.1, -7);
  put(flat(plane(2 * CX, CZ0 - CZ1, mFloor, 1.5)), 0, .01, (CZ0 + CZ1) / 2);
  // upper floor slab (wood planks)
  const uf = (w, d, x, z) => put(box(w, .22, d, mPlanks, 1.3), x, G - .11, z);
  uf(12.6, 2.4, 0, -1.9); uf(12.6, 2.4, 0, -12.1); uf(2.4, 7.8, -5.1, -7); uf(2.4, 7.8, 5.1, -7);
  // beams
  const beamY = G - .15;
  put(box(2 * CX + .4, .3, .3, mWoodDark, 1), 0, beamY, CZ0); put(box(2 * CX + .4, .3, .3, mWoodDark, 1), 0, beamY, CZ1);
  put(box(.3, .3, CZ0 - CZ1, mWoodDark, 1), -CX, beamY, (CZ0 + CZ1) / 2); put(box(.3, .3, CZ0 - CZ1, mWoodDark, 1), CX, beamY, (CZ0 + CZ1) / 2);
  put(box(2 * CX + .4, .3, .3, mWoodDark, 1), 0, TOP - .15, CZ0); put(box(2 * CX + .4, .3, .3, mWoodDark, 1), 0, TOP - .15, CZ1);
  put(box(.3, .3, CZ0 - CZ1, mWoodDark, 1), -CX, TOP - .15, (CZ0 + CZ1) / 2); put(box(.3, .3, CZ0 - CZ1, mWoodDark, 1), CX, TOP - .15, (CZ0 + CZ1) / 2);

  // turned teak pillars
  const mPil = new THREE.MeshStandardMaterial({ map: T.wood_d, color: 0x7a4c34, roughness: .7 });
  function pillar(x, z, y0, H) {
    const pr = [[.15, 0], [.15, .1], [.11, .16], [.11, .5], [.16, .62], [.17, .78], [.12, .95], [.11, 1.1],
      [.11, H - 1.1], [.12, H - .95], [.17, H - .78], [.16, H - .62], [.11, H - .5], [.13, H - .4], [.2, H - .3], [.2, H - .2]];
    const m = new THREE.Mesh(new THREE.LatheGeometry(pr.map(p => new THREE.Vector2(p[0], p[1])), 14), mPil); m.castShadow = m.receiveShadow = true;
    const g = new THREE.Group(); g.add(m);
    put(box(.42, .3, .42, mFloor, 1), 0, .15, 0, g); put(box(.56, .16, .56, mWoodDark, 1), 0, H - .08, 0, g);
    put(box(.3, .14, .3, mWoodDark, 1), 0, H + .02 - .0, 0, g);
    g.position.set(x, y0, z); world.add(g);
  }
  const perim = [];
  for (let i = 0; i < 5; i++) perim.push([-CX + i * (2 * CX / 4), CZ0]);                    // front edge
  for (let i = 1; i < 5; i++) perim.push([CX, CZ0 + i * ((CZ1 - CZ0) / 4)]);                // right edge
  for (let i = 1; i < 5; i++) perim.push([CX - i * (2 * CX / 4), CZ1]);                     // back edge
  for (let i = 1; i < 4; i++) perim.push([-CX, CZ1 + i * ((CZ0 - CZ1) / 4)]);               // left edge
  perim.forEach(([x, z]) => { pillar(x, z, SILL, G - SILL - .0); pillar(x, z, G, U - .0); });
  // cusped arches between ground pillars
  function archGeo(w, h) {
    const s = new THREE.Shape(), n = 6, base = .3, rise = h * .4;
    s.moveTo(-w / 2, h); s.lineTo(-w / 2, base);
    let px = -w / 2, py = base;
    for (let i = 1; i <= n; i++) { const x = -w / 2 + w * i / n, y = base + rise * Math.sin(Math.PI * i / n); s.quadraticCurveTo((px + x) / 2, (py + y) / 2 + .13, x, y); px = x; py = y; }
    s.lineTo(w / 2, h); s.lineTo(-w / 2, h);
    return new THREE.ExtrudeGeometry(s, { depth: .1, bevelEnabled: false });
  }
  const arch = archGeo(1.62, .85);
  for (let i = 0; i < perim.length; i++) {
    const a = perim[i], b = perim[(i + 1) % perim.length];
    const m = new THREE.Mesh(arch, mWoodDark); m.castShadow = true;
    m.position.set((a[0] + b[0]) / 2, G - .3 - .85 + .0, (a[1] + b[1]) / 2 - (a[0] === b[0] ? 0 : .05));
    m.rotation.y = a[0] === b[0] ? Math.PI / 2 : 0;
    if (a[0] === b[0]) m.position.x -= .05;
    world.add(m);
  }
  // upper balustrade (instanced) + rails
  {
    const bal = new THREE.InstancedMesh(new THREE.BoxGeometry(.05, .85, .05), mWood, 220); let n = 0; const mx = new THREE.Matrix4();
    const run = (x0, z0, x1, z1) => { const L = Math.hypot(x1 - x0, z1 - z0), c = Math.round(L / .17); for (let i = 1; i < c; i++) { const t = i / c; mx.makeTranslation(lerp(x0, x1, t), G + .43, lerp(z0, z1, t)); bal.setMatrixAt(n++, mx); } };
    run(-CX, CZ0, CX, CZ0); run(CX, CZ0, CX, CZ1); run(CX, CZ1, -CX, CZ1); run(-CX, CZ1, -CX, CZ0);
    bal.count = n; bal.castShadow = true; world.add(bal);
    const rail = (w, d, x, z, y) => put(box(w, .09, d, mWoodDark, 1), x, y, z);
    for (const y of [G + .06, G + .95]) { rail(2 * CX, .14, 0, CZ0, y); rail(2 * CX, .14, 0, CZ1, y); rail(.14, CZ0 - CZ1, -CX, (CZ0 + CZ1) / 2, y); rail(.14, CZ0 - CZ1, CX, (CZ0 + CZ1) / 2, y); }
  }
  // roofs around the open chowk (sloping towards it)
  {
    const sl = .24, depth = 3.6;
    const L = box(depth, .17, 15, mRoof, 1.5); L.rotation.z = -sl; put(L, -CX - depth / 2 + .5 + .1, TOP + .5, -7);
    const R = box(depth, .17, 15, mRoof, 1.5); R.rotation.z = sl; put(R, CX + depth / 2 - .5 - .1, TOP + .5, -7);
    const F = box(14, .17, 3, mRoof, 1.5); F.rotation.x = -.25; put(F, 0, TOP + .38, CZ0 - .15 + .0 - .6 + 1.5 - 1.2 + .0);
    const Bk = box(14, .17, 3, mRoof, 1.5); Bk.rotation.x = .25; put(Bk, 0, TOP + .38, CZ1 + .15 - 1.2 + .0 + .6 - .6);
  }
  // doors & windows on the inner walls
  const doorBack = (x, glow) => { windowAt(x, SILL + 1.15, BZ + .06, 1.0, 2.3, glow, Math.PI); };
  [-3.1, 0, 3.1].forEach((x, i) => doorBack(x, i === 1));
  for (const s of [-1, 1]) for (const z of [-5.2, -8.8]) windowAt(s * (IX - .06), SILL + 1.15, z, 1.0, 2.3, false, s > 0 ? -Math.PI / 2 : Math.PI / 2);
  for (const x of [-3.1, 0, 3.1]) windowAt(x, G + 1.4, BZ + .06, .9, 1.4, true, Math.PI);
  for (const s of [-1, 1]) for (const z of [-5.2, -8.8]) windowAt(s * (IX - .06), G + 1.4, z, .9, 1.4, true, s > 0 ? -Math.PI / 2 : Math.PI / 2);

  /* ---------- the hinged door (real photo) ---------- */
  const crop = (x0, y0, w, h) => { const c = document.createElement('canvas'); c.width = 384; c.height = 1280; c.getContext('2d').drawImage(doorImg, x0, y0, w, h, 0, 0, 384, 1280); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; };
  const sx = doorImg.width / 1280, sy = doorImg.height / 2771;
  const texL = crop(282 * sx, 754 * sy, 322 * sx, 1338 * sy), texR = crop(604 * sx, 754 * sy, 323 * sx, 1338 * sy);
  const leafH = DOORTOP - SILL - .02;
  // left leaf hinged at x=-0.8, right leaf hinged at x=+0.8
  const L1 = (() => { const photo = new THREE.MeshStandardMaterial({ map: texL, roughness: .85 }); const m = new THREE.Mesh(new THREE.BoxGeometry(.8, leafH, .09), [mWoodDark, mWoodDark, mWoodDark, mWoodDark, photo, photo]); m.castShadow = true; m.position.x = .4; const g = new THREE.Group(); g.add(m); g.position.set(-.8, SILL + .01 + leafH / 2, -.3); m.position.y = 0; world.add(g); return { g, m }; })();
  const R1 = (() => { const photo = new THREE.MeshStandardMaterial({ map: texR, roughness: .85 }); const m = new THREE.Mesh(new THREE.BoxGeometry(.8, leafH, .09), [mWoodDark, mWoodDark, mWoodDark, mWoodDark, photo, photo]); m.castShadow = true; m.position.x = -.4; const g = new THREE.Group(); g.add(m); g.position.set(.8, SILL + .01 + leafH / 2, -.3); world.add(g); return { g, m }; })();
  const leaves = [L1.m, R1.m];
  const spill = new THREE.PointLight(0xffa24a, 0, 16, 2); spill.position.set(0, 1.9, -2.2); scene.add(spill);

  /* ---------- courtyard: tulsi vrindavan, rangoli, diyas ---------- */
  // tulsi vrindavan
  {
    const g = new THREE.Group();
    put(box(1.25, .3, 1.25, mCream, 1), 0, .15, 0, g); put(box(1.05, .3, 1.05, mWhite, 1), 0, .45, 0, g);
    put(box(.85, .75, .85, mOchre, 1), 0, .975, 0, g);
    put(box(.42, .42, .06, new THREE.MeshBasicMaterial({ color: 0x1a0c06 }), 1), 0, 1.0, .44, g);
    put(box(.3, .05, .1, mBrass, 1), 0, .78, .45, g);
    for (const s of [-1, 1]) { put(box(.06, .62, .06, mRose, 1), s * .3, .98, .43, g); }
    put(box(1.0, .12, 1.0, mCream, 1), 0, 1.4, 0, g);
    const soil = new THREE.Mesh(new THREE.CylinderGeometry(.36, .3, .14, 16), new THREE.MeshStandardMaterial({ color: 0x3a2417, roughness: 1 })); put(soil, 0, 1.52, 0, g);
    const lm = new THREE.MeshStandardMaterial({ color: 0x3d8a3a, roughness: .7 });
    for (let i = 0; i < 18; i++) { const s = new THREE.Mesh(new THREE.IcosahedronGeometry(.1 + rand() * .07, 1), lm); s.position.set((rand() - .5) * .5, 1.7 + rand() * .55, (rand() - .5) * .5); s.castShadow = true; g.add(s); }
    put(box(.04, 1.0, .04, mWoodDark, 1), 0, 2.25, 0, g);
    g.position.set(0, 0, -9.7); world.add(g);
  }
  // rangoli (procedural mandala drawn on a canvas)
  const rangoliCenter = V(0, 0, -6.3);
  {
    const S = 1024, c = document.createElement('canvas'); c.width = c.height = S; const g = c.getContext('2d'); g.translate(S / 2, S / 2);
    const R = S / 2 - 8;
    const petals = (n, r0, r1, w, col, stroke) => { for (let i = 0; i < n; i++) { g.save(); g.rotate(i * 2 * Math.PI / n); g.beginPath(); g.moveTo(0, r0); g.bezierCurveTo(w, r0 + (r1 - r0) * .3, w, r0 + (r1 - r0) * .85, 0, r1); g.bezierCurveTo(-w, r0 + (r1 - r0) * .85, -w, r0 + (r1 - r0) * .3, 0, r0); g.fillStyle = col; g.fill(); if (stroke) { g.strokeStyle = stroke; g.lineWidth = 4; g.stroke(); } g.restore(); } };
    const ring = (r, col, lw) => { g.beginPath(); g.arc(0, 0, r, 0, 7); g.strokeStyle = col; g.lineWidth = lw; g.stroke(); };
    g.fillStyle = 'rgba(30,18,10,.55)'; g.beginPath(); g.arc(0, 0, R, 0, 7); g.fill();
    ring(R - 6, '#f6efe0', 8); for (let i = 0; i < 96; i++) { g.save(); g.rotate(i * Math.PI / 48); g.beginPath(); g.arc(0, R - 30, 6, 0, 7); g.fillStyle = '#fff6e6'; g.fill(); g.restore(); }
    petals(32, R * .74, R * .94, 22, '#f6efe0'); petals(32, R * .76, R * .88, 11, '#c1121f');
    petals(16, R * .5, R * .78, 52, '#e8731c', '#fff6e6'); petals(16, R * .5, R * .72, 28, '#f7c52b');
    ring(R * .5, '#fff6e6', 6); petals(8, R * .27, R * .56, 60, '#c1121f', '#fff6e6'); petals(8, R * .27, R * .5, 30, '#f08a8a');
    g.beginPath(); g.arc(0, 0, R * .24, 0, 7); g.fillStyle = '#2e6b3f'; g.fill(); ring(R * .24, '#fff6e6', 6);
    petals(12, 0, R * .2, 24, '#f7c52b'); g.beginPath(); g.arc(0, 0, R * .07, 0, 7); g.fillStyle = '#c1121f'; g.fill();
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
    const r = new THREE.Mesh(new THREE.CircleGeometry(2.4, 64), new THREE.MeshStandardMaterial({ map: t, transparent: true, roughness: .95, polygonOffset: true, polygonOffsetFactor: -2 }));
    r.rotation.x = -Math.PI / 2; r.position.copy(rangoliCenter).setY(.022); r.receiveShadow = true; world.add(r);
  }
  // soft flame sprite texture
  const flameTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'); const gr = g.createRadialGradient(32, 40, 2, 32, 34, 30); gr.addColorStop(0, 'rgba(255,250,210,1)'); gr.addColorStop(.25, 'rgba(255,190,80,.9)'); gr.addColorStop(.6, 'rgba(255,120,30,.35)'); gr.addColorStop(1, 'rgba(255,90,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); return new THREE.CanvasTexture(c); })();
  const flames = [];
  const flame = (x, y, z, s = .3) => { const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: flameTex, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false })); sp.position.set(x, y, z); sp.scale.set(s, s * 1.5, 1); sp.userData = { s, ph: rand() * 6.28 }; scene.add(sp); flames.push(sp); return sp; };
  const clay = new THREE.MeshStandardMaterial({ color: 0xb4663a, roughness: .9 });
  const diyaLights = [];
  for (let i = 0; i < 18; i++) {
    const a = i * Math.PI * 2 / 18, x = rangoliCenter.x + Math.cos(a) * 2.75, z = rangoliCenter.z + Math.sin(a) * 2.75;
    const b = new THREE.Mesh(new THREE.CylinderGeometry(.085, .055, .05, 14), clay); b.position.set(x, .045, z); b.castShadow = true; world.add(b);
    flame(x, .16, z, .26);
  }
  for (const [x, z] of [[0, -5.0]]) { const l = new THREE.PointLight(0xffc080, 0, 12, 1.6); l.position.set(x, .6, z); scene.add(l); diyaLights.push(l); }
  // brass lanterns hung from the beams
  const lantern = new THREE.MeshStandardMaterial({ color: 0xc99a3e, metalness: .85, roughness: .4, emissive: 0xffa040, emissiveIntensity: 0 });
  const lampLights = [];
  for (const [x, z, dark] of [[-CX + .5, CZ0 - .6], [CX - .5, CZ0 - .6], [-CX + .5, CZ1 + .6], [CX - .5, CZ1 + .6], [-1.95, CZ0 - .6, 1], [1.95, CZ0 - .6, 1]]) {
    const gp = new THREE.Group();
    put(new THREE.Mesh(new THREE.CylinderGeometry(.01, .01, .6, 6), mBrass), 0, .3, 0, gp);
    put(new THREE.Mesh(new THREE.CylinderGeometry(.08, .13, .26, 8, 1, true), lantern), 0, -.1, 0, gp);
    put(new THREE.Mesh(new THREE.ConeGeometry(.15, .13, 8), mBrass), 0, .09, 0, gp);
    const fl = flame(0, -.1, 0, .3); scene.remove(fl); gp.add(fl);
    gp.position.set(x, G - .3 - .6, z); world.add(gp);
    if (dark) continue;                       /* decorative lantern only: fewer real lights keeps phones happy */
    const l = new THREE.PointLight(0xffc890, 0, 15, 1.6); l.position.set(x, G - .9, z); scene.add(l); lampLights.push(l);
  }
  // marigold torans (instanced flowers)
  const FL = [], LF = [], colz = [0xf08a1c, 0xf6b81e, 0xe5600e];
  const swag = (a, b, sag, n, r = .065) => { for (let i = 0; i <= n; i++) { const t = i / n, p = V(lerp(a.x, b.x, t), lerp(a.y, b.y, t) - sag * 4 * t * (1 - t), lerp(a.z, b.z, t)); for (let j = 0; j < 2; j++) FL.push({ p: p.clone().add(V((rand() - .5) * .05, (rand() - .5) * .05 - j * .05, (rand() - .5) * .05)), c: colz[(i + j) % 3], s: r * (.85 + rand() * .35) }); } };
  const strand = (x, y, z, len) => { const n = Math.max(2, Math.round(len / .1)); for (let i = 1; i <= n; i++) FL.push({ p: V(x, y - i * .1, z), c: colz[i % 3], s: .055 }); LF.push({ p: V(x, y - n * .1 - .09, z) }); };
  // over the entrance (outside)
  swag(V(-1.02, 3.08, .16), V(-.34, 3.08, .16), .16, 9); swag(V(-.34, 3.08, .16), V(.34, 3.08, .16), .16, 9); swag(V(.34, 3.08, .16), V(1.02, 3.08, .16), .16, 9);
  for (let x = -.9; x <= .91; x += .22) strand(x, 3.0, .17, .3 + rand() * .22);
  for (const s of [-1, 1]) for (let i = 0; i < 16; i++) FL.push({ p: V(s * 1.04, 3.0 - i * .1, .17), c: colz[i % 3], s: .06 });
  // along the verandah beams
  for (let i = 0; i < perim.length; i++) { const a = perim[i], b = perim[(i + 1) % perim.length]; const off = a[0] === b[0] ? V(a[0] > 0 ? -.2 : .2, 0, 0) : V(0, 0, a[1] > -7 ? -.2 : .2); swag(V(a[0], G - .4, a[1]).add(off), V(b[0], G - .4, b[1]).add(off), .42, 13, .06); }
  {
    const fm = new THREE.InstancedMesh(new THREE.SphereGeometry(1, 8, 6), new THREE.MeshStandardMaterial({ roughness: .55 }), FL.length), mx = new THREE.Matrix4(), cc = new THREE.Color();
    FL.forEach((f, i) => { mx.makeScale(f.s, f.s * .85, f.s); mx.setPosition(f.p); fm.setMatrixAt(i, mx); fm.setColorAt(i, cc.set(f.c)); });
    fm.castShadow = true; world.add(fm);
    const lm = new THREE.InstancedMesh(new THREE.ConeGeometry(.05, .17, 5), mLeaf, LF.length); LF.forEach((f, i) => { mx.makeRotationX(Math.PI); mx.setPosition(f.p); lm.setMatrixAt(i, mx); }); world.add(lm);
  }
  // wooden swing (jhula) in the left verandah
  const swing = new THREE.Group();
  { for (const z of [-.55, .55]) put(new THREE.Mesh(new THREE.CylinderGeometry(.014, .014, 2.4, 6), mBrass), 0, -1.2, z, swing);
    put(box(.5, .07, 1.5, mPlanks, 1), 0, -2.4, 0, swing); put(box(.06, .5, 1.5, mWoodDark, 1), -.22, -2.15, 0, swing);
    swing.position.set(-5.1, G - .35, -7.0); world.add(swing); }
  // dust motes in the light
  const dustN = 260, dustPos = new Float32Array(dustN * 3);
  for (let i = 0; i < dustN; i++) { dustPos[i * 3] = (rand() - .5) * 7.4; dustPos[i * 3 + 1] = .4 + rand() * 5.5; dustPos[i * 3 + 2] = -3.6 - rand() * 7; }
  const dustGeo = new THREE.BufferGeometry(); dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
  scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ map: flameTex, size: .09, transparent: true, opacity: .5, blending: THREE.AdditiveBlending, depthWrite: false, color: 0xffd9a0 })));

  /* ---------- the old town around it (for the aerial view) ---------- */
  document.documentElement.dataset.stage='built-yard';
  const washes = [mCream, mOchre, mWhite, mRose, mCream];
  const mRoofB = M('roof_d', null, { c: 0xd9bba8, r: .85 }), mRoofC = M('roof_d', null, { c: 0xc6a38f, r: .85 });
  function house(x, z, w, d, h, rot = 0) {
    const g = new THREE.Group(), mat = washes[Math.floor(rand() * washes.length)], rm = [mRoof, mRoofB, mRoofC][Math.floor(rand() * 3)];
    put(box(w, h, d, mat, 3, false), 0, h / 2, 0, g);
    const rise = 1.3 + rand() * .7, half = w / 2 + .45, ang = Math.atan2(rise, half), len = Math.hypot(half, rise);
    for (const s of [-1, 1]) { const r = box(len, .16, d + 1.0, rm, 1.5, false); r.position.set(s * half / 2, h + rise / 2, 0); r.rotation.z = -s * ang; g.add(r); }
    g.position.set(x, 0, z); g.rotation.y = rot; world.add(g);
  }
  [[-11, 6.6], [-17.5, 5.8], [-24, 7.2]].forEach(([x, h]) => house(x, -7, 6.2, 14, h));
  [[11, 6.4], [17.5, 7], [24, 5.8]].forEach(([x, h]) => house(x, -7, 6.2, 14, h));
  for (let i = -4; i <= 4; i++) house(i * 7.6 + rand() * 1.4, -22 + rand() * 2, 6.4, 11 + rand() * 3, 5 + rand() * 2.6, rand() > .75 ? Math.PI / 2 : 0);
  for (let i = -5; i <= 5; i++) house(i * 7.2 + rand(), 17.5 + rand() * 2, 6.2, 9 + rand() * 3, 5 + rand() * 2.6, rand() > .8 ? Math.PI / 2 : 0);
  for (let i = -3; i <= 3; i++) house(i * 9 + 3, -38, 7, 13, 5 + rand() * 3);
  for (let i = -3; i <= 3; i++) house(i * 9, 33, 7, 12, 5 + rand() * 2.6);
  // trees
  const trunk = new THREE.MeshStandardMaterial({ color: 0x4a3426, roughness: 1 }), canopy = new THREE.MeshStandardMaterial({ color: 0x4a7a3a, roughness: .85 });
  for (const [x, z] of [[-15, 4], [15, 4], [10.5, 13]]) {
    const t = new THREE.Mesh(new THREE.CylinderGeometry(.18, .26, 3.2, 8), trunk); t.position.set(x, 1.6, z); world.add(t);
    for (let i = 0; i < 5; i++) { const c = new THREE.Mesh(new THREE.IcosahedronGeometry(1.2 + rand() * .7, 1), canopy); c.position.set(x + (rand() - .5) * 2, 3.6 + rand() * 1.6, z + (rand() - .5) * 2); world.add(c); }
  }
  // "tap here" ring on the door
  const ringTex = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); g.strokeStyle = 'rgba(255,225,160,1)'; g.lineWidth = 6; g.beginPath(); g.arc(64, 64, 52, 0, 7); g.stroke(); g.lineWidth = 2; g.beginPath(); g.arc(64, 64, 34, 0, 7); g.stroke(); return new THREE.CanvasTexture(c); })();
  const tapRing = new THREE.Sprite(new THREE.SpriteMaterial({ map: ringTex, transparent: true, depthTest: false, blending: THREE.AdditiveBlending, opacity: 0 }));
  tapRing.position.set(0, 1.55, .3); tapRing.scale.set(.7, .7, 1); scene.add(tapRing);

  /* ---------- light mood: golden hour -> dusk with lamps ---------- */
  const m0 = { top: new THREE.Color(0x5b86c0), hor: new THREE.Color(0xffc89c), fog: new THREE.Color(0xe8c8a8), sun: new THREE.Color(0xffdcb4), sunI: 3.4, hemiS: new THREE.Color(0xffe4c8), hemiI: 1.35, exp: 1.25, fogD: .0055 };
  const m1 = { top: new THREE.Color(0x141a3a), hor: new THREE.Color(0xdc7238), fog: new THREE.Color(0x4a3a44), sun: new THREE.Color(0x9db2ff), sunI: .9, hemiS: new THREE.Color(0x8c99d4), hemiI: .9, exp: 1.3, fogD: .007 };
  function mood(k) {
    skyU.top.value.lerpColors(m0.top, m1.top, k); skyU.hor.value.lerpColors(m0.hor, m1.hor, k);
    scene.fog.color.lerpColors(m0.fog, m1.fog, k); scene.fog.density = lerp(m0.fogD, m1.fogD, k);
    sun.color.lerpColors(m0.sun, m1.sun, k); sun.intensity = lerp(m0.sunI, m1.sunI, k);
    hemi.color.lerpColors(m0.hemiS, m1.hemiS, k); hemi.intensity = lerp(m0.hemiI, m1.hemiI, k);
    renderer.toneMappingExposure = lerp(m0.exp, m1.exp, k);
    stars.material.opacity = sm((k - .55) / .45) * .9;
    lantern.emissiveIntensity = sm((k - .2) / .6) * 1.4;
    return sm((k - .2) / .7);
  }

  /* ---------- camera paths ---------- */
  const flightPos = new THREE.CatmullRomCurve3([V(-34, 22, 40), V(-24, 14, 34), V(-12, 7, 25), V(-3, 3.2, 16), V(0, 1.7, 9.8)], false, 'centripetal');
  const flightTgt = new THREE.CatmullRomCurve3([V(0, 3, -7), V(0, 3, -3), V(0, 2.6, -1), V(0, 2.3, 0), V(0, 2.0, 0)], false, 'centripetal');
  const dollyPos = new THREE.CatmullRomCurve3([V(0, 1.7, 9.8), V(0, 1.72, 4.6), V(0, 1.78, .5), V(0, 2.12, -2.2), V(0, 2.2, -4.6)], false, 'centripetal');
  const dollyTgt = new THREE.CatmullRomCurve3([V(0, 2.0, 0), V(0, 2.0, -4), V(0, 2.2, -8), V(0, 2.6, -10), V(0, 2.1, -9.4)], false, 'centripetal');
  const AER = V(-34, 22, 40), CEN = V(0, 3, -7), YARDP = V(0, 2.2, -4.6), YARDT = V(0, 2.1, -9.4);

  let state = 'aerial', tState = 0, flightU = 0, k = 0, leafT = -1, leafA = 0, droneOn = false, droneT = 0;
  const FLIGHT_T = small ? 10 : 12, DOLLY_T = 7.5;
  const mouse = { x: 0, y: 0, sx: 0, sy: 0 };
  addEventListener('pointermove', e => { mouse.x = (e.clientX / innerWidth - .5) * 2; mouse.y = (e.clientY / innerHeight - .5) * 2; });
  const clock = new THREE.Clock();
  const tmpP = V(0, 0, 0), tmpT = V(0, 0, 0);

  /* ---------- interaction ---------- */
  const ray = new THREE.Raycaster(), ndc = new THREE.Vector2();
  const hit = e => { ndc.set(e.clientX / innerWidth * 2 - 1, -(e.clientY / innerHeight) * 2 + 1); ray.setFromCamera(ndc, camera); return ray.intersectObjects(leaves, false).length > 0; };
  cv.addEventListener('pointermove', e => { cv.style.cursor = state === 'door' && hit(e) ? 'pointer' : 'default'; });
  cv.addEventListener('click', e => { if (state === 'door' && hit(e)) openDoor(); });
  function startFlight() { if (state !== 'aerial') return; state = 'flight'; tState = 0; }
  function openDoor() { if (state !== 'door') return; state = 'open'; tState = 0; leafT = 0; emit('wada:opening'); }
  window.addEventListener('wada:descend', startFlight);
  window.addEventListener('wada:open', openDoor);
  window.addEventListener('wada:drone', e => { droneOn = !!e.detail; });

  /* ---------- main loop ---------- */
  const alt = $('#alt'), spd = $('#spd');
  const lanternBase = lampLights.map(() => rand() * 6);
  function pose() {
    const time = clock.elapsedTime;
    let lamps = 0;
    if (state === 'aerial') {
      const a = Math.sin(time * .12) * .16, d = AER.clone().sub(CEN);
      tmpP.set(d.x * Math.cos(a) + d.z * Math.sin(a), d.y, -d.x * Math.sin(a) + d.z * Math.cos(a)).add(CEN); tmpT.copy(CEN); k = 0;
    } else if (state === 'flight') {
      const u = ease(flightU); flightPos.getPoint(u, tmpP); flightTgt.getPoint(u, tmpT); k = lerp(0, .35, u);
      if (alt) alt.textContent = Math.round(tmpP.y * 2.6); if (spd) spd.textContent = (3.4 * (1 - u * .9)).toFixed(1);
    } else if (state === 'door' || state === 'open') {
      tmpP.set(Math.sin(time * .5) * .04, 1.7 + Math.sin(time * .7) * .015, 9.8); tmpT.set(0, 2.0, 0); k = .35;
    } else if (state === 'dolly') {
      const u = ease(clamp(tState / DOLLY_T)); dollyPos.getPoint(u, tmpP); dollyTgt.getPoint(u, tmpT); k = lerp(.35, 1, sm(clamp(tState / DOLLY_T)));
    } else {                                                         // yard (+ optional drone view)
      mouse.sx = lerp(mouse.sx, mouse.x, .04); mouse.sy = lerp(mouse.sy, mouse.y, .04);
      tmpP.copy(YARDP).add(V(mouse.sx * .45, -mouse.sy * .06, 0)); tmpT.copy(YARDT).add(V(mouse.sx * 3.2, -mouse.sy * 1.3 + Math.sin(time * .3) * .1, 0)); k = 1;
      droneT = lerp(droneT, droneOn ? 1 : 0, .035);
      if (droneT > .001) {
        const e = sm(droneT), a = time * .09 + 1.0, dp = V(CEN.x + Math.cos(a) * 24, 26, CEN.z + Math.sin(a) * 24);
        tmpP.lerp(dp, e); tmpT.lerp(V(0, 2, -7), e); k = lerp(1, .55, e);
      }
    }
    camera.position.copy(tmpP); camera.lookAt(tmpT);
    return mood(k);
  }
  function tick() {
    const dt = Math.min(clock.getDelta(), .05) * FF, time = clock.elapsedTime;
    if (document.documentElement.dataset.state !== state) document.documentElement.dataset.state = state;
    if (!SHOT) tState += dt;
    if (state === 'flight' && !SHOT) { flightU = clamp(tState / FLIGHT_T); if (flightU >= 1) { state = 'door'; tState = 0; emit('wada:door'); } }
    if (leafT >= 0 && !SHOT) leafT += dt;
    if (state === 'open' && !SHOT && tState > 1.0) { state = 'dolly'; tState = 0; }
    if (state === 'dolly' && !SHOT && tState >= DOLLY_T) { state = 'yard'; tState = 0; emit('wada:yard'); }
    const lampK = pose();
    if (leafT >= 0 && !SHOT) leafA = 1.75 * (1 - Math.pow(1 - clamp(leafT / 3.4), 3));
    L1.g.rotation.y = leafA; R1.g.rotation.y = -leafA;
    const open = leafA / 1.75;
    spill.intensity = open * 26 * (state === 'yard' || state === 'dolly' ? 1 : 1);
    tapRing.material.opacity = state === 'door' ? .55 + Math.sin(time * 3.2) * .3 : 0;
    const rs = .7 + Math.sin(time * 3.2) * .08; tapRing.scale.set(rs, rs, 1);
    lampLights.forEach((l, i) => { l.intensity = lampK * (30 + Math.sin(time * 9 + lanternBase[i]) * 3 + Math.sin(time * 13.3 + i) * 1.5); });
    diyaLights.forEach((l, i) => { l.intensity = lampK * (16 + Math.sin(time * 11 + i * 2) * 2 + Math.sin(time * 17 + i) * 1); });
    flames.forEach(f => { const u = f.userData, fl = 1 + Math.sin(time * 11 + u.ph) * .1 + Math.sin(time * 23 + u.ph * 2) * .06; f.scale.set(u.s * fl, u.s * 1.5 * fl, 1); f.material.opacity = .25 + lampK * .75; });
    swing.rotation.z = Math.sin(time * .9) * .06;
    const dp = dustGeo.attributes.position; for (let i = 0; i < dustN; i++) { let y = dp.getY(i) + dt * .05; if (y > 6) y = .4; dp.setY(i, y); dp.setX(i, dp.getX(i) + Math.sin(time * .3 + i) * dt * .02); } dp.needsUpdate = true;
    if (state === 'yard' && scrollY > innerHeight * 1.4) return;      // pause when the hero is off-screen
    renderer.render(scene, camera);
  }

  /* ---------- screenshot / test poses ---------- */
  document.documentElement.dataset.stage='built-all';
  if (SHOT) {
    document.documentElement.classList.add('shot'); if (Q.get('ui')) document.documentElement.classList.add('shotui');
    const P = { aerial: () => { state = 'aerial'; }, f1: () => { state = 'flight'; flightU = .33; }, f2: () => { state = 'flight'; flightU = .7; }, f3: () => { state = 'flight'; flightU = .92; },
      door: () => { state = 'door'; }, open: () => { state = 'door'; leafA = 1.75; leafT = 99; }, half: () => { state = 'door'; leafA = .8; },
      d1: () => { state = 'dolly'; tState = DOLLY_T * .35; leafA = 1.75; }, d2: () => { state = 'dolly'; tState = DOLLY_T * .6; leafA = 1.75; },
      yard: () => { state = 'yard'; leafA = 1.75; }, drone: () => { state = 'yard'; leafA = 1.75; droneOn = true; droneT = 1; } };
    (P[SHOT] || P.aerial)();
    for (let i = 0; i < 3; i++) tick();
    { const gl = renderer.getContext(), px = new Uint8Array(4); gl.readPixels(Math.floor(gl.drawingBufferWidth / 2), Math.floor(gl.drawingBufferHeight / 2), 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px);
      document.documentElement.dataset.px = px.join(','); document.documentElement.dataset.calls = renderer.info.render.calls + '/' + renderer.info.render.triangles + '/' + renderer.info.programs.length; document.documentElement.dataset.glerr = gl.getError(); }
    { const im = new Image(); im.src = cv.toDataURL('image/png'); im.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;z-index:5'; document.body.appendChild(im); }
    window.__ready = true; document.documentElement.dataset.stage = 'rendered';
  }
  if (!SHOT) { if (FF > 1) setInterval(tick, 150); else renderer.setAnimationLoop(tick); }   /* FF>1 is a test mode: headless browsers don't fire animation frames */
  document.body.classList.add('gl');
  emit('wada:ready');
}

main().catch(e => { console.error('3D failed', e); document.documentElement.dataset.err = String(e && e.stack || e).slice(0, 600); emit('wada:fail'); });
