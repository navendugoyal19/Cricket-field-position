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
    // BASED ON SCREENSHOT ANALYSIS
    // 30-yard circle appears at ~20% inset visually
    // Ring fielders must be at x: 25-75%
    // ============================================

    // BOUNDARY - Behind wicket (y < 20%)
    { name: 'Third man', x: 20, y: 10, size: 'large' },
    { name: 'Fine leg', x: 80, y: 10, size: 'large' },

    // SLIPS AREA - Inside circle (y: 24-32%)
    { name: 'Slips', x: 38, y: 25, size: 'large' },
    { name: '1st', x: 44, y: 26, size: 'small' },
    { name: '2nd', x: 41, y: 27, size: 'small' },
    { name: '3rd', x: 38, y: 28, size: 'small' },
    { name: '4th', x: 35, y: 29, size: 'small' },

    // GULLY - 45° behind square (closer to slips than point)
    { name: 'Gully', x: 30, y: 32, size: 'large' },

    // LEG SIDE CLOSE - INSIDE circle
    { name: 'Leg slip', x: 56, y: 26, size: 'small' },
    { name: 'Leg gully', x: 68, y: 32, size: 'small' },
    { name: 'Short leg', x: 60, y: 36, size: 'small' },
    { name: 'Silly point', x: 42, y: 36, size: 'small' },
    { name: 'Backward square', x: 72, y: 34, size: 'small' },

    // POINT - 90° square (same level as Square Leg)
    { name: 'Point', x: 26, y: 42, size: 'large' },
    { name: 'Backward point', x: 26, y: 36, size: 'small' },

    // SQUARE LEG - INSIDE circle (x: 72%, not 76%)
    { name: 'Square leg', x: 72, y: 42, size: 'large' },

    // DEEP POSITIONS - Outside circle (x < 20% or x > 80%)
    { name: 'Deep point', x: 12, y: 42, size: 'small' },
    { name: 'Deep square', x: 88, y: 42, size: 'small' },
    { name: 'Sweeper', x: 90, y: 48, size: 'small' },

    // COVER - INSIDE circle (x: 28-35%)
    { name: 'Cover', x: 28, y: 52, size: 'large' },
    { name: 'Extra cover', x: 34, y: 58, size: 'small' },
    { name: 'Deep cover', x: 14, y: 52, size: 'small' },

    // MID-WICKET - INSIDE circle (x: 65-72%)
    { name: 'Mid-wicket', x: 72, y: 52, size: 'large' },
    { name: 'Deep mid-wicket', x: 86, y: 52, size: 'small' },

    // MID-OFF / MID-ON - INSIDE circle (x: 38-62%)
    { name: 'Mid-off', x: 38, y: 64, size: 'large' },
    { name: 'Mid-on', x: 62, y: 64, size: 'large' },
    { name: 'Deep mid-off', x: 30, y: 76, size: 'small' },
    { name: 'Deep mid-on', x: 70, y: 76, size: 'small' },

    // BOUNDARY - Long (y > 85%)
    { name: 'Long off', x: 35, y: 88, size: 'large' },
    { name: 'Long on', x: 65, y: 88, size: 'large' },
    { name: 'Cow corner', x: 80, y: 82, size: 'small' },
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
                        {fielder.name && fielder.name !== fielder.id && (
                            <div className="fielder-name-label">{fielder.name}</div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
