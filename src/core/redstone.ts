import type { Position } from "./Position";

export type RedstoneDirections = {
  north: boolean;
  south: boolean;
  east: boolean;
  west: boolean;
};

export class Redstone {
  position: Position;
  linkedDirections: RedstoneDirections = {
    north: false,
    south: false,
    east: false,
    west: false,
  };

  constructor(position: Position) {
    this.position = position;
  }
}
