export function createAudio(){
 let ctx=null,lastScorch=-1;
 const notes={click:[520,.05],place:[880,.18],error:[110,.16],scorch:[170,.09],gulp:[190,.25],horn:[330,.55],stomp:[48,.28],victory:[523,.22],defeat:[90,1.1]};
 return (name,muted=false)=>{
  if(muted)return;
  try{ctx??=new (window.AudioContext||window.webkitAudioContext)();if(ctx.state==='suspended')ctx.resume();
   if(name==='scorch'&&ctx.currentTime-lastScorch<.12)return;if(name==='scorch')lastScorch=ctx.currentTime;
   const [freq,duration]=notes[name]||notes.click;
   const melody=name==='victory'?[1,1.25,1.5,2]:name==='place'?[1,1.5]:[1];
   melody.forEach((ratio,i)=>{const at=ctx.currentTime+i*.12,o=ctx.createOscillator(),g=ctx.createGain();o.type=name==='stomp'||name==='scorch'?'sawtooth':'sine';o.frequency.setValueAtTime(freq*ratio,at);o.frequency.exponentialRampToValueAtTime(Math.max(20,freq*ratio*(name==='gulp'?.3:1.05)),at+duration);g.gain.setValueAtTime(0,at);g.gain.linearRampToValueAtTime(.055,at+.01);g.gain.exponentialRampToValueAtTime(.001,at+duration);o.connect(g);g.connect(ctx.destination);o.start(at);o.stop(at+duration+.02);});
  }catch{}
 };
}
