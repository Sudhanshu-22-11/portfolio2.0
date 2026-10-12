/**
 * Cinematic 3D Avatar Hero Scene for Sudhanshu Kumar Pandey
 * Powered by Three.js & GSAP
 * 
 * Features:
 * - Dark, futuristic, minimal 3D environment with deep black canvas and atmospheric fog
 * - Glossy reflective floor with concentric cyber rings and radial falloff
 * - Circular futuristic platform with glowing cyan & violet neon rings
 * - 3D Sculpted Avatar Emoji (Sudhanshu's authentic Memoji) with volumetric beveled medallion,
 *   convex glass crystal dome, 3D metallic spectacles frame for stereoscopic depth, and rim lighting
 * - Dual floating orbital neon rings with independent precession
 * - Floating chrome, glass, and cyan orbital spheres following curved 3D paths
 * - Floating ambient bokeh dust particles & volumetric light beam
 * - Cinematic camera dolly reveal sequence and smooth interactive mouse parallax
 * - STRICTLY NO TEXT or overlay clutter
 */

(function () {
  'use strict';

  // Check WebGL availability
  function isWebGLAvailable() {
    try {
      const canvas = document.createElement('canvas');
      return !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      return false;
    }
  }

  function initCinematicHero() {
    const container = document.getElementById('hero-3d-container');
    const canvas = document.getElementById('hero-canvas');
    if (!container || !canvas) return;

    if (!window.THREE || !isWebGLAvailable()) {
      container.classList.add('no-webgl-fallback');
      return;
    }

    const THREE = window.THREE;

    // -------------------------------------------------------------------------
    // 1. Scene, Camera & Renderer Setup
    // -------------------------------------------------------------------------
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x03050a);
    scene.fog = new THREE.FogExp2(0x03050a, 0.038);

    let width = container.clientWidth || 900;
    let height = container.clientHeight || 480;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    // Initial camera position for wide establishing shot
    camera.position.set(0, 1.4, 9.0);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      alpha: false,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // -------------------------------------------------------------------------
    // 2. Cinematic Lighting Rig
    // -------------------------------------------------------------------------
    // Ambient light for deep moody visibility
    const ambientLight = new THREE.AmbientLight(0x0d1527, 1.2);
    scene.add(ambientLight);

    // Front Dedicated Neutral Key Light (Preserves true skin tone, hair, and smile)
    const faceLight = new THREE.DirectionalLight(0xffffff, 2.6);
    faceLight.position.set(0, 1.5, 5);
    scene.add(faceLight);

    // Key Spotlight (Cool Electric Cyan / Blue accent from top-front)
    const keySpot = new THREE.SpotLight(0x38bdf8, 3.2, 25, Math.PI / 4, 0.45, 1.2);
    keySpot.position.set(3, 6, 6);
    keySpot.castShadow = true;
    keySpot.shadow.mapSize.width = 1024;
    keySpot.shadow.mapSize.height = 1024;
    scene.add(keySpot);

    // Rim Spotlight (Intense Electric Violet from back-left for signature edge lighting)
    const rimSpot = new THREE.SpotLight(0xa855f7, 5.0, 25, Math.PI / 3, 0.35, 1.0);
    rimSpot.position.set(-3.5, 4.5, -4.5);
    scene.add(rimSpot);

    // Secondary Accent Spot (Warm Gold / White specular rim from back-right)
    const accentSpot = new THREE.SpotLight(0xffeedd, 3.0, 20, Math.PI / 3.5, 0.4, 1.0);
    accentSpot.position.set(3.5, 3.5, -3.5);
    scene.add(accentSpot);

    // Platform Core Underglow Light (Cyan point light at platform center)
    const platformLight = new THREE.PointLight(0x00f0ff, 3.2, 8);
    platformLight.position.set(0, -0.9, 0);
    scene.add(platformLight);

    // Subtle front fill light
    const frontFill = new THREE.PointLight(0x60a5fa, 1.2, 12);
    frontFill.position.set(0, -0.4, 3.8);
    scene.add(frontFill);

    // -------------------------------------------------------------------------
    // 3. Reflective Glossy Floor with Cyber Radial Grid
    // -------------------------------------------------------------------------
    function createFloorTexture() {
      const c = document.createElement('canvas');
      c.width = 1024;
      c.height = 1024;
      const ctx = c.getContext('2d');

      // Deep dark base
      ctx.fillStyle = '#03050a';
      ctx.fillRect(0, 0, 1024, 1024);

      // Fine concentric rings
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.08)';
      ctx.lineWidth = 1.5;
      for (let r = 80; r < 500; r += 70) {
        ctx.beginPath();
        ctx.arc(512, 512, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Highlight concentric ring
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.15)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(512, 512, 280, 0, Math.PI * 2);
      ctx.stroke();

      // Subtle radial spokes
      ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < 16; i++) {
        const angle = (i * Math.PI) / 8;
        ctx.beginPath();
        ctx.moveTo(512, 512);
        ctx.lineTo(512 + Math.cos(angle) * 480, 512 + Math.sin(angle) * 480);
        ctx.stroke();
      }

      // Radial vignette / fade at edges
      const grad = ctx.createRadialGradient(512, 512, 100, 512, 512, 512);
      grad.addColorStop(0, 'rgba(3, 5, 10, 0)');
      grad.addColorStop(0.7, 'rgba(3, 5, 10, 0.4)');
      grad.addColorStop(1, 'rgba(3, 5, 10, 0.98)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 1024);

      const texture = new THREE.CanvasTexture(c);
      texture.wrapS = THREE.ClampToEdgeWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      return texture;
    }

    const floorGeo = new THREE.CircleGeometry(16, 64);
    const floorMat = new THREE.MeshStandardMaterial({
      map: createFloorTexture(),
      color: 0x070b16,
      roughness: 0.12,
      metalness: 0.88
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.6;
    floor.receiveShadow = true;
    scene.add(floor);

    // -------------------------------------------------------------------------
    // 4. Futuristic Multi-Tiered Circular Platform
    // -------------------------------------------------------------------------
    const platformGroup = new THREE.Group();
    platformGroup.position.y = -1.2;
    scene.add(platformGroup);

    // Base Tier Cylinder (Dark brushed obsidian metal)
    const baseCylGeo = new THREE.CylinderGeometry(2.5, 2.8, 0.45, 64);
    const baseCylMat = new THREE.MeshStandardMaterial({
      color: 0x0a1020,
      roughness: 0.22,
      metalness: 0.92
    });
    const baseCyl = new THREE.Mesh(baseCylGeo, baseCylMat);
    baseCyl.position.y = -0.22;
    baseCyl.receiveShadow = true;
    baseCyl.castShadow = true;
    platformGroup.add(baseCyl);

    // Upper Tier Chamfered Rim
    const upperCylGeo = new THREE.CylinderGeometry(2.2, 2.5, 0.15, 64);
    const upperCylMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.15,
      metalness: 0.95
    });
    const upperCyl = new THREE.Mesh(upperCylGeo, upperCylMat);
    upperCyl.position.y = 0.08;
    platformGroup.add(upperCyl);

    // Platform Top Inset Metallic Disc
    const topDiscGeo = new THREE.CylinderGeometry(1.9, 1.9, 0.04, 64);
    const topDiscMat = new THREE.MeshStandardMaterial({
      color: 0x070b16,
      roughness: 0.18,
      metalness: 0.85
    });
    const topDisc = new THREE.Mesh(topDiscGeo, topDiscMat);
    topDisc.position.y = 0.16;
    platformGroup.add(topDisc);

    // Glowing Neon Ring 1 (Base Ring - Electric Cyan)
    const neonRing1Geo = new THREE.TorusGeometry(2.78, 0.04, 24, 100);
    const neonRing1Mat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 2.2,
      roughness: 0.1,
      metalness: 0.5
    });
    const neonRing1 = new THREE.Mesh(neonRing1Geo, neonRing1Mat);
    neonRing1.rotation.x = Math.PI / 2;
    neonRing1.position.y = -0.4;
    platformGroup.add(neonRing1);

    // Glowing Neon Ring 2 (Upper Tier - Electric Violet)
    const neonRing2Geo = new THREE.TorusGeometry(2.24, 0.035, 24, 100);
    const neonRing2Mat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x8b5cf6,
      emissiveIntensity: 2.5,
      roughness: 0.1,
      metalness: 0.5
    });
    const neonRing2 = new THREE.Mesh(neonRing2Geo, neonRing2Mat);
    neonRing2.rotation.x = Math.PI / 2;
    neonRing2.position.y = 0.16;
    platformGroup.add(neonRing2);

    // Concentric Inner Glowing Circle on platform surface
    const innerGlowRingGeo = new THREE.TorusGeometry(1.4, 0.02, 16, 80);
    const innerGlowRingMat = new THREE.MeshStandardMaterial({
      color: 0x00e5ff,
      emissive: 0x00e5ff,
      emissiveIntensity: 1.8,
      roughness: 0.2
    });
    const innerGlowRing = new THREE.Mesh(innerGlowRingGeo, innerGlowRingMat);
    innerGlowRing.rotation.x = Math.PI / 2;
    innerGlowRing.position.y = 0.18;
    platformGroup.add(innerGlowRing);

    // Volumetric Light Beam Cylinder (subtle upward beam of light)
    const beamGeo = new THREE.CylinderGeometry(0.85, 2.6, 6.0, 32, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      transparent: true,
      opacity: 0.045,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const lightBeam = new THREE.Mesh(beamGeo, beamMat);
    lightBeam.position.y = 1.8;
    platformGroup.add(lightBeam);

    // -------------------------------------------------------------------------
    // 5. The Hero 3D Avatar Emoji (Volumetric, Polished, Beveled Object)
    // -------------------------------------------------------------------------
    const avatarMasterGroup = new THREE.Group();
    // Initially below the platform for the cinematic ascent reveal
    avatarMasterGroup.position.set(0, -0.6, 0);
    scene.add(avatarMasterGroup);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      './assets/images/my-avatar.png',
      function (avatarTex) {
        avatarTex.encoding = THREE.sRGBEncoding;
        avatarTex.generateMipmaps = true;
        avatarTex.minFilter = THREE.LinearMipmapLinearFilter;
        avatarTex.magFilter = THREE.LinearFilter;

        // A. 3D Beveled Medallion Disc Body
        const discRadius = 1.38;
        const discThickness = 0.24;

        // 1. Polished Titanium Rim Cylinder
        const rimGeo = new THREE.CylinderGeometry(discRadius, discRadius, discThickness, 64, 1, false);
        const titaniumMat = new THREE.MeshStandardMaterial({
          color: 0x141b2b,
          roughness: 0.16,
          metalness: 0.9,
          envMapIntensity: 1.5
        });
        const rimMesh = new THREE.Mesh(rimGeo, titaniumMat);
        rimMesh.rotation.x = Math.PI / 2;
        rimMesh.castShadow = true;
        avatarMasterGroup.add(rimMesh);

        // 2. Upright Front Face with Avatar Texture (CircleGeometry in XY Plane)
        const frontFaceGeo = new THREE.CircleGeometry(discRadius * 0.98, 64);
        const avatarFrontMat = new THREE.MeshStandardMaterial({
          map: avatarTex,
          transparent: true,
          roughness: 0.28,
          metalness: 0.12,
          alphaTest: 0.02
        });
        const frontFaceMesh = new THREE.Mesh(frontFaceGeo, avatarFrontMat);
        frontFaceMesh.position.z = discThickness * 0.5 + 0.005;
        avatarMasterGroup.add(frontFaceMesh);

        // 3. Back Plate (Titanium engraved backing)
        const backFaceGeo = new THREE.CircleGeometry(discRadius * 0.98, 64);
        const backFaceMesh = new THREE.Mesh(backFaceGeo, titaniumMat);
        backFaceMesh.rotation.y = Math.PI;
        backFaceMesh.position.z = -discThickness * 0.5 - 0.005;
        avatarMasterGroup.add(backFaceMesh);

        // B. Front Convex Glass Crystal Lens Dome
        // Sits over the avatar face like a luxury watch crystal / holographic capsule
        const glassDomeGeo = new THREE.SphereGeometry(discRadius * 1.01, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.20);
        const glassDomeMat = new THREE.MeshPhysicalMaterial({
          color: 0xffffff,
          roughness: 0.06,
          transmission: 0.88,
          ior: 1.48,
          transparent: true,
          opacity: 0.5,
          clearcoat: 1.0,
          clearcoatRoughness: 0.08
        });
        const glassDome = new THREE.Mesh(glassDomeGeo, glassDomeMat);
        glassDome.rotation.x = Math.PI / 2;
        glassDome.position.z = discThickness * 0.5 + 0.01;
        avatarMasterGroup.add(glassDome);

        // C. 3D Floating Metallic Spectacles Frame (Stereoscopic Parallax)
        // Replicating Sudhanshu's round black glasses in physical 3D space
        const glassesGroup = new THREE.Group();
        glassesGroup.position.set(0, 0.02, discThickness * 0.5 + 0.08);

        const glassRimMat = new THREE.MeshStandardMaterial({
          color: 0x09090b,
          roughness: 0.15,
          metalness: 0.95
        });

        const rimRadius = 0.28;
        const rimTube = 0.024;
        const leftRimGeo = new THREE.TorusGeometry(rimRadius, rimTube, 16, 32);
        const leftRim = new THREE.Mesh(leftRimGeo, glassRimMat);
        leftRim.position.x = -0.34;
        glassesGroup.add(leftRim);

        const rightRim = new THREE.Mesh(leftRimGeo, glassRimMat);
        rightRim.position.x = 0.34;
        glassesGroup.add(rightRim);

        // Center bridge
        const bridgeGeo = new THREE.CylinderGeometry(rimTube, rimTube, 0.22, 12);
        const bridge = new THREE.Mesh(bridgeGeo, glassRimMat);
        bridge.rotation.z = Math.PI / 2;
        glassesGroup.add(bridge);

        avatarMasterGroup.add(glassesGroup);

        // D. Outer Cyber Perimeter Ring (Cyan Neon Halo)
        const outerHaloGeo = new THREE.TorusGeometry(discRadius * 1.04, 0.024, 24, 80);
        const outerHaloMat = new THREE.MeshStandardMaterial({
          color: 0x00f0ff,
          emissive: 0x00f0ff,
          emissiveIntensity: 2.0,
          roughness: 0.15
        });
        const outerHalo = new THREE.Mesh(outerHaloGeo, outerHaloMat);
        outerHalo.position.z = 0;
        avatarMasterGroup.add(outerHalo);

        // E. Back Titanium Engraved Circuit Plate
        const backPlateGeo = new THREE.TorusGeometry(discRadius * 0.7, 0.018, 16, 64);
        const backPlateMat = new THREE.MeshStandardMaterial({
          color: 0x8b5cf6,
          emissive: 0x8b5cf6,
          emissiveIntensity: 1.2,
          roughness: 0.3
        });
        const backPlate = new THREE.Mesh(backPlateGeo, backPlateMat);
        backPlate.position.z = -discThickness * 0.52;
        avatarMasterGroup.add(backPlate);

        // Kick off the Cinematic GSAP Camera & Rise Timeline once avatar is loaded!
        runCinematicSequence();
      },
      undefined,
      function (err) {
        console.warn('Avatar texture load fallback', err);
        runCinematicSequence();
      }
    );

    // -------------------------------------------------------------------------
    // 6. Floating Orbital Rings Around Avatar
    // -------------------------------------------------------------------------
    const orbitalGroup = new THREE.Group();
    avatarMasterGroup.add(orbitalGroup);

    // Orbital Ring 1 (Electric Cyan - 45° Tilt)
    const orbitRing1Geo = new THREE.TorusGeometry(1.85, 0.018, 24, 100);
    const orbitRing1Mat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 2.2,
      roughness: 0.1
    });
    const orbitRing1 = new THREE.Mesh(orbitRing1Geo, orbitRing1Mat);
    orbitRing1.rotation.x = Math.PI / 3.8;
    orbitRing1.rotation.y = Math.PI / 6;
    orbitalGroup.add(orbitRing1);

    // Orbital Ring 2 (Electric Violet - Reverse Tilt)
    const orbitRing2Geo = new THREE.TorusGeometry(2.25, 0.016, 24, 100);
    const orbitRing2Mat = new THREE.MeshStandardMaterial({
      color: 0xa855f7,
      emissive: 0xa855f7,
      emissiveIntensity: 2.4,
      roughness: 0.1
    });
    const orbitRing2 = new THREE.Mesh(orbitRing2Geo, orbitRing2Mat);
    orbitRing2.rotation.x = -Math.PI / 4.2;
    orbitRing2.rotation.y = -Math.PI / 5;
    orbitalGroup.add(orbitRing2);

    // Orbital Ring 3 (Outer Delicate Data Ring)
    const orbitRing3Geo = new THREE.TorusGeometry(2.65, 0.012, 16, 100);
    const orbitRing3Mat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.5
    });
    const orbitRing3 = new THREE.Mesh(orbitRing3Geo, orbitRing3Mat);
    orbitRing3.rotation.x = Math.PI / 6;
    orbitRing3.rotation.z = Math.PI / 4;
    orbitalGroup.add(orbitRing3);

    // -------------------------------------------------------------------------
    // 7. Floating Metallic and Glass Spheres
    // -------------------------------------------------------------------------
    const spheres = [];

    // Sphere 1: Polished Mirror Chrome
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.04,
      metalness: 1.0
    });
    const sphere1 = new THREE.Mesh(new THREE.SphereGeometry(0.26, 32, 32), chromeMat);
    scene.add(sphere1);
    spheres.push({
      mesh: sphere1,
      radiusX: 2.7,
      radiusZ: 2.3,
      speed: 0.65,
      phase: 0,
      yOffset: 0.6,
      bobSpeed: 1.2
    });

    // Sphere 2: Frosted Violet Glass
    const glassSphereMat = new THREE.MeshPhysicalMaterial({
      color: 0xa855f7,
      transmission: 0.82,
      roughness: 0.18,
      ior: 1.5,
      transparent: true,
      opacity: 0.8
    });
    const sphere2 = new THREE.Mesh(new THREE.SphereGeometry(0.22, 32, 32), glassSphereMat);
    scene.add(sphere2);
    spheres.push({
      mesh: sphere2,
      radiusX: 2.4,
      radiusZ: 2.8,
      speed: -0.5,
      phase: 2.1,
      yOffset: 0.9,
      bobSpeed: 1.5
    });

    // Sphere 3: Electric Cyan Obsidian
    const cyanSphereMat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      roughness: 0.15,
      metalness: 0.85
    });
    const sphere3 = new THREE.Mesh(new THREE.SphereGeometry(0.18, 32, 32), cyanSphereMat);
    scene.add(sphere3);
    spheres.push({
      mesh: sphere3,
      radiusX: 2.9,
      radiusZ: 2.0,
      speed: 0.85,
      phase: 4.2,
      yOffset: 0.3,
      bobSpeed: 1.8
    });

    // Sphere 4: Mini Satellite Node (Electric Violet)
    const miniVioletMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      emissive: 0x8b5cf6,
      emissiveIntensity: 1.8,
      roughness: 0.1
    });
    const sphere4 = new THREE.Mesh(new THREE.SphereGeometry(0.12, 24, 24), miniVioletMat);
    scene.add(sphere4);
    spheres.push({
      mesh: sphere4,
      radiusX: 3.2,
      radiusZ: 2.5,
      speed: -0.7,
      phase: 1.1,
      yOffset: 0.2,
      bobSpeed: 2.0
    });

    // -------------------------------------------------------------------------
    // 8. Ambient Bokeh Dust Particles
    // -------------------------------------------------------------------------
    const particleCount = 180;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 8.5;
      particlePositions[i + 1] = Math.random() * 5.5 - 1.2;
      particlePositions[i + 2] = (Math.random() - 0.5) * 6.5;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.035,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.65,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // -------------------------------------------------------------------------
    // 9. Cinematic Camera Choreography & GSAP Sequence
    // -------------------------------------------------------------------------
    let hasRunCinematic = false;

    function runCinematicSequence() {
      if (hasRunCinematic) return;
      hasRunCinematic = true;

      if (window.gsap) {
        const tl = window.gsap.timeline({ defaults: { ease: 'power2.inOut' } });

        // Phase 1: Camera Dolly Forward & Platform Power-Up
        tl.to(camera.position, {
          z: 5.2,
          y: 1.1,
          duration: 3.5,
          ease: 'power3.out'
        }, 0);

        // Phase 2: Avatar Smooth Ascent from below platform
        tl.to(avatarMasterGroup.position, {
          y: 0.85,
          duration: 3.2,
          ease: 'back.out(1.2)'
        }, 0.6);

        // Platform neon ring intensity pulse
        tl.fromTo(neonRing1Mat, { emissiveIntensity: 0.5 }, { emissiveIntensity: 2.5, duration: 2.5 }, 0.2);
        tl.fromTo(neonRing2Mat, { emissiveIntensity: 0.5 }, { emissiveIntensity: 2.8, duration: 2.5 }, 0.4);
      } else {
        // Fallback without GSAP
        avatarMasterGroup.position.y = 0.85;
        camera.position.set(0, 1.1, 5.2);
      }
    }

    // -------------------------------------------------------------------------
    // 10. Mouse Interaction & Responsive Parallax
    // -------------------------------------------------------------------------
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let isDragging = false;
    let previousMouseX = 0;
    let previousMouseY = 0;
    let dragRotY = 0;
    let dragRotX = 0;

    container.addEventListener('mousemove', function (e) {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      targetX = ((mouseX / rect.width) * 2 - 1) * 0.4;
      targetY = (-(mouseY / rect.height) * 2 + 1) * 0.35;

      if (isDragging) {
        const deltaX = e.clientX - previousMouseX;
        const deltaY = e.clientY - previousMouseY;
        dragRotY += deltaX * 0.006;
        dragRotX += deltaY * 0.006;
        dragRotX = Math.max(-0.4, Math.min(0.4, dragRotX));
        previousMouseX = e.clientX;
        previousMouseY = e.clientY;
      }
    });

    container.addEventListener('mousedown', function (e) {
      isDragging = true;
      previousMouseX = e.clientX;
      previousMouseY = e.clientY;
    });

    window.addEventListener('mouseup', function () {
      isDragging = false;
    });

    container.addEventListener('mouseleave', function () {
      targetX = 0;
      targetY = 0;
      isDragging = false;
    });

    // Touch support for mobile devices
    container.addEventListener('touchmove', function (e) {
      if (e.touches.length > 0) {
        const rect = container.getBoundingClientRect();
        const touchX = e.touches[0].clientX - rect.left;
        const touchY = e.touches[0].clientY - rect.top;
        targetX = ((touchX / rect.width) * 2 - 1) * 0.35;
        targetY = (-(touchY / rect.height) * 2 + 1) * 0.3;
      }
    }, { passive: true });

    // Handle Window Resize
    function onResize() {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight || 480;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', onResize);

    // Intersection Observer to pause rendering when section is scrolled out
    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isVisible = entry.isIntersecting;
      });
    }, { threshold: 0.08 });
    observer.observe(container);

    // -------------------------------------------------------------------------
    // 11. Render Animation Loop
    // -------------------------------------------------------------------------
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      if (!isVisible) return;

      const time = clock.getElapsedTime();

      // Smooth mouse follow & drag damping (Lerp)
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      // Avatar Floating & Subtle Harmonic Breathing (Only after ascent completes)
      if (avatarMasterGroup.position.y > 0.4) {
        avatarMasterGroup.position.y = 0.85 + Math.sin(time * 1.5) * 0.08;
      }

      // Avatar gentle natural sway & mouse reactivity
      avatarMasterGroup.rotation.y = dragRotY + Math.sin(time * 0.7) * 0.12 + currentX * 0.6;
      avatarMasterGroup.rotation.x = dragRotX + Math.sin(time * 0.9) * 0.05 - currentY * 0.4;
      avatarMasterGroup.rotation.z = -Math.sin(time * 0.6) * 0.03;

      // Orbital Rings Rotation with unique precessions
      orbitRing1.rotation.z += 0.007;
      orbitRing1.rotation.y += 0.004;

      orbitRing2.rotation.z -= 0.006;
      orbitRing2.rotation.x -= 0.005;

      orbitRing3.rotation.z += 0.004;

      // Volumetric beam gentle pulse
      lightBeam.rotation.y += 0.002;
      beamMat.opacity = 0.04 + Math.sin(time * 2.0) * 0.015;

      // Floating spheres orbit calculation
      spheres.forEach((s) => {
        const theta = time * s.speed + s.phase;
        s.mesh.position.x = Math.cos(theta) * s.radiusX;
        s.mesh.position.z = Math.sin(theta) * s.radiusZ;
        s.mesh.position.y = s.yOffset + Math.sin(time * s.bobSpeed + s.phase) * 0.22;
      });

      // Drifting Bokeh Particles upward motion
      const positions = particleGeo.attributes.position.array;
      for (let i = 1; i < particleCount * 3; i += 3) {
        positions[i] += 0.003;
        if (positions[i] > 4.2) {
          positions[i] = -1.2;
        }
      }
      particleGeo.attributes.position.needsUpdate = true;

      // Platform neon rings subtle breathing pulse
      neonRing1Mat.emissiveIntensity = 2.0 + Math.sin(time * 2.2) * 0.4;
      neonRing2Mat.emissiveIntensity = 2.2 + Math.cos(time * 2.0) * 0.5;

      // Camera gentle dynamic drift
      camera.position.x = currentX * 0.8;
      camera.lookAt(0, 0.7, 0);

      renderer.render(scene, camera);
    }

    animate();
  }

  // Auto-init on DOM Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCinematicHero);
  } else {
    initCinematicHero();
  }
})();
