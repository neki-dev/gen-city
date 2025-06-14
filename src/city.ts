import { Node } from './node';
import { Path } from './path';
import type {
  CityData,
  CityGenerationParameters,
  Position,
  MatrixTile,
  CityGenerationParametersCustom } from './types';
import {
  CityGenerationMode,
} from './types';
import {
  randomChance, generateSeed, getShift, forkDirection, turnDirection, randomRange,
} from './utils';

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

  public getSeed() {
    return this.seed;
  }

  public getAllBuildings() {
    return this.getAllPaths().map((path) => path.getBuildings()).flat();
  }

  public getAllNodes() {
    return this.nodes;
  }

  public getAllPaths() {
    return this.nodes.map((node) => node.getOutputPaths()).flat();
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
      streetMinLength: 10,
      buildingMinSize: 3,
      buildingMaxSize: 6,
      buildingMinSpace: 1,
      buildingMaxSpace: 3,
      buildingOffset: 0,
      probabilityIntersection: 0.1,
      probabilityTurn: 0.05,
      probabilityStreetEnd: 0.001,
      ...params,
    };

    if (this.params.mode === CityGenerationMode.SEED) {
      this.seed = this.params.seed.length === 0
        ? generateSeed()
        : this.params.seed;
    }

    const node = this.addNode(this.params.startPosition);

    this.markAt(this.params.startPosition, node);

    this.params.startDirections.forEach((direction) => {
      node.addOutputPath(direction);
    });

    this.generatePaths();
    this.generateBuildings();
  }

  private reset() {
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
      || this.variabilityChance(this.params.probabilityStreetEnd)
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
      if (this.variabilityChance(this.params.probabilityIntersection)) {
        this.forkPath(path);
      } else if (this.variabilityChance(this.params.probabilityTurn)) {
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
        let stepOffset = this.params.buildingOffset;

        while (path.getLength() > stepOffset) {
          const stepShift = getShift(path.direction, stepOffset);
          const shiftFromPath = getShift(direction, this.params.buildingOffset + 1);
          const startPosition = {
            x: position.x + stepShift.x + shiftFromPath.x,
            y: position.y + stepShift.y + shiftFromPath.y,
          };
          const size = [
            this.variabilityRange(this.params.buildingMinSize, this.params.buildingMaxSize),
            this.variabilityRange(this.params.buildingMinSize, this.params.buildingMaxSize),
          ];

          if (stepOffset + size[0] + this.params.buildingOffset > path.getLength()) {
            break;
          }

          this.processingBuilding(path, startPosition, size, [
            path.direction,
            direction,
          ]);

          const spaceBetweenBuildings = this.variabilityRange(
            this.params.buildingMinSpace,
            this.params.buildingMaxSpace,
          );

          stepOffset += size[0] + spaceBetweenBuildings;
        }
      });
    });
  }

  private processingBuilding(path: Path, position: Position, size: number[], directions: number[]) {
    const tiles: Position[] = [];
    const vertices: Position[] = [];

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

  private getAt(position: Position) {
    return this.matrix?.[position.y]?.[position.x];
  }

  private markAt(position: Position, tile: MatrixTile) {
    this.matrix[position.y][position.x] = tile;
  }

  private isEmptyAt(position: Position) {
    return this.getAt(position) === null;
  }

  private addNode(position: Position, index?: number) {
    const node = new Node(this.nodes.length, position);

    if (index === undefined) {
      this.nodes.push(node);
    } else {
      this.nodes.splice(index, 0, node);
    }

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
      .sort(() => (this.variabilityChance(0.5) ? 1 : -1));

    directions = this.filterDirections(path, directions);

    if (
      directions.length === 0
      || (directions.length === 1 && directions[0] === path.direction)
    ) {
      return;
    }

    const node = this.closePath(path);

    for (let i = 0; i < directions.length; i++) {
      if (i < 2 || this.variabilityChance(0.5)) {
        node.addOutputPath(directions[i]);
      }
    }

    this.markAt(node.position, node);
  }

  private turnPath(path: Path) {
    let directions = turnDirection(path.direction)
      .sort(() => (this.variabilityChance(0.5) ? 1 : -1));

    directions = this.filterDirections(path, directions);

    if (directions.length === 0) {
      return;
    }

    const node = this.closePath(path);

    node.addOutputPath(directions[0]);

    this.markAt(node.position, node);
  }

  private splitPath(path: Path, position: Position) {
    const nodeBeg = path.getNodeBeg();
    const nodeBegIndex = this.nodes.findIndex((node) => node === nodeBeg);

    const nodeNew = this.addNode(position, nodeBegIndex + 1);
    const continuePath = nodeNew.addOutputPath(path.direction);

    this.markAt(position, nodeNew);

    const nodeEnd = path.getNodeEnd();

    if (nodeEnd) {
      continuePath.setNodeEnd(nodeEnd);
    } else {
      continuePath.setCursor(path.getCursor());
    }

    // Refill matrix with new path
    continuePath.each((tilePosition) => {
      if (this.getAt(tilePosition) instanceof Path) {
        this.markAt(tilePosition, continuePath);
      }
    });

    path.setNodeEnd(nodeNew);

    return nodeNew;
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

  public variabilityChance(value: number) {
    if (!this.seed) {
      return randomChance(value);
    }

    const seedPoint = this.seed[this.gauge % this.seed.length];

    this.gauge++;

    return seedPoint / 1000 >= 1.0 - value;
  }

  public variabilityRange(min: number, max: number) {
    if (!this.seed) {
      return randomRange(min, max);
    }

    const seedPoint = this.seed[this.gauge % this.seed.length];

    this.gauge++;

    return Math.floor(min + (seedPoint / 1000) * (max - min + 1));
  }
}
