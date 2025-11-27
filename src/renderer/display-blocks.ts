import { Scene, Vector3 } from "three";
import { RedstoneCable } from "../core/redstone-cable";
import { RedstoneElement } from "../core/redstone-element";
import { RedstoneSource } from "../core/redstone-source";
import { createCube } from "./create-cube";
import { createRedstoneCable } from "./create-redstone-cable";
import type { RedstoneNetwork } from "../core/network/redstone-network";
import { RedstoneActivable } from "../core/redstone-activable";
import { RedstoneRepeater } from "../core/redstone-repeater";
import { RedstoneInvertor } from "../core/redstone-invertor";

export function displayBlocks(
  scene: Scene,
  networks: RedstoneNetwork[],
  redstoneMap: Map<string, RedstoneElement>,
) {
  for (const redstone of redstoneMap.values()) {
    if (
      redstone instanceof RedstoneCable ||
      redstone instanceof RedstoneSource ||
      redstone instanceof RedstoneActivable ||
      redstone instanceof RedstoneRepeater ||
      redstone instanceof RedstoneInvertor
    ) {
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
