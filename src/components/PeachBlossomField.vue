<template>
  <div class="peach-blossom-field" :class="{ 'quiet': !running }" ref="wrap">
    <canvas ref="canvas"></canvas>
    <div class="ambient-glow" aria-hidden="true"></div>
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
let trees = []
let blossoms = []
let leaves = []
let petals = []
let time = 0

// Màu sắc
const colors = {
  trunk: 'rgba(101, 67, 33, 1)', // Thân cây nâu đậm
  branch: 'rgba(120, 80, 45, 0.9)', // Cành cây
  leaf: 'rgba(60, 150, 80, 0.7)', // Lá xanh
  blossom: 'rgba(255, 182, 193, 1)', // Hồng nhạt
  blossomDark: 'rgba(255, 105, 180, 0.9)', // Hồng đậm
  blossomLight: 'rgba(255, 228, 225, 1)', // Hồng rất nhạt
  petal: 'rgba(255, 192, 203, 0.8)', // Cánh hoa rơi
}

function initCanvas() {
  const c = canvas.value
  ctx = c.getContext('2d')
  resize()
  createTrees()
  createBlossoms()
  createLeaves()
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

// Tạo vườn cây đào
function createTrees() {
  trees = []
  const numTrees = Math.floor(width / 200) + 2
  
  for (let i = 0; i < numTrees; i++) {
    const x = (width / (numTrees - 1)) * i
    const groundY = height * 0.85
    const trunkHeight = 80 + Math.random() * 60
    const trunkWidth = 15 + Math.random() * 10
    
    const tree = {
      x,
      groundY,
      trunkHeight,
      trunkWidth,
      branches: []
    }
    
    // Tạo các cành từ thân cây
    const numMainBranches = 5 + Math.floor(Math.random() * 4)
    for (let j = 0; j < numMainBranches; j++) {
      const branchY = groundY - trunkHeight * (0.3 + (j / numMainBranches) * 0.7)
      const side = j % 2 === 0 ? 1 : -1
      const angle = -Math.PI / 4 + (Math.random() - 0.5) * 0.3
      
      tree.branches.push({
        startX: x,
        startY: branchY,
        segments: generateBranchSegments(x, branchY, angle * side, 6 + Math.floor(Math.random() * 4))
      })
    }
    
    trees.push(tree)
  }
}

// Tạo các đoạn cành cây
function generateBranchSegments(startX, startY, startAngle, numSegments) {
  const segments = []
  let x = startX
  let y = startY
  let angle = startAngle
  
  for (let i = 0; i < numSegments; i++) {
    const length = 30 + Math.random() * 30
    angle += (Math.random() - 0.5) * 0.5
    
    const endX = x + Math.cos(angle) * length
    const endY = y + Math.sin(angle) * length
    
    segments.push({
      startX: x,
      startY: y,
      endX,
      endY,
      width: 4 - (i / numSegments) * 3
    })
    
    // Tạo cành nhánh nhỏ
    if (i > 1 && Math.random() > 0.6) {
      const subAngle = angle + (Math.random() - 0.5) * Math.PI / 2
      const subSegments = generateBranchSegments(x, y, subAngle, Math.floor(numSegments / 2))
      segments.push(...subSegments)
    }
    
    x = endX
    y = endY
  }
  
  return segments
}

// Tạo hoa đào
function createBlossoms() {
  blossoms = []
  
  trees.forEach(tree => {
    tree.branches.forEach(branch => {
      branch.segments.forEach((seg, index) => {
        // Nhiều hoa hơn trên mỗi đoạn cành
        const numBlossoms = 3 + Math.floor(Math.random() * 4)
        
        for (let i = 0; i < numBlossoms; i++) {
          const t = Math.random()
          const x = seg.startX + (seg.endX - seg.startX) * t
          const y = seg.startY + (seg.endY - seg.startY) * t
          
          blossoms.push({
            x,
            y,
            size: 0,
            maxSize: 5 + Math.random() * 5,
            bloomSpeed: 0.015 + Math.random() * 0.025,
            bloomDelay: index * 0.15 + Math.random() * 0.8,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.008,
            petalsCount: 5,
            alpha: 0
          })
        }
      })
    })
  })
}

// Tạo lá cây
function createLeaves() {
  leaves = []
  
  trees.forEach(tree => {
    tree.branches.forEach(branch => {
      branch.segments.forEach((seg, index) => {
        // Lá xanh trên các cành
        const numLeaves = 2 + Math.floor(Math.random() * 3)
        
        for (let i = 0; i < numLeaves; i++) {
          const t = Math.random()
          const x = seg.startX + (seg.endX - seg.startX) * t
          const y = seg.startY + (seg.endY - seg.startY) * t
          const angle = Math.atan2(seg.endY - seg.startY, seg.endX - seg.startX)
          
          leaves.push({
            x,
            y,
            size: 6 + Math.random() * 4,
            angle: angle + (Math.random() - 0.5) * 0.5,
            sway: Math.random() * 0.02,
            swayOffset: Math.random() * Math.PI * 2,
            alpha: 0,
            growSpeed: 0.01 + Math.random() * 0.015,
            growDelay: index * 0.1 + Math.random() * 0.5
          })
        }
      })
    })
  })
}

// Vẽ tất cả cây
function drawTrees() {
  trees.forEach(tree => {
    // Vẽ thân cây
    ctx.fillStyle = colors.trunk
    ctx.beginPath()
    // Thân cây hình thang (rộng ở dưới, hẹp ở trên)
    const bottomWidth = tree.trunkWidth
    const topWidth = tree.trunkWidth * 0.6
    ctx.moveTo(tree.x - bottomWidth / 2, tree.groundY)
    ctx.lineTo(tree.x + bottomWidth / 2, tree.groundY)
    ctx.lineTo(tree.x + topWidth / 2, tree.groundY - tree.trunkHeight)
    ctx.lineTo(tree.x - topWidth / 2, tree.groundY - tree.trunkHeight)
    ctx.closePath()
    ctx.fill()
    
    // Thêm texture cho thân cây
    ctx.strokeStyle = 'rgba(80, 50, 30, 0.3)'
    ctx.lineWidth = 1
    for (let i = 0; i < 5; i++) {
      const y = tree.groundY - (tree.trunkHeight * (i / 5))
      const offset = Math.sin(i) * 3
      ctx.beginPath()
      ctx.moveTo(tree.x - bottomWidth / 2 + offset, y)
      ctx.lineTo(tree.x + bottomWidth / 2 + offset, y)
      ctx.stroke()
    }
    
    // Vẽ các cành
    tree.branches.forEach(branch => {
      branch.segments.forEach(seg => {
        ctx.strokeStyle = colors.branch
        ctx.lineWidth = seg.width
        ctx.lineCap = 'round'
        
        ctx.beginPath()
        ctx.moveTo(seg.startX, seg.startY)
        ctx.lineTo(seg.endX, seg.endY)
        ctx.stroke()
      })
    })
  })
}

// Vẽ lá cây
function drawLeaves() {
  leaves.forEach(leaf => {
    if (time < leaf.growDelay) return
    
    const growProgress = Math.min(1, (time - leaf.growDelay) * leaf.growSpeed)
    leaf.alpha = growProgress
    
    const currentSize = leaf.size * growProgress
    const sway = Math.sin(time * leaf.sway + leaf.swayOffset) * 0.1
    
    ctx.save()
    ctx.translate(leaf.x, leaf.y)
    ctx.rotate(leaf.angle + sway)
    ctx.globalAlpha = leaf.alpha * 0.8
    
    // Vẽ lá hình elip
    ctx.fillStyle = colors.leaf
    ctx.beginPath()
    ctx.ellipse(0, 0, currentSize * 0.5, currentSize, 0, 0, Math.PI * 2)
    ctx.fill()
    
    // Gân lá
    ctx.strokeStyle = 'rgba(40, 100, 50, 0.5)'
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.moveTo(0, -currentSize)
    ctx.lineTo(0, currentSize)
    ctx.stroke()
    
    ctx.restore()
  })
}

// Vẽ một bông hoa đào (5 cánh)
function drawBlossom(blossom) {
  if (time < blossom.bloomDelay) return
  
  // Tính toán bloom progress
  const bloomProgress = Math.min(1, (time - blossom.bloomDelay) * blossom.bloomSpeed)
  blossom.size = blossom.maxSize * bloomProgress
  blossom.alpha = bloomProgress
  blossom.rotation += blossom.rotationSpeed
  
  ctx.save()
  ctx.translate(blossom.x, blossom.y)
  ctx.rotate(blossom.rotation)
  ctx.globalAlpha = blossom.alpha
  
  // Vẽ 5 cánh hoa
  for (let i = 0; i < blossom.petalsCount; i++) {
    const angle = (Math.PI * 2 / blossom.petalsCount) * i
    
    ctx.save()
    ctx.rotate(angle)
    
    // Vẽ cánh hoa hình trái tim
    ctx.beginPath()
    ctx.fillStyle = i % 2 === 0 ? colors.blossom : colors.blossomLight
    
    const petalSize = blossom.size
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo(
      -petalSize * 0.5, -petalSize * 0.8,
      -petalSize * 0.8, -petalSize * 0.3,
      0, petalSize * 0.5
    )
    ctx.bezierCurveTo(
      petalSize * 0.8, -petalSize * 0.3,
      petalSize * 0.5, -petalSize * 0.8,
      0, 0
    )
    ctx.fill()
    
    // Viền hồng đậm
    ctx.strokeStyle = colors.blossomDark
    ctx.lineWidth = 0.5
    ctx.stroke()
    
    ctx.restore()
  }
  
  // Nhụy hoa (vàng nhạt ở giữa)
  ctx.beginPath()
  ctx.fillStyle = 'rgba(255, 220, 100, 0.95)'
  ctx.arc(0, 0, blossom.size * 0.35, 0, Math.PI * 2)
  ctx.fill()
  
  // Chấm nhỏ trên nhụy
  for (let i = 0; i < 8; i++) {
    const angle = (Math.PI * 2 / 8) * i
    const r = blossom.size * 0.22
    ctx.beginPath()
    ctx.fillStyle = 'rgba(255, 180, 50, 0.95)'
    ctx.arc(Math.cos(angle) * r, Math.sin(angle) * r, 0.8, 0, Math.PI * 2)
    ctx.fill()
  }
  
  ctx.restore()
  
  // Thỉnh thoảng tạo cánh hoa rơi
  if (bloomProgress === 1 && Math.random() < 0.0008) {
    createFallingPetal(blossom)
  }
}

// Tạo cánh hoa rơi
function createFallingPetal(blossom) {
  petals.push({
    x: blossom.x,
    y: blossom.y,
    vx: (Math.random() - 0.5) * 1.5,
    vy: 0.5 + Math.random() * 1.2,
    size: blossom.maxSize * 0.7,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.12,
    alpha: 1,
    sway: Math.random() * 0.03
  })
}

// Vẽ cánh hoa rơi
function drawFallingPetals() {
  petals = petals.filter(petal => {
    petal.x += petal.vx
    petal.y += petal.vy
    petal.vx += Math.sin(time * petal.sway) * 0.08 // Lắc lư mạnh hơn
    petal.rotation += petal.rotationSpeed
    petal.alpha -= 0.002
    
    if (petal.alpha <= 0 || petal.y > height) return false
    
    ctx.save()
    ctx.translate(petal.x, petal.y)
    ctx.rotate(petal.rotation)
    ctx.globalAlpha = petal.alpha
    
    // Vẽ cánh hoa đơn giản
    ctx.beginPath()
    ctx.fillStyle = colors.petal
    const s = petal.size
    ctx.moveTo(0, 0)
    ctx.bezierCurveTo(-s * 0.5, -s * 0.8, -s * 0.8, -s * 0.3, 0, s * 0.5)
    ctx.bezierCurveTo(s * 0.8, -s * 0.3, s * 0.5, -s * 0.8, 0, 0)
    ctx.fill()
    
    // Viền
    ctx.strokeStyle = 'rgba(255, 105, 180, 0.6)'
    ctx.lineWidth = 0.5
    ctx.stroke()
    
    ctx.restore()
    return true
  })
}

function draw() {
  // Clear với gradient nhẹ
  ctx.clearRect(0, 0, width, height)
  const g = ctx.createLinearGradient(0, 0, 0, height)
  g.addColorStop(0, 'rgba(6,11,22,0)')
  g.addColorStop(0.7, 'rgba(6,11,22,0.05)')
  g.addColorStop(1, 'rgba(50,30,20,0.15)') // Đất
  ctx.fillStyle = g
  ctx.fillRect(0, 0, width, height)
  
  // Vẽ đất
  ctx.fillStyle = 'rgba(60, 40, 20, 0.3)'
  ctx.fillRect(0, height * 0.85, width, height * 0.15)
  
  // Vẽ thân cây và cành
  drawTrees()
  
  // Vẽ lá cây (sau cành, trước hoa)
  drawLeaves()
  
  // Vẽ hoa đào
  blossoms.forEach(blossom => drawBlossom(blossom))
  
  // Vẽ cánh hoa rơi
  drawFallingPetals()
  
  time += 0.016 // ~60fps
  animId = requestAnimationFrame(draw)
}

onMounted(() => {
  initCanvas()
  window.addEventListener('resize', () => {
    resize()
    createTrees()
    createBlossoms()
    createLeaves()
    time = 0
  })
  draw()
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resize)
  cancelAnimationFrame(animId)
})

watch(() => props.running, () => {})
</script>

<style scoped>
.peach-blossom-field {
  position: fixed;
  inset: 0;
  overflow: hidden;
  z-index: 0;
}

.peach-blossom-field canvas {
  display: block;
  width: 100%;
  height: 100%;
}

.ambient-glow {
  position: absolute;
  left: 50%;
  top: 45%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  border-radius: 50%;
  filter: blur(100px);
  pointer-events: none;
  mix-blend-mode: screen;
  background: radial-gradient(circle, 
    rgba(255, 182, 193, 0.15) 0%, 
    rgba(255, 105, 180, 0.08) 30%, 
    transparent 60%);
  opacity: 0.6;
  animation: blossomGlow 10s ease-in-out infinite;
}

@keyframes blossomGlow {
  0%, 100% {
    opacity: 0.4;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

.peach-blossom-field.quiet .ambient-glow {
  opacity: 0.3;
  animation: blossomGlowQuiet 10s ease-in-out infinite;
}

@keyframes blossomGlowQuiet {
  0%, 100% {
    opacity: 0.2;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1.05);
  }
}
</style>
