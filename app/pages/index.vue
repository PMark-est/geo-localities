<script setup lang="ts">
import {usePagination} from "~/composable/usePagination";
import {useLocalities} from "~/composable/useLocalities";
import {useSearch} from "~/composable/useSearch";

const route = useRoute();
const lastListUrl = useState('lastListUrl', () => route.fullPath);
watch(() => route.fullPath, (path) => { lastListUrl.value = path }, { immediate: true });

const {searchInput, debouncedSearch} = useSearch();
const { page, limit, offset } = usePagination(10, searchInput);
const { items, total, pending } = useLocalities(offset, limit, debouncedSearch);
const { width } = useWindowSize();
const paginationSize = computed(() => width.value < 640 ? 'xs' : 'md');

const limits = ref([10, 20, 50, 100]);
</script>

<template>
  <div class="min-h-screen bg-[#0e1117] text-slate-200 font-sans">

    <!-- Header -->
    <header class="border-b border-white/5 bg-[#0e1117]/80 backdrop-blur-sm sticky top-0 z-20">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center">
            <svg class="w-4 h-4 text-[#0e1117]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
            </svg>
          </div>
          <span class="font-semibold text-white tracking-tight text-lg">Localities</span>
        </div>
        <span class="text-xs text-slate-500 font-mono tabular-nums">
          {{ total?.toLocaleString() ?? '—' }} kirjet
        </span>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-6 py-10">

      <!-- Hero -->
      <div class="mb-10">
        <h1 class="text-4xl font-bold text-white tracking-tight mb-2">
          Otsi asukohti
        </h1>
        <p class="text-slate-400 text-sm">
          Sirvi ja filtreeri registreeritud asulaid üle kogu maailma.
        </p>
      </div>

      <!-- Toolbar -->
      <div class="flex flex-col sm:flex-row gap-3 mb-6">
        <!-- Search -->
        <div class="relative flex-1">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <UInput
              v-model="searchInput"
              placeholder="Otsi asula nime järgi…"
              class="w-full pl-9 pr-10 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:border-amber-400/50 focus:ring-1 focus:ring-amber-400/30 outline-none transition-all"
          >
            <template v-if="searchInput?.length" #trailing>
              <UButton
                  color="neutral"
                  variant="link"
                  size="sm"
                  icon="i-lucide-circle-x"
                  aria-label="Tühjenda"
                  class="text-slate-500 hover:text-slate-300 transition-colors"
                  @click="searchInput = ''"
              />
            </template>
          </UInput>
        </div>

        <!-- Limit selector -->
        <div class="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-slate-400 shrink-0">
          <span class="text-slate-500 text-xs">Näita</span>
          <USelectMenu
              v-model="limit"
              :items="limits"
              variant="ghost"
              class="text-slate-200 font-mono text-sm min-w-[3rem]"
          />
          <span class="text-slate-500 text-xs">kirjet</span>
        </div>
      </div>

      <!-- Results table -->
      <div class="rounded-2xl border border-white/8 overflow-hidden bg-white/[0.02]">

        <!-- Table header -->
        <div class="grid grid-cols-[4rem_1fr_1fr] gap-4 px-5 py-3 border-b border-white/5 bg-white/[0.03]">
          <span class="text-xs font-mono text-slate-500 uppercase tracking-wider">ID</span>
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Asula</span>
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Riik</span>
        </div>

        <!-- Rows -->
        <ul class="divide-y divide-white/[0.04]">
          <li
              v-for="item in items"
              :key="item.id"
              class="group"
          >
            <NuxtLink
                :to="{ name: 'localities-id', params: { id: item.id } }"
                class="grid grid-cols-[4rem_1fr_1fr] gap-4 px-5 py-3.5 hover:bg-amber-400/[0.04] transition-colors duration-150 items-center"
            >
              <span class="font-mono text-xs text-slate-500 group-hover:text-amber-400/70 transition-colors">
                #{{ item.id }}
              </span>
              <span class="text-sm text-slate-200 font-medium group-hover:text-white transition-colors truncate">
                {{ item.name }}
              </span>
              <div class="flex items-center gap-2">
                <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 border border-white/8 text-xs text-slate-400 font-mono group-hover:border-amber-400/20 group-hover:text-slate-300 transition-all">
                  {{ item.country }}
                </span>
                <svg class="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400 transition-colors ml-auto opacity-0 group-hover:opacity-100 translate-x-0 group-hover:translate-x-0.5 duration-150" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </NuxtLink>
          </li>

          <!-- Empty state -->
          <li v-if="!items?.length" class="py-16 text-center">
            <div class="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3">
              <svg class="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>
              </svg>
            </div>
            <p class="text-sm text-slate-500">Asulaid ei leitud</p>
            <p class="text-xs text-slate-600 mt-1">Proovi teistsugust otsingut</p>
          </li>
        </ul>
      </div>

      <!-- Pagination -->
      <div class="mt-5 flex justify-center">
        <UPagination
            v-model:page="page"
            :total="total"
            :sibling-count="1"
            :size="paginationSize"
            show-edges
            class="[&_button]:bg-white/5 [&_button]:border-white/10 [&_button]:text-slate-400 [&_button:hover]:bg-amber-400/10 [&_button:hover]:border-amber-400/30 [&_button:hover]:text-amber-400 [&_button[aria-current]]:bg-amber-400 [&_button[aria-current]]:text-[#0e1117] [&_button[aria-current]]:font-bold rounded-xl"
        />
      </div>

    </main>
  </div>
</template>