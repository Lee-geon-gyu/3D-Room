// Yield between preparation jobs, allowing input and the loader to keep painting.
// No source texture, live render buffer or scene detail is reduced.
export async function yieldScenePreparation(signal){
 signal?.throwIfAborted();
 if(globalThis.scheduler?.yield)await globalThis.scheduler.yield();
 else await new Promise(resolve=>setTimeout(resolve,0));
 signal?.throwIfAborted();
}

export function sceneTextures(scene){
 const textures=new Set();
 const add=value=>{if(value?.isTexture&&!value.isRenderTargetTexture)textures.add(value);else if(Array.isArray(value))value.forEach(add);};
 add(scene.background);add(scene.environment);
 scene.traverse(object=>{
  if(object.isLight)add(object.map);
  for(const material of object.material?(Array.isArray(object.material)?object.material:[object.material]):[]){
   Object.values(material).forEach(add);
   for(const uniform of Object.values(material.uniforms??{}))add(uniform.value);
  }
 });
 return textures;
}

export async function prepareSceneGpu({renderer,scene,camera,target,signal,yieldTask=()=>yieldScenePreparation(signal),now=()=>performance.now()}){
 const started=now(),textures=sceneTextures(scene);let batch=started;
 for(const texture of textures){
  signal?.throwIfAborted();renderer.initTexture(texture);
  if(now()-batch>=8){await yieldTask();batch=now();}
 }
 await yieldTask();signal?.throwIfAborted();
 // Compile against the same HDR format used by the composer. Compiling against
 // the screen creates different tone-mapping/color-space shader variants.
 const previous=renderer.getRenderTarget(),warm=target.clone();warm.setSize(1,1);
 const culled=[];
 try{
  renderer.setRenderTarget(warm);
  await renderer.compileAsync(scene,camera);await yieldTask();signal?.throwIfAborted();
  // Upload every visible mesh's full vertex/index data before the tour starts,
  // including rooms outside the initial camera frustum. Only this disposable
  // preparation target is tiny; the live composer keeps its native resolution.
  scene.traverse(object=>{if(object.isMesh||object.isLine||object.isPoints||object.isSprite){culled.push([object,object.frustumCulled]);object.frustumCulled=false;}});
  renderer.render(scene,camera);
 }finally{
  for(const [object,value] of culled)object.frustumCulled=value;
  renderer.setRenderTarget(previous);warm.dispose();
 }
 await yieldTask();
 return {textures:textures.size,meshes:culled.length,ms:Math.round(now()-started)};
}
