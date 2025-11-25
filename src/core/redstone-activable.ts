import type { Position } from "./position";
import { RedstoneElement } from "./redstone-element";

export class RedstoneActivable extends RedstoneElement {
  power: number = 0;

  constructor(position: Position) {
    super(position);
  }

  get isActive(): boolean {
    return this.power > 0;
  }
}
