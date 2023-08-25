export const ui = {
  screen: document.getElementById('screen') as HTMLCanvasElement,
  inputs: {
    nodeDisplay: document.querySelector<HTMLInputElement>('[name=nodeDisplay]'),
    seedMode: document.querySelector<HTMLInputElement>('[name=seedMode]'),
    streetMinLength: document.querySelector<HTMLInputElement>('[name=streetMinLength]'),
    worldWidth: document.querySelector<HTMLInputElement>('[name=worldWidth]'),
    worldHeight: document.querySelector<HTMLInputElement>('[name=worldHeight]'),
    buildingMinSize: document.querySelector<HTMLInputElement>('[name=buildingMinSize]'),
    buildingMaxSize: document.querySelector<HTMLInputElement>('[name=buildingMaxSize]'),
    buildingMinSpace: document.querySelector<HTMLInputElement>('[name=buildingMinSpace]'),
    buildingMaxSpace: document.querySelector<HTMLInputElement>('[name=buildingMaxSpace]'),
    probabilityIntersection: document.querySelector<HTMLInputElement>('[name=probabilityIntersection]'),
    probabilityTurn: document.querySelector<HTMLInputElement>('[name=probabilityTurn]'),
    probabilityStreetEnd: document.querySelector<HTMLInputElement>('[name=probabilityStreetEnd]'),
  },
  buttons: {
    generate: document.getElementById('generate'),
  },
};
