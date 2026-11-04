import test from 'node:test';
import assert from 'node:assert/strict';
import {CursorMotion,cursorFrameCount,cursorFrameShape,cursorSample,cursorSvg,createNativeCursorCache,cursorHotspot,cursorInk,cursorPaperPath} from '../src/ui/cursorMotion.js';
import {neonPulse} from '../src/neonPulse.js';

test('Cursor tracking takes the newest measured sample and never jumps back to a delayed move',()=>{
 const raw={clientX:20,clientY:30,timeStamp:12,getCoalescedEvents:()=>[{clientX:21,clientY:31,timeStamp:10},{clientX:25.5,clientY:35.25,timeStamp:11}]};
 assert.deepEqual(cursorSample(raw),{x:25.5,y:35.25,time:11});
 assert.equal(cursorSample({clientX:1,clientY:2,timeStamp:10},11),null);
 assert.deepEqual(cursorSample({clientX:30,clientY:40,timeStamp:12},11),{x:30,y:40,time:12});
 assert.deepEqual(cursorSample({clientX:31,clientY:41,timeStamp:13,getCoalescedEvents:()=>[]},12),{x:31,y:41,time:13});
});

test('Every hover and pressure frame stays circular about the same hotspot',()=>{
 for(let index=0;index<cursorFrameCount;index++){
  const {radius,ry,tilt}=cursorFrameShape(index);assert.equal(radius,ry);assert.equal(tilt,0);assert.ok(radius*2.2<24);
 }
});
test('Hover and press preserve continuous radius and velocity instead of changing shape abruptly',()=>{
 const c=new CursorMotion();const before=c.radius;c.step(0,0,'hover');assert.equal(c.radius,before);
 c.step(1/60,.016,'hover');assert.ok(c.radius>before&&c.radius<before+.2);
 for(let i=0;i<45;i++)c.step(1/60,i/60,'hover');assert.ok(Math.abs(c.radius-7)<.04);
 const hover=c.radius;c.step(1/60,1,'pressed');assert.ok(c.radius>hover-.25);
 for(let i=0;i<60;i++)c.step(1/60,i/60,'pressed');assert.ok(Math.abs(c.radius-3.5)<.02);
 const held=c.radius;c.step(1/60,2,'hover');assert.ok(c.radius<held+.25);
});
test('A steady white core pulses its halo slowly without a dark hold, and reduced motion stays steady',()=>{
 const c=new CursorMotion(),r=[];for(let i=0;i<600;i++){const frame=c.step(1/60,i/60,'idle');r.push(c.radius);assert.ok(frame>=0&&frame<cursorFrameCount);}
 assert.equal(Math.max(...r)-Math.min(...r),0);
 for(let i=0;i<100;i++){c.step(.1,i,'idle',true);assert.equal(c.radius,5.5);assert.equal(c.velocity,0);}
 c.step(.1,0,'pressed',true);assert.equal(c.radius,3.5);
 assert.match(cursorSvg(5.5,0),/r="5.5" fill="white"/);assert.doesNotMatch(cursorSvg(),/ellipse|rotate/);
 for(let i=0;i<50;i++){assert.ok(Math.abs(neonPulse(i/100)-neonPulse(i/100+3.2))<1e-12);}
 assert.equal(neonPulse(0),0);assert.equal(neonPulse(1.6),1);assert.equal(neonPulse(3.2),0);assert.ok(neonPulse(3.2001)>0);
 assert.equal(neonPulse(0,true),neonPulse(.25,true));
});
test('Rapid reversals and a delayed frame remain bounded and return to the hover size',()=>{
 const c=new CursorMotion();for(let i=0;i<500;i++){c.step(i%11===0?1:1/60,i/60,i%2?'pressed':'hover');assert.ok(c.radius>=3.5&&c.radius<=8);}
 for(let i=0;i<180;i++)c.step(1/60,i/60,'hover');assert.ok(Math.abs(c.radius-7)<.001);
});

test('Core and white halo share one cached PNG, without a second moving presentation',()=>{
 const colors=[],arcs=[];let encoded=0,canvases=0;
 const context={clearRect(){},createRadialGradient(){return {addColorStop(at,color){colors.push([at,color]);}};},fillRect(){},beginPath(){},arc(...args){arcs.push(args);},fill(){},getImageData(){return {data:new Uint8ClampedArray([0,0,0,1,170,170,170,3])};},putImageData(pixels){assert.deepEqual([...pixels.data],[255,255,255,1,255,255,255,3]);}};
 const frame=createNativeCursorCache(()=>{canvases++;return {getContext:()=>context,toDataURL:format=>{assert.equal(format,'image/png');return `data:image/png;base64,frame${++encoded}`;}};});
 assert.equal(frame(16,.1),frame(16,.12),'nearby glow values reuse the quantized bitmap');
 assert.equal(encoded,1);assert.equal(canvases,1);assert.match(frame(16,.1),/var\(--world-cursor-x,24\) var\(--world-cursor-y,24\)/);
 assert.notEqual(frame(16,0),frame(16,1));assert.equal(encoded,3);
 assert.deepEqual(arcs[0],[24,24,5.5,0,Math.PI*2]);
 assert.ok(colors.every(([,color])=>color.startsWith('rgba(255,255,255,')),'all translucent pixels contain white light');
});

test('Native hotspots retain the full bitmap at every viewport edge without a following DOM cursor',()=>{
 for(const [width,height]of [[320,568],[768,1024],[1280,720]])for(const [x,y]of [[0,0],[1,height-1],[width-1,0],[width-1,height-1],[width/2,height/2]]){
  const hot=cursorHotspot(x,y,width,height);
  assert.ok(x-hot.x>=0&&x-hot.x+48<=width);assert.ok(y-hot.y>=0&&y-hot.y+48<=height);
  assert.ok(Number.isInteger(hot.x)&&Number.isInteger(hot.y));
 }
 assert.deepEqual(cursorHotspot(100,200,1280,720),{x:24,y:24});
});

test('Only a wholly black core has black light; every mixed paper edge keeps white light',()=>{
 const paper={left:100,top:100,right:400,bottom:300,radius:20},r=5.5;
 assert.equal(cursorInk(90,150,r,[paper]),'white');
 assert.equal(cursorInk(200,150,r,[paper]),'black');
 for(const x of [94.51,99,100,102,105.49])assert.equal(cursorInk(x,150,r,[paper]),'white',`mixed edge at ${x}`);
 assert.equal(cursorInk(105.51,150,r,[paper]),'black');
 assert.equal(cursorInk(107,107,r,[paper]),'white','rounded corner overlaps the background');
 assert.equal(cursorInk(110,110,r,[paper]),'black');
 const punched={...paper,holes:[{x:200,y:150,rx:14,ry:6}]};
 assert.equal(cursorInk(200,150,r,[punched]),'white');
 assert.equal(cursorInk(200,161,r,[punched]),'white','any white part of the punch keeps white light');
 assert.equal(cursorInk(200,162,r,[punched]),'black','outside an oval punch uses actual ellipse distance');
 assert.equal(cursorInk(219,150,r,[punched]),'white');
 assert.equal(cursorInk(220,150,r,[punched]),'black');
 const path=cursorPaperPath([punched],200,150);assert.match(path,/A20,20/);assert.match(path,/a14,6/);
 assert.notEqual(path,cursorPaperPath([punched],201,150),'the core clip follows the current pointer without interpolation');
});
