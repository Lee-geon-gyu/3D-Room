import {useEffect,useRef} from 'react';
import {CursorMotion,cursorSvg,cursorFrameShape,cursorSample,nativeCursorFrame,cursorHotspot,cursorInk,cursorPaperPath} from './cursorMotion.js';
import {neonPulse} from '../neonPulse.js';

// One hardware bitmap outside paused readers; reader paper clips the black core
// while its independently colored light stays white for every mixed boundary.
export function WorldCursor({canvasRef,targetId}){
 const targetRef=useRef(''),refreshRef=useRef(null);
 useEffect(()=>{targetRef.current=targetId;refreshRef.current?.();},[targetId]);
 useEffect(()=>{
  const html=document.documentElement,ring=document.createElement('div');
  ring.className='world-cursor-ring';ring.setAttribute('aria-hidden','true');ring.hidden=true;ring.innerHTML=cursorSvg();document.body.append(ring);
  const halo=ring.querySelector('[data-cursor-glow]'),cores=ring.querySelectorAll('[data-cursor-core],[data-cursor-ink]'),paper=ring.querySelector('clipPath path');
  const media=matchMedia('(any-hover: hover) and (any-pointer: fine)'),reduced=matchMedia('(prefers-reduced-motion: reduce)'),abort=new AbortController(),options={signal:abort.signal,passive:true},motion=new CursorMotion();
  let visible=false,onCanvas=false,control=false,pressed=false,mode='',raf=0,last=0,painted=-1,x=0,y=0,drawX=NaN,drawY=NaN,lastTarget,lastCursorTarget='',lastPressed=false;
  let sampleTime=-Infinity,lookPointer=null,lookActive=false,releasedPointer=null,native=false,nativeFrame='',glow=-1,adaptive=false;
  let width=innerWidth,height=innerHeight,hotX=24,hotY=24;
  let surfaces=[],surfaceNodes=[],paperPath='',ink='',measureFrame=0;
  const measureSurfaces=()=>{
   surfaces=surfaceNodes.filter(node=>node.isConnected).map(node=>{
    const box=node.getBoundingClientRect(),style=getComputedStyle(node),holes=[];
    if(node.classList.contains('is-threaded')){const number=key=>parseFloat(style.getPropertyValue(key))||0;holes.push({x:box.left+number('--punch-x'),y:box.top+number('--punch-y'),rx:number('--punch-rx'),ry:number('--punch-ry')});}
    return {left:box.left,top:box.top,right:box.right,bottom:box.bottom,radius:parseFloat(style.borderTopLeftRadius)||0,holes};
   });
   if(visible&&!native)paintPosition();
  };
  // Contact binding updates its punch during its own resize callback. Measure
  // after all layout observers finish so the core and light use the same hole.
  const queueMeasure=()=>{if(!measureFrame)measureFrame=requestAnimationFrame(()=>{measureFrame=0;measureSurfaces();});};
  const resizeObserver=new ResizeObserver(queueMeasure);
  const canvas=canvasRef.current;
  const inputOptions={...options,capture:true};
  const syncCursor=()=>{
   const next=visible&&lookPointer===null&&!adaptive;
   if(next!==native){native=next;html.toggleAttribute('data-cursor-native',native);}
   const hidden=!visible||lookPointer!==null||native;if(ring.hidden!==hidden)ring.hidden=hidden;
  };
  const stack=()=>{
   const dialogs=document.querySelectorAll('dialog[open]'),host=dialogs[dialogs.length-1]??document.body;
   adaptive=host.matches('.controls-dialog,.detail-dialog[data-motion="reading"]');
   const nodes=adaptive?[...host.querySelectorAll('[data-cursor-surface]')]:[];
   if(nodes.length!==surfaceNodes.length||nodes.some((node,i)=>node!==surfaceNodes[i])){resizeObserver.disconnect();surfaceNodes=nodes;nodes.forEach(node=>resizeObserver.observe(node));measureSurfaces();}
   if(ring.parentElement!==host)host.append(ring);
   paintPosition();
  };
  // Position follows input immediately. The independent RAF animates only the
  // ring's shape, so an expensive world frame cannot add another frame of lag.
  const paintPosition=()=>{
   syncCursor();if(lookPointer!==null)return;
   if(native){
    const hot=cursorHotspot(x,y,width,height);
    if(hot.x!==hotX){hotX=hot.x;html.style.setProperty('--world-cursor-x',String(hotX));}
    if(hot.y!==hotY){hotY=hot.y;html.style.setProperty('--world-cursor-y',String(hotY));}
    return;
   }
   if(x!==drawX||y!==drawY){drawX=x;drawY=y;ring.style.transform=`translate3d(${x-24}px,${y-24}px,0)`;}
   const path=cursorPaperPath(surfaces,x,y);if(path!==paperPath){paperPath=path;paper.setAttribute('d',path);}
   const tone=cursorInk(x,y,(painted>=0?cursorFrameShape(painted).radius:5.5)+.25,surfaces);if(tone!==ink){ink=tone;ring.dataset.ink=tone;}
  };
  const tick=time=>{
   raf=0;if(!visible||lookPointer!==null||document.hidden)return;
   if(!last||time-last>=40||reduced.matches){
    const index=motion.step(last?(time-last)/1000:1/60,time/1000,mode,reduced.matches);last=time;
    if(index!==painted){painted=index;const radius=cursorFrameShape(index).radius;cores.forEach(core=>core.setAttribute('r',String(radius)));halo.setAttribute('r',String(radius*2.2));if(!native)paintPosition();}
    const pulse=neonPulse(time/1000,reduced.matches),level=Math.round(pulse*1000);
    if(level!==glow){glow=level;halo.setAttribute('opacity',String(level/1000));}
    if(native){const frame=nativeCursorFrame(index,pulse);if(frame!==nativeFrame){nativeFrame=frame;html.style.setProperty('--world-native-cursor',frame);}}
   }
   if(!reduced.matches)raf=requestAnimationFrame(tick);
  };
  const schedule=()=>{if(visible&&lookPointer===null&&!raf)raf=requestAnimationFrame(tick);};
  const follow=event=>{
   if(!media.matches||(event.pointerType&&event.pointerType!=='mouse'))return;
   const sample=cursorSample(event,sampleTime);if(!sample)return;
   ({x,y}=sample);sampleTime=sample.time;
   if(visible&&lookPointer===null)paintPosition();
  };
  const setLooking=value=>{
   lookPointer=value;html.toggleAttribute('data-cursor-looking',value!==null);
   syncCursor();
   if(value!==null){cancelAnimationFrame(raf);raf=0;last=0;}
   else if(visible){paintPosition();schedule();}
  };
  const refresh=()=>{
   const target=visible?(onCanvas?targetRef.current:control?'control':''):'';
   const next=pressed?'pressed':target?'hover':'idle';
   if(target!==lastCursorTarget){lastCursorTarget=target;if(target)html.dataset.cursorTarget=target;else delete html.dataset.cursorTarget;}
   if(pressed!==lastPressed){lastPressed=pressed;html.toggleAttribute('data-cursor-pressed',pressed);}
   if(next!==mode){mode=next;html.dataset.cursorMode=mode;last=0;}
   schedule();
  };
  refreshRef.current=refresh;
  const hide=()=>{
   visible=false;lookPointer=null;lookActive=false;releasedPointer=null;ring.hidden=true;lastTarget=null;pressed=false;lastPressed=false;lastCursorTarget='';mode='';cancelAnimationFrame(raf);raf=0;last=0;sampleTime=-Infinity;
   native=false;delete html.dataset.cursorNative;
   delete html.dataset.worldCursor;delete html.dataset.cursorTarget;delete html.dataset.cursorPressed;delete html.dataset.cursorMode;delete html.dataset.cursorLooking;
  };
  const enter=event=>{
   if(!media.matches||(event.pointerType&&event.pointerType!=='mouse')){hide();return;}
   follow(event);
   if(!visible){visible=true;ring.hidden=lookPointer!==null;html.dataset.worldCursor='';stack();}
   onCanvas=event.target===canvasRef.current;lastTarget=event.target;
   paintPosition();
   control=Boolean(event.target.closest?.('button:not(:disabled),a[href],input[type="range"],[role="slider"],[role="button"]:not([aria-disabled="true"])'));
   if(!event.buttons)pressed=false;refresh();
  };
  document.addEventListener('pointerover',enter,options);
  // Raw updates are dispatched ahead of frame-aligned pointermove events.
  // Keep this hot path to sample coordinates + one compositor transform only.
  if('onpointerrawupdate' in window)document.addEventListener('pointerrawupdate',follow,inputOptions);
  document.addEventListener('pointermove',event=>{follow(event);if(!visible||event.target!==lastTarget)enter(event);},inputOptions);
  document.addEventListener('pointerdown',event=>{
   releasedPointer=null;
   enter(event);
   if(visible&&event.button===0){
    if(event.target===canvasRef.current){setLooking(event.pointerId);return;}
    pressed=true;refresh();
   }
  },inputOptions);
  canvas?.addEventListener('worldlookchange',event=>{
   const detail=event.detail;if(!detail.mouse||!media.matches)return;
   lookActive=detail.active;
   if(detail.active){setLooking(detail.id);return;}
   x=detail.x;y=detail.y;sampleTime=detail.restored?event.timeStamp:-Infinity;releasedPointer=detail.restored?detail.id:null;pressed=false;
   if(document.hidden||!document.hasFocus()){hide();return;}
   setLooking(null);refresh();
  },options);
  document.addEventListener('pointerleave',()=>{if(!lookActive)hide();},options);
  window.addEventListener('pointerup',event=>{if(lookActive)return;if(event.pointerId===releasedPointer){releasedPointer=null;pressed=false;refresh();return;}if(event.pointerId===lookPointer)setLooking(null);pressed=false;enter(event);},options);
  document.addEventListener('lostpointercapture',event=>{if(!lookActive&&event.pointerId===lookPointer){pressed=false;setLooking(null);refresh();}},options);
  for(const event of ['pointercancel','blur'])window.addEventListener(event,hide,options);
  window.addEventListener('resize',()=>{width=innerWidth;height=innerHeight;queueMeasure();if(visible)paintPosition();},options);
  document.addEventListener('scroll',()=>{if(adaptive)queueMeasure();},{...options,capture:true});
  window.addEventListener('keydown',event=>{if(event.key==='Tab')hide();},options);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)hide();},options);
  media.addEventListener('change',hide,options);reduced.addEventListener('change',()=>{last=0;refresh();},options);
  // Follow native dialog top layers only when their structure/open state changes.
  const observer=new MutationObserver(records=>{if(records.some(record=>record.type==='attributes'||[...record.addedNodes,...record.removedNodes].some(node=>node.nodeType===1&&(node.tagName==='DIALOG'||node.querySelector?.('dialog'))))){stack();if(visible)schedule();}});
  observer.observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['open','data-motion']});
  return()=>{abort.abort();observer.disconnect();resizeObserver.disconnect();cancelAnimationFrame(measureFrame);hide();for(const key of ['--world-native-cursor','--world-cursor-x','--world-cursor-y'])html.style.removeProperty(key);ring.remove();refreshRef.current=null;};
 },[canvasRef]);
 return null;
}
