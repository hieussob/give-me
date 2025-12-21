<template>
  <router-view />
  <AudioPlayer />
  <LanguageSwitcher />
</template>

<script setup>
import AudioPlayer from './components/AudioPlayer.vue'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
body {
  font-family: sans-serif;
  background: #020617;
  color: #fff;
}
#app {
  min-height: 100vh;
}
</style>
