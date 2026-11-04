import { useEffect, useRef, useState } from 'react';
import { Music2, Volume2, VolumeX } from 'lucide-react';
import {readSoundVolume,saveSoundVolume} from './soundPreferences.js';
import {createMusicFilter} from './musicFilter.js';

export function AmbientMusic({submerged=false}){
  const audioRef=useRef(null),wantedRef=useRef(true),rootRef=useRef(null),settingsRef=useRef(null);
  const [volume,setVolume]=useState(()=>readSoundVolume('music')),[actions,setActions]=useState(()=>readSoundVolume('actions')),[volumeOpen,setVolumeOpen]=useState(false);
  const volumeRef=useRef(volume),graphRef=useRef(null),submergedRef=useRef(submerged);
  const [wanted,setWanted]=useState(true),[playing,setPlaying]=useState(false),[failed,setFailed]=useState(false);
  const play=()=>{
    const audio=audioRef.current;
    if(!wantedRef.current||document.hidden||!audio.paused)return Promise.resolve();
    graphRef.current?.resume();
    if(!audio.src)audio.src=`${import.meta.env.BASE_URL}assets/audio/cloud-letters-dream-piano-loop.wav?v=15`;
    audio.volume=graphRef.current?1:volumeRef.current/100;
    return audio.play().catch(error=>{if(error.name!=='NotAllowedError'&&error.name!=='AbortError'&&wantedRef.current)setFailed(true);});
  };
  useEffect(()=>{
    wantedRef.current=true;
    const audio=audioRef.current;
    const visibility=()=>{if(document.hidden)audio.pause();else if(wantedRef.current)play();};
    const unlock=()=>{
      if(!graphRef.current){try{graphRef.current=createMusicFilter(audio,window.AudioContext??window.webkitAudioContext,volumeRef.current/100,import.meta.env.DEV);if(graphRef.current){audio.volume=1;graphRef.current.setSubmerged(submergedRef.current);}}catch(error){console.warn('배경음악 오디오 필터를 연결하지 못했어요.',error);}}
      graphRef.current?.resume();if(wantedRef.current)play();
    };
    play();
    document.addEventListener('visibilitychange',visibility);
    window.addEventListener('pointerdown',unlock,{passive:true});window.addEventListener('keydown',unlock);
    const diagnostic=import.meta.env.DEV?setInterval(()=>{if(graphRef.current)audio.dataset.spectrum=JSON.stringify(graphRef.current.measure());},500):null;
    return()=>{wantedRef.current=false;if(diagnostic!==null)clearInterval(diagnostic);document.removeEventListener('visibilitychange',visibility);window.removeEventListener('pointerdown',unlock);window.removeEventListener('keydown',unlock);audio.pause();graphRef.current?.dispose();graphRef.current=null;};
  },[]);
  useEffect(()=>{submergedRef.current=submerged;graphRef.current?.setSubmerged(submerged);},[submerged]);
  useEffect(()=>{saveSoundVolume('music',volume);},[volume]);
  useEffect(()=>{
    if(!volumeOpen)return;
    const abort=new AbortController(),options={signal:abort.signal};
    window.addEventListener('pointerdown',event=>{if(!rootRef.current?.contains(event.target))setVolumeOpen(false);},options);
    window.addEventListener('keydown',event=>{if(event.key==='Escape'){setVolumeOpen(false);settingsRef.current?.focus();}},options);
    return()=>abort.abort();
  },[volumeOpen]);
  const changeVolume=event=>{
    const next=Number(event.target.value);volumeRef.current=next;setVolume(next);
    if(graphRef.current)graphRef.current.setVolume(next/100);else if(audioRef.current)audioRef.current.volume=next/100;
  };
  const changeActions=event=>{const next=Number(event.target.value);setActions(next);saveSoundVolume('actions',next);};
  const toggle=()=>{
    setFailed(false);wantedRef.current=!wantedRef.current;setWanted(wantedRef.current);
    if(wantedRef.current)play();else audioRef.current.pause();
  };
  const label=wanted?'몽환적인 배경음악 끄기':failed?'몽환적인 배경음악 다시 켜기':'몽환적인 배경음악 켜기';
  return <div ref={rootRef} className="music-control" data-underwater={submerged?'true':'false'}>
    <audio ref={audioRef} preload="none" loop aria-label="Cloud Letters · 피아노 BGM" onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)}/>
    <button className={`music-button${playing&&volume>0?' is-playing':''}`} onClick={toggle} aria-label={label} aria-pressed={wanted} title={label}>{wanted&&volume>0?<Music2 size={19}/>:<VolumeX size={19}/>}<span className="control-caption">BGM</span></button>
    <button ref={settingsRef} className="music-volume-toggle" aria-label="소리 볼륨 조절" aria-expanded={volumeOpen} aria-controls="bgm-volume-panel" onClick={()=>setVolumeOpen(open=>!open)} title="배경음악과 동작 소리 조절"><Volume2 size={14}/></button>
    {volumeOpen?<div id="bgm-volume-panel" className="music-volume-panel">
      <div className="music-volume-heading"><label htmlFor="bgm-volume">배경음악</label><output htmlFor="bgm-volume">{volume}%</output></div>
      <input id="bgm-volume" type="range" min="0" max="100" step="1" value={volume} aria-valuetext={`${volume}%`} onChange={changeVolume}/>
      <div className="music-volume-heading music-volume-heading--actions"><label htmlFor="action-volume">발걸음·동작</label><output htmlFor="action-volume">{actions}%</output></div>
      <input id="action-volume" type="range" min="0" max="100" step="1" value={actions} aria-valuetext={`${actions}%`} onChange={changeActions}/>
      <p className="music-volume-hint">걷기 · 달리기 · 점프 · 앉기</p>
      <p className="music-volume-hint"><a href={`${import.meta.env.BASE_URL}assets/audio/credits.html`} target="_blank" rel="noopener noreferrer" style={{color:'inherit'}}>음원 크레딧</a></p>
    </div>:null}
  </div>;
}
