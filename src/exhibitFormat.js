// One outer silhouette and rim width for hanging, moving and reading an exhibit.
export const exhibitFrame=Object.freeze({width:1.28,height:.8,rim:.016,radius:.0128,depth:.055,surface:.03});
export const exhibitAspect=exhibitFrame.width/exhibitFrame.height;
export function exhibitReaderBounds(width,height,aspect=exhibitAspect){
 const margin=Math.min(28,Math.max(10,width*.02));
 const frameWidth=Math.max(1,Math.min(width-margin*2,(height-margin*2)*aspect));
 const frameHeight=frameWidth/aspect;
 return{x:(width-frameWidth)/2,y:(height-frameHeight)/2,width:frameWidth,height:frameHeight};
}
export const exhibitLogoCrops={'project-02':{x:0,y:65,width:820,height:285,sourceWidth:1580,sourceHeight:360}};
