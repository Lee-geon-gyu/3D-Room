// Original environment artwork is projected across independently drifting 3D banks.
export const landscapeLayers=[
 {z:-90,opacity:1,drift:0,relief:0},
 {z:-65,opacity:.96,drift:.0024,relief:.08,distant:true},
 {z:-54,opacity:.24,drift:.0032,relief:.12,distant:true},
 {z:-42,opacity:.88,drift:.006,relief:.45},
 {z:-16,opacity:.28,drift:.0085,relief:.38},
 {z:-3,opacity:.14,drift:.011,relief:.22},
];
export function landscapePlane(aspect,depth,imageAspect=1673/940){
 const height=2*Math.tan(42*Math.PI/360)*depth*1.08;
 const scale=Math.max(1,aspect/imageAspect);
 return {width:height*imageAspect*scale,height:height*scale};
}
// A mirrored texture repeats seamlessly every two widths; its velocity never
// reverses. Keep the coordinate bounded during arbitrarily long visits.
export function cloudOffset(time,drift){return ((time*Math.abs(drift))%2+2)%2;}
export function landscapeResolution(width,height){
 const scale=Math.min(1,(width<=768?960:1440)/Math.max(width,height));
 return {width:Math.max(1,Math.round(width*scale)),height:Math.max(1,Math.round(height*scale))};
}
