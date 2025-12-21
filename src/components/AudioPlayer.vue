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
// Using a direct MP3 link - you can replace this with your own audio file
const audioSrc = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'

const togglePlay = () => {
  if (!audioRef.value) return
  
  if (isPlaying.value) {
    audioRef.value.pause()
  } else {
    audioRef.value.play()
  }
  isPlaying.value = !isPlaying.value
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

// Expose playMusic để component cha có thể gọi
defineExpose({ playMusic })

// Auto play when mounted (with user interaction required)
onMounted(() => {
  if (audioRef.value) {
    // Try to autoplay, but it may be blocked by browser policy
    audioRef.value.play().then(() => {
      isPlaying.value = true
    }).catch(() => {
      // Autoplay was prevented, user needs to click play button
      isPlaying.value = false
    })
  }
  
  // Lắng nghe sự kiện bật nhạc từ MessageForm
  window.addEventListener('play-music', playMusic)
})

// Cleanup khi component unmount
onBeforeUnmount(() => {
  window.removeEventListener('play-music', playMusic)
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
