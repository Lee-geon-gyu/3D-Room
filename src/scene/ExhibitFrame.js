import * as THREE from 'three';
import {exhibitFrame,exhibitLogoCrops} from '../exhibitFormat.js';

export function createExhibitBody({width,height},oak,paper){
 const root=new THREE.Group();root.name='Landscape_Exhibit_Frame';
 const x=width/2,y=height/2,r=exhibitFrame.radius,outline=new THREE.Shape();
 outline.moveTo(-x+r,-y);outline.lineTo(x-r,-y);
 outline.absarc(x-r,-y+r,r,-Math.PI/2,0);
 outline.lineTo(x,y-r);outline.absarc(x-r,y-r,r,0,Math.PI/2);
 outline.lineTo(-x+r,y);outline.absarc(-x+r,y-r,r,Math.PI/2,Math.PI);
 outline.lineTo(-x,-y+r);outline.absarc(-x+r,-y+r,r,Math.PI,Math.PI*1.5);
 outline.closePath();
 const geometry=new THREE.ExtrudeGeometry(outline,{depth:exhibitFrame.depth,bevelEnabled:false,curveSegments:8});
 geometry.translate(0,0,-exhibitFrame.depth/2);
 const backing=new THREE.Mesh(geometry,oak);
 backing.name='Exhibit_Oak_Rim';backing.castShadow=backing.receiveShadow=true;root.add(backing);
 const print=new THREE.Mesh(new THREE.PlaneGeometry(width-2*exhibitFrame.rim,height-2*exhibitFrame.rim),paper);
 print.name='Exhibit_White_Mat';print.position.z=exhibitFrame.surface;print.receiveShadow=true;root.add(print);
 return{root,backing,print};
}

function textLines(ctx,text,x,y,width,lineHeight){
 let line='';for(const word of text.replace(/\s+/g,' ').trim().split(' ')){
  const next=line?`${line} ${word}`:word;
  if(line&&ctx.measureText(next).width>width){ctx.fillText(line,x,y);y+=lineHeight;line=word;}else line=next;
 }
 if(line)ctx.fillText(line,x,y);return y+lineHeight;
}

export function createExhibitPrint(project,image,logo){
 // Match the landscape reader: artwork on white mat, caption and details beside it.
 const canvas=document.createElement('canvas');canvas.width=1560;canvas.height=960;
 const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,1560,960);
 ctx.fillStyle='#121212';ctx.font='600 32px Urbanist, sans-serif';ctx.fillText(project.category,52,74);
 ctx.font='22px AtelierSans, sans-serif';ctx.fillText(project.categoryKorean,550,73);
 ctx.strokeStyle='#d8d8d8';ctx.lineWidth=1.3;ctx.beginPath();ctx.moveTo(950,150);ctx.lineTo(950,900);ctx.stroke();
 const ratio=Math.min(850/image.width,730/image.height),w=image.width*ratio,h=image.height*ratio;
 ctx.drawImage(image,52+(850-w)/2,160+(730-h)/2,w,h);
 const crop=exhibitLogoCrops[project.id]??{x:0,y:0,width:logo.width,height:logo.height};
 const mark=document.createElement('canvas');mark.width=crop.width;mark.height=crop.height;
 const ink=mark.getContext('2d');ink.drawImage(logo,crop.x,crop.y,crop.width,crop.height,0,0,crop.width,crop.height);
 ink.globalCompositeOperation='source-in';ink.fillStyle='#121212';ink.fillRect(0,0,mark.width,mark.height);
 const logoScale=Math.min(320/mark.width,96/mark.height);
 ctx.drawImage(mark,1000,210,mark.width*logoScale,mark.height*logoScale);
 ctx.fillStyle='#121212';ctx.font='600 29px AtelierSans, sans-serif';
 const next=textLines(ctx,project.tagline,1000,374,500,43);
 ctx.font='22px AtelierSans, sans-serif';textLines(ctx,project.description,1000,next+26,500,36);
 ctx.strokeStyle='#d8d8d8';for(const y of [610,818]){ctx.beginPath();ctx.moveTo(1000,y);ctx.lineTo(1508,y);ctx.stroke();}
 let row=660;for(const item of project.metadata){
  ctx.font='600 22px Urbanist, sans-serif';ctx.fillText(item.label,1000,row);
  ctx.font='22px Urbanist, sans-serif';row=Math.max(row+50,textLines(ctx,item.value,1154,row,354,31)+16);
 }
 let linkX=1000;for(const link of project.links){
  ctx.font='600 27px Urbanist, sans-serif';ctx.fillText(`${link.label} ↗`,linkX,878);
  const lineWidth=ctx.measureText(`${link.label} ↗`).width;ctx.beginPath();ctx.moveTo(linkX,892);ctx.lineTo(linkX+lineWidth,892);ctx.stroke();linkX+=lineWidth+58;
 }
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;return texture;
}
