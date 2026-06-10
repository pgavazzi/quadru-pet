// Kinematic + part definitions for the QuadruPet canine exoskeleton.
// Units: meters and degrees. Dog faces +Z, up is +Y, left side is +X.

export type LegId = 'FL' | 'FR' | 'HL' | 'HR';
export type JointId =
  | 'FL_shoulder' | 'FL_elbow' | 'FL_carpus'
  | 'FR_shoulder' | 'FR_elbow' | 'FR_carpus'
  | 'HL_hip' | 'HL_stifle' | 'HL_hock'
  | 'HR_hip' | 'HR_stifle' | 'HR_hock';

export interface JointDef {
  id: JointId;
  label: string;
  leg: LegId;
  /** position in the leg chain: 0 = proximal (shoulder/hip), 2 = distal */
  index: 0 | 1 | 2;
  /** natural standing angle, degrees of rotation about the joint X axis */
  rest: number;
  min: number;
  max: number;
  /** direction of flexion used by the gait generator (+1 or -1 from rest) */
  flexDir: 1 | -1;
  /** length of the limb segment this joint drives */
  segmentLength: number;
  /** actuator motor housing radius */
  housingRadius: number;
  /** radius of the dog's own limb inside the frame */
  fleshRadius: number;
}

export interface LegDef {
  id: LegId;
  label: string;
  front: boolean;
  /** +1 = left (+X), -1 = right (-X) */
  side: 1 | -1;
  mount: [number, number, number];
  joints: JointDef[];
}

const frontJoints = (leg: LegId): JointDef[] => [
  { id: `${leg}_shoulder` as JointId, label: 'Shoulder', leg, index: 0, rest: -15, min: -60, max: 45, flexDir: 1, segmentLength: 0.16, housingRadius: 0.044, fleshRadius: 0.042 },
  { id: `${leg}_elbow` as JointId, label: 'Elbow', leg, index: 1, rest: 30, min: 0, max: 110, flexDir: 1, segmentLength: 0.16, housingRadius: 0.036, fleshRadius: 0.028 },
  { id: `${leg}_carpus` as JointId, label: 'Carpus', leg, index: 2, rest: -15, min: -70, max: 20, flexDir: -1, segmentLength: 0.09, housingRadius: 0.028, fleshRadius: 0.02 },
];

const hindJoints = (leg: LegId): JointDef[] => [
  { id: `${leg}_hip` as JointId, label: 'Hip', leg, index: 0, rest: 30, min: -30, max: 70, flexDir: 1, segmentLength: 0.18, housingRadius: 0.05, fleshRadius: 0.06 },
  { id: `${leg}_stifle` as JointId, label: 'Stifle', leg, index: 1, rest: -55, min: -110, max: 0, flexDir: -1, segmentLength: 0.18, housingRadius: 0.038, fleshRadius: 0.032 },
  { id: `${leg}_hock` as JointId, label: 'Hock', leg, index: 2, rest: 40, min: 0, max: 110, flexDir: 1, segmentLength: 0.11, housingRadius: 0.028, fleshRadius: 0.02 },
];

export const LEGS: LegDef[] = [
  { id: 'FL', label: 'Front Left', front: true, side: 1, mount: [0.13, 0.42, 0.26], joints: frontJoints('FL') },
  { id: 'FR', label: 'Front Right', front: true, side: -1, mount: [-0.13, 0.42, 0.26], joints: frontJoints('FR') },
  { id: 'HL', label: 'Hind Left', front: false, side: 1, mount: [0.14, 0.45, -0.26], joints: hindJoints('HL') },
  { id: 'HR', label: 'Hind Right', front: false, side: -1, mount: [-0.14, 0.45, -0.26], joints: hindJoints('HR') },
];

export const JOINTS: JointDef[] = LEGS.flatMap((l) => l.joints);

export const JOINT_BY_ID: Record<JointId, JointDef> = Object.fromEntries(
  JOINTS.map((j) => [j.id, j]),
) as Record<JointId, JointDef>;

export function restAngles(): Record<JointId, number> {
  return Object.fromEntries(JOINTS.map((j) => [j.id, j.rest])) as Record<JointId, number>;
}

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export const DEG = Math.PI / 180;

// ---- Non-actuator selectable parts -----------------------------------------

export interface PartDef {
  id: string;
  label: string;
  mass: string;
  material: string;
  desc: string;
}

export const PARTS: PartDef[] = [
  { id: 'spine_rail', label: 'Dorsal Spine Rail', mass: '0.84 kg', material: 'Carbon fiber / 7075-T6', desc: 'Segmented load-bearing rail distributing actuator reaction forces along the back.' },
  { id: 'battery', label: 'Battery Pack', mass: '1.20 kg', material: 'Li-ion 6S 48 Wh', desc: 'Hot-swappable rear power module. Feeds the actuators via the spine bus.' },
  { id: 'controller', label: 'Gait Controller', mass: '0.31 kg', material: 'PA12 nylon shell', desc: 'IMU + motor controller pod. Runs the gait generator at 500 Hz.' },
  { id: 'harness_front', label: 'Chest Harness', mass: '0.18 kg', material: 'TPU / nylon webbing', desc: 'Padded front strap transferring load to the sternum.' },
  { id: 'harness_rear', label: 'Belly Harness', mass: '0.16 kg', material: 'TPU / nylon webbing', desc: 'Rear strap stabilizing the rail over the lumbar spine.' },
  { id: 'dog', label: 'Canine (test subject)', mass: '24 kg', material: 'Very good boy', desc: 'Medium-build dog, fitted for hind-limb assist with full-limb support frame.' },
];

export const PART_BY_ID: Record<string, PartDef> = Object.fromEntries(PARTS.map((p) => [p.id, p]));
