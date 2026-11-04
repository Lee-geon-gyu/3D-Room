"""Apply the requested black fascia material to the existing native source.

Run in a separate background Blender; preserve all geometry, UVs and lightmaps.
The runtime uses the identical triangle classification in facadeFinish.js.
"""
import bpy, json, tempfile
from pathlib import Path

root=Path(__file__).resolve().parents[1]
space=json.loads((root/'src/navigation/space-layout.json').read_text(encoding='utf-8-sig'))
source=root/'tools/generated/connected-atelier.blend'
export_temp=root/'tools/generated/trim-export-temp'
export_temp.mkdir(exist_ok=True);tempfile.tempdir=str(export_temp)
bpy.ops.wm.open_mainfile(filepath=str(source))
black=bpy.data.materials['Exterior_Gloss_Black']
a,b=space['balconyFront']
def front(x): return a[1]+(b[1]-a[1])*(x-a[0])/(b[0]-a[0])
counts={'ground':0,'roof':0}
for obj in bpy.context.scene.objects:
    if obj.type!='MESH':continue
    finish_slots={i for i,material in enumerate(obj.data.materials) if material and material.name in {'Warm_Pale_Limestone','Exterior_Gloss_Black'}}
    if not finish_slots:continue
    black_index=next((i for i,material in enumerate(obj.data.materials) if material==black),None)
    if black_index is None:
        black_index=len(obj.data.materials);obj.data.materials.append(black)
    for polygon in obj.data.polygons:
        if polygon.material_index not in finish_slots:continue
        points=[obj.matrix_world@obj.data.vertices[i].co for i in polygon.vertices]
        ground=all(a[0]-.14<=p.x<=b[0]+.14 and space['upperFloor']-.59<=p.z<=space['upperFloor']+.002 and abs(-p.y-front(p.x))<=.135 for p in points)
        roof=all(space['upperCeiling']-.08<=p.z<=space['upperCeiling']+space['upperRoofThickness']+.015 for p in points)
        if ground or roof:
            polygon.material_index=black_index;counts['ground' if ground else 'roof']+=len(polygon.vertices)-2
assert all(counts.values()),counts
bpy.ops.wm.save_as_mainfile(filepath=str(source))
bpy.ops.export_scene.gltf(filepath=str(root/'tools/generated/architecture-base.glb'),export_format='GLB',export_yup=True,export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6)
print('BLACK_EXTERIOR_TRIM',json.dumps(counts),flush=True)
