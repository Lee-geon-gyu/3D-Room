import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createDeskObjects} from '../src/scene/DeskObjects.js';
import {createContentInteraction} from '../src/scene/ContentInteraction.js';
import {readerMotion} from '../src/ui/contentMotion.js';
import {projectPresentationSurface} from '../src/scene/presentationSurface.js';

function notebook(){
 return createDeskObjects({profileScreen:new THREE.Texture(),contactFace:new THREE.Texture(),contactTitle:new THREE.Texture()},3.8)[1];
}

test('Clear can disable notebook activation without pausing movement or starting an unseen presentation',()=>{
 global.window=new EventTarget();
 const note=notebook(),parent=new THREE.Group();parent.add(note.root);parent.updateWorldMatrix(true,true);
 const camera=new THREE.PerspectiveCamera(57,1280/800,.06,130);
 camera.position.copy(note.root.position).add(new THREE.Vector3(0,1.1,1.4));camera.lookAt(note.root.position);camera.updateMatrixWorld(true);
 const controller={position:{y:3.8},verticalOffset:0,swimming:false,paused:false,setPaused(value){this.paused=value;}};
 const abort=new AbortController(),events=[];
 const interaction=createContentInteraction({camera,controller,entries:[note],targets:note.meshes,signal:abort.signal,reducedMotion:false,callbacks:{onPresentation:kind=>events.push(kind),onReveal:()=>{},onOpen:()=>{}}});
 interaction.setEnabled(false);
 assert.equal(controller.paused,false);assert.equal(interaction.canActivate('contact'),false);assert.equal(interaction.begin('contact'),false);
 const key=new Event('keydown');Object.defineProperty(key,'code',{value:'KeyE'});window.dispatchEvent(key);
 assert.equal(interaction.phase,'idle');assert.deepEqual(events,[]);
 interaction.setEnabled(true);assert.equal(interaction.begin('contact'),true);assert.equal(controller.paused,true);
 interaction.reset();assert.equal(controller.paused,false);abort.abort();
});

test('A closed contact notebook conceals its page and has one pierced, ring-bound cover',()=>{
 const note=notebook(),cover=note.root.getObjectByName('Contact_Note_Closed_Cover');
 const pivot=note.root.getObjectByName('Contact_Note_Cover_Pivot');
 assert.equal(note.root.children.filter(child=>child.name==='Contact_Note_Single_Ring').length,1);
 assert.equal(pivot.rotation.x,0);
 note.root.updateWorldMatrix(true,true);
 const center=note.root.localToWorld(new THREE.Vector3(0,.5,0));
 const ray=new THREE.Raycaster(center.clone(),new THREE.Vector3(0,-1,0));
 assert.equal(ray.intersectObjects(note.meshes,false)[0].object.parent,cover.parent,'the real cover hides the contact print');
 assert.ok(note.root.getObjectByName('Contact_Note_Cover_Title').material.map,'Letter is attached to the moving cover');
 // The punch is empty geometry rather than a painted circle.
 const punch=note.root.localToWorld(new THREE.Vector3(-.208,.5,-note.size.depth/2+.013));
 ray.set(punch,new THREE.Vector3(0,-1,0));assert.equal(ray.intersectObject(cover).length,0);
 note.setCover(.5);assert.equal(pivot.rotation.x,-Math.PI);
 note.setCover(1);note.root.updateWorldMatrix(true,true);
 ray.set(center,new THREE.Vector3(0,-1,0));
 assert.equal(ray.intersectObjects(note.meshes,false)[0].object.name,'Contact_Note_Face','the opened cover uncovers the original contact page');
 assert.equal(pivot.rotation.x,-Math.PI*2,'the cover completes its turn instead of stopping above the page');
 assert.ok(new THREE.Box3().setFromObject(cover).max.y<note.root.position.y,'the finished cover lies completely behind the paper stack');
 note.setCover(0);assert.equal(pivot.rotation.x,0);
});

test('The notebook turns before its continuous reader handoff and closes along the same path',()=>{
 for(const aspect of [1280/720,360/670])for(const reducedMotion of [false,true]){
  global.window=new EventTarget();
  const note=notebook(),parent=new THREE.Group();parent.add(note.root);parent.updateWorldMatrix(true,true);
  const camera=new THREE.PerspectiveCamera(aspect<.8?72:57,aspect,.06,130);
  camera.position.copy(note.root.position).add(new THREE.Vector3(0,1.1,1.4));camera.lookAt(note.root.position);camera.updateMatrixWorld(true);
  const controller={position:{y:3.8},verticalOffset:0,swimming:false,paused:false,setPaused(value){this.paused=value;}};
  const events=[],frames=[],abort=new AbortController(),rest={position:note.root.position.clone(),quaternion:note.root.quaternion.clone(),scale:note.root.scale.clone(),camera:camera.position.clone(),view:camera.quaternion.clone()};
  const motion=createContentInteraction({camera,controller,entries:[note],targets:note.meshes,signal:abort.signal,reducedMotion,callbacks:{onReveal:id=>events.push(['reveal',id]),onOpen:id=>events.push(['open',id])}});
  motion.observe(frame=>frames.push(frame));
  const duration=reducedMotion?.18:note.duration,pivot=note.root.getObjectByName('Contact_Note_Cover_Pivot');
  assert.equal(motion.begin('contact'),true);motion.step(duration*.16);
  assert.equal(pivot.rotation.x,0,'the Letter cover first lifts into view while still closed');
  assert.notDeepEqual(note.root.position.toArray(),rest.position.toArray());
  motion.step(duration*.24);
  assert.ok(pivot.rotation.x<0&&pivot.rotation.x>-Math.PI*2);assert.deepEqual(events,[]);
  motion.step(duration*.28);assert.equal(pivot.rotation.x,-Math.PI*2);assert.deepEqual(events,[]);
  assert.equal(note.root.visible,true,'the fully folded cover stays visible before the reader takes over');
  motion.step(duration*.18);assert.deepEqual(events,[['reveal','contact']]);
  assert.equal(note.root.visible,false);assert.ok(frames.at(-1).binding.front.length>0&&frames.at(-1).binding.back.length>0);
  assert.equal(frames.at(-1).handoff,.84);
  const box={x:20,y:20,width:760,height:519},viewport={width:1280,height:720};
  assert.equal(readerMotion({...frames.at(-1),progress:.84},box,viewport).opacity,0);
  motion.step(duration*.15);assert.deepEqual(events,[['reveal','contact'],['open','contact']]);
  assert.equal(readerMotion(frames.at(-1),box,viewport).transform,'none');
  for(const corner of projectPresentationSurface(note,camera))assert.ok(corner.x>0&&corner.x<1&&corner.y>0&&corner.y<1,'the page fits a desktop or phone');
  motion.close();motion.step(Math.min(.75,duration)*.6);
  assert.ok(pivot.rotation.x<0&&pivot.rotation.x>-Math.PI*2,'the cover turns back while returning');
  motion.step(1);
  const restored=()=>{
   assert.equal(pivot.rotation.x,0);assert.equal(pivot.position.y,.034);assert.equal(note.root.visible,true);assert.equal(note.binding.mesh.visible,true);assert.equal(controller.paused,false);
   assert.deepEqual(note.root.position.toArray(),rest.position.toArray());assert.deepEqual(note.root.quaternion.toArray(),rest.quaternion.toArray());assert.deepEqual(note.root.scale.toArray(),rest.scale.toArray());
   assert.deepEqual(camera.position.toArray(),rest.camera.toArray());assert.deepEqual(camera.quaternion.toArray(),rest.view.toArray());
  };
  restored();parent.updateWorldMatrix(true,true);
  assert.equal(motion.begin('contact'),true);motion.step(duration*.5);motion.reset();motion.step(5);restored();assert.equal(events.length,2,'reset never delivers a late completion');
  parent.updateWorldMatrix(true,true);assert.equal(motion.begin('contact'),true);motion.step(duration*.25);
  const escape=new Event('keydown',{cancelable:true});Object.defineProperty(escape,'code',{value:'Escape'});window.dispatchEvent(escape);motion.step(1);restored();assert.equal(events.length,2);
  abort.abort();
 }
});
