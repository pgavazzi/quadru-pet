// Breed size classes and measurement-based fitting.
// Measurements are in centimeters; the modeled geometry corresponds to BASE.

export type SizeClass = 'toy' | 'mini' | 'medium' | 'large' | 'xl' | 'giant';

export interface Measurements {
  /** withers (shoulder) height, cm */
  withers: number;
  /** sternum-to-rump body length, cm */
  length: number;
  /** chest girth (circumference), cm */
  girth: number;
}

/** The measurements the base geometry in skeleton.ts was modeled at. */
export const BASE: Measurements = { withers: 50, length: 60, girth: 77 };

export interface SizeClassDef {
  id: SizeClass;
  label: string;
  desc: string;
  m: Measurements;
}

export const SIZE_CLASSES: SizeClassDef[] = [
  { id: 'toy', label: 'Toy', desc: 'Chihuahua, Yorkie', m: { withers: 24, length: 30, girth: 38 } },
  { id: 'mini', label: 'Miniature', desc: 'Mini Poodle, Westie', m: { withers: 33, length: 40, girth: 52 } },
  { id: 'medium', label: 'M', desc: 'Border Collie, Beagle', m: { withers: 50, length: 60, girth: 77 } },
  { id: 'large', label: 'L', desc: 'Labrador, GSD', m: { withers: 60, length: 72, girth: 92 } },
  { id: 'xl', label: 'XL', desc: 'Rottweiler, Bernese', m: { withers: 70, length: 84, girth: 108 } },
  { id: 'giant', label: 'Giant', desc: 'Great Dane, Mastiff', m: { withers: 80, length: 96, girth: 124 } },
];

export const SIZE_CLASS_BY_ID: Record<SizeClass, SizeClassDef> = Object.fromEntries(
  SIZE_CLASSES.map((c) => [c.id, c]),
) as Record<SizeClass, SizeClassDef>;

export const MEASUREMENT_RANGES: Record<keyof Measurements, [number, number]> = {
  withers: [20, 90],
  length: [25, 100],
  girth: [30, 130],
};

export interface FitFactors {
  /** uniform model scale, from withers height */
  scale: number;
  /** trunk stretch along the body axis, relative to the uniform scale */
  lengthF: number;
  /** trunk/chest thickening, relative to the uniform scale */
  girthF: number;
}

export function fitFactors(m: Measurements): FitFactors {
  const scale = m.withers / BASE.withers;
  return {
    scale,
    lengthF: m.length / BASE.length / scale,
    girthF: m.girth / BASE.girth / scale,
  };
}

export function isCustom(m: Measurements, sizeClass: SizeClass): boolean {
  const preset = SIZE_CLASS_BY_ID[sizeClass].m;
  return m.withers !== preset.withers || m.length !== preset.length || m.girth !== preset.girth;
}
