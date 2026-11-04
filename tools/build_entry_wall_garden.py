"""Author the entrance wall at its final dimensions, using the native scanned leaf.

Only this wall is replaced; the approved side planting and original source stay
intact. Natural fans and overlapping trails replace the old displaced columns.
"""
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
author=(ROOT/'tools/build_vines.py').read_text(encoding='utf-8')
setup=author.split("for root_data in garden['roots']:",1)[0]
exec(compile(setup,str(ROOT/'tools/build_vines.py'),'exec'),globals())

native_leaf=leaf
def leaf(anchor,scale=1,angle=0):
    # Keep complete scanned leaves. The opening is decided before creating a
    # leaf, never by dragging or cutting its vertices afterwards.
    if abs(anchor.x)<1.48 and anchor.y<4.35:return
    native_leaf(anchor,scale,angle)

native_branch=branch
def branch(points,radius=.004,leaf_size=1.4,spacing=.065):
    run=[]
    for p in points:
        if abs(p.x)<1.43 and p.y<4.32:
            if len(run)>2:native_branch(run,radius,leaf_size,spacing)
            run=[]
        else:run.append(p)
    if len(run)>2:native_branch(run,radius,leaf_size,spacing)

for i,(x,span,height,style) in enumerate([
    (-4.35,1.12,9.95,'fan'),(-2.65,.72,9.40,'wild'),
    (2.62,.70,9.72,'fan'),(4.13,1.0,9.95,'wild'),(5.88,.64,9.65,'dense')]):
    wall({'base':[x,.25,12.30],'along':[1,0,0],'normal':[0,0,-1],
          'height':height,'span':span,'seed':830+i*17,'style':style,
          'density':1.28,'overWall':True,'wallTop':10.425})

# Unequal hanging growth covers the lintel naturally and attaches to coping.
random.seed(928);active_cap=10.425;active_normal=Vector((0,0,-1))
for i in range(15):
    x=-1.65+i*.235;drop=random.uniform(3.6,5.75);phase=random.uniform(0,6)
    active_variant=i%4
    points=[Vector((x+.12*math.sin(t*6+phase),10.28-drop*t,12.23-.035*math.sin(t*7))) for t in [j/72 for j in range(73)]]
    branch(points,.0042,1.65,.049)
    for index in [18,35,52]:
        p=points[index];direction=-1 if (i+index)%2 else 1
        shoot=[p+Vector((direction*.34*t,-.40*t,-.025*math.sin(t*6))) for t in [j/22 for j in range(23)]]
        branch(shoot,.0022,1.7,.046)
active_cap=None

finish=author[author.index("mesh=bpy.data.meshes.new('Organic_Ivy_Photographic_Leaves')"):]
finish=finish.replace('Rooted_Ivy_Connected_Branches','Entry_Wall_Connected_Branches').replace('Rooted_Ivy_Leaves','Entry_Wall_Leaves').replace('rooted-garden.glb','entry-wall-garden.glb').replace('ROOTED_GARDEN_EXPORTED','ENTRY_WALL_GARDEN_EXPORTED')
exec(compile(finish,str(ROOT/'tools/build_vines.py'),'exec'),globals())
