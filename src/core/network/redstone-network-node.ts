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
      { x: 0, y: 0, z: -1 },
      { x: 0, y: 0, z: 1 },
      { x: 1, y: 0, z: 0 },
      { x: -1, y: 0, z: 0 },
      { x: 0, y: 1, z: -1 },
      { x: 0, y: 1, z: 1 },
      { x: 1, y: 1, z: 0 },
      { x: -1, y: 1, z: 0 },
      { x: 0, y: -1, z: -1 },
      { x: 0, y: -1, z: 1 },
      { x: 1, y: -1, z: 0 },
      { x: -1, y: -1, z: 0 },
    ]
      .map((offset) =>
        this.network.getNodeAt(
          this.redstoneElement.position
            .clone()
            .translate(offset.x, offset.y, offset.z),
        ),
      )
      .filter((node) => node !== null);
  }
}
