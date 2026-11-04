"""Trace the existing LEE alpha into small SVG favicons; never alter the loader."""
from pathlib import Path
from collections import defaultdict
import numpy as np
from PIL import Image

root=Path(__file__).resolve().parents[1]
alpha=np.array(Image.open(root/'public/assets/loading/lee-mark.webp'))[:,:,3]
mask=np.pad(alpha>=128,1)
edges=defaultdict(list)
for neighbour,side in [(np.roll(mask,1,0),0),(np.roll(mask,-1,1),1),(np.roll(mask,-1,0),2),(np.roll(mask,1,1),3)]:
    ys,xs=np.where(mask & ~neighbour)
    for x,y in zip(xs.tolist(),ys.tolist()):
        points=[(x,y),(x+1,y),(x+1,y+1),(x,y+1)]
        edges[points[side]].append(points[(side+1)%4])

def simplify(points,epsilon=.65):
    p=np.asarray(points,float)
    if len(p)<3:return points
    line=p[-1]-p[0];length=np.linalg.norm(line)
    distances=np.abs(line[0]*(p[:,1]-p[0,1])-line[1]*(p[:,0]-p[0,0]))/length if length else np.linalg.norm(p-p[0],axis=1)
    split=int(np.argmax(distances))
    if distances[split]<=epsilon:return [points[0],points[-1]]
    return simplify(points[:split+1],epsilon)[:-1]+simplify(points[split:],epsilon)

def direction(a,b):return {(1,0):0,(0,1):1,(-1,0):2,(0,-1):3}[(b[0]-a[0],b[1]-a[1])]

contours=[]
while edges:
    start=next(iter(edges));point=start;previous=0;points=[start]
    while True:
        candidates=edges[point]
        end=min(candidates,key=lambda end:[1,0,3,2].index((direction(point,end)-previous)%4))
        candidates.remove(end)
        if not candidates:del edges[point]
        previous=direction(point,end);point=end;points.append(point)
        if point==start:break
    area=abs(sum(a[0]*b[1]-b[0]*a[1] for a,b in zip(points,points[1:])))/2
    if area>8:contours.append(simplify(points))

path=' '.join('M'+'L'.join(f'{x-1},{y-1}' for x,y in points[:-1])+'Z' for points in contours)
height,width=alpha.shape;pad=width*.025;side=width+pad*2;top=(height-side)/2
view=f'{-pad:g} {top:g} {side:g} {side:g}'
for name,color in [('light','#111111'),('dark','#ffffff'),('adaptive','#111111')]:
    style='<style>@media(prefers-color-scheme:dark){path{fill:#fff}}</style>' if name=='adaptive' else ''
    svg=f'<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="{view}"><title>LEE</title>{style}<path fill="{color}" fill-rule="evenodd" d="{path}"/></svg>\n'
    target=root/'public'/('favicon.svg' if name=='adaptive' else f'favicon-{name}.svg')
    target.write_text(svg,encoding='utf-8');print(target.name,len(svg),len(contours),'contours')
