import {createState} from './state.js';
import {createRenderer} from './render.js';
import {createUI} from './ui.js';
import {bindInput} from './input.js';
import {createAudio} from './audio.js';
import {startWave,wavesStep} from './waves.js';
import {beetlesStep} from './beetles.js';
import {beamStep} from './optics.js';
import {particlesStep} from './particles.js';
import {rotate,upgrade,sell} from './glass.js';
import {chooseCharm} from './charms.js';
import {shotScene,SHOTS} from './shots.js';
const params=new URLSearchParams(location.search),shot=params.get('shot');
const seed=Number(params.get('seed')||1729)>>>0;
let state=SHOTS.includes(shot)?shotScene(shot,seed):createState('Bright',seed);
if(!state.shot)state.phase='title';
const audio=createAudio();
function attachSound(){state.sound=name=>audio(name,state.muted);}
attachSound();
function reset(title=false){const {difficulty,muted}=state;state=createState(difficulty,seed);state.muted=muted;if(title)state.phase='title';attachSound();}
function action(a){
 try{dispatch(a);}finally{ui(state);render(state);}
}
function dispatch(a){
 const [kind,value]=a.split(':');
 if(kind==='mute'){state.muted=!state.muted;state.sound('click');return;}
 if(kind==='help'){state.help=!state.help;return;}
 if(kind==='escape'){if(state.help)state.help=false;else{state.tool=null;state.selected=null;}return;}
 if(state.help)return;
 if(kind==='difficulty'&&state.phase==='title'){state.difficulty=value;state.sound('click');return;}
 if(kind==='play'||kind==='restart'){reset();state.sound('place');return;}
 if(kind==='title'){reset(true);return;}
 if(kind==='charm'){chooseCharm(state,value);return;}
 if(!['build','wave'].includes(state.phase))return;
 if(kind==='pause'){state.paused=!state.paused;state.sound('click');return;}
 if(state.paused)return;
 if(kind==='tool'){state.tool=Number(value);state.selected=null;state.message='Click free lawn to plant. R rotates the preview; Escape cancels.';}
 if(kind==='cancel'){state.tool=null;state.selected=null;}
 if(kind==='rotate')rotate(state);
 if(kind==='upgrade')upgrade(state);
 if(kind==='sell')sell(state);
 if(kind==='start')startWave(state);
 if(kind==='speed')state.speed=state.speed===1?2:1;
 state.sound('click');
}
const canvas=document.querySelector('#canvas'),render=createRenderer(canvas),ui=createUI(action);
bindInput(canvas,()=>state,action,()=>{ui(state);render(state);});
export function step(s,dt){
 if(s.paused||s.help||!['wave','build','title'].includes(s.phase))return;
 s.time+=dt;s.shake=Math.max(0,s.shake-dt*15);particlesStep(s,dt);
 if(s.phase==='wave'){beamStep(s,dt);beetlesStep(s,dt);if(s.phase==='wave')wavesStep(s,dt);}
}
if(state.shot){ui(state);render(state);window.__shotReady=true;}
else{
 let last=null,accumulator=0;
 function frame(now){if(last===null)last=now;accumulator+=Math.min(.1,(now-last)/1000)*state.speed;last=now;while(accumulator>=1/60){step(state,1/60);accumulator-=1/60;}ui(state);render(state);requestAnimationFrame(frame);}
 requestAnimationFrame(frame);
}
