import test from 'node:test';
import assert from 'node:assert/strict';
import {createAfternoonLight,AFTERNOON_HOUR} from '../src/scene/afternoonLight.js';
import {endingWriting} from '../src/ui/endingSequence.js';
import {cloudOffset,landscapeLayers} from '../src/ui/loadingLandscapeModel.js';

test('The soft overcast lighting remains fixed and independent across scene restarts',()=>{
 const light=createAfternoonLight();assert.equal(light.hour,17);assert.equal(AFTERNOON_HOUR,17);
 assert.ok(light.sunY>10&&light.sun>.25&&light.sun<.5);assert.ok(light.bake>.8&&light.environment>.20);
 for(const value of Object.values(light).flat())assert.ok(Number.isFinite(value));
 const again=createAfternoonLight();assert.deepEqual(again,light);
 light.horizon[0]=0;light.sun=0;assert.deepEqual(createAfternoonLight(),again,'a prior scene cannot darken the next afternoon');
});
test('Farewell pen durations and English entrance delay are precisely three times faster',()=>{
 assert.equal(endingWriting.korean*3,4);assert.equal(endingWriting.english*3,3);
 assert.ok(Math.abs(endingWriting.englishDelay*3-.9)<1e-9);
});
test('Cloud sea advances visibly rightward at five times the former speed with seamless mirrored repeats',()=>{
 for(const layer of landscapeLayers.slice(1).filter(layer=>!layer.distant)){
  assert.ok(layer.drift>=.006&&layer.opacity>=.14);
  for(const t of [0,1,10,20])assert.ok(cloudOffset(t+1,layer.drift)>cloudOffset(t,layer.drift));
  assert.ok(cloudOffset(10,layer.drift)>=.06,'at least six percent of the image width flows past in ten seconds');
  for(const t of [300,3000,36000])assert.ok(cloudOffset(t,layer.drift)>=0&&cloudOffset(t,layer.drift)<2);
  const repeat=2/layer.drift;assert.ok(Math.abs(cloudOffset(repeat+.5,layer.drift)-cloudOffset(.5,layer.drift))<1e-9);
 }
});

test('Distant mist flows continuously, more slowly than the foreground for depth',()=>{
 const distant=landscapeLayers.filter(layer=>layer.distant);
 assert.equal(distant.length,2);
 for(const layer of distant){assert.ok(layer.drift>0&&layer.drift<.006);assert.ok(cloudOffset(20,layer.drift)>cloudOffset(10,layer.drift));}
});
