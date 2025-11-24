import "./style.css";
import {
  WebGLRenderer,
  PerspectiveCamera,
  Scene,
  HemisphereLight,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { RedstoneCable } from "./core/redstone-cable";
import { Position } from "./core/position";
import { findRedstoneNetworks } from "./core/network/find-redstone-networks";
import { computeRedstoneLinks as updateRedstoneLinks } from "./core/compute-redstone-links";
import { RedstoneElement } from "./core/redstone-element";
import { RedstoneSource } from "./core/redstone-source";
import { displayBlocks } from "./renderer/display-blocks";

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

const light = new HemisphereLight(0xffffff, 0x444444);
scene.add(light);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;

const redstones: RedstoneElement[] = [
  new RedstoneSource(new Position(-2, 0, 0)),
  new RedstoneCable(new Position(-1, 0, 0)),
  new RedstoneCable(new Position(-1, 0, -1)),
  new RedstoneCable(new Position(-1, 0, -2)),
  new RedstoneCable(new Position(0, 0, -2)),
  new RedstoneCable(new Position(1, 0, -2)),
  new RedstoneCable(new Position(2, 0, -2)),
  new RedstoneCable(new Position(3, 0, -2)),
  new RedstoneCable(new Position(4, 0, -2)),
  new RedstoneSource(new Position(5, 0, -2)),
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

console.log("ticking networks");
redstoneNetworks.forEach((network) => network.tick());

displayBlocks(scene, redstoneNetworks, redstoneMap);

function loop(t = 0) {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

loop();
