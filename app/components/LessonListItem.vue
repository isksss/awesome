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
  <li class="border-b border-slate-200 bg-white px-4 py-4 last:border-b-0 sm:px-5">
    <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div class="min-w-0">
        <div class="mb-2 flex flex-wrap items-center gap-2">
          <UBadge color="primary" variant="soft">{{ lesson.chapterLabel }}</UBadge>
          <span class="text-xs text-slate-400">{{ lesson.slideCount }} slides</span>
        </div>
        <h3 class="text-base font-bold text-slate-950">{{ lesson.title }}</h3>
        <p class="mt-1 text-sm leading-6 text-slate-600">{{ lesson.summary }}</p>
      </div>

      <div class="flex shrink-0 flex-wrap gap-2">
        <UButton :to="lesson.slidePath" icon="i-lucide-presentation" size="sm">スライド</UButton>
        <UButton :to="lesson.markdownPath" icon="i-lucide-book-open" size="sm" variant="outline">Markdown</UButton>
      </div>
    </div>
  </li>
</template>
