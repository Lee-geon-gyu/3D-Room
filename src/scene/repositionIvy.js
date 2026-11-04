// Move connected leaves/branches rigidly. Testing each vertex against a wall
// boundary stretches triangles which happen to cross that boundary.
export function repositionIvy(geometry,shift,boundary=2.3){
 const p=geometry.attributes.position,n=p.count,parent=new Int32Array(n),size=new Int32Array(n),centers=new Float64Array(n);
 for(let i=0;i<n;i++)parent[i]=i;
 const find=i=>{while(parent[i]!==i){parent[i]=parent[parent[i]];i=parent[i];}return i;};
 const join=(a,b)=>{a=find(a);b=find(b);if(a!==b)parent[b]=a;};
 const index=geometry.index,count=index?.count??n;
 for(let i=0;i<count;i+=3){const a=index?index.getX(i):i,b=index?index.getX(i+1):i+1,c=index?index.getX(i+2):i+2;join(a,b);join(a,c);}
 for(let i=0;i<n;i++){const root=find(i);centers[root]+=p.getX(i);size[root]++;}
 for(let i=0;i<n;i++){const root=find(i);if(centers[root]/size[root]>boundary)p.setX(i,p.getX(i)+shift);}
 p.needsUpdate=true;geometry.computeBoundingBox();geometry.computeBoundingSphere();return geometry;
}
