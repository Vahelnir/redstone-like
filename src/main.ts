import "./style.css";
import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  Vector3,
  HemisphereLight,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { createCube } from "./create-cube";
import { createRedstone } from "./create-redstone";

import { Redstone } from "./core/redstone";
import { Position } from "./core/Position";
import { computeRedstoneLinks } from "./core/compute-redstone-links";

const rendererSize = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const renderer = new WebGLRenderer();
renderer.setSize(rendererSize.width, rendererSize.height);
document.body.appendChild(renderer.domElement);

const camera = new PerspectiveCamera(
  80,
  rendererSize.width / rendererSize.height,
  0.1,
  1000
);

camera.position.z = 5;

const scene = new Scene();

const redstones = [
  { position: { x: -1, y: 0, z: 0 } },
  { position: { x: -1, y: 0, z: -1 } },
  { position: { x: 0, y: 0, z: 0 } },
  { position: { x: 1, y: 0, z: 0 } },
  { position: { x: 2, y: 1, z: 0 } },
];

const redstoneMap = new Map<string, Redstone>(
  redstones.map((data) => {
    const redstone = new Redstone(
      new Position(data.position.x, data.position.y, data.position.z)
    );
    return [redstone.position.toStringKey(), redstone];
  })
);

computeRedstoneLinks(redstoneMap);

for (const redstone of redstoneMap.values()) {
  const redstoneMesh = createRedstone({
    directions: redstone.linkedDirections,
    position: new Vector3(
      redstone.position.x,
      redstone.position.y,
      redstone.position.z
    ),
  });

  const blockPosition = redstone.position.clone();
  blockPosition.y -= 1;
  if (redstoneMap.get(blockPosition.toStringKey()) === redstone) {
    throw new Error("position clash");
  }
  const groundCube = createCube({
    position: new Vector3(
      redstone.position.x,
      redstone.position.y - 1,
      redstone.position.z
    ),
  });
  scene.add(redstoneMesh);
  scene.add(groundCube);
}

// scene.add(createCube({ position: new Vector3(0, 0, 0) }));
// scene.add(createCube({ position: new Vector3(1, 0, 0) }));
// scene.add(
//   createRedstone({
//     position: new Vector3(0, 1, 0),
//     directions: { north: true, east: true },
//   })
// );

const light = new HemisphereLight(0xffffff, 0x444444);
scene.add(light);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

function loop(t = 0) {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

loop();
