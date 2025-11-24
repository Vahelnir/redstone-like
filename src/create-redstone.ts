import { BoxGeometry, Group, Mesh, MeshStandardMaterial, Vector3 } from "three";
import { mergeGeometries } from "three/addons/utils/BufferGeometryUtils.js";

type Directions = {
  north?: boolean;
  south?: boolean;
  east?: boolean;
  west?: boolean;
};

export function createRedstone({
  directions,
  position,
}: {
  directions: Directions;
  position?: Vector3;
}) {
  const color = 0xff0000;
  const mesh = getRedstoneMesh(directions);
  mesh.material.color.setHex(color);
  if (position) {
    mesh.position.copy(position);
  }
  return mesh;
}

function getRedstoneMesh(directions: Directions) {
  const geometries = [];
  const offsetY = -0.45;

  // Centre
  const centerGeom = new BoxGeometry(0.3, 0.1, 0.3);
  centerGeom.translate(0, offsetY, 0);
  geometries.push(centerGeom);

  // Branches
  if (directions.north) {
    const geom = new BoxGeometry(0.1, 0.1, 0.4);
    geom.translate(0, offsetY, -0.3);
    geometries.push(geom);
  }

  if (directions.south) {
    const geom = new BoxGeometry(0.1, 0.1, 0.4);
    geom.translate(0, offsetY, 0.3);
    geometries.push(geom);
  }

  if (directions.east) {
    const geom = new BoxGeometry(0.4, 0.1, 0.1);
    geom.translate(0.3, offsetY, 0);
    geometries.push(geom);
  }

  if (directions.west) {
    const geom = new BoxGeometry(0.4, 0.1, 0.1);
    geom.translate(-0.3, offsetY, 0);
    geometries.push(geom);
  }

  const merged = mergeGeometries(geometries);
  return new Mesh(merged, new MeshStandardMaterial());
}
