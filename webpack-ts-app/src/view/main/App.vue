<template>
  <div class="container">
    <h1>{{ message }}</h1>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { request_axios } from "../../request/request_axios";
request_axios("/api/index.action", { method: "get" });
const message = ref("");
</script>

<style scoped></style>
