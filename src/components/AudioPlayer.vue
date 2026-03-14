<template>
  <div class="audio-player">
    <button @click="togglePlay" class="audio-btn" :class="{ playing: isPlaying }">
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
const hasTriedAutoplay = ref(false)
// Using local audio file
const audioSrc = '/ahihi.mp3'

const togglePlay = () => {
  if (!audioRef.value) return
  
  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play()
  }
  isPlaying.value = !isPlaying.value
}

// Hàm để set volume (bắt đầu từ 0 rồi tăng dần)
const fadeInVolume = () => {
  if (!audioRef.value) return
  audioRef.value.volume = 0
  let vol = 0
  const fadeIn = setInterval(() => {
    if (vol < 1) {
      vol += 0.1
      audioRef.value.volume = Math.min(vol, 1)
    } else {
      clearInterval(fadeIn)
    }
  }, 100)
}

// Hàm để bật nhạc từ bên ngoài
const playMusic = () => {
  if (audioRef.value && !isPlaying.value) {
    audioRef.value.play().then(() => {
      isPlaying.value = true
    }).catch(err => {
      console.error('Không thể phát nhạc:', err)
    })
  }
}

// Hàm để tắt nhạc từ bên ngoài
const pauseMusic = () => {
  if (audioRef.value && isPlaying.value) {
    audioRef.value.pause()
    isPlaying.value = false
  }
}

// Expose playMusic và pauseMusic để component cha có thể gọi
defineExpose({ playMusic, pauseMusic })

// Hàm để tự động phát nhạc khi có tương tác đầu tiên
const tryAutoplayOnInteraction = () => {
  if (!hasTriedAutoplay.value && audioRef.value && !isPlaying.value) {
    audioRef.value.muted = false
    audioRef.value.play().then(() => {
      isPlaying.value = true
      hasTriedAutoplay.value = true
      fadeInVolume()
      // Remove event listeners sau khi đã phát thành công
      document.removeEventListener('click', tryAutoplayOnInteraction)
      document.removeEventListener('touchstart', tryAutoplayOnInteraction)
      document.removeEventListener('keydown', tryAutoplayOnInteraction)
      document.removeEventListener('mousemove', tryAutoplayOnInteraction)
      document.removeEventListener('scroll', tryAutoplayOnInteraction)
    }).catch(() => {
      // Still blocked, keep listeners active
    })
  }
}

// Auto play when mounted (with user interaction required)
onMounted(() => {
  if (audioRef.value) {
    // Chiến lược 1: Thử play với muted=true trước
    audioRef.value.muted = true
    audioRef.value.play().then(() => {
      // Nếu play được với muted, thử unmute ngay
      setTimeout(() => {
        audioRef.value.muted = false
        isPlaying.value = true
        hasTriedAutoplay.value = true
        fadeInVolume()
      }, 100)
    }).catch(() => {
      // Chiến lược 2: Không được với muted, thử unmute và play
      audioRef.value.muted = false
      audioRef.value.play().then(() => {
        isPlaying.value = true
        hasTriedAutoplay.value = true
        fadeInVolume()
      }).catch(() => {
        // Chiến lược 3: Autoplay bị chặn hoàn toàn, đợi user tương tác
        isPlaying.value = false
        // Thêm nhiều loại event listeners để catch bất kỳ tương tác nào
        document.addEventListener('click', tryAutoplayOnInteraction, { once: false })
        document.addEventListener('touchstart', tryAutoplayOnInteraction, { once: false })
        document.addEventListener('keydown', tryAutoplayOnInteraction, { once: false })
        document.addEventListener('mousemove', tryAutoplayOnInteraction, { once: true })
        document.addEventListener('scroll', tryAutoplayOnInteraction, { once: true })
      })
    })
  }
  
  // Lắng nghe sự kiện bật/tắt nhạc
  window.addEventListener('play-music', playMusic)
  window.addEventListener('stop-music', pauseMusic)
})

// Cleanup khi component unmount
onBeforeUnmount(() => {
  // Remove tất cả event listeners
  document.removeEventListener('click', tryAutoplayOnInteraction)
  document.removeEventListener('touchstart', tryAutoplayOnInteraction)
  document.removeEventListener('keydown', tryAutoplayOnInteraction)
  document.removeEventListener('mousemove', tryAutoplayOnInteraction)
  document.removeEventListener('scroll', tryAutoplayOnInteraction)
  window.removeEventListener('play-music', playMusic)
  window.removeEventListener('stop-music', pauseMusic)
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
