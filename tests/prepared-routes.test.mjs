import test from 'node:test';
import assert from 'node:assert/strict';
import {routeBetween,prepareNavigationRoutes,clearSegment,OUTDOOR,GALLERY,ATELIER,LIBRARY} from '../src/navigation/layout.js';

test('All twelve prepared shortcut routes retain the real floor/stair clearance and yield between searches',async()=>{
 let yields=0;assert.equal(await prepareNavigationRoutes(async()=>{yields++;}),12);assert.equal(yields,12);
 for(const from of [OUTDOOR,GALLERY,ATELIER,LIBRARY])for(const to of [OUTDOOR,GALLERY,ATELIER,LIBRARY])if(from!==to){
  const path=routeBetween(from,to);assert.ok(path.length);let previous=from;
  for(const point of path){assert.ok(clearSegment(previous,point));previous=point;}
  assert.deepEqual(path.at(-1),{...to,y:to.y??0});
 }
});
test('Route consumers cannot corrupt a cached route, and camera direction still comes from the current destination',()=>{
 const path=routeBetween(OUTDOOR,GALLERY),expected=path.map(point=>({...point}));path[0].x=99;path.pop();
 assert.deepEqual(routeBetween(OUTDOOR,GALLERY),expected);
 const destination={...GALLERY,yaw:1.234,pitch:-.123},again=routeBetween({...OUTDOOR,x:OUTDOOR.x+1e-12},destination);
 assert.ok(clearSegment({...OUTDOOR,x:OUTDOOR.x+1e-12},again[0]));assert.equal(again.at(-1).yaw,1.234);assert.equal(again.at(-1).pitch,-.123);
 const moved={...OUTDOOR,x:OUTDOOR.x+.04},fresh=routeBetween(moved,GALLERY);assert.ok(fresh.length);assert.ok(clearSegment(moved,fresh[0]));
});
