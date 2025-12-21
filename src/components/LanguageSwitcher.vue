<template>
  <div class="language-switcher">
    <button @click="toggleLanguage" class="lang-btn" :title="currentLang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
      <span class="lang-text">{{ currentLang.toUpperCase() }}</span>
    </button>
  </div>
</template>

<script setup>
import { useI18n } from '../i18n'

const { currentLang, setLanguage } = useI18n()

const toggleLanguage = () => {
  setLanguage(currentLang.value === 'vi' ? 'en' : 'vi')
}
</script>

<style scoped>
.language-switcher {
  position: fixed;
  bottom: 6rem;
  right: 2rem;
  z-index: 1000;
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: white;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.lang-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.lang-text {
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .language-switcher {
    bottom: 5rem;
    right: 1rem;
  }

  .lang-btn {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }

  .lang-btn svg {
    width: 18px;
    height: 18px;
  }
}
</style>
