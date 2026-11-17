export function burst(s,x,y,color,count=8,kind='spark',text=''){
 for(let i=0;i<count;i++){
  const p=s.pool.pop()||{};const a=s.rng()*Math.PI*2,v=15+s.rng()*65;
  Object.assign(p,{x,y,vx:kind==='text'?0:Math.cos(a)*v,vy:kind==='text'?-30:Math.sin(a)*v,life:kind==='text'?1.25:.3+s.rng()*.6,max:1,color,kind,text,size:2+s.rng()*3});
  if(s.particles.length<700)s.particles.push(p);else s.pool.push(p);
 }
}
export function particlesStep(s,dt){for(let i=s.particles.length-1;i>=0;i--){const p=s.particles[i];p.life-=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.life<=0){s.pool.push(p);s.particles.splice(i,1);}}}
