<template>
  <div class="starfield" :class="{ 'quiet': !running }" ref="wrap">
    <canvas ref="canvas"></canvas>
    <div class="center-glow" aria-hidden="true"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  running: { type: Boolean, default: false }
})

const canvas = ref(null)
const wrap = ref(null)
let ctx, width, height, animId
let stars = []

function initCanvas() {
  const c = canvas.value
  ctx = c.getContext('2d')
  resize()
  createStars(120)
}

function resize() {
  const c = canvas.value
  width = wrap.value.clientWidth
  height = wrap.value.clientHeight
  c.width = width * devicePixelRatio
  c.height = height * devicePixelRatio
  c.style.width = width + 'px'
  c.style.height = height + 'px'
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0)
}

function createStars(n) {
  stars = []
  for (let i = 0; i < n; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.3,
      vx: (Math.random() - 0.5) * 0.15, // Tăng tốc độ bay nhẹ
      vy: (Math.random() - 0.5) * 0.15,
      alpha: Math.random() * 0.8 + 0.2,
      flicker: Math.random() * 0.025 + 0.015 // Nhấp nháy mượt hơn
    })
  }
}

function draw() {
  ctx.clearRect(0, 0, width, height)
  const g = ctx.createLinearGradient(0, 0, 0, height)
  g.addColorStop(0, 'rgba(6,11,22,0.0)')
  g.addColorStop(1, 'rgba(6,11,22,0.15)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, width, height)

  for (const s of stars) {
    s.x += s.vx
    s.y += s.vy
    s.alpha += (Math.random() - 0.5) * s.flicker
    s.alpha = Math.max(0.05, Math.min(1, s.alpha))
    if (s.x < -10) s.x = width + 10
    if (s.x > width + 10) s.x = -10
    if (s.y < -10) s.y = height + 10
    if (s.y > height + 10) s.y = -10

    ctx.beginPath()
    ctx.fillStyle = `rgba(255,255,255,${s.alpha})`
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
    ctx.fill()
  }

  animId = requestAnimationFrame(draw)
}

onMounted(() => {
  initCanvas()
  window.addEventListener('resize', resize)
  draw()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  cancelAnimationFrame(animId)
})

watch(() => props.running, () => {})
</script>

<style scoped>
.starfield {
  position: fixed;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}
.starfield canvas {
  display: block;
  width: 100%;
  height: 100%;
}
.center-glow {
  position: absolute;
  left: 50%;
  top: 42%;
  transform: translate(-50%, -50%);
  width: 520px;
  height: 520px;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
  mix-blend-mode: screen;
  background: radial-gradient(circle, #0ea5e9 0%, #06b6d4 30%, transparent 60%);
  opacity: 0.08;
  animation: glowPulse 8s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.08;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.12;
    transform: translate(-50%, -50%) scale(1.05);
  }
}

.starfield.quiet .center-glow {
  opacity: 0.03;
  animation: glowPulseQuiet 8s ease-in-out infinite;
}

@keyframes glowPulseQuiet {
  0%, 100% {
    opacity: 0.03;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.05;
    transform: translate(-50%, -50%) scale(1.02);
  }
}
</style>
