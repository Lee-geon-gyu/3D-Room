import {useEffect,useRef,useState} from 'react';
import {AutoRunIcon} from './AutoRunIcon.jsx';

export function ShortcutsMenu({destinations,onGuide,disabled,running,activeTarget}){
 const [open,setOpen]=useState(false),root=useRef(null),toggle=useRef(null);
 useEffect(()=>{
  if(!open)return;
  const abort=new AbortController(),options={signal:abort.signal};
  window.addEventListener('pointerdown',event=>{if(!root.current?.contains(event.target))setOpen(false);},options);
  window.addEventListener('keydown',event=>{if(event.key==='Escape'){setOpen(false);toggle.current?.focus();}},options);
  return()=>abort.abort();
 },[open]);
 return <div ref={root} className="mobile-shortcuts">
  <button ref={toggle} className={`shortcuts-toggle${running?' is-running':''}`} aria-label="바로가기" title={running?'목적지로 달리는 중':'바로가기'} aria-expanded={open} aria-controls="shortcut-destinations" disabled={disabled}
   onClick={()=>setOpen(value=>!value)}><AutoRunIcon/><span className="control-caption">바로가기</span></button>
  {open?<div id="shortcut-destinations" className="shortcuts-list">{destinations.map(([target,label,Icon])=><button key={target} aria-pressed={activeTarget===target} onClick={()=>{setOpen(false);onGuide(target);}}><Icon size={19}/><span>{label}</span></button>)}</div>:null}
 </div>;
}
