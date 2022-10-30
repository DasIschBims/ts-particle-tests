const body = document.querySelector("body") as HTMLBodyElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const settingsToggle = document.getElementById('settings-toggle') as HTMLInputElement;
const particleArray: Particle[] = [];
let hue = 0;

window.onload = () => {
  settingsToggle.checked = true;
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const mouse = {
  x: 0,
  y: 0,
};

canvas.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  particleArray.push(new Particle({ x: mouse.x, y: mouse.y }, 'rainbow', { min: 5, max: 15 }, { velocityX: 2, velocityY: 2 }));
});

canvas.addEventListener('click', () => {
  for (let i = 0; i < 10; i++) {
    particleArray.push(new Particle({ x: mouse.x, y: mouse.y }, 'rainbow', { min: 5, max: 15 }, { velocityX: 2, velocityY: 2 }));
  }
});

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    for (let i = 0; i < 100; i++) {
      particleArray.push(new Particle({ x: Math.random() * canvas.width, y: Math.random() * canvas.height }, 'rainbow', { min: 5, max: 15 }, { velocityX: 2, velocityY: 2 }));
    }
  }
});

class Particle {
  size: any;
  constructor(
    public position: { x: number; y: number },
    public color: string,
    public sizeObj: { min: number; max: number },
    public velocity: { velocityX: number; velocityY: number }
  ) {
    this.position.x = position.x;
    this.position.y = position.y;
    this.color = "#" + color;
    this.size = Math.floor(Math.random() * (sizeObj.max - sizeObj.min) + sizeObj.min);
    this.velocity = { velocityX: (Math.random() * this.velocity.velocityX) - (this.velocity.velocityX / 2), velocityY: (Math.random() * this.velocity.velocityY) - (this.velocity.velocityY / 2) };
  }

  update() {
    this.position.x += this.velocity.velocityX;
    this.position.y += this.velocity.velocityY;
    if (this.size > 0.2) this.size -= 0.1;
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

export { };