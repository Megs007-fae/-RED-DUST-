/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const MarsGlobe: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check user reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const prefersReducedMotion = mediaQuery.matches;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 2.4;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Generate Mars procedural texture on offscreen canvas
    const texCanvas = document.createElement('canvas');
    texCanvas.width = 1024;
    texCanvas.height = 512;
    const ctx = texCanvas.getContext('2d');
    if (ctx) {
      // Base Mars rust gradient
      const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
      bgGrad.addColorStop(0, '#c75a28');
      bgGrad.addColorStop(0.5, '#993910');
      bgGrad.addColorStop(1, '#802e0c');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, 1024, 512);

      // Dark volcanic basalt patches (Syrtis Major, Acidalia Planitia)
      ctx.fillStyle = 'rgba(55, 20, 10, 0.45)';
      for (let i = 0; i < 40; i++) {
        ctx.beginPath();
        const x = (i * 87) % 1024;
        const y = 140 + (i * 31) % 220;
        const rx = 35 + (i * 13) % 70;
        const ry = 20 + (i * 7) % 45;
        ctx.ellipse(x, y, rx, ry, (i * 0.4), 0, Math.PI * 2);
        ctx.fill();
      }

      // Valles Marineris canyon rift
      ctx.strokeStyle = 'rgba(35, 10, 5, 0.65)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(350, 260);
      ctx.bezierCurveTo(450, 280, 550, 250, 680, 270);
      ctx.stroke();

      // Northern polar cap (Dry ice / water ice)
      const northCap = ctx.createRadialGradient(512, 15, 0, 512, 15, 75);
      northCap.addColorStop(0, 'rgba(245, 245, 250, 0.85)');
      northCap.addColorStop(0.6, 'rgba(220, 200, 195, 0.5)');
      northCap.addColorStop(1, 'rgba(180, 80, 40, 0)');
      ctx.fillStyle = northCap;
      ctx.fillRect(0, 0, 1024, 90);

      // Southern polar cap
      const southCap = ctx.createRadialGradient(512, 500, 0, 512, 500, 55);
      southCap.addColorStop(0, 'rgba(240, 240, 245, 0.8)');
      southCap.addColorStop(0.7, 'rgba(210, 180, 170, 0.4)');
      southCap.addColorStop(1, 'rgba(160, 60, 30, 0)');
      ctx.fillStyle = southCap;
      ctx.fillRect(0, 430, 1024, 82);

      // Dusty crater striations
      ctx.strokeStyle = 'rgba(200, 120, 80, 0.2)';
      ctx.lineWidth = 2;
      for (let j = 0; j < 25; j++) {
        ctx.beginPath();
        const cx = (j * 113) % 1024;
        const cy = 100 + (j * 43) % 300;
        ctx.arc(cx, cy, 8 + (j % 12), 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    const marsTexture = new THREE.CanvasTexture(texCanvas);
    marsTexture.wrapS = THREE.RepeatWrapping;
    marsTexture.wrapT = THREE.ClampToEdgeWrapping;

    // Mars Sphere Mesh
    const geometry = new THREE.SphereGeometry(0.85, 48, 48);
    const material = new THREE.MeshStandardMaterial({
      map: marsTexture,
      roughness: 0.9,
      metalness: 0.1,
    });
    const marsMesh = new THREE.Mesh(geometry, material);
    marsMesh.rotation.x = 0.44; // Mars axial tilt ~25 degrees
    scene.add(marsMesh);

    // Subtle atmospheric glow shell
    const atmosphereGeometry = new THREE.SphereGeometry(0.875, 48, 48);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0xc1440e,
      transparent: true,
      opacity: 0.18,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphereMesh);

    // Lighting (Sunlight simulating Martian orbit)
    const sunLight = new THREE.DirectionalLight(0xffedd5, 1.8);
    sunLight.position.set(3, 1.5, 2.5);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x2d1a14, 0.45);
    scene.add(ambientLight);

    let animationFrameId: number;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!prefersReducedMotion) {
        marsMesh.rotation.y += 0.0016;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      marsTexture.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-65 overflow-hidden"
      style={{
        maskImage: 'radial-gradient(circle at center, black 40%, transparent 75%)',
        WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 75%)',
      }}
      aria-hidden="true"
    />
  );
};
