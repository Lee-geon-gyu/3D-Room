import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {WalkController} from '../src/navigation/WalkController.js';
import {OUTDOOR,GALLERY,ATELIER,LIBRARY,space} from '../src/navigation/layout.js';
import {worldPoint} from '../src/navigation/coordinates.js';
import {EXHIBITION_SLOTS} from '../src/scene/interactionModel.js';
import {createContentInteraction} from '../src/scene/ContentInteraction.js';

function visitor(onArrive){
 global.window=new EventTarget();const canvas=new EventTarget();canvas.setPointerCapture=()=>{};
 const camera=new THREE.PerspectiveCamera(57,1.6,.06,130);
 const controller=new WalkController(canvas,camera,{start:OUTDOOR,onClick(){},onArea(){},onRoute(){},onArrive});
 const tick=seconds=>{for(let i=0;i<seconds/.025;i++)controller.step(.025);};
 return{controller,camera,tick};
}

test('Each shortcut reports successful arrival once, after the actual camera settles; same-place reentry works',()=>{
 for(const[target,pose]of [['gallery',GALLERY],['atelier',ATELIER],['library',LIBRARY]]){
  const events=[],v=visitor(value=>events.push({target:value,position:v.camera.position.toArray(),yaw:v.camera.rotation.y,pitch:v.camera.rotation.x}));
  v.controller.guide(target);assert.equal(events.length,0);v.tick(45);
  assert.equal(events.length,1);assert.equal(events[0].target,target);
  const expected=worldPoint(pose.x,pose.y??0,pose.z,1.53);
  events[0].position.forEach((p,i)=>assert.ok(Math.abs(p-expected[i])<1e-6));
  assert.ok(Math.abs(events[0].yaw-pose.yaw)<1e-6);assert.ok(Math.abs(events[0].pitch-pose.pitch)<1e-6);
  v.controller.guide(target);v.tick(6);assert.equal(events.length,2);v.tick(10);assert.equal(events.length,2);v.controller.dispose();
 }
});

test('Manual interruption, pause and restart cannot deliver a stale automatic opening; a replacement opens only its own target',()=>{
 for(const cancel of ['manual','pause','reset']){
  const arrivals=[],v=visitor(id=>arrivals.push(id));v.controller.guide('gallery');v.tick(.3);
  if(cancel==='manual'){const event=new Event('keydown');Object.defineProperty(event,'code',{value:'KeyW'});window.dispatchEvent(event);v.controller.keys.clear();}
  if(cancel==='pause'){v.controller.setPaused(true);v.controller.setPaused(false);}
  if(cancel==='reset')v.controller.reset();
  v.tick(45);assert.deepEqual(arrivals,[]);v.controller.dispose();
 }
 const arrivals=[],v=visitor(id=>arrivals.push(id));v.controller.guide('gallery');v.tick(.3);v.controller.guide('atelier');v.tick(45);assert.deepEqual(arrivals,['atelier']);v.controller.dispose();
});

test('The work shortcut reaches and opens the real first slot through the same proximity and visibility checks as E',()=>{
 const slot=EXHIBITION_SLOTS[0],root=new THREE.Group(),parent=new THREE.Group(),face=new THREE.Mesh(new THREE.PlaneGeometry(slot.width,slot.height),new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));
 root.position.set(slot.x,slot.y,slot.z);root.rotation.y=slot.rotation;root.add(face);parent.add(root);face.userData.contentId='project-01';
 const[sx,sy,sz]=space.worldScale;parent.matrixAutoUpdate=false;parent.matrix.set(sx,0,space.worldShear*sx,0,0,sy,0,0,0,0,sz,0,0,0,0,1);parent.updateMatrixWorld(true);
 const openings=[],v=visitor(target=>{assert.equal(target,'atelier');assert.equal(interaction.begin('project-01'),true);});
 const abort=new AbortController(),interaction=createContentInteraction({camera:v.camera,controller:v.controller,entries:[{id:'project-01',kind:'project',root,floor:0,size:slot,focus:new THREE.Vector3(0,0,.03)}],targets:[face],callbacks:{onOpen:id=>openings.push(id)},signal:abort.signal,reducedMotion:true});
 v.controller.guide('atelier');for(let i=0;i<1500;i++){v.controller.step(.025);interaction.step(.025);}
 assert.deepEqual(openings,['project-01']);assert.equal(interaction.phase,'reading');assert.equal(v.controller.paused,true);
 interaction.close();for(let i=0;i<50;i++)interaction.step(.025);v.tick(8);assert.deepEqual(openings,['project-01'],'closing cannot reopen the completed shortcut');
 abort.abort();v.controller.dispose();face.geometry.dispose();face.material.dispose();
});
