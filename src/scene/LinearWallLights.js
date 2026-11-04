import {Group,BufferGeometry,Float32BufferAttribute,Mesh,ShaderMaterial,DoubleSide,Vector3} from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {lounge,subtractRect} from '../navigation/loungeLayout.js';
import lighting from './exterior-lighting.json' with {type:'json'};
import decor from './wall-decor.json' with {type:'json'};
import space from '../navigation/space-layout.json' with {type:'json'};

// Static wall-facing radiance, sharing the native recessed fixture paths.
// One draw, no animation or additional full-screen pass.
export function createLinearWallGlow(){
 const parts=[];
 for(const run of lighting.runs){
  const a=new Vector3(...run.a),b=new Vector3(...run.b),normal=new Vector3(...run.normal),tangent=b.clone().sub(a).normalize(),across=normal.clone().cross(tangent).normalize().multiplyScalar(.40);
  a.addScaledVector(normal,.016);b.addScaledVector(normal,.016);
  const p=[a.clone().sub(across),b.clone().sub(across),b.clone().add(across),a.clone().add(across)],g=new BufferGeometry();
  g.setAttribute('position',new Float32BufferAttribute(p.flatMap(v=>v.toArray()),3));g.setAttribute('uv',new Float32BufferAttribute([0,0,1,0,1,1,0,1],2));g.setAttribute('glowStyle',new Float32BufferAttribute([0,0,0,0],1));g.setIndex([0,1,2,0,2,3]);parts.push(g);
 }
 for(const [x,y,z,rotation]of [...decor.lamps.filter(p=>p[2]>.18),...decor.stairLamps]){
  const n=new Vector3(Math.sin(rotation),0,Math.cos(rotation)),side=new Vector3(n.z,0,-n.x).multiplyScalar(.60),center=new Vector3(x,y,z).addScaledVector(n,.018),up=new Vector3(0,1.48,0);
  const p=[center.clone().sub(side).sub(up),center.clone().add(side).sub(up),center.clone().add(side).add(up),center.clone().sub(side).add(up)],g=new BufferGeometry();
  g.setAttribute('position',new Float32BufferAttribute(p.flatMap(v=>v.toArray()),3));g.setAttribute('uv',new Float32BufferAttribute([0,0,1,0,1,1,0,1],2));g.setAttribute('glowStyle',new Float32BufferAttribute([1,1,1,1],1));g.setIndex([0,1,2,0,2,3]);parts.push(g);
 }
 // Warm light spilling from the two rooms, confined to their actual paving.
 // Reuse this static batch instead of adding shadow-casting realtime lights.
 for(const [y,back,front,ground]of [[lounge.floor+.020,-2,2.20,true],[space.upperFloor+.020,-1.8,2.47,false]]){
  for(const [l,r,b,f]of ground?subtractRect([-4.8,3.2,back,front],lounge.pit.bounds):[[-4.8,3.2,back,front]]){
   const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute([l,y,b,r,y,b,r,y,f,l,y,f],3));g.setAttribute('uv',new Float32BufferAttribute([(l+4.8)/8,(b-back)/(front-back),(r+4.8)/8,(b-back)/(front-back),(r+4.8)/8,(f-back)/(front-back),(l+4.8)/8,(f-back)/(front-back)],2));g.setAttribute('glowStyle',new Float32BufferAttribute([2,2,2,2],1));g.setIndex([0,1,2,0,2,3]);parts.push(g);
  }
 }
 const geometry=mergeGeometries(parts);parts.forEach(p=>p.dispose());
 const material=new ShaderMaterial({name:'Recessed_Linear_Wall_Spill',transparent:true,depthWrite:false,side:DoubleSide,toneMapped:false,vertexShader:'attribute float glowStyle;varying float vStyle;varying vec2 vGlow;void main(){vStyle=glowStyle;vGlow=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying float vStyle;varying vec2 vGlow;void main(){float x=abs(vGlow.y-.5)*2.;float glow=exp(-x*6.0)*(1.-smoothstep(.78,1.,x));float endFade=smoothstep(0.,.025,vGlow.x)*smoothstep(0.,.025,1.-vGlow.x);if(vStyle>.5){float height=abs(vGlow.y-.5)*2.,width=.08+height*.60;float across=abs(vGlow.x-.5)*2.;glow=exp(-pow(across/width,2.)*2.5)*exp(-height*2.2);endFade=1.-smoothstep(.78,1.,height);}if(vStyle>1.5){glow=smoothstep(0.,.10,vGlow.y)*exp(-vGlow.y*2.8)*smoothstep(0.,.15,vGlow.x)*smoothstep(0.,.15,1.-vGlow.x);endFade=1.-smoothstep(.75,1.,vGlow.y);}gl_FragColor=vec4(1.,.72,.38,(vStyle>1.5?.22:vStyle>.5?.60:.48)*glow*endFade);}'});
 const mesh=new Mesh(geometry,material);mesh.name='Continuous_Planter_And_Door_Wall_Glow';const group=new Group();group.add(mesh);return group;
}
