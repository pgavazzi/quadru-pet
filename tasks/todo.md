# QuadruPet — task tracker

## Current state (2026-06-10)

App is built, verified, and published at https://github.com/pgavazzi/quadru-pet.

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
- [x] Breed sizing: Toy/Miniature/M/L/XL/Giant presets + measurement sliders
      (withers height, body length, chest girth in cm) overriding defaults —
      Fit tab; model scales uniformly from withers with relative trunk
      stretch/girth factors (src/model/fit.ts)

Verified in browser: rendering, trot/shake playback, selection sync, exploded
view, dog opacity. `tsc -b` and `npm run build` clean.

- [x] **Hind-assist configuration** — cost-reduced variant with half the
      actuators: the front leg rigs (actuators + frame + mount struts) are
      removed entirely, leaving 6 actuators on the hind legs. The dog's bare
      front legs remain and still animate during gaits (its own walking).
      Config switch at the top of the Actuators tab; scene tree and sliders
      show only fitted hardware; selecting a removed actuator is cleared.

## To do

## Ideas / backlog

- [ ] IK foot planting so paws stay grounded during gaits
- [ ] URDF export of the joint definitions
- [ ] Deploy to GitHub Pages
