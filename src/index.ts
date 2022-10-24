console.log('Hello World!');

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const particleArray: Particle[] = [];
let hue = 0;

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
  particleArray.push(new Particle(0, 0, 'rainbow', 0, { x: 0, y: 0 }));
});

class Particle {
  constructor(
    public x: number,
    public y: number,
    public color: string,
    public size: number,
    public velocity: { x: number; y: number }
  ) {
    this.x = mouse.x;
    this.y = mouse.y;
    this.color = "#" + color;
    this.size = Math.random() * 15 + 2;
    this.velocity = { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1 };
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    if (this.size > 0.2) this.size -= 0.15;
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
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
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