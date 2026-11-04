"""Fit the original whole leaves to the finished walls before spatial batching.

The native garden stays as the source. Connected leaf charts move rigidly;
branch networks retain their curves, and the doorway keeps entire silhouettes.
"""
import bpy,math,json
from pathlib import Path
from mathutils import Vector
ROOT=Path(__file__).resolve().parents[1]
S=json.loads((ROOT/'src/navigation/space-layout.json').read_text(encoding='utf-8'))
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
bpy.ops.import_scene.gltf(filepath=str(ROOT/'public/assets/rooted-garden.glb'))
L=json.loads((ROOT/'src/navigation/lounge-layout.json').read_text(encoding='utf-8'))
shift=S['referenceFacade']['stairShiftX'];inside_shift=S['interior']['right']-2.289
stats={'leaves':0,'retiredCornice':0,'retiredEntry':0,'retiredUpperIntrusions':0,'doorLeaves':0,'branchGroups':0}
def find(parent,i):
 while parent[i]!=i:parent[i]=parent[parent[i]];i=parent[i]
 return i
def displacement(x,y,z):
 if x>3.8:
  # The three stair bends moved forward together; end returns stay anchored.
  dz=1.0077369870105815*max(0,min(1,(z-.25)/.6,(12.4-z)/2.9))
  return shift, y*.5, dz
 if 1.3<x<2.3 and z<.3:
  return (S['interior']['right']-2.149 if y>3.8 else inside_shift),y*.5+(L['floor'] if y<3.8 else 0),(L['plantShiftZ'] if y<3.8 else 0)
 if x>2.3:return shift,y*.5,0
 return 0,y*.5,0
def old_cornice(points):
 low=min(p.z for p in points);high=max(p.z for p in points)
 x=sum(p.x for p in points)/len(points);z=-sum(p.y for p in points)/len(points)
 old_front=2.5-1.0077369870105815*(x+5.3)/7.833376827136342
 return (low>2.32 and high<4.27 and -5.42<x<2.70 and min(abs(z-2.5),abs(z-old_front))<.48) or (low>5.40 and -5.4<x<2.96 and (abs(z-(old_front+.22))<.38 or (abs(x-2.68)<.36 and -.1<z<2.9)))
for obj in list(bpy.context.scene.objects):
 if obj.type!='MESH':continue
 mesh=obj.data;leaf=any('leav' in m.name.lower() for m in mesh.materials if m) or 'leaves' in obj.name.lower()
 parent=list(range(len(mesh.vertices)))
 for edge in mesh.edges:
  a,b=(find(parent,int(i)) for i in edge.vertices)
  if a!=b:parent[b]=a
 groups={}
 for v in mesh.vertices:groups.setdefault(find(parent,v.index),[]).append(v.index)
 remove=set()
 for ids in groups.values():
  points=[mesh.vertices[i].co.copy() for i in ids]
  center=sum(points,Vector())/len(points);x,y,z=center.x,center.z,-center.y
  if z>12.1 and max(p.z for p in points)*1.5>.65:
   remove.update(ids);stats['retiredEntry']+=1;continue
  if old_cornice(points):remove.update(ids);stats['retiredCornice']+=1;continue
  tx,_,tz=displacement(x,y,z)
  if any(S['interior']['left']-.18<p.x+tx<S['interior']['right']+.15 and p.z*1.5>S['upperFloor']+.08 and -3.35<-p.y+tz<S['interior']['upperWestFront'] for p in points):
   remove.update(ids);stats['retiredUpperIntrusions']+=1;continue
  if leaf:
   dx,dy,dz=displacement(x,y,z)
   # Keep leaf length, curl, normal/UV chart and every edge exactly intact.
   if z>11.48 and y*1.5<4.65:
    side=1 if x>=0 else -1
    edge=min(p.x for p in points) if side>0 else -max(p.x for p in points)
    clearance=1.39+.22*(.5+.5*math.sin(x*27+y*19))
    if edge<clearance and abs(x)<1.9:
     dx+=side*(clearance-edge);stats['doorLeaves']+=1
   for i in ids:mesh.vertices[i].co+=Vector((dx,-dz,dy))
   stats['leaves']+=1
  else:
   stats['branchGroups']+=1
   # Never drag individual ends of a tube away from the doorway: its triangles
   # would span the empty portal as long black needles. Translate the complete
   # connected branch, then prune only the parts actually covering the opening.
   dx,dy,dz=displacement(x,y,z);lift=dy-y*.5
   for i in ids:
    p=mesh.vertices[i].co;p+=Vector((dx,-dz,p.z*.5+lift))
 if remove:
  import bmesh
  bm=bmesh.new();bm.from_mesh(mesh);bm.verts.ensure_lookup_table();bmesh.ops.delete(bm,geom=[bm.verts[i] for i in remove],context='VERTS');bm.to_mesh(mesh);bm.free()
 if not leaf:
  import bmesh
  bm=bmesh.new();bm.from_mesh(mesh)
  covered=[f for f in bm.faces if any(-v.co.y>11.48 and v.co.z<4.18 and abs(v.co.x)<1.32 for v in f.verts)]
  bmesh.ops.delete(bm,geom=covered,context='FACES');bm.to_mesh(mesh);bm.free()
 mesh.update()
# The new entrance growth is already authored in the final space. Share the
# original materials so runtime texture restoration still resolves native maps.
materials={m.name:m for m in bpy.data.materials};before=set(bpy.context.scene.objects)
bpy.ops.import_scene.gltf(filepath=str(ROOT/'public/assets/entry-wall-garden.glb'))
for obj in set(bpy.context.scene.objects)-before:
 if obj.type!='MESH':continue
 for i,mat in enumerate(obj.data.materials):
  canonical=mat.name.rsplit('.',1)[0] if mat.name.rsplit('.',1)[-1].isdigit() else mat.name
  if canonical in materials:obj.data.materials[i]=materials[canonical]
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(filepath=str(ROOT/'public/assets/finished-garden.glb'),export_format='GLB',export_yup=True,export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6,export_draco_position_quantization=16,export_draco_texcoord_quantization=14)
print('WHOLE_LEAF_GARDEN_FITTED',json.dumps(stats),flush=True)
