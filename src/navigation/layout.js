import space from './space-layout.json' with { type: 'json' };
import garden from '../scene/garden-layout.json' with { type: 'json' };
import bench from './bench-layout.json' with {type:'json'};
import {sofa} from './sofa.js';
import {worldDelta} from './coordinates.js';
import {studioDepth} from './studioLayout.js';
import {lounge,loungeGroundHeight,groundFurniture,sunkenSeats,sunkenBacks,inRect} from './loungeLayout.js';
import {coveHeightAt} from './coveLayout.js';
export { space };
export const START={x:0,z:1.4,y:lounge.floor,yaw:0,pitch:-.11};
export const OUTDOOR={x:0,z:11.72,yaw:Math.atan(space.worldShear*space.worldScale[0]/space.worldScale[2]),pitch:.03};
export const LIBRARY={x:-2.7+garden.library.deskShift[0],z:.50,y:space.upperFloor,yaw:-.30,pitch:-.08};
export const GALLERY={...lounge.profile.view};
// The work shortcut faces the first rear-wall exhibit, using the room's shear.
export const ATELIER={...lounge.work.view};
// Floor guidance approaches the central front-facing artwork. The shortcut
// deliberately retains ATELIER and its first-project auto-opening behavior.
export const WORK_GUIDANCE={...ATELIER};
export const RADIUS=.19;
export function eastBoundary(z){
 const points=space.eastWall;
 for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i];if(z>=a[1]&&z<=b[1])return a[0]+(b[0]-a[0])*(z-a[1])/(b[1]-a[1]);}
 return z<points[0][1]?points[0][0]:points.at(-1)[0];
}
export const waterBounds=space.pool.map((v,i)=>v+([1,-1,1,-1][i]*space.poolWaterInset));
export function inPool(x,z,inset=0){const [a,b,c,d]=waterBounds;return x>a+inset&&x<b-inset&&z>c+inset&&z<d-inset;}
export function facadeFront(x){const [a,b]=space.balconyFront;return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0]);}
const west=space.westFacade,westInner=west.wallCenterX+west.wallThickness/2;
export const facadeColumns={lower:[],upper:[]};
export function exteriorZ(x,z){return z+(facadeFront(x)-1.6)*Math.max(0,Math.min(1,z/2.45));}
export function flightPoint(f,t,side=0){
 const u=.5+side/f.width,l=f.startEdge[0].map((v,i)=>v+(f.endEdge[0][i]-v)*t),r=f.startEdge[1].map((v,i)=>v+(f.endEdge[1][i]-v)*t);
 return {x:l[0]+(r[0]-l[0])*u,z:l[1]+(r[1]-l[1])*u,y:f.bottom+(f.top-f.bottom)*Math.max(0,Math.min(1,t))};
}
export function stairPoint(t,side=0){const h=t*space.upperFloor,f=space.stairs.flights.find(f=>h<=f.top)||space.stairs.flights.at(-1);return flightPoint(f,(h-f.bottom)/(f.top-f.bottom),side);}
export function flightCoordinates(f,x,z){
 // Invert the mitered quad instead of assuming a rectangular flight. Both
 // sides of a bend then share exactly the same edge and elevation.
 const [l0,r0]=f.startEdge,[l1,r1]=f.endEdge,dx=f.head[0]-f.foot[0],dz=f.head[1]-f.foot[1],length=Math.hypot(dx,dz);
 let t=((x-f.foot[0])*dx+(z-f.foot[1])*dz)/(length*length),u=.5;
 for(let i=0;i<6;i++){
  const l=l0.map((v,j)=>v+(l1[j]-v)*t),r=r0.map((v,j)=>v+(r1[j]-v)*t),du=[r[0]-l[0],r[1]-l[1]],dt=l0.map((v,j)=>(l1[j]-v)*(1-u)+(r1[j]-r0[j])*u),ex=l[0]+du[0]*u-x,ez=l[1]+du[1]*u-z,det=du[0]*dt[1]-du[1]*dt[0];
  if(Math.abs(det)<1e-9)break;u-=(ex*dt[1]-ez*dt[0])/det;t-=(du[0]*ez-du[1]*ex)/det;
 }
 return {t,side:(u-.5)*f.width,width:f.width,axis:[dx/length,dz/length],bottom:f.bottom,top:f.top};
}
export function stairCoordinates(x,z){
 return space.stairs.flights.map(f=>flightCoordinates(f,x,z)).reduce((best,q)=>{
   const score=p=>Math.abs(p.side)+Math.max(0,-p.t,p.t-1)*10;
   return score(q)<score(best)?q:best;
 });
}
export function inPolygon(x,z,polygon){
 let hit=false;
 for(let i=0,j=polygon.length-1;i<polygon.length;j=i++){
  const [a,c]=polygon[i],[b,d]=polygon[j],cross=(x-a)*(d-c)-(z-c)*(b-a);
  if(Math.abs(cross)<1e-7&&x>=Math.min(a,b)-1e-7&&x<=Math.max(a,b)+1e-7&&z>=Math.min(c,d)-1e-7&&z<=Math.max(c,d)+1e-7)return true;
  if((c>z)!==(d>z)&&x<(b-a)*(z-c)/(d-c)+a)hit=!hit;
 }
 return hit;
}
const inside=(x,z,[a,b,c,d])=>x>=a-1e-6&&x<=b+1e-6&&z>=c-1e-6&&z<=d+1e-6;
const hitsSolid=(x,z,solids)=>solids.some(r=>inside(x,z,r));
const flightBounds=new Map(space.stairs.flights.map(f=>[f,[Math.min(...f.outline.map(p=>p[0]))-.2,Math.max(...f.outline.map(p=>p[0]))+.2,Math.min(...f.outline.map(p=>p[1]))-.2,Math.max(...f.outline.map(p=>p[1]))+.2]]));
const postBorder=space.lowerColumnBase.border,posts=facadeColumns.lower.map(p=>[p.x-p.size/2-postBorder,p.x+p.size/2+postBorder,p.z-p.size/2-postBorder,p.z+p.size/2+postBorder]);
const entryBookcase=garden.rightAtelier.leftEntryBookcase;
const stairPotSolids=garden.stairWallPots.map(p=>({bounds:[p.position[0]-p.radius,p.position[0]+p.radius,p.position[1]-p.radius,p.position[1]+p.radius],top:p.potHeight}));
const library=garden.library,deskShift=library.deskShift[0];
const bodyDirections=Array.from({length:12},(_,i)=>[Math.cos(i*Math.PI/6),Math.sin(i*Math.PI/6)]);
const bodyRing=bodyDirections.map(([x,z])=>[x*RADIUS,z*RADIUS]);
const facadeProfiles=[space.referenceFacade.lower,space.referenceFacade.upper];
const overlapsBody=(x,z,solids)=>hitsSolid(x,z,solids)||bodyRing.some(([dx,dz])=>hitsSolid(x+dx,z+dz,solids));
const frame=space.referenceFacade.upper;
export const facadeLeg=[frame.right-frame.width,frame.right,frame.frontZ-frame.depth,frame.frontZ];
export const westFacadeLeg=[frame.left,frame.left+frame.width,frame.frontZ-frame.depth,frame.frontZ];
export const SOLIDS=[
 facadeLeg,westFacadeLeg,
 [space.interior.right,space.interior.wallCenter+.12,-7.12,space.interior.groundEastFront],
 [space.interior.right,space.upperClosure[1],-.17,.18],
 ...groundFurniture,
 [entryBookcase.position[0]-entryBookcase.depth/2-.035,entryBookcase.position[0]+entryBookcase.depth/2+.035,entryBookcase.position[1]-entryBookcase.width/2-.04,entryBookcase.position[1]+entryBookcase.width/2+.04],
 [garden.rightAtelier.cabinet[0]-.375,garden.rightAtelier.cabinet[0]+.375,garden.rightAtelier.cabinet[1]-.55,garden.rightAtelier.cabinet[1]+.55],


 bench.bounds,
 ...garden.roomTreePlanters.map(p=>[p.position[0]-p.size/2,p.position[0]+p.size/2,p.position[1]-p.size/2,p.position[1]+p.size/2]),
 ...garden.loosePots.map(p=>[p.position[0]-p.radius,p.position[0]+p.radius,p.position[1]-p.radius,p.position[1]+p.radius]),

 ...garden.rightAtelier.pots.map(p=>[p.position[0]-p.size/2,p.position[0]+p.size/2,p.position[1]-p.size/2,p.position[1]+p.size/2]),
 ...posts,...garden.beds,
 ...stairPotSolids.map(p=>p.bounds)
];
export const UPPER_SOLIDS=[
 facadeLeg,westFacadeLeg,
 [space.interior.right,space.upperClosure[1],-.12,.16], // courtyard return behind the open stair arrival
 [space.interior.right,space.upperClosure[1],space.upperClosure[2],space.upperClosure[3]],
 [-5.59,space.interior.left,-3.34,space.interior.upperWestFront],
 [-5.30,3.90,-3.30,-2.90],
 sofa.bounds,
 [-4.08+deskShift,-1.88+deskShift,-1.97,-1.12],[-3.50+deskShift,-2.70+deskShift,-.86,-.04],[1.24,1.93,-2.71,-2.02],
 ...facadeColumns.upper.map(p=>{const half=p.size/2+space.upperColumnBase.border;return [p.x-half,p.x+half,p.z-half,p.z+half];})
];
function groundExists(x,z,allowPool=false,stairClearance=.14){
 if(x<space.courtyard[0]||x>space.courtyard[1]||z<-7||z>space.courtyard[3])return false;
 if(z>=0&&x>eastBoundary(z))return false;
 if(!allowPool&&inPool(x,z))return false;
 const rightLimit=space.interior.right;
 if(z<-.18&&(x< -5.3||x>rightLimit))return false;
 if(inPolygon(x,z,space.stairs.landing))return false;
 for(const f of space.stairs.flights){if(!inside(x,z,flightBounds.get(f)))continue;const q=flightCoordinates(f,x,z);if(q.t>.001&&q.t<1.001&&Math.abs(q.side)<f.width/2+stairClearance)return false;}
 return !hitsSolid(x,z,SOLIDS)&&!inPolygon(x,z,garden.stairBed)&&!inPolygon(x,z,garden.eastBed)&&!inPolygon(x,z,space.lowerCornerClosure);
}
export function surfaceHeights(x,z,{airborne=false}={}){
 const heights=[];
 // Walking keeps a body clearance beside the stair cheek. A falling visitor
 // can cross that clearance and land on the actual terrace outside the stone.
 if(groundExists(x,z,false,airborne?.065:.14))heights.push(loungeGroundHeight(x,z));
 if(inPolygon(x,z,space.upperOutline)&&x<eastBoundary(z)&&!hitsSolid(x,z,UPPER_SOLIDS))heights.push(space.upperFloor);
 if(inPolygon(x,z,space.stairs.landing))heights.push(space.stairs.landingHeight);
 for(const f of space.stairs.flights){if(!inside(x,z,flightBounds.get(f)))continue;const q=flightCoordinates(f,x,z);if(q.t>=-1e-6&&q.t<=1+1e-6&&Math.abs(q.side)<=f.width/2-.045)heights.push(f.bottom+(f.top-f.bottom)*Math.max(0,Math.min(1,q.t)));}
 return heights;
}
export function floorHeight(x,z,fromY=0){const heights=surfaceHeights(x,z);return heights.length?heights.reduce((best,y)=>Math.abs(y-fromY)<Math.abs(best-fromY)?y:best):null;}
function onStairSurface(x,z,h){
 if(inPolygon(x,z,space.stairs.landing)&&Math.abs(h-space.stairs.landingHeight)<.002)return true;
 return space.stairs.flights.some(f=>{const q=flightCoordinates(f,x,z);return q.t>=0&&q.t<=1&&Math.abs(q.side)<=f.width/2-.045&&Math.abs(h-(f.bottom+(f.top-f.bottom)*q.t))<.002;});
}
export function canStand(x,z,radius=RADIUS,y=0){
 const center=floorHeight(x,z,y);if(center===null||Math.abs(center-y)>.18)return false;
 for(const [dx,dz] of bodyDirections){
  const px=x+dx*radius,pz=z+dz*radius,edge=floorHeight(px,pz,center);
  if(edge===null)return false;
  if(Math.abs(edge-center)<=.18)continue;
  if(inRect(x,z,lounge.pit.steps.bounds)&&inRect(px,pz,lounge.pit.steps.bounds)&&Math.abs(edge-center)<=.32)continue;
  // A steeper continuous flight can rise more than a step across the body's
  // footprint. Accept only its exact ramp height; keep ledges/walls blocked.
  const followsRamp=space.stairs.flights.some(f=>{
   const a=flightCoordinates(f,x,z),b=flightCoordinates(f,px,pz),rise=f.top-f.bottom;
   return Math.abs(a.side)<=f.width/2&&Math.abs(b.side)<=f.width/2-.045&&b.t>=0&&b.t<=1&&
    Math.abs(center-(f.bottom+rise*Math.max(0,Math.min(1,a.t))))<.02&&Math.abs(edge-(f.bottom+rise*b.t))<.002;
  });
  if(!followsRamp&&(Math.abs(edge-center)>.32||!onStairSurface(x,z,center)||!onStairSurface(px,pz,edge)))return false;
 }
 return true;
}
export function moveOnSurface(position,x,z){const y=floorHeight(x,z,position.y??0);return y!==null&&Math.abs(y-(position.y??0))<=.16&&canStand(x,z,RADIUS,y)?{x,z,y}:null;}
// Manual visitors can enter the real basin; automatic routes still stay dry.
// Keep the same furniture/bed/wall constraints when a body straddles a bank.
export function moveManually(position,x,z,{canExitPool=false,feetY=0,airborne=false,bodyHeight=1.53}={}){
 if(airborne)return moveInAir(position,x,z,feetY,bodyHeight);
 const before=inPool(position.x,position.z)&&(position.y??0)<0,after=inPool(x,z);
 if(!before&&!after){
  const normal=moveOnSurface(position,x,z);if(normal)return normal;
  if((position.y??0)!==0||!groundExists(x,z,true))return null;
 }
 if(!before&&(position.y??0)>0)return moveOnSurface(position,x,z);
 if(before&&!after&&!canExitPool)return null;
 if(before&&after&&feetY<-.15&&!inPool(x,z,RADIUS))return null;
 const y=after?space.poolMotion.bottom:0;
 if(!after&&!groundExists(x,z,true))return null;
 for(let i=0;i<12;i++){
  const angle=i*Math.PI/6,px=x+Math.cos(angle)*RADIUS,pz=z+Math.sin(angle)*RADIUS;
  if(inPool(px,pz))continue;
  if(!groundExists(px,pz,true))return null;
 }
 return {x,z,y};
}
export function clearSegment(a,b){
 const steps=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/.035));let p={...a,y:a.y??0};
 for(let i=1;i<=steps;i++){p=moveOnSurface(p,a.x+(b.x-a.x)*i/steps,a.z+(b.z-a.z)*i/steps);if(!p)return false;}
 return Math.abs(p.y-(b.y??0))<.08;
}
// Furniture routing stays on a single story. The explicit stair graph is the
// continuous physical link, so overlapping floors cannot teleport the visitor.
const flatGrids=new Map();
function smoothRoute(start,path){
 const result=[];let anchor=start,index=0;
 while(index<path.length){
  let far=path.length-1;while(far>index&&!clearSegment(anchor,path[far]))far--;
  result.push(path[far]);anchor=path[far];index=far+1;
 }
 return result;
}
function flatRoute(start,destination,y=0){
 const lower=y<space.upperFloor-.25,layer=lower?0:space.upperFloor;
 const a={...start,y:lower?loungeGroundHeight(start.x,start.z):layer},b={...destination,y:lower?loungeGroundHeight(destination.x,destination.z):layer};if(clearSegment(a,b))return [b];
 const step=.16,width=70,height=Math.ceil((space.courtyard[3]+7)/step)+1;
 if(!flatGrids.has(layer))flatGrids.set(layer,{points:Array.from({length:width*height},(_,id)=>{const x=-5.4+(id%width)*step,z=-7+Math.floor(id/width)*step;return {x,z,y:lower?loungeGroundHeight(x,z):layer};}),valid:new Map(),edges:new Map()});
 const {points,valid,edges}=flatGrids.get(layer),point=id=>points[id];
 const distance=(a,b)=>Math.hypot(...worldDelta(a.x-b.x,a.z-b.z));
 const walkable=id=>{if(!valid.has(id)){const q=point(id);valid.set(id,canStand(q.x,q.z,RADIUS,q.y));}return valid.get(id);};
 const clearEdge=(a,b)=>{const key=Math.min(a,b)*points.length+Math.max(a,b);if(!edges.has(key))edges.set(key,clearSegment(point(a),point(b)));return edges.get(key);};
 const closest=p=>{
  const candidates=points.map((q,id)=>({id,d:distance(q,p)})).sort((a,b)=>a.d-b.d);
  for(const {id} of candidates){const q=point(id);if(walkable(id)&&clearSegment(p,q))return id;}
  return -1;
 };
 const from=closest(a),end=closest(b);if(from<0||end<0)return [];
 const open=new Set([from]),cost=new Map([[from,0]]),parent=new Map();
 while(open.size){
  let current=-1,best=Infinity;
  for(const id of open){const value=cost.get(id)+distance(point(id),point(end));if(value<best){current=id;best=value;}}
  if(current===end){const path=[b];let node=end;while(node!==from){path.unshift(point(node));node=parent.get(node);}path.unshift(point(from));return smoothRoute(a,path);}
  open.delete(current);const gx=current%width,gz=Math.floor(current/width);
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,1],[1,-1],[-1,-1]]){
   const xx=gx+dx,zz=gz+dz;if(xx<0||xx>=width||zz<0||zz>=height)continue;
   const id=zz*width+xx;if(!walkable(id)||!clearEdge(current,id))continue;
   const g=cost.get(current)+distance(point(current),point(id));if(g<(cost.get(id)??Infinity)){cost.set(id,g);parent.set(id,current);open.add(id);}
  }
 }
 return [];
}
function computeRouteBetween(start,destination){
 const a={...start,y:start.y??0},b={...destination,y:destination.y??0},stair=space.stairRoute;
 const ground=p=>Math.abs(p.y-loungeGroundHeight(p.x,p.z))<.18&&!onStairSurface(p.x,p.z,p.y),aGround=ground(a),bGround=ground(b);
 if(clearSegment(a,b))return [b];
 if(aGround&&bGround)return flatRoute(a,b,0);
 if(a.y===b.y&&a.y===space.upperFloor)return flatRoute(a,b,a.y);
 const up=b.y===space.upperFloor,order=up?stair:[...stair].reverse();let first=0,path=[];
 if(aGround){path=flatRoute(a,stair[0]);if(!path.length)return [];first=1;}
 else if(a.y===space.upperFloor){path=flatRoute(a,stair.at(-1),space.upperFloor);if(!path.length)return [];first=1;}
 else{
  let best=Infinity;
  for(let i=0;i<order.length;i++){const p=order[i];if((up?p.y>=a.y:p.y<=a.y)&&clearSegment(a,p)){const d=Math.hypot(p.x-a.x,p.z-a.z);if(d<best){best=d;first=i;}}}
  if(best===Infinity)return [];
 }
 for(const p of order.slice(first)){if(!clearSegment(path.at(-1)||a,p))return [];path.push({...p});}
 const tail=flatRoute(path.at(-1),b,b.y);return tail.length?smoothRoute(a,[...path,...tail]):[];
}

// These four physical arrival poses never change. Reuse their exact, validated
// routes instead of repeating the expensive grid search on a shortcut click.
// Other positions keep using the existing collision-aware planner.
const routeAnchors=[OUTDOOR,GALLERY,ATELIER,LIBRARY],preparedRoutes=new Map();
const anchorIndex=p=>routeAnchors.findIndex(a=>Math.abs(a.x-p.x)<1e-9&&Math.abs(a.z-p.z)<1e-9&&Math.abs((a.y??0)-(p.y??0))<1e-9);
export function routeBetween(start,destination){
 const from=anchorIndex(start),to=anchorIndex(destination),key=from*routeAnchors.length+to;
 if(from<0||to<0||from===to)return computeRouteBetween(start,destination);
 const cached=preparedRoutes.get(key),anchor=routeAnchors[from];
 if(cached&&(start.x===anchor.x&&start.z===anchor.z||cached.length&&clearSegment(start,cached[0]))){
  const path=cached.map(point=>({...point}));if(path.length)path[path.length-1]={...destination,y:destination.y??0};return path;
 }
 const path=computeRouteBetween(start,destination);preparedRoutes.set(key,path.map(point=>({...point})));return path;
}
export async function prepareNavigationRoutes(yieldTask){
 let count=0;
 for(const from of routeAnchors)for(const to of routeAnchors)if(from!==to){routeBetween(from,to);count++;await yieldTask();}
 return count;
}

// Profile shortcuts approach from the stair-side (right) pool passage. Walking
// remains unrestricted; a visitor already on the left bank first exits safely.
const profileNear={x:space.pool[1]+.9,z:space.pool[2]-.65,y:loungeGroundHeight(space.pool[1]+.9,space.pool[2]-.65)};
const profileFar={x:profileNear.x,z:space.pool[3]+.7,y:0};
export function guideRoute(start,destination){
 if(destination.x!==GALLERY.x||destination.z!==GALLERY.z)return routeBetween(start,destination);
 if((start.y??0)<space.upperFloor-.25&&start.z<=profileNear.z)return routeBetween(start,destination);
 const gates=(start.y??0)>=space.upperFloor-.25||start.x>=space.pool[1]+RADIUS?[profileNear]:[profileFar,profileNear];
 const path=[];let previous=start;
 for(const next of [...gates,destination]){const leg=routeBetween(previous,next);if(!leg.length)return [];path.push(...leg);previous=next;}
 return path;
}


// Shared native oak rails are both barriers below their tops and landing surfaces.
// Distances use physical world meters, including the scene's shear/scale.
export const railSegments=[
 {a:space.balconyRail[0],b:space.balconyRail[1],ha:space.upperFloor,hb:space.upperFloor},
 ...space.stairs.sections.slice(1).map((b,i)=>({a:space.stairs.sections[i].edge[0],b:b.edge[0],ha:space.stairs.sections[i].height,hb:b.height}))
];
function segmentMetric(x,z,a,b){
 const v=worldDelta(b[0]-a[0],b[1]-a[1]),p=worldDelta(x-a[0],z-a[1]);
 const t=Math.max(0,Math.min(1,(p[0]*v[0]+p[1]*v[1])/(v[0]*v[0]+v[1]*v[1])));
 return {t,distance:Math.hypot(p[0]-v[0]*t,p[1]-v[1]*t)};
}
export function railSupport(x,z){
 let best=null;
 for(const r of railSegments){const q=segmentMetric(x,z,r.a,r.b);if(q.distance>.105)continue;
  const base=r.ha+(r.hb-r.ha)*q.t,y=base+1.092;
  if(!best||q.distance<best.distance)best={...q,y,base};
 }
 return best;
}
export function stairGardenHeight(x,z){
 if(!inPolygon(x,z,garden.stairBed))return null;
 for(let i=1;i<garden.stairBedSections.length;i++){
  const a=garden.stairBedSections[i-1],b=garden.stairBedSections[i],dz=b.edge[0][1]-a.edge[0][1];
  if(Math.abs(dz)<1e-8)continue;
  const t=(z-a.edge[0][1])/dz;if(t<-.000001||t>1.000001)continue;
  const left=a.edge[0][0]*(1-t)+b.edge[0][0]*t,right=a.edge[1][0]*(1-t)+b.edge[1][0]*t;
  if(x>=Math.min(left,right)-1e-6&&x<=Math.max(left,right)+1e-6)return a.height+(b.height-a.height)*t+.28;
 }
 return null;
}
// Raised soil and the native bench top remain traversable after landing.
export function raisedSurfaceHeight(x,z){
 const values=[];
 for(const [dx,dz] of [[0,0],...bodyRing]){
  const px=x+dx,pz=z+dz;
  if(inside(px,pz,bench.bounds))values.push(bench.seatTop);
  if(sunkenSeats.some(r=>inRect(px,pz,r)))values.push(lounge.pit.seatTop);
  if(sunkenBacks.some(r=>inRect(px,pz,r)))values.push(.43);
  if(inside(px,pz,sofa.bounds))values.push(sofa.seatTop);
  for(const part of sofa.parts)if(inside(px,pz,part.bounds))values.push(part.top);
  for(const pot of stairPotSolids)if(inside(px,pz,pot.bounds))values.push(pot.top);
  const stairBed=stairGardenHeight(px,pz);if(stairBed!==null)values.push(stairBed);
  if(inPolygon(px,pz,garden.eastBed)||garden.beds.some(r=>inside(px,pz,r)))values.push(.28);
 }
 return values.length?Math.max(...values):null;
}
export function airborneSupport(x,z,feetY){
 const ys=surfaceHeights(x,z,{airborne:true});
 if(inPool(x,z))ys.push(space.poolMotion.bottom);
 if(inPolygon(x,z,space.lowerCornerClosure))ys.push(space.upperFloor);
 const stairBedHeight=stairGardenHeight(x,z);if(stairBedHeight!==null)ys.push(stairBedHeight);
 if(inPolygon(x,z,garden.eastBed)||garden.beds.some(r=>inside(x,z,r)))ys.push(.28);
 const raised=raisedSurfaceHeight(x,z);if(raised!==null)ys.push(raised);
 const rail=railSupport(x,z);if(rail)ys.push(rail.y);
 const available=ys.filter(y=>y*space.worldScale[1]<=feetY+.035);
 return available.length?Math.max(...available):null;
}
// Lowest actual soffit touching the body footprint, in world meters. Roof
// overhangs are included; the open pool/courtyard and exposed stairs stay open.
export function ceilingHeight(x,z,feetY){
 const sy=space.worldScale[1],heights=[];
 for(const [dx,dz] of [[0,0],...bodyRing]){
  const px=x+dx,pz=z+dz;
  const roof=space.upperRoof;
  if(px>=roof.left&&px<=roof.right&&pz>=roof.back&&pz<=roof.front){
   heights.push(space.upperCeiling);
  }
  for(const frame of facadeProfiles){
   if(pz<frame.frontZ-frame.depth||pz>frame.frontZ||px<frame.left+frame.width||px>frame.right-frame.width)continue;
   const center=px<frame.left+frame.radius?frame.left+frame.radius:px>frame.right-frame.radius?frame.right-frame.radius:px;
   const radius=frame.radius-frame.width;
   heights.push(frame.top-frame.radius+Math.sqrt(Math.max(0,radius*radius-(px-center)**2)));
  }
  if(inside(px,pz,[-5.54,3.9,-7.26,2.32]))heights.push(space.interior.groundSoffit);
  const cove=coveHeightAt(px,pz,feetY/sy+.02/sy);if(Number.isFinite(cove))heights.push(cove);

 }
 const above=heights.map(h=>h*sy).filter(h=>h>feetY+.02);
 return above.length?Math.min(...above):Infinity;
}
const groundAirSolids=SOLIDS.filter(r=>!sunkenSeats.includes(r)&&!garden.beds.includes(r)&&r!==bench.bounds&&!stairPotSolids.some(p=>p.bounds===r));
const upperAirSolids=UPPER_SOLIDS.filter(r=>r!==sofa.bounds);
function canOccupyAir(position,x,z,feetY,bodyHeight){
 const sy=space.worldScale[1],upper=space.upperFloor*sy;
 const perimeterPenetration=(cx,cz)=>Math.max(0,...[[0,0],...bodyRing].map(([dx,dz])=>{
  const px=cx+dx,pz=cz+dz;
  return Math.max(space.courtyard[0]-px,px-eastBoundary(pz),pz-space.courtyard[3],-7-pz);
 }));
 const penetration=perimeterPenetration(x,z);
 // Existing overlaps can move outward in small steps instead of requiring
 // one impossible full-radius step to escape a wall.
 if(penetration>1e-7&&penetration>=perimeterPenetration(position.x,position.z)-1e-7)return false;
 if(x>space.interior.right-RADIUS&&z>=space.upperClosure[2]-RADIUS&&z<=space.upperClosure[3]+RADIUS&&feetY+bodyHeight>(space.upperFloor-.25)*sy)return false;
 if(z<-.12+RADIUS&&z>-.17-RADIUS&&x>space.interior.right-RADIUS&&feetY<(space.upperFloor-.25)*sy)return false;
 if(z<-3.3+RADIUS&&feetY+bodyHeight>upper&&feetY<space.upperCeiling*sy)return false;
 if(feetY<space.groundCeiling*sy){
  for(const [a,b] of [[[-5.48,-7.12],[-5.48,2.5]],[[-5.48,-7.12],[space.interior.wallCenter,-7.12]],[[space.interior.wallCenter,-7.12],[space.interior.wallCenter,space.interior.groundEastFront]]]){
   if(segmentMetric(x,z,a,b).distance<(RADIUS+(a[0]===space.interior.wallCenter&&b[0]===space.interior.wallCenter?.13:.12))*1.12)return false;
  }
 }
 // Use the same circular footprint as walking, so a jump cannot land
 // inside a wall/furniture clearance and leave the visitor unable to move.
 if(feetY<upper-.25&&overlapsBody(x,z,groundAirSolids))return false;
 if(feetY<lounge.pit.seatTop*sy-.035&&overlapsBody(x,z,sunkenSeats))return false;
 if(feetY<.43*sy-.035&&overlapsBody(x,z,sunkenBacks))return false;
 for(const pot of stairPotSolids)if(feetY<pot.top*sy-.035&&overlapsBody(x,z,[pot.bounds]))return false;
 if(feetY>=upper-.25&&overlapsBody(x,z,upperAirSolids))return false;
 if(feetY>=upper-.25){
  if(feetY<sofa.seatTop*sy-.035&&overlapsBody(x,z,[sofa.bounds]))return false;
  for(const part of sofa.parts)if(feetY<part.top*sy-.035&&overlapsBody(x,z,[part.bounds]))return false;
 }
 if(feetY<(space.upperFloor-.045)*sy&&[[0,0],...bodyRing].some(([dx,dz])=>inPolygon(x+dx,z+dz,space.lowerCornerClosure)))return false;
 if(z<facadeFront(x)&&x<(feetY<upper-.25?-5.30:space.upperOutline[0][0])+RADIUS)return false;
 if(feetY+bodyHeight+.08>ceilingHeight(x,z,feetY)+.002)return false;
 // These narrow strips have masonry on one side and rails/pots on the other;
 // there is no body-width exit. Keep them non-enterable, including in jumps.
 if([[0,0],...bodyRing].some(([dx,dz])=>inPolygon(x+dx,z+dz,garden.stairBed)))return false;
 if(feetY<upper-.25&&overlapsBody(x,z,[garden.beds[2],garden.beds[3]]))return false;
 if(feetY<bench.seatTop*sy-.035&&overlapsBody(x,z,[bench.bounds]))return false;
 // The actual stair masonry and its .065m projecting cheeks are solid from
 // ground to tread height. Check the complete body beside the sloping wall.
 const masonryPenetration=(cx,cz)=>{
  let total=0;
  for(const [dx,dz] of [[0,0],...bodyRing]){
   const px=cx+dx,pz=cz+dz;
   if(inPolygon(px,pz,space.stairs.landing)&&feetY<(space.stairs.landingHeight-.16)*sy){
    total+=Math.min(...space.stairs.landing.map((a,i)=>segmentMetric(px,pz,a,space.stairs.landing[(i+1)%space.stairs.landing.length]).distance))+.001;
   }
   for(const f of space.stairs.flights){
    if(!inside(px,pz,flightBounds.get(f)))continue;
    const q=flightCoordinates(f,px,pz);
    if(q.t<0||q.t>1||Math.abs(q.side)>f.width/2+.065)continue;
    const top=f.bottom+(f.top-f.bottom)*q.t,depth=(top-.16)*sy-feetY;
    if(depth>0)total+=Math.min(depth,f.width/2+.065-Math.abs(q.side),q.t,(1-q.t))+.001;
   }
  }
  return total;
 };
 const masonry=masonryPenetration(x,z);
 if(masonry>1e-7&&masonry>=masonryPenetration(position.x,position.z)-1e-7)return false;
 const bedTop=stairGardenHeight(x,z);if(bedTop!==null&&feetY<bedTop*sy-.035)return false;
 for(const r of railSegments){const q=segmentMetric(x,z,r.a,r.b),base=(r.ha+(r.hb-r.ha)*q.t)*sy,top=base+1.092*sy;
  if(q.distance<RADIUS*1.12+.042&&feetY<top-.035&&feetY+bodyHeight>base+.09*sy){
   const before=segmentMetric(position.x,position.z,r.a,r.b).distance;
   if(!(before<RADIUS*1.12+.042&&q.distance>before+1e-7))return false;
  }
 }
 return true;
}
export function moveInAir(position,x,z,feetY,bodyHeight=1.53){
 if(!canOccupyAir(position,x,z,feetY,bodyHeight))return null;
 const y=airborneSupport(x,z,feetY);
 return y===null?null:{x,z,y};
}
