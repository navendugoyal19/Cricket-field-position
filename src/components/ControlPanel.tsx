import { FIELD_PRESETS } from '../utils/fieldPositions';

interface ControlPanelProps {
  currentPreset: string;
  isLeftHanded: boolean;
  isNightMode: boolean;
  canUndo: boolean;
  canRedo: boolean;
  onPresetChange: (presetId: string) => void;
  onToggleHandedness: () => void;
  onToggleNightMode: () => void;
  onUndo: () => void;
  onRedo: () => void;
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
}

export function ControlPanel({
  currentPreset,
  isLeftHanded,
  isNightMode,
  canUndo,
  canRedo,
  onPresetChange,
  onToggleHandedness,
  onToggleNightMode,
  onUndo,
  onRedo,
  onSave,
  onLoad,
  onExport,
}: ControlPanelProps) {
  return (
    <div className="control-panel">
      <div className="control-group">
        <label className="control-label">Field Preset</label>
        <select
          className="preset-select"
          value={currentPreset}
          onChange={(e) => onPresetChange(e.target.value)}
        >
          {FIELD_PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.name}
            </option>
          ))}
        </select>
      </div>

      <div className="control-group">
        <label className="control-label">Batsman</label>
        <button
          className={`toggle-btn ${!isLeftHanded ? 'active' : ''}`}
          onClick={onToggleHandedness}
        >
          <span className={`toggle-option ${!isLeftHanded ? 'active' : ''}`}>Right</span>
          <span className={`toggle-option ${isLeftHanded ? 'active' : ''}`}>Left</span>
        </button>
      </div>

      <div className="control-group">
        <label className="control-label">Mode</label>
        <button
          className={`toggle-btn ${isNightMode ? 'night' : ''}`}
          onClick={onToggleNightMode}
          title="Toggle Day/Night Mode"
        >
          <span className={`toggle-option ${!isNightMode ? 'active' : ''}`}>☀️ Day</span>
          <span className={`toggle-option ${isNightMode ? 'active' : ''}`}>🌙 Night</span>
        </button>
      </div>

      <div className="control-divider" />

      <div className="control-group buttons">
        <button
          className="control-btn"
          onClick={onUndo}
          disabled={!canUndo}
          title="Undo (Ctrl+Z)"
        >
          ↩️ Undo
        </button>
        <button
          className="control-btn"
          onClick={onRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Y)"
        >
          ↪️ Redo
        </button>
      </div>

      <div className="control-divider" />

      <div className="control-group buttons">
        <button className="control-btn" onClick={onSave} title="Save current setup">
          💾 Save
        </button>
        <button className="control-btn" onClick={onLoad} title="Load saved setup">
          📂 Load
        </button>
        <button className="control-btn primary" onClick={onExport} title="Export as PNG">
          📷 Export
        </button>
      </div>
    </div>
  );
}


