import type { RedstoneElement } from "../redstone-element";
import { NetworkFinder } from "./network-finder";
import { RedstoneNetwork } from "./redstone-network";

export function findRedstoneNetworks(redstones: RedstoneElement[]) {
  const finder = new NetworkFinder(redstones);
  const networks: RedstoneNetwork[] = [];
  while (finder.hasMore()) {
    const network = finder.nextNetwork();
    if (network) {
      networks.push(network);
    }
  }
  console.log(networks);
  return networks;
}
