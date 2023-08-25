import { Position } from './types';
export declare class Building {
    readonly vertices: Position[];
    readonly position: Position;
    readonly width: number;
    readonly height: number;
    constructor(vertices: Position[]);
}
