import {space,facadeFront,inPolygon} from '../navigation/layout.js';

// The doorway remains tied to the stair return after the columns are removed.
const wall=space.upperClosure,post={x:space.lowerCornerClosure[0][0]+space.stairFacadeTrim.offset[0],z:space.lowerCornerClosure[0][1]+space.stairFacadeTrim.offset[1]};
export const libraryRailInset=.42;
export function libraryEntryX(z){
  const t=Math.max(0,Math.min(1,(z-wall[3])/(post.z-wall[3])));
  return wall[0]+(post.x-wall[0])*t;
}

// Use the visitor's body and the real wall/post opening, never camera distance.
export function inLibraryInterior(position,onRail=false,wasInside=false){
  const {x,z}=position,y=position.y??0,pad=wasInside?.035:0;
  return !onRail&&y>=space.upperFloor-.12&&y<space.upperCeiling-.15&&
    inPolygon(x,z,space.upperOutline)&&x<=libraryEntryX(z)+pad&&
    z<=facadeFront(x)-libraryRailInset+pad;
}

// The four room sconces and two area sources stay fixed throughout a visit.
// Outside, retain the existing ambient ceiling but omit the switched shelf fill.
export function libraryLightPlan(inside,quality,rankedPoints,rankedAreas){
  const points=rankedPoints.filter(light=>Number.isInteger(light.userData.librarySlot)===inside);
  if(inside)points.sort((a,b)=>a.userData.librarySlot-b.userData.librarySlot);
  const areas=inside?['ceiling','fill'].map(role=>rankedAreas.find(light=>light.userData.libraryRole===role)):
    rankedAreas.filter(light=>light.userData.libraryRole!=='fill').slice(0,2);
  return {
    points:points.slice(0,4).map(light=>({light,intensity:light.intensity})),
    areas:areas.map((light,i)=>({light,intensity:inside||i===0||quality===1?light.intensity:0}))
  };
}
