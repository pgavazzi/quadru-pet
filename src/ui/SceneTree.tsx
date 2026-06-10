import { LEGS, PARTS } from '../model/skeleton';
import { useStore } from '../store';

function Node({
  id,
  label,
  depth,
  icon,
}: {
  id: string;
  label: string;
  depth: number;
  icon: string;
}) {
  const selected = useStore((s) => s.selection === id);
  const select = useStore((s) => s.select);
  return (
    <button
      className={`tree-node ${selected ? 'selected' : ''}`}
      style={{ paddingLeft: 10 + depth * 14 }}
      onClick={() => select(id)}
    >
      <span className="tree-icon">{icon}</span>
      {label}
    </button>
  );
}

export function SceneTree() {
  const spineParts = PARTS.filter((p) => p.id !== 'dog');
  return (
    <div className="scene-tree">
      <h2 className="panel-title">Scene</h2>
      <div className="tree-node root">
        <span className="tree-icon">▣</span> Exoskeleton
      </div>
      {spineParts.map((p) => (
        <Node key={p.id} id={p.id} label={p.label} depth={1} icon="▢" />
      ))}
      {LEGS.map((leg) => (
        <div key={leg.id}>
          <div className="tree-node group" style={{ paddingLeft: 24 }}>
            <span className="tree-icon">┗</span> {leg.label}
          </div>
          {leg.joints.map((j) => (
            <Node key={j.id} id={j.id} label={`${j.label} actuator`} depth={2} icon="◉" />
          ))}
        </div>
      ))}
      <Node id="dog" label="Canine (test subject)" depth={0} icon="♥" />
    </div>
  );
}
