import { Path } from './path';
import type { Position } from './types';
import { NodeType } from './types';
export declare class Node {
    readonly position: Position;
    readonly id: number;
    private outputPaths;
    private inputPaths;
    constructor(id: number, position: Position);
    addOutputPath(direction: number): Path;
    removeOutputPath(path: Path): void;
    getOutputPaths(): Path[];
    addInputPath(path: Path): void;
    removeInputPath(path: Path): void;
    getInputPaths(): Path[];
    getAllPaths(): Path[];
    getType(): NodeType;
}
