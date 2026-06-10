import { useEffect, useState } from 'react';
import { JOINT_BY_ID, PART_BY_ID, type JointId } from '../model/skeleton';
import { useStore } from '../store';

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="prop-row">
      <span className="prop-key">{k}</span>
      <span className="prop-val">{v}</span>
    </div>
  );
}

function JointProps({ id }: { id: JointId }) {
  const joint = JOINT_BY_ID[id];
  const angle = useStore((s) => s.angles[id]);
  const playing = useStore((s) => s.playing);
  const [tick, setTick] = useState(0);

  // slow tick so the simulated telemetry feels alive without per-frame renders
  useEffect(() => {
    const i = setInterval(() => setTick((t) => t + 1), 250);
    return () => clearInterval(i);
  }, []);

  const wobble = playing ? 2.4 + 1.8 * Math.sin(tick * 0.9 + joint.index) : 0;
  const torque = 1.6 + Math.abs(angle - joint.rest) * 0.11 + wobble;
  const temp = 31 + torque * 0.85;
  const current = torque * 0.42;
  const range = joint.max - joint.min;
  const pct = ((angle - joint.min) / range) * 100;

  return (
    <>
      <h2 className="panel-title">{joint.leg} · {joint.label} actuator</h2>
      <Row k="Angle" v={`${angle.toFixed(1)}°`} />
      <div className="range-viz">
        <div className="range-fill" style={{ width: `${pct}%` }} />
      </div>
      <Row k="Limits" v={`${joint.min}° … ${joint.max}°`} />
      <Row k="Rest" v={`${joint.rest}°`} />
      <Row k="Torque" v={`${torque.toFixed(1)} N·m`} />
      <Row k="Current" v={`${current.toFixed(2)} A`} />
      <Row k="Temp" v={`${temp.toFixed(1)} °C`} />
      <Row k="Status" v={temp > 40 ? 'WARM' : 'NOMINAL'} />
    </>
  );
}

export function PropertiesPanel() {
  const selection = useStore((s) => s.selection);

  if (!selection) {
    return (
      <div className="props">
        <h2 className="panel-title">Properties</h2>
        <p className="hint">Select an actuator or component — in the viewport or the scene tree.</p>
      </div>
    );
  }

  if (selection in JOINT_BY_ID) {
    return (
      <div className="props">
        <JointProps id={selection as JointId} />
      </div>
    );
  }

  const part = PART_BY_ID[selection];
  if (!part) return null;
  return (
    <div className="props">
      <h2 className="panel-title">{part.label}</h2>
      <Row k="Mass" v={part.mass} />
      <Row k="Material" v={part.material} />
      <p className="hint">{part.desc}</p>
    </div>
  );
}
