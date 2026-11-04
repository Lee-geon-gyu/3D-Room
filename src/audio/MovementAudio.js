import {worldDelta} from '../navigation/coordinates.js';
import {waterSoundFiles} from './waterSoundBank.js';
import {readSoundVolume,observeActionVolume} from './soundPreferences.js';

// Keep actions restrained, with quieter footsteps and clearer close water.
export const movementEffectVolume=.21;
export function foleyGain(event){
 const level=['walk','run','land'].includes(event.kind)?.5:['enter','swim','exit'].includes(event.kind)?2:1;
 return level*(event.volume??(event.soft?.42:1));
}

// Derive foley from real displacement and physical transitions, never key repeats.
export class MovementSoundTracker{
 constructor(){this.reset();}
 reset(){this.previous=null;this.distance=0;this.stroke=0;this.foot=0;this.wet=0;}
 step(position,motion,delta,active=true){
  const now={x:position.x,z:position.z,feetY:motion.feetY,...motion},last=this.previous;
  this.previous=now;
  if(!active||!last||delta>.35){this.distance=0;this.stroke=0;return [];}
  const distance=Math.hypot(...worldDelta(now.x-last.x,now.z-last.z));
  if(distance>1.5){this.distance=0;this.stroke=0;return [];}
  const events=[],emit=(kind,extra={})=>events.push({kind,...extra});
  if(now.inPool!==last.inPool){emit(now.inPool?'enter':'exit');this.distance=0;this.stroke=0;this.wet=now.inPool?0:3;return events;}
  if((now.crouching&&!last.crouching)||(now.seated&&!last.seated))emit('crouch');
  if(!now.inPool&&!last.inPool&&now.verticalVelocity>1&&last.verticalVelocity<=0)emit('jump');
  if(!now.inPool&&!last.inPool&&last.airborne&&!now.airborne)emit('land');
  if(now.seated){this.distance=0;return events;}
  if(now.inPool){
   this.distance=0;this.stroke+=Math.hypot(distance,now.feetY-last.feetY);
   if(this.stroke>=.72){emit('swim',{underwater:now.underwater});this.stroke%=.72;}
  }else if(!now.airborne&&distance>.0005){
   this.distance+=distance;this.wet=Math.max(0,this.wet-distance);
   const stride=now.sprinting?.85:now.crouching?.48:.64;
   if(this.distance>=stride){emit(now.sprinting?'run':'walk',{foot:this.foot++%2,soft:now.crouching,wet:this.wet>0});this.distance%=stride;}
  }else if(!now.airborne)this.distance=0;
  return events;
 }
}

const durations={walk:.24,run:.20,land:.31,jump:.29,crouch:.35,swim:.66,enter:.92,exit:.82};
// Original dry foley, with a quiet bubble fallback while recorded water loads.
export function synthesizeFoley(kind,sampleRate=44100,seed=1){
 const duration=durations[kind],data=new Float32Array(Math.ceil(duration*sampleRate));
 let random=seed|0,low=0,body=0,phase=0;
 const rand=()=>{random^=random<<13;random^=random>>>17;random^=random<<5;return (random>>>0)/4294967296;};
 const water=['swim','enter','exit'].includes(kind),drops=water?Array.from({length:kind==='enter'?26:18},()=>({at:.02+rand()*(duration-.14),frequency:300+rand()*900,amplitude:.02+rand()*.04,decay:45+rand()*45})):[];
 for(let i=0;i<data.length;i++){
  const t=i/sampleRate,n=rand()*2-1;low+=.13*(n-low);body+=.025*(n-body);
  let value=0;
  if(water){
   const attack=1-Math.exp(-t/(kind==='enter'?.025:.045)),tail=Math.exp(-t/(kind==='enter'?.30:kind==='exit'?.28:.32));
   value=low*.10*attack*tail;
   for(const drop of drops){const age=t-drop.at;if(age>0&&age<.12)value+=drop.amplitude*Math.sin(2*Math.PI*drop.frequency*(age-1.6*age*age))*Math.exp(-age*drop.decay)*(1-Math.exp(-age*900));}
  }else if(kind==='crouch'){
   value=(n-low)*.10*Math.sin(Math.PI*t/duration)**2*(.6+.4*Math.sin(t*45)**2)+body*.12*Math.exp(-t*13);
  }else if(kind==='jump'){
   const env=(1-Math.exp(-t*240))*Math.exp(-t*23);
   value=low*.28*env+Math.sin(2*Math.PI*(105*t-95*t*t))*.16*env+(n-low)*.07*Math.exp(-(((t-.065)/.035)**2));
  }else{
   const heavy=kind==='run'||kind==='land',frequency=kind==='land'?64:heavy?78:102;
   phase+=2*Math.PI*frequency*Math.exp(-t*4)/sampleRate;
   const heel=(1-Math.exp(-t*800))*Math.exp(-t*(heavy?32:42));
   const toe=(1-Math.exp(-t*180))*Math.exp(-t*19);
   value=Math.sin(phase)*heel*(heavy?.33:.24)+low*toe*.40+(n-low)*.065*Math.exp(-(((t-.018)/.009)**2));
   value+=(n-low)*.035*Math.exp(-(((t-.105)/.034)**2));
  }
  data[i]=Math.tanh(value*1.6)*Math.min(1,t/.002,(duration-t)/.018);
 }
 return data;
}

export function createMovementAudio(signal){
 const tracker=new MovementSoundTracker(),sources=new Set(),buffers=new Map(),recordedWater=new Map();
 let context=null,master=null,actionBus=null,waterBody=null,disposed=false,waterRequested=false,lastMasterGain,actionLevel=readSoundVolume('actions')/100;
 const stopObserving=observeActionVolume(value=>{actionLevel=value;if(actionBus)actionBus.gain.setTargetAtTime(value,context.currentTime,.04);});
 const loadWater=()=>{
  if(waterRequested)return;waterRequested=true;
  for(const file of Object.values(waterSoundFiles).flat()){
   fetch(`${import.meta.env?.BASE_URL??'./'}assets/audio/water/${file}`,{signal})
    .then(response=>{if(!response.ok)throw new Error('Water recording unavailable');return response.arrayBuffer();})
    .then(bytes=>context.decodeAudioData(bytes)).then(buffer=>{if(!disposed)recordedWater.set(file,buffer);}).catch(()=>{});
  }
 };
 const unlock=()=>{
  if(disposed||document.hidden)return;
  const Audio=window.AudioContext??window.webkitAudioContext;if(!Audio)return;
  if(!context){
   context=new Audio();master=context.createGain();master.gain.value=movementEffectVolume;master.connect(context.destination);
   actionBus=context.createGain();actionBus.gain.value=actionLevel;actionBus.connect(master);
   waterBody=context.createBiquadFilter();waterBody.type='lowshelf';waterBody.frequency.value=260;waterBody.gain.value=2.5;waterBody.connect(master);
   loadWater();
  }
  if(context.state==='suspended')context.resume().catch(()=>{});
 };
 const play=event=>{
  if(context?.state!=='running'||disposed)return;
  const variant=Math.floor(Math.random()*4),key=`${event.kind}-${variant}`;
  const availableWater=(waterSoundFiles[event.kind]??[]).map(file=>recordedWater.get(file)).filter(Boolean);
  let buffer=availableWater.length?availableWater[Math.floor(Math.random()*availableWater.length)]:buffers.get(key);
  if(!buffer){const pcm=synthesizeFoley(event.kind,context.sampleRate,17+variant*991+event.kind.charCodeAt(0));buffer=context.createBuffer(1,pcm.length,context.sampleRate);buffer.copyToChannel(pcm,0);buffers.set(key,buffer);}
  const source=context.createBufferSource(),gain=context.createGain(),filter=context.createBiquadFilter(),pan=context.createStereoPanner();
  const water=Boolean(waterSoundFiles[event.kind]);
  source.buffer=buffer;source.playbackRate.value=water?.88+Math.random()*.04:.96+Math.random()*.08;
  filter.type='lowpass';filter.frequency.value=water?(event.underwater?800:2400):12000;filter.Q.value=.65;
  gain.gain.value=foleyGain(event);pan.pan.value=event.foot===undefined?(Math.random()-.5)*.18:event.foot?.13:-.13;
  source.connect(filter);filter.connect(gain);gain.connect(pan);pan.connect(water?waterBody:actionBus);sources.add(source);
  source.onended=()=>{sources.delete(source);source.disconnect();filter.disconnect();gain.disconnect();pan.disconnect();};source.start();
  if(event.wet)play({kind:'exit',volume:.10});
 };
 const stop=()=>{for(const source of sources){try{source.stop();}catch{}}sources.clear();};
 const visibility=()=>{tracker.reset();if(document.hidden){stop();context?.suspend().catch(()=>{});}else unlock();};
 const options={signal,passive:true};
 window.addEventListener('pointerdown',unlock,options);window.addEventListener('keydown',unlock,options);document.addEventListener('visibilitychange',visibility,options);
 const dispose=()=>{if(disposed)return;disposed=true;stopObserving();stop();window.removeEventListener('pointerdown',unlock);window.removeEventListener('keydown',unlock);document.removeEventListener('visibilitychange',visibility);context?.close().catch(()=>{});buffers.clear();recordedWater.clear();};
 signal.addEventListener('abort',dispose,{once:true});
 return {
  update(position,motion,delta,active=true){
   const enabled=active&&!document.hidden,target=enabled?movementEffectVolume:0;
   if(master&&target!==lastMasterGain){master.gain.setTargetAtTime(target,context.currentTime,.04);lastMasterGain=target;}
   const events=tracker.step(position,motion,delta,enabled);
   for(const event of events)play(event);
  },
  reset(){tracker.reset();stop();},
  dispose,
 };
}
