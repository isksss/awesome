import fs from "node:fs";

const routesPath = "app/data/routes.json";
const prerenderRoutes = fs.existsSync(routesPath)
  ? JSON.parse(fs.readFileSync(routesPath, "utf8"))
  : [];

export default defineNuxtConfig({
  modules: ["@nuxt/ui"],
  app: {
    baseURL: process.env.NUXT_APP_BASE_URL ?? "/",
  },
  ssr: true,
  css: ["~/assets/css/main.css"],
  nitro: {
    output: {
      publicDir: "dist/site",
    },
    prerender: {
      crawlLinks: true,
      routes: prerenderRoutes,
    },
  },
  compatibilityDate: "2026-06-09",
});
