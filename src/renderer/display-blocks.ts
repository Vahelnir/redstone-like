import { Scene, Vector3 } from "three";
import { RedstoneCable } from "../core/redstone-cable";
import { RedstoneElement } from "../core/redstone-element";
import { RedstoneSource } from "../core/redstone-source";
import { createCube } from "./create-cube";
import { createRedstoneCable } from "./create-redstone-cable";
import type { RedstoneNetwork } from "../core/network/redstone-network";
import { RedstoneActivable } from "../core/redstone-activable";
import { RedstoneRepeater } from "../core/redstone-repeater";

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

    if (redstone instanceof RedstoneCable) {
      scene.add(redstone.mesh);
    } else if (redstone instanceof RedstoneSource) {
      scene.add(redstone.mesh);
    } else if (redstone instanceof RedstoneActivable) {
      scene.add(redstone.mesh);
    } else if (redstone instanceof RedstoneRepeater) {
      scene.add(redstone.mesh);
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
