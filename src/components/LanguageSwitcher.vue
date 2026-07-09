<template>
  <div class="language-switcher">
    <button
      @click="toggleLanguage"
      class="lang-btn"
      :title="currentLang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'"
    >
      <span class="lang-flag">{{ currentLang === 'vi' ? '🇻🇳' : '🇬🇧' }}</span>
      <span class="lang-text">{{ currentLang.toUpperCase() }}</span>
      <svg class="lang-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M7 10l5 5 5-5"/>
      </svg>
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
  gap: 6px;
  padding: 0.55rem 0.9rem;
  background: rgba(16, 185, 129, 0.08);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
  color: #34d399;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}

.lang-flag {
  font-size: 1rem;
  line-height: 1;
}

.lang-text {
  font-size: 0.75rem;
  font-weight: 700;
}

.lang-chevron {
  opacity: 0.7;
  transition: transform 0.3s ease;
}

.lang-btn:hover {
  background: rgba(16, 185, 129, 0.15);
  border-color: rgba(16, 185, 129, 0.4);
  color: #6ee7b7;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
}

.lang-btn:hover .lang-chevron {
  transform: rotate(180deg);
  opacity: 1;
}

@media (max-width: 768px) {
  .language-switcher {
    bottom: 5.5rem;
    right: 1.25rem;
  }

  .lang-btn {
    padding: 0.45rem 0.75rem;
    gap: 5px;
    border-radius: 10px;
  }

  .lang-flag { font-size: 0.9rem; }
  .lang-text  { font-size: 0.7rem; }
}
</style>
