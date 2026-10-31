/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Memo 3D Character Experience - Three.js
 * A cute white minimal stylus companion with futuristic lighting headgear,
 * featuring a special Halloween theme with a sculpted 3D witch hat,
 * vampire teeth, and spooky pumpkin-violet ambiance.
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { playCalmChime, playSoftTap } from '../utils/audioChimes';

export type MemoMood = 'idle' | 'thinking' | 'happy' | 'explaining' | 'scholar' | 'celebrate' | 'cheer' | 'focus';
export type MemoColorPreset = 'aurora' | 'cyan' | 'lime' | 'twilight' | 'halloween' | 'scholar-gold';

interface MemoThreeCanvasProps {
  mood?: MemoMood;
  interactive?: boolean;
  className?: string;
  size?: 'compact' | 'medium' | 'large' | 'hero';
  showControlsOverlay?: boolean;
  onMemoClick?: () => void;
  soundEnabled?: boolean;
  customColorPreset?: MemoColorPreset;
  halloweenTheme?: boolean;
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
  halloweenTheme = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [webglSupported, setWebglSupported] = useState(true);

  // References across render loop
  const stateRef = useRef({
    mood,
    customColorPreset,
    halloweenTheme,
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
  stateRef.current.halloweenTheme = halloweenTheme;
  stateRef.current.isHovered = isHovered;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // RENDERER SETUP WITH SAFE FALLBACK
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (err) {
      console.warn('WebGL initialization failed, falling back to 2.5D animated vector Memo', err);
      setWebglSupported(false);
      return;
    }

    // SCENE SETUP
    const scene = new THREE.Scene();

    // CAMERA SETUP
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 300;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.4, 5.2);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    // Initial resize sync on next frame
    const syncRaf = requestAnimationFrame(() => {
      if (container && container.clientWidth > 0 && container.clientHeight > 0) {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
      }
    });

    // PROCEDURAL DIGITAL VISOR FACE TEXTURE
    const faceCanvas = document.createElement('canvas');
    faceCanvas.width = 512;
    faceCanvas.height = 256;
    const faceCtx = faceCanvas.getContext('2d')!;

    const faceTexture = new THREE.CanvasTexture(faceCanvas);
    faceTexture.colorSpace = THREE.SRGBColorSpace;

    function drawFace(currentMood: MemoMood, isBlinking: boolean, time: number, isHalloween: boolean) {
      faceCtx.clearRect(0, 0, 512, 256);

      // Deep dark sleek visor glass gradient backing
      const bgGrad = faceCtx.createLinearGradient(0, 0, 512, 256);
      if (isHalloween) {
        bgGrad.addColorStop(0, '#120b1c');
        bgGrad.addColorStop(1, '#1e112a');
      } else {
        bgGrad.addColorStop(0, '#09101b');
        bgGrad.addColorStop(1, '#0e1828');
      }
      faceCtx.fillStyle = bgGrad;
      faceCtx.fillRect(0, 0, 512, 256);

      // Cute futuristic neon glow line
      faceCtx.strokeStyle = isHalloween ? 'rgba(255, 107, 0, 0.35)' : 'rgba(43, 168, 240, 0.25)';
      faceCtx.lineWidth = 4;
      faceCtx.beginPath();
      faceCtx.moveTo(40, 40);
      faceCtx.lineTo(472, 40);
      faceCtx.stroke();

      // Eye style selection
      faceCtx.lineWidth = 14;
      faceCtx.lineCap = 'round';
      faceCtx.lineJoin = 'round';

      // Eye gradient (Halloween gets vibrant pumpkin orange & mystic purple gradient)
      const eyeGrad = faceCtx.createLinearGradient(120, 100, 390, 160);
      if (isHalloween) {
        eyeGrad.addColorStop(0, '#FF6B00');
        eyeGrad.addColorStop(0.5, '#FFA726');
        eyeGrad.addColorStop(1, '#C026D3');
        faceCtx.strokeStyle = eyeGrad;
        faceCtx.shadowColor = '#FF6B00';
        faceCtx.shadowBlur = 18;
      } else {
        eyeGrad.addColorStop(0, '#2BA8F0');
        eyeGrad.addColorStop(0.5, '#22D08B');
        eyeGrad.addColorStop(1, '#7FDB22');
        faceCtx.strokeStyle = eyeGrad;
        faceCtx.shadowColor = '#22D08B';
        faceCtx.shadowBlur = 18;
      }

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

        // Cheerful blush spots
        faceCtx.fillStyle = isHalloween ? 'rgba(255, 107, 0, 0.45)' : 'rgba(43, 168, 240, 0.4)';
        faceCtx.beginPath();
        faceCtx.ellipse(140, 175, 18, 9, 0, 0, Math.PI * 2);
        faceCtx.fill();
        faceCtx.beginPath();
        faceCtx.ellipse(370, 175, 18, 9, 0, 0, Math.PI * 2);
        faceCtx.fill();
      } else if (currentMood === 'scholar') {
        // Scholar Mode: Elegant round reading spectacles with attentive studious eyes
        faceCtx.beginPath();
        faceCtx.ellipse(180, 130, 20, 24, 0, 0, Math.PI * 2);
        faceCtx.fillStyle = eyeGrad;
        faceCtx.fill();

        faceCtx.beginPath();
        faceCtx.ellipse(330, 130, 20, 24, 0, 0, Math.PI * 2);
        faceCtx.fill();

        // Round wireframe reading glasses
        faceCtx.strokeStyle = '#D4AF37';
        faceCtx.lineWidth = 5;
        faceCtx.beginPath();
        faceCtx.arc(180, 130, 38, 0, Math.PI * 2);
        faceCtx.stroke();

        faceCtx.beginPath();
        faceCtx.arc(330, 130, 38, 0, Math.PI * 2);
        faceCtx.stroke();

        // Spectacles bridge wire
        faceCtx.beginPath();
        faceCtx.moveTo(218, 126);
        faceCtx.quadraticCurveTo(255, 116, 292, 126);
        faceCtx.stroke();
      } else if (currentMood === 'celebrate') {
        // Celebration: Star-burst eyes with joyful gold aura!
        const drawStar = (cx: number, cy: number, r: number) => {
          faceCtx.fillStyle = '#FFD700';
          faceCtx.shadowColor = '#FFA500';
          faceCtx.shadowBlur = 16;
          faceCtx.beginPath();
          faceCtx.moveTo(cx, cy - r);
          faceCtx.quadraticCurveTo(cx, cy, cx + r, cy);
          faceCtx.quadraticCurveTo(cx, cy, cx, cy + r);
          faceCtx.quadraticCurveTo(cx, cy, cx - r, cy);
          faceCtx.quadraticCurveTo(cx, cy, cx, cy - r);
          faceCtx.fill();
        };
        drawStar(180, 130, 28);
        drawStar(330, 130, 28);

        // Cheerful rainbow blush
        faceCtx.fillStyle = 'rgba(255, 180, 50, 0.5)';
        faceCtx.beginPath();
        faceCtx.ellipse(135, 175, 18, 8, 0, 0, Math.PI * 2);
        faceCtx.fill();
        faceCtx.beginPath();
        faceCtx.ellipse(375, 175, 18, 8, 0, 0, Math.PI * 2);
        faceCtx.fill();
      } else if (currentMood === 'cheer') {
        // Cheering: One winking eye, one star eye with smile
        faceCtx.beginPath();
        faceCtx.arc(180, 135, 24, Math.PI * 0.1, Math.PI * 0.9, false);
        faceCtx.strokeStyle = eyeGrad;
        faceCtx.lineWidth = 10;
        faceCtx.stroke();

        faceCtx.beginPath();
        faceCtx.ellipse(330, 130, 22, 26, 0, 0, Math.PI * 2);
        faceCtx.fillStyle = eyeGrad;
        faceCtx.fill();
      } else if (currentMood === 'focus') {
        // Deep Focus: Sleek horizontal cognitive flow lines
        faceCtx.strokeStyle = eyeGrad;
        faceCtx.lineWidth = 10;
        faceCtx.beginPath();
        faceCtx.moveTo(145, 135);
        faceCtx.lineTo(215, 135);
        faceCtx.stroke();

        faceCtx.beginPath();
        faceCtx.moveTo(295, 135);
        faceCtx.lineTo(365, 135);
        faceCtx.stroke();

        // Pulsing cognitive center core
        const coreOsc = (Math.sin(time * 3) + 1) * 0.5;
        faceCtx.fillStyle = `rgba(34, 208, 139, ${0.4 + coreOsc * 0.5})`;
        faceCtx.beginPath();
        faceCtx.arc(255, 135, 8 + coreOsc * 6, 0, Math.PI * 2);
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
        faceCtx.strokeStyle = isHalloween ? 'rgba(255, 167, 38, 0.75)' : 'rgba(127, 219, 34, 0.7)';
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

      // HALLOWEEN VAMPIRE TEETH ON VISOR
      if (isHalloween) {
        faceCtx.save();
        faceCtx.lineWidth = 3.5;
        faceCtx.strokeStyle = 'rgba(255, 255, 255, 0.95)';
        faceCtx.fillStyle = '#FFFFFF';
        faceCtx.shadowColor = '#FF6B00';
        faceCtx.shadowBlur = 12;

        // Cute mischievous smile mouth line
        faceCtx.beginPath();
        faceCtx.arc(256, 165, 30, 0.16 * Math.PI, 0.84 * Math.PI, false);
        faceCtx.stroke();

        // Left vampire fang
        faceCtx.beginPath();
        faceCtx.moveTo(234, 172);
        faceCtx.lineTo(246, 172);
        faceCtx.lineTo(240, 202);
        faceCtx.closePath();
        faceCtx.fill();
        faceCtx.stroke();

        // Right vampire fang
        faceCtx.beginPath();
        faceCtx.moveTo(266, 172);
        faceCtx.lineTo(278, 172);
        faceCtx.lineTo(272, 202);
        faceCtx.closePath();
        faceCtx.fill();
        faceCtx.stroke();

        faceCtx.restore();
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

    // 7. FUTURISTIC LIGHTING HEADGEAR: Halo ring with glow
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

    // 9. Standard crown antenna beacon (hidden when wearing witch hat)
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

    // ==========================================
    // HALLOWEEN ASSET 1: 3D WITCH HAT
    // ==========================================
    const witchHatGroup = new THREE.Group();
    witchHatGroup.position.set(0, 1.44, 0.02);
    memoRoot.add(witchHatGroup);

    // Witch hat velvet dark material
    const witchHatMat = new THREE.MeshStandardMaterial({
      color: 0x1c1328,
      roughness: 0.65,
      metalness: 0.12,
    });

    // Witch hat wide brim
    const brimGeo = new THREE.CylinderGeometry(0.74, 0.82, 0.04, 40);
    const brim = new THREE.Mesh(brimGeo, witchHatMat);
    brim.rotation.x = -0.06;
    brim.rotation.z = -0.05;
    witchHatGroup.add(brim);

    // Witch hat base cone
    const hatBaseGeo = new THREE.ConeGeometry(0.44, 0.72, 36);
    const hatBase = new THREE.Mesh(hatBaseGeo, witchHatMat);
    hatBase.position.y = 0.36;
    witchHatGroup.add(hatBase);

    // Witch hat bent crooked tip (iconic stylish witch silhouette)
    const hatTipGeo = new THREE.ConeGeometry(0.22, 0.46, 28);
    const hatTip = new THREE.Mesh(hatTipGeo, witchHatMat);
    hatTip.position.set(-0.04, 0.82, -0.04);
    hatTip.rotation.z = -0.28;
    hatTip.rotation.x = -0.18;
    witchHatGroup.add(hatTip);

    // Tip golden charm orb
    const hatCharmGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.25,
      metalness: 0.85,
      emissive: 0xd97706,
      emissiveIntensity: 0.3,
    });
    const hatCharm = new THREE.Mesh(hatCharmGeo, goldMat);
    hatCharm.position.set(-0.16, 1.04, -0.12);
    witchHatGroup.add(hatCharm);

    // Witch hat ribbon band (vibrant pumpkin orange with subtle glow)
    const ribbonGeo = new THREE.CylinderGeometry(0.45, 0.46, 0.11, 36);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xff6b00,
      emissive: 0xff6b00,
      emissiveIntensity: 0.6,
      roughness: 0.35,
    });
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
    ribbon.position.y = 0.08;
    witchHatGroup.add(ribbon);

    // Golden witch buckle
    const buckleOuterGeo = new THREE.BoxGeometry(0.16, 0.13, 0.04);
    const buckleOuter = new THREE.Mesh(buckleOuterGeo, goldMat);
    buckleOuter.position.set(0, 0.08, 0.455);
    witchHatGroup.add(buckleOuter);

    const buckleInnerGeo = new THREE.BoxGeometry(0.09, 0.07, 0.045);
    const buckleInner = new THREE.Mesh(buckleInnerGeo, witchHatMat);
    buckleInner.position.set(0, 0.08, 0.456);
    witchHatGroup.add(buckleInner);

    // ==========================================
    // HALLOWEEN ASSET 2: 3D SCULPTED VAMPIRE TEETH
    // ==========================================
    const fangsGroup = new THREE.Group();
    memoRoot.add(fangsGroup);

    // Pearlescent white enamel material for vampire fangs
    const fangMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.12,
      metalness: 0.08,
      emissive: 0xfff3ea,
      emissiveIntensity: 0.2,
    });

    // Left sharp 3D vampire fang
    const leftFangGeo = new THREE.ConeGeometry(0.042, 0.13, 16);
    const leftFang = new THREE.Mesh(leftFangGeo, fangMat);
    leftFang.rotation.x = Math.PI;
    leftFang.position.set(-0.09, 0.62, 0.41);
    fangsGroup.add(leftFang);

    // Right sharp 3D vampire fang
    const rightFangGeo = new THREE.ConeGeometry(0.042, 0.13, 16);
    const rightFang = new THREE.Mesh(rightFangGeo, fangMat);
    rightFang.rotation.x = Math.PI;
    rightFang.position.set(0.09, 0.62, 0.41);
    fangsGroup.add(rightFang);

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
    pGrad.addColorStop(0, 'rgba(255, 107, 0, 1)');
    pGrad.addColorStop(0.4, 'rgba(192, 38, 211, 0.7)');
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
      const isHalloween = Boolean(st.halloweenTheme || st.customColorPreset === 'halloween');

      // Halloween Assets Visibility Toggle
      witchHatGroup.visible = isHalloween;
      fangsGroup.visible = isHalloween;
      beaconPost.visible = !isHalloween;
      beaconOrb.visible = !isHalloween;

      // 1. Blinking and Face update with Halloween Vampire Teeth
      st.blinkTimer += 0.016;
      if (st.blinkTimer > 3.6) {
        st.isBlinking = true;
        if (st.blinkTimer > 3.75) {
          st.isBlinking = false;
          st.blinkTimer = Math.random() * 0.8;
        }
      }
      drawFace(st.mood, st.isBlinking, elapsedTime, isHalloween);

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

      // 4. Subtle mouse head tracking (smooth lerp) & expressive mood poses
      let targetYRot = st.mouseX * 0.45 + Math.sin(elapsedTime * 0.7) * 0.08;
      let targetXRot = -st.mouseY * 0.25 + Math.cos(elapsedTime * 0.9) * 0.05;

      if (st.mood === 'scholar') {
        targetXRot += 0.25; // Scholar studious downward inspection angle
        targetYRot += Math.sin(elapsedTime * 1.2) * 0.12;
      } else if (st.mood === 'cheer') {
        memoRoot.rotation.z = Math.sin(elapsedTime * 5.5) * 0.15; // Upbeat cheering wave
      } else if (st.mood === 'celebrate') {
        if (st.spinVelocity < 0.08) st.spinVelocity = 0.28; // Celebration spin
      } else if (st.mood === 'focus') {
        const breath = 1 + Math.sin(elapsedTime * 1.5) * 0.035; // Breathing focus expansion
        memoRoot.scale.set(breath, breath, breath);
      }

      if (st.spinVelocity <= 0.05) {
        memoRoot.rotation.y = THREE.MathUtils.lerp(memoRoot.rotation.y, targetYRot, 0.06);
      }
      memoRoot.rotation.x = THREE.MathUtils.lerp(memoRoot.rotation.x, targetXRot, 0.06);
      if (st.mood !== 'cheer') {
        memoRoot.rotation.z = Math.sin(elapsedTime * 1.5) * 0.03;
      }

      // Witch hat subtle swaying
      if (isHalloween) {
        witchHatGroup.rotation.z = Math.sin(elapsedTime * 2.2) * 0.025;
        witchHatGroup.rotation.x = Math.cos(elapsedTime * 1.8) * 0.015;
      }

      // 5. Headgear ring animations
      headgearRing.rotation.z = elapsedTime * 0.4;
      outerHalo.rotation.z = -elapsedTime * 0.7;

      // 6. Dynamic light pulsing based on mood & Halloween theme
      const pulseSpeed = st.mood === 'thinking' ? 9.0 : st.mood === 'celebrate' ? 8.0 : 2.8;
      const lightPulse = 1.6 + Math.sin(elapsedTime * pulseSpeed) * 0.8;
      headCyanLight.intensity = lightPulse;
      headLimeLight.intensity = lightPulse * 1.1;

      // Color Presets (with special Halloween Pumpkin & Scholar Gold)
      if (isHalloween) {
        const colOsc = (Math.sin(elapsedTime * 1.4) + 1) * 0.5;
        neonHeadgearMat.color.lerpColors(
          new THREE.Color(0xff6b00), // Pumpkin orange
          new THREE.Color(0x9d4edd), // Witch violet
          colOsc
        );
        neonHeadgearMat.emissive.copy(neonHeadgearMat.color);
        headCyanLight.color.setHex(0xff6b00);
        headLimeLight.color.setHex(0x9d4edd);
        outerHaloMat.color.setHex(0xff7700);
      } else if (st.customColorPreset === 'scholar-gold') {
        neonHeadgearMat.color.setHex(0xd4af37);
        neonHeadgearMat.emissive.setHex(0xb8860b);
        headCyanLight.color.setHex(0xd4af37);
        headLimeLight.color.setHex(0xc5a059);
        outerHaloMat.color.setHex(0xd4af37);
      } else if (st.customColorPreset === 'cyan') {
        neonHeadgearMat.color.setHex(0x2ba8f0);
        neonHeadgearMat.emissive.setHex(0x2ba8f0);
        headCyanLight.color.setHex(0x2ba8f0);
        headLimeLight.color.setHex(0x2ba8f0);
      } else if (st.customColorPreset === 'lime') {
        neonHeadgearMat.color.setHex(0x7fdb22);
        neonHeadgearMat.emissive.setHex(0x7fdb22);
        headCyanLight.color.setHex(0x7fdb22);
        headLimeLight.color.setHex(0x7fdb22);
      } else {
        // Aurora gradient oscillation
        const colOsc = (Math.sin(elapsedTime * 1.2) + 1) * 0.5;
        neonHeadgearMat.color.lerpColors(
          new THREE.Color(0x2ba8f0),
          new THREE.Color(0x22d08b),
          colOsc
        );
        neonHeadgearMat.emissive.copy(neonHeadgearMat.color);
        headCyanLight.color.setHex(0x2ba8f0);
        headLimeLight.color.setHex(0x22d08b);
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

      // Auto-adapt if container dimensions changed or settled after initial mount
      if (
        container &&
        container.clientWidth > 0 &&
        container.clientHeight > 0 &&
        (Math.abs(renderer.domElement.clientWidth - container.clientWidth) > 4 ||
          Math.abs(renderer.domElement.clientHeight - container.clientHeight) > 4)
      ) {
        const cw = container.clientWidth;
        const ch = container.clientHeight;
        camera.aspect = cw / ch;
        camera.updateProjectionMatrix();
        renderer.setSize(cw, ch);
      }

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

      // Halloween assets disposal
      witchHatMat.dispose();
      goldMat.dispose();
      ribbonMat.dispose();
      brimGeo.dispose();
      hatBaseGeo.dispose();
      hatTipGeo.dispose();
      hatCharmGeo.dispose();
      ribbonGeo.dispose();
      buckleOuterGeo.dispose();
      buckleInnerGeo.dispose();
      fangMat.dispose();
      leftFangGeo.dispose();
      rightFangGeo.dispose();

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
        return 'w-full h-full min-h-[240px]';
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
      {webglSupported ? (
        <div
          ref={containerRef}
          onClick={handleClick}
          className="w-full h-full cursor-pointer relative"
          title="Tap Memo to interact or ask a question!"
        />
      ) : (
        <div
          onClick={handleClick}
          className="w-full h-full cursor-pointer relative flex flex-col items-center justify-center p-3 animate-pulse"
          title="Tap Memo to emote!"
        >
          {/* 2.5D Stylus Body Vector Illustration */}
          <svg viewBox="0 0 160 220" className="w-32 h-44 drop-shadow-xl">
            {/* Ambient Aura */}
            <circle
              cx="80"
              cy="95"
              r="60"
              fill={halloweenTheme ? 'rgba(255, 107, 0, 0.18)' : 'rgba(34, 208, 139, 0.18)'}
            />

            {/* Witch Hat if Halloween */}
            {halloweenTheme && (
              <g className="transition-all">
                {/* Wide Brim */}
                <ellipse cx="80" cy="56" rx="55" ry="11" fill="#1C1328" stroke="#3D2952" strokeWidth="2" />
                {/* Cone Base */}
                <path d="M48 56 Q80 20 80 8 Q80 20 112 56 Z" fill="#1C1328" stroke="#3D2952" strokeWidth="2" />
                {/* Crooked Tip */}
                <path d="M78 12 Q80 8 72 2 Q78 4 82 12 Z" fill="#1C1328" />
                <circle cx="72" cy="2" r="3" fill="#F59E0B" />
                {/* Orange Ribbon */}
                <ellipse cx="80" cy="52" rx="34" ry="7" fill="#FF6B00" />
                {/* Gold Buckle */}
                <rect x="74" y="47" width="12" height="10" rx="2" fill="#F59E0B" />
                <rect x="77" y="50" width="6" height="4" rx="1" fill="#1C1328" />
              </g>
            )}

            {/* Ceramic Stylus Barrel Body */}
            <rect x="62" y="60" width="36" height="90" rx="10" fill="#F8FAFC" stroke="#CBD5E1" strokeWidth="2.5" />

            {/* Glowing Digital Visor Face */}
            <rect x="66" y="80" width="28" height="32" rx="6" fill="#0A111E" stroke={halloweenTheme ? '#FF6B00' : '#22D08B'} strokeWidth="1.5" />

            {/* Eyes */}
            <circle cx="74" cy="94" r="3" fill={halloweenTheme ? '#FF9E00' : '#22D08B'} />
            <circle cx="86" cy="94" r="3" fill={halloweenTheme ? '#FF9E00' : '#22D08B'} />

            {/* Vampire Fangs if Halloween */}
            {halloweenTheme && (
              <g fill="#FFFFFF" stroke="#FF6B00" strokeWidth="0.5">
                <polygon points="72,102 75,102 73.5,107" />
                <polygon points="85,102 88,102 86.5,107" />
              </g>
            )}

            {/* Stylus Grip & Silver Nib */}
            <polygon points="65,150 95,150 84,185 76,185" fill="#E2E8F0" />
            <polygon points="76,185 84,185 80,205" fill="#94A3B8" />
            <circle cx="80" cy="205" r="2" fill="#64748B" />
          </svg>
          <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300 mt-1">
            Memo Interactive Companion
          </span>
        </div>
      )}

      {showControlsOverlay && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-full shadow-sm text-xs font-medium text-slate-600 dark:text-slate-300 pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-[#FF6B00] animate-pulse" />
          <span>Interactive 3D Stylus · Halloween Edition</span>
        </div>
      )}
    </div>
  );
};
