import {createLandscapeRenderer} from './loadingLandscapeRenderer.js';
let renderer,closed=false,frame=0,lastReport=0,pendingSize,pendingPointer=[0,0],paused=false;
const abort=new AbortController();
const schedule=callback=>typeof requestAnimationFrame==='function'?requestAnimationFrame(callback):setTimeout(()=>callback(performance.now()),33);
const cancel=id=>typeof cancelAnimationFrame==='function'?cancelAnimationFrame(id):clearTimeout(id);
function tick(now){
 if(closed)return;
 if(renderer?.draw(now)&&now-lastReport>200){lastReport=now;postMessage({type:'state',state:renderer.state});}
 frame=schedule(tick);
}
self.onmessage=async({data})=>{
 if(data.type==='init'){
  pendingSize={width:data.width,height:data.height};paused=data.paused;
  try{
   renderer=await createLandscapeRenderer(data.canvas,{imageUrl:data.imageUrl,reducedMotion:data.reducedMotion,signal:abort.signal});
   if(closed){renderer.dispose();return;}
   renderer.resize(pendingSize.width,pendingSize.height);renderer.pointer(...pendingPointer);renderer.pause(paused);
   postMessage({type:'ready',state:renderer.state});if(!data.reducedMotion)frame=schedule(tick);
  }catch(error){if(!closed)postMessage({type:'error',message:error.message});}
 }else if(data.type==='resize'){pendingSize=data;renderer?.resize(data.width,data.height);}
 else if(data.type==='pointer'){pendingPointer=[data.x,data.y];renderer?.pointer(data.x,data.y);}
 else if(data.type==='pause'){paused=data.value;renderer?.pause(paused);}
 else if(data.type==='dispose'){closed=true;abort.abort();cancel(frame);renderer?.dispose();postMessage({type:'disposed'});self.close();}
};
