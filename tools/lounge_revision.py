"""Final seaside lounge, using the same layout as navigation and interaction."""
from mathutils import Matrix
L=json.loads((ROOT/'src/navigation/lounge-layout.json').read_text(encoding='utf-8'))
level=L['floor'];pit=L['pit'];pl,pr,pb,pf=pit['bounds'];w=L['window']
# Replace the solid rear with a real clear opening and complete timber returns.
for obj in list(bpy.context.scene.objects):
 if obj.name.startswith(('Expanded_Ground_Rear','Natural_Woven_Rug','Rug_Fringe')):
  bpy.data.objects.remove(obj,do_unlink=True)
left,right=SPACE['interior']['left'],SPACE['interior']['right'];rear=SPACE['interior']['groundBack']
for name,x0,x1,y0,y1 in [
 ('Sill',left,right,0,w['bottom']),('Header',left,right,w['top'],SPACE['interior']['groundSoffit']),
 ('Left',left,w['left'],w['bottom'],w['top']),('Right',w['right'],right,w['bottom'],w['top'])]:
 box('Panorama_'+name+'_Backing',((x0+x1)/2,(y0+y1)/2,-7.12),(x1-x0,y1-y0,.24),plaster,.002)
 slatted_wall('Panorama_'+name,(x0,rear),(x1,rear),max(level,y0),lambda z,y=y1:y,cornice=False,top_gap=.004)
for x in [w['left'],w['right']]:box('Panorama_Black_Jamb',(x,(w['bottom']+w['top'])/2,w['z']),(.055,w['top']-w['bottom']+.08,.09),rail_black,.006)
for y in [w['bottom'],w['top']]:box('Panorama_Black_Header',((w['left']+w['right'])/2,y,w['z']),(w['right']-w['left']+.06,.055,.09),rail_black,.006)
box('Panorama_Clear_Glass',((w['left']+w['right'])/2,(w['bottom']+w['top'])/2,w['z']-.015),(w['right']-w['left']-.055,w['top']-w['bottom']-.055,.008),glass,0)
box('Panorama_Stone_Sill',((w['left']+w['right'])/2,w['bottom']-.035,w['z']+.03),(w['right']-w['left']+.12,.07,.29),stone,.012)

# Rigid placement preserves all original tablet/work-table details and sizes.
def relocate(obj,origin,target,yaw):
 transform=Matrix.Translation(Vector(xyz((target[0],level,target[1]))))@Matrix.Rotation(-yaw,4,'Z')@Matrix.Translation(-Vector(xyz((origin[0],0,origin[1]))))
 obj.matrix_world=transform@obj.matrix_world
for obj in list(bpy.context.scene.objects):
 if obj.type!='MESH':continue
 x=obj.location.x
 if obj.name.startswith(('Gallery_Worktable','Gallery_Desk','Gallery_Low_Shelf')) or x<-2.7 and obj.name.startswith(('Stool_','Tool_','Brush_')):
  relocate(obj,(-4,-6.25),L['profile']['desk'],L['profile']['rotation'])
 elif obj.name.startswith(('Workbench_','Storage_','Crate_','Paper_Book_','Stool_','Tool_','Brush_','Paper_Stack','Desk_Lamp','Desk_Tree_')):
  relocate(obj,(0,-6.26),L['work']['desk'],L['work']['rotation'])
 elif obj.name.startswith(('Entry_Bookcase','Shelf_','Library_Book','Stone_Planter','Planter_Soil','Right_Atelier_Planter')):obj.location.z+=level

# Raise the indoor planted bed along with the new floor.
for obj in list(bpy.context.scene.objects):
 if obj.type=='MESH' and obj.name.startswith(('Connected_Perimeter_Bed','Connected_Perimeter_Soil','Continuous_Bed_Rim')):
  center=sum((obj.matrix_world@v.co for v in obj.data.vertices),Vector())/len(obj.data.vertices)
  if center.x>3 and -center.y<2.5:obj.location.z+=level

# Raised island and a full-width gentle 1:15 entry ramp. The old tile bed has
# the same genuine pit opening, so no hidden horizontal face crosses the sofa.
rl,rr,rb,rf=L['room']
for x0,x1,z0,z1 in subtract((rl,rr,rb,rf),pit['bounds']):
 slab('Lounge_Raised_Stone_Floor',[(x0,z0),(x1,z0),(x1,z1),(x0,z1)],-.049,level,stone)
a,b,c,d=L['ramp']['bounds'];sloped_slab('Lounge_Continuous_Entry_Ramp',[(a,c),(b,c),(b,d),(a,d)],lambda z:level*(d-z)/(d-c),-.06,0,stone)
slab('Sunken_Lounge_Foundation',[(pl,pb),(pr,pb),(pr,pf),(pl,pf)],pit['floor']-.16,pit['floor'],stone)
for x in [pl,pr]:box('Sunken_Lounge_Stone_Side',(x,(pit['floor']+level)/2,(pb+pf)/2),(.06,level-pit['floor'],pf-pb),stone,.006)
box('Sunken_Lounge_Rear_Return',((pl+pr)/2,(pit['floor']+level)/2,pb),(pr-pl,level-pit['floor'],.06),stone,.006)
sl,sr,sb,sf=pit['steps']['bounds'];count=pit['steps']['count'];rise=(level-pit['floor'])/count
for i in range(count):
 z1=sf-i*(sf-sb)/count;z0=sf-(i+1)*(sf-sb)/count;top=level-rise*(i+1)
 slab('Sunken_Lounge_Entry_Step',[(sl,z0),(sr,z0),(sr,z1),(sl,z1)],pit['floor']-.05,top,stone)
for a,b in [(pl,sl),(sr,pr)]:box('Sunken_Lounge_Front_Return',((a+b)/2,(pit['floor']+level)/2,pf),(b-a,level-pit['floor'],.06),stone,.004)

wool=material('Wool_Boucle_Carpet',(.77,.71,.61),1)
for x0,x1,z0,z1 in subtract(tuple(L['rug']),pit['bounds']):
 box('Lounge_Boucle_Carpet',((x0+x1)/2,level+.008,(z0+z1)/2),(x1-x0,.016,z1-z0),wool,.006)
box('Sunken_Boucle_Carpet',((pl+pr)/2,pit['floor']+.008,(pb+pf)/2),(pr-pl-.06,.016,pf-pb-.06),wool,.006)

upholstery=material('Sunken_Sofa_Boucle',(.84,.77,.65),.97)
olive=material('Sunken_Olive_Pillow',(.25,.30,.19),.98)
depth=pit['depth'];seat=pit['seatTop']
for x in [pl+depth/2,pr-depth/2]:
 box('Sunken_Sofa_Base',(x,pit['floor']+.18,(pb+pf)/2),(depth,.36,pf-pb),upholstery,.055)
 for i in range(4):box('Sunken_Sofa_Seat',(x,seat-.08,pb+(i+.5)*(pf-pb)/4),(depth-.06,.16,(pf-pb)/4-.018),upholstery,.065)
 side=pl if x<(pl+pr)/2 else pr
 box('Sunken_Sofa_Low_Back',(side+(.13 if side==pl else -.13),.19,(pb+pf)/2),(.26,.48,pf-pb),upholstery,.075)
for i in range(3):
 x=pl+depth+(i+.5)*(pr-pl-depth*2)/3
 box('Sunken_Sofa_Rear_Seat',(x,seat-.08,pb+depth/2),((pr-pl-depth*2)/3-.015,.16,depth-.04),upholstery,.065)
box('Sunken_Sofa_Rear_Base',((pl+pr)/2,pit['floor']+.18,pb+depth/2),(pr-pl-depth*2,.36,depth),upholstery,.045)
box('Sunken_Sofa_Rear_Back',((pl+pr)/2,.19,pb+.13),(pr-pl,.48,.26),upholstery,.075)
for i,(x,z,angle) in enumerate([(pl+.32,-2.5,.2),(pr-.32,-3.3,-.18),(-1.3,pb+.3,0),(-.35,pb+.3,.08)]):
 obj=box('Sunken_Sofa_Cushion',(x,.23,z),(.48,.46,.19),olive if i%2==0 else upholstery,.08,angle)
 obj.rotation_euler[0]=.13
cylinder('Sunken_Round_Table_Base',(-.75,pit['floor']+.16,-2.85),.42,.32,stone,vertices=64)
cylinder('Sunken_Round_Table_Top',(-.75,.005,-2.85),.52,.09,stone,vertices=64)
cylinder('Sunken_Stone_Vase',(-.91,.19,-2.90),.09,.26,whiteceramic,radius_top=.065,vertices=28)
for i in range(5):rod('Sunken_Dried_Stem',(-.91,.29,-2.90),(-.91+math.sin(i*2)*.14,.55+(.03*i),-2.9+math.cos(i*2)*.13),.0025,book_mats[2])

print('SEASIDE_LOUNGE_NATIVE_READY',flush=True)
