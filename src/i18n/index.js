import { ref, computed } from 'vue'
import { translations } from './translations'

const currentLanguage = ref(localStorage.getItem('language') || 'vi')

export function useI18n() {
  const t = computed(() => {
    return (key) => {
      return translations[currentLanguage.value][key] || key
    }
  })

  const setLanguage = (lang) => {
    currentLanguage.value = lang
    localStorage.setItem('language', lang)
  }

  const currentLang = computed(() => currentLanguage.value)

  return {
    t,
    setLanguage,
    currentLang
  }
}
