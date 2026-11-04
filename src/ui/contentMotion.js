import {detailExpansion,detailOpacity} from '../scene/presentationMotion.js';

// A homography attaches the live reader to the prop's four projected corners.
// Unlike a bounding box it retains the tabletop/wall perspective at handoff.
export function quadTransform(points,width,height){
  const [a,b,c,d]=points;
  const dx=b.x-c.x,dy=b.y-c.y,ex=d.x-c.x,ey=d.y-c.y;
  const sx=a.x-b.x+c.x-d.x,sy=a.y-b.y+c.y-d.y;
  const determinant=dx*ey-ex*dy;
  if(Math.abs(determinant)<1e-8)return null;
  const g=(sx*ey-ex*sy)/determinant,h=(dx*sy-sx*dy)/determinant;
  return [(b.x-a.x+g*b.x)/width,(b.y-a.y+g*b.y)/width,0,g/width,
    (d.x-a.x+h*d.x)/height,(d.y-a.y+h*d.y)/height,0,h/height,
    0,0,1,0,a.x,a.y,0,1];
}

export function readerMotion(frame,box,viewport){
  // Once the physical handoff is complete, typography belongs to the viewport.
  // The scene is paused while reading, so projected corners can predate a resize.
  if(frame.phase==='reading')return {transform:'none',opacity:1,expansion:1};
  const expansion=detailExpansion(frame.progress,frame.handoff),opacity=detailOpacity(frame.progress,frame.handoff);
  if(frame.kind==='project'&&viewport.width>768&&frame.corners.length===4){
    // Stay on the actual moving frame through the final pose and on its return.
    // The reader never stretches independently into a viewport-shaped rectangle.
    const corners=frame.corners.map(point=>({x:point.x*viewport.width-box.x,y:point.y*viewport.height-box.y}));
    const matrix=quadTransform(corners,box.width,box.height);
    // Pixel-align the settled, square-on face; resize rounding may differ by <1px.
    const end=[{x:0,y:0},{x:box.width,y:0},{x:box.width,y:box.height},{x:0,y:box.height}];
    const aligned=expansion===1&&corners.every((point,i)=>Math.abs(point.x-end[i].x)<1&&Math.abs(point.y-end[i].y)<1);
    return {transform:matrix&&!aligned?`matrix3d(${matrix.join(',')})`:'none',opacity:matrix?opacity:0,expansion};
  }
  if(expansion===1)return {transform:'none',opacity:1,expansion};
  const end=[{x:0,y:0},{x:box.width,y:0},{x:box.width,y:box.height},{x:0,y:box.height}];
  const corners=frame.corners.map((point,index)=>({
    x:(point.x*viewport.width-box.x)*(1-expansion)+end[index].x*expansion,
    y:(point.y*viewport.height-box.y)*(1-expansion)+end[index].y*expansion,
  }));
  const matrix=quadTransform(corners,box.width,box.height);
  return {transform:matrix?`matrix3d(${matrix.join(',')})`:'none',opacity:matrix?opacity:0,expansion};
}
