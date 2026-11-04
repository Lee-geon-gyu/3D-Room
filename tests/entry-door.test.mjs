import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {entryDoor,prepareEntryArchitecture,clearEntryFoliage,createEntryDoor,isEntryFixture} from '../src/scene/EntryDoor.js';

function mesh(name,w,h,d,x,y,z){
 const geometry=new THREE.BoxGeometry(w,h,d).translate(x,y,z);
 geometry.setAttribute('uv1',geometry.attributes.uv.clone());
 return new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({name}));
}
const triangles=geometry=>{
 const p=geometry.attributes.position,i=geometry.index,all=[];
 for(let n=0;n<(i?.count??p.count);n+=3)all.push([0,1,2].map(j=>new THREE.Vector3().fromBufferAttribute(p,i?i.getX(n+j):n+j)));
 return all;
};

test('Door clearance removes the middle planter while preserving outside stone and baked UVs',()=>{
 const root=new THREE.Group(),bed=mesh('Pale_Marble_Planter',10.6,.28,.35,0,.14,12.175),outside=mesh('Bronze',.1,.3,.1,3,2,12.3),lamp=mesh('Bronze',.1,.3,.1,1.2,2,12.3);
 root.add(bed,outside,lamp);const original=outside.geometry;const changes=prepareEntryArchitecture(root);
 assert.equal(changes.removedFixtureTriangles,12);assert.equal(outside.geometry,original);assert.equal(lamp.geometry.index.count,0);
 assert.equal(bed.geometry.attributes.uv1.count,bed.geometry.attributes.position.count);
 for(const tri of triangles(bed.geometry))if(tri.some(p=>p.y>.035))assert.ok(tri.every(p=>p.x<=-entryDoor.clearHalf+1e-5)||tri.every(p=>p.x>=entryDoor.clearHalf-1e-5),'no raised stone spans the doorway');
 for(const name of ['position','normal','uv','uv1'])assert.ok([...bed.geometry.attributes[name].array].every(Number.isFinite));
 assert.ok(triangles(bed.geometry).some(t=>t.some(p=>p.x<-5)));assert.ok(triangles(bed.geometry).some(t=>t.some(p=>p.x>5)));
});

test('Native bench dimensions stay intact; the entrance stays static and centered',()=>{
 const root=new THREE.Group(),bench=mesh('Warm_Oak',2.4,.055,.15,3.25,.62,11.6),shelf=mesh('Warm_Oak',4,.1,.6,0,1,-5);root.add(bench,shelf);
 const original=shelf.geometry;const changes=prepareEntryArchitecture(root);bench.geometry.computeBoundingBox();
 assert.equal(changes.benchVertices,0);assert.ok(Math.abs(bench.geometry.boundingBox.getSize(new THREE.Vector3()).x-2.4)<1e-5);assert.equal(shelf.geometry,original);
 const door=createEntryDoor(root);assert.deepEqual(door.position.toArray(),[0,0,entryDoor.z]);assert.ok(entryDoor.z>entryDoor.wallZ);assert.equal(door.userData.decorative,true);assert.equal(door.children.length,3);assert.ok(door.children.every(m=>m.isMesh&&!m.isInstancedMesh));
 assert.equal(isEntryFixture([1.2,2,12.3]),true);assert.equal(isEntryFixture([3,2,12.3]),false);assert.equal(isEntryFixture([1.2,7.75,12.3]),false);
 const foliage=new THREE.Group(),inside=mesh('Leaf',.6,3,.2,0,1.5,12.1),side=mesh('Leaf',.6,3,.2,-3,1.5,12.1),above=mesh('Leaf',2.6,2.3,.2,0,5.4,12.1);foliage.add(inside,side,above);const sideGeometry=side.geometry,aboveGeometry=above.geometry;
 assert.equal(clearEntryFoliage(foliage),12);assert.equal(inside.geometry.index.count,0);assert.equal(side.geometry,sideGeometry);assert.equal(above.geometry,aboveGeometry,'the original canopy above the lintel stays intact');
});
