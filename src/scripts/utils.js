import * as CONST from './constants';

export class Position {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Subtract next position from this position.
   *
   * @param {Position} position - Position to be subtacted.
   * @returns {Position} Subtracted new position.
   */
  subtract = (position) => {
    const x = this.x - position.x;
    const y = this.y - position.y;
    const z = this.z - position.z;

    return new Position(x, y, z);
  };

  /**
   * Get distance from this position to next positon in space.
   *
   * @param {Position} position - Position in space.
   * @returns {number} Distance from this position to next position.
   */
  get3dDistance = (position) => {
    const x = this.x - position.x;
    const y = this.y - position.y;
    const z = this.z - position.z;

    return Math.sqrt(x * x + y * y + z * z);
  };

  /**
   * Get distance from this position to next positon in paper.
   *
   * @param {Position} position - Position in paper.
   * @returns {number} Distance from this position to next position.
   */
  get2dDistance = (position) => {
    const x = this.x - position.x;
    const y = this.y - position.y;

    return Math.sqrt(x * x + y * y);
  };
}

export const projection = {
  camera: {
    position: new Position(0, CONST.MAX_CAMERA_Y, -300),
  },

  viewplane: new Position(0, 0, 500),

  /**
   * Get projection of 3D position into 2D position on plane.
   *
   * @param {Position} position3d - 3D position.
   * @returns {Position} 2D position.
   */
  get2dProjection: (position3d) => {
    const d = position3d.subtract(projection.camera.position);
    const vz = projection.viewplane.z / d.z;
    const bx = vz * d.x + projection.viewplane.x;
    const by = vz * d.y + projection.viewplane.y;

    return new Position(bx, by);
  },

  /**
   * Get 3D position from 2D position on plane.
   *
   * @param {number} bx - X coordinate.
   * @param {number} by - Y coordinate.
   * @returns {Position} 3D position.
   */
  get3dPosition: (bx, by) => {
    const dy =
      -CONST.BALL_START_HEIGHT + CONST.BOARD_Y - projection.camera.position.y;
    const dz = (projection.viewplane.z * dy) / (by - projection.viewplane.y);
    const dx = ((bx - projection.viewplane.x) * dz) / projection.viewplane.z;

    const ax = projection.camera.position.x + dx;
    const ay = projection.camera.position.y + dy;
    const az = projection.camera.position.z + dz;

    return new Position(ax, ay, az);
  },
};

/**
 * Limit number inbetween range.
 *
 * @param {number} min - Minimum value.
 * @param {number} max - Maximum value.
 * @param {number} value - Value to clamp.
 * @returns {number} Number between min and max.
 */
export function clamp(min, max, value) {
  return Math.min(Math.max(value, min), max);
}
