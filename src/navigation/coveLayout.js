import ceilingPerimeters from './ceiling-perimeter.json' with {type:'json'};
export {ceilingPerimeters};
export const coveDepth=.060;
export const coveLift=.065;
export const coveLayouts=[['ground','Atelier',.29],['upper','Library',.28]].map(([key,name,inset])=>{
 const p=ceilingPerimeters[key],[left,right,back,front]=p.inner;return {name,left,right,back,front,y:p.bottom-coveLift,inset};
});
const rounded=(x,z,left,right,back,front,radius)=>{
 const dx=x-Math.max(left+radius,Math.min(right-radius,x)),dz=z-Math.max(back+radius,Math.min(front-radius,z));
 return dx*dx+dz*dz<=radius*radius;
};
function inPolygon(x,z,p){
 let inside=false;
 for(let i=0,j=p.length-1;i<p.length;j=i++)if((p[i][1]>z)!==(p[j][1]>z)&&x<(p[j][0]-p[i][0])*(z-p[i][1])/(p[j][1]-p[i][1])+p[i][0])inside=!inside;
 return inside;
}
export function coveHeightAt(x,z,minimum=-Infinity){
 for(const c of coveLayouts){
  if(c.y+coveDepth<=minimum)continue;
  if(!rounded(x,z,c.left,c.right,c.back,c.front,.12))continue;
  const a=c.inset;
  if(!rounded(x,z,c.left+a,c.right-a,c.back+a,c.front-a,.30)){
   let low=0,high=1;
   for(let i=0;i<10;i++){const t=(low+high)/2,p=a*t;if(rounded(x,z,c.left+p,c.right-p,c.back+p,c.front-p,.12+.18*t))low=t;else high=t;}
   return c.y+coveLift*(1-low)**2;
  }
  if(!rounded(x,z,c.left+a+.026,c.right-a-.026,c.back+a+.026,c.front-a-.026,.274))return c.y+.045;
  return c.y+coveDepth;
 }
 for(const key of ['ground','upper']){
  const p=ceilingPerimeters[key];if(p.bottom<=minimum)continue;
  if((p.outerPolygon?inPolygon(x,z,p.outerPolygon):rounded(x,z,...p.outer,.012))&&!rounded(x,z,...p.inner,.12))return p.bottom;
 }
 if(ceilingPerimeters.ground.bottom>minimum){
  if(inPolygon(x,z,ceilingPerimeters.stairPocket))return ceilingPerimeters.ground.bottom;
 }
 return Infinity;
}
