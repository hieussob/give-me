<template>
  <div class="audio-player">
    <button type="button" @click="togglePlay" class="audio-btn" :class="{ playing: isPlaying }" :title="isPlaying ? 'Tạm dừng nhạc' : 'Phát nhạc'">
      <!-- Music bars when playing -->
      <div v-if="isPlaying" class="music-bars">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </div>
      <!-- Play icon when paused -->
      <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
      </svg>
    </button>

    <audio ref="audioRef" loop>
      <source :src="audioSrc" type="audio/mpeg">
    </audio>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const audioRef = ref(null)
const isPlaying = ref(false)
const audioSrc = '/ahihi.mp3'

let fadeInTimer = null
let removeAudioStateListeners = null
let removeFirstInteractionListeners = null

const playOnFirstInteraction = async (event) => {
  const audio = audioRef.value
  if (!audio || isPlaying.value) return

  const target = event?.target
  if (target && typeof target.closest === 'function' && target.closest('.audio-player')) {
    return
  }

  try {
    await audio.play()
    fadeInVolume()
    syncPlayingState()
    if (removeFirstInteractionListeners) {
      removeFirstInteractionListeners()
      removeFirstInteractionListeners = null
    }
  } catch (err) {
    syncPlayingState()
  }
}

const bindFirstInteractionListeners = () => {
  const options = { passive: true }
  document.addEventListener('click', playOnFirstInteraction, options)
  document.addEventListener('touchstart', playOnFirstInteraction, options)
  document.addEventListener('pointerdown', playOnFirstInteraction, options)

  removeFirstInteractionListeners = () => {
    document.removeEventListener('click', playOnFirstInteraction, options)
    document.removeEventListener('touchstart', playOnFirstInteraction, options)
    document.removeEventListener('pointerdown', playOnFirstInteraction, options)
  }
}

const handlePageShow = () => { syncPlayingState() }
const handleVisibilityChange = () => { syncPlayingState() }

const syncPlayingState = () => {
  const audio = audioRef.value
  isPlaying.value = !!(audio && !audio.paused && !audio.ended)
}

const bindAudioStateListeners = () => {
  const audio = audioRef.value
  if (!audio) return

  const onPlay = () => { isPlaying.value = true }
  const onPauseLike = () => { isPlaying.value = false }

  audio.addEventListener('play', onPlay)
  audio.addEventListener('playing', onPlay)
  audio.addEventListener('pause', onPauseLike)
  audio.addEventListener('ended', onPauseLike)
  audio.addEventListener('error', onPauseLike)
  audio.addEventListener('emptied', onPauseLike)
  audio.addEventListener('abort', onPauseLike)

  removeAudioStateListeners = () => {
    audio.removeEventListener('play', onPlay)
    audio.removeEventListener('playing', onPlay)
    audio.removeEventListener('pause', onPauseLike)
    audio.removeEventListener('ended', onPauseLike)
    audio.removeEventListener('error', onPauseLike)
    audio.removeEventListener('emptied', onPauseLike)
    audio.removeEventListener('abort', onPauseLike)
  }
}

const togglePlay = async () => {
  const audio = audioRef.value
  if (!audio) return

  if (!audio.paused && !audio.ended) {
    audio.pause()
    syncPlayingState()
  } else {
    try {
      await audio.play()
      fadeInVolume()
    } catch (err) {
      console.error('Không thể phát nhạc:', err)
    } finally {
      syncPlayingState()
    }
  }
}

const fadeInVolume = () => {
  if (!audioRef.value) return
  if (fadeInTimer) clearInterval(fadeInTimer)

  audioRef.value.volume = 0
  let vol = 0
  fadeInTimer = setInterval(() => {
    if (vol < 1) {
      vol += 0.1
      if (!audioRef.value) { clearInterval(fadeInTimer); fadeInTimer = null; return }
      audioRef.value.volume = Math.min(vol, 1)
    } else {
      clearInterval(fadeInTimer)
      fadeInTimer = null
    }
  }, 100)
}

const playMusic = () => {
  if (audioRef.value && !isPlaying.value) {
    audioRef.value.play().then(() => {
      fadeInVolume()
      syncPlayingState()
    }).catch(err => {
      console.error('Không thể phát nhạc:', err)
      syncPlayingState()
    })
  }
}

const pauseMusic = () => {
  if (audioRef.value && isPlaying.value) {
    audioRef.value.pause()
    syncPlayingState()
  }
}

defineExpose({ playMusic, pauseMusic })

onMounted(() => {
  if (audioRef.value) {
    bindAudioStateListeners()
    bindFirstInteractionListeners()
    audioRef.value.muted = false
    audioRef.value.pause()
    audioRef.value.currentTime = 0
    syncPlayingState()
  }

  window.addEventListener('play-music', playMusic)
  window.addEventListener('stop-music', pauseMusic)
  window.addEventListener('pageshow', handlePageShow)
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onBeforeUnmount(() => {
  if (removeAudioStateListeners) { removeAudioStateListeners(); removeAudioStateListeners = null }
  if (removeFirstInteractionListeners) { removeFirstInteractionListeners(); removeFirstInteractionListeners = null }
  if (fadeInTimer) { clearInterval(fadeInTimer); fadeInTimer = null }
  if (audioRef.value) audioRef.value.pause()
  window.removeEventListener('play-music', playMusic)
  window.removeEventListener('stop-music', pauseMusic)
  window.removeEventListener('pageshow', handlePageShow)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})
</script>

<style scoped>
.audio-player {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
}

.audio-btn {
  width: 52px;
  height: 52px;
  border-radius: 16px;
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.2);
  color: #34d399;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.05);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  backdrop-filter: blur(12px);
  position: relative;
  overflow: hidden;
}

.audio-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.12) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.audio-btn:hover {
  transform: translateY(-3px) scale(1.05);
  border-color: rgba(16, 185, 129, 0.4);
  box-shadow:
    0 12px 32px rgba(0, 0, 0, 0.4),
    0 0 20px rgba(16, 185, 129, 0.15);
  color: #6ee7b7;
  background: rgba(16, 185, 129, 0.12);
}

.audio-btn:hover::before { opacity: 1; }

.audio-btn.playing {
  border-color: rgba(16, 185, 129, 0.4);
  background: rgba(16, 185, 129, 0.15);
  box-shadow:
    0 8px 24px rgba(0, 0, 0, 0.4),
    0 0 24px rgba(16, 185, 129, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

/* Music Bars Animation */
.music-bars {
  display: flex;
  align-items: flex-end;
  gap: 3px;
  height: 22px;
}

.bar {
  display: block;
  width: 3px;
  border-radius: 2px;
  background: #34d399;
  animation: barDance 0.8s ease-in-out infinite;
}

.bar:nth-child(1) { height: 8px;  animation-delay: 0s; }
.bar:nth-child(2) { height: 18px; animation-delay: 0.15s; }
.bar:nth-child(3) { height: 12px; animation-delay: 0.3s; }
.bar:nth-child(4) { height: 6px;  animation-delay: 0.1s; }

@keyframes barDance {
  0%, 100% { transform: scaleY(0.4); opacity: 0.6; }
  50%       { transform: scaleY(1);   opacity: 1; }
}

@media (max-width: 768px) {
  .audio-player {
    bottom: 1.25rem;
    right: 1.25rem;
  }
  .audio-btn {
    width: 46px;
    height: 46px;
    border-radius: 14px;
  }
}
</style>
