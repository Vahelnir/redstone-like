import { BoxGeometry, MeshStandardMaterial, Mesh } from "three";
import type { Position } from "./position";
import { RedstoneElement } from "./redstone-element";

export class RedstoneSource extends RedstoneElement {
  power: number = 16;

  mesh;

  constructor(position: Position) {
    super(position);

    this.mesh = createRedstoneSource();
  }

  render() {
    this.mesh.position.copy(this.position);
  }

  redstoneTick() {}
}

function createRedstoneSource() {
  const geometry = new BoxGeometry(0.15, 0.5, 0.15);
  geometry.translate(0, -0.25, 0);
  const material = new MeshStandardMaterial({ color: 0xff0000 });
  const cube = new Mesh(geometry, material);

  return cube;
}
