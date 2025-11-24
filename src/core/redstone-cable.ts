import type { Position } from "./position";
import { RedstoneElement } from "./redstone-element";

export class RedstoneCable extends RedstoneElement {
  constructor(position: Position) {
    super(position);
  }
}
