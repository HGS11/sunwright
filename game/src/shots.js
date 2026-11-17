import {createState,finish} from './state.js';
import {center,PATHS} from './config.js';
import {spawn} from './beetles.js';
import {trace} from './optics.js';
import {burst} from './particles.js';
export const SHOTS=['title','play','titan','victory','defeat'];
export function shotScene(name,seed){
 const s=createState('Bright',seed);s.shot=true;s.time=12.5;s.phase=name==='title'?'title':'wave';s.day=name==='titan'?8:3;s.wave=2;s.sunTime=23;s.motes=386;s.water=94;s.kills=87;s.earned=1430;s.cleared=11;s.charms=['reach','rich','spread'];
 const placements=[[0,4,1,.8],[1,6,3,Math.PI/2],[2,8,6,-Math.PI/2],[3,3,5,0],[4,10,3,Math.PI/2],[1,12,5,Math.PI],[0,14,3,1.9],[2,15,6,-Math.PI/2],[3,7,5,0],[1,15,3,0]];
 for(const [type,c,r,angle] of placements)s.glass.push({type,c,r,...center(c,r),angle,level:type%3,id:s.nextId++,spent:100});
 for(let i=0;i<15;i++){const type=['drone','swift','bulwark','glint'][i%4],b=spawn(s,type,i%2);const p=PATHS[i%2],seg=1+Math.floor(s.rng()*(p.length-1)),t=s.rng();b.segment=seg;b.x=p[seg-1].x+(p[seg].x-p[seg-1].x)*t;b.y=p[seg-1].y+(p[seg].y-p[seg-1].y)*t;b.angle=Math.atan2(p[seg].y-p[seg-1].y,p[seg].x-p[seg-1].x);b.hp*=.35+s.rng()*.6;if(i%3===0){b.burn=4;burst(s,b.x,b.y,'#ffb55c',8);}}
 if(name==='titan'){const b=spawn(s,'titan',0);Object.assign(b,center(10,6));b.segment=3;b.hp=b.maxHp*.48;s.message='THE LAST TITAN — the spring must hold.';}
 else s.message='Sunlight in every shard. A garden holding its breath.';
 s.shake=0;s.beams=trace(s);for(const b of s.beams){const t=s.rng();burst(s,b.x+(b.x2-b.x)*t,b.y+(b.y2-b.y)*t,b.color,3);}
 if(name==='title'){s.day=0;s.wave=0;s.charms=[];s.motes=230;s.water=120;}
 if(name==='victory'||name==='defeat'){s.day=8;s.wave=2;s.cleared=name==='victory'?27:26;s.kills=518;s.earned=9240;s.charms=['thrift','reach','gift','well','spread','rich','giant','free'];s.water=name==='victory'?63:0;finish(s,name==='victory');}
 return s;
}
