import type { Position } from "./position";
import { RedstoneElement } from "./redstone-element";

export type RedstoneCableDirections = {
  north: boolean;
  south: boolean;
  east: boolean;
  west: boolean;
};

export class RedstoneCable extends RedstoneElement {
  directions: RedstoneCableDirections = {
    north: false,
    south: false,
    east: false,
    west: false,
  };

  constructor(position: Position) {
    super(position);
  }
}
