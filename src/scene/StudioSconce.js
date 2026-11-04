import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

export const studioSconceCenter={x:-5.20,y:3.17,z:-4.65};

// Match the existing 24-sided bronze body and its two 49mm opal apertures.
// Probe the actual visible slat face, which is in front of the masonry wall.
export function createStudioSconce(architecture,gain=.82){
 architecture.updateWorldMatrix(true,true);
 const {y,z}=studioSconceCenter,ray=new THREE.Raycaster(new THREE.Vector3(-4,y,z),new THREE.Vector3(-1,0,0),.01,2);
 const wall=ray.intersectObject(architecture,true).find(hit=>{
  const material=Array.isArray(hit.object.material)?hit.object.material[hit.face.materialIndex]:hit.object.material;
  return material?.name==='Warm_Oak'||material?.name==='Oak_Shaded_Edges';
 });
 if(!wall)throw new Error('The studio wall must be found before mounting its sconce');
 let bronze,opal;architecture.traverse(mesh=>{for(const material of mesh.material?(Array.isArray(mesh.material)?mesh.material:[mesh.material]):[]){if(material.name==='Bronze')bronze=material;if(material.name==='Lamp_Diffuser')opal=material;}});
 const bodyMaterial=new THREE.MeshStandardMaterial({name:'Studio_Sconce_Bronze',color:bronze?.color??new THREE.Color(.19,.13,.065),roughness:bronze?.roughness??.32,metalness:bronze?.metalness??0,envMapIntensity:.25});
 const glowMaterial=new THREE.MeshStandardMaterial({name:'Studio_Sconce_Opal',color:opal?.color??new THREE.Color(.98,.73,.39),emissive:opal?.emissive??new THREE.Color(.98,.73,.39),emissiveIntensity:opal?.emissiveIntensity??2,roughness:.45});
 const group=new THREE.Group();group.name='Studio_Center_Wall_Sconce';group.position.set(wall.point.x+.065,y,z);group.rotation.y=Math.PI/2;
 const outline=[[0,-.165],[.067,-.165],[.071,-.161],[.071,.161],[.067,.165],[0,.165]].map(([radius,height])=>new THREE.Vector2(radius,height));
 const body=new THREE.Mesh(new THREE.LatheGeometry(outline,24),bodyMaterial);body.name='Studio_Sconce_Body';body.castShadow=true;group.add(body);
 const discs=[-1,1].map(sign=>new THREE.CylinderGeometry(.049,.049,.009,24).translate(0,sign*.168,0));
 const apertures=new THREE.Mesh(mergeGeometries(discs),glowMaterial);apertures.name='Studio_Sconce_Apertures';discs.forEach(geometry=>geometry.dispose());group.add(apertures);
 const graze=new THREE.Mesh(new THREE.PlaneGeometry(1.1,2),new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,toneMapped:false,vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 vUv;void main(){float d=abs(vUv.y-.5)*2.;float spread=.07+.34*d;float cone=exp(-pow((vUv.x-.5)/spread,2.)*3.);float a=cone*(1.-smoothstep(.05,.95,d))*.14;gl_FragColor=vec4(vec3(1.,.58,.2),a);}'}));
 graze.name='Studio_Sconce_Wall_Graze';graze.position.z=-.060;group.add(graze);
 const light=new THREE.PointLight(0xffb45f,.95*gain,1.85,2);light.name='Studio_Center_Sconce';light.position.copy(group.position).add(new THREE.Vector3(.09,-.22,0));
 group.userData.wallX=wall.point.x;
 return {group,light};
}
