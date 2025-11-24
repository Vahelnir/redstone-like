import type { RedstoneNetwork } from "./network/redstone-network";

export function computeRedstoneLinks(networks: RedstoneNetwork[]) {
  for (const network of networks) {
    for (const node of network.nodes) {
      if (node.neighbors.north) {
        node.redstone.linkedDirections.north = true;
      }
      if (node.neighbors.south) {
        node.redstone.linkedDirections.south = true;
      }
      if (node.neighbors.east) {
        node.redstone.linkedDirections.east = true;
      }
      if (node.neighbors.west) {
        node.redstone.linkedDirections.west = true;
      }
    }
  }
}
