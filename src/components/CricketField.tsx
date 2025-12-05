import { useRef, useEffect } from 'react';
import type { Fielder } from '../types';
import { getFielderColor } from '../utils/fieldPositions';

/**
 * Cricket Field Position Labels - Batsman-Relative Coordinates
 * 
 * KEY INSIGHT: All fielding positions are measured relative to the 
 * BATSMAN'S POSITION at the crease, NOT the center of the field.
 * 
 * Batsman (striker) is at: x=50%, y=33% (at the top crease)
 * 
 * Angle reference (0° = toward bowler, measured clockwise):
 * - 0° = Straight toward bowler (Long off/Long on direction)
 * - 90° = Off-side (Point, Square cut area)
 * - 180° = Behind batsman (Slips, Third man)
 * - 270° (-90°) = Leg-side (Square leg, Fine leg)
 */

// Batsman position (striker's crease)
const BATSMAN_X = 50;
const BATSMAN_Y = 33;

// Helper: Calculate position from batsman using angle and distance
function fromBatsman(angleDegrees: number, distance: number): { x: number; y: number } {
    // Convert angle: 0° = down (toward bowler), clockwise positive
    // So 90° = right (off-side for right-hander), -90° = left (leg-side)
    const radians = (angleDegrees - 90) * (Math.PI / 180);
    const x = BATSMAN_X + distance * Math.cos(radians);
    const y = BATSMAN_Y + distance * Math.sin(radians);
    return { x: Math.max(5, Math.min(95, x)), y: Math.max(5, Math.min(95, y)) };
}

// Position labels with CORRECT angles relative to batsman
// Angle: 0° = toward bowler, 90° = off-side, -90° = leg-side, 180° = behind
const POSITIONS = [
    // ============================================
    // BEHIND BATSMAN (150° to 210°)
    // ============================================
    { name: 'Long stop', angle: 180, dist: 28, size: 'small' },

    // Third Man (Off-side, behind) - around 135-150°
    { name: 'Third man', angle: 145, dist: 52, size: 'large' },
    { name: 'Deep', angle: 155, dist: 58, size: 'small' },
    { name: 'Short', angle: 140, dist: 38, size: 'small' },
    { name: 'Fine', angle: 165, dist: 55, size: 'small' },

    // Fine Leg (Leg-side, behind) - around 210-235°
    { name: 'Fine leg', angle: 215, dist: 52, size: 'large' },
    { name: 'Deep', angle: 205, dist: 58, size: 'small' },
    { name: 'Short', angle: 220, dist: 38, size: 'small' },
    { name: 'Long leg', angle: 195, dist: 55, size: 'small' },

    // ============================================
    // SLIPS (Behind batsman, off-side) - 155-175°
    // ============================================
    { name: 'Slips', angle: 160, dist: 18, size: 'large' },
    { name: '1', angle: 168, dist: 12, size: 'small' },
    { name: '2', angle: 165, dist: 14, size: 'small' },
    { name: '3', angle: 162, dist: 16, size: 'small' },
    { name: '4', angle: 158, dist: 18, size: 'small' },
    { name: '5', angle: 154, dist: 20, size: 'small' },
    { name: '6', angle: 150, dist: 22, size: 'small' },
    { name: 'Fly slip', angle: 148, dist: 30, size: 'small' },

    // Leg slip (Behind, leg-side) - around 195°
    { name: 'Leg slip', angle: 192, dist: 12, size: 'small' },
    { name: 'Leg gully', angle: 215, dist: 20, size: 'small' },
    { name: 'Backward short leg', angle: 225, dist: 14, size: 'small' },

    // ============================================
    // GULLY (Off-side, behind square) - around 125-140°
    // ============================================
    { name: 'Gully', angle: 130, dist: 25, size: 'large' },
    { name: 'Backward', angle: 140, dist: 28, size: 'small' },
    { name: 'Deep backward', angle: 140, dist: 48, size: 'small' },

    // ============================================
    // POINT (Off-side, SQUARE - exactly 90°)
    // ============================================
    { name: 'Point', angle: 100, dist: 30, size: 'large' },
    { name: 'Backward', angle: 115, dist: 32, size: 'small' },
    { name: 'Deep', angle: 100, dist: 55, size: 'small' },
    { name: 'Cover point', angle: 80, dist: 30, size: 'small' },
    { name: 'Deep cover point', angle: 85, dist: 55, size: 'small' },

    // ============================================
    // SILLY/SHORT (Very close to batsman)
    // ============================================
    { name: 'Silly point', angle: 95, dist: 8, size: 'small' },
    { name: 'Silly mid-off', angle: 25, dist: 10, size: 'small' },
    { name: 'Silly mid-on', angle: 335, dist: 10, size: 'small' },
    { name: 'Short leg', angle: 265, dist: 8, size: 'small' },
    { name: 'Short leg (Bat pad)', angle: 250, dist: 10, size: 'small' },

    // ============================================
    // COVER (Off-side, forward - around 45-60°)
    // ============================================
    { name: 'Cover', angle: 55, dist: 35, size: 'large' },
    { name: 'Extra cover', angle: 40, dist: 35, size: 'small' },
    { name: 'Deep', angle: 55, dist: 55, size: 'small' },

    // ============================================
    // MID-OFF (Off-side, straight - around 15-25°)
    // ============================================
    { name: 'Mid-off', angle: 20, dist: 40, size: 'large' },
    { name: 'Short', angle: 20, dist: 25, size: 'small' },
    { name: 'Deep', angle: 15, dist: 52, size: 'small' },
    { name: 'Deep extra cover', angle: 45, dist: 58, size: 'small' },

    // ============================================
    // LONG OFF (Off-side boundary)
    // ============================================
    { name: 'Long off', angle: 12, dist: 60, size: 'large' },
    { name: 'Wide', angle: 35, dist: 58, size: 'small' },
    { name: 'Straight', angle: 5, dist: 62, size: 'small' },
    { name: 'Straight hit', angle: 0, dist: 63, size: 'small' },

    // ============================================
    // MID-ON (Leg-side, straight - around 335-345°)
    // ============================================
    { name: 'Mid-on', angle: 340, dist: 40, size: 'large' },
    { name: 'Short', angle: 340, dist: 25, size: 'small' },
    { name: 'Deep', angle: 345, dist: 52, size: 'small' },

    // ============================================
    // LONG ON (Leg-side boundary)
    // ============================================
    { name: 'Long on', angle: 348, dist: 60, size: 'large' },
    { name: 'Wide', angle: 325, dist: 58, size: 'small' },
    { name: 'Straight', angle: 355, dist: 62, size: 'small' },

    // ============================================
    // MID-WICKET (Leg-side, forward - around 300-320°)
    // ============================================
    { name: 'Mid-wicket', angle: 305, dist: 35, size: 'large' },
    { name: 'Forward', angle: 320, dist: 35, size: 'small' },
    { name: 'Deep', angle: 305, dist: 55, size: 'small' },
    { name: 'Deep forward', angle: 315, dist: 58, size: 'small' },

    // ============================================
    // SQUARE LEG (Leg-side, SQUARE - exactly 270°)
    // ============================================
    { name: 'Square leg', angle: 260, dist: 30, size: 'large' },
    { name: 'Backward', angle: 245, dist: 32, size: 'small' },
    { name: 'Forward', angle: 280, dist: 30, size: 'small' },
    { name: 'Deep', angle: 260, dist: 55, size: 'small' },
    { name: 'Deep sweeper', angle: 280, dist: 55, size: 'small' },
    { name: 'Deep backward', angle: 235, dist: 50, size: 'small' },
];

// Convert to x,y coordinates
const POSITION_LABELS = POSITIONS.map(pos => {
    const { x, y } = fromBatsman(pos.angle, pos.dist);
    return { name: pos.name, x, y, size: pos.size };
});

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
                            style={{ left: `${displayX}%`, top: `${label.y}%` }}
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
