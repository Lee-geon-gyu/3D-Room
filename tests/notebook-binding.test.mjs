import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createNotebookBinding,noteSize,notePunch,noteCoverPunch} from '../src/scene/notebookBinding.js';
import {bindingLayout} from '../src/ui/contactBinding.js';
import {projectPresentationSurface} from '../src/scene/presentationSurface.js';
import {quadTransform} from '../src/ui/contentMotion.js';

test('The silver ring actually threads the punch, with its return leg outside the top edge',()=>{
 const binding=createNotebookBinding(),geometry=binding.mesh.geometry,p=geometry.attributes.position;
 let throughPunch=0,outside=0;
 for(const [height,punch] of [[noteSize.thickness,notePunch],[.012,noteCoverPunch],[.016,noteCoverPunch]])for(let i=0;i<geometry.index.count;i+=3)for(let j=0;j<3;j++){
  const a=new THREE.Vector3().fromBufferAttribute(p,geometry.index.getX(i+j));
  const b=new THREE.Vector3().fromBufferAttribute(p,geometry.index.getX(i+(j+1)%3));
  if((a.y-height)*(b.y-height)>=0)continue;
  const crossing=a.clone().lerp(b,(height-a.y)/(b.y-a.y));
  if(crossing.z< -noteSize.depth/2){outside++;continue;}
  assert.ok(Math.hypot(crossing.x-punch.x,crossing.z-punch.z)<punch.radius,'metal may cross the sheet and closed cover only through their real punches');
  throughPunch++;
 }
 assert.ok(throughPunch>10&&outside>10,'both physical legs pass the paper plane');
 binding.mesh.geometry.dispose();binding.mesh.material.dispose();
});

function setup(){
 const binding=createNotebookBinding(),root=new THREE.Group();root.add(binding.mesh);
 root.position.set(-1.9,4.646,-1.45);root.rotation.y=.08;
 const parent=new THREE.Group();parent.matrixAutoUpdate=false;parent.matrix.set(1.12,0,.0504,0,0,1.12,0,0,0,0,1.06,0,0,0,0,1);parent.add(root);
 const camera=new THREE.PerspectiveCamera(57,1280/720,.06,130);camera.position.set(-1,6,.4);camera.lookAt(root.getWorldPosition(new THREE.Vector3()));camera.updateMatrixWorld(true);
 return{binding,root,camera};
}
test('Reader triangles begin on the exact same projected world geometry, without a shape switch',()=>{
 const {binding,root,camera}=setup(),data=binding.project(root,camera);
 assert.ok(data.front.length>0&&data.back.length>0);
 const corners=projectPresentationSurface({root,kind:'card',size:noteSize},camera);
 const all=[...data.front,...data.back].flatMap(triangle=>triangle.points);
 const vertices=binding.mesh.geometry.attributes.position;
 for(const box of [{width:760,height:519},{width:328,height:625}]){
  const layout=bindingLayout(data,box,0),matrix=quadTransform(corners,box.width,box.height);
  const local=[...layout.front,...layout.back].flatMap(triangle=>triangle.points);
  let compared=0;
  const eye=root.worldToLocal(camera.position.clone());
  for(let i=0;i<vertices.count;i+=7){
   const p=new THREE.Vector3().fromBufferAttribute(vertices,i),t=(noteSize.thickness-eye.y)/(p.y-eye.y);
   const u=(eye.x+(p.x-eye.x)*t)/noteSize.width+.5,v=(eye.z+(p.z-eye.z)*t)/noteSize.depth+.5;
   const at=all.findIndex(point=>Math.abs(point.u-u)<1e-7&&Math.abs(point.v-v)<1e-7);if(at<0)continue;
   const point=local[at],w=matrix[3]*point.x+matrix[7]*point.y+1;
   const rendered={x:(matrix[0]*point.x+matrix[4]*point.y+matrix[12])/w,y:(matrix[1]*point.x+matrix[5]*point.y+matrix[13])/w};
   const actual=root.localToWorld(p).project(camera);
   assert.ok(Math.abs(rendered.x-(actual.x+1)/2)<1e-6&&Math.abs(rendered.y-(1-actual.y)/2)<1e-6,'the scene torus and reader must occupy identical pixels at the handoff');compared++;
  }
  assert.ok(compared>20);
 }
 assert.equal(binding.project(root,camera),data,'a stationary reader reuses its geometry projection');
 root.position.x+=.1;assert.notEqual(binding.project(root,camera),data,'moving or resizing the held prop refreshes its projection');
});

test('Desktop and phone retain one ring profile and a circular transparent punch',()=>{
 const {binding,root,camera}=setup(),data=binding.project(root,camera);
 const layouts=[{width:760,height:519,y:100.5},{width:328,height:625,y:22.5}].map(box=>bindingLayout(data,box,1));
 const ratios=layouts.map(layout=>{
  assert.equal(layout.hole.rx,layout.hole.ry);assert.equal(layout.hole.x,22);
  assert.ok(layout.back.some(triangle=>triangle.points.some(point=>point.y<0)),'the rear leg must remain outside the top edge rather than ending on the sheet');
  const points=[...layout.front,...layout.back].flatMap(triangle=>triangle.points);
  const width=Math.max(...points.map(p=>p.x))-Math.min(...points.map(p=>p.x));
  const height=Math.max(...points.map(p=>p.y))-Math.min(...points.map(p=>p.y));return width/height;
 });
 assert.ok(Math.abs(ratios[0]-ratios[1])<1e-8,'responsive layout may scale the shared ring, but must never reshape it');
 const phone=bindingLayout(data,{width:328,height:625,y:22.5},1);
 const top=Math.min(...[...phone.front,...phone.back].flatMap(triangle=>triangle.points.map(point=>point.y)));
 assert.ok(top+22.5>=3.999,'the complete ring fits above the phone sheet');
});
