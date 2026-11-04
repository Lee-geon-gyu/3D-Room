import {FrontSide} from 'three';

// A thin architectural pane needs reflected edges, not a second full-scene
// transmission render. Keep the native glass geometry and environment detail.
export function configureThinGlass(material){
 material.transmission=0;material.thickness=0;
 material.transparent=true;material.opacity=.12;
 material.color.set(0xe4f0f1);material.metalness=.04;material.roughness=.10;
 material.clearcoat=1;material.clearcoatRoughness=.09;material.envMapIntensity=1.1;
 material.side=FrontSide;material.forceSinglePass=true;material.depthWrite=false;
 material.lightMap=null;material.lightMapIntensity=0;
 material.onBeforeCompile=shader=>{
  shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`
   float glassFacing=clamp(abs(dot(normal,normalize(vViewPosition))),0.0,1.0);
   diffuseColor.a=.10+.34*pow(1.0-glassFacing,5.0);
   #include <opaque_fragment>`);
 };
 material.customProgramCacheKey=()=> 'thin-architectural-fresnel-v1';
 material.needsUpdate=true;return material;
}
