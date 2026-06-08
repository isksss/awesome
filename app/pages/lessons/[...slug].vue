<script setup lang="ts">
import siteData from "~/data/site.json";
const route = useRoute();
const slug = (Array.isArray(route.params.slug) ? route.params.slug.join("/") : String(route.params.slug)).replace(
  /\/+$/,
  "",
);
const lesson = siteData.lessons.find((item) => item.routeSlug === slug);

if (!lesson) {
  throw createError({ statusCode: 404, statusMessage: "教材が見つかりません" });
}

useHead({
  title: `${lesson.title} | awesome`,
});

const runtimeConfig = useRuntimeConfig();
const raw = ref("");
const loading = ref(true);
const errorMessage = ref("");
const rawUrl = `${runtimeConfig.app.baseURL.replace(/\/$/, "")}${lesson.rawPath}`;

function stripForReading(markdown: string) {
  return stripFrontmatter(markdown)
    .replace(/^<!--\s*_class:\s*title\s*-->\n*/gm, "")
    .replace(/^---$/gm, "");
}

const rendered = computed(() => renderMarkdown(stripForReading(raw.value)));

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
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <SiteHeader>
      <div class="flex flex-wrap gap-2">
        <UButton :to="lesson.slidePath" icon="i-lucide-presentation" size="sm">スライド</UButton>
      </div>
    </SiteHeader>

    <main class="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <UCard class="bg-white">
        <template #header>
          <div class="flex flex-wrap items-center gap-2">
            <UBadge color="primary" variant="soft">{{ lesson.chapterLabel }}</UBadge>
            <UBadge color="neutral" variant="outline">{{ lesson.slideCount }} slides</UBadge>
            <UBadge color="neutral" variant="outline">16:9</UBadge>
          </div>
        </template>

        <div v-if="loading" class="text-sm text-slate-500">読み込み中...</div>
        <div v-else-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</div>
        <MarkdownArticle v-else :html="rendered" />
      </UCard>
    </main>
  </div>
</template>
