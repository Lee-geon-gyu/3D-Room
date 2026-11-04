import * as THREE from 'three';

// Screen coordinates remain normalized so the reader can follow a resize too.
// Corner order is top-left, top-right, bottom-right, bottom-left.
export function projectPresentationSurface(entry,camera){
  const {width=.91,depth=.516,height=1.47,thickness=.018}=entry.size??{};
  const corners=entry.kind==='project'
    ?[[-width/2,height/2,.03],[width/2,height/2,.03],[width/2,-height/2,.03],[-width/2,-height/2,.03]]
    :[[-width/2,thickness,-depth/2],[width/2,thickness,-depth/2],[width/2,thickness,depth/2],[-width/2,thickness,depth/2]];
  entry.root.updateWorldMatrix(true,false);camera.updateMatrixWorld(true);
  return corners.map(corner=>{
    const point=entry.root.localToWorld(new THREE.Vector3(...corner)).project(camera);
    return {x:(point.x+1)/2,y:(1-point.y)/2};
  });
}
