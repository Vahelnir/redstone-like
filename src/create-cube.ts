import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Vector3,
} from "three";

export function createCube({ position }: { position?: Vector3 }) {
  const geometry = new BoxGeometry();
  const material = new MeshStandardMaterial({ color: 0x00ff00 });
  const cube = new Mesh(geometry, material);
  if (position) {
    cube.position.copy(position);
  }

  const wireMeshMaterial = new MeshBasicMaterial({
    color: 0x000000,
    wireframe: true,
  });
  const wireMesh = new Mesh(geometry, wireMeshMaterial);
  wireMesh.scale.setScalar(1.001);
  cube.add(wireMesh);

  return cube;
}
