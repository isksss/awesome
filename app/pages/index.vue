<script setup lang="ts">
import siteData from "~/data/site.json";

const lessons = siteData.lessons;
const groups = siteData.groups;
const stats = siteData.stats;

useHead({
  title: "awesome",
  meta: [
    {
      name: "description",
      content: "汎用的な技術教材を本文とHTMLスライドで読める静的サイトです。",
    },
  ],
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <SiteHeader>
      <div class="flex items-center gap-2">
        <UBadge color="primary" variant="soft">{{ stats.lessonCount }} 教材</UBadge>
        <UBadge color="neutral" variant="outline">16:9 slides</UBadge>
      </div>
    </SiteHeader>

    <main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <section class="mb-8">
        <div class="max-w-3xl">
          <p class="mb-3 text-sm font-semibold text-teal-700">docs 配下の教材ライブラリ</p>
          <h1 class="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            技術資料を本文・スライドでまとめて読む
          </h1>
          <p class="mt-4 text-base leading-8 text-slate-600">
            Git、Docker、Linux、Vim/Neovim から Web、Security、Network、DB まで、すべて同じ Markdown をソースにして公開します。
          </p>
        </div>
      </section>

      <section class="mb-8 grid gap-4 sm:grid-cols-3">
        <UCard variant="subtle">
          <p class="text-sm text-slate-500">教材数</p>
          <p class="mt-1 text-3xl font-bold text-slate-950">{{ stats.lessonCount }}</p>
        </UCard>
        <UCard variant="subtle">
          <p class="text-sm text-slate-500">カテゴリ</p>
          <p class="mt-1 text-3xl font-bold text-slate-950">{{ groups.length }}</p>
        </UCard>
        <UCard variant="subtle">
          <p class="text-sm text-slate-500">公開形式</p>
          <p class="mt-1 text-lg font-semibold text-slate-950">Markdown / Slide</p>
        </UCard>
      </section>

      <section v-for="group in groups" :id="group.key" :key="group.key" class="mb-10">
        <div class="mb-4 flex items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-950">{{ group.label }}</h2>
            <p class="mt-1 text-sm text-slate-500">{{ group.items.length }} 件の教材</p>
          </div>
        </div>

        <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <LessonCard v-for="lesson in group.items" :key="lesson.slug" :lesson="lesson" />
        </div>
      </section>
    </main>
  </div>
</template>
