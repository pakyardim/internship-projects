import * as THREE from "three";

const scene = new THREE.Scene();
const aspectRatio = window.innerWidth / window.innerHeight;
const viewSize = 5;
const camera = new THREE.OrthographicCamera(
  -aspectRatio * viewSize,
  aspectRatio * viewSize,
  viewSize,
  -viewSize,
  0.1,
  1000
);

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.SphereGeometry(0.5, 32, 32);
const material = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  flatShading: true,
});
const ball = new THREE.Mesh(geometry, material);
scene.add(ball);

const hemiLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
scene.add(hemiLight);

const bounceSound = new Audio("ball-bounce.wav");

let isSoundEnabled = true;

let ballPosition = { x: 0, y: 0 };
let ballVelocity = { x: 0.1, y: 0 };
const ballRadius = 0.5;

document.querySelector(".colorPicker").addEventListener("input", (event) => {
  const newColor = event.target.value;
  material.color.set(newColor);
});

document.querySelector(".soundToggle").addEventListener("click", () => {
  isSoundEnabled = !isSoundEnabled;
  document.getElementById("soundToggle").textContent = isSoundEnabled
    ? "Disable Sound"
    : "Enable Sound";
});

function animate() {
  requestAnimationFrame(animate);

  ballPosition.x += ballVelocity.x;

  const frustumWidth = 2 * aspectRatio * viewSize;

  if (
    ballPosition.x + ballRadius > frustumWidth / 2 ||
    ballPosition.x - ballRadius < -frustumWidth / 2
  ) {
    ballVelocity.x *= -1;
    if (isSoundEnabled) {
      bounceSound.play();
    }
  }

  ball.position.x = ballPosition.x;

  renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
  const aspectRatio = window.innerWidth / window.innerHeight;
  camera.left = -aspectRatio * viewSize;
  camera.right = aspectRatio * viewSize;
  camera.top = viewSize;
  camera.bottom = -viewSize;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
