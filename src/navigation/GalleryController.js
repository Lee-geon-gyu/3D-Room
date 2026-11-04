import {attachDragLook} from './DragLook.js';
import {galleryStart,galleryDestinations,galleryCanStand,galleryRoute,galleryAreaAt} from './galleryLayout.js';

export class GalleryController{
 constructor(canvas,camera,callbacks){
  this.canvas=canvas;this.camera=camera;this.callbacks=callbacks;this.position={...galleryStart};this.keys=new Set();this.path=[];this.paused=false;this.area=galleryAreaAt(galleryStart.x,galleryStart.z);this.touchMove={x:0,z:0};this.verticalOffset=0;this.verticalVelocity=0;this.eyeHeight=1.53;this.crouchActive=false;this.seatState=null;this.abort=new AbortController();
  const options={signal:this.abort.signal};
  window.addEventListener('keydown',e=>{if(this.paused||e.target?.closest?.('input,textarea,select,[role="dialog"],[contenteditable="true"]'))return;if(['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ShiftLeft','ShiftRight','Space','KeyC'].includes(e.code)){e.preventDefault();this.keys.add(e.code);if(this.seated&&['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))this.stand();if(!e.code.startsWith('Shift'))this.cancelRoute();if(e.code==='Space'&&!e.repeat)this.requestJump();if(e.code==='KeyC'&&!e.repeat)this.toggleCrouch();}},options);
  window.addEventListener('keyup',e=>this.keys.delete(e.code),options);window.addEventListener('blur',()=>{this.keys.clear();this.touchMove={x:0,z:0};this.touchRun=false;},options);
  this.look=attachDragLook(canvas,{signal:this.abort.signal,isPaused:()=>this.paused,onPointer:p=>this.pointer=p,onLook:(dx,dy)=>{this.cancelRoute();this.position.yaw-=dx*.003;this.position.pitch=Math.max(-1.15,Math.min(1.1,this.position.pitch-dy*.0026));},onClick:(x,y)=>callbacks.onClick(x,y)});
  this.applyCamera();callbacks.onArea?.(this.area);callbacks.onRoute?.(false);
 }
 get seated(){return Boolean(this.seatState);}
 get swimming(){return false;}
 get motion(){return {feetY:this.verticalOffset,eyeY:this.eyeHeight+this.verticalOffset,verticalVelocity:this.verticalVelocity,inPool:false,underwater:false,seated:this.seated,crouching:this.crouchActive,sprinting:this.touchRun||this.keys.has('ShiftLeft')||this.keys.has('ShiftRight')||this.path.length>0,airborne:this.verticalOffset>.001};}
 applyCamera(){this.camera.position.set(this.position.x,this.eyeHeight+this.verticalOffset,this.position.z);this.camera.rotation.order='YXZ';this.camera.rotation.set(this.position.pitch,this.position.yaw,0);}
 setPaused(value){this.paused=value;this.keys.clear();this.touchMove={x:0,z:0};this.touchRun=false;if(value){this.look.cancel();this.cancelRoute();}}
 cancelRoute(){this.path=[];this.arrival=null;this.callbacks.onRoute?.(false);}
 guide(target,destination){if(this.paused)return;if(this.seated)this.stand();const end=destination??galleryDestinations[target];if(!end)return;this.target=target;this.destination=end;this.path=galleryRoute(this.position,end);this.callbacks.onRoute?.(this.path.length>0);}
 requestJump(){if(this.seated){this.stand();return;}if(this.verticalOffset===0)this.verticalVelocity=4.2;}
 toggleCrouch(){if(this.seated)return;this.crouchActive=!this.crouchActive;this.callbacks.onCrouch?.(this.crouchActive);}
 touchAction(action,active){if(this.paused)return;if(action==='run')this.touchRun=active;if(action==='jump'&&active)this.requestJump();if(action==='crouch'&&active)this.toggleCrouch();}
 canSit(seat){return !this.paused&&!this.seated&&Math.hypot(this.position.x-seat.approach.x,this.position.z-seat.approach.z)<2.8&&this.verticalOffset<.01;}
 sit(seat){if(!this.canSit(seat))return false;this.cancelRoute();this.seatState={standing:{...this.position},eye:this.eyeHeight};Object.assign(this.position,seat.pose);this.eyeHeight=1.24;this.applyCamera();this.callbacks.onSeated?.(true);return true;}
 stand(){if(!this.seatState)return false;Object.assign(this.position,this.seatState.standing);this.eyeHeight=this.seatState.eye;this.seatState=null;this.applyCamera();this.callbacks.onSeated?.(false);return true;}
 reset(){this.stand();this.cancelRoute();this.keys.clear();this.touchMove={x:0,z:0};this.touchRun=false;this.pointer=null;this.look.cancel();this.position={...galleryStart};this.area=galleryAreaAt(this.position.x,this.position.z);this.callbacks.onArea?.(this.area);this.verticalOffset=this.verticalVelocity=0;this.crouchActive=false;this.eyeHeight=1.53;this.callbacks.onCrouch?.(false);this.applyCamera();}
 step(dt){
  if(this.paused||this.seated)return;
  this.eyeHeight+=((this.crouchActive?.98:1.53)-this.eyeHeight)*(1-Math.exp(-dt*12));
  let dx=0,dz=0;
  if(this.path.length){const q=this.path[0],x=q.x-this.position.x,z=q.z-this.position.z,d=Math.hypot(x,z),s=Math.min(d,dt*3.2);dx=x/(d||1)*s;dz=z/(d||1)*s;const yaw=Math.atan2(-dx,-dz);this.position.yaw+=Math.atan2(Math.sin(yaw-this.position.yaw),Math.cos(yaw-this.position.yaw))*(1-Math.exp(-dt*7));this.position.pitch*=Math.exp(-dt*5);if(d<.04){this.path.shift();if(!this.path.length)this.arrival=this.destination;}}
  else if(this.arrival){const a=this.arrival,d=Math.atan2(Math.sin(a.yaw-this.position.yaw),Math.cos(a.yaw-this.position.yaw));this.position.yaw+=d*Math.min(dt*5,1);this.position.pitch+=(a.pitch-this.position.pitch)*Math.min(dt*5,1);if(Math.abs(d)<.005&&Math.abs(a.pitch-this.position.pitch)<.005){this.position.yaw=a.yaw;this.position.pitch=a.pitch;this.arrival=null;this.callbacks.onRoute?.(false);this.callbacks.onArrive?.(this.target);}}
  else{const k=this.keys;let f=Number(k.has('KeyW')||k.has('ArrowUp'))-Number(k.has('KeyS')||k.has('ArrowDown'))+this.touchMove.z,s=Number(k.has('KeyD')||k.has('ArrowRight'))-Number(k.has('KeyA')||k.has('ArrowLeft'))+this.touchMove.x;const n=Math.max(1,Math.hypot(f,s));f/=n;s/=n;const speed=dt*(this.crouchActive?.9:this.motion.sprinting?3.2:1.75),a=this.position.yaw;dx=(s*Math.cos(a)-f*Math.sin(a))*speed;dz=(-s*Math.sin(a)-f*Math.cos(a))*speed;}
  const count=Math.max(1,Math.ceil(Math.hypot(dx,dz)/.035));for(let i=0;i<count;i++){const p=this.position,x=p.x+dx/count,z=p.z+dz/count;if(galleryCanStand(x,z)){p.x=x;p.z=z;}else{if(galleryCanStand(x,p.z))p.x=x;if(galleryCanStand(p.x,z))p.z=z;}}
  if(this.verticalOffset>0||this.verticalVelocity>0){this.verticalVelocity-=10*dt;this.verticalOffset=Math.max(0,this.verticalOffset+this.verticalVelocity*dt);if(!this.verticalOffset)this.verticalVelocity=0;}
  const area=galleryAreaAt(this.position.x,this.position.z);if(area!==this.area){this.area=area;this.callbacks.onArea?.(area);}
  this.applyCamera();
 }
 dispose(){this.abort.abort();this.keys.clear();}
}
