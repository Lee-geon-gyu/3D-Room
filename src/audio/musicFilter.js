// The same ambient score keeps playing below/above water without a restart.
export function createMusicFilter(audio,Audio,volume=1,diagnostics=false){
 if(!Audio)return null;
 const context=new Audio();let source;
 try{source=context.createMediaElementSource(audio);}catch(error){context.close().catch(()=>{});throw error;}
 const filter=context.createBiquadFilter(),second=context.createBiquadFilter(),body=context.createBiquadFilter(),gain=context.createGain(),userGain=context.createGain();
 filter.type='lowpass';filter.frequency.value=20000;filter.Q.value=.707;
 second.type='lowpass';second.frequency.value=20000;second.Q.value=.54;
 body.type='lowshelf';body.frequency.value=200;body.gain.value=0;
 gain.gain.value=1;userGain.gain.value=volume;
 const input=diagnostics?context.createAnalyser():null,output=diagnostics?context.createAnalyser():null;
 if(input){input.fftSize=4096;output.fftSize=4096;source.connect(input);input.connect(filter);userGain.connect(output);output.connect(context.destination);}else{source.connect(filter);userGain.connect(context.destination);}
 filter.connect(second);second.connect(body);body.connect(gain);gain.connect(userGain);
 return {
  setSubmerged(value){
   filter.frequency.setTargetAtTime(value?260:20000,context.currentTime,.05);
   second.frequency.setTargetAtTime(value?364:20000,context.currentTime,.05);
   body.gain.setTargetAtTime(value?1:0,context.currentTime,.05);
   gain.gain.setTargetAtTime(value?.34:1,context.currentTime,.05);
  },
  setVolume(value){userGain.gain.setTargetAtTime(Math.max(0,Math.min(1,value)),context.currentTime,.025);},
  resume(){if(context.state==='suspended')context.resume().catch(()=>{});},
  measure(){
   const bands=analyser=>{if(!analyser)return null;const data=new Float32Array(analyser.frequencyBinCount);analyser.getFloatFrequencyData(data);let low=0,mid=0,high=0;for(let i=1;i<data.length;i++){const f=i*context.sampleRate/analyser.fftSize,power=10**(data[i]/10);if(f>=80&&f<200)low+=power;if(f>=450&&f<1200)mid+=power;if(f>=1500&&f<6000)high+=power;}return {low,mid,high};};
   return {state:context.state,cutoff:filter.frequency.value,secondCutoff:second.frequency.value,toneGain:gain.gain.value,userGain:userGain.gain.value,input:bands(input),output:bands(output)};
  },
  dispose(){source.disconnect();input?.disconnect();output?.disconnect();filter.disconnect();second.disconnect();body.disconnect();gain.disconnect();userGain.disconnect();context.close().catch(()=>{});},
 };
}
