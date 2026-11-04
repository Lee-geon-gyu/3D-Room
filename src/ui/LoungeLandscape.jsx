export const endingLandscapeAsset=`${import.meta.env.BASE_URL}assets/ending/gallery-ocean-farewell-v2.png`;

export function LoungeLandscape(){
 return <div className="lounge-landscape"><img src={endingLandscapeAsset} alt="" decoding="async" fetchPriority="high"/></div>;
}
