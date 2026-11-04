import test from 'node:test';
import assert from 'node:assert/strict';
import {nextWayfindingTarget,PROJECT_IDS} from '../src/state/session.js';
import {guideRoute,OUTDOOR,GALLERY,LIBRARY,ATELIER,clearSegment,space} from '../src/navigation/layout.js';
import {neonPulse,FLOOR_NEON_PERIOD,NEON_PERIOD} from '../src/neonPulse.js';

test('Only the earliest incomplete quest gets a route, including every out-of-order completion combination',()=>{
 for(let mask=0;mask<256;mask++){
  const ids=['profile',...PROJECT_IDS,'contact'],viewed=new Set(ids.filter((_,i)=>mask&(1<<i)));
  const target=nextWayfindingTarget(viewed);
  assert.equal(target,!viewed.has('profile')?'gallery':PROJECT_IDS.some(id=>!viewed.has(id))?'atelier':!viewed.has('contact')?'library':null);
 }
 assert.equal(nextWayfindingTarget(new Set([...PROJECT_IDS,'contact'])),'gallery');
 assert.equal(nextWayfindingTarget(new Set(['profile',...PROJECT_IDS])),'library');
 assert.equal(nextWayfindingTarget(new Set(['profile',...PROJECT_IDS,'contact'])),null);
});

test('Profile shortcuts from the entrance, right bank and upper room only cross the pool beside the stairs',()=>{
 for(const start of [OUTDOOR,{x:.9,z:6.5},LIBRARY]){
  const path=guideRoute(start,GALLERY);assert.ok(path.length);let previous=start;
  for(const point of path){
   assert.ok(clearSegment(previous,point));
   const steps=Math.ceil(Math.hypot(point.x-previous.x,point.z-previous.z)/.05);
   for(let i=0;i<=steps;i++){
    const t=steps?i/steps:0,x=previous.x+(point.x-previous.x)*t,z=previous.z+(point.z-previous.z)*t,y=(previous.y??0)+((point.y??0)-(previous.y??0))*t;
    if(y<.01&&z>space.pool[2]&&z<space.pool[3])assert.ok(x>space.pool[1],`must stay on the stair-side bank: ${x},${z}`);
   }
   previous=point;
  }
  assert.deepEqual(path.at(-1),{...GALLERY,y:GALLERY.y});
 }
 const unchanged=guideRoute(OUTDOOR,ATELIER);assert.ok(unchanged.length);
});

test('A visitor already on the west bank exits safely before taking the right passage to profile',()=>{
 const start={x:-4.6,z:8.4},path=guideRoute(start,GALLERY);let previous=start;
 assert.ok(path.some(point=>point.z>space.pool[3]));assert.ok(path.some(point=>point.x>space.pool[1]&&point.z<space.pool[2]));
 for(const point of path){assert.ok(clearSegment(previous,point));previous=point;}
});

test('Slow object and slower floor fades restart immediately at zero, with no dark hold',()=>{
 assert.ok(NEON_PERIOD>=3);assert.ok(FLOOR_NEON_PERIOD>NEON_PERIOD);
 for(const period of [NEON_PERIOD,FLOOR_NEON_PERIOD]){
  assert.equal(neonPulse(0,false,period),0);assert.equal(neonPulse(period,false,period),0);
  assert.equal(neonPulse(period/2,false,period),1);assert.ok(neonPulse(period+.001,false,period)>0);
 }
});
