import type { RedstoneElement } from "../redstone-element";
import type { RedstoneNetwork } from "./redstone-network";

export class RedstoneNetworkNode {
  network: RedstoneNetwork;
  redstoneElement: RedstoneElement;

  constructor(network: RedstoneNetwork, redstone: RedstoneElement) {
    this.network = network;
    this.redstoneElement = redstone;
  }

  get neighbors() {
    return {
      north: this.network.hasNodeAt(
        this.redstoneElement.position.clone().translate(0, 0, -1),
      ),
      south: this.network.hasNodeAt(
        this.redstoneElement.position.clone().translate(0, 0, 1),
      ),
      east: this.network.hasNodeAt(
        this.redstoneElement.position.clone().translate(1, 0, 0),
      ),
      west: this.network.hasNodeAt(
        this.redstoneElement.position.clone().translate(-1, 0, 0),
      ),
    };
  }
}
