import { Position } from "../position";
import type { RedstoneElement } from "../redstone-element";
import { RedstoneNetwork } from "./redstone-network";

export class NetworkFinder {
  #visited = new Set<string>();
  #nodesToVisit = new Set<string>();
  #nodeMap: Map<string, RedstoneElement>;

  constructor(redstones: RedstoneElement[]) {
    this.#nodesToVisit = new Set<string>();
    this.#nodeMap = new Map<string, RedstoneElement>();
    for (const redstone of redstones) {
      this.#nodeMap.set(redstone.position.toStringKey(), redstone);
      this.#nodesToVisit.add(redstone.position.toStringKey());
    }
  }

  nextNetwork(): RedstoneNetwork | null {
    if (!this.hasMore()) {
      return null;
    }

    const startNode = this.#nextNodeToVisit();
    if (!startNode) {
      return null;
    }

    const network = new RedstoneNetwork();
    network.addNode(startNode);
    this.#visited.add(startNode.position.toStringKey());

    const possibleNeighbors = [
      { dx: 0, dz: -1 },
      { dx: 0, dz: 1 },
      { dx: 1, dz: 0 },
      { dx: -1, dz: 0 },
    ];

    const nodesToExplore: RedstoneElement[] = [startNode];
    while (nodesToExplore.length > 0) {
      const currentNode = nodesToExplore.shift()!;
      console.log("explore", currentNode.position.toStringKey());
      for (const neighbor of possibleNeighbors) {
        const neighborPos = new Position(
          currentNode.position.x + neighbor.dx,
          currentNode.position.y,
          currentNode.position.z + neighbor.dz,
        );
        const neighborKey = neighborPos.toStringKey();
        const neighborNode = this.#nodeMap.get(neighborKey)!;
        if (!neighborNode) {
          continue;
        }

        if (network.hasNode(neighborNode)) {
          continue;
        }

        console.log("  neighbor", neighborKey);
        if (this.#visited.has(neighborKey)) {
          throw new Error(
            "the redstone in " +
              neighborKey +
              " has a neighbor that is part of another redstone network, something is wrong here",
          );
        }

        network.addNode(neighborNode);
        this.#visited.add(neighborKey);
        nodesToExplore.push(neighborNode);
      }
    }

    return network;
  }

  #nextNodeToVisit() {
    for (const nodeKey of this.#nodesToVisit) {
      const node = this.#nodeMap.get(nodeKey);
      if (!node || this.#visited.has(node.position.toStringKey())) {
        this.#nodesToVisit.delete(nodeKey);
        continue;
      }

      return node;
    }

    return null;
  }

  hasMore(): boolean {
    return this.#nodesToVisit.size > 0;
  }
}
