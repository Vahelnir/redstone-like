import type { Position } from "../position";
import { RedstoneActivable } from "../blocks/redstone-activable";
import { RedstoneElement } from "../blocks/redstone-element";
import { RedstoneCable } from "../blocks/redstone-cable";

const ALLOWED_HEIGHT_DIFFS = [-1, 0, 1];
export const POSSIBLE_NEIGHBORS = ALLOWED_HEIGHT_DIFFS.flatMap((dy) => [
  { dx: 0, dz: -1, dy },
  { dx: 0, dz: 1, dy },
  { dx: 1, dz: 0, dy },
  { dx: -1, dz: 0, dy },
]);

export class RedstoneNetwork {
  #nodeMap: Map<string, RedstoneElement>;

  constructor(world: Map<string, RedstoneElement> = new Map()) {
    this.#nodeMap = new Map<string, RedstoneElement>();
    world.forEach((node) => {
      if (node instanceof RedstoneElement) {
        this.addNode(node);
      }
    });
  }

  get nodes() {
    return Array.from(this.#nodeMap.values());
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

  previousPowerStates = new Map<string, number>();
  tick() {
    const stack: RedstoneElement[] = [];
    for (const node of this.nodes) {
      const power = node.redstoneTick(this);
      const changed =
        this.previousPowerStates.get(node.position.toStringKey()) !== power;
      this.previousPowerStates.set(node.position.toStringKey(), power);
      if (changed) {
        stack.push(node);
      }
    }

    const visited = new Set<string>();
    while (stack.length > 0) {
      const node = stack.shift()!;
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
        const rawSentPower = node.sendPowerTo(neighbor);
        if (rawSentPower === null) {
          continue;
        }

        const sentPower = Math.max(rawSentPower, 0);
        const changed = neighbor.receivePowerFrom(node, sentPower);
        const bothAreCables =
          neighbor instanceof RedstoneCable && node instanceof RedstoneCable;
        if (changed && !bothAreCables) {
          visited.delete(neighbor.position.toStringKey());
        }

        stack.unshift(neighbor);
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

    this.#nodeMap.set(redstone.position.toStringKey(), redstone);
  }

  hasNode(redstone: RedstoneElement): boolean {
    return this.#nodeMap.has(redstone.position.toStringKey());
  }

  hasNodeAt(position: Position): boolean {
    return this.#nodeMap.has(position.toStringKey());
  }
}
