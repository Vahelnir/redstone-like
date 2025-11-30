import { BoxGeometry, Mesh, MeshStandardMaterial } from "three";
import type { Position } from "../position";
import { RedstoneElement } from "./redstone-element";

export class RedstoneActivable extends RedstoneElement {
  #receivedPowerFrom = new Map<string, number>();

  mesh;

  constructor(position: Position) {
    super(position);

    this.mesh = createRedstoneActivable();
  }

  render() {
    this.mesh.position.copy(this.position);
    this.mesh.material.color.setHex(this.isActive ? 0x00ff00 : 0x666666);
  }

  redstoneTick() {}

  receivePowerFrom(source: RedstoneElement, power: number) {
    this.#receivedPowerFrom.set(source.position.toStringKey(), power);
    return true;
  }

  sendPowerTo() {
    return 0;
  }

  getMesh() {
    return this.mesh;
  }

  get isActive(): boolean {
    return Math.max(...this.#receivedPowerFrom.values()) > 0;
  }
}

function createRedstoneActivable() {
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshStandardMaterial();
  const cube = new Mesh(geometry, material);

  return cube;
}
