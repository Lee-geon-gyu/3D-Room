import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {ArrowUpRight,Phone,Mail} from 'lucide-react';
import {endingTimings,reducedEndingTimings,endingStage,endingAllowsMovement,endingWriting} from './endingSequence.js';
import {LoungeLandscape} from './LoungeLandscape.jsx';

export function EndingSequence({contact,onRestart,onStageChange,worldCanvasRef}){
 const dialogRef=useRef(null),restartRef=useRef(null);
 const [reduced]=useState(()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches);
 const [stage,setStage]=useState('clear');
 const locked=!endingAllowsMovement(stage);
 useLayoutEffect(()=>{
  const dialog=dialogRef.current;
  if(locked){if(dialog.open)dialog.close();dialog.showModal();dialog.focus({preventScroll:true});}
  else {dialog.show();worldCanvasRef?.current?.focus({preventScroll:true});}
  return()=>dialog.close();
 },[locked,worldCanvasRef]);
 useLayoutEffect(()=>onStageChange?.(stage),[stage,onStageChange]);
 useEffect(()=>{
  // Warm local OFL faces before the farewell; Clear is normally ready in App.
  document.fonts?.load('400 128px Allura','Clear').catch(()=>{});
  document.fonts?.load('800 32px "Nanum Myeongjo"').catch(()=>{});
  document.fonts?.load('italic 500 32px "Cormorant Garamond"').catch(()=>{});
  const timings=reduced?reducedEndingTimings:endingTimings;
  const timers=Object.values(timings).map(delay=>setTimeout(()=>setStage(endingStage(delay,reduced)),delay));
  return()=>timers.forEach(clearTimeout);
 },[reduced]);
 useEffect(()=>{if(stage==='complete')restartRef.current?.focus({preventScroll:true});},[stage]);
 const paragraph=stage==='first'||stage==='firstOut'?0:['second','secondOut','complete'].includes(stage)?1:null;
 const lifting=stage==='secondOut'||stage==='complete';
 return <><div className={`ending-landscape ending-backdrop${stage!=='clear'?' is-visible':''}`} data-stage={stage} aria-hidden="true"><LoungeLandscape/><div className="ending-contact-shade"/></div><dialog ref={dialogRef} className={`ending-sequence${locked?' is-locked':''}${reduced?' is-reduced':''}`} data-stage={stage} aria-modal={locked} aria-labelledby="ending-title" tabIndex={locked?-1:undefined} onCancel={event=>event.preventDefault()} onKeyDown={event=>{if(locked&&event.key==='Tab'&&stage!=='complete')event.preventDefault();}}>
  <div className="ending-veil"/>
  <h1 id="ending-title" className="sr-only">{locked?'마지막 인사':'CLEAR — 모든 둘러보기를 마쳤어요.'}</h1>
  <div className="ending-clear" aria-hidden={stage!=='clear'}>
   <div className="ending-clear-word"><p className="ending-clear-title">Clear</p></div>
   <div className="ending-knot" aria-hidden="true"><svg viewBox="88 140 386 60" fill="none">
    <defs><path id="ending-knot-line" pathLength="1" d="M94 191C181 173 280 176 390 170C427 168 458 157 466 147"/></defs>
    <use href="#ending-knot-line" className="ending-knot-trail ending-knot-trail--far"/>
    <use href="#ending-knot-line" className="ending-knot-trail"/>
    <use href="#ending-knot-line" className="ending-knot-line"/>
    <use href="#ending-knot-line" className="ending-comet"/>
   </svg></div>
  </div>
  {paragraph!==null?<section key={paragraph} className={`ending-letter${paragraph===1?' ending-letter--last':''}${stage==='firstOut'?' is-leaving':''}${paragraph===1&&lifting?' is-lifting':''}`} style={{'--korean-arrival':`${endingWriting.korean}s`,'--english-arrival':`${endingWriting.english}s`,'--english-delay':`${endingWriting.englishDelay}s`}} aria-label={`마지막 인사 ${paragraph+1}/2`} aria-live="polite">
   <p className="ending-korean">{contact.statement[paragraph]}</p><p className="ending-english">{contact.statementEnglish[paragraph]}</p>
  </section>:null}
  {stage==='complete'?<div className="ending-restart-screen"><div className="ending-contact-group"><address className="ending-contacts" aria-label="연락처"><a href={`mailto:${contact.email}`}><Mail size={21} aria-hidden="true"/>{contact.email}</a><a href={`tel:${contact.phone}`}><Phone size={21} aria-hidden="true"/>{contact.phone}</a></address></div><button ref={restartRef} className="ending-restart" onClick={onRestart}>다시 시작하기 <ArrowUpRight size={19} aria-hidden="true"/></button></div>:null}
 </dialog></>;
}
