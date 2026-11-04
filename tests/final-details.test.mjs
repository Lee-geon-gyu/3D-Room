import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {createStudioSconce,studioSconceCenter} from '../src/scene/StudioSconce.js';
import {installFavicon} from '../src/ui/favicon.js';
import {readFileSync} from 'node:fs';

test('The single studio sconce mounts on the visible slats, ahead of the rear wall, with the original body proportions',()=>{
 const root=new THREE.Group(),oak=new THREE.MeshStandardMaterial({name:'Warm_Oak'});
 for(const x of [-5.30,-5.24]){const wall=new THREE.Mesh(new THREE.PlaneGeometry(3,5.3),oak);wall.rotation.y=Math.PI/2;wall.position.set(x,2.65,studioSconceCenter.z);root.add(wall);}
 const fixture=createStudioSconce(root);
 try{
  assert.ok(Math.abs(fixture.group.userData.wallX+5.24)<1e-5);
  assert.equal(fixture.group.position.z,studioSconceCenter.z);assert.equal(fixture.group.position.y,3.17);
  assert.ok(Math.abs(fixture.group.position.x-(fixture.group.userData.wallX+.065))<1e-5);
  const body=fixture.group.getObjectByName('Studio_Sconce_Body');body.geometry.computeBoundingBox();const size=body.geometry.boundingBox.getSize(new THREE.Vector3());
  assert.ok(Math.abs(size.x-.142)<1e-6);assert.ok(Math.abs(size.y-.33)<1e-6);
  assert.equal(fixture.group.children.length,3);assert.equal(fixture.light.castShadow,false);assert.equal(fixture.light.intensity,.95*.82);
 }finally{root.traverse(mesh=>mesh.geometry?.dispose());oak.dispose();fixture.group.traverse(mesh=>{mesh.geometry?.dispose();mesh.material?.dispose();});}
});

test('Both favicon variants share the exact traced LEE path and swap only when the color-scheme signal changes',()=>{
 const light=readFileSync(new URL('../public/favicon-light.svg',import.meta.url),'utf8'),dark=readFileSync(new URL('../public/favicon-dark.svg',import.meta.url),'utf8');
 assert.equal(light.match(/ d="([^"]+)"/)[1],dark.match(/ d="([^"]+)"/)[1]);assert.ok(light.includes('fill="#111111"'));assert.ok(dark.includes('fill="#ffffff"'));
 const scheme=Object.assign(new EventTarget(),{matches:false}),icon={};const stop=installFavicon({getElementById:()=>icon},scheme,'/portfolio/');
 assert.equal(icon.href,'/portfolio/favicon-light.svg');scheme.matches=true;scheme.dispatchEvent(new Event('change'));assert.equal(icon.href,'/portfolio/favicon-dark.svg');
 stop();scheme.matches=false;scheme.dispatchEvent(new Event('change'));assert.equal(icon.href,'/portfolio/favicon-dark.svg');
});

