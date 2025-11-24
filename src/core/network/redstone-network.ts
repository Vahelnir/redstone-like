import type { Position } from "../position";
import type { Redstone } from "../redstone";

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

  addNode(redstone: Redstone) {
    if (this.hasNode(redstone)) {
      return;
    }

    const node = new RedstoneNetworkNode(this, redstone);
    this.#nodes.push(node);
    this.#nodeMap.set(redstone.position.toStringKey(), node);
  }

  hasNode(redstone: Redstone): boolean {
    return this.#nodeMap.has(redstone.position.toStringKey());
  }

  hasNodeAt(position: Position): boolean {
    return this.#nodeMap.has(position.toStringKey());
  }
}

export class RedstoneNetworkNode {
  network: RedstoneNetwork;
  redstone: Redstone;

  constructor(network: RedstoneNetwork, redstone: Redstone) {
    this.network = network;
    this.redstone = redstone;
  }

  get neighbors() {
    return {
      north: this.network.hasNodeAt(
        this.redstone.position.clone().translate(0, 0, -1),
      ),
      south: this.network.hasNodeAt(
        this.redstone.position.clone().translate(0, 0, 1),
      ),
      east: this.network.hasNodeAt(
        this.redstone.position.clone().translate(1, 0, 0),
      ),
      west: this.network.hasNodeAt(
        this.redstone.position.clone().translate(-1, 0, 0),
      ),
    };
  }
}
