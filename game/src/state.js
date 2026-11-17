import {DIFFICULTIES} from './config.js';
import {random} from './random.js';
export function bestScore(){try{return Number(localStorage.getItem('sunwright-best'))||0;}catch{return 0;}}
export function createState(difficulty='Bright',seed=1){
 const d=DIFFICULTIES[difficulty];
 return {difficulty,rng:random(seed),seed,phase:'build',day:0,wave:0,cleared:0,motes:d.motes,earned:0,water:d.water,maxWater:d.water,kills:0,
  glass:[],beetles:[],beams:[],particles:[],pool:[],charms:[],vouchers:[],draft:[],selected:null,tool:null,rotation:0,hover:null,
  time:0,waveTime:0,sunTime:0,spawnIndex:0,schedule:[],speed:1,paused:false,help:false,muted:false,shake:0,nextId:1,
  message:'Build your first light. A lens is useful against every shell.',best:bestScore(),score:0,ended:false};
}
export const owns=(s,id)=>s.charms.includes(id);
export function earn(s,n){s.motes+=n;s.earned+=n;}
export function score(s){return Math.round((s.kills*30+s.cleared*150+s.earned*2+Math.max(0,s.water)*10)*DIFFICULTIES[s.difficulty].score);}
export function finish(s,won){
 if(s.ended)return;
 s.ended=true;s.phase=won?'victory':'defeat';s.score=score(s);s.best=Math.max(s.best,s.score);
 if(!s.shot)try{localStorage.setItem('sunwright-best',String(s.best));}catch{}
 s.sound?.(won?'victory':'defeat');
}
