import test from 'node:test';
import assert from 'node:assert/strict';
import {attachDragLook} from '../src/navigation/DragLook.js';
function fixture(mode='denied'){
 const doc=Object.assign(new EventTarget(),{defaultView:new EventTarget(),hidden:false,pointerLockElement:null}),canvas=new EventTarget(),abort=new AbortController(),looks=[],clicks=[],states=[];
 let pointer,paused=false,locks=0,exits=0,resolve,reject;canvas.ownerDocument=doc;canvas.setPointerCapture=()=>{};
 const grant=()=>{doc.pointerLockElement=canvas;doc.dispatchEvent(new Event('pointerlockchange'));resolve?.();};
 const escape=()=>{doc.pointerLockElement=null;doc.dispatchEvent(new Event('pointerlockchange'));};
 doc.exitPointerLock=()=>{exits++;escape();};
 if(mode!=='unsupported')canvas.requestPointerLock=()=>{locks++;if(mode==='denied')throw new Error('Unavailable');if(mode==='legacy')return;return new Promise((yes,no)=>{resolve=yes;reject=no;});};
 canvas.addEventListener('worldlookchange',event=>states.push(event.detail));
 const binding=attachDragLook(canvas,{signal:abort.signal,isPaused:()=>paused,onPointer:value=>{pointer=value;},onLook:(x,y)=>looks.push([x,y]),onClick:(x,y)=>clicks.push([x,y])});
 const fire=(target,type,extra={})=>target.dispatchEvent(Object.assign(new Event(type),{pointerId:1,pointerType:'mouse',button:0,clientX:200,clientY:250,...extra}));
 return {doc,canvas,abort,looks,clicks,states,fire,grant,escape,reject:()=>reject?.(new Error('Denied')),resolve:()=>resolve?.(),get pointer(){return pointer;},get locks(){return locks;},get exits(){return exits;},pause(){paused=true;binding.cancel();}};
}

test('Denied or unsupported mouse lock retains captured look and real release coordinates',()=>{
 for(const mode of ['denied','unsupported']){
  const f=fixture(mode);try{
   f.fire(f.canvas,'pointerdown');assert.equal(f.states.at(-1).active,true);
   f.fire(f.canvas,'pointermove',{clientX:260,clientY:280});assert.deepEqual(f.looks,[[60,30]]);
   f.fire(f.canvas,'pointerup',{clientX:260,clientY:280});assert.equal(f.pointer,null);assert.equal(f.locks,mode==='denied'?1:0);assert.equal(f.clicks.length,0);
   assert.deepEqual(f.states.at(-1),{active:false,id:1,x:260,y:280,mouse:true});
  }finally{f.abort.abort();}
 }
});

test('Granted lock rotates from relative input exactly once and restores the entry position',async()=>{
 const f=fixture('pending');try{
  f.fire(f.canvas,'pointerdown');f.grant();await Promise.resolve();
  f.fire(f.canvas,'lostpointercapture');assert.ok(f.pointer,'lock acquisition may release ordinary pointer capture');
  f.fire(f.canvas,'pointermove',{clientX:0,clientY:0,movementX:60,movementY:30});assert.equal(f.looks.length,0);
  f.fire(f.canvas,'mousemove',{clientX:0,clientY:0,movementX:60,movementY:30});assert.deepEqual(f.looks,[[60,30]]);
  f.fire(f.doc.defaultView,'mouseup',{clientX:800,clientY:600});
  assert.equal(f.pointer,null);assert.equal(f.doc.pointerLockElement,null);assert.equal(f.exits,1);assert.equal(f.clicks.length,0);
  assert.deepEqual(f.states.at(-1),{active:false,id:1,x:200,y:250,mouse:true,restored:true});
  f.fire(f.canvas,'mousemove',{movementX:100});assert.equal(f.looks.length,1,'released movement cannot keep turning the camera');
 }finally{f.abort.abort();}
});

test('A locked small click activates the original object once despite both release event types',()=>{
 const f=fixture('legacy');try{
  f.fire(f.canvas,'pointerdown');f.grant();f.fire(f.canvas,'mousemove',{movementX:3,movementY:0});assert.equal(f.looks.length,0);
  f.fire(f.canvas,'pointerup',{clientX:800,clientY:600});f.fire(f.doc.defaultView,'mouseup');
  assert.deepEqual(f.clicks,[[200,250]]);assert.equal(f.exits,1);
 }finally{f.abort.abort();}
});

test('Touch never requests mouse lock and retains the same captured threshold and click',()=>{
 const f=fixture('legacy');try{
  f.fire(f.canvas,'pointerdown',{pointerType:'touch'});f.fire(f.canvas,'pointermove',{pointerType:'touch',clientX:203});assert.equal(f.looks.length,0);
  f.fire(f.canvas,'pointerup',{pointerType:'touch',clientX:203});assert.deepEqual(f.clicks,[[203,250]]);
  f.fire(f.canvas,'pointerdown',{pointerType:'touch'});f.fire(f.canvas,'pointermove',{pointerType:'touch',clientX:210});assert.deepEqual(f.looks,[[10,0]]);
  f.fire(f.canvas,'pointerup',{pointerType:'touch',clientX:210});assert.equal(f.clicks.length,1);assert.equal(f.locks,0);
 }finally{f.abort.abort();}
});

test('Esc, cancel, blur, pause, hidden page and disposal release lock without activating',()=>{
 for(const reason of ['escape','pointercancel','blur','pause','hidden','dispose']){
  const f=fixture('legacy');try{
   f.fire(f.canvas,'pointerdown');f.grant();
   if(reason==='escape')f.escape();else if(reason==='pause')f.pause();else if(reason==='hidden'){f.doc.hidden=true;f.doc.dispatchEvent(new Event('visibilitychange'));}else if(reason==='dispose')f.abort.abort();else if(reason==='blur')f.doc.defaultView.dispatchEvent(new Event('blur'));else f.fire(f.canvas,reason);
   assert.equal(f.pointer,null);assert.equal(f.doc.pointerLockElement,null);assert.equal(f.clicks.length,0);assert.equal(f.states.at(-1).active,false);assert.equal(f.states.at(-1).restored,true);
  }finally{f.abort.abort();}
 }
});

test('Delayed grants after release, cancellation or disposal cannot leave a legacy browser locked',()=>{
 for(const reason of ['pointerup','pointercancel','pause','dispose']){
  const f=fixture('legacy');try{
   f.fire(f.canvas,'pointerdown');f.fire(f.canvas,'pointermove',{clientX:240});
   if(reason==='pause')f.pause();else if(reason==='dispose')f.abort.abort();else f.fire(f.canvas,reason,{clientX:240});
   const states=f.states.length;f.grant();
   assert.equal(f.doc.pointerLockElement,null);assert.equal(f.exits,1);assert.equal(f.pointer,null);assert.equal(f.states.length,states);assert.equal(f.clicks.length,0);
  }finally{f.abort.abort();}
 }
});

test('Rejected promises fall back without blocking subsequent mouse gestures',async()=>{
 const f=fixture('pending');try{
  f.fire(f.canvas,'pointerdown');f.reject();await Promise.resolve();await Promise.resolve();
  f.fire(f.canvas,'pointermove',{clientX:240});f.fire(f.canvas,'pointerup',{clientX:240});assert.deepEqual(f.looks,[[40,0]]);
  f.fire(f.canvas,'pointerdown');assert.equal(f.locks,2);f.grant();f.fire(f.canvas,'pointerup');assert.equal(f.doc.pointerLockElement,null);
 }finally{f.abort.abort();}
});

test('Release before the lock-change task still restores the anchor and settles its request',async()=>{
 const f=fixture('pending');try{
  f.fire(f.canvas,'pointerdown');f.doc.pointerLockElement=f.canvas;
  f.fire(f.canvas,'pointerup',{clientX:750,clientY:500});f.resolve();await Promise.resolve();
  assert.deepEqual(f.clicks,[[200,250]]);assert.equal(f.states.at(-1).restored,true);assert.equal(f.doc.pointerLockElement,null);
  f.fire(f.canvas,'pointerdown');assert.equal(f.locks,2);f.reject();await Promise.resolve();await Promise.resolve();
 }finally{f.abort.abort();}
});

test('Unrelated pointers cannot finish a mouse gesture, and ordinary capture loss cancels fallback',()=>{
 const f=fixture();try{
  f.fire(f.canvas,'pointerdown');f.fire(f.canvas,'pointermove',{pointerId:2,clientX:600});f.fire(f.canvas,'pointerup',{pointerId:2});
  f.fire(f.canvas,'pointercancel',{pointerId:2});f.fire(f.canvas,'lostpointercapture',{pointerId:2});
  assert.ok(f.pointer);assert.equal(f.looks.length,0);f.fire(f.canvas,'lostpointercapture');assert.equal(f.pointer,null);assert.equal(f.clicks.length,0);
 }finally{f.abort.abort();}
});
