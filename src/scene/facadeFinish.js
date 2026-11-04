import {BufferGeometry,BufferAttribute,Mesh} from 'three';
import {space,facadeFront} from '../navigation/layout.js';

// Courtyard copings share the roof height, but sit outside the house footprint.
export function onHouseRoof(x,y,z){
  const roof=space.upperRoof,left=space.westFacade.wallCenterX+space.westFacade.wallThickness/2,right=space.referenceFacade.upper.right;
  return y>=space.upperCeiling-.08&&y<=space.upperCeiling+space.upperRoofThickness+.015
    &&x>=left-.04&&x<=right+.04&&z>=roof.back-.04&&z<=facadeFront(x)+roof.frontOverhang+.04;
}

// The ground-floor exterior band and upper roof fascia share warm oak. Keep
// textures, both UV channels, normals, floor lighting and rail geometry intact.
export function prepareFacadeFinish(root){
  const additions=[];let triangles=0,oak=null,material=null;
  root.traverse(mesh=>{for(const mat of Array.isArray(mesh.material)?mesh.material:[mesh.material])if(mat?.name==='Warm_Oak')oak=mat;});
  if(!oak)throw new Error('The exterior timber needs the original Warm_Oak material.');
  root.traverse(mesh=>{
    if(!mesh.isMesh||Array.isArray(mesh.material)||!['Warm_Pale_Limestone','Exterior_Gloss_Black','Warm_Oak'].includes(mesh.material.name))return;
    const source=mesh.geometry,position=source.getAttribute('position'),index=source.index;
    const keep=[],band=[];
    for(let i=0;i<(index?.count??position.count);i+=3){
      const ids=[0,1,2].map(j=>index?index.getX(i+j):i+j);
      const facade=ids.every(id=>{
        const x=position.getX(id),y=position.getY(id),z=position.getZ(id);
        return x>=space.balconyFront[0][0]-.14&&x<=space.balconyFront[1][0]+.14&&y>=space.upperFloor-.605&&y<=space.upperFloor+.002&&Math.abs(z-facadeFront(x))<=.135;
      });
      const roof=ids.every(id=>{
        return onHouseRoof(position.getX(id),position.getY(id),position.getZ(id));
      });
      (facade||roof?band:keep).push(...ids);
    }
    if(!band.length)return;
    const rest=new BufferGeometry();for(const [name,attribute] of Object.entries(source.attributes))rest.setAttribute(name,attribute);rest.setIndex(keep);
    rest.boundingBox=source.boundingBox?.clone()??null;rest.boundingSphere=source.boundingSphere?.clone()??null;mesh.geometry=rest;
    const geometry=new BufferGeometry(),unique=[...new Set(band)],remap=new Map(unique.map((id,i)=>[id,i]));
    for(const [name,attribute] of Object.entries(source.attributes)){
      const values=new attribute.array.constructor(unique.length*attribute.itemSize);
      unique.forEach((id,i)=>{for(let j=0;j<attribute.itemSize;j++)values[i*attribute.itemSize+j]=attribute.array[id*attribute.itemSize+j];});
      geometry.setAttribute(name,new BufferAttribute(values,attribute.itemSize,attribute.normalized));
    }
    geometry.setIndex(band.map(id=>remap.get(id)));geometry.computeBoundingBox();geometry.computeBoundingSphere();
    // Fascia grain runs vertically like the existing room's timber cladding.
    // Leave baked irradiance UVs untouched while mapping the new visible finish.
    const timberUv=geometry.getAttribute('uv'),normals=geometry.getAttribute('normal'),points=geometry.getAttribute('position');
    if(timberUv)for(let i=0;i<points.count;i++){
      const x=points.getX(i),y=points.getY(i),z=points.getZ(i),nx=Math.abs(normals?.getX(i)??0),ny=Math.abs(normals?.getY(i)??0);
      timberUv.setXY(i,(nx>.65?z:x)*.75,(ny>.65?z:y)*.75);
    }
    if(!material){material=oak.clone();material.name='Exterior_Warm_Oak';material.userData.facadeBand=true;material.metalness=0;}
    const face=new Mesh(geometry,material);face.name='Continuous_Oak_Exterior_Trim';face.position.copy(mesh.position);face.quaternion.copy(mesh.quaternion);face.scale.copy(mesh.scale);
    additions.push({parent:mesh.parent,face});triangles+=band.length/3;
  });
  for(const {parent,face} of additions)parent.add(face);
  return {meshes:additions.length,triangles};
}

export function fillFacadeLight(shader){
  shader.fragmentShader=shader.fragmentShader.replace(
    'vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;',
    'vec3 totalDiffuse = max(reflectedLight.directDiffuse + reflectedLight.indirectDiffuse, material.diffuseContribution * vec3(0.78,0.65,0.49) * daylightFill);'
  );
}
