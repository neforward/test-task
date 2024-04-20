<script setup>
import Header from "./components/Header.vue";
import { RouterView } from "vue-router";
</script>

<template>
  <div class="wrapper-container">
    <div class="wrapper">
      <Header />
      <Router-view />
    </div>
  </div>
</template>
