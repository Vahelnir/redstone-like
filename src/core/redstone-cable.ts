import type { Position } from "./position";
import { RedstoneElement } from "./redstone-element";

export class RedstoneCable extends RedstoneElement {
  power: number = 0;

  constructor(position: Position) {
    super(position);
  }
}
