import type { RedstoneElement } from "../redstone-element";
import { POSSIBLE_NEIGHBORS, type RedstoneNetwork } from "./redstone-network";

export class RedstoneNetworkNode {
  network: RedstoneNetwork;
  redstoneElement: RedstoneElement;

  power: number = 0;

  constructor(network: RedstoneNetwork, redstone: RedstoneElement) {
    this.network = network;
    this.redstoneElement = redstone;
  }

  get neighbors(): RedstoneNetworkNode[] {
    return POSSIBLE_NEIGHBORS.map((offset) =>
      this.network.getNodeAt(
        this.redstoneElement.position
          .clone()
          .translate(offset.dx, offset.dy, offset.dz),
      ),
    ).filter((node) => node !== null);
  }
}
