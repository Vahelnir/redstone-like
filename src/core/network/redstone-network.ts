import type { Position } from "../position";
import { RedstoneCable } from "../redstone-cable";
import type { RedstoneElement } from "../redstone-element";
import { RedstoneSource } from "../redstone-source";
import { RedstoneNetworkNode } from "./redstone-network-node";

const ALLOWED_HEIGHT_DIFFS = [-1, 0, 1];
export const POSSIBLE_NEIGHBORS = ALLOWED_HEIGHT_DIFFS.flatMap((dy) => [
  { dx: 0, dz: -1, dy },
  { dx: 0, dz: 1, dy },
  { dx: 1, dz: 0, dy },
  { dx: -1, dz: 0, dy },
]);

export class RedstoneNetwork {
  #nodes: RedstoneNetworkNode[];
  #nodeMap: Map<string, RedstoneNetworkNode>;

  constructor() {
    this.#nodes = [];
    this.#nodeMap = new Map<string, RedstoneNetworkNode>();
  }

  get nodes() {
    return this.#nodes;
  }

  tick() {
    for (const sourceNode of this.#nodes) {
      const redstoneElement = sourceNode.redstoneElement;
      if (!(redstoneElement instanceof RedstoneSource)) {
        continue;
      }

      sourceNode.power = redstoneElement.power;

      const elements = [...sourceNode.neighbors].filter(
        (neighbor) => neighbor.redstoneElement instanceof RedstoneCable,
      );
      for (const element of elements) {
        element.power = sourceNode.power - 1;
      }

      console.log(
        "start propagation from ",
        sourceNode.redstoneElement.position.toStringKey(),
        " with power ",
        sourceNode.power,
      );
      while (elements.length > 0 && elements[0].power > 0) {
        const currentElement = elements.shift()!;
        if (!(currentElement.redstoneElement instanceof RedstoneCable)) {
          continue;
        }

        for (const neighbor of currentElement.neighbors) {
          if (!neighbor || neighbor.power >= currentElement.power - 1) {
            continue;
          }

          neighbor.power = currentElement.power - 1;
          elements.push(neighbor);
        }
      }
    }
  }

  getNodeAt(position: Position): RedstoneNetworkNode | null {
    return this.#nodeMap.get(position.toStringKey()) || null;
  }

  addNode(redstone: RedstoneElement) {
    if (this.hasNode(redstone)) {
      return;
    }

    const node = new RedstoneNetworkNode(this, redstone);
    this.#nodes.push(node);
    this.#nodeMap.set(redstone.position.toStringKey(), node);
  }

  hasNode(redstone: RedstoneElement): boolean {
    return this.#nodeMap.has(redstone.position.toStringKey());
  }

  hasNodeAt(position: Position): boolean {
    return this.#nodeMap.has(position.toStringKey());
  }
}
