# QuadruPet — Canine Exoskeleton Configurator

Interactive 3D viewer/configurator for a 12-actuator dog exoskeleton.
Vite + React 19 + TypeScript, three.js via @react-three/fiber, drei, postprocessing, zustand.

## Commands

- `npm run dev` — dev server (port 5173)
- `npm run build` — type-check (`tsc -b`) + production build
- `npx tsc -b` — type-check only

## Architecture

State flows one way: **store → scene + UI**. `src/store.ts` (zustand) holds joint
angles, selection, gait/playing, body pose, and view options. Everything reads
from it; nothing talks component-to-component.

- `src/model/skeleton.ts` — single source of truth for the robot: 4 legs × 3
  joints (`JointDef`: limits, rest angle, segment length, radii) plus the
  selectable non-actuator `PARTS`. All geometry and UI derive from these tables —
  to resize or re-pose the robot, edit here, not the meshes.
- `src/model/gaits.ts` — pure functions `sampleGait(gait, t, joint)` and
  `sampleBodyPose(gait, t)` returning target angles/pose. No three.js imports.
- `src/scene/` — R3F components. `Viewport.tsx` owns the Canvas, lighting,
  postprocessing, and `GaitDriver` (eases store angles toward gait targets each
  frame). `LegRig.tsx` is the kinematic chain; joint rotations are applied
  transiently in `useFrame` via refs, NOT through React props — keep it that way
  for 60 fps playback.
- `src/scene/materials.ts` — shared module-level materials (incl. procedural
  carbon-fiber CanvasTexture). Wireframe/LED-color/dog-opacity view options
  mutate these shared materials imperatively via `ViewController` in Viewport.
- `src/ui/` — plain React panels styled by `src/styles.css` (CSS variables, no
  UI framework).

## Conventions

- Units: **degrees** in the store/UI/model; convert with `DEG` from skeleton.ts
  only at the point of applying `rotation.x`. Lengths in meters.
- Joint ids are `${legId}_${jointName}` (e.g. `HL_stifle`); leg ids FL/FR/HL/HR.
- Dog faces +Z, up is +Y, left side is +X. Joints rotate about local X.
- Selection ids are either a `JointId` or a `PartDef.id` — `PropertiesPanel`
  branches on `JOINT_BY_ID` membership.
- Adding a gait: add the id to `GaitId` + `GAITS` in gaits.ts and a case in
  `sampleGait`/`sampleBodyPose`. Targets are clamped to joint limits centrally —
  don't clamp in gait code.

## Gotchas

- `Canvas shadows="percentage"` is deliberate: the default soft shadow type is
  deprecated in three ≥0.184 and spams console warnings.
- During gait playback the GaitDriver writes all 12 angles to the store every
  frame; UI components must subscribe with narrow selectors
  (`useStore(s => s.angles[id])`) to avoid wide re-renders.
- The drei `Environment` uses procedural `Lightformer`s on purpose — no network
  fetch for HDRIs, so the app works offline.
