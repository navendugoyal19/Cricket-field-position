import { useRef, useEffect } from 'react';
import type { Fielder } from '../types';
import { getFielderColor } from '../utils/fieldPositions';

/**
 * Cricket Field Position Labels
 * 
 * CORRECT LAYOUT:
 * - Batsman (striker) at TOP CENTER, at the top crease
 * - Wicketkeeper BEHIND striker (above striker, near boundary)
 * - Slips form ARC next to wicketkeeper
 * - Bowler at BOTTOM CENTER
 * - Off side = LEFT, Leg side = RIGHT
 * 
 * Y-Axis: 0% = top boundary, 100% = bottom boundary
 * Striker at ~33%, Non-striker at ~67%, Wicketkeeper at ~18%
 */

const POSITION_LABELS = [
    // ============================================
    // BEHIND WICKET AREA (y: 5-28%)
    // Wicketkeeper at ~18%, Slips next to them
    // ============================================

    // Long stop - directly behind
    { name: 'Long stop', x: 50, y: 6, size: 'small' },

    // THIRD MAN REGION (Off side behind - top left)
    { name: 'Third man', x: 25, y: 14, size: 'large' },
    { name: 'Deep', x: 15, y: 10, size: 'small' },
    { name: 'Short', x: 30, y: 20, size: 'small' },
    { name: 'Fine', x: 38, y: 8, size: 'small' },

    // FINE LEG REGION (Leg side behind - top right)
    { name: 'Fine leg', x: 75, y: 14, size: 'large' },
    { name: 'Deep', x: 85, y: 10, size: 'small' },
    { name: 'Short', x: 70, y: 20, size: 'small' },
    { name: 'Long leg', x: 62, y: 8, size: 'small' },

    // ============================================
    // SLIP CORDON (Behind and beside wicketkeeper)
    // WK is at ~50%, 18% - slips arc toward off-side
    // ============================================
    { name: 'Slips', x: 40, y: 22, size: 'large' },
    { name: '1', x: 46, y: 20, size: 'small' },
    { name: '2', x: 44, y: 21, size: 'small' },
    { name: '3', x: 42, y: 22, size: 'small' },
    { name: '4', x: 40, y: 23, size: 'small' },
    { name: '5', x: 38, y: 24, size: 'small' },
    { name: '6', x: 36, y: 25, size: 'small' },
    { name: '7', x: 34, y: 26, size: 'small' },
    { name: '8', x: 32, y: 27, size: 'small' },
    { name: '9', x: 30, y: 28, size: 'small' },
    { name: 'Fly slip', x: 35, y: 17, size: 'small' },

    // LEG SLIP AREA (Leg side of WK)
    { name: 'Leg slip', x: 54, y: 20, size: 'small' },
    { name: 'Leg gully', x: 62, y: 24, size: 'small' },
    { name: 'Backward short leg', x: 65, y: 28, size: 'small' },

    // ============================================
    // GULLY AREA (Off side, behind square)
    // ============================================
    { name: 'Gully', x: 22, y: 32, size: 'large' },
    { name: 'Backward', x: 18, y: 28, size: 'small' },
    { name: 'Deep backward', x: 12, y: 22, size: 'small' },

    // ============================================
    // POINT AREA (Off side, square of wicket)
    // ============================================
    { name: 'Point', x: 15, y: 45, size: 'large' },
    { name: 'Backward', x: 12, y: 38, size: 'small' },
    { name: 'Deep', x: 8, y: 45, size: 'small' },
    { name: 'Forward', x: 18, y: 52, size: 'small' },
    { name: 'Cover point', x: 15, y: 55, size: 'small' },
    { name: 'Deep cover point', x: 8, y: 58, size: 'small' },

    // ============================================
    // SILLY / SHORT POSITIONS (Close to batsman ~35%)
    // ============================================
    { name: 'Silly point', x: 40, y: 40, size: 'small' },
    { name: 'Silly mid-off', x: 43, y: 45, size: 'small' },
    { name: 'Silly mid-on', x: 57, y: 45, size: 'small' },
    { name: 'Short leg', x: 60, y: 40, size: 'small' },
    { name: 'Short leg (Bat pad)', x: 62, y: 36, size: 'small' },

    // ============================================
    // COVER AREA (Off side, forward of square)
    // ============================================
    { name: 'Cover', x: 22, y: 62, size: 'large' },
    { name: 'Extra cover', x: 28, y: 68, size: 'small' },
    { name: 'Deep', x: 10, y: 65, size: 'small' },

    // ============================================
    // MID-OFF AREA (Off side, bowler's end)
    // ============================================
    { name: 'Mid-off', x: 38, y: 75, size: 'large' },
    { name: 'Short', x: 42, y: 58, size: 'small' },
    { name: 'Deep', x: 32, y: 82, size: 'small' },
    { name: 'Deep extra cover', x: 15, y: 78, size: 'small' },

    // ============================================
    // LONG OFF (Off side boundary)
    // ============================================
    { name: 'Long off', x: 35, y: 92, size: 'large' },
    { name: 'Wide', x: 20, y: 88, size: 'small' },
    { name: 'Straight', x: 45, y: 94, size: 'small' },
    { name: 'Straight hit', x: 50, y: 96, size: 'small' },

    // ============================================
    // MID-ON AREA (Leg side, bowler's end)
    // ============================================
    { name: 'Mid-on', x: 62, y: 75, size: 'large' },
    { name: 'Short', x: 58, y: 58, size: 'small' },
    { name: 'Deep', x: 68, y: 82, size: 'small' },

    // ============================================
    // LONG ON (Leg side boundary)
    // ============================================
    { name: 'Long on', x: 65, y: 92, size: 'large' },
    { name: 'Wide', x: 80, y: 88, size: 'small' },
    { name: 'Straight', x: 55, y: 94, size: 'small' },

    // ============================================
    // MID-WICKET AREA (Leg side, forward of square)
    // ============================================
    { name: 'Mid-wicket', x: 78, y: 62, size: 'large' },
    { name: 'Forward', x: 72, y: 68, size: 'small' },
    { name: 'Deep', x: 88, y: 65, size: 'small' },
    { name: 'Deep forward', x: 90, y: 75, size: 'small' },

    // ============================================
    // SQUARE LEG AREA (Leg side, square of wicket)
    // ============================================
    { name: 'Square leg', x: 85, y: 45, size: 'large' },
    { name: 'Backward', x: 88, y: 38, size: 'small' },
    { name: 'Forward', x: 82, y: 52, size: 'small' },
    { name: 'Deep', x: 92, y: 45, size: 'small' },
    { name: 'Deep sweeper', x: 92, y: 58, size: 'small' },
    { name: 'Deep backward', x: 90, y: 30, size: 'small' },
];

interface CricketFieldProps {
    fielders: Fielder[];
    isLeftHanded: boolean;
    selectedId: string | null;
    draggingId: string | null;
    onMouseDown: (id: string) => void;
    onMouseMove: (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void;
    onMouseUp: () => void;
    onSelect: (id: string | null) => void;
}

export function CricketField({
    fielders,
    isLeftHanded,
    selectedId,
    draggingId,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onSelect,
}: CricketFieldProps) {
    const fieldRef = useRef<HTMLDivElement>(null);

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!draggingId) return;
        e.preventDefault();
        onMouseMove(e);
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onSelect(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onSelect]);

    return (
        <div
            id="cricket-field"
            ref={fieldRef}
            className="cricket-field"
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={onMouseUp}
            onClick={() => onSelect(null)}
        >
            <div className="grass-texture" />
            <div className="boundary-rope" />
            <div className="thirty-yard-circle" />

            {/* Position Labels */}
            <div className="position-labels">
                {POSITION_LABELS.map((label, index) => {
                    const displayX = isLeftHanded ? 100 - label.x : label.x;
                    return (
                        <div
                            key={`${label.name}-${index}`}
                            className={`position-label ${label.size}`}
                            style={{
                                left: `${displayX}%`,
                                top: `${label.y}%`,
                            }}
                        >
                            {label.name}
                        </div>
                    );
                })}
            </div>

            {/* Pitch */}
            <div className="pitch">
                <div className="crease popping-crease-top" />
                <div className="crease return-crease-top-left" />
                <div className="crease return-crease-top-right" />
                <div className="crease popping-crease-bottom" />
                <div className="crease return-crease-bottom-left" />
                <div className="crease return-crease-bottom-right" />

                <div className="stumps-container stumps-top">
                    <div className="stump" /><div className="stump" /><div className="stump" />
                    <div className="bails" />
                </div>
                <div className="stumps-container stumps-bottom">
                    <div className="stump" /><div className="stump" /><div className="stump" />
                    <div className="bails bails-bottom" />
                </div>
            </div>

            {/* Batsmen */}
            <div className="batsman-marker batsman-striker">
                <div className="batsman-icon">S</div>
            </div>
            <div className="batsman-marker batsman-nonstriker">
                <div className="batsman-icon">NS</div>
            </div>

            {/* Umpires */}
            <div className="umpire-marker square-leg-umpire">
                <div className="umpire-icon">Sq L U</div>
            </div>
            <div className="umpire-marker main-umpire">
                <div className="umpire-icon">U</div>
            </div>

            {/* Side labels */}
            <div className={`side-label offside ${isLeftHanded ? 'flipped' : ''}`}>Off side</div>
            <div className={`side-label legside ${isLeftHanded ? 'flipped' : ''}`}>On (Leg) side</div>

            {/* Fielders */}
            {fielders.map((fielder, index) => {
                const colors = getFielderColor(fielder.category);
                const isDragging = draggingId === fielder.id;
                const isSelected = selectedId === fielder.id;
                const displayX = isLeftHanded ? 100 - fielder.x : fielder.x;
                const isWK = fielder.id === 'wk';
                const isBowler = fielder.id === 'bowler';
                const displayNum = isWK ? 'WK' : isBowler ? 'B' : (index + 1).toString();

                return (
                    <div
                        key={fielder.id}
                        className={`fielder-marker ${isDragging ? 'dragging' : ''} ${isSelected ? 'selected' : ''} ${isWK ? 'keeper' : ''}`}
                        style={{ left: `${displayX}%`, top: `${fielder.y}%` }}
                        onMouseDown={(e) => { e.stopPropagation(); onMouseDown(fielder.id); onSelect(fielder.id); }}
                        onTouchStart={(e) => { e.stopPropagation(); onMouseDown(fielder.id); onSelect(fielder.id); }}
                    >
                        <div className="fielder-dot" style={{ background: colors.bg, borderColor: colors.border }}>
                            {displayNum}
                        </div>
                        <div className="fielder-name-label">{fielder.name}</div>
                    </div>
                );
            })}
        </div>
    );
}
