import {counts} from '../state/session.js';

export function allQuestsComplete(viewed,projects){
 const total=counts(viewed,projects);
 return projects.length>0&&total.profile===1&&total.contact===1&&total.portfolio===projects.length;
}

export const endingWriting={korean:4/3,english:1,englishDelay:.3};
export const endingTimings={depart:2600,first:3800,firstOut:6900,gap:7500,second:7750,secondOut:10600,complete:11250};
export const reducedEndingTimings={depart:650,first:1100,firstOut:3700,gap:4000,second:4300,secondOut:6900,complete:7400};

export const endingAllowsMovement=stage=>stage==='clear'||stage==='depart';

export function endingStage(elapsed,reduced=false){
 const t=reduced?reducedEndingTimings:endingTimings;
 let stage='clear';
 for(const [next,time] of Object.entries(t))if(elapsed>=time)stage=next;
 return stage;
}
