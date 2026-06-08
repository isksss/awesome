<script setup lang="ts">
const props = defineProps<{
  slides: string[];
}>();

const current = ref(0);
const currentSlide = computed(() => props.slides[current.value] ?? "");
const pageText = computed(() => `${current.value + 1} / ${props.slides.length}`);

function next() {
  current.value = Math.min(current.value + 1, props.slides.length - 1);
}

function prev() {
  current.value = Math.max(current.value - 1, 0);
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === "ArrowRight" || event.key === " ") next();
  if (event.key === "ArrowLeft") prev();
}

onMounted(() => window.addEventListener("keydown", onKeydown));
onBeforeUnmount(() => window.removeEventListener("keydown", onKeydown));
</script>

<template>
  <div class="flex flex-col gap-4">
    <section class="aspect-video overflow-hidden rounded-lg border border-white/15 bg-slate-50 p-10 text-slate-950 shadow-2xl">
      <article class="slide-body" v-html="currentSlide" />
    </section>

    <div class="flex items-center justify-between">
      <UButton icon="i-lucide-chevron-left" variant="soft" :disabled="current === 0" @click="prev">前へ</UButton>
      <span class="font-mono text-sm text-slate-300">{{ pageText }}</span>
      <UButton trailing-icon="i-lucide-chevron-right" variant="soft" :disabled="current >= slides.length - 1" @click="next">次へ</UButton>
    </div>
  </div>
</template>
