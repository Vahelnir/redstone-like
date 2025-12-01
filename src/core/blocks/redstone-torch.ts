import {
  BoxGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  type Object3D,
} from "three";
import type { RedstoneNetwork } from "../network/redstone-network";
import { RedstoneElement } from "./redstone-element";
import type { Position } from "../position";

type RedstoneTorchPlacement = "north" | "south" | "east" | "west" | "middle";

export class RedstoneTorch extends RedstoneElement {
  power = 0;
  placement: RedstoneTorchPlacement;

  #mesh;
  #flame;

  constructor(position: Position, placement: RedstoneTorchPlacement) {
    super(position);
    this.placement = placement;

    const { group, flame } = createRedstoneTorch();
    this.#mesh = group;
    this.#flame = flame;
  }

  render(): void {
    this.#flame.material.color.setHex(this.power === 0 ? 0xff2222 : 0x330000);
    this.#flame.material.emissive.setHex(
      this.power === 0 ? 0xff4444 : 0x220000,
    );

    // orient the torch based on its placement
    let rotation = { x: 0, y: 0, z: 0 };
    const TILTED_TORCH_ANGLE = Math.PI / 4;
    let offset = { x: 0, y: 0, z: 0 };
    switch (this.placement) {
      case "north":
        rotation.x = TILTED_TORCH_ANGLE;
        offset.z = -0.2;
        break;
      case "south":
        rotation.x = -TILTED_TORCH_ANGLE;
        offset.z = 0.2;
        break;
      case "east":
        rotation.z = TILTED_TORCH_ANGLE;
        offset.x = 0.2;
        break;
      case "west":
        rotation.z = -TILTED_TORCH_ANGLE;
        offset.x = -0.2;
        break;
      default:
        rotation.x = 0;
        rotation.z = 0;
        break;
    }
    this.#mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    this.#mesh.position.set(
      this.position.x + offset.x,
      this.position.y + offset.y,
      this.position.z + offset.z,
    );
  }

  redstoneTick(network: RedstoneNetwork) {
    return this.outputPower;
  }

  receivePowerFrom(source: RedstoneElement, power: number) {
    if (source.position.equals(this.inputPosition)) {
      this.power = power;
    }

    return this.outputPower;
  }

  sendPowerTo(target: RedstoneElement) {
    return this.outputPower;
  }

  getMesh() {
    return this.#mesh;
  }

  get inputPosition(): Position {
    if (this.placement === "north") {
      return this.position.translate(0, 0, -2);
    }

    if (this.placement === "south") {
      return this.position.translate(0, 0, 2);
    }

    if (this.placement === "east") {
      return this.position.translate(2, 0, 0);
    }

    if (this.placement === "west") {
      return this.position.translate(-2, 0, 0);
    }

    return this.position.translate(0, -2, 0);
  }

  get outputPower() {
    return 15;
  }
}

export function createRedstoneTorch() {
  const group = new Group();
  const offsetY = -0.5;

  const stickHeight = 0.6;
  const stickGeom = new BoxGeometry(0.15, stickHeight, 0.15);
  stickGeom.translate(0, stickHeight / 2 + offsetY, 0);

  const stickMat = new MeshStandardMaterial({ color: 0x8b5a2b });
  const stick = new Mesh(stickGeom, stickMat);
  group.add(stick);

  const flameSize = 0.18;
  const flameGeom = new BoxGeometry(flameSize, flameSize, flameSize);
  flameGeom.translate(0, stickHeight + flameSize / 2 + offsetY, 0);

  const flameMat = new MeshStandardMaterial();
  const flame = new Mesh(flameGeom, flameMat);
  group.add(flame);

  return { group, flame };
}
