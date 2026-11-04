import {Group,Mesh,BufferGeometry,Float32BufferAttribute,Vector2,Vector3,Triangle} from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {MeshBVH} from 'three-mesh-bvh';
import {space,facadeFront} from '../navigation/layout.js';

// Use the actual interior joinery dimensions: 43 mm boards, 78 mm pitch,
// 48 mm depth, on recessed oak. These are physical boards, not painted stripes.
export const facadeJoinery={width:.043,pitch:.078,depth:.048,bevel:.003};
export function facadeSlatRuns(){
 const {upperRoof:roof}=space,left=space.westFacade.wallCenterX+space.westFacade.wallThickness/2,right=space.balconyFront[1][0]+roof.eastOverhang;
 return [
  {name:'Lower',a:[space.balconyFront[0][0]+.025,facadeFront(space.balconyFront[0][0])+.124],b:[space.balconyFront[1][0]-.025,facadeFront(space.balconyFront[1][0])+.124],bottom:space.upperFloor-.573,top:space.upperFloor-.012},
  {name:'Upper',a:[left+.02,facadeFront(left)+roof.frontOverhang+.01],b:[right-.02,facadeFront(right)+roof.frontOverhang+.01],bottom:space.upperCeiling+.024,top:space.upperCeiling+space.upperRoofThickness-.008},
  {name:'Upper_Return',a:[right+.01,facadeFront(right)+roof.frontOverhang-.025],b:[right+.01,roof.back+.025],bottom:space.upperCeiling+.024,top:space.upperCeiling+space.upperRoofThickness-.008},
 ];
}

// Project the existing fascia's baked irradiance onto the new boards. The
// original atlas stays untouched and the trim keeps its real lighting location.
function bakedSampler(root){
 const positions=[],baked=[],vertex=new Vector3();
 root.traverse(mesh=>{
  if(mesh.name!=='Continuous_Oak_Exterior_Trim')return;
  const g=mesh.geometry,p=g.getAttribute('position'),uv=g.getAttribute('uv1'),index=g.index;
  if(!uv)return;
  for(let i=0;i<(index?.count??p.count);i+=3){
   const ids=[0,1,2].map(j=>index?index.getX(i+j):i+j);
   for(const id of ids){vertex.fromBufferAttribute(p,id).applyMatrix4(mesh.matrixWorld);positions.push(vertex.x,vertex.y,vertex.z);baked.push(uv.getX(id),uv.getY(id));}
  }
 });
 const geometry=new BufferGeometry();geometry.setAttribute('position',new Float32BufferAttribute(positions,3));geometry.setAttribute('uv1',new Float32BufferAttribute(baked,2));
 const tree=positions.length?new MeshBVH(geometry):null,triangle=new Triangle(),bary=new Vector3(),result=new Vector2(),uvs=[new Vector2(),new Vector2(),new Vector2()],target={point:new Vector3()};
 return {dispose:()=>geometry.dispose(),at(point){
  if(!tree?.closestPointToPoint(point,target))return result.set(.5,.5);
  const p=geometry.getAttribute('position'),uv=geometry.getAttribute('uv1'),ids=[0,1,2].map(i=>geometry.index.getX(target.faceIndex*3+i));
  [triangle.a,triangle.b,triangle.c].forEach((v,i)=>{v.fromBufferAttribute(p,ids[i]);uvs[i].fromBufferAttribute(uv,ids[i]);});triangle.getBarycoord(target.point,bary);
  return result.copy(uvs[0]).multiplyScalar(bary.x).addScaledVector(uvs[1],bary.y).addScaledVector(uvs[2],bary.z);
 }};
}

export function createFacadeSlats(root){
 if(root.getObjectByName('Interior_Matched_Facade_Slats'))return null;
 let oak;root.traverse(mesh=>{if(mesh.material?.name==='Warm_Oak')oak=mesh.material;});
 if(!oak)throw new Error('Facade joinery requires the original interior oak.');
 root.updateMatrixWorld(true);const sample=bakedSampler(root),boards=[],backs=[],point=new Vector3();let count=0;
 function finish(g){
  const p=g.getAttribute('position'),n=g.getAttribute('normal'),uv=g.getAttribute('uv'),baked=[];
  for(let i=0;i<p.count;i++){
   point.fromBufferAttribute(p,i);const atlas=sample.at(point);baked.push(atlas.x,atlas.y);
   uv.setXY(i,(Math.abs(n.getX(i))>.65?point.z:point.x)/1.7+.5,point.y/1.7+.5);
  }
  g.setAttribute('uv1',new Float32BufferAttribute(baked,2));return g;
 }
 for(const run of facadeSlatRuns()){
  const dx=run.b[0]-run.a[0],dz=run.b[1]-run.a[1],length=Math.hypot(dx,dz),nx=-dz/length,nz=dx/length,y=(run.bottom+run.top)/2,height=run.top-run.bottom,angle=-Math.atan2(dz,dx),slots=Math.round(length/facadeJoinery.pitch);
  const back=new RoundedBoxGeometry(length,height,.012,1,.002);back.rotateY(angle);back.translate((run.a[0]+run.b[0])/2+nx*.009,y,(run.a[1]+run.b[1])/2+nz*.009);backs.push(finish(back));
  for(let i=0;i<slots;i++){
   const t=(i+.5)/slots,g=new RoundedBoxGeometry(facadeJoinery.width,height,facadeJoinery.depth,1,facadeJoinery.bevel);
   g.rotateY(angle);g.translate(run.a[0]+dx*t+nx*.030,y,run.a[1]+dz*t+nz*.030);boards.push(finish(g));count++;
  }
 }
 const group=new Group();group.name='Interior_Matched_Facade_Slats';group.userData={slats:count,runs:3,...facadeJoinery};
 for(const [parts,recess] of [[boards,false],[backs,true]]){
  const material=oak.clone();material.name='Exterior_Warm_Oak';material.userData={...material.userData,facadeBand:true,facadeRecess:recess};
  const geometry=mergeGeometries(parts);parts.forEach(g=>g.dispose());geometry.computeBoundingBox();geometry.computeBoundingSphere();
  const mesh=new Mesh(geometry,material);mesh.name=recess?'Recessed_Oak_Facade_Backing':'Vertical_Interior_Oak_Facade_Boards';group.add(mesh);
 }
 sample.dispose();root.add(group);return group;
}
