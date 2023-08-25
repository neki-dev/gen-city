/* eslint-disable import/no-cycle */
import { Point2D } from './types';

export class Building {
  readonly vertices: Point2D[];

  readonly position: Point2D;

  readonly width: number;

  readonly height: number;

  constructor(vertices: Point2D[]) {
    if (vertices.length !== 4) {
      throw Error('Invalid building vertices');
    }

    this.vertices = vertices;

    const xs = this.vertices.map((position) => position.x);
    const ys = this.vertices.map((position) => position.y);

    this.position = {
      x: Math.min(...xs),
      y: Math.min(...ys),
    };

    this.width = Math.max(...xs) - this.position.x + 1;
    this.height = Math.max(...ys) - this.position.y + 1;
  }
}
