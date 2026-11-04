import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {space} from '../navigation/layout.js';
import {coveLayouts,coveDepth,coveLift} from '../navigation/coveLayout.js';
export {coveLayouts};

const indexed=(source,indices)=>{
 const geometry=new THREE.BufferGeometry();
 for(const [key,value]of Object.entries(source.attributes))geometry.setAttribute(key,value);
 geometry.setIndex(indices);geometry.computeBoundingBox();geometry.computeBoundingSphere();return geometry;
};
const points=(geometry,offset)=>[0,1,2].map(j=>{const id=geometry.index?geometry.index.getX(offset+j):offset+j;return new THREE.Vector3().fromBufferAttribute(geometry.attributes.position,id);});
const every=(p,test)=>p.every(test);

export function prepareRoomArchitecture(root){
 const report={removedLightTriangles:0,movedStudioVertices:0,silverTriangles:0};
 const silver=[];
 root.traverse(mesh=>{
  if(!mesh.isMesh||Array.isArray(mesh.material))return;
  let source=mesh.geometry;const name=mesh.material.name;
  // Remove only the visible old channels/housings. Their real illumination
  // remains in createScene's original ceilingGroups, with identical energy.
  const keep=[],drain=[];
  for(let i=0;i<(source.index?.count??source.attributes.position.count);i+=3){
   const p=points(source,i),ids=[0,1,2].map(j=>source.index?source.index.getX(i+j):i+j);
   const diffuser=['Ceiling_Opal','Ground_Ceiling_Opal','Studio_Ceiling_Opal'].includes(name);
   const housing=name==='Bronze'&&every(p,v=>(v.y>3.49&&v.y<3.9&&v.z<1.5)||(v.y>6.75&&v.y<6.81&&v.z<1.25));
   const grate=name==='Furniture_Graphite_Steel'&&every(p,v=>Math.abs(v.x-(space.pool[0]+space.pool[1])/2)<.19&&Math.abs(v.z-(space.pool[2]+space.pool[3])/2)<.19&&v.y<space.poolMotion.bottom+.035);
   if(diffuser||housing){report.removedLightTriangles++;continue;}
   if(grate){drain.push(...ids);report.silverTriangles++;continue;}
   keep.push(...ids);
  }
  if(keep.length<(source.index?.count??source.attributes.position.count))mesh.geometry=indexed(source,keep);
  if(drain.length){const material=mesh.material.clone();material.name='Pool_Brushed_Silver';material.color.set(0xd5d9df);material.metalness=.78;material.roughness=.26;silver.push(new THREE.Mesh(indexed(source,drain),material));}
  source=mesh.geometry;

 });
 for(const mesh of silver){mesh.name='Pool_Stainless_Drain';root.add(mesh);}
 return report;
}

function contour(left,right,back,front,radius){
 const points=[];
 for(const [x,z,angle]of [[right-radius,back+radius,-Math.PI/2],[right-radius,front-radius,0],[left+radius,front-radius,Math.PI/2],[left+radius,back+radius,Math.PI]])for(let i=0;i<=12;i++){const a=angle+i*Math.PI/24;points.push([x+Math.cos(a)*radius,z+Math.sin(a)*radius]);}
 return points;
}
function ring(outer,inner,y){
 const vertices=[],indices=[];
 for(let i=0;i<outer.length;i++)vertices.push(outer[i][0],y,outer[i][1],inner[i][0],y,inner[i][1]);
 for(let i=0;i<outer.length;i++){const a=i*2,b=((i+1)%outer.length)*2;indices.push(a,b,a+1,b,b+1,a+1);}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geometry.setAttribute('uv',new THREE.Float32BufferAttribute(outer.flatMap(()=>[0,0,0,1]),2));geometry.setIndex(indices);geometry.computeVertexNormals();return geometry;
}
function panel(path,y){
 const shape=new THREE.Shape(path.map(([x,z])=>new THREE.Vector2(x,-z))),geometry=new THREE.ShapeGeometry(shape,12);geometry.rotateX(-Math.PI/2);geometry.translate(0,y,0);return geometry;
}
function curvedFrame(outer,inner,y){
 const vertices=[],indices=[],segments=8,n=outer.length;
 for(let j=0;j<=segments;j++){const t=j/segments;for(let i=0;i<n;i++)vertices.push(THREE.MathUtils.lerp(outer[i][0],inner[i][0],t),y+coveLift*(1-t)**2,THREE.MathUtils.lerp(outer[i][1],inner[i][1],t));}
 for(let j=0;j<segments;j++)for(let i=0;i<n;i++){const a=j*n+i,b=j*n+(i+1)%n;indices.push(a,b,a+n,b,b+n,a+n);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(Array.from({length:vertices.length/3*2},()=>0),2));g.setIndex(indices);g.computeVertexNormals();return g;
}
export function createRoomDetails(root){
 const group=new THREE.Group();group.name='Refined_Cove_Ceilings_And_Studio';
 const finish=new THREE.MeshStandardMaterial({name:'Cove_Warm_Ivory',color:0xf2e4ce,roughness:.83,emissive:0xf2e4ce,emissiveIntensity:.38,side:THREE.DoubleSide});
 const inset=new THREE.MeshStandardMaterial({name:'Cove_Quiet_Stone',color:0xffffff,roughness:.88,emissive:0xffffff,emissiveIntensity:.48,side:THREE.DoubleSide});
 const opal=new THREE.MeshStandardMaterial({name:'Cove_Opal',color:0xfff9eb,emissive:0xfff4df,emissiveIntensity:1.55,roughness:.55,side:THREE.DoubleSide});
 const glowMaterial=new THREE.ShaderMaterial({name:'Cove_Soft_Radiance',transparent:true,side:THREE.DoubleSide,depthWrite:false,toneMapped:false,vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 vUv;void main(){float light=1.-smoothstep(0.,1.,vUv.y);gl_FragColor=vec4(vec3(1.,.97,.91),.36*light*light);}'});
 for(const layout of coveLayouts){
  const {name,left,right,back,front,y,inset:gap}=layout;
  const frameFinish=finish,recessFinish=inset;frameFinish.emissiveIntensity=.38;
  const outer=contour(left,right,back,front,.12),inner=contour(left+gap,right-gap,back+gap,front-gap,.30);
  const frame=new THREE.Mesh(curvedFrame(outer,inner,y),frameFinish);frame.name=`${name}_Cove_Frame`;frame.receiveShadow=true;group.add(frame);
  const recess=new THREE.Mesh(panel(inner,y+coveDepth),recessFinish);recess.name=`${name}_Cove_Recess`;recess.receiveShadow=true;group.add(recess);
  const thin=contour(left+gap+.026,right-gap-.026,back+gap+.026,front-gap-.026,.274);
  const rim=new THREE.Mesh(ring(inner,thin,y+.045),opal);rim.name=`${name}_Cove_Continuous_Light`;group.add(rim);
  // A continuous radial fade keeps the light bleed soft, without visible
  // opacity steps, a full-screen blur pass, another light or an animation loop.
  const a=.025,b=.17;
  const outside=contour(left+gap+a,right-gap-a,back+gap+a,front-gap-a,.30-a),inside=contour(left+gap+b,right-gap-b,back+gap+b,front-gap-b,.30-b);
  group.add(new THREE.Mesh(ring(outside,inside,y+coveDepth-.002),glowMaterial));
 }
 // Coalesce the static ceiling surfaces by material. No additional lights,
 // per-frame geometry work or full-screen passes are introduced.
 for(const material of [finish,inset,opal,glowMaterial]){
  const meshes=group.children.filter(mesh=>mesh.isMesh&&mesh.material===material);
  if(meshes.length<2)continue;
  const parts=meshes.map(mesh=>{mesh.updateMatrix();return mesh.geometry.clone().applyMatrix4(mesh.matrix);});
  const merged=new THREE.Mesh(mergeGeometries(parts),material);merged.name=`Merged_${material.name||'Cove_Radiance'}`;merged.castShadow=meshes.some(m=>m.castShadow);merged.receiveShadow=meshes.some(m=>m.receiveShadow);
  parts.forEach(g=>g.dispose());meshes.forEach(mesh=>{group.remove(mesh);mesh.geometry.dispose();});group.add(merged);
 }
 // Native closed aprons and the arch's inner return share the exact same
 // finish as the curved border. The white recessed fields remain separate.
 root.traverse(mesh=>{if(mesh.isMesh&&mesh.material?.name==='Continuous_Warm_Ceiling')mesh.material=finish;});
 return group;
}
