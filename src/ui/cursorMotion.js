const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const cursorFrameCount=37;
export function cursorSvg(radius=5.5,glow=0){
 return `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><defs><radialGradient id="halo"><stop stop-color="currentColor" stop-opacity=".75"/><stop offset="1" stop-color="currentColor" stop-opacity="0"/></radialGradient><clipPath id="cursor-paper"><path clip-rule="evenodd"/></clipPath></defs><circle data-cursor-glow cx="24" cy="24" r="${radius*2.2}" fill="url(#halo)" opacity="${glow}"/><circle data-cursor-core cx="24" cy="24" r="${radius}" fill="white"/><circle data-cursor-ink cx="24" cy="24" r="${radius}" fill="black" clip-path="url(#cursor-paper)"/></svg>`;
}

// Core ownership and light color share exactly the same cached paper geometry.
// Any white portion (including a punched hole) keeps the halo white.
export function cursorInk(x,y,radius,surfaces){
 return surfaces.some(s=>{
  const l=s.left+radius,t=s.top+radius,r=s.right-radius,b=s.bottom-radius,c=Math.max(0,(s.radius??0)-radius);
  if(x<l||x>r||y<t||y>b)return false;
  if(c&&Math.hypot(x-clamp(x,l+c,r-c),y-clamp(y,t+c,b-c))>c)return false;
  return !(s.holes??[]).some(h=>{
   const dx=Math.abs(x-h.x),dy=Math.abs(y-h.y),a=h.rx,b=h.ry;
   if(!a||!b)return false;
   if((dx/a)**2+(dy/b)**2<=1)return true;
   if(a===b)return Math.hypot(dx,dy)<=a+radius;
   // Closest point on an ellipse, needed for the contact card's oval punch.
   // This branch runs only next to that hole; no page pixels/layout are read.
   if(dx>a+radius||dy>b+radius)return false;
   let low=0,high=Math.max(a*dx,b*dy);
   for(let i=0;i<22;i++){const t=(low+high)/2;if((a*dx/(t+a*a))**2+(b*dy/(t+b*b))**2>1)low=t;else high=t;}
   return Math.hypot(dx-a*a*dx/(high+a*a),dy-b*b*dy/(high+b*b))<=radius;
  });
 })?'black':'white';
}
export function cursorPaperPath(surfaces,x,y){
 return surfaces.map(s=>{
  const l=s.left-x+24,t=s.top-y+24,r=s.right-x+24,b=s.bottom-y+24,c=s.radius??0;
  let path=c?`M${l+c},${t}H${r-c}A${c},${c} 0 0 1 ${r},${t+c}V${b-c}A${c},${c} 0 0 1 ${r-c},${b}H${l+c}A${c},${c} 0 0 1 ${l},${b-c}V${t+c}A${c},${c} 0 0 1 ${l+c},${t}Z`:`M${l},${t}H${r}V${b}H${l}Z`;
  for(const h of s.holes??[]){const hx=h.x-x+24,hy=h.y-y+24;path+=`M${hx-h.rx},${hy}a${h.rx},${h.ry} 0 1 0 ${h.rx*2},0a${h.rx},${h.ry} 0 1 0 ${-h.rx*2},0Z`;}
  return path;
 }).join('');
}
// Rasterize core AND light into the same hardware cursor. An independently
// composited DOM halo can trail the OS pointer during a busy WebGL frame.
// PNG also avoids platform-specific SVG gradient cursor rendering.
export function createNativeCursorCache(makeCanvas=()=>document.createElement('canvas')){
 const frames=new Map();let canvas,context;
 return (index,glow=0)=>{
  const level=clamp(Math.round(glow*16),0,16),key=index*17+level;
  if(!frames.has(key)){
   if(!canvas){canvas=makeCanvas();canvas.width=canvas.height=48;context=canvas.getContext('2d',{willReadFrequently:true});}
   const radius=cursorFrameShape(index).radius;
   context.clearRect(0,0,48,48);
   const gradient=context.createRadialGradient(24,24,0,24,24,radius*2.2);
   gradient.addColorStop(0,`rgba(255,255,255,${.75*level/16})`);gradient.addColorStop(1,'rgba(255,255,255,0)');
   context.fillStyle=gradient;context.fillRect(0,0,48,48);
   context.fillStyle='#fff';context.beginPath();context.arc(24,24,radius,0,Math.PI*2);context.fill();
   // Preserve white even at the faintest fringe: gradient premultiplication
   // can otherwise round very low-alpha RGB down toward grey/black.
   const pixels=context.getImageData(0,0,48,48);
   for(let i=0;i<pixels.data.length;i+=4)if(pixels.data[i+3])pixels.data[i]=pixels.data[i+1]=pixels.data[i+2]=255;
   context.putImageData(pixels,0,0);
   frames.set(key,`url("${canvas.toDataURL('image/png')}") var(--world-cursor-x,24) var(--world-cursor-y,24), auto`);
  }
  return frames.get(key);
 };
}
export const nativeCursorFrame=createNativeCursorCache();
// Keep the entire cursor bitmap inside the viewport at its boundaries. Browsers
// may substitute a default cursor when a custom bitmap crosses browser chrome.
export function cursorHotspot(x,y,width,height){
 const edge=(coordinate,size)=>Math.round(clamp(24,Math.max(0,coordinate+48-size),Math.min(47,coordinate)));
 return {x:edge(x,width),y:edge(y,height)};
}
export function cursorSample(event,previousTime=-Infinity){
 const samples=event.getCoalescedEvents?.(),point=samples?.length?samples[samples.length-1]:event;
 const time=point.timeStamp??event.timeStamp??0;
 return time<previousTime?null:{x:point.clientX,y:point.clientY,time};
}
export function cursorFrameShape(index){const radius=3.5+clamp(index,0,36)*.125;return {radius,ry:radius,tilt:0};}
export class CursorMotion{
 constructor(){this.radius=5.5;this.velocity=0;}
 step(dt,_time,mode='idle',reduced=false){
  const target=mode==='pressed'?3.5:mode==='hover'?7:5.5;
  if(reduced){this.radius=target;this.velocity=0;}
  else{let left=Math.min(.10,Math.max(0,dt));while(left>1e-7){const h=Math.min(left,1/120);this.velocity+=(145*(target-this.radius)-22*this.velocity)*h;this.radius+=this.velocity*h;left-=h;}this.radius=clamp(this.radius,3.5,8);}
  return clamp(Math.round((this.radius-3.5)/.125),0,36);
 }
}
