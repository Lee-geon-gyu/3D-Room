import test from 'node:test';
import assert from 'node:assert/strict';
import {loadingStoryboard,loadingShotDuration,loadingSequenceDuration,loadingRevealDelay} from '../src/ui/loadingStoryboard.js';
import {statSync} from 'node:fs';

test('The supplied gallery entrance keeps one continuous approach and never delays a slow ready event',()=>{
 assert.equal(loadingStoryboard.length,1);
 assert.deepEqual(loadingStoryboard.map(s=>[s.asset,s.portrait]),[['gallery-exterior-v3.png','gallery-exterior-v3.png']]);
 assert.equal(loadingSequenceDuration,loadingShotDuration);assert.equal(loadingSequenceDuration,8000);
 assert.equal(loadingRevealDelay(2500),5500);
 assert.equal(loadingRevealDelay(20000),0,'loading that takes longer than the film reveals immediately when ready');
 assert.equal(loadingRevealDelay(10,true),0,'reduced motion does not impose a cinematic wait');
 for(const file of [loadingStoryboard[0].asset,loadingStoryboard[0].portrait]){const size=statSync(new URL('../public/assets/loading/'+file,import.meta.url)).size;assert.ok(size>100000&&size<4000000,'full-size lossless entrance sources stay within a bounded transfer size');}
});
