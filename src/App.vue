<template>
  <div class="app">
    <StarField :running="running" />

    <!-- Message Form -->
    <transition name="fade">
      <MessageForm v-if="showForm" @close="showForm = false" />
    </transition>

    <main class="panel" :class="{ 'meditation-mode': running }">
      <h1 class="title" v-if="!running">Pixel Thoughts — 60s</h1>

      <div v-if="!running" class="input-area">
        <textarea 
          v-model="thought" 
          placeholder="Type something that's on your mind..." 
          rows="3"
          class="thought-input"
        ></textarea>
        <div class="controls">
          <label class="fade-check">
            <input type="checkbox" v-model="fadeOut" /> Fade away
          </label>
          <button :disabled="!thoughtTrimmed" @click="startMeditation" class="btn">Release</button>
        </div>
      </div>

      <div v-else class="meditation">
        <!-- Thought text inside sun - fades into center glow -->
        <div class="thought-sun" :class="{ 'fading': fadeOut && thoughtFading }">
          <div class="sun-glow"></div>
          <p class="thought-text">{{ displayThought }}</p>
        </div>

        <!-- Slogan animation - scales up gradually -->
        <transition name="slogan" mode="out-in">
          <p class="message" :key="currentMessageIndex">
            {{ currentMessage }}
          </p>
        </transition>

        <div class="timer">
          <svg viewBox="0 0 36 36" class="circular-chart">
            <path class="circle-bg" d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"/>
            <path class="circle" :stroke-dasharray="progress + ', 100'" d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"/>
            <text x="18" y="20.35" class="percentage">{{ secondsLeft }}</text>
          </svg>
        </div>
        <button class="btn muted" @click="stopMeditation">Stop</button>
      </div>

      <p class="footer" v-if="!running">Made with ♥ — small 60s relaxation</p>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import StarField from './components/StarField.vue'
import MessageForm from './components/MessageForm.vue'

const thought = ref('')
const displayThought = ref('')
const running = ref(false)
const fadeOut = ref(true)
const thoughtFading = ref(false)
const duration = 60 // seconds
const secondsLeft = ref(duration)
const showForm = ref(false)
let timer = null

const thoughtTrimmed = computed(() => thought.value.trim().length > 0)
const progress = computed(() => ((duration - secondsLeft.value) / duration) * 100)
const messages = [
  "Take a deep breath...",
  "Notice the world around you.",
  "Your thoughts are just clouds passing by.",
  "This moment is temporary.",
  "Let go of your worries.",
  "You are safe and calm.",
  "Everything will be okay."
]

const currentMessageIndex = ref(0)
const currentMessage = computed(() => messages[currentMessageIndex.value])
let messageTimer = null

function startMeditation() {
  if (!thoughtTrimmed.value) return
  running.value = true
  secondsLeft.value = duration
  currentMessageIndex.value = 0
  displayThought.value = thought.value
  thoughtFading.value = false

  // Fade away thought text into sun after 3 seconds
  if (fadeOut.value) {
    setTimeout(() => {
      thoughtFading.value = true
    }, 2000)
    
    setTimeout(() => {
      displayThought.value = ''
      thought.value = ''
    }, 5000)
  }

  timer = setInterval(() => {
    if (secondsLeft.value > 0) secondsLeft.value--
    else stopMeditation()
  }, 1000)

  // Change message every 8 seconds
  messageTimer = setInterval(() => {
    if (currentMessageIndex.value < messages.length - 1) {
      currentMessageIndex.value++
    }
  }, 8000)
}

function stopMeditation() {
  running.value = false
  clearInterval(timer)
  clearInterval(messageTimer)
  thoughtFading.value = false
  displayThought.value = ''
  
  // Show form after meditation ends
  setTimeout(() => {
    showForm.value = true
  }, 500)
}

onBeforeUnmount(() => {
  clearInterval(timer)
  clearInterval(messageTimer)
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: radial-gradient(ellipse at bottom, #020617 0%, #03061a 50%, #020617 100%);
  color: #dbeafe;
  overflow: hidden;
}

.panel {
  width: min(780px, 92vw);
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(8px);
  border-radius: 20px;
  padding: 32px;
  color: #e8f0ff;
  text-align: center;
  box-shadow: 0 20px 60px rgba(2, 6, 23, 0.7);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
}

.panel.meditation-mode {
  background: transparent;
  backdrop-filter: none;
  box-shadow: none;
  padding: 48px 32px;
}

.title {
  margin: 0 0 20px 0;
  font-size: 24px;
  font-weight: 600;
  background: linear-gradient(135deg, #60a5fa 0%, #06b6d4 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: titleGlow 3s ease-in-out infinite;
}

@keyframes titleGlow {
  0%, 100% { opacity: 0.9; }
  50% { opacity: 1; }
}

.input-area {
  animation: fadeInUp 0.6s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.thought-input {
  width: 100%;
  border-radius: 12px;
  padding: 16px;
  resize: vertical;
  font-size: 16px;
  line-height: 1.6;
  border: 1px solid rgba(255, 255, 255, 0.1);
  outline: none;
  background: rgba(255, 255, 255, 0.05);
  color: inherit;
  transition: all 0.3s ease;
  font-family: inherit;
}

.thought-input:focus {
  border-color: rgba(96, 165, 250, 0.5);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 20px rgba(96, 165, 250, 0.15);
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
}

.fade-check {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.3s;
}

.fade-check:hover {
  opacity: 1;
}

.btn {
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #60a5fa 0%, #06b6d4 100%);
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(96, 165, 250, 0.3);
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(96, 165, 250, 0.4);
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  transform: none;
}

.muted {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: inherit;
  box-shadow: none;
}

.muted:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.3);
}

/* Meditation Mode Styles */
.meditation {
  animation: fadeIn 0.8s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Thought Sun - Text inside glowing sun */
.thought-sun {
  position: relative;
  margin: 40px auto 60px;
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: sunRise 1.2s ease-out;
}

@keyframes sunRise {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.8);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.sun-glow {
  position: absolute;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(251, 191, 36, 0.4) 0%, rgba(251, 146, 60, 0.2) 40%, transparent 70%);
  filter: blur(25px);
  animation: sunPulse 4s ease-in-out infinite;
}

@keyframes sunPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.15);
    opacity: 0.8;
  }
}

.thought-text {
  position: relative;
  z-index: 2;
  font-size: 24px;
  font-weight: 500;
  color: #fbbf24;
  text-shadow: 0 0 20px rgba(251, 191, 36, 0.6),
               0 0 40px rgba(251, 191, 36, 0.3);
  padding: 0 40px;
  line-height: 1.6;
  max-width: 500px;
  transition: all 3s cubic-bezier(0.4, 0, 0.2, 1);
  opacity: 1;
  transform: scale(1);
}

.thought-sun.fading .thought-text {
  opacity: 0;
  transform: scale(0.7);
  filter: blur(8px);
}

/* Slogan Animation - Scales up gradually */
.message {
  margin: 40px auto 30px;
  font-size: 26px;
  font-weight: 600;
  opacity: 0.95;
  color: #e0f2fe;
  text-shadow: 0 2px 10px rgba(96, 165, 250, 0.3);
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  letter-spacing: 0.5px;
}

/* Slogan transition effects */
.slogan-enter-active {
  animation: sloganEnter 2s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.slogan-leave-active {
  animation: sloganLeave 1s ease-out;
}

@keyframes sloganEnter {
  0% {
    opacity: 0;
    transform: scale(0.5) translateY(20px);
  }
  50% {
    opacity: 0.7;
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes sloganLeave {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(1.2);
  }
}

.timer {
  width: 130px;
  margin: 20px auto;
  opacity: 0.9;
}

.circular-chart {
  width: 100%;
  height: auto;
  filter: drop-shadow(0 4px 12px rgba(96, 165, 250, 0.3));
}

.circle-bg {
  fill: none;
  stroke: rgba(31, 41, 55, 0.6);
  stroke-width: 3.8;
}

.circle {
  fill: none;
  stroke-width: 3.8;
  stroke-linecap: round;
  stroke: #60a5fa;
  transform: rotate(-90deg);
  transform-origin: center;
  transition: stroke-dasharray 0.3s ease;
}

.percentage {
  fill: #e6eef8;
  font-size: 8px;
  text-anchor: middle;
  font-weight: 600;
}

.footer {
  font-size: 13px;
  opacity: 0.5;
  margin-top: 16px;
  transition: opacity 0.3s;
}

.footer:hover {
  opacity: 0.8;
}

/* Fade transition for form */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .panel {
    padding: 24px;
  }
  
  .title {
    font-size: 20px;
  }
  
  .thought-text {
    font-size: 20px;
    padding: 0 20px;
  }
  
  .message {
    font-size: 20px;
    margin: 30px auto 20px;
  }
  
  .sun-glow {
    width: 200px;
    height: 200px;
  }
}
</style>