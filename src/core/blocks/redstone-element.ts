import type { RedstoneNetwork } from "../network/redstone-network";
import { Block } from "./block";

export abstract class RedstoneElement extends Block {
  abstract redstoneTick(network: RedstoneNetwork): number;

  abstract receivePowerFrom(source: RedstoneElement, power: number): number;
  abstract sendPowerTo(target: RedstoneElement): number | null;
}
