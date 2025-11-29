import {
  ArrowHelper,
  BoxGeometry,
  Mesh,
  MeshStandardMaterial,
  Vector3,
} from "three";
import type { Position } from "../position";
import { RedstoneElement } from "./redstone-element";

export type RepeaterDirection = "north" | "south" | "east" | "west";

const TICK_DELAY = 2;

export class RedstoneRepeater extends RedstoneElement {
  ticksBeforeActivating: number;
  ticksLeft: number;

  inputPower = 0;

  direction: RepeaterDirection;
  isActive = false;

  mesh;
  arrowMesh;

  constructor(
    position: Position,
    direction: RepeaterDirection,
    delay: number = 1,
  ) {
    super(position);
    this.ticksBeforeActivating = delay * TICK_DELAY;
    this.ticksLeft = 0;
    this.direction = direction;

    this.mesh = createMesh();
    this.arrowMesh = createRepeaterArrow();
    this.mesh.add(this.arrowMesh);
  }

  render() {
    this.mesh.position.copy(this.position);
    if (this.isWaiting) {
      this.mesh.material.color.setHex(0xffff00);
    } else if (this.isActive) {
      this.mesh.material.color.setHex(0x00ff00);
    } else {
      this.mesh.material.color.setHex(0x666666);
    }

    let arrowDirection = new Vector3(0, 0, -1);
    if (this.direction === "south") arrowDirection = new Vector3(0, 0, 1);
    if (this.direction === "east") arrowDirection = new Vector3(1, 0, 0);
    if (this.direction === "west") arrowDirection = new Vector3(-1, 0, 0);
    this.arrowMesh.setDirection(arrowDirection);
  }

  redstoneTick() {
    this.#handleDelay();

    this.inputPower = 0;
  }

  #handleDelay() {
    if (this.isActive && this.isPowered) {
      return;
    }

    if (this.isActive) {
      this.isActive = false;
      return;
    }

    if (this.ticksLeft > 0) {
      this.ticksLeft = Math.max(0, this.ticksLeft - 1);
      if (this.ticksLeft === 0) {
        this.isActive = true;
      }
      return;
    }
  }

  receivePowerFrom(source: RedstoneElement, power: number) {
    if (source.position.equals(this.inputPosition)) {
      if (power === this.inputPower) {
        return false;
      }

      this.inputPower = power;
      if (this.isPowered && this.ticksLeft === 0) {
        this.ticksLeft = this.ticksBeforeActivating;
      }
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

  canEmitPower(): boolean {
    return this.isActive;
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

  get isPowered(): boolean {
    return this.inputPower > 0;
  }

  get isWaiting(): boolean {
    return this.ticksLeft > 0 && !this.isActive;
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
  const origin = new Vector3(0, 0.25, 0);
  const length = 0.5;
  const color = 0xffd700;
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
