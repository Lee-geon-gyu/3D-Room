import {lounge} from '../src/navigation/loungeLayout.js';
import {studioDepth} from '../src/navigation/studioLayout.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {projectPresentationSurface} from '../src/scene/presentationSurface.js';
import {DETAIL_HANDOFF} from '../src/scene/presentationMotion.js';
import {quadTransform,readerMotion} from '../src/ui/contentMotion.js';
import {createDeskObjects} from '../src/scene/DeskObjects.js';
import {createContentInteraction} from '../src/scene/ContentInteraction.js';
import {EXHIBITION_SLOTS} from '../src/scene/interactionModel.js';
import {createExhibitBody} from '../src/scene/ExhibitFrame.js';

const near=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-6,`${actual} != ${expected}`);
test('Settled readers reflow without stale perspective when resized across the mobile breakpoint',()=>{
 const frame={kind:'project',phase:'reading',progress:1,corners:[{x:.1,y:.3},{x:.9,y:.3},{x:.9,y:.7},{x:.1,y:.7}]};
 for(const width of [320,360,390,600,768,769,1280]){
  assert.deepEqual(readerMotion(frame,{x:12,y:12,width:width-24,height:800},{width,height:824}),{transform:'none',opacity:1,expansion:1});
 }
});
function transformed(matrix,x,y){
 const w=matrix[3]*x+matrix[7]*y+matrix[15];
 return {x:(matrix[0]*x+matrix[4]*y+matrix[12])/w,y:(matrix[1]*x+matrix[5]*y+matrix[13])/w};
}

test('The live reader maps all four corners exactly, including tilted tabletop perspective',()=>{
 const corners=[{x:94,y:201},{x:543,y:237},{x:612,y:498},{x:41,y:451}];
 const matrix=quadTransform(corners,1244,684);
 for(const [i,[x,y]] of [[0,0],[1244,0],[1244,684],[0,684]].entries()){
  const result=transformed(matrix,x,y);near(result.x,corners[i].x);near(result.y,corners[i].y);
 }
 assert.equal(quadTransform(Array(4).fill({x:1,y:1}),100,100),null);
});

test('The handoff starts on the prop and finishes at the exact desktop or phone reader bounds',()=>{
 for(const viewport of [{width:1280,height:720},{width:360,height:670}]){
  const box={x:8,y:8,width:viewport.width-16,height:viewport.height-16};
  const corners=[{x:.2,y:.3},{x:.8,y:.34},{x:.84,y:.7},{x:.16,y:.65}];
  const start=readerMotion({progress:DETAIL_HANDOFF,corners},box,viewport);
  assert.equal(start.opacity,0);
  const matrix=start.transform.slice(9,-1).split(',').map(Number);
  const origin=transformed(matrix,0,0);
  near(origin.x+box.x,corners[0].x*viewport.width);near(origin.y+box.y,corners[0].y*viewport.height);
  let previous=0;
  for(let p=DETAIL_HANDOFF;p<1;p+=.01){const frame=readerMotion({progress:p,corners},box,viewport);assert.ok(frame.expansion>=previous);assert.ok(!frame.transform.includes('NaN'));previous=frame.expansion;}
  assert.deepEqual(readerMotion({progress:1,corners},box,viewport),{transform:'none',opacity:1,expansion:1});
 }
});

test('Projected tablet and wall corners retain the actual shared affine world transform',()=>{
 const parent=new THREE.Group();parent.matrixAutoUpdate=false;
 parent.matrix.set(1.12,0,.0504,0,0,1.12,0,0,0,0,1.06,0,0,0,0,1);
 const camera=new THREE.PerspectiveCamera(57,1280/720,.06,130);camera.position.set(0,2,3);camera.lookAt(0,.9,0);
 const root=new THREE.Group();root.position.y=.9;parent.add(root);
 for(const kind of ['tablet','project']){
  const entry={kind,root,size:{width:.91,depth:.516,height:1.47,thickness:.018}};
  const quad=projectPresentationSurface(entry,camera);
  const local=kind==='tablet'?[-.455,.018,-.258]:[-.455,.735,.03];
  const vertex=root.localToWorld(new THREE.Vector3(...local)).project(camera);
  near(quad[0].x,(vertex.x+1)/2);near(quad[0].y,(1-vertex.y)/2);
  assert.ok(quad.every(point=>Number.isFinite(point.x)&&Number.isFinite(point.y)));
 }
});

test('One reversible motion reveals before stopping, credits only at the end, and restores hidden props',()=>{
 global.window=new EventTarget();
 const [entry]=createDeskObjects({profileScreen:new THREE.Texture(),contactFace:new THREE.Texture()},3.8);
 const parent=new THREE.Group();parent.add(entry.root);parent.updateMatrixWorld(true);
 const camera=new THREE.PerspectiveCamera(57,1280/720,.06,130);camera.position.set(lounge.profile.view.x,lounge.floor+1.53,lounge.profile.view.z);camera.lookAt(...lounge.profile.tablet);camera.updateMatrixWorld(true);
 const controller={position:{...lounge.profile.view},verticalOffset:0,swimming:false,paused:false,setPaused(value){this.paused=value;}};
 const abort=new AbortController(),events=[],frames=[];
 const interaction=createContentInteraction({camera,controller,entries:[entry],targets:entry.meshes,signal:abort.signal,callbacks:{onReveal:id=>events.push(['reveal',id]),onOpen:id=>events.push(['open',id])}});
 const original={position:entry.root.position.clone(),camera:camera.position.clone()};
 const disconnect=interaction.observe(frame=>frames.push(frame));
 assert.equal(interaction.begin('profile'),true);interaction.step(.8);
 assert.deepEqual(events,[['reveal','profile']]);assert.equal(frames.at(-1).phase,'opening');
 const intermediateCamera=camera.position.clone();interaction.step(.3);assert.notDeepEqual(camera.position.toArray(),intermediateCamera.toArray());
 assert.equal(entry.root.visible,false);interaction.step(.45);
 assert.deepEqual(events,[['reveal','profile'],['open','profile']]);assert.equal(frames.at(-1).phase,'reading');
 interaction.close();interaction.step(.25);assert.equal(frames.at(-1).phase,'closing');
 interaction.step(.6);assert.equal(frames.at(-1),null);assert.equal(entry.root.visible,true);
 assert.deepEqual(entry.root.position.toArray(),original.position.toArray());assert.deepEqual(camera.position.toArray(),original.camera.toArray());
 // Cancel after mounting the reader: neither a stale open nor a second reveal.
 assert.equal(interaction.begin('profile'),true);interaction.step(.8);interaction.close();interaction.step(1);
 assert.equal(events.filter(event=>event[0]==='open').length,1);assert.equal(controller.paused,false);
 const count=frames.length;disconnect();interaction.begin('profile');interaction.step(.8);interaction.reset();assert.equal(frames.length,count);
 abort.abort();
});

test('All six complete frames leave their wall while the visitor stays fixed, then return exactly',()=>{
 for(const aspect of [1280/720,360/670])for(const reducedMotion of [false,true])for(const slot of EXHIBITION_SLOTS){
  global.window=new EventTarget();
  const parent=new THREE.Group();parent.matrixAutoUpdate=false;
  parent.matrix.set(1.12,0,.0504,0,0,1.12,0,0,0,0,1.06,0,0,0,0,1);
  const {root,backing:rim,print}=createExhibitBody(slot,new THREE.MeshBasicMaterial(),new THREE.MeshBasicMaterial());
  root.position.set(slot.x,slot.y,slot.z);root.rotation.y=slot.rotation;parent.add(root);print.userData.contentId='project';
  const entry={id:'project',kind:'project',root,floor:0,size:slot,focus:new THREE.Vector3(0,0,.03)};
  root.updateWorldMatrix(true,true);
  const focus=root.localToWorld(entry.focus.clone()),normal=new THREE.Vector3(0,0,1).transformDirection(root.matrixWorld);
  const camera=new THREE.PerspectiveCamera(aspect<.8?72:57,aspect,.06,130);camera.position.copy(focus).addScaledVector(normal,2.8);camera.position.y-=.4;camera.lookAt(focus);camera.updateMatrixWorld(true);
  camera.userData.presentationViewport=aspect<.8?{width:360,height:670}:{width:1280,height:720};
  const controller={position:{y:0},verticalOffset:0,swimming:false,paused:false,setPaused(value){this.paused=value;}};
  const abort=new AbortController(),opened=[];
  const interaction=createContentInteraction({camera,controller,entries:[entry],targets:[print],signal:abort.signal,reducedMotion,callbacks:{onOpen:id=>opened.push(id)}});
  const rest={position:root.position.clone(),quaternion:root.quaternion.clone(),scale:root.scale.clone(),camera:camera.position.clone(),view:camera.quaternion.clone(),world:root.getWorldPosition(new THREE.Vector3())};
  const bodyCorners=()=>[[0,0,0],[slot.width,0,0],[0,slot.height,0],[0,0,.055]].map(point=>root.localToWorld(new THREE.Vector3(...point)));
  const originalCorners=bodyCorners(),distances=originalCorners.slice(1).map(point=>point.distanceTo(originalCorners[0]));
  const duration=reducedMotion?.18:1.55;
  assert.equal(interaction.begin('project'),true);interaction.step(duration*.28);
  const moved=root.getWorldPosition(new THREE.Vector3()).sub(rest.world);
  assert.ok(moved.dot(normal)>.025,'the physical frame detaches from its original wall');
  assert.equal(root.visible,true);assert.equal(rim.parent,root);assert.equal(print.parent,root);
  for(const [i,point] of bodyCorners().slice(1).entries())near(point.distanceTo(bodyCorners()[0]),distances[i]);
  assert.deepEqual(camera.position.toArray(),rest.camera.toArray());assert.deepEqual(camera.quaternion.toArray(),rest.view.toArray());
  interaction.step(duration*.44);
  assert.deepEqual(root.scale.toArray(),rest.scale.toArray(),'the frame keeps its original proportions');
  for(const corner of projectPresentationSurface(entry,camera))assert.ok(corner.x>0&&corner.x<1&&corner.y>0&&corner.y<1,'the held frame fits the viewport');
  interaction.step(duration*.29);assert.deepEqual(opened,['project']);
  const heldCorners=bodyCorners();for(const [i,point] of heldCorners.slice(1).entries())near(point.distanceTo(heldCorners[0]),distances[i]);
  const heldNormal=heldCorners[1].clone().sub(heldCorners[0]).cross(heldCorners[2].clone().sub(heldCorners[0])).normalize();
  const viewerNormal=new THREE.Vector3(0,0,1).applyQuaternion(camera.quaternion);assert.ok(heldNormal.dot(viewerNormal)>.999999,'the final physical face is square to the viewer, even inside the affine room');
  for(const corner of projectPresentationSurface(entry,camera))assert.ok(corner.x>0&&corner.x<1&&corner.y>0&&corner.y<1,'the final physical frame remains completely inside desktop and phone views');
  interaction.close();interaction.step(1);
  const restored=()=>{
   assert.deepEqual(root.position.toArray(),rest.position.toArray());assert.deepEqual(root.quaternion.toArray(),rest.quaternion.toArray());assert.deepEqual(root.scale.toArray(),rest.scale.toArray());assert.equal(root.visible,true);
   assert.deepEqual(camera.position.toArray(),rest.camera.toArray());assert.deepEqual(camera.quaternion.toArray(),rest.view.toArray());assert.equal(controller.paused,false);
   assert.equal(root.matrixAutoUpdate,true);
  };
  restored();root.updateWorldMatrix(true,true);
  assert.equal(interaction.begin('project'),true);interaction.step(duration*.6);interaction.reset();interaction.step(2);restored();assert.equal(opened.length,1);
  root.updateWorldMatrix(true,true);assert.equal(interaction.begin('project'),true);interaction.step(duration*.2);
  const escape=new Event('keydown',{cancelable:true});Object.defineProperty(escape,'code',{value:'Escape'});window.dispatchEvent(escape);interaction.step(1);restored();assert.equal(opened.length,1);
  abort.abort();rim.geometry.dispose();rim.material.dispose();print.geometry.dispose();print.material.dispose();
 }
});
