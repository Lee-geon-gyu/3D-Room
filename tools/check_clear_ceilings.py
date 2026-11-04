"""Verify the removed round lights leave uninterrupted real satin ceilings.

Run in Blender after export; add -- --runtime to inspect the browser GLB.
"""
import bpy,json,math,pathlib,sys
from mathutils import Vector

root=pathlib.Path(__file__).resolve().parents[1]
runtime='--runtime' in sys.argv
if runtime:
    bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
    bpy.ops.import_scene.gltf(filepath=str(root/'public/assets/runtime/atelier.glb'))
else:bpy.ops.wm.open_mainfile(filepath=str(root/'tools/generated/connected-atelier.blend'))
bpy.context.view_layer.update();scene=bpy.context.scene;deps=bpy.context.evaluated_depsgraph_get()
# Former round housings, including the actual pitch of the rear ceiling.
sites=[('Studio',[-4.02,3.5,-.55],0),('Atelier_Front',[-.3,3.5,-2.5],0),
       ('Atelier_Rear',[.65,3.7021,-5.55],math.atan(.094)),('Library',[-.25,6.75,-.15],0)]
gaps=[];rays=0
for name,(x,y,z),tilt in sites:
    anchor=Vector((x,-z,y));normal=Vector((0,-math.sin(tilt),math.cos(tilt)))
    u=Vector((1,0,0));v=normal.cross(u)
    probes=[anchor]+[anchor+r*(math.cos(i*math.pi/4)*u+math.sin(i*math.pi/4)*v) for r in [.12,.25] for i in range(8)]
    for center in probes:
        rays+=1;hit,point,_,index,obj,_=scene.ray_cast(deps,center-normal*.3,normal,distance=.5)
        material=obj.data.materials[obj.data.polygons[index].material_index].name.split('.')[0] if hit else None
        drop=(center-point).dot(normal) if hit else None
        if not hit or material!='White_Satin_Ceiling' or abs(drop)>.004:
            gaps.append({'site':name,'material':material,'drop':drop})
print('CLEAR_CEILING_PROBES',json.dumps({'asset':'runtime' if runtime else 'native','rays':rays,'gaps':gaps}),flush=True)
assert not gaps,'A removed fitting or gap remains in a ceiling field'
print('CLEAR_CEILINGS_VERIFIED',len(sites),flush=True)
