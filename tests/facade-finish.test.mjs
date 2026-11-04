import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {prepareFacadeFinish} from '../src/scene/facadeFinish.js';
import {facadeFront,space} from '../src/navigation/layout.js';

test('Balcony and roof share one finish draw while preserving every triangle, UV channel and floor material',()=>{
  const geometry=new THREE.BufferGeometry(),points=[];
  for(const x of [-4,1])points.push(x,space.upperFloor-.5,facadeFront(x)+.11,x+.2,space.upperFloor-.5,facadeFront(x+.2)+.11,x,space.upperFloor-.3,facadeFront(x)+.11);
  points.push(-2,space.upperCeiling-.06,facadeFront(-2)+.17,-1.8,space.upperCeiling-.06,facadeFront(-1.8)+.17,-2,space.upperCeiling+.3,facadeFront(-2)+.17);
  points.push(0,0,5,1,0,5,0,0,6);
  geometry.setAttribute('position',new THREE.Float32BufferAttribute(points,3));geometry.setAttribute('normal',new THREE.Float32BufferAttribute(Array.from({length:12},()=>[0,0,1]).flat(),3));
  const uvs=Array.from({length:24},(_,i)=>i/25);geometry.setAttribute('uv',new THREE.Float32BufferAttribute(uvs,2));geometry.setAttribute('uv1',new THREE.Float32BufferAttribute(uvs.map(v=>1-v),2));geometry.setIndex([0,1,2,3,4,5,6,7,8,9,10,11]);
  const material=new THREE.MeshPhysicalMaterial({name:'Warm_Pale_Limestone',map:new THREE.Texture(),lightMap:new THREE.Texture()});
  const oak=new THREE.MeshStandardMaterial({name:'Warm_Oak',map:new THREE.Texture(),normalMap:new THREE.Texture()}),oakMesh=new THREE.Mesh(new THREE.PlaneGeometry(),oak);
  const root=new THREE.Group(),floor=new THREE.Mesh(geometry,material);root.add(floor,oakMesh);const originalIndex=Array.from(geometry.index.array);
  const result=prepareFacadeFinish(root);assert.deepEqual(result,{meshes:1,triangles:3});assert.equal(root.children.length,3);
  const band=root.children.find(mesh=>mesh!==floor&&mesh!==oakMesh);assert.equal(floor.geometry.index.count+band.geometry.index.count,geometry.index.count);assert.deepEqual(Array.from(geometry.index.array),originalIndex);
  assert.equal(floor.material,material);assert.equal(band.material.name,'Exterior_Warm_Oak');assert.equal(band.material.map,oak.map);assert.equal(band.material.normalMap,oak.normalMap);assert.equal(band.material.metalness,0);assert.notEqual(band.material,oak);assert.equal(band.material.userData.facadeBand,true);
  assert.equal(band.geometry.getAttribute('uv1').count,9);assert.deepEqual(Array.from(band.geometry.getAttribute('uv1').array),Array.from(geometry.getAttribute('uv1').array.slice(0,18)));
  assert.ok(band.geometry.boundingBox.min.y>3);assert.ok(band.geometry.boundingBox.max.y>7);assert.deepEqual(Array.from(floor.geometry.index.array),[9,10,11]);
});

test('The existing black roof and lower lip become oak while courtyard copings remain black',()=>{
 const black=new THREE.MeshPhysicalMaterial({name:'Exterior_Gloss_Black',metalness:.65}),oak=new THREE.MeshStandardMaterial({name:'Warm_Oak',map:new THREE.Texture()});
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute([
  -2,space.upperFloor-.6,facadeFront(-2)+.11,-1.8,space.upperFloor-.6,facadeFront(-1.8)+.11,-2,space.upperFloor-.58,facadeFront(-2)+.11,
  -2,space.upperCeiling-.06,1,-1.8,space.upperCeiling-.06,1,-2,space.upperCeiling+.25,1,
  4,3,9,4.2,3,9,4,3.2,9,
 ],3));
 const root=new THREE.Group(),mesh=new THREE.Mesh(geometry,black);root.add(mesh,new THREE.Mesh(new THREE.PlaneGeometry(),oak));
 const result=prepareFacadeFinish(root);assert.equal(result.triangles,2);assert.equal(mesh.geometry.index.count,3);assert.equal(mesh.material,black);
 const timber=root.children.find(child=>child.material?.name==='Exterior_Warm_Oak');assert.equal(timber.material.map,oak.map);
 assert.deepEqual(prepareFacadeFinish(root),{meshes:0,triangles:0},'retargeting is idempotent');
});
