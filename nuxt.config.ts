// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    future: {
        compatibilityVersion: 4,
    },

    compatibilityDate: '2025-07-15',


    nitro: {
        preset: 'netlify'
    },

    devtools: { enabled: true },

    modules: [
        "@nuxt/ui",
        "@vueuse/nuxt",
    ],

    css: ['~/assets/css/main.css'],

    ssr: true
})