import type { Position } from './types';

export function randomChance(value: number) {
  return Math.random() > 1.0 - value;
}

export function randomItem(list: any[]) {
  const r = Math.floor(Math.random() * list.length);

  return list[r];
}

export function randomRange(min: number, max: number) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

export function generateSeed(size: number = 32) {
  const seed: number[] = [];

  for (let i = 0; i < size; i++) {
    seed.push(Math.round(Math.random() * 1000));
  }

  return seed;
}

export function degToRad(degrees: number) {
  return degrees * (Math.PI / 180);
}

export function turnDirection(direction: number): number[] {
  return [
    (direction + 90) % 360,
    (direction - 90) % 360,
  ];
}

export function forkDirection(direction: number): number[] {
  return [direction].concat(turnDirection(direction));
}

export function getShift(direction: number, offset: number = 1): Position {
  return {
    x: Math.round(Math.cos(degToRad(direction))) * offset,
    y: Math.round(Math.sin(degToRad(direction))) * offset,
  };
}

export function between(value: number, period: [number, number]) {
  return value >= period[0] && value <= period[1];
}
