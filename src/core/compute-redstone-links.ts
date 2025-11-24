import { Position } from "./Position";
import type { Redstone } from "./redstone";

export function computeRedstoneLinks(redstones: Map<string, Redstone>) {
  const possibleDirections = [
    { name: "north", dx: 0, dz: -1 },
    { name: "south", dx: 0, dz: 1 },
    { name: "east", dx: 1, dz: 0 },
    { name: "west", dx: -1, dz: 0 },
  ] as const;

  for (const redstone of redstones.values()) {
    for (const dir of possibleDirections) {
      const neighborPos = new Position(
        redstone.position.x + dir.dx,
        redstone.position.y,
        redstone.position.z + dir.dz
      );
      const neighborKey = neighborPos.toStringKey();
      if (redstones.has(neighborKey)) {
        redstone.linkedDirections[dir.name] = true;
      }
    }
  }
}
