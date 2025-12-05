import { useRef, useEffect } from 'react';
import type { Fielder } from '../types';
import { getFielderColor } from '../utils/fieldPositions';

/**
 * Cricket Field - Simple Direct Coordinates
 * 
 * Layout (Y-axis):
 * - 0% = Top of field (boundary behind WK)
 * - 18% = Wicketkeeper position
 * - 33% = Striker batsman (at crease)
 * - 50% = Center of field / pitch
 * - 67% = Non-striker (at other crease)
 * - 78% = Bowler position
 * - 100% = Bottom boundary
 * 
 * X-axis:
 * - 0% = Left (off-side for right-hander)
 * - 50% = Center (pitch line)
 * - 100% = Right (leg-side for right-hander)
 */

// Simple position labels with direct x,y coordinates
// Carefully placed based on cricket field layout
const POSITION_LABELS = [
    // ============================================
    // BATSMAN REFERENCE: Striker at y: 35%
    // Behind batsman: y < 35%
    // Level/Square: y ≈ 35-42%
    // In front: y > 42%
    // ============================================

    // BOUNDARY - BEHIND BATSMAN (y: 5-20%)
    { name: 'Third man', x: 22, y: 12, size: 'large' },
    { name: 'Deep third man', x: 15, y: 8, size: 'small' },
    { name: 'Fine leg', x: 78, y: 12, size: 'large' },
    { name: 'Deep fine leg', x: 85, y: 8, size: 'small' },
    { name: 'Long leg', x: 68, y: 10, size: 'small' },
    { name: 'Long stop', x: 50, y: 6, size: 'small' },

    // CLOSE CATCHERS - BEHIND BATSMAN (y: 26-34%)
    // WK at ~30%, Slips arc behind, Gully behind square
    { name: 'Slips', x: 40, y: 30, size: 'large' },
    { name: '1st', x: 46, y: 29, size: 'small' },
    { name: '2nd', x: 44, y: 30, size: 'small' },
    { name: '3rd', x: 42, y: 31, size: 'small' },
    { name: '4th', x: 40, y: 32, size: 'small' },
    { name: '5th', x: 38, y: 33, size: 'small' },
    { name: 'Fly slip', x: 32, y: 26, size: 'small' },
    { name: 'Gully', x: 26, y: 33, size: 'large' },
    { name: 'Backward gully', x: 22, y: 28, size: 'small' },
    { name: 'Leg slip', x: 54, y: 30, size: 'small' },
    { name: 'Leg gully', x: 60, y: 33, size: 'small' },
    { name: 'Backward short leg', x: 58, y: 32, size: 'small' },

    // SQUARE POSITIONS - LEVEL WITH BATSMAN (y: 35-42%)
    // Point & Square leg at square of wicket
    { name: 'Point', x: 18, y: 38, size: 'large' },
    { name: 'Backward point', x: 15, y: 35, size: 'small' },
    { name: 'Deep point', x: 8, y: 38, size: 'small' },
    { name: 'Square leg', x: 82, y: 38, size: 'large' },
    { name: 'Backward square', x: 85, y: 35, size: 'small' },
    { name: 'Deep square', x: 92, y: 38, size: 'small' },
    { name: 'Short leg', x: 56, y: 37, size: 'small' },
    { name: 'Silly point', x: 44, y: 36, size: 'small' },
    { name: 'Silly mid-off', x: 46, y: 40, size: 'small' },
    { name: 'Silly mid-on', x: 54, y: 40, size: 'small' },
    { name: 'Forward short leg', x: 56, y: 42, size: 'small' },

    // FORWARD - IN FRONT OF BATSMAN (y: 45-58%)
    // Cover, Cover Point, Mid-wicket
    { name: 'Cover point', x: 18, y: 45, size: 'small' },
    { name: 'Cover', x: 22, y: 52, size: 'large' },
    { name: 'Extra cover', x: 28, y: 55, size: 'small' },
    { name: 'Deep cover', x: 12, y: 52, size: 'small' },
    { name: 'Mid-wicket', x: 78, y: 52, size: 'large' },
    { name: 'Forward mid-wicket', x: 75, y: 55, size: 'small' },
    { name: 'Deep mid-wicket', x: 88, y: 52, size: 'small' },
    { name: 'Deep sweeper', x: 92, y: 48, size: 'small' },

    // STRAIGHT - IN FRONT OF BATSMAN (y: 60-75%)
    // Mid-off, Mid-on (closer to bowler)
    { name: 'Mid-off', x: 40, y: 65, size: 'large' },
    { name: 'Short mid-off', x: 44, y: 55, size: 'small' },
    { name: 'Deep mid-off', x: 35, y: 80, size: 'small' },
    { name: 'Deep extra cover', x: 18, y: 75, size: 'small' },
    { name: 'Mid-on', x: 60, y: 65, size: 'large' },
    { name: 'Short mid-on', x: 56, y: 55, size: 'small' },
    { name: 'Deep mid-on', x: 65, y: 80, size: 'small' },
    { name: 'Deep mid-wicket', x: 82, y: 75, size: 'small' },

    // BOUNDARY - IN FRONT OF BATSMAN (y: 88-95%)
    // Long off, Long on, straight
    { name: 'Long off', x: 38, y: 92, size: 'large' },
    { name: 'Wide long off', x: 22, y: 90, size: 'small' },
    { name: 'Straight long off', x: 45, y: 94, size: 'small' },
    { name: 'Long on', x: 62, y: 92, size: 'large' },
    { name: 'Wide long on', x: 78, y: 90, size: 'small' },
    { name: 'Straight long on', x: 55, y: 94, size: 'small' },
    { name: 'Straight hit', x: 50, y: 95, size: 'small' },
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
            if (e.key === 'Escape') onSelect(null);
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
                {/* Top End */}
                <div className="crease popping-crease-top" />
                <div className="crease bowling-crease-top" />
                <div className="crease return-crease-top-left" />
                <div className="crease return-crease-top-right" />
                <div className="crease wide-line-top-left" />
                <div className="crease wide-line-top-right" />

                {/* Bottom End */}
                <div className="crease popping-crease-bottom" />
                <div className="crease bowling-crease-bottom" />
                <div className="crease return-crease-bottom-left" />
                <div className="crease return-crease-bottom-right" />
                <div className="crease wide-line-bottom-left" />
                <div className="crease wide-line-bottom-right" />

                {/* Stumps */}
                <div className="stumps-container stumps-top">
                    <div className="stump" /><div className="stump" /><div className="stump" />
                    <div className="bails" />
                </div>
                <div className="stumps-container stumps-bottom">
                    <div className="stump" /><div className="stump" /><div className="stump" />
                    <div className="bails bails-bottom" />
                </div>
            </div>

            {/* Batsmen - Top-down 3D view */}
            <div className="batsman-marker batsman-striker">
                <div className="batsman-figure">
                    <div className="shoulders"></div>
                    <div className="helmet"></div>
                    <div className="bat"></div>
                </div>
            </div>
            <div className="batsman-marker batsman-nonstriker">
                <div className="batsman-figure">
                    <div className="shoulders"></div>
                    <div className="helmet"></div>
                    <div className="bat non-striker-bat"></div>
                </div>
            </div>

            {/* Umpires */}
            <div className="umpire-marker square-leg-umpire"><div className="umpire-icon">Sq L U</div></div>
            <div className="umpire-marker main-umpire"><div className="umpire-icon">U</div></div>

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
                    </div>
                );
            })}
        </div>
    );
}
