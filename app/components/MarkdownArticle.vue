<script setup lang="ts">
defineProps<{
  html: string;
}>();
</script>

<template>
  <article class="markdown-body" v-html="html" />
</template>
