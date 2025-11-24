import type { RedstoneNetwork } from "./network/redstone-network";
import { RedstoneCable } from "./redstone-cable";

export function computeRedstoneLinks(networks: RedstoneNetwork[]) {
  for (const network of networks) {
    for (const node of network.nodes) {
      if (!(node.redstoneElement instanceof RedstoneCable)) {
        continue;
      }

      if (node.neighborsCardinals.north) {
        node.redstoneElement.directions.north = true;
      }
      if (node.neighborsCardinals.south) {
        node.redstoneElement.directions.south = true;
      }
      if (node.neighborsCardinals.east) {
        node.redstoneElement.directions.east = true;
      }
      if (node.neighborsCardinals.west) {
        node.redstoneElement.directions.west = true;
      }
    }
  }
}
