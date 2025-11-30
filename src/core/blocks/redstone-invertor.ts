import { Mesh } from "three/src/objects/Mesh.js";
import type { Position } from "../position";
import { RedstoneElement } from "./redstone-element";
import { MeshStandardMaterial } from "three/src/materials/Materials.js";
import { BoxGeometry } from "three/src/geometries/Geometries.js";
import { Group } from "three";

export class RedstoneInvertor extends RedstoneElement {
  power = 0;
  direction: "north" | "south" | "east" | "west";
  #receivedPowerFrom = new Map<string, number>();

  mesh;
  flame;

  constructor(
    position: Position,
    direction: "north" | "south" | "east" | "west",
  ) {
    super(position);
    this.direction = direction;

    const { group, flame } = createRedstoneTorch();
    this.flame = flame;
    this.mesh = group;
  }

  render(): void {
    this.mesh.position.copy(this.position);
    this.flame.material.color.setHex(this.power === 0 ? 0xff2222 : 0x330000);
    this.flame.material.emissive.setHex(this.power === 0 ? 0xff4444 : 0x220000);

    this.mesh.rotation.set(0, 0, 0);
    const angle = Math.PI / 2;
    switch (this.direction) {
      case "north":
        this.mesh.rotation.x = -angle;
        break;
      case "south":
        this.mesh.rotation.x = angle;
        break;
      case "east":
        this.mesh.rotation.z = -angle;
        break;
      case "west":
        this.mesh.rotation.z = angle;
        break;
    }
  }

  redstoneTick() {
    return this.outputPower;
  }

  receivePowerFrom(source: RedstoneElement, power: number) {
    if (!source.position.equals(this.outputPosition)) {
      this.#receivedPowerFrom.set(source.position.toStringKey(), power);
      this.power = Math.max(...this.#receivedPowerFrom.values(), 0);
    }

    return this.outputPower;
  }

  sendPowerTo(target: RedstoneElement) {
    if (target.position.equals(this.outputPosition)) {
      return this.outputPower;
    }

    return null;
  }

  canEmitPower(): boolean {
    return true;
  }

  getMesh() {
    return this.mesh;
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

  get outputPower(): number {
    return this.power === 0 ? 15 : 0;
  }
}

/**
 * Crée une géométrie de torche de redstone façon Minecraft (cubique).
 * @param position Optionnel, position du socle de la torche
 * @returns Group prêt à être ajouté à la scène
 */
export function createRedstoneTorch() {
  const group = new Group();
  const offsetY = -0.4;

  const stickHeight = 0.6;
  const stickGeom = new BoxGeometry(0.15, stickHeight, 0.15);
  stickGeom.translate(0, stickHeight / 2 + offsetY, -0.4);

  const stickMat = new MeshStandardMaterial({ color: 0x8b5a2b });
  const stick = new Mesh(stickGeom, stickMat);
  group.add(stick);

  const flameSize = 0.18;
  const flameGeom = new BoxGeometry(flameSize, flameSize, flameSize);
  flameGeom.translate(0, stickHeight + flameSize / 2 + offsetY, -0.4);

  const flameMat = new MeshStandardMaterial();
  const flame = new Mesh(flameGeom, flameMat);
  group.add(flame);

  return { group, flame };
}
