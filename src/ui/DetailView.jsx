import {memo,useLayoutEffect,useMemo,useRef,useState} from 'react';
import {X,ArrowLeft,ArrowRight,ArrowUpRight,UserRound,Layers,GraduationCap,Award,Trophy} from 'lucide-react';
import {readerMotion} from './contentMotion.js';
import {tabletWakeState} from '../scene/tabletWake.js';
import {createContactBinding} from './contactBinding.js';
import {exhibitFrame,exhibitAspect,exhibitLogoCrops,exhibitReaderBounds} from '../exhibitFormat.js';

const base=import.meta.env.BASE_URL;
const url=path=>`${base}${path}`;
const profileTabs=[['mission-identity','소개',UserRound],['mission-modules','스킬',Layers],['mission-log','학력',GraduationCap],['mission-certification','자격',Award],['mission-achievement','수상',Trophy]];

function preservedHtml(html,{profile=false,contact=false}={}){
 const doc=new DOMParser().parseFromString(html,'text/html');
 doc.querySelectorAll('[src]').forEach(el=>el.setAttribute('src',url(el.getAttribute('src'))));
 doc.querySelectorAll('a[href="#"]').forEach(el=>{if(el.textContent.includes('010-'))el.href='tel:01087397139';else if(el.textContent.includes('@'))el.href='mailto:gungyu0203@naver.com';});
 if(profile){
  const label=doc.querySelector('.mission-identity .status');
  if(label){label.querySelector('dt').textContent='Name';label.querySelector('dd')?.remove();}
  doc.querySelectorAll('.mission-log time').forEach(time=>{time.textContent=time.textContent.replace(/(\d{4})\.\s+(\d{2})/g,'$1.\u00a0$2');});
 }
 if(contact){
  doc.querySelector('.footer-thankyou-position')?.remove();
  doc.querySelector('.footer-contact-title-position')?.remove();
  doc.querySelectorAll('a.footer-contact__item').forEach(link=>{
   const item=doc.createElement('div');item.className=link.className;item.append(...link.childNodes);link.replaceWith(item);
  });
  const panel=doc.querySelector('.footer-contact__panel'),details=panel?.querySelector('.footer-contact__details');
  if(details){
   const addresses=doc.createElement('div');addresses.className='contact-addresses';
   for(const selector of ['.footer-contact__info','.footer-contact__links']){const item=details.querySelector(selector);if(item)addresses.append(item);}
   details.prepend(addresses);
  }
  if(panel)return panel.outerHTML;
 }
 return doc.body.innerHTML;
}

function Profile({profile}){
 const [active,setActive]=useState(profileTabs[0][0]);
 const sections=useMemo(()=>profile.sections.map(section=>({...section,html:preservedHtml(section.originalHtml,{profile:true})})),[profile.sections]);
 return <>
  <nav className="profile-tabs" role="tablist" aria-label="프로필 항목">{profileTabs.map(([key,label,Icon],index)=><button key={key} role="tab" id={`profile-tab-${key}`} aria-label={label} aria-selected={active===key} aria-controls={`profile-panel-${key}`} tabIndex={active===key?0:-1} onClick={()=>setActive(key)} onKeyDown={event=>{
   if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
   event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?profileTabs.length-1:(index+(event.key==='ArrowRight'?1:-1)+profileTabs.length)%profileTabs.length;
   setActive(profileTabs[next][0]);event.currentTarget.parentElement.children[next].focus();
  }}><Icon size={18}/><span>{label}</span></button>)}</nav>
  <div className="preserved-profile">{sections.map(section=><div key={section.key} id={`profile-panel-${section.key}`} className={`profile-section${active===section.key?' is-active':''}`} role="tabpanel" aria-labelledby={`profile-tab-${section.key}`} dangerouslySetInnerHTML={{__html:section.html}}/>)}</div>
 </>;
}

const Project=memo(function Project({project}){
 const crop=exhibitLogoCrops[project.id];
 return <>
  <article className="exhibit" aria-label={`${project.title} 작품 소개`}>
   <figure className="exhibit-artwork"><img src={url(project.representativeImage)} alt={`${project.title} 디자인 목업`} /></figure>
   <div className="exhibit-caption" tabIndex={0} role="region" aria-label="작업물 소개와 정보">
    {crop
     ?<svg className="exhibit-logo exhibit-logo--dive" viewBox={`${crop.x} ${crop.y} ${crop.width} ${crop.height}`} role="img" aria-label={project.title}><image href={url(project.logo)} width={crop.sourceWidth} height={crop.sourceHeight}/></svg>
     :<img className="exhibit-logo" src={url(project.logo)} alt={project.title}/>}
    <h3 className="exhibit-tagline">{project.tagline}</h3>
    <p className="exhibit-description">{project.description}</p>
    <dl className="exhibit-metadata">{project.metadata.map(item=><div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
    <div className="exhibit-links">{project.links.map(link=><a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"><span>{link.label}</span><ArrowUpRight size={20} aria-hidden="true"/><span className="exhibit-sr-only"> (새 탭)</span></a>)}</div>
   </div>
  </article>
 </>;
});

export function Detail({id,content,onClose,onOpened,closing,connectMotion}){
 const dialogRef=useRef(null),openedRef=useRef(false);
 const profile=id==='profile',contact=id==='contact';
 const contactHtml=useMemo(()=>contact?preservedHtml(content.contact.originalHtml,{contact:true}):'',[contact,content.contact.originalHtml]);
 const [projectIndex,setProjectIndex]=useState(()=>Math.max(0,content.projects.findIndex(p=>p.id===id)));
 const project=content.projects[projectIndex],title=profile?'PROFILE':contact?'CONTACT':project?.title;
 useLayoutEffect(()=>{const body=dialogRef.current?.querySelector('.detail-body');if(body)body.scrollTop=0;},[projectIndex]);
 const selectProject=index=>{if(index===projectIndex)return;setProjectIndex(index);onOpened(content.projects[index].id);};
 useLayoutEffect(()=>{
  if(!title)return;
  const previous=document.activeElement,dialog=dialogRef.current;dialog.showModal();dialog.focus({preventScroll:true});
  const sheet=dialog.querySelector('.detail-sheet'),display=profile?dialog.querySelector('.tablet-display'):null;
  const binding=contact?createContactBinding(dialog,sheet):null;
  let box,viewport,lastFrame,frameAspect=exhibitAspect;
  const apply=frame=>{
   lastFrame=frame;if(!frame){sheet.style.opacity='0';binding?.hide();return;}
   if(frame.kind==='project'&&frame.aspect&&Math.abs(frame.aspect-frameAspect)>1e-8){frameAspect=frame.aspect;measure();return;}
   const motion=readerMotion(frame,box,viewport);
   sheet.style.transform=motion.transform;sheet.style.opacity=String(motion.opacity);
   if(binding?.apply(frame,box,motion))sheet.style.opacity='1';
   sheet.inert=frame.phase!=='reading';dialog.dataset.motion=frame.phase;
   dialog.style.setProperty('--content-backdrop',String(motion.expansion));
   if(display){
    const wake=tabletWakeState(frame.power);
    display.style.clipPath=`inset(${(1-wake.height)*50}% ${(1-wake.width)*50}%)`;
    sheet.style.setProperty('--tablet-line-opacity',String(wake.line));
    sheet.style.setProperty('--tablet-line-width',String(wake.width));
   }
   if(frame.phase==='reading'&&!openedRef.current){openedRef.current=true;onOpened(profile||contact?id:project.id);dialog.focus({preventScroll:true});}
  };
  const measure=()=>{
   if(!profile&&!contact){
    const fit=dialog.clientWidth<=768
     ?{width:Math.max(1,dialog.clientWidth-24),height:Math.max(1,dialog.clientHeight-24)}
     :exhibitReaderBounds(dialog.clientWidth,dialog.clientHeight,frameAspect);
    sheet.style.width=`${fit.width}px`;sheet.style.height=`${fit.height}px`;
    sheet.style.setProperty('--exhibit-rim',`${Math.max(3,fit.width*exhibitFrame.rim/exhibitFrame.width-1)}px`);
    sheet.style.setProperty('--exhibit-radius',`${fit.width*exhibitFrame.radius/exhibitFrame.width}px`);
   }
   box={x:sheet.offsetLeft,y:sheet.offsetTop,width:sheet.offsetWidth,height:sheet.offsetHeight};
   viewport={width:dialog.clientWidth,height:dialog.clientHeight};if(lastFrame)apply(lastFrame);
  };
  measure();
  const disconnect=connectMotion?.(apply);
  if(!connectMotion)apply({phase:'reading',progress:1,power:1,corners:[]});
  const observer=new ResizeObserver(measure);observer.observe(dialog);observer.observe(sheet);
  const onKey=event=>{
   if(event.key==='Escape'){event.preventDefault();onClose();}
   if(event.key==='Tab'){
    const items=[...dialog.querySelectorAll('button:not(:disabled),a[href],[tabindex="0"]')].filter(el=>el.getClientRects().length&&el.tabIndex>=0),first=items[0],last=items.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
   }
  };
  dialog.addEventListener('keydown',onKey);
  return()=>{disconnect?.();observer.disconnect();binding?.dispose();dialog.removeEventListener('keydown',onKey);dialog.close();if(previous?.isConnected)previous.focus();else document.querySelector('canvas')?.focus();};
 },[id,onClose,onOpened,connectMotion]);
 if(!title)return null;
 return <dialog ref={dialogRef} tabIndex={-1} style={!profile&&!contact?{'--exhibit-aspect':exhibitAspect}:undefined} className={`detail-dialog detail-dialog--tracked detail-dialog--${profile?'tablet':contact?'card':'artwork'}${closing?' is-closing':''}`} aria-labelledby="detail-title" onCancel={event=>{event.preventDefault();onClose();}} onClick={event=>{if(event.target===event.currentTarget)onClose();}}>
  <div className="detail-sheet" data-cursor-surface={contact?'':undefined}>
   <div className={profile?'tablet-display':'detail-display'} data-cursor-surface={!contact?'':undefined}>
   <header className="detail-header"><div className={profile?'profile-heading':undefined}>{!profile&&!contact?<p className="exhibit-category">{project.category}<span>{project.categoryKorean}</span></p>:null}<h2 id="detail-title" className={!profile&&!contact?'exhibit-sr-only':undefined}>{title}</h2>{profile?<p className="profile-header-role">{content.profile.role}</p>:null}</div>
    {!profile&&!contact?<nav className="project-switcher" aria-label="작업물 선택"><button onClick={()=>selectProject(projectIndex-1)} disabled={projectIndex===0} aria-label="이전 작업물"><ArrowLeft size={17}/></button><span aria-live="polite">{String(projectIndex+1).padStart(2,'0')} / {String(content.projects.length).padStart(2,'0')}</span><button onClick={()=>selectProject(projectIndex+1)} disabled={projectIndex===content.projects.length-1} aria-label="다음 작업물"><ArrowRight size={17}/></button></nav>:null}
    <button className="close-button" onClick={onClose} aria-label="상세 내용 닫기"><X size={22}/></button>
   </header>
   <div className="detail-body">
    {profile?<Profile profile={content.profile}/>:contact?<div className="preserved-contact" dangerouslySetInnerHTML={{__html:contactHtml}}/>:<Project key={project.id} project={project}/>}
   </div>
   </div>
  </div>
 </dialog>;
}
