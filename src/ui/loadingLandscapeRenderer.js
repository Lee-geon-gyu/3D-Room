import * as THREE from 'three';
import {landscapeLayers,landscapePlane,landscapeResolution} from './loadingLandscapeModel.js';
import {createCloudGeometries} from './cloudPlaneGeometry.js';

const vertex=`
 varying vec2 vUv;uniform float time,relief;
 void main(){
  vUv=uv;vec3 p=position;
  float bank=1.-smoothstep(.38,.49,uv.y);
  p.z+=bank*relief*(sin(uv.x*9.+time*.07)*.5+sin(uv.x*17.+uv.y*7.-time*.05)*.22);
  gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
 }
`;
const fragment=`
 uniform sampler2D environment;uniform float time,opacity,drift,solid,distant;varying vec2 vUv;
 float haze(vec2 p){return sin(p.x*13.+p.y*9.)*.5+sin(p.x*23.-p.y*17.)*.25;}
 void main(){
  float bank=1.-smoothstep(.38,.49,vUv.y);
  // Advect the cloud sea itself, rather than faintly cross-fading stationary
  // copies. Mirrored wrapping joins banks continuously without a reset or seam.
  // The mask leaves the clean upper sky and distant mountains stationary.
  float wind=mod(time*abs(drift),2.);
  vec4 art=texture2D(environment,vec2(vUv.x-wind,vUv.y));
  if(solid>.5)art=texture2D(environment,vUv);
  float alpha=mix(opacity*bank,1.,solid);
  if(distant>.5){
   // A separate, slower veil replaces the formerly frozen horizon. Sample only
   // the cloud sea below the peaks: no mountain ever gets carried with the fog.
   vec2 flow=vec2(vUv.x-wind,vUv.y-.047);
   flow+=vec2(sin(vUv.y*23.+time*.035),haze(vec2(vUv.x-time*.002,vUv.y)))*.002;
   art=texture2D(environment,flow);
   float feather=haze(vec2(vUv.x-time*.002,vUv.y))*.003;
   float fog=smoothstep(.35,.425,vUv.y)*(1.-smoothstep(.495+feather,.528+feather,vUv.y));
   float betweenPeaks=smoothstep(.14,.23,vUv.x)*(1.-smoothstep(.83,.91,vUv.x));
   fog*=mix(1.,betweenPeaks,smoothstep(.465,.515,vUv.y));
   alpha=opacity*fog;
  }
  gl_FragColor=vec4(art.rgb,alpha);
  #include <colorspace_fragment>
 }
`;

// DOM-free renderer shared by the dedicated worker and the compatibility path.
export async function createLandscapeRenderer(canvas,{imageUrl,reducedMotion=false,signal}={}){
 const response=await fetch(imageUrl,{signal});if(!response.ok)throw new Error('Cloud artwork unavailable');
 const bitmap=await createImageBitmap(await response.blob(),{imageOrientation:'flipY',premultiplyAlpha:'none',colorSpaceConversion:'none'});
 if(signal?.aborted){bitmap.close();throw new DOMException('Aborted','AbortError');}
 const texture=new THREE.Texture(bitmap);texture.colorSpace=THREE.SRGBColorSpace;texture.flipY=false;
 texture.wrapS=THREE.MirroredRepeatWrapping;
 texture.minFilter=THREE.LinearFilter;texture.generateMipmaps=false;texture.needsUpdate=true;
 let renderer;
 try{renderer=new THREE.WebGLRenderer({canvas,alpha:false,antialias:false,powerPreference:'low-power'});}catch(error){texture.dispose();bitmap.close();throw error;}
 renderer.setPixelRatio(1);renderer.setClearColor('#b7c7bc');
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(42,1,.1,180);
 camera.position.set(0,0,12);camera.lookAt(0,0,-40);
 const geometries=createCloudGeometries(),materials=[];
 const pointer={x:0,y:0},sway={x:0,y:0};
 const state={cloudTime:'0.000',parallax:'0.000,0.000',renderSize:'',frames:0,maxFrameGapMs:0};
 let disposed=false,paused=false,last=0,elapsed=0;
 const banks=landscapeLayers.map((layer,index)=>{
  const material=new THREE.ShaderMaterial({uniforms:{environment:{value:texture},time:{value:0},relief:{value:layer.relief},opacity:{value:layer.opacity},drift:{value:layer.drift},solid:{value:index===0?1:0},distant:{value:layer.distant?1:0}},vertexShader:vertex,fragmentShader:fragment,transparent:index>0,depthWrite:false,toneMapped:false});
  const geometry=index===0?geometries.base:layer.distant?geometries.distant:geometries.foreground;
  materials.push(material);const bank=new THREE.Mesh(geometry,material);bank.position.z=layer.z;bank.renderOrder=index;bank.frustumCulled=false;scene.add(bank);return bank;
 });
 function draw(now){
  if(disposed||paused)return false;
  if(last&&!reducedMotion&&now-last<1000/30)return false;
  const delta=last?Math.max(0,(now-last)/1000):0;last=now;
  if(!reducedMotion)elapsed+=delta;
  if(state.frames>1)state.maxFrameGapMs=Math.max(state.maxFrameGapMs,Math.round(delta*1000));
  for(const material of materials)material.uniforms.time.value=elapsed;
  const follow=1-Math.exp(-Math.min(delta,.25)*4);
  sway.x+=(pointer.x-sway.x)*follow;sway.y+=(pointer.y-sway.y)*follow;
  camera.position.x=reducedMotion?0:sway.x*.65+Math.sin(elapsed*.065)*.06;
  camera.position.y=reducedMotion?0:-sway.y*.28+Math.sin(elapsed*.052)*.025;
  camera.updateMatrixWorld();renderer.render(scene,camera);
  state.cloudTime=elapsed.toFixed(3);state.parallax=`${sway.x.toFixed(3)},${sway.y.toFixed(3)}`;state.frames++;
  return true;
 }
 return {
  state,draw,
  resize(width,height){
   if(disposed)return;const size=landscapeResolution(Math.max(1,width),Math.max(1,height));
   camera.aspect=width/height;camera.updateProjectionMatrix();renderer.setSize(size.width,size.height,false);
   banks.forEach((bank,index)=>{const fit=landscapePlane(camera.aspect,12-landscapeLayers[index].z);bank.scale.set(fit.width,fit.height,1);});
   state.renderSize=`${size.width}x${size.height}`;last=0;draw(performance.now());
  },
  pointer(x,y){pointer.x=x;pointer.y=y;},
  pause(value){paused=value;last=0;if(!value&&reducedMotion)draw(performance.now());},
  dispose(){if(disposed)return;disposed=true;geometries.dispose();materials.forEach(material=>material.dispose());texture.dispose();bitmap.close();renderer.dispose();},
 };
}
