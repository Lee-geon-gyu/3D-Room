import {BufferGeometry,PlaneGeometry} from 'three';

// Keep the exact original vertices, UVs and triangle order. Only omit complete
// top rows whose alpha is always zero, even at the distant fog's feather edge.
export function createCloudGeometries(){
 const columns=32,rows=18,base=new PlaneGeometry(1,1,columns,rows);
 const slice=visibleRows=>{
  const geometry=new BufferGeometry();geometry.setIndex(base.index);
  for(const [name,attribute] of Object.entries(base.attributes))geometry.setAttribute(name,attribute);
  geometry.setDrawRange((rows-visibleRows)*columns*6,visibleRows*columns*6);
  return geometry;
 };
 const distant=slice(10),foreground=slice(9);
 return {base,distant,foreground,dispose(){base.dispose();distant.dispose();foreground.dispose();}};
}
