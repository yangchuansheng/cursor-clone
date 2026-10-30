"use client";

import { useEffect, useRef, useState } from "react";
import { LazyVideo } from "./scroll-area";

export interface ShaderRampStop {
  pos: number;
  hex: string;
  mid: number;
}

export interface ShaderSettings {
  mode: "zoom" | "motion";
  driftAmp: number;
  driftPeriod: number;
  centerXPct: number;
  centerYPct: number;
  strength: number;
  samples: number;
  box: number;
  angle: number;
  squash: number;
  invertSource: boolean;
  sourceScale: number;
  coreLight: number;
  coreRadius: number;
  bandOn: boolean;
  bandSpeed: number;
  bandDepth: number;
  sourceMotionOn: boolean;
  rotAmp: number;
  rotPeriod: number;
  zoomAmp: number;
  zoomPeriod: number;
  breathOn: boolean;
  breathAmp: number;
  breathPeriod: number;
  flickerAmp: number;
  flickerScale: number;
  flickerSpeed: number;
  cropScale: number;
  cropOffsetX: number;
  cropOffsetY: number;
  rampOn: boolean;
  levelsOn: boolean;
  grainOn: boolean;
  inBlack: number;
  inWhite: number;
  gamma: number;
  outBlack: number;
  outWhite: number;
  grainAmount: number;
  grainScale: number;
  grainMode: number;
  grainHz: number;
  posterizeFps: number;
  posterizeLevels: number;
}

export interface ShaderPreset {
  id: string;
  source: string;
  grain: string;
  ramp: ShaderRampStop[];
  layout: "corner" | "cover";
  loop?: {
    src: string;
    mobileSrc: string;
    poster: string;
  };
  settings: ShaderSettings;
}

const DEFAULT_SETTINGS: ShaderSettings = {
  mode: "zoom",
  driftAmp: 0,
  driftPeriod: 18,
  centerXPct: 55,
  centerYPct: 64,
  strength: 0.72,
  samples: 56,
  box: 0,
  angle: 0,
  squash: 0,
  invertSource: false,
  sourceScale: 1,
  coreLight: 0,
  coreRadius: 0.22,
  bandOn: true,
  bandSpeed: 0.22,
  bandDepth: 1.8,
  sourceMotionOn: true,
  rotAmp: 2,
  rotPeriod: 26,
  zoomAmp: 0.08,
  zoomPeriod: 19,
  breathOn: true,
  breathAmp: 0.06,
  breathPeriod: 9,
  flickerAmp: 0.03,
  flickerScale: 9,
  flickerSpeed: 0.15,
  cropScale: 1,
  cropOffsetX: 0,
  cropOffsetY: 0,
  rampOn: true,
  levelsOn: false,
  grainOn: true,
  inBlack: 0,
  inWhite: 1,
  gamma: 1,
  outBlack: 0,
  outWhite: 1,
  grainAmount: 0.16,
  grainScale: 2.6,
  grainMode: 0,
  grainHz: 30,
  posterizeFps: 0,
  posterizeLevels: 0,
};

export const BRIGHT_CORE_PRESET: ShaderPreset = {
  id: "bright-core",
  source: "/sites/kino/landing/hero/collage.webp",
  grain: "/sites/kino/landing/hero/grain.png",
  ramp: [
    { pos: 0, hex: "#DCF2FF", mid: 0.5 },
    { pos: 0.1, hex: "#8FD2FF", mid: 0.5 },
    { pos: 0.22, hex: "#0A63B8", mid: 0.5 },
    { pos: 0.45, hex: "#001A2E", mid: 0.5 },
    { pos: 1, hex: "#000305", mid: 0.5 },
  ],
  layout: "corner",
  loop: {
    src: "/sites/kino/landing/hero/loops/bright-core.mp4",
    mobileSrc: "/sites/kino/landing/hero/loops/bright-core-mobile.mp4",
    poster: "/sites/kino/landing/hero/loops/bright-core.webp",
  },
  settings: DEFAULT_SETTINGS,
};

const VERTEX_SHADER = `#version 300 es
in vec2 aPos;
out vec2 vUV0;
void main() {
  vUV0 = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}
`;

const SOURCE_FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform sampler2D iChannel0;
uniform vec2 iResolution;
uniform vec2 iImageResolution;
uniform float flipY;
uniform float srcRotate;
uniform vec2 srcOffset;
uniform float srcOverscan;
uniform vec2 srcPivot;
uniform float srcInvert;
uniform float srcCore;
uniform float srcCoreRadius;

in vec2 vUV0;
out vec4 outFragColor;

vec2 coverUV(vec2 uv) {
  float dstA = iResolution.x / max(iResolution.y, 1e-6);
  float srcA = iImageResolution.x / max(iImageResolution.y, 1e-6);
  vec2 s = dstA > srcA ? vec2(1.0, srcA / dstA) : vec2(dstA / srcA, 1.0);
  return (uv - 0.5) * s + 0.5;
}

void main() {
  vec2 p = vUV0 - srcPivot;
  float c = cos(srcRotate);
  float sn = sin(srcRotate);
  float ar = iResolution.x / max(iResolution.y, 1e-6);
  p.x *= ar;
  p = vec2(p.x * c - p.y * sn, p.x * sn + p.y * c);
  p.x /= ar;
  vec2 uv = coverUV(p / max(srcOverscan, 1e-3) + srcPivot + srcOffset);
  vec2 t = uv;
  if (flipY > 0.5) t.y = 1.0 - t.y;
  vec4 col = texture(iChannel0, clamp(t, 0.0, 1.0));
  if (srcInvert > 0.5) col.rgb = vec3(1.0 - dot(col.rgb, vec3(0.2126, 0.7152, 0.0722)));

  if (srcCore > 0.0) {
    vec2 d = (vUV0 - srcPivot) * vec2(iResolution.x / max(iResolution.y, 1e-6), 1.0);
    float disc = 1.0 - smoothstep(srcCoreRadius * 0.75, srcCoreRadius, length(d));
    col.rgb = max(col.rgb, vec3(disc * srcCore));
  }
  float inside = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
  outFragColor = vec4(col.rgb * inside, 1.0);
}
`;

const ZOOM_FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform vec2 iResolution;
uniform sampler2D iChannel0;
uniform vec2 center;
uniform float strength;
uniform float samples;
uniform float box;
uniform float phase;
uniform float angle;
uniform float squash;
uniform float flickerAmp;
uniform float flickerScale;
uniform float flickerPhase;

in vec2 vUV0;
out vec4 outFragColor;

const vec2 offset = vec2(0.0, 0.0);
const vec2 texScale = vec2(1.0, 1.0);

float srcAspect() { return iResolution.x / max(iResolution.y, 1e-6); }

vec2 longSide() {
  float a = srcAspect();
  return a > 1.0 ? vec2(a, 1.0) : vec2(1.0, 1.0 / a);
}

vec2 toRelCoord(vec2 fragCoord) {
  return ((fragCoord / iResolution.xy) * 2.0 - 1.0) * longSide();
}

vec4 pixel(in vec2 pos) {
  vec2 srcUV = ((pos / longSide()) + 1.0) / 2.0;
  srcUV = offset + srcUV * texScale;
  return textureLod(iChannel0, srcUV, 0.0);
}

float hash1(float n) { return fract(sin(n) * 43758.5453123); }

float vnoise1(float x) {
  float i = floor(x);
  float f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(hash1(i), hash1(i + 1.0), f);
}

vec2 zoomStep(vec2 p, float s) {
  if (squash <= 0.0) return p * s;
  float a = radians(angle);
  float c = cos(a);
  float sn = sin(a);
  vec2 along = vec2(c, sn);
  vec2 across = vec2(-sn, c);
  vec2 q = vec2(dot(p, along), dot(p, across));
  q *= vec2(s * (1.0 + squash), s);
  return along * q.x + across * q.y;
}

vec4 run(vec2 pos) {
  vec4 color = vec4(0.0);
  float wsum = 0.0;
  pos -= center;
  for (float i = -samples; i <= samples; i += 1.0) {
    float dist = i / samples + phase;
    float w = 1.0 - dist;
    w = 1.0 - w * w;
    w = 1.0 - w * w;
    w = max(w, box);
    color += w * pixel(zoomStep(pos, exp(strength * dist)) + center);
    wsum += w;
  }

  vec4 outColor = color / wsum;
  if (flickerAmp > 0.0) {
    float theta = atan(pos.y, pos.x) / 6.2831853 + 0.5;
    float n = vnoise1(theta * flickerScale + flickerPhase);
    outColor.rgb *= 1.0 + flickerAmp * (n * 2.0 - 1.0);
  }
  return outColor;
}

void main() {
  outFragColor = run(toRelCoord(vUV0 * iResolution.xy));
}
`;

const POST_FRAGMENT_SHADER = `#version 300 es
precision highp float;

uniform sampler2D iChannel0;
uniform sampler2D iRamp;
uniform sampler2D iGrain;
uniform vec2 iResolution;
uniform vec2 iGrainResolution;
uniform float cropScale;
uniform vec2 cropOffset;
uniform float rampOn;
uniform float levelsOn;
uniform float grainOn;
uniform float inBlack;
uniform float inWhite;
uniform float gamma;
uniform float outBlack;
uniform float outWhite;
uniform float grainAmount;
uniform float grainScale;
uniform vec2 grainOffset;
uniform float grainMode;
uniform float posterizeLevels;

in vec2 vUV0;
out vec4 outFragColor;

float luma(vec3 c) { return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

vec3 applyLevels(vec3 c) {
  vec3 v = clamp((c - inBlack) / max(inWhite - inBlack, 1e-6), 0.0, 1.0);
  v = pow(v, vec3(1.0 / max(gamma, 1e-6)));
  return outBlack + v * (outWhite - outBlack);
}

vec3 posterizeLuma(vec3 c) {
  if (posterizeLevels < 1.5) return c;
  float y = clamp(luma(c), 0.0, 1.0);
  float stepped = floor(y * posterizeLevels) / max(posterizeLevels - 1.0, 1.0);
  return clamp(c * (stepped / max(y, 1e-4)), 0.0, 1.0);
}

void main() {
  vec2 uv = (vUV0 - 0.5) / max(cropScale, 1e-6) + 0.5 + cropOffset;
  vec3 c = texture(iChannel0, clamp(uv, 0.0, 1.0)).rgb;

  if (rampOn > 0.5) c = texture(iRamp, vec2(clamp(luma(c), 0.0, 1.0), 0.5)).rgb;
  c = posterizeLuma(c);
  if (levelsOn > 0.5) c = applyLevels(c);

  if (grainOn > 0.5) {
    float aspect = iResolution.x / max(iResolution.y, 1e-6);
    vec2 g = (vUV0 * vec2(aspect, 1.0) * grainScale) + grainOffset;
    vec3 n = texture(iGrain, g).rgb;
    vec3 screened = 1.0 - (1.0 - c) * (1.0 - n * grainAmount);
    vec3 multiplied = c * mix(vec3(1.0), n, grainAmount);
    c = grainMode > 0.5 ? multiplied : screened;
  }

  outFragColor = vec4(clamp(c, 0.0, 1.0), 1.0);
}
`;

const SOURCE_UNIFORMS = [
  "iChannel0",
  "iResolution",
  "iImageResolution",
  "flipY",
  "srcRotate",
  "srcOffset",
  "srcOverscan",
  "srcPivot",
  "srcInvert",
  "srcCore",
  "srcCoreRadius",
] as const;

const ZOOM_UNIFORMS = [
  "iResolution",
  "iChannel0",
  "center",
  "strength",
  "samples",
  "box",
  "phase",
  "angle",
  "squash",
  "flickerAmp",
  "flickerScale",
  "flickerPhase",
] as const;

const POST_UNIFORMS = [
  "iChannel0",
  "iRamp",
  "iGrain",
  "iResolution",
  "iGrainResolution",
  "cropScale",
  "cropOffset",
  "rampOn",
  "levelsOn",
  "grainOn",
  "inBlack",
  "inWhite",
  "gamma",
  "outBlack",
  "outWhite",
  "grainAmount",
  "grainScale",
  "grainOffset",
  "grainMode",
  "posterizeLevels",
] as const;

interface CompiledPass {
  program: WebGLProgram;
  vao: WebGLVertexArrayObject;
  uniforms: Record<string, WebGLUniformLocation | null>;
}

interface RenderTarget {
  framebuffer: WebGLFramebuffer;
  texture: WebGLTexture;
}

interface GlState {
  gl: WebGL2RenderingContext;
  source: CompiledPass;
  zoom: CompiledPass;
  post: CompiledPass;
  ramps: WeakMap<ShaderRampStop[], WebGLTexture>;
  prepared: RenderTarget;
  blurred: RenderTarget;
  width: number;
  height: number;
  textures: WeakMap<HTMLImageElement, WebGLTexture>;
}

function parseHex(hex: string): [number, number, number] {
  const n = Number.parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function midpointCurve(t: number, mid: number): number {
  return Math.pow(t, Math.log(0.5) / Math.log(Math.min(Math.max(mid, 0.01), 0.99)));
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  source: string,
  label: string
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error(`${label}: could not create shader`);
  gl.shaderSource(shader, source.replace(/^\s+/, ""));
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`${label}: compile failed: ${info}`);
  }
  return shader;
}

function createPass(
  gl: WebGL2RenderingContext,
  fragSrc: string,
  uniformNames: readonly string[],
  label: string
): CompiledPass {
  const program = gl.createProgram();
  if (!program) throw new Error(`${label}: could not create program`);
  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER, label);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc, label);
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`${label}: link failed: ${info}`);
  }
  const vao = gl.createVertexArray();
  const buf = gl.createBuffer();
  if (!vao || !buf) throw new Error(`${label}: could not allocate geometry`);
  gl.bindVertexArray(vao);
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(program, "aPos");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  gl.bindVertexArray(null);
  const uniforms: Record<string, WebGLUniformLocation | null> = {};
  for (const name of uniformNames) {
    uniforms[name] = gl.getUniformLocation(program, name);
  }
  return { program, vao, uniforms };
}

function setTextureParams(gl: WebGL2RenderingContext, repeat = false) {
  const wrap = repeat ? gl.REPEAT : gl.CLAMP_TO_EDGE;
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrap);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrap);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
}

function createRenderTarget(gl: WebGL2RenderingContext, width: number, height: number): RenderTarget {
  const texture = gl.createTexture();
  const framebuffer = gl.createFramebuffer();
  if (!texture || !framebuffer) throw new Error("could not allocate render target");
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
  setTextureParams(gl);
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  return { framebuffer, texture };
}

function resizeTargets(state: GlState, width: number, height: number) {
  if (state.width === width && state.height === height) return;
  const { gl } = state;
  for (const target of [state.prepared, state.blurred]) {
    gl.deleteFramebuffer(target.framebuffer);
    gl.deleteTexture(target.texture);
  }
  state.prepared = createRenderTarget(gl, width, height);
  state.blurred = createRenderTarget(gl, width, height);
  state.width = width;
  state.height = height;
}

function getOrCreateImageTexture(
  state: GlState,
  image: HTMLImageElement,
  repeat: boolean
): WebGLTexture {
  const cached = state.textures.get(image);
  if (cached) return cached;
  const { gl } = state;
  const tex = gl.createTexture();
  if (!tex) throw new Error("could not allocate texture");
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, image);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  setTextureParams(gl, repeat);
  state.textures.set(image, tex);
  return tex;
}

function getOrCreateRampTexture(state: GlState, ramp: ShaderRampStop[]): WebGLTexture {
  const cached = state.ramps.get(ramp);
  if (cached) return cached;
  const data = new Uint8Array(1024);
  const sorted = [...ramp].sort((a, b) => a.pos - b.pos);
  for (let i = 0; i < 256; i += 1) {
    const x = i / 255;
    let left = sorted[0];
    let right = sorted[sorted.length - 1];
    for (let j = 0; j < sorted.length - 1; j += 1) {
      const a = sorted[j];
      const b = sorted[j + 1];
      if (x >= a.pos && x <= b.pos) {
        left = a;
        right = b;
        break;
      }
    }
    const span = Math.max(right.pos - left.pos, 1e-6);
    const norm = Math.min(Math.max((x - left.pos) / span, 0), 1);
    const t = x <= left.pos ? 0 : x >= right.pos ? 1 : midpointCurve(norm, left.mid);
    const c0 = parseHex(left.hex);
    const c1 = parseHex(right.hex);
    data[i * 4 + 0] = Math.round(c0[0] + (c1[0] - c0[0]) * t);
    data[i * 4 + 1] = Math.round(c0[1] + (c1[1] - c0[1]) * t);
    data[i * 4 + 2] = Math.round(c0[2] + (c1[2] - c0[2]) * t);
    data[i * 4 + 3] = 255;
  }
  const { gl } = state;
  const tex = gl.createTexture();
  if (!tex) throw new Error("could not allocate LUT");
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, 256, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
  setTextureParams(gl);
  state.ramps.set(ramp, tex);
  return tex;
}

function drawPass(gl: WebGL2RenderingContext, pass: CompiledPass) {
  gl.bindVertexArray(pass.vao);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  gl.bindVertexArray(null);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`could not load ${src}`));
    img.src = src;
  });
}

export function shouldUseReducedShader(): boolean {
  if (typeof window === "undefined") return true;
  if (window.matchMedia("(prefers-reduced-motion: reduce), (pointer: coarse)").matches) {
    return true;
  }
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency < 4) return true;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return true;
  if (
    nav.connection &&
    (nav.connection.saveData === true ||
      ["slow-2g", "2g", "3g"].includes(nav.connection.effectiveType ?? ""))
  ) {
    return true;
  }
  return false;
}

export function HeroShaderCanvas({
  preset = BRIGHT_CORE_PRESET,
  className,
}: {
  preset?: ShaderPreset;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const glStateRef = useRef<GlState | null>(null);
  const [mode, setMode] = useState<"pending" | "live" | "media" | "gradient">("pending");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      if (!shouldUseReducedShader()) {
        setMode("live");
      } else {
        setMode(preset.loop ? "media" : "gradient");
      }
    });
    return () => window.cancelAnimationFrame(rafId);
  }, [preset]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || mode !== "live") return;

    let rafId = 0;
    let disposed = false;
    let visible = true;
    let images: [HTMLImageElement, HTMLImageElement] | null = null;
    const startTime = performance.now();

    const syncSize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(2, Math.round(rect.width));
      const h = Math.max(2, Math.round(rect.height));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        if (glStateRef.current) {
          resizeTargets(glStateRef.current, w, h);
        }
      }
    };

    const renderFrame = (now: number) => {
      const state = glStateRef.current;
      if (!state || !images) return;
      const [sourceImg, grainImg] = images;
      const s = preset.settings;
      const elapsed = (now - startTime) / 1000;
      const { gl, width: w, height: h } = state;
      const t = s.posterizeFps >= 1 ? Math.floor(elapsed * s.posterizeFps) / s.posterizeFps : elapsed;
      const grainStep = Math.floor(elapsed * Math.max(s.grainHz, 0.001));

      const srcTex = getOrCreateImageTexture(state, sourceImg, false);
      const grainTex = getOrCreateImageTexture(state, grainImg, true);
      const rampTex = getOrCreateRampTexture(state, preset.ramp);

      const aspect = w / Math.max(h, 1);
      const phase = s.bandOn
        ? (s.bandDepth * Math.sin(t * s.bandSpeed * Math.PI * 2)) / Math.max(s.samples, 1)
        : 0;
      const rotate = s.sourceMotionOn
        ? ((s.rotAmp * Math.sin((t / Math.max(s.rotPeriod, 0.01)) * Math.PI * 2)) * Math.PI) / 180
        : 0;
      const drift =
        s.sourceMotionOn && s.mode === "motion"
          ? s.driftAmp * Math.sin((t / s.driftPeriod) * Math.PI * 2)
          : 0;
      const radAngle = (s.angle * Math.PI) / 180;
      const overscan =
        (Math.abs(Math.cos(rotate)) + Math.max(aspect, 1 / aspect) * Math.abs(Math.sin(rotate))) *
        (1 + 2.2 * Math.abs(drift)) *
        (s.sourceMotionOn
          ? 1 + s.zoomAmp * (0.5 + 0.5 * Math.sin((t / Math.max(s.zoomPeriod, 0.01)) * Math.PI * 2))
          : 1) *
        Math.max(s.sourceScale, 0.05);
      const breath = s.breathOn
        ? 1 + s.breathAmp * Math.sin((t / Math.max(s.breathPeriod, 0.01)) * Math.PI * 2)
        : 1;

      // Pass 1: Source preparation
      gl.bindFramebuffer(gl.FRAMEBUFFER, state.prepared.framebuffer);
      const uSrc = state.source.uniforms;
      gl.useProgram(state.source.program);
      gl.viewport(0, 0, w, h);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, srcTex);
      setTextureParams(gl);
      gl.uniform1i(uSrc.iChannel0, 0);
      gl.uniform2f(uSrc.iResolution, w, h);
      gl.uniform2f(uSrc.iImageResolution, sourceImg.naturalWidth, sourceImg.naturalHeight);
      gl.uniform1f(uSrc.flipY, 0);
      gl.uniform1f(uSrc.srcRotate, rotate);
      gl.uniform2f(uSrc.srcOffset, Math.cos(radAngle) * drift, Math.sin(radAngle) * drift);
      gl.uniform1f(uSrc.srcOverscan, overscan);
      gl.uniform2f(uSrc.srcPivot, s.centerXPct / 100, s.centerYPct / 100);
      gl.uniform1f(uSrc.srcInvert, s.invertSource ? 1 : 0);
      gl.uniform1f(uSrc.srcCore, s.coreLight);
      gl.uniform1f(uSrc.srcCoreRadius, s.coreRadius);
      drawPass(gl, state.source);

      // Pass 2: Zoom Blur
      const longSide: [number, number] = aspect > 1 ? [aspect, 1] : [1, 1 / aspect];
      gl.bindFramebuffer(gl.FRAMEBUFFER, state.blurred.framebuffer);
      const uZoom = state.zoom.uniforms;
      gl.useProgram(state.zoom.program);
      gl.viewport(0, 0, w, h);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, state.prepared.texture);
      setTextureParams(gl);
      gl.uniform1i(uZoom.iChannel0, 0);
      gl.uniform2f(uZoom.iResolution, w, h);
      gl.uniform2f(
        uZoom.center,
        ((s.centerXPct / 100) * 2 - 1) * longSide[0],
        ((s.centerYPct / 100) * 2 - 1) * longSide[1]
      );
      gl.uniform1f(uZoom.strength, s.strength * breath);
      gl.uniform1f(uZoom.samples, s.samples);
      gl.uniform1f(uZoom.box, s.box);
      gl.uniform1f(uZoom.angle, s.angle);
      gl.uniform1f(uZoom.squash, s.squash);
      gl.uniform1f(uZoom.phase, phase);
      gl.uniform1f(uZoom.flickerAmp, s.breathOn ? s.flickerAmp : 0);
      gl.uniform1f(uZoom.flickerScale, s.flickerScale);
      gl.uniform1f(uZoom.flickerPhase, t * s.flickerSpeed);
      drawPass(gl, state.zoom);

      // Pass 3: Post (Gradient Map LUT + Film Grain)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      const uPost = state.post.uniforms;
      gl.useProgram(state.post.program);
      gl.viewport(0, 0, w, h);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, state.blurred.texture);
      setTextureParams(gl);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, rampTex);
      gl.activeTexture(gl.TEXTURE2);
      gl.bindTexture(gl.TEXTURE_2D, grainTex);
      setTextureParams(gl, true);
      gl.activeTexture(gl.TEXTURE0);
      gl.uniform1i(uPost.iChannel0, 0);
      gl.uniform1i(uPost.iRamp, 1);
      gl.uniform1i(uPost.iGrain, 2);
      gl.uniform2f(uPost.iResolution, w, h);
      gl.uniform2f(uPost.iGrainResolution, grainImg.naturalWidth, grainImg.naturalHeight);
      gl.uniform1f(uPost.cropScale, s.cropScale);
      gl.uniform2f(uPost.cropOffset, s.cropOffsetX, s.cropOffsetY);
      gl.uniform1f(uPost.rampOn, s.rampOn ? 1 : 0);
      gl.uniform1f(uPost.levelsOn, s.levelsOn ? 1 : 0);
      gl.uniform1f(uPost.grainOn, s.grainOn ? 1 : 0);
      gl.uniform1f(uPost.inBlack, s.inBlack);
      gl.uniform1f(uPost.inWhite, s.inWhite);
      gl.uniform1f(uPost.gamma, s.gamma);
      gl.uniform1f(uPost.outBlack, s.outBlack);
      gl.uniform1f(uPost.outWhite, s.outWhite);
      gl.uniform1f(uPost.grainAmount, s.grainAmount);
      gl.uniform1f(uPost.grainScale, s.grainScale);
      gl.uniform2f(uPost.grainOffset, (grainStep * 0.37) % 1, (grainStep * 0.73) % 1);
      gl.uniform1f(uPost.grainMode, s.grainMode);
      gl.uniform1f(uPost.posterizeLevels, s.posterizeLevels);
      drawPass(gl, state.post);
    };

    const loop = (now: number) => {
      if (!disposed && visible) {
        renderFrame(now);
        rafId = requestAnimationFrame(loop);
      }
    };

    const startLoop = () => {
      if (!disposed && visible && !rafId) {
        rafId = requestAnimationFrame(loop);
      }
    };

    const stopLoop = () => {
      cancelAnimationFrame(rafId);
      rafId = 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible) startLoop();
      else stopLoop();
    });
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      syncSize();
      renderFrame(performance.now());
    });
    ro.observe(canvas);

    Promise.all([loadImage(preset.source), loadImage(preset.grain)]).then(
      (loaded) => {
        if (disposed) return;
        images = loaded;
        syncSize();
        try {
          if (!glStateRef.current) {
            const gl = canvas.getContext("webgl2", {
              antialias: false,
              alpha: false,
              premultipliedAlpha: false,
              preserveDrawingBuffer: false,
              powerPreference: "high-performance",
            });
            if (!gl) throw new Error("WebGL2 unavailable");
            glStateRef.current = {
              gl,
              source: createPass(gl, SOURCE_FRAGMENT_SHADER, SOURCE_UNIFORMS, "Source"),
              zoom: createPass(gl, ZOOM_FRAGMENT_SHADER, ZOOM_UNIFORMS, "Zoom Blur"),
              post: createPass(gl, POST_FRAGMENT_SHADER, POST_UNIFORMS, "Post"),
              ramps: new WeakMap(),
              prepared: createRenderTarget(gl, canvas.width, canvas.height),
              blurred: createRenderTarget(gl, canvas.width, canvas.height),
              width: canvas.width,
              height: canvas.height,
              textures: new WeakMap(),
            };
          }
          resizeTargets(glStateRef.current, canvas.width, canvas.height);
        } catch {
          canvas.getContext("webgl2")?.getExtension("WEBGL_lose_context")?.loseContext();
          glStateRef.current = null;
          setMode(preset.loop ? "media" : "gradient");
          return;
        }
        if (visible) renderFrame(performance.now());
        startLoop();
      },
      () => {}
    );

    return () => {
      disposed = true;
      stopLoop();
      io.disconnect();
      ro.disconnect();
    };
  }, [preset, mode]);

  useEffect(() => {
    return () => {
      glStateRef.current?.gl.getExtension("WEBGL_lose_context")?.loseContext();
      glStateRef.current = null;
    };
  }, []);

  const radialGradient = `radial-gradient(ellipse at 55% 35%, ${preset.ramp
    .map((stop) => `${stop.hex} ${stop.pos * 100}%`)
    .join(", ")})`;
  const background = preset.loop
    ? `url("${preset.loop.poster}") center / cover no-repeat, ${radialGradient}`
    : radialGradient;

  if (preset.loop && mode === "media") {
    return (
      <LazyVideo
        src={isMobile ? preset.loop.mobileSrc : preset.loop.src}
        poster={preset.loop.poster}
        rootMargin="0px"
        aria-hidden="true"
        className={className}
        style={{ background, objectFit: "cover" }}
      />
    );
  }

  return <canvas ref={canvasRef} aria-hidden="true" className={className} style={{ background }} />;
}
