import * as THREE from "three";

const soundOnBtn = document.getElementById("soundOn");
const soundOffBtn = document.getElementById("soundOff");
const pauseBtn = document.getElementById("pause");
const playBtn = document.getElementById("play");
const colorPicker = document.querySelector("#palette");
const colorModal = document.querySelector(".color-modal");
const colorDivs = document.querySelectorAll(".color");
const okBtn = document.querySelector(".ok-btn");

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

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x080820, 1);
scene.add(hemiLight);

const bounceSound = new Audio("assets/ball-bounce.wav");

let isSoundEnabled = true;
let isMotionEnabled = true;

let ballPosition = { x: 0, y: 0 };
let ballVelocity = { x: 0.1, y: 0 };
const ballRadius = 0.5;

colorPicker.addEventListener("click", () => {
  colorModal.classList.remove("hidden");
});

colorDivs.forEach((colorDiv) => {
  colorDiv.addEventListener("click", () => {
    const selectedColor = colorDiv.getAttribute("data-color");

    material.color.set(selectedColor);
  });
});

okBtn.addEventListener("click", () => {
  colorModal.classList.add("hidden");
});

soundOnBtn.addEventListener("click", () => {
  isSoundEnabled = false;
  soundOnBtn.classList.add("hidden");
  soundOffBtn.classList.remove("hidden");
});

soundOffBtn.addEventListener("click", () => {
  isSoundEnabled = true;
  soundOffBtn.classList.add("hidden");
  soundOnBtn.classList.remove("hidden");
});

pauseBtn.addEventListener("click", () => {
  isMotionEnabled = false;
  pauseBtn.classList.add("hidden");
  playBtn.classList.remove("hidden");
});

playBtn.addEventListener("click", () => {
  isMotionEnabled = true;
  playBtn.classList.add("hidden");
  pauseBtn.classList.remove("hidden");
});

function animate() {
  requestAnimationFrame(animate);

  if (isMotionEnabled) {
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
  }

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
