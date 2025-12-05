import type { Position, Fielder, FieldPreset, FielderCategory } from '../types';

// All standard cricket fielding positions
// View: Looking from BEHIND the bowler towards the batsman
// Batsman at top center (striker's end), Bowler at bottom center (bowling end)
// Off side: LEFT side (x: 0-50%) for right-handed batsman
// Leg side: RIGHT side (x: 50-100%) for right-handed batsman
// y=0 is at top (behind wicket), y=100 is at bottom (bowler's end)

export const ALL_POSITIONS: Position[] = [
  // ============================================
  // 30-YARD CIRCLE BOUNDARY: 22% inset
  // Inside circle: x: 22-78%, y: 22-78%
  // ============================================

  // Keeper & Bowler
  { id: 'wk', name: 'Wicketkeeper', label: 'WK', x: 50, y: 30, category: 'keeper' },
  { id: 'bowler', name: 'Bowler', label: 'Bowler', x: 50, y: 72, category: 'bowler' },

  // Slip Cordon - ALL INSIDE circle (y > 22%)
  { id: 'slip1', name: '1st Slip', label: '1st Slip', x: 44, y: 30, category: 'slip' },
  { id: 'slip2', name: '2nd Slip', label: '2nd Slip', x: 40, y: 29, category: 'slip' },
  { id: 'slip3', name: '3rd Slip', label: '3rd Slip', x: 36, y: 28, category: 'slip' },
  { id: 'slip4', name: '4th Slip', label: '4th Slip', x: 32, y: 27, category: 'slip' },

  // Close Catchers - ALL INSIDE circle
  { id: 'gully', name: 'Gully', label: 'Gully', x: 25, y: 32, category: 'close' },
  { id: 'leg_slip', name: 'Leg Slip', label: 'Leg Slip', x: 56, y: 30, category: 'close' },
  { id: 'leg_gully', name: 'Leg Gully', label: 'Leg Gully', x: 70, y: 32, category: 'close' },
  { id: 'silly_point', name: 'Silly Point', label: 'Silly Pt', x: 40, y: 38, category: 'close' },
  { id: 'silly_mid_off', name: 'Silly Mid Off', label: 'Silly MO', x: 44, y: 45, category: 'close' },
  { id: 'silly_mid_on', name: 'Silly Mid On', label: 'Silly MOn', x: 56, y: 45, category: 'close' },
  { id: 'short_leg', name: 'Short Leg', label: 'Short Leg', x: 60, y: 38, category: 'close' },

  // Ring Field - INSIDE 30-yard circle (x: 22-78%, y: 22-78%)
  // Off Side
  { id: 'point', name: 'Point', label: 'Point', x: 24, y: 45, category: 'ring' },
  { id: 'backward_point', name: 'Backward Point', label: 'Bwd Pt', x: 24, y: 38, category: 'ring' },
  { id: 'cover', name: 'Cover', label: 'Cover', x: 28, y: 55, category: 'ring' },
  { id: 'extra_cover', name: 'Extra Cover', label: 'Ex Cover', x: 34, y: 62, category: 'ring' },
  { id: 'mid_off', name: 'Mid Off', label: 'Mid Off', x: 40, y: 68, category: 'ring' },

  // Leg Side
  { id: 'mid_on', name: 'Mid On', label: 'Mid On', x: 60, y: 68, category: 'ring' },
  { id: 'mid_wicket', name: 'Mid Wicket', label: 'Mid Wkt', x: 66, y: 62, category: 'ring' },
  { id: 'square_leg', name: 'Square Leg', label: 'Sq Leg', x: 76, y: 45, category: 'ring' },
  { id: 'backward_square', name: 'Backward Square Leg', label: 'Bwd Sq', x: 76, y: 38, category: 'ring' },

  // Fine positions (behind batsman) - INSIDE circle
  { id: 'fine_leg', name: 'Fine Leg', label: 'Fine Leg', x: 72, y: 28, category: 'ring' },
  { id: 'third_man', name: 'Third Man', label: '3rd Man', x: 28, y: 28, category: 'ring' },

  // ============================================
  // BOUNDARY - OUTSIDE 30-yard circle
  // ============================================
  { id: 'deep_point', name: 'Deep Point', label: 'Dp Point', x: 10, y: 45, category: 'boundary' },
  { id: 'deep_cover', name: 'Deep Cover', label: 'Dp Cover', x: 15, y: 60, category: 'boundary' },
  { id: 'long_off', name: 'Long Off', label: 'Long Off', x: 35, y: 92, category: 'boundary' },
  { id: 'long_on', name: 'Long On', label: 'Long On', x: 65, y: 92, category: 'boundary' },
  { id: 'deep_mid_wicket', name: 'Deep Mid Wicket', label: 'Dp MWkt', x: 85, y: 60, category: 'boundary' },
  { id: 'deep_square', name: 'Deep Square Leg', label: 'Dp Sq Leg', x: 90, y: 45, category: 'boundary' },
  { id: 'cow_corner', name: 'Cow Corner', label: 'Cow Cnr', x: 85, y: 82, category: 'boundary' },
  { id: 'deep_fine_leg', name: 'Deep Fine Leg', label: 'Dp Fine', x: 85, y: 15, category: 'boundary' },
  { id: 'deep_third_man', name: 'Deep Third Man', label: 'Dp 3rd', x: 15, y: 15, category: 'boundary' },
  { id: 'sweeper', name: 'Sweeper', label: 'Sweeper', x: 92, y: 50, category: 'boundary' },
];

// Field presets
export const FIELD_PRESETS: FieldPreset[] = [
  {
    id: 'standard',
    name: 'Standard',
    description: 'Balanced field for medium-pace bowling',
    fielderIds: ['wk', 'bowler', 'slip1', 'slip2', 'gully', 'point', 'cover', 'mid_off', 'mid_on', 'mid_wicket', 'fine_leg'],
  },
  {
    id: 'attacking',
    name: 'Attacking',
    description: 'Aggressive field for taking wickets',
    fielderIds: ['wk', 'bowler', 'slip1', 'slip2', 'slip3', 'gully', 'short_leg', 'silly_point', 'point', 'mid_off', 'mid_on'],
  },
  {
    id: 'defensive',
    name: 'Defensive',
    description: 'Spread field to stop runs',
    fielderIds: ['wk', 'bowler', 'cover', 'extra_cover', 'mid_off', 'mid_on', 'mid_wicket', 'square_leg', 'long_off', 'long_on', 'fine_leg'],
  },
  {
    id: 'powerplay',
    name: 'Powerplay',
    description: 'Limited overs powerplay field (max 2 outside circle)',
    fielderIds: ['wk', 'bowler', 'slip1', 'gully', 'point', 'cover', 'mid_off', 'mid_on', 'mid_wicket', 'square_leg', 'third_man'],
  },
  {
    id: 'death',
    name: 'Death Overs',
    description: 'Death overs field with boundary riders',
    fielderIds: ['wk', 'bowler', 'deep_point', 'deep_cover', 'long_off', 'long_on', 'deep_mid_wicket', 'deep_square', 'deep_fine_leg', 'third_man', 'point'],
  },
  {
    id: 'spin',
    name: 'Spin Attack',
    description: 'Field for spin bowling',
    fielderIds: ['wk', 'bowler', 'slip1', 'silly_point', 'short_leg', 'point', 'cover', 'mid_off', 'mid_on', 'mid_wicket', 'deep_mid_wicket'],
  },
];

// Get fielders for a preset
export function getPresetFielders(presetId: string): Fielder[] {
  const preset = FIELD_PRESETS.find(p => p.id === presetId);
  if (!preset) return [];

  return preset.fielderIds
    .map(id => {
      const pos = ALL_POSITIONS.find(p => p.id === id);
      if (!pos) return null;
      return { ...pos, isActive: true };
    })
    .filter((f): f is Fielder => f !== null);
}

// Get color for fielder based on category
export function getFielderColor(category: FielderCategory): { bg: string; border: string } {
  switch (category) {
    case 'keeper':
      return { bg: 'linear-gradient(145deg, #f59e0b 0%, #d97706 100%)', border: '#fbbf24' };
    case 'bowler':
      return { bg: 'linear-gradient(145deg, #ef4444 0%, #b91c1c 100%)', border: '#f87171' };
    case 'slip':
      return { bg: 'linear-gradient(145deg, #8b5cf6 0%, #6d28d9 100%)', border: '#a78bfa' };
    case 'close':
      return { bg: 'linear-gradient(145deg, #ec4899 0%, #be185d 100%)', border: '#f472b6' };
    case 'ring':
      return { bg: 'linear-gradient(145deg, #3b82f6 0%, #1d4ed8 100%)', border: '#60a5fa' };
    case 'boundary':
      return { bg: 'linear-gradient(145deg, #10b981 0%, #047857 100%)', border: '#34d399' };
    default:
      return { bg: 'linear-gradient(145deg, #3b82f6 0%, #1d4ed8 100%)', border: '#60a5fa' };
  }
}
