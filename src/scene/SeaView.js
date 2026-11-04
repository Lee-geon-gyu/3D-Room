import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

// Actual exterior geometry gives the opening parallax. The existing sky is
// visible above it; the sea uses the world's single render loop and no camera pass.
export function createSeaView(){
 const group=new THREE.Group();group.name='Panoramic_Seaside_Exterior';
 const time={value:0};
 const surface=new THREE.ShaderMaterial({name:'Distant_Living_Sea',uniforms:{time},vertexShader:`
  uniform float time;varying vec3 vSea;varying float vCrest;
  void main(){vec3 p=position;float a=p.x*.55+p.z*.31+time*.32,b=p.x*.23-p.z*.66+time*.24;
   p.y+=sin(a)*.026+sin(b)*.014;vCrest=cos(a)*.65+cos(b)*.35;vSea=p;
   gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`,fragmentShader:`
  uniform float time;varying vec3 vSea;varying float vCrest;
  void main(){float distance=max(0.,-vSea.z-7.);float haze=1.-exp(-distance*.010);
   float ripple=sin(vSea.x*5.4+vSea.z*8.2+time*.55)*sin(vSea.x*1.7-vSea.z*3.1+time*.37);
   vec3 color=mix(vec3(.115,.30,.38),vec3(.52,.62,.67),haze);
   color+=(vCrest*.018+ripple*.012)*(1.-haze*.7);
   float path=exp(-pow((vSea.x-18.)/(5.+distance*.18),2.));
   color+=vec3(.19,.16,.10)*path*pow(max(0.,ripple),9.)*(1.-haze*.45);
   gl_FragColor=vec4(color,1.);
   #include <tonemapping_fragment>
   #include <colorspace_fragment>
  }`});
 const seaGeometry=new THREE.PlaneGeometry(240,200,96,80);seaGeometry.rotateX(-Math.PI/2);seaGeometry.translate(0,-.72,-107.45);
 const sea=new THREE.Mesh(seaGeometry,surface);sea.name='Sea_3D_Wave_Surface';group.add(sea);
 const rocks=[];
 for(const [x,z,width,height,depth]of [[-48,-82,57,7.2,16],[47,-99,70,6.3,23],[-9,-115,24,1.9,10]]){
  const profile=[[-.5,0],[-.43,.18],[-.31,.26],[-.22,.62],[-.12,.8],[.02,1],[.13,.72],[.24,.64],[.35,.33],[.5,0]];
  const positions=[],indices=[];for(const dz of [0,-depth])for(const [t,h]of profile)positions.push(x+t*width,-.68+h*height,z+dz);
  const n=profile.length;
  // Close the front and back down to the waterline. An open ridge would let
  // the sky show through beneath it when viewed from the low sunken lounge.
  for(const dz of [0,-depth])for(const [t]of profile)positions.push(x+t*width,-.73,z+dz);
  for(let i=0;i<n-1;i++){
   indices.push(i,i+1,n+i,i+1,n+i+1,n+i);
   indices.push(i,2*n+i,i+1,i+1,2*n+i,2*n+i+1);
   indices.push(n+i,n+i+1,3*n+i,n+i+1,3*n+i+1,3*n+i);
  }
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));g.setIndex(indices);g.computeVertexNormals();rocks.push(g);
 }
 const coast=new THREE.Mesh(mergeGeometries(rocks),new THREE.MeshBasicMaterial({name:'Hazy_Coastal_Headlands',color:0x7a8b94,side:THREE.DoubleSide}));coast.name='Distant_Coast_3D';rocks.forEach(g=>g.dispose());group.add(coast);
 return {group,update:(delta,reducedMotion)=>{if(!reducedMotion)time.value+=delta;}};
}
