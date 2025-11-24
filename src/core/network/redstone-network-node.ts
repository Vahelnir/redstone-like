import type { RedstoneElement } from "../redstone-element";
import type { RedstoneNetwork } from "./redstone-network";

export class RedstoneNetworkNode {
  network: RedstoneNetwork;
  redstoneElement: RedstoneElement;

  power: number = 0;

  constructor(network: RedstoneNetwork, redstone: RedstoneElement) {
    this.network = network;
    this.redstoneElement = redstone;
  }

  get neighbors(): RedstoneNetworkNode[] {
    return [
      this.network.getNodeAt(
        this.redstoneElement.position.clone().translate(0, 0, -1),
      ),
      this.network.getNodeAt(
        this.redstoneElement.position.clone().translate(0, 0, 1),
      ),
      this.network.getNodeAt(
        this.redstoneElement.position.clone().translate(1, 0, 0),
      ),
      this.network.getNodeAt(
        this.redstoneElement.position.clone().translate(-1, 0, 0),
      ),
    ].filter((node) => node !== null);
  }

  get neighborsCardinals() {
    return {
      north: this.network.getNodeAt(
        this.redstoneElement.position.clone().translate(0, 0, -1),
      ),
      south: this.network.getNodeAt(
        this.redstoneElement.position.clone().translate(0, 0, 1),
      ),
      east: this.network.getNodeAt(
        this.redstoneElement.position.clone().translate(1, 0, 0),
      ),
      west: this.network.getNodeAt(
        this.redstoneElement.position.clone().translate(-1, 0, 0),
      ),
    };
  }
}
