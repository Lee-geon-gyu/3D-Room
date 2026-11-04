import {ease} from './interactionModel.js';

export const DETAIL_HANDOFF=.48;
export const detailExpansion=(progress,handoff=DETAIL_HANDOFF)=>ease((progress-handoff)/(1-handoff));
export const detailOpacity=(progress,handoff=DETAIL_HANDOFF)=>ease((progress-handoff)/.18);
