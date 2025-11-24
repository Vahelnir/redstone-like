import type { RedstoneNetwork } from "./network/redstone-network";
import { RedstoneCable } from "./redstone-cable";

export function computeRedstoneLinks(networks: RedstoneNetwork[]) {
  for (const network of networks) {
    for (const node of network.nodes) {
      if (!(node.redstoneElement instanceof RedstoneCable)) {
        continue;
      }

      if (node.neighbors.north) {
        node.redstoneElement.directions.north = true;
      }
      if (node.neighbors.south) {
        node.redstoneElement.directions.south = true;
      }
      if (node.neighbors.east) {
        node.redstoneElement.directions.east = true;
      }
      if (node.neighbors.west) {
        node.redstoneElement.directions.west = true;
      }
    }
  }
}
