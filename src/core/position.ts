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

  clone() {
    return new Position(this.x, this.y, this.z);
  }

  translate(dx: number, dy: number, dz: number): Position {
    return new Position(this.x + dx, this.y + dy, this.z + dz);
  }

  difference(other: Position): Position {
    return new Position(other.x - this.x, other.y - this.y, other.z - this.z);
  }

  static fromStringKey(key: string): Position {
    const [x, y, z] = key.split(",").map(Number);
    return new Position(x, y, z);
  }
}
