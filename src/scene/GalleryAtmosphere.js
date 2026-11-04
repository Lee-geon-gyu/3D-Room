import * as T from 'three';

// Sky and continuous water share one background draw. Water is evaluated at
// the world-space ray/sea-level intersection: no finite patch edges, mesh joins
// or spherical-pole stretching can appear when looking down through the glass.
export function createGalleryAtmosphere(photo){
 photo.colorSpace=T.SRGBColorSpace;photo.wrapS=T.RepeatWrapping;
 const time={value:0};
 const material=new T.ShaderMaterial({name:'Gallery_Continuous_Dusk_Sea',uniforms:{skyMap:{value:photo},time},side:T.BackSide,depthWrite:false,fog:false,
  vertexShader:'varying vec3 vSky;void main(){vec4 p=modelMatrix*vec4(position,1.);vSky=p.xyz;gl_Position=projectionMatrix*viewMatrix*p;}',
  fragmentShader:`uniform sampler2D skyMap;uniform float time;varying vec3 vSky;
   vec3 panorama(vec3 d){vec2 uv=vec2(atan(d.x,-d.z)*.15915494+.5,asin(clamp(d.y,-1.,1.))*.50+.465);
    vec2 dx=dFdx(uv),dy=dFdy(uv);dx.x-=floor(dx.x+.5);dy.x-=floor(dy.x+.5);
    vec3 color=texture2DGradEXT(skyMap,uv,dx,dy).rgb;
    float edge=min(fract(uv.x),1.-fract(uv.x));if(edge<.008){vec3 other=texture2DGradEXT(skyMap,vec2(1.-fract(uv.x),uv.y),vec2(-dx.x,dx.y),vec2(-dy.x,dy.y)).rgb;color=mix(color,other,.5*(1.-smoothstep(0.,.008,edge)));}
    return color;
   }
   void wave(inout vec2 slope,vec2 p,vec2 direction,float frequency,float amplitude,float speed,float footprint){
    float phase=dot(p,direction)*frequency+time*speed;
    float resolved=exp(-frequency*frequency*footprint*footprint*.22);
    slope+=direction*cos(phase)*amplitude*resolved;
   }
   void main(){vec3 d=normalize(vSky-cameraPosition);vec3 color=panorama(d);
    if(d.y<-.018){
     float rayLength=(-4.4-cameraPosition.y)/d.y;
     vec2 p=cameraPosition.xz+d.xz*rayLength;
     float footprint=max(length(dFdx(p)),length(dFdy(p)));
     vec2 slope=vec2(0.);
     wave(slope,p,vec2(.94,.342),.78,.075,.36,footprint);
     wave(slope,p,vec2(-.47,.883),1.31,.055,-.29,footprint);
     wave(slope,p,vec2(.80,-.60),2.73,.033,.48,footprint);
     wave(slope,p,vec2(.34,.94),5.8,.023,-.55,footprint);
     wave(slope,p,vec2(-.83,.558),12.4,.014,.71,footprint);
     wave(slope,p,vec2(.98,.199),24.6,.008,-.82,footprint);
     vec3 normal=normalize(vec3(-slope.x,1.,-slope.y));
     vec3 reflected=reflect(d,normal);reflected.y=max(.015,reflected.y);
     float facing=clamp(dot(normal,-d),0.,1.);
     float fresnel=.035+.965*pow(1.-facing,5.);
     vec3 water=mix(vec3(.018,.045,.062),panorama(normalize(reflected)),.24+.66*fresnel);
     water*=.96+slope.x*.12+slope.y*.08;
     // A soft sunset sheen follows the wave normal, without pixel-sized sparks.
     vec3 halfVector=normalize(-d+normalize(vec3(-.62,.19,-.76)));
     water+=vec3(.27,.135,.052)*pow(max(0.,dot(normal,halfVector)),80.)*.22;
     float haze=1.-exp(-rayLength*.0035);
     vec3 horizon=panorama(normalize(vec3(d.x,-.065,d.z)));
     water=mix(water,horizon,haze*.62);
     color=mix(color,water,smoothstep(.025,.12,-d.y));
    }
    gl_FragColor=vec4(color,1.);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
   }`});
 const mesh=new T.Mesh(new T.SphereGeometry(190,80,40),material);mesh.name='Gallery_Distant_Sunset_Dome';mesh.renderOrder=-100;mesh.frustumCulled=false;
 return {mesh,update(delta,reducedMotion){if(!reducedMotion)time.value+=delta;}};
}
