import type { Position } from "./position";
import { RedstoneElement } from "./redstone-element";

export type RepeaterDirection = "north" | "south" | "east" | "west";

export class RedstoneRepeater extends RedstoneElement {
  ticksBeforeActivating = 2;
  ticksLeft: number;

  power = 0;

  direction: RepeaterDirection;

  constructor(position: Position, direction: RepeaterDirection) {
    super(position);
    this.ticksLeft = this.ticksBeforeActivating;
    this.direction = direction;
  }

  tick() {
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

  get targetPosition(): Position {
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
