"""Close the ceiling borders and the stair-side soffit, without moving the stairs."""
finish_layout=json.loads((ROOT/'src/navigation/ceiling-perimeter.json').read_text(encoding='utf-8'))
warm_ceiling=material('Continuous_Warm_Ceiling',(.88,.79,.65),.83,emission=.38)

for key in ['ground','upper']:
 part=finish_layout[key];l,r,b,f=part['outer'];polygon=part.get('outerPolygon',[(l,b),(r,b),(r,f),(l,f)])
 # The inset runtime panel is 5mm below this continuous backing; the curved
 # frame descends from the same border. No upper-entry sky slit remains.
 slab(key.title()+'_Continuous_Ceiling_Perimeter',polygon,part['bottom'],part['top'],warm_ceiling)

# This wedge remains entirely outside the inner stair cheek. It closes the
# exposed band between the upper deck, facade return and the final flight.
pocket=finish_layout['stairPocket'];bottom=finish_layout['ground']['bottom'];top=finish_layout['ground']['top']
slab('Stair_Entry_Closed_Ceiling_Return',pocket,bottom,top,warm_ceiling)
slab('Stair_Entry_Closed_Stone_Cap',pocket,top,SPACE['upperFloor'],stone)

# Keep the stone front of both arches. Their underside and upper rear return
# continue the same ceiling finish, rather than appearing as a dark stripe.
arch=bpy.data.objects.get('Lower_Rounded_Travertine_Portal')
if arch:
 bm=bmesh.new();bm.from_mesh(arch.data)
 for key in ['lower','upper']:
  h=SPACE['referenceFacade'][key]['top']-SPACE['referenceFacade'][key]['radius']
  bmesh.ops.bisect_plane(bm,geom=list(bm.verts)+list(bm.edges)+list(bm.faces),plane_co=(0,0,h),plane_no=(0,0,1),clear_inner=False,clear_outer=False)
 bm.to_mesh(arch.data);bm.free();arch.data.materials.append(warm_ceiling);slot=len(arch.data.materials)-1
 for poly in arch.data.polygons:
  points=[arch.matrix_world@arch.data.vertices[i].co for i in poly.vertices]
  for key in ['lower','upper']:
   p=SPACE['referenceFacade'][key]
   if not all(p['top']-p['radius']-.001<=v.z<=p['top']+.001 for v in points):continue
   rear=all(abs(-v.y-(p['frontZ']-p['depth']))<.001 for v in points)
   underside=poly.normal.z<-.08
   if rear or underside:poly.material_index=slot
 # The native merger expects one material per object.
 bpy.ops.object.select_all(action='DESELECT');arch.select_set(True);bpy.context.view_layer.objects.active=arch
 bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.mesh.separate(type='MATERIAL');bpy.ops.object.mode_set(mode='OBJECT')
 for obj in bpy.context.selected_objects:
  if obj.type!='MESH':continue
  used={poly.material_index for poly in obj.data.polygons};assert len(used)==1
  mat=obj.data.materials[next(iter(used))];obj.data.materials.clear();obj.data.materials.append(mat)
  for poly in obj.data.polygons:poly.material_index=0
print('CONTINUOUS_CEILING_PERIMETERS_READY',flush=True)
