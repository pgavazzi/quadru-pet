import { create } from 'zustand';
import { restAngles, type JointId } from './model/skeleton';
import type { GaitId } from './model/gaits';

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
}));
