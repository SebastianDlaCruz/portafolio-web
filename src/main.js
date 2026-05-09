import './styles.css';
import 'boxicons/css/boxicons.min.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import emailjs from '@emailjs/browser';
import VanillaTilt from 'vanilla-tilt';
import { gsap } from 'gsap';
import * as THREE from 'three';

// =========================================
// CONFIGURACIÓN DE COLOR ARMÓNICA
// =========================================
const PALETTE = {
  cyan: new THREE.Color("#06b6d4"),
  violet: new THREE.Color("#8b5cf6"),
  magenta: new THREE.Color("#ec4899"),
  bg: "#030005"
};

// =========================================
// INICIALIZADORES (AOS, Vanilla Tilt)
// =========================================
AOS.init({
  duration: 1000,
  offset: 100,
  easing: 'ease-out-expo',
  once: true,
});

VanillaTilt.init(document.querySelectorAll(".card-glass"), {
  max: 3,
  speed: 800,
  glare: true,
  "max-glare": 0.15,
  scale: 1.01
});

// =========================================
// NAVEGACIÓN: Hamburger
// =========================================
const mainNav = document.getElementById('main-nav');
const menuToggle = document.getElementById('menu-toggle');
if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('open');
    menuToggle.innerHTML = isOpen ? "<i class='bx bx-x'></i>" : "<i class='bx bx-menu'></i>";
    gsap.fromTo("#nav-list li", { opacity: 0, x: 20 }, { opacity: 1, x: 0, stagger: 0.1, duration: 0.4, ease: "power2.out" });
  });
}

// =========================================
// THREE.JS: "FLUID GALACTIC CORE"
// =========================================
const initSophisticatedThree = () => {
  const container = document.getElementById('three-js-background');
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 3000);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const particlesCount = 20000;
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);
  const initialPositions = new Float32Array(particlesCount * 3);

  for (let i = 0; i < particlesCount; i++) {
    const i3 = i * 3;
    const radius = Math.random() * 800;
    const spin = radius * 0.05;
    const angle = Math.random() * Math.PI * 2 + spin;
    
    positions[i3] = Math.cos(angle) * radius;
    positions[i3 + 1] = (Math.random() - 0.5) * 200;
    positions[i3 + 2] = Math.sin(angle) * radius;

    initialPositions[i3] = positions[i3];
    initialPositions[i3+1] = positions[i3+1];
    initialPositions[i3+2] = positions[i3+2];

    const mixedColor = PALETTE.violet.clone().lerp(PALETTE.cyan, Math.random());
    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 2.5,
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  camera.position.z = 600;

  let mouse = { x: 0, y: 0 };
  let targetScroll = 0;
  let time = 0;

  window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  window.addEventListener('scroll', () => {
    targetScroll = window.scrollY;
  });

  const animate = () => {
    time += 0.01;
    requestAnimationFrame(animate);

    const posAttr = geometry.attributes.position;
    for (let i = 0; i < particlesCount; i++) {
      const i3 = i * 3;
      const x = initialPositions[i3];
      const z = initialPositions[i3 + 2];
      posAttr.array[i3 + 1] = initialPositions[i3 + 1] + Math.sin(time + x * 0.01) * 30 + Math.cos(time + z * 0.01) * 30;
    }
    posAttr.needsUpdate = true;

    camera.position.z = 600 - targetScroll * 0.5;
    points.rotation.y += 0.001 + mouse.x * 0.005;
    points.rotation.x += mouse.y * 0.005;

    camera.position.x += (mouse.x * 200 - camera.position.x) * 0.02;
    camera.position.y += (mouse.y * 200 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  };

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  animate();
};

initSophisticatedThree();

// =========================================
// GSAP: ANIMACIÓN CINEMÁTICA
// =========================================
function cinematicText(selector, delay) {
  const el = document.querySelector(selector);
  if (!el) return;
  const chars = el.innerText.split('');
  el.innerHTML = chars.map(c => `<span class='char'>${c === ' ' ? '&nbsp;' : c}</span>`).join('');
  
  gsap.from(el.querySelectorAll('.char'), {
    opacity: 0,
    y: 40,
    scale: 2,
    filter: 'blur(10px)',
    stagger: 0.04,
    duration: 1.5,
    ease: "power4.out",
    delay: delay
  });
}

cinematicText('.hero-title', 0.5);
cinematicText('.hero-subtitle', 1.2);

// =========================================
// GSAP: NOTIFICACIÓN PERSONALIZADA (TOAST)
// =========================================
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `custom-toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-content">
      <i class='bx ${type === 'success' ? 'bx-check-circle' : 'bx-error-circle'}'></i>
      <p>${message}</p>
    </div>
  `;
  document.body.appendChild(toast);

  gsap.fromTo(toast, 
    { x: 100, opacity: 0 }, 
    { x: 0, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
  );

  setTimeout(() => {
    gsap.to(toast, { 
      x: 100, opacity: 0, duration: 0.5, 
      onComplete: () => toast.remove() 
    });
  }, 4000);
}

// =========================================
// EMAILJS: FORMULARIO CON NOTIFICACIÓN MEJORADA
// =========================================
const contactForm = document.querySelector('.contacto-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const nameInput = document.getElementById('nombre');
    const userName = nameInput ? nameInput.value.split(' ')[0] : 'colega';
    
    const btn = contactForm.querySelector('button');
    const originalContent = btn.innerHTML;
    btn.innerHTML = "<i class='bx bx-loader-alt bx-spin'></i> Enviando...";
    btn.disabled = true;

    // CREDENCIALES CONFIGURADAS POR EL USUARIO
    const SERVICE_ID = "service_qsqby64";
    const TEMPLATE_ID = "template_286ys0y";
    const PUBLIC_KEY = "NHe50HS7blVemnZmA";

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, contactForm, PUBLIC_KEY)
      .then(() => {
        showToast(`¡Gracias, ${userName}! Tu mensaje llegó a mi galaxia.`, 'success');
        btn.innerHTML = "<i class='bx bx-check'></i> ¡Enviado!";
        btn.style.backgroundColor = "#10b981";
        contactForm.reset();
        setTimeout(() => {
          btn.innerHTML = originalContent;
          btn.style.backgroundColor = "";
          btn.disabled = false;
        }, 3000);
      })
      .catch((err) => {
        console.error("EmailJS Error:", err);
        showToast("Hubo un error en el envío. Por favor, reintenta.", 'error');
        btn.innerHTML = "<i class='bx bx-error'></i> Error";
        btn.style.backgroundColor = "#ef4444";
        setTimeout(() => {
          btn.innerHTML = originalContent;
          btn.style.backgroundColor = "";
          btn.disabled = false;
        }, 3000);
      });
  });
}

// =========================================
// GSAP: Cursor Trail
// =========================================
const cursorDot = document.querySelector('.cursor-dot');
const cursorOutline = document.querySelector('.cursor-outline');

window.addEventListener('mousemove', (e) => {
  gsap.to(cursorDot, { x: e.clientX, y: e.clientY, duration: 0.1 });
  gsap.to(cursorOutline, { x: e.clientX, y: e.clientY, duration: 0.4, ease: "power2.out" });
});

document.querySelectorAll('a, button, .card-glass, li').forEach(el => {
  el.addEventListener('mouseenter', () => {
    gsap.to(cursorOutline, { scale: 1.8, backgroundColor: 'rgba(6, 182, 212, 0.2)', borderColor: '#06b6d4', duration: 0.3 });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(cursorOutline, { scale: 1, backgroundColor: 'transparent', borderColor: '#8b5cf6', duration: 0.3 });
  });
});
