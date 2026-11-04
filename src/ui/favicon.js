export function installFavicon(document,scheme,base='./'){
 const icon=document.getElementById('site-favicon');
 if(!icon)return ()=>{};
 const update=()=>{icon.href=`${base}favicon-${scheme.matches?'dark':'light'}.svg`;};
 update();scheme.addEventListener('change',update);
 return ()=>scheme.removeEventListener('change',update);
}
