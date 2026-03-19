<template>
  <div class="pharmacy-container">
    <div class="content-wrapper">
      <!-- Header -->
      <div class="header">
        <!-- Hamburger Menu Button (Mobile only) -->
        <button type="button" @click="toggleSidebar" class="hamburger-btn" :class="{ 'hidden': sidebarOpen }">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12h18M3 6h18M3 18h18"/>
          </svg>
        </button>

        <router-link to="/" class="back-button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span>{{ t('home') }}</span>
        </router-link>
        
        <h1 class="title">{{ t('title') }}</h1>
        <p class="subtitle">{{ t('subtitle') }}</p>
      </div>

      <!-- Overlay (Mobile only) -->
      <div v-if="sidebarOpen" @click="closeSidebar" class="sidebar-overlay"></div>

      <!-- Main Content: 2 columns -->
      <div class="pharmacy-content">
        <!-- Left Sidebar: Categories -->
        <div class="sidebar" :class="{ 'open': sidebarOpen }">
          <h2 class="sidebar-title">{{ t('categories') }}</h2>
          
          <!-- Search Box -->
          <div class="search-box">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            <input 
              v-model="searchQuery" 
              type="text" 
              :placeholder="t('search')" 
              class="search-input"
            />
            <button type="button" v-if="searchQuery" @click="clearSearch" class="clear-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Mode Toggle -->
          <div class="mode-toggle">
            <button 
              type="button"
              @click="sortMode = 'alphabet'" 
              :class="['mode-btn', { active: sortMode === 'alphabet' }]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 6h16M4 12h16M4 18h7"/>
              </svg>
              <span>{{ t('sortByAlphabet') }}</span>
            </button>
            <button 
              type="button"
              @click="sortMode = 'family'" 
              :class="['mode-btn', { active: sortMode === 'family' }]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span>{{ t('sortByFamily') }}</span>
            </button>
          </div>

          <div class="category-list">
            <button 
              type="button"
              v-for="category in currentCategories" 
              :key="category.id"
              @click="selectCategory(category.id)"
              :class="['category-item', { active: selectedCategory === category.id }]"
            >
              <!-- Alphabet mode: show letter -->
              <span v-if="sortMode === 'alphabet'" class="category-letter">{{ category.letter }}</span>
              
              <!-- Family mode: show icon -->
              <span v-else class="category-icon">
                <i :class="category.icon"></i>
              </span>
              
              <div class="category-info">
                <span class="category-name">{{ category.name }}</span>
                <span class="category-count">{{ category.count }}</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Right Panel: Medicine List and Detail -->
        <div class="main-panel">
          <!-- Medicine Grid -->
          <div v-if="!selectedMedicine" class="medicine-list-wrapper">
            <!-- <div class="medicine-count-info">
              <span>{{ t('showing') }} {{ filteredMedicines.length }} {{ t('of') }} {{ allFilteredMedicines.length }} {{ t('medicines') }}</span>
            </div> -->
            <div class="medicine-grid">
              <div 
                v-for="(medicine, index) in filteredMedicines" 
                :key="medicine.id"
                @click="selectMedicine(medicine)"
                class="medicine-card"
              >
                <div 
                  class="medicine-image" 
                  :class="{ 'lazy-image': index >= 10 }"
                  :data-bg="medicine.image"
                  :style="index < 10 ? { backgroundImage: `url(${medicine.image})` } : {}"
                >
                  <div v-if="index >= 10" class="image-placeholder"></div>
                </div>
                <div class="medicine-info">
                  <h3 class="medicine-name">{{ medicine.name }}</h3>
                  <p class="medicine-scientific">{{ medicine.scientificName }}</p>
                  <p class="medicine-family">{{ medicine.family }}</p>
                  <button type="button" class="view-detail-btn">
                    <i class="fa-solid fa-circle-info"></i>
                    <span>{{ t('viewDetail') }}</span>
                  </button>
                </div>
              </div>
            </div>
            <div class="scroll-sentinel"></div>
            <div v-if="hasMore" class="loading-indicator">
              <div class="spinner"></div>
              <span>{{ t('loading') }}...</span>
            </div>
          </div>

          <!-- Medicine Detail -->
          <div v-else class="medicine-detail">
            <button type="button" @click="backToList" class="back-btn">
              <i class="fa-solid fa-arrow-left"></i>
              <span>{{ t('backToList') }}</span>
            </button>
            
            <div class="detail-content">
              <div class="detail-header">
                <div class="detail-image" :style="{ backgroundImage: `url(${selectedMedicine.image})` }"></div>
                <div class="detail-title-section">
                  <h2 class="detail-name">{{ selectedMedicine.name }}</h2>
                  <p class="detail-scientific">{{ selectedMedicine.scientificName }}</p>
                  <p class="detail-family">{{ selectedMedicine.family }}</p>
                </div>
              </div>

              <div class="detail-sections">
                <div class="detail-row">
                  <div class="detail-label">
                    <i class="fa-solid fa-seedling"></i>
                    <span>{{ t('usedParts') }}</span>
                  </div>
                  <div class="detail-value">{{ selectedMedicine.usedParts }}</div>
                </div>

                <div class="detail-row">
                  <div class="detail-label">
                    <i class="fa-solid fa-temperature-half"></i>
                    <span>{{ t('properties') }}</span>
                  </div>
                  <div class="detail-value">{{ selectedMedicine.properties }}</div>
                </div>

                <div class="detail-row">
                  <div class="detail-label">
                    <i class="fa-solid fa-yin-yang"></i>
                    <span>{{ t('meridians') }}</span>
                  </div>
                  <div class="detail-value">{{ selectedMedicine.meridians }}</div>
                </div>

                <div class="detail-row">
                  <div class="detail-label">
                    <i class="fa-solid fa-flask"></i>
                    <span>{{ t('mainIngredients') }}</span>
                  </div>
                  <div class="detail-value">
                    <ul>
                      <li v-for="(ingredient, index) in selectedMedicine.mainIngredients" :key="index">
                        {{ ingredient }}
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="detail-label">
                    <i class="fa-solid fa-heart-pulse"></i>
                    <span>{{ t('uses') }}</span>
                  </div>
                  <div class="detail-value">
                    <ul>
                      <li v-for="(use, index) in selectedMedicine.uses" :key="index">
                        {{ use }}
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="detail-label">
                    <i class="fa-solid fa-notes-medical"></i>
                    <span>{{ t('indications') }}</span>
                  </div>
                  <div class="detail-value">
                    <ul>
                      <li v-for="(indication, index) in selectedMedicine.indications" :key="index">
                        {{ indication }}
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="detail-label">
                    <i class="fa-solid fa-pills"></i>
                    <span>{{ t('dosage') }}</span>
                  </div>
                  <div class="detail-value">{{ selectedMedicine.dosage }}</div>
                </div>

                <div class="detail-row">
                  <div class="detail-label">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <span>{{ t('contraindications') }}</span>
                  </div>
                  <div class="detail-value">
                    <ul>
                      <li v-for="(contra, index) in selectedMedicine.contraindications" :key="index">
                        {{ contra }}
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="detail-label">
                    <i class="fa-solid fa-location-dot"></i>
                    <span>{{ t('origin') }}</span>
                  </div>
                  <div class="detail-value">{{ selectedMedicine.origin }}</div>
                </div>

                <div class="detail-row description">
                  <div class="detail-label">
                    <i class="fa-solid fa-book-open"></i>
                    <span>{{ t('description') }}</span>
                  </div>
                  <div class="detail-value">{{ selectedMedicine.description }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { getMedicineData, loadMedicineData } from '../data/index.js'
import { useI18n } from '../i18n'

const { t, currentLang } = useI18n()

// Reactive medicine data — starts with current language (sync), switches async on language change
const rawMedicineData = ref(getMedicineData(currentLang.value))
const alphabetCategories = computed(() => rawMedicineData.value.alphabetCategories)
const familyCategories = computed(() => rawMedicineData.value.familyCategories)
const medicines = computed(() => rawMedicineData.value.medicines)

const selectedCategory = ref('all')
const selectedMedicine = ref(null)
const sidebarOpen = ref(false)
const searchQuery = ref('')
const sortMode = ref('alphabet') // 'alphabet' or 'family'

// Enrich medicines with firstLetter without mutating source data
const enrichedMedicines = computed(() =>
  medicines.value.map(m => ({
    ...m,
    firstLetter: m.firstLetter || m.name.charAt(0).toUpperCase()
  }))
)

const itemsPerPage = ref(20)
const currentPage = ref(1)
const imageObserver = ref(null)
const scrollObserver = ref(null)
const isLoadingMore = ref(false)
let setupTimer = null
let loadMoreTimer = null

// Reset selected category when switching mode
watch(sortMode, () => {
  selectedCategory.value = 'all'
  selectedMedicine.value = null
  currentPage.value = 1
})

// Debounced search term — filter only runs after user stops typing for 200ms
const debouncedSearch = ref('')
let searchDebounceTimer = null
watch(searchQuery, (val) => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
  searchDebounceTimer = setTimeout(() => {
    debouncedSearch.value = val
    currentPage.value = 1
  }, 200)
})

const currentCategories = computed(() => {
  return sortMode.value === 'alphabet' ? alphabetCategories.value : familyCategories.value
})

const allFilteredMedicines = computed(() => {
  let result = enrichedMedicines.value

  // Filter by search query
  if (debouncedSearch.value.trim()) {
    const query = debouncedSearch.value.toLowerCase()
    result = result.filter(m =>
      m.name.toLowerCase().includes(query) ||
      m.scientificName.toLowerCase().includes(query) ||
      m.family.toLowerCase().includes(query)
    )
  }

  // Filter by selected category
  if (selectedCategory.value !== 'all') {
    if (sortMode.value === 'alphabet') {
      const selectedLetter = alphabetCategories.value.find(c => c.id === selectedCategory.value)?.letter
      result = result.filter(m => m.firstLetter === selectedLetter)
    } else {
      result = result.filter(m => m.categoryId === selectedCategory.value)
    }
  }

  return result
})

// Paginated medicines
const filteredMedicines = computed(() => {
  const start = 0
  const end = currentPage.value * itemsPerPage.value
  return allFilteredMedicines.value.slice(start, end)
})

const hasMore = computed(() => {
  return filteredMedicines.value.length < allFilteredMedicines.value.length
})

const totalPages = computed(() => {
  return Math.ceil(allFilteredMedicines.value.length / itemsPerPage.value)
})

const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
  selectedMedicine.value = null // Reset selection when changing category
  currentPage.value = 1 // Reset pagination
  closeSidebar() // Close sidebar after selecting category on mobile
}

const loadMore = () => {
  if (hasMore.value && !isLoadingMore.value) {
    isLoadingMore.value = true
    currentPage.value++
    if (loadMoreTimer) clearTimeout(loadMoreTimer)
    loadMoreTimer = setTimeout(() => {
      isLoadingMore.value = false
    }, 300)
  }
}

const scrollToTop = () => {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }
}

const selectMedicine = (medicine) => {
  selectedMedicine.value = medicine
  scrollToTop()
}

const backToList = () => {
  selectedMedicine.value = null
  scrollToTop()
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const clearSearch = () => {
  searchQuery.value = ''
  // Cancel any pending debounce and clear immediately
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
  debouncedSearch.value = ''
  currentPage.value = 1
}

// Lazy loading images
const setupLazyLoading = () => {
  try {
    const images = document.querySelectorAll('.lazy-image:not(.loaded)')
    
    if (images.length === 0) return
    
    if (imageObserver.value) {
      imageObserver.value.disconnect()
    }

    imageObserver.value = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          const bgUrl = img.getAttribute('data-bg')
          if (bgUrl) {
            // Set background image
            img.style.backgroundImage = `url(${bgUrl})`
            // Mark as loaded
            img.classList.add('loaded')
            imageObserver.value.unobserve(img)
          }
        }
      })
    }, {
      rootMargin: '200px' // Load images earlier
    })

    images.forEach(img => imageObserver.value.observe(img))
  } catch (error) {
    console.error('Lazy loading setup error:', error)
  }
}

// Infinite scroll
const setupInfiniteScroll = () => {
  try {
    const sentinel = document.querySelector('.scroll-sentinel')
    
    if (!sentinel) return
    
    if (scrollObserver.value) {
      scrollObserver.value.disconnect()
    }

    scrollObserver.value = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && hasMore.value && !isLoadingMore.value) {
          loadMore()
        }
      })
    }, {
      rootMargin: '200px'
    })

    scrollObserver.value.observe(sentinel)
  } catch (error) {
    console.error('Infinite scroll setup error:', error)
  }
}

// Setup lazy loading after DOM updates
watch(filteredMedicines, async () => {
  if (setupTimer) clearTimeout(setupTimer)
  setupTimer = setTimeout(async () => {
    await nextTick()
    setupLazyLoading()
    setupInfiniteScroll()
  }, 100)
})

onMounted(async () => {
  await nextTick()
  setupLazyLoading()
  setupInfiniteScroll()
})

onUnmounted(() => {
  if (setupTimer) {
    clearTimeout(setupTimer)
    setupTimer = null
  }
  if (loadMoreTimer) {
    clearTimeout(loadMoreTimer)
    loadMoreTimer = null
  }
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer)
    searchDebounceTimer = null
  }
  if (imageObserver.value) {
    imageObserver.value.disconnect()
  }
  if (scrollObserver.value) {
    scrollObserver.value.disconnect()
  }
})

// Watch for language changes and reload data + reset selections
watch(currentLang, async (lang) => {
  rawMedicineData.value = await loadMedicineData(lang)
  selectedCategory.value = 'all'
  selectedMedicine.value = null
  searchQuery.value = ''
  currentPage.value = 1
})
</script>

<style scoped>
.pharmacy-container {
  width: 100%;
  min-height: 100vh;
  background: 
    linear-gradient(135deg, rgba(26, 47, 31, 0.95) 0%, rgba(15, 31, 21, 0.98) 100%),
    radial-gradient(circle at 30% 20%, rgba(76, 175, 80, 0.15) 0%, transparent 60%),
    radial-gradient(circle at 70% 80%, rgba(102, 187, 106, 0.12) 0%, transparent 50%),
    linear-gradient(to bottom, #0a1810, #1a2f1f);
  position: relative;
  overflow: hidden;
  overflow-anchor: none;
}

.pharmacy-container::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234caf50' fill-opacity='0.04'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 1;
  animation: subtleMove 40s ease-in-out infinite;
}

@keyframes subtleMove {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(10px, 10px);
  }
}

.pharmacy-container::after {
  content: '';
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 15% 15%, rgba(129, 199, 132, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 85% 85%, rgba(76, 175, 80, 0.06) 0%, transparent 40%),
    radial-gradient(circle at 50% 50%, rgba(102, 187, 106, 0.05) 0%, transparent 60%);
  pointer-events: none;
  z-index: 1;
}

.content-wrapper {
  position: relative;
  z-index: 2;
  padding: 1.5rem;
  max-width: 1600px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 2.5rem;
  position: relative;
  padding: 2rem 0;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.back-button {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  color: white;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-5px);  /* Desktop: hover sang trái */
}

/* Hamburger Menu Button (Hidden on desktop) */
.hamburger-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 0.875rem;
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 12px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  opacity: 1;
}

.hamburger-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.hamburger-btn.hidden {
  opacity: 0;
  pointer-events: none;
}

/* Sidebar Overlay (Mobile only) */
.sidebar-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 998;
}

.title {
  font-size: 3rem;
  font-weight: 700;
  color: #7adf86;
  margin-bottom: 0.75rem;
  letter-spacing: -0.02em;
  font-family: inherit;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.75);
  font-weight: 400;
  letter-spacing: 0.01em;
}

.pharmacy-content {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 2rem;
  align-items: start;
}

/* Sidebar Styles */
.sidebar {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  padding: 2rem 1.5rem;
  /* border: 1px solid rgba(255, 255, 255, 0.15); */
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 1.5rem;
  max-height: calc(100vh - 3rem);
  overflow-y: auto;
}

.sidebar-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(76, 175, 80, 0.3);
  letter-spacing: -0.01em;
}

/* Search Box */
.search-box {
  position: relative;
  margin-bottom: 1rem;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.5);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 2.75rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: white;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.search-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(76, 175, 80, 0.6);
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.clear-btn {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  padding: 0.25rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.clear-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

/* Mode Toggle */
.mode-toggle {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 0.35rem;
  border-radius: 10px;
}

.mode-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.6rem 0.75rem;
  background: transparent;
  border: none;
  border-radius: 7px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mode-btn:hover {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.05);
}

.mode-btn.active {
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.4);
}

.mode-btn svg {
  width: 16px;
  height: 16px;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.category-item {
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.125rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: white;
  text-align: left;
}

.category-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.category-item.active {
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  border-color: transparent;
  transform: translateX(5px);
}

.category-letter {
  font-size: 1.5rem;
  font-weight: 700;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.category-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.category-item.active .category-letter {
  background: rgba(255, 255, 255, 0.2);
}

.category-info {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
  flex: 1;
}

.category-name {
  font-size: 0.95rem;
  font-weight: 500;
}

.category-count {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.5);
}

.category-item.active .category-count {
  color: rgba(255, 255, 255, 0.8);
}

/* Main Panel Styles */
.main-panel {
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  min-height: 700px;
}

.medicine-list-wrapper {
  width: 100%;
}

.medicine-count-info {
  margin-bottom: 1.5rem;
  padding: 1rem 1.5rem;
  background: rgba(76, 175, 80, 0.1);
  border-radius: 10px;
  text-align: center;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(76, 175, 80, 0.3);
}

/* Medicine Grid */
.medicine-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.medicine-card {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  position: relative;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.medicine-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  padding: 2px;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.5), rgba(102, 187, 106, 0.5));
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.medicine-card:hover::before {
  opacity: 1;
}

.medicine-card:hover {
  transform: translateY(-12px);
  box-shadow: 0 20px 48px rgba(76, 175, 80, 0.35);
  border-color: rgba(76, 175, 80, 0.6);
}

.medicine-image {
  width: 100%;
  height: 200px;
  background-size: cover;
  background-position: center;
  background-color: rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.lazy-image:not(.loaded) {
  background-image: none;
}

.lazy-image .image-placeholder {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.05) 25%,
    rgba(255, 255, 255, 0.1) 50%,
    rgba(255, 255, 255, 0.05) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

.lazy-image.loaded .image-placeholder {
  display: none;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.medicine-image::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(102, 187, 106, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.medicine-card:hover .medicine-image::after {
  opacity: 1;
}

.medicine-info {
  padding: 1.5rem;
}

.medicine-name {
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
  margin-bottom: 0.5rem;
  letter-spacing: -0.01em;
  line-height: 1.3;
}

.medicine-scientific {
  font-size: 0.85rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
}

.medicine-family {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 1rem;
}

.view-detail-btn {
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 100%);
  color: white;
  border: none;
  padding: 0.75rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.view-detail-btn i {
  font-size: 1rem;
  transition: transform 0.3s ease;
}

.view-detail-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(76, 175, 80, 0.5);
}

.view-detail-btn:hover i {
  transform: scale(1.2);
}

.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
  margin-bottom: 2rem;
}

.scroll-sentinel {
  height: 1px;
  visibility: hidden;
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin: 3rem 0 2rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(76, 175, 80, 0.2);
  border-top-color: rgba(76, 175, 80, 0.8);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.all-loaded {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin: 3rem 0 2rem;
  padding: 1rem;
  color: rgba(76, 175, 80, 0.9);
  font-size: 1rem;
  font-weight: 500;
}

.all-loaded i {
  font-size: 1.2rem;
}

.all-loaded i {
  font-size: 1.2rem;
}

/* Medicine Detail */
.medicine-detail {
  color: white;
}

.back-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  margin-bottom: 2rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.back-btn i {
  transition: transform 0.3s ease;
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-5px);
}

.back-btn:hover i {
  transform: translateX(-3px);
}

.detail-content {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.detail-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.detail-image {
  width: 300px;
  height: 300px;
  border-radius: 12px;
  background-size: cover;
  background-position: center;
  background-color: rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.detail-title-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.detail-name {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #4caf50 0%, #66bb6a 50%, #81c784 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.75rem;
}

.detail-scientific {
  font-size: 1.1rem;
  font-style: italic;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 0.5rem;
}

.detail-family {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.8);
}

.detail-sections {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-row {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1.5rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
  border-left: 3px solid rgba(76, 175, 80, 0.5);
  transition: all 0.3s ease;
}

.detail-row:hover {
  background: rgba(255, 255, 255, 0.05);
  border-left-color: rgba(76, 175, 80, 0.8);
  transform: translateX(5px);
}

.detail-row.description {
  grid-template-columns: 1fr;
}

.detail-label {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.detail-label i {
  font-size: 1.2rem;
  color: #4caf50;
  width: 24px;
  text-align: center;
}

.detail-value {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
}

.detail-value ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.detail-value li {
  padding-left: 1.5rem;
  position: relative;
  margin-bottom: 0.5rem;
}

.detail-value li::before {
  content: "•";
  position: absolute;
  left: 0;
  color: #4caf50;
  font-size: 1.5rem;
  line-height: 1;
}

/* Responsive Styles */
@media (max-width: 1200px) {
  .pharmacy-content {
    grid-template-columns: 300px 1fr;
    gap: 1.75rem;
  }

  .medicine-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.75rem;
  }
}

@media (max-width: 1024px) {
  .pharmacy-content {
    grid-template-columns: 280px 1fr;
    gap: 1.5rem;
  }

  .content-wrapper {
    padding: 1.25rem;
  }

  .title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .main-panel {
    padding: 2rem;
    min-height: 600px;
  }

  .medicine-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }

  .medicine-image {
    height: 180px;
  }

  .detail-header {
    flex-direction: column;
    gap: 1.5rem;
  }

  .detail-image {
    width: 100%;
    height: 250px;
  }

  .detail-row {
    grid-template-columns: 180px 1fr;
    gap: 1.25rem;
  }
}

@media (max-width: 768px) {
  /* Show hamburger button on mobile */
  .hamburger-btn {
    display: flex;
    padding: 0.625rem 1rem;
  }

  /* Show overlay when sidebar is open */
  .sidebar-overlay {
    display: block;
  }

  .pharmacy-content {
    grid-template-columns: 1fr;
  }

  .content-wrapper {
    padding: 1rem;
  }

  /* Sidebar mobile styles */
  .sidebar {
    position: fixed;
    top: 0;
    left: -100%;
    width: 85%;
    max-width: 320px;
    height: 100vh;
    max-height: 100vh;
    z-index: 999;
    transition: left 0.3s ease;
    box-shadow: 2px 0 12px rgba(0, 0, 0, 0.4);
    padding: 1.5rem 1.25rem;
  }

  .sidebar.open {
    left: 0;
  }

  .sidebar-title {
    font-size: 1.3rem;
    margin-bottom: 1.25rem;
  }

  .search-box {
    margin-bottom: 0.875rem;
  }

  .search-input {
    padding: 0.625rem 2.25rem 0.625rem 2.5rem;
    font-size: 0.875rem;
  }

  .mode-toggle {
    margin-bottom: 0.875rem;
  }

  .mode-btn {
    padding: 0.5rem 0.625rem;
    font-size: 0.8rem;
  }

  .mode-btn span {
    display: none;
  }

  .mode-btn svg {
    width: 18px;
    height: 18px;
  }

  .category-item {
    padding: 0.75rem 1rem;
    gap: 0.75rem;
  }

  .category-letter,
  .category-icon {
    width: 32px;
    height: 32px;
    font-size: 1.3rem;
  }

  .category-name {
    font-size: 0.9rem;
  }

  .category-count {
    font-size: 0.7rem;
  }

  .header {
    padding: 1.5rem 0;
    padding-top: 60px;
    margin-bottom: 2rem;
  }

  .title {
    font-size: 2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .back-button {
    position: absolute;
    top: 0.5rem;
    left: 0.5rem;
    right: auto;
    padding: 0.625rem 1rem;
  }

  .back-button:hover {
    transform: translateX(-5px);
  }

  .back-button span {
    display: none;
  }

  .main-panel {
    padding: 1.5rem;
    min-height: 500px;
  }

  .medicine-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.25rem;
  }

  .medicine-card {
    border-radius: 14px;
  }

  .medicine-image {
    height: 170px;
  }

  .medicine-info {
    padding: 1.25rem;
  }

  .medicine-name {
    font-size: 1.2rem;
  }

  .medicine-scientific {
    font-size: 0.8rem;
  }

  .medicine-family {
    font-size: 0.85rem;
  }

  .view-detail-btn {
    padding: 0.625rem 1rem;
    font-size: 0.85rem;
  }

  .medicine-count-info {
    font-size: 0.85rem;
    padding: 0.75rem 1rem;
  }

  .detail-header {
    gap: 1.25rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
  }

  .detail-image {
    height: 220px;
  }

  .detail-name {
    font-size: 1.75rem;
  }

  .detail-scientific {
    font-size: 1rem;
  }

  .detail-family {
    font-size: 0.95rem;
  }

  .detail-row {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    padding: 1rem;
  }

  .detail-label {
    font-size: 0.95rem;
  }

  .detail-value {
    font-size: 0.9rem;
  }

  .back-btn {
    padding: 0.625rem 1.25rem;
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
  }

  .loading-indicator,
  .all-loaded {
    margin: 2rem 0 1.5rem;
    font-size: 0.9rem;
  }

  .spinner {
    width: 35px;
    height: 35px;
  }
}

@media (max-width: 480px) {
  .hamburger-btn {
    padding: 0.5rem 0.75rem;
  }

  .hamburger-btn svg {
    width: 18px;
    height: 18px;
  }

  .content-wrapper {
    padding: 0.75rem;
  }

  .sidebar {
    width: 90%;
    max-width: 280px;
    padding: 1.25rem 1rem;
  }

  .sidebar-title {
    font-size: 1.2rem;
    margin-bottom: 1rem;
  }

  .search-input {
    padding: 0.5rem 2rem 0.5rem 2.25rem;
    font-size: 0.8rem;
  }

  .search-icon {
    width: 16px;
    height: 16px;
    left: 10px;
  }

  .mode-toggle {
    padding: 0.25rem;
  }

  .mode-btn {
    padding: 0.45rem 0.5rem;
  }

  .mode-btn svg {
    width: 16px;
    height: 16px;
  }

  .category-item {
    padding: 0.625rem 0.875rem;
  }

  .category-letter,
  .category-icon {
    width: 28px;
    height: 28px;
    font-size: 1.1rem;
  }

  .category-name {
    font-size: 0.85rem;
  }

  .header {
    padding: 1.25rem 0;
    padding-top: 50px;
    margin-bottom: 1.5rem;
  }

  .title {
    font-size: 1.75rem;
  }

  .subtitle {
    font-size: 0.9rem;
  }

  .back-button {
    top: 0.5rem;
    left: 0.5rem;
    right: auto;
    padding: 0.5rem 0.75rem;
  }

  .back-button svg {
    width: 18px;
    height: 18px;
  }

  .main-panel {
    padding: 1.25rem;
    border-radius: 16px;
  }

  .medicine-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .medicine-card {
    border-radius: 12px;
  }

  .medicine-image {
    height: 160px;
  }

  .medicine-info {
    padding: 1rem;
  }

  .medicine-name {
    font-size: 1.1rem;
    margin-bottom: 0.4rem;
  }

  .medicine-scientific {
    font-size: 0.75rem;
    margin-bottom: 0.4rem;
  }

  .medicine-family {
    font-size: 0.8rem;
    margin-bottom: 0.875rem;
  }

  .view-detail-btn {
    padding: 0.625rem 0.875rem;
    font-size: 0.8rem;
  }

  .detail-header {
    gap: 1rem;
    margin-bottom: 1.25rem;
    padding-bottom: 1.25rem;
  }

  .detail-image {
    height: 200px;
    border-radius: 10px;
  }

  .detail-name {
    font-size: 1.5rem;
  }

  .detail-scientific {
    font-size: 0.95rem;
  }

  .detail-family {
    font-size: 0.9rem;
  }

  .detail-row {
    padding: 0.875rem;
    gap: 0.625rem;
  }

  .detail-label {
    font-size: 0.9rem;
    gap: 0.5rem;
  }

  .detail-label i {
    font-size: 1.1rem;
    width: 20px;
  }

  .detail-value {
    font-size: 0.85rem;
    line-height: 1.5;
  }

  .detail-value li {
    padding-left: 1.25rem;
    margin-bottom: 0.4rem;
  }

  .back-btn {
    padding: 0.5rem 1rem;
    font-size: 0.85rem;
    margin-bottom: 1.25rem;
  }

  .loading-indicator,
  .all-loaded {
    margin: 1.5rem 0 1rem;
    font-size: 0.85rem;
  }

  .spinner {
    width: 30px;
    height: 30px;
    border-width: 2.5px;
  }
}

@media (max-width: 360px) {
  .title {
    font-size: 1.5rem;
  }

  .subtitle {
    font-size: 0.85rem;
  }

  .main-panel {
    padding: 1rem;
  }

  .medicine-image {
    height: 140px;
  }

  .medicine-name {
    font-size: 1rem;
  }

  .medicine-info {
    padding: 0.875rem;
  }

  .detail-name {
    font-size: 1.35rem;
  }

  .detail-image {
    height: 180px;
  }
}

/* Scrollbar Styles */
.sidebar::-webkit-scrollbar {
  width: 6px;
}

.sidebar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.sidebar::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.5);
  border-radius: 10px;
}

.sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.7);
}
</style>
