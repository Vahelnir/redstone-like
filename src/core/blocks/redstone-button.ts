import { BoxGeometry, MeshStandardMaterial, Mesh, Object3D } from "three";
import type { Position } from "../position";
import { RedstoneElement } from "./redstone-element";

const BUTTON_PRESS_TICK_DURATION = 10;

export class RedstoneButton extends RedstoneElement {
  ticksLeft = 0;

  mesh;

  constructor(position: Position) {
    super(position);

    this.mesh = createButtonMesh();
  }

  render(): void {
    this.mesh.position.copy(this.position);
  }

  onClick() {
    if (!this.isClicked) {
      this.mesh.geometry.translate(0, -0.1, 0);
    }
    this.ticksLeft = BUTTON_PRESS_TICK_DURATION;
  }

  redstoneTick() {
    if (this.ticksLeft > 0) {
      this.ticksLeft--;
      if (this.ticksLeft === 0) {
        this.mesh.geometry.translate(0, 0.1, 0);
      }
    }

    return this.outputPower;
  }

  receivePowerFrom(): boolean {
    return false;
  }

  sendPowerTo(): number {
    return this.outputPower;
  }

  canEmitPower(): boolean {
    return this.isClicked;
  }

  getMesh() {
    return this.mesh;
  }

  get isClicked(): boolean {
    return this.ticksLeft > 0;
  }

  get outputPower(): number {
    return this.isClicked ? 15 : 0;
  }
}

function createButtonMesh() {
  // button that looks like minecraft's stone button
  const geometry = new BoxGeometry(0.4, 0.2, 0.6);
  geometry.translate(0, -0.4, 0);
  const material = new MeshStandardMaterial({ color: 0x888888 });
  const cube = new Mesh(geometry, material);

  return cube;
}
