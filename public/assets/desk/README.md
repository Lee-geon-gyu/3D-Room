# Desk faces

These PNGs are unmodified 1280 x 720 browser captures of the actual Profile and
Contact DetailView, using locally hosted sans-serif fonts and original
portfolio content. The profile image contains all five original sections.
DeskObjects.js crops the screen/card in UV space, so no surrounding scene is
printed on either prop.

Profile screen bounds: x 18, y 18, width 1244, height 684.
Contact face bounds: x 260, y 100.5, width 760, height 519.

The contact page is the restored clean white capture. The notebook's single
binding ring, punched cover and paper stack are separate meshes. Its reader
projects that same torus into front/rear layers around a transparent punch.
Do not bake those parts into the printed
page texture. Its cover is closed on the desk and makes a complete turn beneath
the contact page before the live reader handoff; closing reverses that same path.
letter-title.svg contains only the outlined "Letter" title, derived from the
locally available Segoe Script, without bundling a font. A separate transparent
foil mesh follows the cover. notebookBinding.js owns both the silver ring and
the physical punch dimensions. The paper masks the rear metal except inside
its real transparent hole; there is no independent reader-ring illustration.

When changing either UI or its content, capture its settled desktop dialog
again at 1280 x 720, replace the corresponding PNG, and update its UV crop if
the sheet bounds changed. Capture after fonts/images and opening animations
have finished. The physical tablet's screen remains black until activated;
its power animation is independent of the captured content.
