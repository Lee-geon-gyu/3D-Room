import * as T from 'three';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';
import {galleryDesk,galleryEntrance as entry,galleryRoom,galleryLobby,galleryCorridor,gallerySlots,galleryBenches} from '../navigation/galleryLayout.js';
import {createFinishNoise,applyAgedFinish} from './agedMaterials.js';
import {createWoolTexture} from './wool.js';

// Closed architectural volumes, physical millimetre reveals and PBR surfaces.
// Static pieces batch by material; lights and the few animated objects stay separate.
export function createGalleryArchitecture({mineral,mineralNormal,marbleNormal,nero,foliage}){
 const group=new T.Group();group.name='Portfolio_Gallery';const staticMeshes=[],occluders=[],spotSources=[];
 const charcoal=new T.MeshStandardMaterial({name:'Gallery_Charcoal_Mineral',map:mineral,color:0x9b9890,roughness:.84});
 const polished=new T.MeshPhysicalMaterial({name:'Gallery_Polished_Basalt',map:nero,color:0x6a717c,roughness:.28,metalness:.10,clearcoat:.06,clearcoatRoughness:.45});
 const darkMarble=new T.MeshPhysicalMaterial({name:'Gallery_Nero_Marble',map:nero,color:0x747775,roughness:.38,metalness:.12,clearcoat:.35});
 darkMarble.specularIntensity=.24;polished.specularIntensity=.16;polished.envMapIntensity=.25;
 const metal=new T.MeshStandardMaterial({name:'Gallery_Blackened_Bronze',color:0x171715,roughness:.3,metalness:.82});
 const brass=new T.MeshStandardMaterial({name:'Gallery_Brushed_Champagne',color:0x9b805a,roughness:.35,metalness:.8});
 const wool=createWoolTexture();
 const linen=new T.MeshStandardMaterial({name:'Gallery_Charcoal_Mohair',map:wool,color:0x28292b,roughness:.98,bumpMap:wool,bumpScale:.003});
 const cream=new T.MeshStandardMaterial({name:'Gallery_Taupe_Upholstery',map:wool,color:0x555452,roughness:1,bumpMap:wool,bumpScale:.002});
 const ceiling=new T.MeshStandardMaterial({name:'Gallery_Bronzed_Ceiling',map:mineral,color:0xa29380,roughness:.94});
 const amber=new T.MeshBasicMaterial({name:'Gallery_Warm_Cove',color:new T.Color(1.5,.72,.23),toneMapped:false});
 const opal=new T.MeshBasicMaterial({name:'Gallery_Opal',color:new T.Color(1.6,.90,.38),toneMapped:false});
 const noise=createFinishNoise();
 for(const mat of [charcoal,ceiling,darkMarble,polished]){mat.onBeforeCompile=shader=>{applyAgedFinish(shader,'plaster',noise);shader.fragmentShader=shader.fragmentShader.replace('vec3(.88,.86,.82),vec3(1.04,1.03,1.00)','vec3(.82,.83,.84),vec3(1.08,1.07,1.05)');};mat.customProgramCacheKey=()=> 'gallery-world-mineral-v3';mat.userData.finishNoise=noise;}
 charcoal.normalMap=mineralNormal;charcoal.normalScale=new T.Vector2(.12,.12);charcoal.bumpMap=null;
 polished.normalMap=marbleNormal;polished.normalScale=new T.Vector2(.065,.065);
 function mesh(geo,mat,p=[0,0,0],rot=[0,0,0],name='Gallery_Detail',batch=true){const m=new T.Mesh(geo,mat);m.name=name;m.position.fromArray(p);m.rotation.set(...rot);m.castShadow=!mat.isMeshBasicMaterial;m.receiveShadow=true;group.add(m);if(batch)staticMeshes.push(m);return m;}
 function box(p,size,mat,bevel=0,name){return mesh(bevel?new RoundedBoxGeometry(...size,2,bevel):new T.BoxGeometry(...size),mat,p,undefined,name);}
 function rod(a,b,r,mat){const p=new T.Vector3(...a),q=new T.Vector3(...b),d=q.clone().sub(p),m=mesh(new T.CylinderGeometry(r,r,d.length(),10),mat,p.add(q).multiplyScalar(.5).toArray());m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d.normalize());return m;}
 function line(a,b,width=.015){return rod(a,b,width,amber);}
 function graze(p,size,rotation=[0,0,0],gain=.32){const material=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,toneMapped:false,vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:`varying vec2 v;void main(){float a=pow(1.-v.y,3.0)*${gain.toFixed(3)};gl_FragColor=vec4(1.,.57,.23,a);}`});return mesh(new T.PlaneGeometry(...size),material,p,rotation,'Concealed_Amber_Wash');}
 function text(lines,{width=2,height=3,font=50,align='left',color='#ddcfb6',background=null}={}){const c=document.createElement('canvas');c.width=1024;c.height=Math.round(1024*height/width);const x=c.getContext('2d');if(background){x.fillStyle=background;x.fillRect(0,0,c.width,c.height);}x.fillStyle=color;x.textAlign=align;x.textBaseline='top';for(const [i,line]of lines.entries()){x.font=`${font}px AtelierSans, sans-serif`;x.fillText(line,align==='center'?512:50,70+i*font*1.35,924);}const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;tex.anisotropy=8;return new T.MeshBasicMaterial({map:tex,transparent:!background,depthWrite:Boolean(background),toneMapped:false});}

 // Two complete rooms and a short enclosed corridor, all at one physical level.
 const glass=new T.MeshPhysicalMaterial({name:'Gallery_Smoked_Glass',color:0x94a3b0,roughness:.045,transparent:true,opacity:.075,metalness:.25,depthWrite:false});
 function floor(b){for(let z=b.back;z<b.front;z+=2)for(let x=b.left;x<b.right;x+=2){const right=Math.min(b.right,x+2),front=Math.min(b.front,z+2);box([(x+right)/2,-.055,(z+front)/2],[right-x-.004,.10,front-z-.004],polished,.006,'Jointed_Charcoal_Stone_Floor');}}
 function glazed(a,b,h=6.4){const center=new T.Vector3(...a).add(new T.Vector3(...b)).multiplyScalar(.5),length=Math.hypot(b[0]-a[0],b[2]-a[2]),angle=Math.atan2(-(b[2]-a[2]),b[0]-a[0]);const pane=box([center.x,h/2,center.z],[length,h,.018],glass);pane.rotation.y=angle;for(let t=0;t<=length+.01;t+=2.5){const u=Math.min(1,t/length);box([a[0]+(b[0]-a[0])*u,h/2,a[2]+(b[2]-a[2])*u],[.035,h,.045],metal);}rod([a[0],h,a[2]],[b[0],h,b[2]],.025,metal);}
 for(const b of [galleryRoom,galleryLobby,galleryCorridor])floor(b);
 // Long gallery: glazed bays alternate with solid exhibition piers on the left.
 box([0,3.2,10.10],[14,6.4,.20],charcoal);
 for(const [a,b]of [[-26,3.5],[7.5,10]])box([7.10,3.2,(a+b)/2],[.20,6.4,b-a],charcoal);
 box([7.10,5.325,5.5],[.20,2.15,4.0],charcoal);
 glazed([-7,0,-26],[-7,0,10]);glazed([-7,0,-26],[7,0,-26]);
 box([0,6.41,-8],[14,.20,36],ceiling);
 for(const slot of gallerySlots){box([slot.x<0?-6.83:6.83,3.2,slot.z],[.50,6.4,4.0],charcoal,.007,'Monolithic_Exhibition_Pier');line([slot.x<0?-6.565:6.565,.045,slot.z-2],[slot.x<0?-6.565:6.565,.045,slot.z+2],.009);}
 for(const x of [-6.87,6.87]){line([x,.045,-26],[x,.045,10],.009);line([x,6.29,-26],[x,6.29,10],.010);}
 line([-7,.045,-25.94],[7,.045,-25.94],.009);
 for(const x of [-3.7,3.7]){box([x,6.29,-8],[.08,.07,35.7],metal);for(let z=8;z>-25;z-=3.0){box([x,6.25,z],[.045,.045,.10],amber);rod([x,6.25,z],[x,6.04,z],.013,metal);const spot=mesh(new T.CylinderGeometry(.047,.045,.18,14),metal,[x,5.96,z]);spot.rotation.z=x<0?-.32:.32;mesh(new T.CircleGeometry(.036,16),opal,[x,5.86,z],[-Math.PI/2,0,0]);spotSources.push({x,y:5.88,z,target:[x<0?-6.55:6.55,3.1,z],intensity:24});}}
 for(const b of galleryBenches){box([b.x,.24,b.z],[3.3,.46,1.1],darkMarble,.015,'Stone_Gallery_Bench');box([b.x,.50,b.z],[3.28,.10,1.06],linen,.035,'Bench_Upholstery');line([b.x-1.58,.055,b.z+.565],[b.x+1.58,.055,b.z+.565],.007);}
 // A twisted bronze loop is real smooth geometry on a solid stone pedestal.
 box([3.7,.25,-23.5],[3.0,.50,2.4],darkMarble,.018,'Sculpture_Plinth');
 const curve=[];for(let i=0;i<96;i++){const t=i/96*Math.PI*2;curve.push(new T.Vector3(.65*Math.sin(t)*(1+.25*Math.cos(t)),1.3*Math.cos(t),.28*Math.sin(2*t)));}
 const sculpture=mesh(new T.TubeGeometry(new T.CatmullRomCurve3(curve,true),192,.22,18,true),new T.MeshPhysicalMaterial({name:'Satin_Bronze_Sculpture',color:0xa37d42,metalness:.88,roughness:.31,clearcoat:.22}),[3.7,2.05,-23.5],[0,.3,-.12]);
 // Enclosed passage compresses briefly before the long exhibition sightline.
 for(const z of [3.4,7.6])box([9,2.15,z],[4.2,4.3,.2],charcoal);
 box([9,4.30,5.5],[4.2,.20,4.2],ceiling);
 for(const z of [3.53,7.47]){line([7,.04,z],[11,.04,z],.009);line([7,4.17,z],[11,4.17,z],.010);}
 for(const x of [7.03,10.97])for(const z of [3.53,7.47])line([x,.05,z],[x,4.17,z],.008);
 // Lobby: glass panorama, quiet mineral planes and a huge circular skylight.
 box([19,3.2,10.10],[16,6.4,.20],charcoal);
 for(const [a,b]of [[-6,3.5],[7.5,10]])box([10.90,3.2,(a+b)/2],[.20,6.4,b-a],charcoal);
 box([10.90,5.325,5.5],[.20,2.15,4],charcoal);
 box([15,3.2,-6.10],[8,6.4,.20],charcoal);glazed([19,0,-6],[27,0,-6]);glazed([27,0,-6],[27,0,10]);
 for(const [a,b]of [[[11.13,.045,-6],[11.13,.045,3.45]],[[11.13,.045,7.55],[11.13,.045,9.95]],[[11,.045,9.96],[27,.045,9.96]],[[11,.045,-5.95],[27,.045,-5.95]],[[26.94,.045,-6],[26.94,.045,10]]])line(a,b,.010);
 graze([11.14,.90,-1.2],[9.4,1.8],[0,Math.PI/2,0],.35);graze([15,1.1,-5.975],[8,2.2],[0,0,0],.25);
 const lobbyCeiling=new T.Shape();lobbyCeiling.moveTo(11,-6);lobbyCeiling.lineTo(27,-6);lobbyCeiling.lineTo(27,10);lobbyCeiling.lineTo(11,10);lobbyCeiling.closePath();const well=new T.Path();well.absarc(19,1.5,3.65,0,Math.PI*2,true);lobbyCeiling.holes.push(well);
 const lobbyRoof=new T.ExtrudeGeometry(lobbyCeiling,{depth:.20,bevelEnabled:false,curveSegments:96});lobbyRoof.rotateX(Math.PI/2);lobbyRoof.translate(0,6.4,0);mesh(lobbyRoof,ceiling);
 const drumMat=new T.MeshStandardMaterial({map:mineral,color:0xc2b6a1,roughness:.9,side:T.DoubleSide});mesh(new T.CylinderGeometry(3.65,3.65,1.7,96,1,true),drumMat,[19,7.05,1.5]);
 const rim=mesh(new T.TorusGeometry(3.65,.018,8,128),amber,[19,6.39,1.5],[Math.PI/2,0,0]);
 mesh(new T.CylinderGeometry(3.64,3.64,1.0,96,1,true),glass,[19,8.4,1.5]);
 for(let i=0;i<16;i++){const a=i/16*Math.PI*2;rod([19+3.65*Math.cos(a),7.9,1.5+3.65*Math.sin(a)],[19+3.65*Math.cos(a),8.9,1.5+3.65*Math.sin(a)],.012,metal);}
 for(let i=0;i<44;i++){const a=i*2.39996,r=1.55*Math.sqrt((i+.5)/44),x=19+Math.cos(a)*r,z=1.5+Math.sin(a)*r,low=2.8+(Math.sin(i*1.93)+1)*.90;rod([x,8.0,z],[x,low,z],.008,brass);rod([x,low,z],[x,low+.46,z],.011,opal);}
 // Elliptical fluted reception desk: original readers stay on its left/right.
 const honedCounter=new T.MeshStandardMaterial({name:'Honed_Nero_Countertop',map:nero,color:0x343838,roughness:.72,metalness:.05,envMapIntensity:.03});
 for(const [y,h,r,mat]of [[.04,.08,2.6,brass],[.51,.86,2.6,darkMarble],[.96,.055,2.63,honedCounter]]){const d=mesh(new T.CylinderGeometry(r,r,h,128),mat,[19,y,1.5]);d.scale.z=galleryDesk.rz/galleryDesk.rx;}
 for(let i=0;i<24;i++){const a=i/24*Math.PI*2,x=19+Math.cos(a)*2.605,z=1.5+Math.sin(a)*1.655;rod([x,.20,z],[x,.93,z],.006,metal);}
 const deskHalo=mesh(new T.TorusGeometry(2.625,.011,6,128),amber,[19,.09,1.5],[Math.PI/2,0,0]);deskHalo.scale.y=galleryDesk.rz/galleryDesk.rx;
 const orb=mesh(new T.SphereGeometry(.15,28,16),new T.MeshStandardMaterial({color:0xe6d2b0,emissive:0xffd29d,emissiveIntensity:.35,roughness:.72}),galleryDesk.orb);
 for(let i=0;i<3;i++)box([galleryDesk.books[0],galleryDesk.books[1]+i*.027,galleryDesk.books[2]],[.38,.025,.28],i%2?brass:metal,.004);
 // Fine slab joints and larger honed stone panels follow the references.
 for(const y of [2.1,4.2]){box([19,y,9.985],[16,.006,.008],metal);box([15,y,-5.985],[8,.006,.008],metal);box([11.015,y,-1.2],[.008,.006,9.5],metal);}
 for(const z of [-5.9,-3.0,0,3.0])box([11.015,3.2,z],[.008,6.4,.006],metal);
 for(const x of [11,13.7,16.4,19.1,21.8,24.5,27])box([x,3.2,9.985],[.006,6.4,.008],metal);
 for(const slot of gallerySlots)for(const y of [1.6,3.2,4.8])box([slot.x<0?-6.574:6.574,y,slot.z],[.008,.006,3.99],metal);
 mesh(new T.PlaneGeometry(2.5,.55),text(['GALLERY  →'],{width:2.5,height:.55,font:110,align:'center'}),[11.02,4.65,5.5],[0,Math.PI/2,0]);
 // Lobby fixtures join the same four-light pool used by the gallery.
 for(const [x,z,target]of [[14,4.8,[11.05,2.8,2]],[13.4,-1,[11.05,2.8,-1]],[20.5,8.4,[19,2.0,9.8]],[22.5,4.5,[19,1.0,1.5]],[15,-2,[13.2,2,-3.5]]]){mesh(new T.CylinderGeometry(.065,.065,.035,16),metal,[x,6.29,z]);mesh(new T.CircleGeometry(.038,16),opal,[x,6.265,z],[-Math.PI/2,0,0]);spotSources.push({x,y:6.1,z,target,intensity:24});}
 // The arrival wall is now a closed, luxury second-floor elevator, not an exit.
 box([entry.x,2.06,9.88],[4.15,4.12,.22],darkMarble,.018,'Elevator_Stone_Surround');
 const elevatorMetal=new T.MeshPhysicalMaterial({name:'Elevator_Brushed_Champagne',color:0x8a775c,metalness:.84,roughness:.38,clearcoat:.18});
 const brush=noise.clone();brush.needsUpdate=true;brush.wrapS=brush.wrapT=T.RepeatWrapping;brush.repeat.set(64,.25);elevatorMetal.bumpMap=brush;elevatorMetal.bumpScale=.0008;
 for(const side of [-1,1]){box([entry.x+side*.77,1.78,9.735],[1.52,3.46,.075],elevatorMetal,.009,'Elevator_Closed_Door');box([entry.x+side*1.59,1.82,9.70],[.07,3.64,.12],brass,.006);line([entry.x+side*1.68,.10,9.70],[entry.x+side*1.68,3.65,9.70],.009);}
 box([entry.x,3.59,9.70],[3.25,.09,.12],brass,.005);box([entry.x,.04,9.68],[3.23,.07,.30],metal,.003);
 mesh(new T.PlaneGeometry(1.0,.40),text(['2F'],{width:1,height:.40,font:210,align:'center'}),[entry.x,3.93,9.61],[0,Math.PI,0]);
 mesh(new T.PlaneGeometry(1.3,.35),text(['2층  ·  GALLERY'],{width:1.3,height:.35,font:94,align:'center'}),[entry.x+2.45,2.08,9.61],[0,Math.PI,0]);
 box([entry.x+2.05,1.37,9.69],[.20,.45,.08],brass,.015);mesh(new T.CircleGeometry(.045,24),opal,[entry.x+2.05,1.39,9.635],[0,Math.PI,0]);
 // Architectural welcome and wayfinding inscriptions, not extra app UI.
 mesh(new T.PlaneGeometry(3.0,.75),text(['WELCOME'],{width:3,height:.75,font:100}),[11.14,3.45,-1.0],[0,Math.PI/2,0]);
 mesh(new T.PlaneGeometry(2.8,2.8),text(['A SPACE','TO EXPLORE','IDEAS AND','EXPERIENCES'],{width:2.8,height:2.8,font:65}),[11.14,1.55,-1.0],[0,Math.PI/2,0]);
 mesh(new T.PlaneGeometry(1.6,2.4),text(['PROJECTS','','ABOUT','','CONTACT','','→'],{width:1.6,height:2.4,font:68}),[11.14,2.65,2.2],[0,Math.PI/2,0]);
 box([24,.24,-3.5],[3.0,.46,1.2],darkMarble,.02);box([24,.51,-3.5],[2.98,.10,1.18],cream,.04);
 // Photographed olive foliage and low stone planters tie both rooms together.
 if(foliage)for(const [x,z,h]of [[-5.85,-.3,3.8],[-5.85,-10.3,3.8],[-5.85,-22.5,3.2],[13.2,-3.5,3.4],[25.7,-4.6,3.2]]){const plant=foliage.clone(true);const cube=plant.getObjectByName('Cube');if(cube)plant.remove(cube);const bounds=new T.Box3().setFromObject(plant),s=h/(bounds.max.y-bounds.min.y);plant.scale.setScalar(s);plant.position.set(x-(bounds.min.x+bounds.max.x)*s/2,.55-bounds.min.y*s,z-(bounds.min.z+bounds.max.z)*s/2);plant.rotation.y=.4;plant.traverse(m=>{if(m.isMesh){m.castShadow=true;m.receiveShadow=true;}});group.add(plant);box([x,.28,z],[1.1,.56,1.1],darkMarble,.02);}
 // Static batching keeps the stone joints, bevels and all fixtures affordable.
 const batches=new Map();for(const m of staticMeshes){m.updateMatrix();const g=(m.geometry.index?m.geometry.toNonIndexed():m.geometry.clone()).applyMatrix4(m.matrix);
  if([charcoal,ceiling,darkMarble,polished].includes(m.material)){const p=g.attributes.position,n=g.attributes.normal,uv=g.attributes.uv;for(let i=0;i<p.count;i++){const ax=Math.abs(n.getX(i)),ay=Math.abs(n.getY(i)),az=Math.abs(n.getZ(i));uv.setXY(i,(ax>ay&&ax>az?p.getZ(i):p.getX(i))*.32,(ay>ax&&ay>az?p.getZ(i):p.getY(i))*.32);}}
  if(!batches.has(m.material))batches.set(m.material,[]);batches.get(m.material).push(g);group.remove(m);m.geometry.dispose();}
 for(const [mat,parts]of batches){const merged=mergeGeometries(parts,false);if(!merged)throw new Error(`Gallery material geometry mismatch: ${mat.name}`);const m=new T.Mesh(merged,mat);m.name=mat.name||'Gallery_Static_Batch';m.castShadow=!mat.isMeshBasicMaterial&&mat!==glass;m.receiveShadow=true;group.add(m);occluders.push(m);parts.forEach(g=>g.dispose());}
 return {group,occluders,spotSources,brass,metal,amber,flame:null,orb};
}
