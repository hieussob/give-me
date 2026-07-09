<template>
  <router-view v-slot="{ Component, route }">
    <component :is="Component" :key="route.path" />
  </router-view>
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
  font-family: 'Inter', system-ui, sans-serif;
  background: #030712;
  color: #fff;
  -webkit-font-smoothing: antialiased;
}
#app {
  min-height: 100vh;
}
</style>
