import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import {sceneTextures,prepareSceneGpu} from '../src/scene/prepareSceneGpu.js';

function fixture(){
 const scene=new THREE.Scene(),a=new THREE.Texture(),b=new THREE.Texture(),rt=new THREE.WebGLRenderTarget(1280,800,{type:THREE.HalfFloatType});
 const mesh=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.MeshBasicMaterial({map:a}));scene.add(mesh);
 const shader=new THREE.Mesh(new THREE.BoxGeometry(),new THREE.ShaderMaterial({uniforms:{shared:{value:a},list:{value:[b,rt.texture]}}}));shader.frustumCulled=false;scene.add(shader);
 const light=new THREE.SpotLight();light.map=b;scene.add(light);scene.environment=rt.texture;
 return {scene,a,b,rt,mesh,shader,dispose(){mesh.geometry.dispose();mesh.material.dispose();shader.geometry.dispose();shader.material.dispose();a.dispose();b.dispose();rt.dispose();}};
}

test('Preloads each shared image once, including shader arrays and light maps, without treating render targets as image textures',()=>{
 const f=fixture();try{assert.deepEqual([...sceneTextures(f.scene)],[f.a,f.b]);}finally{f.dispose();}
});

test('Preparation yields texture uploads, compiles the real HDR format and primes out-of-view geometry without changing live quality',async()=>{
 const f=fixture(),original={name:'live'},events=[];let current=original,time=0,warm,disposed=false;
 const renderer={initTexture(t){events.push(t);time+=9;},getRenderTarget:()=>current,setRenderTarget(t){current=t;},async compileAsync(){warm=current;assert.equal(current.texture.type,f.rt.texture.type);assert.equal(current.width,1);assert.equal(current.height,1);current.addEventListener('dispose',()=>{disposed=true;});},render(){assert.equal(f.mesh.frustumCulled,false);assert.equal(f.shader.frustumCulled,false);events.push('render');}};
 try{
  const result=await prepareSceneGpu({renderer,...f,camera:{},target:f.rt,now:()=>time,yieldTask:async()=>{events.push('yield');}});
  assert.deepEqual(events.slice(0,4),[f.a,'yield',f.b,'yield']);assert.ok(events.includes('render'));
  assert.equal(result.textures,2);assert.equal(result.meshes,2);assert.equal(f.mesh.frustumCulled,true);assert.equal(f.shader.frustumCulled,false);
  assert.equal(current,original);assert.notEqual(warm,f.rt);assert.equal(disposed,true);assert.equal(f.rt.width,1280);assert.equal(f.rt.height,800);
 }finally{f.dispose();}
});

test('A failed warmup restores culling and render state and disposes the temporary HDR target',async()=>{
 const f=fixture(),original={};let current=original,disposed=false;
 const renderer={initTexture(){},getRenderTarget:()=>current,setRenderTarget(t){current=t;},async compileAsync(){current.addEventListener('dispose',()=>{disposed=true;});},render(){throw new Error('context lost');}};
 try{await assert.rejects(prepareSceneGpu({renderer,...f,camera:{},target:f.rt,yieldTask:async()=>{}}),/context lost/);assert.equal(current,original);assert.equal(disposed,true);assert.equal(f.mesh.frustumCulled,true);assert.equal(f.shader.frustumCulled,false);}finally{f.dispose();}
});

test('An aborted load stops before rendering and restores the target while compilation completes safely',async()=>{
 const f=fixture(),abort=new AbortController(),original={};let current=original,rendered=false,disposed=false;
 const renderer={initTexture(){},getRenderTarget:()=>current,setRenderTarget(t){current=t;},async compileAsync(){current.addEventListener('dispose',()=>{disposed=true;});abort.abort();},render(){rendered=true;}};
 try{await assert.rejects(prepareSceneGpu({renderer,...f,camera:{},target:f.rt,signal:abort.signal,yieldTask:async()=>{}}),{name:'AbortError'});assert.equal(rendered,false);assert.equal(current,original);assert.equal(disposed,true);}finally{f.dispose();}
});
