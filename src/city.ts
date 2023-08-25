/* eslint-disable no-new */
import { Path } from './path';
import { Node } from './node';
import {
  CityData,
  CityGenerationParameters,
  CityGenerationMode,
  Point2D,
  MatrixTile,
  CityGenerationParametersCustom,
} from './types';
import {
  randomChance, generateSeed, getShift, forkDirection, turnDirection, randomRange,
} from './utils';
import { Building } from './building';

export class City {
  readonly width: number;

  readonly height: number;

  private seed: number[] | null = null;

  private matrix: MatrixTile[][] = [];

  private nodes: Node[] = [];

  private gauge: number = 1;

  // @ts-ignore
  private params: CityGenerationParameters = {};

  constructor({ width, height }: CityData) {
    this.width = width;
    this.height = height;
  }

  public getMatrix() {
    return this.matrix;
  }

  public getSeed() {
    return this.seed;
  }

  public getAllBuildings() {
    return this.getAllPaths().map((path) => path.buildings).flat();
  }

  public getBuildingAt(position: Point2D) {
    const tile = this.getAt(position);

    return tile instanceof Building ? tile : null;
  }

  public getAllNodes() {
    return this.nodes;
  }

  public getNodeAt(position: Point2D) {
    const tile = this.getAt(position);

    return tile instanceof Node ? tile : null;
  }

  public getAllPaths() {
    return this.nodes.map((node) => node.getOutputPaths()).flat();
  }

  public getPathAt(position: Point2D) {
    const tile = this.getAt(position);

    return tile instanceof Path ? tile : null;
  }

  public markAt(position: Point2D, tile: MatrixTile) {
    this.matrix[position.y][position.x] = tile;
  }

  public getAt(position: Point2D) {
    return this.matrix?.[position.y]?.[position.x];
  }

  public isEmptyAt(position: Point2D) {
    return this.getAt(position) === null;
  }

  public each(callback: (position: Point2D, tile: MatrixTile) => boolean | void) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        const position = { x, y };
        const res = callback(position, this.getAt(position));

        if (res === false) {
          return;
        }
      }
    }
  }

  public reset() {
    for (let y = 0; y < this.height; y++) {
      this.matrix[y] = [];
      for (let x = 0; x < this.width; x++) {
        this.matrix[y][x] = null;
      }
    }

    this.seed = null;
    this.gauge = 1;
    this.nodes = [];
  }

  public async generate(params: CityGenerationParametersCustom = {}) {
    this.reset();

    this.params = {
      mode: CityGenerationMode.RUNTIME,
      seed: [],
      startPosition: {
        x: Math.round(this.width / 2),
        y: Math.round(this.height / 2),
      },
      startDirections: [0, 90, 180, 270],
      streetMinLength: 0,
      buildingMinSize: 3,
      buildingMaxSize: 6,
      buildingMinSpace: 1,
      buildingMaxSpace: 3,
      probabilityIntersection: 0.1,
      probabilityTurn: 0.05,
      probabilityStreetEnd: 0.001,
      ...params,
    };

    if (this.params.mode === CityGenerationMode.SEED) {
      this.seed = this.params.seed ?? generateSeed();
    }

    const node = this.addNode(this.params.startPosition);

    this.markAt(this.params.startPosition, node);

    this.params.startDirections.forEach((direction) => {
      node.addOutputPath(direction);
    });

    this.generatePaths();
    this.generateBuildings();
  }

  private generatePaths() {
    const iterate = () => {
      const paths = this.getAllPaths();

      for (let i = 0, l = paths.length; i < l; i++) {
        this.processingPath(paths[i]);
      }

      const isCompleted = paths.every((path) => path.isCompleted());

      if (!isCompleted) {
        iterate();
      }
    };

    iterate();
  }

  private processingPath(path: Path) {
    if (path.isCompleted()) {
      return;
    }

    const nextCursor = path.getNextCursor();

    if (
      // Out of matrix
      this.getAt(nextCursor) === undefined
      // Street end
      || this.variability(this.params.probabilityStreetEnd)
    ) {
      this.closePath(path);

      return;
    }

    // Crossed another street
    const cross = this.getCross(path);

    if (cross?.tile) {
      let node: Node | null = null;

      if (cross.tile instanceof Node) {
        node = cross.tile;
      } else if (cross.tile instanceof Path) {
        node = this.splitPath(cross.tile, cross.position);
      }

      if (node) {
        path.setNodeEnd(node);
      }

      return;
    }

    // Continuation path
    path.setCursor(nextCursor);
    this.markAt(path.getCursor(), path);

    const streetLength = this.params.streetMinLength;

    if (
      path.getLength() > streetLength
      && !this.getCross(path, streetLength)
    ) {
      if (this.variability(this.params.probabilityIntersection)) {
        this.forkPath(path);
      } else if (this.variability(this.params.probabilityTurn)) {
        this.turnPath(path);
      }
    }
  }

  private generateBuildings() {
    this.getAllPaths().forEach((path) => {
      const shift = getShift(path.direction);
      const position = {
        x: path.getNodeBeg().position.x + shift.x,
        y: path.getNodeBeg().position.y + shift.y,
      };

      turnDirection(path.direction).forEach((direction) => {
        let stepOffset = 0;

        while (path.getLength() > stepOffset) {
          const stepShift = getShift(path.direction, stepOffset);
          const shiftFromPath = getShift(direction);
          const startPosition = {
            x: position.x + stepShift.x + shiftFromPath.x,
            y: position.y + stepShift.y + shiftFromPath.y,
          };
          const size = [
            randomRange(this.params.buildingMinSize, this.params.buildingMaxSize),
            randomRange(this.params.buildingMinSize, this.params.buildingMaxSize),
          ];

          if (stepOffset + size[0] > path.getLength()) {
            break;
          }

          this.processingBuilding(path, startPosition, size, [
            path.direction,
            direction,
          ]);

          const spaceBetweenBuildings = randomRange(
            this.params.buildingMinSpace,
            this.params.buildingMaxSpace,
          );

          stepOffset += size[0] + spaceBetweenBuildings;
        }
      });
    });
  }

  private processingBuilding(path: Path, position: Point2D, size: number[], directions: number[]) {
    const tiles: Point2D[] = [];
    const vertices: Point2D[] = [];

    for (let i = 0; i < size[0]; i++) {
      const shiftParallel = getShift(directions[0], i);

      const startFromPathPosition = {
        x: position.x + shiftParallel.x,
        y: position.y + shiftParallel.y,
      };

      for (let j = 0; j < size[1]; j++) {
        const shiftPerpendicular = getShift(directions[1], j);
        const tilePosition = {
          x: startFromPathPosition.x + shiftPerpendicular.x,
          y: startFromPathPosition.y + shiftPerpendicular.y,
        };

        if (this.isEmptyAt(tilePosition)) {
          tiles.push(tilePosition);

          if (
            (i === 0 || i === size[0] - 1)
            && (j === 0 || j === size[1] - 1)
          ) {
            vertices.push(tilePosition);
          }
        } else {
          return;
        }
      }
    }

    const building = path.addBuilding(vertices);

    tiles.forEach((tilePosition) => {
      this.markAt(tilePosition, building);
    });
  }

  private addNode(position: Point2D) {
    const node = new Node(this.nodes.length, position);

    this.nodes.push(node);

    return node;
  }

  private closePath(path: Path) {
    const cursor = path.getCursor();
    const node = this.addNode(cursor);

    path.setNodeEnd(node);

    this.markAt(cursor, node);

    return node;
  }

  private forkPath(path: Path) {
    let directions = forkDirection(path.direction)
      .sort(() => (this.variability(0.5) ? 1 : -1));

    directions = this.filterDirections(path, directions);

    if (
      directions.length === 0
      || (directions.length === 1 && directions[0] === path.direction)
    ) {
      return;
    }

    const node = this.closePath(path);

    for (let i = 0; i < directions.length; i++) {
      if (i < 2 || this.variability(0.5)) {
        node.addOutputPath(directions[i]);
      }
    }

    this.markAt(node.position, node);
  }

  private turnPath(path: Path) {
    let directions = turnDirection(path.direction)
      .sort(() => (this.variability(0.5) ? 1 : -1));

    directions = this.filterDirections(path, directions);

    if (directions.length === 0) {
      return;
    }

    const node = this.closePath(path);

    node.addOutputPath(directions[0]);

    this.markAt(node.position, node);
  }

  private splitPath(path: Path, position: Point2D) {
    const newNode = this.addNode(position);
    const continuePath = newNode.addOutputPath(path.direction);

    this.markAt(position, newNode);

    const existNodeEnd = path.getNodeEnd();

    if (existNodeEnd) {
      continuePath.setNodeEnd(existNodeEnd);
    } else {
      continuePath.setCursor(path.getCursor());
    }

    // Refill matrix with new path
    continuePath.each((tilePosition) => {
      if (this.getAt(tilePosition) instanceof Path) {
        this.markAt(tilePosition, continuePath);
      }
    });

    path.setNodeEnd(newNode);

    return newNode;
  }

  private getCross(path: Path, length: number = 1) {
    const cursor = path.getCursor();

    for (let i = 1; i <= length; i++) {
      const shift = getShift(path.direction, i);
      const position = {
        x: cursor.x + shift.x,
        y: cursor.y + shift.y,
      };

      if (!this.isEmptyAt(position)) {
        return {
          tile: this.getAt(position),
          position,
        };
      }
    }

    return null;
  }

  private filterDirections(path: Path, directions: number[]) {
    return directions.filter((direction) => {
      const shift = getShift(direction);
      const cursor = path.getCursor();
      const nextCursor = {
        x: cursor.x + shift.x,
        y: cursor.y + shift.y,
      };

      return this.isEmptyAt(nextCursor);
    });
  }

  private variability(value: number) {
    if (!this.seed) {
      return randomChance(value);
    }

    const seedPoint = this.seed[this.gauge % this.seed.length];

    this.gauge++;

    return seedPoint / 1000 >= 1.0 - value;
  }
}
