import { Scene, Vector3 } from "three";
import { RedstoneCable } from "../core/redstone-cable";
import { RedstoneElement } from "../core/redstone-element";
import { RedstoneSource } from "../core/redstone-source";
import { createCube } from "./create-cube";
import { createRedstoneCable } from "./create-redstone-cable";
import { createRedstoneSource } from "./create-redstone-source";
import type { RedstoneNetwork } from "../core/network/redstone-network";

export function displayBlocks(
  scene: Scene,
  networks: RedstoneNetwork[],
  redstoneMap: Map<string, RedstoneElement>,
) {
  for (const redstone of redstoneMap.values()) {
    const position = new Vector3(
      redstone.position.x,
      redstone.position.y,
      redstone.position.z,
    );
    const network = networks.find((n) => n.hasNode(redstone));
    if (!network) {
      throw new Error("redstone not in network");
    }

    const networkNode = network.getNodeAt(redstone.position);
    if (!networkNode) {
      throw new Error("redstone network node not found");
    }

    if (redstone instanceof RedstoneCable) {
      const redstoneMesh = createRedstoneCable({
        directions: redstone.directions,
        position: position,
        power: networkNode.power,
      });
      scene.add(redstoneMesh);
    } else if (redstone instanceof RedstoneSource) {
      const source = createRedstoneSource({
        position: position,
      });
      scene.add(source);
    }

    const blockPosition = redstone.position.clone();
    blockPosition.y -= 1;
    if (redstoneMap.get(blockPosition.toStringKey()) === redstone) {
      throw new Error("position clash");
    }
    const groundCube = createCube({
      position: new Vector3(
        redstone.position.x,
        redstone.position.y - 1,
        redstone.position.z,
      ),
    });
    scene.add(groundCube);
  }
}
