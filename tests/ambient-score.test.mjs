import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';

test('Selected piano BGM is the approved stereo recording with a quiet loop seam',()=>{
 const wav=readFileSync(new URL('../public/assets/audio/cloud-letters-piano.wav',import.meta.url));
 assert.equal(createHash('sha256').update(wav).digest('hex'),'e0dfbd4bcb0be1ddc67d0de0c3a12007c07ad68be035525759bfe0b3c5968dc6','use the exact approved proposal, without rebalancing or resampling');
 assert.equal(wav.readUInt16LE(22),2);assert.equal(wav.readUInt32LE(24),44100);assert.equal(wav.readUInt16LE(34),16);assert.equal(wav.readUInt32LE(40)/4/44100,48);
 for(const offset of [44,46,wav.length-4,wav.length-2])assert.equal(wav.readInt16LE(offset),0,'the loop meets at silence without a click');
 assert.match(readFileSync(new URL('../public/assets/audio/PIANO-CREDITS.txt',import.meta.url),'utf8'),/Alexander Holm[\s\S]*Attribution 3\.0/);
});

test('Original ambient score has a complete stereo loop, quiet headroom and no exceptional seam transient',()=>{
 const wav=readFileSync(new URL('../public/assets/cloud-reverie-soft.wav',import.meta.url));
 assert.equal(wav.toString('ascii',0,4),'RIFF');assert.equal(wav.toString('ascii',8,12),'WAVE');
 assert.equal(wav.readUInt16LE(22),2);assert.equal(wav.readUInt32LE(24),24000);assert.equal(wav.readUInt16LE(34),16);
 const count=wav.readUInt32LE(40)/4;assert.equal(count/24000,96);
 let peak=0,energy=0,stereo=0,maxStep=0;const first=[wav.readInt16LE(44)/32768,wav.readInt16LE(46)/32768];let previous=first;
 for(let i=44;i<wav.length;i+=4){
  const current=[wav.readInt16LE(i)/32768,wav.readInt16LE(i+2)/32768];
  for(let c=0;c<2;c++){peak=Math.max(peak,Math.abs(current[c]));energy+=current[c]**2;maxStep=Math.max(maxStep,Math.abs(current[c]-previous[c]));}
  stereo+=(current[0]-current[1])**2;previous=current;
 }
 assert.ok(peak<.7&&peak>.1);const rms=Math.sqrt(energy/(count*2));assert.ok(rms>.015&&rms<.085);
 assert.ok(Math.sqrt(stereo/count)>.005,'the two channels must contain a real stereo arrangement');
 assert.ok(Math.max(...previous.map((v,c)=>Math.abs(v-first[c])))<maxStep,'the loop seam must be smaller than ordinary note slopes');
});

test('Retained seamless piano edition has continuous tails and the selected middle and gain',()=>{
 const wav=readFileSync(new URL('../public/assets/audio/cloud-letters-piano-loop.wav',import.meta.url));
 const approved=readFileSync(new URL('../public/assets/audio/cloud-letters-piano.wav',import.meta.url));
 assert.equal(wav.readUInt16LE(22),2);assert.equal(wav.readUInt32LE(24),44100);assert.equal(wav.readUInt16LE(34),16);
 assert.equal(wav.length,approved.length);assert.equal(wav.readUInt32LE(40)/4/44100,48);
 const read=i=>wav.readInt16LE(44+i*2)/32768,count=(wav.length-44)/2;
 const rms=(start,end)=>{let energy=0;for(let i=start;i<end;i++)energy+=read(i)**2;return Math.sqrt(energy/(end-start));};
 const head=rms(0,44100),tail=rms(count-44100,count);
 assert.ok(head>.04&&tail>.04,'neither side of the boundary falls into silence');
 assert.ok(head/tail>.8&&head/tail<1.25,'the reverb bed continues at the same level');
 for(let channel=0;channel<2;channel++)assert.ok(Math.abs(read(channel)-read(count-2+channel))<.005,'no exceptional discontinuity at wrap');
 let difference=0,samples=0;
 for(let i=12*44100*2;i<30*44100*2;i++){
  difference+=(read(i)-approved.readInt16LE(44+i*2)/32768)**2;samples++;
 }
 assert.ok(Math.sqrt(difference/samples)<.00004,'the approved interior remains unchanged within PCM precision');
});

test('Revoiced original accompaniment is active, unclipped and continuous while the selected source stays frozen',()=>{
 const source=readFileSync(new URL('../public/assets/audio/cloud-letters-piano-loop.wav',import.meta.url));
 assert.equal(createHash('sha256').update(source).digest('hex'),'1f276f8f2cc6ea9ab05c3b1c7782c443fe98a9786ca7448f45b92cb23ae2fa2d');
 const wav=readFileSync(new URL('../public/assets/audio/cloud-letters-dream-piano-loop.wav',import.meta.url));
 assert.equal(wav.readUInt16LE(22),2);assert.equal(wav.readUInt32LE(24),44100);assert.equal(wav.readUInt16LE(34),16);
 assert.equal(wav.length,source.length);assert.equal(wav.readUInt32LE(40)/4/44100,48);
 const frames=(wav.length-44)/4,read=(frame,c)=>wav.readInt16LE(44+frame*4+c*2)/32768;
 let peak=0,energy=0,head=0,tail=0,difference=0;
 for(let i=0;i<frames;i++)for(let c=0;c<2;c++){
  const v=read(i,c);peak=Math.max(peak,Math.abs(v));energy+=v*v;
  if(i<22050)head+=v*v;if(i>=frames-22050)tail+=v*v;
  difference+=(v-source.readInt16LE(44+i*4+c*2)/32768)**2;
 }
 assert.ok(peak>.2&&peak<.7,'the original piano retains headroom');
 assert.ok(Math.sqrt(energy/(frames*2))>.03&&Math.sqrt(energy/(frames*2))<.08);
 assert.ok(Math.sqrt(head/44100)>.015&&Math.sqrt(tail/44100)>.015,'no master fade at the seam');
 for(let c=0;c<2;c++)assert.ok(Math.abs(read(0,c)-read(frames-1,c))<.005,'no click at wrap');
 assert.ok(Math.sqrt(difference/(frames*2))>.01,'the original pad has actually been revoiced');
 assert.match(readFileSync(new URL('../src/audio/AmbientMusic.jsx',import.meta.url),'utf8'),/assets\/audio\/cloud-letters-dream-piano-loop\.wav/);
});

test('Opening piano keeps eight even pulses with no extra key between the first notes',()=>{
 const wav=readFileSync(new URL('../public/assets/audio/cloud-letters-dream-piano-loop.wav',import.meta.url));
 const rate=44100,n=Math.round(.18*rate);
 const powersAt=seconds=>{
  const first=Math.round(seconds*rate),samples=new Float64Array(n);
  for(let i=0;i<n;i++)samples[i]=(wav.readInt16LE(44+(first+i)*4)+wav.readInt16LE(46+(first+i)*4))/65536*(.5-.5*Math.cos(2*Math.PI*i/(n-1)));
  const power=key=>{const frequency=440*2**((key-69)/12),coefficient=2*Math.cos(2*Math.PI*frequency/rate);let a=0,b=0;for(const sample of samples){const next=sample+coefficient*a-b;b=a;a=next;}return(a*a+b*b-coefficient*a*b)/(n*n);};
  return Array.from({length:21},(_,index)=>({midi:index+69,power:power(index+69)}));
 };
 const expected=[78,81,88,86,85,83,78,76];
 for(const [note,midi] of expected.entries()){
  const peaks=powersAt(note*.75+.04).sort((a,b)=>b.power-a.power);
  assert.equal(peaks[0].midi,midi,`opening key at ${note*.75}s must replace the old pitch in the actual recording`);
 }
 // Only the held A should remain here; the former 1.125s C# created a ninth pulse.
 const betweenKeys=powersAt(1.165);
 const extraKey=betweenKeys.find(note=>note.midi===85).power;
 const heldKey=betweenKeys.find(note=>note.midi===81).power;
 assert.ok(extraKey<heldKey*.05,'the deleted passing note must be absent from the actual WAV');
 // The next phrase remains the existing score, rather than a repeated intro.
 for(const [note,midi] of [78,74,81,73].entries()){
  const peaks=powersAt(6+note*1.5+.04).sort((a,b)=>b.power-a.power);
  assert.equal(peaks[0].midi,midi,'retain the second phrase after the new introduction');
 }
});

test('Rendered accompaniment keeps the original bass pitches in all eight bars',()=>{
 const wav=readFileSync(new URL('../public/assets/audio/cloud-letters-dream-piano-loop.wav',import.meta.url)),rate=44100,n=rate*2;
 const progression=[38,35,31,33,38,30,31,33];
 for(const [bar,midi]of progression.entries()){
  // The 0.75s pickup is now at the end; listen at the same place in each chord.
  const first=Math.round((bar*6+1.75)*rate),channels=[new Float64Array(n),new Float64Array(n)];
  for(let i=0;i<n;i++)for(let c=0;c<2;c++)channels[c][i]=wav.readInt16LE(44+(first+i)*4+c*2)/32768*(.5-.5*Math.cos(2*Math.PI*i/(n-1)));
  // Average channel power so stereo phase cancellation cannot hide a bass note.
  const power=frequency=>channels.reduce((sum,samples)=>{const coefficient=2*Math.cos(2*Math.PI*frequency/rate);let a=0,b=0;for(const sample of samples){const next=sample+coefficient*a-b;b=a;a=next;}return sum+(a*a+b*b-coefficient*a*b)/(n*n);},0)/2;
  const expected=440*2**((midi-69)/12),fundamental=power(expected),neighbors=Math.max(...[-2,-1,1,2].map(offset=>power(expected*2**(offset/12))));
  // The background now sits at .0028 RMS behind the much softer left hand.
  // Retain an absolute signal floor as well as the unchanged tuning contrast.
  assert.ok(fundamental>2e-7,`bar ${bar+1} retains its original low note, without an octave shift`);
  assert.ok(fundamental>neighbors*8,`bar ${bar+1} retains its original tuning`);
 }
});
