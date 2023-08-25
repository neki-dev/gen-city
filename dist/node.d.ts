import { Path } from './path';
import { NodeType, Point2D } from './types';
export declare class Node {
    readonly position: Point2D;
    readonly id: number;
    private outputPaths;
    private inputPaths;
    constructor(id: number, position: Point2D);
    addOutputPath(direction: number): Path;
    getOutputPaths(): Path[];
    addInputPath(path: Path): void;
    removeInputPath(path: Path): void;
    getInputPaths(): Path[];
    getAllPaths(): Path[];
    getType(): NodeType;
}
