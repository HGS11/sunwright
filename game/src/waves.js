import {WAVES} from './config.js';
import {spawn} from './beetles.js';
import {earn,finish,owns} from './state.js';
import {draft} from './charms.js';
export function startWave(s){if(s.phase!=='build'||s.paused||s.help)return;s.phase='wave';s.waveTime=0;s.sunTime=0;s.spawnIndex=0;s.schedule=WAVES[s.day*3+s.wave].map((type,i)=>({type,at:i*(type==='swift'?.7:1.05),lane:i%2})).sort((a,b)=>a.at-b.at);s.message='Light the paths. Protect the spring.';s.sound?.('horn');}
export function wavesStep(s,dt){
 s.waveTime+=dt;s.sunTime+=dt*(owns(s,'time')?.65:1);
 while(s.spawnIndex<s.schedule.length&&s.schedule[s.spawnIndex].at<=s.waveTime){const e=s.schedule[s.spawnIndex++];spawn(s,e.type,e.lane);}
 if(s.spawnIndex===s.schedule.length&&s.beetles.length===0){s.cleared++;const bonus=35+s.day*8;earn(s,bonus);s.message='Wave cleared! +'+bonus+' motes. Refine your garden.';s.sound?.('place');if(s.wave===2){if(s.day===8)finish(s,true);else draft(s);}else{s.wave++;s.phase='build';s.sunTime=0;}}
}
