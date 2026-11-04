import test from 'node:test';
import assert from 'node:assert/strict';
import {landscapeLayers,landscapePlane,cloudOffset,landscapeResolution} from '../src/ui/loadingLandscapeModel.js';
import {readFileSync,statSync} from 'node:fs';

test('Cloud banks retain enough overscan for camera motion and bounded wind throughout long loads',()=>{
 assert.equal(landscapeLayers[0].opacity,1);
 assert.ok(new Set(landscapeLayers.map(layer=>layer.z)).size===landscapeLayers.length);
 for(const aspect of [390/844,1280/800,1672/940,1920/943,844/390])for(const layer of landscapeLayers){
  const depth=12-layer.z,fit=landscapePlane(aspect,depth),visibleHeight=2*Math.tan(42*Math.PI/360)*depth;
  assert.ok((fit.height-visibleHeight)/2>.305);assert.ok((fit.width-visibleHeight*aspect)/2>.71,'full pointer sway and idle drift never uncover a bank edge');
  for(const time of [0,2,30,300,36000])assert.ok(cloudOffset(time,layer.drift)>=0&&cloudOffset(time,layer.drift)<2);
 }
 assert.ok(statSync(new URL('../public/assets/loading/cloud-journey.webp',import.meta.url)).size<200000);
 assert.ok(statSync(new URL('../public/assets/loading/cloud-journey-clean.webp',import.meta.url)).size<200000);
 assert.ok(statSync(new URL('../public/assets/loading/cloud-journey-left.webp',import.meta.url)).size<200000);
});
test('Textured 3D loader keeps its render resolution bounded at desktop and phone sizes',()=>{
 for(const [w,h] of [[1280,800],[390,844],[3840,2160],[844,390]]){
  const fit=landscapeResolution(w,h);assert.ok(fit.width>0&&fit.height>0);assert.ok(Math.max(fit.width,fit.height)<=1440);
 }
 assert.ok(Math.max(...Object.values(landscapeResolution(390,844)))<=960);
});
test('Both outlined paragraphs reproduce the original Korean and English with all visible glyphs',()=>{
 const data=JSON.parse(readFileSync(new URL('../src/ui/farewellLettering.json',import.meta.url)));
 const {contact}=JSON.parse(readFileSync(new URL('../public/portfolio-content.json',import.meta.url)));
 assert.equal(data.paragraphs.length,2);
 data.paragraphs.forEach((lines,i)=>{
  assert.deepEqual(lines.map(line=>line.text),[contact.statement[i],contact.statementEnglish[i]]);
  for(const line of lines){
   assert.ok(line.width>1);assert.equal(line.letters.length,[...line.text].length);for(const letter of line.letters)assert.ok(Number.isFinite(letter.x));
   assert.ok(line.inkStrokes.length>line.letters.length);
   let finish=0;for(const stroke of line.inkStrokes){assert.ok(!/NaN|Infinity/.test(stroke.d));assert.ok(stroke.at>=finish-.000002);assert.ok(stroke.duration>0);finish=stroke.at+stroke.duration;}
   assert.ok(Math.abs(finish-1)<.000002,'pen strokes share one continuous normalized timeline, with no character pauses');
  }
 });
 for(const d of Object.values(data.glyphs)){assert.ok(!/NaN|Infinity/.test(d));}
});
