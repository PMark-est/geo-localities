export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',

    future: {
        compatibilityVersion: 4,
    },

    nitro: {
        preset: 'vercel'
    },

    devtools: { enabled: true },
    modules: [
        "@nuxt/ui",
        "@vueuse/nuxt",
    ],
    css: ['~/assets/css/main.css']
})