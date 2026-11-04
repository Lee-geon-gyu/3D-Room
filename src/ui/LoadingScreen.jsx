import {useEffect,useRef,useState} from 'react';
import {RotateCcw} from 'lucide-react';
import {loadingStoryboard,loadingRevealDelay} from './loadingStoryboard.js';

const base=import.meta.env.BASE_URL;
export function LoadingScreen({progress,ready,error,onRetry,onExited,obscured}){
  const started=useRef(performance.now()),[revealing,setRevealing]=useState(false);
  const [reduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  // The short completion dissolve also has a cleanup-safe fallback for
  // disabled CSS animations, background tabs and reduced-motion settings.
  useEffect(()=>{
    if(!ready||error){setRevealing(false);return;}
    const timer=setTimeout(()=>setRevealing(true),loadingRevealDelay(performance.now()-started.current,reduced));return()=>clearTimeout(timer);
  },[ready,error,reduced]);
  useEffect(()=>{if(!revealing)return;const timer=setTimeout(onExited,1050);return()=>clearTimeout(timer);},[revealing,onExited]);
  return <section className={`arrival-loading ${revealing&&!error?'is-revealing':''} ${error?'has-error':''} ${obscured?'is-obscured':''}`}
    aria-label="공간 불러오기" aria-hidden={obscured||undefined} inert={obscured?true:undefined}
    onAnimationEnd={event=>{if(event.target===event.currentTarget&&event.animationName==='arrival-reveal')onExited();}}>
    <div className="arrival-doorway" aria-hidden="true"><picture><source media="(max-aspect-ratio: 4/5)" srcSet={`${base}assets/loading/${loadingStoryboard[0].portrait}`}/><img src={`${base}assets/loading/${loadingStoryboard[0].asset}`} alt="" fetchPriority="high" decoding="sync"/></picture></div>
    <div className="arrival-shade" aria-hidden="true"/>
    <div className="arrival-identity">
      <div className="lee-progress" role="progressbar" aria-label="3D 공간 불러오기" aria-valuemin={0} aria-valuemax={100}
        aria-valuenow={progress.percent} aria-valuetext={`${progress.percent}%, ${progress.phase}`} style={{'--load-progress':progress.percent}}>
        <span className="lee-outline" aria-hidden="true"/>
        <span className="lee-liquid-mask" aria-hidden="true"><span className="lee-liquid-level"><span className="lee-liquid">
          <span className="lee-wave lee-wave--back"/><span className="lee-wave"/>
        </span></span></span>
        <span className="sr-only">lee</span>
      </div>
      {!error?<div className="arrival-progress-line"><span className="arrival-progress-track" aria-hidden="true"><span style={{transform:`scaleX(${progress.percent/100})`}}/></span><p className="arrival-percent"><span>{progress.percent}</span><span>%</span></p></div>:null}
      {error?<div className="arrival-error" role="alert"><p>{error}</p><button onClick={onRetry} aria-label="다시 불러오기"><RotateCcw size={20}/><span className="control-caption">다시 불러오기</span></button></div>:null}
    </div>
  </section>;
}
