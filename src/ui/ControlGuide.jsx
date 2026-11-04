import { useEffect, useRef } from 'react';
import { Gamepad2, Mouse, Navigation, X } from 'lucide-react';

const bindings=[
  {id:'move',keys:['W','A','S','D'],title:'이동',description:'방향키로도 이동할 수 있어요'},
  {id:'run',keys:['Shift'],title:'달리기',description:'누른 채 이동하세요'},
  {id:'crouch',keys:['C'],title:'앉기',description:'한 번 누르면 앉고, 다시 누르면 일어나요'},
  {id:'jump',keys:['Space'],title:'점프',description:'이동 중에도 가볍게 뛰어오를 수 있어요'},
  {id:'look',title:'시점 돌리기',description:'마우스를 누른 채 드래그하세요'},
  {id:'interact',keys:['E'],title:'상호작용',description:'태블릿·액자·연락처 노트를 살펴보거나 벤치에 앉아요'},
  {id:'seat',keys:['E','Space'],title:'벤치에서 일어나기',description:'이동키로도 일어날 수 있어요'},
  {id:'close',keys:['Esc'],title:'닫기 / 취소',description:'상세 화면과 가이드를 닫아요'},
];

function GuideDialog({onClose}) {
  const dialogRef=useRef(null);
  useEffect(()=>{
    const previous=document.activeElement,dialog=dialogRef.current;
    dialog.showModal();
    return()=>{dialog.close();if(previous?.isConnected)previous.focus();};
  },[]);
  return <dialog ref={dialogRef} className="controls-dialog" aria-labelledby="controls-title" onCancel={event=>{event.preventDefault();onClose();}} onClick={event=>{if(event.target===event.currentTarget)onClose();}}>
    <header className="controls-heading"><div><p>CONTROLS</p><h2 id="controls-title">조작 가이드</h2></div><button className="controls-close" onClick={onClose} aria-label="조작 가이드 닫기"><X size={18}/></button></header>
    <ul className="controls-bindings">{bindings.map(({id,keys,title,description})=><li key={id}>
      <div className={`controls-keys controls-keys--${id}`} aria-label={keys?.join(' ')||'마우스 드래그'}>
        {keys?keys.map(key=><kbd key={key}>{key}</kbd>):<><Mouse size={18}/><span>드래그</span></>}
        {id==='interact'?<><span className="controls-or">/</span><Mouse size={18}/></>:null}
      </div><div className="controls-description"><strong>{title}</strong><span>{description}</span></div>
    </li>)}</ul>
    <footer className="controls-tip"><Navigation size={16}/><p>목적지를 누르면 자동으로 달려가요.<br/>휴대폰에서는 달리는 사람 버튼과 이동 패드를 사용하세요.</p></footer>
  </dialog>;
}

export function ControlGuide({open,onOpen,onClose,disabled}) {
  return <div className="controls-menu">
    <button className="controls-toggle" onClick={onOpen} disabled={disabled} aria-label="조작 가이드 열기" aria-haspopup="dialog" aria-expanded={open} title="조작 가이드"><Gamepad2 size={19}/><span className="control-caption">조작 가이드</span></button>
    {open?<GuideDialog onClose={onClose}/>:null}
  </div>;
}
