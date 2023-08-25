import { Point2D } from './types';
export declare class Building {
    readonly vertices: Point2D[];
    readonly position: Point2D;
    readonly width: number;
    readonly height: number;
    constructor(vertices: Point2D[]);
}
