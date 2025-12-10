import { ALL_POSITIONS } from './fieldPositions';
import type { Position } from '../types';

// 30-yard circle - matches the visual at ~22% inset
const CIRCLE_CENTER_X = 50;
const CIRCLE_CENTER_Y = 50;
const CIRCLE_RADIUS = 28; // Matches visual 30-yard circle

// Check if a point is inside the 30-yard circle
function isInsideCircle(x: number, y: number): boolean {
  const distanceFromCenter = Math.sqrt(
    Math.pow(x - CIRCLE_CENTER_X, 2) + Math.pow(y - CIRCLE_CENTER_Y, 2)
  );
  return distanceFromCenter <= CIRCLE_RADIUS;
}

// Detect the closest standard position based on coordinates
// Uses EXACT coordinates from ALL_POSITIONS which match POSITION_LABELS
export function detectPosition(x: number, y: number, isLeftHanded: boolean): { name: string; label: string; category: Position['category'] } | null {
  // Flip x coordinate if left-handed for detection
  const adjustedX = isLeftHanded ? 100 - x : x;

  // Find the closest position from ALL_POSITIONS
  let minDistance = Infinity;
  let closestPosition: Position | null = null;

  for (const pos of ALL_POSITIONS) {
    // Skip keeper and bowler - they shouldn't be detected dynamically
    if (pos.id === 'wk' || pos.id === 'bowler') continue;

    const distance = Math.sqrt(
      Math.pow(adjustedX - pos.x, 2) + Math.pow(y - pos.y, 2)
    );

    if (distance < minDistance) {
      minDistance = distance;
      closestPosition = pos;
    }
  }

  // If within reasonable distance (12% of field), return the position
  if (closestPosition && minDistance < 12) {
    return {
      name: closestPosition.name,
      label: closestPosition.label,
      category: closestPosition.category,
    };
  }

  // If not close to any standard position, determine by region
  return getRegionalPosition(adjustedX, y);
}

// Get position name based on field region when not near a standard position
function getRegionalPosition(x: number, y: number): { name: string; label: string; category: Position['category'] } {
  const isOffSide = x < 50;
  const insideCircle = isInsideCircle(x, y);

  let name = '';
  let label = '';
  let category: Position['category'] = insideCircle ? 'ring' : 'boundary';

  // Behind wicket (y < 25%)
  if (y < 25) {
    if (isOffSide) {
      name = insideCircle ? 'Third Man' : 'Third Man';
      label = '3rd Man';
    } else {
      name = insideCircle ? 'Fine Leg' : 'Fine Leg';
      label = 'Fine Leg';
    }
    category = 'boundary';
  }
  // Slip/Close area (y: 25-35%)
  else if (y < 35) {
    if (isOffSide) {
      if (x > 35) {
        name = 'Slips Area';
        label = 'Slips';
        category = 'slip';
      } else {
        name = 'Gully';
        label = 'Gully';
        category = 'close';
      }
    } else {
      if (x < 60) {
        name = 'Leg Slip';
        label = 'Leg Slip';
        category = 'close';
      } else {
        name = 'Leg Gully';
        label = 'Leg Gully';
        category = 'close';
      }
    }
  }
  // Square positions (y: 35-50%)
  else if (y < 50) {
    if (isOffSide) {
      if (insideCircle) {
        name = 'Point';
        label = 'Point';
      } else {
        name = 'Deep Point';
        label = 'Dp Point';
      }
    } else {
      if (insideCircle) {
        name = 'Square Leg';
        label = 'Sq Leg';
      } else {
        if (x > 85) {
          name = 'Sweeper';
          label = 'Sweeper';
        } else {
          name = 'Deep Square Leg';
          label = 'Dp Sq Leg';
        }
      }
    }
  }
  // Cover/Mid-wicket zone (y: 50-65%)
  else if (y < 65) {
    if (isOffSide) {
      if (insideCircle) {
        name = 'Cover';
        label = 'Cover';
      } else {
        name = 'Deep Cover';
        label = 'Dp Cover';
      }
    } else {
      if (insideCircle) {
        name = 'Mid Wicket';
        label = 'Mid Wkt';
      } else {
        name = 'Deep Mid Wicket';
        label = 'Dp MWkt';
      }
    }
  }
  // Mid-off/Mid-on zone (y: 65-80%)
  else if (y < 80) {
    if (isOffSide) {
      if (insideCircle) {
        name = 'Mid Off';
        label = 'Mid Off';
      } else {
        name = 'Deep Mid Off';
        label = 'Dp Mid Off';
      }
    } else {
      if (insideCircle) {
        name = 'Mid On';
        label = 'Mid On';
      } else {
        if (x > 75) {
          name = 'Cow Corner';
          label = 'Cow Cnr';
        } else {
          name = 'Deep Mid On';
          label = 'Dp Mid On';
        }
      }
    }
  }
  // Long positions (y > 80%)
  else {
    if (isOffSide) {
      name = 'Long Off';
      label = 'Long Off';
    } else {
      if (x > 75) {
        name = 'Cow Corner';
        label = 'Cow Cnr';
      } else {
        name = 'Long On';
        label = 'Long On';
      }
    }
    category = 'boundary';
  }

  return { name, label, category };
}
