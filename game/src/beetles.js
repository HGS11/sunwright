import {BEETLES,DIFFICULTIES,PATHS} from './config.js';
import {owns,earn,finish} from './state.js';
import {burst} from './particles.js';
export function spawn(s,type,lane=0){
 const cfg=BEETLES[type],d=DIFFICULTIES[s.difficulty],path=PATHS[lane];
 const hp=cfg.hp*d.hp*(1+s.day*.22)*(type==='titan'?1+s.day*.12:1);
 const b={...cfg,type,id:s.nextId++,hp,maxHp:hp,x:path[0].x,y:path[0].y,path,segment:1,angle:0,burn:0,burnTime:0,slow:0,flash:0,damageText:0,stomp:0,speed:cfg.speed*d.speed*(1+s.day*.025)};
 s.beetles.push(b);if(type==='titan'){s.message='THE TITAN ENTERS — focus your lenses!';s.sound?.('stomp');s.shake=9;}return b;
}
export function beetlesStep(s,dt){
 for(let i=s.beetles.length-1;i>=0;i--){
  const b=s.beetles[i];b.flash=Math.max(0,b.flash-dt);b.slow=Math.max(0,b.slow-dt);
  if(b.burnTime>0){b.burnTime-=dt;b.hp-=b.burn*7*dt*(b.type==='bulwark'?.22:1)*(b.type==='titan'&&owns(s,'giant')?1.5:1);if(s.rng()<dt*18)burst(s,b.x,b.y,'#ff9b42',1);
   if(owns(s,'spread'))for(const n of s.beetles)if(n!==b&&n.type!=='glint'&&Math.hypot(n.x-b.x,n.y-b.y)<45){n.burn=Math.max(n.burn,b.burn*.5);n.burnTime=Math.max(n.burnTime,.6);}
  }else b.burn=0;
  if(b.hp<=0){s.kills++;const bounty=Math.round(b.bounty*(owns(s,'rich')?1.35:1));earn(s,bounty);burst(s,b.x,b.y,'#ffd47a',16);burst(s,b.x,b.y-20,'#fff1ab',1,'text','+'+bounty+' ☀');s.sound?.('scorch');if(b.type==='titan'){s.shake=15;s.message='Titan shattered! +'+bounty+' sun motes';s.sound?.('stomp');}s.beetles.splice(i,1);continue;}
  if(b.type==='titan'){b.stomp+=dt;if(b.stomp>2.4){b.stomp=0;s.shake=5;s.sound?.('stomp');}}
  let travel=b.speed*dt*(b.slow>0?.78:1)*(owns(s,'slow')?.85:1);
  while(travel>0&&b.segment<b.path.length){const p=b.path[b.segment],dx=p.x-b.x,dy=p.y-b.y,dist=Math.hypot(dx,dy);b.angle=Math.atan2(dy,dx);if(travel>=dist){b.x=p.x;b.y=p.y;b.segment++;travel-=dist;}else{b.x+=dx/dist*travel;b.y+=dy/dist*travel;travel=0;}}
  if(b.segment>=b.path.length){s.water=Math.max(0,s.water-b.drink);burst(s,b.x,b.y,'#93e6ff',24);burst(s,b.x,b.y-30,'#c7f4ff',1,'text','−'+b.drink+' water');s.sound?.('gulp');s.beetles.splice(i,1);if(s.water===0){finish(s,false);return;}}
 }
}
