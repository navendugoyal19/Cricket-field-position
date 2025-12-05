import { useState } from 'react';
import type { Fielder, SavedSetup } from '../types';
import { getSavedSetups, saveSetup, deleteSetup } from '../utils/storage';

interface SavedSetupsModalProps {
  isOpen: boolean;
  mode: 'save' | 'load';
  fielders: Fielder[];
  isLeftHanded: boolean;
  onClose: () => void;
  onLoad: (setup: SavedSetup) => void;
}

export function SavedSetupsModal({
  isOpen,
  mode,
  fielders,
  isLeftHanded,
  onClose,
  onLoad,
}: SavedSetupsModalProps) {
  const [setupName, setSetupName] = useState('');
  const [savedSetups, setSavedSetups] = useState<SavedSetup[]>(getSavedSetups());

  if (!isOpen) return null;

  const handleSave = () => {
    if (!setupName.trim()) return;
    saveSetup(setupName.trim(), fielders, isLeftHanded);
    setSavedSetups(getSavedSetups());
    setSetupName('');
    onClose();
  };

  const handleDelete = (id: string) => {
    deleteSetup(id);
    setSavedSetups(getSavedSetups());
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{mode === 'save' ? '💾 Save Setup' : '📂 Load Setup'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          {mode === 'save' && (
            <div className="save-form">
              <input
                type="text"
                className="save-input"
                placeholder="Enter setup name..."
                value={setupName}
                onChange={(e) => setSetupName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                autoFocus
              />
              <button
                className="save-btn"
                onClick={handleSave}
                disabled={!setupName.trim()}
              >
                Save
              </button>
            </div>
          )}

          <div className="setups-list">
            {savedSetups.length === 0 ? (
              <div className="no-setups">
                <span>📋</span>
                <p>No saved setups yet</p>
              </div>
            ) : (
              savedSetups.map((setup) => (
                <div key={setup.id} className="setup-item">
                  <div className="setup-info">
                    <span className="setup-name">{setup.name}</span>
                    <span className="setup-meta">
                      {setup.fielders.length} fielders • {setup.isLeftHanded ? 'Left' : 'Right'}-handed • {formatDate(setup.createdAt)}
                    </span>
                  </div>
                  <div className="setup-actions">
                    {mode === 'load' && (
                      <button
                        className="action-btn load"
                        onClick={() => {
                          onLoad(setup);
                          onClose();
                        }}
                      >
                        Load
                      </button>
                    )}
                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(setup.id)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


