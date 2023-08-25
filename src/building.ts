/* eslint-disable import/no-cycle */
import { Position } from './types';

export class Building {
  readonly vertices: Position[];

  readonly position: Position;

  readonly width: number;

  readonly height: number;

  constructor(vertices: Position[]) {
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
