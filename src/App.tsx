import { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import type { Fielder } from './types';
import { getPresetFielders, FIELD_PRESETS } from './utils/fieldPositions';
import { exportFieldAsImage } from './utils/exportImage';
import { detectPosition } from './utils/positionDetection';
import type { SavedSetup } from './types';
import { FielderPanel } from './components/FielderPanel';
import { ControlPanel } from './components/ControlPanel';
import { CricketField } from './components/CricketField';
import { SavedSetupsModal } from './components/SavedSetupsModal';

interface HistoryState {
  fielders: Fielder[];
  isLeftHanded: boolean;
}

function App() {
  // Core state
  const [fielders, setFielders] = useState<Fielder[]>(() => getPresetFielders('standard'));
  const [currentPreset, setCurrentPreset] = useState('standard');
  const [isLeftHanded, setIsLeftHanded] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // History for undo/redo
  const [history, setHistory] = useState<HistoryState[]>([
    { fielders: getPresetFielders('standard'), isLeftHanded: false }
  ]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Modal state
  const [modalMode, setModalMode] = useState<'save' | 'load' | null>(null);

  // Ref for tracking if we should add to history
  const skipHistoryRef = useRef(false);

  // Add to history
  const addToHistory = useCallback((newFielders: Fielder[], newIsLeftHanded: boolean) => {
    if (skipHistoryRef.current) {
      skipHistoryRef.current = false;
      return;
    }

    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1);
      newHistory.push({ fielders: newFielders, isLeftHanded: newIsLeftHanded });
      return newHistory.slice(-50); // Keep last 50 states
    });
    setHistoryIndex(prev => Math.min(prev + 1, 49));
  }, [historyIndex]);

  // Handle preset change
  const handlePresetChange = (presetId: string) => {
    const newFielders = getPresetFielders(presetId);
    setFielders(newFielders);
    setCurrentPreset(presetId);
    addToHistory(newFielders, isLeftHanded);
  };

  // Handle handedness toggle
  const handleToggleHandedness = () => {
    const newValue = !isLeftHanded;
    setIsLeftHanded(newValue);
    addToHistory(fielders, newValue);
  };

  // Handle undo
  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      skipHistoryRef.current = true;
      const prevState = history[historyIndex - 1];
      setFielders(prevState.fielders);
      setIsLeftHanded(prevState.isLeftHanded);
      setHistoryIndex(historyIndex - 1);
    }
  }, [history, historyIndex]);

  // Handle redo
  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      skipHistoryRef.current = true;
      const nextState = history[historyIndex + 1];
      setFielders(nextState.fielders);
      setIsLeftHanded(nextState.isLeftHanded);
      setHistoryIndex(historyIndex + 1);
    }
  }, [history, historyIndex]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  // Handle mouse/touch move for dragging
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!draggingId) return;

    const field = e.currentTarget;
    const rect = field.getBoundingClientRect();

    let clientX: number, clientY: number;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    let x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;

    // Clamp coordinates
    const clampedX = Math.max(3, Math.min(97, x));
    const clampedY = Math.max(3, Math.min(97, y));

    // If left-handed, we need to flip the x coordinate back for storage
    const storedX = isLeftHanded ? 100 - clampedX : clampedX;

    // Detect the position based on the new coordinates
    const detectedPosition = detectPosition(storedX, clampedY, isLeftHanded);

    setFielders(prev => prev.map(f => {
      if (f.id === draggingId) {
        // Update position with detected name/label
        return {
          ...f,
          x: storedX,
          y: clampedY,
          name: detectedPosition?.name || f.name,
          label: detectedPosition?.label || f.label,
          category: detectedPosition?.category || f.category,
        };
      }
      return f;
    }));
  };

  // Handle drag end
  const handleMouseUp = () => {
    if (draggingId) {
      addToHistory(fielders, isLeftHanded);
    }
    setDraggingId(null);
  };

  // Handle export
  const handleExport = () => {
    exportFieldAsImage('cricket-field', 'cricket-field-setup');
  };

  // Handle load setup
  const handleLoadSetup = (setup: SavedSetup) => {
    setFielders(setup.fielders);
    setIsLeftHanded(setup.isLeftHanded);
    setCurrentPreset('custom');
    addToHistory(setup.fielders, setup.isLeftHanded);
  };

  // Handle rename fielder
  const handleRenameFielder = (id: string, newName: string) => {
    const newFielders = fielders.map(f =>
      f.id === id ? { ...f, name: newName, label: newName } : f
    );
    setFielders(newFielders);
    addToHistory(newFielders, isLeftHanded);
  };

  const currentPresetInfo = FIELD_PRESETS.find(p => p.id === currentPreset);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1 className="logo">
            <span className="logo-icon">🏏</span>
            Cricket Field Planner
          </h1>
          <p className="tagline">Professional Field Position Tool</p>
        </div>
      </header>

      {/* Control Panel */}
      <ControlPanel
        currentPreset={currentPreset}
        isLeftHanded={isLeftHanded}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onPresetChange={handlePresetChange}
        onToggleHandedness={handleToggleHandedness}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onSave={() => setModalMode('save')}
        onLoad={() => setModalMode('load')}
        onExport={handleExport}
      />

      {/* Main Content */}
      <main className="main-content">
        {/* Fielder Panel */}
        <FielderPanel
          fielders={fielders}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onRename={handleRenameFielder}
        />

        {/* Field Container */}
        <div className="field-container">
          {currentPresetInfo && (
            <div className="preset-info">
              <span className="preset-name">{currentPresetInfo.name}</span>
              <span className="preset-desc">{currentPresetInfo.description}</span>
            </div>
          )}

          <CricketField
            fielders={fielders}
            isLeftHanded={isLeftHanded}
            selectedId={selectedId}
            draggingId={draggingId}
            onMouseDown={setDraggingId}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onSelect={setSelectedId}
          />

          <p className="instructions">
            🖱️ Drag fielders to reposition • ⌨️ Ctrl+Z/Y for undo/redo • 📷 Export to save as image
          </p>
        </div>
      </main>

      {/* Save/Load Modal */}
      <SavedSetupsModal
        isOpen={modalMode !== null}
        mode={modalMode || 'save'}
        fielders={fielders}
        isLeftHanded={isLeftHanded}
        onClose={() => setModalMode(null)}
        onLoad={handleLoadSetup}
      />
    </div>
  );
}

export default App;

