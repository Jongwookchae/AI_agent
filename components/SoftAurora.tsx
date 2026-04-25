"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle, Transform } from "ogl";

type SoftAuroraProps = {
  speed?: number;
  scale?: number;
  brightness?: number;
  color1?: string;
  color2?: string;
  noiseFrequency?: number;
  noiseAmplitude?: number;
  bandHeight?: number;
  bandSpread?: number;
  octaveDecay?: number;
  layerOffset?: number;
  colorSpeed?: number;
  enableMouseInteraction?: boolean;
  mouseInfluence?: number;
  className?: string;
};

function hexToRgb01(hex: string): [number, number, number] {
  const clean = hex.replace("#", "");
  const normalized =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;

  const n = Number.parseInt(normalized, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export default function SoftAurora({
  speed = 0.6,
  scale = 1.5,
  brightness = 1,
  color1 = "#f7f7f7",
  color2 = "#e100ff",
  noiseFrequency = 2.5,
  noiseAmplitude = 1,
  bandHeight = 0.5,
  bandSpread = 1,
  octaveDecay = 0.1,
  layerOffset = 0,
  colorSpeed = 1,
  enableMouseInteraction = true,
  mouseInfluence = 0.25,
  className = "",
}: SoftAuroraProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({ alpha: true, antialias: true });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    container.appendChild(gl.canvas);

    const geometry = new Triangle(gl);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: [1, 1] },
      uMouse: { value: [0, 0] },
      uSpeed: { value: speed },
      uScale: { value: scale },
      uBrightness: { value: brightness },
      uColor1: { value: hexToRgb01(color1) },
      uColor2: { value: hexToRgb01(color2) },
      uNoiseFrequency: { value: noiseFrequency },
      uNoiseAmplitude: { value: noiseAmplitude },
      uBandHeight: { value: bandHeight },
      uBandSpread: { value: bandSpread },
      uOctaveDecay: { value: octaveDecay },
      uLayerOffset: { value: layerOffset },
      uColorSpeed: { value: colorSpeed },
      uMouseInfluence: { value: enableMouseInteraction ? mouseInfluence : 0 },
    };

    const program = new Program(gl, {
      vertex: `
        attribute vec2 uv;
        attribute vec2 position;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 0.0, 1.0);
        }
      `,
      fragment: `
        precision highp float;

        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uMouse;
        uniform float uSpeed;
        uniform float uScale;
        uniform float uBrightness;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform float uNoiseFrequency;
        uniform float uNoiseAmplitude;
        uniform float uBandHeight;
        uniform float uBandSpread;
        uniform float uOctaveDecay;
        uniform float uLayerOffset;
        uniform float uColorSpeed;
        uniform float uMouseInfluence;

        varying vec2 vUv;

        float hash(vec2 p) {
          p = fract(p * vec2(123.34, 345.45));
          p += dot(p, p + 34.345);
          return fract(p.x * p.y);
        }

        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          float a = hash(i);
          float b = hash(i + vec2(1.0, 0.0));
          float c = hash(i + vec2(0.0, 1.0));
          float d = hash(i + vec2(1.0, 1.0));
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
        }

        float fbm(vec2 p) {
          float value = 0.0;
          float amp = uNoiseAmplitude;
          float freq = uNoiseFrequency;
          for (int i = 0; i < 5; i++) {
            value += amp * noise(p * freq);
            freq *= 2.0;
            amp *= max(0.02, uOctaveDecay + 0.15);
          }
          return value;
        }

        void main() {
          vec2 uv = vUv;
          vec2 aspect = vec2(uResolution.x / max(1.0, uResolution.y), 1.0);

          float t = uTime * uSpeed;
          vec2 p = (uv - 0.5) * aspect * uScale;
          vec2 m = (uMouse - 0.5) * aspect * uMouseInfluence;

          float waveA = sin((p.x + t * 0.7 + m.x) * 2.6 + layerOffset) * uBandHeight;
          float waveB = cos((p.x * 1.4 - t * 0.5 - m.y) * 1.9 - layerOffset) * (uBandHeight * 0.7);

          float ridge = 1.0 - abs(p.y + waveA + waveB) * (2.0 + uBandSpread);
          ridge = smoothstep(0.0, 1.0, ridge);

          float n1 = fbm(vec2(p.x * 1.4 + t * 0.4, p.y * 1.2 - t * 0.2));
          float n2 = fbm(vec2(p.x * 1.1 - t * 0.3, p.y * 1.5 + t * 0.25));

          float mixBand = smoothstep(0.0, 1.0, ridge * (0.8 + n1 * 0.45));
          float colorShift = 0.5 + 0.5 * sin(t * uColorSpeed + n2 * 3.1415);

          vec3 aurora = mix(uColor1, uColor2, colorShift) * mixBand;
          aurora += uColor1 * (n1 * 0.12) + uColor2 * (n2 * 0.1);

          float vignette = smoothstep(1.15, 0.35, length((uv - 0.5) * vec2(1.15, 1.0)));
          aurora *= vignette * uBrightness;

          gl_FragColor = vec4(aurora, clamp((mixBand * 0.75 + n2 * 0.2) * vignette, 0.0, 1.0));
        }
      `,
      uniforms,
    });

    const scene = new Transform();
    const mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(scene);

    function resize() {
      if (!container) return;
      const width = container.clientWidth || 1;
      const height = container.clientHeight || 1;
      renderer.setSize(width, height);
      uniforms.uResolution.value = [width, height];
    }

    function onMouseMove(e: MouseEvent) {
      if (!enableMouseInteraction || !container) return;
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      uniforms.uMouse.value = [x, y];
    }

    let rafId = 0;
    const start = performance.now();
    const renderLoop = (time: number) => {
      uniforms.uTime.value = (time - start) * 0.001;
      renderer.render({ scene });
      rafId = requestAnimationFrame(renderLoop);
    };

    resize();
    rafId = requestAnimationFrame(renderLoop);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      if (gl.canvas.parentElement === container) {
        container.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [
    speed,
    scale,
    brightness,
    color1,
    color2,
    noiseFrequency,
    noiseAmplitude,
    bandHeight,
    bandSpread,
    octaveDecay,
    layerOffset,
    colorSpeed,
    enableMouseInteraction,
    mouseInfluence,
  ]);

  return <div ref={containerRef} className={`absolute inset-0 ${className}`} />;
}
