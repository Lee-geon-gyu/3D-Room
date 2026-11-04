// Soft overcast dusk keeps the warm interior fixtures distinct.
export const AFTERNOON_HOUR=17;
export function createAfternoonLight(){
 return {
  hour:AFTERNOON_HOUR,sun:.34,sunColor:[1,.83,.68],hemisphere:.42,environment:.30,bake:1,exposure:.86,
  horizon:[.66,.69,.76],zenith:[.21,.28,.40],
  cloudShade:[.39,.43,.50],cloudLight:[1,.96,.92],
  sunX:11,sunY:10.8,sunZ:10,
 };
}
