<script setup lang="ts">
defineProps<{
  lesson: {
    title: string;
    chapterLabel: string;
    slideCount: number;
    summary: string;
    slidePath: string;
    markdownPath: string;
  };
}>();
</script>

<template>
  <UCard variant="outline" class="bg-white">
    <template #header>
      <div class="flex items-start justify-between gap-3">
        <div>
          <UBadge color="primary" variant="soft" class="mb-2">{{ lesson.chapterLabel }}</UBadge>
          <h3 class="text-lg font-bold text-slate-950">{{ lesson.title }}</h3>
        </div>
        <span class="text-xs text-slate-400">{{ lesson.slideCount }} slides</span>
      </div>
    </template>

    <p class="min-h-16 text-sm leading-6 text-slate-600">{{ lesson.summary }}</p>

    <template #footer>
      <div class="flex flex-wrap gap-2">
        <UButton :to="lesson.slidePath" icon="i-lucide-presentation" size="sm">スライド</UButton>
        <UButton :to="lesson.markdownPath" icon="i-lucide-book-open" size="sm" variant="outline">Markdown</UButton>
      </div>
    </template>
  </UCard>
</template>
