import {BOARD} from './config.js';
import {place} from './glass.js';
export function bindInput(canvas,getState,action,refresh){
  function cell(e){const b=canvas.getBoundingClientRect(),scale=Math.min(b.width/canvas.width,b.height/canvas.height),left=b.left+(b.width-canvas.width*scale)/2,top=b.top+(b.height-canvas.height*scale)/2;const x=(e.clientX-left)/scale,y=(e.clientY-top)/scale;return {c:Math.floor((x-BOARD.x)/48),r:Math.floor((y-BOARD.y)/48)};}
 canvas.addEventListener('pointermove',e=>{getState().hover=cell(e);});
 canvas.addEventListener('pointerleave',()=>{getState().hover=null;});
  canvas.addEventListener('pointerdown',e=>{const s=getState();if(!['build','wave'].includes(s.phase)||s.paused||s.help)return;const {c,r}=cell(e),g=s.glass.find(g=>g.c===c&&g.r===r);if(g){s.selected=g.id;s.tool=null;s.sound?.('click');}else if(s.tool!==null)place(s,c,r);else s.selected=null;refresh();});
 window.addEventListener('keydown',e=>{if(e.repeat||e.ctrlKey||e.altKey||e.metaKey)return;const k=e.key.toLowerCase();const map={' ':'start',r:'rotate',u:'upgrade',x:'sell',escape:'escape',f:'speed',p:'pause',m:'mute',h:'help'};const a=/^[1-5]$/.test(k)?'tool:'+(Number(k)-1):map[k];if(a){e.preventDefault();action(a);}});
}
