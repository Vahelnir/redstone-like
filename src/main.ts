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
import { RedstoneElement } from "./core/redstone-element";
import { RedstoneSource } from "./core/redstone-source";
import { displayBlocks } from "./renderer/display-blocks";
import { RedstoneActivable } from "./core/redstone-activable";
import { RedstoneRepeater } from "./core/redstone-repeater";

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
  1000,
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
  new RedstoneRepeater(new Position(2, 0, -3), "north"),
  new RedstoneCable(new Position(2, 0, -4)),
  new RedstoneCable(new Position(3, 0, -2)),
  new RedstoneCable(new Position(4, 0, -2)),
  new RedstoneSource(new Position(5, 0, -2)),
  new RedstoneCable(new Position(0, 0, 0)),
  new RedstoneCable(new Position(1, 0, 0)),
  new RedstoneCable(new Position(1, 1, 1)),
  new RedstoneCable(new Position(2, 1, 0)),
  new RedstoneActivable(new Position(3, 1, 0)),
  new RedstoneActivable(new Position(4, 1, 0)),

  new RedstoneCable(new Position(5, 0, 5)),
  new RedstoneCable(new Position(4, 1, 5)),
  new RedstoneCable(new Position(5, 1, 4)),
  new RedstoneCable(new Position(5, 1, 6)),
  new RedstoneCable(new Position(6, 1, 5)),
];

const redstoneMap = new Map<string, RedstoneElement>(
  redstones.map((redstone) => [redstone.position.toStringKey(), redstone]),
);
const redstoneNetworks = findRedstoneNetworks(redstones.map((r) => r));

console.log(redstones);
displayBlocks(scene, redstoneNetworks, redstoneMap);

// Tick réseaux à 20Hz
let lastTick = performance.now();
const TICKS_PER_SECOND = 0.1;
const TICK_INTERVAL = 1000 / TICKS_PER_SECOND; // 50ms

function loop(t = 0) {
  // Tick réseaux à 20Hz
  const now = performance.now();
  if (now - lastTick >= TICK_INTERVAL || t === 0) {
    for (const network of redstoneNetworks) {
      network.tick();
    }
    lastTick = now;
  }

  controls.update();
  redstones.forEach((r) => r.render());
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

loop();
