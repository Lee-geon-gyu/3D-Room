const lerp=(a,b,t)=>a+(b-a)*t;

export function bindingLayout(binding,box,expansion){
  const extent=Math.max(0,-Math.min(...[...binding.front,...binding.back].flatMap(t=>t.points.map(p=>p.v*binding.depth))));
  const fit=Number.isFinite(box.y)&&extent>0?Math.max(1,(box.y-4)/extent):Infinity;
  const scale=Math.min(760/binding.width*Math.max(.5,Math.min(1,box.width/760)),fit);
  // Keep the return leg beyond the actual paper edge, including on narrow phones.
  const hole={x:lerp(binding.punch.u*box.width,22,expansion),y:lerp(binding.punch.v*box.height,binding.punch.v*binding.depth*scale,expansion),
    rx:lerp(binding.punch.radius/binding.width*box.width,binding.punch.radius*scale,expansion),
    ry:lerp(binding.punch.radius/binding.depth*box.height,binding.punch.radius*scale,expansion)};
  const point=({u,v})=>({x:hole.x+lerp((u-binding.punch.u)*box.width,(u-binding.punch.u)*binding.width*scale,expansion),
    y:hole.y+lerp((v-binding.punch.v)*box.height,(v-binding.punch.v)*binding.depth*scale,expansion)});
  return {hole,front:binding.front.map(triangle=>({...triangle,points:triangle.points.map(point)})),back:binding.back.map(triangle=>({...triangle,points:triangle.points.map(point)}))};
}

export function createContactBinding(dialog,sheet){
  const ns='http://www.w3.org/2000/svg';
  const create=side=>{
    const svg=document.createElementNS(ns,'svg');svg.classList.add('contact-binding',`contact-binding--${side}`);svg.setAttribute('aria-hidden','true');return svg;
  };
  const back=create('back'),front=create('front');dialog.insertBefore(back,sheet);dialog.append(front);
  const originalShadow=getComputedStyle(sheet).boxShadow;
  let previousMask='',lastBinding,lastBox,lastExpansion,lastTransform;
  function hide(){back.style.display=front.style.display='none';lastBinding=null;}
  hide();
  return {
    apply(frame,box,motion){
      if(!frame?.binding||frame.progress<frame.handoff){hide();return false;}
      if(frame.binding===lastBinding&&box===lastBox&&motion.expansion===lastExpansion&&motion.transform===lastTransform)return true;
      lastBinding=frame.binding;lastBox=box;lastExpansion=motion.expansion;lastTransform=motion.transform;
      const binding=bindingLayout(frame.binding,box,motion.expansion),h=binding.hole;
      const mask=`<svg xmlns="http://www.w3.org/2000/svg" width="${box.width}" height="${box.height}"><defs><mask id="p"><rect width="100%" height="100%" rx="${box.width<=728?12:14}" fill="white"/><ellipse cx="${h.x}" cy="${h.y}" rx="${h.rx}" ry="${h.ry}" fill="black"/></mask></defs><rect width="100%" height="100%" fill="white" mask="url(#p)"/></svg>`;
      if(mask!==previousMask){sheet.style.maskImage=`url("data:image/svg+xml,${encodeURIComponent(mask)}")`;sheet.style.maskSize='100% 100%';previousMask=mask;}
      sheet.classList.add('is-threaded');sheet.style.boxShadow='none';sheet.style.zIndex='1';
      for(const [svg,triangles] of [[back,binding.back],[front,binding.front]]){
        Object.assign(svg.style,{display:'block',left:`${box.x}px`,top:`${box.y}px`,width:`${box.width}px`,height:`${box.height}px`,transform:motion.transform});
        svg.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);
        svg.innerHTML=triangles.map(({points,color})=>`<path fill="rgb(${color},${color},${color})" stroke="rgb(${color},${color},${color})" stroke-width=".35" stroke-linejoin="round" d="M${points.map(p=>`${p.x.toFixed(3)},${p.y.toFixed(3)}`).join('L')}Z"/>`).join('');
      }
      // A real transparent punch reveals the rear metal; paper conceals the rest.
      back.style.boxShadow=originalShadow;
      sheet.style.setProperty('--punch-x',`${h.x}px`);sheet.style.setProperty('--punch-y',`${h.y}px`);
      sheet.style.setProperty('--punch-rx',`${h.rx}px`);sheet.style.setProperty('--punch-ry',`${h.ry}px`);
      return true;
    },
    hide,
    dispose(){back.remove();front.remove();sheet.classList.remove('is-threaded');for(const name of ['mask-image','mask-size','box-shadow','z-index','--punch-x','--punch-y','--punch-rx','--punch-ry'])sheet.style.removeProperty(name);},
  };
}
