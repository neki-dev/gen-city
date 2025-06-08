import type { Path } from './path';
import type { Position } from './types';
export declare class Building {
    readonly vertices: Position[];
    readonly position: Position;
    readonly width: number;
    readonly height: number;
    readonly path: Path;
    constructor(path: Path, vertices: Position[]);
    remove(): void;
    each(callback: (position: Position) => void): void;
}
