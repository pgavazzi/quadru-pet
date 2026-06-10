# QuadruPet 🐕‍🦺

An interactive 3D configurator for a **canine exoskeleton** — a 12-actuator
assistive robotic frame worn by a dog. Built with Vite, React, TypeScript and
three.js (react-three-fiber).

## Features

- **Full kinematic model** — 4 legs × 3 actuated joints (shoulder/elbow/carpus,
  hip/stifle/hock) with anatomical joint limits, real parent→child chains, and
  a passive dog body wearing the frame
- **Per-actuator control** — 12 sliders grouped by leg with live angle readouts
- **Gait playback** — Idle, Walk (4-beat), Trot (2-beat diagonal), Sit and
  Shake-a-paw, generated kinematically with phase-offset curves and body pitch
- **Scene tree + properties** — click any actuator or component (viewport or
  tree) for simulated telemetry: torque, current, temperature
- **Service views** — exploded view, dog-body opacity, wireframe, turntable,
  status-LED color
- **Rendering** — PBR materials with procedural carbon fiber, environment
  lighting, contact shadows, and bloom on the LED rings

## Run it

```sh
npm install
npm run dev
```

## How it works

Joint definitions live in `src/model/skeleton.ts`; gaits are pure functions in
`src/model/gaits.ts` sampled each frame by a driver that eases the zustand
store's angles toward the targets. See [CLAUDE.md](CLAUDE.md) for the full
architecture notes.
