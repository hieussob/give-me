<template>
  <div class="page">

    <!-- ═══════════════════════════════
         TOPBAR NAV
    ═══════════════════════════════ -->
    <header class="topbar">
      <router-link to="/" class="topbar__back">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        <span>{{ t('home') }}</span>
      </router-link>

      <div class="topbar__center">
        <span class="topbar__leaf">🌿</span>
        <h1 class="topbar__title">{{ t('title') }}</h1>
      </div>

      <!-- Hamburger (mobile only) -->
      <button type="button" @click="toggleSidebar" class="topbar__menu" :class="{ hidden: sidebarOpen }" aria-label="Menu">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 12h18M3 6h18M3 18h18"/>
        </svg>
      </button>
    </header>

    <!-- ═══════════════════════════════
         LAYOUT
    ═══════════════════════════════ -->
    <div class="layout">

      <!-- Overlay (mobile) -->
      <div v-if="sidebarOpen" class="overlay" @click="closeSidebar"></div>

      <!-- ── SIDEBAR ── -->
      <aside class="sidebar" :class="{ 'sidebar--open': sidebarOpen }">

        <!-- Close button (mobile) -->
        <button type="button" class="sidebar__close" @click="closeSidebar" v-if="sidebarOpen">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>

        <!-- Search -->
        <div class="search">
          <svg class="search__icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="t('search')"
            class="search__input"
          />
          <button type="button" v-if="searchQuery" @click="clearSearch" class="search__clear">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Sort toggle -->
        <div class="sort-toggle">
          <button
            type="button"
            :class="['sort-btn', { 'sort-btn--active': sortMode === 'alphabet' }]"
            @click="sortMode = 'alphabet'"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 6h16M4 12h16M4 18h7"/>
            </svg>
            <span>{{ t('sortByAlphabet') }}</span>
          </button>
          <button
            type="button"
            :class="['sort-btn', { 'sort-btn--active': sortMode === 'family' }]"
            @click="sortMode = 'family'"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <span>{{ t('sortByFamily') }}</span>
          </button>
        </div>

        <!-- Category label -->
        <p class="sidebar__label">{{ t('categories') }}</p>

        <!-- Category list -->
        <nav class="cat-list">
          <button
            type="button"
            v-for="cat in currentCategories"
            :key="cat.id"
            :class="['cat-item', { 'cat-item--active': selectedCategory === cat.id }]"
            @click="selectCategory(cat.id)"
          >
            <span class="cat-item__letter" v-if="sortMode === 'alphabet'">{{ cat.letter }}</span>
            <span class="cat-item__icon" v-else><i :class="cat.icon"></i></span>
            <span class="cat-item__name">{{ cat.name }}</span>
            <span class="cat-item__count">{{ cat.count }}</span>
          </button>
        </nav>
      </aside>

      <!-- ── MAIN PANEL ── -->
      <section class="panel">

        <!-- MEDICINE GRID -->
        <div v-if="!selectedMedicine" class="grid-wrapper">
          <transition-group name="list" tag="div" class="grid" appear>
            <article
              v-for="(med, idx) in filteredMedicines"
              :key="med.id"
              class="mcard"
              @mousemove="onCardMouseMove"
              @mouseleave="onCardMouseLeave"
              @click="selectMedicine(med)"
              role="button"
              tabindex="0"
              @keydown.enter="selectMedicine(med)"
            >
              <!-- Image -->
              <div
                class="mcard__img"
                :class="{ 'mcard__img--lazy': idx >= 10 }"
                :data-bg="med.image"
                :style="idx < 10 ? { backgroundImage: `url(${med.image})` } : {}"
              >
                <div v-if="idx >= 10" class="mcard__shimmer"></div>
                <div class="mcard__img-overlay"></div>
              </div>

              <!-- Body -->
              <div class="mcard__body">
                <p class="mcard__family">{{ med.family }}</p>
                <h3 class="mcard__name">{{ med.name }}</h3>
                <p class="mcard__sci">{{ med.scientificName }}</p>
                <button type="button" class="mcard__btn">
                  <i class="fa-solid fa-circle-info"></i>
                  <span>{{ t('viewDetail') }}</span>
                </button>
              </div>
            </article>
          </transition-group>

          <!-- Infinite scroll sentinel -->
          <div class="scroll-sentinel"></div>
          <div v-if="hasMore" class="loader">
            <div class="loader__ring"></div>
            <span>{{ t('loading') }}…</span>
          </div>
        </div>

        <!-- MEDICINE DETAIL -->
        <div v-else class="detail">
          <button type="button" class="detail__back" @click="backToList">
            <i class="fa-solid fa-arrow-left"></i>
            <span>{{ t('backToList') }}</span>
          </button>

          <div class="detail__hero">
            <div class="detail__photo" :style="{ backgroundImage: `url(${selectedMedicine.image})` }">
              <div class="detail__photo-overlay"></div>
            </div>
            <div class="detail__intro">
              <span class="detail__family-tag">{{ selectedMedicine.family }}</span>
              <h2 class="detail__name">{{ selectedMedicine.name }}</h2>
              <p class="detail__sci">{{ selectedMedicine.scientificName }}</p>
            </div>
          </div>

          <div class="detail__rows">
            <div class="detail__row">
              <div class="detail__lbl"><i class="fa-solid fa-seedling"></i><span>{{ t('usedParts') }}</span></div>
              <div class="detail__val">{{ selectedMedicine.usedParts }}</div>
            </div>
            <div class="detail__row">
              <div class="detail__lbl"><i class="fa-solid fa-temperature-half"></i><span>{{ t('properties') }}</span></div>
              <div class="detail__val">{{ selectedMedicine.properties }}</div>
            </div>
            <div class="detail__row">
              <div class="detail__lbl"><i class="fa-solid fa-yin-yang"></i><span>{{ t('meridians') }}</span></div>
              <div class="detail__val">{{ selectedMedicine.meridians }}</div>
            </div>
            <div class="detail__row">
              <div class="detail__lbl"><i class="fa-solid fa-flask"></i><span>{{ t('mainIngredients') }}</span></div>
              <div class="detail__val">
                <ul><li v-for="(item, i) in selectedMedicine.mainIngredients" :key="i">{{ item }}</li></ul>
              </div>
            </div>
            <div class="detail__row">
              <div class="detail__lbl"><i class="fa-solid fa-heart-pulse"></i><span>{{ t('uses') }}</span></div>
              <div class="detail__val">
                <ul><li v-for="(item, i) in selectedMedicine.uses" :key="i">{{ item }}</li></ul>
              </div>
            </div>
            <div class="detail__row">
              <div class="detail__lbl"><i class="fa-solid fa-notes-medical"></i><span>{{ t('indications') }}</span></div>
              <div class="detail__val">
                <ul><li v-for="(item, i) in selectedMedicine.indications" :key="i">{{ item }}</li></ul>
              </div>
            </div>
            <div class="detail__row">
              <div class="detail__lbl"><i class="fa-solid fa-pills"></i><span>{{ t('dosage') }}</span></div>
              <div class="detail__val">{{ selectedMedicine.dosage }}</div>
            </div>
            <div class="detail__row">
              <div class="detail__lbl"><i class="fa-solid fa-triangle-exclamation"></i><span>{{ t('contraindications') }}</span></div>
              <div class="detail__val">
                <ul><li v-for="(item, i) in selectedMedicine.contraindications" :key="i">{{ item }}</li></ul>
              </div>
            </div>
            <div class="detail__row">
              <div class="detail__lbl"><i class="fa-solid fa-location-dot"></i><span>{{ t('origin') }}</span></div>
              <div class="detail__val">{{ selectedMedicine.origin }}</div>
            </div>
            <div class="detail__row detail__row--full">
              <div class="detail__lbl"><i class="fa-solid fa-book-open"></i><span>{{ t('description') }}</span></div>
              <div class="detail__val">{{ selectedMedicine.description }}</div>
            </div>
          </div>
        </div>

      </section>
    </div><!-- /layout -->
  </div><!-- /page -->
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { getMedicineData, loadMedicineData } from '../data/index.js'
import { useI18n } from '../i18n'

const { t, currentLang } = useI18n()

const rawMedicineData = ref(getMedicineData(currentLang.value))
const alphabetCategories = computed(() => rawMedicineData.value.alphabetCategories)
const familyCategories   = computed(() => rawMedicineData.value.familyCategories)
const medicines          = computed(() => rawMedicineData.value.medicines)

const selectedCategory = ref('all')
const selectedMedicine = ref(null)
const sidebarOpen      = ref(false)
const searchQuery      = ref('')
const sortMode         = ref('alphabet')

const enrichedMedicines = computed(() =>
  medicines.value.map(m => ({ ...m, firstLetter: m.firstLetter || m.name.charAt(0).toUpperCase() }))
)

const itemsPerPage   = ref(20)
const currentPage    = ref(1)
const imageObserver  = ref(null)
const scrollObserver = ref(null)
const isLoadingMore  = ref(false)
let setupTimer = null, loadMoreTimer = null

watch(sortMode, () => { selectedCategory.value = 'all'; selectedMedicine.value = null; currentPage.value = 1 })

const debouncedSearch = ref('')
let searchDebounceTimer = null
watch(searchQuery, val => {
  if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
  searchDebounceTimer = setTimeout(() => { debouncedSearch.value = val; currentPage.value = 1 }, 200)
})

const currentCategories = computed(() =>
  sortMode.value === 'alphabet' ? alphabetCategories.value : familyCategories.value
)

const allFilteredMedicines = computed(() => {
  let result = enrichedMedicines.value
  if (debouncedSearch.value.trim()) {
    const q = debouncedSearch.value.toLowerCase()
    result = result.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.scientificName.toLowerCase().includes(q) ||
      m.family.toLowerCase().includes(q)
    )
  }
  if (selectedCategory.value !== 'all') {
    if (sortMode.value === 'alphabet') {
      const letter = alphabetCategories.value.find(c => c.id === selectedCategory.value)?.letter
      result = result.filter(m => m.firstLetter === letter)
    } else {
      result = result.filter(m => m.categoryId === selectedCategory.value)
    }
  }
  return result
})

const filteredMedicines = computed(() => allFilteredMedicines.value.slice(0, currentPage.value * itemsPerPage.value))
const hasMore           = computed(() => filteredMedicines.value.length < allFilteredMedicines.value.length)

const selectCategory = id => { selectedCategory.value = id; selectedMedicine.value = null; currentPage.value = 1; closeSidebar() }
const loadMore = () => {
  if (hasMore.value && !isLoadingMore.value) {
    isLoadingMore.value = true; currentPage.value++
    if (loadMoreTimer) clearTimeout(loadMoreTimer)
    loadMoreTimer = setTimeout(() => { isLoadingMore.value = false }, 300)
  }
}
const scrollToTop     = () => typeof window !== 'undefined' && window.scrollTo({ top: 0, behavior: 'auto' })
const selectMedicine  = m  => { selectedMedicine.value = m; scrollToTop() }
const backToList      = () => { selectedMedicine.value = null; scrollToTop() }
const toggleSidebar   = () => { sidebarOpen.value = !sidebarOpen.value }
const closeSidebar    = () => { sidebarOpen.value = false }
const clearSearch     = () => {
  searchQuery.value = ''; if (searchDebounceTimer) clearTimeout(searchDebounceTimer)
  debouncedSearch.value = ''; currentPage.value = 1
}

const onCardMouseMove = (e) => {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  
  const centerX = rect.width / 2
  const centerY = rect.height / 2
  
  const rotateX = ((y - centerY) / centerY) * -12
  const rotateY = ((x - centerX) / centerX) * 12
  
  card.style.setProperty('--mouse-x', `${x}px`)
  card.style.setProperty('--mouse-y', `${y}px`)
  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.04, 1.04, 1.04)`
}

const onCardMouseLeave = (e) => {
  const card = e.currentTarget
  card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
}

const setupLazyLoading = () => {
  try {
    const imgs = document.querySelectorAll('.mcard__img--lazy:not(.loaded)')
    if (!imgs.length) return
    if (imageObserver.value) imageObserver.value.disconnect()
    imageObserver.value = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target, bg = el.getAttribute('data-bg')
          if (bg) { el.style.backgroundImage = `url(${bg})`; el.classList.add('loaded'); imageObserver.value.unobserve(el) }
        }
      })
    }, { rootMargin: '200px' })
    imgs.forEach(img => imageObserver.value.observe(img))
  } catch {}
}

const setupInfiniteScroll = () => {
  try {
    const sentinel = document.querySelector('.scroll-sentinel')
    if (!sentinel) return
    if (scrollObserver.value) scrollObserver.value.disconnect()
    scrollObserver.value = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting && hasMore.value && !isLoadingMore.value) loadMore() })
    }, { rootMargin: '200px' })
    scrollObserver.value.observe(sentinel)
  } catch {}
}

watch(filteredMedicines, async () => {
  if (setupTimer) clearTimeout(setupTimer)
  setupTimer = setTimeout(async () => { await nextTick(); setupLazyLoading(); setupInfiniteScroll() }, 100)
})

onMounted(async () => { await nextTick(); setupLazyLoading(); setupInfiniteScroll() })

onUnmounted(() => {
  ;[setupTimer, loadMoreTimer, searchDebounceTimer].forEach(t => t && clearTimeout(t))
  setupTimer = loadMoreTimer = searchDebounceTimer = null
  imageObserver.value?.disconnect()
  scrollObserver.value?.disconnect()
})

watch(currentLang, async lang => {
  rawMedicineData.value = await loadMedicineData(lang)
  selectedCategory.value = 'all'; selectedMedicine.value = null; searchQuery.value = ''; currentPage.value = 1
})
</script>

<style scoped>
/* ════════════════════════════════════════
   PAGE BASE
════════════════════════════════════════ */
.page {
  min-height: 100vh;
  background:
    radial-gradient(ellipse 100% 50% at 50% -5%, rgba(5,46,22,.85) 0%, transparent 60%),
    #030712;
  display: flex;
  flex-direction: column;
}

/* ════════════════════════════════════════
   TOPBAR
════════════════════════════════════════ */
.topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  height: 60px;
  background: rgba(3,7,18,.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,.06);
}

.topbar__back {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: .82rem;
  font-weight: 500;
  color: rgba(255,255,255,.55);
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  transition: all .25s ease;
  white-space: nowrap;
}
.topbar__back:hover {
  color: rgba(255,255,255,.9);
  background: rgba(255,255,255,.05);
  border-color: rgba(255,255,255,.08);
  transform: translateX(-3px);
}

.topbar__center {
  display: flex;
  align-items: center;
  gap: 8px;
  position: absolute;
  left: 50%; transform: translateX(-50%);
}
.topbar__leaf { font-size: 1.1rem; }
.topbar__title {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.25rem;
  font-weight: 700;
  background: linear-gradient(135deg, #6ee7b7 0%, #34d399 50%, #10b981 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: .5px;
  white-space: nowrap;
}

.topbar__menu {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px; height: 36px;
  background: rgba(255,255,255,.05);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 9px;
  color: rgba(255,255,255,.7);
  cursor: pointer;
  transition: all .25s ease;
}
.topbar__menu:hover { background: rgba(255,255,255,.1); color: #fff; }
.topbar__menu.hidden { opacity: 0; pointer-events: none; }

/* ════════════════════════════════════════
   LAYOUT (sidebar + panel)
════════════════════════════════════════ */
.layout {
  display: grid;
  grid-template-columns: 272px 1fr;
  gap: 0;
  flex: 1;
  align-items: start;
  padding: 1.5rem;
  gap: 1.5rem;
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
}

.overlay {
  display: none;
  position: fixed; inset: 0;
  background: rgba(0,0,0,.65);
  backdrop-filter: blur(4px);
  z-index: 200;
}

/* ════════════════════════════════════════
   SIDEBAR
════════════════════════════════════════ */
.sidebar {
  position: sticky;
  top: calc(60px + 1.5rem);
  max-height: calc(100vh - 60px - 3rem);
  overflow-y: auto;
  background: rgba(255,255,255,.028);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 18px;
  padding: 1.25rem 1rem;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  display: flex;
  flex-direction: column;
  gap: .75rem;
}
.sidebar::-webkit-scrollbar { width: 3px; }
.sidebar::-webkit-scrollbar-thumb { background: rgba(16,185,129,.25); border-radius: 3px; }

.sidebar__close {
  display: none;
  align-self: flex-end;
  padding: 6px;
  background: rgba(255,255,255,.06);
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 8px;
  color: rgba(255,255,255,.6);
  cursor: pointer;
  transition: all .2s;
}
.sidebar__close:hover { color: #fff; background: rgba(255,255,255,.12); }

.sidebar__label {
  font-size: .68rem;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: rgba(255,255,255,.25);
  padding: 0 2px;
}

/* Search */
.search {
  position: relative;
}
.search__icon {
  position: absolute; left: 11px; top: 50%; transform: translateY(-50%);
  color: rgba(255,255,255,.3); pointer-events: none;
}
.search__input {
  width: 100%;
  padding: .6rem .6rem .6rem 2.2rem;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 10px;
  color: #fff;
  font-size: .83rem;
  font-family: inherit;
  transition: all .25s;
}
.search__input::placeholder { color: rgba(255,255,255,.28); }
.search__input:focus {
  outline: none;
  background: rgba(255,255,255,.07);
  border-color: rgba(16,185,129,.4);
  box-shadow: 0 0 0 3px rgba(16,185,129,.07);
}
.search__clear {
  position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  padding: 4px; background: rgba(255,255,255,.07); border: none; border-radius: 50%;
  color: rgba(255,255,255,.4); cursor: pointer; display: flex; transition: all .2s;
}
.search__clear:hover { background: rgba(255,255,255,.14); color: #fff; }

/* Sort toggle */
.sort-toggle {
  display: flex; gap: 4px;
  padding: 3px;
  background: rgba(0,0,0,.25);
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,.05);
}
.sort-btn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px;
  padding: .45rem .5rem;
  background: transparent; border: none; border-radius: 7px;
  color: rgba(255,255,255,.4); font-size: .75rem; font-weight: 600;
  cursor: pointer; transition: all .2s; font-family: inherit;
}
.sort-btn:hover { color: rgba(255,255,255,.75); background: rgba(255,255,255,.04); }
.sort-btn--active {
  background: linear-gradient(135deg, rgba(16,185,129,.85), rgba(5,150,105,.85));
  color: #fff;
  box-shadow: 0 2px 8px rgba(16,185,129,.25);
}

/* Category list */
.cat-list { display: flex; flex-direction: column; gap: 3px; }

.cat-item {
  display: flex; align-items: center; gap: 10px;
  padding: .6rem .875rem;
  background: rgba(255,255,255,.03);
  border: 1px solid rgba(255,255,255,.05);
  border-radius: 10px;
  color: rgba(255,255,255,.6);
  font-size: .82rem; font-weight: 500;
  cursor: pointer; text-align: left; width: 100%;
  font-family: inherit;
  transition: all .22s cubic-bezier(.4,0,.2,1);
  opacity: 0;
  animation: fadeRight 0.5s cubic-bezier(0.34, 1.3, 0.64, 1) forwards;
}

@keyframes fadeRight {
  from { opacity: 0; transform: translateX(-15px); }
  to   { opacity: 1; transform: translateX(0); }
}

.cat-item:nth-child(1) { animation-delay: 0.05s; }
.cat-item:nth-child(2) { animation-delay: 0.10s; }
.cat-item:nth-child(3) { animation-delay: 0.15s; }
.cat-item:nth-child(4) { animation-delay: 0.20s; }
.cat-item:nth-child(5) { animation-delay: 0.25s; }
.cat-item:nth-child(6) { animation-delay: 0.30s; }
.cat-item:nth-child(7) { animation-delay: 0.35s; }
.cat-item:nth-child(8) { animation-delay: 0.40s; }
.cat-item:nth-child(n+9) { animation-delay: 0.45s; }
.cat-item:hover {
  background: rgba(255,255,255,.06);
  border-color: rgba(255,255,255,.09);
  color: rgba(255,255,255,.9);
  transform: translateX(4px);
}
.cat-item--active {
  background: linear-gradient(135deg, rgba(16,185,129,.18), rgba(5,150,105,.1));
  border-color: rgba(16,185,129,.35);
  color: #fff;
  transform: translateX(4px);
}

.cat-item__letter {
  font-size: 1rem; font-weight: 800;
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  background: rgba(255,255,255,.06);
  border-radius: 7px;
  flex-shrink: 0;
  color: #34d399;
  transition: all .22s;
}
.cat-item--active .cat-item__letter {
  background: rgba(16,185,129,.2);
  color: #6ee7b7;
}
.cat-item__icon {
  width: 28px; height: 28px;
  display: flex; align-items: center; justify-content: center;
  font-size: .95rem; flex-shrink: 0;
}
.cat-item__name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.cat-item__count {
  font-size: .68rem; color: rgba(255,255,255,.3);
  font-weight: 400; flex-shrink: 0;
}
.cat-item--active .cat-item__count { color: rgba(110,231,183,.6); }

/* ════════════════════════════════════════
   MAIN PANEL
════════════════════════════════════════ */
.panel {
  background: rgba(255,255,255,.022);
  border: 1px solid rgba(255,255,255,.06);
  border-radius: 20px;
  padding: 1.75rem;
  min-height: 75vh;
  backdrop-filter: blur(12px);
}

/* ════════════════════════════════════════
   MEDICINE GRID
════════════════════════════════════════ */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.25rem;
  position: relative;
}

/* Transition Group Animations */
.list-move,
.list-enter-active,
.list-leave-active {
  transition: all 0.5s cubic-bezier(0.34, 1.3, 0.64, 1);
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}
.list-leave-active {
  position: absolute;
}

/* ── Medicine Card ── */
.mcard {
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 18px;
  overflow: hidden;
  cursor: pointer;
  outline: none;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.1s linear,
              box-shadow .32s ease,
              border-color .25s ease;
}
.mcard::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    800px circle at var(--mouse-x, 0) var(--mouse-y, 0),
    rgba(255, 255, 255, 0.12),
    transparent 40%
  );
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  z-index: 10;
}
.mcard:hover::before { opacity: 1; }

.mcard:focus-visible {
  outline: 2px solid rgba(52,211,153,.5);
  outline-offset: 2px;
}
.mcard:hover {
  border-color: rgba(16,185,129,.3);
  box-shadow: 0 25px 60px rgba(16,185,129,.2), 0 0 0 1px rgba(16,185,129,.1);
}

/* Image */
.mcard__img {
  height: 185px;
  background-size: cover;
  background-position: center;
  background-color: rgba(5,46,22,.3);
  position: relative;
  overflow: hidden;
  transition: transform .4s ease;
  transform: translateZ(1px);
}
.mcard:hover .mcard__img { transform: scale(1.06) translateZ(10px); }

.mcard__img-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(to top, rgba(3,7,18,.8) 0%, transparent 55%);
}
.mcard__img--lazy:not(.loaded) { background-image: none !important; }

.mcard__shimmer {
  position: absolute; inset: 0;
  background: linear-gradient(90deg,
    rgba(255,255,255,.03) 25%,
    rgba(255,255,255,.08) 50%,
    rgba(255,255,255,.03) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.6s infinite;
}
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position:  200% 0; }
}

/* Body */
.mcard__body { padding: 1.1rem 1.1rem .9rem; }

.mcard__family {
  font-size: .7rem; font-weight: 700;
  letter-spacing: .8px; text-transform: uppercase;
  color: #34d399; margin-bottom: .35rem;
}
.mcard__name {
  font-size: 1.1rem; font-weight: 700;
  color: rgba(255,255,255,.92);
  letter-spacing: -.01em; line-height: 1.3;
  margin-bottom: .3rem;
}
.mcard__sci {
  font-size: .75rem; font-style: italic;
  color: rgba(255,255,255,.38);
  margin-bottom: .9rem;
}
.mcard__btn {
  display: inline-flex; align-items: center; gap: 6px;
  padding: .5rem 1rem;
  background: rgba(16,185,129,.1);
  border: 1px solid rgba(16,185,129,.2);
  border-radius: 99px;
  color: #34d399; font-size: .78rem; font-weight: 600;
  cursor: pointer; font-family: inherit;
  transition: all .25s ease;
}
.mcard:hover .mcard__btn {
  background: rgba(16,185,129,.18);
  border-color: rgba(16,185,129,.4);
  box-shadow: 0 4px 14px rgba(16,185,129,.2);
}

/* Loader */
.scroll-sentinel { height: 1px; visibility: hidden; }
.loader {
  display: flex; flex-direction: column; align-items: center;
  gap: .75rem; padding: 2rem 0;
  color: rgba(255,255,255,.4); font-size: .85rem;
}
.loader__ring {
  width: 32px; height: 32px;
  border: 2px solid rgba(16,185,129,.15);
  border-top-color: #10b981;
  border-radius: 50%;
  animation: spin .75s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* ════════════════════════════════════════
   MEDICINE DETAIL
════════════════════════════════════════ */
.detail { animation: fadeUp .4s ease both; }
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}

.detail__back {
  display: inline-flex; align-items: center; gap: 7px;
  padding: .55rem 1.1rem;
  background: rgba(255,255,255,.04);
  border: 1px solid rgba(255,255,255,.08);
  border-radius: 10px;
  color: rgba(255,255,255,.6);
  font-size: .85rem; font-weight: 500;
  cursor: pointer; font-family: inherit;
  margin-bottom: 1.75rem;
  transition: all .25s ease;
}
.detail__back:hover { background: rgba(255,255,255,.09); color: #fff; transform: translateX(-4px); }

/* Hero */
.detail__hero {
  display: flex; gap: 2rem;
  margin-bottom: 1.75rem;
  padding-bottom: 1.75rem;
  border-bottom: 1px solid rgba(255,255,255,.06);
}
.detail__photo {
  width: 260px; height: 260px; flex-shrink: 0;
  border-radius: 18px;
  background-size: cover; background-position: center;
  background-color: rgba(5,46,22,.3);
  border: 1px solid rgba(16,185,129,.15);
  box-shadow: 0 12px 40px rgba(0,0,0,.4);
  position: relative; overflow: hidden;
  animation: photoZoom 0.8s cubic-bezier(0.2, 1, 0.4, 1) both;
}

@keyframes photoZoom {
  from { opacity: 0; transform: scale(1.1); filter: blur(10px); }
  to   { opacity: 1; transform: scale(1); filter: blur(0); }
}

.detail__photo-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(135deg, rgba(16,185,129,.06), transparent 60%);
}

.detail__intro {
  flex: 1; display: flex; flex-direction: column;
  justify-content: center; gap: .6rem;
  animation: introFade 0.6s ease 0.1s both;
}

@keyframes introFade {
  from { opacity: 0; transform: translateX(15px); }
  to   { opacity: 1; transform: translateX(0); }
}

.detail__family-tag {
  display: inline-block;
  font-size: .72rem; font-weight: 700;
  letter-spacing: .8px; text-transform: uppercase;
  padding: 4px 12px;
  background: rgba(16,185,129,.1);
  border: 1px solid rgba(16,185,129,.22);
  border-radius: 99px; color: #34d399;
  width: fit-content;
}
.detail__name {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(1.8rem, 4vw, 2.6rem); font-weight: 700;
  background: linear-gradient(135deg, #6ee7b7 0%, #34d399 50%, #10b981 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}
.detail__sci {
  font-size: .95rem; font-style: italic;
  color: rgba(255,255,255,.42);
}

/* Detail rows */
.detail__rows { display: flex; flex-direction: column; gap: .6rem; }

.detail__row {
  display: grid; grid-template-columns: 190px 1fr; gap: 1rem;
  padding: .9rem 1.1rem;
  background: rgba(255,255,255,.02);
  border: 1px solid rgba(255,255,255,.04);
  border-left: 2px solid rgba(16,185,129,.35);
  border-radius: 12px;
  transition: all .22s ease;
  opacity: 0;
  animation: fadeUpRow 0.5s cubic-bezier(0.34, 1.3, 0.64, 1) forwards;
}

@keyframes fadeUpRow {
  from { opacity: 0; transform: translateY(15px); }
  to   { opacity: 1; transform: translateY(0); }
}

.detail__row:nth-child(1) { animation-delay: 0.15s; }
.detail__row:nth-child(2) { animation-delay: 0.20s; }
.detail__row:nth-child(3) { animation-delay: 0.25s; }
.detail__row:nth-child(4) { animation-delay: 0.30s; }
.detail__row:nth-child(5) { animation-delay: 0.35s; }
.detail__row:nth-child(6) { animation-delay: 0.40s; }
.detail__row:nth-child(7) { animation-delay: 0.45s; }
.detail__row:nth-child(8) { animation-delay: 0.50s; }
.detail__row:nth-child(9) { animation-delay: 0.55s; }
.detail__row:nth-child(10) { animation-delay: 0.60s; }

.detail__row:hover {
  background: rgba(255,255,255,.038);
  border-left-color: rgba(16,185,129,.65);
  transform: translateX(3px);
}
.detail__row--full { grid-template-columns: 1fr; }

.detail__lbl {
  display: flex; align-items: center; gap: 8px;
  font-size: .82rem; font-weight: 600;
  color: rgba(255,255,255,.75);
}
.detail__lbl i { color: #34d399; font-size: .9rem; width: 16px; text-align: center; }

.detail__val {
  font-size: .88rem; line-height: 1.65;
  color: rgba(255,255,255,.6);
}
.detail__val ul { list-style: none; padding: 0; margin: 0; }
.detail__val li { padding-left: 1.1rem; position: relative; margin-bottom: .35rem; }
.detail__val li::before {
  content: '▸'; position: absolute; left: 0;
  color: #34d399; font-size: .75rem; top: .05em;
}

/* ════════════════════════════════════════
   RESPONSIVE
════════════════════════════════════════ */
@media (max-width: 1100px) {
  .layout { grid-template-columns: 250px 1fr; }
  .grid   { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); }
}

@media (max-width: 900px) {
  .layout { grid-template-columns: 230px 1fr; gap: 1.1rem; padding: 1.1rem; }
  .detail__hero { gap: 1.5rem; }
  .detail__photo { width: 200px; height: 200px; }
}

@media (max-width: 768px) {
  .topbar__menu  { display: flex; }
  .overlay       { display: block; }
  .layout        { grid-template-columns: 1fr; padding: .9rem; }
  .panel         { padding: 1.25rem; }
  .sidebar {
    position: fixed;
    top: 0; left: -100%;
    width: min(85vw, 290px);
    height: 100vh; max-height: 100vh;
    border-radius: 0 20px 20px 0;
    border-left: none;
    z-index: 300;
    transition: left .3s cubic-bezier(.4,0,.2,1);
    box-shadow: 6px 0 32px rgba(0,0,0,.6);
    padding: 1rem;
  }
  .sidebar--open { left: 0; }
  .sidebar__close { display: flex; }
  .topbar__back span { display: none; }
  .grid   { grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 1rem; }
  .mcard__img { height: 165px; }
  .detail__hero { flex-direction: column; gap: 1.25rem; }
  .detail__photo { width: 100%; height: 220px; border-radius: 14px; }
  .detail__row { grid-template-columns: 1fr; gap: .5rem; padding: .8rem .9rem; }
}

@media (max-width: 480px) {
  .topbar { padding: 0 1rem; }
  .layout { padding: .75rem; }
  .panel  { padding: 1rem; border-radius: 16px; }
  .grid   { grid-template-columns: 1fr; gap: .875rem; }
  .mcard__img { height: 160px; }
  .mcard { border-radius: 14px; }
  .detail__photo { height: 200px; }
  .detail__name { font-size: 1.7rem; }
}

@media (max-width: 360px) {
  .mcard__img { height: 140px; }
  .panel { padding: .875rem; }
}
</style>
