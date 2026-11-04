import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {exhibitFrame,exhibitAspect,exhibitReaderBounds} from '../src/exhibitFormat.js';
import {createExhibitBody} from '../src/scene/ExhibitFrame.js';
import {EXHIBITION_SLOTS} from '../src/scene/interactionModel.js';
import {readerMotion} from '../src/ui/contentMotion.js';

test('All actual frame bodies use one landscape silhouette, inset mat and separated hanging slots',()=>{
 const oak=new THREE.MeshBasicMaterial(),paper=new THREE.MeshBasicMaterial();
 for(const slot of EXHIBITION_SLOTS){
  const {root,backing,print}=createExhibitBody(slot,oak,paper);
  const bounds=new THREE.Box3().setFromObject(root).getSize(new THREE.Vector3());
  assert.ok(Math.abs(bounds.x/bounds.y-exhibitAspect)<1e-6);
  const bodyBounds=new THREE.Box3().setFromObject(backing).getSize(new THREE.Vector3());
  assert.ok(Math.abs(bodyBounds.x-slot.width)<1e-6);
  assert.equal(print.geometry.parameters.width,slot.width-2*exhibitFrame.rim);
  assert.equal(print.geometry.parameters.height,slot.height-2*exhibitFrame.rim);
  assert.equal(print.position.z,exhibitFrame.surface);
  for(const other of EXHIBITION_SLOTS){
   if(other===slot||other.rotation!==slot.rotation)continue;
   if(Math.abs(other.y-slot.y)>(slot.height+other.height)/2+.08)continue;
   const spacing=slot.rotation===0?Math.abs(other.x-slot.x):Math.abs(other.z-slot.z);
   assert.ok(spacing>(slot.width+other.width)/2+.08,'wider landscape frames must not overlap');
  }
  root.traverse(mesh=>mesh.geometry?.dispose());
 }
 oak.dispose();paper.dispose();
});

test('Desktop, phone and short-screen reader bounds preserve the exact hanging frame ratio',()=>{
 for(const [width,height] of [[1280,800],[1280,720],[769,800],[768,800],[390,844],[360,670],[1024,540]]){
  const box=exhibitReaderBounds(width,height);
  assert.ok(Math.abs(box.width/box.height-exhibitAspect)<1e-12);
  assert.ok(box.x>=10&&box.y>=10&&box.x+box.width<=width-10&&box.y+box.height<=height-10);
 }
});

test('Desktop project readers stay on the physical frame during opening and closing',()=>{
 for(const viewport of [{width:1280,height:800}]){
  const box=exhibitReaderBounds(viewport.width,viewport.height);
  for(const phase of ['opening','closing'])for(const progress of [.48,.62,.85,1]){
   const corners=[{x:.18,y:.24},{x:.82,y:.2},{x:.84,y:.68},{x:.2,y:.72}];
   const motion=readerMotion({kind:'project',phase,progress,corners},box,viewport);
   const m=motion.transform.slice(9,-1).split(',').map(Number);
   for(const [index,[x,y]] of [[0,0],[box.width,0],[box.width,box.height],[0,box.height]].entries()){
    const w=m[3]*x+m[7]*y+1;
    const actual={x:(m[0]*x+m[4]*y+m[12])/w+box.x,y:(m[1]*x+m[5]*y+m[13])/w+box.y};
    assert.ok(Math.abs(actual.x-corners[index].x*viewport.width)<1e-6);
    assert.ok(Math.abs(actual.y-corners[index].y*viewport.height)<1e-6);
   }
  }
 }
});
