// Slow fades meet at zero without an invisible hold between cycles.
export const NEON_PERIOD=3.2;
export const FLOOR_NEON_PERIOD=4.8;
export function neonPulse(time,reducedMotion=false,period=NEON_PERIOD){
 return reducedMotion?.65:(1-Math.cos(time*Math.PI*2/period))/2;
}
