import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import * as THREE from 'three';
import {space,facadeFront,facadeColumns,canStand,moveInAir,GALLERY,LIBRARY,OUTDOOR,guideRoute,clearSegment,flightPoint} from '../src/navigation/layout.js';
import {createEntryDoor,entryDoor} from '../src/scene/EntryDoor.js';
import {studioDepth} from '../src/navigation/studioLayout.js';
import {createAfternoonLight} from '../src/scene/afternoonLight.js';
const read=file=>readFileSync(new URL(file,import.meta.url),'utf8');
test('The facade is level, ceilings rise 1.5 times, and no old column or divider blocks the unified room',()=>{
 assert.equal(facadeFront(-5.3),facadeFront(2.5333768271363417));assert.equal(space.groundCeiling,3.6*1.5);assert.ok(Math.abs(space.upperFloor-3.8*1.5)<1e-12);assert.equal(space.upperCeiling,6.75*1.5);
 assert.equal(space.courtyardHeight,space.upperCeiling+space.upperRoofThickness);assert.deepEqual(facadeColumns,{lower:[],upper:[]});
 assert.equal(studioDepth,4.25);assert.equal(canStand(GALLERY.x,GALLERY.z),true);
 for(const z of [-.5,-1.5,-2.5,-3.5,-4.5]){assert.equal(canStand(-3.25,z),true);assert.ok(moveInAir({x:-3.23,z,y:.12},-3.26,z,1.0),'jumping through the former partition is unobstructed');}
});
test('Right-bank profile and taller stair routes remain continuous in both directions',()=>{
 for(const [a,b]of [[OUTDOOR,GALLERY],[GALLERY,LIBRARY],[LIBRARY,OUTDOOR]]){const route=guideRoute(a,b);assert.ok(route.length);let p=a;for(const q of route){assert.ok(clearSegment(p,q));p=q;}}
 for(const f of space.stairs.flights)for(let t=.04;t<.98;t+=.07){const p=flightPoint(f,t,-.8);assert.ok(canStand(p.x,p.z,undefined,p.y));}
});
test('The continuous oak door face closes left and centre gaps without coplanar leaves',()=>{
 const door=createEntryDoor(new THREE.Group());door.updateMatrixWorld(true);
 const z=[];for(const x of [-1.115,-.004,0,.004,1.115]){const hit=new THREE.Raycaster(new THREE.Vector3(x,2,11),new THREE.Vector3(0,0,1),0,3).intersectObject(door,true)[0];assert.ok(hit);assert.equal(hit.object.material.name,'Entry_Pale_Oak');z.push(hit.point.z);}
 assert.ok(Math.max(...z)-Math.min(...z)<1e-6);assert.ok(z[0]>entryDoor.wallZ);
});
test('Overcast illumination uses a cool muted sky and the restored Clear flourish wipes into contact shading',()=>{
 const sky=createAfternoonLight();assert.deepEqual(sky.horizon,[.66,.69,.76]);assert.deepEqual(sky.zenith,[.21,.28,.40]);assert.equal(sky.sun,.34);
 const jsx=read('../src/ui/EndingSequence.jsx'),css=read('../src/ui/ending-sequence.css');assert.ok(jsx.includes('M94 191C181 173 280 176 390 170C427 168 458 157 466 147'));assert.ok(jsx.includes('ending-comet'));assert.ok(css.includes('stroke-dashoffset:-1'));assert.ok(css.includes('[data-stage="complete"] .ending-contact-shade{opacity:.24}'));
});
test('The native model contains stone arches and black glass rails with no column material',()=>{
 const bytes=readFileSync(new URL('../public/assets/runtime/atelier.glb',import.meta.url));const doc=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)));const names=doc.materials.map(m=>m.name);
 for(const name of ['Facade_Honed_Travertine','Facade_Indirect_Opal','Railing_Clear_Glass','Railing_Black_Metal'])assert.ok(names.includes(name));assert.ok(!names.includes('Ivory_Polished_Column'));
});
