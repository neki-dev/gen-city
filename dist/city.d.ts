import { Path } from './path';
import { Node } from './node';
import { CityData, CityGenerationParametersCustom } from './types';
export declare class City {
    readonly width: number;
    readonly height: number;
    private seed;
    private matrix;
    private nodes;
    private gauge;
    private params;
    constructor({ width, height }: CityData);
    getSeed(): number[] | null;
    getAllBuildings(): import("./building").Building[];
    getAllNodes(): Node[];
    getAllPaths(): Path[];
    generate(params?: CityGenerationParametersCustom): Promise<void>;
    private reset;
    private generatePaths;
    private processingPath;
    private generateBuildings;
    private processingBuilding;
    private getAt;
    private markAt;
    private isEmptyAt;
    private addNode;
    private closePath;
    private forkPath;
    private turnPath;
    private splitPath;
    private getCross;
    private filterDirections;
    private variabilityChance;
    private variabilityRange;
}
