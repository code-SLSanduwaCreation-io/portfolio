/* =========================================
           1. LIVING BACKGROUND (CANVAS PARTICLES)
           ========================================= */
const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let particlesArray;

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Handle resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initParticles();
});

// Mouse interaction
const mouse = { x: null, y: null, radius: 150 };

window.addEventListener("mousemove", (event) => {
  mouse.x = event.x;
  mouse.y = event.y;
});

// Particle Class
class Particle {
  constructor(x, y, directionX, directionY, size, color) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
    this.color = color;
  }

  // Method to draw
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = "#00f2ea"; // Cyan particles
    ctx.fill();
  }

  // Method to update
  update() {
    // Check boundary
    if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
    if (this.y > canvas.height || this.y < 0)
      this.directionY = -this.directionY;

    // Check collision - mouse interaction
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < mouse.radius + this.size) {
      if (mouse.x < this.x && this.x < canvas.width - this.size * 10)
        this.x += 10;
      if (mouse.x > this.x && this.x > this.size * 10) this.x -= 10;
      if (mouse.y < this.y && this.y < canvas.height - this.size * 10)
        this.y += 10;
      if (mouse.y > this.y && this.y > this.size * 10) this.y -= 10;
    }

    this.x += this.directionX;
    this.y += this.directionY;
    this.draw();
  }
}

// Init Particles
function initParticles() {
  particlesArray = [];
  // Number of particles based on screen size
  let numberOfParticles = (canvas.height * canvas.width) / 9000;
  for (let i = 0; i < numberOfParticles; i++) {
    let size = Math.random() * 2 + 1;
    let x = Math.random() * (innerWidth - size * 2 - size * 2) + size * 2;
    let y = Math.random() * (innerHeight - size * 2 - size * 2) + size * 2;
    let directionX = Math.random() * 2 - 1; // Speed
    let directionY = Math.random() * 2 - 1;
    let color = "#fff";

    particlesArray.push(
      new Particle(x, y, directionX, directionY, size, color),
    );
  }
}

// Connect Particles
function connect() {
  let opacityValue = 1;
  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      let distance =
        (particlesArray[a].x - particlesArray[b].x) *
          (particlesArray[a].x - particlesArray[b].x) +
        (particlesArray[a].y - particlesArray[b].y) *
          (particlesArray[a].y - particlesArray[b].y);
      if (distance < (canvas.width / 7) * (canvas.height / 7)) {
        opacityValue = 1 - distance / 20000;
        ctx.strokeStyle = "rgba(0, 242, 234," + opacityValue * 0.15 + ")"; // Cyan lines
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, innerWidth, innerHeight);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
  }
  connect();
}

initParticles();
animate();

/* =========================================
           2. CUSTOM CURSOR
           ========================================= */
const cursorDot = document.querySelector(".cursor-dot");
const cursorOutline = document.querySelector(".cursor-outline");

// Basic movement
window.addEventListener("mousemove", (e) => {
  const posX = e.clientX;
  const posY = e.clientY;

  // Dot follows instantly
  cursorDot.style.left = `${posX}px`;
  cursorDot.style.top = `${posY}px`;

  // Outline follows with delay (using animation)
  cursorOutline.animate(
    {
      left: `${posX}px`,
      top: `${posY}px`,
    },
    { duration: 500, fill: "forwards" },
  );
});

// Hover effect
const hoverTargets = document.querySelectorAll(".hover-target");
hoverTargets.forEach((el) => {
  el.addEventListener("mouseenter", () =>
    document.body.classList.add("hovering"),
  );
  el.addEventListener("mouseleave", () =>
    document.body.classList.remove("hovering"),
  );
});

/* =========================================
           3. 3D TILT EFFECT FOR CARDS
           ========================================= */
const cards = document.querySelectorAll(".project-card");

cards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top; // y position within the element

    // Calculate center
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Calculate rotation (limit to +/- 15 deg)
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    // Apply transform
    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  card.addEventListener("mouseleave", () => {
    // Reset
    card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
  });
});

/* =========================================
           4. SCROLL ANIMATIONS (Intersection Observer)
           ========================================= */
const observerOptions = {
  threshold: 0.15,
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show-el");

      // Trigger skill bars if specific element
      if (entry.target.querySelector(".progress-fill")) {
        const bars = entry.target.querySelectorAll(".progress-fill");
        bars.forEach((bar) => {
          bar.style.width = bar.getAttribute("data-width");
        });
      }
    }
  });
}, observerOptions);

const hiddenElements = document.querySelectorAll(".hidden-el");
hiddenElements.forEach((el) => observer.observe(el));

/* =========================================
           5. NAVBAR SCROLL EFFECT
           ========================================= */
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  // Back to Top Button
  const backToTop = document.querySelector(".back-to-top");
  if (window.scrollY > 500) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }
});

/* =========================================
           6. TYPEWRITER EFFECT
           ========================================= */
const textElement = document.getElementById("typewriter");
const phrases = [
  "Modern Digital Experiences",
  "Futuristic Interfaces",
  "High-End Applications",
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 100;

function type() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    textElement.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 50;
  } else {
    textElement.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 100;
  }

  if (!isDeleting && charIndex === currentPhrase.length) {
    isDeleting = true;
    typeSpeed = 2000; // Pause at end
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typeSpeed = 500; // Pause before new word
  }

  setTimeout(type, typeSpeed);
}

document.addEventListener("DOMContentLoaded", type);

/* =========================================
           7. CONTACT FORM & THEME TOGGLE
           ========================================= */
const contactForm = document.getElementById("contact-form");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // Show toast
  const toast = document.getElementById("toast");
  toast.className = "show";
  setTimeout(() => {
    toast.className = toast.className.replace("show", "");
  }, 3000);
  contactForm.reset();
});

const themeToggle = document.getElementById("theme-toggle");
themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  if (currentTheme === "light") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggle.innerText = "☀ Light";
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    themeToggle.innerText = "☾ Dark";
  }
});
