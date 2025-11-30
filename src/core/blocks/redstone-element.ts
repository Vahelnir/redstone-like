import type { Object3D } from "three";
import type { RedstoneNetwork } from "../network/redstone-network";
import type { Position } from "../position";

export abstract class RedstoneElement {
  position: Position;

  constructor(position: Position) {
    this.position = position;
  }

  abstract render(): void;
  abstract redstoneTick(network: RedstoneNetwork): number;

  abstract receivePowerFrom(source: RedstoneElement, power: number): boolean;
  abstract sendPowerTo(target: RedstoneElement): number | null;
  abstract getMesh(): Object3D | null;

  canEmitPower(): boolean {
    return false;
  }
}
