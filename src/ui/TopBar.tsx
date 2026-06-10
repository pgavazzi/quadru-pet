import { GAITS } from '../model/gaits';
import { useStore } from '../store';

export function TopBar({ onFullscreen }: { onFullscreen: () => void }) {
  const gait = useStore((s) => s.gait);
  const playing = useStore((s) => s.playing);
  const setPlaying = useStore((s) => s.setPlaying);
  const gaitLabel = GAITS.find((g) => g.id === gait)?.label ?? gait;

  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-dot" />
        <span className="brand-name">QUADRU·PET</span>
        <span className="brand-sub">Canine Exoskeleton Configurator</span>
      </div>
      <div className="topbar-center">
        <span className={`status-pill ${playing ? 'live' : ''}`}>
          {playing ? `● ${gaitLabel}` : '◦ Manual pose'}
        </span>
        <button className="btn" onClick={() => setPlaying(!playing)}>
          {playing ? '❚❚ Pause' : '▶ Play'}
        </button>
      </div>
      <div className="topbar-right">
        <button className="btn ghost" onClick={onFullscreen} title="Fullscreen viewport">
          ⛶ Full screen
        </button>
      </div>
    </header>
  );
}
