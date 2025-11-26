import type { Position } from "../position";
import { RedstoneActivable } from "../redstone-activable";
import { RedstoneCable } from "../redstone-cable";
import type { RedstoneElement } from "../redstone-element";
import { RedstoneRepeater } from "../redstone-repeater";
import { RedstoneSource } from "../redstone-source";

const ALLOWED_HEIGHT_DIFFS = [-1, 0, 1];
export const POSSIBLE_NEIGHBORS = ALLOWED_HEIGHT_DIFFS.flatMap((dy) => [
  { dx: 0, dz: -1, dy },
  { dx: 0, dz: 1, dy },
  { dx: 1, dz: 0, dy },
  { dx: -1, dz: 0, dy },
]);

export class RedstoneNetwork {
  #nodes: RedstoneElement[];
  #nodeMap: Map<string, RedstoneElement>;

  constructor() {
    this.#nodes = [];
    this.#nodeMap = new Map<string, RedstoneElement>();
  }

  get nodes() {
    return this.#nodes;
  }

  getNeighborsOf(redstoneElement: RedstoneElement): RedstoneElement[] {
    return POSSIBLE_NEIGHBORS.map((offset) =>
      this.getNodeAt(
        redstoneElement.position
          .clone()
          .translate(offset.dx, offset.dy, offset.dz),
      ),
    ).filter((node) => node !== null);
  }

  tick() {
    for (const node of this.#nodes) {
      node.redstoneTick(this);
    }

    const sourceNodes = this.#nodes.filter(
      (node) => node instanceof RedstoneSource,
    );
    for (const sourceNode of sourceNodes) {
      const initialPower = sourceNode.power;
      const visited = new Set<string>();
      const queue: { node: RedstoneElement; power: number }[] = [
        { node: sourceNode, power: initialPower },
      ];
      while (queue.length > 0) {
        const { node, power } = queue.shift()!;
        if (visited.has(node.position.toStringKey()) || power <= 0) {
          continue;
        }

        visited.add(node.position.toStringKey());

        // if the node can be powered, power it
        if (
          node instanceof RedstoneActivable ||
          node instanceof RedstoneCable ||
          node instanceof RedstoneRepeater
        ) {
          node.power = Math.max(node.power, power);
        }

        if (node instanceof RedstoneRepeater) {
          if (node.outputPower <= 0) {
            continue;
          }
          console.log("Repeater outputting power", node.outputPower);

          const targetNode = this.getNodeAt(node.targetPosition);
          if (targetNode) {
            queue.push({ node: targetNode, power: node.outputPower });
          }
          continue;
        }

        const neighbors = this.getNeighborsOf(node);
        for (const neighbor of neighbors) {
          if (
            neighbor instanceof RedstoneActivable ||
            neighbor instanceof RedstoneCable ||
            neighbor instanceof RedstoneRepeater
          ) {
            queue.push({ node: neighbor, power: power - 1 });
          }
        }
      }
    }
  }

  getNodeAt(position: Position): RedstoneElement | null {
    return this.#nodeMap.get(position.toStringKey()) || null;
  }

  addNode(redstone: RedstoneElement) {
    if (this.hasNode(redstone)) {
      return;
    }

    this.#nodes.push(redstone);
    this.#nodeMap.set(redstone.position.toStringKey(), redstone);
  }

  hasNode(redstone: RedstoneElement): boolean {
    return this.#nodeMap.has(redstone.position.toStringKey());
  }

  hasNodeAt(position: Position): boolean {
    return this.#nodeMap.has(position.toStringKey());
  }
}
