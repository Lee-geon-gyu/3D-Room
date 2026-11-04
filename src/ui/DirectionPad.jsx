import {useEffect,useRef} from 'react';
import {ArrowUp,ArrowLeft,ArrowDown,ArrowRight} from 'lucide-react';

const directions=[[ArrowUp,0,1,'앞으로'],[ArrowLeft,-1,0,'왼쪽으로'],[ArrowDown,0,-1,'뒤로'],[ArrowRight,1,0,'오른쪽으로']];
export function DirectionPad({onMove}){
 const root=useRef(null),pointer=useRef(null),move=useRef(onMove);move.current=onMove;
 const emit=(x,z)=>{
  move.current(x,z);root.current?.style.setProperty('--pad-x',String(x));root.current?.style.setProperty('--pad-z',String(-z));
 };
 const stop=()=>{pointer.current=null;emit(0,0);};
 const update=event=>{
  const box=root.current.getBoundingClientRect(),x=(event.clientX-box.left-box.width/2)/(box.width*.4),z=-(event.clientY-box.top-box.height/2)/(box.height*.4),length=Math.hypot(x,z);
  if(length<.18){emit(0,0);return;}
  const strength=Math.min(1,(length-.18)/.82);emit(x/length*strength,z/length*strength);
 };
 useEffect(()=>{
  const abort=new AbortController();window.addEventListener('blur',stop,{signal:abort.signal});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();},{signal:abort.signal});
  return()=>{abort.abort();move.current(0,0);};
 },[]);
 return <div ref={root} className="touch-navigation direction-pad" role="group" aria-label="터치 이동 패드"
  onPointerDown={event=>{if(event.button!==0)return;event.preventDefault();pointer.current=event.pointerId;event.currentTarget.setPointerCapture(event.pointerId);update(event);}}
  onPointerMove={event=>{if(pointer.current===event.pointerId)update(event);}}
  onPointerUp={stop} onPointerCancel={stop} onLostPointerCapture={stop}>
  {directions.map(([Icon,x,z,label])=><button key={label} type="button" aria-label={label}
   onKeyDown={event=>{if([' ','Enter'].includes(event.key)){event.preventDefault();emit(x,z);}}}
   onKeyUp={event=>{if([' ','Enter'].includes(event.key))stop();}} onBlur={()=>{if(pointer.current===null)emit(0,0);}}><Icon size={20}/></button>)}
  <span className="direction-pad__thumb" aria-hidden="true"/>
 </div>;
}
