import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from "three";

export function createRedstoneActivable({
  position,
  enabled,
}: {
  position?: Vector3;
  enabled: boolean;
}) {
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshStandardMaterial({
    color: enabled ? 0x00ff00 : 0x666666,
  });
  const cube = new Mesh(geometry, material);
  if (position) {
    cube.position.copy(position);
  }

  return cube;
}
