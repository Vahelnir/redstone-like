import { Scene } from "three";
import { Block } from "../core/blocks/block";
import { GroundBlock } from "../core/blocks/ground-block";
import { RedstoneElement } from "../core/blocks/redstone-element";

export function displayBlocks(scene: Scene, world: Map<string, Block>) {
  for (const redstoneElement of world.values()) {
    if (!(redstoneElement instanceof RedstoneElement)) {
      continue;
    }

    const blockPosition = redstoneElement.position.translate(0, -1, 0);
    const existingBlock = world.get(blockPosition.toStringKey());
    if (existingBlock) {
      throw new Error(
        `position clash at ${blockPosition.toStringKey()} where ${existingBlock.constructor.name} already exists`,
      );
    }

    const groundCube = new GroundBlock(blockPosition);
    world.set(blockPosition.toStringKey(), groundCube);
    scene.add(groundCube.getMesh());
  }

  for (const block of world.values()) {
    if (block instanceof Block) {
      const mesh = block.getMesh();
      if (mesh) {
        scene.add(mesh);
      }
    }
  }
}
