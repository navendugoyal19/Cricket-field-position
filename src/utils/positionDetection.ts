import { ALL_POSITIONS } from './fieldPositions';
import type { Position } from '../types';

// 30-yard circle: approximately 30% inward from boundary
const CIRCLE_CENTER_X = 50;
const CIRCLE_CENTER_Y = 50;
const CIRCLE_RADIUS = 38; // Inner circle radius

// Check if a point is inside the 30-yard circle
function isInsideCircle(x: number, y: number): boolean {
  const distanceFromCenter = Math.sqrt(
    Math.pow(x - CIRCLE_CENTER_X, 2) + Math.pow(y - CIRCLE_CENTER_Y, 2)
  );
  return distanceFromCenter <= CIRCLE_RADIUS;
}

// Detect the closest standard position based on coordinates
export function detectPosition(x: number, y: number, isLeftHanded: boolean): { name: string; label: string; category: Position['category'] } | null {
  // Flip x coordinate if left-handed for detection
  const adjustedX = isLeftHanded ? 100 - x : x;

  // Check if position is inside or outside the 30-yard circle
  const insideCircle = isInsideCircle(adjustedX, y);

  // Filter positions based on circle boundary and find closest
  const standardPositions: Array<{ x: number; y: number; name: string; label: string; category: Position['category'] }> = ALL_POSITIONS
    .filter(pos => {
      if (pos.id === 'wk' || pos.id === 'bowler') return false;

      // Match positions based on whether we're inside or outside the circle
      if (insideCircle) {
        return pos.category === 'ring' || pos.category === 'close' || pos.category === 'slip';
      } else {
        return pos.category === 'boundary';
      }
    })
    .map(pos => ({
      x: pos.x,
      y: pos.y,
      name: pos.name,
      label: pos.label,
      category: pos.category,
    }));

  // Calculate distance to each position and find the closest
  let minDistance = Infinity;
  let closestPosition: typeof standardPositions[0] | null = null;

  for (const pos of standardPositions) {
    const distance = Math.sqrt(
      Math.pow(adjustedX - pos.x, 2) + Math.pow(y - pos.y, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestPosition = pos;
    }
  }

  // If within reasonable distance (15% of field), return the position
  if (closestPosition && minDistance < 15) {
    return {
      name: closestPosition.name,
      label: closestPosition.label,
      category: closestPosition.category,
    };
  }

  // If not close to any standard position, return a custom position name based on region
  return getCustomPositionName(adjustedX, y, insideCircle);
}

function getPositionLabel(name: string): string {
  const labelMap: Record<string, string> = {
    'Wicketkeeper': 'WK',
    'Bowler': 'Bowler',
    '1st Slip': '1st Slip',
    '2nd Slip': '2nd Slip',
    '3rd Slip': '3rd Slip',
    '4th Slip': '4th Slip',
    'Gully': 'Gully',
    'Leg Slip': 'Leg Slip',
    'Leg Gully': 'Leg Gully',
    'Silly Point': 'Silly Pt',
    'Silly Mid Off': 'Silly MO',
    'Silly Mid On': 'Silly MOn',
    'Short Leg': 'Short Leg',
    'Point': 'Point',
    'Backward Point': 'Bwd Pt',
    'Cover': 'Cover',
    'Extra Cover': 'Ex Cover',
    'Mid Off': 'Mid Off',
    'Mid On': 'Mid On',
    'Mid Wicket': 'Mid Wkt',
    'Square Leg': 'Sq Leg',
    'Backward Square Leg': 'Bwd Sq',
    'Fine Leg': 'Fine Leg',
    'Third Man': '3rd Man',
    'Deep Point': 'Dp Point',
    'Deep Cover': 'Dp Cover',
    'Long Off': 'Long Off',
    'Long On': 'Long On',
    'Deep Mid Wicket': 'Dp MWkt',
    'Deep Square Leg': 'Dp Sq Leg',
    'Deep Fine Leg': 'Dp Fine',
    'Deep Third Man': 'Dp 3rd',
    'Cow Corner': 'Cow Cnr',
    'Sweeper': 'Sweeper',
  };

  return labelMap[name] || name.substring(0, 8);
}

// Determine which region of the field a position is in
function getRegion(x: number, y: number): { side: 'off' | 'leg'; zone: 'behind' | 'square' | 'forward' | 'straight' } {
  const isOffSide = x < 50;

  // Zone determination based on y coordinate
  // y < 30 = behind wicket (slips/leg slip area)
  // y 30-45 = backward area
  // y 45-55 = square area  
  // y 55-75 = forward area (cover/mid-wicket)
  // y > 75 = straight (long off/long on)

  let zone: 'behind' | 'square' | 'forward' | 'straight';
  if (y < 30) {
    zone = 'behind';
  } else if (y < 55) {
    zone = 'square';
  } else if (y < 80) {
    zone = 'forward';
  } else {
    zone = 'straight';
  }

  return { side: isOffSide ? 'off' : 'leg', zone };
}

function getCustomPositionName(x: number, y: number, insideCircle: boolean): { name: string; label: string; category: Position['category'] } {
  const region = getRegion(x, y);
  let name = '';
  let category: Position['category'] = insideCircle ? 'ring' : 'boundary';

  // Prefix for boundary positions
  const depthPrefix = insideCircle ? '' : (y > 80 ? 'Long ' : 'Deep ');

  if (region.zone === 'behind') {
    // Behind wicket positions
    if (region.side === 'off') {
      if (insideCircle) {
        name = 'Third Man';
      } else {
        name = 'Deep Third Man';
      }
    } else {
      if (insideCircle) {
        name = 'Fine Leg';
      } else {
        name = 'Deep Fine Leg';
      }
    }
  } else if (region.zone === 'square') {
    // Square positions
    if (region.side === 'off') {
      name = depthPrefix + 'Point';
    } else {
      name = depthPrefix + 'Square Leg';
    }
  } else if (region.zone === 'forward') {
    // Forward of square
    if (region.side === 'off') {
      name = depthPrefix + 'Cover';
    } else {
      name = depthPrefix + 'Mid Wicket';
    }
  } else {
    // Straight positions
    if (region.side === 'off') {
      name = 'Long Off';
    } else {
      name = 'Long On';
    }
  }

  return {
    name: name || 'Custom',
    label: getPositionLabel(name || 'Custom'),
    category
  };
}
