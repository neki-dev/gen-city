import type { Building } from './building';
import type { Node } from './node';
import type { Path } from './path';

export type CityData = {
  width: number
  height: number
};

export type CityGenerationParameters = {
  /**
   * Generation mode.
   * Default: RUNTIME
   */
  mode: CityGenerationMode

  /**
   * Generation seed array for mode SEED.
   */
  seed: number[]

  /**
   * Start generation position.
   * Default: Center of map size
   */
  startPosition: Position

  /**
   * Start generation directions.
   * Default: Left, Right, Top, Bottom
   */
  startDirections: number[]

  /**
   * Street length before generating an intersection or turn.
   * Default: 10
   */
  streetMinLength: number

  /**
   * Probability of generating intersection.
   * Default: 0.1
   */
  probabilityIntersection: number

  /**
   * Probability of generating turn.
   * Default: 0.05
   */
  probabilityTurn: number

  /**
   * Probability of generating street end.
   * Default: 0.001
   */
  probabilityStreetEnd: number

  /**
   * Minimum size of bulding size.
   * Default: 3
   */
  buildingMinSize: number

  /**
   * Maximum size of bulding size.
   * Default: 6
   */
  buildingMaxSize: number

  /**
   * Minimum distance between buildings.
   * Default: 1
   */
  buildingMinSpace: number

  /**
   * Maximum distance between buildings.
   * Default: 3
   */
  buildingMaxSpace: number

  /**
   * Distance between building and path.
   * Default: 0
   */
  buildingOffset: number
};

export type CityGenerationParametersCustom = {
  [key in keyof CityGenerationParameters]?: CityGenerationParameters[key]
};

export type PathData = {
  position: Position
  direction: number
};

export type Position = {
  x: number
  y: number
};

export enum CityGenerationMode {
  RUNTIME = 'RUNTIME',
  SEED = 'SEED',
}

export type MatrixTile = Node | Path | Building | null;

export enum NodeType {
  TURN = 'TURN',
  CROSS = 'CROSS',
  END = 'END',
}
