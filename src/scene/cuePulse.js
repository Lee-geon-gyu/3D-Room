export {neonPulse as cueOpacity} from '../neonPulse.js';
export function applyCuePulse(cue,opacity,visible){
 cue.group.visible=visible&&opacity>0;
 // Hidden cues cannot contribute pixels. Restore their current pulse when
 // they become visible, without repeatedly touching every shared material.
 if(!visible||cue.opacity===opacity)return;
 cue.opacity=opacity;
 for(const child of cue.group.children){
  const material=child.material;if(!material)continue;
  material.userData.cueOpacity??=material.opacity;
  if(!material.transparent){material.transparent=true;material.needsUpdate=true;}
  material.depthWrite=false;
  material.opacity=material.userData.cueOpacity*opacity;
 }
}
