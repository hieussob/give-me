<template>
  <div class="pharmacy-container">
    <StarField />
    
    <div class="content-wrapper">
      <!-- Header -->
      <div class="header">
        <!-- Hamburger Menu Button (Mobile only) -->
        <button @click="toggleSidebar" class="hamburger-btn" :class="{ 'hidden': sidebarOpen }">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
            <button v-if="searchQuery" @click="clearSearch" class="clear-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Mode Toggle -->
          <div class="mode-toggle">
            <button 
              @click="sortMode = 'alphabet'" 
              :class="['mode-btn', { active: sortMode === 'alphabet' }]"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 6h16M4 12h16M4 18h7"/>
              </svg>
              <span>{{ t('sortByAlphabet') }}</span>
            </button>
            <button 
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
              v-for="category in currentCategories" 
              :key="category.id"
              @click="selectCategory(category.id)"
              :class="['category-item', { active: selectedCategory === category.id }]"
            >
              <!-- Alphabet mode: show letter -->
              <span v-if="sortMode === 'alphabet'" class="category-letter">{{ category.letter }}</span>
              
              <!-- Family mode: show icon -->
              <span v-else class="category-icon">{{ category.icon }}</span>
              
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
          <div v-if="!selectedMedicine" class="medicine-grid">
            <div 
              v-for="medicine in filteredMedicines" 
              :key="medicine.id"
              @click="selectMedicine(medicine)"
              class="medicine-card"
            >
              <div class="medicine-image" :style="{ backgroundImage: `url(${medicine.image})` }"></div>
              <div class="medicine-info">
                <h3 class="medicine-name">{{ medicine.name }}</h3>
                <p class="medicine-scientific">{{ medicine.scientificName }}</p>
                <p class="medicine-family">{{ medicine.family }}</p>
                <button class="view-detail-btn">Xem chi tiết →</button>
              </div>
            </div>
          </div>

          <!-- Medicine Detail -->
          <div v-else class="medicine-detail">
            <button @click="selectedMedicine = null" class="back-btn">← Quay lại</button>
            
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
                  <div class="detail-label">Bộ phận dùng:</div>
                  <div class="detail-value">{{ selectedMedicine.usedParts }}</div>
                </div>

                <div class="detail-row">
                  <div class="detail-label">Tính vị:</div>
                  <div class="detail-value">{{ selectedMedicine.properties }}</div>
                </div>

                <div class="detail-row">
                  <div class="detail-label">Quy kinh:</div>
                  <div class="detail-value">{{ selectedMedicine.meridians }}</div>
                </div>

                <div class="detail-row">
                  <div class="detail-label">Thành phần chính:</div>
                  <div class="detail-value">
                    <ul>
                      <li v-for="(ingredient, index) in selectedMedicine.mainIngredients" :key="index">
                        {{ ingredient }}
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="detail-label">Công dụng:</div>
                  <div class="detail-value">
                    <ul>
                      <li v-for="(use, index) in selectedMedicine.uses" :key="index">
                        {{ use }}
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="detail-label">Chỉ định:</div>
                  <div class="detail-value">
                    <ul>
                      <li v-for="(indication, index) in selectedMedicine.indications" :key="index">
                        {{ indication }}
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="detail-label">Liều dùng:</div>
                  <div class="detail-value">{{ selectedMedicine.dosage }}</div>
                </div>

                <div class="detail-row">
                  <div class="detail-label">Chống chỉ định:</div>
                  <div class="detail-value">
                    <ul>
                      <li v-for="(contra, index) in selectedMedicine.contraindications" :key="index">
                        {{ contra }}
                      </li>
                    </ul>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="detail-label">Nguồn gốc:</div>
                  <div class="detail-value">{{ selectedMedicine.origin }}</div>
                </div>

                <div class="detail-row description">
                  <div class="detail-label">Mô tả:</div>
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
import { ref, computed, watch } from 'vue'
import StarField from '../components/StarField.vue'
import { alphabetCategories, familyCategories, medicines } from '../data/medicineData.js'
import { useI18n } from '../i18n'

const { t } = useI18n()

const selectedCategory = ref('all')
const selectedMedicine = ref(null)
const sidebarOpen = ref(false)
const searchQuery = ref('')
const sortMode = ref('alphabet') // 'alphabet' or 'family'

// Add firstLetter property to medicines if not exist
medicines.forEach(medicine => {
  if (!medicine.firstLetter) {
    medicine.firstLetter = medicine.name.charAt(0).toUpperCase()
  }
})

// Reset selected category when switching mode
watch(sortMode, () => {
  selectedCategory.value = 'all'
  selectedMedicine.value = null
})

const currentCategories = computed(() => {
  return sortMode.value === 'alphabet' ? alphabetCategories : familyCategories
})

const filteredMedicines = computed(() => {
  let result = medicines

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(m => 
      m.name.toLowerCase().includes(query) ||
      m.scientificName.toLowerCase().includes(query) ||
      m.family.toLowerCase().includes(query)
    )
  }

  // Filter by selected category
  if (selectedCategory.value !== 'all') {
    if (sortMode.value === 'alphabet') {
      const selectedLetter = alphabetCategories.find(c => c.id === selectedCategory.value)?.letter
      result = result.filter(m => m.firstLetter === selectedLetter)
    } else {
      result = result.filter(m => m.categoryId === selectedCategory.value)
    }
  }

  return result
})

const selectCategory = (categoryId) => {
  selectedCategory.value = categoryId
  selectedMedicine.value = null // Reset selection when changing category
  closeSidebar() // Close sidebar after selecting category on mobile
}

const selectMedicine = (medicine) => {
  selectedMedicine.value = medicine
}

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
}

const clearSearch = () => {
  searchQuery.value = ''
}
</script>

<style scoped>
.pharmacy-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1f3a 100%);
  position: relative;
  overflow-x: hidden;
}

.content-wrapper {
  position: relative;
  z-index: 2;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  padding-top: 0;
}

.back-button {
  position: absolute;
  top: 0;
  left: 0;  /* Desktop: bên trái */
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: white;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-5px);  /* Desktop: hover sang trái */
}

/* Hamburger Menu Button (Hidden on desktop) */
.hamburger-btn {
  position: absolute;
  top: 0;
  left: 0;
  display: none;
  align-items: center;
  justify-content: center;
  padding: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 10px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
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
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.7);
}

.pharmacy-content {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  align-items: start;
}

/* Sidebar Styles */
.sidebar {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: sticky;
  top: 2rem;
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
}

.sidebar-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
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
  border-color: rgba(102, 126, 234, 0.5);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
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
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: white;
  text-align: left;
}

.category-item:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateX(5px);
}

.category-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 600px;
}

/* Medicine Grid */
.medicine-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.medicine-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.medicine-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(102, 126, 234, 0.3);
  border-color: rgba(102, 126, 234, 0.5);
}

.medicine-image {
  width: 100%;
  height: 180px;
  background-size: cover;
  background-position: center;
  background-color: rgba(255, 255, 255, 0.1);
}

.medicine-info {
  padding: 1.25rem;
}

.medicine-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: white;
  margin-bottom: 0.5rem;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  width: 100%;
}

.view-detail-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
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
}

.back-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(-5px);
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  padding: 1rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  border-left: 3px solid rgba(102, 126, 234, 0.5);
}

.detail-row.description {
  grid-template-columns: 1fr;
}

.detail-label {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
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
  color: #667eea;
  font-size: 1.5rem;
  line-height: 1;
}

/* Responsive */
@media (max-width: 1024px) {
  .pharmacy-content {
    grid-template-columns: 250px 1fr;
  }

  .detail-header {
    flex-direction: column;
  }

  .detail-image {
    width: 100%;
    height: 250px;
  }
}

@media (max-width: 768px) {
  /* Show hamburger button on mobile */
  .hamburger-btn {
    display: flex;
  }

  /* Show overlay when sidebar is open */
  .sidebar-overlay {
    display: block;
  }

  .pharmacy-content {
    grid-template-columns: 1fr;
  }

  /* Sidebar mobile styles */
  .sidebar {
    position: fixed;
    top: 0;
    left: -100%;
    width: 280px;
    height: 100vh;
    max-height: 100vh;
    z-index: 999;
    transition: left 0.3s ease;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
  }

  .sidebar.open {
    left: 0;
  }

  .medicine-grid {
    grid-template-columns: 1fr;
  }

  .detail-row {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .title {
    font-size: 2rem;
  }

  .back-button {
    position: absolute;
    top: 0;
    right: 0;  /* Mobile: chuyển sang bên phải */
    left: auto;
    padding: 0.5rem 1rem;
  }

  .back-button:hover {
    transform: translateX(5px);  /* Mobile: hover sang phải */
  }

  .back-button span {
    display: none;
  }

  .header {
    padding-top: 60px;
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
