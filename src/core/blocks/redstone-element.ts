import type { RedstoneNetwork } from "../network/redstone-network";
import type { Position } from "../position";

export abstract class RedstoneElement {
  position: Position;

  constructor(position: Position) {
    this.position = position;
  }

  abstract render(): void;
  abstract redstoneTick(network: RedstoneNetwork): void;

  abstract receivePowerFrom(source: RedstoneElement, power: number): boolean;
  abstract sendPowerTo(target: RedstoneElement): number;

  canEmitPower(): boolean {
    return false;
  }
}
