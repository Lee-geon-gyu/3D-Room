import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {Reflector} from 'three/addons/objects/Reflector.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {UnrealBloomPass} from 'three/addons/postprocessing/UnrealBloomPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
import {SMAAPass} from 'three/addons/postprocessing/SMAAPass.js';
import {RectAreaLightUniformsLib} from 'three/addons/lights/RectAreaLightUniformsLib.js';
import {createGalleryArchitecture} from './GalleryArchitecture.js';
import {GalleryController} from '../navigation/GalleryController.js';
import {gallerySlots,galleryDestinations,galleryRoute,galleryDesk,galleryBenches} from '../navigation/galleryLayout.js';
import {createContentInteraction} from './ContentInteraction.js';
import {visibleTargets} from './interactionModel.js';
import {createDeskObjects,deskFaces} from './DeskObjects.js';
import {createExhibitBody} from './ExhibitFrame.js';
import {createGalleryAtmosphere} from './GalleryAtmosphere.js';
import {createGalleryLandscape} from './GalleryLandscape.js';
import {createMovementAudio} from '../audio/MovementAudio.js';
import {createPerformanceMeter,renderScale} from './performance.js';
import {prepareSceneGpu,yieldScenePreparation} from './prepareSceneGpu.js';
import {nextWayfindingTarget} from '../state/session.js';

const base=import.meta.env.BASE_URL,asset=p=>`${base}${p}`;
const image=url=>new Promise((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(new Error(`전시 이미지를 읽지 못했어요: ${url}`));i.src=url;});
function galleryPrint(project,photo,index){
 const c=document.createElement('canvas');c.width=1280;c.height=1696;const x=c.getContext('2d');
 x.fillStyle='#f1f0ed';x.fillRect(0,0,c.width,c.height);x.fillStyle='#5f605e';x.font='26px AtelierSans, sans-serif';x.fillText(`${String(index+1).padStart(2,'0')}  /  SELECTED WORK`,80,110);x.fillStyle='#1b1d1c';x.font='86px Georgia';x.fillText(project.title,80,275,1120);x.strokeStyle='#c9c8c4';x.beginPath();x.moveTo(80,330);x.lineTo(1200,330);x.stroke();
 const scale=Math.min(1120/photo.width,850/photo.height);x.drawImage(photo,(1280-photo.width*scale)/2,400+(850-photo.height*scale)/2,photo.width*scale,photo.height*scale);
 x.fillStyle='#343936';x.font='32px AtelierSans, sans-serif';x.fillText(project.category.toUpperCase(),80,1440,1120);x.fillStyle='#767a76';x.font='26px AtelierSans, sans-serif';x.fillText(project.tagline,80,1510,1120);
 const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;return texture;
}
export async function createScene(canvas,content,callbacks,signal){
 const started=performance.now(),renderer=new T.WebGLRenderer({canvas,antialias:false,powerPreference:'high-performance'});
 renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=.93;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFShadowMap;
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(61,1,.06,240),meter=createPerformanceMeter(renderer,canvas),audio=createMovementAudio(signal),clock=new T.Timer();clock.connect(document);
 const manager=new T.LoadingManager();manager.onProgress=(_,loaded,total)=>callbacks.onProgress({loaded,total,phase:'갤러리의 재료와 작품을 준비하고 있어요'});
 const tex=new T.TextureLoader(manager),draco=new DRACOLoader(manager);draco.setDecoderPath(asset('assets/draco/'));const gltf=new GLTFLoader(manager).setDRACOLoader(draco);
 let disposed=false,raf=0,controller,interaction,composer,pmrem,env,reflection,observer,viewed=new Set(),wayfindingEnabled=true,ending=false,hover='',lastPointer=null,quality=1;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const dispose=()=>{if(disposed)return;disposed=true;cancelAnimationFrame(raf);controller?.dispose();observer?.disconnect();clock.disconnect();audio.dispose();meter.dispose();composer?.passes.forEach(p=>p.dispose?.());composer?.dispose();reflection?.getRenderTarget().dispose();pmrem?.dispose();env?.dispose();draco.dispose();const gs=new Set(),ms=new Set(),ts=new Set();scene.traverse(o=>{if(o.geometry)gs.add(o.geometry);for(const m of o.material?(Array.isArray(o.material)?o.material:[o.material]):[]){ms.add(m);if(m.userData.finishNoise)ts.add(m.userData.finishNoise);Object.values(m).forEach(t=>{if(t?.isTexture)ts.add(t);});for(const u of Object.values(m.uniforms??{}))if(u.value?.isTexture&&!u.value.isRenderTargetTexture)ts.add(u.value);}});gs.forEach(g=>g.dispose());ms.forEach(m=>m.dispose());ts.forEach(t=>t.dispose());renderer.dispose();};signal.addEventListener('abort',dispose,{once:true});
 canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();callbacks.onError?.('그래픽 연결이 끊겼어요. 다시 불러오기를 눌러 주세요.');dispose();},{signal});
 try{
  const [mineral,skyPhoto,tree,prints,deskTextures,mineralNormal,marbleNormal,nero]=await Promise.all([
   tex.loadAsync(asset('assets/gallery/graphite-mineral-v3.png')),tex.loadAsync(asset('assets/gallery/blue-hour-panorama-v3.png')),gltf.loadAsync(asset('assets/runtime/tree.glb')),
   Promise.all(content.projects.map(p=>Promise.all([image(asset(p.representativeImage)),image(asset(p.logo))]))),
   Promise.all([deskFaces.profile,deskFaces.contact,deskFaces.coverTitle,deskFaces.tabletIdle].map(p=>tex.loadAsync(asset(p)))),
   tex.loadAsync(asset('assets/gallery/mineral-normal.webp')),tex.loadAsync(asset('assets/gallery/marble-normal.webp')),
   tex.loadAsync(asset('assets/gallery/nero-stone.png')),
  ]);
  signal.throwIfAborted();await document.fonts.ready;const assetMs=performance.now()-started;
  for(const [t,repeat]of [[mineral,1.6]]){t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.setScalar(repeat);t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());}
  for(const t of [mineralNormal,marbleNormal]){t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.setScalar(t===mineralNormal?1.6:.65);t.anisotropy=8;}
  nero.colorSpace=T.SRGBColorSpace;nero.wrapS=nero.wrapT=T.RepeatWrapping;nero.repeat.setScalar(.72);nero.anisotropy=8;
  const architecture=createGalleryArchitecture({mineral,mineralNormal,marbleNormal,nero,foliage:tree.scene});scene.add(architecture.group);
  const sky=createGalleryAtmosphere(skyPhoto);scene.add(sky.mesh);
  const landscape=createGalleryLandscape({mineral,mineralNormal,foliage:tree.scene,metal:architecture.metal,amber:architecture.amber});scene.add(landscape);
  pmrem=new T.PMREMGenerator(renderer);const roomEnvironment=new RoomEnvironment();env=pmrem.fromScene(roomEnvironment,.04);roomEnvironment.dispose();scene.environment=env.texture;scene.environmentIntensity=.24;
  scene.add(new T.HemisphereLight(0x8b9fb9,0x80603e,.48));
  const sun=new T.DirectionalLight(0xffcda4,.08);sun.position.set(-8,4,-30);sun.target.position.set(1,0,0);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-35,right:35,top:27,bottom:-27,near:1,far:100});sun.shadow.normalBias=.025;scene.add(sun,sun.target);
  RectAreaLightUniformsLib.init();
  for(const [p,w,h,intensity,rot,color]of [[[0,6.08,-8],12,32,.80,[-Math.PI/2,0,0],0xffdeb5],[[-6.4,3.8,-8],30,3.8,1.15,[0,Math.PI/2,0],0xffd8aa],[[19,6.05,1.5],14,14,.70,[-Math.PI/2,0,0],0xffe2bc],[[19,3,-5.8],15,5.4,.75,[0,Math.PI,0],0xbccbe0]]){const light=new T.RectAreaLight(color,intensity,w,h);light.position.fromArray(p);light.rotation.set(...rot);scene.add(light);}
  const spots=Array.from({length:4},()=>{const l=new T.SpotLight(0xffd3a3,28,9,.62,.75,2);l.castShadow=false;scene.add(l,l.target);return l;});
  const entries=[],targets=[...architecture.occluders],cues=new Map(),exhibits=[];
  for(const [index,project]of content.projects.entries()){
   const slot=gallerySlots[index%gallerySlots.length],texture=galleryPrint(project,prints[index][0],index);texture.anisotropy=8;
   const printMat=new T.MeshBasicMaterial({map:texture,toneMapped:false,color:0xf5f3ee});
   const {root,backing,print}=createExhibitBody(slot,architecture.metal,printMat);root.position.set(slot.x,slot.y,slot.z);root.rotation.y=slot.rotation;root.name=`Gallery_Exhibit_${project.id}`;
   print.position.z=.029;print.userData.contentId=project.id;backing.userData.contentId=project.id;const display=new T.Group();display.name=`Gallery_Page_${Math.floor(index/gallerySlots.length)}`;display.add(root);scene.add(display);targets.push(print,backing);
   // A fine champagne edge, rather than a saturated blue surround, matches the gallery.
   const cue=new T.Group(),cm=new T.MeshBasicMaterial({color:new T.Color(1.4,.91,.43),toneMapped:false,transparent:true,opacity:.55});
   for(const [x,y,w,h]of [[-slot.width/2-.018,0,.009,slot.height+.045],[slot.width/2+.018,0,.009,slot.height+.045],[0,-slot.height/2-.018,slot.width+.045,.009],[0,slot.height/2+.018,slot.width+.045,.009]]){const m=new T.Mesh(new T.PlaneGeometry(w,h),cm);m.position.set(x,y,.052);cue.add(m);}root.add(cue);cues.set(project.id,{group:cue,material:cm});
   const p=new T.Mesh(new T.BoxGeometry(slot.width+.12,.035,.055),architecture.amber);p.position.set(0,slot.height/2+.065,-.015);root.add(p);
   entries.push({id:project.id,kind:'project',root,floor:0,size:slot,focus:new T.Vector3(0,0,.035)});exhibits.push({display,root,page:Math.floor(index/gallerySlots.length)});
   // Titles and VIEW labels sit on the actual stone below each framed work.
   const c=document.createElement('canvas');c.width=1536;c.height=680;const ctx=c.getContext('2d');ctx.fillStyle='#eee9df';ctx.font='70px AtelierSans, sans-serif';ctx.fillText(project.title,24,100,1450);ctx.fillStyle='#c1b8a9';ctx.font='34px AtelierSans, sans-serif';ctx.fillText(project.category.toUpperCase(),24,225,1450);ctx.fillText('UX / UI DESIGN',24,285);ctx.font='40px AtelierSans, sans-serif';ctx.fillText('VIEW  →',24,510);
   const map=new T.CanvasTexture(c);map.colorSpace=T.SRGBColorSpace;map.anisotropy=8;const plaque=new T.Mesh(new T.PlaneGeometry(slot.width,1.0),new T.MeshBasicMaterial({map,transparent:true,toneMapped:false}));plaque.position.set(0,-slot.height/2-.60,.018);plaque.userData.contentId=project.id;root.add(plaque);targets.push(plaque);

  }
  const deskObjects=createDeskObjects({profileScreen:deskTextures[0],contactFace:deskTextures[1],contactTitle:deskTextures[2],tabletIdle:deskTextures[3]},0);
  for(const [i,e]of deskObjects.entries()){e.root.position.fromArray(i?galleryDesk.notebook:galleryDesk.tablet);e.root.rotation.y=i?.06:-.06;e.floor=0;e.proximity=new T.Vector3(0,.025,0);e.cue.material.color.setRGB(1.4,.91,.43);entries.push(e);targets.push(...e.meshes);cues.set(e.id,e.cue);scene.add(e.root);}
  const firstBench=galleryBenches[0],benchSeat={id:'terrace-bench',floor:0,seatTop:.55,approach:{x:firstBench.x,z:firstBench.z+1.2},pose:{x:firstBench.x,y:0,z:firstBench.z,yaw:0,pitch:0}};
  const seatRoot=new T.Mesh(new T.BoxGeometry(3.2,.08,1.0),new T.MeshBasicMaterial({visible:false}));seatRoot.position.set(firstBench.x,.55,firstBench.z);seatRoot.userData.contentId=benchSeat.id;scene.add(seatRoot);targets.push(seatRoot);entries.push({id:benchSeat.id,kind:'seat',root:seatRoot,floor:0,seat:benchSeat,focus:new T.Vector3()});
  const ray=new T.Raycaster(),pointer=new T.Vector2();const pick=(x,y)=>{const r=canvas.getBoundingClientRect();pointer.set((x-r.left)/r.width*2-1,-(y-r.top)/r.height*2+1);ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(visibleTargets(targets),false)[0],id=hit?.object.userData.contentId;return id&&interaction?.canActivate(id)?id:'';};
  let galleryPage=0;const galleryPageCount=Math.max(1,Math.ceil(content.projects.length/gallerySlots.length));
  function setGalleryPage(page){galleryPage=Math.max(0,Math.min(galleryPageCount-1,page));for(const item of exhibits){item.display.visible=item.root.visible=item.page===galleryPage;}callbacks.onGallery?.({page:galleryPage,total:galleryPageCount,count:content.projects.length});}
  let guidedProject='';
  const nextWork=()=>{const i=Math.max(0,content.projects.findIndex(p=>!viewed.has(p.id))),s=gallerySlots[i%gallerySlots.length];return {page:Math.floor(i/gallerySlots.length),id:content.projects[i].id,pose:{x:s.x+(s.rotation<0?-1.95:s.rotation>0?1.95:0),y:0,z:s.z+(s.rotation===0?2.15:0),yaw:s.rotation,pitch:.48}};};
  controller=new GalleryController(canvas,camera,{...callbacks,onClick:(x,y)=>{const id=pick(x,y);if(id)interaction.begin(id);},onArrive:target=>{interaction.updateNearby();if(target==='gallery'||target==='library')interaction.begin(target==='gallery'?'profile':'contact');else if(target==='atelier')interaction.begin(guidedProject);}});
  controller.setPaused(true); // The loader hands control over at the doorway.
  interaction=createContentInteraction({camera,controller,entries,targets,callbacks,signal,reducedMotion:reduced});
  canvas.addEventListener('pointermove',e=>lastPointer={x:e.clientX,y:e.clientY},{signal});canvas.addEventListener('pointerleave',()=>lastPointer=null,{signal});
  setGalleryPage(0);
  const target=new T.WebGLRenderTarget(1,1,{type:T.HalfFloatType});composer=new EffectComposer(renderer,target);composer.addPass(new RenderPass(scene,camera));composer.addPass(new UnrealBloomPass(new T.Vector2(1,1),.28,.45,1.35));composer.addPass(new SMAAPass());composer.addPass(new OutputPass());
  // One cached, reduced-size reflection gives the large stone floor real depth.
  const reflectionOutline=new T.Shape();for(const [i,[x,z]]of [[-7,-26],[7,-26],[7,3.5],[11,3.5],[11,-6],[27,-6],[27,10],[11,10],[11,7.5],[7,7.5],[7,10],[-7,10]].entries()){if(i===0)reflectionOutline.moveTo(x,-z);else reflectionOutline.lineTo(x,-z);}reflectionOutline.closePath();reflection=new Reflector(new T.ShapeGeometry(reflectionOutline),{color:0x7e7770,textureWidth:768,textureHeight:512,clipBias:.003});reflection.rotation.x=-Math.PI/2;reflection.position.set(0,.001,0);reflection.material.transparent=true;reflection.material.depthWrite=false;reflection.material.fragmentShader=reflection.material.fragmentShader.replace('gl_FragColor = vec4( blendOverlay( base.rgb, color ), 1.0 );','gl_FragColor = vec4( blendOverlay( base.rgb, color ), 0.18 );');scene.add(reflection);
  const reflected=reflection.onBeforeRender;let reflectionTime=-Infinity;const lastEye=new T.Vector3(Infinity,0,0),lastTurn=new T.Quaternion();reflection.onBeforeRender=function(r,s,c){if(c!==camera)return;const now=performance.now(),moving=c.position.distanceToSquared(lastEye)>.0001||c.quaternion.angleTo(lastTurn)>.001;if(now-reflectionTime<1000/(moving?24:4))return;reflectionTime=now;lastEye.copy(c.position);lastTurn.copy(c.quaternion);reflected.call(this,r,s,c);};
  reflection.material.fragmentShader=reflection.material.fragmentShader.replace('0.18 );','0.11 );').replace('vec4 base = texture2DProj( tDiffuse, vUv );',`vec4 base=vec4(0.);for(int i=0;i<4;i++){vec4 p=vUv;p.xy+=vec2(i==0?-1.:i==1?1.:0.,i==2?-1.:i==3?1.:0.)*.0024*p.w;base+=texture2DProj(tDiffuse,p)*.25;}`);
  // Same on-floor guidance control, with paths computed against the new furniture.
  const arrowShape=new T.Shape();arrowShape.moveTo(0,-.18);arrowShape.lineTo(-.10,.10);arrowShape.lineTo(0,.04);arrowShape.lineTo(.10,.10);arrowShape.closePath();
  const ag=new T.ShapeGeometry(arrowShape);ag.rotateX(-Math.PI/2);const arrows=new T.InstancedMesh(ag,new T.MeshBasicMaterial({color:0xe5d7bd,transparent:true,opacity:.65,depthWrite:false}),80);arrows.count=0;scene.add(arrows);const dummy=new T.Object3D();
  let lastGuidanceKey='';
  function refreshWayfinding(){const target=nextWayfindingTarget(viewed,content.projects),name=target==='library'?'library':target==='gallery'?'gallery':'atelier';const key=`${target}:${nextWork().id}:${controller.position.x.toFixed(1)}:${controller.position.z.toFixed(1)}:${wayfindingEnabled}`;if(key===lastGuidanceKey)return;lastGuidanceKey=key;const path=target?galleryRoute(controller.position,name==='atelier'?nextWork().pose:galleryDestinations[name]):[];let from=controller.position,n=0;for(const to of path){const length=Math.hypot(to.x-from.x,to.z-from.z);for(let d=.7;d<length&&n<80;d+=1.1){dummy.position.set(from.x+(to.x-from.x)*d/length,.025,from.z+(to.z-from.z)*d/length);dummy.rotation.y=Math.atan2(-(to.x-from.x),-(to.z-from.z));dummy.updateMatrix();arrows.setMatrixAt(n++,dummy.matrix);}from=to;}arrows.count=n;arrows.instanceMatrix.needsUpdate=true;arrows.computeBoundingSphere();canvas.dataset.wayfinding=JSON.stringify({enabled:wayfindingEnabled,target,markers:n});}
  function resize(){const r=canvas.getBoundingClientRect(),scale=renderScale(r.width,r.height,devicePixelRatio)*quality;renderer.setPixelRatio(scale);renderer.setSize(r.width,r.height,false);composer.setPixelRatio(scale);composer.setSize(r.width,r.height);camera.aspect=r.width/r.height;camera.userData.presentationViewport={width:r.width,height:r.height};camera.updateProjectionMatrix();const t=reflection.getRenderTarget();t.setSize(Math.min(1024,Math.round(r.width*.65)),Math.min(768,Math.round(r.height*.65)));}
  observer=new ResizeObserver(resize);observer.observe(canvas);resize();refreshWayfinding();
  const compileStart=performance.now();callbacks.onProgress({stage:'prepare',phase:'조명과 전시 공간을 마무리하고 있어요'});await prepareSceneGpu({renderer,scene,camera,target:composer.renderTarget1,signal});signal.throwIfAborted();const compileMs=performance.now()-compileStart;renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
  const lightRecords=architecture.spotSources.map(s=>({...s,score:0}));let lastLights=-1,lastNearby=-1,lastGuide=-1,lastHover=-1;
  function render(){
   if(disposed)return;raf=requestAnimationFrame(render);clock.update();const raw=clock.getDelta(),dt=Math.min(raw,.2),time=clock.getElapsed();if(document.hidden)return;
   if(controller.paused&&['idle','reading'].includes(interaction.phase)){audio.update(controller.position,controller.motion,dt,false);return;}
   controller.step(dt);interaction.step(dt);
   if(!controller.paused&&time-lastNearby>.12){lastNearby=time;interaction.updateNearby();}
   sky.update(dt,reduced);
   if(time-lastLights>.35){lastLights=time;for(const s of lightRecords)s.score=(s.x-camera.position.x)**2+(s.z-camera.position.z)**2;lightRecords.sort((a,b)=>a.score-b.score);for(const [i,l]of spots.entries()){const s=lightRecords[i];l.position.set(s.x,s.y,s.z);l.target.position.fromArray(s.target);}}
   if(time-lastGuide>1.2&&!interaction.id){lastGuide=time;refreshWayfinding();}arrows.visible=wayfindingEnabled&&!ending&&!interaction.id;
   for(const [id,cue]of cues){cue.group.visible=!viewed.has(id)&&!ending&&!interaction.id;cue.material.opacity=reduced?.5:.45+Math.sin(time*1.1)*.13;}
   if(controller.paused||ending||controller.pointer){if(hover){hover='';callbacks.onHover('');}}
   else if(lastPointer&&time-lastHover>.15){lastHover=time;const id=pick(lastPointer.x,lastPointer.y);if(id!==hover){hover=id;callbacks.onHover(id);}}
   audio.update(controller.position,controller.motion,dt,!controller.paused&&!ending);renderer.info.autoReset=false;renderer.info.reset();meter.begin();composer.render();meter.end(raw,quality,{position:controller.position,area:controller.area,presentation:interaction.phase,seated:controller.seated});
   canvas.dataset.gallery=JSON.stringify({style:'mineral-gallery',floor:0,exhibits:exhibits.length,desk:deskObjects.map(e=>({id:e.id,position:e.root.position.toArray()})),ending});
  }
  composer.render();meter.ready({readyMs:performance.now()-started,assetMs,compileMs});render();
  return {dispose,pause:value=>{if(value||interaction.phase==='idle')controller.setPaused(value);},setWayfinding:value=>{wayfindingEnabled=value;refreshWayfinding();},setViewed:value=>{viewed=value;refreshWayfinding();},setEnding:value=>{if(value)controller.cancelRoute();ending=value;interaction.setEnabled(!value);},interact:id=>interaction.begin(id),closeContent:()=>interaction.close(),observeContent:r=>interaction.observe(r),stand:()=>controller.stand(),galleryPage:offset=>{if(interaction.phase==='idle')setGalleryPage(galleryPage+offset);},guide:name=>{if(interaction.phase==='idle'){const next=nextWork();guidedProject=next.id;if(name==='atelier')setGalleryPage(next.page);controller.guide(name,name==='atelier'?next.pose:undefined);}},cancelGuide:()=>controller.cancelRoute(),touch:(x,z)=>{if(controller.paused)return;if(x||z){controller.cancelRoute();controller.stand();}controller.touchMove={x,z};},touchAction:(a,v)=>controller.touchAction(a,v),reset:()=>{ending=false;audio.reset();interaction.reset();controller.reset();setGalleryPage(0);refreshWayfinding();}};
 }catch(error){dispose();throw error;}
}
