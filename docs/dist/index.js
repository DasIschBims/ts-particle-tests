const body = document.querySelector("body");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const settingsToggle = document.getElementById("settings-toggle");
const particleArray = [];
const fpsCounter = document.getElementById("fps-counter");
let hue = 0;
const colorPickerElement = document.getElementById("color-picker");
const rainbowColorInputElement = document.getElementById("rainbow-toggle");
const particleMinSizeElement = document.getElementById("min-size");
const particleMaxSizeElement = document.getElementById("max-size");
const particleXVelocityElement = document.getElementById("velocity-x");
const particleYVelocityElement = document.getElementById("velocity-y");
const particleShapeCircle = document.getElementById("circle-input");
const particleShapeSquare = document.getElementById("square-input");
const particleShapeTriangle = document.getElementById("triangle-input");
const particleShapeStar = document.getElementById("star-input");
const generalClearCanvas = document.getElementById("clear-toggle");
const generalTrail = document.getElementById("trail-toggle");
const generalClick = document.getElementById("click-toggle");
const generalFPS = document.getElementById("fps-toggle");
window.onload = () => {
  colorPickerElement.defaultValue = "#ffffff";
  settingsToggle.checked = true;
};
let settings;
if (localStorage.getItem("settings") === null) {
  settings = {
    color: "#ffffff",
    size: {
      min: 1,
      max: 2
    },
    velocity: {
      x: 1,
      y: 1
    },
    shape: "circle",
    general: {
      clearCanvas: true,
      trail: true,
      click: true,
      fps: true
    }
  };
  console.log("No settings found, setting default settings");
  console.log(settings);
  localStorage.setItem("settings", JSON.stringify(settings));
} else {
  console.log("Settings found, loading settings");
  console.log(JSON.parse(localStorage.getItem("settings")));
  settings = JSON.parse(localStorage.getItem("settings"));
}
function getShape() {
  if (particleShapeCircle.checked) {
    return "circle";
  } else if (particleShapeSquare.checked) {
    return "square";
  } else if (particleShapeTriangle.checked) {
    return "triangle";
  } else if (particleShapeStar.checked) {
    return "star";
  } else {
    return "circle";
  }
}
function updateSettings() {
  settings = {
    color: colorPickerElement.value,
    size: {
      min: parseInt(particleMinSizeElement.value),
      max: parseInt(particleMaxSizeElement.value)
    },
    velocity: {
      x: parseInt(particleXVelocityElement.value),
      y: parseInt(particleYVelocityElement.value)
    },
    shape: getShape(),
    general: {
      clearCanvas: generalClearCanvas.checked,
      trail: generalTrail.checked,
      click: generalClick.checked,
      fps: generalFPS.checked
    }
  };
  localStorage.setItem("settings", JSON.stringify(settings));
}
function setSettings() {
  colorPickerElement.value = settings.color;
  particleMinSizeElement.value = settings.size.min.toString();
  particleMaxSizeElement.value = settings.size.max.toString();
  particleXVelocityElement.value = settings.velocity.x.toString();
  particleYVelocityElement.value = settings.velocity.y.toString();
  generalClearCanvas.checked = settings.general.clearCanvas;
  generalTrail.checked = settings.general.trail;
  generalClick.checked = settings.general.click;
  generalFPS.checked = settings.general.fps;
  if (settings.shape === "circle") {
    particleShapeCircle.checked = true;
  }
  if (settings.shape === "square") {
    particleShapeSquare.checked = true;
  }
  if (settings.shape === "triangle") {
    particleShapeTriangle.checked = true;
  }
  if (settings.shape === "star") {
    particleShapeStar.checked = true;
  }
}
switch (settings.shape) {
  case "circle":
    particleShapeCircle.checked = true;
    break;
  case "square":
    particleShapeSquare.checked = true;
    break;
  case "triangle":
    particleShapeTriangle.checked = true;
    break;
  case "star":
    particleShapeStar.checked = true;
    break;
}
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
const mouse = {
  x: 0,
  y: 0
};
canvas.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  if (settings.general.trail) {
    particleArray.push(new Particle({x: mouse.x, y: mouse.y}, settings.color, {min: settings.size.min, max: settings.size.max}, {velocityX: settings.velocity.x, velocityY: settings.velocity.y}, settings.shape));
  }
});
canvas.addEventListener("click", () => {
  if (settings.general.click) {
    for (let i = 0; i < 10; i++) {
      particleArray.push(new Particle({x: mouse.x, y: mouse.y}, settings.color, {min: settings.size.min, max: settings.size.max}, {velocityX: settings.velocity.x, velocityY: settings.velocity.y}, settings.shape));
    }
  }
});
window.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    for (let i = 0; i < 100; i++) {
      particleArray.push(new Particle({x: Math.random() * canvas.width, y: Math.random() * canvas.height}, settings.color, {min: settings.size.min, max: settings.size.max}, {velocityX: settings.velocity.x, velocityY: settings.velocity.y}, settings.shape));
    }
  }
  if (e.code === "Digit1") {
    settingsToggle.checked = !settingsToggle.checked;
  }
  if (e.code === "Digit2") {
    particleArray.splice(0, particleArray.length);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log("%cCleared particles", "color: cyan");
  }
});
class Particle {
  constructor(position, color, sizeObj, velocity, shape) {
    this.position = position;
    this.color = color;
    this.sizeObj = sizeObj;
    this.velocity = velocity;
    this.shape = shape;
    this.position.x = position.x;
    this.position.y = position.y;
    this.color = color;
    this.size = Math.floor(Math.random() * (sizeObj.max - sizeObj.min) + sizeObj.min);
    this.velocity = {velocityX: Math.random() * this.velocity.velocityX - this.velocity.velocityX / 2, velocityY: Math.random() * this.velocity.velocityY - this.velocity.velocityY / 2};
    this.shape = shape;
  }
  update() {
    this.position.x += this.velocity.velocityX;
    this.position.y += this.velocity.velocityY;
    if (this.size > 0.2)
      this.size -= 0.1;
  }
  draw() {
    if (rainbowColorInputElement.checked) {
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    } else {
      ctx.fillStyle = this.color;
    }
    switch (this.shape) {
      case "circle":
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        break;
      case "square":
        ctx.fillRect(this.position.x - this.size, this.position.y - this.size, this.size * 2, this.size * 2);
        break;
      case "triangle":
        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y - this.size);
        ctx.lineTo(this.position.x + this.size, this.position.y + this.size);
        ctx.lineTo(this.position.x - this.size, this.position.y + this.size);
        ctx.fill();
        break;
      case "star":
        let alpha = 2 * Math.PI / 10;
        ctx.beginPath();
        for (var i = 11; i != 0; i--) {
          var r = this.size * (i % 2 + 1) / 1.5;
          var omega = alpha * i;
          ctx.lineTo(r * Math.sin(omega) + this.position.x, r * Math.cos(omega) + this.position.y);
        }
        ctx.closePath();
        ctx.fill();
        break;
      default:
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        break;
    }
  }
}
function handleParticles() {
  for (let i = 0; i < particleArray.length; i++) {
    particleArray[i].update();
    particleArray[i].draw();
    if (particleArray[i].size <= 0.3) {
      particleArray.splice(i, 1);
      i--;
    }
  }
}
let fpsCounterNumber;
const times = [];
let init = 0;
function update() {
  requestAnimationFrame(update);
  updateSettings();
  if (generalFPS.checked) {
    window.requestAnimationFrame(() => {
      const now = performance.now();
      while (times.length > 0 && times[0] <= now - 1e3) {
        times.shift();
      }
      times.push(now);
      fpsCounterNumber = times.length;
      fpsCounter.innerText = `${fpsCounterNumber} FPS`;
    });
  } else {
    fpsCounter.innerText = "";
  }
  if (settings.general.clearCanvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  handleParticles();
  if (rainbowColorInputElement.checked) {
    hue += 0.25;
  }
}
setSettings();
update();
export {};
