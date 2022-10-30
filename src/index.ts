const body = document.querySelector('body') as HTMLBodyElement;
const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
const settingsToggle = document.getElementById('settings-toggle') as HTMLInputElement;
const particleArray: Particle[] = [];
let hue = 0;

const colorPickerElement = document.getElementById('color-picker') as HTMLInputElement;
const rainbowColorInputElement = document.getElementById('rainbow-toggle') as HTMLInputElement;
const particleMinSizeElement = document.getElementById('min-size') as HTMLInputElement;
const particleMaxSizeElement = document.getElementById('max-size') as HTMLInputElement;
const particleXVelocityElement = document.getElementById('velocity-x') as HTMLInputElement;
const particleYVelocityElement = document.getElementById('velocity-y') as HTMLInputElement;


window.onload = () => {
  colorPickerElement.defaultValue = settings.color;
}

const settings = {
  color: 'rainbow',
  size: {
    min: 5,
    max: 15,
  },
  velocity: {
    x: 2,
    y: 2,
  },
};

function updateSettings() {
  if (rainbowColorInputElement.checked) {
    settings.color = 'rainbow';
  } else {
    settings.color = colorPickerElement.value;
  }
  settings.size.min = parseInt(particleMinSizeElement.value);
  settings.size.max = parseInt(particleMaxSizeElement.value);
  settings.velocity.x = parseInt(particleXVelocityElement.value);
  settings.velocity.y = parseInt(particleYVelocityElement.value);
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
  particleArray.push(new Particle({ x: mouse.x, y: mouse.y }, settings.color, { min: settings.size.min, max: settings.size.max }, { velocityX: settings.velocity.x, velocityY: settings.velocity.y }));
});

canvas.addEventListener('click', () => {
  for (let i = 0; i < 10; i++) {
    particleArray.push(new Particle({ x: mouse.x, y: mouse.y }, settings.color, { min: settings.size.min, max: settings.size.max }, { velocityX: settings.velocity.x, velocityY: settings.velocity.y }));
  }
});

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    for (let i = 0; i < 100; i++) {
      particleArray.push(new Particle({ x: Math.random() * canvas.width, y: Math.random() * canvas.height }, settings.color, { min: settings.size.min, max: settings.size.max }, { velocityX: settings.velocity.x, velocityY: settings.velocity.y }));
    }
  }

  if (e.code === "F2") {
    settingsToggle.checked = !settingsToggle.checked;
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
    this.color = color;
    this.size = Math.floor(Math.random() * (sizeObj.max - sizeObj.min) + sizeObj.min);
    this.velocity = { velocityX: (Math.random() * this.velocity.velocityX) - (this.velocity.velocityX / 2), velocityY: (Math.random() * this.velocity.velocityY) - (this.velocity.velocityY / 2) };
  }

  update() {
    this.position.x += this.velocity.velocityX;
    this.position.y += this.velocity.velocityY;
    if (this.size > 0.2) this.size -= 0.1;
  }

  draw() {
    if (this.color === 'rainbow') {
      ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
    } else {
      ctx.fillStyle = this.color;
    }
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
  updateSettings();
}
update();

export { };