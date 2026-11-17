import {CHARMS} from './config.js';
import {owns,earn} from './state.js';
export function draft(s){const pool=CHARMS.filter(c=>!owns(s,c.id));s.draft=[];while(s.draft.length<3&&pool.length)s.draft.push(pool.splice(Math.floor(s.rng()*pool.length),1)[0]);s.phase='draft';}
export function chooseCharm(s,id){
 if(s.phase!=='draft'||!s.draft.some(c=>c.id===id))return;
 s.charms.push(id);if(id==='gift')earn(s,160);if(id==='well'){s.maxWater+=50;s.water+=50;}
 s.day++;s.wave=0;s.sunTime=0;s.phase='build';
 if(owns(s,'free')){const type=Math.floor(s.rng()*5);s.vouchers.push(type);}
 s.draft=[];s.message='A new sun. Turn your glass to meet the light.';s.sound?.('place');
}
