// One continuous entrance approach, independent of the resource percentage.
export const loadingStoryboard=[
 {asset:'gallery-exterior-v3.png',portrait:'gallery-exterior-v3.png',name:'노을빛 갤러리 입구로 걸어가기'},
];
export const loadingShotDuration=8000;
export const loadingSequenceDuration=loadingStoryboard.length*loadingShotDuration;
export function loadingRevealDelay(elapsed,reduced=false){return reduced?0:Math.max(0,loadingSequenceDuration-elapsed);}
