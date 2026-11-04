import {useEffect,useRef} from 'react';

export function LoadingLandscape({paused=false,onReady}){
 const onReadyRef=useRef(onReady);onReadyRef.current=onReady;
 const canvasRef=useRef(null),landscapeRef=useRef(null),pausedRef=useRef(paused);pausedRef.current=paused;
 useEffect(()=>{
  let alive=true,landscape;
  import('./loadingLandscape.js').then(({createLoadingLandscape})=>{
   if(!alive)return;
   landscape=createLoadingLandscape(canvasRef.current,{reducedMotion:window.matchMedia('(prefers-reduced-motion: reduce)').matches,onReady:()=>{if(alive){canvasRef.current.dataset.ready='true';onReadyRef.current?.();}}});
   landscapeRef.current=landscape;landscape.pause(pausedRef.current);
  }).catch(()=>{if(alive){canvasRef.current.dataset.fallback='true';onReadyRef.current?.();}});
  return()=>{alive=false;landscape?.dispose();landscapeRef.current=null;};
 },[]);
 useEffect(()=>landscapeRef.current?.pause(paused),[paused]);
 return <div className="arrival-landscape" aria-hidden="true"><div className="arrival-landscape-photo"><div className="arrival-distant-fog"/></div><canvas ref={canvasRef} className="arrival-landscape-canvas" onTransitionEnd={event=>{if(event.propertyName==='opacity'&&event.currentTarget.dataset.ready==='true'&&event.currentTarget.dataset.fallback!=='true')event.currentTarget.parentElement.classList.add('is-composited');}}/></div>;
}
