import {
  CanvasTexture,
  Color,
  MeshStandardMaterial,
  RepeatWrapping,
} from 'three';

/** Procedural carbon-fiber weave so the frame reads as composite without external assets. */
function carbonTexture(): CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d')!;
  g.fillStyle = '#0d0f12';
  g.fillRect(0, 0, 128, 128);
  const s = 16;
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      const horizontal = (x + y) % 2 === 0;
      const grad = g.createLinearGradient(
        x * s, y * s,
        horizontal ? x * s + s : x * s,
        horizontal ? y * s : y * s + s,
      );
      grad.addColorStop(0, '#272c33');
      grad.addColorStop(0.5, '#14171b');
      grad.addColorStop(1, '#272c33');
      g.fillStyle = grad;
      g.fillRect(x * s, y * s, s, s);
    }
  }
  const t = new CanvasTexture(c);
  t.wrapS = t.wrapT = RepeatWrapping;
  t.repeat.set(4, 4);
  return t;
}

export const mats = {
  aluminum: new MeshStandardMaterial({ color: '#ccd2d9', metalness: 0.9, roughness: 0.32 }),
  darkMetal: new MeshStandardMaterial({ color: '#2b2f36', metalness: 0.85, roughness: 0.42 }),
  carbon: new MeshStandardMaterial({ map: carbonTexture(), color: '#aab0b8', metalness: 0.35, roughness: 0.5 }),
  strap: new MeshStandardMaterial({ color: '#c2410c', metalness: 0.05, roughness: 0.85 }),
  rubber: new MeshStandardMaterial({ color: '#16181c', metalness: 0.1, roughness: 0.95 }),
  dog: new MeshStandardMaterial({ color: '#b59a7e', metalness: 0.0, roughness: 0.95 }),
  dogDark: new MeshStandardMaterial({ color: '#6e5a44', metalness: 0.0, roughness: 0.95 }),
  led: new MeshStandardMaterial({ color: '#000000', emissive: new Color('#22d3ee'), emissiveIntensity: 3.2, toneMapped: true }),
};

const ALL = Object.values(mats);

export function setWireframe(on: boolean) {
  ALL.forEach((m) => (m.wireframe = on));
}

export function setLedColor(color: string) {
  mats.led.emissive.set(color);
}

export function setDogOpacity(opacity: number) {
  for (const m of [mats.dog, mats.dogDark]) {
    m.opacity = opacity;
    m.transparent = opacity < 1;
    m.visible = opacity > 0.02;
    m.depthWrite = opacity > 0.5;
  }
}
