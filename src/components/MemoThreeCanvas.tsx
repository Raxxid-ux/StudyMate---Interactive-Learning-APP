/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Memo 3D Character Experience - Three.js
 * A cute white minimal pen with green-to-blue futuristic lighting headgear.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { playCalmChime, playSoftTap } from '../utils/audioChimes';

export type MemoMood = 'idle' | 'thinking' | 'happy' | 'explaining';

interface MemoThreeCanvasProps {
  mood?: MemoMood;
  interactive?: boolean;
  className?: string;
  size?: 'compact' | 'medium' | 'large' | 'hero';
  showControlsOverlay?: boolean;
  onMemoClick?: () => void;
  soundEnabled?: boolean;
  customColorPreset?: 'aurora' | 'cyan' | 'lime' | 'twilight';
}

export const MemoThreeCanvas: React.FC<MemoThreeCanvasProps> = ({
  mood = 'idle',
  interactive = true,
  className = '',
  size = 'medium',
  showControlsOverlay = false,
  onMemoClick,
  soundEnabled = true,
  customColorPreset = 'aurora',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  // References across render loop
  const stateRef = useRef({
    mood,
    customColorPreset,
    isHovered: false,
    spinVelocity: 0,
    jumpOffset: 0,
    jumpVelocity: 0,
    blinkTimer: 0,
    isBlinking: false,
    mouseX: 0,
    mouseY: 0,
    targetRotX: 0,
    targetRotY: 0,
  });

  stateRef.current.mood = mood;
  stateRef.current.customColorPreset = customColorPreset;
  stateRef.current.isHovered = isHovered;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // SCENE SETUP
    const scene = new THREE.Scene();

    // CAMERA SETUP
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 5.2);

    // RENDERER SETUP
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // PROCEDURAL DIGITAL VISOR FACE TEXTURE
    const faceCanvas = document.createElement('canvas');
    faceCanvas.width = 512;
    faceCanvas.height = 256;
    const faceCtx = faceCanvas.getContext('2d')!;

    const faceTexture = new THREE.CanvasTexture(faceCanvas);
    faceTexture.colorSpace = THREE.SRGBColorSpace;

    function drawFace(currentMood: MemoMood, isBlinking: boolean, time: number) {
      faceCtx.clearRect(0, 0, 512, 256);

      // Deep dark sleek visor glass gradient backing
      const bgGrad = faceCtx.createLinearGradient(0, 0, 512, 256);
      bgGrad.addColorStop(0, '#09101b');
      bgGrad.addColorStop(1, '#0e1828');
      faceCtx.fillStyle = bgGrad;
      faceCtx.fillRect(0, 0, 512, 256);

      // Cute futuristic neon glow line
      faceCtx.strokeStyle = 'rgba(43, 168, 240, 0.25)';
      faceCtx.lineWidth = 4;
      faceCtx.beginPath();
      faceCtx.moveTo(40, 40);
      faceCtx.lineTo(472, 40);
      faceCtx.stroke();

      // Eye style selection
      faceCtx.lineWidth = 14;
      faceCtx.lineCap = 'round';
      faceCtx.lineJoin = 'round';

      // Futuristic glow styling: cyan to neon lime gradient
      const eyeGrad = faceCtx.createLinearGradient(120, 100, 390, 160);
      eyeGrad.addColorStop(0, '#2BA8F0');
      eyeGrad.addColorStop(0.5, '#22D08B');
      eyeGrad.addColorStop(1, '#7FDB22');
      faceCtx.strokeStyle = eyeGrad;
      faceCtx.shadowColor = '#22D08B';
      faceCtx.shadowBlur = 18;

      if (isBlinking) {
        // Blinking flat resting lines
        faceCtx.beginPath();
        faceCtx.moveTo(150, 130);
        faceCtx.lineTo(210, 130);
        faceCtx.stroke();

        faceCtx.beginPath();
        faceCtx.moveTo(300, 130);
        faceCtx.lineTo(360, 130);
        faceCtx.stroke();
      } else if (currentMood === 'happy') {
        // Super cute curved upward crescent eyes ( ^ _ ^ )
        faceCtx.beginPath();
        faceCtx.arc(180, 140, 30, Math.PI * 1.1, Math.PI * 1.9, false);
        faceCtx.stroke();

        faceCtx.beginPath();
        faceCtx.arc(330, 140, 30, Math.PI * 1.1, Math.PI * 1.9, false);
        faceCtx.stroke();

        // Cheerful pinkish-cyan blush spots
        faceCtx.fillStyle = 'rgba(43, 168, 240, 0.4)';
        faceCtx.beginPath();
        faceCtx.ellipse(140, 175, 18, 9, 0, 0, Math.PI * 2);
        faceCtx.fill();
        faceCtx.beginPath();
        faceCtx.ellipse(370, 175, 18, 9, 0, 0, Math.PI * 2);
        faceCtx.fill();
      } else if (currentMood === 'thinking') {
        // Curious thinking wave: one high eye, one pulse dot, oscillating
        const wave = Math.sin(time * 6) * 12;
        faceCtx.beginPath();
        faceCtx.arc(180, 130 + wave, 18, 0, Math.PI * 2);
        faceCtx.fillStyle = eyeGrad;
        faceCtx.fill();

        faceCtx.beginPath();
        faceCtx.arc(330, 130 - wave, 18, 0, Math.PI * 2);
        faceCtx.fill();

        // Thinking futuristic scanner beam
        faceCtx.strokeStyle = 'rgba(127, 219, 34, 0.7)';
        faceCtx.lineWidth = 3;
        const scanX = 180 + (Math.sin(time * 4) + 1) * 75;
        faceCtx.beginPath();
        faceCtx.moveTo(scanX, 80);
        faceCtx.lineTo(scanX, 190);
        faceCtx.stroke();
      } else {
        // Standard cute open wide expressive eyes with soft top arc
        faceCtx.beginPath();
        faceCtx.ellipse(180, 130, 22, 28, 0, 0, Math.PI * 2);
        faceCtx.fillStyle = eyeGrad;
        faceCtx.fill();

        faceCtx.beginPath();
        faceCtx.ellipse(330, 130, 22, 28, 0, 0, Math.PI * 2);
        faceCtx.fill();

        // White inner highlight sparks
        faceCtx.fillStyle = '#ffffff';
        faceCtx.shadowBlur = 0;
        faceCtx.beginPath();
        faceCtx.arc(188, 120, 8, 0, Math.PI * 2);
        faceCtx.fill();
        faceCtx.beginPath();
        faceCtx.arc(338, 120, 8, 0, Math.PI * 2);
        faceCtx.fill();
      }

      faceTexture.needsUpdate = true;
    }

    // MEMO 3D OBJECT - ROOT GROUP
    const memoRoot = new THREE.Group();
    scene.add(memoRoot);

    // 1. Sleek white ceramic pen barrel (primary silhouette)
    const barrelGeo = new THREE.CylinderGeometry(0.36, 0.38, 2.3, 36);
    const whiteMat = new THREE.MeshStandardMaterial({
      color: 0xf7f9fc,
      roughness: 0.22,
      metalness: 0.04,
    });
    const barrel = new THREE.Mesh(barrelGeo, whiteMat);
    barrel.position.y = 0.2;
    memoRoot.add(barrel);

    // 2. Lower grip taper section
    const gripGeo = new THREE.CylinderGeometry(0.38, 0.26, 0.7, 36);
    const gripMat = new THREE.MeshStandardMaterial({
      color: 0xedf1f7,
      roughness: 0.35,
      metalness: 0.05,
    });
    const grip = new THREE.Mesh(gripGeo, gripMat);
    grip.position.y = -1.2;
    memoRoot.add(grip);

    // 3. Polished chrome silver trim collar ring
    const collarGeo = new THREE.CylinderGeometry(0.27, 0.27, 0.08, 36);
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xd6deeb,
      metalness: 0.88,
      roughness: 0.16,
    });
    const collar = new THREE.Mesh(collarGeo, chromeMat);
    collar.position.y = -1.58;
    memoRoot.add(collar);

    // 4. Fine silver stylus nib
    const nibGeo = new THREE.ConeGeometry(0.25, 0.6, 36);
    const nib = new THREE.Mesh(nibGeo, chromeMat);
    nib.rotation.x = Math.PI;
    nib.position.y = -1.9;
    memoRoot.add(nib);

    // Nib tip contact sphere
    const nibTipGeo = new THREE.SphereGeometry(0.06, 16, 16);
    const nibTip = new THREE.Mesh(nibTipGeo, chromeMat);
    nibTip.position.y = -2.2;
    memoRoot.add(nibTip);

    // 5. Crown dome cap
    const crownGeo = new THREE.SphereGeometry(0.36, 36, 18, 0, Math.PI * 2, 0, Math.PI * 0.5);
    const crown = new THREE.Mesh(crownGeo, whiteMat);
    crown.position.y = 1.35;
    memoRoot.add(crown);

    // 6. Sleek pocket clip on the back
    const clipGeo = new THREE.BoxGeometry(0.08, 1.3, 0.12);
    const clip = new THREE.Mesh(clipGeo, chromeMat);
    clip.position.set(0, 0.55, -0.42);
    clip.rotation.x = 0.04;
    memoRoot.add(clip);

    // 7. FUTURISTIC LIGHTING HEADGEAR: Halo ring with green-to-blue glow
    const headgearRingGeo = new THREE.TorusGeometry(0.56, 0.06, 20, 60);
    const neonHeadgearMat = new THREE.MeshStandardMaterial({
      color: 0x22d08b,
      emissive: 0x22d08b,
      emissiveIntensity: 2.2,
      roughness: 0.1,
      metalness: 0.4,
    });
    const headgearRing = new THREE.Mesh(headgearRingGeo, neonHeadgearMat);
    headgearRing.rotation.x = Math.PI / 2.2;
    headgearRing.position.set(0, 1.05, 0.05);
    memoRoot.add(headgearRing);

    // Secondary floating satellite halo ring
    const outerHaloGeo = new THREE.TorusGeometry(0.68, 0.02, 16, 48);
    const outerHaloMat = new THREE.MeshStandardMaterial({
      color: 0x2ba8f0,
      emissive: 0x2ba8f0,
      emissiveIntensity: 1.8,
      transparent: true,
      opacity: 0.75,
    });
    const outerHalo = new THREE.Mesh(outerHaloGeo, outerHaloMat);
    outerHalo.rotation.x = Math.PI / 2.5;
    outerHalo.position.set(0, 1.12, 0.05);
    memoRoot.add(outerHalo);

    // 8. Visor Shield with Digital Face Display
    const visorGeo = new THREE.CylinderGeometry(
      0.39,
      0.39,
      0.72,
      36,
      1,
      true,
      -Math.PI / 2.2,
      Math.PI / 1.1
    );
    const visorMat = new THREE.MeshBasicMaterial({
      map: faceTexture,
      transparent: true,
      opacity: 0.96,
      side: THREE.DoubleSide,
    });
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 0.88, 0.02);
    memoRoot.add(visor);

    // 9. Crown antenna beacon
    const beaconPostGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.35, 16);
    const beaconPost = new THREE.Mesh(beaconPostGeo, chromeMat);
    beaconPost.position.y = 1.62;
    memoRoot.add(beaconPost);

    const beaconOrbGeo = new THREE.SphereGeometry(0.1, 20, 20);
    const beaconOrbMat = new THREE.MeshStandardMaterial({
      color: 0x7fdb22,
      emissive: 0x7fdb22,
      emissiveIntensity: 2.5,
    });
    const beaconOrb = new THREE.Mesh(beaconOrbGeo, beaconOrbMat);
    beaconOrb.position.y = 1.8;
    memoRoot.add(beaconOrb);

    // 10. PARTICLE AURA: Gentle floating light motes orbiting Memo
    const particleCount = 28;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);
    const particleRadii = new Float32Array(particleCount);
    const particleHeights = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      const radius = 0.8 + Math.random() * 0.9;
      const angle = Math.random() * Math.PI * 2;
      const height = -1.2 + Math.random() * 3.0;

      particlePositions[i * 3] = Math.cos(angle) * radius;
      particlePositions[i * 3 + 1] = height;
      particlePositions[i * 3 + 2] = Math.sin(angle) * radius;

      particleRadii[i] = radius;
      particleSpeeds[i] = 0.4 + Math.random() * 0.8;
      particleHeights[i] = height;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Particle sprite using procedural canvas texture
    const pCanvas = document.createElement('canvas');
    pCanvas.width = 64;
    pCanvas.height = 64;
    const pCtx = pCanvas.getContext('2d')!;
    const pGrad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    pGrad.addColorStop(0, 'rgba(127, 219, 34, 1)');
    pGrad.addColorStop(0.4, 'rgba(43, 168, 240, 0.7)');
    pGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    pCtx.fillStyle = pGrad;
    pCtx.fillRect(0, 0, 64, 64);

    const pTexture = new THREE.CanvasTexture(pCanvas);
    const particleMat = new THREE.PointsMaterial({
      size: 0.16,
      map: pTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    memoRoot.add(particles);

    // LIGHTING RIG
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    mainKeyLight.position.set(3, 4, 4);
    scene.add(mainKeyLight);

    const softFillLight = new THREE.DirectionalLight(0xdfe7f5, 0.6);
    softFillLight.position.set(-3, 1, 2);
    scene.add(softFillLight);

    // Glowing futuristic lights attached to headgear
    const headCyanLight = new THREE.PointLight(0x2ba8f0, 2.0, 4.5);
    headCyanLight.position.set(-0.6, 1.2, 0.8);
    memoRoot.add(headCyanLight);

    const headLimeLight = new THREE.PointLight(0x22d08b, 2.2, 4.5);
    headLimeLight.position.set(0.6, 1.2, 0.8);
    memoRoot.add(headLimeLight);

    // INTERACTION HANDLERS
    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      stateRef.current.mouseX = x;
      stateRef.current.mouseY = y;
    };

    const handlePointerLeave = () => {
      stateRef.current.mouseX = 0;
      stateRef.current.mouseY = 0;
    };

    if (interactive) {
      container.addEventListener('mousemove', handlePointerMove);
      container.addEventListener('mouseleave', handlePointerLeave);
    }

    // ANIMATION LOOP
    let animId: number;
    const startTime = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = (performance.now() - startTime) / 1000;
      const st = stateRef.current;

      // 1. Blinking and Face update
      st.blinkTimer += 0.016;
      if (st.blinkTimer > 3.6) {
        st.isBlinking = true;
        if (st.blinkTimer > 3.75) {
          st.isBlinking = false;
          st.blinkTimer = Math.random() * 0.8;
        }
      }
      drawFace(st.mood, st.isBlinking, elapsedTime);

      // 2. Idle hover floating
      const floatAmp = st.mood === 'thinking' ? 0.04 : 0.09;
      const floatSpeed = st.mood === 'thinking' ? 3.5 : 2.0;
      const hoverY = Math.sin(elapsedTime * floatSpeed) * floatAmp;

      // 3. Spin & Jump physics
      if (st.spinVelocity > 0.001) {
        memoRoot.rotation.y += st.spinVelocity;
        st.spinVelocity *= 0.94;
      }
      if (st.jumpVelocity !== 0 || st.jumpOffset > 0) {
        st.jumpOffset += st.jumpVelocity;
        st.jumpVelocity -= 0.018; // gravity
        if (st.jumpOffset <= 0) {
          st.jumpOffset = 0;
          st.jumpVelocity = 0;
        }
      }

      memoRoot.position.y = hoverY + st.jumpOffset;

      // 4. Subtle mouse head tracking (smooth lerp)
      const targetYRot = (st.mouseX * 0.45) + (Math.sin(elapsedTime * 0.7) * 0.08);
      const targetXRot = (-st.mouseY * 0.25) + (Math.cos(elapsedTime * 0.9) * 0.05);

      if (st.spinVelocity <= 0.05) {
        memoRoot.rotation.y = THREE.MathUtils.lerp(memoRoot.rotation.y, targetYRot, 0.06);
      }
      memoRoot.rotation.x = THREE.MathUtils.lerp(memoRoot.rotation.x, targetXRot, 0.06);
      memoRoot.rotation.z = Math.sin(elapsedTime * 1.5) * 0.03;

      // 5. Headgear futuristic ring animations
      headgearRing.rotation.z = elapsedTime * 0.4;
      outerHalo.rotation.z = -elapsedTime * 0.7;

      // 6. Dynamic light pulsing based on mood
      const pulseSpeed = st.mood === 'thinking' ? 9.0 : 2.8;
      const lightPulse = 1.6 + Math.sin(elapsedTime * pulseSpeed) * 0.8;
      headCyanLight.intensity = lightPulse;
      headLimeLight.intensity = lightPulse * 1.1;

      // Update color preset if modified
      if (st.customColorPreset === 'cyan') {
        neonHeadgearMat.color.setHex(0x2ba8f0);
        neonHeadgearMat.emissive.setHex(0x2ba8f0);
      } else if (st.customColorPreset === 'lime') {
        neonHeadgearMat.color.setHex(0x7fdb22);
        neonHeadgearMat.emissive.setHex(0x7fdb22);
      } else {
        // Aurora gradient oscillation
        const colOsc = (Math.sin(elapsedTime * 1.2) + 1) * 0.5;
        neonHeadgearMat.color.lerpColors(
          new THREE.Color(0x2ba8f0),
          new THREE.Color(0x22d08b),
          colOsc
        );
        neonHeadgearMat.emissive.copy(neonHeadgearMat.color);
      }

      // 7. Particle aura motion
      const positions = particleGeo.attributes.position.array as Float32Array;
      const pSpeedMult = st.mood === 'thinking' ? 2.2 : 1.0;
      for (let i = 0; i < particleCount; i++) {
        const radius = particleRadii[i];
        const angle = elapsedTime * particleSpeeds[i] * pSpeedMult + i;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = particleHeights[i] + Math.sin(elapsedTime * 1.5 + i) * 0.2;
        positions[i * 3 + 2] = Math.sin(angle) * radius;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // RESIZE OBSERVER
    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      if (newW > 0 && newH > 0) {
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer.setSize(newW, newH);
      }
    });
    resizeObserver.observe(container);

    // CLEANUP
    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      if (interactive) {
        container.removeEventListener('mousemove', handlePointerMove);
        container.removeEventListener('mouseleave', handlePointerLeave);
      }

      // Dispose Three.js objects
      barrelGeo.dispose();
      whiteMat.dispose();
      gripGeo.dispose();
      gripMat.dispose();
      collarGeo.dispose();
      chromeMat.dispose();
      nibGeo.dispose();
      nibTipGeo.dispose();
      crownGeo.dispose();
      clipGeo.dispose();
      headgearRingGeo.dispose();
      neonHeadgearMat.dispose();
      outerHaloGeo.dispose();
      outerHaloMat.dispose();
      visorGeo.dispose();
      visorMat.dispose();
      beaconPostGeo.dispose();
      beaconOrbGeo.dispose();
      beaconOrbMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      faceTexture.dispose();
      pTexture.dispose();

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [interactive]);

  // Click interaction: spin, jump and chime
  const handleClick = () => {
    stateRef.current.spinVelocity = 0.32;
    stateRef.current.jumpVelocity = 0.16;
    setClickCount((c) => c + 1);
    playCalmChime(soundEnabled);
    if (onMemoClick) {
      onMemoClick();
    }
  };

  const getDimensions = () => {
    switch (size) {
      case 'compact':
        return 'w-24 h-24';
      case 'medium':
        return 'w-48 h-48';
      case 'large':
        return 'w-72 h-72';
      case 'hero':
        return 'w-full h-80 max-h-[380px]';
      default:
        return 'w-48 h-48';
    }
  };

  return (
    <div
      className={`relative select-none flex items-center justify-center ${getDimensions()} ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        ref={containerRef}
        onClick={handleClick}
        className="w-full h-full cursor-pointer relative"
        title="Tap Memo to interact or ask a question!"
      />

      {showControlsOverlay && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full shadow-sm text-xs font-medium text-slate-600 dark:text-slate-300 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-[#22D08B] animate-pulse" />
          <span>Interactive 3D Stylus</span>
        </div>
      )}
    </div>
  );
};
