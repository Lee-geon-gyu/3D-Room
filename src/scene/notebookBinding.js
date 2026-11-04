import * as THREE from 'three';
import lighting from './lighting-layout.json' with {type:'json'};

export const noteSize={width:.44,depth:.44*519/760,thickness:.009};
export const notePunch={x:-.208,z:-noteSize.depth/2+.013,radius:.0065};
// At the raised cover, the same slanted metal leg crosses slightly farther in.
export const noteCoverPunch={x:notePunch.x,z:notePunch.z+.0058,radius:.0074};
const radius=.023,tube=.0028;
// The front leg crosses the paper at the punch. The return leg is beyond its top edge.
const center=new THREE.Vector3(notePunch.x,noteSize.thickness+Math.sqrt(radius**2-.013**2),-noteSize.depth/2);
const light=new THREE.Vector3(-.45,.6,1).normalize(),glint=new THREE.Vector3(.6,-.1,1).normalize();
function silver(normal){
  const metal=Math.min(1,.24+.48*Math.max(0,normal.dot(light))+.16*Math.max(0,normal.dot(glint))**16+.06*(1-Math.abs(normal.z))**4);
  // Match the scene OutputPass ACES exposure before converting to SVG sRGB.
  const exposed=metal*lighting.exposure/.6;
  const value=THREE.MathUtils.clamp((exposed*(exposed+.0245786)-.000090537)/(exposed*(.983729*exposed+.432951)+.238081),0,1);
  return Math.round(255*(value<=.0031308?12.92*value:1.055*value**(1/2.4)-.055));
}
function clip(vertices,front){
  const result=[];
  for(let i=0;i<vertices.length;i++){
    const a=vertices[i],b=vertices[(i+1)%vertices.length],da=a.position.y-noteSize.thickness,db=b.position.y-noteSize.thickness;
    const inside=front?da>=0:da<=0,next=front?db>=0:db<=0;
    if(inside)result.push(a);
    if(inside!==next){const t=da/(da-db);result.push({position:a.position.clone().lerp(b.position,t),normal:a.normal.clone().lerp(b.normal,t).normalize()});}
  }
  return result;
}

export function createNotebookBinding(){
  // This exact geometry supplies both the world mesh and the live reader layers.
  const geometry=new THREE.TorusGeometry(radius,tube,10,48);geometry.rotateY(Math.PI/2);geometry.translate(...center.toArray());
  const material=new THREE.MeshBasicMaterial({color:0xffffff,toneMapped:false,fog:false});
  material.onBeforeCompile=shader=>{
    shader.vertexShader='varying vec3 vBindingNormal;\n'+shader.vertexShader.replace('#include <begin_vertex>','vBindingNormal=normalize(normalMatrix*normal);\n#include <begin_vertex>');
    shader.fragmentShader='varying vec3 vBindingNormal;\n'+shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
      vec3 n=normalize(vBindingNormal);
      float metal=.24+.48*max(0.0,dot(n,normalize(vec3(-.45,.6,1.0))))+.16*pow(max(0.0,dot(n,normalize(vec3(.6,-.1,1.0)))),16.0)+.06*pow(1.0-abs(n.z),4.0);
      diffuseColor.rgb=vec3(min(1.0,metal))/vec3(${lighting.grade.map(value=>Number(value).toFixed(6)).join(',')});
    `);
  };
  material.customProgramCacheKey=()=> 'notebook-neutral-silver-v1';
  const mesh=new THREE.Mesh(geometry,material);mesh.name='Contact_Note_Single_Ring';mesh.castShadow=mesh.receiveShadow=true;
  const position=geometry.attributes.position,normal=geometry.attributes.normal,index=geometry.index,triangles=[];
  for(let i=0;i<index.count;i+=3){
    const vertices=Array.from({length:3},(_,j)=>{const id=index.getX(i+j);return{position:new THREE.Vector3().fromBufferAttribute(position,id),normal:new THREE.Vector3().fromBufferAttribute(normal,id)};});
    for(const front of [false,true]){
      const polygon=clip(vertices,front);
      for(let j=1;j<polygon.length-1;j++)triangles.push({front,vertices:[polygon[0],polygon[j],polygon[j+1]]});
    }
  }
  const eye=new THREE.Vector3(),view=new THREE.Matrix4(),normalMatrix=new THREE.Matrix3();
  const faceNormal=new THREE.Vector3(),a=new THREE.Vector3(),b=new THREE.Vector3(),middle=new THREE.Vector3(),shadeNormal=new THREE.Vector3();
  let lastKey='',lastProjection;
  return {mesh,
    setReaderActive(value){mesh.visible=!value;},
    project(root,camera){
      root.updateWorldMatrix(true,false);camera.updateMatrixWorld(true);
      eye.copy(camera.position);root.worldToLocal(eye);
      view.multiplyMatrices(camera.matrixWorldInverse,root.matrixWorld);
      const key=view.elements.join(',');if(key===lastKey)return lastProjection;
      normalMatrix.getNormalMatrix(view);
      const layers={front:[],back:[]};
      for(const triangle of triangles){
        const vertices=triangle.vertices;
        a.subVectors(vertices[1].position,vertices[0].position);b.subVectors(vertices[2].position,vertices[0].position);faceNormal.crossVectors(a,b);
        middle.copy(vertices[0].position).add(vertices[1].position).add(vertices[2].position).multiplyScalar(1/3);
        if(faceNormal.dot(a.subVectors(eye,middle))<=0)continue;
        shadeNormal.set(0,0,0);for(const vertex of vertices)shadeNormal.add(vertex.normal);
        shadeNormal.applyMatrix3(normalMatrix).normalize();const color=silver(shadeNormal);
        const points=vertices.map(({position:p})=>{
          const t=(noteSize.thickness-eye.y)/(p.y-eye.y);
          return {u:(eye.x+(p.x-eye.x)*t)/noteSize.width+.5,v:(eye.z+(p.z-eye.z)*t)/noteSize.depth+.5};
        });
        layers[triangle.front?'front':'back'].push({points,color,depth:middle.distanceToSquared(eye)});
      }
      for(const layer of Object.values(layers))layer.sort((a,b)=>b.depth-a.depth);
      lastKey=key;lastProjection={...layers,width:noteSize.width,depth:noteSize.depth,punch:{u:notePunch.x/noteSize.width+.5,v:notePunch.z/noteSize.depth+.5,radius:notePunch.radius}};
      return lastProjection;
    },
  };
}
