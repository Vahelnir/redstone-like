import type { RedstoneNetwork } from "./network/redstone-network";
import type { Position } from "./position";

export abstract class RedstoneElement {
  position: Position;
  power: number = 0;

  constructor(position: Position) {
    this.position = position;
  }

  abstract render(): void;
  abstract redstoneTick(network: RedstoneNetwork): void;

  receivePowerFrom(source: RedstoneElement, power: number): void {
    // Handle receiving power from another element
    this.power = Math.max(this.power, power);
  }
}
