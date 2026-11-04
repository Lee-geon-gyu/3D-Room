// Mouse lock lets the browser restore its real pointer to the entry position.
// Touch and unsupported/denied requests retain ordinary captured dragging.
export function attachDragLook(canvas,{signal,isPaused,onPointer,onLook,onClick}){
 const doc=canvas.ownerDocument,win=doc?.defaultView??globalThis.window,options={signal};let drag=null,pending=null,disposed=false;
 if(signal.aborted)return {cancel(){}};
 const announce=(active,p)=>{if(typeof CustomEvent==='function')canvas.dispatchEvent(new CustomEvent('worldlookchange',{detail:{active,id:p.id,x:p.lastX,y:p.lastY,mouse:p.mouse,...(!active&&p.locked?{restored:true}:{})}}));};
 const unlock=()=>{if(doc?.pointerLockElement===canvas)doc.exitPointerLock?.();};
 const stopWatching=()=>{if(disposed&&!pending){doc?.removeEventListener('pointerlockchange',lockChanged);doc?.removeEventListener('pointerlockerror',lockFailed);}};
 function finish(event,activate=false){
  const p=drag;if(!p)return;
  if(p.mouse&&doc?.pointerLockElement===canvas)p.locked=true;
  if(p.locked){p.lastX=p.x;p.lastY=p.y;}else if(event){p.lastX=event.clientX;p.lastY=event.clientY;}
  drag=null;onPointer(null);unlock();announce(false,p);
  if(activate&&p.distance<=6&&!isPaused())onClick(p.lastX,p.lastY);
 }
 function lockChanged(){
  if(doc.pointerLockElement===canvas){
   const request=pending;pending=null;
   if(drag&&(!request||drag===request)&&!disposed&&!isPaused()){drag.locked=true;drag.lastX=drag.x;drag.lastY=drag.y;}
   else unlock();
  }else if(drag?.locked)finish(); // Esc/browser cancellation.
  stopWatching();
 }
 function lockFailed(){pending=null;stopWatching();}
 function requestLock(p){
  if(!p.mouse||!doc||!canvas.requestPointerLock||pending)return;
  pending=p;
  try{
   const request=canvas.requestPointerLock();
   request?.then(()=>{if(pending===p||doc.pointerLockElement===canvas)lockChanged();if(pending===p)lockFailed();}).catch(()=>{if(pending===p)lockFailed();});
  }catch{if(pending===p)lockFailed();}
 }
 const move=(p,dx,dy)=>{p.dx+=dx;p.dy+=dy;p.distance=Math.max(p.distance,Math.hypot(p.dx,p.dy));if(p.distance>6)onLook(dx,dy);};
 // These two listeners outlive disposal only while a request is unresolved,
 // so a late browser grant is released immediately, including legacy void APIs.
 doc?.addEventListener('pointerlockchange',lockChanged);
 doc?.addEventListener('pointerlockerror',lockFailed);
 canvas.addEventListener('pointerdown',event=>{
  if(isPaused()||event.button!==0||drag)return;
  const p=drag={x:event.clientX,y:event.clientY,lastX:event.clientX,lastY:event.clientY,dx:0,dy:0,distance:0,id:event.pointerId,mouse:event.pointerType==='mouse'};
  onPointer(p);canvas.setPointerCapture(event.pointerId);announce(true,p);requestLock(p);
 },options);
 canvas.addEventListener('pointermove',event=>{
  const p=drag;if(!p||isPaused()||(event.pointerId!==undefined&&event.pointerId!==p.id))return;
  if(p.mouse&&doc?.pointerLockElement===canvas)return; // Locked mousemove owns deltas.
  const dx=event.clientX-p.lastX,dy=event.clientY-p.lastY;p.lastX=event.clientX;p.lastY=event.clientY;
  move(p,dx,dy);
 },options);
 canvas.addEventListener('mousemove',event=>{
  const p=drag;if(!p?.mouse||isPaused()||doc?.pointerLockElement!==canvas)return;
  p.locked=true;move(p,event.movementX||0,event.movementY||0);
 },options);
 canvas.addEventListener('pointerup',event=>{if(drag&&(event.pointerId===undefined||event.pointerId===drag.id))finish(event,true);},options);
 win.addEventListener('mouseup',event=>{if(drag?.mouse&&event.button===0)finish(event,true);},options);
 canvas.addEventListener('pointercancel',event=>{if(drag&&(event.pointerId===undefined||event.pointerId===drag.id))finish();},options);
 canvas.addEventListener('lostpointercapture',event=>{if(!drag||(event.pointerId!==undefined&&event.pointerId!==drag.id))return;if(drag.mouse&&(pending===drag||doc?.pointerLockElement===canvas))return;finish();},options);
 win.addEventListener('blur',()=>finish(),options);
 doc?.addEventListener('visibilitychange',()=>{if(doc.hidden)finish();},options);
 signal.addEventListener('abort',()=>{disposed=true;finish();stopWatching();},{once:true});
 return {cancel:()=>finish()};
}
