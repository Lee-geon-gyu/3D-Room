"""Ray-check all four finished drain corners in native or --runtime geometry."""
import bpy,json,pathlib,sys
from mathutils import Vector

root=pathlib.Path(__file__).resolve().parents[1]
space=json.loads((root/'src/navigation/space-layout.json').read_text(encoding='utf-8-sig'))
runtime='--runtime' in sys.argv
if runtime:
    bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
    bpy.ops.import_scene.gltf(filepath=str(root/'public/assets/runtime/atelier.glb'))
else:bpy.ops.wm.open_mainfile(filepath=str(root/'tools/generated/connected-atelier.blend'))
bpy.context.view_layer.update();scene=bpy.context.scene;deps=bpy.context.evaluated_depsgraph_get()
a,b,c,d=space['pool'];x,z=(a+b)/2,(c+d)/2;bottom=space['poolMotion']['bottom']
steel='Furniture_Graphite_Steel'
probes=[(sx*r,sz*r,steel,.017) for sx in [-1,1] for sz in [-1,1] for r in [.158,.162,.164]]
probes.extend([(sx*.155,0,steel,.017) for sx in [-1,1]])
probes.extend([(0,sz*.155,steel,.017) for sz in [-1,1]])
probes.extend([(sx*.176,sz*.176,'Pool_Stone',0) for sx in [-1,1] for sz in [-1,1]])
probes.extend([(0,0,steel,.015),(.015,0,'Charcoal',.006)])
gaps=[]
for dx,dz,expected,height in probes:
    hit,point,_,index,obj,_=scene.ray_cast(deps,Vector((x+dx,-z-dz,bottom+.15)),Vector((0,0,-1)),distance=.3)
    material=obj.data.materials[obj.data.polygons[index].material_index].name.split('.')[0] if hit else None
    actual=point.z-bottom if hit else None
    if not hit or material!=expected or abs(actual-height)>.002:
        gaps.append({'offset':[dx,dz],'material':material,'height':actual,'expected':[expected,height]})
print('POOL_DRAIN_PROBES',json.dumps({'asset':'runtime' if runtime else 'native','rays':len(probes),'gaps':gaps}),flush=True)
assert not gaps,'The drain has an unfinished corner, protrusion or blocked slot'
print('POOL_DRAIN_SQUARE_FINISH_VERIFIED',flush=True)
