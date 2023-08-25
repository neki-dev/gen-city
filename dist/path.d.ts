import { Point2D } from './types';
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
        beg: Point2D;
        end: Point2D;
    };
    isCompleted(): boolean;
    getNextCursor(): {
        x: number;
        y: number;
    };
    getCursor(): Point2D;
    setCursor(position: Point2D): void;
    getNodeBeg(): Node;
    getNodeEnd(): Node | null;
    setNodeEnd(node: Node): void;
    addBuilding(vertices: Point2D[]): Building;
    getLength(): number;
    each(callback: (position: Point2D) => void): void;
}
