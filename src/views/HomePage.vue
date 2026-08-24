<template>
  <div class="home">
    <!-- Canvas background – handled by SproutField (keep existing animation) -->
    <SproutField :running="false" />

    <!-- Decorative blobs -->
    <div class="blob blob-1" aria-hidden="true"></div>
    <div class="blob blob-2" aria-hidden="true"></div>
    <div class="blob blob-3" aria-hidden="true"></div>

    <!-- Noise texture overlay -->
    <div class="noise" aria-hidden="true"></div>

    <main class="home__main">
      <!-- ── Top pill badge ── -->
      <div class="badge" role="note">
        <span class="badge__dot"></span>
        <span class="badge__text">Y học cổ truyền phương Đông</span>
      </div>

      <!-- ── Headline ── -->
      <h1 class="headline">
        <span class="headline__serif">{{ t('welcomeTitle') }}</span>
      </h1>

      <p class="tagline">{{ t('welcomeSubtitle') }}</p>

      <!-- ── Divider ── -->
      <div class="rule" aria-hidden="true">
        <span></span><span class="rule__leaf">✦</span><span></span>
      </div>

      <!-- ── Feature cards ── -->
      <section class="cards" aria-label="Tính năng" ref="cardsRef">
        <!-- Card 1 – Pharmacy -->
        <router-link to="/pharmacy" class="card card--herb">
          <div class="card__shine"></div>
          <div class="card__top">
            <div class="card__icon-ring card__icon-ring--herb">
              <span class="card__emoji">🌿</span>
            </div>
            <span class="card__tag">Khám phá</span>
          </div>
          <h2 class="card__title">{{ t('pharmacyTitle') }}</h2>
          <p class="card__desc">{{ t('pharmacyDesc') }}</p>
          <div class="card__cta">
            <span>{{ t('pharmacyBtn') }}</span>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M4 10h12M10 4l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <div class="card__glow card__glow--herb"></div>
        </router-link>

        <!-- Card 2 – Meditation -->
        <router-link to="/meditation" class="card card--mind">
          <div class="card__shine"></div>
          <div class="card__top">
            <div class="card__icon-ring card__icon-ring--mind">
              <span class="card__emoji">💌</span>
            </div>
            <span class="card__tag card__tag--soon">Trải nghiệm</span>
          </div>
          <h2 class="card__title">{{ t('meditationTitle') }}</h2>
          <p class="card__desc">{{ t('meditationDesc') }}</p>
          <div class="card__cta card__cta--dim">
            <svg width="13" height="13" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="1.6"/>
              <path d="M10 6v4l2.5 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
            </svg>
            <span>{{ t('meditationBtn') }}...</span>
          </div>
          <div class="card__glow card__glow--mind"></div>
        </router-link>
      </section>

      <!-- ── Footer ── -->
      <footer class="footer">
        <p>{{ t('footer') }}</p>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import SproutField from '../components/SproutField.vue'
import { useI18n } from '../i18n'

const { t } = useI18n()
const cardsRef = ref(null)

const handleMouseMove = (e) => {
  if (!cardsRef.value) return
  Array.from(cardsRef.value.children).forEach(card => {
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    card.style.setProperty('--mouse-x', `${x}px`)
    card.style.setProperty('--mouse-y', `${y}px`)

    const centerX = rect.width / 2
    const centerY = rect.height / 2
    
    // Check if mouse is hovering over this specific card
    if (x >= -20 && x <= rect.width + 20 && y >= -20 && y <= rect.height + 20) {
      const rotateX = ((y - centerY) / centerY) * -10
      const rotateY = ((x - centerX) / centerX) * 10
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    } else {
      card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`
    }
  })
}

onMounted(() => {
  window.addEventListener('mousemove', handleMouseMove, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleMouseMove)
})
</script>

<style scoped>
/* ===================================
   Page Shell
=================================== */
.home {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background:
    radial-gradient(ellipse 90% 55% at 50% -5%, rgba(5,46,22,.9) 0%, transparent 65%),
    #030712;
}

/* ── Animated blobs ── */
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
  will-change: transform;
}
.blob-1 {
  width: 480px; height: 480px;
  background: radial-gradient(circle, rgba(16,185,129,.22) 0%, transparent 70%);
  top: -12%; left: -8%;
  animation: blobDrift 14s ease-in-out infinite alternate;
}
.blob-2 {
  width: 360px; height: 360px;
  background: radial-gradient(circle, rgba(99,102,241,.12) 0%, transparent 70%);
  top: 30%; right: -6%;
  animation: blobDrift 18s ease-in-out infinite alternate-reverse;
}
.blob-3 {
  width: 300px; height: 300px;
  background: radial-gradient(circle, rgba(245,158,11,.1) 0%, transparent 70%);
  bottom: 5%; left: 22%;
  animation: blobDrift 11s ease-in-out infinite alternate;
  animation-delay: -4s;
}

@keyframes blobDrift {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(30px, -40px) scale(1.08); }
}

/* ── Noise texture ── */
.noise {
  position: absolute; inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none; opacity: .5;
}

/* ===================================
   Main content
=================================== */
.home__main {
  position: relative;
  z-index: 10;
  width: min(94vw, 920px);
  padding: 3.5rem 0 3rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0;
  animation: enterUp .8s cubic-bezier(.22,1,.36,1) both;
}

@keyframes enterUp {
  from { opacity: 0; transform: translateY(28px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ── Badge ── */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 15px 5px 10px;
  background: rgba(16,185,129,.08);
  border: 1px solid rgba(16,185,129,.2);
  border-radius: 99px;
  font-size: .75rem;
  font-weight: 600;
  letter-spacing: .6px;
  text-transform: uppercase;
  color: rgba(52,211,153,.85);
  backdrop-filter: blur(8px);
  margin-bottom: 1.75rem;
}
.badge__dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 8px #34d399;
  animation: pulse 2.2s ease-in-out infinite;
}
@keyframes pulse {
  0%,100% { opacity:1; box-shadow: 0 0 8px #34d399; }
  50%      { opacity:.6; box-shadow: 0 0 18px #34d399; }
}

/* ── Headline ── */
.headline {
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2.4rem, 7vw, 5rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -.5px;
  margin-bottom: 1.1rem;
}
.headline__serif {
  background: linear-gradient(to right, #fde68a 0%, #10b981 20%, #34d399 40%, #fde68a 60%, #10b981 80%, #34d399 100%);
  background-size: 200% auto;
  color: #fff;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  display: block;
  text-transform: uppercase;
  letter-spacing: 2px;
  animation: shine 6s linear infinite;
}

@keyframes shine {
  to {
    background-position: 200% center;
  }
}

/* ── Tagline ── */
.tagline {
  font-size: clamp(.88rem, 2.2vw, 1.05rem);
  color: rgba(255,255,255,.45);
  font-weight: 300;
  letter-spacing: 1.5px;
  margin-bottom: 2.2rem;
  max-width: 440px;
}

/* ── Rule ── */
.rule {
  display: flex; align-items: center; gap: 12px;
  width: 200px; margin-bottom: 2.8rem;
}
.rule span:not(.rule__leaf) {
  flex: 1; height: 1px;
  background: linear-gradient(90deg, transparent, rgba(16,185,129,.3), transparent);
}
.rule__leaf {
  font-size: .65rem; color: rgba(52,211,153,.55);
  animation: spinSlow 8s linear infinite;
}
@keyframes spinSlow { to { transform: rotate(360deg); } }

/* ===================================
   Cards
=================================== */
.cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
  margin-bottom: 3rem;
  perspective: 1000px;
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 2rem 1.75rem 1.75rem;
  background: rgba(255,255,255,.032);
  border: 1px solid rgba(255,255,255,.07);
  border-radius: 24px;
  text-decoration: none;
  color: inherit;
  overflow: hidden;
  cursor: pointer;
  transform-style: preserve-3d;
  transition: transform 0.1s linear,
              box-shadow .35s ease,
              border-color .25s ease;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
}

/* Spotlight Glow Background & Border */
.card::before,
.card::after {
  content: '';
  position: absolute;
  inset: -1px;
  border-radius: inherit;
  opacity: 0;
  transition: opacity 0.5s ease;
  pointer-events: none;
}

.card::before {
  background: radial-gradient(
    800px circle at var(--mouse-x, 0) var(--mouse-y, 0),
    rgba(255, 255, 255, 0.04),
    transparent 40%
  );
  z-index: 1;
}

.card::after {
  background: radial-gradient(
    600px circle at var(--mouse-x, 0) var(--mouse-y, 0),
    rgba(255, 255, 255, 0.4),
    transparent 40%
  );
  z-index: 2;
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  padding: 1px;
}

.card:hover::before,
.card:hover::after {
  opacity: 1;
}

.card--herb:hover::after {
  background: radial-gradient(
    600px circle at var(--mouse-x, 0) var(--mouse-y, 0),
    rgba(16, 185, 129, 0.8),
    transparent 40%
  );
}

.card--mind:hover::after {
  background: radial-gradient(
    600px circle at var(--mouse-x, 0) var(--mouse-y, 0),
    rgba(99, 102, 241, 0.8),
    transparent 40%
  );
}

/* Shimmer overlay on hover */
.card__shine {
  position: absolute; inset: 0;
  background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,.04) 50%, transparent 60%);
  background-size: 200% 100%;
  background-position: -100% 0;
  transition: background-position .5s ease;
  pointer-events: none;
}
.card:hover .card__shine {
  background-position: 100% 0;
}

/* Glow */
.card__glow {
  position: absolute; inset: 0;
  opacity: 0;
  border-radius: 24px;
  transition: opacity .4s ease;
  pointer-events: none;
}
.card__glow--herb {
  background: radial-gradient(ellipse at 50% 0%, rgba(16,185,129,.2) 0%, transparent 65%);
}
.card__glow--mind {
  background: radial-gradient(ellipse at 50% 0%, rgba(99,102,241,.15) 0%, transparent 65%);
}
.card:hover .card__glow { opacity: 1; }

/* Hover lift */
.card--herb:hover {
  transform: translateY(-9px);
  border-color: rgba(16,185,129,.3);
  box-shadow: 0 24px 56px rgba(16,185,129,.18), 0 0 0 1px rgba(16,185,129,.12);
}
.card--mind:hover {
  transform: translateY(-9px);
  border-color: rgba(99,102,241,.3);
  box-shadow: 0 24px 56px rgba(99,102,241,.14), 0 0 0 1px rgba(99,102,241,.1);
}

/* Card top row */
.card__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

/* Icon ring */
.card__icon-ring {
  width: 56px; height: 56px;
  border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  transition: transform .4s cubic-bezier(.34,1.56,.64,1);
}
.card__icon-ring--herb {
  background: linear-gradient(135deg, rgba(16,185,129,.2), rgba(5,150,105,.1));
  border: 1px solid rgba(16,185,129,.2);
  box-shadow: 0 8px 24px rgba(16,185,129,.08);
}
.card__icon-ring--mind {
  background: linear-gradient(135deg, rgba(99,102,241,.18), rgba(67,56,202,.1));
  border: 1px solid rgba(99,102,241,.2);
  box-shadow: 0 8px 24px rgba(99,102,241,.07);
}
.card:hover .card__icon-ring { transform: scale(1.1) rotate(-4deg); }

.card__emoji { font-size: 1.75rem; line-height: 1; }

/* Tag pill */
.card__tag {
  font-size: .68rem; font-weight: 700;
  letter-spacing: .6px; text-transform: uppercase;
  padding: 4px 10px;
  border-radius: 99px;
  background: rgba(16,185,129,.1);
  border: 1px solid rgba(16,185,129,.2);
  color: #34d399;
}
.card__tag--soon {
  background: rgba(99,102,241,.1);
  border-color: rgba(99,102,241,.2);
  color: rgba(165,180,252,.85);
}

/* Card text */
.card__title {
  font-size: 1.35rem;
  font-weight: 700;
  color: rgba(255,255,255,.92);
  letter-spacing: -.02em;
  margin-bottom: .5rem;
  line-height: 1.3;
}
.card__desc {
  font-size: .875rem;
  line-height: 1.65;
  color: rgba(255,255,255,.42);
  margin-bottom: 1.4rem;
  flex: 1;
}

/* CTA */
.card__cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: .83rem;
  font-weight: 600;
  color: #34d399;
  padding: 7px 14px;
  background: rgba(16,185,129,.08);
  border: 1px solid rgba(16,185,129,.18);
  border-radius: 99px;
  transition: background .25s, gap .25s, box-shadow .25s;
  align-self: flex-start;
}
.card:hover .card__cta {
  background: rgba(16,185,129,.15);
  gap: 10px;
  box-shadow: 0 4px 16px rgba(16,185,129,.2);
}
.card__cta--dim {
  color: rgba(165,180,252,.7);
  background: rgba(99,102,241,.06);
  border-color: rgba(99,102,241,.15);
}
.card:hover .card__cta--dim {
  background: rgba(99,102,241,.1);
  box-shadow: none;
}

/* ── Footer ── */
.footer {
  animation: fadeIn .9s ease .4s both;
}
.footer p {
  font-size: .75rem;
  color: rgba(255,255,255,.2);
  letter-spacing: .5px;
}

@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

/* ===================================
   Responsive
=================================== */
@media (max-width: 640px) {
  .home__main { padding: 2.5rem 0 2rem; }
  .cards { grid-template-columns: 1fr; gap: 14px; margin-bottom: 2.2rem; }
  .card { padding: 1.6rem 1.4rem 1.4rem; border-radius: 20px; }
  .card__icon-ring { width: 48px; height: 48px; border-radius: 14px; }
  .card__emoji { font-size: 1.5rem; }
  .card__title { font-size: 1.2rem; }
  .tagline { letter-spacing: .8px; }
}

@media (max-width: 420px) {
  .headline { letter-spacing: .5px; }
  .card { padding: 1.4rem 1.2rem; }
}
</style>
