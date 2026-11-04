import test from 'node:test';
import assert from 'node:assert/strict';
import {space} from '../src/navigation/layout.js';
import decor from '../src/scene/wall-decor.json' with {type:'json'};

test('Removing round lights preserves each room lighting budget in the bake and live scene',()=>{
  assert.equal(decor.ceilingFixtures,undefined);
  assert.equal(decor.roundCeiling,undefined);
  // Bake totals include the removed rounds. Studio's broad live source uses
  // 90% of its flux-equivalent total to retain the same measured wall brightness.
  const targets={
    Studio:[432.43,25.755808032,[432.43,371.0113,282.7211]],
    Atelier:[680.86,62.7134784,[680.86,592.21,463.3628]],
    Library:[558.44,45.195264,[558.44,477.5504,361.7488]]
  };
  const fixtures=[...decor.interiorStrips,...decor.interiorFill];
  for(const [room,[watts,energy,rgb]] of Object.entries(targets)){
    const local=fixtures.filter(f=>(f.position[1]>space.upperFloor?'Library':f.position[0]<-2.3?'Studio':'Atelier')===room);
    const baked=local.filter(f=>f.name!=='Veranda').reduce((sum,f)=>sum+f.power,0);
    const live=local.reduce((sum,f)=>sum+f.intensity*(f.height?.8:.68)*f.width*(f.height??.035),0);
    assert.ok(Math.abs(baked-watts)<1e-5,`${room} retains its diffuse bake power`);
    assert.ok(Math.abs(live-energy)<1e-5,`${room} retains its calibrated broad-light energy`);
    for(let channel=0;channel<3;channel++){
      const colorEnergy=local.filter(f=>f.name!=='Veranda').reduce((sum,f)=>sum+f.power*f.color[channel],0);
      assert.ok(Math.abs(colorEnergy-rgb[channel])<1e-5,`${room} retains its warm color balance`);
    }
  }
});
