# QuadruPet build — 2026-06-10

Plan approved by Paolo (see design brief in plan file).

- [x] Scaffold Vite + React + TS, install three/R3F/drei/postprocessing/zustand
- [x] Skeleton data model (12 joints, limits, segments) + zustand store
- [x] 3D scene: viewport, lighting, postprocessing, dog body, exoskeleton,
      actuator pods, kinematic leg chains
- [x] Actuator sliders + click-to-select with glow highlight
- [x] Gait engine: idle / walk / trot / sit / shake-a-paw + body pose
- [x] Scene tree, properties panel with simulated telemetry, view tab
      (exploded, opacity, wireframe, turntable, LED color)
- [x] CLAUDE.md + README
- [x] git repo + public GitHub repo + push

## Review

- Verified in browser: rendering, trot/shake playback, selection sync,
  exploded view, dog opacity. `tsc -b` and `npm run build` clean.
- Note: `npm create vite` finished writing boilerplate AFTER custom files were
  in place and clobbered App.tsx once — restored. Lesson recorded in
  tasks/lessons.md.
