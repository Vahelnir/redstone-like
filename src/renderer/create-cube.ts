import { BoxGeometry, Mesh, MeshStandardMaterial, Vector3 } from "three";

export function createCube({ position }: { position?: Vector3 }) {
  const geometry = new BoxGeometry();
  const material = new MeshStandardMaterial({ color: 0xffffaa });
  const cube = new Mesh(geometry, material);
  if (position) {
    cube.position.copy(position);
  }

  return cube;
}
