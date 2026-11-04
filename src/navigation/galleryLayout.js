// Shared physical plan, metres. Every walkable room is on the second-floor level.
export const galleryRoom={left:-7,right:7,back:-26,front:10,height:6.4};
export const galleryLobby={left:11,right:27,back:-6,front:10,height:6.4};
export const galleryCorridor={left:7,right:11,back:3.5,front:7.5,height:4.25};
export const galleryEntrance={x:19,z:9.84,width:3.2,height:3.6,floor:2};
export const galleryStart={x:17.5,y:0,z:8.5,yaw:-.06,pitch:.16};
export const galleryDesk={x:19,z:1.5,width:5.2,depth:3.3,height:.98,rx:2.6,rz:1.65,tablet:[17.85,1.005,2.55],notebook:[20.15,1.005,2.55],books:[19,1.015,1.5],orb:[20.8,1.16,1.3]};
export const galleryBenches=[{x:0,z:-1},{x:0,z:-9},{x:0,z:-17}];
export const gallerySlots=[
 {x:-6.55,y:2.80,z:5,rotation:Math.PI/2,width:2.30,height:3.05},
 {x:6.55,y:2.80,z:-1,rotation:-Math.PI/2,width:2.30,height:3.05},
 {x:-6.55,y:2.80,z:-5,rotation:Math.PI/2,width:2.30,height:3.05},
 {x:6.55,y:2.80,z:-11,rotation:-Math.PI/2,width:2.30,height:3.05},
 {x:-6.55,y:2.80,z:-15,rotation:Math.PI/2,width:2.30,height:3.05},
 {x:6.55,y:2.80,z:-21,rotation:-Math.PI/2,width:2.30,height:3.05},
];
export const gallerySolids=[
 [galleryEntrance.x-2.1,galleryEntrance.x+2.1,9.6,10.1], // closed elevator and stone reveal
 ...gallerySlots.map(s=>s.x>0?[6.45,7,s.z-2.0,s.z+2.0]:[-7,-6.45,s.z-2.0,s.z+2.0]),
 ...galleryBenches.map(b=>[b.x-1.65,b.x+1.65,b.z-.55,b.z+.55]),
 [2.2,5.2,-24.7,-22.3], // bronze sculpture plinth
 [-6.4,-5.3,-.9,.3],[-6.4,-5.3,-10.9,-9.7],[-6.4,-5.3,-23.1,-21.9], // gallery olive planters
 [12.65,13.75,-4.1,-2.9],[25.15,26.25,-5.15,-4.05], // lobby planters
 [22.5,25.5,-4.1,-2.9], // lobby window bench
];
export const galleryDestinations={
 gallery:{x:17.85,y:0,z:4.15,yaw:0,pitch:-.50},
 library:{x:20.15,y:0,z:4.15,yaw:0,pitch:-.55},
 atelier:{x:-4.60,y:0,z:5,yaw:Math.PI/2,pitch:.40},
 terrace:galleryStart,
};
export const galleryEnding={x:0,y:0,z:-22,yaw:0,pitch:0};
export const galleryAreaAt=(x,z)=>x>=11?'lobby':x>7?'corridor':'atelier';
const regions=[galleryRoom,galleryLobby,galleryCorridor];
export const galleryFloorContains=(x,z)=>regions.some(b=>x>=b.left&&x<=b.right&&z>=b.back&&z<=b.front);
export function galleryCanStand(x,z,r=.23){
 if(!galleryFloorContains(x,z))return false;
 for(let i=0;i<8;i++){const a=i*Math.PI/4;if(!galleryFloorContains(x+Math.cos(a)*r,z+Math.sin(a)*r))return false;}
 if(((x-galleryDesk.x)/(galleryDesk.rx+r))**2+((z-galleryDesk.z)/(galleryDesk.rz+r))**2<1)return false;
 return !gallerySolids.some(([a,b,c,d])=>x>a-r&&x<b+r&&z>c-r&&z<d+r);
}
export function galleryClear(a,b){
 const n=Math.max(1,Math.ceil(Math.hypot(b.x-a.x,b.z-a.z)/.10));
 for(let i=0;i<=n;i++)if(!galleryCanStand(a.x+(b.x-a.x)*i/n,a.z+(b.z-a.z)*i/n))return false;
 return true;
}
// A cached occupancy grid and binary heap keep the longer connected plan responsive.
const step=.3,origin={x:-6.6,z:-25.6},cols=113,rows=119;
const at=id=>({x:origin.x+(id%cols)*step,y:0,z:origin.z+Math.floor(id/cols)*step});
const cells=Uint8Array.from({length:cols*rows},(_,i)=>{const p=at(i);return Number(galleryCanStand(p.x,p.z));});
const nearest=p=>{
 const cx=Math.round((p.x-origin.x)/step),cz=Math.round((p.z-origin.z)/step);let best=-1,d=Infinity;
 for(let radius=1;radius<=8;radius++){for(let x=cx-radius;x<=cx+radius;x++)for(let z=cz-radius;z<=cz+radius;z++){if(x<0||x>=cols||z<0||z>=rows)continue;const id=z*cols+x;if(!cells[id])continue;const q=at(id),s=(q.x-p.x)**2+(q.z-p.z)**2;if(s<d&&galleryClear(p,q)){best=id;d=s;}}if(best>=0)return best;}
 return -1;
};
export function galleryRoute(start,end){
 if(galleryClear(start,end))return [{...end}];
 const first=nearest(start),last=nearest(end);if(first<0||last<0)return [];
 const heap=[],cost=new Float64Array(cells.length).fill(Infinity),parent=new Int32Array(cells.length).fill(-1),closed=new Uint8Array(cells.length);
 const push=e=>{let i=heap.length;heap.push(e);while(i){const j=(i-1)>>1;if(heap[j].f<=e.f)break;heap[i]=heap[j];i=j;}heap[i]=e;};
 const pop=()=>{const head=heap[0],tail=heap.pop();if(heap.length){let i=0;while(i*2+1<heap.length){let j=i*2+1;if(j+1<heap.length&&heap[j+1].f<heap[j].f)j++;if(tail.f<=heap[j].f)break;heap[i]=heap[j];i=j;}heap[i]=tail;}return head;};
 cost[first]=0;push({id:first,f:0});
 while(heap.length){const current=pop().id;if(closed[current])continue;
  if(current===last){const path=[{...end}];let id=current;while(id!==first){path.unshift(at(id));id=parent[id];}path.unshift(at(first));const result=[];let a=start;while(path.length){let i=path.length-1;while(i>0&&!galleryClear(a,path[i]))i--;a=path[i];result.push(a);path.splice(0,i+1);}return result;}
  closed[current]=1;const p=at(current);
  for(const [dx,dz]of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const x=current%cols+dx,z=Math.floor(current/cols)+dz;if(x<0||x>=cols||z<0||z>=rows)continue;const next=z*cols+x;if(closed[next]||!cells[next]||!galleryClear(p,at(next)))continue;const c=cost[current]+Math.hypot(dx,dz)*step;if(c<cost[next]){cost[next]=c;parent[next]=current;const q=at(next);push({id:next,f:c+Math.hypot(q.x-end.x,q.z-end.z)/step});}}
 }
 return [];
}
