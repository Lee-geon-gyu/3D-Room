import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {complete,newlyCompletedQuests} from '../src/state/session.js';
import {allQuestsComplete,endingStage,endingTimings,reducedEndingTimings,endingAllowsMovement} from '../src/ui/endingSequence.js';
import {createFloweringCornices,floweringPaths,retireCorniceIvy} from '../src/scene/FloweringCornices.js';
import {onHouseRoof} from '../src/scene/facadeFinish.js';
import {readFileSync} from 'node:fs';
import {deskFaces} from '../src/scene/DeskObjects.js';
import {facadeFront,space} from '../src/navigation/layout.js';

test('Ending requires profile, contact and every actual project; restart permits a fresh completion',()=>{
 const projects=[{id:'one'},{id:'two'},{id:'three'}];let viewed=new Set();
 for(const id of ['profile','contact','one','two']){viewed=complete(viewed,id,projects);assert.equal(allQuestsComplete(viewed,projects),false);}
 const final=complete(viewed,'three',projects);assert.equal(allQuestsComplete(final,projects),true);
 assert.deepEqual(newlyCompletedQuests(viewed,final,projects),['portfolio']);
 assert.deepEqual(newlyCompletedQuests(final,complete(final,'three',projects),projects),[]);
 assert.equal(allQuestsComplete(final,[...projects,{id:'four'}]),false);
 assert.equal(allQuestsComplete(new Set(['profile','contact']),[]),false);
 viewed=new Set();assert.equal(allQuestsComplete(viewed,projects),false);
 for(const id of ['profile','contact','one','two','three'])viewed=complete(viewed,id,projects);
 assert.equal(allQuestsComplete(viewed,projects),true);
});
test('Clear permits movement until the first paragraph; paragraphs leave separately before restart, also with reduced motion',()=>{
 for(const reduced of [false,true]){
  const t=reduced?reducedEndingTimings:endingTimings;
  assert.equal(endingStage(0,reduced),'clear');assert.equal(endingStage(t.depart,reduced),'depart');
  assert.equal(endingStage(t.first,reduced),'first');assert.equal(endingStage(t.firstOut,reduced),'firstOut');
  assert.equal(endingStage(t.gap,reduced),'gap');assert.equal(endingStage(t.second,reduced),'second');
  assert.equal(endingStage(t.complete-1,reduced),'secondOut');assert.equal(endingStage(t.complete,reduced),'complete');
  assert.equal(endingAllowsMovement(endingStage(t.first-1,reduced)),true);
  for(const time of [t.first,t.firstOut,t.gap,t.second,t.secondOut,t.complete])assert.equal(endingAllowsMovement(endingStage(time,reduced)),false);
 }
});
test('Copings at the SAME roof height stay black outside the house footprint',()=>{
 assert.equal(onHouseRoof(-2,space.upperCeiling+.15,1),true);
 for(const [x,z] of [[5.31,2],[0,15.4],[-5.5,5],[4,-3.55]])assert.equal(onHouseRoof(x,space.upperCeiling+.15,z),false);
});
test('The physical note keeps contact details and legal copy while its farewell lives in the ending data',()=>{
 const content=JSON.parse(readFileSync(new URL('../public/portfolio-content.json',import.meta.url)));
 const face=readFileSync(new URL(`../public/${deskFaces.contact}`,import.meta.url),'utf8');
 for(const text of [...content.contact.statement,...content.contact.statementEnglish])assert.ok(!face.includes(text));
 for(const text of ['CONTACT',content.contact.phone,content.contact.email,'GitHub','Velog','All Rights Reserved.'])assert.ok(face.includes(text));
 assert.equal(content.contact.statement.length,2);assert.equal(content.contact.statementEnglish.length,2);
});
test('Both planted rims retain layered species, finite bounds and a bounded static draw budget',()=>{
 const garden=createFloweringCornices(),again=createFloweringCornices();
 assert.deepEqual(garden.userData.botanicalCounts,again.userData.botanicalCounts);
 assert.ok(garden.userData.botanicalCounts.leaves>7000);assert.ok(garden.userData.botanicalCounts.flowers>20);
 for(const kind of ['upright','shrubs','ferns','vines'])assert.ok(garden.userData.botanicalCounts[kind]>=5);
 assert.ok(garden.children.length<=9);assert.equal(garden.children.filter(mesh=>mesh.isInstancedMesh).length,6);
 assert.deepEqual(floweringPaths().map(p=>p.name),['Lower','Upper','Upper_Return']);
 for(const mesh of garden.children){mesh.geometry.computeBoundingBox();mesh.geometry.computeBoundingSphere();const box=mesh.isInstancedMesh?mesh.boundingBox:mesh.geometry.boundingBox,sphere=mesh.isInstancedMesh?mesh.boundingSphere:mesh.geometry.boundingSphere;assert.ok(Number.isFinite(sphere.radius));assert.ok(box.min.y>2.3);assert.ok(box.max.y<space.upperCeiling+1.55);}
 for(const root of [garden,again])root.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
});

test('Replacing the balcony growth preserves exterior ivy and only retires the old cornice',()=>{
 const root=new THREE.Group(),geometry=new THREE.BufferGeometry();
 geometry.setAttribute('position',new THREE.Float32BufferAttribute([
  -2,3.4,facadeFront(-2),-1.9,3.4,facadeFront(-1.9),-2,3.5,facadeFront(-2),
  4,3.4,8,4.1,3.4,8,4,3.5,8,
 ],3));geometry.setIndex([0,1,2,3,4,5]);
 const ivy=new THREE.Mesh(geometry,new THREE.MeshBasicMaterial()),roof=new THREE.Mesh(new THREE.PlaneGeometry(),new THREE.MeshBasicMaterial());roof.name="Rooted_Ivy_Leaves('roof-cornice', 0, 0)";root.add(ivy,roof);
 assert.equal(retireCorniceIvy(root),1);assert.deepEqual(Array.from(geometry.index.array),[3,4,5]);assert.equal(roof.visible,false);assert.equal(ivy.visible,true);
 assert.equal(retireCorniceIvy(root),0);
 root.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
});

test('Both physical cornice light cores share the preferred upper-story inset, without moving that upper line',()=>{
 const garden=createFloweringCornices(),core=garden.getObjectByName('Cornice_Concealed_Warm_LED'),positions=core.geometry.getAttribute('position'),lower=[],upper=[];
 for(let i=0;i<positions.count;i++){const y=positions.getY(i);(y<space.upperFloor+1?lower:upper).push(y);}
 const center=values=>(Math.min(...values)+Math.max(...values))/2,low=center(lower),high=center(upper);
 assert.ok(Math.abs(high-(space.upperCeiling+.006))<1e-5,'upper-story placement remains unchanged');
 assert.ok(Math.abs((space.upperFloor-low)-(space.upperCeiling+space.upperRoofThickness-high))<1e-5,'both light lines sit the same distance below the timber top');
 assert.ok(low>space.upperFloor-.35,'the lower light has moved up from the timber bottom');
 for(const mesh of garden.children){mesh.geometry?.dispose();mesh.material?.dispose();}
});

test('Photographed upright foliage excludes the source pot and preserves its shared texture and geometry',()=>{
 const source=new THREE.Group(),texture=new THREE.Texture(),geometry=new THREE.PlaneGeometry(.7,1),material=new THREE.MeshStandardMaterial({name:'plant_leaves',map:texture});
 const leaves=new THREE.Mesh(geometry,material),pot=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial({name:'pot'}));source.add(leaves,pot);
 const before=Array.from(geometry.getAttribute('position').array),garden=createFloweringCornices({foliage:source}),native=garden.getObjectByName('Cornice_Photographed_Uprights');
 assert.ok(native.count>=15);assert.equal(native.material.map,texture);assert.equal(native.material.alphaTest,.42);assert.ok(garden.children.length<=10);
 assert.deepEqual(Array.from(geometry.getAttribute('position').array),before);assert.equal(pot.visible,true);assert.notEqual(native.geometry,geometry);
 for(const root of [source,garden])root.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});texture.dispose();
});

