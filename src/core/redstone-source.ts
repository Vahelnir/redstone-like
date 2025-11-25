import type { Position } from "./position";
import { RedstoneElement } from "./redstone-element";

export class RedstoneSource extends RedstoneElement {
  power: number = 16;

  constructor(position: Position) {
    super(position);
  }

  tick() {}
}
