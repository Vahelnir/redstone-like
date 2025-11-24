import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from "three";

export function createRedstoneSource({ position }: { position?: Vector3 }) {
  const geometry = new BoxGeometry(0.15, 0.5, 0.15);
  geometry.translate(0, -0.25, 0);
  const material = new MeshStandardMaterial({ color: 0xff0000 });
  const cube = new Mesh(geometry, material);
  if (position) {
    cube.position.copy(position);
  }

  return cube;
}
