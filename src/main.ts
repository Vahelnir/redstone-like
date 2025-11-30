import "./style.css";
import {
  WebGLRenderer,
  Raycaster,
  Vector2,
  PerspectiveCamera,
  Scene,
  HemisphereLight,
  Object3D,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { Position } from "./core/position";
import { findRedstoneNetworks } from "./core/network/find-redstone-networks";
import { displayBlocks } from "./renderer/display-blocks";

import { RedstoneCable } from "./core/blocks/redstone-cable";
import { RedstoneElement } from "./core/blocks/redstone-element";
import { RedstoneSource } from "./core/blocks/redstone-source";
import { RedstoneActivable } from "./core/blocks/redstone-activable";
import { RedstoneRepeater } from "./core/blocks/redstone-repeater";
import { RedstoneInvertor } from "./core/blocks/redstone-invertor";
import { RedstoneButton } from "./core/blocks/redstone-button";

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

// const redstones: RedstoneElement[] = [
//   new RedstoneSource(new Position(-2, 0, 0)),
//   new RedstoneCable(new Position(-1, 0, 0)),
//   new RedstoneCable(new Position(-1, 0, -1)),
//   new RedstoneCable(new Position(-1, 0, -2)),
//   new RedstoneCable(new Position(0, 0, -2)),
//   new RedstoneCable(new Position(1, 0, -2)),
//   new RedstoneCable(new Position(2, 0, -2)),
//   new RedstoneRepeater(new Position(2, 0, -3), "north"),
//   new RedstoneCable(new Position(2, 0, -4)),
//   new RedstoneInvertor(new Position(2, 0, -5), "north"),
//   new RedstoneCable(new Position(2, 0, -6)),
//   new RedstoneCable(new Position(3, 0, -2)),
//   new RedstoneCable(new Position(4, 0, -2)),
//   new RedstoneSource(new Position(5, 0, -2)),
//   new RedstoneCable(new Position(0, 0, 0)),
//   new RedstoneCable(new Position(1, 0, 0)),
//   new RedstoneCable(new Position(1, 1, 1)),
//   new RedstoneCable(new Position(2, 1, 0)),
//   new RedstoneActivable(new Position(3, 1, 0)),
//   new RedstoneActivable(new Position(4, 1, 0)),

//   new RedstoneCable(new Position(5, 0, 5)),
//   new RedstoneCable(new Position(4, 1, 5)),
//   new RedstoneCable(new Position(5, 1, 4)),
//   new RedstoneCable(new Position(5, 1, 6)),
//   new RedstoneCable(new Position(6, 1, 5)),
// ];

// LOOP
// const redstones: RedstoneElement[] = [
//   new RedstoneInvertor(new Position(0, 0, -2), "east"),
//   new RedstoneCable(new Position(1, 0, -1)),
//   new RedstoneCable(new Position(1, 0, -2)),
//   new RedstoneCable(new Position(-1, 0, -2)),
//   new RedstoneInvertor(new Position(0, 0, 1), "west"),
//   new RedstoneCable(new Position(1, 0, 1)),
//   new RedstoneCable(new Position(-1, 0, 1)),
//   new RedstoneCable(new Position(-1, 0, -1)),
//   new RedstoneRepeater(new Position(-1, 0, 0), "north"),
//   new RedstoneRepeater(new Position(1, 0, -1), "south", 2),
//   new RedstoneRepeater(new Position(1, 0, 0), "south", 2),
// ];

const redstones: RedstoneElement[] = [
  new RedstoneButton(new Position(0, 0, 0)),
  new RedstoneCable(new Position(1, 0, 0)),
  new RedstoneInvertor(new Position(2, 0, 0), "east"),
  new RedstoneCable(new Position(3, 0, 0)),
  new RedstoneCable(new Position(4, 0, 0)),
  new RedstoneCable(new Position(4, 0, 1)),
  new RedstoneInvertor(new Position(4, 0, 2), "west"),
  new RedstoneCable(new Position(3, 0, 2)),
  new RedstoneCable(new Position(2, 0, 2)),
  new RedstoneCable(new Position(2, 0, 1)),

  new RedstoneCable(new Position(4, 0, 3)),
  new RedstoneButton(new Position(4, 0, 4)),
];

const redstoneMap = new Map<string, RedstoneElement>(
  redstones.map((redstone) => [redstone.position.toStringKey(), redstone]),
);
const redstoneNetworks = findRedstoneNetworks(redstones.map((r) => r));

console.log(redstones);
displayBlocks(scene, redstoneMap);

const raycaster = new Raycaster();
const mouse = new Vector2();

const meshToBlock = new Map<number, RedstoneElement>();
const idToMesh = new Map<number, Object3D>();
for (const block of redstones) {
  if ("mesh" in block && block.mesh instanceof Object3D) {
    meshToBlock.set(block.mesh.id, block);
    idToMesh.set(block.mesh.id, block.mesh);
  }
}

renderer.domElement.addEventListener("pointerdown", (event) => {
  const rect = renderer.domElement.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);

  const meshes = Array.from(meshToBlock.keys()).map((id) => idToMesh.get(id)!);
  const intersects = raycaster.intersectObjects(meshes, false);
  if (intersects.length > 0) {
    const mesh = intersects[0].object;
    const block = meshToBlock.get(mesh.id);
    if (block && "onClick" in block && typeof block.onClick === "function") {
      block.onClick?.();
    }
  }
});

let lastTick = performance.now();
const TICKS_PER_SECOND = 10;
const TICK_INTERVAL = 1000 / TICKS_PER_SECOND;

// FPS/TPS overlay generated by copilot
const statsOverlay = document.createElement("div");
statsOverlay.style.position = "absolute";
statsOverlay.style.top = "10px";
statsOverlay.style.left = "100px";
statsOverlay.style.padding = "8px 14px";
statsOverlay.style.background = "rgba(0,0,0,0.7)";
statsOverlay.style.color = "#fff";
statsOverlay.style.fontFamily = "monospace";
statsOverlay.style.fontSize = "16px";
statsOverlay.style.zIndex = "200";
statsOverlay.style.borderRadius = "8px";
document.body.appendChild(statsOverlay);

let lastFpsUpdate = performance.now();
let frameCount = 0;
let fps = 0;
let tps = 0;

function updateStatsOverlay() {
  statsOverlay.textContent = `FPS : ${fps} | TPS : ${tps}`;
}

function loop(t = 0) {
  const now = performance.now();
  let tickCount = 0;
  while (now - lastTick >= TICK_INTERVAL) {
    tick();
    lastTick += TICK_INTERVAL;
    tickCount++;

    // try to avoid blocking the main thread for too long
    if (tickCount > 5) {
      lastTick = now;
      break;
    }
  }

  controls.update();
  redstones.forEach((r) => r.render());
  renderer.render(scene, camera);

  frameCount++;
  if (now - lastFpsUpdate >= 1000) {
    fps = frameCount;
    frameCount = 0;
    lastFpsUpdate = now;
    const oneSecondAgo = now - 1000;
    const ticksLastSecond = tickTimestamps.filter(
      (ts) => ts >= oneSecondAgo,
    ).length;
    tps = ticksLastSecond;
    updateStatsOverlay();
  }
  requestAnimationFrame(loop);
}

const TICK_HISTORY = 60;
const tickTimestamps: number[] = [];

function tick() {
  const now = performance.now();
  for (const network of redstoneNetworks) {
    network.tick();
  }
  tickTimestamps.push(now);
  if (tickTimestamps.length > TICK_HISTORY) {
    tickTimestamps.shift();
  }
}

const tickButton = document.createElement("button");
tickButton.textContent = "Tick";
tickButton.style.position = "absolute";
tickButton.style.top = "10px";
tickButton.style.left = "10px";
tickButton.style.padding = "10px";
tickButton.style.zIndex = "100";
tickButton.onclick = () => {
  tick();
};
document.body.appendChild(tickButton);

loop();
