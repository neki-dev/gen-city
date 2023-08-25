import { Position } from './types';
import { Node } from './node';
import { Building } from './building';
export declare class Path {
    readonly direction: number;
    readonly buildings: Building[];
    private nodeBeg;
    private nodeEnd;
    private cursor;
    constructor(node: Node, direction: number);
    getPoints(): {
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
    each(callback: (position: Position) => void): void;
}
