const keys={music:'atelier.bgm.volume.v1',actions:'atelier.actions.volume.v1'};
const actionListeners=new Set();
export function readSoundVolume(kind){
 try{const saved=localStorage.getItem(keys[kind]),value=Number(saved);return saved!==null&&Number.isFinite(value)?Math.max(0,Math.min(100,value)):kind==='music'?28:100;}catch{return kind==='music'?28:100;}
}
export function saveSoundVolume(kind,value){
 const level=Math.max(0,Math.min(100,Number(value)||0));
 try{localStorage.setItem(keys[kind],String(level));}catch{}
 if(kind==='actions')for(const listener of actionListeners)listener(level/100);
}
export function observeActionVolume(listener){actionListeners.add(listener);return()=>actionListeners.delete(listener);}
