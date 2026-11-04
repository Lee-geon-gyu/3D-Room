import test from 'node:test';
import assert from 'node:assert/strict';
import {createLinearWallGlow} from '../src/scene/LinearWallLights.js';
import {space,canStand,ceilingHeight,moveInAir} from '../src/navigation/layout.js';
import {coveLayouts} from '../src/navigation/coveLayout.js';
import {readFileSync} from 'node:fs';
const json=path=>JSON.parse(readFileSync(new URL(path,import.meta.url),'utf8'));

test('Both expanded rooms have the same usable right edge and closed straight walls',()=>{
 for(const [y,z]of [[.12,-1.35],[space.upperFloor,-1]]){
  assert.ok(canStand(space.interior.right-.32,z,.19,y));
  assert.equal(canStand(space.interior.right+.03,z,.19,y),false);
 }
 assert.ok(coveLayouts[1].right<space.upperRoof.right);assert.ok(coveLayouts[0].right>coveLayouts[1].right);
 for(const x of [-4.8,0,3.25]){
  assert.equal(ceilingHeight(x,-4,0),ceilingHeight(x,-5,0),'the studio soffit has no pitched or dropped seam');
 }
});

test('Stair planter ends at the new arrival wall and both outer returns reach paving',()=>{
 const garden=json('../src/scene/garden-layout.json');
 const last=garden.stairBedSections.at(-1);
 assert.ok(Math.abs(last.edge[0][1]-space.interior.front)<.03);
 for(const frame of Object.values(space.referenceFacade).filter(v=>typeof v==='object')){
  assert.equal(frame.leftBase,0);assert.equal(frame.rightBase,0);
 }
});

test('Door and planter illumination is a single finite static batch without new real lights',()=>{
 const root=createLinearWallGlow();let meshes=0,lights=0;
 root.traverse(o=>{if(o.isLight)lights++;if(o.isMesh){meshes++;assert.equal(o.material.depthWrite,false);for(const n of o.geometry.attributes.position.array)assert.ok(Number.isFinite(n));}});
 assert.equal(meshes,1);assert.equal(lights,0);
 const paths=json('../src/scene/exterior-lighting.json').runs;
 assert.equal(paths.filter(p=>p.name.startsWith('Door')).length,3);
 assert.ok(paths.some(p=>p.name.includes('West')));
});


test('Extended ground finish blocks walking and jumping while the upper entry stays clear',()=>{
 assert.equal(canStand(2.3,1.3,.19,.12),true);
 assert.equal(canStand(3.7,1.3,.19,0),false);
 assert.equal(moveInAir({x:3.35,z:1.3,y:0},3.7,1.3,1,1.53),null);
 assert.equal(canStand(3.2,1.3,.19,space.upperFloor),true);
});
