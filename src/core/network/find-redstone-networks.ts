import type { RedstoneElement } from "../blocks/redstone-element";
import { NetworkFinder } from "./network-finder";
import { RedstoneNetwork } from "./redstone-network";

export function findRedstoneNetworks(redstones: RedstoneElement[]) {
  console.time("findRedstoneNetworks");
  const finder = new NetworkFinder(redstones);
  const networks: RedstoneNetwork[] = [];
  while (finder.hasMore()) {
    const network = finder.nextNetwork();
    if (network) {
      networks.push(network);
    }
  }
  console.log(networks);
  console.timeEnd("findRedstoneNetworks");
  return networks;
}
