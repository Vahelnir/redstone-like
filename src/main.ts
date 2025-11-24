import "./style.css";
import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  Vector3,
  HemisphereLight,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { createCube } from "./renderer/create-cube";
import { createRedstoneCable } from "./renderer/create-redstone-cable";

import { RedstoneCable } from "./core/redstone-cable";
import { Position } from "./core/position";
import { findRedstoneNetworks } from "./core/network/find-redstone-networks";
import { computeRedstoneLinks as updateRedstoneLinks } from "./core/compute-redstone-links";
import { RedstoneElement } from "./core/redstone-element";
import { RedstoneSource } from "./core/redstone-source";
import { createRedstoneSource } from "./renderer/create-redstone-source";

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

const redstones: RedstoneElement[] = [
  new RedstoneSource(new Position(-2, 0, 0)),
  new RedstoneCable(new Position(-1, 0, 0)),
  new RedstoneCable(new Position(-1, 0, -1)),
  new RedstoneCable(new Position(0, 0, 0)),
  new RedstoneCable(new Position(1, 0, 0)),
  new RedstoneCable(new Position(2, 1, 0)),
];

const redstoneMap = new Map<string, RedstoneElement>(
  redstones.map((redstone) => [redstone.position.toStringKey(), redstone])
);
const redstoneNetworks = findRedstoneNetworks(redstones.map((r) => r));
updateRedstoneLinks(redstoneNetworks);

console.log(redstones);
for (const redstone of redstoneMap.values()) {
  const position = new Vector3(
    redstone.position.x,
    redstone.position.y,
    redstone.position.z
  );
  if (redstone instanceof RedstoneCable) {
    const redstoneMesh = createRedstoneCable({
      directions: redstone.directions,
      position: position,
    });
    scene.add(redstoneMesh);
  } else if (redstone instanceof RedstoneSource) {
    const source = createRedstoneSource({
      position: position,
    });
    scene.add(source);
  }

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
