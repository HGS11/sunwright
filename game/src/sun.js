import {SUNS} from './config.js';
export function sunlight(s){
 const p=s.phase==='build'?0:Math.min(1,s.sunTime/55);
 const tilt=SUNS[s.day].tilt;
 const x=550+(p-.5)*840+Math.sin(p*Math.PI)*tilt*90;
 const y=72-Math.sin(p*Math.PI)*(44+tilt*22);
 return {x,y,angle:Math.atan2(328-y,550-x)+tilt*.25,p,color:SUNS[s.day].color};
}
