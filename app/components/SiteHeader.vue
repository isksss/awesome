<script setup lang="ts">
defineProps<{
  dark?: boolean;
}>();
</script>

<template>
  <header :class="dark ? 'border-b border-white/10 bg-slate-950/90' : 'border-b border-slate-200 bg-white/90 backdrop-blur'">
    <div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
      <NuxtLink :class="dark ? 'font-bold text-white' : 'text-lg font-bold tracking-tight text-teal-900'" to="/">
        awesome
      </NuxtLink>
      <slot />
    </div>
  </header>
</template>
