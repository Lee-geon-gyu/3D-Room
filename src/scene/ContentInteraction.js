import * as THREE from 'three';
import {canInteract,ease,Presentation,visibleTargets} from './interactionModel.js';
import {DETAIL_HANDOFF} from './presentationMotion.js';
import {projectPresentationSurface} from './presentationSurface.js';
import {exhibitReaderBounds,exhibitFrame} from '../exhibitFormat.js';

export function createContentInteraction({camera,controller,entries,targets,callbacks,signal,reducedMotion}){
  const timeline=new Presentation(reducedMotion?.18:1.55),ray=new THREE.Raycaster();ray.firstHitOnly=true;
  const point=new THREE.Vector3(),direction=new THREE.Vector3(),offset=new THREE.Vector3(),hits=[];
  let nearby='',active=null,origin=null,destination=null,rest=null,revealed=false,frame=null;
  const readers=new Set();let enabled=true;
  function publish(value){frame=value;for(const reader of readers)reader(value);}
  function eligible(entry,targetsInView){
    if(!entry.root.visible||controller.seated||(entry.kind==='seat'&&!controller.canSit(entry.seat)))return false;
    point.copy(entry.proximity??entry.focus);entry.root.localToWorld(point);
    offset.subVectors(point,camera.position);const distance=offset.length();camera.getWorldDirection(direction);
    const facing=distance?direction.dot(offset)/distance:0;
    const floorDifference=entry.kind==='seat'?Math.min(Math.abs((controller.position.y??0)-entry.floor),Math.abs((controller.position.y??0)-entry.seat.seatTop)):Math.abs((controller.position.y??0)-entry.floor);
    if(!canInteract({distance,floorDifference,facing,visible:true,airborne:controller.verticalOffset>.025,inWater:controller.swimming}))return false;
    ray.set(camera.position,offset.normalize());ray.near=.03;ray.far=distance+.12;
    hits.length=0;ray.intersectObjects(targetsInView??visibleTargets(targets),false,hits);
    return hits[0]?.object.userData.contentId===entry.id;
  }
  // Hover feedback and activation share exactly the same access checks.
  function availableEntry(id){
    if(!enabled||controller.paused||timeline.phase!=='idle')return null;
    return entries.find(item=>item.id===id&&eligible(item))??null;
  }
  function begin(id=nearby){
    const entry=availableEntry(id);if(!entry)return false;
    if(entry.kind==='seat'){const seated=controller.sit(entry.seat);if(seated){nearby='';callbacks.onNearby?.('');}return seated;}
    if(!timeline.begin(id))return false;
    timeline.duration=reducedMotion?.18:entry.duration??1.55;
    active=entry;controller.setPaused(true);
    origin={position:camera.position.clone(),quaternion:camera.quaternion.clone()};
    point.copy(entry.focus);entry.root.localToWorld(point);
    let eye;
    if(entry.kind==='tablet')eye=point.clone().add(new THREE.Vector3(0,1.15,1.5).applyQuaternion(entry.root.getWorldQuaternion(new THREE.Quaternion())));
    else if(entry.kind==='card')eye=point.clone().add(new THREE.Vector3(.1,.88,1.35));
    else eye=origin.position.clone();
    const look=new THREE.Matrix4().lookAt(eye,point,new THREE.Vector3(0,1,0));destination={position:eye,quaternion:entry.kind==='project'?origin.quaternion.clone():new THREE.Quaternion().setFromRotationMatrix(look)};
    entry.root.updateWorldMatrix(true,false);
    rest={position:entry.root.position.clone(),quaternion:entry.root.quaternion.clone(),scale:entry.root.scale.clone(),visible:entry.root.visible,matrix:entry.root.matrix.clone(),autoUpdate:entry.root.matrixAutoUpdate};
    if(entry.kind==='project'){
      // Preserve the real world-space body while rotating it out of the skewed room.
      const world=entry.root.matrixWorld,x=new THREE.Vector3().setFromMatrixColumn(world,0),y=new THREE.Vector3().setFromMatrixColumn(world,1);
      const sx=x.length(),sy=y.length();x.normalize();y.normalize();
      const normal=new THREE.Vector3().crossVectors(x,y).normalize();
      const rotation=new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(x,y,normal));
      rest.rigid={position:entry.root.getWorldPosition(new THREE.Vector3()),rotation,sx,sy,depth:new THREE.Vector3().setFromMatrixColumn(world,2).applyQuaternion(rotation.clone().invert())};
      entry.root.matrixAutoUpdate=false;
    }
    revealed=false;
    nearby='';callbacks.onPresentation?.(entry.kind);callbacks.onNearby?.('');return true;
  }
  function restore(){
    active?.setPower?.(0);
    active?.setCover?.(0);
    active?.binding?.setReaderActive(false);
    if(active&&rest){active.root.position.copy(rest.position);active.root.quaternion.copy(rest.quaternion);active.root.scale.copy(rest.scale);active.root.matrix.copy(rest.matrix);active.root.matrixAutoUpdate=rest.autoUpdate;active.root.matrixWorldNeedsUpdate=true;active.root.visible=rest.visible;}
    if(origin){camera.position.copy(origin.position);camera.quaternion.copy(origin.quaternion);}
    active=null;origin=null;rest=null;destination=null;revealed=false;publish(null);timeline.reset();controller.setPaused(false);callbacks.onPresentation?.('');
  }
  function step(delta){
    if(timeline.phase==='idle')return;
    const event=timeline.step(delta);
    if(event==='restored'){restore();return;}
    const p=timeline.progress,approach=ease(p),reveal=ease((p-.16)/.84);
    if(active.kind!=='project'){
      camera.position.lerpVectors(origin.position,destination.position,approach);camera.quaternion.slerpQuaternions(origin.quaternion,destination.quaternion,approach);
    }
    active.setPower?.(ease((p-.22)/.6));
    active.setCover?.(ease((p-.22)/.46));
    if(['tablet','card','project'].includes(active.kind)){
      const project=active.kind==='project',lift=project?approach:active.setCover?ease(p/.68):reveal;
      const scale=active.root.parent.getWorldScale(new THREE.Vector3());
      const worldScale=Math.max(scale.x,scale.y,scale.z),width=(active.size?.width??.44)*(project?rest.rigid.sx:worldScale);
      const lens=2*Math.tan(THREE.MathUtils.degToRad(camera.fov/2));
      const viewport=camera.userData.presentationViewport??{width:720*camera.aspect,height:720};
      const aspect=project?width/((active.size?.height??exhibitFrame.height)*rest.rigid.sy):undefined;
      const box=project?exhibitReaderBounds(viewport.width,viewport.height,aspect):null;
      const distance=project?Math.max(width/(camera.aspect*box.width/viewport.width),(active.size?.height??exhibitFrame.height)*rest.rigid.sy/(box.height/viewport.height))/lens:active.kind==='tablet'?Math.max(.88,width*1.08/(lens*camera.aspect)):camera.aspect<.8?1.06:.83;
      const held=camera.position.clone().add(new THREE.Vector3(0,project?0:-.025,-distance).applyQuaternion(camera.quaternion));
      if(project){
        const rigid=rest.rigid,rotation=rigid.rotation.clone().slerp(camera.quaternion,lift);
        held.sub(rigid.depth.clone().multiplyScalar(exhibitFrame.surface).applyQuaternion(camera.quaternion));
        const position=rigid.position.clone().lerp(held,lift),world=new THREE.Matrix4().compose(position,rotation,new THREE.Vector3(rigid.sx,rigid.sy,1));
        const depth=rigid.depth.clone().applyQuaternion(rotation);world.elements[8]=depth.x;world.elements[9]=depth.y;world.elements[10]=depth.z;
        active.root.matrix.copy(active.root.parent.matrixWorld).invert().multiply(world);active.root.matrixWorldNeedsUpdate=true;
      }else{
        active.root.parent.worldToLocal(held);active.root.position.lerpVectors(rest.position,held,lift);
        const parentRotation=active.root.parent.getWorldQuaternion(new THREE.Quaternion()).invert(),heldRotation=parentRotation.multiply(camera.quaternion);
        heldRotation.multiply(new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),Math.PI/2));
        active.root.quaternion.slerpQuaternions(rest.quaternion,heldRotation,lift);active.root.scale.copy(rest.scale).multiplyScalar(active.kind==='card'?1+.4*reveal:1);
      }
    }
    // The same timeline drives the physical approach and the live reader.
    // Mount while still moving, then expand from the actual projected surface.
    const handoffStart=active.handoff??DETAIL_HANDOFF,handoff=p>=handoffStart;
    active.root.visible=rest.visible&&p<(active.binding?handoffStart:Math.min(1,handoffStart+.18));
    active.binding?.setReaderActive(handoff);
    const corners=projectPresentationSurface(active,camera);
    publish({id:active.id,kind:active.kind,phase:timeline.phase,progress:p,handoff:handoffStart,power:ease((p-.22)/.6),corners,aspect:rest.rigid?active.size.width*rest.rigid.sx/(active.size.height*rest.rigid.sy):undefined,binding:handoff?active.binding?.project(active.root,camera):undefined});
    const readerReady=p>=handoffStart-(active.binding?.04:0);
    if(readerReady&&!revealed&&timeline.phase!=='closing'){revealed=true;callbacks.onReveal?.(active.id,active.kind);}
    if(event==='open')callbacks.onOpen(active.id,active.kind);
  }
  function updateNearby(){
    if(!enabled||controller.paused||timeline.phase!=='idle')return;
    let closest='',distance=Infinity;const targetsInView=visibleTargets(targets);
    for(const entry of entries)if(eligible(entry,targetsInView)){point.copy(entry.proximity??entry.focus);entry.root.localToWorld(point);const d=point.distanceTo(camera.position);if(d<distance){distance=d;closest=entry.id;}}
    if(nearby!==closest){nearby=closest;callbacks.onNearby?.(closest);}
  }
  window.addEventListener('keydown',event=>{
    if(!enabled)return;
    if(!controller.paused&&controller.seated&&!event.repeat&&['KeyE','Escape'].includes(event.code)){event.preventDefault();controller.stand();return;}
    if(event.code==='Escape'&&timeline.phase==='opening'){event.preventDefault();timeline.close();}
    if(event.code==='KeyE'&&!event.repeat&&!event.target?.closest?.('input,textarea,select,dialog,[contenteditable="true"]')){if(begin()){event.preventDefault();}}
  },{signal});
  return {begin,canActivate:id=>Boolean(availableEntry(id)),step,updateNearby,eligible,
    setEnabled:value=>{enabled=value;if(!value){nearby='';callbacks.onNearby?.('');}},
    observe:reader=>{readers.add(reader);if(frame)reader(frame);return()=>readers.delete(reader);},
    close:()=>{if(timeline.phase==='idle')return false;timeline.close();return true;},reset:restore,get phase(){return timeline.phase;},get id(){return active?.id??'';}};
}
