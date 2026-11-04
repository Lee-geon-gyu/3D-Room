import test from 'node:test';
import assert from 'node:assert/strict';
import {MeshPhysicalMaterial,FrontSide,BufferGeometry,Float32BufferAttribute} from 'three';
import {repositionIvy} from '../src/scene/repositionIvy.js';
import {space,facadeLeg,canStand,moveInAir,clearSegment,flightPoint} from '../src/navigation/layout.js';
import {configureThinGlass} from '../src/scene/thinGlass.js';
import {floweringPaths} from '../src/scene/FloweringCornices.js';

test('The separate upper frame reaches the ground and has real walking and airborne clearance behind it',()=>{
 const {lower,upper,stairShiftX}=space.referenceFacade;
 assert.equal(upper.rightBase,0);assert.equal(upper.leftBase,0);
 assert.equal(upper.right,lower.right);assert.ok(upper.frontZ>lower.frontZ);assert.equal(stairShiftX,1.5);
 const x=(facadeLeg[0]+facadeLeg[1])/2,z=(facadeLeg[2]+facadeLeg[3])/2;
 assert.equal(canStand(x,z),false);assert.equal(moveInAir({x:x-.6,z,y:0},x,z,1),null);
 for(const f of space.stairs.flights)for(let t=.05;t<.98;t+=.05){
  const p=flightPoint(f,t,-f.width/2+.36);assert.ok(canStand(p.x,p.z,undefined,p.y),JSON.stringify(p));
 }
 for(let i=1;i<space.stairRoute.length;i++)assert.ok(clearSegment(space.stairRoute[i-1],space.stairRoute[i]));
 const paths=floweringPaths();assert.equal(paths[0].a[2],lower.frontZ+.025);assert.equal(paths[1].a[2],upper.frontZ+.025);
});

test('Thin glass keeps reflective edges and all native geometry without a scene transmission prepass',()=>{
 const m=configureThinGlass(new MeshPhysicalMaterial({transmission:1,thickness:.016}));
 assert.equal(m.transmission,0);assert.equal(m.transparent,true);assert.equal(m.side,FrontSide);assert.equal(m.forceSinglePass,true);
 assert.equal(m.depthWrite,false);assert.equal(m.lightMap,null);assert.ok(m.envMapIntensity>=1);assert.ok(m.opacity>0&&m.opacity<.2);
 const shader={fragmentShader:'#include <opaque_fragment>'};m.onBeforeCompile(shader);
 assert.ok(shader.fragmentShader.includes('glassFacing'));assert.ok(!shader.fragmentShader.includes('texture2D(lightMap'));
 m.dispose();
});

test('A leaf crossing the old wall boundary moves as one connected shape without changing UVs or edge lengths',()=>{
 const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute([2.25,1,0,2.5,1,0,2.5,2,0,2.25,2,0,1,1,0,1.2,1,0,1,2,0],3));g.setIndex([0,1,2,0,2,3,4,5,6]);
 const original=Array.from(g.attributes.position.array);repositionIvy(g,1.5);
 for(let i=0;i<7;i++){
  assert.ok(Math.abs(g.attributes.position.getX(i)-original[i*3]-(i<4?1.5:0))<1e-6);
  assert.equal(g.attributes.position.getY(i),original[i*3+1]);assert.equal(g.attributes.position.getZ(i),original[i*3+2]);
 }
 g.dispose();
});
