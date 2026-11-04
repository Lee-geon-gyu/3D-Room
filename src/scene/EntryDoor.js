import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

export const entryDoor={x:0,z:12.65,wallZ:12.4,width:2.2,height:3.9,clearHalf:1.32,clearTop:4.14};
export const isEntryFixture=([x,y,z])=>Math.abs(x)<entryDoor.clearHalf&&z>12&&y<entryDoor.clearTop;

export function finishEntryStone(shader){
 shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec2 vEntryStone;').replace('#include <begin_vertex>','#include <begin_vertex>\nvEntryStone=abs(objectNormal.x)>.5?transformed.zy:transformed.xy;');
 shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec2 vEntryStone;').replace('#include <map_fragment>',`#include <map_fragment>
  vec2 tile=fract((vEntryStone+vec2(.54,0.))/vec2(1.08,.72));
  vec2 edge=min(tile,1.-tile);
  float joint=1.-smoothstep(.0012,.0032,min(edge.x,edge.y));
  diffuseColor.rgb*=1.-joint*.11;`);
}

function withIndex(source,indices){
 const geometry=new THREE.BufferGeometry();
 for(const [name,attribute] of Object.entries(source.attributes))geometry.setAttribute(name,attribute);
 geometry.setIndex(indices);geometry.computeBoundingBox();geometry.computeBoundingSphere();return geometry;
}

// Clip only the low planter/rim/soil faces at the door. All original vertex
// attributes (including the baked-light UVs) interpolate along the cut edges.
function cutPlanter(source){
 const names=Object.keys(source.attributes),attributes=Object.fromEntries(names.map(name=>[name,[]])),position=source.attributes.position,index=source.index,indices=[];
 let changed=false;
 const vertex=id=>Object.fromEntries(names.map(name=>{const a=source.attributes[name];return [name,Array.from({length:a.itemSize},(_,j)=>a.getComponent(id,j))];}));
 const clip=(polygon,bound,sign)=>{
  const out=[];
  for(let i=0;i<polygon.length;i++){
   const a=polygon[i],b=polygon[(i+1)%polygon.length],inside=(a.position[0]-bound)*sign>=0,next=(b.position[0]-bound)*sign>=0;
   if(inside)out.push(a);
   if(inside!==next){const t=(bound-a.position[0])/(b.position[0]-a.position[0]);out.push(Object.fromEntries(names.map(name=>[name,a[name].map((v,j)=>v+(b[name][j]-v)*t)])));}
  }
  return out;
 };
 const emit=polygon=>{for(let i=1;i<polygon.length-1;i++)for(const v of [polygon[0],polygon[i],polygon[i+1]]){indices.push(position.count+attributes.position.length/3);for(const name of names)attributes[name].push(...v[name]);}};
 for(let i=0;i<(index?.count??position.count);i+=3){
  const ids=[0,1,2].map(j=>index?index.getX(i+j):i+j),points=ids.map(id=>[position.getX(id),position.getY(id),position.getZ(id)]);
  const low=points.every(p=>p[1]<=.33&&p[2]>=11.94)&&points.some(p=>p[1]>.035),cross=points.some(p=>p[0]>-entryDoor.clearHalf)&&points.some(p=>p[0]<entryDoor.clearHalf);
  if(low&&cross){const polygon=ids.map(vertex);changed=true;emit(clip(polygon,-entryDoor.clearHalf,-1));emit(clip(polygon,entryDoor.clearHalf,1));}else indices.push(...ids);
 }
 if(!changed)return source;
 const result=new THREE.BufferGeometry();
 for(const name of names){const a=source.attributes[name],array=new Float32Array(a.count*a.itemSize+attributes[name].length);for(let i=0;i<a.count;i++)for(let j=0;j<a.itemSize;j++)array[i*a.itemSize+j]=a.getComponent(i,j);array.set(attributes[name],a.count*a.itemSize);result.setAttribute(name,new THREE.BufferAttribute(array,a.itemSize));}result.setIndex(indices);
 result.computeBoundingBox();result.computeBoundingSphere();return result;
}

// A true rectangular opening through the existing wall, retaining interpolated
// source UVs/lightmap UVs on every cut face. The deep jambs close its reveals.
function cutPortal(source){
 const openingHalf=entryDoor.width/2+.21;
 const names=Object.keys(source.attributes),attributes=Object.fromEntries(names.map(name=>[name,[]])),p=source.attributes.position,index=source.index,indices=[];
 let changed=false;
 const vertex=id=>Object.fromEntries(names.map(name=>{const a=source.attributes[name];return [name,Array.from({length:a.itemSize},(_,j)=>a.getComponent(id,j))];}));
 const clip=(polygon,axis,bound,sign)=>{
  const out=[];
  for(let i=0;i<polygon.length;i++){
   const a=polygon[i],b=polygon[(i+1)%polygon.length],inside=(a.position[axis]-bound)*sign>=0,next=(b.position[axis]-bound)*sign>=0;
   if(inside)out.push(a);
   if(inside!==next){const t=(bound-a.position[axis])/(b.position[axis]-a.position[axis]);out.push(Object.fromEntries(names.map(name=>[name,a[name].map((v,j)=>v+(b[name][j]-v)*t)])));}
  }return out;
 };
 const emit=polygon=>{for(let i=1;i<polygon.length-1;i++)for(const v of [polygon[0],polygon[i],polygon[i+1]]){indices.push(p.count+attributes.position.length/3);for(const name of names)attributes[name].push(...v[name]);}};
 for(let i=0;i<(index?.count??p.count);i+=3){
  const ids=[0,1,2].map(j=>index?index.getX(i+j):i+j),polygon=ids.map(vertex);
  if(polygon.every(v=>v.position[2]>12.27)&&polygon.some(v=>v.position[0]>-openingHalf)&&polygon.some(v=>v.position[0]<openingHalf)&&polygon.some(v=>v.position[1]<entryDoor.height+.2)){
   changed=true;emit(clip(polygon,0,-openingHalf,-1));emit(clip(polygon,0,openingHalf,1));
   emit(clip(clip(clip(polygon,0,-openingHalf,1),0,openingHalf,-1),1,entryDoor.height+.2,1));
  }else indices.push(...ids);
 }
 if(!changed)return source;
 const result=new THREE.BufferGeometry();
 for(const name of names){const a=source.attributes[name],array=new Float32Array(a.count*a.itemSize+attributes[name].length);for(let i=0;i<a.count;i++)for(let j=0;j<a.itemSize;j++)array[i*a.itemSize+j]=a.getComponent(i,j);array.set(attributes[name],a.count*a.itemSize);result.setAttribute(name,new THREE.BufferAttribute(array,a.itemSize));}result.setIndex(indices);result.computeBoundingBox();result.computeBoundingSphere();return result;
}

export function prepareEntryArchitecture(root){
 let removed=0,benchVertices=0;const stoneWalls=[];
 root.traverse(mesh=>{
  if(!mesh.isMesh||Array.isArray(mesh.material))return;
  const name=mesh.material.name,source=mesh.geometry,p=source.attributes.position,index=source.index;
  if(['Bronze','Lamp_Diffuser','Exterior_Sconce_Opal'].includes(name)){
   const keep=[];for(let i=0;i<(index?.count??p.count);i+=3){const ids=[0,1,2].map(j=>index?index.getX(i+j):i+j);if(ids.every(id=>isEntryFixture([p.getX(id),p.getY(id),p.getZ(id)]))){removed++;}else keep.push(...ids);}
   if(keep.length<(index?.count??p.count))mesh.geometry=withIndex(source,keep);
  }
  if(['Warm_Pale_Limestone','Pale_Marble_Planter','Ivory_Mineral_Plaster','Soil'].includes(name))mesh.geometry=cutPlanter(mesh.geometry);
  if(name==='Ivory_Mineral_Plaster'){
   mesh.geometry=cutPortal(mesh.geometry);const geometry=mesh.geometry,a=geometry.attributes.position,indices=geometry.index,wall=[],rest=[];
   for(let i=0;i<(indices?.count??a.count);i+=3){const ids=[0,1,2].map(j=>indices?indices.getX(i+j):i+j);(ids.every(id=>a.getZ(id)>12.27)?wall:rest).push(...ids);}
   if(wall.length){const material=mesh.material.clone();material.name='Entry_Travertine_Wall';stoneWalls.push(new THREE.Mesh(withIndex(geometry,wall),material));mesh.geometry=withIndex(geometry,rest);}
  }

 });
 stoneWalls.forEach(mesh=>{mesh.name='Entry_Recessed_Travertine_Wall';root.add(mesh);});
 return {removedFixtureTriangles:removed,benchVertices};
}

export function clearEntryFoliage(root){
 if(root.userData.entryPrepared)return 0;
 root.updateWorldMatrix(true,true);let removed=0;const a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3(),box=new THREE.Box3();
 root.traverse(mesh=>{
  if(!mesh.isMesh)return;const geometry=mesh.geometry,p=geometry.attributes.position,index=geometry.index;
  box.setFromBufferAttribute(p).applyMatrix4(mesh.matrixWorld);if(box.max.z<11.48||box.min.y>=entryDoor.clearTop||box.min.x>entryDoor.clearHalf||box.max.x<-entryDoor.clearHalf)return;
  const keep=[];
  for(let i=0;i<(index?.count??p.count);i+=3){const ids=[0,1,2].map(j=>index?index.getX(i+j):i+j);a.fromBufferAttribute(p,ids[0]).applyMatrix4(mesh.matrixWorld);b.fromBufferAttribute(p,ids[1]).applyMatrix4(mesh.matrixWorld);c.fromBufferAttribute(p,ids[2]).applyMatrix4(mesh.matrixWorld);
   if(Math.min(a.z,b.z,c.z)>11.48&&Math.min(a.y,b.y,c.y)<entryDoor.clearTop&&Math.max(a.x,b.x,c.x)>-entryDoor.clearHalf&&Math.min(a.x,b.x,c.x)<entryDoor.clearHalf)removed++;else keep.push(...ids);
  }
  if(keep.length<(index?.count??p.count))mesh.geometry=withIndex(geometry,keep);
 });return removed;
}

export function createEntryDoor(root){
 let source,stoneSource;root.traverse(mesh=>{if(mesh.material?.name==='Warm_Oak')source=mesh.material;if(mesh.material?.name==='Entry_Travertine_Wall')stoneSource=mesh.material;});
 const wood=new THREE.MeshStandardMaterial({name:'Entry_Pale_Oak',map:source?.map,normalMap:source?.normalMap,color:0xfff1db,roughness:.45,envMapIntensity:.45});wood.normalScale.set(.12,.12);
 wood.onBeforeCompile=shader=>{shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>','#include <map_fragment>\ndiffuseColor.rgb=mix(diffuseColor.rgb,vec3(.76,.60,.39),.28);');};
 const stone=new THREE.MeshStandardMaterial({name:'Entry_Ivory_Stone',map:stoneSource?.map,normalMap:stoneSource?.normalMap,color:0xf2e5cf,roughness:.48}),brass=new THREE.MeshStandardMaterial({name:'Entry_Satin_Brass',color:0xb69855,metalness:.8,roughness:.32}),shadow=new THREE.MeshStandardMaterial({color:0x30241b,roughness:.85});
 stone.normalScale.set(.1,.1);stone.onBeforeCompile=finishEntryStone;
 const batches=new Map([[wood,[]],[stone,[]],[brass,[]],[shadow,[]]]),box=(mat,w,h,d,x,y,z)=>{
  const g=new THREE.BoxGeometry(w,h,d).translate(x,y,z);
  if(mat===stone){const p=g.attributes.position,n=g.attributes.normal,uv=g.attributes.uv;for(let i=0;i<p.count;i++)uv.setXY(i,(Math.abs(n.getX(i))>.5?p.getZ(i):p.getX(i))/.85,(Math.abs(n.getY(i))>.5?p.getZ(i):p.getY(i))/.85);}
  batches.get(mat).push(g);
 };
 const {width,height}=entryDoor;
 box(wood,width+.22,height+.04,.065,0,height/2,-.035);
 // A continuous oak face closes both the meeting stile and side rebates.
 // The paired pulls still read as double doors without coplanar overlaps.
 box(wood,width+.10,height+.006,.10,0,height/2,-.085);
 for(const sign of [-1,1]){
  box(stone,.18,height+.2,.50,sign*(width/2+.12),(height+.2)/2,-.26);
  box(brass,.028,1.2,.035,sign*.16,1.85,-.177);box(brass,.04,.04,.07,sign*.16,1.30,-.149);box(brass,.04,.04,.07,sign*.16,2.40,-.149);
  box(stone,.055,.28,.40,sign*(entryDoor.clearHalf+.0275),.14,-.475);
 }
 box(stone,width+.42,.19,.50,0,height+.105,-.26);box(stone,width+.44,.025,.66,0,.0125,-.30);
 const group=new THREE.Group();group.name='Static_Pale_Oak_Entrance';group.position.set(entryDoor.x,0,entryDoor.z);group.userData.decorative=true;
 for(const [material,geometries]of batches){if(!geometries.length)continue;const geometry=mergeGeometries(geometries);geometries.forEach(g=>g.dispose());const mesh=new THREE.Mesh(geometry,material);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);}
 return group;
}
