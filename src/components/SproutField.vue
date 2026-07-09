<template>
  <div class="sprout-field" :class="{ 'quiet': !running }" ref="wrap">
    <canvas ref="canvas"></canvas>
    <div class="center-glow" aria-hidden="true"></div>
    <div class="floating-particles" aria-hidden="true"></div>
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
let resizeObserver = null
let sprouts = []
let particles = []
let mist = []
let time = 0

function initCanvas() {
  const c = canvas.value
  if (!c) return
  ctx = c.getContext('2d')
  resize()
  // Reduce object count on mobile to maintain smooth frame rate
  const mobile = window.innerWidth < 768
  createSprouts(mobile ? 35 : 70)
  createParticles(mobile ? 40 : 80)
  createMist(mobile ? 25 : 50)
}

function remapSceneToViewport(oldWidth, oldHeight, newWidth, newHeight) {
  if (!oldWidth || !oldHeight) return

  const scaleX = newWidth / oldWidth
  const scaleY = newHeight / oldHeight

  for (const s of sprouts) {
    s.x *= scaleX
    s.y *= scaleY
    // Keep plant roots anchored near the new bottom edge.
    s.baseY = newHeight - 20
  }

  for (const p of particles) {
    p.x *= scaleX
    p.y *= scaleY
  }

  for (const m of mist) {
    m.x *= scaleX
    m.y *= scaleY
  }
}

function resize() {
  const c = canvas.value
  if (!c || !wrap.value || !ctx) return

  const oldWidth = width
  const oldHeight = height

  width = wrap.value.clientWidth
  height = wrap.value.clientHeight

  const dpr = window.devicePixelRatio || 1
  c.width = Math.floor(width * dpr)
  c.height = Math.floor(height * dpr)
  c.style.width = width + 'px'
  c.style.height = height + 'px'
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

  if (sprouts.length || particles.length || mist.length) {
    remapSceneToViewport(oldWidth, oldHeight, width, height)
  }
}

function createSprouts(n) {
  sprouts = []
  for (let i = 0; i < n; i++) {
    const hue = Math.random() * 50 + 90 // 90-140: từ xanh lục đến xanh lá
    const startHeight = Math.random() * 20 + 5
    const maxHeight = Math.random() * 80 + 50
    sprouts.push({
      x: Math.random() * width,
      y: height - 20, // Bắt đầu gần đáy màn hình
      baseY: height - 20,
      height: startHeight,
      maxHeight: maxHeight,
      growSpeed: Math.random() * 0.4 + 0.2,
      swayPhase: Math.random() * Math.PI * 2,
      swaySpeed: Math.random() * 0.03 + 0.015,
      swayAmplitude: Math.random() * 5 + 3,
      alpha: Math.random() * 0.4 + 0.3,
      hue: hue,
      leafCount: 0,
      maxLeaves: Math.floor(Math.random() * 4) + 3,
      leafPhases: [],
      bloomPhase: 0,
      hasBloom: Math.random() > 0.5,
      bloomColor: `hsl(${Math.random() * 60 + 280}, 70%, 70%)`, // Hoa màu tím/hồng
      pulsePhase: Math.random() * Math.PI * 2,
      stage: 'growing',
      thickness: Math.random() * 1.5 + 1.5
    })
  }
}

function createParticles(n) {
  particles = []
  for (let i = 0; i < n; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speedY: -(Math.random() * 0.3 + 0.1),
      speedX: (Math.random() - 0.5) * 0.2,
      alpha: Math.random() * 0.3 + 0.2,
      color: `hsl(${Math.random() * 40 + 100}, 60%, 70%)`
    })
  }
}

function createMist(n) {
  mist = []
  for (let i = 0; i < n; i++) {
    mist.push({
      x: Math.random() * width,
      y: height + Math.random() * height * 0.35, // Bắt đầu từ phía dưới để bay lên
      size: Math.random() * 8 + 3,
      speedY: -(Math.random() * 0.8 + 0.4), // Tốc độ bay lên
      speedX: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.5 + 0.3, // Alpha cao hơn để thấy rõ
      pulsePhase: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.03 + 0.02,
      isDewDrop: Math.random() > 0.5 // Một nửa là giọt sương, một nửa là bông mây nhỏ
    })
  }
}

function drawSprout(s) {
  time += 0.01
  const sway = Math.sin(s.swayPhase) * s.swayAmplitude
  const pulse = Math.sin(s.pulsePhase) * 0.1 + 0.9
  
  // Vẽ bóng mờ dưới gốc cây
  ctx.save()
  ctx.translate(s.x, s.y + 5)
  ctx.globalAlpha = s.alpha * 0.2
  const shadowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 15)
  shadowGradient.addColorStop(0, `hsla(${s.hue}, 40%, 20%, 0.3)`)
  shadowGradient.addColorStop(1, 'rgba(0,0,0,0)')
  ctx.fillStyle = shadowGradient
  ctx.fillRect(-15, -10, 30, 20)
  ctx.restore()
  
  // Vẽ thân cây với gradient
  ctx.save()
  ctx.translate(s.x, s.y)
  ctx.globalAlpha = s.alpha
  
  const gradient = ctx.createLinearGradient(0, 0, 0, -s.height)
  gradient.addColorStop(0, `hsl(${s.hue - 10}, 60%, 35%)`)
  gradient.addColorStop(0.5, `hsl(${s.hue}, 65%, 45%)`)
  gradient.addColorStop(1, `hsl(${s.hue + 10}, 70%, 55%)`)
  
  ctx.strokeStyle = gradient
  ctx.lineWidth = s.thickness * pulse
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  
  ctx.beginPath()
  ctx.moveTo(0, 0)
  
  // Đường cong tự nhiên hơn cho thân cây
  const segments = 15
  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    const yPos = -s.height * t
    const xOffset = sway * t * 0.6 * Math.sin(t * Math.PI)
    const wiggle = Math.sin(time + s.swayPhase + t * 3) * t * 2
    ctx.lineTo(xOffset + wiggle, yPos)
  }
  ctx.stroke()
  
  // Vẽ lá non với animation
  if (s.height > 15) {
    const actualLeafCount = Math.min(Math.floor(s.height / 18), s.maxLeaves)
    
    // Tạo phase cho lá mới
    while (s.leafPhases.length < actualLeafCount) {
      s.leafPhases.push({
        growPhase: 0,
        angle: (Math.random() - 0.5) * 0.5
      })
    }
    
    for (let i = 0; i < actualLeafCount; i++) {
      if (!s.leafPhases[i]) continue
      
      // Lá phát triển dần
      if (s.leafPhases[i].growPhase < 1) {
        s.leafPhases[i].growPhase += 0.02
      }
      
      const leafProgress = s.leafPhases[i].growPhase
      const leafY = -s.height * (0.25 + i * 0.18)
      const leafX = sway * 0.6 * (0.25 + i * 0.18)
      const baseSize = 5 + i * 2.5
      const leafSize = baseSize * leafProgress
      const leafSway = Math.sin(time * 2 + i) * 1.5
      
      // Màu lá với gradient
      const leafGradient = ctx.createLinearGradient(leafX - leafSize, leafY, leafX + leafSize, leafY - leafSize)
      leafGradient.addColorStop(0, `hsla(${s.hue + 15}, 75%, 50%, ${0.8 * leafProgress})`)
      leafGradient.addColorStop(1, `hsla(${s.hue + 25}, 80%, 60%, ${0.9 * leafProgress})`)
      
      ctx.fillStyle = leafGradient
      ctx.strokeStyle = `hsl(${s.hue}, 70%, 40%)`
      ctx.lineWidth = 1
      
      // Lá bên trái
      ctx.beginPath()
      ctx.moveTo(leafX, leafY)
      ctx.quadraticCurveTo(
        leafX - leafSize * 0.7 + leafSway, 
        leafY - leafSize * 0.4,
        leafX - leafSize * 1.3 + leafSway, 
        leafY - leafSize * 0.8
      )
      ctx.quadraticCurveTo(
        leafX - leafSize * 0.5 + leafSway, 
        leafY - leafSize * 0.5,
        leafX, 
        leafY
      )
      ctx.fill()
      ctx.stroke()
      
      // Lá bên phải
      ctx.beginPath()
      ctx.moveTo(leafX, leafY)
      ctx.quadraticCurveTo(
        leafX + leafSize * 0.7 - leafSway, 
        leafY - leafSize * 0.4,
        leafX + leafSize * 1.3 - leafSway, 
        leafY - leafSize * 0.8
      )
      ctx.quadraticCurveTo(
        leafX + leafSize * 0.5 - leafSway, 
        leafY - leafSize * 0.5,
        leafX, 
        leafY
      )
      ctx.fill()
      ctx.stroke()
      
      // Vẽ gân lá
      ctx.strokeStyle = `hsla(${s.hue - 10}, 60%, 30%, ${0.4 * leafProgress})`
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.moveTo(leafX, leafY)
      ctx.lineTo(leafX - leafSize * 0.9 + leafSway, leafY - leafSize * 0.6)
      ctx.moveTo(leafX, leafY)
      ctx.lineTo(leafX + leafSize * 0.9 - leafSway, leafY - leafSize * 0.6)
      ctx.stroke()
    }
  }
  
  // Vẽ nụ/hoa ở đỉnh với animation
  if (s.height > 30) {
    const budY = -s.height
    const budX = sway * 0.6
    
    if (s.hasBloom) {
      s.bloomPhase = Math.min(s.bloomPhase + 0.01, 1)
      
      // Hoa nở dần
      const bloomSize = 4 * s.bloomPhase
      const petalCount = 5
      
      for (let i = 0; i < petalCount; i++) {
        const angle = (Math.PI * 2 / petalCount) * i + time * 0.5
        const petalX = budX + Math.cos(angle) * bloomSize * 1.2
        const petalY = budY + Math.sin(angle) * bloomSize * 1.2
        
        ctx.beginPath()
        const petalGradient = ctx.createRadialGradient(petalX, petalY, 0, petalX, petalY, bloomSize)
        petalGradient.addColorStop(0, s.bloomColor)
        petalGradient.addColorStop(1, `hsla(${s.hue + 20}, 60%, 70%, 0.6)`)
        ctx.fillStyle = petalGradient
        ctx.arc(petalX, petalY, bloomSize, 0, Math.PI * 2)
        ctx.fill()
      }
      
      // Nhụy hoa
      ctx.beginPath()
      ctx.fillStyle = `hsl(${s.hue + 30}, 80%, 60%)`
      ctx.arc(budX, budY, bloomSize * 0.5, 0, Math.PI * 2)
      ctx.fill()
      
      // Ánh sáng lấp lánh từ hoa
      const sparkle = Math.sin(time * 3 + s.pulsePhase) * 0.5 + 0.5
      ctx.globalAlpha = sparkle * 0.6
      ctx.fillStyle = 'rgba(255, 255, 200, 0.8)'
      ctx.arc(budX, budY, bloomSize * 0.3, 0, Math.PI * 2)
      ctx.fill()
    } else {
      // Nụ chưa nở
      const budGradient = ctx.createRadialGradient(budX, budY, 0, budX, budY, 4)
      budGradient.addColorStop(0, `hsl(${s.hue + 20}, 70%, 55%)`)
      budGradient.addColorStop(1, `hsl(${s.hue}, 65%, 45%)`)
      ctx.fillStyle = budGradient
      ctx.beginPath()
      ctx.arc(budX, budY, 3.5 * pulse, 0, Math.PI * 2)
      ctx.fill()
      
      // Viền nụ
      ctx.strokeStyle = `hsl(${s.hue - 10}, 60%, 35%)`
      ctx.lineWidth = 1
      ctx.stroke()
    }
  }
  
  ctx.restore()
}

function drawParticles() {
  // Vẽ các hạt phấn hoa/sương bay
  for (const p of particles) {
    p.y += p.speedY
    p.x += p.speedX + Math.sin(time + p.y * 0.1) * 0.3
    
    if (p.y < -10) {
      p.y = height + 10
      p.x = Math.random() * width
    }
    if (p.x < -10) p.x = width + 10
    if (p.x > width + 10) p.x = -10
    
    ctx.save()
    ctx.globalAlpha = p.alpha * (Math.sin(time * 2 + p.y * 0.05) * 0.3 + 0.7)
    
    const particleGradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
    particleGradient.addColorStop(0, p.color)
    particleGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    
    ctx.fillStyle = particleGradient
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

function drawMist() {
  // Vẽ sương mù và giọt sương bay từ dưới lên
  for (const m of mist) {
    m.y += m.speedY
    m.x += m.speedX + Math.sin(time * 0.5 + m.y * 0.01) * 0.3
    m.pulsePhase += m.pulseSpeed
    
    // Reset khi ra khỏi màn hình
    if (m.y < -m.size * 2) {
      m.y = height + m.size * 2
      m.x = Math.random() * width
    }
    if (m.x < -m.size) m.x = width + m.size
    if (m.x > width + m.size) m.x = -m.size
    
    const pulse = Math.sin(m.pulsePhase) * 0.2 + 0.8
    ctx.save()
    ctx.globalAlpha = m.alpha * pulse
    
    if (m.isDewDrop) {
      // Vẽ giọt sương - hình tròn sáng
      const dewGradient = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.size)
      dewGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
      dewGradient.addColorStop(0.3, 'rgba(220, 255, 240, 0.7)')
      dewGradient.addColorStop(0.6, 'rgba(200, 240, 220, 0.4)')
      dewGradient.addColorStop(1, 'rgba(180, 220, 200, 0)')
      
      ctx.fillStyle = dewGradient
      ctx.beginPath()
      ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2)
      ctx.fill()
      
      // Thêm highlight sáng
      ctx.globalAlpha = m.alpha * 0.6
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
      ctx.beginPath()
      ctx.arc(m.x - m.size * 0.3, m.y - m.size * 0.3, m.size * 0.4, 0, Math.PI * 2)
      ctx.fill()
    } else {
      // Vẽ bông sương mờ
      const mistGradient = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.size * 1.5)
      mistGradient.addColorStop(0, 'rgba(240, 255, 250, 0.5)')
      mistGradient.addColorStop(0.5, 'rgba(220, 245, 235, 0.3)')
      mistGradient.addColorStop(1, 'rgba(200, 230, 220, 0)')
      
      ctx.fillStyle = mistGradient
      ctx.beginPath()
      ctx.arc(m.x, m.y, m.size * 1.5 * pulse, 0, Math.PI * 2)
      ctx.fill()
    }
    
    ctx.restore()
  }
}

function draw() {
  if (!ctx) return
  ctx.clearRect(0, 0, width, height)
  
  // Background gradient với màu ấm hơn
  const g = ctx.createLinearGradient(0, 0, 0, height)
  g.addColorStop(0, 'rgba(6,11,22,0.0)')
  g.addColorStop(0.5, 'rgba(8,20,15,0.08)')
  g.addColorStop(1, 'rgba(10,25,15,0.18)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, width, height)
  
  // Vẽ sương mù trước
  drawMist()
  
  // Vẽ particles
  drawParticles()

  for (const s of sprouts) {
    // Tăng chiều cao cây với easing
    if (s.stage === 'growing' && s.height < s.maxHeight) {
      const growthEase = 1 - Math.pow(s.height / s.maxHeight, 2)
      s.height += s.growSpeed * growthEase
      s.y -= s.growSpeed * growthEase
      
      if (s.height >= s.maxHeight * 0.95) {
        s.stage = 'swaying'
      }
    }
    
    // Cây đã lớn thì đung đưa
    if (s.stage === 'swaying') {
      s.swayPhase += s.swaySpeed
      s.pulsePhase += 0.02
      
      // Đôi khi cây "tái sinh" từ dưới lên
      if (Math.random() < 0.0015) {
        s.height = Math.random() * 20 + 5
        s.y = height - 20
        s.stage = 'growing'
        s.swayPhase = Math.random() * Math.PI * 2
        s.leafPhases = []
        s.bloomPhase = 0
      }
    }
    
    drawSprout(s)
  }

  animId = requestAnimationFrame(draw)
}

onMounted(() => {
  if (!canvas.value || !wrap.value) return
  initCanvas()
  window.addEventListener('resize', resize)

  // Handles zoom/layout changes that don't always emit classic resize reliably.
  resizeObserver = new ResizeObserver(() => {
    resize()
  })
  resizeObserver.observe(wrap.value)

  draw()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }
  cancelAnimationFrame(animId)
})

watch(() => props.running, () => {})
</script>

<style scoped>
.sprout-field {
  position: fixed;
  inset: 0;
  overflow: hidden;
  z-index: 0;
  background: radial-gradient(ellipse at bottom, #0a1810 0%, #020a08 50%, #000504 100%);
}
.sprout-field canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.floating-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: 
    radial-gradient(2px 2px at 20% 30%, rgba(255, 255, 200, 0.2), transparent),
    radial-gradient(2px 2px at 60% 70%, rgba(200, 255, 200, 0.2), transparent),
    radial-gradient(2px 2px at 50% 50%, rgba(255, 255, 255, 0.1), transparent),
    radial-gradient(3px 3px at 80% 10%, rgba(200, 255, 220, 0.2), transparent),
    radial-gradient(1px 1px at 90% 80%, rgba(255, 255, 200, 0.15), transparent);
  background-size: 200% 200%, 180% 180%, 220% 220%, 190% 190%, 210% 210%;
  background-position: 0% 0%, 50% 50%, 25% 75%, 75% 25%, 100% 100%;
  animation: floatParticles 25s ease-in-out infinite;
  opacity: 0.4;
}

@keyframes floatParticles {
  0%, 100% {
    background-position: 0% 0%, 50% 50%, 25% 75%, 75% 25%, 100% 100%;
  }
  25% {
    background-position: 20% 30%, 60% 70%, 40% 60%, 85% 15%, 90% 80%;
  }
  50% {
    background-position: 50% 50%, 30% 20%, 70% 80%, 60% 40%, 80% 90%;
  }
  75% {
    background-position: 80% 70%, 40% 30%, 55% 45%, 70% 60%, 70% 70%;
  }
}

.center-glow {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
  mix-blend-mode: screen;
  background: radial-gradient(circle, 
    rgba(34, 197, 94, 0.15) 0%, 
    rgba(16, 185, 129, 0.12) 20%,
    rgba(20, 184, 166, 0.08) 40%,
    transparent 70%);
  opacity: 0.6;
  animation: glowPulse 10s ease-in-out infinite;
}

@keyframes glowPulse {
  0%, 100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
    filter: blur(100px) hue-rotate(0deg);
  }
  33% {
    opacity: 0.7;
    transform: translate(-50%, -50%) scale(1.08);
    filter: blur(110px) hue-rotate(10deg);
  }
  66% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.05);
    filter: blur(105px) hue-rotate(-10deg);
  }
}

.sprout-field.quiet .center-glow {
  opacity: 0.3;
  animation: glowPulseQuiet 10s ease-in-out infinite;
}

@keyframes glowPulseQuiet {
  0%, 100% {
    opacity: 0.25;
    transform: translate(-50%, -50%) scale(0.95);
    filter: blur(90px) hue-rotate(0deg);
  }
  50% {
    opacity: 0.35;
    transform: translate(-50%, -50%) scale(1);
    filter: blur(95px) hue-rotate(5deg);
  }
}
</style>
