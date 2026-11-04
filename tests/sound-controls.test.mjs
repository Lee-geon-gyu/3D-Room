import test from 'node:test';
import assert from 'node:assert/strict';
import {readSoundVolume,saveSoundVolume} from '../src/audio/soundPreferences.js';
import {createMusicFilter} from '../src/audio/musicFilter.js';

test('Music and action preferences retain independent zero-inclusive levels and tolerate unavailable storage',()=>{
 const previous=global.localStorage,store=new Map();
 global.localStorage={getItem:key=>store.get(key)??null,setItem:(key,value)=>store.set(key,value)};
 try{
  assert.equal(readSoundVolume('music'),28);assert.equal(readSoundVolume('actions'),100);
  saveSoundVolume('music',0);saveSoundVolume('actions',45);
  assert.equal(readSoundVolume('music'),0);assert.equal(readSoundVolume('actions'),45);
  saveSoundVolume('actions',130);assert.equal(readSoundVolume('actions'),100);
  saveSoundVolume('music',-5);assert.equal(readSoundVolume('music'),0);
  store.set('atelier.bgm.volume.v1','invalid');assert.equal(readSoundVolume('music'),28);
  global.localStorage={getItem(){throw Error('denied');},setItem(){throw Error('denied');}};
  saveSoundVolume('actions',0);assert.equal(readSoundVolume('music'),28);assert.equal(readSoundVolume('actions'),100);
 }finally{global.localStorage=previous;}
});

test('Submerging muffles the same playing piano, then restores its full tone without restarting or altering chosen volume',()=>{
 const filters=[],gains=[],audio={volume:.28},params=[];let source,closed=false,resumed=false;
 const param=()=>({value:0,setTargetAtTime(value,time,fade){this.value=value;params.push({time,fade});}});
 const node=extra=>({connect(to){this.to=to;},disconnect(){this.disconnected=true;},...extra});
 class Audio{
  state='suspended';currentTime=42;destination={};
  createMediaElementSource(element){assert.equal(element,audio);return source=node({});}
  createBiquadFilter(){const f=node({frequency:param(),gain:param(),Q:param()});filters.push(f);return f;}
  createGain(){const g=node({gain:param()});gains.push(g);return g;}
  resume(){resumed=true;this.state='running';return Promise.resolve();}
  close(){closed=true;return Promise.resolve();}
 }
 const graph=createMusicFilter(audio,Audio,.28),[lowpass,second,body]=filters,[level,userLevel]=gains;
 assert.equal(source.to,lowpass);assert.equal(lowpass.to,second);assert.equal(second.to,body);assert.equal(body.to,level);assert.equal(level.to,userLevel);
 graph.resume();assert.equal(resumed,true);graph.setSubmerged(true);
 assert.ok(lowpass.frequency.value<=400);assert.ok(second.frequency.value<=560);assert.ok(body.gain.value>0);assert.ok(level.gain.value<=.4);
 assert.ok(params.every(p=>p.time===42&&p.fade>0),'transitions ramp instead of abruptly switching');assert.equal(userLevel.gain.value,.28);
 graph.setVolume(0);graph.setSubmerged(false);assert.equal(userLevel.gain.value,0,'surfacing cannot unmute the user setting');graph.setVolume(.5);
 graph.setSubmerged(false);assert.ok(lowpass.frequency.value>10000&&second.frequency.value>10000);assert.equal(body.gain.value,0);assert.equal(level.gain.value,1);assert.equal(userLevel.gain.value,.5);
 graph.dispose();assert.equal(closed,true);assert.equal(source.disconnected,true);assert.equal(createMusicFilter(audio,null),null);
});
