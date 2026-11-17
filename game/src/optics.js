import {GLASS,BOARD} from './config.js';
import {sunlight} from './sun.js';
import {owns} from './state.js';
import {burst} from './particles.js';
function outputs(g,incoming){
 if(g.type===0)return [2*g.angle-incoming];
 if(g.type===2)return [g.angle-.36,g.angle,g.angle+.36];
 return [g.angle];
}
export function trace(s,only=null,extra=null){
 const pieces=extra?[...s.glass,extra]:s.glass, beams=[];
 function emit(g,incoming,power,focused,amplified,depth,visited){
  if(depth>4)return;
  const cfg=GLASS[g.type];const focus=g.type===1||focused,amp=g.type===4||amplified;
  const strength=power===null?cfg.damage*(1+g.level*.65):power*(g.type===4?1.7+g.level*.3:g.type===2?.55:1+g.level*.18);
  for(const angle of outputs(g,incoming)){
   const dx=Math.cos(angle),dy=Math.sin(angle);let length=cfg.range*(1+g.level*.15)*(owns(s,'reach')?1.4:1);
   if(dx>0)length=Math.min(length,(BOARD.x+BOARD.cols*48-g.x)/dx);if(dx<0)length=Math.min(length,(BOARD.x-g.x)/dx);
   if(dy>0)length=Math.min(length,(BOARD.y+BOARD.rows*48-g.y)/dy);if(dy<0)length=Math.min(length,(BOARD.y-g.y)/dy);
   let hit=null;
   for(const other of pieces){if(visited.includes(other.id)||other===g)continue;const ox=other.x-g.x,oy=other.y-g.y,t=ox*dx+oy*dy;if(t>8&&t<length&&Math.abs(ox*dy-oy*dx)<15){length=t;hit=other;}}
   beams.push({x:g.x,y:g.y,x2:g.x+dx*length,y2:g.y+dy*length,dx,dy,length,damage:strength,focused:focus,amplified:amp,burn:g.type===3,color:amp?'#ffe97f':focus?'#b1f3ff':cfg.color,root:g.id});
   if(hit)emit(hit,angle,strength,focus,amp,depth+1,[...visited,hit.id]);
  }
 }
 for(const g of only?[only]:pieces)emit(g,sunlight(s).angle,null,false,false,0,[g.id]);
 return beams;
}
export function beamStep(s,dt){
 s.beams=trace(s);
 for(const beam of s.beams){
  const hits=[];
  for(const b of s.beetles){const x=b.x-beam.x,y=b.y-beam.y,t=x*beam.dx+y*beam.dy;if(t>=0&&t<=beam.length&&Math.abs(x*beam.dy-y*beam.dx)<b.radius+3)hits.push({b,t});}
  hits.sort((a,b)=>a.t-b.t);
  for(const {b} of hits.slice(0,3+(owns(s,'pierce')?1:0))){
   if(b.type==='glint'&&!beam.focused&&!beam.amplified)continue;
   const armor=b.type==='bulwark'&&!beam.focused?.22:1;
   const damage=beam.damage*armor*(b.type==='titan'&&owns(s,'giant')?1.5:1)*dt;
   b.hp-=damage;b.flash=.08;b.damageText+=damage;
   if(beam.burn){b.burn=Math.min(10,b.burn+dt*3);b.burnTime=3;b.slow=1;}
   if(b.damageText>=18){burst(s,b.x,b.y-15,'#ffe7b3',1,'text',String(Math.round(b.damageText)));b.damageText=0;}
  }
  if(s.rng()<dt*5){const t=s.rng();burst(s,beam.x+(beam.x2-beam.x)*t,beam.y+(beam.y2-beam.y)*t,beam.color,1);}
 }
}
