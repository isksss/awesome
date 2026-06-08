<script setup lang="ts">
import siteData from "~/data/site.json";

const route = useRoute();
const slug = (Array.isArray(route.params.slug) ? route.params.slug.join("/") : String(route.params.slug)).replace(
  /\/+$/,
  "",
);
const lesson = siteData.lessons.find((item) => item.routeSlug === slug);

if (!lesson) {
  throw createError({ statusCode: 404, statusMessage: "スライドが見つかりません" });
}

const runtimeConfig = useRuntimeConfig();
const raw = ref("");
const loading = ref(true);
const errorMessage = ref("");
const rawUrl = `${runtimeConfig.app.baseURL.replace(/\/$/, "")}${lesson.rawPath}`;

const slides = computed(() =>
  stripSlideDirectives(stripFrontmatter(raw.value))
    .split(/\n---\n/g)
    .map((slide) => slide.trim())
    .filter(Boolean)
    .map((slide) => renderMarkdown(slide)),
);

useHead({ title: `${lesson.title} スライド | awesome` });

onMounted(async () => {
  try {
    raw.value = await $fetch<string>(rawUrl);
  } catch {
    errorMessage.value = "Markdownを読み込めませんでした。";
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <SiteHeader dark>
      <div class="flex items-center gap-2">
        <UBadge color="primary" variant="soft">{{ lesson.chapterLabel }}</UBadge>
        <UButton :to="lesson.markdownPath" icon="i-lucide-book-open" size="sm" variant="soft">Markdown</UButton>
      </div>
    </SiteHeader>

    <main class="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:px-8">
      <div v-if="loading" class="rounded-lg border border-white/15 bg-white/10 p-6 text-sm text-slate-300">
        読み込み中...
      </div>
      <div v-else-if="errorMessage" class="rounded-lg border border-red-300/30 bg-red-950/30 p-6 text-sm text-red-100">
        {{ errorMessage }}
      </div>
      <SlideViewer v-else :slides="slides" />
    </main>
  </div>
</template>
