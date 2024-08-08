import * as THREE from "three";

const soundOnBtn = document.getElementById("soundOn");
const soundOffBtn = document.getElementById("soundOff");
const pauseBtn = document.getElementById("pause");
const playBtn = document.getElementById("play");
const colorPicker = document.querySelector(".palette");
const speedometer = document.querySelector(".speedometer");
const velocityModal = document.querySelector("#velocity-modal");
const colorModal = document.querySelector("#color-modal");
const colorDivs = document.querySelectorAll(".color");
const okBtns = document.querySelectorAll(".ok-btn");
const slider = document.querySelector(".slider");
const velocityValue = document.querySelector("#velocity-value");

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

const vertexShader = `
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vPosition = vec3(modelViewMatrix * vec4(position, 1.0));
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform vec3 uColor;
  varying vec3 vNormal;
  varying vec3 vPosition;
  
  void main() {
    vec3 light = vec3(0.5, 0.2, 1.0);
    light = normalize(light);
    
    float dProd = max(0.0, dot(vNormal, light));
    vec3 diffuse = uColor * dProd;
    
    vec3 viewDir = normalize(-vPosition);
    vec3 reflectDir = reflect(-light, vNormal);
    float spec = pow(max(dot(viewDir, reflectDir), 0.0), 16.0);
    
    gl_FragColor = vec4(diffuse + vec3(spec), 1.0);
  }
`;

const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  uniforms: {
    uColor: { value: new THREE.Color(0x2196f3) },
  },
  flatShading: true,
});

const geometry = new THREE.SphereGeometry(0.5, 32, 32);

const ball = new THREE.Mesh(geometry, shaderMaterial);
scene.add(ball);

const hemiLight = new THREE.HemisphereLight(0xffffff, 0xc2c2cc, 1);
scene.add(hemiLight);

const bounceSound = new Audio("assets/ball-bounce.wav");

let isSoundEnabled = true;
let isMotionEnabled = true;

colorPicker.addEventListener("click", () => {
  colorModal.classList.remove("hidden");
});

speedometer.addEventListener("click", () => {
  velocityModal.classList.remove("hidden");
});

colorDivs.forEach((colorDiv) => {
  colorDiv.addEventListener("click", () => {
    const selectedColor = colorDiv.getAttribute("data-color");
    const newColor = new THREE.Color(selectedColor);

    shaderMaterial.uniforms.uColor.value = newColor;
  });
});

okBtns.forEach((okBtn) => {
  okBtn.addEventListener("click", () => {
    colorModal.classList.add("hidden");
    velocityModal.classList.add("hidden");
  });
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

let ballPosition = { x: 0, y: 0 };
let ballVelocity = { x: 0.1, y: 0 };

const ballRadius = 0.5;

const frustumWidth = 2 * aspectRatio * viewSize;

slider.addEventListener("input", () => {
  if (ballVelocity.x > 0) {
    ballVelocity.x = slider.value / 100;
  } else {
    ballVelocity.x = -slider.value / 100;
  }

  velocityValue.textContent = slider.value;
});

function animate() {
  requestAnimationFrame(animate);

  if (isMotionEnabled) {
    ballPosition.x += ballVelocity.x;

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
