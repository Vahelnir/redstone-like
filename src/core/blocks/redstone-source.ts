import { BoxGeometry, MeshStandardMaterial, Mesh, Object3D } from "three";
import type { Position } from "../position";
import { RedstoneElement } from "./redstone-element";

export class RedstoneSource extends RedstoneElement {
  mesh;

  constructor(position: Position) {
    super(position);

    this.mesh = createRedstoneSource();
  }

  render() {
    this.mesh.position.copy(this.position);
  }

  receivePowerFrom(_source: RedstoneElement, _power: number): boolean {
    return false;
  }

  sendPowerTo(_target: RedstoneElement): number {
    return this.outputPower;
  }

  canEmitPower(): boolean {
    return true;
  }

  getMesh() {
    return this.mesh;
  }

  redstoneTick() {
    return this.outputPower;
  }

  get outputPower(): number {
    return 15;
  }
}

function createRedstoneSource() {
  const geometry = new BoxGeometry(0.15, 0.5, 0.15);
  geometry.translate(0, -0.25, 0);
  const material = new MeshStandardMaterial({ color: 0xff0000 });
  const cube = new Mesh(geometry, material);

  return cube;
}
