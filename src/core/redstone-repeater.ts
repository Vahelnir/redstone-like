import {
  ArrowHelper,
  BoxGeometry,
  Mesh,
  MeshStandardMaterial,
  Vector3,
} from "three";
import type { Position } from "./position";
import { RedstoneElement } from "./redstone-element";

export type RepeaterDirection = "north" | "south" | "east" | "west";

export class RedstoneRepeater extends RedstoneElement {
  ticksBeforeActivating = 2;
  ticksLeft: number;

  direction: RepeaterDirection;

  mesh;
  arrowMesh;

  constructor(position: Position, direction: RepeaterDirection) {
    super(position);
    this.ticksLeft = this.ticksBeforeActivating;
    this.direction = direction;

    this.mesh = createMesh();
    this.arrowMesh = createRepeaterArrow();
    this.mesh.add(this.arrowMesh);
  }

  render() {
    this.mesh.position.copy(this.position);
    this.mesh.material.color.setHex(this.isPowered ? 0x00ff00 : 0x666666);

    let arrowDirection = new Vector3(0, 0, -1); // par défaut nord
    if (this.direction === "south") arrowDirection = new Vector3(0, 0, 1);
    if (this.direction === "east") arrowDirection = new Vector3(1, 0, 0);
    if (this.direction === "west") arrowDirection = new Vector3(-1, 0, 0);
    this.arrowMesh.setDirection(arrowDirection);
  }

  redstoneTick() {
    // reset the ticks if it's already active
    if (this.power <= 0 && this.ticksLeft !== this.ticksBeforeActivating) {
      this.ticksLeft = this.ticksBeforeActivating;
      return;
    }

    if (this.power > 0 && this.ticksLeft > 0) {
      this.ticksLeft = Math.max(0, this.ticksLeft - 1);
      return;
    }
  }

  receivePowerFrom(source: RedstoneElement, power: number) {
    if (source.position.equals(this.inputPosition)) {
      this.power = Math.max(this.power, power);
      return true;
    }

    return false;
  }

  sendPowerTo(target: RedstoneElement) {
    if (target.position.equals(this.outputPosition)) {
      return this.outputPower;
    }

    return 0;
  }

  get inputPosition(): Position {
    if (this.direction === "north") {
      return this.position.translate(0, 0, 1);
    }

    if (this.direction === "south") {
      return this.position.translate(0, 0, -1);
    }

    if (this.direction === "east") {
      return this.position.translate(-1, 0, 0);
    }

    return this.position.translate(1, 0, 0);
  }

  get outputPosition(): Position {
    if (this.direction === "north") {
      return this.position.translate(0, 0, -1);
    }

    if (this.direction === "south") {
      return this.position.translate(0, 0, 1);
    }

    if (this.direction === "east") {
      return this.position.translate(1, 0, 0);
    }

    return this.position.translate(-1, 0, 0);
  }

  get isActive(): boolean {
    return this.ticksLeft === 0;
  }

  get isPowered(): boolean {
    return this.power > 0;
  }

  get outputPower(): number {
    return this.isActive ? 15 : 0;
  }
}

function createMesh() {
  const geometry = new BoxGeometry(1, 0.3, 1);
  geometry.translate(0, -0.35, 0);
  const material = new MeshStandardMaterial();
  const cube = new Mesh(geometry, material);

  return cube;
}

function createRepeaterArrow() {
  const origin = new Vector3(0, 0.25, 0); // ajuster selon la hauteur de ta box
  const length = 0.5;
  const color = 0xffd700; // jaune
  const arrow = new ArrowHelper(
    new Vector3(0, 0, -1),
    origin,
    length,
    color,
    0.2,
    0.1,
  );

  return arrow;
}
