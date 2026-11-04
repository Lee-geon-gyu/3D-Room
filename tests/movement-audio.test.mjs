import test from 'node:test';
import assert from 'node:assert/strict';
import {MovementSoundTracker,synthesizeFoley,createMovementAudio,foleyGain} from '../src/audio/MovementAudio.js';
import {readFileSync} from 'node:fs';
import {waterSoundFiles} from '../src/audio/waterSoundBank.js';
import {saveSoundVolume} from '../src/audio/soundPreferences.js';
import {cueOpacity,applyCuePulse} from '../src/scene/cuePulse.js';
import * as THREE from 'three';

const standing={feetY:0,verticalVelocity:0,airborne:false,inPool:false,underwater:false,crouching:false,seated:false,sprinting:false};
test('Foley follows distance, with a faster running cadence and no idle, paused or teleport footsteps',()=>{
 const cadence=(speed,sprinting)=>{const tracker=new MovementSoundTracker(),events=[];tracker.step({x:0,z:0},standing,.02);for(let i=1;i<=100;i++)events.push(...tracker.step({x:i*speed*.02,z:0},{...standing,sprinting},.02));return events;};
 const walking=cadence(1.5,false),running=cadence(3.2,true);
 assert.ok(walking.length>=4&&walking.every(e=>e.kind==='walk'));assert.ok(running.length>walking.length&&running.every(e=>e.kind==='run'));
 assert.ok(walking.every((event,i)=>event.foot===i%2));
 const tracker=new MovementSoundTracker();tracker.step({x:0,z:0},standing,.02);
 assert.deepEqual(tracker.step({x:0,z:0},standing,1),[]);
 assert.deepEqual(tracker.step({x:1,z:0},standing,.02,false),[]);
 assert.deepEqual(tracker.step({x:20,z:0},standing,.02),[]);
 assert.deepEqual(tracker.step({x:20,z:0},standing,.02),[]);
});
test('Jump, landing, crouch, water entry, swimming and exit each follow their own physical transition',()=>{
 const tracker=new MovementSoundTracker(),p={x:0,z:0};tracker.step(p,standing,.02);
 assert.deepEqual(tracker.step(p,{...standing,crouching:true},.02).map(e=>e.kind),['crouch']);
 assert.deepEqual(tracker.step(p,{...standing,crouching:true},.02),[]);
 assert.deepEqual(tracker.step(p,{...standing,airborne:true,verticalVelocity:4},.02).map(e=>e.kind),['jump']);
 assert.deepEqual(tracker.step(p,{...standing,airborne:true,verticalVelocity:-3},.02),[]);
 assert.deepEqual(tracker.step(p,standing,.02).map(e=>e.kind),['land']);
 const water={...standing,inPool:true,feetY:-1};
 assert.deepEqual(tracker.step(p,water,.02).map(e=>e.kind),['enter']);
 assert.deepEqual(tracker.step(p,water,.02),[]);
 assert.deepEqual(tracker.step({x:.8,z:0},water,.1).map(e=>e.kind),['swim']);
 assert.deepEqual(tracker.step({x:.8,z:0},standing,.02).map(e=>e.kind),['exit']);
 tracker.reset();assert.deepEqual(tracker.step({x:10,z:0},standing,.02),[]);
});
test('Original foley buffers have finite unclipped samples, silent edges and distinct timbres',()=>{
 const prints=new Set();
 for(const kind of ['walk','run','land','jump','crouch','swim','enter','exit']){
  const pcm=synthesizeFoley(kind,22050,42);let peak=0,energy=0;
  for(const sample of pcm){assert.ok(Number.isFinite(sample));peak=Math.max(peak,Math.abs(sample));energy+=sample*sample;}
  assert.equal(Math.abs(pcm[0]),0);assert.ok(Math.abs(pcm.at(-1))<.002,kind);assert.ok(peak>.05&&peak<.99,kind);assert.ok(Math.sqrt(energy/pcm.length)>.006,kind);
  prints.add(pcm.slice(0,200).join(','));
 }
 assert.equal(prints.size,8);
});
test('Unseen-object blue cues immediately repeat slow 3.2-second fades, including every glow layer',()=>{
 assert.equal(cueOpacity(0),0);assert.equal(cueOpacity(3.2),0);assert.equal(cueOpacity(1.6),1);
 assert.ok(cueOpacity(.1)>0);assert.ok(cueOpacity(3.2001)>0);assert.equal(cueOpacity(1,true),cueOpacity(3,true));
 const group=new THREE.Group(),material=new THREE.MeshBasicMaterial({transparent:true,opacity:.2});group.add(new THREE.Mesh(new THREE.PlaneGeometry(),material));const cue={group,material};
 applyCuePulse(cue,.5,true);assert.equal(material.opacity,.1);applyCuePulse(cue,1,true);assert.equal(material.opacity,.2);
 applyCuePulse(cue,0,true);assert.equal(group.visible,false);applyCuePulse(cue,1,false);assert.equal(group.visible,false);
});

test('Effects start and resume at exactly half the former mix, and pause remains silent',()=>{
 const previous={window:global.window,document:global.document,fetch:global.fetch},targets=[],gains=[];
 global.window=new EventTarget();global.document=Object.assign(new EventTarget(),{hidden:false});
 global.fetch=async()=>({ok:false});
 window.AudioContext=class{
  state='running';currentTime=0;destination={};
  createGain(){const node={gain:{value:0,setTargetAtTime:value=>{if(node===gains[0])targets.push(value);}},connect(){}};gains.push(node);return node;}
  createBiquadFilter(){return {frequency:{},gain:{},connect(){}};}
  close(){this.state='closed';return Promise.resolve();}
 };
 const abort=new AbortController();
 try{
  const audio=createMovementAudio(abort.signal);window.dispatchEvent(new Event('pointerdown'));
  assert.equal(gains[0].gain.value,.42/2);
  audio.update({x:0,z:0},standing,.02,false);audio.update({x:0,z:0},standing,.02,true);
  for(let i=0;i<600;i++)audio.update({x:0,z:0},standing,1/60,true);
  assert.deepEqual(targets,[0,.42/2],'steady activity never queues duplicate automation');
  for(let i=0;i<600;i++)audio.update({x:0,z:0},standing,1/60,false);
  assert.deepEqual(targets,[0,.42/2,0]);
  audio.update({x:0,z:0},standing,.02,true);assert.deepEqual(targets,[0,.42/2,0,.42/2]);abort.abort();
 }finally{abort.abort();Object.assign(global,previous);}
});

test('The action slider controls the shared footsteps/jump/crouch bus while water keeps its own heavier route',()=>{
 const previous={window:global.window,document:global.document,fetch:global.fetch,localStorage:global.localStorage};
 const gains=[],sources=[],filters=[],stored=new Map();
 global.window=new EventTarget();global.document=Object.assign(new EventTarget(),{hidden:false});global.fetch=async()=>({ok:false});
 global.localStorage={getItem:key=>stored.get(key)??null,setItem:(key,value)=>stored.set(key,value)};
 const param=()=>({value:0,setTargetAtTime(value){this.value=value;}});
 const node=extra=>({connect(to){this.to=to;},disconnect(){},...extra});
 window.AudioContext=class{
  state='running';currentTime=0;sampleRate=22050;destination={};
  createGain(){const n=node({gain:param()});gains.push(n);return n;}
  createBiquadFilter(){const n=node({frequency:param(),gain:param(),Q:param()});filters.push(n);return n;}
  createStereoPanner(){return node({pan:param()});}
  createBuffer(){return {copyToChannel(){}};}
  createBufferSource(){const n=node({playbackRate:param(),start(){},stop(){}});sources.push(n);return n;}
  close(){return Promise.resolve();}
 };
 const abort=new AbortController();
 try{
  const audio=createMovementAudio(abort.signal);window.dispatchEvent(new Event('pointerdown'));
  const [master,actions]=gains,waterBody=filters[0],route=source=>source.to.to.to.to;
  audio.update({x:0,z:0},standing,.02);audio.update({x:.9,z:0},standing,.1);
  audio.update({x:.9,z:0},{...standing,airborne:true,verticalVelocity:3},.02);
  audio.update({x:.9,z:0},{...standing,crouching:true},.02);
  assert.equal(sources.length,4);assert.ok(sources.every(source=>route(source)===actions));
  saveSoundVolume('actions',0);assert.equal(actions.gain.value,0);assert.equal(master.gain.value,.21);
  const water={...standing,inPool:true,underwater:true,feetY:-1};
  audio.update({x:.9,z:0},water,.02);audio.update({x:1.8,z:0},water,.1);
  assert.ok(sources.slice(-2).every(source=>route(source)===waterBody));assert.equal(waterBody.to,master);
  assert.equal(sources.at(-1).to.frequency.value,800);assert.ok(sources.at(-1).playbackRate.value>=.88&&sources.at(-1).playbackRate.value<=.92);
  assert.ok(waterBody.gain.value>0);saveSoundVolume('actions',50);assert.equal(actions.gain.value,.5);
  audio.update({x:1.8,z:0},water,.02,false);assert.equal(master.gain.value,0);
  audio.update({x:1.8,z:0},water,.02,true);assert.equal(master.gain.value,.21);
  abort.abort();saveSoundVolume('actions',100);assert.equal(actions.gain.value,.5,'disposing removes the volume subscription');
 }finally{abort.abort();Object.assign(global,previous);}
});

test('Bundled close-water recordings are short, faded, unclipped PCM with matching channels',()=>{
 for(const file of Object.values(waterSoundFiles).flat()){
  const wav=readFileSync(new URL(`../public/assets/audio/water/${file}`,import.meta.url));
  assert.equal(wav.toString('ascii',0,4),'RIFF');assert.equal(wav.toString('ascii',8,12),'WAVE');
  assert.equal(wav.readUInt16LE(22),1);assert.equal(wav.readUInt32LE(24),24000);assert.equal(wav.readUInt16LE(34),16);
  const count=wav.readUInt32LE(40)/2;assert.ok(count/24000>.6&&count/24000<1);
  let peak=0,energy=0;for(let i=44;i<wav.length;i+=2){const value=wav.readInt16LE(i)/32768;peak=Math.max(peak,Math.abs(value));energy+=value*value;}
  assert.equal(wav.readInt16LE(44),0);assert.equal(wav.readInt16LE(wav.length-2),0);
  assert.ok(peak>.05&&peak<=.451,file);assert.ok(Math.sqrt(energy/count)>.008,file);
 }
});

test('Footfalls are halved while close-water sounds are doubled, retaining soft and explicit event levels',()=>{
 for(const kind of ['walk','run','land']){assert.equal(foleyGain({kind}),.5);assert.equal(foleyGain({kind,soft:true}),.21);}
 for(const kind of ['enter','swim','exit'])assert.equal(foleyGain({kind}),2);
 assert.equal(foleyGain({kind:'exit',volume:.10}),.20);
 assert.equal(foleyGain({kind:'jump'}),1);assert.equal(foleyGain({kind:'crouch',soft:true}),.42);
 assert.equal(foleyGain({kind:'exit',volume:0}),0);
});
