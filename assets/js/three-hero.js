/**
 * 3D Hero Interactive Visualization for Sudhanshu Kumar Pandey's Portfolio
 * Powered by Three.js
 * Features: Floating geometric Icosahedron wireframe, glowing data nodes, ambient particles,
 * mouse parallax reactivity, WebGL fallback, and reduced-motion compliance.
 */

(function () {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // WebGL support detector
  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
      return false;
    }
  }

  function initThreeHero() {
    const container = document.getElementById('hero-3d-container');
    const canvas = document.getElementById('hero-canvas');
    if (!container || !canvas) return;

    if (!window.THREE || !isWebGLAvailable()) {
      // Graceful fallback: show CSS ambient gradient
      container.classList.add('no-webgl-fallback');
      return;
    }

    const THREE = window.THREE;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 280;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4.8;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Groups
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central Outer Wireframe Icosahedron (Data Science & AI Structure)
    const icoGeo = new THREE.IcosahedronGeometry(1.35, 1);
    const icoWireMat = new THREE.MeshStandardMaterial({
      color: 0xffdb70, // Warm Gold from vCard palette
      wireframe: true,
      transparent: true,
      opacity: 0.55,
      roughness: 0.2,
      metalness: 0.8
    });
    const icosahedron = new THREE.Mesh(icoGeo, icoWireMat);
    mainGroup.add(icosahedron);

    // 2. Inner Floating Octahedron (Core Compute Kernel)
    const innerGeo = new THREE.OctahedronGeometry(0.7, 0);
    const innerMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6, // Violet Luxury Accent
      roughness: 0.3,
      metalness: 0.9,
      wireframe: false,
      transparent: true,
      opacity: 0.75
    });
    const innerCore = new THREE.Mesh(innerGeo, innerMat);
    mainGroup.add(innerCore);

    // Inner wireframe overlay
    const innerWireMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8, // Cyan accent
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const innerWire = new THREE.Mesh(innerGeo, innerWireMat);
    innerWire.scale.set(1.05, 1.05, 1.05);
    mainGroup.add(innerWire);

    // 3. Orbiting Data Node Ring
    const torusGeo = new THREE.TorusGeometry(1.9, 0.015, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35
    });
    const torusRing = new THREE.Mesh(torusGeo, torusMat);
    torusRing.rotation.x = Math.PI / 3;
    mainGroup.add(torusRing);

    const torusRing2 = new THREE.Mesh(torusGeo, torusMat);
    torusRing2.rotation.x = -Math.PI / 3;
    torusRing2.rotation.y = Math.PI / 4;
    mainGroup.add(torusRing2);

    // 4. Ambient Data Particles Network
    const particlesCount = 90;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 7.5;
      posArray[i + 1] = (Math.random() - 0.5) * 5.5;
      posArray[i + 2] = (Math.random() - 0.5) * 4;
    }
    const particlesGeo = new THREE.BufferGeometry();
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xffdb70,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending
    });
    const particleCloud = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleCloud);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const violetPointLight = new THREE.PointLight(0xa855f7, 2.5, 20);
    violetPointLight.position.set(3, 3, 3);
    scene.add(violetPointLight);

    const cyanPointLight = new THREE.PointLight(0x06b6d4, 2.0, 20);
    cyanPointLight.position.set(-3, -2, 2);
    scene.add(cyanPointLight);

    const goldPointLight = new THREE.PointLight(0xffdb70, 1.8, 15);
    goldPointLight.position.set(0, 4, -2);
    scene.add(goldPointLight);

    // Mouse Interaction (Parallax with Damping)
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    function onMouseMove(event) {
      const rect = container.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      targetX = ((mouseX / rect.width) * 2 - 1) * 0.45;
      targetY = (-(mouseY / rect.height) * 2 + 1) * 0.45;
    }

    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('mouseleave', () => {
      targetX = 0;
      targetY = 0;
    });

    // Handle Window Resize
    function onResize() {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight || 280;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    }
    window.addEventListener('resize', onResize);

    // Visibility observer to pause RAF when out of view
    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.1 });
    observer.observe(container);

    // Animation Loop
    let clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      const delta = clock.getDelta();

      if (!prefersReducedMotion) {
        // Continuous subtle rotation
        icosahedron.rotation.y += 0.005;
        icosahedron.rotation.x += 0.003;

        innerCore.rotation.y -= 0.008;
        innerCore.rotation.z += 0.004;

        innerWire.rotation.y -= 0.008;
        innerWire.rotation.z += 0.004;

        torusRing.rotation.z += 0.004;
        torusRing2.rotation.z -= 0.003;

        particleCloud.rotation.y += 0.0008;
      }

      // Smooth mouse follow (lerp)
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      mainGroup.rotation.y = currentX * 1.2;
      mainGroup.rotation.x = -currentY * 0.9;
      mainGroup.position.x = currentX * 0.3;
      mainGroup.position.y = currentY * 0.3;

      renderer.render(scene, camera);
    }

    animate();
  }

  // Initialize when DOM and Three.js are ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThreeHero);
  } else {
    initThreeHero();
  }
})();
