import * as T from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {galleryRoom,galleryLobby,galleryCorridor} from '../navigation/galleryLayout.js';

// The second-floor rooms sit on complete lower-storey volumes. A planted site
// and adjoining stone terraces give the lobby windows a grounded garden view.
export function createGalleryLandscape({mineral,mineralNormal,foliage,metal,amber}){
 const group=new T.Group();group.name='Gallery_Grounded_Garden';const batches=new Map();
 const stone=new T.MeshStandardMaterial({name:'Exterior_Honed_Stone',map:mineral,normalMap:mineralNormal,normalScale:new T.Vector2(.12,.12),color:0x9a9990,roughness:.9});
 const paving=new T.MeshStandardMaterial({name:'Garden_Limestone_Paving',map:mineral,color:0xb8ada0,roughness:.94});
 const soil=new T.MeshStandardMaterial({name:'Garden_Dark_Mulch',color:0x252720,roughness:1});
 const grass=new T.MeshStandardMaterial({name:'Garden_Meadow',color:0x586347,roughness:1});
 grass.onBeforeCompile=shader=>{
  shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 gardenWorld;').replace('#include <begin_vertex>','#include <begin_vertex>\ngardenWorld=(modelMatrix*vec4(position,1.)).xyz;');
  shader.fragmentShader=shader.fragmentShader.replace('#include <common>',`#include <common>
   varying vec3 gardenWorld;
   float gardenHash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
   float gardenNoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(gardenHash(i),gardenHash(i+vec2(1.,0.)),f.x),mix(gardenHash(i+vec2(0.,1.)),gardenHash(i+1.),f.x),f.y);}
  `).replace('#include <color_fragment>','#include <color_fragment>\ndiffuseColor.rgb*=.74+.30*gardenNoise(gardenWorld.xz*.7)+.12*gardenNoise(gardenWorld.xz*21.);');
 };
 const lowerGlass=new T.MeshStandardMaterial({name:'Lower_Storey_Window',color:0x192a30,roughness:.3,metalness:.5,emissive:0x463522,emissiveIntensity:.10});
 function add(geometry,material,p=[0,0,0],rotation=[0,0,0]){const m=new T.Mesh(geometry,material);m.position.fromArray(p);m.rotation.set(...rotation);m.updateMatrix();const g=(geometry.index?geometry.toNonIndexed():geometry.clone()).applyMatrix4(m.matrix);if(!batches.has(material))batches.set(material,[]);batches.get(material).push(g);geometry.dispose();}
 function box(x,y,z,w,h,d,mat=stone){add(new T.BoxGeometry(w,h,d),mat,[x,y,z]);}
 function slab(left,right,back,front,top,depth,mat=stone){box((left+right)/2,top-depth/2,(back+front)/2,right-left,depth,front-back,mat);}
 // A continuous coastal land mass, not unsupported room planes above the sea.
 slab(-7.35,7.35,-26.35,10.35,-3.72,2.2,soil);
 slab(7.35,60,-24.5,29,-3.72,2.2,soil);
 slab(7.4,58,-24.45,26,-3.68,.10,grass);
 for(const b of [galleryRoom,galleryLobby,galleryCorridor]){
  slab(b.left-.10,b.right+.10,b.back-.10,b.front+.10,-.09,.32);
  slab(b.left-.06,b.right+.06,b.back-.06,b.front+.06,-3.35,.38);
  slab(b.left,b.right,b.back,b.front,-.41,2.95,lowerGlass);
  for(const x of [b.left-.05,b.right+.05]){
   for(let z=b.back;z<b.front+.01;z+=3.0)box(x,-1.88,z,.28,2.94,.34);
   box(x,-3.04,(b.back+b.front)/2,.16,.38,b.front-b.back);
  }
  for(const z of [b.back-.05,b.front+.05])for(let x=b.left;x<b.right+.01;x+=3)box(x,-1.88,z,.34,2.94,.28);
 }
 // East garden is flush with the lobby terrace; the rear garden drops down
 // to expose the gallery's actual lower storey and continuous foundation.
 slab(27,53,-9,22,-.34,3.38,soil);
 slab(30.7,52,-8.8,21.8,-.31,.09,grass);
 function tiles(l,r,b,f,y){for(let x=l;x<r;x+=1.5)for(let z=b;z<f;z+=1.5){const w=Math.min(1.5,r-x),d=Math.min(1.5,f-z);box(x+w/2,y-.045,z+d/2,w-.012,.09,d-.012,paving);}}
 tiles(27,30.8,-6,13,-.10);tiles(11,27,-9,-6,-.10);
 tiles(30.8,47,4.0,5.8,-.29);tiles(19,20.8,-24,-9,-3.60);
 // Edge beams and garden retaining walls visibly carry the terraces to soil.
 box(19,-1.88,-9.05,16,3.58,.22);box(30.85,-1.96,1.5,.22,3.5,25);
 for(const [x,z,w,d,y]of [[32.2,-4,2.2,6,-.22],[32.2,11,2.2,6,-.22],[40,-7,9,2.2,-.22],[44,15,10,2.2,-.22],[13,-14,5,2.5,-3.55],[25,-20,5,3,-3.55]]){
  box(x,y+.16,z,w,.32,d);box(x,y+.335,z,w-.15,.025,d-.15,soil);
  box(x,y+.08,z+d/2+.009,w-.15,.012,.012,amber);
 }
 // Low garden lanterns use emissive faces in the existing lighting setup.
 for(const [x,z,y]of [[29,-4,-.1],[29,8,-.1],[35,5.9,-.29],[44,5.9,-.29],[20.9,-13,-3.6],[20.9,-21,-3.6]]){
  box(x,y+.22,z,.09,.44,.09,metal);box(x,y+.39,z,.095,.07,.095,amber);
 }
 let seed=47;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 // Soft shrub masses, stones and fine grass silhouettes are instanced.
 const shrubs=new T.InstancedMesh(new T.IcosahedronGeometry(1,2),new T.MeshStandardMaterial({name:'Garden_Silver_Green_Shrubs',color:0x53634a,roughness:1}),112);
 shrubs.name='Garden_Planting_Masses';const dummy=new T.Object3D(),tint=new T.Color(),shrubForms=[];
 for(let i=0;i<112;i++){
  const rear=i>=76,x=rear?9+random()*42:32.5+random()*18,z=rear?-11-random()*12:-7+random()*26;
  const ground=rear?-3.6:-.3,r=.28+random()*.55;
  dummy.position.set(x,ground+r*.55,z);dummy.scale.set(r,r*(.6+random()*.6),r*(.7+random()*.5));dummy.rotation.set(random(),random()*6,random());dummy.updateMatrix();shrubs.setMatrixAt(i,dummy.matrix);tint.setHSL(.21+random()*.05,.16+random()*.14,.19+random()*.12);shrubs.setColorAt(i,tint);shrubForms.push(dummy.matrix.clone());
 }
 shrubs.computeBoundingSphere();group.add(shrubs);
 // Curled individual leaves break up the clipped shrub silhouettes. All leaf
 // sprays share one geometry/material draw, including per-instance colour.
 const leafGeometry=new T.BufferGeometry();leafGeometry.setAttribute('position',new T.Float32BufferAttribute([0,-.5,0,-.24,-.1,0,0,-.05,.14, -.24,-.1,0,0,.5,.07,0,-.05,.14, 0,.5,.07,.24,-.1,0,0,-.05,.14, .24,-.1,0,0,-.5,0,0,-.05,.14],3));leafGeometry.computeVertexNormals();
 const leaves=new T.InstancedMesh(leafGeometry,new T.MeshStandardMaterial({name:'Garden_Individual_Leaves',color:0x909a75,roughness:.95,side:T.DoubleSide}),112*144),normal=new T.Vector3(),leafPoint=new T.Vector3(),leafUp=new T.Vector3(0,0,1);
 leaves.name='Garden_Detailed_Shrub_Foliage';
 for(let i=0;i<leaves.count;i++){
  normal.set(random()-.5,random()-.5,random()-.5).normalize();leafPoint.copy(normal).multiplyScalar(.95+random()*.12).applyMatrix4(shrubForms[Math.floor(i/144)]);dummy.position.copy(leafPoint);dummy.quaternion.setFromUnitVectors(leafUp,normal);dummy.rotateZ(random()*6.28);dummy.scale.setScalar(.10+random()*.11);dummy.updateMatrix();leaves.setMatrixAt(i,dummy.matrix);tint.setHSL(.20+random()*.07,.15+random()*.18,.24+random()*.16);leaves.setColorAt(i,tint);
 }
 leaves.computeBoundingSphere();group.add(leaves);
 const bladeGeometry=new T.BufferGeometry();bladeGeometry.setAttribute('position',new T.Float32BufferAttribute([-.04,0,0,0,.65,.03,.04,0,0,0,0,-.04,.03,.50,0,0,0,.04],3));bladeGeometry.computeVertexNormals();
 const blades=new T.InstancedMesh(bladeGeometry,new T.MeshStandardMaterial({name:'Garden_Ornamental_Grasses',color:0x687054,roughness:1,side:T.DoubleSide}),480);blades.name='Garden_Fine_Grasses';
 for(let i=0;i<480;i++){const x=31.8+random()*1.1,z=-6+random()*20;dummy.position.set(x,-.20,z);dummy.scale.setScalar(.4+random()*.8);dummy.rotation.set(0,random()*6.28,(random()-.5)*.3);dummy.updateMatrix();blades.setMatrixAt(i,dummy.matrix);}blades.computeBoundingSphere();group.add(blades);
 for(let i=0;i<12;i++){const r=.2+random()*.50;add(new T.DodecahedronGeometry(r,1),paving,[34+random()*15,-.28+r*.40,-8+random()*27],[random(),random()*6,random()]);}
 if(foliage)for(const [x,z,h,y]of [[35,-4,4.6,-.25],[37,12,5,-.25],[47,2,5.5,-.25],[15,-16,7.3,-3.6],[28,-21.5,7,-3.6]]){
  const plant=foliage.clone(true),cube=plant.getObjectByName('Cube');if(cube)plant.remove(cube);
  const bounds=new T.Box3().setFromObject(plant),scale=h/(bounds.max.y-bounds.min.y);plant.scale.setScalar(scale);plant.position.set(x-(bounds.min.x+bounds.max.x)*scale/2,y-bounds.min.y*scale,z-(bounds.min.z+bounds.max.z)*scale/2);plant.rotation.y=random()*6.28;plant.name='Garden_Rooted_Olive';plant.traverse(m=>{if(m.isMesh){m.castShadow=false;m.receiveShadow=true;}});group.add(plant);
 }
 for(const [material,parts]of batches){const m=new T.Mesh(mergeGeometries(parts,false),material);m.name=material.name;m.receiveShadow=true;group.add(m);parts.forEach(g=>g.dispose());}
 return group;
}
