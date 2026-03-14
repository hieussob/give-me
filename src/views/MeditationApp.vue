<template>
  <div class="app">
    <!-- <PeachBlossomField :running="running" /> -->
    <SproutField :running="running" />

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
        <!-- Thought text inside sun - fades into center glow -->
        <div class="thought-sun" :class="{ fading: fadeOut && thoughtFading }">
          <div class="sun-glow"></div>
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

function startMeditation() {
  if (!thoughtTrimmed.value) return;
  running.value = true;
  secondsLeft.value = duration;
  currentMessageIndex.value = 0;
  displayThought.value = thought.value;
  thoughtFading.value = false;

  // Bật nhạc khi bắt đầu meditation
  window.dispatchEvent(new CustomEvent("play-music"));

  if (fadeOut.value) {
    setTimeout(() => (thoughtFading.value = true), 2000);
    setTimeout(() => {
      displayThought.value = "";
      thought.value = "";
    }, 5000);
  }

  timer = setInterval(() => {
    if (secondsLeft.value > 0) secondsLeft.value--;
    else stopMeditation();
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
  thoughtFading.value = false;
  displayThought.value = "";

  // Tắt nhạc khi kết thúc meditation
  window.dispatchEvent(new CustomEvent("stop-music"));

  setTimeout(() => {
    showForm.value = true;
  }, 500);
}

onBeforeUnmount(() => {
  clearInterval(timer);
  clearInterval(messageTimer);
});
</script>

<style scoped>
@import "../styles/meditation.css";
</style>
