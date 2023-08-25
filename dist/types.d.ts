import { Building } from './building';
import { Node } from './node';
import { Path } from './path';
export type CityData = {
    width: number;
    height: number;
};
export type CityGenerationParameters = {
    mode: CityGenerationMode;
    seed: number[];
    startPosition: Point2D;
    startDirections: number[];
    streetMinLength: number;
    probabilityIntersection: number;
    probabilityTurn: number;
    probabilityStreetEnd: number;
    buildingMinSize: number;
    buildingMaxSize: number;
    buildingMinSpace: number;
    buildingMaxSpace: number;
};
export type CityGenerationParametersCustom = {
    [key in keyof CityGenerationParameters]?: CityGenerationParameters[key];
};
export type PathData = {
    position: Point2D;
    direction: number;
};
export type Point2D = {
    x: number;
    y: number;
};
export declare enum CityGenerationMode {
    RUNTIME = "RUNTIME",
    SEED = "SEED"
}
export type MatrixTile = Node | Path | Building | null;
export declare enum NodeType {
    TURN = "TURN",
    CROSS = "CROSS",
    END = "END"
}
