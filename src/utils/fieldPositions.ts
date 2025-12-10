import type { Position, Fielder, FieldPreset, FielderCategory } from '../types';

// All standard cricket fielding positions
// SYNCHRONIZED with POSITION_LABELS in CricketField.tsx
// View: Looking from BEHIND the bowler towards the batsman
// Batsman at top center (striker's end), Bowler at bottom center (bowling end)
// Off side: LEFT side (x: 0-50%) for right-handed batsman
// Leg side: RIGHT side (x: 50-100%) for right-handed batsman
// y=0 is at top (behind wicket), y=100 is at bottom (bowler's end)

export const ALL_POSITIONS: Position[] = [
  // ============================================
  // COORDINATES MATCH POSITION_LABELS EXACTLY
  // ============================================

  // Keeper & Bowler
  { id: 'wk', name: 'Wicketkeeper', label: 'WK', x: 50, y: 30, category: 'keeper' },
  { id: 'bowler', name: 'Bowler', label: 'Bowler', x: 50, y: 72, category: 'bowler' },

  // BOUNDARY - Behind wicket (y < 20%)
  { id: 'third_man', name: 'Third Man', label: '3rd Man', x: 20, y: 10, category: 'boundary' },
  { id: 'fine_leg', name: 'Fine Leg', label: 'Fine Leg', x: 80, y: 10, category: 'boundary' },

  // Slip Cordon - Inside circle
  { id: 'slip1', name: '1st Slip', label: '1st Slip', x: 44, y: 26, category: 'slip' },
  { id: 'slip2', name: '2nd Slip', label: '2nd Slip', x: 41, y: 27, category: 'slip' },
  { id: 'slip3', name: '3rd Slip', label: '3rd Slip', x: 38, y: 28, category: 'slip' },
  { id: 'slip4', name: '4th Slip', label: '4th Slip', x: 35, y: 29, category: 'slip' },

  // Close Catchers - Inside circle
  { id: 'gully', name: 'Gully', label: 'Gully', x: 30, y: 32, category: 'close' },
  { id: 'leg_slip', name: 'Leg Slip', label: 'Leg Slip', x: 56, y: 26, category: 'close' },
  { id: 'leg_gully', name: 'Leg Gully', label: 'Leg Gully', x: 68, y: 32, category: 'close' },
  { id: 'short_leg', name: 'Short Leg', label: 'Short Leg', x: 60, y: 36, category: 'close' },
  { id: 'silly_point', name: 'Silly Point', label: 'Silly Pt', x: 42, y: 36, category: 'close' },
  { id: 'backward_square', name: 'Backward Square Leg', label: 'Bwd Sq', x: 72, y: 34, category: 'close' },

  // Ring Field - Inside 30-yard circle
  // Off Side
  { id: 'point', name: 'Point', label: 'Point', x: 26, y: 42, category: 'ring' },
  { id: 'backward_point', name: 'Backward Point', label: 'Bwd Pt', x: 26, y: 36, category: 'ring' },
  { id: 'cover', name: 'Cover', label: 'Cover', x: 28, y: 52, category: 'ring' },
  { id: 'extra_cover', name: 'Extra Cover', label: 'Ex Cover', x: 34, y: 58, category: 'ring' },
  { id: 'mid_off', name: 'Mid Off', label: 'Mid Off', x: 38, y: 64, category: 'ring' },

  // Leg Side
  { id: 'mid_on', name: 'Mid On', label: 'Mid On', x: 62, y: 64, category: 'ring' },
  { id: 'mid_wicket', name: 'Mid Wicket', label: 'Mid Wkt', x: 72, y: 52, category: 'ring' },
  { id: 'square_leg', name: 'Square Leg', label: 'Sq Leg', x: 72, y: 42, category: 'ring' },

  // BOUNDARY - Deep positions (outside 30-yard circle)
  { id: 'deep_point', name: 'Deep Point', label: 'Dp Point', x: 12, y: 42, category: 'boundary' },
  { id: 'deep_square', name: 'Deep Square Leg', label: 'Dp Sq Leg', x: 88, y: 42, category: 'boundary' },
  { id: 'sweeper', name: 'Sweeper', label: 'Sweeper', x: 90, y: 48, category: 'boundary' },
  { id: 'deep_cover', name: 'Deep Cover', label: 'Dp Cover', x: 14, y: 52, category: 'boundary' },
  { id: 'deep_mid_wicket', name: 'Deep Mid Wicket', label: 'Dp MWkt', x: 86, y: 52, category: 'boundary' },
  { id: 'deep_mid_off', name: 'Deep Mid Off', label: 'Dp Mid Off', x: 30, y: 76, category: 'boundary' },
  { id: 'deep_mid_on', name: 'Deep Mid On', label: 'Dp Mid On', x: 70, y: 76, category: 'boundary' },

  // BOUNDARY - Long positions
  { id: 'long_off', name: 'Long Off', label: 'Long Off', x: 35, y: 88, category: 'boundary' },
  { id: 'long_on', name: 'Long On', label: 'Long On', x: 65, y: 88, category: 'boundary' },
  { id: 'cow_corner', name: 'Cow Corner', label: 'Cow Cnr', x: 80, y: 82, category: 'boundary' },
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
    fielderIds: ['wk', 'bowler', 'deep_point', 'deep_cover', 'long_off', 'long_on', 'deep_mid_wicket', 'deep_square', 'sweeper', 'third_man', 'point'],
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
