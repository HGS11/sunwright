import {GLASS,BOARD,blocked,center} from './config.js';
import {owns} from './state.js';
import {burst} from './particles.js';
export function cost(s,type){return Math.ceil(GLASS[type].cost*(type===0&&owns(s,'thrift')?.75:1));}
export function valid(s,c,r){return c>=0&&r>=0&&c<BOARD.cols&&r<BOARD.rows&&!blocked.has(c+','+r)&&!s.glass.some(g=>g.c===c&&g.r===r);}
export function place(s,c,r){
 if(s.tool===null)return false;const type=s.tool,price=cost(s,type),free=s.vouchers.indexOf(type);
 if(!valid(s,c,r)||(s.motes<price&&free<0)){s.message='That glass needs a free lawn cell and enough motes.';s.sound?.('error');return false;}
 if(free>=0)s.vouchers.splice(free,1);else s.motes-=price;
 const g={id:s.nextId++,c,r,...center(c,r),type,angle:s.rotation,level:0,spent:free>=0?0:price};s.glass.push(g);
 burst(s,g.x,g.y,GLASS[type].color,12);s.sound?.('place');s.message=GLASS[type].name+' planted. R turns its facing.';return true;
}
export function rotate(s){const g=s.glass.find(g=>g.id===s.selected);if(g)g.angle+=Math.PI/12;else s.rotation+=Math.PI/12;s.sound?.('click');}
export function upgrade(s){const g=s.glass.find(g=>g.id===s.selected);if(!g)return;const price=GLASS[g.type].upgrade[g.level];if(g.level===2||s.motes<price){s.sound?.('error');return;}s.motes-=price;g.spent+=price;g.level++;s.sound?.('place');s.message=GLASS[g.type].name+' polished to level '+(g.level+1);}
export function sell(s){const i=s.glass.findIndex(g=>g.id===s.selected);if(i<0)return;const g=s.glass[i],refund=Math.floor(g.spent*(owns(s,'refund')?1:.7));s.motes+=refund;s.glass.splice(i,1);s.selected=null;s.message=GLASS[g.type].name+' sold for '+refund+' motes.';s.sound?.('click');}
