import { useState } from 'react';
import { LEGS, type JointDef } from '../model/skeleton';
import { GAITS } from '../model/gaits';
import { useStore } from '../store';

const LED_COLORS = ['#22d3ee', '#4ade80', '#f97316', '#e11d48', '#a78bfa'];

function JointSlider({ joint, disabled }: { joint: JointDef; disabled: boolean }) {
  const angle = useStore((s) => s.angles[joint.id]);
  const setAngle = useStore((s) => s.setAngle);
  const selected = useStore((s) => s.selection === joint.id);
  const select = useStore((s) => s.select);

  return (
    <div className={`joint-row ${selected ? 'selected' : ''}`} onPointerDown={() => select(joint.id)}>
      <div className="joint-row-top">
        <span className="joint-label">{joint.label}</span>
        <span className="joint-value">{angle.toFixed(0)}°</span>
      </div>
      <input
        type="range"
        min={joint.min}
        max={joint.max}
        step={0.5}
        value={angle}
        disabled={disabled}
        onChange={(e) => setAngle(joint.id, Number(e.target.value))}
      />
    </div>
  );
}

function ActuatorsTab() {
  const playing = useStore((s) => s.playing);
  const resetPose = useStore((s) => s.resetPose);
  return (
    <div className="tab-body">
      {playing && <p className="hint">Pause playback to pose joints manually.</p>}
      {LEGS.map((leg) => (
        <section key={leg.id} className="leg-group">
          <h3>
            {leg.label} <span className="leg-id">{leg.id}</span>
          </h3>
          {leg.joints.map((j) => (
            <JointSlider key={j.id} joint={j} disabled={playing} />
          ))}
        </section>
      ))}
      <button className="btn wide" onClick={resetPose} disabled={playing}>
        Rest pose
      </button>
    </div>
  );
}

function GaitsTab() {
  const gait = useStore((s) => s.gait);
  const playing = useStore((s) => s.playing);
  const setGait = useStore((s) => s.setGait);
  const setPlaying = useStore((s) => s.setPlaying);
  return (
    <div className="tab-body">
      {GAITS.map((g) => (
        <button
          key={g.id}
          className={`gait-card ${gait === g.id ? 'active' : ''}`}
          onClick={() => {
            setGait(g.id);
            setPlaying(true);
          }}
        >
          <span className="gait-name">{g.label}</span>
          <span className="gait-desc">{g.desc}</span>
        </button>
      ))}
      <button className="btn wide" onClick={() => setPlaying(!playing)}>
        {playing ? '❚❚ Pause' : '▶ Play'}
      </button>
    </div>
  );
}

function ViewTab() {
  const view = useStore((s) => s.view);
  const setView = useStore((s) => s.setView);
  return (
    <div className="tab-body">
      <div className="joint-row">
        <div className="joint-row-top">
          <span className="joint-label">Exploded view</span>
          <span className="joint-value">{(view.exploded * 100).toFixed(0)}%</span>
        </div>
        <input
          type="range" min={0} max={1} step={0.01} value={view.exploded}
          onChange={(e) => setView({ exploded: Number(e.target.value) })}
        />
      </div>
      <div className="joint-row">
        <div className="joint-row-top">
          <span className="joint-label">Dog opacity</span>
          <span className="joint-value">{(view.bodyOpacity * 100).toFixed(0)}%</span>
        </div>
        <input
          type="range" min={0} max={1} step={0.01} value={view.bodyOpacity}
          onChange={(e) => setView({ bodyOpacity: Number(e.target.value) })}
        />
      </div>
      <label className="toggle-row">
        <span>Wireframe</span>
        <input type="checkbox" checked={view.wireframe} onChange={(e) => setView({ wireframe: e.target.checked })} />
      </label>
      <label className="toggle-row">
        <span>Turntable</span>
        <input type="checkbox" checked={view.turntable} onChange={(e) => setView({ turntable: e.target.checked })} />
      </label>
      <div className="swatch-row">
        <span className="joint-label">Status LEDs</span>
        <div className="swatches">
          {LED_COLORS.map((c) => (
            <button
              key={c}
              className={`swatch ${view.ledColor === c ? 'active' : ''}`}
              style={{ background: c }}
              onClick={() => setView({ ledColor: c })}
              aria-label={`LED color ${c}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const TABS = ['Actuators', 'Gaits', 'View'] as const;

export function ControlPanel() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Actuators');
  return (
    <aside className="panel left">
      <nav className="tabs">
        {TABS.map((t) => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </nav>
      {tab === 'Actuators' && <ActuatorsTab />}
      {tab === 'Gaits' && <GaitsTab />}
      {tab === 'View' && <ViewTab />}
    </aside>
  );
}
