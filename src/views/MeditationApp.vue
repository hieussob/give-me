<template>
  <div class="app">
    <!-- <PeachBlossomField :running="running" /> -->
    <SproutField :running="running" />

    <div v-if="running" class="floating-dandelion-layer" aria-hidden="true">
      <span
        v-for="seed in floatingDandelions"
        :key="seed.id"
        class="floating-dandelion-seed"
        :style="seed.style"
      ><i></i></span>
    </div>

    <!-- <StarField :running="running" /> -->
    <!-- Back button -->
    <router-link to="/" class="back-button">
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
      <span>{{ t("home") }}</span>
    </router-link>

    <!-- Message Form -->
    <transition name="fade">
      <MessageForm v-if="showForm" @close="showForm = false" />
    </transition>

    <main class="panel" :class="{ 'meditation-mode': running }">
      <h1 class="title" v-if="!running">{{ t("pixelThoughts") }}</h1>

      <div v-if="!running" class="input-area">
        <textarea
          v-model="thought"
          :placeholder="t('thoughtPlaceholder')"
          rows="3"
          class="thought-input"
        ></textarea>
        <div class="controls">
          <label class="fade-check" style="opacity: 0">
            <input type="checkbox" v-model="fadeOut" /> {{ t("fadeAway") }}
          </label>
          <button
            :disabled="!thoughtTrimmed"
            @click="startMeditation"
            class="btn"
          >
            {{ t("releaseBtn") }}
          </button>
        </div>
      </div>

      <div v-else class="meditation">
        <!-- Dandelion shrinks and dissolves into background -->
        <div class="thought-sun" :class="{ fading: fadeOut && thoughtFading }">
          <div class="dandelion-wrap">
            <!-- Ambient glow behind the dandelion -->
            <div class="dandel-glow"></div>
            <!-- Dandelion SVG -->
            <svg class="dandelion-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <!-- Stem -->
              <path d="M100 172 Q96 155 100 118" stroke="rgba(251,191,36,0.7)" stroke-width="2.2" fill="none" stroke-linecap="round"/>
              <!-- Spokes (center 100,118) -->
              <g class="dandelion-spokes">
                <line x1="100" y1="118" x2="100" y2="56"  stroke="rgba(251,191,36,0.8)" stroke-width="1.3"/>
                <line x1="100" y1="118" x2="140" y2="72"  stroke="rgba(251,191,36,0.8)" stroke-width="1.3"/>
                <line x1="100" y1="118" x2="156" y2="100" stroke="rgba(251,191,36,0.8)" stroke-width="1.3"/>
                <line x1="100" y1="118" x2="148" y2="134" stroke="rgba(251,191,36,0.8)" stroke-width="1.3"/>
                <line x1="100" y1="118" x2="124" y2="156" stroke="rgba(251,191,36,0.8)" stroke-width="1.3"/>
                <line x1="100" y1="118" x2="76"  y2="156" stroke="rgba(251,191,36,0.8)" stroke-width="1.3"/>
                <line x1="100" y1="118" x2="52"  y2="134" stroke="rgba(251,191,36,0.8)" stroke-width="1.3"/>
                <line x1="100" y1="118" x2="44"  y2="100" stroke="rgba(251,191,36,0.8)" stroke-width="1.3"/>
                <line x1="100" y1="118" x2="60"  y2="72"  stroke="rgba(251,191,36,0.8)" stroke-width="1.3"/>
                <!-- Half-length spokes between -->
                <line x1="100" y1="118" x2="122" y2="62"  stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
                <line x1="100" y1="118" x2="150" y2="86"  stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
                <line x1="100" y1="118" x2="144" y2="118" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
                <line x1="100" y1="118" x2="114" y2="148" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
                <line x1="100" y1="118" x2="86"  y2="148" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
                <line x1="100" y1="118" x2="56"  y2="118" stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
                <line x1="100" y1="118" x2="50"  y2="86"  stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
                <line x1="100" y1="118" x2="78"  y2="62"  stroke="rgba(251,191,36,0.55)" stroke-width="1"/>
              </g>
              <!-- Seed heads at end of each spoke -->
              <g class="dandelion-seeds">
                <circle cx="100" cy="56"  r="4.5" fill="rgba(254,240,138,0.95)"/>
                <circle cx="140" cy="72"  r="4.5" fill="rgba(254,240,138,0.95)"/>
                <circle cx="156" cy="100" r="4.5" fill="rgba(254,240,138,0.95)"/>
                <circle cx="148" cy="134" r="4.5" fill="rgba(254,240,138,0.95)"/>
                <circle cx="124" cy="156" r="4.5" fill="rgba(254,240,138,0.95)"/>
                <circle cx="76"  cy="156" r="4.5" fill="rgba(254,240,138,0.95)"/>
                <circle cx="52"  cy="134" r="4.5" fill="rgba(254,240,138,0.95)"/>
                <circle cx="44"  cy="100" r="4.5" fill="rgba(254,240,138,0.95)"/>
                <circle cx="60"  cy="72"  r="4.5" fill="rgba(254,240,138,0.95)"/>
                <circle cx="122" cy="62"  r="3.2" fill="rgba(254,240,138,0.8)"/>
                <circle cx="150" cy="86"  r="3.2" fill="rgba(254,240,138,0.8)"/>
                <circle cx="144" cy="118" r="3.2" fill="rgba(254,240,138,0.8)"/>
                <circle cx="114" cy="148" r="3.2" fill="rgba(254,240,138,0.8)"/>
                <circle cx="86"  cy="148" r="3.2" fill="rgba(254,240,138,0.8)"/>
                <circle cx="56"  cy="118" r="3.2" fill="rgba(254,240,138,0.8)"/>
                <circle cx="50"  cy="86"  r="3.2" fill="rgba(254,240,138,0.8)"/>
                <circle cx="78"  cy="62"  r="3.2" fill="rgba(254,240,138,0.8)"/>
                <!-- Center -->
                <circle cx="100" cy="118" r="7" fill="rgba(251,191,36,1)"/>
              </g>
            </svg>
          </div>
          <div class="dandel-mist" aria-hidden="true"></div>
          <div class="dandel-snow-merge" aria-hidden="true"></div>
          <p class="thought-text">{{ displayThought }}</p>
        </div>

        <!-- Slogan animation - scales up gradually -->
        <transition name="slogan" mode="out-in">
          <p class="message" :key="currentMessageIndex">
            {{ currentMessage }}
          </p>
        </transition>

        <div class="timer">
          <svg viewBox="0 0 36 36" class="circular-chart">
            <path
              class="circle-bg"
              d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              class="circle"
              :stroke-dasharray="progress + ', 100'"
              d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <text x="18" y="20.35" class="percentage">{{ secondsLeft }}</text>
          </svg>
        </div>
        <button class="btn muted" @click="stopMeditation">
          {{ t("stopBtn") }}
        </button>
      </div>

      <p class="footer" v-if="!running">{{ t("meditationFooter") }}</p>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from "vue";
import StarField from "../components/StarField.vue";
import PeachBlossomField from "../components/PeachBlossomField.vue";
import SproutField from "../components/SproutField.vue";
import MessageForm from "../components/MessageForm.vue";
import { useI18n } from "../i18n";

const { t } = useI18n();

const thought = ref("");
const displayThought = ref("");
const running = ref(false);
const fadeOut = ref(true);
const thoughtFading = ref(false);
const duration = 60;
const secondsLeft = ref(duration);
const showForm = ref(false);
const floatingDandelions = ref([]);
let timer = null;

const thoughtTrimmed = computed(() => thought.value.trim().length > 0);
const progress = computed(
  () => ((duration - secondsLeft.value) / duration) * 100,
);

const messages = computed(() => [
  t.value("message1"),
  t.value("message2"),
  t.value("message3"),
  t.value("message4"),
  t.value("message5"),
  t.value("message6"),
  t.value("message7"),
]);

const currentMessageIndex = ref(0);
const currentMessage = computed(
  () => messages.value[currentMessageIndex.value],
);
let messageTimer = null;
let thoughtFadeTimer = null;
let thoughtClearTimer = null;
let formOpenTimer = null;
let autoStopTimer = null;

function createFloatingDandelions() {
  const count = window.innerWidth < 768 ? 24 : 40;
  floatingDandelions.value = Array.from({ length: count }, (_, index) => {
    const size = 5 + Math.random() * 4;
    const startX = Math.random() * 100;
    const durationSec = 18 + Math.random() * 18;
    const delaySec = -Math.random() * 30;
    const driftX = -60 + Math.random() * 120;
    const sway = 12 + Math.random() * 18;
    const opacity = 0.5 + Math.random() * 0.28;
    const rotate = Math.floor(Math.random() * 360);
    const stem = 8 + Math.random() * 8;
    const hue = 194 + Math.random() * 24;

    return {
      id: `seed-${index}-${Date.now()}`,
      style: {
        "--seed-x": `${startX.toFixed(2)}%`,
        "--seed-size": `${size.toFixed(2)}px`,
        "--seed-duration": `${durationSec.toFixed(2)}s`,
        "--seed-delay": `${delaySec.toFixed(2)}s`,
        "--seed-drift": `${driftX.toFixed(2)}px`,
        "--seed-sway": `${sway.toFixed(2)}px`,
        "--seed-opacity": `${opacity.toFixed(2)}`,
        "--seed-rot": `${rotate}deg`,
        "--seed-stem": `${stem.toFixed(2)}px`,
        "--seed-hue": `${hue.toFixed(2)}`,
      },
    };
  });
}

function startMeditation() {
  if (!thoughtTrimmed.value) return;
  clearInterval(timer);
  clearInterval(messageTimer);
  clearTimeout(thoughtFadeTimer);
  clearTimeout(thoughtClearTimer);
  clearTimeout(formOpenTimer);
  clearTimeout(autoStopTimer);

  running.value = true;
  createFloatingDandelions();
  secondsLeft.value = duration;
  currentMessageIndex.value = 0;
  displayThought.value = thought.value;
  thoughtFading.value = false;

  // Bật nhạc khi bắt đầu meditation
  window.dispatchEvent(new CustomEvent("play-music"));

  if (fadeOut.value) {
    // Fade out text after 5s; dandelion shrinks on its own via 60s CSS animation
    thoughtFadeTimer = setTimeout(() => (thoughtFading.value = true), 5000);
    thoughtClearTimer = setTimeout(() => {
      displayThought.value = "";
      thought.value = "";
    }, 9000);
  }

  timer = setInterval(() => {
    if (secondsLeft.value > 1) {
      secondsLeft.value--;
      return;
    }

    // Hit 0 exactly at 60s, then keep scene briefly for snow-merge dissolve.
    secondsLeft.value = 0;
    clearInterval(timer);
    timer = null;

    const dissolveHoldMs = fadeOut.value ? 1600 : 0;
    autoStopTimer = setTimeout(() => {
      stopMeditation();
    }, dissolveHoldMs);
  }, 1000);

  messageTimer = setInterval(() => {
    if (currentMessageIndex.value < messages.value.length - 1) {
      currentMessageIndex.value++;
    }
  }, 8000);
}

function stopMeditation() {
  running.value = false;
  clearInterval(timer);
  clearInterval(messageTimer);
  clearTimeout(thoughtFadeTimer);
  clearTimeout(thoughtClearTimer);
  clearTimeout(formOpenTimer);
  clearTimeout(autoStopTimer);
  thoughtFading.value = false;
  floatingDandelions.value = [];
  displayThought.value = "";

  // Tắt nhạc khi kết thúc meditation
  window.dispatchEvent(new CustomEvent("stop-music"));

  formOpenTimer = setTimeout(() => {
    showForm.value = true;
  }, 500);
}

onBeforeUnmount(() => {
  clearInterval(timer);
  clearInterval(messageTimer);
  clearTimeout(thoughtFadeTimer);
  clearTimeout(thoughtClearTimer);
  clearTimeout(formOpenTimer);
  clearTimeout(autoStopTimer);
});
</script>

<style scoped>
@import "../styles/meditation.css";
</style>
