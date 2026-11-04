"""Trim CC0 close-water recordings, excluding surf/wave ambience.

Run with background Blender (its bundled aud decoder) and arguments after --:
source-directory [preview.wav]. Source filenames and credits are documented in
public/assets/audio/water/CREDITS.md. Geometry/native scenes are never loaded.
"""
import aud, numpy as np, wave, json, sys
from pathlib import Path

root=Path(__file__).resolve().parents[1]
args=sys.argv[sys.argv.index('--')+1:]
source=Path(args[0]);out=root/'public/assets/audio/water';out.mkdir(parents=True,exist_ok=True)
rate=24000
clips=[
 ('enter-1','submerge',.08,.804,.060),
 ('enter-2','submerge',.964,.754,.060),
 ('flow-1','uw_swim',.786,.836,.026),
 ('flow-2','uw_swim',1.702,.786,.026),
 ('flow-3','uw_swim',2.82,.72,.026),
 ('exit-1','emerge',.16,.78,.028),
]
def write(path,data):
    path.parent.mkdir(parents=True,exist_ok=True)
    with wave.open(str(path),'wb') as file:
        file.setnchannels(1);file.setsampwidth(2);file.setframerate(rate)
        file.writeframes(np.round(np.clip(data,-1,1)*32767).astype('<i2').tobytes())

result={};audit=[]
for name,file,start,duration,target in clips:
    sound=aud.Sound.file(str(source/(file+'.ogg'))).rechannel(1).resample(rate,3)
    sound=sound.limit(start,start+duration).highpass(150,.65).lowpass(3200,.65)
    pcm=sound.data()[:,0].astype(np.float64)
    rms=float(np.sqrt(np.mean(pcm*pcm)))
    pcm*=min(2.0,target/max(rms,.0001))
    # Long soft edges keep the water close and flowing rather than percussive.
    attack=int(rate*(.055 if name.startswith('enter') else .075));tail=int(rate*.16)
    pcm[:attack]*=np.sin(np.linspace(0,np.pi/2,attack))**2
    pcm[-tail:]*=np.cos(np.linspace(0,np.pi/2,tail))**2
    peak=float(np.max(np.abs(pcm)))
    if peak>.45:pcm*=.45/peak
    write(out/(name+'.wav'),pcm);result[name]=pcm
    audit.append({'file':name+'.wav','seconds':len(pcm)/rate,'peak':round(float(np.max(np.abs(pcm))),4),'rms':round(float(np.sqrt(np.mean(pcm*pcm))),4)})
if len(args)>1:
    preview=np.zeros(int(rate*6.5))
    for name,at in [('enter-1',.2),('flow-1',1.5),('flow-2',2.65),('flow-3',3.8),('exit-1',5.0)]:
        pcm=result[name]*.21;start=int(at*rate);preview[start:start+len(pcm)]+=pcm
    write(Path(args[1]),preview)
print('QUIET_WATER_AUDIO',json.dumps(audit),flush=True)
