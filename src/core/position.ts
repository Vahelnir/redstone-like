export class Position {
  x: number;
  y: number;
  z: number;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  toStringKey() {
    return `${this.x},${this.y},${this.z}`;
  }

  static fromStringKey(key: string): Position {
    const [x, y, z] = key.split(",").map(Number);
    return new Position(x, y, z);
  }
}
