import { create } from 'zustand';
import { restAngles, type JointId } from './model/skeleton';
import type { GaitId } from './model/gaits';
import { fitFactors, SIZE_CLASS_BY_ID, type Measurements, type SizeClass } from './model/fit';

export interface ViewOptions {
  exploded: number;     // 0..1
  bodyOpacity: number;  // 0..1
  wireframe: boolean;
  turntable: boolean;
  ledColor: string;
}

interface AppState {
  angles: Record<JointId, number>;
  setAngle: (id: JointId, value: number) => void;
  setAngles: (next: Record<JointId, number>) => void;
  resetPose: () => void;

  selection: string | null; // JointId or PartDef id
  select: (id: string | null) => void;

  gait: GaitId;
  playing: boolean;
  setGait: (g: GaitId) => void;
  setPlaying: (p: boolean) => void;

  body: { pitch: number; lift: number };
  setBody: (pitch: number, lift: number) => void;

  view: ViewOptions;
  setView: (v: Partial<ViewOptions>) => void;

  /** hind-assist configuration: front leg rigs removed, 6 actuators instead of 12 */
  hindAssist: boolean;
  setHindAssist: (on: boolean) => void;

  sizeClass: SizeClass;
  fit: Measurements;
  /** select a breed size class and load its default measurements */
  setSizeClass: (c: SizeClass) => void;
  /** override individual measurements (cm) */
  setFit: (m: Partial<Measurements>) => void;
}

export const useStore = create<AppState>((set) => ({
  angles: restAngles(),
  setAngle: (id, value) => set((s) => ({ angles: { ...s.angles, [id]: value } })),
  setAngles: (next) => set({ angles: next }),
  resetPose: () => set({ angles: restAngles() }),

  selection: null,
  select: (id) => set({ selection: id }),

  gait: 'walk',
  playing: false,
  setGait: (gait) => set({ gait }),
  setPlaying: (playing) => set({ playing }),

  body: { pitch: 0, lift: 0 },
  setBody: (pitch, lift) => set({ body: { pitch, lift } }),

  view: {
    exploded: 0,
    bodyOpacity: 1,
    wireframe: false,
    turntable: false,
    ledColor: '#22d3ee',
  },
  setView: (v) => set((s) => ({ view: { ...s.view, ...v } })),

  hindAssist: false,
  setHindAssist: (hindAssist) =>
    set((s) => ({
      hindAssist,
      // front actuators no longer exist in hind-assist config
      selection: hindAssist && /^F[LR]_/.test(s.selection ?? '') ? null : s.selection,
    })),

  sizeClass: 'medium',
  fit: { ...SIZE_CLASS_BY_ID.medium.m },
  setSizeClass: (c) => set({ sizeClass: c, fit: { ...SIZE_CLASS_BY_ID[c].m } }),
  setFit: (m) => set((s) => ({ fit: { ...s.fit, ...m } })),
}));

/** Derived scale/stretch factors for the current measurements. */
export const useFitFactors = () => fitFactors(useStore((s) => s.fit));
