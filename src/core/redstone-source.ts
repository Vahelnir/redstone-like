import type { Position } from "./position";
import { RedstoneElement } from "./redstone-element";

export class RedstoneSource extends RedstoneElement {
  constructor(position: Position) {
    super(position);
  }
}
