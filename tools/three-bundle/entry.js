/* Point d'entrée du bundle : n'importe que les symboles three.js utilisés par js/atlas.js et js/hip.js,
   et les expose dans le global `window.THREE` (même interface que l'ancien build r128). */
import {
  AdditiveBlending,
  Box3,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  CircleGeometry,
  Color,
  ColorManagement,
  DirectionalLight,
  DoubleSide,
  Float32BufferAttribute,
  FrontSide,
  Group,
  HemisphereLight,
  LatheGeometry,
  LinearSRGBColorSpace,
  Matrix4,
  Mesh,
  MeshBasicMaterial as ThreeMeshBasicMaterial,
  MeshStandardMaterial as ThreeMeshStandardMaterial,
  PerspectiveCamera,
  Plane,
  Quaternion,
  Raycaster,
  REVISION,
  Scene,
  ShaderMaterial as ThreeShaderMaterial,
  SphereGeometry,
  TOUCH,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/* Rendu identique à r128 : pas de gestion de couleur (les couleurs hex/hsl du site sont utilisées telles quelles)
   et sortie linéaire. À faire avant toute création de THREE.Color. Voir README.md. */
ColorManagement.enabled = false;

/* r128 dessinait en UNE passe un matériau transparent à double face ; three.js >= r130 le dessine en deux passes
   (faces arrière puis avant) sauf si `forceSinglePass` est vrai. On garde l'ancien comportement pour tous les
   matériaux du site : sous-classes sans autre changement. */
class MeshBasicMaterial extends ThreeMeshBasicMaterial {
  constructor(parameters) {
    super(parameters);
    this.forceSinglePass = true;
  }
}
class MeshStandardMaterial extends ThreeMeshStandardMaterial {
  constructor(parameters) {
    super(parameters);
    this.forceSinglePass = true;
  }
}
class ShaderMaterial extends ThreeShaderMaterial {
  constructor(parameters) {
    super(parameters);
    this.forceSinglePass = true;
  }
}

/* Ordre de tri des objets transparents de r128 : la profondeur d'un objet était celle de l'ORIGINE de son
   repère (matrixWorld), alors que three.js >= r15x utilise le centre de sa sphère englobante. Les modèles du site
   ont leurs sommets en coordonnées « monde » (origine commune), donc r128 les dessinait dans l'ordre de création
   et l'apparence en dépend (nerfs vus à travers les muscles). On rétablit ce tri : renderer.setTransparentSort(
   THREE.legacyTransparentSort(camera) ). */
function legacyTransparentSort(camera) {
  const v = new Vector3();
  const pv = new Matrix4();
  const depth = (item) =>
    v.setFromMatrixPosition(item.object.matrixWorld).applyMatrix4(pv).z;
  return (a, b) => {
    if (a.groupOrder !== b.groupOrder) return a.groupOrder - b.groupOrder;
    if (a.renderOrder !== b.renderOrder) return a.renderOrder - b.renderOrder;
    pv.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    const za = depth(a);
    const zb = depth(b);
    if (za !== zb) return zb - za;
    return a.id - b.id;
  };
}

/* Facteur sur l'intensité des lumières (ambiante, hémisphérique, directionnelles) :
   - π : depuis r155 les intensités sont physiques (r128 multipliait l'éclairement par π en interne) ;
   - 1,04 : le modèle MeshStandardMaterial conserve maintenant l'énergie (diffus × (1 - Fresnel), multi-diffusion),
     ce qui assombrit d'environ 4 % la scène du site ; 1,04 mesuré (scène test r128 vs r187) ramène l'écart moyen
     à ~0,2/255 au lieu de ~1,6/255. */
const ATLAS_LIGHT_SCALE = Math.PI * 1.04;

window.THREE = {
  ATLAS_LIGHT_SCALE,
  legacyTransparentSort,
  AdditiveBlending,
  Box3,
  BufferAttribute,
  BufferGeometry,
  CatmullRomCurve3,
  CircleGeometry,
  Color,
  ColorManagement,
  DirectionalLight,
  DoubleSide,
  Float32BufferAttribute,
  FrontSide,
  Group,
  HemisphereLight,
  LatheGeometry,
  LinearSRGBColorSpace,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  OrbitControls,
  PerspectiveCamera,
  Plane,
  Quaternion,
  Raycaster,
  REVISION,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  TOUCH,
  TorusGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
};
