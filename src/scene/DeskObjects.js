import * as THREE from 'three';
import garden from './garden-layout.json' with {type:'json'};
import {lounge} from '../navigation/loungeLayout.js';
import {tabletWakeState} from './tabletWake.js';
import {createNotebookBinding,noteSize,notePunch,noteCoverPunch} from './notebookBinding.js';

// Captured from the actual DetailView, including its locally hosted font.
export const deskFaces={profile:'assets/desk/profile-screen-aligned.png',contact:'assets/desk/contact-face.svg',coverTitle:'assets/desk/letter-title.svg',tabletIdle:'assets/desk/tablet-idle.svg'};
const tabletSize={width:.91,depth:.516,thickness:.018,radius:.028};

function roundedShape(width,height,radius,hole){
  const shape=new THREE.Shape(),x=-width/2,y=-height/2;
  shape.moveTo(x+radius,y);shape.lineTo(x+width-radius,y);
  shape.quadraticCurveTo(x+width,y,x+width,y+radius);shape.lineTo(x+width,y+height-radius);
  shape.quadraticCurveTo(x+width,y+height,x+width-radius,y+height);shape.lineTo(x+radius,y+height);
  shape.quadraticCurveTo(x,y+height,x,y+height-radius);shape.lineTo(x,y+radius);
  shape.quadraticCurveTo(x,y,x+radius,y);
  if(hole){const cut=new THREE.Path();cut.absarc(hole.x,hole.y,hole.radius,0,Math.PI*2,true);shape.holes.push(cut);}
  return shape;
}
function roundedBody(width,depth,thickness,radius,material,hole){
  const geometry=new THREE.ExtrudeGeometry(roundedShape(width,depth,radius,hole),{depth:thickness,bevelEnabled:false,curveSegments:12});
  const mesh=new THREE.Mesh(geometry,material);mesh.rotation.x=-Math.PI/2;mesh.castShadow=true;mesh.receiveShadow=true;return mesh;
}
function face(texture,width,depth,y,radius=0,hole){
  texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=8;
  const geometry=radius?new THREE.ShapeGeometry(roundedShape(width,depth,radius,hole),12):new THREE.PlaneGeometry(width,depth);
  // ShapeGeometry uses world-space UVs; normalize them to the captured screen.
  if(radius){const uv=geometry.attributes.uv;for(let i=0;i<uv.count;i++)uv.setXY(i,uv.getX(i)/width+.5,uv.getY(i)/depth+.5);}
  const material=new THREE.MeshBasicMaterial({map:texture,toneMapped:false});
  const mesh=new THREE.Mesh(geometry,material);mesh.rotation.x=-Math.PI/2;mesh.position.y=y;return mesh;
}
function outline(parent,width,depth,y){
  const group=new THREE.Group(),material=new THREE.MeshBasicMaterial({color:new THREE.Color().setRGB(0,.4,3.2),toneMapped:false,transparent:true,depthWrite:false});
  for(const [x,z,w,d] of [[-width/2,0,.006,depth],[width/2,0,.006,depth],[0,-depth/2,width,.006],[0,depth/2,width,.006]]){
    const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,.002,d),material);mesh.position.set(x,y,z);group.add(mesh);
  }
  parent.add(group);return {group,material};
}
export function createDeskObjects({profileScreen,contactFace,contactTitle,tabletIdle},upperFloor){
  // Crop in UV space to the actual screen/card bounds of the 1280x720 capture.
  profileScreen.offset.set(0,0);profileScreen.repeat.set(1,1);
  contactFace.offset.set(0,0);contactFace.repeat.set(1,1);
  const graphite=new THREE.MeshStandardMaterial({color:0x151515,roughness:.3,metalness:.42});
  const tablet=new THREE.Group();tablet.name='Interactive_Profile_Tablet';tablet.position.fromArray(lounge.profile.tablet);tablet.rotation.y=lounge.profile.rotation;
  tablet.add(roundedBody(tabletSize.width,tabletSize.depth,tabletSize.thickness,tabletSize.radius,graphite));
  const screen=face(profileScreen,.884,.486,.0182,.016);screen.name='Profile_Tablet_Screen';screen.material.color.setScalar(0);tablet.add(screen);
  if(tabletIdle){tabletIdle.colorSpace=THREE.SRGBColorSpace;tabletIdle.anisotropy=8;}
  const idleMark=new THREE.Mesh(new THREE.PlaneGeometry(.10,.10/3),new THREE.MeshBasicMaterial({map:tabletIdle??null,transparent:true,depthWrite:false,toneMapped:false}));
  idleMark.name='Profile_Tablet_GYU';idleMark.rotation.x=-Math.PI/2;idleMark.position.y=.01845;tablet.add(idleMark);
  const wake=new THREE.Vector3(0,0,1);
  screen.material.onBeforeCompile=shader=>{
    shader.uniforms.tabletWake={value:wake};
    shader.vertexShader='varying vec2 vTabletUv;\n'+shader.vertexShader.replace('#include <uv_vertex>','#include <uv_vertex>\nvTabletUv=uv;');
    shader.fragmentShader='varying vec2 vTabletUv;\nuniform vec3 tabletWake;\n'+shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
      vec2 edge=abs(vTabletUv-vec2(.5));
      float mask=step(.0001,tabletWake.x)*(1.0-smoothstep(tabletWake.x*.5-.001,tabletWake.x*.5+.001,edge.x))*(1.0-smoothstep(tabletWake.y*.5-.001,tabletWake.y*.5+.001,edge.y));
      diffuseColor.rgb=mix(diffuseColor.rgb,vec3(1.0),tabletWake.z)*mask;
    `);
  };
  screen.material.customProgramCacheKey=()=> 'tablet-center-line-v1';
  const lens=new THREE.Mesh(new THREE.CircleGeometry(.0032,12),new THREE.MeshBasicMaterial({color:0x3c4146}));
  lens.rotation.x=-Math.PI/2;lens.position.set(0,.0183,-.25);tablet.add(lens);
  const tabletCue=outline(tablet,.922,.528,.019);
  const card=new THREE.Group();card.name='Interactive_Contact_Notebook';card.position.set(-2.8+garden.library.deskShift[0],upperFloor+.846,-1.45+garden.library.deskShift[1]);card.rotation.y=.08;
  const cardDepth=noteSize.depth;
  const hole={x:notePunch.x,y:-notePunch.z,radius:notePunch.radius};
  const paper=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.78});
  for(let i=0;i<3;i++){
    const page=roundedBody(.44,cardDepth,.0028,.008,paper,hole);page.position.y=i*.003;card.add(page);
  }
  const printedCard=face(contactFace,.438,cardDepth-.002,.009,.007,hole);printedCard.name='Contact_Note_Face';card.add(printedCard);
  // The punched cover follows the circular path of the single top-left ring.
  // Continue through a complete turn, settling the cover beneath the paper stack.
  const hinge=new THREE.Group();hinge.name='Contact_Note_Cover_Pivot';hinge.position.set(0,.034,-cardDepth/2+.013);card.add(hinge);
  const cover=new THREE.Group();cover.position.set(0,-.022,cardDepth/2-.013);hinge.add(cover);
  const coverStock=new THREE.MeshStandardMaterial({color:0x25332e,roughness:.86});
  const coverBody=roundedBody(.444,cardDepth+.004,.004,.008,coverStock,{x:noteCoverPunch.x,y:-noteCoverPunch.z,radius:noteCoverPunch.radius});coverBody.name='Contact_Note_Closed_Cover';cover.add(coverBody);
  const binding=createNotebookBinding();card.add(binding.mesh);
  if(contactTitle){
    contactTitle.colorSpace=THREE.SRGBColorSpace;contactTitle.anisotropy=8;
    const foil=new THREE.MeshStandardMaterial({map:contactTitle,color:0xddc58e,metalness:.45,roughness:.4,transparent:true,alphaTest:.01,depthWrite:false});
    const title=new THREE.Mesh(new THREE.PlaneGeometry(.245,.092),foil);
    title.name='Contact_Note_Cover_Title';title.rotation.x=-Math.PI/2;title.position.set(0,.0046,-.012);cover.add(title);
    const flourish=new THREE.Mesh(new THREE.BoxGeometry(.06,.0004,.0008),foil.clone());
    flourish.material.map=null;flourish.material.transparent=false;flourish.position.set(0,.0045,.052);cover.add(flourish);
  }
  const cardCue=outline(card,.452,cardDepth+.012,.017);
  const setCover=value=>{
    const turn=THREE.MathUtils.clamp(value,0,1),settle=THREE.MathUtils.smoothstep(turn,.5,1);
    hinge.rotation.x=turn>0?-Math.PI*2*turn:0;
    hinge.position.y=.034-.023*settle;
  };
  const entries=[
    {id:'profile',kind:'tablet',root:tablet,floor:lounge.floor,focus:new THREE.Vector3(0,.018,0),size:tabletSize,cue:tabletCue,setPower:value=>{const state=tabletWakeState(value);screen.material.color.setScalar(state.power);wake.set(state.width,state.height,state.line);idleMark.material.opacity=1-THREE.MathUtils.smoothstep(value,0,.18);}},
    {id:'contact',kind:'card',root:card,floor:upperFloor,focus:new THREE.Vector3(0,.009,0),size:noteSize,cue:cardCue,setCover,binding,handoff:.84,duration:2.8},
  ];
  for(const entry of entries){entry.meshes=[];entry.root.traverse(mesh=>{if(mesh.isMesh&&mesh.material!==entry.cue.material){mesh.userData.contentId=entry.id;entry.meshes.push(mesh);}});}
  return entries;
}
