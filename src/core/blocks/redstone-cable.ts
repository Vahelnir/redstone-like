import {
  BoxGeometry,
  Mesh,
  MeshStandardMaterial,
  Texture,
  SpriteMaterial,
  Sprite,
  type BufferGeometry,
} from "three";

import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { Position } from "../position";
import { RedstoneElement } from "./redstone-element";
import type { RedstoneNetwork } from "../network/redstone-network";

type Directions = {
  north?: boolean | "up";
  south?: boolean | "up";
  east?: boolean | "up";
  west?: boolean | "up";
};

const REDSTONE_CABLE_COLORS = [
  0x4b0000, 0x5e0000, 0x700000, 0x830000, 0x960000, 0xa80000, 0xbb0000,
  0xcd0000, 0xe00000, 0xf20000, 0xff1a1a, 0xff3333, 0xff4b4b, 0xff6666,
  0xff7f7f, 0xff9999,
];

const geometryCache = new Map<string, BufferGeometry>();

export class RedstoneCable extends RedstoneElement {
  direction: Directions = {
    north: false,
    south: false,
    east: false,
    west: false,
  };

  power = 0;
  #receivedPowerFrom: Map<string, number> = new Map();

  mesh;
  sprite;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  texture: Texture;

  constructor(position: Position) {
    super(position);
    this.mesh = createRedstoneCable({
      directions: {},
    });
    this.canvas = document.createElement("canvas");
    this.canvas.width = 128;
    this.canvas.height = 64;
    this.ctx = this.canvas.getContext("2d")!;
    this.texture = new Texture(this.canvas);
    this.texture.needsUpdate = true;
    this.sprite = createRedstonePowerSprite(this.texture);
    this.mesh.add(this.sprite);
  }

  render() {
    this.mesh.material.color.setHex(
      REDSTONE_CABLE_COLORS[Math.min(Math.max(this.power, 0), 15)],
    );
    this.mesh.position.copy(this.position);
    this.mesh.geometry = getDirectionGeometry(this.direction);

    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.font = "bold 36px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 4;
    ctx.strokeText(
      String(this.power),
      this.canvas.width / 2,
      this.canvas.height / 2,
    );
    ctx.fillText(
      String(this.power),
      this.canvas.width / 2,
      this.canvas.height / 2,
    );
    this.texture.needsUpdate = true;
    this.sprite.scale.set(0.5, 0.25, 1);
  }

  redstoneTick(network: RedstoneNetwork) {
    this.direction = network.getNeighborsOf(this).reduce<{
      north: boolean | "up";
      south: boolean | "up";
      east: boolean | "up";
      west: boolean | "up";
    }>(
      (acc, neighbor) => {
        const diff = this.position.difference(neighbor.position);
        const isUp = diff.y === 1;
        if (diff.x === 0 && diff.z === -1) {
          acc.north = isUp ? "up" : true;
        } else if (diff.x === 0 && diff.z === 1) {
          acc.south = isUp ? "up" : true;
        } else if (diff.x === 1 && diff.z === 0) {
          acc.east = isUp ? "up" : true;
        } else if (diff.x === -1 && diff.z === 0) {
          acc.west = isUp ? "up" : true;
        }
        return acc;
      },
      { north: false, south: false, east: false, west: false },
    );

    this.#receivedPowerFrom.clear();
    this.power = 0;
  }

  receivePowerFrom(source: RedstoneElement, power: number): boolean {
    const originalPower = this.power;
    this.#receivedPowerFrom.set(source.position.toStringKey(), power);
    this.power = Math.max(...this.#receivedPowerFrom.values());
    return this.power !== originalPower;
  }

  sendPowerTo(target: RedstoneElement): number {
    return this.power - 1;
  }
}

function createRedstoneCable({ directions }: { directions: Directions }) {
  const mesh = getRedstoneMesh(directions);
  return mesh;
}

function getDirectionGeometry(directions: Directions) {
  const key = [
    directions.north ? (directions.north === "up" ? "N^" : "N") : "",
    directions.south ? (directions.south === "up" ? "S^" : "S") : "",
    directions.east ? (directions.east === "up" ? "E^" : "E") : "",
    directions.west ? (directions.west === "up" ? "W^" : "W") : "",
  ].join("");
  if (geometryCache.has(key)) {
    return geometryCache.get(key)!;
  }
  console.log("Generating geometry for key:", key);
  const geometries = [];
  const height = 0.01;
  const centerOffset = -(1 - 0.02) / 2;

  const centerGeom = new BoxGeometry(0.3, height, 0.3);
  centerGeom.translate(0, centerOffset, 0);
  geometries.push(centerGeom);

  if (directions.north) {
    const geom = new BoxGeometry(0.1, height, 0.4);
    geom.translate(0, centerOffset, -0.3);
    geometries.push(geom);
    if (directions.north === "up") {
      const upGeom = new BoxGeometry(0.1, 1, height);
      upGeom.translate(0, 0, centerOffset);
      geometries.push(upGeom);
    }
  }

  if (directions.south) {
    const geom = new BoxGeometry(0.1, height, 0.4);
    geom.translate(0, centerOffset, 0.3);
    geometries.push(geom);
    if (directions.south === "up") {
      const upGeom = new BoxGeometry(0.1, 1, height);
      upGeom.translate(0, 0, -centerOffset);
      geometries.push(upGeom);
    }
  }

  if (directions.east) {
    const geom = new BoxGeometry(0.4, height, 0.1);
    geom.translate(0.3, centerOffset, 0);
    geometries.push(geom);
    if (directions.east === "up") {
      const upGeom = new BoxGeometry(height, 1, 0.1);
      upGeom.translate(-centerOffset, 0, 0);
      geometries.push(upGeom);
    }
  }

  if (directions.west) {
    const geom = new BoxGeometry(0.4, height, 0.1);
    geom.translate(-0.3, centerOffset, 0);
    geometries.push(geom);
    if (directions.west === "up") {
      const upGeom = new BoxGeometry(height, 1, 0.1);
      upGeom.translate(centerOffset, 0, 0);
      geometries.push(upGeom);
    }
  }

  const merged = mergeGeometries(geometries);
  geometryCache.set(key, merged.clone());
  return merged;
}

function getRedstoneMesh(directions: Directions) {
  return new Mesh(getDirectionGeometry(directions), new MeshStandardMaterial());
}

// TODO: see if rewriting this is necessary because it was generated by copilot
function createRedstonePowerSprite(texture?: Texture) {
  const material = new SpriteMaterial({
    map: texture ?? null,
    depthTest: false,
  });
  return new Sprite(material);
}
