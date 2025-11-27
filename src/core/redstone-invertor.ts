import { Mesh } from "three/src/objects/Mesh.js";
import type { Position } from "./position";
import { RedstoneElement } from "./redstone-element";
import { MeshStandardMaterial } from "three/src/materials/Materials.js";
import { BoxGeometry } from "three/src/geometries/Geometries.js";
import { Group, Vector3 } from "three";

export class RedstoneInvertor extends RedstoneElement {
  inputPower = 0;
  direction: "north" | "south" | "east" | "west";

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
    this.flame.material.color.setHex(
      this.inputPower === 0 ? 0xff2222 : 0x330000,
    );
    this.flame.material.emissive.setHex(
      this.inputPower === 0 ? 0xff4444 : 0x220000,
    );

    // Reset rotation
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

  redstoneTick(): void {}

  receivePowerFrom(source: RedstoneElement, power: number) {
    if (source.position.equals(this.inputPosition)) {
      console.log(
        "Invertor at",
        this.position,
        "receives power",
        power,
        "from",
        source.position,
      );
      this.inputPower = Math.max(this.power, power);
      return true;
    }

    return false;
  }

  sendPowerTo(target: RedstoneElement) {
    if (target.position.equals(this.outputPosition)) {
      console.log(
        `Sending power ${this.outputPower} from invertor at`,
        this.position,
        "to",
        target.position,
      );
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

  get outputPower(): number {
    return this.inputPower === 0 ? 15 : 0;
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

  // Bâton (bois)
  const stickHeight = 0.6;
  const stickGeom = new BoxGeometry(0.15, stickHeight, 0.15);
  // Le bâton part du sol (y=0)
  stickGeom.translate(0, stickHeight / 2 + offsetY, -0.4);
  const stickMat = new MeshStandardMaterial({ color: 0x8b5a2b });
  const stick = new Mesh(stickGeom, stickMat);
  group.add(stick);

  // Flamme (cube rouge)
  const flameSize = 0.18;
  const flameGeom = new BoxGeometry(flameSize, flameSize, flameSize);
  // La flamme est posée sur le haut du bâton
  flameGeom.translate(0, stickHeight + flameSize / 2 + offsetY, -0.4);
  const flameMat = new MeshStandardMaterial();
  const flame = new Mesh(flameGeom, flameMat);
  group.add(flame);

  return { group, flame };
}
