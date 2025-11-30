import { Scene, Vector3 } from "three";
import { RedstoneElement } from "../core/blocks/redstone-element";
import { createCube } from "./create-cube";

export function displayBlocks(
  scene: Scene,
  redstoneMap: Map<string, RedstoneElement>,
) {
  for (const redstone of redstoneMap.values()) {
    if (redstone instanceof RedstoneElement) {
      const mesh = redstone.getMesh();
      if (mesh) {
        scene.add(mesh);
      }
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
