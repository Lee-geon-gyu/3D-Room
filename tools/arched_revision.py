"""Open-plan rounded facade revision, run inside build_atelier before merging.

The furniture is translated as rigid objects. No source texture, UV density,
artwork size or mesh detail is reduced. All architectural heights use SPACE.
"""
# Retire six columns, their profiles, the centre partition and narrow portals.
remove_prefixes=(
 'Right_Entry_Taper','Right_Continuous_Interior_Wall','Back_Artwork_Wall','Stair_Facade_Return',
 'Atelier','Veranda','Open_Plan','Library_Right','Library_Left','Library_Rear','Library_White',
 'Upper_Stone_Column','Upper_Column_','Lower_Stone_Column','Lower_Column_',
 'Lower_Right_Stone_Column','Stair_Facade_Base_Collar','Stair_Facade_Column_Capital',
 'Left_Solid_Wall','Left_Entry_Taper','Front_Pier_','Front_Header','Facade_Coping',
 'Shared_Stone_','Gallery_Rear_Wall','Studio_Artwork','Studio_Rear','Studio_Left',
 'Studio_Right','Studio_Entry','Studio_Ceiling','Studio_Satin','Studio_White',
 'Atelier_Left','Atelier_Continuous_Mitered_Cornice','Balcony_Oak_Fascia',
 'Balcony_Floor_Level_Oak_Cap','Lower_Balcony_Oak_Soffit',
 'Original_Oak_','Original_Bronze_Low_Rail','Original_Rail_Baluster',
 'Fitted_Rail_Joint_','Upper_Continuous_Oak_Fascia','Wall_Light',
)
for obj in list(bpy.context.scene.objects):
 if obj.name.startswith(remove_prefixes) or '_Recessed_Linear_Housing' in obj.name or '_Warm_Linear_Diffuser' in obj.name:
  bpy.data.objects.remove(obj,do_unlink=True)

# Remove only the little studio's obsolete backing/cornice; retain all desks.
for obj in list(bpy.context.scene.objects):
 if obj.name.startswith('Studio_'):
  bpy.data.objects.remove(obj,do_unlink=True)

# Both rooms share one flat full-width shell, without the old tapered return.
I=SPACE['interior'];left,right=I['left'],I['right'];rear=I['groundBack']
box('Expanded_Ground_Rear_Masonry',((left+right)/2,SPACE['groundCeiling']/2,-7.12),(right-left+.32,SPACE['groundCeiling'],.24),plaster)
box('Expanded_Ground_West_Masonry',(-5.48,SPACE['groundCeiling']/2,-5.29),(.22,SPACE['groundCeiling'],3.46),plaster)
box('Expanded_Ground_East_Masonry',(I['wallCenter'],SPACE['groundCeiling']/2,(-7.12+I['groundEastFront'])/2),(.24,SPACE['groundCeiling'],7.12+I['groundEastFront']),plaster)
box('Expanded_Upper_East_Masonry',(I['wallCenter'],(SPACE['upperFloor']+SPACE['upperCeiling'])/2,(-3.45+.16)/2),(.24,SPACE['upperCeiling']-SPACE['upperFloor'],3.61),plaster)
for name,a,b in [('West',(left,2.50),(left,rear)),('Rear',(left,rear),(right,rear)),('East',(right,rear),(right,I['groundEastFront']))]:
 slatted_wall('Expanded_Ground_'+name,a,b,.006,lambda z:I['groundSoffit'],cornice=False,top_gap=.006)
for name,a,b in [('West',(left,I['upperWestFront']),(left,I['upperBack'])),('Rear',(left,I['upperBack']),(right,I['upperBack'])),('East',(right,I['upperBack']),(right,.16))]:
 slatted_wall('Expanded_Library_'+name,a,b,SPACE['upperFloor']+.006,lambda z:SPACE['upperCeiling'],cornice=False,top_gap=.006)
sloped_slab('Unified_Flat_White_Ground_Soffit',[(-5.54,-7.26),(3.90,-7.26),(3.90,2.32),(-5.54,2.32)],lambda z:I['groundSoffit'],0,.15,ceiling_white)
# Retain only the real stair enclosure outside the expanded room. The old
# 2.18m return otherwise remains as a freestanding panel inside the new bay.
slatted_wall('Expanded_Stair_Facade_Return',(right,.169),(east_inner(.16)-.025,.169),.006,lambda z:I['groundSoffit'],cornice=False,top_gap=.006)
# Native joinery and planters follow the widened wall as rigid objects.
for obj in list(bpy.context.scene.objects):
 if obj.type=='MESH' and obj.location.x>1.4 and obj.name.startswith(('Atelier_Right','Atelier_Low_Cabinet','Atelier_Pot','Atelier_Soil')):obj.location.x+=right-2.289
# The tablet, chairs and tools keep their dimensions; only their place changes.
bpy.context.view_layer.update()
for obj in list(bpy.context.scene.objects):
 if obj.type!='MESH':continue
 if obj.name.startswith(('Gallery_Worktable','Gallery_Desk','Gallery_Low_Shelf')):
  obj.location.y+=4.25
 elif obj.location.x< -2.7 and obj.name.startswith(('Stool_','Tool_','Brush_')):
  obj.location.y+=4.25

# Premium black metal and optically clear glass replace every picket/newel.
rail_black=material('Railing_Black_Metal',(.012,.016,.021),.23)
rail_black.node_tree.nodes.get('Principled BSDF').inputs['Metallic'].default_value=.88
glass=material('Railing_Clear_Glass',(.80,.93,.96),.075)
glass_bsdf=glass.node_tree.nodes.get('Principled BSDF')
glass_bsdf.inputs['Transmission Weight'].default_value=1
glass_bsdf.inputs['IOR'].default_value=1.46
for index,(a,b) in enumerate(zip(rail_stations,rail_stations[1:])):
 length=math.hypot(b[0]-a[0],b[2]-a[2]);count=max(1,math.ceil(length/1.25))
 rod('Glass_Rail_Black_Handrail',(a[0],a[1]+1.05,a[2]),(b[0],b[1]+1.05,b[2]),.026,rail_black)
 for j in range(count):
  t0=(j+.012)/count;t1=(j+.988)/count
  p=[a[k]+(b[k]-a[k])*t0 for k in range(3)];q=[a[k]+(b[k]-a[k])*t1 for k in range(3)]
  # Closed thin glass with shared slope, rather than screen-space faux panels.
  dx,dz=q[0]-p[0],q[2]-p[2];l=math.hypot(dx,dz);nx,nz=-dz/l*.008,dx/l*.008
  verts=[(v[0]+sign*nx,v[1]+h,v[2]+sign*nz) for sign in [-1,1] for v,h in [(p,.13),(q,.13),(q,1.01),(p,1.01)]]
  crafted_mesh('Laminated_Stair_And_Balcony_Glass',verts,[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)],glass)
 for t in [j/count for j in range(count+1)]:
  p=[a[k]+(b[k]-a[k])*t for k in range(3)]
  box('Glass_Rail_Slim_Black_Post',(p[0],p[1]+.55,p[2]),(.035,1.10,.035),rail_black,.004)

# A closed, extruded U frame rounds the actual top corners of each storey.
# Perimeter sides belong to the arch shell; no freestanding support remains.
arch_stone=material('Facade_Honed_Travertine',(.86,.79,.66),.59,'marble_01')
arch_opal=material('Facade_Indirect_Opal',(1,.75,.40),.35,emission=3.2)
def arch_path(left,right,left_base,right_base,top,radius):
 points=[(left,left_base),(left,top-radius)]
 for i in range(1,25):
  a=math.pi-i*math.pi/48;points.append((left+radius+math.cos(a)*radius,top-radius+math.sin(a)*radius))
 points.append((right-radius,top))
 for i in range(1,25):
  a=math.pi/2-i*math.pi/48;points.append((right-radius+math.cos(a)*radius,top-radius+math.sin(a)*radius))
 points.append((right,right_base));return points
def arch_shell(name,profile):
 left,right=profile['left'],profile['right'];thick=profile['width'];r=profile['radius'];z=profile['frontZ'];top=profile['top']
 lb,rb=profile['leftBase'],profile['rightBase']
 out=arch_path(left,right,lb,rb,top,r);inside=arch_path(left+thick,right-thick,lb,rb,top-thick,r-thick)
 n=len(out);verts=[(x,y,d) for d in [z-profile['depth'],z] for path in [out,inside] for x,y in path];faces=[]
 for i in range(n-1):
  j=i+1;faces.extend([(i,j,n+j,n+i),(2*n+i,3*n+i,3*n+j,2*n+j),(i,2*n+i,2*n+j,j),(n+i,n+j,3*n+j,3*n+i)])
 faces.extend([(0,n,3*n,2*n),(n-1,3*n-1,4*n-1,2*n-1)])
 obj=crafted_mesh(name,verts,faces,arch_stone)
 bm=bmesh.new();bm.from_mesh(obj.data);bmesh.ops.recalc_face_normals(bm,faces=list(bm.faces));bm.to_mesh(obj.data);bm.free()
 # Recessed warm light belongs to the inner return of this separate frame.
 line=arch_path(left+thick+.035,right-thick-.035,lb+.12,rb+.12,top-thick-.035,r-thick-.035)
 for a,b in zip(line,line[1:]):rod('Rounded_Portal_Recessed_Amber_Light',(a[0],a[1],z-.085),(b[0],b[1],z-.085),.012,arch_opal)
for name in ['lower','upper']:arch_shell(name.title()+'_Rounded_Travertine_Portal',SPACE['referenceFacade'][name])
# Intersecting outer returns are one solid, without coplanar stone skins.
low=bpy.data.objects.get('Lower_Rounded_Travertine_Portal');high=bpy.data.objects.get('Upper_Rounded_Travertine_Portal')
bpy.context.view_layer.objects.active=low
union=low.modifiers.new('Connected_Outer_Frame_Returns','BOOLEAN');union.operation='UNION';union.solver='EXACT';union.object=high
bpy.ops.object.modifier_apply(modifier=union.name);bpy.data.objects.remove(high,do_unlink=True)
print('REFERENCE_ATRIUM_READY: upper right leg reaches ground, stairs behind, no freestanding columns',flush=True)

# Continuous recessed wall/planter light, with radiance baked into the shell.
linear=material('Exterior_Continuous_Opal',(1,.78,.42),.35,emission=8)
for run in json.loads((ROOT/'src/scene/exterior-lighting.json').read_text(encoding='utf-8'))['runs']:
 rod('Recessed_Linear_'+run['name'],tuple(run['a']),tuple(run['b']),.014,linear)
