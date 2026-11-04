"""Cloud Reverie: original seamless ambient score, synthesized without samples.

Slow string/choir pads, a glassy upper melody, wide diffuse reverb, no drums.
The existing underwater Web Audio filters and listener volume remain independent.
"""
from pathlib import Path
import json
import wave
import numpy as np

rate=24000;duration=96;n=round(rate*duration)
mix=np.zeros((n,2),dtype=np.float64)
rng=np.random.default_rng(690231)

def add(midi,start,gain,length=19,kind='pad',pan=0):
    t=np.arange(round(length*rate))/rate;frequency=440*2**((midi-69)/12)
    if kind=='bell':
        phase=2*np.pi*frequency*t
        tone=np.sin(phase)+.22*np.sin(phase*2.003)*np.exp(-t/2.7)+.045*np.sin(phase*3.01)*np.exp(-t/1.7)
        envelope=(1-np.exp(-t/.055))*np.exp(-t/3.8)*np.minimum(1,(length-t)/1.8)
        stereo=np.column_stack((tone,tone))
    else:
        phase=rng.uniform(0,2*np.pi);stereo=np.empty((len(t),2))
        for channel,detune in enumerate((-.045,.045)):
            p=2*np.pi*(frequency+detune)*t+phase+.07*np.sin(2*np.pi*.11*t+channel*.7)
            stereo[:,channel]=np.sin(p)+.18*np.sin(2*p+.2)+.09*np.sin(3*p)+.035*np.sin(5*p)
            stereo[:,channel]+=.19*np.sin(2*np.pi*(frequency+(channel*2-1)*.12)*t+phase)
        envelope=np.sin(np.minimum(t/2.8,1)*np.pi/2)**2*np.sin(np.minimum((length-t)/6,1)*np.pi/2)**2
        envelope*=.88+.12*np.sin(t*.31+start*.13)
    stereo*=envelope[:,None]*gain
    stereo[:,0]*=np.sqrt((1-pan)/2);stereo[:,1]*=np.sqrt((1+pan)/2)
    indices=(round(start*rate)+np.arange(len(t)))%n
    np.add.at(mix,indices,stereo)

chords=[(38,[54,57,61,64,69]),(35,[54,57,61,66]),(31,[50,54,57,61,69]),(33,[52,57,59,64]),
        (38,[54,57,61,66]),(30,[49,54,57,64]),(31,[50,54,57,61,66]),(33,[52,54,59,64])]
melody=[[78,81],[76,73],[74,78],[76,71],[81,78],[76,73],[74,78],[76,73]]
for i,(bass,voicing) in enumerate(chords):
    at=i*12
    add(bass,at,.007,15)
    for j,midi in enumerate(voicing):add(midi,at+j*.11,.006 if midi<65 else .0045,15,pan=(j-2)*.15)
    for j,midi in enumerate(melody[i]):add(midi,at+4.2+j*4.0,.025 if j==0 else .017,12,'bell',pan=(-.25 if j==0 else .25))
    if i%2==0:add(voicing[-1]+12,at+9,.0015,12,pan=.1)

# Circular stereo diffusion preserves the loop seam and a continuous long tail.
dry=mix.copy()
for delay,gain in [(.173,.13),(.283,.12),(.431,.105),(.683,.09),(1.127,.075),(1.683,.065),(2.371,.05),(3.173,.04),(4.217,.028),(5.531,.018)]:
    wet=np.roll(dry,round(delay*rate),axis=0)
    mix+=wet[:,::-1 if round(delay*100)%2 else 1]*gain
frequencies=np.fft.rfftfreq(n,1/rate)
for channel in range(2):
    spectrum=np.fft.rfft(mix[:,channel])
    spectrum*=1/(1+(frequencies/3900)**6)
    spectrum*=np.minimum(1,frequencies/35)**2
    mix[:,channel]=np.fft.irfft(spectrum,n)
mix=np.tanh(mix*1.35)*3.15
out=Path(__file__).resolve().parents[1]/'public/assets/cloud-reverie-soft.wav'
with wave.open(str(out),'wb') as audio:
    audio.setnchannels(2);audio.setsampwidth(2);audio.setframerate(rate)
    audio.writeframes((mix*32767).astype('<i2').tobytes())
report={'seconds':duration,'sampleRate':rate,'channels':2,'peak':float(np.max(abs(mix))),'rms':float(np.sqrt(np.mean(mix**2))),'seamStep':float(np.max(abs(mix[-1]-mix[0]))),'bytes':out.stat().st_size}
print('CLOUD_REVERIE',json.dumps(report))
