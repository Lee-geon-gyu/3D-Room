"""Probe the actual generated desk vessel, not its source dimensions."""
import bpy,json,sys
from pathlib import Path
from mathutils import Vector

root=Path(__file__).resolve().parents[1]
space=json.loads((root/'src/navigation/space-layout.json').read_text(encoding='utf-8-sig'))
garden=json.loads((root/'src/scene/garden-layout.json').read_text(encoding='utf-8-sig'))
if '--runtime' in sys.argv:
    bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
    bpy.ops.import_scene.gltf(filepath=str(root/'public/assets/runtime/atelier.glb'))
else:bpy.ops.wm.open_mainfile(filepath=str(root/'tools/generated/connected-atelier.blend'))
shift=garden['library']['deskShift'];x=-2.14+shift[0];z=-1.7+shift[1];upper=space['upperFloor']
deps=bpy.context.evaluated_depsgraph_get()
def surface(dx,dz):
    hit,point,normal,index,obj,matrix=bpy.context.scene.ray_cast(deps,Vector((x+dx,-z-dz,upper+1.4)),Vector((0,0,-1)))
    assert hit,'Missing desk vessel surface'
    return point.z,obj.name
floor,name=surface(0,0)
rim,rim_name=surface(.064,0)
assert abs(floor-(upper+.831))<.003,(floor,name)
assert rim-floor>.125,(rim,floor,rim_name)
print('HOLLOW_CUP_VERIFIED',{'inner_floor':floor,'rim':rim,'depth':rim-floor},flush=True)
# Inspect all three distinct tips; their positions follow their actual lean.
for dx,dz,tx,tz,length in [(-.025,-.015,-.065,-.025,.300),(.018,-.019,.075,-.035,.280),(.004,.023,.025,.085,.315)]:
    axis=Vector((tx,1,tz)).normalized()
    height,name=surface(dx+axis.x*(length-.008),dz+axis.z*(length-.008))
    assert height>upper+1.075,(height,name)
print('THREE_WRITING_TOOLS_VERIFIED',flush=True)
