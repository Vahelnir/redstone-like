import type { Object3D } from "three";
import type { Position } from "../position";

export abstract class Block {
  position: Position;

  constructor(position: Position) {
    this.position = position;
  }

  abstract render(): void;
  abstract getMesh(): Object3D;
}
