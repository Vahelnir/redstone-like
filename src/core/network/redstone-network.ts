import type { Position } from "../position";
import { RedstoneActivable } from "../redstone-activable";
import type { RedstoneElement } from "../redstone-element";
import { RedstoneInvertor } from "../redstone-invertor";
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

    const priority = [RedstoneSource, RedstoneInvertor, RedstoneRepeater];
    const sourceNodes = this.#nodes.filter((node) => node.canEmitPower());
    sourceNodes.sort((a, b) => {
      const aIndex = priority.findIndex((cls) => a instanceof cls);
      const bIndex = priority.findIndex((cls) => b instanceof cls);
      return aIndex - bIndex;
    });
    const visited = new Set<string>();
    for (const sourceNode of sourceNodes) {
      const queue: RedstoneElement[] = [sourceNode];
      while (queue.length > 0) {
        const node = queue.shift()!;
        if (visited.has(node.position.toStringKey())) {
          continue;
        }

        visited.add(node.position.toStringKey());

        // TODO: improve this logic to be more generic (all other blocks cannot propagate power)
        // don't propagate power from activable blocks
        if (node instanceof RedstoneActivable) {
          continue;
        }

        const neighbors = this.getNeighborsOf(node);
        for (const neighbor of neighbors) {
          const sentPower = Math.max(node.sendPowerTo(neighbor) ?? 0, 0);

          const changed = neighbor.receivePowerFrom(node, sentPower);
          if (changed) {
            visited.delete(neighbor.position.toStringKey());
          }

          queue.push(neighbor);
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
