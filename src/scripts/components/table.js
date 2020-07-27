import * as CONST from '../constants';
import { Position, projection } from '../utils';

class Board {
  constructor() {
    this.width = CONST.BOARD_WIDTH;
    this.length = CONST.BOARD_LENGTH;
    this.thickness = CONST.BOARD_THICKNESS + CONST.BOARD_Y;
    this.z = CONST.BOARD_Z;
    this.borderWidth = CONST.BORDER_WIDTH;
    this.y = CONST.BOARD_Y;

    const leftX = CONST.HALF_CANVAS_WIDTH - CONST.BOARD_HALF_WIDTH;
    const rightX = CONST.HALF_CANVAS_WIDTH + CONST.BOARD_HALF_WIDTH;

    const midLeftX = leftX + CONST.BOARD_HALF_WIDTH - this.borderWidth / 2;
    const midRightX = rightX - CONST.BOARD_HALF_WIDTH + this.borderWidth / 2;

    this.surface3d = {
      'outer': [
        new Position(leftX, this.y, this.z),
        new Position(rightX, this.y, this.z),
        new Position(rightX, this.y, this.length + this.z),
        new Position(leftX, this.y, this.length + this.z)
      ],

      'thickness': [
        new Position(leftX, this.y, this.z),
        new Position(rightX, this.y, this.z),
        new Position(rightX, this.thickness, this.z),
        new Position(leftX, this.thickness, this.z)
      ],

      'inner': [
        new Position(leftX + this.borderWidth * 2, this.y, this.z + this.borderWidth),
        new Position(rightX - this.borderWidth * 2, this.y, this.z + this.borderWidth),
        new Position(rightX - this.borderWidth, this.y, this.length + this.z - this.borderWidth),
        new Position(leftX + this.borderWidth, this.y, this.length + this.z - this.borderWidth)
      ],

      'midLine': [
        new Position(midLeftX, this.y, this.z + 1),
        new Position(midRightX, this.y, this.z + 1),
        new Position(midRightX, this.y, this.length + this.z - 1),
        new Position(midLeftX, this.y, this.length + this.z - 1)
      ],

      'tableLeftStand': [
        new Position(leftX + CONST.TABLE_STAND_PADDING, this.thickness, this.z + CONST.TABLE_STAND_PADDING),
        new Position(leftX + CONST.TABLE_STAND_PADDING * 2, this.thickness, this.z + CONST.TABLE_STAND_PADDING),
        new Position(leftX + CONST.TABLE_STAND_PADDING * 2, CONST.TABLE_HEIGHT, this.z + CONST.TABLE_STAND_PADDING),
        new Position(leftX + CONST.TABLE_STAND_PADDING, CONST.TABLE_HEIGHT, this.z + CONST.TABLE_STAND_PADDING)
      ],

      'tableLeftThickness': [
        new Position(leftX + CONST.TABLE_STAND_PADDING * 2, this.thickness, this.z + CONST.TABLE_STAND_PADDING),
        new Position(leftX + CONST.TABLE_STAND_PADDING * 2, this.thickness, this.z + CONST.TABLE_STAND_PADDING + CONST.BOARD_THICKNESS),
        new Position(leftX + CONST.TABLE_STAND_PADDING * 2, CONST.TABLE_HEIGHT, this.z + CONST.TABLE_STAND_PADDING + CONST.BOARD_THICKNESS),
        new Position(leftX + CONST.TABLE_STAND_PADDING * 2, CONST.TABLE_HEIGHT, this.z + CONST.TABLE_STAND_PADDING)
      ],

      'tableRightStand': [
        new Position(rightX - CONST.TABLE_STAND_PADDING, this.thickness, this.z + CONST.TABLE_STAND_PADDING),
        new Position(rightX - CONST.TABLE_STAND_PADDING * 2, this.thickness, this.z + CONST.TABLE_STAND_PADDING),
        new Position(rightX - CONST.TABLE_STAND_PADDING * 2, CONST.TABLE_HEIGHT, this.z + CONST.TABLE_STAND_PADDING),
        new Position(rightX - CONST.TABLE_STAND_PADDING, CONST.TABLE_HEIGHT, this.z + CONST.TABLE_STAND_PADDING)
      ],

      'tableRightThickness': [
        new Position(rightX - CONST.TABLE_STAND_PADDING * 2, this.thickness, this.z + CONST.TABLE_STAND_PADDING),
        new Position(rightX - CONST.TABLE_STAND_PADDING * 2, this.thickness, this.z + CONST.TABLE_STAND_PADDING + CONST.BOARD_THICKNESS),
        new Position(rightX - CONST.TABLE_STAND_PADDING * 2, CONST.TABLE_HEIGHT, this.z + CONST.TABLE_STAND_PADDING + CONST.BOARD_THICKNESS),
        new Position(rightX - CONST.TABLE_STAND_PADDING * 2, CONST.TABLE_HEIGHT, this.z + CONST.TABLE_STAND_PADDING)
      ],
    }

    this.surface2d = {
      'outer': this.surface3d.outer.map(projection.get2dProjection),
      'inner': this.surface3d.inner.map(projection.get2dProjection),
      'thickness': this.surface3d.thickness.map(projection.get2dProjection),
      'midLine': this.surface3d.midLine.map(projection.get2dProjection),
      'tableLeftStand': this.surface3d.tableLeftStand.map(projection.get2dProjection),
      'tableLeftThickness': this.surface3d.tableLeftThickness.map(projection.get2dProjection),
      'tableRightStand': this.surface3d.tableRightStand.map(projection.get2dProjection),
      'tableRightThickness': this.surface3d.tableRightThickness.map(projection.get2dProjection)
    }
  }

  // Draw outer surface of board (CONST.WHITE) on canvas
  drawOuterSurface = (ctx) => {

    let startPosition = this.surface2d.outer[0];
    ctx.beginPath();
    ctx.moveTo(startPosition.x, startPosition.y);
    for (const point of this.surface2d.outer) {
      ctx.lineTo(point.x, point.y);
    }
    ctx.lineTo(startPosition.x, startPosition.y);
    ctx.fillStyle = CONST.WHITE;
    ctx.fill();
    ctx.strokeStyle = CONST.BLACK_B;
    ctx.stroke();
    ctx.closePath();
  
  }

  // Draw inner surface of board (blue) on canvas
  drawInnerSurface = (ctx) => {
    let startPosition = this.surface2d.inner[0];
    ctx.beginPath();
    ctx.moveTo(startPosition.x, startPosition.y);
    for (const point of this.surface2d.inner) {
      ctx.lineTo(point.x, point.y);
    }
    ctx.lineTo(startPosition.x, startPosition.y);
    ctx.fillStyle = CONST.BOARD_BACKGROUND;
    ctx.fill();
    // ctx.stroke();
    ctx.closePath();
  }

  // Draw thickness of board on canvas
  drawThickness = (ctx) => {
    let startPosition = this.surface2d.thickness[0];
    ctx.beginPath();
    ctx.moveTo(startPosition.x, startPosition.y);
    for (const point of this.surface2d.thickness) {
      ctx.lineTo(point.x, point.y);
    }
    ctx.lineTo(startPosition.x, startPosition.y);
    ctx.fillStyle = CONST.BLACK_C;
    ctx.fill();
    ctx.strokeStyle = CONST.BLACK_B;
    ctx.stroke();
    ctx.closePath();
  }

  // Draw CONST.WHITE middle line of board on canvas
  drawMidLine = (ctx) => {
    let startPosition = this.surface2d.midLine[0];
    ctx.beginPath();
    ctx.moveTo(startPosition.x, startPosition.y);
    for (const point of this.surface2d.midLine) {
      ctx.lineTo(point.x, point.y);
    }
    ctx.lineTo(startPosition.x, startPosition.y);
    ctx.fillStyle = CONST.WHITE;
    ctx.fill();
    // ctx.stroke();
    ctx.closePath();
  }

  // Draw table stands on canvas
  drawTableStand = (ctx) => {
    let startPosition = this.surface2d.tableLeftStand[0];
    ctx.beginPath();
    ctx.moveTo(startPosition.x, startPosition.y);
    for (const point of this.surface2d.tableLeftStand) {
      ctx.lineTo(point.x, point.y);
    }
    ctx.lineTo(startPosition.x, startPosition.y);
    ctx.fillStyle = CONST.BLACK_B;
    ctx.fill();

    startPosition = this.surface2d.tableLeftThickness[0];
    ctx.beginPath();
    ctx.moveTo(startPosition.x, startPosition.y);
    for (const point of this.surface2d.tableLeftThickness) {
      ctx.lineTo(point.x, point.y);
    }
    ctx.lineTo(startPosition.x, startPosition.y);
    ctx.fillStyle = CONST.BLACK_A;
    ctx.fill();

    startPosition = this.surface2d.tableRightStand[0];
    ctx.beginPath();
    ctx.moveTo(startPosition.x, startPosition.y);
    for (const point of this.surface2d.tableRightStand) {
      ctx.lineTo(point.x, point.y);
    }
    ctx.lineTo(startPosition.x, startPosition.y);
    ctx.fillStyle = CONST.BLACK_B;
    ctx.fill();

    startPosition = this.surface2d.tableRightThickness[0];
    ctx.beginPath();
    ctx.moveTo(startPosition.x, startPosition.y);
    for (const point of this.surface2d.tableRightThickness) {
      ctx.lineTo(point.x, point.y);
    }
    ctx.lineTo(startPosition.x, startPosition.y);
    ctx.fillStyle = CONST.BLACK_A;
    ctx.fill();

  }

  // Draw table and board on canvas
  draw = (ctx) => {
    this.drawTableStand(ctx);
    this.drawOuterSurface(ctx);
    this.drawInnerSurface(ctx);
    this.drawThickness(ctx);
    this.drawMidLine(ctx);
  }
}

export default Board;
