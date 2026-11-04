import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {prepareRoomArchitecture,createRoomDetails,coveLayouts} from '../src/scene/RoomRefinements.js';
import {prepareEntryArchitecture,entryDoor,createEntryDoor} from '../src/scene/EntryDoor.js';
import {studioDepth} from '../src/navigation/studioLayout.js';
import {OUTDOOR,GALLERY,canStand,inPool,space,inPolygon,guideRoute} from '../src/navigation/layout.js';
import {coveHeightAt,coveDepth} from '../src/navigation/coveLayout.js';

function box(name,w,h,d,x,y,z){
 const geometry=new THREE.BoxGeometry(w,h,d).translate(x,y,z);geometry.setAttribute('uv1',geometry.attributes.uv.clone());
 return new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({name}));
}
const bounds=mesh=>{mesh.geometry.computeBoundingBox();return mesh.geometry.boundingBox.clone();};
test('The new starting pose is centred on the door, dry and connected to the right-side profile route',()=>{
 assert.equal(OUTDOOR.x,entryDoor.x);assert.ok(OUTDOOR.z<entryDoor.wallZ);assert.equal(canStand(OUTDOOR.x,OUTDOOR.z),true);
 assert.equal(inPool(OUTDOOR.x,OUTDOOR.z),false);assert.equal(canStand(GALLERY.x,GALLERY.z),true);
 const route=guideRoute(OUTDOOR,GALLERY);assert.ok(route.length>2);assert.ok(route.some(p=>p.z>9.7&&p.x>0));
 assert.ok(Math.hypot(route.at(-1).x-GALLERY.x,route.at(-1).z-GALLERY.z)<.001);
});
test('Native translated furniture is not moved or stretched again at runtime',()=>{
 const root=new THREE.Group(),desk=box('Furniture_Ivory_Porcelain',2.5,.09,.75,-4,.86,-2-studioDepth),upper=box('Warm_Oak',2.5,2.8,.06,-4,space.upperFloor+1.4,-3.32);
 root.add(desk,upper);const original=bounds(desk),uv=Array.from(desk.geometry.attributes.uv1.array),up=upper.geometry;
 prepareRoomArchitecture(root);assert.deepEqual(bounds(desk),original);assert.deepEqual(Array.from(desk.geometry.attributes.uv1.array),uv);assert.equal(upper.geometry,up);
});
test('Only the old ceiling fittings disappear; the physical grate becomes silver and wall sconces stay intact',()=>{
 const root=new THREE.Group(),strip=box('Ground_Ceiling_Opal',3.8,.01,.035,0,3.51,-1.7),housing=box('Bronze',3.84,.024,.06,0,3.524,-1.7),sconce=box('Bronze',.14,.33,.14,1.94,2.45,.205),drain=box('Furniture_Graphite_Steel',.278,.012,.278,-2.3,-2.541,6.875);
 root.add(strip,housing,sconce,drain);const kept=sconce.geometry;const result=prepareRoomArchitecture(root);
 assert.equal(result.removedLightTriangles,24);assert.equal(strip.geometry.index.count,0);assert.equal(housing.geometry.index.count,0);assert.equal(sconce.geometry,kept);
 assert.equal(result.silverTriangles,12);const silver=root.getObjectByName('Pool_Stainless_Drain');assert.ok(silver.material.metalness>.7);assert.equal(silver.material.color.getHex(),0xd5d9df);assert.equal(drain.geometry.index.count,0);
});
test('The entrance has an actual opening through both wall faces and a recessed leaf with deep stone reveals',()=>{
 const root=new THREE.Group(),wall=box('Ivory_Mineral_Plaster',10.8,6.75,.22,0,3.375,12.4);root.add(wall);prepareEntryArchitecture(root);root.updateMatrixWorld(true);
 const ray=new THREE.Raycaster(new THREE.Vector3(0,2,11),new THREE.Vector3(0,0,1),0,3);
 assert.equal(ray.intersectObject(root,true).length,0,'the wall must not cover the recessed leaf');
 ray.ray.origin.x=2;assert.ok(ray.intersectObject(root,true).length>0,'the wall next to the opening stays present');
 ray.ray.origin.x=entryDoor.width/2+.215;assert.ok(ray.intersectObject(root,true).length>0,'no open sliver remains between the jamb and the wall');
 for(const mesh of root.children)for(const attribute of Object.values(mesh.geometry.attributes))assert.ok([...attribute.array].every(Number.isFinite));
 const door=createEntryDoor(root);root.add(door);root.updateMatrixWorld(true);ray.ray.origin.x=.5;const hit=ray.intersectObject(door,true)[0];assert.ok(hit.point.z>12.49,'the leaf sits inside the original 12.29m wall face');
 assert.ok(Math.abs(entryDoor.clearHalf-(entryDoor.width/2+.21))<.011,'planters meet the jambs within one centimetre');
});
test('Cove geometry stays inside the supported library roof and adds no real lights or animation work',()=>{
 const library=coveLayouts.find(p=>p.name==='Library');for(const x of [library.left,library.right])for(const z of [library.back,library.front])assert.ok(x>=space.upperRoof.left&&x<=space.upperRoof.right&&z>=space.upperRoof.back&&z<=space.upperRoof.front);
 const detail=createRoomDetails(new THREE.Group());let lights=0;
 detail.traverse(mesh=>{if(mesh.isLight)lights++;if(mesh.geometry){for(const value of mesh.geometry.attributes.position.array)assert.ok(Number.isFinite(value));}});
 assert.equal(lights,0);assert.equal(detail.getObjectByName('Studio_Paper_Lantern'),undefined,'the removed pendant leaves the ceiling clear');
 assert.equal(detail.getObjectByName('Studio_Closed_Right_Wall_End'),undefined,'no divider or obsolete endcap remains in the joined room');
 let draws=0;detail.traverse(mesh=>{if(mesh.isMesh)draws++;});assert.ok(draws<=14,'static ceiling surfaces share material batches');
});
test('Cove headroom matches the real frame and recess on both overlapping stories',()=>{
 const detail=createRoomDetails(new THREE.Group());detail.updateMatrixWorld(true);
 for(const [x,z,from,minimum]of [[0,-1,space.groundCeiling-.5,0],[2.2,-1,space.groundCeiling-.5,0],[0,-1,space.upperCeiling-.5,space.upperFloor]]){
  const ray=new THREE.Raycaster(new THREE.Vector3(x,from,z),new THREE.Vector3(0,1,0),0,4),hit=ray.intersectObject(detail,true)[0];
  assert.ok(hit);assert.ok(Math.abs(hit.point.y-coveHeightAt(x,z,minimum))<1e-6);
 }
 assert.ok(coveDepth<.08);
});


test('Both visible cove recesses share the same white finish and upper trim reaches its frame',()=>{
 const detail=createRoomDetails(new THREE.Group());detail.updateMatrixWorld(true);
 const hits=coveLayouts.map(c=>new THREE.Raycaster(new THREE.Vector3(0,c.y-.2,0),new THREE.Vector3(0,1,0),0,.5).intersectObject(detail,true)[0]);
 for(const hit of hits){assert.ok(hit);assert.equal(hit.object.material.color.getHex(),0xffffff);assert.equal(hit.object.material.emissive.getHex(),0xffffff);}
 assert.equal(hits[0].object.material,hits[1].object.material,'one shared surface material cannot drift between floors');
 const upper=space.referenceFacade.upper;
 assert.ok(coveLayouts[1].front>2.5);
 assert.ok(coveLayouts[1].front<upper.frontZ-upper.depth);
 assert.ok(space.upperRoof.right<upper.right&&space.upperRoof.right>upper.right-upper.width,'roof terminates above the right return');
 assert.ok(space.upperRoof.left>space.westFacade.wallCenterX+space.westFacade.wallThickness/2,'roof stays clear of the outer west wall');
 assert.equal(space.upperRoof.front,upper.frontZ-.085,'front edge aligns with the recessed arch light');
});
