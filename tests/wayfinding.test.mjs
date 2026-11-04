import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {wayfindingMarkers,roundedWayfindingPath,createWayfinding,navigationMotion} from '../src/scene/Wayfinding.js';
import {OUTDOOR,GALLERY,WORK_GUIDANCE,ATELIER,guideRoute,clearSegment,space} from '../src/navigation/layout.js';
import {worldPoint} from '../src/navigation/coordinates.js';

test('Floor markers follow segment direction and elevation without duplicating shared routes',()=>{
 const route=[{x:0,y:0,z:0},{x:0,y:0,z:3},{x:2,y:1,z:3}];
 const markers=wayfindingMarkers([route]),duplicated=wayfindingMarkers([route,route]);
 assert.deepEqual(markers,duplicated);assert.ok(markers.length>3);
 const turn=worldPoint(0,0,3);
 for(const marker of markers){
  assert.ok(Math.abs(Math.hypot(...marker.forward)-1)<1e-12);
  if(marker.position[2]>turn[2]-.001&&marker.forward[0]>.9)assert.ok(marker.position[1]>0&&marker.position[1]<worldPoint(2,1,3)[1]);
 }
});
test('Markers project onto rendered floors, use four shared instanced layers and toggle without rebuilding geometry',()=>{
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.MeshBasicMaterial());floor.rotation.x=-Math.PI/2;floor.updateMatrixWorld(true);
 const route=[{x:0,y:0,z:0},{x:0,y:0,z:4}],guide=createWayfinding([route],[floor]);
 try{
  assert.ok(guide.count>=3);assert.equal(guide.group.children.length,4);
  const geometry=guide.group.children[0].geometry;
  for(const mesh of guide.group.children){assert.equal(mesh.count,guide.count);assert.equal(mesh.geometry,geometry);assert.equal(mesh.material.depthWrite,false);}
  const opacity=guide.group.children[0].material.opacity;
  guide.update(.5,true);assert.equal(guide.group.visible,true);assert.equal(guide.group.children[0].material.opacity,opacity);
  guide.update(1,false);assert.equal(guide.group.visible,false);
  guide.update(0,true);assert.equal(guide.group.visible,true);
  guide.update(.8,true);assert.equal(guide.group.visible,true);assert.equal(guide.group.children[0].geometry,geometry);
  const matrix=new THREE.Matrix4();guide.group.children[0].getMatrixAt(0,matrix);assert.ok(Math.abs(matrix.elements[13]-.10)<1e-6);
  const instances=[...guide.group.children];guide.setPath([[{x:0,y:0,z:0},{x:0,y:0,z:2}]],'library');
  assert.equal(guide.target,'library');assert.ok(guide.count<3);assert.deepEqual(guide.group.children,instances);
  for(const mesh of guide.group.children.slice(0,3)){assert.equal(mesh.material.color.r,mesh.material.color.g);assert.equal(mesh.material.color.g,mesh.material.color.b);}
  guide.setPath([],null);guide.update(1,true);assert.equal(guide.group.visible,false);assert.equal(guide.count,0);assert.equal(guide.target,null);
  const absent=createWayfinding([route],[]);assert.equal(absent.count,0);absent.group.children[0].geometry.dispose();for(const mesh of absent.group.children)mesh.material.dispose();
 }finally{guide.group.children[0].geometry.dispose();for(const mesh of guide.group.children)mesh.material.dispose();floor.geometry.dispose();floor.material.dispose();}
});

test('Rounded profile guidance stays dry on the right bank and smoothly steers through corners',()=>{
 const path=[OUTDOOR,...guideRoute(OUTDOOR,GALLERY)],rounded=roundedWayfindingPath(path);
 assert.ok(rounded.length>path.length);assert.deepEqual(rounded[0],path[0]);assert.deepEqual(rounded.at(-1),GALLERY.y===undefined?{...GALLERY,y:0}:GALLERY);
 for(let i=1;i<rounded.length;i++){assert.ok(clearSegment(rounded[i-1],rounded[i]));const p=rounded[i];if(p.z>space.pool[2]&&p.z<space.pool[3])assert.ok(p.x>space.pool[1]);}
 const markers=wayfindingMarkers([path],.22);
 for(let i=1;i<markers.length;i++)assert.ok(markers[i-1].forward[0]*markers[i].forward[0]+markers[i-1].forward[1]*markers[i].forward[1]>.86,'neighboring arrows must turn gradually');
 const workPath=guideRoute(GALLERY,WORK_GUIDANCE);assert.ok(workPath.length);assert.equal(workPath.at(-1).x,WORK_GUIDANCE.x);assert.deepEqual(workPath.at(-1),ATELIER,'shortcut faces work one on the right wall');
});

test('GPU arrows stagger in route order, preserve radiance and reuse all buffers during animation',()=>{
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(40,40),new THREE.MeshBasicMaterial());floor.rotation.x=-Math.PI/2;floor.updateMatrixWorld(true);
 const guide=createWayfinding([[{x:0,z:0},{x:0,z:8}]],[floor]),mesh=guide.group.children[0],shader={uniforms:{},vertexShader:'#include <begin_vertex>',fragmentShader:'#include <color_fragment>'};
 mesh.material.onBeforeCompile(shader);assert.ok(shader.uniforms.navigationStep.value>0);assert.ok((guide.count-1)*shader.uniforms.navigationStep.value<=navigationMotion.maxSpread);
 guide.update(50,true);assert.equal(shader.uniforms.navigationTime.value,0);const geometry=mesh.geometry,buffer=mesh.instanceMatrix,version=buffer.version,opacity=mesh.material.opacity;
 guide.update(51,true);assert.equal(shader.uniforms.navigationTime.value,1);assert.equal(mesh.material.opacity,opacity);assert.equal(mesh.geometry,geometry);assert.equal(mesh.instanceMatrix,buffer);assert.equal(buffer.version,version);
 assert.match(shader.vertexShader,/navigationTime-navigationIndex\*navigationStep/);
 guide.update(52,true,true);assert.equal(shader.uniforms.navigationReduced.value,1);
 assert.notEqual(mesh.material.customProgramCacheKey(),guide.group.children[1].material.customProgramCacheKey());
 geometry.dispose();guide.group.children.forEach(m=>m.material.dispose());floor.geometry.dispose();floor.material.dispose();
});
