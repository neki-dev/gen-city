/* eslint-disable import/no-cycle */
import { Position } from './types';
import { Node } from './node';
import { getShift } from './utils';
import { Building } from './building';

export class Path {
  readonly direction: number;

  private buildings: Building[] = [];

  private nodeBeg: Node;

  private nodeEnd: Node | null = null;

  private cursor: Position;

  constructor(node: Node, direction: number) {
    this.direction = direction;
    this.nodeBeg = node;
    this.cursor = node.position;
  }

  public getBuildings() {
    return this.buildings;
  }

  public getPositions() {
    return {
      beg: this.nodeBeg.position,
      end: this.nodeEnd?.position ?? this.cursor,
    };
  }

  public isCompleted() {
    return Boolean(this.nodeEnd);
  }

  public getNextCursor() {
    const shift = getShift(this.direction);

    return {
      x: this.cursor.x + shift.x,
      y: this.cursor.y + shift.y,
    };
  }

  public getCursor() {
    return this.cursor;
  }

  public setCursor(position: Position) {
    this.cursor = position;
  }

  public getNodeBeg() {
    return this.nodeBeg;
  }

  public getNodeEnd() {
    return this.nodeEnd;
  }

  public setNodeEnd(node: Node) {
    node.addInputPath(this);

    this.nodeEnd = node;
    this.cursor = node.position;
  }

  public addBuilding(vertices: Position[]) {
    const building = new Building(vertices);

    this.buildings.push(building);

    return building;
  }

  public getLength() {
    return Math.hypot(
      this.nodeBeg.position.x - this.cursor.x,
      this.nodeBeg.position.y - this.cursor.y,
    );
  }

  public each(callback: (position: Position) => void) {
    const shift = getShift(this.direction);
    const length = this.getLength();
    const position = { ...this.nodeBeg.position };

    for (let i = 0; i < length; i++) {
      callback(position);

      position.x += shift.x;
      position.y += shift.y;
    }
  }
}
