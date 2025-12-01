import { BoxGeometry, Mesh, MeshStandardMaterial, type Object3D } from "three";
import { Block } from "./block";
import type { Position } from "../position";

export class GroundBlock extends Block {
  #mesh;
  constructor(position: Position) {
    super(position);

    this.#mesh = createCube();
  }

  render(): void {
    this.#mesh.position.copy(this.position);
  }

  getMesh(): Object3D {
    return this.#mesh;
  }
}

function createCube() {
  const geometry = new BoxGeometry();
  const material = new MeshStandardMaterial({ color: 0xffffaa });
  const cube = new Mesh(geometry, material);
  return cube;
}
