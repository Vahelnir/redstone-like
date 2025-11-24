import type { Position } from "./position";

export abstract class RedstoneElement {
  position: Position;

  constructor(position: Position) {
    this.position = position;
  }
}
