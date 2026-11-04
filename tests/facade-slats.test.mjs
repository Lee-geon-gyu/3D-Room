import {space} from '../src/navigation/layout.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {facadeJoinery,facadeSlatRuns,createFacadeSlats} from '../src/scene/facadeSlats.js';

test('Both story fascias use physical interior-sized oak slats, two static draws, and valid baked irradiance',()=>{
 const root=new THREE.Group(),oak=new THREE.MeshStandardMaterial({name:'Warm_Oak',map:new THREE.Texture(),normalMap:new THREE.Texture()});
 const original=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),oak);root.add(original);
 const backing=new THREE.Mesh(new THREE.PlaneGeometry(20,10),oak.clone());backing.name='Continuous_Oak_Exterior_Trim';backing.geometry.setAttribute('uv1',backing.geometry.getAttribute('uv').clone());root.add(backing);
 const before=Array.from(original.geometry.getAttribute('position').array),group=createFacadeSlats(root);
 assert.deepEqual(facadeJoinery,{width:.043,pitch:.078,depth:.048,bevel:.003});
 assert.equal(group.children.length,2);assert.ok(group.userData.slats>220&&group.userData.slats<350);
 assert.equal(facadeSlatRuns().length,3);
 for(const mesh of group.children){
  assert.equal(mesh.material.map,oak.map);assert.equal(mesh.material.normalMap,oak.normalMap);assert.notEqual(mesh.material,oak);
  for(const name of ['position','normal','uv','uv1'])assert.ok([...mesh.geometry.getAttribute(name).array].every(Number.isFinite));
  assert.ok(mesh.geometry.boundingBox.min.y>3.2);assert.ok(mesh.geometry.boundingBox.max.y<space.upperCeiling+space.upperRoofThickness);
 }
 assert.deepEqual(Array.from(original.geometry.getAttribute('position').array),before);assert.equal(createFacadeSlats(root),null,'a second initialization cannot stack boards');
});
