import { Scene, Vector3 } from "three";
import { RedstoneCable } from "../core/blocks/redstone-cable";
import { RedstoneElement } from "../core/blocks/redstone-element";
import { RedstoneSource } from "../core/blocks/redstone-source";
import { createCube } from "./create-cube";
import { RedstoneActivable } from "../core/blocks/redstone-activable";
import { RedstoneRepeater } from "../core/blocks/redstone-repeater";
import { RedstoneInvertor } from "../core/blocks/redstone-invertor";

export function displayBlocks(
  scene: Scene,
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
