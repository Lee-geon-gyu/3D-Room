import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {lounge as L,loungeGroundHeight,sunkenSofa,subtractRect} from '../src/navigation/loungeLayout.js';
import {routeBetween,clearSegment,canStand,moveOnSurface,START,OUTDOOR,space} from '../src/navigation/layout.js';
import {WalkController} from '../src/navigation/WalkController.js';
import {coveLayouts,coveHeightAt,coveLift} from '../src/navigation/coveLayout.js';
import {createRoomDetails} from '../src/scene/RoomRefinements.js';
import decor from '../src/scene/wall-decor.json' with {type:'json'};
import {EXHIBITION_SLOTS} from '../src/scene/interactionModel.js';
import {createSeaView} from '../src/scene/SeaView.js';
import {createWoolTexture,configureWool} from '../src/scene/wool.js';
const area=([l,r,b,f])=>(r-l)*(f-b);
const tick=(c,t)=>{for(let i=0;i<t/.025;i++)c.step(.025);};

test('The raised stone floor meets a continuous 1:15 wheeled entry, and the rug covers about 70 percent',()=>{
 const [l,r,b,f]=L.ramp.bounds;assert.equal(L.floor/(f-b),1/15);
 for(const x of [-3.8,0,2]){let p={x,z:f+.1,y:0};for(let z=f+.08;z>b-.1;z-=.02){const q=moveOnSurface(p,x,z);assert.ok(q,JSON.stringify(p));assert.ok(Math.abs(q.y-p.y)<.003);p=q;}assert.equal(p.y,L.floor);}
 assert.ok(area(L.rug)/area(L.room)>.68&&area(L.rug)/area(L.room)<.74);
 const cuts=subtractRect(L.room,L.pit.bounds);assert.ok(Math.abs(cuts.reduce((a,r)=>a+area(r),0)-(area(L.room)-area(L.pit.bounds)))<1e-8);
});

test('Four real low steps link the dry sunken floor to the raised room and all exterior routes',()=>{
 const dest={x:-.75,z:sunkenSofa.approachZ,y:L.pit.floor};
 for(const from of [START,OUTDOOR])for(const [a,b]of [[from,dest],[dest,from]]){
  const path=routeBetween(a,b);assert.ok(path.length);let p=a;for(const q of path){assert.ok(clearSegment(p,q));p=q;}assert.equal(p.y,b.y??0);
 }
 const heights=Array.from({length:4},(_,i)=>loungeGroundHeight(-.75,-.35-(i+.5)*.30));
 assert.deepEqual(heights,[-.03,-.18,-.32999999999999996,-.48]);
 assert.equal(canStand(-2.2,-2,undefined,L.pit.floor),false,'the sofa is a physical obstacle');
});

test('A visitor can walk down, sit in the sunken sofa, stand and resume the exterior route without swimming',()=>{
 global.window=new EventTarget();const canvas=new EventTarget();const camera=new THREE.PerspectiveCamera(57,1,.06,130);
 const dest={x:-.75,z:sunkenSofa.approachZ,y:L.pit.floor,yaw:Math.PI,pitch:0};
 const c=new WalkController(canvas,camera,{start:dest,onClick(){},onArea(){},onRoute(){}});
 assert.equal(c.swimming,false);assert.equal(c.motion.underwater,false);assert.equal(c.sit(sunkenSofa),true);tick(c,3);
 assert.equal(c.seated,true);assert.ok(Math.abs(c.position.y-sunkenSofa.seatTop)<1e-10);assert.ok(Math.abs(camera.position.y-(sunkenSofa.seatTop*space.worldScale[1]+sunkenSofa.eyeHeight))<.001);
 assert.equal(c.stand(),true);tick(c,1);assert.equal(c.seated,false);assert.ok(Math.abs(c.position.y-L.pit.floor)<1e-10);assert.ok(canStand(c.position.x,c.position.z,undefined,c.position.y));
 c.guide('terrace');tick(c,25);assert.equal(c.area,'terrace');assert.equal(c.swimming,false);assert.equal(c.path.length,0);assert.ok(Math.hypot(c.position.x-OUTDOOR.x,c.position.z-OUTDOOR.z)<.01);c.dispose();
});

test('The upward-curving ceiling finish and headroom agree, and the upper finish clears the roof perimeter',()=>{
 const root=createRoomDetails(new THREE.Group());root.updateMatrixWorld(true);
 for(const c of coveLayouts)for(const t of [.04,.25,.5,.80,.95]){
  const x=c.left+c.inset*t,z=-1;
  const hit=new THREE.Raycaster(new THREE.Vector3(x,c.y-.2,z),new THREE.Vector3(0,1,0),0,.4).intersectObject(root,true)[0];
  assert.ok(hit);assert.ok(Math.abs(hit.point.y-coveHeightAt(x,z,c.y-.3))<.002);assert.ok(hit.point.y>=c.y&&hit.point.y<=c.y+coveLift+.002);
 }
 assert.ok(coveLayouts[1].left>space.upperRoof.left&&coveLayouts[1].right<space.upperRoof.right);
 root.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
});

test('The sea has actual depth and shared-loop motion; wool needs one shared finite texture and no fur geometry',()=>{
 const sea=createSeaView();const water=sea.group.getObjectByName('Sea_3D_Wave_Surface');water.geometry.computeBoundingBox();assert.ok(water.geometry.boundingBox.max.z<-7.2);assert.ok(water.geometry.boundingBox.min.z<-150);
 sea.group.updateMatrixWorld(true);const coastHit=new THREE.Raycaster(new THREE.Vector3(-48,1,-20),new THREE.Vector3(0,0,-1),0,150).intersectObject(sea.group,true)[0];assert.equal(coastHit?.object.name,'Distant_Coast_3D','a low view cannot see sky through an open ridge');
 const time=water.material.uniforms.time;sea.update(1,false);assert.equal(time.value,1);sea.update(1,true);assert.equal(time.value,1);assert.equal(sea.group.children.length,2);
 const wool=createWoolTexture();assert.equal(wool.image.width,256);assert.equal(wool.image.height,256);const mat=new THREE.MeshStandardMaterial({name:'Wool_Boucle_Carpet'});configureWool(mat,wool);assert.equal(mat.map,wool);assert.equal(mat.bumpMap,wool);assert.equal(mat.roughness,1);
 sea.group.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});mat.dispose();wool.dispose();
});


test('The right-wall display retains all six landscape slots and lamps stay between them at the shared height',()=>{
 assert.equal(EXHIBITION_SLOTS.length,6);assert.equal(new Set(EXHIBITION_SLOTS.map(s=>s.y)).size,2);
 for(const [x,y,z]of decor.lamps.filter(([x,y,z])=>Math.abs(x-3.6)<.01&&y<space.upperFloor&&z<0)){
  assert.equal(y,3.17);
  for(const slot of EXHIBITION_SLOTS)assert.ok(Math.abs(z-slot.z)>slot.width/2+.071||Math.abs(y-slot.y)>slot.height/2+.168,'sconce cannot overlap an artwork');
 }
 assert.equal(decor.stairLamps.length,2);
});
