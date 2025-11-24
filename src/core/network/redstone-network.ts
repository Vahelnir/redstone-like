import type { Position } from "../position";
import type { RedstoneElement } from "../redstone-element";
import { RedstoneNetworkNode } from "./redstone-network-node";

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
