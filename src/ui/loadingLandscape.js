// The loading view owns its own worker so scene decoding/building cannot stop
// its render loop. Only input, resize and sparse diagnostic messages cross threads.
export function createLoadingLandscape(canvas,{reducedMotion=false,onReady=()=>{}}={}){
 let worker,renderer,disposed=false,ready=false,paused=false,raf=0,shutdown=0,startup=0;
 const abort=new AbortController();
 const imageUrl=new URL(`${import.meta.env.BASE_URL}assets/loading/cloud-journey-balanced.webp`,window.location.href).href;
 const commit=state=>{if(disposed)return;for(const [key,value] of Object.entries(state))canvas.dataset[key]=String(value);};
 const signalReady=()=>{if(disposed||ready)return;ready=true;clearTimeout(startup);canvas.dataset.ready='true';onReady();};
 const fallback=()=>{if(disposed)return;canvas.parentElement?.classList.remove('is-composited');canvas.dataset.fallback='true';canvas.dataset.renderThread='compositor';signalReady();};
 const size=()=>({width:Math.max(1,canvas.clientWidth),height:Math.max(1,canvas.clientHeight)});
 const resize=()=>{const bounds=size();worker?.postMessage({type:'resize',...bounds});renderer?.resize(bounds.width,bounds.height);};
 const pointerMove=event=>{
  const bounds=canvas.getBoundingClientRect(),x=Math.max(-1,Math.min(1,(event.clientX-bounds.left)/bounds.width*2-1)),y=Math.max(-1,Math.min(1,(event.clientY-bounds.top)/bounds.height*2-1));
  worker?.postMessage({type:'pointer',x,y});renderer?.pointer(x,y);
 };
 const resetPointer=()=>{worker?.postMessage({type:'pointer',x:0,y:0});renderer?.pointer(0,0);};
 const syncPause=()=>{const value=paused||document.hidden;worker?.postMessage({type:'pause',value});renderer?.pause(value);};
 function tick(now){if(disposed)return;if(renderer?.draw(now))commit(renderer.state);if(!reducedMotion)raf=requestAnimationFrame(tick);}
 if(typeof Worker==='function'&&typeof canvas.transferControlToOffscreen==='function'){
  try{
   worker=new Worker(new URL('./loadingLandscape.worker.js',import.meta.url),{type:'module',name:'cloud-journey'});
   worker.onmessage=({data})=>{
    if(data.type==='disposed'){clearTimeout(shutdown);worker.terminate();return;}
    if(disposed)return;
    if(data.state)commit(data.state);
    if(data.type==='ready'){delete canvas.dataset.fallback;canvas.dataset.renderThread='worker';signalReady();}
    if(data.type==='error'){worker.terminate();worker=null;fallback();}
   };
   worker.onerror=()=>{worker?.terminate();worker=null;fallback();};
   const offscreen=canvas.transferControlToOffscreen();
   worker.postMessage({type:'init',canvas:offscreen,...size(),imageUrl,reducedMotion,paused:document.hidden},[offscreen]);
  }catch{worker?.terminate();worker=null;fallback();}
 }else{
  import('./loadingLandscapeRenderer.js').then(async({createLandscapeRenderer})=>{
   renderer=await createLandscapeRenderer(canvas,{imageUrl,reducedMotion,signal:abort.signal});
   if(disposed){renderer.dispose();return;}
   const bounds=size();renderer.resize(bounds.width,bounds.height);renderer.pause(paused||document.hidden);
   canvas.dataset.renderThread='main';commit(renderer.state);signalReady();if(!reducedMotion)raf=requestAnimationFrame(tick);
  }).catch(()=>{if(!disposed)fallback();});
 }
 startup=setTimeout(()=>{if(!ready)fallback();},6000);
 const observer=new ResizeObserver(resize);observer.observe(canvas);
 if(!reducedMotion){window.addEventListener('pointermove',pointerMove,{passive:true});window.addEventListener('blur',resetPointer);document.addEventListener('pointerleave',resetPointer);}
 const visibility=()=>{resetPointer();syncPause();};document.addEventListener('visibilitychange',visibility);
 return {
  pause(value){paused=value;syncPause();},
  dispose(){
   if(disposed)return;disposed=true;clearTimeout(startup);abort.abort();cancelAnimationFrame(raf);observer.disconnect();
   window.removeEventListener('pointermove',pointerMove);window.removeEventListener('blur',resetPointer);document.removeEventListener('pointerleave',resetPointer);document.removeEventListener('visibilitychange',visibility);
   renderer?.dispose();if(worker){worker.postMessage({type:'dispose'});shutdown=setTimeout(()=>worker?.terminate(),1000);}
  },
 };
}
