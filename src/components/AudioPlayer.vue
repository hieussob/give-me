<template>
  <div class="audio-player">
    <button type="button" @click="togglePlay" class="audio-btn" :class="{ playing: isPlaying }">
      <svg v-if="!isPlaying" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z"/>
      </svg>
      <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
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
// Using local audio file
const audioSrc = '/ahihi.mp3'

let fadeInTimer = null
let removeAudioStateListeners = null
let removeFirstInteractionListeners = null

const playOnFirstInteraction = async (event) => {
  const audio = audioRef.value
  if (!audio || isPlaying.value) return

  // Skip clicks on the player itself to avoid double toggle with the button click handler.
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
    // Keep listeners active so the next user interaction can retry.
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

const handlePageShow = () => {
  syncPlayingState()
}

const handleVisibilityChange = () => {
  syncPlayingState()
}

const syncPlayingState = () => {
  const audio = audioRef.value
  isPlaying.value = !!(audio && !audio.paused && !audio.ended)
}

const bindAudioStateListeners = () => {
  const audio = audioRef.value
  if (!audio) return

  const onPlay = () => {
    isPlaying.value = true
  }

  const onPauseLike = () => {
    isPlaying.value = false
  }

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
      console.error('Khong the phat nhac:', err)
    } finally {
      syncPlayingState()
    }
  }
}

// Hàm để set volume (bắt đầu từ 0 rồi tăng dần)
const fadeInVolume = () => {
  if (!audioRef.value) return
  if (fadeInTimer) clearInterval(fadeInTimer)

  audioRef.value.volume = 0
  let vol = 0
  fadeInTimer = setInterval(() => {
    if (vol < 1) {
      vol += 0.1
      if (!audioRef.value) {
        clearInterval(fadeInTimer)
        fadeInTimer = null
        return
      }
      audioRef.value.volume = Math.min(vol, 1)
    } else {
      clearInterval(fadeInTimer)
      fadeInTimer = null
    }
  }, 100)
}

// Hàm để bật nhạc từ bên ngoài
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

// Hàm để tắt nhạc từ bên ngoài
const pauseMusic = () => {
  if (audioRef.value && isPlaying.value) {
    audioRef.value.pause()
    syncPlayingState()
  }
}

// Expose playMusic và pauseMusic để component cha có thể gọi
defineExpose({ playMusic, pauseMusic })

// Keep initial state paused; user explicitly clicks to play.
onMounted(() => {
  if (audioRef.value) {
    bindAudioStateListeners()
    bindFirstInteractionListeners()
    audioRef.value.muted = false
    audioRef.value.pause()
    audioRef.value.currentTime = 0
    syncPlayingState()
  }

  // Lắng nghe sự kiện bật/tắt nhạc
  window.addEventListener('play-music', playMusic)
  window.addEventListener('stop-music', pauseMusic)
  window.addEventListener('pageshow', handlePageShow)
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

// Cleanup khi component unmount
onBeforeUnmount(() => {
  if (removeAudioStateListeners) {
    removeAudioStateListeners()
    removeAudioStateListeners = null
  }
  if (removeFirstInteractionListeners) {
    removeFirstInteractionListeners()
    removeFirstInteractionListeners = null
  }
  if (fadeInTimer) {
    clearInterval(fadeInTimer)
    fadeInTimer = null
  }
  if (audioRef.value) {
    audioRef.value.pause()
  }
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
  width: 56px;
  height: 56px;
  border-radius: 50%;
  /* background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
   */
  background: linear-gradient(to bottom, #F7E7A9 0%, #FFD700 40%, #C9A227 70%, #A67C00 100%);

  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.audio-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 6px 30px rgba(102, 126, 234, 0.6);
}

.audio-btn.playing::before {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  animation: pulse 1.5s ease-out infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 1;
  }
  100% {
    transform: scale(1.4);
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .audio-player {
    bottom: 1rem;
    right: 1rem;
  }
  
  .audio-btn {
    width: 48px;
    height: 48px;
  }
}
</style>
