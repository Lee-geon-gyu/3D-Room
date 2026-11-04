"""Update only the saved native trim's material slots; preserve topology and UVs.

Run in background Blender. The web loader applies the same face selection to
existing compressed assets, retaining their exact geometry and baked UVs.
"""
import bpy, json
from pathlib import Path

root=Path(__file__).resolve().parents[1]
space=json.loads((root/'src/navigation/space-layout.json').read_text(encoding='utf-8-sig'))
file=root/'tools/generated/connected-atelier.blend'
bpy.ops.wm.open_mainfile(filepath=str(file))
oak=bpy.data.materials.get('Warm_Oak')
black=bpy.data.materials.get('Exterior_Gloss_Black')
assert black
assert oak, 'The original oak material must exist'
fa,fb=space['balconyFront']
def selected(point):
    x,y,z=point.x,point.z,-point.y
    front=fa[1]+(fb[1]-fa[1])*(x-fa[0])/(fb[0]-fa[0])
    lower=fa[0]-.14<=x<=fb[0]+.14 and space['upperFloor']-.605<=y<=space['upperFloor']+.002 and abs(z-front)<=.135
    r=space['upperRoof'];left=space['westFacade']['wallCenterX']+space['westFacade']['wallThickness']/2;right=fb[0]+r['eastOverhang']
    roof=space['upperCeiling']-.08<=y<=space['upperCeiling']+space['upperRoofThickness']+.015 and left-.04<=x<=right+.04 and r['back']-.04<=z<=front+r['frontOverhang']+.04
    return lower or roof

counts={'lower':0,'roof':0,'black_coping':0};before={}
for obj in bpy.context.scene.objects:
    if obj.type!='MESH':continue
    mesh=obj.data;before[obj.name]=(len(mesh.vertices),len(mesh.polygons),len(mesh.uv_layers))
    slots=[slot.name if slot else '' for slot in mesh.materials]
    if 'Coping' in obj.name:
        if black.name not in slots:mesh.materials.append(black);slots.append(black.name)
        for face in mesh.polygons:face.material_index=slots.index(black.name);counts['black_coping']+=len(face.vertices)-2
        continue
    chosen=[]
    for face in mesh.polygons:
        if slots[face.material_index] not in ('Warm_Pale_Limestone','Exterior_Gloss_Black','Warm_Oak'):continue
        points=[obj.matrix_world@mesh.vertices[v].co for v in face.vertices]
        roof_height=all(space['upperCeiling']-.08<=point.z<=space['upperCeiling']+space['upperRoofThickness']+.015 for point in points)
        if roof_height and not all(selected(point) for point in points):
            if black.name not in slots:mesh.materials.append(black);slots.append(black.name)
            face.material_index=slots.index(black.name);counts['black_coping']+=len(face.vertices)-2
        elif all(selected(point) for point in points):chosen.append(face)
    if not chosen:continue
    if oak.name not in slots:mesh.materials.append(oak);slots.append(oak.name)
    index=slots.index(oak.name)
    for face in chosen:
        face.material_index=index
        y=(obj.matrix_world@mesh.vertices[face.vertices[0]].co).z
        counts['roof' if y>space['upperCeiling']-.1 else 'lower']+=len(face.vertices)-2
    assert before[obj.name]==(len(mesh.vertices),len(mesh.polygons),len(mesh.uv_layers))
assert counts['lower']>0 and counts['roof']>0, counts
bpy.context.preferences.filepaths.save_version=0
bpy.ops.wm.save_as_mainfile(filepath=str(file))
print('OAK_TRIM_NATIVE',json.dumps(counts),flush=True)
