// Kinematic gait generator: pure functions mapping (gait, time, joint) -> target angle.
// The GaitDriver in the scene eases current angles toward these targets each frame.

import { clamp, type JointDef, type JointId, type LegId } from './skeleton';

export type GaitId = 'idle' | 'walk' | 'trot' | 'sit' | 'shake';

export interface GaitInfo {
  id: GaitId;
  label: string;
  desc: string;
}

export const GAITS: GaitInfo[] = [
  { id: 'idle', label: 'Idle', desc: 'Standing with subtle breathing sway' },
  { id: 'walk', label: 'Walk', desc: 'Four-beat lateral sequence walk' },
  { id: 'trot', label: 'Trot', desc: 'Two-beat diagonal gait' },
  { id: 'sit', label: 'Sit', desc: 'Assisted sit, hind limbs folded' },
  { id: 'shake', label: 'Shake-a-paw', desc: 'Sit and offer the right paw' },
];

const TAU = Math.PI * 2;

// Footfall phase offsets per gait (fraction of cycle)
const WALK_PHASE: Record<LegId, number> = { FR: 0.0, FL: 0.5, HR: 0.25, HL: 0.75 };
const TROT_PHASE: Record<LegId, number> = { FL: 0.0, HR: 0.0, FR: 0.5, HL: 0.5 };

/** Smooth one-sided pulse used for leg lift during the swing phase. */
const lift = (p: number) => Math.pow(Math.max(0, Math.sin(TAU * p)), 2);

interface CycleParams {
  freq: number;
  swingAmp: number; // proximal joint fore/aft swing
  midAmp: number;   // elbow/stifle flexion
  distalAmp: number; // carpus/hock flexion
}

function cyclic(joint: JointDef, t: number, phase: Record<LegId, number>, p: CycleParams): number {
  const ph = t * p.freq + phase[joint.leg];
  if (joint.index === 0) return joint.rest + p.swingAmp * Math.sin(TAU * ph);
  // Flex slightly ahead of the swing apex so the paw clears the ground
  const amp = joint.index === 1 ? p.midAmp : p.distalAmp;
  return joint.rest + joint.flexDir * amp * lift(ph + 0.12);
}

// Static poses (degrees) keyed by joint label within each leg group
const SIT_FRONT = { 0: -8, 1: 20, 2: -10 } as const;
const SIT_HIND = { 0: 70, 1: -110, 2: 100 } as const;

function sitPose(joint: JointDef): number {
  const table = joint.leg.startsWith('F') ? SIT_FRONT : SIT_HIND;
  return table[joint.index];
}

export function sampleGait(gait: GaitId, t: number, joint: JointDef): number {
  let target: number;
  switch (gait) {
    case 'idle': {
      const hash = joint.leg.charCodeAt(1) * 1.3 + joint.index * 2.1;
      target = joint.rest + 2.5 * Math.sin(t * 1.6 + hash);
      break;
    }
    case 'walk':
      target = cyclic(joint, t, WALK_PHASE, { freq: 1.1, swingAmp: 16, midAmp: 30, distalAmp: 26 });
      break;
    case 'trot':
      target = cyclic(joint, t, TROT_PHASE, { freq: 2.2, swingAmp: 21, midAmp: 38, distalAmp: 32 });
      break;
    case 'sit':
      target = sitPose(joint);
      break;
    case 'shake': {
      target = sitPose(joint);
      if (joint.leg === 'FR') {
        // Offered paw: extended forward with a friendly wobble
        const w = Math.sin(t * 7 + joint.index);
        target = joint.index === 0 ? -62 + 5 * w : joint.index === 1 ? 58 + 10 * w : -25 + 8 * w;
      }
      break;
    }
  }
  return clamp(target, joint.min, joint.max);
}

export interface BodyPose {
  /** body pitch in degrees about the front-axle pivot; negative = rear drops */
  pitch: number;
  /** vertical bob in meters */
  lift: number;
}

/** Pivot for body pitch: roughly the front leg mounts, so sitting drops the rear. */
export const BODY_PIVOT: [number, number, number] = [0, 0.42, 0.24];

export function sampleBodyPose(gait: GaitId, t: number): BodyPose {
  switch (gait) {
    case 'idle':
      return { pitch: 0, lift: 0.004 * Math.sin(t * 1.8) };
    case 'walk':
      return { pitch: 0.6 * Math.sin(TAU * 2.2 * t), lift: 0.008 * Math.sin(TAU * 2.2 * t + 1) };
    case 'trot':
      return { pitch: 1.0 * Math.sin(TAU * 4.4 * t), lift: 0.014 * Math.sin(TAU * 4.4 * t + 1) };
    case 'sit':
    case 'shake':
      return { pitch: -20, lift: 0 };
  }
}

export type JointAngles = Record<JointId, number>;
