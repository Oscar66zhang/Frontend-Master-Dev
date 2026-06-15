<template>
  <div class="container">
    <h1>{{ message }}</h1>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const message = ref("Hello Vue 3!");
</script>

<style scoped>
</style>