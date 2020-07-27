import * as CONST from './constants';

export class Position {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Subtract next position from this position
   * @param {Position} position - position to be subtacted
   * @returns {Position} subtracted new position
   */
  subtract = (position) => {
    let x = this.x - position.x;
    let y = this.y - position.y;
    let z = this.z - position.z;

    return new Position(x, y, z);
  }

  /**
   * Get distance from this position to next positon in space
   * @param {Position} position - position in space
   * @returns {number} distance from this position to next position
   */
  get3dDistance = (position) => {
    let x = this.x - position.x;
    let y = this.y - position.y;
    let z = this.z - position.z;

    return (Math.sqrt(x * x + y * y + z * z));
  }

  /**
   * Get distance from this position to next positon in paper
   * @param {Position} position - position in paper
   * @returns {number} distance from this position to next position
   */
  get2dDistance = (position) => {
    let x = this.x - position.x;
    let y = this.y - position.y;

    return (Math.sqrt(x * x + y * y));
  }
}

export const projection = {
  'camera': {
    'position': new Position(0, CONST.MAX_CAMERA_Y, -300)
  },

  'viewplane': new Position(0, 0, 500),

  /**
   * Get projection of 3D position into 2D position on plane
   * @param {Position} position - 3D position
   * @returns {Position} 2D position
   */
  'get2dProjection': (position3d) => {
    let d = position3d.subtract(projection.camera.position);
    let vz = projection.viewplane.z / d.z;
    let bx = vz * d.x + projection.viewplane.x;
    let by = vz * d.y + projection.viewplane.y;

    return new Position(bx, by);
  },

  /**
   * Get 3D position from 2D position on plane
   * @param {number} bx - x coordinate
   * @param {number} by - y coordinate
   * @returns {Position} 3D position
   */
  'get3dPosition': (bx, by) => {

    let dy = (-CONST.BALL_START_HEIGHT + CONST.BOARD_Y) - projection.camera.position.y;
    let dz = projection.viewplane.z * dy / (by - projection.viewplane.y);
    let dx = ((bx - projection.viewplane.x) * dz / projection.viewplane.z);

    let ax = projection.camera.position.x + dx;
    let ay = projection.camera.position.y + dy;
    let az = projection.camera.position.z + dz;

    return new Position(ax, ay, az);
  }
};

/**
 * Limit number inbetween range
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} number between min and max
 */
export function clamp(min, max, value) {
  return Math.min(Math.max(value, min), max);
}
