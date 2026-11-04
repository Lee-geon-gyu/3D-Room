"""Outline the existing farewell with locally licensed fonts for pen animation.

Requires fonttools, NumPy and Pillow. Unmodified SIL OFL sources in tools/source-assets:
https://github.com/google/fonts/tree/main/ofl/nanumpenscript (NanumPenScript-Regular.ttf)
https://github.com/google/fonts/tree/main/ofl/allura (Allura-Regular.ttf)
Original license notices are included in public/fonts; only text outlines ship.
"""
import json
from io import BytesIO
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

root=Path(__file__).resolve().parents[1]
content=json.loads((root/'public/portfolio-content.json').read_text(encoding='utf-8-sig'))['contact']
result={'glyphs':{},'paragraphs':[]}
fonts=[TTFont(root/'tools/source-assets/NanumPenScript-Regular.ttf'),TTFont(root/'tools/source-assets/Allura-Regular.ttf')]

def simplify(path,tolerance=.75):
    if len(path)<3:return path
    a=np.array(path[0]);b=np.array(path[-1]);delta=b-a;length=np.linalg.norm(delta)
    distances=[abs(delta[0]*(p[1]-a[1])-delta[1]*(p[0]-a[0]))/length if length else np.linalg.norm(np.array(p)-a) for p in path[1:-1]]
    index=int(np.argmax(distances))+1
    if distances[index-1]<=tolerance:return [path[0],path[-1]]
    return simplify(path[:index+1],tolerance)[:-1]+simplify(path[index:],tolerance)

def centerlines(mask):
    """Thin the actual font ink, then trace its connected pen centerlines."""
    ink=np.asarray(mask)>127
    # Zhang-Suen preserves branches and counters rather than tracing outlines.
    for _ in range(80):
        changed=False
        for phase in (0,1):
            p=np.pad(ink,1)
            neighbors=[p[:-2,1:-1],p[:-2,2:],p[1:-1,2:],p[2:,2:],p[2:,1:-1],p[2:,:-2],p[1:-1,:-2],p[:-2,:-2]]
            total=sum(n.astype(np.uint8) for n in neighbors)
            transitions=sum((~neighbors[i]&neighbors[(i+1)%8]).astype(np.uint8) for i in range(8))
            a,b,c,d=neighbors[0],neighbors[2],neighbors[4],neighbors[6]
            removable=ink&(total>=2)&(total<=6)&(transitions==1)
            removable&=(~(a&b&c)&~(b&c&d)) if phase==0 else (~(a&b&d)&~(a&c&d))
            if removable.any():ink[removable]=False;changed=True
        if not changed:break
    points={(int(x),int(y)) for y,x in zip(*np.where(ink))}
    graph={}
    for x,y in points:
        graph[x,y]=set()
        for dx,dy in ((0,-1),(1,0),(0,1),(-1,0),(-1,-1),(1,-1),(-1,1),(1,1)):
            other=(x+dx,y+dy)
            if other not in points:continue
            if dx and dy and ((x+dx,y) in points or (x,y+dy) in points):continue
            graph[x,y].add(other)
    visited=set();strokes=[]
    def edge(a,b):return tuple(sorted((a,b)))
    starts=sorted(points,key=lambda p:(len(graph[p])==2,p[1],p[0]))
    for start in starts:
        if not graph[start]:strokes.append([start,(start[0]+.1,start[1])]);continue
        for neighbor in sorted(graph[start],key=lambda p:(p[1],p[0])):
            if edge(start,neighbor) in visited:continue
            path=[start,neighbor];visited.add(edge(start,neighbor));current=neighbor
            while len(graph[current])==2:
                candidates=[p for p in graph[current] if edge(current,p) not in visited]
                if not candidates:break
                nxt=candidates[0];visited.add(edge(current,nxt));path.append(nxt);current=nxt
            strokes.append(path)
    # Order lifts spatially; one SVG dash travels the entire sentence continuously.
    return [simplify(path) for path in sorted(strokes,key=lambda path:(min(p[1] for p in path)//20,min(p[0] for p in path)))]

pen_fonts=[]
for index,font in enumerate(fonts):
    static=instantiateVariableFont(font,{'wght':450 if index==0 else 400},inplace=False) if 'fvar' in font else font
    static.flavor=None;buffer=BytesIO();static.save(buffer);buffer.seek(0)
    pen_fonts.append(ImageFont.truetype(buffer,160))

def line(text,index):
    font=fonts[index];upem=font['head'].unitsPerEm
    glyphset=font.getGlyphSet(location={'wght':450 if index==0 else 400}) if 'fvar' in font else font.getGlyphSet()
    cmap=font.getBestCmap();x=0;letters=[];strokes=[]
    for char in text:
        name=cmap.get(ord(char),'space');key=f'{index}-{ord(char):x}'
        if key not in result['glyphs']:
            pen=SVGPathPen(glyphset,ntos=lambda value:format(value,'.4f').rstrip('0').rstrip('.') or '0')
            glyphset[name].draw(TransformPen(pen,(1/upem,0,0,1/upem,0,0)))
            result['glyphs'][key]=pen.getCommands()
        letters.append({'key':key,'x':round(x,4)})
        if not char.isspace():
            mask=Image.new('L',(224,224));ImageDraw.Draw(mask).text((16,176),char,font=pen_fonts[index],anchor='ls',fill=255)
            for stroke in centerlines(mask):
                length=sum(np.hypot(b[0]-a[0],b[1]-a[1]) for a,b in zip(stroke,stroke[1:]))/160
                strokes.append({'d':'M'+'L'.join(f'{x+(px-16)/160:.4f},{1+(py-176)/160:.4f}' for px,py in stroke),'length':max(.005,float(length))})
        x+=glyphset[name].width/upem
    total=sum(stroke['length'] for stroke in strokes);at=0
    for stroke in strokes:
        fraction=stroke.pop('length')/total;stroke['at']=round(at,6);stroke['duration']=round(fraction,6);at+=fraction
    return {'text':text,'width':round(x,4),'letters':letters,'inkStrokes':strokes}

for korean,english in zip(content['statement'],content['statementEnglish']):
    result['paragraphs'].append([line(korean,0),line(english,1)])
(root/'src/ui/farewellLettering.json').write_text(json.dumps(result,ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf-8')
print('FAREWELL_GLYPHS',len(result['glyphs']))
