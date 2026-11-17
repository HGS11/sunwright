import {BOARD,GLASS,SUNS,blocked,center} from './config.js';
import {sunlight} from './sun.js';
import {trace} from './optics.js';
import {valid} from './glass.js';
import {random} from './random.js';
const TAU=Math.PI*2;
function ellipse(ctx,x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,TAU);ctx.fill();}
function line(ctx,x,y,xx,yy,color,width=1){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(xx,yy);ctx.stroke();}
export function createRenderer(canvas){
 const ctx=canvas.getContext('2d');const decor=[];const rng=random(4729);
 for(let i=0;i<850;i++)decor.push({x:70+rng()*960,y:112+rng()*432,n:rng(),size:2+rng()*5});
 function glass(g,ghost=false){
  const cfg=GLASS[g.type];ctx.save();ctx.translate(g.x,g.y);ctx.rotate(g.angle);ctx.shadowColor=cfg.color;ctx.shadowBlur=ghost?8:15;
  ellipse(ctx,0,7,20,9,'#10251b99');ctx.fillStyle='#30483d';ctx.strokeStyle='#c8ad70';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,18,0,TAU);ctx.fill();ctx.stroke();ctx.fillStyle=cfg.color;ctx.strokeStyle='#fff4d1';ctx.lineWidth=2;
  ctx.beginPath();if(g.type===0){ctx.rect(-5,-18,10,36);}else if(g.type===1){ctx.ellipse(0,0,7,18,0,0,TAU);}else if(g.type===2){ctx.moveTo(18,0);ctx.lineTo(-12,-17);ctx.lineTo(-12,17);ctx.closePath();}else{for(let i=0;i<(g.type===4?8:6);i++){const a=i*TAU/(g.type===4?8:6),r=g.type===4?(i%2?8:20):16;ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}ctx.closePath();}ctx.globalAlpha=.85;ctx.fill();ctx.stroke();ctx.globalAlpha=1;
  line(ctx,-2,-11,3,9,'#ffffffb0',2);line(ctx,20,0,28,0,'#fff1b7',2);line(ctx,28,0,24,-4,'#fff1b7',2);line(ctx,28,0,24,4,'#fff1b7',2);ctx.restore();
  for(let i=0;i<g.level;i++)ellipse(ctx,g.x-4+i*8,g.y+25,2,2,'#ffe392');
 }
 function beetle(b,s){
  ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.angle);const r=b.radius;
  ellipse(ctx,2,5,r*1.25,r*.8,'#0b191b66');
  for(let side of [-1,1])for(let j=0;j<3;j++){const x=(j-1)*r*.65,swing=Math.sin(s.time*11+j*1.6)*4;line(ctx,x,side*r*.45,x-6+swing,side*r*1.15,'#172b2c',3);line(ctx,x-6+swing,side*r*1.15,x+2+swing,side*r*1.4,'#a08c62',2);}
  ellipse(ctx,r*.65,0,r*.55,r*.53,'#1d3031');ellipse(ctx,-r*.12,0,r,r*.78,b.flash>0?'#e5ce9d':b.color);
  ctx.strokeStyle=b.type==='glint'?'#e2ffff':'#b29b68';ctx.lineWidth=b.type==='titan'?3:1.5;ctx.beginPath();ctx.ellipse(-r*.12,0,r,r*.78,0,0,TAU);ctx.stroke();line(ctx,-r,0,r*.6,0,'#142c2f',2);
  for(let side of [-1,1]){ellipse(ctx,r*.96,side*r*.25,2.5,2,b.type==='titan'?'#ff9471':'#f6d77c');line(ctx,r,side*r*.3,r*1.4,side*r*.6,'#b0ab7f');}
  if(b.type==='bulwark')for(let j=-1;j<=1;j++)line(ctx,j*r*.4,-r*.65,j*r*.4,r*.65,'#baa77e',3);
  if(b.type==='swift')line(ctx,-r*.65,-r*.4,r*.25,-r*.25,'#e7c268',3);
  if(b.type==='glint'){line(ctx,-r*.5,-r*.5,r*.4,r*.4,'#f4ffff',3);line(ctx,-r*.1,-r*.6,r*.5,-r*.2,'#fff',2);}
  if(b.type==='titan'){for(let j=0;j<3;j++){const x=-r*.7+j*r*.5;line(ctx,x,-r*.6,x+6,-r*.2,'#e0ac71',4);}const stage=Math.floor((1-b.hp/b.maxHp)*4);for(let j=0;j<stage;j++){const x=-r*.6+j*12;line(ctx,x,-r*.65,x+9,0,'#ffae68',2);line(ctx,x+9,0,x-4,r*.6,'#ffae68',2);}}
  ctx.restore();if(b.hp<b.maxHp){const w=r*2;ctx.fillStyle='#142522';ctx.fillRect(b.x-r,b.y-r-12,w,4);ctx.fillStyle=b.type==='titan'?'#ffb179':'#c9df8c';ctx.fillRect(b.x-r,b.y-r-12,w*Math.max(0,b.hp/b.maxHp),4);}
  if(b.burn>0){ctx.fillStyle='#ffb25c';ctx.font='10px Arial';ctx.textAlign='center';ctx.fillText('♨ '+Math.ceil(b.burn),b.x,b.y+r+19);}
 }
 return s=>{
  ctx.clearRect(0,0,1100,640);const sky=ctx.createLinearGradient(0,0,0,640);sky.addColorStop(0,'#3d5142');sky.addColorStop(.2,'#69744c');sky.addColorStop(1,'#183e32');ctx.fillStyle=sky;ctx.fillRect(0,0,1100,640);
   const sun=sunlight(s);const sx=s.phase==='title'?550+Math.sin(s.time*.1)*180:sun.x,sy=Math.max(32,sun.y);const halo=ctx.createRadialGradient(sx,sy,8,sx,sy,190);halo.addColorStop(0,SUNS[s.day].color+'66');halo.addColorStop(1,SUNS[s.day].color+'00');ctx.fillStyle=halo;ctx.fillRect(0,0,1100,240);ellipse(ctx,sx,sy,17,17,SUNS[s.day].color);
  for(let i=0;i<12;i++){const a=i*TAU/12+s.time*.05;line(ctx,sx+Math.cos(a)*23,sy+Math.sin(a)*23,sx+Math.cos(a)*30,sy+Math.sin(a)*30,'#e9d69d88',2);}
   ctx.fillStyle='#c2c6a5';ctx.font='10px Arial';ctx.textAlign='left';ctx.fillText('THE WALLED GARDEN',220,87);ctx.textAlign='right';ctx.fillText('EST. IN THE AGE OF LIGHT',880,87);
  ctx.save();if(s.shake>0)ctx.translate(Math.sin(s.time*91)*s.shake,Math.cos(s.time*77)*s.shake*.5);
  ctx.fillStyle='#172d25';ctx.fillRect(45,93,1010,480);ctx.fillStyle='#8d8862';ctx.fillRect(52,99,996,463);ctx.fillStyle='#354f34';ctx.fillRect(70,112,960,432);
  for(let x=53;x<1040;x+=38){ctx.fillStyle=x%3?'#b0a079':'#958c65';ctx.fillRect(x,99,35,12);ctx.fillRect(x,546,35,13);}
  for(const p of decor){const c=Math.floor((p.x-70)/48),r=Math.floor((p.y-112)/48);if(blocked.has(c+','+r))continue;line(ctx,p.x,p.y,p.x-2,p.y-p.size,p.n>.5?'#7c995040':'#a2b66b33');if(p.n>.96){ellipse(ctx,p.x,p.y-3,2,2,p.n>.98?'#e9c179':'#cfbcad');}}
  for(const key of blocked){const [c,r]=key.split(',').map(Number),p=center(c,r);ctx.fillStyle='#a7805c';ctx.fillRect(p.x-24,p.y-24,48,48);for(let j=0;j<4;j++){ctx.fillStyle=(c+r+j)%3?'#b4916b':'#c0a077';ctx.fillRect(p.x-22+(j%2)*23,p.y-22+Math.floor(j/2)*23,21,21);}line(ctx,p.x-18,p.y-15,p.x-11,p.y-17,'#d2b48b66');}
  for(const y of [232,472]){ctx.fillStyle='#263c30';ctx.fillRect(46,y-26,25,52);ctx.strokeStyle='#d1ae6b';ctx.lineWidth=3;ctx.strokeRect(48,y-24,19,48);}
  for(let c=0;c<20;c++)for(let r=0;r<9;r++){const p=center(c,r);if(!blocked.has(c+','+r)){ctx.fillStyle='#b9cb7920';ctx.fillRect(p.x-1,p.y-1,2,2);}}
  const f=center(16,4);ellipse(ctx,f.x,f.y+12,46,28,'#132f2b88');ellipse(ctx,f.x,f.y,43,32,'#d5c597');ellipse(ctx,f.x,f.y-3,35,25,'#596d62');ellipse(ctx,f.x,f.y-4,30,21,'#508b9a');ellipse(ctx,f.x,f.y-6,27*Math.max(.2,s.water/s.maxWater),17,'#82cbd0');
  for(let j=0;j<3;j++){ctx.strokeStyle='#d4f6e688';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(f.x,f.y-6,8+(s.time*10+j*9)%23,4+(s.time*5+j*4)%11,0,0,TAU);ctx.stroke();}
  ctx.fillStyle='#e1d5ad';ctx.fillRect(f.x-5,f.y-35,10,30);ellipse(ctx,f.x,f.y-35,17,7,'#cfc398');line(ctx,f.x,f.y-43,f.x,f.y-55-Math.sin(s.time*3)*3,'#cbf5e8',3);ellipse(ctx,f.x,f.y-43,9,4,'#96dadd');
  let beams=s.phase==='wave'?s.beams:[];
  const selected=s.glass.find(g=>g.id===s.selected);let ghost=null;
  if(s.tool!==null&&s.hover){ghost={...center(s.hover.c,s.hover.r),c:s.hover.c,r:s.hover.r,id:-1,type:s.tool,angle:s.rotation,level:0};if(valid(s,ghost.c,ghost.r))beams=[...beams,...trace(s,ghost,ghost)];}
  if(selected)beams=[...beams,...trace(s,selected)];
  ctx.save();ctx.globalCompositeOperation='screen';for(const b of beams){ctx.globalAlpha=.14;line(ctx,b.x,b.y,b.x2,b.y2,b.color,b.focused?12:8);ctx.globalAlpha=.7;line(ctx,b.x,b.y,b.x2,b.y2,b.color,b.amplified?3:1.5);ctx.globalAlpha=.85;line(ctx,b.x,b.y,b.x2,b.y2,'#fff7d5',.6);}ctx.restore();
  for(const g of s.glass){glass(g);if(g===selected){ctx.strokeStyle='#fff0af';ctx.setLineDash([4,4]);ctx.strokeRect(g.x-23,g.y-23,46,46);ctx.setLineDash([]);}}
  if(ghost){const ok=valid(s,ghost.c,ghost.r);ctx.fillStyle=ok?'#b1ef8a44':'#ff665566';ctx.fillRect(ghost.x-24,ghost.y-24,48,48);ctx.strokeStyle=ok?'#c6f6aa':'#ff9988';ctx.strokeRect(ghost.x-24,ghost.y-24,48,48);ctx.globalAlpha=.6;glass(ghost,true);ctx.globalAlpha=1;}
  for(const b of [...s.beetles].sort((a,b)=>a.y-b.y))beetle(b,s);
  for(const p of s.particles){ctx.globalAlpha=Math.min(1,p.life*2);if(p.kind==='text'){ctx.fillStyle=p.color;ctx.font='bold 13px Arial';ctx.textAlign='center';ctx.fillText(p.text,p.x,p.y);}else ellipse(ctx,p.x,p.y,p.size*.5,p.size*.5,p.color);}ctx.globalAlpha=1;
  ctx.restore();ctx.fillStyle='#bbcaab';ctx.font='italic 13px Georgia';ctx.textAlign='center';ctx.fillText('Catch the sun. Turn the tide.',550,602);ctx.font='10px Arial';ctx.fillStyle='#9bad90';ctx.fillText('✦   '+(s.phase==='build'?'THE SUN WAITS FOR YOUR HAND':s.phase==='wave'?'LET THE GLASS SING':'NINE SUNS · ONE LIVING SPRING')+'   ✦',550,622);
 };
}
