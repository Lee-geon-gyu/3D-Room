# Prototype Instructions

## Even eight-note opening, 2026-10-24 — latest audio request

The owner heard nine pulses in the first six seconds. Remove the extra C#6 at
1.125s and its entire sampled tail/effects, restoring eight onsets at .75s
intervals: 0,.75,1.5,2.25,3,3.75,4.5,5.25. Keep the latest pitches
78,81,88,86,85,83,78,76 and settled dynamics. No replacement passing key or
tempo shift. opening_passing_events is removed; right-hand score is 64 keys.
Preserve the first strike, all later notes, left roll, pad and public credits.
Active audio URL is v=15. This supersedes the extra-key instructions below.

## New six-second opening, 2026-10-24 — latest audio request

The owner requested a memorable new 0-6s introduction, superseding the copied
second-phrase contour below. Main notes are now 78,88,85,78, with inner keys
81,86,83,76 and one soft C#6 passing key at 1.125s. Heard notes:
F#5,A5,C#6,E6,D6,C#6,B5,F#5,E5; the last E5 leads up to F#5 at 6s.
Keep the original first strike, existing piano timbre and voice balances,
fast left roll and quiet pad. Only this introduction is recomposed; onsets
from 6s onward and the ending pickup remain unchanged. Natural tails overlap.
The return at 4.5s uses .90x its original soft-note gain and 5.25s uses 1.80x
its original inner-note gain, so the lower register settles instead of jumping
above the first strike. All later gain multipliers remain the established ones.
opening_passing_events records the one newly composed key (originalMidi=None).
All replacements still subtract their original sampled notes and effects first.
Runtime audio v=14; retain the original files, sound controls and public credits.

## Opening follows the second phrase, 2026-10-24 — latest audio request

The owner prefers the pitch contour of 6-11s for the opening. The first four
main notes now match that phrase exactly: 78,74,81,73 (F#5,D5,A5,C#5), at the
same 0/1.5/3/4.5s onsets. Interleaved inner notes connect them as
78,76,74,78,81,85,73,71; the E5 passing note avoids the reference's doubled D5.
This supersedes the earlier rising arch below. Preserve 6-11s as the reference,
the remaining score, all timing, first strike, voice gains, left hand and pad.
The changed main pitch at 3s requires subtracting its original E5 note from
the frozen recording before adding A5 with its original gain and effects.
strong_melody_events is shared by that replacement and the actual score report.
Follow-through uses the new main pitch at the same calibrated half-level.
Active audio URL is v=13. Keep both original recordings and public credits.

## Opening melody contour, 2026-10-24 — latest audio request

The owner rejected the audible doubled opening notes. The overlap was between
the main melody and interleaved inner notes: the first eight heard MIDI notes
were 78,78,81,81,76,85,85,71. They are now 78,81,85,83,76,78,74,71 (F#5, A5,
C#6, B5, E5, F#5, D5, B4). This creates a rising arch and a descending response.
Keep the 0.75s onsets, first strong strike, -0.75s playback rotation, 48s loop,
all voice gains, fast left rolls, half-level piano body and background intact.

The original frozen WAV still contains its original pitches. The renderer must
SUBTRACT each replaced original sampled note with its original linear effects,
then add the new pitch at the current voice gain. Changing only the extra-gain
stem would leave the old repeated keys audible. ORIGINAL_MELODIES is immutable;
MELODIES changes only first-bar soft notes, and OPENING_INNER_PITCHES changes
three first-bar inner keys. All strong main notes, left hand and pad are frozen.
right-hand-score.json records the actual interleaved playback order, including
originalMidi. The spectral opening regression reads the rendered WAV itself.
Active audio URL is now v=12. Never add production notes to public credits.

## Public music credits, 2026-10-23

The music-control credit link opens public/assets/audio/credits.html, a concise
Korean UTF-8 page with sample title, Alexander Holm, source, CC BY 3.0 link and
a short modification notice. Preserve all five attribution items. Keep the old
PIANO-CREDITS.txt URL as a concise ASCII fallback for existing links/downloads.
Never append internal render notes, user requests, RMS/gain figures or revision
history to either public credit surface. Keep production details here, in the
offline recipe or in task evidence. The prior long credit text is backed up in
outputs/music-credits-page-2026-10-23/before outside the repository.
That presentation fix did not alter the selected BGM or its sound controls.

## Half-level left hand and post-strike piano body, 2026-10-23 — latest audio request

The owner wants the opening pickup moved to the END and the first big piano
strike heard immediately. Circularly rotate ALL rendered stems by -.75s:
the first strong F#5 is now at 0, and the original .75s pickup begins at 47.25s
in the same seamless 48s loop. Retain the sample attack, no fade or extra notes.
Score JSON records playback starts and originalStart. The frozen piano-preserved
QA stem stays in original source order; the balanced stems use playback order.

The owner clarified that 'following melody' means the quiet body IMMEDIATELY
after a strong strike, not the separately played later high notes. Leave those
32 inner notes (2.53x original gain) and 16 replies (1.725x) at v10 levels.
Preserve each strong strike's first 120ms. Add the same sampled piano's natural
body with a smooth .12-.24s rise, a hold to .75s, and a return by 1.25s. This extra
body uses the original EQ without additional echo/reverb. Do not extend tails.

Use the first strong strike's original 250ms stereo RMS (.123712) as reference.
The actual right piano during .25-.75s after that strike is calibrated to HALF
that reference (.061856 RMS). The median 250ms left-hand gesture is also .061856.
These are active-note measurements; do not compare a sparse 48s average to an
attack or raise unrelated high-note attacks again. The generator writes isolated
strong, before/after body and left stems and records the measurements for QA.
Use the exact original upper sample bank, untrimmed codec silence, pitch shift,
envelopes, pans, circular echoes and EQ. These six upper Salamander sample files
are now alongside the low keys in tools/audio-samples/salamander. No new right-hand
notes, additional reverb, master normalization or new runtime player are needed.

Every FOUR melody notes still receive ONE softly and VERY QUICKLY rolled chord.
Use eight gestures,
6 seconds apart; each rolls root/inner chord tone/fifth/octave sequentially at
0/.035/.070/.105s offsets, with successively softer touches and overlapping tails.
The owner rejected the previous .96s roll as too slow: all four keys should
arrive within .105s, not be heard as four slow beats.
Match the existing harmony, including the Dsus2 and final Asus4. There are 32
left-hand keys total, not 128. The sampled left hand keeps its 12ms soft attack,
1.9kHz mellow EQ, common 4.2s gesture tail with .85s release and no added room.
The roll now reaches the half-reference gesture level: .019674 full-loop RMS,
about .24246 peak, with a safety peak cap of .75 times the strong stem's peak.
Its first gesture begins at playback 0. Its score and waveform shape are unchanged.
Do not change its score, timing, tone or release when balancing these voices.

Keep the original 40-note background score and short room, but mix it at .0028
RMS, below the left hand and the balanced upper piano (.06871 RMS). The audible
priority must remain RIGHT HAND > LEFT HAND > BACKGROUND. Render offline with
tools/retimbre_cloud_letters.py. The active file URL is v=12. Preserve both original
piano files, Salamander attribution, one player and all existing saved controls.

## Four left-hand piano strokes per melody note, 2026-10-23

The user explicitly chose FOUR left-hand strokes between successive right-hand
melody notes, not four per phrase. Keep the existing upper piano and the v3
revoiced background unchanged. Add 128 actual low-register Salamander piano
strokes beneath the 32 melody events: root/fifth/octave/fifth, spaced .375s
within each 1.5s melody interval. Use a gentle first-note accent, short pedal
and only the quiet .053s room tap. The source keys and CC BY README are in
tools/audio-samples/salamander. The active file URL is now v=4.

tools/retimbre_cloud_letters.py renders the original protected source, the
unchanged bed and the new left hand offline into one 48s seamless WAV. It needs
numpy/miniaudio; --decoder-root can locate an existing miniaudio installation.
Keep all existing BGM controls, saved levels and original sample credits.

## Original accompaniment score, timbre only and short room, 2026-10-23

The user clarified that the background melody must remain the ORIGINAL's.
Active BGM is cloud-letters-dream-piano-loop.wav?v=3. Preserve both earlier
piano files unchanged. The original deterministic pad is removed separately,
leaving the sampled piano unchanged within 16-bit PCM precision. Revoice the
same 40 accompaniment notes at their original pitches, chord voicings, starts,
9s lengths, envelope, tuning and pans. Both renders consume accompaniment_events
in tools/retimbre_cloud_letters.py. Preserve the original bass register too.

Change only the instrument spectrum: soft harmonic balance and a faint breath.
Keep accompaniment RMS .052, with the piano's original gain. Additional room
reflections are just .041/.079/.131 seconds at very low levels. No long diffuse
IR, octave transposition, anticipatory starts or stretched drone notes. Render
this offline into one seamless 48s player. Keep saved music/action volumes,
mute/resume, visibility, underwater filters and Salamander sample credits.
The v=3 query prevents the earlier quiet, transposed mix remaining cached.

## Continuous ocean, grounded lobby garden and faster farewell, 2026-10-23

The latest request keeps the connected 2F rooms and all existing controls.
GalleryAtmosphere now renders the sky and continuous ocean together. Evaluate
water at the world-space viewing-ray intersection with sea level -4.4; retain
six filtered wave scales, sky reflection and a soft photographic horizon blend.
Do not restore the finite SeaView patch or project the lower ocean onto a
spherical panorama: those caused diagonal edges and stretched poles. SeaView
remains a historical module for the old atrium. Use the existing animation loop.

GalleryLandscape grounds every room with a complete lower storey and footings.
The lobby overlooks real stone terraces, raised east planting, a lower rear
garden, rooted trees, instanced shrub leaves and low garden lamps. These are
decorative exterior volumes; interior navigation stays on the original level.
Keep the gallery's open sea view, the fixed four area/four spot lights, one
reflection and one composer. Do not add exterior walking routes or new lights.

Ending now reaches the first statement at 3.8s, second at 7.75s and contacts
at 11.25s. Contacts enter during the 1.35s second-statement lift. Restart is a
separate sibling anchored near the bottom with at least 40–48px safe clearance,
well below the contacts. Preserve the original bilingual words, photo, 24%
dimming, focus and reset behavior. Reduced-motion timings remain supported.

## Connected second-floor lobby and gallery, 2026-10-23 — latest request

This section supersedes the prior single-room gallery/entrance layout below.
GalleryScene remains the active scene; do not resume the old atrium or Blender
courtyard/stair builders. The new user references require a static luxury 2F
elevator, an elliptical reception desk under a large circular glazed oculus
with fine pendant rods, a short enclosed corridor and a separate long gallery.
The left gallery wall alternates glass bays and solid exhibition piers; all
six original projects occupy portrait paper displays with titles underneath.
Keep the original project images in proportion and the existing reader handoff.

galleryLayout shares the union of both rooms and corridor, the ellipse counter,
elevator face, planters, sculpture and benches with collision and navigation.
The second-floor label is conceptual; there is one physical walking level.
A cached occupancy grid and binary heap route around actual objects. The
profile tablet is LEFT and contact notebook RIGHT on the lobby counter.
Start just outside the closed elevator facing the lobby. Do not animate it.
Keep WASD/touch, guide shortcuts, all quests, reset, BGM and volume behavior.

The loader is gallery-exterior-v3.png (1840x854), recreated from the fifth
reference. The new graphite-mineral-v3.png and blue-hour-panorama-v3.png are
materials/environment only, never substitutes for interior geometry. Keep
previous assets. Use warm pool lighting and charcoal stone, not bright ivory.
Both rooms share four area lights, four ranked spotlights, one cached floor
reflector, one composer and one animation loop. Lobby fixtures share the pool.

Ending retains the complete sea-lounge photo and Clear/bilingual choreography.
Match the supplied final-image text/control positions. The 24% final dimming
layer lives with the photo outside the dialog so modal handoff cannot reset it.
Keep the image sharp and underlying canvas blurred, with no window camera flight.

Browser QA uses CUA in-app browser (Browser plugin absent). External inspection
scripts live in outputs/gallery-lobby-2026-10-23; final normal build must remove
their temporary dist controls. Do not change user tabs or run duplicate preview.

## Active single-floor portfolio gallery, 2026-10-23

The user explicitly stopped the prior atrium/luxury-lounge changes and replaced
that objective with the supplied dark gallery references. App now loads
GalleryScene.js. The old createScene, native Blender builders, courtyard, pool,
stairs and upper-floor files remain as historical sources, not the active scene.
Do not resume their remodeling or rebuild their derivative assets for this gallery.

GalleryArchitecture builds a closed, level mineral-stone gallery with champagne
frames, track spots, recessed perimeter light, oval ceiling wells, a central
SWEATIE feature, five individual wall exhibits, reception desk and a glazed
sunset lounge. galleryLayout.js is the shared metre-based source for all room,
frame, desk, solid, camera and route positions; there is no world shear/scale.
GalleryController retains WASD, drag/Pointer Lock, touch movement, running,
crouching, jumping, seating, cancel/reset and walking shortcuts. A* routes must
clear the actual frames, bench, desk, fire table and pots. The work shortcut
advances through unseen projects. Tablet LEFT and contact notebook RIGHT share
the reception desk; decorative books and orb must not occlude either reader.

Keep the existing React controls, quest counts, cursor, original content and
links, physical tablet/notebook and reversible DetailView handoff, and selected
BGM/volume behavior. Update only spatial labels that mentioned obsolete floors.
The latest entrance/ending revision uses lossless gallery-entry-detail-v2.png
(1448x1086), keeps the lee progress and gentle 1.10x door approach, and starts
at galleryStart in a real level entrance vestibule before the pivot doors.
galleryEntrance shares the physical stone canopy, opaque facade wings, privacy
returns and opened door clearances with navigation. Do not add courtyard/stairs.
The latest user explicitly replaced the live-camera ending: Clear blurs the
current canvas, then dissolves into gallery-ocean-farewell-v2.png (1672x941).
Do not fly the camera to the window. Keep both original bilingual statements;
the second rises and remains visible, then centered mail/phone links appear
below it, with restart beneath. The background itself stays sharp and static.
Keep the background as a sibling of the dialog, so changing from show() to
showModal() at the first statement cannot restart its image dissolve.
Preload it after scene readiness; preserve local fonts, BGM and reader behavior.

The generated nero-stone.png is a new project-local material asset, not a flat
replacement for the room. Preserve the generated original and all earlier assets.
Keep static material batching, one shared wool texture, one cached floor reflector,
four ranked spotlights, cached sunlight shadows, the existing composer and one
animation loop. Pause expensive rendering for idle readers and hidden tabs.
All custom flame shader fractional powers and smoothstep ranges must stay finite.

Gallery QA uses the in-app browser (Browser plugin absent). Temporary inspection
bundles are built only into dist/client from external output scripts and are
removed by the final normal build. Never leave inspection controls in production.
Gallery route/controller coverage is in tests/gallery-navigation.test.mjs.


## Continuous warm ceiling perimeter, 2026-10-22

The latest three detail photos require the open perimeter joins to be filled,
not another shift of the inset ceilings. Keep the approved core roof rectangle,
white recessed fields, stairs, furniture and plants. `ceiling-perimeter.json`
shares the cove contours, closed apron bounds, heights and stair-side pocket
between the native builder and headroom. The upper outerPolygon follows the
actual courtyard east wall beyond the stair arrival, rather than stopping at
the inner room wall. Its solid backing stays 5mm above the runtime recessed
fields; both fields retain their original size and elevation. A closed native warm apron bridges
each rounded border to the real wall/frame; a wedge outside the inner stair
cheek closes the visible lower soffit/deck return. Preserve the stair route.

The inner/rear top surfaces of both stone arches use Continuous_Warm_Ceiling;
retain their front travertine faces. At runtime these native apron/return faces
share the exact Cove_Warm_Ivory material with the curved border, so the upper
planting fascia cannot show a black stripe or sky gap from below. The inset
fields remain white and matched between floors. No new lights, frame loops,
post-processing or foliage exports are needed. Rebuild, bake, denoise and
restore original texture dimensions for architecture only.

## Seaside window and sunken ground lounge, 2026-10-22

The latest seven references replace the solid ground rear wall with a real
panoramic glass opening and a 3D ocean/coast under the existing cloudy sky.
`lounge-layout.json` is the shared source for the raised ground floor, gentle
entry ramp, genuine sunken floor cutout, four low steps, sofa and furniture.
Ground routes use variable floor heights; intermediate stair poses must still
use the explicit stair graph. Negative lounge floor heights are never swimming.
Keep the old pool cutout and all existing stair, rail, reader and quest flows.

The tablet/desk sits against the left wall and the workbench and all six works
sit against the right wall, in two landscape rows without changing their aspect
ratio or portfolio content. Right planting/cabinet shifts forward to free the
exhibition. Interior ground sconces share y=3.17, with right fixtures between
the frames. Remove the middle stair sconce from the native model and light list.
The indoor bed and pot/tree bases rise with the floor; outdoor pots stay on zero.

The roof rectangle is now left -5.15, right 3.40, back -3.54, front 3.255. Both
side enclosure walls remain outside it and all courtyard coping tops finish at
10.425, flush with the upper roof. The library cove stays 12cm within the roof
sides. Both white ceiling perimeters curve upward 6.5cm at the outside edge;
headroom shares the same profile. Preserve the two arch frames and stair route.

The large wool rug covers about 72 percent of the ground plan, including the
pit carpet. Subtract the actual pit from native tiles, raised floor, mortar and
floor glow, so no hidden skin spans it. The sofa is physical native geometry,
with a clear route around its table, sitting and safe standing. Wool uses one
small shared boucle texture. The sea is real static depth plus two inexpensive
wave functions, updated in the existing scene loop; no reflection camera or new
animation loop. Preserve the four point-light slots, cached shadows and pool
reflection schedule. Bake and runtime foliage placements must match. Rebuild,
denoise and restore original photographic maps after derivative exports.

## Aligned roof, continuous ends and cleared fixtures, 2026-10-22

The latest eleven detail screenshots remove the paper lantern entirely,
including its invisible head collision, and remove only the bed tree rooted
inside the west facade leg. Retain the real potted studio tree. Both cove
ceilings share one white frame/recess material pair and their existing light
energy; the library cove extends to 6cm behind the upper frame's back face.

space.upperRoof is now an explicit physical rectangle: left -5.35, right 3.72,
back -3.54, front 3.255. Its top is flush with the arch top, the right edge lands
within the outer return, its front aligns with the recessed arch light, and a
2cm gap separates it from the west courtyard wall. Headroom uses these same
bounds. Do not derive its right/front from old overhangs. Roof planting soil
follows the actual new perimeter. Preserve all arch/column positions.

Ground east oak/masonry extends straight to groundEastFront=2.5; upper west
oak extends to upperWestFront=2.70, overlapping the frame back slightly to
close its end. Ground walking/airborne and upper wall collision use these ends.
The balcony rail starts just before the timber at x=-5.20, z=2.5; native rails,
rail support/barriers and mesh probes share space.balconyRail, without changing
the deck front or stair route. Native stair sconces embed 2cm into measured oak
faces, with hidden solid mounting shoes continuing through the slat recess.

The entrance bench moves away from the door to photo-left: logical centre
x=3.25, approved width 2.4. Build native seats/legs directly from bench-layout;
remove the old runtime squeeze/shift so collision, sitting and baked shadows
match. Keep existing furniture sizes and all original portfolio content.

fit_garden removes complete leaf charts and runner components intruding into
the upper room and timber backing before batching/baking. Do not clip or stretch vertices.
Preserve the fitted natural entrance wall, native photo maps and the runner
silhouette simplifier. Add no lights, animation loops or full-screen passes.

## Natural entrance garden and continuous room radiance, 2026-10-22

The newest six screenshots remove the old floating window lattice and the
inset Stair_Facade_Return inside the widened ground room. Only its exterior
remainder beyond interior.right is rebuilt. Keep the shared straight enclosure,
existing content mounts, furniture, collision, ceiling and stair route intact.

Both Ivory_Mineral_Plaster side walls and Entry_Travertine_Wall now use the
same warm travertine texture, roughness, physical tile joints and indirect
light floor. Project joints along Z/Y on side walls and X/Y on the entry.
The door top LED joins the sides at y=3.895, below the y=3.91 stone underside;
do not bury it in the lintel. Native fixtures and wall spill share the JSON.

build_entry_wall_garden.py authors ONLY the entrance wall at its final height,
using whole scanned leaf charts, unequal fans and connected hanging growth.
It writes entry-wall-garden.glb without replacing rooted-garden.glb. fit_garden
retires the original high entry-wall components, retains side planting/low beds,
and imports the final-size patch without another height transform. Unify the
patch's native leaf material names before batching so full texture restoration
still works. Bake and runtime both consume finished-garden.glb. Do not stretch
or clip leaf vertices around the door. Validate ALL native branch objects,
including Entry_Wall_Connected_Branches, when checking derivative silhouettes.

Ground and upper front rooms have broad offline baked bounce and two subtle
floor-confined spill quads in the existing single merged glow draw. Add no
realtime lights, render loops or full-screen passes. Preserve the four existing
point-light slots, cached shadows and reflection schedule. Verify complete-scene
GPU time on the same machine after final assets, not background RAF cadence.

## Continuous finish, matched room widths and repaired foliage, 2026-10-22

The newest request supersedes the suspended upper-left return and the old
inset/tapered east walls. Both outer frame returns reach paving. Their overlapping
stone volumes are joined in the native builder, with no coplanar inner faces.
`space.interior` shares the straight right timber face (3.65), masonry centre
(3.78), and roof end (3.96) across both floors. Preserve furniture dimensions;
move the east cabinet, pots, sconces and artwork mounts with their real wall.
The entire ground soffit is flat at 5.30, with continuous oak to its underside.
All ceiling finishes are white except the approved upper cove inset. Remove
the three upper internal light lines; retain the cove and paper lantern.
The upper east wall is outside the cove, and the rising planter ends within
3cm of its arrival wall. Ground/airborne collision and headroom use these same
straight walls, full-height west return, and exact rounded arch profile.

`tools/fit_garden.py` fits ORIGINAL rooted-garden.glb into finished-garden.glb
before spatial batching. Always clear Blender's factory scene first. Move whole
leaf charts rigidly, preserving curl, UVs and edge lengths. Translate complete
branch components; never pull individual tube ends away from the door. Prune
only branch faces covering its real opening. Retire obsolete cornices as whole
components, and fit the library's old inner-wall ivy to the expanded upper wall.
Both runtime and shadow bake consume this same fitted native garden.
Runtime runners recover per-tube rings, weld UV seams only within each original
component, and simplify their centreline within 1cm. Preserve complex/pruned
junctions exactly and reject reconstructed rings wider than 16mm. Generic QEM
collapse and broad planar dissolves create spikes or bridge curved surfaces;
do not use them for these runners. Keep original leaf sampling and full source
texture dimensions. The derivative triangle guard is 550k to retain native
junctions; validate actual complete-scene GPU cost after foliage changes.

Exterior sconces use the shared exteriorSconceGain. Recessed continuous planter
and door reveal lights share exterior-lighting.json between native geometry and
one static wall-spill batch. Keep the existing four local point-light slots,
cached static shadows and reflection update limits. Do not add per-strip real
lights, full-screen passes, or frame loops. Keep upper fixtures above the door;
only fixtures inside the low portal are removed. Preserve the approved cloudy
palette, piano loop, cursor lock/return, loader, readers, Clear and ending.

## Separate full-height outer frame and overcast atmosphere, 2026-10-22

The latest reference supersedes the earlier identical stacked U frames and
warm sunset palette. `space.referenceFacade` is the shared physical source:
the upper right perimeter leg continues to ground, while its left end starts
at the upper floor. Its front is ahead of the independent lower frame. These
are outer frame returns, never restored freestanding middle columns. Retain
the merged ground room and all original content/furniture dimensions.

Move the whole stair, its right perimeter, connected soil, planters, fixtures,
upper arrival and route 1.5m to the right of arched-open-plan-v1. The real body
and rail-jump routes must pass BEHIND the upper right leg. Its exact rectangle
is both ground and airborne collision. Roof end follows the outer frame,
rather than assuming the stair entrance is also the house's outer face.
Green roof/balcony planting sits in front of each frame and trails in varied
lengths. Move connected ivy components rigidly, never only selected vertices.
Keep this transform aligned between runtime foliage and Cycles shadow baking.

Use muted cool cloudy sky and soft ambient fill, with subdued direct sun and
warm interior light. Keep it inviting, without added rain or weather effects.
Thin architectural glass keeps native geometry and environmental reflections
with a Fresnel alpha surface, avoiding full-scene transmission prepasses.
Remove the obsolete floating shared-room invitation rectangle. Preserve static
shadow caching, native scene pixels, original texture dimensions and artwork.
Water reflection updates more slowly at rest; camera motion retains its live
reflection. Performance diagnostics retain long frames, maxima and frame count.
Validate native asset quality, all stair/rail/quest routes and desktop/mobile
render costs after changes. Browser background RAF limits are not an FPS result.

## Rounded open-plan architecture, 2026-10-21

The latest request overrides the old six-column/two-room geometry. Both facade
endpoints are at logical z=2.5, anchored at the west front. Move the full stair
and its shared garden sections forward by 1.007736987m. Keep the existing world
affine transform, furniture dimensions, artwork, piano, loader and cursor.
Ground ceiling is 5.4m, upper floor 5.7m and upper ceiling 10.125m. The courtyard
walls meet the 10.425m roof top. Furniture upstairs only translates with its
floor; the profile furnishings translate 4.25m rearward. One open ground room
runs to z=-7, with continuous west/rear oak and no centre partition. Its side
exhibit and former divider sconces mount on the actual west wall.

tools/arched_revision.py runs before build_atelier's material merge. It removes
the six shafts/collars/capitals and old narrow portals, authors two rounded
travertine portal shells with recessed warm light, and replaces pickets/oak
newels with clear glass and slim black metal. Rebuild native geometry, bake,
denoise, build_runtime_models --architecture-only, then restore_glb for atelier
to retain native texture dimensions. Do not regenerate approved foliage assets.
Runtime perimeter ivy scales vertically with the taller wall; legacy cornice
ivy is retired and the shared flowering cornices follow the new facade heights.

Ground and airborne collision both use the merged room. Steeper stair footprint
checks accept exact ramp/connected-join heights while keeping ledges blocked.
The stair pots have their actual finite height during airborne motion. Keep
right-bank profile guidance, all reader transitions, and manual stair travel.
The static door has one closed oak face and deep stone reveals without centre
or side holes. Use physically sized stone UVs on its jambs.

Clear keeps Allura and restores its ORIGINAL curved underline path, recovered
from the earlier preview: M94 191C181 173 280 176 390 170C427 168 458 157 466 147.
Draw/wipe it left-to-right with a small travelling light and faint delayed
trails; no knot loop. Only the final contact stage fades in a 24% dark veil.
Keep the sharp floating lounge image, both text stages, contact lift and restart.

## Centred entrance, coved ceilings, larger studio and floating farewell, 2026-10-21

The latest request centres OUTDOOR at logical x=0 in front of the entrance and
aligns its heading with the affine courtyard axis. Guidance starts at this same
pose and retains the stair-side/right-bank profile route. RoomRefinements moves
the profile desk, chairs, tablet and viewing pose together by 90cm; the rear wall
also moves and its right end is finished. Share studioDepth across geometry and
navigation. Keep the original front taper and upper library untouched. Extend
the studio's real floor and headroom without stretching furniture or source UVs.

Replace the old visible interior ceiling strips with continuous rounded cove
ceilings in the right atelier and the rectangular part of the upper library.
Stop the upper cove before the diagonal front roof edge. Remove the two veranda
strip housings/diffusers and finish the slots flush. The left studio instead has
one suspended ivory paper lantern over the free floor. Keep the existing actual
ceiling light groups/energy and all global lighting settings unchanged. Cove
and lantern headroom match their geometry. Merge static ceiling surfaces by
material; add no real lights or frame loops. Only the actual pool grate/frame
switches from graphite to brushed silver; the dark recess remains.

EntryDoor now places its leaves at z=12.65, recessed behind the existing wall.
Clip a genuine opening in both wall faces, preserving interpolated baked UVs.
Use the loader-like warm travertine facing, deep stone reveals and fine joints.
The planter cut at x=+/-1.32 meets the jambs within 1cm, with aligned end caps.
Retain original foliage above y=4.14 and the static/decorative door behavior.

Remove farewell mouse parallax and its WebGL renderer/listeners entirely. Use
wood-ocean-lounge-detail.png, a faithful detail restoration of the supplied
photo (1470x1070 actual output; do not claim a 3K/4K upscale). Keep the original
asset. Anchor cover crops at the bottom so the coffee table/rug remain visible.
Use one slow 24s compositor float/1.8% breathing zoom, with reduced motion off.
No blur or grade. Preserve the two paragraph stages, contact lift, Clear knot,
restart, approved pointer lock/cursor and seamless selected piano BGM.

## Exact seaside lounge ending and continuous selected music, 2026-10-21

The latest request replaces the cloud ending with the user's exact ungraded
1469x1071 wood-ocean-lounge.png. Show it sharp from the FIRST farewell paragraph;
no photograph blur, tint or zoom. Retain the two bilingual statements, timings,
last paragraph's upward lift, contact reveal and restart. LoungeLandscape uses
an image fallback and a demand-rendered, native-resolution exterior-only shader
on fine pointers. Timber, furniture, plants and window rims stay pinned. Source
image coordinates keep the mask aligned during cover resizing. Reduced motion,
touch and unsupported/lost WebGL retain the exact static photo. Stop idle/hidden
frames and release GL resources/listeners on restart. Clear keeps Allura and a
thin drawn knot flourish beneath it, lingering briefly into the existing dissolve.

Use cloud-letters-piano-loop.wav as active music. The selected original remains
untouched; this edition wraps note tails/reverb over the same 48-second score,
retaining its notes, timing, samples and approved gain, without master fades.
Keep the saved volume, mute, visibility, underwater filters and sample credits.
The user accepts the browser's Esc notice if it cannot be hidden legitimately.
There is no web API for suppressing that browser UI: preserve actual Pointer Lock
and the already approved cursor return rather than removing the lock again.

## Actual pointer return with approved browser notice, 2026-10-21

The user explicitly chose real return to the mouse-down position and ALLOWED
the browser's Esc notice. This overrides every older no-Pointer-Lock rule.
Request pointer lock directly on primary mouse-down in the world canvas. Keep
the cursor hidden while looking; use locked mousemove movementX/Y exactly once,
not both pointermove and mousemove. Release on mouse-up, Esc, cancel, focus loss,
hidden page, pause or disposal. The browser restores the real lock-entry pointer.
Keep the fast native white cursor outside readers and the existing adaptive
reader cursor. Reject stale pre-release samples; do not paint a fixed DOM ghost.

Touch, unsupported and denied lock requests retain captured dragging and actual
release coordinates. Handle promise and legacy void APIs. Late grants after
release or disposal must immediately unlock. Losing ordinary pointer capture
during successful lock acquisition must not cancel mouse look. Preserve ordinary
object clicks, camera sensitivity, all visuals and the approved piano music.

## Entrance canopy, original Clear face and selected piano BGM, 2026-10-21

Preserve the original wall foliage ABOVE the door: clearance is limited to
y<4.14 in the central doorway strip. The door and lintel remain unobstructed;
do not erase vegetation all the way to the perimeter coping.

Clear again uses local Allura Regular handwriting. The separate farewell keeps
Nanum Myeongjo and Cormorant Garamond, its timings and existing motion unchanged.
Warm Allura after the world is ready so it is cached before quest completion.
Keep its original SIL OFL notice and source attribution with the font.

The user explicitly selected Cloud Letters Piano. It is now the site's looping
BGM at assets/audio/cloud-letters-piano.wav: use the exact approved 48s WAV,
without rearranging or normalizing it again. Preserve the existing user volume,
mute/resume, visibility lifecycle, underwater filters and independent action
sound setting. Keep Alexander Holm's Salamander sample CC BY 3.0 credit in
assets/audio/PIANO-CREDITS.txt and accessible from the volume panel. Older music
assets stay available but are not the active source.

## Open entrance loader, static oak door and piano proposal, 2026-10-21

The latest request replaces the four-shot loader with one continuous eight-second
approach through open pale-oak doors, using loader-entry.webp plus the dedicated
portrait loader-entry-mobile.webp at aspect ratios <=4/5. These are generated
companion photographs based on the current actual courtyard and the user's
doorway reference, not new live 3D cameras. Keep LEE and real resource progress,
cleanup/retry/reduced-motion behavior and the existing completion dissolve.
Preload only the matching entrance source; do not preload the retired first shot.

EntryDoor adds a static bright oak double door at x=0,z=12.4 with an ivory frame
and brass pulls. Remove the central wall fittings, foliage and low planter faces
only within its clearance. Preserve/interpolate baked-light UVs at planter cuts.
The courtyard bench narrows from 2.85 to 2.4m and its collision/seat bounds match.
No door interaction, moving hinges, model/texture resolution or lighting changes.

The native world/HUD/loader/ending cursor still combines white dot and white halo
in one cached PNG. Settled reader paper now clips a black core explicitly rather
than difference-blending its light. Halo color is black ONLY for a core wholly
inside white paper; all mixed edges, rounded corners and contact punches retain
white light. Cache paper bounds on layout changes, not raw input; radius and the
clip geometry use the same current frame. Keep immediate positioning, captured
look hiding, release coordinates and viewport-edge hotspots unchanged.

Navigation keeps sequential route order and fixed geometry. All four layers now
fade directly with a slow 5.4s smooth envelope; there is no square-root glow jump.
The existing single incomplete quest policy and route endpoints remain unchanged.

Cloud Letters Piano is a SEPARATE 48-second listening proposal outside public.
Its original melody, timing and 80 BPM remain; Salamander Yamaha C5 samples by
Alexander Holm (CC BY 3.0) replace synthesized keys. Credits travel with the WAV.
Do not wire this proposal into AmbientMusic until the user selects it.

## Soft cloud ending, unified cursor light and travelling floor arrows, 2026-10-21

The current user request supersedes the separate DOM halo/native core rule.
Use one cached 48px PNG hardware cursor containing BOTH the white core and its
white radial light on the world, HUD, menus, loading and ending, including viewport
edges. Never paint a second following halo there. Only settled content readers
and the paused control dialog retain the exact-position, difference-blended DOM
cursor for partial inversion. Keep captured look hidden, without Pointer Lock.
Restore at actual release coordinates; no old press-point overlay may reappear.
Raw input does not encode images, measure layout or update React state. Shape
and slow glow update quantized cached frames at the existing bounded cadence.

Floor guidance for works now ends at WORK_GUIDANCE, centered on the rear wall.
ATELIER still opens the first work via the shortcut. Round only collision-checked
flat corners and sample normalized look-ahead/behind tangents for every arrow.
Preserve the right-side profile approach and exact stair/floor projection. Route
ordered fades run in the instanced shader, with no matrix/geometry rebuilding per
frame. White radiance accompanies the complete reveal. Fades repeat without a
dark hold, and reduced motion remains steady. Keep exactly one incomplete quest.

The ending now uses the supplied Cartier screenshot's soft, muted cloud palette,
with the original landscape, mountain placement and flowing banks. Use local
OFL Nanum Myeongjo ExtraBold and Cormorant Garamond Medium Italic; Cartier's
FancyCutPro is proprietary and must not be copied without a licensed font.
Use the original contact.statement/statementEnglish, with a soft type entrance.
Retain stage timings, second-paragraph persistence/upward lift, contact entrance,
blur release and restart. Loader and main environment visuals stay unchanged.
The original Cloud Letters 48-second WAV is a listening proposal OUTSIDE
public assets; do not connect it to AmbientMusic before user selection.

## Slow light, quest navigation and shared shortcut tools, 2026-10-21

This request supersedes the preceding half-second pulse, all-path display and
Pointer Lock rules. Do NOT request Pointer Lock: its browser Esc notice cannot
be hidden by page UI. Captured mouse/touch look still hides the cursor until
release/cancel/blur/pause, then restores at the actual release position. Remove
the native lock-entry anchor behavior and retain all real camera/reader controls.

Keep the fast native WHITE cursor core opaque, cached by radius only. Paint its
WHITE halo in the existing normal-blended DOM SVG; hide only that SVG's duplicate
core in native mode. This avoids animating alpha in OS cursor bitmaps. Readers
retain difference blending and their black dot/black glow over white content.
Scale about the same center without squash. The continuous neon cycle is 3.2s
for cursor and unseen props, 4.8s for floor navigation; no invisible hold follows
a complete fade-out. Reduced motion remains steady. No positional interpolation.

Show exactly one floor route to the earliest incomplete quest in the order
profile / all works / contact, independent of completion order. Completed quests
never have routes; after all quests the route is empty. Replan on quest/viewed
changes or toggle at a changed position, never in the render loop. Reuse the
instanced geometry/materials/buffers across changes. Solid white racing arrows
sit 10cm above the original stone with white glow and a quiet ground shadow.
Use the existing validated planner and floor projection, preserving actual
stairs and all architecture. Keep wayfinding ON initially, WHITE button fill
and BLACK pin while enabled; OFF uses the normal dark/white control treatment.

Profile shortcut and profile floor guidance use guideRoute's stair-side pool
passage. From the initial OUTDOOR pose go through the far-right gate, then the
near-right gate before entering the studio. A visitor already on the left bank
must first exit safely around the far end; never teleport or disable manual
walking there. Upper-floor and right-bank approaches use the same safe near
gate. Apply this policy to replanning as well; preserve other destinations.

Desktop has a shared group in the exact former three shortcut positions:
Control guide / Shortcuts (running-person icon, caption 바로가기) / Wayfinding.
The shortcut menu contains profile/work/library on both desktop and mobile.
Mobile <=768 retains this three-control stack at upper left with VISIBLE Korean
captions under all buttons. Desktop menu opens upward, mobile opens rightward.
Keep every loader/ending asset, original render quality, reader and legal copy.

## White neon dot, immediate cues and optional floor guidance, 2026-10-21

The latest user request replaces the old mint ring with a WHITE filled dot.
Hover grows it slightly; press shrinks it isotropically about the same center.
Keep its white core legible, with a soft radial halo pulsing every 0.5 seconds.
neonPulse is shared by cursor, unseen-object blue outlines and floor chevrons;
all fade out then immediately fade in, with no invisible hold. Reduced motion
uses steady light. Retain per-pixel difference blending over PROFILE/WORK/CONTACT.

Use a cached native SVG cursor on the world canvas interior for tracking that
does not wait for 3D composition. The user approved native world tracking, then
changed the requested color to white. Use the adaptive DOM dot on readers and
at viewport edges, retaining the entire halo inside an 18px inset. Scope native
frame variables to the canvas; raw pointer input never changes React state,
measures layout or serializes cursor images. Only shape/glow use a bounded RAF.

Held world mouse look requests Pointer Lock, rotates with movementX/Y once, hides
both cursor presentations and releases on mouse-up, blur, cancel, pause or abort.
Restore the initial press point. Touch/unsupported/denied lock retains captured
look and a visual anchor fallback. Actual OS pointer restoration requires the
browser to grant Pointer Lock: IAB testing rejected it even on an isolated canvas
(WrongDocumentError / earlier UnknownError). Never claim native warp verified
there or bypass browser access controls. Late grants must immediately unlock.

Wayfinding starts ON per page visit, with a white MapPin on a dark round button.
Desktop: under the control guide. All mobile widths <=768: under the automatic
run destination button. aria-pressed and title communicate its toggle state.
It only toggles floor guidance; shortcuts retain their original arrival/opening.
Build three collision-checked routes from OUTDOOR to profile/work/library once.
Sample in physical meters, deduplicate shared runs, project onto rendered floors
and steps, and draw three blue neon chevrons per marker with three shared,
instanced layers. No planning, raycasting, geometry rebuilds or allocations per
animation frame. Hide floor guidance during readers and the entire ending.

Preserve all loader/ending imagery, timing, architecture, models, lighting,
native image dimensions, shadows, water and live render resolution. Remove only
unused onHint work, cache static support tests and body directions. Do not retain
the experimental GPU fence gate: native cursor tracking removes that dependency,
and the gate did not establish a frame-cadence improvement in measured QA.

## Low-latency cursor input and hidden look drags, 2026-10-20

Use passive capture-phase pointerrawupdate for cursor coordinates when supported,
with pointermove fallback. Take the newest coalesced hardware sample and reject
older timestamps; do not interpolate or predict its position. Keep the raw path
to coordinate sampling and a changed compositor transform, with no React state,
layout reads or shape animation. Ordinary pointer events still track hover/press.

Primary mouse down on the world canvas hides the ring immediately for that
pointer until release/capture loss. Keep data-world-cursor while hidden so the
native cursor cannot reappear. Suspend ring shape RAF during the look drag;
restore at the current coordinates on release. Cancel, blur, page visibility,
media changes and unmount clear this state. Buttons, sliders and reader content
retain their visible pressed cursor. Preserve difference blending, dialog hosting,
the full viewport edge inset, original ring shape and all scene/reader visuals.

## Warm ending, immediate adaptive ring and prepared first visits, 2026-10-20

The latest request restores the ORIGINAL warm afternoon ENDING palette. Remove
the blue morning shader/SVG grade; keep the original cloud source, mountain/rock
composition and moving fog. Preserve the persistent second handwritten paragraph,
its upward lift, contact fade and blur release exactly as implemented previously.

The live ring uses a white stroke with CSS difference blending so only pixels
over white content become black, including partial overlap at a reader edge.
Retain its original geometry, pressure/hover motion, full-viewport inset and native
dialog top-layer host. Paint position directly in passive pointer events without
React updates or an extra RAF delay; the RAF animates shape only. Cache viewport
dimensions until resize, and keep touch/reduced-motion/forced-colors cleanup.

Split scene preparation at actual assembly boundaries. Initialize unique source
textures in short batches, compile for the composer's existing HDR format, then
upload out-of-frustum geometry into a disposable 1px preparation target. This
target must NEVER replace or resize the live composer. Restore culling and target
state even on failure/abort. Retain every source texture dimension, live render
scale, material, light, shadow, water reflection and existing quality policy.

Prepare all twelve routes between the four fixed arrival poses during loading.
Cache only these validated static routes, return independent point copies, and
retain the original planner for other positions. Preserve destination camera
direction and validate the first segment for tiny floating-point arrival offsets.
Yield between searches and release resources safely if loading is interrupted.

## Studio sconce, full-viewport ring, LEE favicon and morning ending, 2026-10-20

Latest user request adds exactly one existing-style bronze cylinder to the center
of the ground-floor left room wall. StudioSconce probes the visible Warm_Oak face
(not the hidden rear masonry), at x=-3.995, y=2.45, and mounts 65mm in front. Match
the existing 71mm radius, 330mm body and two 49mm opal apertures. Three static draws
and one source in the existing four-light ranking pool add the warm graze/highlight;
do not add shadow-map lights or change the other rooms or original native assets.

The ring now uses one fixed, pointer-transparent SVG. Native bitmap cursors can
fall back at viewport boundaries. Keep the complete ring within a 16px viewport
margin, update position once per animation frame, shape at most every 40ms, and
write hover/press attributes only on change. No React state in pointer movement.
Place the same element in the current open native dialog to retain top-layer
visibility; dispose observers/listeners/RAF on unmount and pause when hidden.
Retain hover/pressed motion, reduced motion, touch exclusion and forced colors.

Favicons trace the ORIGINAL loader LEE alpha (not a replacement font), preserving
the three letter holes and silhouette. favicon-light.svg is black, favicon-dark.svg
is white, and favicon.svg has an adaptive fallback. installFavicon follows the
browser color-scheme signal on startup/change, with a removable single listener.
Keep the original loader mark, photos, sequence and resource progress unchanged.

Only the ENDING changes to a bright blue morning grade. The original cloud image,
UVs, mountains, restored right rock, drift, resolution and geometry stay intact.
morningPalette shares one linear-RGB matrix between the existing shader and the
SVG-filtered compatibility photograph. No new image, texture or full-screen pass.
The original second Korean AND English handwritten lines persist continuously
through second / secondOut / complete; never remount/rewrite/fade them away. Lift
that section over 2.8s starting at secondOut, then fade contacts upward over 2.8s
at complete, with the existing 1.8s blur release starting at contact appearance.
Remove the added invitation '함께할 여정을 기다립니다.'; retain the original text
'함께할 때 더 큰 가치가 됩니다.' and English. Keep restart and all quests/readers.

## Close workshop loader shot and lossless optimization, 2026-10-20

The latest loader order is wall / upstairs library / close ground-floor atelier /
the former third frontal courtyard shot. New loader-atelier.webp is an actual
1600x789 scene photograph with lossless WebP encoding; retain all older assets.
The fourth shot must use the unchanged loader-front.webp. Preserve LEE, real
resource percentage, all four two-second shots, dissolves and thumbnail timing.
Lift only loader photo brightness and its shade slightly.

Optimization must preserve design, content, native texture dimensions, main
render scale, AA, existing quality policy, water reflection, shadows and lights.
Cloud planes share the original full vertex/UV/index buffers and omit only
complete upper rows with guaranteed zero alpha. Keep the full base plane,
bottom ten distant-fog rows and bottom nine foreground rows; shaders stay exact.
Hide CSS compatibility fog only after the worker/main canvas has fully faded in;
restore it immediately on fallback. Keep worker motion and ending blur timing.

Reuse light-ranking records, retaining source-order tie breaks, cadence, room
switching and per-frame intensity damping. Idle camera/source/quality states
can reuse their ranking. Ray eligibility must reject only the same inaccessible
states before raycasting, and activation must always check current occlusion.
Hidden/unchanged cues skip material writes. Schedule action-audio gain only when
its target changes, retaining every movement tracker update and original samples.
Memoize preserved HTML and lettering; remove only unused legacy reader selectors.
Never simplify geometry, lower image quality or change visual behavior to claim
an improvement. Keep the physical opening, all three shortcuts and mobile reflow.

## Second loader shot looks into the upstairs library, 2026-10-20

Replace only storyboard shot 2 with loader-library.webp, photographed from the
upstairs terrace/library viewpoint in the latest user screenshot. Show the
long bookcase and desk on the left, ivory chair in the middle and planted
terrace rail on the right. Preserve the four-shot order/timing, LEE and actual
resource percentage. The shot and its thumbnail share the storyboard asset.
Keep loader-foliage.webp as the previous version, and retain the third shot's
frontal courtyard view. Capture-only camera changes never enter scene code.


## Final mobile reflow, four-shot loader and distant mist, 2026-10-20

The latest reference replaces the single-photo loader with four actual-scene
photographs, loader-wall / loader-foliage / loader-front / loader-detail.webp.
Keep the LEE signature and honest resource percentage. Four two-second shots
dissolve in order with a small thumbnail timeline; resource readiness is never
faked. An already-ready scene waits for this eight-second visual introduction,
while a slower load reveals as soon as it finishes. Reduced motion skips that
hold. CSS camera drift keeps playing while scene compilation occupies JS;
the last shot continues gently for slow loads. A retry remounts the film.
The reference is a still storyboard, not a supplied video: do not claim its
unknown source timing was measured or reproduced exactly. Retain older assets.

The fixed 17:00 sky now has lighter blue/peach and cloud shades. Keep architecture
exposure, sun energy, timber, planting and the aligned cornice lights intact.
Ending distant fog has two slower, feathered moving banks as well as the three
existing foreground banks. Sample below the peaks and protect both edge rocks;
retain clean upper sky, worker rendering, reduced motion and the existing blur
timeline (5px during paragraphs, fully clear at final contact).

Every mobile reader rule applies at width <= 768px. PROFILE contacts remain
below the name beside the portrait, bottom-aligned with it. All category bodies
begin under their headings; narrow date columns wrap rather than overflow.
CONTACT grows vertically and scrolls as needed without losing legal copy.
WORK has no presentation tabs: mockup above the complete description, metadata
and original links. Its native scroll returns to the top when changing works.

Preserve all physical opening/closing handoffs and the real landscape prop
geometry. A settled reader MUST use transform:none; frozen projected corners
must never stretch typography after viewport resize. On mobile the moving
project quad expands into a tall native reader, then reverses on closing.
The three menu shortcuts and first-work automatic arrival remain unchanged.


## Three shortcuts with arrival-triggered readers, 2026-10-20

Desktop and mobile share exactly three guide destinations: profile tablet,
work exhibition and upstairs library. Remove Terrace only from this menu;
preserve internal terrace/water-exit guidance and normal walking/seating.
Successful guided arrival opens profile/contact or content.projects[0] through
the existing interaction.begin checks and physical presentation. Never equate
onRoute(false) with arrival: manual cancellation, pause, reset and replacement
must not open stale content. WalkController's optional onArrive fires once,
after its final position/orientation have been applied to the actual camera.

The work destination faces the FIRST rear-wall frame, not the former fifth
east-wall frame. ATELIER stands at [-1.2,-4.9], slightly off center to retain
clear outgoing routes, and looks toward slot 1 with the shared world shear.
Selecting work resets the exhibition to page 0. Closing a reader restores normal
control and must not repeat automatic opening. Keep the same E-key eligibility,
reversible tablet/frame/book motion, quest registration and all content/links.


## Aligned lower cornice light and left-side ending mountain, 2026-10-20

Preserve the preferred upper cornice LED position. The lower LED and its soft
graze now sit about 30cm higher, at the SAME inset below the timber top as the
upper light: lower y=3.506, upper y=6.756 in logical coordinates. Share this rule
through corniceLightHeight; do not return the lower line to the fascia bottom.
Planting, upper strip, color, energy and the side return remain unchanged.

The latest loader photos are house-stair-aligned.webp / its -mobile sibling,
photographed from the unchanged original OUTDOOR stair-facing view after this
lighting adjustment. LoadingScreen and responsive HTML preloads use these.

The ending uses cloud-journey-balanced.webp in BOTH worker and CSS fallback.
The MAIN mountain stays at the far left; the original SMALL far-right rock is
restored at its original edge position per the latest user correction. Keep the
middle clear of peaks for text. Portrait cover cropping keeps peaks outside the central
copy. Preserve clean sky, original palette, five-times rightward drift, parallax,
paragraph-only blur and the existing 28px/3.6vw/48px invitation font sizing.
The original clean and earlier source artwork are retained separately.


## Interior-matched oak slats, stair photograph and clean cloud sky, 2026-10-20

The latest correction requests the actual interior joinery on BOTH planted
fascias. facadeSlats.js adds physical vertical oak boards: 43mm width, 78mm
pitch, 48mm depth, small bevels and recessed darker oak backing. Two shared
static draws cover lower/upper fronts and the upper side return. Preserve
the original room oak textures, aged finish, plants, warm bottom light lines,
white soffits and black courtyard coping. Project the original fascia's baked
UVs with a temporary BVH; never use a generic atlas cell or overwrite source
geometry. Preserve the rest of the architecture and navigation.

LoadingScreen uses NEW house-stair.webp (1600x1000) and house-stair-mobile.webp
(900x1068), photographed from the original OUTDOOR stair-facing camera with
the latest finished scene. Keep the LEE/real-progress/photo animation intact.
The HTML preloads the matching stair photo by aspect ratio, not the old clouds.
The prior original and frontal photographs remain as separate assets.

Only the ENDING uses cloud-journey-clean.webp: original mountain/cloud sea,
with small wispy upper-sky clouds removed. Its foreground banks now visibly
advect rightward at five times the old velocity and with greater opacity.
Mirrored horizontal texture wrapping prevents seams or reset jumps; the mask
keeps sky and mountain peaks stationary. Keep worker rendering, reduced motion,
parallax, paragraph blur and the clear final invitation/contact stage intact.
Do not reintroduce the removed wispy sky in the CSS compatibility background.


## Layered planted terraces, volume cursor and current facade photographs, 2026-10-20

Latest user-supplied planting reference supersedes the old uniform flowering hedge.
Both story edges now combine photographed, pointed foliage, airy shrubs, fine
cascades, round trailing vines and cream blossoms, with concealed warm LED edges.
Keep the wood fascia visible between plant pockets and match its vertical grain
to the existing room's oak. Retire only legacy balcony/roof-cornice ivy; preserve
all exterior-wall ivy and black perimeter copings. Plant instances and materials
are shared with at most ten static draws; no per-frame botanical animation.
Do not overwrite the chained leaf/skylight shader when filtering fixture lights.
Retain source plant geometry, textures and pots; cornices clone just the foliage.

Volume ranges use the existing native ring cursor and pressed motion, never the
I-beam. Text cursor applies only to actual editable text controls. Keep keyboard
range operation and independent music/actions preferences intact.

The user explicitly wants the original PHOTO/LEE/resource-percent loader, but
with a NEW photograph of the completed current 3D facade. Use house-current.webp
(1600x1000) and house-current-mobile.webp (900x1068), captured from the actual
updated production scene without HUD. Preserve original photo-loader animation,
signature, real progress and shade. Older house images stay intact. The separate
ending still uses the moving cloud scenery, stage-specific blur and large text.
All preceding profile baseline, role weight, black printed icons and ending
refinements remain. Temporary photography pages are removed by the final build.


## Bottom-aligned profile, ending focus and original house loader, 2026-10-20

Latest user correction supersedes earlier loader choices and constant ending blur.
The user explicitly confirmed restoring the original HOUSE PHOTO loader, with
LEE and honest resource percent; do not use cloud scenery in LoadingScreen.
Keep the separate moving cloud scenery in the ENDING. Remove the world startup's
cloud-worker-ready dependency when restoring the photo loader. House photo assets,
original centered signature size, shade and gentle approach are retained.

PROFILE identity copy ends on exactly the same lower edge as the portrait. Keep
all field spacing, content and prop continuity, and reduce header-role weight to
400. profile-screen-aligned.png is the actual 1212x680 display capture with full UVs.
The physical contact SVG applies black ink to both original phone/mail icon alpha
silhouettes, so opening and live reading never switch purple to black. Preserve
the original icons and other assets, cover/ring geometry and social links.

Ending uses 5px cloud blur through both handwritten paragraphs, then transitions
to zero blur over 1.8s at the final invitation/contact screen. A very faint center-
weighted shade improves white text visibility. Enlarge CLEAR, both bilingual
paragraphs and invitation, preserving pen timings and the invitation's 2.6s fade.
Keep phone/email and restart sizes unchanged, horizontal contact row and lower-
center restart. Preserve reduced-motion handling and movable Clear/depart.


## Light PROFILE and cloud ending, 2026-10-20

Latest user correction supersedes the dark PROFILE, house ending background and
handwritten final invitation below. PROFILE returns to its original white screen
and dark content; move 'UI/UX 웹 디자인 및 퍼블리싱' out of IDENTITY to the right
of PROFILE with a small gap and shared baseline. Allow the full role to move to
a second header row on narrow phones. Keep the enlarged tablet bounds, complete
copy, readable type, tabs, graphite housing and continuous prop wake/reverse.
profile-screen-light.png is the actual 1212x680 white display capture; use full UVs.

Only the added first/second-story cornice leaves receive a darker, muted olive
fill, similar to exterior ivy but slightly brighter. Preserve growth, flowers,
other vegetation and chained foliage shader hooks. The two handwritten farewell
paragraphs remain unchanged. Final invitation is normal readable text exactly
'함께할 여정을 기다립니다.' with a slow 2.6-second opacity fade, no ink mask.
Preserve the wider contact gap, one-line phone/email and lower-center restart.
Ending reuses LoadingLandscape and its moving cloud worker, with only ending-
scoped subtle blur. Do not change the loader's own artwork, motion, LEE or percent.


## Warm afternoon, readable ending and uninterrupted loader, 2026-10-20

Latest user correction supersedes fixed morning and the prior sharp ending.
Restore the ORIGINAL warm afternoon palette/sun colors and keep it fixed, with
no day/night cycle. Initialize the sky/environment before the single PMREM bake.
Ending house image has only a subtle 3px blur; keep shade/veil transparent. Final
handwritten tagline and horizontal contacts have a responsive 36..48px gap.
Keep the two handwriting paragraphs, timing and lower-center restart intact.

Enlarge PROFILE to max 1360x700 (1232x700 in 1280x800), preserve its continuous
physical wake/homography/reverse motion, readable type and complete content.
Desktop bottom panels use 7/9/8 of 24 columns so the longest education entry and
all other fields stay on one line. Keep responsive tabs on smaller viewports.
profile-screen-wide.png is the actual 1212x680 display capture with full UVs.
Remove only the vertical border between artwork mockup and caption; keep other
frame/meta borders, five-second floating image and all links/content.

The loader's DOM-free Three renderer runs in a dedicated OffscreenCanvas worker.
Start it BEFORE importing/building the heavy world so main-thread decode/compile
cannot stop cloud frames or ongoing parallax interpolation. Pass pointer/resize/
visibility messages and dispose worker, fetch, image bitmap and GPU resources.
Unsupported/failed workers use compositor-animated cloud banks or the main-thread
compatibility renderer. A six-second startup fallback cannot block scene loading
forever. Reduced motion stays static. Keep original generated cloud art, LEE and
honest resource percent; do not add a fake progress animation.


## Fixed morning, 2026-10-20

The latest user correction removes the four-minute day/night cycle: evening felt
frightening. Keep the LIVE WORLD at 09:00 with bright, soft morning sky, sun,
hemisphere, exposure, environment, baked bounce and water sunlight. Apply the
morning preset once; neither time passing nor restart should make it evening.
Cloud drift and the separate loader parallax still move naturally. All other
portfolio/ending features below remain. This supersedes all time-cycle rules.


## Final handwriting, compact tablet and a four-minute day, 2026-10-20

Latest user corrections supersede the previous font, timings, full-viewport PROFILE,
loader wind, music bed and fixed sunset below. Reveal the farewell three times faster:
Korean 4/3 seconds, English 1 second with a .3s delay. Use the unchanged SIL OFL
Nanum Pen Script and Allura sources to generate readable outline/medial-pen SVG;
keep the exact original two bilingual paragraphs and their separate exits. Final
screen adds '함께할 여정을 기다립니다' above the one-line phone/email row, with
restart at lower center. Preserve keyboard focus using its underline, no rectangular
focus ring. The independently stored house ending images stay sharp, untinted and
unblurred; Clear still blurs the MOVABLE live world before the first paragraph.

PROFILE alone remains black/white. Center its 1120x640 maximum reader, 362x620 at
390x844, reducing empty viewport space. Keep all content, tabs and real four-corner
prop-to-reader homography, wake line and reverse motion. profile-screen-compact.png
is a cropped 1100x620 capture of the actual display; use full texture UVs. Project
mockups alone float +/-6px over a 5-second cycle, static with reduced motion.

Use cloud-reverie-soft.wav: shorten/quiet the continuous low bed while retaining
sparse upper bell notes, independent volume sliders and underwater filters. Keep
older audio assets intact. Loader keeps its existing original cloud artwork/LEE/
actual percent, subtle smoothed mouse parallax and continuous left-to-right cloud
advection. Crossfade two forward-moving crops at invisible wraps; never reverse
wind. Dispose pointer listeners and GPU resources, with static reduced motion.

Smooth the wall's old height-based brightness step over 2.2 world meters. Keep
canopy fill even from left to right, natural greens and lush leaves, but grow flower
clusters every fourth node rather than every third. Chain shader hooks; do not
overwrite the canopy-fill shader when installing the foliage-light filter.

The live 3D world starts at simulated 14:00; ten visible real seconds advance one
hour, with a seamless 240-second day. Smooth sky, moving sun, hemisphere, exposure,
environment intensity, baked bounce and water sunlight together. Keep warm interior
fixtures at night. Time continues while reading; hidden documents suspend it.
Generate the environment map once; never rebuild PMREM per frame. Restart resets
14:00. This cycle does not recolor the separate static ending photograph.


## Continuous farewell ink, compact contact and a dreamy cloud journey, 2026-10-19

Latest user correction supersedes the older 18px contact rhythm, 760px reader,
per-character outline animation, centered restart-only screen and procedural
mountain loader below. Keep the contact paper's 760:519 proportions and its
single pierced silver ring, but cap the live reader at 680px and use 26px gaps
between the vertically stacked Mobile, E-mail, GitHub and Velog rows. Tighten
the surrounding paper padding; retain all legal copy and social hover behavior.
The physical SVG must match the live layout. PROFILE ALONE uses black (#080808)
and white content. The user explicitly clarified that the framed project
readers stay light. Keep photo and colored skill icons intact; update the
physical tablet screen capture to match the new dark reader.
Farewell text must be actual continuous pen-stroke reveal, with no whole-glyph
pop/fill/stagger. Trace each locally licensed font's medial strokes into one
length-weighted continuous timeline, masking the original sharp glyph outlines.
Keep exactly one paired paragraph at a time and the movable Clear/depart phase.
After both paragraphs disappear, display the phone and email side by side in
ONE centered horizontal line; place restart separately at lower center. Keep
this one-line arrangement on phones, native dialog focus and reduced motion.
Loader background follows the user's Cartier screenshot: sage/teal upper sky,
cream afternoon light, peach/blush clouds, lavender lower shadows and low distant
mountain ridges, with no Cartier words/UI and no moon/planet. Use the original
generated environment cloud-journey.webp on separate drifting 3D banks, bounded
resolution, proper GPU disposal and static reduced motion. Original liquid LEE
and actual loading percent remain. Future loader changes must not alter the
independently stored house ending images. Cloud Reverie is a new original
96-second stereo ambient score with slow pads/bells and diffuse reverb; preserve
music/action volume preferences and the existing strong underwater filters.
Do not substitute or copy Cartier's recording; the reference page did not finish
loading in the available browser, so its audio was not auditioned.

## Vertical contact, movable Clear and an afternoon cloud loader, 2026-10-19

Stack Mobile, E-mail, GitHub and Velog vertically with one steady 18px spacing
rhythm. Align icon/text columns, retain the paper's 760:519 silhouette and all
contact/legal copy, and update the physical printed SVG as well as the reader.
After all quests, Clear must be NON-MODAL: allow WASD, mouse look and phone
movement/actions through the blurred world until the first farewell paragraph.
Hide other HUD, disable content/seat activation during this interval, then pause
and make the world inert only when the first paragraph starts. Keep music and
water muffling continuous. Restart restores all navigation, cues and counters.
Show exactly ONE paired Korean/English paragraph at a time. Draw glyph outlines
and fill them in a staggered writing motion; let the first paragraph disappear
fully before writing the second. Once both disappear, show only a centered
'다시 시작하기' action. Preserve accessible text and reduced-motion sequencing.
Replace ONLY the loader's house scene with actual procedural 3D: a warm afternoon
sky, naturally drifting volumetric cloud sea, a rocky ridge right of center and
a small low moon on the left. No night/stars/large upper-right planet. Fill the
upper sky with moving high clouds; retain the original LEE liquid mark and real
resource percentage. Use bounded render resolution and cleanup all GPU resources.
The existing house ending images remain independently stored in assets/ending.


## Preserve the opened contact note dimensions, 2026-10-19

Removing the farewell must not shrink the opened paper. Keep the original
760:519 note format from the physical cover turn through the live reader,
with 760x519px at normal desktop sizes. Fit the same ratio within narrow/short
viewports, reserving room for the ring. Center the phone/email/social group
vertically inside the paper; keep CONTACT and the close button above, and
legal text/divider below. The note must not use content-driven height. Keep
all details, silver binding and reverse closing motion. Small screens scroll
inside the fixed paper instead of stretching it. Match the physical printed
SVG's contact positions to the live reader.


## Flowering ceiling gardens and a quiet ending, 2026-10-19

Both house ceiling rims should have lush, overlapping greenery, unequal trailing
stems and small full-bloom clusters in cream, pink, lilac and soft yellow. Keep
existing scanned ivy; the supplemental connected growth uses garden-layout.json
and FloweringCornices.js, four static instanced draws and genuine leaf shadows.
Preserve clear rooms, circulation, white soffits and the house's warm oak bands.
The narrow courtyard perimeter wall COPINGS in the user's second/third images
must stay the original reflective BLACK. Roof height alone cannot identify oak:
restrict it to the actual house footprint. Keep native material assignments and
the retarget/generator selections consistent without touching topology or UVs.
Move the paired Korean/English farewell out of Contact, including its physical
printed face, into a restrained ending. Keep phone, email, socials and legal.
After profile, EVERY actual project and contact are viewed, let the final reader
close before the ending starts. Briefly show the finished quests, lock all scene
input, gently blur the world and DRAW a cursive Clear with real SVG pen strokes.
Dissolve slowly to the CURRENT loader's desktop/mobile house photographs (kept
independently in assets/ending so a later loader change cannot replace them), show
the existing four farewell lines in order, then offer a quiet restart. Do not
change the existing LEE loader. No game banners, confetti, score or victory SFX.
Restart must clear all quests/cues, close any reader, cancel routes/posture/water
state and restore the starting view and controls, while retaining sound choices.
The ending must also work when quests are folded and with reduced motion. Keep
music mounted throughout; focus stays inside the ending until restart is ready.


## Strong submerged piano, timber bands and right-center phone quests, 2026-10-19

The user could not hear the previous music muffling. Follow Tidewater's steep
cascade approach: every BGM sample must traverse two low-pass filters (260Hz
and 364Hz when submerged, 20kHz above), with a .34 immersion gain and quick,
smooth transitions. Preserve chosen music/action levels and uninterrupted
playback. Verify the actual running input/output spectrum, not only mock
parameter values; restore full tone on surfacing. Keep waves excluded.
Both exterior ceiling bands/fascias now use the original warm oak grain,
including the lower balcony lip and upper roof rim. Retain white soffits and
all other existing finishes. Share one textured oak trim material; preserve
geometry, both UV channels and baked lighting. Update the saved native source
and generator as well as the runtime's precise material selection.
The user corrected mobile quests to RIGHT vertical center. Use a 22px right
inset, right-aligned copy, common vertically centered icon column and the
existing <=768px breakpoint. Keep desktop's visible 21px right gutter.
Use a compact water-exit button below the auto-run shortcut on phones up to
800px high so it stays clear of centered quests. This supersedes the left
mobile position and previous black exterior bands.

## Center-left phone quests and submerged sound, 2026-10-19

Halve the desktop quest's visible right gutter from 42px to 21px (6px outer
inset plus its reduced internal right padding), preserving its text measure. On phones
(<=768px) place the quest list at the left edge with 22px breathing room and
center the whole list vertically; align its text left and retain the common
vertically centered icon column. Preserve desktop heading/fold and scan cues.
Replace the mobile ellipsis shortcut with a custom running-person/speed-line
icon for destination auto-run; show its active state while guidance runs.
Use a speaker icon for the BGM-adjacent volume disclosure. Provide independent
saved 0–100% music and footstep/action controls. The action setting applies to
walking, running, jump, landing and crouch, including sounds already playing;
water keeps its separate mix. Start at the approved existing levels.
When the listener's head submerges, smoothly muffle the same continuing BGM
with low-pass filtering and a restrained lower tone; restore it at the surface.
Water movement/entry/exit should sound slightly deeper and heavier, retaining
the close flowing recordings without waves. Keep physical triggers and cleanup.
On short phones, use a compact water-exit button so its help cannot cover the
new quest position. This supersedes the upper-right mobile quest list and the
single-slider disclosure described below.

## Crouch toggle and individual sound levels, 2026-10-19

Use C to toggle crouching: key release, blur and temporary help/detail pauses
must keep the posture until the next C. Ignore key repeat and typing/range
inputs. The mobile crouch button shares this latch and shows its pressed state;
reset returns to standing. Keep separate E/Space bench/sofa seating unchanged.
Latched crouching also limits destination guidance to crouch speed.
Reduce walk/run/landing gains by another 50% and double entry/swim/exit water
gains relative to the preceding .21 effects master, keeping the close trickle
recordings, action levels, triggers and pause/reset cleanup intact.
Keep BGM's existing on/off button and first-gesture playback. Add a compact
volume disclosure next to it, with a labeled 0–100% slider, numeric percentage
and saved local preference (28% initially). On desktop it opens above; on
phones below the top-right BGM control. Preserve the approved HUD positions.
This supersedes held Ctrl crouching and uniform effects levels below.

## Quieter effects and close flowing water, 2026-10-19

Keep BGM unchanged and reduce all movement/action/water effects by 50% from
their previous master gain (.42 to .21). The user prefers Tidewater's close
water entry and movement recordings, with a gentle trickling/gurgling flow.
Use quiet CC0 hydrophone/water-drop excerpts with soft edges and restrained
levels. Exclude surf/wave ambience, heavy bass splashes and synthetic water
thumps. Keep the existing physics triggers, pause/reset behavior and credits.

## Immersive controls, sound and exterior trim, 2026-10-19

Bring the desktop quest tracker nearer the right edge (12px panel inset),
retaining breathing room. Move mobile quests down only 14px, to 106px plus the
safe area. On phones use one cohesive circular direction pad with dragging,
diagonal movement and release/cancel cleanup. Place it and run/crouch/jump low
on the screen. Move the four destination shortcuts into a vertical-ellipsis
disclosure just below the control guide; desktop destination controls stay put.
Hide the native mint cursor while a mouse is held on the scene for looking,
restoring it on release/cancel/blur. Initially focus the reader container so
the first opened object's X has no extra focus ring; retain keyboard focus cues.
Unviewed blue outlines must fade in slowly from fully invisible and fade fully
out, including every glow layer, with a quiet gap. Reduced motion stays steady.
Show a small light GYU mark centered on the off tablet, including after closing.
Use the existing reflective black finish for both the ground exterior ceiling
band and upper roof fascia, keeping white soffits, columns and floors intact.
Keep BGM wanted by default: attempt first-visit playback, retry automatically
on the first gesture if the browser blocks it, and retain the BGM off control.
Add original, restrained stone footsteps/run impacts, jump/landing and cloth
crouch sounds, plus distinct swim/entry/exit water sounds. Trigger them from
real displacement/physics, silence paused/hidden scenes and clear them on reset.
Preserve the approved readers, content, reversible motion and native geometry.

## Subtly rounded exhibit corners, 2026-10-19

Give the landscape oak frame approximately 12px rounded outer corners in the
reader. Share a 1%-of-width radius with the actual hanging/moving frame so its
silhouette stays consistent through approach and return, including phone sizes.
Keep the inset white mat, dimensions, layout and reversible movement unchanged.

## Fixed landscape frames from wall to reader, 2026-10-18

The user explicitly chose landscape frames matching the approved gallery
reader. Rebuild all six physical frames and their printed mats in the same
logical 16:10 outer format, retaining the existing wall centers and clear separation.
Use one shared rim width and format for the world frame and reader. The live
reader must follow the actual physical frame corners all the way to its final
pose and back; never stretch a portrait print into a viewport-shaped dialog or
add an independent expansion after the physical approach. Keep the visitor's
camera/body fixed, all original content and links, native room and lighting,
and restore every frame on close/cancel/reset. Phones keep the same landscape
silhouette with readable 16px copy, internal scrolling and reading panes.
Preserve each frame's actual world-space dimensions through its flight,
compensating the room's affine parent when turning its face square to the
viewer. Match the reader to that physical aspect; pixel-align only the final
subpixel rounding so settled text remains sharp. Restore its original matrix
and automatic-transform flag on every return/cancel/reset.
This supersedes the portrait hanging size and freely sized reader envelope.

## Framed exhibition reader, 2026-10-18

The project introduction content is approved, but the dark full-screen website
presentation does not fit the physical frames. Continue the lifted oak frame
into a restrained white gallery mat: large original artwork on the left,
caption on the right with its logo, tagline, description, three metadata rows
and every original link. Use a single thin oak outer frame, black readable
type, fine dividers and underlined links. Keep the actual room visible at the
edges. On phones retain introduction/information/design panes in the same
white framed treatment, including an artwork preview in the introduction.
Preserve all six original projects and data/assets, next/previous progress,
focus/Escape and the exact reversible physical frame movement. This supersedes
the original dark background, neon introduction badge and floating mockup in
the project reader only; profile, contact and the room stay approved.

## One silver ring genuinely threaded through the note, 2026-10-18

Use the elongated physical ring from the user's first attachment throughout
opening, reading and closing, with the neutral silver finish of the second.
Do not swap it for a separate corner-loop illustration. The same torus geometry
must supply the scene mesh and projected reader metal, with matching perspective
at the handoff. Its front leg crosses a real paper punch and its return passes
outside the top edge. Split the reader ring at the paper plane: rear metal is
covered by the sheet except through its transparent hole, front metal remains
above it. Keep a subtle punched-paper edge, readable heading and the same ring
profile on phones. Preserve the Letter cover, complete back fold, content,
links, pen cup and other scene assets. This supersedes the independent SVG loop.

## Complete cover fold and Letter title, 2026-10-18

The user rejected a cover that appeared to stop partway behind the note and the
tall oval binding left in the reader. Turn the cover all the way beneath the
paper stack, leave a visible completed pose before expanding the reader, and
reverse that exact movement on close/cancel/reset. Keep one small shaded metal
loop visibly threading the upper-left corner without overlapping CONTACT, on
desktop and mobile. Add only "Letter" to the closed cover in refined script,
with a restrained warm gold foil finish, like a book title. Lift the closed
cover into view before turning it, so the outlined title can be seen. The title
travels with its physical cover; retain the clean white reader, all content and
the filled pen cup. No native architecture or lighting changes are needed.

## Ring-bound contact notebook and filled pen cup, 2026-10-18

Undo the previous paper grain, inset frame and layered card finish, restoring
the clean white contact page with all its existing content and selective links.
Replace the business-card prop with a small notebook, initially covered, with
one metal ring through a real upper-left punch. On nearby E/click the cover
turns around the ring before the contact page continues into its live reader.
Closing reverses the same motion and closes the cover on the desk. Cancellation,
Escape, reset and reduced motion must restore the prop and standing pose without
late completion. Keep the same contact progress ID, but call the object
"연락처 노트" in quests, hints and the guide. The reader retains one small binding
ring, plain white background, black text, minimum 16px copy and clear room backdrop.
The restored contact capture supplies the unchanged page; binding and cover are
separate geometry/decorations rather than printed into that face.

Make the upper writing desk's existing ceramic cup genuinely hollow, including
an inner wall, open mouth and recessed bottom. Place exactly three distinct
writing tools inside it, with modest varied lean. Build the vessel and tools
in the native furniture source and regenerate its matching indirect lightmap
and sharp runtime architecture together. Preserve all other furniture, lighting,
navigation, profile/project readers and queued completion scans.

## White contact card with readable copy and selective links, 2026-10-18

Use a white card and black text, retaining the 760px desktop width and the
transparent backdrop showing the actual room. Remove its header eyebrow and
header separator, and show CONTACT in capitals. Remove the inner contact-details
heading entirely; do not display CONTACT or GET IN TOUCH there. Keep 24px of
space before the contact section, lifting the details slightly while keeping
them comfortably separated from the bilingual introduction. Every visible
contact string, including English translations, labels and legal copy, must
be at least 16px.
Render Mobile and E-mail as plain non-interactive details; only GitHub and
Velog retain their original external URLs, with clear underline/lift hover
and keyboard-focus feedback. Extend the rule above the legal copy across the
card's full inner width. Keep the remaining wording and preserve close/Escape
and prop motion. Refresh the physical white card's capture, UV crop and aspect
ratio to match the final reader. This supersedes the black contact face and
its phone/email links; preserve other UI, including completion scans.

## Restore the completion scan on desktop and mobile, 2026-10-18

Sweep a brief white scan from left to right across each newly completed
progress row on both desktop and mobile. Retain the circular completion
check and icon pop, with a separate animation name so that the shorter icon
effect cannot clear the pending row scan. Queue the sweep until details,
camera presentations and control guides are closed and the tracker is expanded;
a collapsed desktop list must not consume it. Replay only an interrupted
pending sweep, never an already viewed completion; reset clears pending scans.
Respect reduced motion, transparent rows and the approved 768px breakpoint,
desktop folding header and mobile list-only placement. This supersedes the
former icon-only completion animation and removal of the row sweep.

## Emphasized UI/UX role, 2026-10-18

Make the profile's UI/UX role a clear typographic accent: 20px/28px on desktop,
18px/27px at 768px and below, semibold 600 and #121212. Keep its wording,
word-preserving wrapping and placement at the portrait's top, retaining the
existing bottom-aligned identity values. Refresh the physical tablet capture.

## Role beside the portrait and an uninterrupted header, 2026-10-18

Remove the profile header's bottom separator. Move the existing UI/UX role
from below PROFILE into the identity card's right-hand text column, aligned
with the portrait's top edge. Keep Name and contacts aligned with its bottom
edge, the centered 80% portrait, Urbanist English, semibold labels and 16px
minimum copy. Give the desktop top cards enough height for both text groups.
On compact phones keep the role beside the portrait and contacts readable
below. Refresh the matching physical tablet capture. This supersedes aligning
the role with the PROFILE heading; other details and motion stay unchanged.

## Centered 80-percent portrait and bottom-aligned identity, 2026-10-18

Size the profile portrait to 80% of its available identity area height and
center it vertically, retaining its aspect ratio and the approved copy gap.
Use semibold 600 for Name, Mail and Phone to distinguish these labels from
their values. Align the identity text block's bottom exactly with the portrait's
bottom edge, rather than the card's floor. Retain the readable compact phone
arrangement. This supersedes the former
full-height portrait and vertically centered identity text. Keep all profile
copy, typography and other sections, and refresh the matching physical
tablet screen capture at 1280x720 without changing its UV crop or motion.

## Airier profile and Urbanist English, 2026-10-18

Use the locally hosted Urbanist for English throughout the profile tablet,
with Atelier Sans for Korean fallback. Remove only the profile header eyebrow
and display PROFILE in capitals. Align the UI/UX role's left edge with that
heading at every breakpoint. Increase the four desktop skill rows to 24px
vertical gaps and widen the portrait-to-copy gap to 28px (16px on phones).
Retain readable responsive spacing, minimum 16px copy, the existing portrait
height, white cards, tabs, content and physical tablet animation. Refresh the
matching 1280x720 desk screen capture; leave other readers and the HUD intact.

## Profile portrait, headings and aligned history, 2026-10-18

Remove the displayed two-line introductory sentence, retaining the original
source data and role. Normalize the identity field label to "Name", removing
"Profile NAME". Fill the available identity content height with the portrait,
retaining its aspect ratio where space permits and using a responsive phone
photo area. Use #121212 for category headings and identity labels, and add a
24px gap below SKILL MATRIX. Put education and achievement dates in a shared
left column with their original content on the right, like the certificate
rows; wrap complete month/year groups on phones. Retain the minimum 16px
profile typography, all original fields, tabs and full viewport tablet. Refresh
its matching physical screen capture. This supersedes the visible intro and
its comma-break requirement below; other UI, content and motion stay approved.

## Readable profile typography, 2026-10-18

In the profile tablet, insert a real line break immediately after the first
comma in the existing introduction. Keep all copy below it at least 16 CSS
pixels, including role, section headings, identity labels/English name,
contacts, skills, dates, education, certificates, awards and section-tab labels.
Preserve the original data and white bordered cards. Keep the full tablet
viewport, using the existing section tabs below 1200px wide or 720px high and
readable skill columns on phones. Allow an individual card to scroll only
where a very small viewport cannot fit enlarged copy; never shrink the font
or clip content. Refresh the matching physical tablet face at 1280x720 without
changing its UV crop, animation, project details, contact card or world HUD.

## Project frames lift off the wall, 2026-10-18

For artwork E/click, move the complete existing frame root (oak rim, backing
and print) off its wall toward the visitor and turn its face toward the camera.
Keep the visitor's camera/body fixed for projects so the frame itself visibly
travels. Fit the held portrait frame to both desktop and phone fields of view,
then continue the existing projected-corner handoff into the fullscreen reader.
Close/Escape reverses the same frame movement and returns its exact position,
rotation, scale and visibility on every exhibition wall. Cancel/reset must
restore it without a late open. Preserve the approved tablet/card animation,
project content, room lighting, navigation and native assets.

## Continuous prop-to-reader approach, 2026-10-18

E/click on the profile tablet, project frames or contact card must carry the
actual object continuously toward the screen. Mount the live reader during
the same scene timeline, match its four corners to the prop's projected plane,
and grow that plane into the existing final reader bounds. Do not replay a
separate dialog arrival/scale animation or restart the tablet's center-line
wake. Keep camera motion continuous, drive transient DOM styles directly from
the scene observer without per-frame React state, and credit viewing only when
the reader reaches its final pose. Close/Escape reverses that same path until
the prop, visibility, power, camera and body are restored; cancel/reset must
never deliver a late open. Retain reduced motion, resize/phone fit, focus and
links, all existing profile/project designs and the transparent contact backdrop.
No native assets, lighting or physical routes change for this transition.

## Compact desktop tracker, custom mobile tracker, 2026-10-18

Label the artwork progress row "작업물 감상하기" on both desktop and mobile.

Above 768px, retain the exploration styling from 50fa383 with a narrower 224px
panel, anchored 28px from the right. This removes 48px of heading space and
moves the heading and all progress rows 48px right together. Retain
14px panel padding, the fixed heading with 16px insets and minus/plus button,
and left-aligned progress copy beside a shared leading icon column. Use 16px
list left padding on desktop so the icon edges align with the heading text.
Keep
the transparent rows and faint heading gradient. Scope the custom flush-right
copy and subgrid columns to mobile only. At 768px and below, preserve the
approved list-only layout, 12px icon gap, vertical centering, right-edge inset,
top-right restart/BGM and lower touch controls. Keep responsive fold behavior.
This supersedes applying the mobile tracker alignment to desktop.

## Desktop exploration heading, mobile list only, 2026-10-17

At viewport widths above 768 CSS pixels (769px at whole-pixel widths), restore the exploration heading,
overall count and circular minus/plus fold button, with 16px heading insets
and the faint bottom gradient. Anchor the heading when folding the list.
At widths of 768px or less, retain the approved right-aligned list only, with
centered icons and the 12px column gap. The JS media subscription and CSS must
share this exact boundary, using (width <= 768px) for the mobile layout.
A desktop-collapsed list must become visible and
accessible immediately on mobile; preserve the desktop fold choice on return.
This supersedes the global removal of the heading and fold controls below.

## Right-aligned, list-only exploration progress, 2026-10-17

Show only the three transparent progress rows with their real counts and
completion marks. Remove the exploration heading, overall total, fold button
and collapse state. On mobile, anchor the list at the top right below restart
and BGM, using the same safe-area and short-screen scrolling behavior. Align
each row's title and description flush right, with its leading mark and copy
group packed against that edge. Share the icon and copy grid columns across
all three rows, keeping every circular mark vertically aligned with the top
row's mark while the text stays flush right. On mobile, vertically center each
mark and its two-line copy within the row; remove the mark's desktop top offset.
Use a 12px mobile column gap to move only the icons 4px farther left.
Keep only an 8px mobile / 18px desktop text
inset from the screen, in addition to mobile safe-area insets. Keep
the other mobile controls and desktop tracker position as approved. This
supersedes the heading and folding requirements below.

## Mobile controls at the screen edges, 2026-10-17

On screens up to 768px wide, keep the guide at the top left and move restart
and BGM to the top right. The transparent progress list now sits below these
top-right controls, without a heading or fold button. Lower the direction pad
and action row into the space above the
bottom destination buttons; keep their captions and contextual actions clear.
Respect safe-area insets and use a scrollable tracker on short screens. Keep
the approved desktop placement, real input handlers and all 3D assets intact.

## Square drain finish and pool-instruction wrapping, 2026-10-17

Build the pool center drain frame as one continuous closed square rim, retaining
its .335 outer size, .285 opening, graphite finish and nine existing grate bars.
Its four corners must be fully joined, without the old shortened-bar notches.
Rebuild the native/runtime architecture and indirect map without changing other
geometry, lighting budgets, entrance-triggered library lights or pool physics.
In the swimming status, force a line break after 이동하면 and keep 올라올 수 있어요.
together on the next line, preserving the circular exit button and existing UI.

## Entry-controlled, steady upper-library lights, 2026-10-17

Use the real opening between the upper closure wall and right column as the
library light threshold. Turn the room lighting on immediately when the body
crosses inside; return to the existing ambient appearance on the balcony/rail
or stair side. Keep a .42 logical-meter rail strip outside the lit room and
only .035m exit hysteresis to avoid boundary flicker. Jumping, sofa seating,
looking around and content-camera motion must not switch room occupancy.
While occupied, pin the existing four interior sconces and both ceiling/shelf
area fills. Distance ranking and reduced graphics quality must never drop or
replace either room area light. Outside, omit the switched shelf fill and
interior point lights, preserving baked ambient, line/shelf faces and daylight.
Keep four point/two area GPU slots and use a short intensity fade on source
changes. Do not rebuild native models or lightmaps for this runtime change.
Preserve clear ceilings, the approved room brightness, all UI/content/physics.

## Clear ceilings with preserved room illumination, 2026-10-17

Remove all four round bronze/opal ceiling fittings and their discrete emitters
from the two ground rooms and upper library. Do not restore hanging fixtures.
Keep their former footprints as continuous satin ceiling, with the existing
recessed lines and panel/rib details. Spread their bake power and live emitted
energy across the existing linear and broad room illumination, preserving each
room's approved warm brightness, softer studio and readable upper furniture.
Calibrate the studio's broad live light to 90% of the flux-equivalent total:
wide sources reach its walls more efficiently than the removed round fitting.
Keep accent-projector cones off the right room's finished ceiling so bright
petal-shaped patches do not survive after their round fittings are removed;
preserve projected foliage on walls/furniture, sunlight and environmental light.
Retain the four-point/two-area runtime pools, content, physical routes and plants.
Rebuild and denoise the native indirect map and sharp runtime architecture.
Run tools/check_clear_ceilings.py on native and runtime geometry and compare
actual room brightness before/after in the browser. This supersedes the round
fittings and their four local light sources in the following section.

## Matching flush round ceiling lights, 2026-10-17

Use four identical shallow bronze/opal round fittings: one above the left
studio, two at the right atelier's former light pools, and one in the upper
library. The library fixture now mounts against the ceiling, without a stem.
Replace the studio's former hanging cylinder and unmodeled amber fill with
its flush round light. Every housing touches its true ceiling plane; rotate
the rear atelier fitting and emitter together to follow the roof pitch.
wall-decor.json roundCeiling/ceilingFixtures share the mount, exposed opal
underside, hollow rounded bronze lip and light origin across native geometry,
Cycles baking and runtime. Emit immediately below the opal face and downward,
without floating point lights or the former solid rim hiding the diffuser.
Keep each round housing clear of the linear channels and ceiling ribs; the
library fitting is on a clear satin field at x=-.25, z=-.15. Exempt Ceiling_Opal from the upper
furniture dimming mask so actual light faces stay visibly lit.
Retain the existing four-point/two-area live pools, line lighting, softer
studio, readable upper furniture, stable atelier ceiling, content and movement.
Rebuild native architecture, indirect light and its sharp runtime derivative;
keep garden/tree assets unchanged. Run tools/check_ceiling_fixtures.py on both
native and runtime geometry to verify actual face/rim/ceiling ray hits.
This supersedes the suspended upper pendant, hanging studio light, small right
ceiling spots and separately placed central point-light glows.

## Original website projects and center-line tablet wake, 2026-10-15

Restore project details from their exact originalHtml and the original project
CSS at 60c47cd:css/style.css. Each of the six original *_bg.png backgrounds is
restored byte-for-byte from that commit, with the original 10px backdrop blur,
50% black shade, transparent white logos, intro badge, copy, metadata, pill
links and floating mockups. Scope these styles to the project reader, retain
full viewport sizing, real carousel progress, focus/close behavior and compact
intro/info/artwork panes when space is limited. Keep other monochrome UI.
Profile boxes use the same white as the tablet display, retaining only their
subtle borders. Refresh the matching physical screen capture after this edit.
Both the actual desk tablet and its expanded display wake with a horizontal
center line, briefly hold the full-width line, then reveal upward/downward.
Keep reversible power-off/cancellation/reset, phone fit, reduced motion, and
the contact card's transparent backdrop. This supersedes the redesigned white
project reader, dark logo tiles, gray profile boxes and simple opacity wake.

## Matching physical tablet and contact card, 2026-10-15

The left studio desk now holds a thin landscape graphite tablet, initially
powered off. E/click lifts it toward the visitor and smoothly powers its screen
before revealing the existing full profile UI. Close, Escape during approach,
and reset must turn it off and restore the exact prop/camera/body pose. Keep
same-floor, unobstructed proximity checks and reduced-motion support. Update
visible book references to tablet. The upper desk's contact card shares the
black Contact detail design, content, font and proportions. Its dialog backdrop
is transparent, preserving the original 3D space behind the black card.
DeskObjects.js uses lightweight captured DetailView faces in public/assets/desk,
with UV crops from their 1280x720 screenshots. Refresh these captures when the
corresponding detail design/content changes; retain all original profile and
contact content and live links in DetailView. No runtime DOM rasterization,
per-frame React updates, native house rebuild or lighting changes are needed.
This supersedes the physical hinged profile book, old white printed card, and
the Contact dialog's full black backdrop. Other fullscreen UI remains approved.

## Fixed exploration heading and viewport-sized details, 2026-10-15

Anchor the transparent tracker by its heading position, without translating by
the changing panel height. Minus/plus toggles only the grid-folded list beneath
it, keeping the title/button fixed and 14px horizontal panel padding. Preserve
the faint heading gradient, real progress and completion marks.
Use the locally hosted Atelier Sans variable font, a renamed Pretendard subset,
for Korean and Latin UI/display copy. Keep its OFL and source notice. Rebuild
public/fonts/AtelierSans-Variable.woff2 with tools/subset_ui_font.py and the
official upstream WOFF2 whenever adding content characters; retain sans-serif
system fallbacks, font-display swap and no remote font requests at runtime.
DetailView.jsx preserves original profile section HTML, artwork assets,
descriptions, metadata and every external link. The profile is a nearly full
viewport tablet with its five original sections; smaller screens use circular
section tabs rather than pushing content below the screen. Artwork fills the
viewport with one original project at a time, previous/next controls and mobile
intro/information/design panes. Keep the introduction available on short
screens too. Mark projects when actually opened, and retain dialog focus,
Escape/close behavior and the original physical prop presentation. The contact
card keeps its 760px scale, with a clean black face and white/gray details.
Do not change 3D geometry, lighting, movement or native assets for these UI edits.
This supersedes serif/Cinzel UI fonts, book-shaped profile details and scrolling
project/profile pages.

## Circular monochrome portfolio controls, 2026-10-15

Use circular icon buttons with small captions below for guidance, reset, BGM,
destinations, contextual E actions, touch movement/actions, pagination, dialog
close, swimming exit and load retry. All controls use neutral black/white,
subtle borders and existing serif/Cinzel typography; retain accessible names,
focus, press/disabled states and all original actions. Use the existing bundled
Cinzel font for display text; do not add remote fonts or per-frame React work.
The right-middle tracker is titled "둘러보기" instead of "퀘스트". Its panel
and content rows are completely transparent, without blur or completion sweeps.
Only the heading has a very faint black gradient at its bottom. All three
incomplete marks use the same circle with three dots; completion switches to
a black check in a white circle. Retain real counts, collapse/expand and the
short completion-icon animation, clearing pending scans when it ends.
On phones, place touch actions in one horizontal row and keep circles/captions
clear of the tracker, contextual E action and bottom navigation. This supersedes
the brown/ivory rectangular controls and forest/gold quest panel. Preserve all
portfolio content, geometry, lighting, cursor, loading motion and navigation.

## Stable right-room ceiling under nearby fixtures, 2026-10-15

The right ground atelier's satin ceiling and fitted cornice retain their warm
baked finish when entering the room. Camera-ranked point/area lights must not
double the irradiance already baked into those surfaces. ceilingLighting.js
masks only their local point/area contribution in the ground atelier footprint,
using the inverse shared affine world transform. Include the slightly pitched
rear ceiling above upperFloor, while excluding the veranda, studio and upper
library. Preserve directional sun, projected foliage, environment, baked bounce,
emissive fittings, timber and furniture lighting. Retain the existing four-point
and two-area pools, geometry, materials and rendering passes; no extra lights,
timers, shadow maps or native rebuild are needed for this shader correction.

## Shared ceiling appearance and fitted atelier cornice, 2026-10-15

Both stories use White_Satin_Ceiling with real baked bounce, without the upper
ceiling's former hard minimum diffuse fill. Check the actual OUTDOOR starting
view as well as the upstairs close-up; retain the .58 upper furniture gain and
unlit contact card. The right ground atelier has one continuous closed recessed
shell, including the existing linear and spot apertures and rear pitch break.
Its five timber wall runs retain their placements and slats, with one fitted
U-shaped cornice using shared miter sections at entry bends and rear corners.
Follow the exact ceiling pitch at z=-3.4, bury the top 8mm in the soffit, and
remove separate overlapping cornice bars and touching ceiling patch boxes.
Retain the planted roof edges, flush west roof, black courtyard coping,
classical columns, dimmer studio, fixture energy and collision heights. Rebuild
architecture, baked light and sharp runtime derivative only; no new materials,
light groups, effects or reflection passes. This supersedes the upper ceiling
diffuse-fill exception and the right atelier's patch-box ceiling/molding ends.

## Flush roof, black closure coping and planted ceiling edges, 2026-10-15

Restore only Upper_Closure_Aligned_Coping to the existing graphite exterior
finish, continuous with the adjoining courtyard caps. Keep the broad library
roof fascia ivory. Clip the roof shell and fascia exactly to the west exterior
wall's inner plane, including the former 6mm rim overhang. upperRoof in the
shared space layout controls this footprint, frame and shallow ceiling ribs;
navigation uses those actual underside heights and the shared light channels.
Match the ground ceiling reference with a white perimeter frame and shallow
longitudinal/transverse panels. Split rib joins and recessed-light crossings
to avoid coplanar overlaps. Use three evenly spaced library linear fixtures
with the former two fixtures' combined power/intensity, retaining existing
live light groups, pendant, reduced furniture radiance and softer studio.
Add connected trailing ivy rooted in slim soil channels along the roof front
and exposed stair-side return. Append it after existing native garden leaves,
sharing original photographic UVs, four leaf materials and one stem material;
preserve the original garden placements and existing sampling budget. Keep tips above the
upper eye line, the lower balcony planting and all six classical columns.
Batch the small roof cornice into one cullable group per existing material,
rather than duplicating its five draws in every garden cell; retain spatial
culling for the surrounding wall and ground planting.
Rebuild native architecture/garden, baked lighting and sharp derivatives. Keep
the garden under its existing 500k triangle limit, without new animated effects,
light groups or reflection passes. This supersedes the pale upper closure cap,
western roof overhang and plain two-line upper ceiling.

## Classical stone column moldings and softer studio light, 2026-10-15

All six facade columns have matching classical round head/foot moldings:
layered plinth, rolled torus and concave neck swept as closed hollow profiles.
Use the shaft's existing Ivory_Polished_Column material for every molding,
including its marble texture, tint and gloss. Bases and heads are .14m tall;
retain the approved centers, shaft diameters, .03m maximum border, buried wall
contact and conservative collision footprints. Keep twelve complete profiles
on the three columns per story, with no detached flat plates or dark bands.
The left ground studio uses studioFixtureGain .82 for its native/baked/live
ceiling strips, fill and pendant light. Its opal diffusers have a separate
shared Studio_Ceiling_Opal material at the same reduced emission; the removed
mineral collar material keeps the total architecture material groups unchanged.
Retain other rooms' lighting, original sharp textures, all content, the ivory
roof trim and continuous upper ceiling. Rebuild architecture and indirect light
without adding lights, reflection passes or animated effects. This supersedes
the plain mineral collar profiles and their contrasting color.

Use the same continuous closed recessed shell for the studio ceiling as the
upper library, following its existing slight rear pitch. The dimmer lighting
must not reveal patch-box lightmap seams across the studio soffit.

## Continuous upper ceiling and matching ivory roof trim, 2026-10-15

Match the upper ceiling to the ground floor's continuous warm-white satin
finish. Its genuine recessed linear channels remain; build one closed shell
with welded surfaces instead of touching patch boxes, avoiding separate baked
lightmap islands across the visible finish. Preserve the ceiling height,
thickness, fixtures, collision and upper furniture lighting.
Replace only the house roof fascia, adjoining upper closure coping, front
coping and narrow balcony soffit with the existing warm limestone material,
matching the bright balcony stone band in the latest reference. Keep courtyard
perimeter caps, rails and furniture metal unchanged. Share the existing facade
fill/material draw with the roof trim, retaining source textures and UVs.
Rebuild native architecture, indirect light and sharp runtime assets; no extra
live lights, textures, reflections or render passes.

## Reliable local preview, 2026-10-15

Use npm run preview for the local build at http://localhost:4173/. The preview
configuration explicitly binds localhost on port 4173 with strictPort, and
the script uses Vite's native config loader so it does not need a generated
node_modules/.vite-temp config file. Preserve the existing dist/client root.
Confirm the index, entry bundle and runtime model return HTTP 200; startup
output alone is insufficient when a previously restricted server times out.
Restart only an agent-owned stale preview process, retaining user processes.

## Round ivory columns, mineral collars and a usable library sofa, 2026-10-14

All six structural facade shafts are smooth 24-sided circular columns at
their approved centers and diameters. Their heads and hollow foot collars
are round, warm mineral ivory (Column_Mineral_Base), subtly darker than the
plaster wall, replacing the graphite square profiles. Retain aligned right
supports, the western wall contact, door jambs, roof fascia and rail geometry.
Use one shared collar material and existing textures; keep original sharp
runtime assets and the conservative navigation footprints. Rebuild native
geometry and indirect lighting for the round sections.
The upper white soffit uses the same warm ivory fill as the reference ground
facade. Exclude only that ceiling from the .58 upper radiance mask; retain
the furniture/card correction and all ground lighting, with no extra lights
or rendering passes and a distinct ceiling shader cache key.
The library sofa is jumpable at its actual cushion top (upper + .530m), with
real arm/back support heights and continuous gravity when leaving it. Keep
the outer-footprint support until the whole body clears the upholstery so
the apron cannot trap a descending visitor. sofa.js shares native dimensions,
support bounds, interaction proxy and seating poses. Allow E/click seating
from the clear front floor approach or after landing on the cushion; E,
Space, Escape and the stand control return safely to that upper-floor
approach. Preserve free look, pause/reset/guidance and the existing bench;
seating must not open content or mark a quest. This supersedes earlier square
black column profiles, the darker upper ceiling and the noninteractive sofa.

## Wrapping upper west collars and vertically aligned right supports, 2026-10-14

The upper west column's same-width dark plates left little visible surround.
Replace only its head/foot plates with hollow collars, .03m proud and .09m
high, clipping only their buried west edge at the existing wall plane.
Use shared upperColumnBase dimensions for their visible foot clearance.
Keep the west shaft's wall contact, height and position unchanged.
Place the right upper column at the exact x/z center of the approved right
ground support (stairFacadeTrim), including its existing .26m inset. Share
that position with navigation and actual-mesh diagnostics; the affine world
shear then preserves vertical alignment. Retain the right upper shaft size
and its original black profiles, central supports, roof, rails, oak, plants,
lighting and cursor. Rebuild native geometry, indirect light and architecture
runtime assets with sharp source textures and existing material draws.
This supersedes the upper-left same-width plates and the old independently
calculated upper-right position; keep all approved ground geometry unchanged.

## Reference mint cursor and clean right column edge, 2026-10-14

Use a hollow translucent neon mint cursor, matching the latest reference's
thin 1.65px ring. Remove the ivory/champagne accent and center dot; a restrained
cached mint under-stroke supplies neon presence without filters or blink.
Retain native 48px frames, one [24,24] hotspot, immediate loading coverage and
continuous spring hover/press/idle motion with the existing 25Hz limit.
The right lower column retains its .21m shaft, location and black collars.
Reduce only its broad .016m shaft bevel to a .003m edge break so the illuminated
vertical facet no longer reads as a separate line. Rebuild and bake native
architecture and restore sharp runtime textures with existing material draws.
This supersedes the pearl/champagne cursor appearance and right shaft bevel.

## Equal ground-column proportions and clear dark collars, 2026-10-14

The right ground support must match the central .21 x .21m stone shaft,
rather than reading as a thin .14 x .11m finish strip. Bring it forward to
inset .26m, following the timber-return wall so its black capital clears the
balcony band by about .02m. Replace the former hidden right ground support
with this single visible column; do not leave intersecting duplicates.
All three ground capitals are .27m square, including the wall-attached west
column. Ground foot collars have the same .03m border and .09m height, with
the stone shaft inside their open core; bury only the western wall-side edge.
Butt the west bed outer rim to the wider collar, accounting for its .025m
stone overhang, and share all column footprints with
navigation and actual-mesh diagnostics. Preserve upper columns, rails,
fixtures, planting placement, sharp textures and existing lighting. Rebuild
native geometry/baked light and sharp runtime assets with existing material
draws. This supersedes the narrow right pilaster and .014m collar border.


The square planter beside the western ground column physically hid its foot
collar. Move that planter and its centered tree together .25m back into the
studio, retaining their x, dimensions, height and relative planting alignment.
This necessary reveal supersedes preserving that one planter's z placement;
keep every other plant placement unchanged. Verify the actual exposed lower
black collar against all scene materials, not a black-only ray probe.



## Inset stair pilaster and wrapping ground-column feet, 2026-10-14

Set the slim right ivory pilaster .32m inside the balcony front, at the same
depth as the ground columns. Follow the existing timber-return wall plane,
keep its narrow proportions and extend it to the real veranda ceiling with
a matching small black head. Add a hollow graphite collar around its foot.
Replace the three ground-column flat foot plates with actual hollow collars,
.09m tall and .014m proud on exposed faces. Keep the stone shaft inside each
collar; leave the wall-attached western collar flush to the wall, without
coplanar stone/black outer faces. Share lowerColumnBase dimensions with the
pilaster footprint. Keep upper columns, planting, lighting, textures, rails
and all approved movement unchanged. Rebuild/bake native and runtime assets,
sharing existing material draws and retaining sharp source textures.
This supersedes the flush-front location and missing base below.


## Subtle ivory stair-facade pilaster, 2026-10-14

Add only a shallow .14m ivory stone vertical finish to the exposed lower-right
timber corner beneath the upper column. Share its footprint via stairFacadeTrim
in space-layout.json, keep it flush with the oak corner and end it at the black
balcony soffit. Retain the original structural columns, rails, fixtures, foliage
and approved lighting. Merge into the existing column material draw, rebake the
native geometry/lightmap and restore sharp runtime textures. Keep navigation
clear and avoid added lights, reflections or animation work.


## Readable library, safe raised surfaces and refined cursor, 2026-10-14

The user reports washed-out upper furniture/contact card and remaining jumping
traps. Reduce only upper-story architecture radiance (height-masked .58 gain)
and upper live fixture energy; retain ground lighting, facade-band fill, sharp
textures and every original content field. Render the printed contact face as
unlit paper so its real text stays readable. Keep the original native models.
The terrace bench is a jumpable support at shared seatTop .6475, retaining
E/click seating. Walk off it and accessible courtyard beds continuously under
gravity; retain full-footprint support until the body clears an edge. Block
jump entry into the narrow stair garden and enclosed right indoor bed because
neither has a body-width exit. Check actual stair masonry/cheeks against the
whole body, and allow overlap recovery only toward decreasing penetration.
When a landing straddles the larger walking margin, retain escape movement
until normal walking clearance is restored. Guide off raised supports safely.
The cursor may be redesigned: pearl ivory with a restrained champagne accent
and precision center, a subtle resting breath, and continuous spring-driven
hover/press morphs without jumps, sparkle or glow. Use cached 48px native SVG
frames at one fixed [24,24] hotspot; never reintroduce a DOM follower. Bound
shape updates to 25Hz and write only changed frames; stop outside the focused
page, during dialogs, for touch and for reduced motion. Keep instant OS pointer
tracking and all prior loading coverage. This supersedes earlier cursor-shape
and no-idle-motion choices while preserving the performance constraint.

## Tactile cursor without sparkle, 2026-10-14

The user no longer wants the glowing/blinking effect and asks for livelier
mouse feedback. Keep the clearly visible hollow ivory 3px native ring and its
thin dark contour from the first loading paint. Remove every glow frame,
blur/filter and repeating cursor animation. On usable props/buttons, use a
single .22s size response (26px rise, 29px overshoot, settling at 27px), then
rest. Pressing the primary mouse button compresses the same ring to a slightly
tilted ellipse until release; clear it on cancel, leave, blur, resize, Tab and
pause/dialog transitions. Keep all images at 48px with hotspot/center [24,24],
the same outline thickness, no DOM follower, pointermove listener, coordinates,
JS loop/timer or WebGL work. Reduced motion skips the arrival overshoot. Preserve
eligibility, native tracking speed, loading/details/help and input fallbacks.
This replaces the glowing/pulsing cursor requirement below.

## One clearly visible native cursor, 2026-10-14

The user rejected the separate DOM glow because it visibly follows a different
cursor. Remove that overlay entirely. Use only the native cursor in every state,
from the first loading paint: a hollow 24px ivory-white ring with a 3px stroke
and a thin dark contour for visibility on pale stone. Usable props/buttons
switch the actual cursor to pre-rendered soft/mid/bright glow SVGs. All four
images must share 48px bounds, center [24,24], circle radius 10.5 and identical
outline geometry/hotspot. Pulse native cursor images with a discrete 1.6s CSS
custom-property animation only while interactive; reduced motion keeps the
bright frame. No following element, coordinate writes, pointer-move listener,
JS timer/rAF loop or added WebGL work. Keep actual activation eligibility,
loading/detail/help cursor coverage, drag/leave/pause cleanup, touch, editable
text and forced-color fallbacks. This supersedes the DOM overlay and 1.6px
outline described below.

## Immediate cursor from loading and pulsing glow, 2026-10-14

Show the hollow ivory-white cursor from the first loading-screen paint, without
waiting for scene readiness or a pointer event. Use a native inline SVG cursor
in the initial CSS so the browser tracks the mouse independently of WebGL and
main-thread frames; keep its 22px outer diameter, with a slightly thicker 1.6px
outline. The DOM cursor now supplies only a small glow overlay on usable scene
props and buttons. Position that overlay directly on input, writing only when
active/changed, with no rAF delay, React pointer state or idle JS loop. Pulse
only its opacity gently over 1.45s while interactive; clear it on leave, drag,
blur, resize, pause and dialogs. Reduced motion keeps a steady glow. Native ring
persists through loading, errors, details and help; preserve touch, editable
text cursors and forced-color fallback. This supersedes the ready-only cursor,
coalesced pointer updates and native loading/detail/help arrow choices below.

## Translucent ring cursor, 2026-10-14

Replace grab/grabbing in the ready desktop world with a hollow, translucent
ivory-white 22px cursor ring. Glow its outline over usable books, frames, cards
and the bench, sharing the actual activation distance, floor, visibility and
movement checks. HUD buttons may use the same glow. Keep drag looking and E/
click behavior unchanged. Use a single pointer-events:none DOM ring with
coalesced transform writes, the existing throttled scene pick and no idle loop,
WebGL pass or per-pointer React state. Clear glow during dragging/presentation,
pause, leave and blur; retain native cursors in loading/details/help and on
touch, with reduced-motion and keyboard focus support.

## Loading shortcut removed, 2026-10-14

Remove the bottom-right "콘텐츠 바로 보기" disclosure and its content shortcut
buttons from the loading screen entirely. Keep the centered lee liquid gauge,
percentage, background blur/zoom, stationary entry and the error retry button.
This supersedes all earlier loading/error direct-content shortcut requirements.

## Stationary entry and stronger liquid loading, 2026-10-14

The user rejected automatic movement after loading. Remove the arrival tour
entirely; the loaded camera must remain at OUTDOOR until direct input or a
destination button is used. Keep zoom only on the static loading-house layer,
slightly stronger (1.14 over 18s), with a small cached image blur (1.6px). Make
the existing ivory lee fill visibly slosh: two broader traveling wave edges
and gentle vertical/tilt movement inside the logo mask. No added WebGL pass
or per-frame React state; stop all motion when loading is removed and respect
reduced motion. Center the left studio tree at its planter soil cross-section:
roomTrees x=-4.8433, z=1.982037, preserving original height/base/rotation. Share
that placement with lighting; do not move its pot or collision footprint.

## House preview and liquid lee loading, 2026-10-14

Replace the loading textbox/sky with this actual house, approached slowly.
Center the new calligraphic lowercase lee mark; its faint silhouette fills from
bottom to top with a subtle liquid wave and a numeric loading percentage.
Use real completed-resource/setup milestones, monotonic per attempt, reaching
100 only after the first compiled scene frame. Hold the complete logo briefly
then dissolve into the existing scene. A small compressed capture of the real
house supplies the early view while assets load. Approach motion belongs only
to this loading preview; the actual scene starts stationary at OUTDOOR. Never delay readiness to fake progress, duplicate the
WebGL renderer, add wave shaders/extra reflections, lower sharp quality or use
a generated house as the playable scene. Keep error/retry and direct content
access, reduced motion, 12px minimum text, abort cleanup and all earlier work.


## Reference quest tracker and refined controls, 2026-10-14

Match the supplied classic game quest reference: a thin olive/gold title bar,
dark translucent forest-green body, gold 12px quest titles, white 12px objective
lines with counts below each title, and round question/ellipsis quest badges.
Use only the actual three portfolio quests; do not invent levels or extra copy.
Place the tracker at the vertical center of the right edge on desktop and mobile.
Keep collapse, dynamic project totals, filled completion check and the single
left-to-right completion scan. Retain at least 12px text and short-screen touch
clearance. Other controls use restrained ivory/espresso/champagne finishes and
local Georgia/Batang serif typography, with clear hover/focus/pressed states.
Apply shared styling in ui/world-chrome.css after the legacy global stylesheet.
No extra fonts, images, idle animations, backdrop blurs or WebGL changes.


## Clear lower column heads and seamless sky, 2026-10-14

Move lower external columns .32m behind the balcony front line so both the shaft
and its slim black upper capital clear the projecting stone band. Keep their
original widths and wall attachment. End the ground west interior oak at the
moved column rear face; expose the existing single exterior wall and extend the
closed west bed to its front face, moving the adjacent planter with it. Add one
flat, narrow graphite soffit under the stone band, replacing the buried rod;
keep the broad warm-white ceiling. Preserve all upstairs and rail details.
Correct panorama longitude derivatives with explicit gradients and repeat
wrapping. Blend the photograph only within .012 of its longitude join (one
extra read only there), and fade the singular zenith to clear sky. Use four
cloud octaves per layer instead of five, reducing hash work by 20%. Keep one
sky draw, unchanged reflections and the original sharp render buffer.
Rebake matching native lighting and restore sharp runtime assets.


## Ceiling/body collision and library lounge, 2026-10-14

Block upward jumps at actual soffits including the upper roof overhang, without
blocking the open courtyard or exposed stair jumps. Airborne walls/furniture use
the walking body footprint so landing cannot trap visitors inside clearance.
Keep the original rail shape. Add slim matching black column bases on both
floors; inset lower columns .14m to fit the angled veranda soffit, moving their
west bed end and adjacent planter together. Replace both empty left library
side bookcases with one long ivory upholstered sofa, clear of the rear books.
Shift the complete writing desk, chair, rug, accessories and contact card .90m
right; share placements with navigation. Preserve tree/leaves and sharp assets.
Use slightly livelier existing water normals and add one decorative center drain
without increasing reflection resolution, passes or shader texture sampling.
Rebuild native geometry, matching baked lighting and sharp runtime derivatives.


## Usable terrace bench and consistent facade finish, 2026-10-13

The existing rear oak bench is usable with E/click. Approach on a clear dry
path, sit smoothly, allow free looking, and stand safely in front using E,
Space, Escape, movement, touch or a destination guide. Help pauses the seated
state; reset clears it. Seating never opens content or completes a quest.
Keep the actual bench geometry unchanged and share its bounds/poses in
bench-layout.json. The balcony stone band already shares one material;
uneven illumination makes its left side darker. Match the warm bright right
side with a local minimum diffuse fill only on that band, preserving stone
textures, UVs, shadows/specular detail and all other surfaces and rail shapes.

## Original newels and near-black brown stems, 2026-10-13

The user rejected enlarged/re-shaped stair posts. Restore the original .085m
wide, 1.06m tall oak newels with .008m bevels and the original round rod
handrails. Add only fitted geometry in the empty rail/post connection pockets;
do not enlarge the posts or redesign the railing. Ivy stems should be a very
dark, near-black brown (shared stemColor [.035,.021,.014]); preserve the green
leaves, photographs, other planting changes and all approved movement/UI.
This supersedes the continuous sweep/full-height newel requirement below.

## Finished stair rails and upper library planting, 2026-10-13

Keep the original railing silhouette and fill only the join pockets, as
corrected above. Preserve rail jumping. Butt the upper left
side bookcase to the finished oak wall, with matching collision clearance.
Remove the two upper library wall ivy roots; keep the right pot and tree and
add photographed leaves attached to its branches. Preserve other leaf shapes
and source texture quality. Make woody ivy stems brown, ground the eastern
canopy tree in the rising bed and remove the oversized rear canopy wood while
retaining its overhead leaves. Use shared garden placements for live geometry
and the light bake; keep all earlier UI, architecture and movement approvals.

## Pool corners, moved pots and flush west facade, 2026-10-13

The latest six attachments request a detail pass. Replace intersecting pool
coping bars with a continuous mitered ring, preserving the visible water edge.
Move the red loose pot beside the left end of the rear bench, clear of the bed;
move the square studio tree planter beside the western facade column, clear of
the passage. Use shared loosePots/roomTreePlanters for runtime, native geometry,
baking and collisions. Join the west walls on both floors into the courtyard
wall plane, butt both western columns to it and remove the upper return nib.
Use one full-height west wall without coplanar overlapping wall pieces.
Extend the ground west bed to the column and give its union one closed mitered
rim; keep roots inside the soil. Preserve all approved UI, ceiling thickness,
sharp assets, content, movement and rail jumps. Rebuild native/runtime geometry,
matching garden and baked lighting; validate actual mesh corners and clearances.

## On-demand game controls, 2026-10-13

The user removed the ambient bottom messenger and permanent keyboard legend.
Keep one top-left control-guide button, closed initially. Open a compact game
help panel with keycaps, clear action rows, dark glass and restrained gold
accents. Pause movement while it is open; support Escape, a close button and
focus restoration. Preserve a small contextual E interaction button, growing
exhibition pagination, swimming controls and all current navigation/quests.
Keep text at least 12px and ensure mobile controls do not overlap. This
supersedes the older instruction requiring a bottom messenger box.

## Compact quest HUD and running guides, 2026-10-13

Remove the three top shortcuts from the ready scene, retaining loading/error
access to the original content. Bottom destination buttons run continuously
along the shortest safe dry route and can retarget while moving. Carry the
travel budget across waypoints without idle frames; the work guide ends near
the frames, not at the entrance. Match a compact game quest tracker, with a
filled check and one left-to-right completion scan. Queue it until details and
camera presentations close. Reset clears queued scans. Shrink the HUD while
keeping all text at least 12px, including mobile and detail labels. Preserve the
thick upper ceiling, sharp rendering, original content and rail jumps.

## Upper ceiling thickness, 2026-10-13

Match the upper library roof's thickness to the substantial ground veranda
ceiling shown in the user's cropped reference. Use upperRoofThickness=.30
logical meters (about .34 physical meters). Increase upward, preserving the
approved underside elevation, interior headroom, recessed lights and pendant.
Extend the existing continuous black fascia to cover the complete thicker
roof section. Rebuild native geometry, matching baked lightmap and the sharp
runtime architecture together; preserve the original content and movement.

## Stair rail jumps and public React deployment, 2026-10-13

Allow jumps onto and outward from every ascending stair rail, including the
sloped flights. Consume grounded jump input before changing the support beneath
the visitor. Airborne terrace support must follow actual masonry boundaries,
not the extra clearance used for walking beside stairs. Preserve continuous
falls, dry guidance, swimming and the restored sharp rendering.
Publish the React production build from dist/client through GitHub Pages Actions
when main is pushed. Keep the optional Sites packaging intact. Frame, business
card and UI refinements are deferred until after this deployment.

## Preserve visual quality while optimizing, 2026-10-13

The user rejected the blurry result of the previous performance pass. Restore
sharp native desktop rendering, source-resolution surface textures and artwork,
and antialiasing. Never reduce the main drawing buffer in response to a slow
frame. Optimize shaders, cached shadows, reflection frequency and asset encoding
while preserving the approved atmosphere, architecture, content and movement.
Run tools/restore_runtime_quality.py after rebuilding runtime derivatives.

## Usable runtime performance, 2026-10-12

The user reports extremely slow loading and unusable movement at localhost:4173.
Prioritize smooth navigation and aim for initial readiness within one minute.
Use lightweight runtime derivatives, bounded render resolution and affordable
lighting/reflections while retaining the approved space, mood, original content,
project placement and E/click interactions. Verify real loading and movement;
do not infer frame rates from a background-throttled browser animation loop.

## Orange Card at the left wall's rear end, 2026-10-12

The user corrected the project choice: restore EATGO (project-03) to its original
rear-wall position [1.42,2.06,-6.90]. Move E1 Orange Card (project-06) to the left
wall near the rear corner shown in the latest attachment, at [-2.20,2.06,-5.90],
facing into the room. Match the opposite wall's frame size, height and corner
clearance. Keep the single entrance-side bookcase, all other work and growing
archive pages. This supersedes the previous EATGO move and full empty-wall rule.

## Keep one entrance-side bookcase, 2026-10-11

Restore the single leftmost bookcase bay when looking at the right atelier's
left wall from inside the room: the original entrance-side bay at [-2.13,-1.3].
Keep its books, but leave the removed pots, ivy and planting bed absent to avoid
overlap. The other three bays stay empty for future artworks. Use the shared
rightAtelier.leftEntryBookcase placement for native geometry and collision;
rebake its shadows. This supersedes the full removal below.

## Reserve the right atelier's left wall, 2026-10-11

Remove the tall ground-floor shelves, their books and top pots, the overlapping
rooted ivy, its floor bed and the front floor planter from the left wall of the
right atelier. Leave this wall empty for one or two future artworks. Retain its
oak finish and wall/ceiling fixtures, the existing six artworks, rear desk and
the opposite wall's relocated cabinet/plant grouping. Remove corresponding
collision volumes and baked plant shadows as well as the visible geometry.

## Right atelier exhibition breathing room, 2026-10-11

Keep the ground right room's side-wall frames inset from the rear corner and
evenly spaced as one group toward the left/rear. Move its low bookcase, both
floor pots, rooted ivy and planting bed together toward the right/front end,
leaving all artwork clear. Use rightAtelier in garden-layout.json for shared
native furniture, runtime trees, baked shadows and collision positions.
Preserve the readable frame size, growing exhibition pages and E/click flow.

## Desk content and E interactions, 2026-10-11

The newest request supersedes profile wall frames, the stair contact plaque and
the split indoor/outdoor project layout. Put the profile in a real hinged book
on the left ground studio desk. Nearby E or clicking focuses the camera, opens
the book, and reveals every original profile section. All project frames belong
to the right ground atelier, at readable fixed sizes; paginate the physical
exhibition automatically for seven, eight or more projects and derive totals
from the content data. Contact is a printed business card on the upper writing
desk, lifted toward the viewer when interacted with. Preserve all original data
and links. Use E consistently for nearby scene content, retaining click/touch
and accessible direct shortcuts. One bottom messenger box presents the exact
instruction "E 버튼을 눌러서 상호작용 하세요". Smooth camera/object/detail transitions
must reverse to the original standing pose on close, cancel and reset, with
reduced-motion support. Require proximity, same-floor access and line of sight.

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Approved portfolio requirements

The active project is the afternoon atelier and pool terrace. Use public/references/01-atelier.png and 02-pool-terrace.png as visual targets. Preserve every profile field and every description, metadata field, image and link in public/portfolio-content.json. Six unique projects: three indoor, three outdoor. One shared open passage; no door activation, room-loading gate, teleport or floor arrows. Profile/Portfolio/Contact direct menus share completion with scene clicks. Portfolio menu completes all six; restart clears all cues/progress. Use actual 3D geometry, not reference photographs as room backgrounds.

## User feedback, 2026-10-06

The user accepted the current overall composition as close to the approved images and requested more antique character: weathered timber, aged mineral plaster and richer light/shade. Close the visible gaps beside the shared entrance and behind the timber gallery. Replace low terrace parapets with tall courtyard walls so users cannot see the disconnected city/sky below the horizon. A walled open-air courtyard is the explicit update to the outdoor source; keep the afternoon sky above it, pool, gallery, bench and free shared passage.

## Selected second-floor concept, 2026-10-06

The user selected public/references/03-two-storey-atelier.png and requested faithful implementation of its entire mood and architecture. Add the upper oak library/reading terrace, raise the front ground-floor clear ceiling to approximately 3.6m, and use one right-wall L-shaped limestone stair with an intermediate landing. Both flights and the arrival must be continuously walkable in either direction, including manual WASD/touch movement; no teleport or activation gate. Apply warm bronze wall sconces and real trailing/climbing foliage to every wall zone on both levels, retaining clear artwork faces and walkways. Upper perimeter walls must hide the disconnected outside horizon from upstairs eye height too. Preserve the original content and shared completion/reset behavior, including any repeated Profile frame upstairs. Use src/navigation/space-layout.json as the shared geometry/navigation dimensions and src/scene/wall-decor.json as the shared runtime/bake decoration positions.

## Reference corrections explicitly requested, 2026-10-06

The previous two-storey result was rejected: its long diagonal front stair,
protruding arrival tongue and two masonry portal supports changed the approved
facade. The selected 03-two-storey-atelier image is the source of truth. Keep
the balcony front straight and the broad front-facing stair at the far right,
with its short upper turn meeting the right balcony edge. No extra central
door-like posts. Use glossy limestone, pronounced sunlit patches/reflections,
rooted branching ivy on walls and cornice, and low planted beds at wall bases.
Disconnected repeated leaf stamps are not an acceptable replacement for ivy.
These corrections supersede earlier stair dimension choices. Garden geometry,
navigation and baked/runtime vegetation must share garden-layout.json.

Keep the canopyTrees placements in garden-layout.json shared by runtime and
baking; their overhanging leaves must cast genuine sunlight shadows. Preserve
the blue pool body beneath timber reflections. The lower-flight route stays
at x=4.5 around the upper-front railing/newel; do not shorten it through the
rail. Verify actual mesh body probes as well as the navigation tests whenever
the stair geometry or route changes. Do not claim pixel identity with the
generated reference; compare the actual native 3D view and record differences.

## Detail revision requested, 2026-10-06

The latest four attachments supersede the previous stair-turn dimensions. Use
the fourth attached full view as the visual target and 03-two-storey-atelier.png
as its larger reference. Build a single uninterrupted stair flight, one central
upper-ceiling pendant, an angled outside timber facade with the inner artwork
wall remaining square, and a continuous low planted band around courtyard
walls. Match the slightly darker golden-evening mood and increase the perceived
width/height. Keep physical navigation and the new single-stair footprint shared
with Blender. A worldScale shared by all scene geometry/lights and camera floor
positions enlarges the space; human eye height remains 1.53 real meters. The
old x=4.5 turning-landing guidance and two-flight rail are obsolete. Preserve
all content, shared completion and free both-way movement.

## Landing and two-room correction, 2026-10-06

The newest user clarification supersedes the single uninterrupted-flight choice.
Use 05-landing-two-rooms.png and the larger 03 reference: one connected stair
with an intermediate landing and gentle upper turn, exactly two ground-floor
spaces. Remove the apparent far-left third pocket, make the left studio
physically enterable, and widen the pool/stair dry passage and front crosswalk.
Use a limestone-tiled base with trailing ivy below the balcony rail. Add real
side-wall and step illumination. Match both floors' oak furniture and warm
interior mood. Add varied rooted ivy continuing over several courtyard copings.
Shared stair flights/landing, room bounds, light manifests and actual loaded
mesh probes must remain aligned with navigation. Preserve every content item.

## Latest stair/tile/evening correction, 2026-10-06

The newest seven images supersede the two-flight stair dimensions. Use three directional stages: gently diagonal lower start, straight middle, and opposite diagonal upper flight, with one level intermediate landing. Shared mitered edges must connect all tread slabs, cheeks and rail segments without voids. Make upper floor and stair treads actual tiles of the same limestone as the ground outdoor floor. Close the upper outer east wall behind the arrival, retaining free library entry. Unify plaster base colors; use gently dim golden late-afternoon light with visible warm fixtures. Apply a slight shared affine skew to the entire world and physical movement. Continue planted beds alongside the complete stair. Inspect full-width actual mesh floor coverage, upper east shell and rail bends as well as navigation tests. Preserve all complete original content and shared completion/reset behavior.

## Floor reflection validation, 2026-10-07

The shared skewed-world pool mask injects logical bounds into GLSL. Always emit float literals for those bounds, including an integer-valued edge such as zero. Browser shader compilation and a fresh actual floor-reflection capture must pass; a successful Vite build alone cannot verify WebGL shaders.

## Closed east stair wall and swimming, 2026-10-07

The newest three attachments supersede the open upper east alcove: fill that pocket with solid plaster, retain only the front library/stair passage. Match the outer east perimeter to the entire right stair edge using eastWall; close the ground facade/stair wedge with lowerCornerClosure. Keep actual mesh probes and collision aligned. Shift runs on land, Space jumps; pool has a real 2.55-logical-meter basin. Visitors can enter, sink below the surface, hold/tap Space to rise and move toward a bank to climb out. Include touch equivalents, underwater rendering, physically continuous exit and reset/pause handling. Preserve original complete content and all shared progression.

## Flat walls and slat interiors, 2026-10-07

The latest six attachments supersede the previous exposed interior plaster and
protruding rectangular east returns. Use 11-warm-wall-color.png as the common
warm light wall target, including the previously dark upper/right wall. Preserve
natural shadows and warm fixtures while lifting overly dark plaster. Use real
vertical oak boards with gaps and recessed backing on every indoor wall on both
levels, matching 12-oak-slat-interior.png. Keep all artwork unobstructed. Make the
upper east solid and lower front return one continuous flat L-section extrusion;
extend the first east perimeter plane back to the house, clip the upper deck to
its inner boundary, and align the lower corner wedge with the same front plane.
Keep upper passage, full-width steps, pool physics, and original content intact.

## Bright rooms, turquoise pool and 33-degree stair, 2026-10-08

The latest image 16-bright-turquoise-33-degree.png and larger 03 reference control this revision. Remove the pool ladder entirely, retaining physical swimming/rise/exit. Use turquoise water with warm timber reflections. Lift scanned oak to honey oak and illuminate both ground rooms and the upper library generously with actual warm linear ceiling fixtures, shelf lights and the existing pendant. Preserve golden late-afternoon exterior sun, leaf silhouettes, glossy tile reflections and readable fixture pools. Narrow stairs to 2.50 physical meters; their ascending directions must be exactly +33, 0 and -33 degrees in world space, compensating shared scale and shear. Solve shared miter stations for treads, landing, rails, continuous east shell, stair side wall, planted borders, routes and sconces together. The external wall must follow these same planes with a continuous rear return, not local cover-up pieces. Preserve all original content and existing progression. Verify actual wall/floor/body rays and compare real rendered views with the reference; do not claim photographic pixel identity.


## Full-height interiors, lower library illumination and rail physics, 2026-10-08

The latest five detail screenshots supersede previous trim/brightness choices. Align the upper east wall and stair-side courtyard coping heights. Finish the stair arrival flush, including the balcony/stair cap connection. Indoor slats fill down to the floor, with no bare right studio return or projecting tops; a continuous darker oak cornice follows the exact ceiling profile. The left ground studio and upper library use the same continuous oak ceiling and transverse beam section as the main ground atelier. Reduce upstairs fixture/baked lighting moderately to retain readable furniture and images. Add held Ctrl crouching plus touch equivalent; raised physical jumps can land on native oak balcony/stair rail tops, and stepping off falls under gravity without teleporting. Keep automatic routes dry. Swimming begins only inside the rendered visible water rectangle, excluding all solid coping bands; use the shared poolWaterInset for water geometry and navigation. Preserve all content and progression, and validate rail landing/falls/crouch/coping edges in meaningful physics tests as well as actual mesh and browser evidence.

## Mounted fixtures, rising stair garden and monochrome furniture, 2026-10-08

Connect the left studio's suspended bronze lamp to its ceiling with a visible cord and rose. Every ceiling glow needs an actual fixture. Mount linear lights directly under timber beams in both ground rooms, the covered ground veranda and the upper library. The veranda has a continuous oak soffit and warm linear mood lights. Remove ivy intruding onto the ground facade/stair return and finish that return with matching full-height oak slats. Extend the stair cheek and cap continuously to the filled upper wall. A single limestone planted trough follows all stair directions and rises with the stairs; plants grow vertically from its soil rather than tilting with the trough. Share rising-bed sections with foliage and airborne collision. Replace indoor table/chair timber with ivory porcelain, white leather/lacquer and graphite metal. Upstairs, add real slim oak ceiling slats with recessed gaps, preserving the reduced upper illumination. Keep all original content, physical routes, rail jumps, pool movement and completion behavior intact. Verify current native mesh, rendered rooms, stair planting and fixture mounting before reporting completion.

## Flush stair arrival and right-wall planting correction, 2026-10-08

The latest five detail images (27–31) supersede the previous planter side and cap connection. Remove the raised crossing wall/cap at the upper entrance and keep the balcony stone band below the actual upper walking floor. Join the exposed lower return and stair cheek on their shared plane, with continuous oak slats over the masonry and no projecting nib at the ground junction. Move the stair planted trough from the railing side to the outer/right wall shown in image 31. It must share the ground east bed's complete soil edge and rise continuously through all three stair directions to the upper entrance. Shift the east shell outward together with embedded lights to retain the full clear stair width. Keep plants vertical. Place real glazed pots and plants beside the exposed stair wall; its bronze fixtures must sit in front of the oak finish, rather than buried behind the old planter base. Reduce pool plan width moderately, from 4.60 to 4.30 logical meters, retaining shared rendered-water/copings/swimming bounds. Preserve all other approved lighting, ceilings, furniture, content and physics. Validate the native curb height, connected stair finish, visible lamp bodies and rising soil as well as the physical routes and actual rendered stair-side view.

The ground east rim and rising stair rim must use the same shared cross-section at their joint. Carry each stone cheek down to the ground beneath the cap overhang, so its underside and direction changes never leave exposed triangular holes. Verify the vertical rim faces with native rays as well as the soil surface and a close actual-browser view of the ground connection.

## Modern white ceilings, stone columns and afternoon music, 2026-10-08

The latest three attachments (32–34) supersede the exposed timber ceilings, beam-mounted lighting and structural timber columns. Remove only the large ivory potted tree directly in front of the stair, at [2.08, 8.70]; keep wall-side pots and the connected rising garden. Use continuous warm-white satin ceilings in both ground rooms, the veranda and the upper library, with genuine recessed linear mood-light channels and flush downlights. Keep the indoor wall oak slats and stair/balcony rails. Replace architectural load-bearing/canopy/pergola columns and shared entry jambs with subtly veined polished ivory stone, with refined edges. Keep shared stair/water/upper entry geometry and progression unchanged. Add an original, quiet, slow afternoon piano BGM, controlled by an accessible toggle and loaded only when played; pause when the page is hidden. Move the photographic sky very slowly with reduced-motion support, retaining the fixed afternoon illumination. The accidental strike-through in the user's message came from paired double tildes; all text within it is part of the user's request.

## Softer ground-floor lights and reflective black exterior trim, 2026-10-08

The latest three attachments (35-37) supersede the white exterior roof/wall coping finish. Keep the white ceilings and stone columns, but reduce ground-floor Atelier/Studio/Veranda ceiling strip intensity and bake power by 18%, with a modest 10% reduction to ground fill/flush spots. Ground opal diffusers use 1.55 emission; Library diffusers/lights stay unchanged. Use a narrow, continuously mitered reflective graphite-black band around the whole upper roof perimeter and the existing top coping of every outer courtyard wall and upper closure. The warm plaster walls, white soffits, foliage, original content, music and physical routes remain. Keep the material gloss and baked/native/runtime source aligned; validate the actual exterior view and console shaders.

## Sunset, varied wall planting and monochrome glass, 2026-10-09

The latest four images (38-41) supersede the remaining pale outer fascia/capitals and tall above-wall silhouettes. Continue reflective black around every external fascia, wall upper face and roof-adjacent capital, including the formerly pale upper closure edge; retain ivory columns and white ceiling interiors. Exterior ivy must climb the real wall, hug its coping and bend down the back side, with heights interpreted as rises from their root. Indoor upper plants stop below their ceiling. Canopy trees must not protrude over the wall. Use different fan, column, cascade, wild and dense silhouettes, multiple leaf profiles/shades and denser connected branches to reduce blank areas while preserving artwork and routes. Replace whole-panorama sky rotation with a live sunset atmosphere and two independently moving/evolving cloud layers; keep reduced-motion support and warm readable architecture. Give HUD, controls and content panels a black/white frosted-glass finish with real backdrop blur, reflected white rims and clear text/focus states. Preserve all original portfolio content, BGM, physical movement, pool and progress.

## Marble upper entrance and over-wall ivy, 2026-10-11

The latest two detail attachments (42–43) supersede the visible dark timber crown at the 2F stair/library entrance. End the lower west stair-return timber below the upper floor, removing the coplanar oak crossing strip; the existing continuous marble tile surface must remain flush and visible across the opening. Keep lower stair-wall timber and railings. Add actual connected ivy to the previously bare upper closure front wall, rooted behind its black coping, wrapping over the top and cascading down in unequal lengths and leaf profiles. Keep the sconces readable, the entry clear and the existing perimeter growth. Share placements with native geometry and baked shadows. Verify the entrance using all-material downward rays as well as the actual browser view; a stone-only height check misses a coplanar timber strip.
