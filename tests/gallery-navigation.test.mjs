import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {GalleryController} from '../src/navigation/GalleryController.js';
import {galleryStart,galleryEntrance,galleryDesk,galleryBenches,galleryDestinations,galleryEnding,gallerySlots,galleryCanStand,galleryClear,galleryRoute} from '../src/navigation/galleryLayout.js';
const views=gallerySlots.map(s=>({x:s.x+(s.rotation<0?-1.95:s.rotation>0?1.95:0),y:0,z:s.z+(s.rotation===0?2.15:0),yaw:s.rotation,pitch:.48}));
test('Every exhibit, desk and sunset lounge is reachable around the real furniture on one floor',()=>{
 const poses=[galleryStart,...Object.values(galleryDestinations),...views,galleryEnding];
 for(const a of poses)for(const b of poses){assert.ok(galleryCanStand(b.x,b.z));const route=galleryRoute(a,b);assert.ok(route.length,`${JSON.stringify(a)} -> ${JSON.stringify(b)}`);let from=a;for(const to of route){assert.equal(to.y,0);assert.ok(galleryClear(from,to));from=to;}assert.deepEqual(route.at(-1),b);}
 assert.equal(galleryCanStand(0,-1),false);assert.equal(galleryCanStand(19,1.5),false);assert.equal(galleryCanStand(0,-27),false);assert.equal(galleryCanStand(9,2),false);
});
function visitor(){global.window=new EventTarget();const canvas=new EventTarget();canvas.setPointerCapture=()=>{};const camera=new T.PerspectiveCamera(61,1.6,.06,240),arrivals=[];const controller=new GalleryController(canvas,camera,{onClick(){},onArrive:t=>arrivals.push(t)});const tick=s=>{for(let i=0;i<s/.025;i++){controller.step(.025);assert.ok(galleryCanStand(controller.position.x,controller.position.z));}};return {controller,camera,arrivals,tick};}
test('The second-floor elevator, lobby and short corridor form one enclosed walking route',()=>{
 assert.equal(galleryEntrance.floor,2);assert.ok(galleryCanStand(galleryStart.x,galleryStart.z));
 assert.equal(galleryCanStand(19,10.1),false,'closed elevator wall cannot be crossed');
 for(const z of [3,8])assert.equal(galleryCanStand(9,z),false,'corridor side walls enclose the passage');
 assert.ok(galleryClear({x:12,z:5.5},{x:6,z:5.5}));
 assert.equal(galleryCanStand(galleryDesk.x,galleryDesk.z),false);
 assert.equal(galleryCanStand(galleryDesk.x+2.5,galleryDesk.z+1.6),true,'round counter leaves its corner circulation clear');
 const v=visitor();v.controller.keys.add('KeyS');v.tick(3);assert.ok(v.controller.position.z<=9.38);v.controller.reset();assert.deepEqual(v.controller.position,galleryStart);v.controller.dispose();
});
test('Shortcuts walk through the gallery, settle the camera, and open only their own destination',()=>{
 const v=visitor();for(const name of ['gallery','library','atelier']){v.controller.guide(name);v.tick(30);assert.equal(v.arrivals.at(-1),name);assert.ok(Math.hypot(v.controller.position.x-galleryDestinations[name].x,v.controller.position.z-galleryDestinations[name].z)<1e-6);}
 const length=v.arrivals.length;v.controller.guide('gallery');v.tick(.1);v.controller.setPaused(true);v.controller.setPaused(false);v.tick(10);assert.equal(v.arrivals.length,length);v.controller.reset();assert.deepEqual(v.controller.position,galleryStart);v.controller.dispose();
});
test('Walking respects the bench and outside walls, while jumping and crouching remain available',()=>{
 const v=visitor();v.controller.position={x:0,y:0,z:.2,yaw:0,pitch:0};v.controller.keys.add('KeyW');v.tick(5);assert.ok(v.controller.position.z>=-.23);v.controller.keys.clear();v.controller.requestJump();v.tick(.25);assert.ok(v.controller.verticalOffset>.3);v.tick(2);assert.equal(v.controller.verticalOffset,0);v.controller.toggleCrouch();v.tick(.5);assert.ok(v.controller.eyeHeight<1.05);v.controller.reset();v.controller.dispose();
});
test('Bench seating, movement to stand and reset clear every held input',()=>{
 const v=visitor(),seat={approach:{x:0,z:.2},pose:{x:0,y:0,z:-1,yaw:0,pitch:0}};
 v.controller.position={x:0,y:0,z:.2,yaw:0,pitch:0};assert.equal(v.controller.sit(seat),true);assert.equal(v.controller.seated,true);
 const event=new Event('keydown');Object.defineProperty(event,'code',{value:'KeyW'});window.dispatchEvent(event);assert.equal(v.controller.seated,false);assert.equal(v.controller.position.z,.2);
 v.controller.touchMove={x:1,z:1};v.controller.touchRun=true;v.controller.reset();assert.equal(v.controller.keys.size,0);assert.equal(v.controller.touchRun,false);assert.deepEqual(v.controller.touchMove,{x:0,z:0});v.tick(.5);assert.deepEqual(v.controller.position,galleryStart);v.controller.dispose();
});
