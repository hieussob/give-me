<template>
  <div class="pharmacy-page">
    <!-- Header -->
    <header class="pharmacy-header">
      <div class="container">
        <router-link to="/" class="back-link">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
          <span>Trang chủ</span>
        </router-link>
        
        <h1 class="page-title">🌿 Thông Tin Dược Liệu</h1>
        <p class="page-subtitle">Tra cứu thông tin các loại dược liệu thiên nhiên</p>
      </div>
    </header>

    <!-- Search & Filter -->
    <section class="search-section">
      <div class="container">
        <div class="search-box">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.35-4.35"/>
          </svg>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Tìm kiếm dược liệu..."
            class="search-input"
          />
        </div>

        <div class="categories">
          <button 
            v-for="cat in categories" 
            :key="cat.id"
            @click="selectedCategory = cat.id"
            :class="['category-btn', { active: selectedCategory === cat.id }]"
          >
            <span class="cat-icon">{{ cat.icon }}</span>
            <span>{{ cat.name }}</span>
          </button>
        </div>
      </div>
    </section>

    <!-- Medicine Grid -->
    <section class="medicines-section">
      <div class="container">
        <div class="medicines-grid">
          <div 
            v-for="medicine in filteredMedicines" 
            :key="medicine.id"
            class="medicine-card"
            @click="openDetail(medicine)"
          >
            <div class="card-image">
              <img :src="medicine.image" :alt="medicine.name" />
              <div class="card-overlay"></div>
            </div>
            <div class="card-content">
              <h3 class="medicine-name">{{ medicine.name }}</h3>
              <p class="scientific-name">{{ medicine.scientificName }}</p>
              <p class="family">{{ medicine.family }}</p>
              <div class="properties">
                <span class="property-tag">{{ medicine.properties }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="filteredMedicines.length === 0" class="no-results">
          <p>🔍 Không tìm thấy dược liệu phù hợp</p>
        </div>
      </div>
    </section>

    <!-- Detail Modal -->
    <transition name="modal">
      <div v-if="selectedMedicine" class="modal-overlay" @click="closeDetail">
        <div class="modal-content" @click.stop>
          <button class="close-btn" @click="closeDetail">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>

          <div class="modal-header">
            <img :src="selectedMedicine.image" :alt="selectedMedicine.name" class="detail-image" />
            <div class="detail-info">
              <h2>{{ selectedMedicine.name }}</h2>
              <p class="scientific">{{ selectedMedicine.scientificName }}</p>
              <p class="family-tag">{{ selectedMedicine.family }}</p>
            </div>
          </div>

          <div class="modal-body">
            <div class="info-section">
              <h3>📝 Mô tả</h3>
              <p>{{ selectedMedicine.description }}</p>
            </div>

            <div class="info-section">
              <h3>🌱 Bộ phận dùng</h3>
              <p>{{ selectedMedicine.usedParts }}</p>
            </div>

            <div class="info-section">
              <h3>⚖️ Tính vị</h3>
              <p>{{ selectedMedicine.properties }}</p>
            </div>

            <div class="info-section">
              <h3>🧪 Thành phần chính</h3>
              <ul class="ingredient-list">
                <li v-for="(ingredient, idx) in selectedMedicine.mainIngredients" :key="idx">
                  {{ ingredient }}
                </li>
              </ul>
            </div>

            <div class="info-section">
              <h3>💊 Công dụng</h3>
              <ul class="uses-list">
                <li v-for="(use, idx) in selectedMedicine.uses" :key="idx">
                  {{ use }}
                </li>
              </ul>
            </div>

            <div class="info-section">
              <h3>🎯 Chỉ định</h3>
              <ul class="indication-list">
                <li v-for="(indication, idx) in selectedMedicine.indications" :key="idx">
                  {{ indication }}
                </li>
              </ul>
            </div>

            <div class="info-section">
              <h3>💉 Liều lượng</h3>
              <p class="dosage">{{ selectedMedicine.dosage }}</p>
            </div>

            <div class="info-section warning">
              <h3>⚠️ Chống chỉ định</h3>
              <p>{{ selectedMedicine.contraindications }}</p>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { medicines, categories } from '../data/medicineData'

const searchQuery = ref('')
const selectedCategory = ref('all')
const selectedMedicine = ref(null)

const filteredMedicines = computed(() => {
  let result = medicines

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(m => 
      m.name.toLowerCase().includes(query) ||
      m.scientificName.toLowerCase().includes(query) ||
      m.description.toLowerCase().includes(query)
    )
  }

  return result
})

function openDetail(medicine) {
  selectedMedicine.value = medicine
  document.body.style.overflow = 'hidden'
}

function closeDetail() {
  selectedMedicine.value = null
  document.body.style.overflow = 'auto'
}
</script>

<style scoped>
.pharmacy-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
  padding-bottom: 60px;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Header */
.pharmacy-header {
  background: linear-gradient(135deg, #064e3b 0%, #047857 100%);
  padding: 40px 0;
  margin-bottom: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 20px;
  transition: all 0.3s;
}

.back-link:hover {
  color: #fff;
  transform: translateX(-4px);
}

.page-title {
  font-size: 42px;
  font-weight: 700;
  color: #fff;
  margin: 0 0 12px 0;
}

.page-subtitle {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

/* Search Section */
.search-section {
  margin-bottom: 40px;
}

.search-box {
  position: relative;
  max-width: 600px;
  margin: 0 auto 32px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.4);
}

.search-input {
  width: 100%;
  padding: 16px 16px 16px 48px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: #fff;
  font-size: 16px;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #22c55e;
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.2);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

/* Categories */
.categories {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 24px;
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.category-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
}

.category-btn.active {
  background: #22c55e;
  border-color: #22c55e;
  color: #fff;
}

.cat-icon {
  font-size: 18px;
}

/* Medicine Grid */
.medicines-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.medicine-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s;
}

.medicine-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(34, 197, 94, 0.2);
  border-color: rgba(34, 197, 94, 0.4);
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.medicine-card:hover .card-image img {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.6) 100%);
}

.card-content {
  padding: 20px;
}

.medicine-name {
  font-size: 22px;
  font-weight: 600;
  color: #4ade80;
  margin: 0 0 8px 0;
}

.scientific-name {
  font-size: 14px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 8px 0;
}

.family {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0 0 16px 0;
}

.property-tag {
  display: inline-block;
  padding: 6px 12px;
  background: rgba(34, 197, 94, 0.2);
  border: 1px solid rgba(34, 197, 94, 0.4);
  border-radius: 12px;
  font-size: 12px;
  color: #4ade80;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.5);
  font-size: 18px;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  overflow-y: auto;
}

.modal-content {
  background: #1e293b;
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 10;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.modal-header {
  display: flex;
  gap: 24px;
  padding: 32px;
  background: linear-gradient(135deg, #064e3b 0%, #047857 100%);
}

.detail-image {
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.detail-info h2 {
  font-size: 32px;
  color: #fff;
  margin: 0 0 12px 0;
}

.scientific {
  font-size: 16px;
  font-style: italic;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 8px 0;
}

.family-tag {
  display: inline-block;
  padding: 6px 12px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  font-size: 14px;
  color: #fff;
}

.modal-body {
  padding: 32px;
}

.info-section {
  margin-bottom: 28px;
}

.info-section h3 {
  font-size: 20px;
  color: #4ade80;
  margin: 0 0 12px 0;
}

.info-section p {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.7;
  margin: 0;
}

.ingredient-list,
.uses-list,
.indication-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.ingredient-list li,
.uses-list li,
.indication-list li {
  color: rgba(255, 255, 255, 0.8);
  padding: 8px 0;
  padding-left: 24px;
  position: relative;
}

.ingredient-list li::before,
.uses-list li::before,
.indication-list li::before {
  content: '•';
  position: absolute;
  left: 8px;
  color: #4ade80;
  font-size: 20px;
}

.dosage {
  background: rgba(34, 197, 94, 0.1);
  border-left: 3px solid #22c55e;
  padding: 12px 16px;
  border-radius: 4px;
  color: #4ade80 !important;
  font-weight: 500;
}

.info-section.warning {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  padding: 16px;
}

.info-section.warning h3 {
  color: #f87171;
}

.info-section.warning p {
  color: rgba(255, 255, 255, 0.9);
}

/* Modal Animation */
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from, .modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9);
}

@media (max-width: 768px) {
  .page-title {
    font-size: 32px;
  }

  .modal-header {
    flex-direction: column;
  }

  .detail-image {
    width: 100%;
    height: 250px;
  }

  .medicines-grid {
    grid-template-columns: 1fr;
  }
}
</style>
