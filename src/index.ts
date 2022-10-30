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

const particleShapeCircle = document.getElementById('circle-input') as HTMLInputElement;
const particleShapeSquare = document.getElementById('square-input') as HTMLInputElement;
const particleShapeTriangle = document.getElementById('triangle-input') as HTMLInputElement;
const particleShapeStar = document.getElementById('star-input') as HTMLInputElement;

const generalClearCanvas = document.getElementById('clear-toggle') as HTMLInputElement;

// function wait(time: number) {
//   return new Promise<void>((resolve) => {
//     setTimeout(() => {
//       resolve();
//     }, time);
//   });
// }

window.onload = () => {
  colorPickerElement.defaultValue = "#ffffff";
  settingsToggle.checked = true;
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
  shape: 'circle',
  general: {
    clearCanvas: true,
  },
};

switch (settings.shape) {
  case 'circle':
    particleShapeCircle.checked = true;
    break;
  case 'square':
    particleShapeSquare.checked = true;
    break;
  case 'triangle':
    particleShapeTriangle.checked = true;
    break;
  case 'star':
    particleShapeStar.checked = true;
    break;
}

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
  if (particleShapeCircle.checked) {
    settings.shape = 'circle';
  }
  if (particleShapeSquare.checked) {
    settings.shape = 'square';
  }
  if (particleShapeTriangle.checked) {
    settings.shape = 'triangle';
  }
  if (particleShapeStar.checked) {
    settings.shape = 'star';
  }
  settings.general.clearCanvas = generalClearCanvas.checked;
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
  particleArray.push(new Particle({ x: mouse.x, y: mouse.y }, settings.color, { min: settings.size.min, max: settings.size.max }, { velocityX: settings.velocity.x, velocityY: settings.velocity.y }, settings.shape));
});

canvas.addEventListener('click', () => {
  for (let i = 0; i < 10; i++) {
    particleArray.push(new Particle({ x: mouse.x, y: mouse.y }, settings.color, { min: settings.size.min, max: settings.size.max }, { velocityX: settings.velocity.x, velocityY: settings.velocity.y }, settings.shape));
  }
});

window.addEventListener('keydown', (e) => {
  if (e.code === 'Space') {
    for (let i = 0; i < 100; i++) {
      particleArray.push(new Particle({ x: Math.random() * canvas.width, y: Math.random() * canvas.height }, settings.color, { min: settings.size.min, max: settings.size.max }, { velocityX: settings.velocity.x, velocityY: settings.velocity.y }, settings.shape));
    }
  }

  if (e.code === 'Digit1') {
    settingsToggle.checked = !settingsToggle.checked;
  }

  if (e.code === 'Digit2') {
    particleArray.splice(0, particleArray.length);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    console.log('%cCleared particles', 'color: cyan');
  }
});

class Particle {
  size: any;
  constructor(
    public position: { x: number; y: number },
    public color: string,
    public sizeObj: { min: number; max: number },
    public velocity: { velocityX: number; velocityY: number },
    public shape: string
  ) {
    this.position.x = position.x;
    this.position.y = position.y;
    this.color = color;
    this.size = Math.floor(Math.random() * (sizeObj.max - sizeObj.min) + sizeObj.min);
    this.velocity = { velocityX: (Math.random() * this.velocity.velocityX) - (this.velocity.velocityX / 2), velocityY: (Math.random() * this.velocity.velocityY) - (this.velocity.velocityY / 2) };
    this.shape = shape;
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
    switch (this.shape) {
      case 'circle':
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'square':
        ctx.fillRect(this.position.x, this.position.y, this.size * 1.5, this.size * 1.5);
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y - (this.size));
        ctx.lineTo(this.position.x + (this.size), this.position.y + (this.size));
        ctx.lineTo(this.position.x - (this.size), this.position.y + (this.size));
        ctx.fill();
        break;
      case 'star':
        let alpha = (2 * Math.PI) / 10;
        ctx.beginPath();
        for (var i = 11; i != 0; i--) {
          var r = this.size * (i % 2 + 1) / 1.5;
          var omega = alpha * i;
          ctx.lineTo((r * Math.sin(omega)) + this.position.x, (r * Math.cos(omega)) + this.position.y);
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

function update() {
  if (settings.general.clearCanvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  handleParticles();
  hue += 0.25;
  requestAnimationFrame(update);
  updateSettings();
}
update();

export { };