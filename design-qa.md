# Connected 2F lobby, corridor and gallery — 2026-10-23

This revision supersedes the previous single-room gallery. The active experience now starts outside a closed luxury elevator on the second floor, opens into a separate reception lobby, and connects through a short enclosed corridor to a long exhibition gallery. Clear and the original two bilingual farewell statements remain; the final photo layout and gradual dimming follow the latest first reference.

## Environment / validation

- Existing preview: http://localhost:4173/. No duplicate preview server started.
- Windows local production build, in-app browser through CUA. Browser plugin not available.
- Production UI: desktop 1600×900 and mobile 390×844. Final ending checked at the supplied screenshot size 1919×939, at 390×844 and at 320×568. The reference-sized capture uses full-page capture to retain the entire virtual viewport.
- Project test suite: 200 passed, 0 failed. This includes retained historical coverage plus the revised connected-room navigation/controller coverage.
- Build passed. Fresh production browser error/warning logs were empty. Vite's existing large-chunk advisory remains.
- No commits, deployment, old Blender atrium rebuild, or BGM replacement.

| Required browser check | Result |
| --- | --- |
| Identity | BEYOND THE FRAME, localhost:4173 |
| Not blank | New lobby, readers, gallery and ending rendered |
| Framework overlay | None |
| Console | No relevant errors or warnings in the fresh production flow |
| Screenshot evidence | Native scene, actual production UI, mobile and ending captures saved below |
| Interaction proof | Full profile/contact/all-six-works → ending → restart loop passed |

## Reference comparison

| User reference | Implemented result |
| --- | --- |
| 1. Ending screenshot | Original sea-lounge image preserved; bilingual second statement rises; contacts centered at 54vh; restart below; final neutral dimming reaches opacity .24 |
| 2. Blank arrival wall | Closed double champagne-bronze elevator with stone reveals, fine brushed surface, lit side reveals, call panel, 2F and 2층 labels; no elevator operation |
| 3. Gallery | Separate long hall, alternating left glass bays and stone exhibition piers, six portrait paper displays containing the actual portfolio images, labels below, low central benches, olive planters, bronze loop sculpture and dusk sea glazing |
| 4. Lobby | Elliptical dark reception counter, large round glazed ceiling oculus, fine descending pendant rods, WELCOME/navigation inscriptions, charcoal mineral wall panels, warm concealed lighting and right-side sea glazing |
| 5. Loader | Faithful larger reconstruction of the supplied exterior; original lee progress and gentle approach retained; native lossless 1840×854 PNG |

The interior is real movable Three.js geometry, not a room photograph on a plane. The static reference camera and the freely movable runtime camera differ; actual project content replaces the reference's fictional portfolio. This is an interactive reconstruction, not a claim of pixel-identical offline photographic rendering. Generated sources are preserved at their native sizes, without fabricated 4K upscaling. Full prompts and file paths are in generated-assets.md.

## Functional scope

The original tablet is on the LEFT and the contact notebook on the RIGHT of the lobby counter. Both readers preserve the original content, links and reversible handoff. All six projects remain available through the existing reader's previous/next controls and exhibit interaction. WASD, drag/Pointer Lock, touch controls, crouch, jump, seating, guide shortcuts, quest counts, restart, BGM and volume behavior remain.

galleryLayout.js shares both rooms, the four-metre corridor, ellipse counter, elevator face, planters, sculpture and benches with collision/navigation. The second-floor label denotes the single walking level; no stairs or functioning lift were introduced. Closed elevator clearance prevents walking through its doors. The route grid uses cached occupancy and a binary heap.

The rooms share four area lights, four ranked spotlights, one cached floor reflector, one composer and one animation loop. Lobby fixtures join the same spotlight pool. Idle readers and hidden tabs avoid expensive scene rendering. Unused rug fetching and an unused material allocation were removed.

## Interaction loop exercised

Fresh app → exterior loader → lobby start → profile shortcut → PROFILE reader → close → contact shortcut → CONTACT reader → close → gallery shortcut physically through the corridor → SWEATIE → DIVE → EATGO → JW중외제약 → CJ올리브영 → E1오렌지카드 → close → 3/3 completion → ending → restart.

Restart removed the ending, restored focus to the canvas, reset quests to 0/3 and returned to x17.5 / z8.5 / yaw-.06 / pitch.16 in the lobby. The screen-reader room label returned to 2층 로비. Mobile profile tabs, including 스킬, were exercised; crouch toggled on and reset cleared it. Body scroll width remained 390px at a 390px viewport. At 320×568, the ending text, contacts and restart remain in order without overlap or horizontal overflow.

The production full ending reached shade opacity .24 with no blur on the image. Separate lightweight component inspection verified the final position adjustment at 1919×939 and mobile, using the real EndingSequence and the production CSS. The background and shade remain outside the dialog to prevent modal handoff from restarting their transitions.

## Render cost

At native 1600×900, the full composer, including floor reflection, measured 32 GPU samples after four warm-up frames: median 16.12ms, p95 32.09ms, 171 draw calls and 731,745 triangles. Measurements used the desktop's EXT_disjoint_timer_query_webgl2 path. Background browser animation throttling means these are GPU draw costs, not a physical-device FPS guarantee.

## Evidence / commands

Evidence directory: C:/Users/user/Documents/Codex/2026-10-13/code/outputs/gallery-lobby-2026-10-23

- loader-desktop.png / loader-mobile.png
- lobby-desktop.png / lobby-mobile.png (production UI)
- lobby-clean.png / gallery-clean.png / elevator-clean.png / corridor-clean.png (same native renderer; temporary camera inspection)
- project-reader.png
- ending-desktop.png (actual production completion)
- ending-reference-size.png / ending-mobile.png / ending-layout.json (final layout inspection)
- flow.json / gpu.json / tests.log / build.log
- lobby-concept.png / gallery-concept.png / generated-assets.md
- before/ preserves the starting source versions.

Commands: npm run build; npm test. Browser sequence: fresh tab → viewport/reload → DOM and screenshot checks → semantic shortcuts/readers → next-work controls → completion → ending → restart. Scene inspection bundles were created only under dist/client from external scripts and are removed by the final normal build.

The final lobby lettering pass separates the WELCOME paragraph and disables depth writes for transparent text decals, avoiding clipped characters from overlapping transparent planes.

Remaining unverified: physical phones, Safari and other GPUs. Historical reports below describe earlier layouts and are retained only as history.

---

# Ending image and physical entrance — 2026-10-23

The latest user request supersedes the live 3D camera ending described in the historical gallery QA below. Clear now blurs the current view and dissolves into one newly generated sea-facing lounge image. The original two bilingual statements remain centered; the second rises and stays visible, followed by contact links and a restart button underneath.

## Environment and results

- Preview: http://localhost:4173/ (the existing server; no duplicate preview process).
- Desktop: 1448 × 1086. Mobile layout: 390 × 844.
- Browser plugin not available. Browser QA used the in-app browser through CUA with its documented Playwright locators and DOM reads.
- Production build passed. All 200 tests passed, including the new entrance walking/door/privacy-wall coverage. Existing legacy Three material-fixture warnings and Vite's large-chunk advisory remain; fresh browser error/warning logs were empty.
- No commits, publication, BGM replacement, or old Blender asset rebuild.

| Check | Result / evidence |
| --- | --- |
| Identity | BEYOND THE FRAME at localhost:4173 |
| Not blank / no framework overlay | Actual gallery, loading scene, readers and ending rendered |
| Console | No relevant error/warning entries in the fresh production flow |
| Loader | New lossless image loaded at native 1448 × 1086; observed 1.043x transform during approach |
| Entrance | Actual stone canopy, Nero piers, open tall pivot doors, level stone floor and opaque side returns |
| Actual ending trigger | Profile + contact + all six works reached 3/3, then ending opened |
| Ending image | Native 1672 × 941 source loaded; CSS filter none; only the underlying canvas has blur(5px) |
| Contact order | Second statement remains lifted; mail/phone links appear below; restart below contacts |
| Restart | Ending removed, 0/3, focus returned to canvas, pose x0/z13/yaw0/pitch.015 |
| Mobile | No horizontal overflow at 390px; contact/restart controls fit; crouch works and reset clears it |
| Navigation tests | All-pairs frame/desk/lounge routes and real entrance controller walking pass |

## Interaction loop

Fresh production app → eight-second entrance loader → actual door-front start → shortcut to profile tablet → PROFILE reader → close → shortcut to contact notebook → CONTACT reader → close → shortcut to work → SWEATIE → DIVE → EATGO → JW중외제약 → CJ올리브영 → E1오렌지카드 → close → 3/3 completion ending → centered final statement / contacts / restart → reset to the entrance and 0/3.

The mobile complete ending was checked using the real EndingSequence component and production CSS in the temporary scene inspection harness. Mobile loader, entry, touch crouch and reset were also checked in the production app. Harness controls were not added to application source and are removed from dist by the final normal build.

## Timing and image fidelity

The image is a sibling of the dialog, so switching to modal presentation at the first statement does not restart its dissolve. The final browser stage trace recorded Clear → depart → first → firstOut → gap → second → secondOut → complete in order; settled canvas blur was 5px, the second statement remained visible at -104px, and both contacts and restart reached opacity 1. Computed CSS values sampled during transitions are intermediate values, rather than frame-rate measurements.

Normal sequence: Clear at 0; image dissolve starts at 4.2s and lasts 2.2s; first statement at 6.4s; first leaves at 9.8s; second at 11s; second rises at 14.8s over 2.8s; contacts at 17.6s; restart fades in one second after contacts begin. Reduced-motion timing remains supported.

The ending uses a complete lounge photograph recreating the small reference's sea, glass mullions, charcoal sofa, foreground ottoman, circular fire bowl and blue/peach dusk. It contains no baked-in interface text. The new loading image retains the supplied architecture and improves surface detail. Its approach zoom is now 1.10x instead of 1.38x; reveal zoom is 1.025x instead of 1.16x. Both project PNGs retain their generated native pixels without lossy conversion or claimed 4K upscaling. Earlier images are preserved.

The runtime entrance uses a short enclosed, level vestibule; its privacy walls conceal side views. It shares dimensions and solid clearances with galleryLayout rather than adding another outdoor courtyard or stairs.

## Evidence and commands

Evidence folder: C:/Users/user/Documents/Codex/2026-10-13/code/outputs/gallery-ending-entry-2026-10-23

- loading-desktop.png / loading-mobile.png
- entry-desktop.png / entry-mobile.png
- ending-desktop.png / ending-mobile.png
- restart-desktop.png
- ending-actual.json (native image properties, positions, project titles, empty console log)
- tests.log / build.log
- generated-assets.md (built-in imagegen mode, exact paths, source dimensions and full prompts)
- sequence-trace.jsonl (temporary real-component timing inspection)

Commands: npm run build; npm test. Browser: createBrowserTab → viewport set/reload → screenshot/DOM snapshot → semantic button locators → reader/quest/ending state checks → restart.

Unverified: physical iOS/Android hardware and Safari. The image outputs are 1672 × 941 and 1448 × 1086, not native 4K.

---

# Single-floor portfolio gallery — 2026-10-23

The user replaced the prior atrium task with the supplied dark gallery references.
The active app now loads GalleryScene; courtyard, pool, stairs and upper floor are
absent from this new environment. Earlier QA below is retained as history.

## Scope and reference comparison

| Reference | Implemented surface |
| --- | --- |
| First gallery: dark mineral columns, warm tracks, individual framed works | New Nero stone material, world-scale UVs and normals, champagne-edged portrait housings, track fittings and ranked spotlights |
| Second gallery: large central feature, quiet bench, polished floor, reception desk | SWEATIE central display, five wall works, physical low bench/rug, cached softened floor reflection, stone desk with tablet LEFT and notebook RIGHT |
| Third image: entrance approach loader | User-supplied gallery-entry.webp, original lee progress, continuous eight-second approach, reduced-motion fallback, real door-start pose after handoff |
| Last image: sea-facing farewell lounge | Live 3D grey sofas, fire table/flames, glazed panoramic dusk view, animated wave geometry; original Clear, two bilingual statements, contact and restart phases |

All six portfolio images retain their source aspect ratio and original content.
The reference's fictional brands/navigation were replaced by this user's work and
existing controls. The new space combines both gallery compositions rather than
substituting a flat room picture. Two generated material/environment assets and
full prompts are recorded in the external generated-assets.md evidence file.
Existing BGM, selected audio and volume code were not changed by this revision.

## Validation environment and flow

Browser plugin not available; used the existing in-app browser through CUA with
its documented Playwright locators, native input, DOM state, screenshots and logs.
URL: http://localhost:4173/ . Desktop: 1448×1086 and 1280×720. Narrow: 390×844.
No additional preview process was started; the existing port 4173 serves the build.

Flow under test: loader → real doorway start → profile/contact desk shortcuts →
physical reader opening/closing → six project readers with previous/next → quest
completion → farewell → restart. The new navigation also routes every pair of
desk, project and lounge viewpoints around the actual furniture on one level.

| Check | Result |
| --- | --- |
| Identity and meaningful scene | PASS: BEYOND THE FRAME, gallery aria label, six actual exhibits |
| Blank page/framework overlay | PASS on fresh production build |
| Console health | PASS on fresh desktop/narrow build; no relevant warnings/errors |
| Desktop/narrow screenshots | PASS: loader, gallery, mobile reader and final live lounge |
| Interaction | Profile and contact open and restore; all six original projects render and switch; mobile profile tabs and restart work |
| Unit/regression checks | npm test: 199/199; final focused gallery/loader check: 5/5 |
| Production build | npm run build succeeds; existing Three.js chunk-size advisory only |
| Temporary inspection controls | Removed by final normal build; _gallery-qa.html absent from dist |

During iterative rebuilds, one older test tab attempted to fetch a superseded
EndingSequence chunk after dist had changed. That tab was discarded and the
fixed final build is checked in a new tab. Existing preview tabs should refresh
for the new gallery. Fresh-build end-to-end check: PASS. Profile and contact shortcuts opened and restored; the six readers completed all three quests; the farewell mounted without errors and its restart returned to 0/3 at the doorway.

The full product completion pass also exposed the older blur rule winning the CSS cascade. The gallery override now has higher specificity. A final renderer/EndingSequence inspection using the exact product class combination verified computed filter=none and a sharp live lounge; its temporary controls are hidden in the captured end frame. Shader-only panorama textures are explicitly released on disposal.

## Performance evidence

Native 1280×720, quality 1, full composer including the reflection: 32 GPU samples
after four warm frames, median 15.73 ms, p95 17.19 ms, 266 draw calls including
reflection/postprocessing and 427,479 submitted triangles. These are local GPU
render times, not an FPS or phone-hardware claim. The in-app background tab's
roughly 1 Hz animation scheduling is not treated as scene FPS. Narrow desktop
emulation also rendered at native 390×844 with no app errors. A physical phone
and other browsers were not tested.

Static architecture batches by material; photographed foliage geometry remains
intact. One wool texture, four ranked spotlights, cached sunlight shadows, one
cached reduced-size reflector and a single render loop are used. Hidden pages
and idle readers skip expensive rendering. All flame shader values remain finite.

## Commands and evidence

Commands: npm run build; npm test; node --test tests/gallery-navigation.test.mjs
tests/loading-storyboard.test.mjs; git diff --check. New tests exercise routes,
collisions, shortcut arrival/cancellation, crouch/jump, bench standing and reset.
CUA used getAXState, screenshots, scoped getByRole locators and dev.logs.

Evidence directory:
C:/Users/user/Documents/Codex/2026-10-13/code/outputs/gallery-rebuild-2026-10-23

- gallery-front.png, gallery-mobile.png, loading-gallery.png, ending-gallery.png
- performance-final.json, tests.log, [generated-assets.md](C:/Users/user/Documents/Codex/2026-10-13/code/outputs/gallery-rebuild-2026-10-23/generated-assets.md)
- External inspection source/builder; no inspection code is committed or shipped.

---

## Continuous ceiling perimeter and stair soffit — 2026-10-22

Latest reference truth: user images 2f5b48a1 (stair-side lower soffit pocket),
a59eb450 (black upper inner fascia) and 4740f6ab (sky slit beside upper ceiling).
Evidence: C:/Users/user/Documents/Codex/2026-10-13/code/outputs/continuous-ceiling-2026-10-22/.

The flow under test is: entrance -> physically climb to the library -> CONTACT
opens -> close -> restart; inspect the same native geometry from the front,
side and final stair flight. Browser plugin is not listed; the provided CUA
browser is used. The isolated inspection page only adds three checked walkable
camera poses and render measurements to the actual createScene bundle. It does
not replace any geometry, material, lighting or production interaction. The
normal application separately completes the actual staircase/reader flow.

Mismatch ledger and result:
- Ground soffit: an actual closed apron meets the rounded border and arch; a
  stone-capped wedge closes the pocket outside the inner stair cheek. Stair
  positions and body route are retained. stair-soffit-closed.png records it.
- Upper fascia: keep the front travertine; inner/rear top arch surfaces and the
  new continuous backing use the exact same warm ivory material as the curved
  cove border. White recessed fields retain their size/elevation. The backing
  continues to the actual outer east wall above the stair arrival, following
  its bends, instead of stopping at the room wall. upper-front-continuous.png
  and upper-side-closed.png record the formerly black/open sections. The open
  courtyard beyond the roof's front remains outdoor space.
- finished-overview.png is the normal 1280x720 application, showing both floors
  and the continuous warm finish. mobile.png is the actual 390x844 page, with
  no horizontal overflow. Correct title/URL, meaningful rendered content, no
  framework overlay and no captured application console errors/warnings.

Validation: 195 tests pass after final native/runtime assets. Native surface
probes pass at 65 finish positions, including four probes 3cm inside the real
outer wall; 171 rays confirm the new ceiling material avoids the stair walking
width; all 126 previous full-scene centre-route headroom rays still pass.
Native/bake/runtime geometry and lightmap UVs match; original photo textures
are restored for architecture. No foliage export, real light, render loop or
post-process was added. Source/runtime triangle equality and payload guards
pass. Same-PC 1280x720 full scene: 64 GPU samples after 12 warmup frames, quality
1 and native scale 1; GPU median 17.18ms, p95 23.21ms, maximum 406 draws and
2,689,428 triangles. This measures the entrance view on this PC, not every
view/device or background RAF cadence. Existing 4-light pool/cached shadows
and reflection update schedule remain. Final build removes both temporary
_atrium-perf files; the existing localhost:4173 preview is reused.

## Seaside window, wool carpet and real sunken lounge — 2026-10-22

Flow under test: entrance -> work/profile shortcut -> real reader -> return ->
manual pit descent -> sit -> library shortcut automatically stands and climbs ->
contact reader -> restart. Rendered and exercised through the existing IAB
browser using CUA (the separate Browser plugin is not listed). No browser
package, dependency, new server or separate render loop was added.

Evidence: C:/Users/user/Documents/Codex/2026-10-13/code/outputs/seaside-lounge-2026-10-22/.
Reference: the seven newest user attachments, ending in 4faa273a, 8cea6003,
973c89e0, abc2c2d0, 158cda34, 62a52a85, efef473e. These supersede the earlier
solid rear wall and ground furniture layout. The last photograph guides the
recessed U sofa, wool, round stone table and open sea view; the approved cloudy
sky and existing native room style are intentionally retained.

Reference-to-render ledger:
- Disconnected stair planter: widen the outside rim/soil toward the actual wall,
  retaining the inner stair edge. Native soil rays cross the ground/rising join.
- Protruding middle stair lamp: remove its native fixture, realtime light record
  and spill entry; two properly mounted stair sconces remain.
- Upper ceiling overlap: roof narrows inside both exterior walls, remains above
  the outer frame returns, and courtyard coping is flush with its 10.425 top.
  Both ceiling finishes share white materials with a 6.5cm upward outside curve.
  upper-ceiling-finish.png and front-overview.png show the finished result.
- Ground layout: left-wall tablet/desk; right-wall workbench and six landscape
  works in two rows; planting/cabinet moves forward. All indoor sconces share
  y=3.17, between the frame columns. Original portfolio content is retained.
- Floor/rug/sofa: a 12cm logical raised floor and 1:15 entry ramp; genuine 60cm
  pit with four 15cm steps, native U upholstery, olive cushions and round table.
  Subtract the pit from native tiles/raised floor/mortar/spill. The wool rug
  covers about 72% of the room plan including the pit rug, using one shared
  256px boucle texture without fur geometry. sunken-lounge-detail.png records
  the recess; sunken-seat.png records actual seated interaction.
- Rear wall becomes an actual 7.9m clear glass opening. A 3D wave mesh and closed
  distant coastal geometry sit outside it, under the existing animated cloudy
  sky. They use the current scene loop, without a reflection-camera pass.

Validation:
- npm test: 195 passed, 0 failed. New checks cover ramp continuity, pit routes,
  negative-floor sitting/standing, exterior and upper routes, curved headroom,
  six-frame/lamp clearance, low coastal views and shared wool resources.
- Native model: 173 rays including 126 stair headroom probes; real window,
  raised floor/ramp, pit, seats, planter soil join and roof bounds all pass.
- All garden runner derivatives: 646,711 vertices and 286,105 face samples;
  max vertex deviation 1.952cm, max face deviation 1.001cm; 501,521 triangles.
  Original photographic maps restored after derivative export. Originals kept.
- Desktop 1280x720 and narrow 390x844: correct page identity, nonblank scene,
  no framework overlay or application errors; no narrow horizontal overflow.
  Mobile-front.png is the actual responsive page. Desktop retains the existing
  harmless ANGLE X4122 constant-precision compiler warning; narrow had no logs.
- Same-PC complete-scene measurement, 76 frames (12 warmup, 64 GPU samples),
  native scale 1, quality 1, all post-processing: desktop GPU median 17.19ms,
  p95 21.20ms, maximum 404 draws / 2,689,188 triangles; narrow GPU median 6.28ms,
  p95 9.27ms, maximum 318 draws / 2,326,282 triangles. Narrow is a viewport check
  on this PC, not physical-phone testing; these are measured views, not an FPS
  guarantee for every direction/device. Four local point-light slots, cached
  shadows and pool reflection cadence remain. Background 1Hz RAF is not FPS.
- Production build succeeds. Final build removes temporary _atrium-perf.html/js;
  normal preview remains http://localhost:4173/ without a duplicate server.

## Cartier atmosphere, unified cursor and flowing guidance — 2026-10-21

Source visual truth: C:/Users/user/AppData/Local/Temp/codex-clipboard-610c8ea0-8f84-4822-9eb9-1f33f22e3616.png and the arrow reference codex-clipboard-665ce591-0b6f-489b-8f46-932e0e9c4f40.png.
Reference URL: https://www.cartier.com/ko-kr/thefabulouscartierjourney.html
Evidence root: C:/Users/user/Documents/Codex/2026-10-13/code/outputs/cartier-ending-revision/

Full-view comparison: cartier-reference.png and ending-desktop.png were opened together at 1280x720 pixels / CSS pixels (1x). The reference hero atmosphere is intentionally adapted to the portfolio's completed ending, retaining the portfolio copy and the previously approved unobstructed mountain arrangement. The attachment is 1919x943; an attempted viewport override exceeded the IAB screenshot surface, so that cropped capture was discarded and the matched 1280x720 browser captures were used. ending-full-tour.png records completion through the actual application. The temporary isolated fixture ran the real EndingSequence timeline for current-font and responsive checks; it did not simulate quest completion.

Required fidelity surfaces:
- Typography: Korean Nanum Myeongjo ExtraBold and English Cormorant Garamond Medium Italic reproduce the reference's bold serif / fine italic hierarchy. The source reports generic serif and FancyCutPro. No licensed local FancyCutPro was supplied; the English face is an explicit OFL alternative. Current Korean/English copy and restart text have complete Google Fonts subsets, 31,120 bytes total, at original vector precision. Close inspection of the two 1280px images confirms legible glyphs and clean baselines; no extra crop is required for their large type.
- Spacing: the persistent second paragraph lifts above the contact row; restart stays below. 320x568, 390x844, 568x320, 600x800 and 768x1024 were inspected with no horizontal overflow. ending-mobile.png is 390x844 at 1x. Portrait text wraps naturally; contacts and restart remain visible.
- Colors: muted teal sky, pale warm horizon, pink cloud sea and plum foreground match the requested atmosphere. The original layered artwork, mountains, right rock and cloud motion remain. Only ending saturation/contrast/brightness and type styling changed; loader/main artwork, resolution and lighting are untouched.
- Imagery: original landscape and full texture dimensions retained. Native cloud motion and contact-time blur release remain. No reference logo, navigation or marketing copy was imported.
- Content: portfolio-content.json is unchanged (SHA256 4CFF6D1AD7184C6CD5A1B25D9608213165365EE38E987A4873E79D9B5A90B1E2). The original two bilingual statements are now rendered directly; unused glyph-outline JSON is no longer imported into the ending bundle.

Interaction verification:
- Actual profile shortcut, all six work pages, upstairs contact and ending completed through the browser. The work shortcut still automatically opens SWEATIE 01/06; only floor guidance now ends at WORK_GUIDANCE on the room centerline.
- One native PNG includes both white dot and light on world, HUD, menu and ending. DOM overlay is hidden there, so no separately following halo or stale press-point ghost remains. Settled readers retain the exact-position difference-blended DOM dot; 3D rendering is paused there. Hardware end-to-end latency was not instrumented.
- Gradient premultiplication initially produced dark RGB at extremely faint alpha. Pixel normalization fixed it: all 448 visible pixels of the captured native-cursor.png are pure RGB 255/255/255. Encoding is cached outside pointer input and uses a tiny CPU 2D surface.
- Browser checks at all four viewport corners and center resolve PNG cursors with hotspots 0/0, 47/0, 47/47, 0/47 and 24/24. No DOM duplicate is shown. Captured drag/release returns to native tracking without Pointer Lock or its browser notice.
- floor-route.png shows solid white radiance accompanying arrows along the safe right-side pool passage. Collision-checked corner fillets and look-ahead/behind tangents remove abrupt segment rotations. Route-ordered reveal/fade runs in the instanced shader, without rebuilding matrices or buffers per frame. Reduced motion stays steady.
- Cloud-Letters-BGM-proposal.wav is a separate 48-second original synthesized score (80 BPM, glass keys and warm pads; no recordings or third-party samples). It is 44.1kHz stereo PCM, peak .56 and RMS .115. It remains outside public assets and AmbientMusic. The Noomo site was consulted as the reference; its full source recording was not retained as a deliverable.

Comparison history: separate native-core / DOM-halo lag was replaced with a coupled native bitmap; faint-fringe RGB rounding was corrected; edge fallback was prevented by cursor hotspot adjustment. A cropped wide capture was replaced with matched full-view evidence. No actionable P0/P1/P2 findings remain. Exact proprietary English letterforms would require a licensed font; this disclosed alternative is an intentional limitation.

Validation: npm test — 158 passed, zero failures. npm run build passed. Actual scene/ending/fixture console checks had no errors or warnings. Vite retains its pre-existing large-chunk advisory. Browser viewport override was reset; owned QA tabs, source fixtures and generated QA assets were removed. Existing user tabs were preserved.

final result: passed

# Sunset, varied courtyard planting and monochrome glass

## Slower neon, racing arrows and one quest route, 2026-10-21

Revised references: dark pin OFF versus white-filled pin ON; native browser
Pointer Lock notice; white racing-style floor directions; desktop three-control
positions; mobile missing captions. Replaced the prior fast 0.5s blinking with
3.2s continuous cursor/prop fades and 4.8s floor fades, without an invisible hold.

The native white dot now contains no gradient or animated alpha. A normal-blended
DOM white halo paints its light independently; the duplicate DOM core is hidden
only in native world mode. Partial reader inversion remains intact. Native
cursor images are cached by radius (37 frames rather than radius*glow), and
raw pointer events still avoid React updates/layout reads. Pointer Lock is
removed entirely, retaining captured dragging and hidden cursor while rotating.
This removes the browser Esc notice and intentionally ends lock-entry OS cursor
position restoration, as explained to the user before implementation.

Floor guidance uses raised white solid arrowheads (10cm), white radiance and a
small ground shadow. Four instanced layers share one geometry and are reused
when the route changes. Route sampling and floor rays run only when refreshing
a quest/origin, never each frame. nextWayfindingTarget selects the earliest
incomplete profile/work/contact quest for all 256 completion combinations.
The actual content still requires all six works to complete its middle quest.
There is exactly one path, and none after all three quests are complete.

Profile guiding now goes beside the stairs on the right of the pool, including
replanning. Tests sample every segment from OUTDOOR, the right bank and upstairs,
confirming dry clearance and right-bank passage. A visitor already physically
on the left bank exits around the far end before using the right approach;
manual walking still retains its original collision-safe left passage.

Desktop tools occupy the former profile/work/library button locations in the
order Control guide / Shortcuts / Wayfinding. Shortcuts contains all three old
destinations; phone and desktop share that menu. Phone captions are visible
under guide and shortcut icons. Enabled wayfinding is white-filled with a black
pin; OFF is dark with a white pin. Initial state is enabled.

Validation: npm test passes all 155 tests; npm run build succeeds with its prior
large-chunk advisory. Browser plugin absent; CUA IAB 2 is used for actual localhost
QA. No texture/model/loader/ending image or source content change was required.

Actual IAB checks passed at default desktop 1280x720 plus 390x844, 320x568 and
768x1024. Desktop tool centers occupy the original three destination positions;
all three mobile captions are display:block. Initial navigation is white/black;
OFF settles to rgba(17,17,17,.72) with a white pin and hides the floor arrows.
Normal profile completion changes the single route from gallery (13 projected
markers) to atelier (7). After restart, completing all six works first retains
gallery (7); completing profile then skips the completed work quest and selects
library (19). Completing CONTACT clears target, markers and paths to null/0/0.
The original complete warm ending and restart both worked. No framework overlay,
blank page or relevant console warnings/errors appeared. Captured camera dragging
worked without pointer lock; native cursor CSS contained no gradient while its
normal-blended DOM white halo remained visible. Reader blending stayed difference.
Screenshots: workspace outputs/quest-navigation-revision/, outside tracked source.

## White neon dot and floor wayfinding, 2026-10-21

Flow under test: localhost:4173 -> loader -> world cursor/drag -> floor guidance
toggle -> mobile/desktop shortcuts -> native readers -> original ending.
Browser plugin not available; the supplied CUA browser bridge was used on the
existing IAB browser 2. No Playwright installation or external browser launch.

The latest reference is a 12px-looking white dot, not the prior hollow mint ring.
Implemented 11px idle diameter, 14px hover and 7px pressed, all center-preserving
circles. A white radial halo pulses on a shared half-second cosine cycle; its
steady core stays visible. Native world cursor frames are cached by radius/glow;
reader/edge overlays retain exact position sampling and partial difference blend.
Only the canvas cursor variable changes, without re-rendering React on movement.
Final visual QA caught a colored dot over the ending sky. Difference blending is
now scoped to detail/control dialogs; the world, loader and ending retain white.

Unseen tablet/frame/note cues now use the same cycle, with no dark hold interval.
Blue floor triples follow the existing safe routes to all three readers. The
actual scene produced 49 projected markers with three shared instanced draws;
they are built once during loading and participate in the existing GPU warmup.
The white pin toggle starts on. Desktop places it below controls; mobile places
it below auto run, at x22/y158 with a 40px circle at 390x844. Desktop and mobile
toggles updated both aria-pressed and actual scene visibility. Mobile profile
showed a black dot on its white content via difference blending.

Held look uses native Pointer Lock and relative deltas, with anchor restoration
and late-grant cancellation covered by tests. IAB rejected actual native lock
with WrongDocumentError; the independent one-canvas probe failed the same way
without pointer capture. Earlier IAB runs also returned Chromium UnknownError.
The actual drag hid the cursor and restored the DOM dot to down (640,400) after
release at (900,440). OS pointer restoration cannot be verified in this IAB host.
Supported browsers restore their saved native lock-entry position on unlock;
see https://www.w3.org/TR/pointerlock-2/ . Denied/unsupported cases retain ordinary
captured dragging and the visual anchor fallback, without bypassing browser rules.

Removed the experimental GPU fence gate because comparative measurements did
not establish better cadence. Kept safe CPU improvements: no unused hint checks,
static body direction reuse, support caching and pointer record reuse. All native
textures, lighting, geometry, render scale, shadow/water buffers remain unchanged.
The content SHA256 remains 4CFF6D1AD7184C6CD5A1B25D9608213165365EE38E987A4873E79D9B5A90B1E2.
Production build succeeds (Vite retains its existing large-chunk advisory).

Final validation: all 154 node tests pass, including rejected/late native locks,
relative drag input, native/DOM cursor switching, isotropic dot geometry, shared
half-second pulse, projected floor glyphs and the prior reader/route/asset tests.
Checked localhost:4173 in IAB at 1280x800, 768x1024, 390x844 and 320x568. Page identity,
nonblank rendering, no framework overlay, screenshots and toggle interactions
passed; browser error/warning logs were empty. PROFILE opened automatically,
the work shortcut opened SWEATIE 01/06, all six projects retained their original
11 external links, and the library shortcut opened CONTACT. Its details and
legal copy remained visible. No external link or contact action was activated.
CONTACT settled at transform:none after the live 768-to-desktop resize. The
complete warm ending retained its Korean/English second paragraph and contacts;
floor guidance was absent throughout that sequence. No console errors appeared.

Screenshots and temporary probes are kept outside tracked sources, under
C:/Users/user/Documents/Codex/2026-10-13/code/outputs/neon-wayfinding/ .

## Raw pointer follow and restored hidden look drags, 2026-10-20

Restored immediate hiding on primary mouse down on the world canvas. The same
pointer remains hidden through the look drag, with native cursor:none retained;
release restores the ring at the current coordinates. Capture loss also restores
it; cancel, blur, hidden-page, media changes and unmount clear state safely. Ring
shape RAF is suspended while hidden. UI buttons and reader drags still show the
pressed ring, retaining difference blending and the viewport edge inset.

Supported browsers now feed a passive capture-phase pointerrawupdate listener
directly into the existing transform update. The fallback pointermove path stays
available. Both select the newest real coalesced sample, rejecting delayed older
timestamps, without interpolation/prediction, layout reads or React pointer state.
Only changed transforms are written. The W3C behavior used here is documented at
https://www.w3.org/TR/pointerevents3/#the-pointerrawupdate-event and the coalesced
sample section. Do not claim OS hardware-cursor latency or a universal latency
number: the adaptive ring still depends on browser painting.

Browser plugin absent; CUA exercised the actual production build at localhost:
4173 in a temporary instrumented copy of its index. The browser reported raw
input support. A real 300px look drag generated eight held moves; all eight had
the ring hidden and native cursor:none. Its primary down was already hidden;
pointerup/lostpointercapture both restored the ring at translate3d(916px,416px,0).
Five subsequent moves, including (0,0) and (1279,799), retained exact clamped
positions. Raw handlers painted in the same dispatch when the ring was visible.
The profile shortcut stayed visible on press and automatically opened normally.
A native drag inside PROFILE retained its pressed ring throughout, and the white
surface still rendered the ring black. Screenshots and native event histories are
in workspace outputs/cursor-drag-fix. No scene/render-quality/content files changed.

All 145 tests pass, including a new regression for newest coalesced coordinates,
delayed-event rejection and normal-event fallback. Production build and whitespace
checks pass. No runtime errors; the unchanged Three shader emitted one benign
driver precision warning involving values around 1e-17. Actual rendering was normal.

## Restored afternoon ending, adaptive ring and first-visit preparation, 2026-10-20

Latest user request supersedes the blue morning ending below. Removed the morning
shader grade and matching SVG filter; restored the original warm source palette,
subtle contrast veil and warm text shadows. Actual worker-rendered desktop/mobile
captures confirm the afternoon colors, original mountain/rock arrangement and
moving banks. The persistent second Korean/English paragraph, lift, contact fade
and blur release remain intact. Complete-stage inspection showed blur(0px), no
remaining color filter, native 1280x800 cloud rendering and an active worker.

The ring now paints translation inside the passive pointer event, with no extra
RAF hop. Only the original spring/shape motion uses RAF. A window bubble listener
in a temporary production fixture observed x=34,y=400 and translate3d(10px,376px,0)
in the SAME pointermove event after the document handler. Cached viewport sizes
avoid layout reads during movement. White-stroke difference blending inverts
only overlapping pixels; actual PROFILE, SWEATIE and CONTACT captures show a
black half over white paper and the other half over its darker surround. An
inside capture shows the full black ring. The same single element stays in the
native dialog top layer; (0,0) retains the full visible inset ring and cursor:none.
Forced colors disable blending and use Highlight; touch and reduced motion retain
their previous behavior. No per-pixel JS reads, React pointer state or layout
sampling was added.

Scene assembly now yields at real preparation boundaries; unique source textures
upload in short batches. Shader preparation uses the composer's real HDR format
instead of compiling the screen variant first. A disposable 1px target primes
out-of-frustum vertex/index uploads, then restores every culling flag and target.
The live main buffer, image dimensions, material/shadow/water settings and existing
quality policy are unchanged. Final production diagnostics recorded 37 unique
textures and 393 mesh candidates. Tests cover deduplication, HDR format, source
buffer preservation, failure/abort cleanup and render-state restoration.

The initial shortcut's remaining ~330ms pause was also reproducible in the CPU
route planner. All twelve directed routes between the four fixed arrival poses
are now prepared during loading, yielding between searches. Cache consumers get
independent points; destination facing remains current; tiny floating-point arrival
offsets validate their first segment. Other positions use the original planner.
All twelve cached routes passed the original physical floor/stair clearance tests.
The final actual tour retained all three arrival/auto-open behaviors, first work
01/06, all six project transitions, upstairs contact, ending and restart.

Local instrumented before/after files are in workspace outputs/cursor-loading-fix.
Before: a 14,459ms startup long task and a 332ms first-shortcut long task. Final:
largest startup task 537ms, with no >=50ms task during the initial shortcut route;
reader opening/layout still has separate long tasks. Ready times were 19,912ms
before and 5,435ms in the final run, but browser/driver caches and timing differ:
these are local diagnostics, NOT a portable speedup or a zero-stutter claim.
The eight-second loader storyboard and honest readiness progress remain unchanged.

Browser plugin absent; CUA tested the production build at localhost:4173. Desktop
and 390px resize checks retained readable content; all three white reader surfaces
passed partial-cursor inversion. Actual tour console had no errors or warnings.
All 144 tests passed; production build and whitespace check passed. Content SHA256
remains 4CFF6D1AD7184C6CD5A1B25D9608213165365EE38E987A4873E79D9B5A90B1E2.

## Final studio light, edge cursor, adaptive icon and morning farewell, 2026-10-20

Added a single bronze wall cylinder centered above the left studio desk. A native
ray finds the front slats at z=-2.53233; the lamp center is [-3.995,2.45,-2.46733].
It retains the original 71mm-radius/330mm-height profile and 49mm opal ends, with
three static meshes and an original-strength source in the SAME four-light pool.
The existing native assets, shadow maps, other fixtures and quality policy stay.
The rendered studio capture confirms a mounted body and a warm downward light.

Replaced the native animated cursor bitmap with one SVG, retaining its mint ring,
breath, hover and press geometry. This avoids browser edge fallback. Pointer data
stays in refs/locals, position paints once per RAF, shape at most every 40ms and
unchanged root attributes are skipped. Only one element/observer/RAF loop exists;
visibility/unmount clean up correctly. A 16px center inset keeps every stroke on
screen. The ring follows native dialog top layers and never receives input.
Actual mouse checks at all four corners and edge midpoints retained cursor:none
plus the visible ring. PROFILE and the small controls dialog retained it too,
including the upper-left corner OUTSIDE the controls panel. Both volume sliders
computed cursor:none; no I-beam or changed volume preference was introduced.

Traced the loader mark's original alpha into four SVG contours (outer silhouette
and three holes), removing only tiny isolated alpha speckles. Black/white variants
share the exact path; the original bitmap is untouched. index.html provides an
adaptive SVG fallback and the production startup listener chooses black/white
from prefers-color-scheme, including subsequent changes. Actual browser fixture
buttons exercised the same installer and switched favicon-dark.svg/light.svg;
both variants loaded and rendered at 16, 32 and 96px. No OS theme was changed.

Ending uses an affine linear-RGB blue morning grade in the SAME cloud shader,
with a matching SVG color matrix on the compatibility photo. Original image,
resolution, UVs, mountain placement and all moving bank geometry remain. A forced
no-WebGL fixture confirmed the blue compositor fallback. The actual worker path
also rendered normally, with no extra texture or postprocessing pass.

The second handwritten Korean/English section now persists to the final screen.
It lifts for 2.8s beginning at secondOut (14.8s), while contacts begin a 2.8s fade
up at complete (16s). Background blur remains 5px until that contact entrance,
then clears over the original 1.8s. The added invitation has been removed. DOM
traces from both the fixture and ACTUAL full portfolio tour showed the same SVG
mask id in second / secondOut / complete, proving no remount or rewriting. They
recorded contact opacity 0 and blur 5px at entrance, then visible contacts and
blur 0. Desktop and 390x844 mobile captures confirm no overlap.

Browser plugin not available; used the built-in CUA browser bridge at localhost:
4173. The actual complete tour exercised PROFILE, all six works, upstairs CONTACT,
the new ending and restart. All four library sconces/two area fills remained.
No actual-app console errors. All 139 tests passed; production build succeeds.
Core content SHA256 remains 4CFF6D1AD7184C6CD5A1B25D9608213165365EE38E987A4873E79D9B5A90B1E2.
Evidence: Codex workspace outputs/morning-finish, including studio-sconce.png,
actual-ending-desktop.png, ending-mobile.png, guide-cursor-edge.png, lee-icons.png,
actual-ending-trace.json and tests.txt. Temporary copied build pages/chunks are
removed by the final build; no QA route or camera pose enters production source.

## Workshop loader, brighter photographs and unchanged-quality optimization, 2026-10-20

Latest storyboard: loader-wall / loader-library / loader-atelier / loader-front.
The former third frontal photograph is now fourth, with its asset unchanged.
The new close ground-floor workshop photograph comes from the actual production
scene, at logical [-1.35,4], yaw .03, pitch .10, eye 1.53. The capture used a
1600x789 native buffer, no HUD or cue overlays. Its 857312-byte WebP uses lossless
encoding; decoding reproduces every RGB byte of the PNG. All older photos remain.
Only loader brightness (.9 to 1) and the existing shade opacity were lifted.
LEE, honest resource progress, four two-second shots, dissolves and timeline stay.

Safe implementation changes:

- Cloud meshes share the original vertices, UVs and index buffer. Only fully
  transparent top rows are omitted: 6912 to 4160 submitted triangles, a 39.8%
  reduction. Texture, shaders, resolution, wind and parallax remain identical.
- The four CSS compatibility fog animations stop only after the opaque canvas
  finishes fading in. A renderer failure restores them. Actual ending checks show
  renderThread=worker, is-composited, fallback display:none and continuous time.
- Static light fixtures retain world positions and ranking records; unchanged
  camera/room/quality reuses the result. Original source-index tie breaks,
  0.2-second cadence, room light selection and frame-by-frame damping remain.
- Nearby entries share one visible-target list and reuse ray hit buffers. The
  same grounded/dry/range/facing checks reject impossible entries before rays;
  real activation still checks current occlusion. Pointer picking reuses buffers.
- Viewed/hidden and unchanged cues skip redundant material writes. Movement
  audio schedules a gain target only on a transition, keeping all tracker updates,
  original samples, levels, volume controls and time constants unchanged.
- Preserved PROFILE/CONTACT HTML and handwritten glyph trees are memoized.
  Removed 94 unused legacy reader/old-photo selectors and their dead keyframe,
  about 6.2k source characters, retaining mixed selectors that still apply.

No main render-scale, AA, texture dimensions, geometry quality, water reflection,
shadow maps, lighting values, adaptive-quality policy or content changes were
used for performance. The main comparison retains buffer 1280x800 and the same
existing quality field of .7. Timing logs are single-run observations with GPU
variation, not a portable FPS-gain claim. The original portfolio-content.json
SHA256 remains 4CFF6D1AD7184C6CD5A1B25D9608213165365EE38E987A4873E79D9B5A90B1E2.

Validation: all 135 tests pass, including new geometry/duplicate-progress/raycast/
cue regressions and repeated audio-target checks; production build succeeds.
The dedicated Browser plugin was unavailable, so the built-in CUA browser bridge
tested the real preview. A complete actual tour verified desktop PROFILE arrival,
mobile work arrival at SWEATIE 01/06, every work and all 11 original links, upstairs
CONTACT and its original legal text, both farewell paragraphs, final contact and
restart. Library arrival retained all four sconces and both fixed area lights.
Ending blur measured 5px during the first paragraph and 0px at final contact;
cloud time continued, no contact overflow, and the tour had zero console errors.
Reader resize checks at 320 / 390 / 768 / 1280px kept transform:none and no overflow.

Exact static screenshot comparison: cloud before/after at 1280x800 has zero
changed pixels; the matching mobile PROFILE fixture at 390x844 also has zero.
Loader desktop/mobile checks use the production component paused at shot 3 for
inspection only (mock progress 96% in the temporary fixture). Production progress
and timing remain real. Temporary copied build chunks/pages are removed by the
final build. Evidence and logs are in the current Codex workspace under
outputs/quality-optimization/{before,after}, including loader-workshop-desktop.png,
mobile readers, actual ending captures, tests.txt and pixel-comparison.txt.

## Upstairs library viewpoint for loader shot 2, 2026-10-20

The user found the second and third courtyard shots too similar. Shot 2 now
uses loader-library.webp (1600x1000, 231568 bytes), a fresh photograph of the
actual current scene matching the supplied library/terrace reference: bookcase
and desk left, ivory armchair center, trailing plants and terrace rail right.
Capture-only pose: logical [-4.65,3.8,-.3], yaw -1.43, pitch -.10, eye 1.275.
The photography helper was isolated to copied build chunks and removed by
the final build; production camera, walking and seating were not edited.
The shared storyboard updates both background and second thumbnail. The old
loader-foliage.webp is retained; all other shots and timing remain intact.
Existing loading storyboard checks (including asset budgets) and production
build passed. Native browser loader checks cover desktop and phone crops.
Portrait crops anchor this shot at 30% horizontally so the bookcase and desk
remain visible. The actual main loader loaded the new second-shot URL at 96%
and reached normal entry without console errors. Still-frame screenshots use
the production LoadingScreen component paused at its three-second visual
state in a temporary QA page; that page does not change production timing.
Evidence: outputs/final-polish/loader-library-source.png and loader-library
desktop/mobile screenshots in the Codex workspace used by the previous QA.


## Final responsive readers and atmospheric polish, 2026-10-20

Implemented the supplied loader storyboard as four two-second shots with
cross-dissolves, continuous camera drift, LEE, a fine real-progress line and
four thumbnail markers. New WebP photographs come from the actual updated
scene (1600x1000, 231208 / 319778 / 341378 / 295682 bytes); old photos remain.
No generated replacement house or copied reference annotations are used.
The still reference provides scene order and visual direction, not measurable
video timing. The authored eight-second sequence holds only fast loads;
reduced motion removes the hold. Real progress still reaches 100 only at
scene readiness. Retry resets the scene attempt and the visual film together.

Brightened only the fixed afternoon sky palette. Added two slow drifting
horizon fog banks with soft changing edges, separate from the original three
foreground banks. Mountains, right-edge rock and clean sky remain protected.
The existing paragraph blur, clear final invitation/contact, font and timing
are preserved. Worker WebGL compiled successfully in the actual browser.

The stretch bug was a paused 3D project's stale corner matrix being reapplied
after resize. Reading now uses native transform:none; mobile opening/closing
still interpolates from/to the real physical prop. All <=768px work readers
are tall scrolling pages, mockup first and complete information below, with
no tabs. Selecting another work resets scrollTop. Contact has sufficient
responsive height, wrapping and accessible overflow. Profile contacts share
the portrait baseline beside the image, and all five section bodies start
under their headings. Narrow education dates now wrap within their column.

Browser plugin not available; validation used the built-in CUA Playwright
bridge against localhost:4173. Actual app shortcuts opened PROFILE, CONTACT
and first work SWEATIE through the unchanged physical handoff. All six mobile
works retained their three metadata rows and all original links (11 total).
Scrolling reached the final links; changing a scrolled work reset 93px to 0.
Live settled-reader resize at 320,360,390,480,600,768,769,1280px retained native
16px description text, transform:none and no horizontal overflow. Final
viewport bounds were also checked after ResizeObserver settled.

All five profile tabs passed overflow checks at 240,280,320,768px; profile
photo and data bottom coordinates matched. EDUCATION / LICENSE / ACHIEVEMENT
all had a 24px title-to-content gap. CONTACT passed 240x568,320x568,568x320 and
768x360, using vertical overflow only where needed; phone, email, social and
legal copy remained present. A work reader also passed at 240px.

Observed the actual loader transition through all four scenes while honest
progress remained at 96% during compilation, followed by normal app entry.
Ending passed all original stages with a worker canvas and 5px paragraph blur,
then blur(0px) at the final contact stage. Two clear-stage frame captures had
mean RGB changes of 9.054 in distant clouds and 7.719 in foreground clouds,
versus 0.238 in clear sky, confirming the distant layer is no longer frozen.
No application errors/warnings in final main/mobile/reader/ending console logs.
Reduced-motion paths were checked in code and automated timeline tests, not
by changing the user's system preferences.

131/131 automated tests passed; production build and whitespace check passed.
Original portfolio-content.json SHA256 remains
4CFF6D1AD7184C6CD5A1B25D9608213165365EE38E987A4873E79D9B5A90B1E2.
Evidence and verification.json are in
C:/Users/user/Documents/Codex/2026-10-13/code/outputs/final-polish/.
Temporary photography/component test pages and copied runtime chunks are
removed after QA. No commit, push or deployment was performed.


## Shortcut menu arrival automatically opens content, 2026-10-20

Removed Terrace from the shared desktop/mobile menu. The remaining profile,
work and upstairs shortcuts now open their corresponding physical reader on
successful arrival, without a second E/button interaction. Work goes to the
first rear-wall frame and automatically opens SWEATIE, 01/06; gallery page 0
is selected first. Its new viewpoint [-1.2,-4.9] is within interaction range
and retains traversable return routes. Internal terrace/water-exit navigation,
seating, manual interaction, all content and previous visuals are unchanged.

WalkController keeps an explicit guide target and delivers optional onArrive
only after successful orientation settling and camera application. Cancellation,
pause, reset and a replacement clear/replace the target, and closing the reader
does not re-open it. The scene calls the existing interaction.begin; proximity,
occlusion, floor, water/airborne and presentation-state checks remain in force.
No DOM-opening shortcut, direct setDetail or visibility bypass was added.

Added behavioral tests for all three successful arrivals, the actual camera
pose and same-place reentry; interruption/pause/reset/replacement; and first-slot
E-equivalent activation, real physical reader progression and no reopen after
closing. Updated the prior work-range test to target the first rear frame.
Full test suite: 128/128; production build and whitespace check passed.

Browser plugin not available; used CUA Playwright on the actual localhost:4173
production app. Desktop and 390x844 mobile both showed only three menu entries.
Selected each destination and waited for its real detail-dialog data-motion to
be reading, without pressing E or the nearby interaction button. PROFILE,
SWEATIE 01/06 (previous disabled) and CONTACT all opened automatically on both
surfaces. Mobile close left zero detail dialogs and quest counts profile 1/1,
work 1/6, contact 1/1, with no horizontal overflow. Production console logs were
empty. URL/title, meaningful render and no framework overlay checks passed.
Existing Three/scene chunk size advisories remain. Physical touch devices and
other browser engines were not exercised. No temporary QA route was needed.

Evidence outside repo: workspace outputs/shortcut-auto-open/desktop-menu.png,
desktop-profile-auto.png, desktop-work-01-auto.png, desktop-contact-auto.png,
mobile-menu.png, mobile-profile-auto.png, mobile-work-01-auto.png,
mobile-contact-auto.png and tests.log.


## Restore the original small right-edge rock, 2026-10-20

Latest user correction restores only the small far-right rock. The main mountain
remains left and the center stays clear. Built-in image editing used
cloud-journey-left.webp as target and cloud-journey-clean.webp as reference for
the original right rock. Final prompt: restore only the original small far-right
rock at its original position/scale/lighting; preserve the target's left mountain,
clear center, sky, clouds and palette; do not restore the old central mountain.
Saved sibling asset public/assets/loading/cloud-journey-balanced.webp
(1673x940, 39830 bytes); original variants remain. Both worker and CSS fallback
now reference it. No changes to photos, text, timing, lighting or cloud velocity.

Three existing landscape tests and production build passed. Checked the real
production landscape worker with the final-stage markup/styles at localhost:4173,
desktop, 390x844 mobile and wide desktop. Restored rock stays at the far-right
edge, central copy remains clear, no horizontal overflow or relevant console
errors. Source-only preview bootstrap was removed; the production worker and
renderer were unchanged. Temporary preview files removed after QA. Evidence:
workspace outputs/restored-right-rock/ending-desktop.png, ending-mobile.png and
ending-wide.png. Existing large Three/scene bundle advisory remains.


## Matched cornice-light inset and left-side ending composition, 2026-10-20

Raised only the lower cornice LED core and its soft halo by 0.301 logical meters,
from 3.205 to 3.506. Both now share the upper story's preferred 0.294m inset from
the timber top. Upper/return height stays 6.756; geometry depth, warm color,
brightness, plants, joinery, white ceilings and navigation remain. A native
geometry test verifies equal top insets and unchanged upper placement.

Recaptured the finished production scene from the original OUTDOOR stair-facing
view: house-stair-aligned.webp (1600x1000, 315640 bytes) and its mobile sibling
(900x1068, 190160 bytes). LoadingScreen and both responsive HTML preloads use the
new photos. The actual integrated loader selected the new desktop asset and
advanced from 17% to 100%; original LEE/photo animation remains.

The built-in image generation tool edited cloud-journey-clean.webp, moving all
mountain silhouettes to the leftmost horizon and clearing the middle/right.
Final asset: public/assets/loading/cloud-journey-left.webp, 1673x940, 38810 bytes.
Kept the original artwork; worker and CSS fallback both reference the new one.
Maintained cloud velocity, independent worker, parallax, palette, clean upper
sky, stage-specific blur and the previous invitation font-only enlargement.

Final image-edit prompt:
> Edit the provided existing wide cloud landscape. ONE composition change only:
> relocate ALL visible mountain silhouettes from the middle and far-right horizon
> to the extreme LEFT edge. The main mountain summit should be near 5% of image
> width, and the entire visible mountain group, including all small foothills,
> must remain within the leftmost 16% of the canvas. Keep it distant and natural
> at the same cloud-sea horizon height, with its base obscured by the large clouds.
> A modest smaller scale and natural cropping at the left border is fine to fit
> this placement. The broad middle 80% and right side of the horizon MUST have
> only smooth clean gradient sky transitioning into soft clouds, with NO peaks
> or rocky silhouettes: this area is reserved for centered white text at every
> viewport size. Fill the original central and right mountain locations naturally
> with the existing cloud sea/sky. Preserve the existing smooth cloudless sage/
> teal-to-gold afternoon sky, dense peach/mauve foreground cloud sea, lighting,
> color palette, framing, wide aspect ratio, and overall photographic softness.
> No other changes. No new sky wisps, no objects, no text, no moon or planets.
> The attachment is the edit target, not a loose style reference.

Browser plugin not available; used built-in CUA/Playwright at localhost:4173.
Validated the actual Three.js scene and an isolated mount of the production
EndingSequence/worker, using copied compiled modules with only the unrelated
world bootstrap removed. The production component's timers and DOM were used
unchanged. Captured both paragraph stages and final invitation at desktop and
568x320 landscape. Checked final composition at 320x568, 390x844, 768x1024,
1024x768, 1440x900, 1920x1080, 844x390 and 568x320. Peaks stay left on wide views
and outside the centered portrait crop; no text/mountain overlap or horizontal
overflow was observed. The original pen timing and final invitation remain.

| Check | Result |
| --- | --- |
| Production page URL/title and meaningful scene | Pass |
| Framework overlay and shader/console errors | None |
| Lower/upper LED relationship in live 3D | Pass |
| Actual ending stage transitions and worker | Pass |
| Eight responsive viewport compositions | Pass |
| Restart control in isolated production ending | Pass |
| Unit tests and production build | 125/125; passed |

Existing large Three/scene chunk advisories remain. Whitespace checks pass and
portfolio-content.json retains its original SHA256. Physical devices and other
browser engines were not exercised. Temporary photography/ending pages and
copied runtime modules were removed after verification. Evidence outside repo:
workspace outputs/aligned-lights-left-mountain/, including two-floor-lights.png,
ending-desktop-first/second/complete.png, all responsive screenshots, stage/layout
JSON and tests.log.


## Interior oak joinery, stair-facing loader and clean cloud ending, 2026-10-20

The planted first/second-story fascias now match the actual room's oak joinery:
271 physical vertical boards, 43mm wide at 78mm pitch and 48mm deep, with small
bevels and recessed darker backing. Fronts and the upper return use two shared
static draws. Original oak albedo/normal maps and aged finish remain; original
fascia baked irradiance is projected onto each new vertex using a temporary BVH.
The source architecture, plants, concealed LED lines, white soffits, navigation,
black courtyard coping and exterior ivy remain intact.

The photo loader now uses the latest scene from the original OUTDOOR stair-
facing view: house-stair.webp, 1600x1000 / 293922 bytes, and portrait
house-stair-mobile.webp, 900x1068 / 173136 bytes. Original and earlier frontal
photos remain. Actual loader DOM selected the new desktop source at 78% and
mobile source at 84%. Both final painted screenshots show 88% with the original
LEE/progress treatment. Replaced the outdated cloud preload in index.html with
aspect-ratio-specific stair-photo preloads so the new photo paints promptly.

Edited only the wispy upper sky of the ending artwork, retaining the mountain,
dense cloud sea and afternoon palette. The new cloud-journey-clean.webp is
1673x940 / 41042 bytes; both worker and CSS fallback use it. Foreground banks
now move rightward at five times the old UV velocity with greater opacity.
Continuous mirrored horizontal wrapping replaces the tiny repeating crossfade;
sky and mountain peaks stay stationary. Between final-screen captures three
seconds apart, image correlation measured about 24px of rightward cloud motion.

Browser plugin not available; used the built-in CUA Playwright bridge against
localhost:4173. Checked desktop 1280x800 (captured viewport 1280x720), phone
390x844 and direct scene photographs at 1600x1000 / 900x1068. Target flow:
photo loader -> profile -> all six works -> contact -> both ending paragraphs
-> final invitation/contact -> restart. All eight content visits registered;
restart reset all three quests. The ending worker advanced through 524 frames
without a gap above 50ms in the trace; blur was 5px through the paragraphs and
0px on the completed invitation. Mobile worker resized to 390x844; no horizontal
overflow. Page URL/title, nonblank render, overlays, screenshots, interaction
and console checks passed; production error/warning log was empty.

npm test: 124/124. Production build and whitespace checks passed; existing
large Three/scene chunk advisories remain. portfolio-content.json retains its
original SHA256. Temporary photography HTML/runtime copies were removed by
the final build. Physical devices/other browser engines were not exercised.
Evidence outside repo: workspace outputs/stair-facade-clouds/, including the
two live loader screenshots, both-floor oak view, desktop/mobile ending,
ending-trace.json and tests.log.


## Layered terrace planting, ring cursor and current facade loader, 2026-10-20

User supplied a new reference for both planted story edges and requested the
latest finished facade in the restored photo loader. The cornices now combine
photographed pointed foliage, airy shrubs, round trailing vines, dense fine
cascades and cream flower pockets, with irregular spacing and concealed warm
LED lines. Existing oak textures run vertically across the exposed fascia;
lightmap UVs, architecture topology, black perimeter coping and exterior ivy
remain. Only the legacy lower-band growth and named roof-cornice ivy are retired.
Soil is recessed behind the timber face. Plants use shared geometry/materials,
at most ten static draws and no per-frame growth. The source potted plant is
unchanged; only cloned foliage geometry/photographs are used in the cornices.

Range controls no longer match the editable-text I-beam CSS selector. They use
the native mint ring, hover and pressed motion. Volume-panel labels cannot be
selected accidentally. Actual mouse click + keyboard ArrowRight/ArrowLeft moved
music from 28 to 29 and back to 28, preserving the visitor preference. Both
sliders computed a custom URL cursor, textCursor=false, target=control, mode=hover.
WebKit track and thumb also computed the same custom cursor. Actions stayed at
the existing 100; the two buses and underwater filters are unchanged.

New loader images are direct photographs of the updated production Three scene
without HUD: 1600x1000 desktop / 336094-byte WebP, 900x1068 portrait / 180292-byte
WebP. LoadingScreen uses house-current.webp and house-current-mobile.webp, while
original house photos remain. Actual desktop progress 82/86/88 loaded the new
desktop source; phone progress 82 loaded the new portrait source. LEE, real
progress, original photo approach/shade and independent cloud ending remain.
Temporary asset-photography HTML/runtime copies were removed by the final build;
the local helper process was stopped. No capture route ships in the final build.

Browser plugin not available: built-in CUA/Playwright on actual localhost:4173,
desktop and 390x844 mobile. Checked page title/URL, nonblank loader -> live world,
no framework overlay, empty production warning/error log, volume interaction,
both cursor pseudo-elements, mobile overflow=false and current image sources.
Viewed the reference and actual facade at multiple iterations and verified both
final loader screenshots from disk. Added protection for preserving exterior ivy
and source plant/pot geometry, UVs and texture identity. npm test: 123/123; build
and whitespace checks passed. Existing large Three/scene chunk notices remain.
Physical mobile devices/other browser engines and exact leaf-for-leaf identity
with the supplied reference are not claimed.

Evidence outside repo: workspace outputs/terrace-planting/facade-desktop-final.png,
facade-mobile-final.png, loader-final-0/1/2.png, loader-final-mobile.png,
volume-cursor.png and volume-cursor.json. Earlier profile bottom alignment,
normal-weight role, black printed icons and ending focus/clear transition were
verified in outputs/ending-readability/ and remain in this build.


## Portrait baseline, readable ending and restored photo loader, 2026-10-20

Latest user correction and explicit loader clarification are implemented. PROFILE
identity data is bottom-aligned inside the same portrait-height area: actual phone
dd and portrait image both end at y418.875 in the 1280x800 reader. Existing copy,
field spacing and enlarged tablet bounds remain. Header role weight is now 400.
The full 1212x680 display capture is profile-screen-aligned.png; checked the actual
physical wake/handoff/reverse again. Mobile PROFILE has no horizontal overflow.

The user explicitly chose the original HOUSE PHOTO / LEE / resource-percent loader.
LoadingScreen now uses original house.webp / house-mobile.webp, original centered
signature sizing, photo shade and CSS approach. Cloud-worker readiness no longer
gates world startup. Verified the house loader at 0% and 100%, successful world
entry, and mobile currentSrc=assets/loading/house-mobile.webp with no cloud canvas.
The cloud worker remains solely available for the separate ending scenery.

Generated contact print now filters only phone/mail alpha silhouettes to black.
Original source PNGs and all cover/ring/content geometry remain intact. Captured
the real cover-turn and physical printed face before the DOM handoff: both icons
are black at contact-open-24/28.png and remain black in the reading state.

Both handwritten paragraphs use 5px background blur. The final invitation/contact
stage transitions through blur(.73639px) to blur(0px); actual final opacity=1.
A faint gradient shade ranges from 3.5% to 13.3% to 6.7% black; the underlying
cloud artwork, 3D banks and motion are unchanged. At 1280x800 Korean text is
53.76px (was 42.24), English 48.64px (was 38.4), invitation 38.4px (was 30.72).
CLEAR also grows slightly. Contact 21.76px and restart 18px remain unchanged.
At 390x844 invitation is 24px, fits x70.22..319.78, and both contact spans share
y452.20 with bounds x48.17..341.81. No horizontal overflow; final blur is zero.
Restart resets all three quests and removes the ending.

Browser plugin not available: built-in CUA/Playwright, localhost:4173, 1280x800
and 390x844. Repeated PROFILE -> six projects -> CONTACT physical opening -> both
paragraphs -> clear final background -> mobile resize -> restart -> mobile loader.
Page identity, meaningful screen, no framework overlay, warning/error logs empty,
screenshots and real interaction results passed. npm test: 121/121; npm run build
passed with existing large Three/scene chunk notices. Physical phones and other
browser engines remain untested. Original portfolio-content.json stays unchanged.

Evidence outside repo: workspace outputs/ending-readability/ contains loader-0.png,
loader-mobile.png, profile-bottom-aligned.png, profile-mobile.png, contact-open-*.png,
ending-first.png, ending-second.png, ending-clear-background.png, ending-mobile.png
and ending-focus-trace.json. Paragraph screenshots show the ongoing pen animation.


## White PROFILE, muted foliage and cloud ending, 2026-10-20

Latest user correction is implemented and supersedes the dark PROFILE and house
ending below. The role appears once beside PROFILE, with a 22px baseline-aligned
gap on desktop. White screen, dark copy, original skill colors and portrait are
restored; graphite housing and full prop/wake/reverse motion remain. The actual
1212x680 display capture is profile-screen-light.png. At 1280x800 the reader still
measures 1232x700; education lines measure 24px height / 24px line-height. At
390x844 the complete role takes a second header row, without overlapping close;
all five profile tabs were opened and their original content checked.

Only cornice leaves now use low, warm olive skylight (.38,.26,.14) and .025
emissive intensity. Exterior ivy stays unchanged; dense leaf/flower placement and
four instanced draws are preserved. Compared both in the rendered afternoon view.

Ending reuses the untouched LoadingLandscape component/worker and cloud artwork,
with an ending-only 3px blur. Both earlier bilingual pen-written paragraphs and
their timings remain. Final invitation is ordinary readable text exactly
'함께할 여정을 기다립니다.' with a 2.6s opacity-only fade, not SVG glyphs. Actual
opacity progressed 0 -> .66 -> .97 -> 1. Contacts remain one centered horizontal
row: both top=428.25px on desktop, top=449px on phone; phone bounds x48.17..341.81.
Restart stays lower-center and its computed outline style is none. Worker cloud
time advanced 6.33s -> 18.73s through the two paragraphs and invitation, and to
37.71s after mobile resize; max observed frame gap 67ms. Restart removed ending
and reset profile/project/contact progress to 0/1, 0/6, 0/1.

Browser plugin not available: used built-in CUA/Playwright at localhost:4173,
1280x800 and 390x844. Real route: PROFILE -> all six projects -> CONTACT -> both
ending paragraphs -> final invitation/contacts -> mobile resize -> restart.
Page title/URL, meaningful UI, no framework overlay, empty warning/error log,
screenshots and interaction results passed. npm test: 121/121. npm run build and
git whitespace check passed; pre-existing large Three/scene chunk notices remain.
No other browser engines or physical mobile hardware were tested.

Evidence is outside the repo in workspace outputs/light-profile-cloud-ending/:
profile-desktop.png, profile-mobile.png, cornice-muted-final.png, ending-first.png,
ending-second.png, ending-final.png, ending-mobile.png and ending-trace.json.
SHA256 of all seven loader sources/artwork and original portfolio-content.json
was checked before/after and is unchanged. Loader appearance and behavior were
not edited; the same component is simply also mounted in the ending.


## Original afternoon, wider PROFILE and an independent loader, 2026-10-20

Latest user request supersedes fixed morning and the sharp ending below. The live
world is now the original fixed warm afternoon: pink/peach sky, original warm sun
and hemisphere colors, one PMREM environment, with no clock or night transition.
Actual DOM remained lightingMode=afternoon / simulatedHour=17.00 after restart.

- Ending image computed blur(3px); both shade and veil remain fully transparent.
  Final tagline/contact gap is 40px desktop, 42.2px at 390x844. Phone and email
  stay on one line at y452.5, within x36.17..353.81 of the 390px viewport.
- PROFILE now measures 1232x700 at 1280x800 (max 1360x700). Desktop bottom panels
  use 24 columns allocated 7/9/8, so every education/date/achievement/license item
  fits on one line. All education and achievement text elements measured 24px
  tall / 24px line-height; role is one 28px line. Photo, content, skill icons and
  font sizes retained. The 1212x680 actual display capture is profile-screen-wide.
  Mobile retains tabs and measures 370x660 at x10,y92, with all details readable.
  Prop wake, homography handoff and reverse close remain, using the new full UV face.
- Artwork caption's vertical border computed 0px; other metadata rules, complete
  content, links and the existing five-second image float stay intact.
- Loader rendering moved to a dedicated OffscreenCanvas worker with a DOM-free
  Three renderer. The world import/build waits for the first loading frame.
  Compositor cloud banks animate during worker startup, with a bounded startup
  fallback; unsupported workers retain a compatibility path. Pause, visibility,
  abort, resize and image-bitmap/GPU/worker disposal are handled.
- Real heavy-load proof: main-thread DOM inspection timed out during world compile,
  while the worker advanced from .534s / 15 frames to 4.204s / 92 frames. Its
  maximum observed frame gap was 167ms rather than the multi-second main-thread
  stall. This reduces loading interruptions; it is not a claim of perfect frames
  on all GPUs. Desktop pointer input produced (-.311,-.249) at .150s / frame 6;
  phone worker produced (-.244,-.237), .133s / frame 5 at 390x844, 52% real loading.
  Cloud artwork orientation and rendering were visually checked during loading.
- Browser plugin not available: used built-in CUA/Playwright on actual 4173 preview,
  1280x800 and 390x844. Repeated the real route PROFILE -> all six projects ->
  upstairs contact -> final ending -> restart, then mobile PROFILE. Console clean.
  Full 121/121 tests passed; production build passed. Existing scene/Three large
  chunk advisory remains; the separate worker contains a 507kB raw Three build.

Evidence is outside the repo under task outputs/afternoon-loader: fixed-afternoon,
profile-desktop/mobile, artwork-no-divider, ending-final/mobile, loader-frame-* and
worker-load-trace.json/mobile-worker.json. Sources for the worker platform contract:
https://developer.mozilla.org/en-US/docs/Web/API/OffscreenCanvas and
https://developer.mozilla.org/en-US/docs/Web/API/DedicatedWorkerGlobalScope/requestAnimationFrame


## Fixed bright morning, 2026-10-20

Latest user correction supersedes the four-minute day/night cycle below: evening
felt frightening, so the live world is fixed at 09:00. Removed the elapsed clock
and nightly keyframes. Sky and environment/reflections are initialized together
before the one-time PMREM capture; sun, hemisphere, baked bounce, exposure and
water sun are applied once. Cloud drift stays active. Restart retains morning.
Focused morning/handwriting/cloud regression checks passed (3/3); production
build passed with the existing large scene/Three chunk advisory. Browser plugin
not available; actual localhost:4173 verified through built-in CUA/Playwright.
At 1280x800 the sky is bright blue with soft cream clouds; DOM lightingMode is
'morning', simulatedHour '9.00'. After 38.48 real seconds both values stayed
identical; restart and 390x844 viewport also retained 09:00. Console had no
errors/warnings. Evidence: task outputs/fixed-morning.


## Final polish and live day cycle, 2026-10-20

Browser plugin not available; validated the actual 4173 Vite preview using the
built-in CUA Playwright/DOM bridge, at 1280x800 and 390x844. No state injection.
Flow: walk to PROFILE -> open/close tablet -> visit all six actual projects ->
walk upstairs -> open/close contact -> watch both paragraphs -> final -> restart.

- Original two bilingual statements retained, now Nanum Pen Script / Allura SVG
  pen masks. Durations exactly 3x faster (4/3s, 1s, English delay .3s). Actual
  stages appeared separately, with a blank gap; both full handwritten statements
  visually verified. Final '함께할 여정을 기다립니다' sits above contacts.
- Final photo computed filter:none, transparent veil and no shade gradient.
  Restart receives real keyboard focus, outline:none/boxShadow:none, with an
  underline cue. Mobile contacts have identical top 442.406px, within 36.17..
  353.81px of a 390px viewport. Restart restores all quests to zero and controls.
- PROFILE measured 1120x640 at x80,y80 desktop, 362x620 at x14,y112 mobile.
  Both identity and mobile Skills tab checked. The real .tablet-display was
  captured at 1100x620 for the prop texture with full UV coverage. Homography,
  wake and reverse closing remain the existing tested motion path.
- Project image computed '5s ease-in-out infinite exhibit-float'; measured
  translation changed from -0.77px to +5.76px while frame and copy stayed still.
- Loader pointer input produced smoothed parallax (-.480,-.384), cloudTime .342s.
  Forward-only cloud offsets and long-load crop wraps covered by regression tests.
- Real world observed afternoon, 20:04 evening/night and overnight wrap to 02:18;
  a 21.602s measurement advanced from 02:18 to 04:29 (2.18 simulated hours).
  Sky and warm house fixtures visually checked; pure model covers every quarter
  second over two full days, midnight continuity and all color/light keyframes.
  Baked bounce, water sun, sky uniforms and sun direction follow the same clock.
- Replaced the library floor's hard step by a 2.2m smoothstep, and gave canopy
  leaves shared soft skylight while retaining diffuse volume and four instanced
  draws. Flower clusters occur every fourth growth node (previously third).
- Soft score remains 96s stereo/24kHz. RMS .03583 (previous .11685), peak .17584,
  seam .00343. Low band <250Hz energy amplitude ~19.3% of former version; bell
  note gains retained, continuous chord/bass voices shortened and attenuated.
  This is synthesis/data verification, not a claim of speaker listening.

- Final check: 121/121 tests passed, final loader/day-cycle focused checks passed,
  and production build completed. Existing >500kB scene/Three bundle warnings
  remain. Final actual mobile page was DIMENSION : GYU at localhost:4173, canvas
  390x844, document scrollWidth 390, no framework overlay and no console errors
  or warnings. Mobile loader parallax (-.376,-.401), renderSize 390x844 confirmed.
- Botanical totals: 12,147 leaves / 243 flowers in four instanced draws. Direct
  sunlight fades smoothly to zero at the horizon, with no illumination from below.
- Original portfolio-content.json and legacy afternoon-piano.wav SHA-256 hashes
  match the previous baseline; all original content and older recordings retained.

Evidence saved outside repo: task outputs/final-polish, including desktop/mobile
final, both full handwritten paragraphs, compact profile/Skills, floating artwork,
loader parallax and real world afternoon/night captures. Source text/licensed fonts
are documented by the lettering generator and public/fonts OFL notices.


## Continuous ink, compact contact, dark PROFILE and cloud journey, 2026-10-19

The latest user clarification applies black/white styling to PROFILE only;
project exhibitions retain their light paper and wood frames. This section
supersedes the older loader, contact spacing and ending details below.

- Contact reader measured 680x464.359 at 1280x720, retaining 760:519 proportions.
  All three row gaps are exactly 26px (previously 18px). Header/body padding was
  tightened; no contacts, legal text or hoverable social links were removed.
  Physical printed SVG matches the measured row and footer positions.
- PROFILE header, display, body and all five panels measured rgb(8,8,8) with
  white body text. Colored skill icons/photo are retained. Its real 1280x720
  reader was captured into profile-screen-dark.png for the physical tablet.
  The neighboring project reader was opened and visually remains white.
- Replaced per-glyph outline/fill animations with medial pen strokes extracted
  from the same locally licensed fonts. Each stroke gets its proportional share
  of a continuous sentence timeline, masking sharp original glyphs; no whole
  glyph opacity/fill animation. Simplified the paths to subpixel tolerance,
  reducing lettering data from 360178 to 75784 bytes. Ending is lazy-loaded:
  main JS 254.70kB, deferred ending 80.61kB (24.91kB gzip). The lazy ending
  explicitly restores canvas focus after its initial non-modal show.
- Real profile -> six projects -> contact -> close tour verified Clear/depart
  remains non-modal, then first/firstOut/gap/second/secondOut/complete. Captured
  partially written and fully written states for both paragraphs; no paragraph
  overlap. Final phone/mail share one horizontal line at the viewport center;
  restart is separately centered lower down. Restart restored all zero counters.
  A second real tour on the final mobile build reached the deferred ending and
  complete screen without a module error. At 390x844 the two contact row tops
  are both 411.906px; restart is at x117.336/y658.781 with width 155.328px.
  Mobile Contact remains 358x244.469, with its 167px body scrolling through
  398px to scrollTop 231. The black mobile PROFILE intro and skills tabs were
  opened and visually inspected. Restart restored canvas focus/zero counts and
  the ambient track continued playing at 73.952s. After the final focus-only
  cleanup, build and the 14 relevant regression checks passed again.
- Loader now uses original ImageGen environment artwork on four depth-separated
  Three.js planes with organic foreground relief, different bounded wind speeds
  and slight camera sway. This is an intentionally image-based layered 3D scene,
  replacing the earlier coarse procedural mountain/raymarched volume. It follows
  the supplied screenshot's teal/sage sky, golden light, peach/lavender cloud
  ocean and distant low ridges, without its branding/UI or the previous moon.
  Original LEE liquid mark and actual measured loading percent remain.
- Original asset: public/assets/loading/cloud-journey.webp (1672x940, 63012 bytes).
  Built-in imagegen prompt/source notes: tools/source-assets/cloud-journey-prompt.txt.
  This reference is the user's screenshot, not downloaded Cartier artwork.
  The live Cartier URL returned 403 to web fetching and stayed at its preloader
  in IAB; the reference audio was not auditioned or copied.
- New original Cloud Reverie BGM: 96s, stereo 24kHz PCM, synthesized slow pads,
  a sparse glassy melody and diffuse reverb, no samples/drums. Browser media
  played cloud-reverie.wav with duration 96 and advancing time. Peak .660,
  RMS .11685, seam step .01144 versus ordinary max slope .05554; no clipping
  or exceptional seam impulse. Existing user volume settings and underwater
  filter graph remain. Original piano file remains available unchanged.
- Production build and full suite 118/118 passed, including audio headroom/seam,
  cloud coverage/long-load wind bounds, continuous pen timing and existing
  notebook/filter/navigation regressions. Existing large scene/Three chunk
  warnings remain. Browser plugin unavailable; used built-in CUA/Playwright at
  localhost:4173. Mobile cold shader warm-up briefly exceeded the DOM-read
  deadline; screenshot-only capture on a warm reload succeeded. One native
  scene shader emitted a driver floating-point precision warning (X4122), with
  no rendering failure or runtime errors. Physical phones/listening hardware
  and reduced-motion browser execution were not measured.

Visual checks against the supplied reference and generated asset:

| Point | Result |
| --- | --- |
| Copy | Only original LEE + actual percentage; no Cartier logo/menu/headline/CTA added. |
| Palette | Sage upper sky, cream sunlight, peach clouds and lavender shadows match the requested direction. |
| Silhouette | Low distant ridge replaces isolated spiky island; no moon or planet. |
| Depth/motion | Four textured 3D banks drift independently; higher native resolution replaces coarse volume sampling. |
| Typography | Original loader mark/UI fonts preserved; farewell is sharp local font ink with genuine stroke reveals. |
| Contact | Vertical rows, a steady larger gap, smaller same-proportion paper; final ending uses a separate horizontal contact row. |
| Theme scope | PROFILE alone is dark; white Contact and bright artwork remain. |

Selected screenshots are outside the repo under the task's outputs/dream-revision
folder. Latest source and rendered screenshots were visually inspected with
view_image, including a final same-pass comparison of the supplied screenshot,
generated asset and 1280x800 browser render. The deliberate asset-based 3D
technique is described above; the
implementation does not claim to copy Cartier's engine or recording.

## Vertical contact, movable Clear and afternoon 3D loader, 2026-10-19

This section supersedes the older completion/input and loader descriptions below.

- Contact keeps the original 760:519 paper. Mobile, E-mail, GitHub and Velog
  now share one vertical icon/text column with exactly 18px between row boxes.
  The physical printed SVG uses the same positions. No contact, social link or
  legal copy was removed. At 390x844, the paper remains 358x244.469 and its
  167px body scrolls through all 394px, reaching scrollTop 227 and the copyright.
- Real quest tour at localhost:4173: profile, all six projects, then contact.
  During Clear/depart, the canvas retains focus, the world is not inert and the
  native dialog is non-modal. Held W plus a mouse drag visibly moved the blurred
  scene. Prop/seat activation is disabled independently of movement.
- At the first paragraph only, the world becomes inert and the ending becomes
  modal. Observed stages: clear, depart, first, firstOut, gap, second, secondOut,
  complete. Exactly one Korean/English paragraph is mounted at a time; actual
  local-font SVG glyph outlines draw and fill in staggered order, then fade away.
  The final screen has only the centered restart button. Clicking it restored
  canvas focus and profile 0/1, projects 0/6, contact 0/1, with no ending present.
- Loader is an actual WebGL scene: moving volumetric cloud sea, continuous PBR
  rocky ridge, a small low-left moon and drifting high clouds in an afternoon
  sky. No planet/stars/night palette. Original liquid LEE mask and real resource
  percentage are retained. House photographs remain independent ending assets.
- CUA/Playwright bridge checked the production build at 1280x800 and 390x844;
  Browser plugin was unavailable. Actual GPU canvas sizes were 760x475 and
  222x480. Cloud time advanced 0.217 to 1.935s desktop and 0.217 to 2.018s phone.
  No console errors/warnings or shader compilation errors. Physical phone GPU
  performance and a reduced-motion browser session were not measured; reduced
  sequencing, bounded resolution and deterministic cloud/lettering data have
  automated coverage. An attempted alternate-port QA harness was unreachable;
  all reported browser checks used the actual 4173 production preview instead.
- Full suite passed 117/117. After final rock relief/color tuning, the 11 relevant
  notebook/ending/landscape checks passed again and the production build passed.
  Existing large scene/Three chunk warnings remain. Content JSON and original
  piano bytes are unchanged.

### Visual comparison ledger

Concept: `C:/Users/user/.codex/generated_images/01a130d7-8c38-7532-bae3-950c43307df9/exec-825aae0d-eb39-420a-b898-73b041bce996.png`.
Final screenshots: `C:/Users/user/Documents/Codex/2026-10-13/code/outputs/sky-ending/`.
Both concept and latest desktop render were opened with view_image in the same
final QA pass; the phone loader, contact and both farewell/restart states were
also visually inspected. The 1672x941 concept was evaluated at the existing
1280x800 desktop test size, plus the 390x844 responsive size.

| Comparison | Evidence and final treatment |
| --- | --- |
| Copy | Allowed loader copy is only original LEE and measured percent. No concept copy, subtitle or invented CTA added; above-fold copy diff passes. |
| Composition | Low moon left, rocky ridge right and cloud sea beneath open upper sky preserved. Portrait camera was shifted to retain both moon and ridge. |
| Typography | Original liquid signature retained rather than using generated lettering; white Urbanist percentage remains readable above the clouds. |
| Palette | Blue upper afternoon sky, peach horizon and warm cloud light replace the user's night colors; no upper-right planet. |
| Asset treatment | Intentionally procedural live 3D rather than the photoreal concept bitmap: softer cloud/terrain detail at a bounded GPU resolution. This is a material visual difference, chosen to honor the explicit 3D request and loader performance, not a claim of photographic identity. |
| Motion | World-space cloud advection and high-cloud drift verified by advancing live renderer time; reduced motion renders one static frame. |
| Spacing and containers | Contact remains the original white paper and silver binding, with a single 18px vertical rhythm. Smaller paper scrolls internally instead of stretching. |
| Ending | Both paragraphs use original exact copy; traced glyphs, complete paragraph disappearance and centered final restart were observed through the real quest flow. |

The requested composition, copy, interaction and responsive behavior have been
faithfully verified against the reference direction. The intentional live-3D
detail/style difference above remains; no clipped primary controls or missing
content were found in the tested views. Only selected delivery screenshots were
kept outside the repository; temporary harness and intermediate captures removed.

## Fixed contact paper size and centered details, 2026-10-19

- Corrected the content-driven shrink after removing the farewell: the reader
  keeps the original 760:519 paper format. Normal desktop is 760x519, not the
  shortened 760x362. Short windows fit the same ratio with room above the ring.
- Grouped the original phone/email/social elements and centered them in the
  available paper area; CONTACT/close remain above and legal/divider below.
  Small paper sizes scroll internally; the header and outer paper stay fixed.
  Updated the physical printed SVG to the same centered contact positions.
- CUA/Playwright at localhost:4173: 1280x800 measured 760x519; 876x523 measured
  601.844x410.984, top 56px, with the ring visible. At 390x844, paper measured
  358x244.469, body scrollHeight 380 > clientHeight 167; End reached scrollTop
  213 and exposed legal text. All details and social links remain accessible.
- Verified actual notebook approach, reading and return; no relevant console
  errors/warnings. Notebook geometry/binding regression tests and production
  build passed. Desktop evidence is outside the repository in the task's
  outputs/contact-note-size folder. Browser plugin unavailable, using the
  built-in CUA browser bridge; physical mobile hardware was not tested.


## Flowering rims and handwritten completion ending, 2026-10-19

- Both house rims now have dense overlapping green crowns, uneven trailing
  shoots and clustered cream/pink/lilac/yellow blossoms. Preserve scanned ivy.
  Garden configuration is shared in garden-layout.json; supplemental geometry
  uses four static instanced draws, connected stems and real leaf shadows.
- Restricted oak selection to the house roof footprint. Perimeter copings at
  the same height retain black. The native file was corrected without topology
  or UV changes: 468 lower oak, 418 roof oak, 406 black coping triangles.
- Removed the farewell from Contact and regenerated its physical note face as
  a self-contained SVG. Phone, email, socials and legal remain. Content JSON,
  original BGM, existing loader and all project/profile data are unchanged.
- Completion waits for profile, all six actual projects and contact, then for
  the final reader to close. After a short pause, scene input is locked with
  inert and controller.pause, the world blurs 5px and SVG pen strokes draw Clear.
  It dissolves to copies of the CURRENT loader photographs in assets/ending
  (future loader revisions can be independent). Four farewell lines appear in
  sequence; restart is hidden/disabled until the sequence is complete.
- Browser plugin not available; used the built-in CUA/Playwright browser bridge.
  Actual http://localhost:4173/ at 1280x800 and 390x844: page identity, meaningful
  content, no error overlay, no relevant console warnings/errors, garden and
  black coping screenshots, preserved contact details, real profile -> all
  project readers -> upstairs contact -> close -> ending -> restart all passed.
  Restart restored all counters to zero, the start view and focused canvas.
  A second actual tour with the quest tracker FOLDED also reached the ending;
  no dependency on the CSS scan animation remains. Music continued playing.
- Confirmed the letter stage with no premature restart button, blurred world,
  keyboard/modal focus and sequential text. Desktop/mobile ending and restart
  screenshots are saved outside the repo under the task workspace's
  outputs/flowering-ending. The full Clear stroke was not separately captured
  at its final frame; animation source and stages were exercised in the tour.
- All 113 Node tests passed; production build passed. Includes completion and
  reset/recompletion, dynamic archive length/empty archive, reduced-motion
  timings, same-height coping exclusion, physical note text preservation and
  deterministic bounded instanced planting. Existing navigation, readers and
  independent sound tests remain green. Build retains the existing large-chunk
  advisory; no new build errors. No physical-device or cross-browser QA.
- An auxiliary visual-only preview on port 4180 failed to connect in the browser
  bridge and blocked its tool call unexpectedly; this did not affect the working
  4173 preview or the two completed real-site tours. It is not validation evidence.


## Audible underwater piano, oak fascias and corrected phone quests, 2026-10-19

- Reviewed Tidewater's actual SoundScape.js: above-water sound passes through
  two low-pass filters, with a 260–520Hz depth-dependent cutoff, second
  cutoff 1.4x, and a strong immersion gain reduction. The previous single
  680Hz/.78 piano treatment was too subtle for this soundtrack. Our continuing
  piano now uses 260Hz/364Hz cascaded filters, Q .707/.54, .34 immersion gain
  and .05s ramps. Its independent user volume and playback position remain.
  Surfacing restores both filters to 20kHz and the tone gain to 1.
- Verified the actual playing piano through development-only pass-through
  input/output analysers, beyond mock parameter checks. Submerged context was
  running, with both real cutoffs at 260/364 and user gain .28. Measured
  450–1200Hz transmission relative to the 80–200Hz bass band was -18.48dB;
  after physically using the exit guide, both cutoffs restored to 20kHz,
  tone gain 1 and mid/bass transmission returned to nearly 0dB. Piano kept
  playing. Raw measurements are saved in underwater-signal.json and
  surfaced-signal.json under the external evidence folder below. Analysers
  and their half-second diagnostics are omitted from production.
- Fixed an inherited development-only diagnostic that accessed a removed
  profile hinge, causing repeated errors after each rendered frame. It now
  reads the real contact-cover pivot safely; reloading restored position
  diagnostics and showed no new errors/warnings. Production stayed unaffected.
- Both exterior ceiling bands now use one shared clone of the original
  textured Warm_Oak, including the former black balcony lip and upper roof
  rim. Precise triangle selection retains every position/normal/material UV/
  lightmap UV; other black courtyard coping and white soffits are preserved.
  The runtime reports 3 retargeted meshes / 1314 triangles. Existing oak
  weathering, normal map and warm facade fill remain; no texture or geometry
  re-encoding, lightmap change or extra reflection pass was introduced.
- Updated build_atelier.py for subsequent native builds. A background-only
  retarget_exterior_wood.py changed material slots in connected-atelier.blend:
  468 lower and 824 roof triangles, with identical vertex/polygon/UV counts.
  The previous native file is backed up outside the repository in
  work/underwater-wood-before. The live Blender session was not modified.
- Corrected phones to RIGHT vertical center, right-aligned copy and a common
  centered icon column. At 390x844 the panel's right edge is 368 (22px inset)
  and center y422; at 320x480 right edge298 and center y240. Existing desktop
  21px visible gutter and fold/scan behavior remain. Below 800px phone height,
  the compact exit button sits below auto-run at the upper left so it cannot
  cover the right-centered visible quest copy/icons.
- All 108 tests passed; the final sound/material subset passed 4/4 again after
  the stronger cutoff adjustment. Production build passed. Browser plugin
  unavailable; used the in-app bridge/Playwright at localhost:4173 for visual
  QA and localhost:4174 for live audio measurements. Desktop 1280x800, phones
  390x844 and 320x480 rendered correctly; the final preview console was clear.
  Music/action volume controls remain at the approved defaults, 28% / 100%.
- Proof files outside the repo:
  C:/Users/user/Documents/Codex/2026-10-13/code/outputs/muffle-and-oak/mobile.png
  C:/Users/user/Documents/Codex/2026-10-13/code/outputs/muffle-and-oak/desktop-wood.png
  and the two raw spectrum JSON files in that folder. Other browser engines
  and device-specific listening levels were not measured.
- Reference: https://github.com/dgreenheck/tidewater/blob/main/src/audio/SoundScape.js


## Center-left mobile quests and underwater sound, 2026-10-19

- Desktop's visible fold-button gutter is reduced from 42px to 21px. The
  transparent panel uses a 6px outer inset; the heading and list retain their
  previous content measure and move together. Desktop fold/scan remain.
  Phones keep a list at x22px, text left aligned, vertically centered: center
  y422 at 390x844 and y240 at 320x480. Icons retain a common centered column.
- A custom running-person SVG with speed streaks replaces the phone ellipsis.
  Its menu still exposes all four real destinations; choosing Work Exhibition
  closed the menu and showed the active running state while the body followed
  the physical route. The control guide describes the running-person shortcut.
- Speaker icon opens independent saved music and footsteps/action sliders.
  Actions share a live gain bus covering walk/run/jump/landing/crouch; water
  bypasses this bus. Verified action 0% and 50% while music stayed 28%, and
  both settings survived reload. QA restored the approved defaults afterward.
  Music volume uses its own Web Audio gain after the underwater tone chain,
  preventing a surface transition from resetting or unmuting the chosen level.
- First input connects the same continuing piano to a smooth low-pass chain.
  Submerging moves its cutoff to 680Hz over a .18s time constant, with a
  restrained 200Hz shelf and .78 immersion gain. Surfacing restores 18kHz,
  flat shelf and full tone gain without restarting. Actual pool entry set the
  underwater flag; piano remained playing at currentTime 51.3s. Using the real
  exit guide removed the water UI and cleared the underwater flag afterward.
- Water retains the close recorded flow at its approved gain, with .88–.92
  playback rate, 2.4kHz surface/800Hz submerged low-pass and a gentle 260Hz
  shelf. No wave assets or physics triggers changed. Original piano WAV and
  portfolio JSON hashes remain unchanged.
- Found and fixed short-phone water help covering the newly centered quests.
  Below 560px height, the exit control is compact: at 320x480 quests end y309,
  the separate exit button starts y310 at x262; DOM bounds do not intersect.
  Taller phones retain the explanatory water text. Shared controls stay clear.
- npm test passed 107/107. Focused sound tests passed 10/10 again after the
  final music-gain refinement; the production build passed. Tests exercise
  independent persisted zero-inclusive levels, action/water routing, live
  adjustment/disposal, muffling/restoration and user mute retention.
- Browser plugin unavailable; used the in-app bridge/Playwright at
  localhost:4173, 1280x800, 390x844 and 320x480. Meaningful page, no framework
  overlay, no relevant console errors/warnings. Existing C toggle retained.
  Proofs outside the repository: outputs/immersive-sound/desktop.png,
  mobile.png, underwater.png and short-mobile-underwater.png under
  C:/Users/user/Documents/Codex/2026-10-13/code/.
  Other browser engines and subjective loudness on other devices are untested.


## C crouch latch and adjustable music, 2026-10-19

- C replaces Ctrl. Repeat keydowns cannot oscillate posture; keyup, blur and
  help/detail pauses retain the latch. A second C or mobile tap stands up;
  reset clears it. Mobile pressed state follows the same controller callback.
  Existing bench seating and jump/swim remain separate. Crouched guidance
  respects crouch speed. The guide and canvas help now describe C toggling.
- Walk/run/landing event gains are .5 of their prior levels. Entry/swim/exit
  gains are 2x, including gentle wet-foot drips. The .21 master, non-footfall
  actions and bundled water recordings remain unchanged; no wave sound added.
- BGM retains mute/autoplay, with a small sliders button beside its circle.
  The 0–100% range immediately updates the audio element and percentage,
  persists in atelier.bgm.volume.v1, and survives mute/unmute and reload.
  Initial volume remains 28%. Outside clicks and Escape close the panel;
  Escape restores focus. Range keys do not move or crouch the visitor.
- npm test passed 104/104; npm run build passed. Browser plugin unavailable;
  used the in-app browser bridge with Playwright locators at localhost:4173.
  Confirmed meaningful page/title, no framework overlay and no console
  errors/warnings. Checked desktop 1280x800, phone 390x844 and 320x480.
- Interactions verified: C press/release remains crouched, guide open/close
  preserves posture, second C stands; mobile first/second tap and reset update
  aria-pressed. Slider Home/End gave 0%/100%, keyboard adjustment gave 30%,
  C with range focus did not crouch, mute/resume worked, reload retained 28%.
  The 320px panel stays inside x82..298, y82..176. The mobile panel temporarily
  overlays quests only while open. Desktop opens above the existing BGM circle.
- Evidence saved outside the repository:
  C:/Users/user/Documents/Codex/2026-10-13/code/outputs/crouch-and-volume/desktop.png
  C:/Users/user/Documents/Codex/2026-10-13/code/outputs/crouch-and-volume/mobile.png
  Subjective listening balance remains dependent on the visitor's device.

## Half-volume effects and gentle recorded water, 2026-10-19

- Reduced the independent effects master from .42 to .21 at initialization
  and every active update, preserving muted/paused behavior. BGM component and
  original piano WAV remain byte-for-byte unchanged (SHA256 BB172073...493991
  and 34C357A6...8965F respectively).
- Reviewed Tidewater's public audio credits and sound bank. Its close water
  sources are CC0 recordings by felix.blume; used submerge, underwater movement
  and settling/drips, excluding every surf/wave recording. Six short local WAV
  excerpts use 150Hz high-pass, 3.2kHz low-pass, soft attack/tail and restrained
  levels. Flow variants have consistent RMS around .020 before the half-volume
  master; the entry has no synthesized bass thump. The fallback also uses a
  quiet bubble texture, with no wave wash or periodic crashing sound.
- Recordings preload/decode from same-origin static assets after the first
  gesture. Existing physical entry/stroke/exit triggers and below-water filtering
  remain. Source credits are bundled at public/assets/audio/water/CREDITS.md;
  processing is reproducible with tools/prepare_water_audio.py. Assets total
  about 220KiB; six preview-server requests returned 200 with audio/wav.
- Focused audio tests passed 6/6, including the real mixer's half gain on start
  and resume, paused silence, physics event cadence and each WAV's format,
  bounded peak/duration and silent faded edges. Production build passed.
- Browser plugin unavailable; validated localhost:4173 via the in-app bridge
  at 1280x800. Entered the actual pool, moved underwater and used the exit guide
  without console errors/warnings or an error overlay. No visual layout changed.
  Proof files outside the repository:
  C:/Users/user/Documents/Codex/2026-10-13/code/outputs/quiet-water/pool-check.png
  and water-preview.wav (entry, three flow variants and exit at the .21 mix).

## Immersive input, mobile controls and sound, 2026-10-19

- Moved the desktop tracker panel from 28px to 12px from the right; mobile
  rows move down by 14px. Mobile now has one circular analog direction pad,
  diagonal dragging and release/cancel/blur cleanup. The four destination
  buttons live in a vertical-ellipsis disclosure below the guide; the pad and
  action buttons sit lower, with safe-area and short-height adjustments.
- Mouse-down on the scene hides the native cursor until release/cancel/blur.
  Initial reader focus goes to its container, removing the extra X outline;
  Tab still produces the normal visible keyboard focus. Blue unviewed cues
  use a 4.8-second fade cycle with complete invisible gaps, including all glow
  layers. Desk cue transparency is set before shader compilation.
- Added a small original vector GYU idle mark, with anisotropic sampling for
  the angled tablet. It fades out on power-up and returns on power-down/reset.
  Both ceiling exterior bands use the existing glossy black finish, preserving
  white soffits, columns, floor colors, geometry and both UV channels. Updated
  the native generator and existing native source/export with the identical
  material classification (434 ground-band and 824 roof triangles in the
  native audit). No geometry or lighting rebake was needed for the finish.
- BGM is wanted on first visit, attempts playback and retries on a trusted
  pointer/key gesture when autoplay is blocked; intentional off stays off.
  Added original Web Audio foley for alternating stone footsteps, faster runs,
  jump/landing, cloth crouch, swimming, entry splash and exit/drips. Real
  displacement and physics drive cadence/events; paused/hidden/reset scenes
  cannot queue footsteps or leave audio sources running.
- All 100 tests passed. Final cue/tablet/audio/presentation checks passed 12/12
  after the last idle-mark/transparency refinement, and the final production
  build passed. Content SHA256 remains
  4CFF6D1AD7184C6CD5A1B25D9608213165365EE38E987A4873E79D9B5A90B1E2.
- Browser plugin unavailable; tested the actual localhost:4173 build through
  the in-app bridge at 1280x800, 360x670 and 320x480. Confirmed cursor:none during a held
  scene click, clean first-open X and restored Tab focus, tablet on/off with
  GYU returned, mobile pad displacement, four working shortcuts and menu close
  after selection. First trusted click changed the audio element to playing
  (readyState 4). Walked into the pool and swam, then used the real exit guide;
  its water status cleared after reaching the bank. BGM remained paused after
  explicitly turning it off and clicking the scene again. Crouch/jump inputs
  completed without audio errors. The 320x480 pad/action controls stayed inside
  the viewport with no horizontal overflow. No console errors/warnings or
  framework overlay.
- Browser captures are outside the repository in
  C:/Users/user/Documents/Codex/2026-10-13/code/outputs/controls-and-audio:
  exterior-desktop.png, profile-close-clean.png, tablet-idle-final.png,
  tablet-idle-after-close.png, mobile-controls.png and mobile-shortcuts.png.

## Rounded exhibit corners, 2026-10-19

- Added a shared .0128 logical outer radius (1% of frame width), approximately
  12px in the desktop reader. The actual oak body is now a rounded extrusion;
  its dimensions, inset mat, wall placements and presentation remain unchanged.
  The live radius scales with the same frame to preserve the silhouette on phones.
- Existing frame/projection/presentation tests passed 8/8; production build passed.
  Browser plugin unavailable; validated through the built-in in-app bridge at
  localhost:4173. Desktop 1280x800 measured an 11.35px outer radius; phone 360x670
  retained a 340x224 landscape reader and a proportional 3.4px radius. Both settled
  without a transform; no app console errors/warnings or framework overlay.
  Opened with E, closed with Escape, and reopened from the nearby interaction.
- Screenshots are outside the repository at
  C:/Users/user/Documents/Codex/2026-10-13/code/outputs/rounded-exhibit/desktop.png
  and mobile.png. Original content, assets and other reader styles were preserved.

## Fixed landscape frame approach, 2026-10-18

- The user explicitly selected landscape wall frames matching the approved
  gallery reader. All six hanging bodies now use a 1.28 x .8 logical outline
  with a .016 rim and matching landscape printed mats. Existing wall centers
  and six-work pagination remain; the wider frames have clear separation.
  Prints retain the original artwork, logos, descriptions, metadata and links.
  Original PNG alpha is used around mockups so the white mat stays continuous.
- The physical frame moves for the whole approach, with the camera/body fixed.
  The live reader follows its projected corners through opening, reading and
  closing, instead of independently expanding into a viewport-shaped rectangle.
  Rigid world-space movement preserves the frame's dimensions within the
  affine room and turns its final plane exactly toward the viewer. Reader
  bounds follow its actual physical aspect; final <1px rounding is pixel-aligned
  for sharp stationary text. Original local matrix, auto-update, pose and
  visibility are restored on close/cancel/reset.
- The five focused motion/content test files passed 52/52; final focused
  frame/projection checks also passed after aspect alignment. Coverage includes
  actual frame body/mat geometry, separated slots, corner tracking at every
  presentation phase, constant world-space edge lengths, square-on final plane,
  desktop/phone fit, reduced motion and restoration, with tablet/contact regressions.
  Final production build passed with the existing Three chunk-size warning.
- Browser plugin unavailable; checked the actual localhost:4173 app with the
  in-app bridge. Walked to the gallery, stepped back to inspect the new landscape
  frames, used E, recorded physical approach/live handoff/reading and Escape
  return. Settled desktop reader is untransformed and sharp at 1280x800.
  Mobile 360x670 retains the same object silhouette (the sampled side-wall
  frame is 340x224), 16px copy and metadata, internal caption scrolling and
  introduction/information/design panes. Keyboard focus reveals both links
  inside the frame. No horizontal overflow, console errors/warnings or framework
  overlay; close returns the original nearby interaction and removes the reader.
- Actual full-frame recordings and captures are saved outside the repository in
  C:/Users/user/Documents/Codex/2026-10-13/code/outputs/landscape-exhibit:
  wall-final.png, desktop-final.png, mobile-final.png, mobile-info-links.png,
  mobile-artwork.png, opening-final.json, closing-final.json and
  approach-and-return.gif. GIF encodes the recorded frames without synthetic
  intermediate frames. Original content SHA256 remains
  4CFF6D1AD7184C6CD5A1B25D9608213165365EE38E987A4873E79D9B5A90B1E2.
  Native room assets, lighting and physical routes were not changed or rebaked.

## Framed gallery project reader, 2026-10-18

- Replaced the dark marketing-style project reader with one thin honey-oak
  frame and a true-white gallery mat. The original artwork sits on the left,
  with its original logo, tagline, description, three metadata rows and links
  in a caption column on the right. Category labels, project count, arrows and
  close remain in a restrained header. DIVE's original PNG is displayed through
  an SVG viewport that removes its empty export padding; no source image changed.
- Desktop and mobile Image Gen layout concepts were reviewed against final
  browser captures with view_image. Code uses the original project assets,
  existing local fonts, a CSS oak finish and the live room behind the frame.
  Mobile retains introduction/information/design panes; introduction includes
  an artwork preview. Copy and metadata remain 16px, with inner scrolling on
  short phones. Profile, contact and physical scene motion are unchanged.
- `node --test tests/content-presentation.test.mjs tests/portfolio.test.mjs`:
  44/44 passed, including original content/assets/links and reversible movement
  of all six frames. Final `npm run build` passed; existing Three chunk-size
  warning remains. portfolio-content.json SHA256 is still
  4CFF6D1AD7184C6CD5A1B25D9608213165365EE38E987A4873E79D9B5A90B1E2.
- Browser plugin unavailable; used the built-in in-app bridge at localhost:4173.
  Flow: walk to work exhibition, open the actual frame, browse all six projects,
  check all 11 original link targets, switch mobile panes, keyboard-focus links
  on a short phone, then Escape and verify the nearby frame interaction returns.
  Correct title/nonblank UI, no framework overlay, and empty console error/warning
  query. Reader and caption are removed after closing.
- Visual captures checked at 1280x800 and 390x844. Layout probes at 769x800,
  768x800, 360x670 and 1024x540 show no horizontal overflow or navigation overlap,
  and the complete frame stays within the viewport. The 768px compact boundary
  is preserved; short landscape screens also expose the existing reading panes.
  At 360x670, keyboard focus scrolls Web into view without reducing text size.
- Evidence is outside the repo under
  C:/Users/user/Documents/Codex/2026-10-13/code/outputs/framed-project-reader:
  desktop-final.png, mobile-final.png, mobile-info.png, mobile-artwork.png,
  mobile-small-links.png, projects.json and responsive.json. Validation covers
  the in-app browser; external sites were checked by target URL without opening
  them. No deployment or new dependencies.

## One threaded silver notebook ring, 2026-10-18

- Replaced the independent reader-loop drawing with projections of the same
  elongated torus used by the physical notebook. The ring keeps its profile
  through opening, reading and closing, with neutral silver shading matched
  across the scene and live reader. The existing Letter cover and full back
  fold are retained.
- Positioned the front leg through the actual paper and cover punches; the
  return leg passes outside the top edge. The live page has a transparent
  punch and separate front/rear metal layers, so paper genuinely occludes
  the rear leg. Responsive layout scales the complete profile uniformly and
  keeps it inside the phone viewport. Stationary projections are reused.
- Thirteen focused tests passed: notebook motion/restoration, tablet/frame
  presentation, physical punch crossings, matching projected geometry at the
  handoff, cached projection invalidation and desktop/phone ring proportions.
  Production build passed with the existing large-chunk warning.
- Verified actual opening frames and the settled reader at 1280x720 through
  the in-app browser bridge (Browser plugin unavailable), then checked 360x670.
  The phone page is 328x625, its complete ring starts at viewport y=4px,
  the transparent punch is active and there is no horizontal overflow.
  Escape removed the reader and both binding layers and restored the nearby
  notebook interaction. Console warning/error query was empty.
- Actual evidence is saved outside the repository under
  C:/Users/user/Documents/Codex/2026-10-13/code/outputs/unified-binding:
  proof-0.png through proof-14.png, proof-frames.json, desktop-final.png and
  mobile-final.png. The native room, lighting, pen cup, content and other
  readers remain unchanged.

## Letter cover and binding correction, 2026-10-18

- The closed notebook lifts before turning. Its cover now completes a full
  turn and settles entirely below the paper stack, with a visible finished
  pose before the reader expands. Close, cancellation, reset and reduced motion
  retain the same reversible scene timeline.
- Replaced the tall oval/black center with a smaller shaded corner loop,
  extending above the page and keeping clear of CONTACT. Added an outlined
  Segoe Script "Letter" title in warm gold on the physical moving cover.
- Ten focused notebook/tablet/frame motion tests passed, including actual
  cover occlusion, its completed position beneath the page, the closed lift,
  delayed reader handoff and restoration on desktop/phone/reduced motion.
  Production build passed. All native architecture, lighting and cup assets
  remain unchanged in this revision.
- Checked the live reader at 1280x720 and 360x670 through the in-app browser:
  the loop stays clear of the heading, the phone page remains 328x625 with
  no horizontal overflow, all original copy/links remain and console errors
  are absent. Rechecked the final closed lift, complete fold, reading pose and
  Escape return at 960x640. Captured actual cover movement and desktop/mobile readers
  outside the repository. Browser plugin not available; used the built-in bridge.

## Contact notebook revision, 2026-10-18

- Restored the prior clean white contact page, preserving every original string,
  plain phone/email details, both original social links and the full legal rule.
  Added a single upper-left binding, a genuinely punched physical cover and a
  reversible ring-centered turn before the continuous reader expansion.
- Rebuilt the existing native ceramic desk cup with an open mouth, an inner wall
  and recessed bottom, containing three distinct writing tools. Native and Draco
  runtime ray probes both measured a 0.134m interior depth and found all three tips.
  Regenerated architecture, matching denoised indirect map and sharp runtime model;
  source-resolution 2048px architecture textures remain intact.
- `npm test`: 90/90 passed, including notebook occlusion, open/reverse/cancel/reset,
  delayed handoff, phone fit and reduced motion. Production build passed.
- Browser plugin not available; used the built-in in-app browser bridge at
  localhost:4173. Verified desktop 1280x720 and mobile 360x670, E/click, close/Escape,
  pre-read cancellation, reopened mobile animation and reset to 0/3. No relevant
  console warnings/errors or framework overlay. Contact text remains at least
  16px; the phone sheet is 328x625 with no horizontal overflow or binding overlap.
- Actual opening/closing frames, desktop/phone readers and the closed notebook
  beside the filled cup were captured outside the repository as QA evidence.

final result: passed, with initial-load and viewport-capture limitations documented below.

## Current revision

References: public/references/38-sunset-garden-glass.png through 41-sunset-garden-glass.png. These identify missed pale exterior faces, ivy above the coping, repeated sparse silhouettes, and the requested black/white glass interface.

- Reflective graphite finish now includes facade coping, external lower fascia, roof-adjacent capitals, and the vertical upper faces of courtyard/closure coping. Existing white ceilings and ivory columns remain.
- Live sunset sky shader replaces whole-panorama rotation. Its fixed peach/amber horizon and violet upper sky have two cloud layers with independent wind and evolving noise. Existing photographic clouds supply fine detail; reduced-motion freezes cloud time. PBR reflections use a sunset environment; water captures the actual dome.
- Root heights are now rises from their base, limited by the actual 6.86 coping. Ivy climbs the wall, bends over the cap, and trails down its rear face. Indoor upper roots stop below their ceiling. Canopy heights are limited below the wall.
- 22 roots use fan, column, cascade, wild and dense forms, random forks, four leaf profiles and four green shades. Final generated foliage has 212,372 scanned leaves, 849,488 leaf polygons, and maximum logical height 6.85057. All four exported leaf materials retain color textures, alpha and double-sided rendering.
- HUD, controls, progress, focus states and detail panels use neutral black/white frosted glass, backdrop blur, reflected white rims, and inset highlights. Existing content and interaction layout remain.

## Validation

npm test: 29/29 passed in this revision, covering preserved original content, shared completion/reset, continuous stair routes, crouch/jump/rail falls, pool coping and Sites packaging.

npm run build: passed after final geometry, bake, denoise and the final CSS neutral-text correction. The existing lazy Three.js chunk-size warning remains.

Current final GLB: 20 checks / 2,580 rays with zero failures. All 30 material groups contain material and indirect-light UV channels. New radiance was baked and denoised at 2048 x 2048. Original portfolio-content SHA256 remains 4CFF6D1AD7184C6CD5A1B25D9608213165365EE38E987A4873E79D9B5A90B1E2.

| Native mesh check | Rays | Failures |
| --- | ---: | ---: |
| courtyardShell | 288 | 0 |
| upperShell | 240 | 0 |
| stairClearance | 273 | 0 |
| stairFloorCoverage | 468 | 0 |
| upperPassageClearance | 174 | 0 |
| passageClearance | 741 | 0 |
| eastWallFit | 54 | 0 |
| wallFlatness | 27 | 0 |
| interiorFinish | 96 | 0 |
| wallTopAlignment | 4 | 0 |
| railMeshFit | 15 | 0 |
| fixtureMounting | 30 | 0 |
| risingStairGarden | 24 | 0 |
| connectedGardenRim | 75 | 0 |
| upperFlushFloor | 11 | 0 |
| connectedStairFinish | 36 | 0 |
| visibleStairFixtures | 3 | 0 |
| whiteCeilings | 12 | 0 |
| modernColumns | 6 | 0 |
| openStairApproach | 3 | 0 |

## Browser QA, 2026-10-11

Environment: http://localhost:4173/, Codex in-app browser through CUA. Normal visible panel 364 x 672; responsive checks at 1536 x 1024 and 390 x 844. No shell browser automation or alternative browser was used.

Flow under test: reload restored server -> inspect black roof/closure/coping and live sunset -> pan east to inspect denser wall plants -> Profile open/close and completion update -> reset -> responsive layout checks -> restore normal visible preview.

The user restarted the ordinary-terminal server. Reload recovered from the stale Failed to fetch screen and loaded the final model. Actual browser-loaded geometry reports all 20 existing checks / 2,580 rays with zero failures. Runtime trim confirms color #191c22, metalness .65, roughness .18, environment intensity 1.15 and clearcoat .5. The sky reports two different signed winds with evolving time and reducedMotion=false.

| Browser check | Result |
| --- | --- |
| URL/title match the portfolio | Passed |
| Nonblank scene, meaningful controls, no framework overlay | Passed |
| Default-panel black/white glass controls and readable text | Passed |
| Profile detail opens with neutral translucent white sheet | Passed |
| Close returns to scene and Profile changes from 0/1 to 1/1 | Passed |
| Restart restores zero progress and original courtyard position | Passed |
| Fixed-camera cloud evolution | Passed; same position/yaw/pitch at times 71.2716 and 79.623, low wind .57017 -> .63698, high wind -.28509 -> -.31849 |
| Desktop and mobile DOM bounds | Passed; controls stay within viewport, separate touch-action and navigation columns |
| Normal-panel screenshots | Passed |
| Final console query | No new errors or warnings |

Reference/current images were viewed together. Image 38: roof perimeter/capital and upper closure/courtyard coping have the black finish. A bright glint at the closure was additionally checked against the actual final GLB using the captured camera: all sampled edge pixels hit Exterior_Gloss_Black, while the wall beneath hits Ivory_Mineral_Plaster. This is a warm specular highlight, not an unpainted white cap. Image 39: the former tall over-wall vine extensions are absent; generated growth wraps and descends behind the actual cap. Images 40/41: inspected east wall has connected denser branches with different leaf/silhouette groups; black/white glass replaces opaque charcoal panels and cyan controls. Original warm rooms, marble, stairs, pool and content remain.

Initial loading took substantially longer during graphics preparation and temporarily timed out two capture requests. Initial diagnostic logs included a Vite development HMR WebSocket connection failure and ANGLE X4122 precision warnings during environment generation. HTTP assets and interactions work; no shader compilation failure or error overlay occurred. The final console query was empty. No performance pass or all-GPU compatibility is claimed; the normal-panel sample reported RX 580, 26,042,367 triangles and a 326ms frame interval, so smooth-frame performance remains a separate limitation.

The 1536 desktop screenshot API returned a clipped center region and the alternative capture failed. Mobile viewport overrides also produced compositor ghosting/softness around backdrop filters; normal viewport captures are sharp and correctly aligned. Desktop/mobile layout claims are based on DOM bounds plus the available captures, not full-fidelity compositor proof. All overrides were reset, normal preview is visible, its original camera and zero progress restored, and the tab was retained as a deliverable.

Evidence under C:/Users/user/Documents/Codex/2026-10-03/new-chat-2/outputs:
- sunset-garden-browser-proof.json (actual loaded geometry, materials, sky and responsive bounds)
- sunset-sky-first.png and sunset-sky-second.png (fixed-camera clouds and black trim)
- sunset-east-wall.png (denser varied wall planting)
- sunset-profile.png (detail panel)
- sunset-mobile.png (responsive capture with documented compositor artifacts)
- sunset-preview-final.png (restored normal visible preview)
- native-33-degree-probes.json (final native geometry checks)
- inspect-pale-trim.mjs (native final-mesh material diagnosis)

Generation logs: sunset-geometry.log, sunset-garden.log, sunset-bake.log, sunset-denoise.log. Implementation baseline: outputs/implementation-baseline/before-sunset-garden.

No source/model changes were needed in this follow-up. No deployment, publication, Git commit, original-content edit or bitmap image-generation operation was performed.

## Flush upper entry and over-wall ivy QA, 2026-10-11

Removed the dark oak strip crossing the 2F stair/library entrance; the existing marble floor is now continuous and flush. Added three connected ivy cascades to the previously bare upper closure front, with unequal lengths and four leaf profiles, coming from behind and wrapping over the black coping. Stems stay on the masonry face; only a thin natural leaf fringe crosses the entry corner. Existing lower stair-wall timber, rails and sconces remain.

Environment: http://localhost:4173/, Codex in-app browser through CUA, visible normal panel 364 x 672, AMD Radeon RX 580. No alternate browser or shell browser automation. No responsive layout change, so viewport overrides were not repeated; prior capture limitations remain above.

Flow under test: reload final assets -> 2층 서재 walks up all stairs -> manually approach and inspect the entrance -> cross the former timber strip -> descend physically to the middle stair -> inspect the new ivy and sconces. Leave this wall view open in the right preview with zero completion progress.

Root cause: Stair_Return_West's Oak_Shaded_Edges crown was coplanar with Upper_Floor marble at logical y=3.8. The old floor-height probe excluded timber, missing the visible strip. This wall's cladding now ends 45mm below the floor and its horizontal oak crown is omitted. The original unbroken marble substrate and tile surface cover the join without an added sill or patch.

| Check | Result |
| --- | --- |
| URL/title, meaningful nonblank scene, no framework overlay | Passed |
| All-material entrance rays, before/after | Before: 12/20 oak hits; after: all 20 marble hits at the upper floor |
| Final native export and actual browser-loaded geometry | 21 groups / 2,600 rays, zero failures |
| Actual entry crossing | x=1.0405 -> 2.5459 at z=.5; floor y=3.8 on both sides, final verticalVelocity=0, inPool=false, airborne=false |
| Native upper ivy geometry | Three cascades have vertices in front of, behind and above the coping; maximum height below cap+.20m |
| Existing circulation/pool/rails/content tests | npm test: 29 passed |
| Production build / Sites packaging | npm run build: passed |
| Lighting | Rebaked against final foliage and denoised at 2048 x 2048; both native UV channels retained |
| Console | No app errors; one retained ANGLE X4122 environment precision warning from 11:05 UTC, before the final 11:09 reload |
| Original content | SHA256 unchanged: 4CFF6D1AD7184C6CD5A1B25D9608213165365EE38E987A4873E79D9B5A90B1E2 |

Reference/current screenshots were viewed together. Reference 42's brown crossing strip is absent in upper-entry-after.png; marble grain and joints continue across it. Reference 43's bare closure now has varied downward growth, readable bronze sconces, black coping and a clear stair approach in upper-wall-after-wide.png. These are native branches/leaves with recalculated shadows. The cap carries a thin foliage fringe instead of tall upright growth.

Changed sources: tools/build_atelier.py, tools/build_vines.py, src/scene/garden-layout.json and src/scene/createScene.js. Durable feedback and references 42-43 recorded in AGENTS.md and public/references. Regenerated architecture-base.glb, connected-atelier.blend, connected-atelier.glb, rooted-garden.glb and atelier-indirect.png. The new development probe upperEntranceMarble includes all architecture materials and reproduces the original defect before the fix.

Evidence under C:/Users/user/Documents/Codex/2026-10-03/new-chat-2/outputs:
- upper-entry-before.png / upper-entry-after.png
- upper-wall-before.png / upper-wall-after.png / upper-wall-after-wide.png
- upper-entry-before-probes.json / native-33-degree-probes.json
- upper-entry-browser-proof.json (loaded checks, crossing, wall camera, logs)
- upper-wall-native-growth.json and inspect-upper-ivy*.mjs
- upper-entry-geometry.log, upper-wall-garden.log, upper-entry-bake.log, upper-entry-denoise.log
- implementation-baseline/before-upper-entry-ivy (source baseline)

Key sequence: build_atelier.py + build_vines.py -> bake_lighting.py -> denoise_lighting.py -> native probes -> npm run build; npm test and CUA reload/guide/manual keys/drag/screenshots/console checks. Existing large scene/chunk performance limitations remain; no performance pass or other-browser compatibility claim. No deployment or Git commit. The right preview is visible and retained at the newly planted upper-wall view.

## Profile book, growing exhibition and lifted contact card — 2026-10-11

Implemented the latest spatial interaction request in the existing Three/React scene. The left studio desk now has a hinged leather profile book; removed its old laptop/sketchbook clutter from the native architecture and rebaked lighting. All projects hang at a fixed readable 1.04 × 1.47 logical size in the right atelier, three on the rear wall and three on the right wall. Additional entries generate successive six-work exhibition pages; page controls and progression totals derive from content. Low interior foliage and repositioned side frames leave the paper clear while retaining the wall ivy. Contact is a printed, physically lifted card on the upper desk.

Nearby E, clicking the actual prop/frame and the messenger action share one reversible presentation timeline. It pauses walking without moving the body, focuses the camera, opens the book/lifts the card, then reveals the complete original content with a perspective entry transition. Escape/close restores the prop and original camera. Same-floor distance, line of sight, ground/water state, held-key repeat, cancellation, reset and reduced motion are handled. Accessible direct content shortcuts remain available. All five original profile sections, six original projects, descriptions, metadata and links, plus the complete contact HTML remain intact. portfolio-content.json SHA256 remains 4CFF6D1AD7184C6CD5A1B25D9608213165365EE38E987A4873E79D9B5A90B1E2.

Validation: npm test passed 34 tests. Additional final targeted tests passed after adjusting exhibition spacing. Meaningful new coverage includes 7/8/19 work layouts and counts, actual coincident-frame ray selection after hiding a page, obstructed/different-floor/air/water access rejection, one-shot/cancelled timelines, and real Three camera/book/card restoration with E input. Final Vite/Sites build passed (existing >500 kB Three chunk warning). Rebuilt architecture, baked lighting and denoised lightmap. The actual final GLB passed all 21 native mesh check groups, 2,600 rays with zero failures; both UV channels retained.

CUA browser proof: walked to the profile desk, pressed E, observed a pi-radian cover opening and all five profile sections, then Escape returned the exact body/camera pose. Walked up the stairs to the upper desk, clicked the messenger E action, observed the card rising toward the camera, read all four contact links and closed it; card position and camera restored exactly. Completion cues disappeared individually. The bottom messenger and touch/footer controls fit the default 364 × 672 viewport without horizontal overflow. Desktop 1280 × 800 DOM bounds fit; that viewport showed compositor ghosting and later slow browser response, so the override was reset. Do not claim desktop screenshot/performance parity from those captures.

Evidence in C:/Users/user/Documents/Codex/2026-10-03/new-chat-2/outputs: profile-book-approach.png, profile-book-open.png, contact-card-approach.png, contact-card-lift.png, contact-card-open.png, right-exhibition-front.png, native-33-degree-probes.json, content-objects-geometry.log, content-objects-bake.log, content-objects-denoise.log, exhibition-foliage-bake.log and exhibition-foliage-denoise.log. The early right-exhibition-front capture predates the final side-frame spacing adjustment.

Changed sources: src/App.jsx, src/styles.css, src/state/session.js, src/scene/createScene.js, new DeskObjects.js/ContentInteraction.js/interactionModel.js, shared navigation layout and controller, tools/build_atelier.py, tools/bake_lighting.py and tests/portfolio.test.mjs. No new dependencies, deployment or commit.

Final browser follow-through: a native canvas click on the E1 frame at the right wall entered the camera-focus phase, then opened E1's original description, three metadata fields, original full artwork and Web link. Escape restored the exact preceding position/yaw/pitch and removed only project-06's completion cue. The default viewport was successfully restored after a delayed viewport-reset response. A later actual W walk brought CJ올리브영 into E range, confirming the repositioned middle frame has unobstructed line of sight.

The final middle frame (project-05) also opened through native E input and retained both Process/Web links and the original artwork. Its focus camera reached [-0.069584, 2.3572, -5.2576] while the body stayed at [0.32638, 0, -3.261665]; closing restored that body pose. Final browser error/warning log was empty. Returned viewport is 364 × 672 with no horizontal overflow; right preview explicitly shown and retained. Final side-slot Z positions are -6.27, -4.96, -1.46 to clear the wall climber.
## Continuous interior finish and foliage repair — 2026-10-22

Latest implementation: matched 1F/2F east interior faces at x=3.65, straight
full-height oak, a continuous flat white 1F soffit, white remaining ceilings,
and the retained beige 2F cove without its three inner lines. Both outer frame
returns now reach paving and overlapping stone volumes are joined. The stair
arrival planter reaches its wall. Exterior sconces are brighter; continuous
recessed lighting follows the planter backs, rising stair garden and inside
door reveal. The cloudy sky/ambient palette, content, piano, cursor, loader and
ending remain in place.

Fixed foliage before spatial batching: whole leaf charts retain their shape,
UVs and curl. Connected branches translate together, with only actual doorway
obstructions pruned. The derivative reconstructs individual curve tubes rather
than applying generic mesh collapse. Complex doorway junctions retain native
surfaces, and library ivy follows the expanded upper wall. Original native leaf
and tree assets and full source texture dimensions are retained.

Validation: 187 npm tests passed, Vite/Sites build passed (existing large Three
chunk warning). Native Blender proof passed 26 frame/wood/flat-soffit rays and
126 stair-headroom rays. Foliage proof checked 673,876 runtime runner vertices
and 294,742 faces against the fitted native garden: maximum face-to-native-
surface distance 0.010014m, no factory cube, 516,538 total garden triangles.
The bounded derivative payload is 21,399,430 bytes / 20.41 MiB.

CUA flow: centred entrance, door/planter illumination, exterior and both cove
ceilings inspected. Actual shortcut navigation opened the profile and 2F contact
note, and all six works opened with 6/6 progression. The profile and works closed
back to the physical scene. No content links were followed or modified.

Full-scene render measurements use the actual production createScene/composer,
quality=1, native scale=1, 76 renders with 12 warmup and 64 measured GPU queries.
Desktop 1280x720: GPU median 17.49ms / p95 22.33ms, max 434 draw calls and
2,808,823 triangles. Responsive 390x844 on the same PC: GPU median 6.43ms /
p95 9.57ms, max 342 draws and 2,361,614 triangles. This is a viewport comparison
on the same hardware, not a physical phone benchmark or universal FPS guarantee.
Compared with the previous same-method check (17.78/26.05ms desktop and
6.82/9.75ms narrow viewport), GPU cost did not increase. IAB background RAF
throttling and main-thread scheduling outliers are not treated as game FPS.

Evidence: C:/Users/user/Documents/Codex/2026-10-13/code/outputs/finishing-2026-10-22,
including native-proof.log, garden-proof.log, tests-delivery.txt, build-delivery.log,
performance-desktop.json, performance-mobile.json and visual captures. The
isolated measurement page is removed from the final preview build. No deployment,
publication, Git commit or original-content edit.

Final production-page visual check: 1280x720 desktop and 390x844 responsive
captures show meaningful nonblank 3D content and the original controls. Narrow
layout has scrollWidth=clientWidth=390 and no visible button outside the viewport.
The final error/warning query returned an empty array. Temporary viewport settings
were reset and agent-created QA tabs closed. Final captures: facade-final.png,
entrance-final.png, door-final.png, upper-ceiling.png and mobile-final.png.


## Entrance garden, matching stone and room light spill, 2026-10-22

The six latest detail references are resolved: regenerated final-size entrance
planting with whole scanned leaves replaces displaced/clipped columns and bare
runners; side courtyard walls use the entrance's bright warm travertine finish
and indirect floor. Removed the obsolete floating window lattice and the old
front return inside the expanded ground room. Door top light now joins both
sides beneath the stone lintel at y=3.895. Both front rooms have warmer cove
recesses, offline broad bounced light and two floor-confined spill quads merged
into the existing glow draw. No additional real lights, passes or frame loops.

Native proof: 30 geometry rays passed, including three clear rays through the
removed wall and a direct hit on the exposed door top diffuser, plus 126 stair
headroom rays. Garden comparison includes ALL native branch meshes, including
the new entrance patch: 651,324 runtime vertices and 288,186 faces checked;
max vertex distance 0.019580m, max face-to-native-surface distance 0.009993m.
Runtime garden decreased from 516,538 to 504,514 triangles. Original source
assets and full scanned leaf texture dimensions remain intact.

187 tests passed and production Vite/Sites build passed. Existing large Three
chunk warning remains. CUA opened the actual work reader via physical shortcut,
closed back to scene, and inspected the unobstructed right artwork. Entrance
lighting, restored planting, matched side walls and both facade levels captured.
390x844 production page has meaningful content, no horizontal overflow or
out-of-viewport buttons; mobile shortcut menu responds; cold-load console has
no errors or warnings. Desktop tab's accumulated log includes one earlier
ANGLE numerical-precision warning from its pre-rebuild page, no runtime error.

Same-machine complete-scene/composer timing, native scale=1, quality=1:
1280x720 GPU median 17.96ms / p95 21.53ms, max 422 draws / 2,807,801 triangles.
390x844 GPU median 6.43ms / p95 9.69ms, max 332 draws / 2,372,845 triangles.
64 GPU samples each after 12 warmup frames. Desktop median is comparable to
previous 17.49ms, p95 improves from 22.33ms; narrow median remains 6.43ms.
This is the same PC at two viewport sizes, not a physical phone or universal
FPS claim. Wall-clock scheduling outliers are retained in the saved JSON.

Evidence: C:/Users/user/Documents/Codex/2026-10-13/code/outputs/wall-garden-2026-10-22
(native-proof.log, garden-proof.log, tests.log, perf-desktop.json, perf-narrow.json,
front-light.png, entry-garden-light.png, exhibit-without-lattice.png,
mobile-finish.png). Final production rebuild removes the isolated perf page.


## Aligned architectural details, 2026-10-22

Latest eleven references: removed the paper lantern and its head collision,
the small bed tree rooted inside the west frame, and complete vine charts and
runners intruding into the upper timber walls. Preserved the actual potted
studio tree and natural entrance planting. Ground east masonry/oak now reaches
the west side's 2.50m front. Upper west oak reaches 2.70m and the cove advances
to 2.61m. Native rail and physical support stop at x=-5.20 before the timber.
Both cove ceilings share one white material pair. Stair sconces embed into the
measured oak faces, with solid concealed mounts reaching the backing wall.
Bench moves to photo-left away from the door (logical centre x=3.25), with its
native seat/legs, baked shadows, sitting range and collision using one layout.
Removed the old runtime bench squeeze so it cannot be transformed twice.

Roof rectangle is [-5.35,3.72,-3.54,3.255], top flush with the frame, right edge
over its outer return and front at the recessed light's plane. Its west edge
leaves a 2cm wall gap. Both native roof and headroom share this rectangle.
Ground/airborne walls and rail endpoints share the new finish dimensions.

Validation: 189 full tests passed; final asset/performance subset 8 passed;
production build passed with the established Three chunk-size warning. Native
geometry: 52 rays (including roof, timber ends, open rail end, all three flush
sconce mounts and bench bounds) plus 126 stair headroom rays passed. 2,045,135
native garden vertices checked with no intrusion in the upper timber region.
Derivative foliage: 646,899 branch vertices and 286,199 faces checked against
ALL native branch surfaces, max vertex distance .019580m and max face distance
.009994m; 501,615 garden triangles. Original native assets and source photo
texture dimensions retained. No new lights, animation loops or full-screen pass.

CUA: actual moved bench seat/stand worked, and the physical shortcut route from
the bench opened the upstairs contact note and returned to the scene. Final
close-up confirms complete upper west oak, continuous white cove and clean rail
end, with no stray leaves on the timber. Desktop front, bench position and
390x844 production captures saved; narrow page width=viewport width=390, no
out-of-bounds buttons or framework overlay. Cold narrow load has no errors or
warnings. Desktop has no runtime errors; one nonfatal ANGLE X4122 numerical
precision compiler warning remains while shaders compile and render correctly.

Complete-scene/composer measurements, quality=1, native scale=1, 12 warmup +
64 GPU samples on the same PC: 1280x720 median 18.95ms / p95 23.57ms, max 403
draws and 2,714,741 triangles; 390x844 median 6.63ms / p95 9.39ms, max 318 draws
and 2,352,414 triangles. Previous desktop was 17.96/21.53ms with 422 draws;
new geometry uses fewer draws/triangles, while measured GPU median is .99ms
higher. Retain the actual measurements, including scheduling outliers. This is
a same-PC viewport test, not physical-phone validation or a universal FPS claim.

Evidence: C:/Users/user/Documents/Codex/2026-10-13/code/outputs/aligned-details-2026-10-22
(native-proof.log, upper-foliage-proof.log, garden-proof.log, tests-final.log,
final-assets-tests.log, final-build.log, perf-desktop.json, perf-narrow.json,
facade-white-ceilings.png, upper-wood-ceiling-rail.png, bench-moved-left.png,
mobile-final.png). Final production rebuild removes the measurement page.
