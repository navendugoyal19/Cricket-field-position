import { useState } from 'react';
import type { Fielder } from '../types';
import { getFielderColor } from '../utils/fieldPositions';

interface FielderPanelProps {
  fielders: Fielder[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRename: (id: string, newName: string) => void;
}

export function FielderPanel({ fielders, selectedId, onSelect, onRename }: FielderPanelProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleStartEdit = (fielder: Fielder, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(fielder.id);
    setEditValue(fielder.name);
  };

  const handleSaveEdit = () => {
    if (editingId && editValue.trim()) {
      onRename(editingId, editValue.trim());
    }
    setEditingId(null);
    setEditValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditingId(null);
      setEditValue('');
    }
  };

  return (
    <div className="fielder-panel">
      <h3 className="panel-title">
        <span className="icon">👥</span>
        Fielders ({fielders.length})
      </h3>
      <p className="panel-hint">Drag fielders to position them</p>

      <div className="fielder-list">
        {fielders.map((fielder, index) => {
          const colors = getFielderColor(fielder.category);
          const isSelected = selectedId === fielder.id;
          const isEditing = editingId === fielder.id;
          const isWicketkeeper = fielder.id === 'wk';
          const isBowler = fielder.id === 'bowler';
          const displayNum = isWicketkeeper ? 'WK' : isBowler ? 'B' : (index + 1);

          return (
            <div
              key={fielder.id}
              className={`fielder-item ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelect(fielder.id)}
              onDoubleClick={(e) => handleStartEdit(fielder, e)}
            >
              <div
                className="fielder-dot"
                style={{ background: colors.bg }}
              >
                {displayNum}
              </div>
              {isEditing ? (
                <input
                  type="text"
                  className="fielder-edit-input"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onBlur={handleSaveEdit}
                  onKeyDown={handleKeyDown}
                  autoFocus
                  onClick={(e) => e.stopPropagation()}
                />
              ) : (
                <span className="fielder-name">{fielder.name}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* LEGENDS Section */}
      <div className="legends-section">
        <h4>LEGENDS</h4>
        <div className="legend-items">
          <div className="legend-item">
            <span className="legend-dot mandatory"></span>
            <span>Bowler and Wicket-keeper (WK)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot primary"></span>
            <span>Primary position of the region</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot variation"></span>
            <span>Variations of the position</span>
          </div>
          <div className="legend-item">
            <span className="legend-square umpire"></span>
            <span>Umpire (U) and Square Leg Umpire</span>
          </div>
          <div className="legend-item">
            <span className="legend-square batsman"></span>
            <span>Striker (S), Non-striker (NS)</span>
          </div>
          <div className="legend-item">
            <span className="legend-circle-dashed"></span>
            <span>30-yard circle</span>
          </div>
          <div className="legend-item">
            <span className="legend-line"></span>
            <span>Boundary</span>
          </div>
        </div>
      </div>

      {/* GLOSSARY Section */}
      <div className="glossary-section">
        <h4>GLOSSARY</h4>
        <div className="glossary-items">
          <div className="glossary-item"><strong>Short:</strong> nearer batter</div>
          <div className="glossary-item"><strong>Silly:</strong> very near batter</div>
          <div className="glossary-item"><strong>Deep:</strong> further from batter</div>
          <div className="glossary-item"><strong>Wide:</strong> further from line of pitch</div>
          <div className="glossary-item"><strong>Fine, straight:</strong> nearer line of pitch</div>
          <div className="glossary-item"><strong>Square:</strong> near batter's crease</div>
          <div className="glossary-item"><strong>Backward:</strong> behind batter's crease</div>
          <div className="glossary-item"><strong>Forward:</strong> in front of batter's crease</div>
        </div>
      </div>
    </div>
  );
}
