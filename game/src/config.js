export const BOARD = { x:70, y:112, cell:48, cols:20, rows:9, width:1100, height:640 };
export const center = (c,r) => ({x:BOARD.x+(c+.5)*48,y:BOARD.y+(r+.5)*48});
export const ROUTES = [ [[0,2],[6,2],[6,6],[12,6],[12,4],[16,4]], [[0,7],[3,7],[3,4],[9,4],[9,2],[16,2],[16,4]] ];
export const PATHS = ROUTES.map(route => route.map(([c,r])=>center(c,r)));
export const blocked = new Set(['16,4']);
for(const route of ROUTES) for(let i=1;i<route.length;i++) {
  let [x,y]=route[i-1]; const [tx,ty]=route[i];
  blocked.add(x+','+y);
  while(x!==tx||y!==ty){ x+=Math.sign(tx-x); y+=Math.sign(ty-y); blocked.add(x+','+y); }
}
export const GLASS = [
  {name:'Mirror',icon:'◇',cost:35,color:'#fff0a3',damage:24,range:1200,upgrade:[30,50],description:'Reflects sunlight across its facing. Cheap, long-reaching light.'},
  {name:'Lens',icon:'◉',cost:65,color:'#9eeeff',damage:88,range:260,upgrade:[50,80],description:'Short focused beam along its arrow. Pierces armour and mirror shells.'},
  {name:'Prism',icon:'△',cost:80,color:'#d9b3ff',damage:20,range:1200,upgrade:[60,90],description:'Fans incoming light into three beams around its facing.'},
  {name:'Amber',icon:'⬡',cost:60,color:'#ffaf55',damage:12,range:1200,upgrade:[45,70],description:'Searing light stacks embers and slows beetles.'},
  {name:'Sunstone',icon:'✦',cost:125,color:'#ffe875',damage:60,range:1200,upgrade:[85,120],description:'Strong light along its facing. Amplifies chained beams, breaking mirror shells.'}
];
export const BEETLES = {
 drone:{name:'Drone',hp:65,speed:38,radius:12,drink:6,bounty:10,color:'#35474c'},
 swift:{name:'Swift',hp:38,speed:69,radius:9,drink:4,bounty:9,color:'#6d6940'},
 bulwark:{name:'Bulwark',hp:180,speed:25,radius:18,drink:13,bounty:22,color:'#716254'},
 glint:{name:'Glint',hp:85,speed:40,radius:13,drink:9,bounty:18,color:'#a4d8e0'},
 titan:{name:'Titan',hp:1400,speed:16,radius:33,drink:55,bounty:150,color:'#493544'}
};
export const DIFFICULTIES = {
 Gentle:{motes:290,water:180,hp:.72,speed:.85,score:.75},
 Bright:{motes:230,water:120,hp:1,speed:1,score:1},
 Blazing:{motes:190,water:90,hp:1.25,speed:1.12,score:1.6}
};
export const SUNS = [
 ['First Light','#ffd36a',-.30],['Honey Rise','#ffbc60',.15],['Cinder Crown','#ff9b61',-.5],
 ['High Orchard','#ffe392',.35],['White Zenith','#fff9d2',0],['Burning Halo','#ffce87',-.65],
 ['Copper Hymn','#ffa272',.55],['Rose Vigil','#f5a0a4',-.2],['Last Radiance','#ff83a0',.7]
].map(([name,color,tilt])=>({name,color,tilt}));
export const CHARMS = [
 {id:'thrift',icon:'◇',name:'Silver Bargain',text:'Mirrors cost 25% less.'},
 {id:'reach',icon:'↗',name:'Long Summer',text:'All beam ranges increase by 40%.'},
 {id:'gift',icon:'☀',name:'Pocket Sunrise',text:'Receive 160 sun motes immediately.'},
 {id:'well',icon:'≈',name:'Deep Spring',text:'Gain 50 maximum water and refill 50 water.'},
 {id:'spread',icon:'♨',name:'Wildfire Pollen',text:'Burning beetles spread embers to nearby shells.'},
 {id:'slow',icon:'❧',name:'Patient Roots',text:'All beetles move 15% slower.'},
 {id:'rich',icon:'✧',name:'Gilded Wings',text:'Beetle bounties increase by 35%.'},
 {id:'refund',icon:'↶',name:'Second Chances',text:'Selling returns the full investment.'},
 {id:'time',icon:'◷',name:'Lingering Day',text:'The sun travels 35% more slowly.'},
 {id:'pierce',icon:'⇢',name:'Thread of Light',text:'Every beam can strike one extra beetle at once.'},
 {id:'giant',icon:'♜',name:'Shellbreaker',text:'All damage to Titans increases by 50%.'},
 {id:'free',icon:'✦',name:'Glass Orchard',text:'Receive one free random glass voucher now and each new sun.'}
];
export const WAVES = Array.from({length:27},(_,i)=>{
 const day=Math.floor(i/3), wave=i%3;
 const types=Array.from({length:8+day*2+wave*3},(_,j)=> day>=3&&j%5===3?'glint':day>=1&&j%4===2?'bulwark':j%3===1?'swift':'drone');
 if(wave===2&&(day+1)%3===0) types.push('titan');
 if(i===26) types.push('glint','bulwark','swift','glint','drone','swift');
 return types;
});
