import type { Position } from "./position";
import { RedstoneElement } from "./redstone-element";

export class RedstoneActivable extends RedstoneElement {
  constructor(position: Position) {
    super(position);
  }
}
