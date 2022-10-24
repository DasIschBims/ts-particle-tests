const body = document.querySelector("body");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const particleArray = [];
let hue = 0;
let inCanvas = false;
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
  particleArray.push(new Particle({x: mouse.x, y: mouse.y}, "rainbow", {min: 5, max: 15}, {velocityX: 2, velocityY: 2}));
});
canvas.addEventListener("click", () => {
  for (let i = 0; i < 10; i++) {
    particleArray.push(new Particle({x: mouse.x, y: mouse.y}, "rainbow", {min: 5, max: 15}, {velocityX: 2, velocityY: 2}));
  }
});
canvas.addEventListener("mouseout", () => {
  setInterval(() => {
    mouse.x = Math.random() * canvas.width;
    mouse.y = Math.random() * canvas.height;
  }, 3e3);
  for (let i = 0; i < 25; i++) {
    setInterval(() => {
      particleArray.push(new Particle({x: Math.random() * canvas.width, y: Math.random() * canvas.height}, "rainbow", {min: 9, max: 10}, {velocityX: 0.5, velocityY: 0.5}));
    }, 3e3);
  }
});
body.addEventListener("mouseenter", () => {
  inCanvas = true;
});
body.addEventListener("mouseout", () => {
  inCanvas = false;
});
class Particle {
  constructor(position, color, sizeObj, velocity) {
    this.position = position;
    this.color = color;
    this.sizeObj = sizeObj;
    this.velocity = velocity;
    this.position.x = position.x;
    this.position.y = position.y;
    this.color = "#" + color;
    this.size = Math.floor(Math.random() * (sizeObj.max - sizeObj.min) + sizeObj.min);
    this.velocity = {velocityX: Math.random() * this.velocity.velocityX - this.velocity.velocityX / 2, velocityY: Math.random() * this.velocity.velocityY - this.velocity.velocityY / 2};
  }
  update() {
    this.position.x += this.velocity.velocityX;
    this.position.y += this.velocity.velocityY;
    if (this.size > 0.2)
      this.size -= 0.1;
    if (this.position.x < 0 || this.position.x > canvas.width || this.position.y < 0 || this.position.y > canvas.height) {
      this.position.x = mouse.x;
      this.position.y = mouse.y;
      this.size = Math.floor(Math.random() * (this.sizeObj.max - this.sizeObj.min) + this.sizeObj.min);
      this.velocity = {velocityX: Math.random() * this.velocity.velocityX - this.velocity.velocityX / 2, velocityY: Math.random() * this.velocity.velocityY - this.velocity.velocityY / 2};
    }
  }
  draw() {
    switch (this.color) {
      case "#rainbow":
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        break;
      default:
        ctx.fillStyle = this.color;
        break;
    }
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
    ctx.fill();
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
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  handleParticles();
  hue += 0.25;
  requestAnimationFrame(update);
}
update();
export {};
