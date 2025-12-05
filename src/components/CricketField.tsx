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
    // TOP - BEHIND WICKET AREA (y: 5-25%)
    // WK at ~18%, Slips beside WK
    // ============================================

    // Third Man - Off side, behind (top left area)
    { name: 'Third man', x: 22, y: 12, size: 'large' },
    { name: 'Deep', x: 15, y: 8, size: 'small' },
    { name: 'Short', x: 28, y: 18, size: 'small' },

    // Long stop - directly behind
    { name: 'Long stop', x: 50, y: 6, size: 'small' },

    // Fine Leg - Leg side, behind (top right area)
    { name: 'Fine leg', x: 78, y: 12, size: 'large' },
    { name: 'Deep', x: 85, y: 8, size: 'small' },
    { name: 'Short', x: 72, y: 18, size: 'small' },
    { name: 'Long leg', x: 60, y: 7, size: 'small' },

    // ============================================
    // CLOSE CATCHERS - INSIDE 30-YARD CIRCLE
    // These positions are ALWAYS inside the circle
    // ============================================

    // Slips - Arc beside wicketkeeper (off-side) - y: 28-35%
    { name: 'Slips', x: 40, y: 30, size: 'large' },
    { name: '1', x: 46, y: 28, size: 'small' },
    { name: '2', x: 44, y: 29, size: 'small' },
    { name: '3', x: 42, y: 30, size: 'small' },
    { name: '4', x: 40, y: 31, size: 'small' },
    { name: '5', x: 38, y: 32, size: 'small' },
    { name: '6', x: 36, y: 33, size: 'small' },
    { name: 'Fly slip', x: 30, y: 26, size: 'small' },

    // Leg Slip - beside WK on leg side - y: 28-32%
    { name: 'Leg slip', x: 55, y: 28, size: 'small' },
    { name: 'Leg gully', x: 62, y: 32, size: 'small' },
    { name: 'Backward short leg', x: 60, y: 34, size: 'small' },

    // Gully - Off side, behind square - INSIDE circle (y: 32-36%)
    { name: 'Gully', x: 25, y: 34, size: 'large' },
    { name: 'Backward', x: 20, y: 30, size: 'small' },
    { name: 'Deep backward', x: 12, y: 22, size: 'small' },

    // ============================================
    // SQUARE POSITIONS (y: 36-45%)
    // Point, Square Leg, Short leg
    // ============================================

    // Point - Off side, SQUARE of wicket (y: 38-42%)
    { name: 'Point', x: 18, y: 40, size: 'large' },
    { name: 'Backward', x: 15, y: 36, size: 'small' },
    { name: 'Deep', x: 8, y: 40, size: 'small' },

    // Short leg area - close to batsman, leg side
    { name: 'Short leg', x: 58, y: 38, size: 'small' },
    { name: 'Forward short leg', x: 56, y: 42, size: 'small' },

    // Silly positions (very close to batsman) - y: 38-42%
    { name: 'Silly point', x: 42, y: 38, size: 'small' },
    { name: 'Silly mid-off', x: 44, y: 44, size: 'small' },
    { name: 'Silly mid-on', x: 56, y: 44, size: 'small' },

    // Square Leg - Leg side, SQUARE of wicket (y: 38-42%)
    { name: 'Square leg', x: 82, y: 40, size: 'large' },
    { name: 'Backward', x: 85, y: 34, size: 'small' },
    { name: 'Deep', x: 92, y: 40, size: 'small' },
    { name: 'Deep backward', x: 88, y: 28, size: 'small' },

    // ============================================
    // MIDDLE - COVER / MID-WICKET AREA (y: 45-60%)
    // ============================================

    // Cover - Off side, forward of square
    { name: 'Cover', x: 20, y: 55, size: 'large' },
    { name: 'Extra cover', x: 28, y: 60, size: 'small' },
    { name: 'Deep', x: 10, y: 55, size: 'small' },
    { name: 'Cover point', x: 15, y: 48, size: 'small' },

    // Mid-wicket - Leg side, forward of square
    { name: 'Mid-wicket', x: 80, y: 55, size: 'large' },
    { name: 'Forward', x: 75, y: 60, size: 'small' },
    { name: 'Deep', x: 90, y: 55, size: 'small' },
    { name: 'Forward', x: 82, y: 48, size: 'small' },
    { name: 'Deep sweeper', x: 92, y: 52, size: 'small' },

    // ============================================
    // LOWER MIDDLE - MID-OFF / MID-ON AREA (y: 65-80%)
    // ============================================

    // Mid-off - Straight, off side
    { name: 'Mid-off', x: 38, y: 72, size: 'large' },
    { name: 'Short', x: 42, y: 58, size: 'small' },
    { name: 'Deep', x: 32, y: 82, size: 'small' },
    { name: 'Deep extra cover', x: 15, y: 78, size: 'small' },

    // Mid-on - Straight, leg side
    { name: 'Mid-on', x: 62, y: 72, size: 'large' },
    { name: 'Short', x: 58, y: 58, size: 'small' },
    { name: 'Deep', x: 68, y: 82, size: 'small' },
    { name: 'Deep forward', x: 85, y: 78, size: 'small' },

    // ============================================
    // BOTTOM - BOUNDARY AREA (y: 85-95%)
    // ============================================

    // Long off - Off side boundary
    { name: 'Long off', x: 35, y: 92, size: 'large' },
    { name: 'Wide', x: 20, y: 90, size: 'small' },
    { name: 'Straight', x: 45, y: 94, size: 'small' },

    // Straight hit - directly behind bowler
    { name: 'Straight hit', x: 50, y: 95, size: 'small' },

    // Long on - Leg side boundary
    { name: 'Long on', x: 65, y: 92, size: 'large' },
    { name: 'Wide', x: 80, y: 90, size: 'small' },
    { name: 'Straight', x: 55, y: 94, size: 'small' },
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
