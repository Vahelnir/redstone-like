import {
  ArrowHelper,
  BoxGeometry,
  Mesh,
  MeshStandardMaterial,
  Vector3,
} from "three";
import type { RepeaterDirection } from "../core/redstone-repeater";
export function createRedstoneRepeater({
  position,
  enabled,
  direction,
}: {
  position?: Vector3;
  enabled: boolean;
  direction: RepeaterDirection;
}) {
  const geometry = new BoxGeometry(1, 0.3, 1);
  geometry.translate(0, -0.35, 0);
  const material = new MeshStandardMaterial({
    color: enabled ? 0x00ff00 : 0x666666,
  });
  const cube = new Mesh(geometry, material);
  if (position) {
    cube.position.copy(position);
  }

  const arrow = createRepeaterArrow(direction);
  cube.add(arrow);

  return cube;
}

export function createRepeaterArrow(direction: RepeaterDirection) {
  let dir = new Vector3(0, 0, -1);
  if (direction === "south") dir = new Vector3(0, 0, 1);
  if (direction === "east") dir = new Vector3(1, 0, 0);
  if (direction === "west") dir = new Vector3(-1, 0, 0);

  const origin = new Vector3(0, 0.25, 0);
  const length = 0.5;
  const color = 0xffd700;
  const arrow = new ArrowHelper(dir, origin, length, color, 0.2, 0.1);

  return arrow;
}
