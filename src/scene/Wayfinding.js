import * as THREE from 'three';
import {worldPoint} from '../navigation/coordinates.js';
import {clearSegment} from '../navigation/layout.js';
import {loungeGroundHeight} from '../navigation/loungeLayout.js';

// Round only collision-safe flat corners. Stairs retain their exact elevation;
// the tangent sampler below also turns their arrows smoothly between flights.
export function roundedWayfindingPath(path){
 if(path.length<3)return path;
 const result=[path[0]],distance=(a,b)=>{const p=worldPoint(a.x,0,a.z),q=worldPoint(b.x,0,b.z);return Math.hypot(p[0]-q[0],p[2]-q[2]);};
 const lerp=(a,b,t)=>({x:a.x+(b.x-a.x)*t,y:(a.y??0)+((b.y??0)-(a.y??0))*t,z:a.z+(b.z-a.z)*t});
 for(let i=1;i<path.length-1;i++){
  const a=path[i-1],b=path[i],c=path[i+1],before=distance(a,b),after=distance(b,c);let curve;
  const ground=[a,b,c].every(p=>Math.abs((p.y??0)-loungeGroundHeight(p.x,p.z))<.01);
  if(ground||Math.abs((a.y??0)-(b.y??0))<.01&&Math.abs((c.y??0)-(b.y??0))<.01){
   for(let cut=Math.min(.85,before*.32,after*.32);cut>.055;cut*=.5){
    const enter=lerp(b,a,cut/before),leave=lerp(b,c,cut/after),points=Array.from({length:9},(_,j)=>{const t=j/8,p=lerp(lerp(enter,b,t),lerp(b,leave,t),t);if(ground)p.y=loungeGroundHeight(p.x,p.z);return p;});
    if(points.every((point,j)=>clearSegment(j?points[j-1]:result.at(-1),point))&&clearSegment(points.at(-1),c)){curve=points;break;}
   }
  }
  if(curve)result.push(...curve);else result.push(b);
 }
 result.push(path.at(-1));return result;
}

export const navigationMotion={period:5.4,step:.10,maxSpread:1.15};

export function wayfindingMarkers(paths,spacing=1.3){
 const markers=[];
 for(const source of paths){
  const path=roundedWayfindingPath(source).map(p=>worldPoint(p.x,p.y??0,p.z)),lengths=[0];
  for(let i=1;i<path.length;i++)lengths.push(lengths.at(-1)+Math.hypot(path[i][0]-path[i-1][0],path[i][2]-path[i-1][2]));
  const at=distance=>{distance=Math.max(0,Math.min(lengths.at(-1),distance));const i=Math.max(1,lengths.findIndex((v,j)=>j>0&&v>=distance)),t=(distance-lengths[i-1])/(lengths[i]-lengths[i-1]||1);return path[i-1].map((v,k)=>v+(path[i][k]-v)*t);};
  let until=.5,travelled=0;
  for(let i=1;i<path.length;i++){
   const a=path[i-1],b=path[i];
   const dx=b[0]-a[0],dz=b[2]-a[2],length=Math.hypot(dx,dz);if(length<1e-6)continue;
   while(until<length){
    const t=until/length,position=[a[0]+dx*t,a[1]+(b[1]-a[1])*t,a[2]+dz*t];
    const behind=at(travelled+until-.72),ahead=at(travelled+until+.72),fx=ahead[0]-behind[0],fz=ahead[2]-behind[2],size=Math.hypot(fx,fz),forward=[fx/size,fz/size];
    if(!markers.some(m=>Math.hypot(m.position[0]-position[0],m.position[2]-position[2])<.48&&Math.abs(m.position[1]-position[1])<.25&&m.forward[0]*forward[0]+m.forward[1]*forward[1]>.8))markers.push({position,forward});
    until+=spacing;
   }
   until-=length;travelled+=length;
  }
 }
 return markers;
}
export function createWayfinding(paths,floors){
 const ray=new THREE.Raycaster(),down=new THREE.Vector3(0,-1,0),origin=new THREE.Vector3(),normal=new THREE.Vector3(),dummy=new THREE.Object3D();
 const shape=new THREE.Shape();shape.moveTo(0,.32);shape.lineTo(-.23,-.19);shape.lineTo(0,-.10);shape.lineTo(.23,-.19);shape.closePath();
 const geometry=new THREE.ExtrudeGeometry(shape,{depth:.012,bevelEnabled:true,bevelSegments:1,steps:1,bevelSize:.006,bevelThickness:.004});geometry.rotateX(-Math.PI/2);
 const group=new THREE.Group();group.name='Quest_Floor_Navigation';const capacity=256;
 geometry.setAttribute('navigationIndex',new THREE.InstancedBufferAttribute(Float32Array.from({length:capacity},(_,i)=>i),1));
 const uniforms={navigationTime:{value:0},navigationStep:{value:0},navigationReduced:{value:0}};
 // A thin raised arrow, white radiance and a quiet ground shadow keep the
 // racing-style direction readable on the original pale stone.
 for(const [scale,opacity,shadow] of [[1,.88,false],[1.18,.12,false],[1.48,.035,false],[1.10,.15,true]]){
  const material=new THREE.MeshBasicMaterial({color:shadow?0x171c25:new THREE.Color().setRGB(2.5,2.5,2.5),transparent:true,opacity,depthWrite:false,toneMapped:false,side:THREE.DoubleSide,blending:!shadow&&scale>1?THREE.AdditiveBlending:THREE.NormalBlending});
  material.userData.neonOpacity=opacity;
  material.customProgramCacheKey=()=>!shadow&&scale>1?'navigation-glow':'navigation-solid';
  // A travelling fade runs entirely on the GPU. White radiance is part of each
  // arrow throughout its reveal; the geometry never grows or changes shape.
  material.onBeforeCompile=shader=>{
   Object.assign(shader.uniforms,uniforms);
   shader.vertexShader=`attribute float navigationIndex;uniform float navigationTime,navigationStep,navigationReduced;varying float vNavigationReveal;\n${shader.vertexShader}`.replace('#include <begin_vertex>',`#include <begin_vertex>
    float age=navigationTime-navigationIndex*navigationStep;
    float phase=mod(max(age,0.),${navigationMotion.period.toFixed(1)});
    vNavigationReveal=mix(age<0.?0.:smoothstep(0.,2.1,phase)*(1.-smoothstep(2.9,${navigationMotion.period.toFixed(1)},phase)),.72,navigationReduced);`);
   shader.fragmentShader=`varying float vNavigationReveal;\n${shader.fragmentShader}`.replace('#include <color_fragment>','#include <color_fragment>\ndiffuseColor.a *= vNavigationReveal;');
  };
  const mesh=new THREE.InstancedMesh(geometry,material,capacity);mesh.name=shadow?'Arrow_Ground_Shadow':'White_Navigation_Arrow';mesh.count=0;mesh.userData.scale=scale;mesh.userData.shadow=shadow;mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);group.add(mesh);
 }
 let count=0,target=null,started=null;
 function setPath(nextPaths,nextTarget=null){
  const markers=wayfindingMarkers(nextPaths).filter(marker=>{
   origin.fromArray(marker.position);origin.y+=.4;ray.set(origin,down);ray.far=.85;
   const hit=ray.intersectObjects(floors,false).find(hit=>hit.face&&normal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld).y>.7);
   if(!hit)return false;marker.position[1]=hit.point.y+.10;return true;
  }).slice(0,capacity);
  count=markers.length;target=nextTarget;started=null;
  uniforms.navigationStep.value=Math.min(navigationMotion.step,navigationMotion.maxSpread/Math.max(1,count-1));
  for(const mesh of group.children){
   mesh.count=count;
   markers.forEach((marker,i)=>{dummy.position.fromArray(marker.position);if(mesh.userData.shadow)dummy.position.y-=.082;dummy.rotation.y=Math.atan2(-marker.forward[0],-marker.forward[1]);dummy.scale.set(mesh.userData.scale,1,mesh.userData.scale);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});
   mesh.instanceMatrix.needsUpdate=true;mesh.boundingSphere=null;mesh.computeBoundingSphere();
  }
  group.visible=count>0;
 }
 setPath(paths);
 return {group,get count(){return count;},get target(){return target;},setPath,update(time,visible,reduced=false){group.visible=visible&&count>0;if(!visible)return;if(started===null)started=time;uniforms.navigationTime.value=Math.max(0,time-started);uniforms.navigationReduced.value=reduced?1:0;}};
}
