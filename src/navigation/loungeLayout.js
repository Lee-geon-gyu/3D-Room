import lounge from './lounge-layout.json' with {type:'json'};
export {lounge};
export const inRect=(x,z,[l,r,b,f])=>x>=l&&x<=r&&z>=b&&z<=f;
export function subtractRect(rect,cut){
 const [l,r,b,f]=rect,[a,c,d,e]=cut,x0=Math.max(l,a),x1=Math.min(r,c),z0=Math.max(b,d),z1=Math.min(f,e);
 if(x0>=x1||z0>=z1)return [rect];
 return [[l,x0,b,f],[x1,r,b,f],[x0,x1,b,z0],[x0,x1,z1,f]].filter(([a,b,c,d])=>b-a>1e-6&&d-c>1e-6);
}
export function loungeGroundHeight(x,z){
 const p=lounge.pit;
 if(inRect(x,z,p.bounds)){
  if(inRect(x,z,p.steps.bounds)){
   const [, ,back,front]=p.steps.bounds,step=(front-back)/p.steps.count;
   return lounge.floor-(lounge.floor-p.floor)/p.steps.count*(Math.min(p.steps.count-1,Math.floor((front-z)/step))+1);
  }
  return p.floor;
 }
 if(inRect(x,z,lounge.room))return lounge.floor;
 const [l,r,b,f]=lounge.ramp.bounds;
 if(inRect(x,z,[l,r,b,f]))return lounge.floor*(f-z)/(f-b);
 return 0;
}
const [l,r,b,f]=lounge.pit.bounds,d=lounge.pit.depth;
export const sunkenSeats=[ [l,l+d,b,f], [r-d,r,b,f], [l+d,r-d,b,b+d] ];
export const sunkenBacks=[ [l,l+.16,b,f], [r-.16,r,b,f], [l,r,b,b+.16] ];
export const sunkenSofa={id:'sunken-lounge',floor:lounge.pit.floor,seatTop:lounge.pit.seatTop,seatBounds:[l+d+.10,r-d-.10,b+.18,b+d-.10],seatRangeX:[l+d+.20,r-d-.20],seatZ:b+d/2,approachZ:b+d+.38,yaw:Math.PI,pitch:-.05,eyeHeight:.68};
export const groundFurniture=[
 [-5.125,-4.375,-4.75,-2.25],[-4.10,-3.60,-4.34,-3.86],[-4.10,-3.60,-3.44,-2.96],
 [2.64,3.56,-6.05,-2.25],[2.14,2.64,-5.29,-4.81],[2.14,2.64,-3.49,-3.01],
 [-1.27,-.23,-3.37,-2.33],...sunkenSeats,
];
