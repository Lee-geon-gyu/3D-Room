import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createCloudGeometries} from '../src/ui/cloudPlaneGeometry.js';
import {advanceLoading} from '../src/ui/loadingProgress.js';
import {createContentInteraction} from '../src/scene/ContentInteraction.js';
import {applyCuePulse} from '../src/scene/cuePulse.js';

test('Only fully transparent cloud rows are omitted; every retained vertex, UV and triangle is the original',()=>{
 const geometry=createCloudGeometries(),original=new THREE.PlaneGeometry(1,1,32,18);
 try{
  assert.deepEqual(geometry.base.index.array,original.index.array);
  assert.deepEqual(geometry.base.attributes.position.array,original.attributes.position.array);
  for(const [part,visibleRows,maxVisibleUV] of [[geometry.distant,10,.531],[geometry.foreground,9,.49]]){
   assert.equal(part.index,geometry.base.index);
   for(const name of Object.keys(geometry.base.attributes))assert.equal(part.attributes[name],geometry.base.attributes[name]);
   assert.deepEqual(part.drawRange,{start:(18-visibleRows)*32*6,count:visibleRows*32*6});
   const omitted=part.index.array.slice(0,part.drawRange.start);
   assert.ok([...omitted].every(index=>part.attributes.uv.getY(index)>maxVisibleUV));
  }
  assert.equal((geometry.base.index.count+2*geometry.distant.drawRange.count+3*geometry.foreground.drawRange.count)/(6*original.index.count),65/108);
 }finally{geometry.dispose();original.dispose();}
});

test('Duplicate resource reports reuse state, while phase changes and real readiness still propagate',()=>{
 const progress={percent:96,phase:'컴파일'};
 for(let i=0;i<1000;i++)assert.equal(advanceLoading(progress,{loaded:i,total:1000}),progress);
 assert.equal(advanceLoading(progress,{stage:'compile',phase:'컴파일'}),progress);
 assert.deepEqual(advanceLoading(progress,{stage:'compile',phase:'완료 준비'}),{percent:96,phase:'완료 준비'});
 assert.deepEqual(advanceLoading(progress,{stage:'ready'}),{percent:100,phase:'컴파일'});
});

test('Unreachable, airborne and underwater targets avoid ray tests; valid activation still checks occlusion afresh',()=>{
 const previous=global.window;global.window=new EventTarget();const abort=new AbortController();
 const camera=new THREE.PerspectiveCamera(57,1,.06,130);camera.position.set(0,0,2);camera.lookAt(0,0,0);
 const root=new THREE.Group(),mesh=new THREE.Mesh(new THREE.PlaneGeometry(1,1),new THREE.MeshBasicMaterial());
 mesh.userData.contentId='profile';root.add(mesh);root.updateMatrixWorld(true);
 let rays=0;const raycast=mesh.raycast;mesh.raycast=function(...args){rays++;return raycast.apply(this,args);};
 const controller={position:{y:0},verticalOffset:0,swimming:false,seated:false,paused:false};
 const entry={id:'profile',kind:'tablet',root,focus:new THREE.Vector3(),floor:0};
 const interaction=createContentInteraction({camera,controller,entries:[entry],targets:[mesh],callbacks:{},signal:abort.signal});
 try{
  assert.equal(interaction.canActivate('profile'),true);assert.equal(rays,1);
  for(const [property,value] of [['verticalOffset',.1],['swimming',true]]){
   const before=controller[property];controller[property]=value;assert.equal(interaction.canActivate('profile'),false);assert.equal(rays,1);controller[property]=before;
  }
  camera.lookAt(0,0,4);assert.equal(interaction.canActivate('profile'),false);assert.equal(rays,1);
  camera.lookAt(0,0,0);mesh.userData.contentId='occluder';assert.equal(interaction.canActivate('profile'),false);assert.equal(rays,2);
  mesh.userData.contentId='profile';assert.equal(interaction.canActivate('profile'),true);assert.equal(rays,3);
 }finally{abort.abort();mesh.geometry.dispose();mesh.material.dispose();global.window=previous;}
});

test('Hidden and unchanged cues skip material writes and restore the exact current pulse',()=>{
 const group=new THREE.Group(),material=new THREE.MeshBasicMaterial({transparent:true,opacity:.2});
 const mesh=new THREE.Mesh(new THREE.PlaneGeometry(),material);group.add(mesh);const cue={group};
 let opacity=.2,writes=0;Object.defineProperty(material,'opacity',{get:()=>opacity,set:value=>{writes++;opacity=value;}});
 try{
  for(let i=0;i<1000;i++)applyCuePulse(cue,i/1000,false);
  assert.equal(writes,0);assert.equal(group.visible,false);
  applyCuePulse(cue,.5,true);assert.equal(opacity,.1);assert.equal(writes,1);
  for(let i=0;i<1000;i++)applyCuePulse(cue,.5,true);
  assert.equal(writes,1);
  applyCuePulse(cue,0,true);assert.equal(group.visible,false);assert.equal(opacity,0);
  applyCuePulse(cue,.8,false);applyCuePulse(cue,.8,true);assert.equal(group.visible,true);assert.equal(opacity,.2*.8);
 }finally{mesh.geometry.dispose();material.dispose();}
});
