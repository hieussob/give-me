<template>
  <div class="custom-cursor" :class="{ 'custom-cursor--hover': isHovering }" ref="cursorDot"></div>
  <div class="custom-cursor-glow" :class="{ 'custom-cursor-glow--hover': isHovering }" ref="cursorGlow"></div>
  
  <router-view v-slot="{ Component, route }">
    <component :is="Component" :key="route.path" />
  </router-view>
  <AudioPlayer />
  <LanguageSwitcher />
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import AudioPlayer from './components/AudioPlayer.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'

const isHovering = ref(false)
const cursorDot = ref(null)
const cursorGlow = ref(null)

let mouseX = -100
let mouseY = -100
let glowX = -100
let glowY = -100
let animationFrameId = null

const updateMousePosition = (e) => {
  mouseX = e.clientX
  mouseY = e.clientY
  
  const target = e.target
  const isClickable = target.tagName.toLowerCase() === 'a' || 
                      target.tagName.toLowerCase() === 'button' ||
                      target.closest('a') || 
                      target.closest('button') ||
                      target.closest('.mcard') ||
                      target.closest('.cat-item') ||
                      target.closest('[role="button"]') ||
                      getComputedStyle(target).cursor === 'pointer'

  isHovering.value = !!isClickable
}

const renderLoop = () => {
  // Lerp (Linear Interpolation) for a smooth trailing effect
  glowX += (mouseX - glowX) * 0.25
  glowY += (mouseY - glowY) * 0.25

  if (cursorDot.value) {
    cursorDot.value.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`
  }
  if (cursorGlow.value) {
    cursorGlow.value.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`
  }

  animationFrameId = requestAnimationFrame(renderLoop)
}

onMounted(() => {
  window.addEventListener('mousemove', updateMousePosition, { passive: true })
  renderLoop()
})

onUnmounted(() => {
  window.removeEventListener('mousemove', updateMousePosition)
  if (animationFrameId) cancelAnimationFrame(animationFrameId)
})
</script>

<style>
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: 'Inter', system-ui, sans-serif;
  background: #030712;
  color: #fff;
  -webkit-font-smoothing: antialiased;
}
#app { min-height: 100vh; }
.page-enter-active, .page-leave-active {
  transition: opacity .28s ease, transform .28s ease;
}
.page-enter-from { opacity: 0; transform: translateY(10px); }
.page-leave-to   { opacity: 0; transform: translateY(-6px); }

/* ===================================
   Custom Cursor
=================================== */
.custom-cursor {
  position: fixed;
  top: 0; left: 0;
  width: 6px; height: 6px;
  background: #34d399;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transition: width 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), 
              height 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), 
              background 0.2s;
  will-change: transform;
}

.custom-cursor--hover {
  width: 14px; height: 14px;
  background: rgba(52, 211, 153, 0.4);
  backdrop-filter: blur(2px);
  border: 1px solid rgba(52, 211, 153, 0.8);
}

.custom-cursor-glow {
  position: fixed;
  top: 0; left: 0;
  width: 40px; height: 40px;
  background: rgba(16, 185, 129, 0.2);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  filter: blur(8px);
  transition: width 0.2s, height 0.2s, background 0.2s;
  will-change: transform;
}

.custom-cursor-glow--hover {
  width: 60px; height: 60px;
  background: rgba(16, 185, 129, 0.35);
}

/* Hide default cursor on devices that support hover */
@media (pointer: fine) {
  body, a, button, input, [role="button"], .mcard, .cat-item { cursor: none !important; }
}
</style>
