/* eslint-disable import/no-cycle */
import { Path } from './path';
import { NodeType, Position } from './types';

export class Node {
  readonly position: Position;

  readonly id: number;

  private outputPaths: Path[] = [];

  private inputPaths: Path[] = [];

  constructor(id: number, position: Position) {
    this.id = id;
    this.position = position;
  }

  public addOutputPath(direction: number) {
    const path = new Path(this, direction);

    this.outputPaths.push(path);

    return path;
  }

  public getOutputPaths() {
    return this.outputPaths;
  }

  public addInputPath(path: Path) {
    const existNode = path.getNodeEnd();

    if (existNode) {
      existNode.removeInputPath(path);
    }

    this.inputPaths.push(path);
  }

  public removeInputPath(path: Path) {
    const index = this.inputPaths.indexOf(path);

    if (index !== -1) {
      this.inputPaths.splice(index, 1);
    }
  }

  public getInputPaths() {
    return this.inputPaths;
  }

  public getAllPaths() {
    return this.outputPaths.concat(this.inputPaths);
  }

  public getType() {
    const pathsCount = this.outputPaths.length + this.inputPaths.length;

    if (pathsCount === 2) {
      return NodeType.TURN;
    }

    if (pathsCount === 1) {
      return NodeType.END;
    }

    return NodeType.CROSS;
  }
}
