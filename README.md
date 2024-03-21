## ⚡ Gen City
[![Npm package version](https://badgen.net/npm/v/gen-city)](https://npmjs.com/package/gen-city)
[![Small size](https://img.badgesize.io/neki-dev/gen-city/master/dist/index.js)](https://github.com/neki-dev/gen-city/blob/master/dist/index.js)
[![Building](https://github.com/neki-dev/gen-city/actions/workflows/build.yml/badge.svg)](https://github.com/neki-dev/gen-city/actions/workflows/build.yml)

Procedural city generation

.

[Demo](https://gen-city.neki.guru/)

Documentation

* [Install](https://github.com/neki-dev/gen-city?tab=readme-ov-file#install)
* [Generation](https://github.com/neki-dev/gen-city?tab=readme-ov-file#generation)
* [General](https://github.com/neki-dev/gen-city?tab=readme-ov-file#general)
* [Nodes](https://github.com/neki-dev/gen-city?tab=readme-ov-file#nodes)
* [Paths](https://github.com/neki-dev/gen-city?tab=readme-ov-file#paths)
* [Buildings](https://github.com/neki-dev/gen-city?tab=readme-ov-file#buildings)
* [Example](https://github.com/neki-dev/gen-city?tab=readme-ov-file#example)

.

## Install
```sh
npm i gen-city
```

.

## Generation
#### Create city
```ts
const city = new City(params)
```
| Param | Description | Default |
| ------|-------------|---------|
| `width` | Map width | - | 
| `height` | Map height | - | 

#### Generate
```ts
await city.generate(params?)
```
| Param | Description | Default |
| ------|-------------|---------|
| `mode` | Generation mode (`Runtime` or `Seed`) | `Runtime` |
| `seed` | Generation seed array for seed mode | - |
| `startPosition` | Start generation position | Center of map |
| `startDirections` | Start generation directions | Left, Right, Top, Bottom |
| `streetMinLength` | Street length before generating an intersection or turn | 10 |
| `probabilityIntersection` | Probability of generating intersection | 0.1 |
| `probabilityTurn` | Probability of generating turn | 0.05 |
| `probabilityStreetEnd` | Probability of generating street end | 0.001 |
| `buildingMinSize` | Minimum building size | 3 |
| `buildingMaxSize` | Maximum building size | 6 |
| `buildingMinSpace` | Minimum distance between buildings | 1 |
| `buildingMaxSpace` | Maximum distance between buildings | 3 |
| `buildingOffset` | Distance between building and path | 0 |

.

## General
#### Get size
```ts
const width = city.width
const height = city.height
```

#### Get seed
Return seed if city was generated with runtime mode
```ts
const seed = city.getSeed(): number[] | null
```

.

## Nodes
#### Get all nodes
```ts
const nodes = city.getAllNodes(): Node[]
```

#### Get node paths
```ts
const inputPaths = node.getInputPaths(): Path[]
const outputPaths = node.getOutputPaths(): Path[]
const allPaths = node.getAllPaths(): Path[]
```

#### Get node type
Get type by count of input and output paths (Turn, Cross, End)
```ts
const type = node.getType(): NodeType
```

.

## Paths
#### Get all paths
```ts
const paths = city.getAllPaths(): Path[]
```

#### Get path positions
```ts
const positions = path.getPositions(): { 
  beg: Position
  end: Position
}
```

#### Get path nodes
```ts
const nodeBeg = path.getNodeBeg(): Node
const nodeEnd = path.getNodeEnd(): Node
```

#### Get path length
```ts
const length = path.getLength(): number
```

#### Each path positions
```ts
path.each(callback: (position: Position) => void)
```

#### Remove path from nodes
```ts
path.remove()
```

#### Get path buildings
```ts
const buildings = path.getBuildings(): Building[]
```

#### Get path direction
Get direction in degrees
```ts
const direction: number = path.direction
```

.

## Buildings
#### Get all buildings
```ts
const buildings = city.getAllBuildings(): Building[]
```

#### Get building vertices
Array of rectangle corners positions
```ts
const vertices: Position[] = building.vertices
```

#### Get building position
Get top left corner position
```ts
const position: Position = building.position
```

#### Get building size
```ts
const width: number = building.width
const height: number = building.height
```

#### Each building positions
```ts
building.each(callback: (position: Position) => void)
```

#### Remove building from path
```ts
building.remove()
```

.

## Example
```ts
const city = new City({
  width: 200,
  height: 200,
});

city.generate({
  streetMinLength: 15,
}).then(() => {
  // Draw roads
  ctx.beginPath();
  city.getAllPaths().forEach((path) => {
    const positions = path.getPositions();
    ctx.moveTo(positions.beg.x, positions.beg.y);
    ctx.lineTo(positions.end.x, positions.end.y);
  });
  ctx.stroke();

  // Draw buildings
  city.getAllBuildings().forEach((building) => {
    ctx.fillRect(
      building.position.x,
      building.position.y,
      building.width,
      building.height
    );
  });
});
```
