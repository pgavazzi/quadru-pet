import { useRef } from 'react';
import { Viewport } from './scene/Viewport';
import { TopBar } from './ui/TopBar';
import { ControlPanel } from './ui/ControlPanel';
import { SceneTree } from './ui/SceneTree';
import { PropertiesPanel } from './ui/PropertiesPanel';
import { JOINT_BY_ID, PART_BY_ID, type JointId } from './model/skeleton';
import { useStore } from './store';

function SelectionChip() {
  const selection = useStore((s) => s.selection);
  if (!selection) return null;
  const joint = JOINT_BY_ID[selection as JointId];
  const label = joint ? `${joint.leg} ${joint.label}` : PART_BY_ID[selection]?.label ?? selection;
  return <div className="selection-chip">{label}</div>;
}

export default function App() {
  const viewportRef = useRef<HTMLDivElement>(null);

  const fullscreen = () => {
    const el = viewportRef.current;
    if (!el) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void el.requestFullscreen();
  };

  return (
    <div className="app">
      <TopBar onFullscreen={fullscreen} />
      <main className="layout">
        <ControlPanel />
        <div className="viewport" ref={viewportRef}>
          <Viewport />
          <SelectionChip />
        </div>
        <aside className="panel right">
          <SceneTree />
          <PropertiesPanel />
        </aside>
      </main>
    </div>
  );
}
