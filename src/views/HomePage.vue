<template>
  <div class="home-page">
    <SproutField :running="false" />

    <div class="home-container">
      <div class="logo-section">
        <div class="logo-glow"></div>
        <h1 class="main-title">{{ t("welcomeTitle") }}</h1>
        <!-- <p class="subtitle">{{ t('welcomeSubtitle') }}</p> -->
      </div>

      <div class="options-grid">
        <!-- Option 1: Pharmacy Info -->
        <router-link to="/pharmacy" class="option-card pharmacy-card">
          <div class="card-icon">🌿</div>
          <h2 class="card-title">{{ t("pharmacyTitle") }}</h2>
          <p class="card-description">
            {{ t("pharmacyDesc") }}
          </p>
          <div class="card-footer">
            <span class="card-link">{{ t("pharmacyBtn") }} →</span>
          </div>
        </router-link>

        <!-- Option 2: Message Form (Coming Soon) -->
        <router-link
          to="/meditation"
          class="option-card meditation-card disabled"
        >
          <div class="card-icon">💌</div>
          <h2 class="card-title">{{ t("meditationTitle") }}</h2>
          <p class="card-description">
            {{ t("meditationDesc") }}
          </p>
          <div class="card-footer">
            <span class="card-link">{{ t("meditationBtn") }}...</span>
          </div>
        </router-link>
      </div>

      <footer class="home-footer">
        <p>{{ t("footer") }}</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import SproutField from "../components/SproutField.vue";
import { useI18n } from "../i18n";

const { t } = useI18n();
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: radial-gradient(
    ellipse at bottom,
    #020617 0%,
    #03061a 50%,
    #020617 100%
  );
  overflow: hidden;
}

.home-container {
  position: relative;
  z-index: 10;
  width: 95vw;
  padding: 0;
  text-align: center;
}

.logo-section {
  position: relative;
  margin-bottom: 60px;
  animation: fadeInDown 1s ease;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.logo-glow {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(96, 165, 250, 0.3) 0%,
    transparent 70%
  );
  filter: blur(60px);
  animation: pulse 4s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

.main-title {
  position: relative;
  font-weight: 700;
  /* margin: 0 0 16px 0; */
  background: linear-gradient(135deg, #60a5fa 0%, #06b6d4 50%, #a78bfa 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 2px;
}

.subtitle {
  position: relative;
  font-size: 20px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  font-weight: 300;
  letter-spacing: 4px;
  text-transform: uppercase;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 32px;
  max-width: 900px;
  margin: 0 auto 60px;
  animation: fadeInUp 1s ease 0.3s backwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.option-card {
  position: relative;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 48px 32px;
  text-decoration: none;
  color: inherit;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  cursor: pointer;
}

.option-card::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 2px;
  background: linear-gradient(
    135deg,
    rgba(96, 165, 250, 0.5),
    rgba(6, 182, 212, 0.5)
  );
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s;
}

.option-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(96, 165, 250, 0.3);
  border-color: rgba(96, 165, 250, 0.4);
}

.option-card:hover::before {
  opacity: 1;
}

.meditation-card:hover {
  box-shadow: 0 20px 60px rgba(96, 165, 250, 0.4);
}

.pharmacy-card:hover {
  box-shadow: 0 20px 60px rgba(34, 197, 94, 0.4);
}

.card-icon {
  font-size: 64px;
  margin-bottom: 24px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.meditation-card .card-icon {
  animation-delay: 0s;
}

.pharmacy-card .card-icon {
  animation-delay: 0.5s;
}

.card-title {
  font-size: 28px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: #e0f2fe;
}

.card-description {
  font-size: 16px;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.6);
  margin: 0 0 32px 0;
  min-height: 50px;
}

.card-footer {
  margin-top: auto;
}

.card-link {
  display: inline-block;
  font-size: 15px;
  font-weight: 600;
  color: #60a5fa;
  transition: all 0.3s;
}

.option-card:hover .card-link {
  transform: translateX(4px);
  color: #06b6d4;
}

.pharmacy-card .card-link {
  color: #4ade80;
}

.pharmacy-card:hover .card-link {
  color: #22c55e;
}

.home-footer {
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  animation: fadeIn 1s ease 0.6s backwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.home-footer p {
  margin: 0;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.4);
}

@media (max-width: 768px) {
  .main-title {
    font-size: 40px;
  }

  .subtitle {
    font-size: 16px;
    letter-spacing: 2px;
  }

  .options-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .option-card {
    padding: 36px 24px;
  }

  .card-icon {
    font-size: 48px;
  }

  .card-title {
    font-size: 24px;
  }
}
</style>
