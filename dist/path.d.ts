import { Building } from './building';
import type { Node } from './node';
import type { Position } from './types';
export declare class Path {
    readonly direction: number;
    private buildings;
    private nodeBeg;
    private nodeEnd;
    private cursor;
    constructor(node: Node, direction: number);
    getBuildings(): Building[];
    getPositions(): {
        beg: Position;
        end: Position;
    };
    isCompleted(): boolean;
    getNextCursor(): {
        x: number;
        y: number;
    };
    getCursor(): Position;
    setCursor(position: Position): void;
    getNodeBeg(): Node;
    getNodeEnd(): Node | null;
    setNodeEnd(node: Node): void;
    addBuilding(vertices: Position[]): Building;
    getLength(): number;
    remove(): void;
    each(callback: (position: Position) => void): void;
}
