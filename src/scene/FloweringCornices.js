import {Group,BufferGeometry,Float32BufferAttribute,MeshStandardMaterial,MeshBasicMaterial,ShaderMaterial,Mesh,InstancedMesh,Matrix4,Quaternion,Vector3,Color,DoubleSide,SphereGeometry,CylinderGeometry,BoxGeometry,PlaneGeometry} from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import garden from './garden-layout.json' with {type:'json'};
import {space,facadeFront} from '../navigation/layout.js';

function seeded(seed){return()=>{seed|=0;seed=seed+0x6D2B79F5|0;let n=Math.imul(seed^seed>>>15,1|seed);n=n+Math.imul(n^n>>>7,61|n)^n;return((n^n>>>14)>>>0)/4294967296;};}
const up=new Vector3(0,1,0),forward=new Vector3(0,0,1);

// Folded blades have an actual midrib, cupped sides and an arching tip.
// Three shapes distinguish upright foliage, round vines and fine fern leaflets.
function blade(kind='broad'){
 const positions=[],uvs=[],indices=[],steps=kind==='fine'?3:kind==='round'?5:8;
 for(let i=0;i<=steps;i++){
  const t=i/steps,width=Math.sin(Math.PI*t)**(kind==='round'?.58:.85)*(kind==='round'?.44:kind==='fine'?.23:.30);
  const arch=(kind==='broad'?.44:.10)*t*t,fold=Math.sin(Math.PI*t)*(kind==='broad'?.12:.06);
  positions.push(-width,t,arch,0,t,arch+fold,width,t,arch);
  uvs.push(0,t,.5,t,1,t);
  if(i<steps){const a=i*3;indices.push(a,a+3,a+1,a+1,a+3,a+4,a+1,a+4,a+2,a+2,a+4,a+5);}
 }
 const g=new BufferGeometry();g.setAttribute('position',new Float32BufferAttribute(positions,3));g.setAttribute('uv',new Float32BufferAttribute(uvs,2));g.setIndex(indices);g.computeVertexNormals();return g;
}

export function floweringPaths(){
 const {lower,upper}=space.referenceFacade,y=space.upperCeiling+space.upperRoofThickness+.015;
 return [
  {name:'Lower',a:[lower.left+.18,space.upperFloor+.035,lower.frontZ+.025],b:[lower.right-.18,space.upperFloor+.035,lower.frontZ+.025]},
  {name:'Upper',a:[upper.left+.18,y,upper.frontZ+.025],b:[upper.right-.08,y,upper.frontZ+.025]},
  {name:'Upper_Return',a:[upper.right-.08,y,upper.frontZ+.025],b:[upper.right-.08,y,space.upperClosure[3]+.06]},
 ];
}

// Match the preferred upper-story detail by measuring down from each timber
// band's top. The taller lower band therefore receives the same light inset.
export function corniceLightHeight(name){
 const top=name==='Lower'?space.upperFloor:space.upperCeiling+space.upperRoofThickness;
 return top-(space.upperRoofThickness-.006);
}

// Replace the old tangled balcony strip while leaving exterior-wall ivy intact.
export function retireCorniceIvy(root){
 let removed=0;root.updateMatrixWorld(true);
 root.traverse(mesh=>{
  if(mesh.name.includes('roof-cornice')){mesh.visible=false;return;}
  if(!mesh.isMesh)return;
  const geometry=mesh.geometry,positions=geometry.getAttribute('position'),index=geometry.index,keep=[],point=new Vector3();
  for(let i=0;i<(index?.count??positions.count);i+=3){
   const ids=[0,1,2].map(j=>index?index.getX(i+j):i+j);
   const cornice=ids.every(id=>{point.fromBufferAttribute(positions,id).applyMatrix4(mesh.matrixWorld);const formerFront=2.5-1.0077369870105815*(point.x+5.3)/7.833376827136342;return point.y>2.32&&point.y<4.27&&point.x>space.balconyFront[0][0]-.12&&point.x<space.balconyFront[1][0]+.12&&Math.min(Math.abs(point.z-facadeFront(point.x)),Math.abs(point.z-formerFront))<.47;});
   if(cornice)removed++;else keep.push(...ids);
  }
  if(keep.length<(index?.count??positions.count))geometry.setIndex(keep);
 });
 return removed;
}

export function createFloweringCornices({foliage}={}){
 const group=new Group();group.name='Flowering_Ceiling_Gardens';
 const growth=garden.floweringCornices,random=seeded(growth.seed),broad=[],round=[],fine=[],petals=[],centers=[],stems=[];
 const greens=growth.greens.map(c=>new Color(c));
 const blooms=growth.blooms.map(c=>new Color(c));
 const matrix=new Matrix4(),rotation=new Quaternion(),scale=new Vector3();
 const counts={upright:0,shrubs:0,ferns:0,vines:0};
 const photographed=[];let photographedGeometry,photographedMaterial;
 if(foliage){
  foliage.updateMatrixWorld(true);const parts=[];
  foliage.traverse(mesh=>{if(mesh.isMesh&&!Array.isArray(mesh.material)&&(/leaves/i.test(mesh.material.name)||/_plant$/.test(mesh.name))){parts.push(mesh.geometry.clone().applyMatrix4(mesh.matrixWorld));photographedMaterial=mesh.material;}});
  if(parts.length){
   photographedGeometry=mergeGeometries(parts);parts.forEach(g=>g.dispose());photographedGeometry.computeBoundingBox();
   const box=photographedGeometry.boundingBox,size=box.max.y-box.min.y;
   photographedGeometry.translate(-(box.min.x+box.max.x)/2,-box.min.y,-(box.min.z+box.max.z)/2);photographedGeometry.scale(1/size,1/size,1/size);
  }
 }
 function leaf(items,point,direction,length,width=1){
  rotation.setFromUnitVectors(up,direction.clone().normalize());
  rotation.multiply(new Quaternion().setFromAxisAngle(up,(random()-.5)*.75));
  matrix.compose(point,rotation,scale.set(length*width,length,length));
  items.push({matrix:matrix.clone(),color:greens[Math.floor(random()*greens.length)].clone().multiplyScalar(.84+random()*.30)});
 }
 function stem(a,b,radius=.002){
  const delta=b.clone().sub(a),length=delta.length();if(length<.0001)return;
  rotation.setFromUnitVectors(up,delta.normalize());matrix.compose(a.clone().add(b).multiplyScalar(.5),rotation,scale.set(radius,length,radius));stems.push({matrix:matrix.clone()});
 }
 function flower(point,normal,size=.046){
  const tilt=new Quaternion().setFromUnitVectors(forward,normal.clone().addScaledVector(up,.35).normalize()),spin=random()*Math.PI*2,color=blooms[Math.floor(random()*blooms.length)];
  for(let i=0;i<5;i++){
   rotation.copy(tilt).multiply(new Quaternion().setFromAxisAngle(forward,spin+i*Math.PI*2/5));
   matrix.compose(point,rotation,scale.set(size,size,size));petals.push({matrix:matrix.clone(),color});
  }
  matrix.compose(point.clone().addScaledVector(normal,.006),tilt,scale.set(size*.19,size*.19,size*.12));centers.push({matrix:matrix.clone()});
 }
 function upright(root,normal,along,size=1){
  counts.upright++;
  if(photographedGeometry){
   const height=(.50+random()*.20)*size;
   rotation.setFromAxisAngle(up,random()*Math.PI*2);matrix.compose(root.clone().addScaledVector(normal,-.07),rotation,scale.set(height*.68,height,height*.68));
   photographed.push({matrix:matrix.clone(),color:new Color().setScalar(.76+random()*.18)});
   for(let j=0;j<4;j++){const angle=j*1.7+random(),dir=along.clone().multiplyScalar(Math.sin(angle)*.65).addScaledVector(normal,Math.cos(angle)*.55).addScaledVector(up,1);leaf(broad,root.clone().addScaledVector(up,.08),dir,height*(.7+random()*.4),.34);}
   return;
  }
  for(let j=0;j<13;j++){
   const angle=j*2.399+random()*.45,length=(.28+random()*.32)*size;
   const dir=normal.clone().multiplyScalar(Math.cos(angle)*.75).addScaledVector(along,Math.sin(angle)*.85).addScaledVector(up,.75+random()*.75);
   const base=root.clone().addScaledVector(along,(random()-.5)*.12).addScaledVector(normal,-.07);
   const tip=base.clone().addScaledVector(dir.clone().normalize(),.12);stem(base,tip,.003);leaf(broad,tip,dir,length,.45+random()*.32);
  }
 }
 function shrub(root,normal,along){
  counts.shrubs++;
  for(let j=0;j<7;j++){
   const height=.34+random()*.38,end=root.clone().addScaledVector(up,height).addScaledVector(along,(random()-.5)*.35).addScaledVector(normal,-random()*.16);
   stem(root,end,.0028);
   for(let k=1;k<=8;k++){
    const p=root.clone().lerp(end,k/9),side=k%2?1:-1;
    const dir=along.clone().multiplyScalar(side*.8).addScaledVector(normal,(random()-.5)*.6).addScaledVector(up,.45+random()*.3);
    leaf(broad,p,dir,.075+random()*.075,.45);
   }
  }
 }
 function pothos(root,normal,along){
  counts.vines++;
  for(let j=0;j<5;j++){
   const drop=growth.drop[0]+random()*(growth.drop[1]-growth.drop[0]),phase=random()*6,drift=(random()-.5)*.24,steps=Math.ceil(drop/growth.leafSpacing);
   let previous=root.clone().addScaledVector(along,(j-2)*.055);
   for(let k=0;k<=steps;k++){
    const t=k/steps,p=root.clone().addScaledVector(along,(j-2)*.055+Math.sin(t*7+phase)*.055+drift*t).addScaledVector(normal,.08+Math.sin(t*Math.PI)*.12);p.y-=drop*t;
    stem(previous,p,.0017);previous=p;
    const side=k%2?1:-1,dir=along.clone().multiplyScalar(side*.70).addScaledVector(normal,.55).addScaledVector(up,-.45);
    leaf(round,p,dir,.085+(1-t)*.055,.80);
   }
  }
 }
 function fern(root,normal,along){
  counts.ferns++;
  for(let j=0;j<24;j++){
   const drop=.70+random()*.66,fan=(j-11.5)/11.5,phase=random()*3,depth=random()*.16,steps=20;let previous=root;
   for(let k=0;k<=steps;k++){
    const t=k/steps,p=root.clone().addScaledVector(along,fan*(.10+Math.sin(t*Math.PI)*.17)+Math.sin(t*5+phase)*.025).addScaledVector(normal,.11+depth+Math.sin(t*Math.PI)*.19);p.y+=.11*Math.sin(t*Math.PI)-drop*t;
    stem(previous,p,.0011);previous=p;
    for(const side of [-1,1]){
     const dir=along.clone().multiplyScalar(side*.55).addScaledVector(normal,.05+random()*.65).addScaledVector(up,-.45-random()*.36);
     leaf(fine,p.clone().addScaledVector(up,(random()-.5)*.04),dir,(.025+Math.sin(Math.PI*t)**.65*.065)*(.8+random()*.4),.40+random()*.3);
    }
   }
  }
 }
 const soils=[],strips=[],halos=[];
 for(const path of floweringPaths()){
  const a=new Vector3(...path.a),b=new Vector3(...path.b),along=b.clone().sub(a).normalize(),normal=new Vector3(-along.z,0,along.x),length=a.distanceTo(b);
  // Low, layered growth sits INSIDE the rim rather than hiding the wood fascia.
  const nodes=Math.ceil(length*growth.nodesPerMeter);
  for(let k=0;k<=nodes;k++){
   const root=a.clone().lerp(b,k/nodes).addScaledVector(normal,-.12);
   for(let j=0;j<growth.crownLeaves;j++){
    const p=root.clone().addScaledVector(along,(random()-.5)*.22).addScaledVector(normal,(random()-.5)*.20);p.y+=random()*.045;
    const angle=random()*Math.PI*2,dir=along.clone().multiplyScalar(Math.sin(angle)).addScaledVector(normal,Math.cos(angle)*.8).addScaledVector(up,.3+random()*.5);
    leaf(round,p,dir,.11+random()*.12,.8);
   }
  }
  const pockets=Math.ceil(length/growth.pocketSpacing);
  for(let k=0;k<=pockets;k++){
   const t=Math.max(.015,Math.min(.985,(k+.45*(random()-.5))/pockets)),root=a.clone().lerp(b,t).addScaledVector(normal,-.06);
   if(k%3===0)upright(root,normal,along);
   if(k%3===2)shrub(root,normal,along);
   if(k%3===1){upright(root,normal,along,.65);fern(root,normal,along);}else pothos(root,normal,along);
   if(k%3!==1)for(let j=0;j<(growth.flowersPerPocket??6);j++){
    const p=root.clone().addScaledVector(along,(random()-.5)*.32).addScaledVector(normal,.04+random()*.15);p.y+=.06+random()*.13;
    stem(root,p,.0017);flower(p,normal,.041+random()*.016);
   }
  }
  const yaw=Math.atan2(-along.z,along.x),soil=new BoxGeometry(length,.035,.22);soil.rotateY(yaw);soil.translate((a.x+b.x)/2-normal.x*.16,a.y-.065,(a.z+b.z)/2-normal.z*.16);soils.push(soil);
  // Warm concealed light follows both real story edges and their side return.
  const lightHeight=corniceLightHeight(path.name);
  const core=new BoxGeometry(length,.012,.014);core.rotateY(yaw);core.translate((a.x+b.x)/2+normal.x*.04,lightHeight,(a.z+b.z)/2+normal.z*.04);strips.push(core);
  const glow=new PlaneGeometry(length,.16);glow.rotateY(yaw);glow.translate((a.x+b.x)/2+normal.x*.048,lightHeight+.03,(a.z+b.z)/2+normal.z*.048);halos.push(glow);
 }
 const canopyFill={value:1},leafMaterial=new MeshStandardMaterial({name:'Cornice_Living_Green',color:0xffffff,roughness:.68,side:DoubleSide,emissive:0x1c2812,emissiveIntensity:.025});
 leafMaterial.onBeforeCompile=shader=>{
  shader.uniforms.canopyFill=canopyFill;
  shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec2 vLeafDetail; varying float vBotanicalY;').replace('#include <uv_vertex>','#include <uv_vertex>\nvLeafDetail=uv;vBotanicalY=(instanceMatrix*vec4(position,1.0)).y;');
  shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nuniform float canopyFill; varying vec2 vLeafDetail; varying float vBotanicalY;').replace('#include <color_fragment>',`#include <color_fragment>
   float midrib=exp(-abs(vLeafDetail.x-.5)*120.0);
   float veins=pow(max(0.0,sin(vLeafDetail.y*74.0-abs(vLeafDetail.x-.5)*32.0)),12.0);
   #ifndef CORNICE_PHOTO_LEAF
    diffuseColor.rgb*=.91+.07*veins+.12*midrib;
   #endif
  `).replace('#include <lights_fragment_end>',`#include <lights_fragment_end>
   reflectedLight.directDiffuse *= .38;
   reflectedLight.indirectDiffuse=mix(reflectedLight.indirectDiffuse,material.diffuseContribution*vec3(.64,.59,.32)*canopyFill,.78);
   float planterDistance=min(abs(vBotanicalY-5.700),abs(vBotanicalY-10.425));
   reflectedLight.indirectDiffuse+=material.diffuseContribution*vec3(.55,.36,.075)*exp(-planterDistance*4.0);`);
 };
 leafMaterial.customProgramCacheKey=()=> 'cornice-mixed-botanical-v4';
 group.userData.canopyFill=canopyFill;
 const flowerMaterial=new MeshStandardMaterial({name:'Cornice_Cream_Flowers',color:0xffffff,roughness:.82,side:DoubleSide,emissive:0x493a17,emissiveIntensity:.10});
 const stemMaterial=new MeshStandardMaterial({name:'Cornice_Connected_Stems',color:0x354024,roughness:.9}),heartMaterial=new MeshStandardMaterial({name:'Cornice_Pollen',color:0xb89a38,roughness:.9});
 for(const [name,geometry,material,items] of [['Stems',new CylinderGeometry(1,1,1,4),stemMaterial,stems],['Upright',blade(),leafMaterial,broad],['Vines',blade('round'),leafMaterial,round],['Ferns',blade('fine'),leafMaterial,fine],['Blossoms',blade('round'),flowerMaterial,petals],['Pollen',new SphereGeometry(1,6,4),heartMaterial,centers]]){
  const mesh=new InstancedMesh(geometry,material,items.length);mesh.name=`Cornice_${name}`;
  items.forEach((item,index)=>{mesh.setMatrixAt(index,item.matrix);if(item.color)mesh.setColorAt(index,item.color);});
  mesh.castShadow=name!=='Stems'&&name!=='Pollen';mesh.receiveShadow=true;mesh.computeBoundingBox();mesh.computeBoundingSphere();group.add(mesh);
 }
 if(photographedGeometry){
  const material=new MeshStandardMaterial({name:'Cornice_Photographed_Foliage',color:0xffffff,map:photographedMaterial.map,normalMap:photographedMaterial.normalMap,alphaTest:.42,roughness:.68,side:DoubleSide});
  material.defines={...material.defines,CORNICE_PHOTO_LEAF:1};
  material.onBeforeCompile=leafMaterial.onBeforeCompile;material.customProgramCacheKey=()=> 'cornice-photo-foliage-v4';
  const mesh=new InstancedMesh(photographedGeometry,material,photographed.length);mesh.name='Cornice_Photographed_Uprights';
  photographed.forEach((item,index)=>{mesh.setMatrixAt(index,item.matrix);mesh.setColorAt(index,item.color);});mesh.castShadow=true;mesh.receiveShadow=true;mesh.computeBoundingBox();mesh.computeBoundingSphere();group.add(mesh);
 }
 function merged(name,geometries,material){const mesh=new Mesh(mergeGeometries(geometries),material);geometries.forEach(g=>g.dispose());mesh.name=name;group.add(mesh);return mesh;}
 merged('Cornice_Recessed_Soil',soils,new MeshStandardMaterial({color:0x25231a,roughness:1}));
 merged('Cornice_Concealed_Warm_LED',strips,new MeshBasicMaterial({color:new Color().setRGB(2.8,1.3,.35),toneMapped:false}));
 merged('Cornice_Soft_LED_Graze',halos,new ShaderMaterial({transparent:true,depthWrite:false,side:DoubleSide,toneMapped:false,vertexShader:'varying vec2 vGlow; void main(){vGlow=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',fragmentShader:'varying vec2 vGlow;void main(){float glow=pow(max(0.0,1.0-abs(vGlow.y-.32)*2.0),2.0);gl_FragColor=vec4(1.0,.56,.20,glow*.24);}'}));
 group.userData.botanicalCounts={leaves:broad.length+round.length+fine.length,petals:petals.length,flowers:centers.length,...counts,photographedClumps:photographed.length};
 return group;
}
