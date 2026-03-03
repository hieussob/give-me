<template>
  <div class="app">
    <!-- <PeachBlossomField :running="running" /> -->
    <SproutField :running="running" />

    <!-- <StarField :running="running" /> -->
    <!-- Back button -->
    <router-link to="/" class="back-button">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      <span>Trang chủ</span>
    </router-link>

    <!-- Message Form -->
    <transition name="fade">
      <MessageForm v-if="showForm" @close="showForm = false" />
    </transition>

    <main class="panel" :class="{ 'meditation-mode': running }">
      <h1 class="title" v-if="!running">Pixel Thoughts</h1>

      <div v-if="!running" class="input-area">
        <textarea 
          v-model="thought" 
          placeholder="Type something that's on your mind..." 
          rows="3"
          class="thought-input"
        ></textarea>
        <div class="controls">
          <label class="fade-check" style="opacity: 0;">
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
import { ref, computed, onBeforeUnmount } from 'vue'
import StarField from '../components/StarField.vue'
import PeachBlossomField from '../components/PeachBlossomField.vue'
import SproutField from '../components/SproutField.vue'
import MessageForm from '../components/MessageForm.vue'

const thought = ref('')
const displayThought = ref('')
const running = ref(false)
const fadeOut = ref(true)
const thoughtFading = ref(false)
const duration = 60
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

  // Bật nhạc khi bắt đầu meditation
  window.dispatchEvent(new CustomEvent('play-music'))

  if (fadeOut.value) {
    setTimeout(() => thoughtFading.value = true, 2000)
    setTimeout(() => {
      displayThought.value = ''
      thought.value = ''
    }, 5000)
  }

  timer = setInterval(() => {
    if (secondsLeft.value > 0) secondsLeft.value--
    else stopMeditation()
  }, 1000)

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
@import '../styles/meditation.css';
</style>
