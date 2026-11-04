import {DataTexture,RGBAFormat,RepeatWrapping,SRGBColorSpace} from 'three';

// Small, seamless boucle loops give both rugs and upholstery a wool surface.
// It is one shared texture, rather than thousands of fur strands or extra draws.
export function createWoolTexture(){
 const size=256,data=new Uint8Array(size*size*4);let seed=4817;
 const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const row=Math.floor(y/8),dx=(x+(row%2)*4)%8-4,dy=y%8-4;
  const loop=Math.exp(-Math.pow((Math.hypot(dx,dy*.84)-2.35)/.75,2));
  const c=Math.round(223+loop*20+random()*8),i=(y*size+x)*4;data[i]=data[i+1]=data[i+2]=c;data[i+3]=255;
 }
 const texture=new DataTexture(data,size,size,RGBAFormat);texture.name='Shared_Wool_Boucle_Fibres';texture.wrapS=texture.wrapT=RepeatWrapping;texture.repeat.set(3.5,3.5);texture.colorSpace=SRGBColorSpace;texture.needsUpdate=true;return texture;
}
export function configureWool(material,texture){
 if(!['Wool_Boucle_Carpet','Sunken_Sofa_Boucle','Sunken_Olive_Pillow'].includes(material.name))return;
 material.map=texture;material.bumpMap=texture;material.bumpScale=material.name==='Wool_Boucle_Carpet'?.004:.0025;material.roughness=1;material.metalness=0;
 material.color.set(material.name==='Sunken_Olive_Pillow'?0x70765a:material.name==='Wool_Boucle_Carpet'?0xd8cbb8:0xeee3d1);
 if(material.isMeshPhysicalMaterial){material.sheen=.45;material.sheenColor.set(0xfff3df);material.sheenRoughness=1;}
}
