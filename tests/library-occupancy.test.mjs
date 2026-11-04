import test from 'node:test';
import assert from 'node:assert/strict';
import {space,LIBRARY,facadeFront,stairPoint} from '../src/navigation/layout.js';
import {sofa} from '../src/navigation/sofa.js';
import {inLibraryInterior,libraryEntryX,libraryRailInset,libraryLightPlan} from '../src/scene/libraryOccupancy.js';

test('Library lights switch at the actual wall/post doorway, before reaching any furniture',()=>{
  for(const z of [.4,.7,1]){
    const entry=libraryEntryX(z);
    assert.equal(inLibraryInterior({x:entry+.01,z,y:space.upperFloor}),false);
    assert.equal(inLibraryInterior({x:entry-.01,z,y:space.upperFloor}),true);
  }
  assert.equal(inLibraryInterior(LIBRARY),true);
  assert.equal(inLibraryInterior({x:space.interior.wallCenter+.2,z:.45,y:space.upperFloor}),false);
});

test('Balcony edge, rail and stairs are outside; jumping or sitting in the room stays lit',()=>{
  const x=-1,z=facadeFront(x)-libraryRailInset;
  assert.equal(inLibraryInterior({x,z:z-.01,y:space.upperFloor}),true);
  assert.equal(inLibraryInterior({x,z:z+.05,y:space.upperFloor}),false);
  assert.equal(inLibraryInterior(LIBRARY,true),false);
  assert.equal(inLibraryInterior({...LIBRARY,y:0}),false);
  for(const t of [.25,.75,1])assert.equal(inLibraryInterior(stairPoint(t)),false);
  assert.equal(inLibraryInterior({x:sofa.seatX,z:sofa.seatRangeZ[0],y:sofa.seatTop}),true);
  assert.equal(inLibraryInterior({...LIBRARY,y:space.upperFloor+.8}),true);
});

test('A small doorway hysteresis prevents flicker while leaving promptly',()=>{
  const z=.7,x=libraryEntryX(z),y=space.upperFloor;
  assert.equal(inLibraryInterior({x:x+.02,z,y},false,true),true);
  assert.equal(inLibraryInterior({x:x+.02,z,y},false,false),false);
  assert.equal(inLibraryInterior({x:x+.05,z,y},false,true),false);
});

const light=(name,userData={},intensity=1)=>({name,userData,intensity});
test('Every interior position uses the same four sconces and two area lights at both quality levels',()=>{
  const room=Array.from({length:4},(_,i)=>light(`sconce${i}`,{librarySlot:i})),outside=Array.from({length:5},(_,i)=>light(`outside${i}`));
  const ceiling=light('ceiling',{libraryRole:'ceiling'}),fill=light('fill',{libraryRole:'fill'}),courtyard=light('courtyard');
  for(const quality of [1,.7])for(const reverse of [false,true]){
    const points=[outside[0],room[2],outside[1],room[0],room[3],room[1],...outside.slice(2)];
    const areas=reverse?[fill,courtyard,ceiling]:[courtyard,ceiling,fill];
    const plan=libraryLightPlan(true,quality,reverse?points.reverse():points,areas);
    assert.deepEqual(plan.points.map(p=>p.light),room);
    assert.deepEqual(plan.areas.map(p=>p.light),[ceiling,fill]);
    assert.ok(plan.areas.every(p=>p.intensity>0),'performance quality must not turn a room light off');
    assert.equal(plan.points.length,4);assert.equal(plan.areas.length,2);
  }
  const off=libraryLightPlan(false,1,[...room,...outside],[fill,ceiling,courtyard]);
  assert.deepEqual(off.points.map(p=>p.light),outside.slice(0,4));
  assert.deepEqual(off.areas.map(p=>p.light),[ceiling,courtyard]);
});
