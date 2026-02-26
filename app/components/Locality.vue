<script setup lang="ts">
import { fetchLocality } from "~/services/localities";
import type { Locality } from "~/interfaces/locality.interface";

const props = defineProps<{ id: number | string }>();
const locality: Locality = await fetchLocality(props.id);
const lastListUrl = useState('lastListUrl', () => '/');

const elevation = locality.elevation ? parseFloat(locality.elevation) : null;

function formatDate(d: string | null) {
  if (!d) return null;
  return new Date(d).toLocaleDateString('et-EE', { day: 'numeric', month: 'long', year: 'numeric' });
}

const identifiers = [
  { label: 'Kood',          value: locality.code },
  { label: 'Number',        value: locality.number },
  { label: 'Maamet ID',     value: locality.land_board_id },
  { label: 'EPSG',          value: locality.epsg },
  { label: 'Coord süsteem', value: locality.coordinate_system },
  { label: 'CoordX',        value: locality.coordx },
  { label: 'CoordY',        value: locality.coordy },
];

const stats = [
  { label: 'Kõrgus',    value: elevation,       unit: 'm',  format: (v: number) => v.toFixed(1) },
  { label: 'Sügavus',   value: locality.depth,  unit: 'm',  format: (v: number) => String(v) },
  { label: 'Pindala',   value: locality.area,   unit: 'm²', format: (v: number) => String(v) },
];
</script>

<template>
  <div class="min-h-screen bg-[#0e1117] text-slate-200 font-sans">

    <!-- Header -->
    <header class="border-b border-white/5 bg-[#0e1117]/80 backdrop-blur-sm sticky top-0 z-20">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center gap-4">
        <NuxtLink
            :to="lastListUrl"
            class="flex items-center gap-1.5 text-slate-500 hover:text-amber-400 transition-colors text-sm group"
        >
          <svg class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
          Tagasi
        </NuxtLink>
        <span class="text-white/10">|</span>
        <span class="text-slate-500 font-mono text-sm">#{{ locality.id }}</span>
      </div>
    </header>

    <main class="max-w-5xl mx-auto px-6 py-10 space-y-6">

      <!-- Hero -->
      <div>
        <div class="flex flex-wrap items-center gap-2 mb-1">
          <span class="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-mono">
            {{ locality.country }}
          </span>
          <span class="text-xs text-slate-600 font-mono">
            {{ locality.latitude?.toFixed(5) }}, {{ locality.longitude?.toFixed(5) }}
          </span>
        </div>
        <h1 class="text-5xl font-bold text-white tracking-tight leading-tight">{{ locality.name }}</h1>
        <p v-if="locality.name_en && locality.name_en !== locality.name" class="text-slate-400 text-xl mt-1">
          {{ locality.name_en }}
        </p>
      </div>

      <!-- Stat cards — always all three, greyed out if missing -->
      <div class="grid grid-cols-3 gap-3">
        <div
            v-for="stat in stats"
            :key="stat.label"
            class="rounded-xl border px-4 py-4 transition-all"
            :class="stat.value != null
            ? 'border-white/8 bg-white/[0.02] hover:border-amber-400/20'
            : 'border-white/[0.04] bg-white/[0.01]'"
        >
          <div class="text-xs mb-1" :class="stat.value != null ? 'text-slate-500' : 'text-slate-700'">
            {{ stat.label }}
          </div>
          <div v-if="stat.value != null" class="text-2xl font-bold text-white tabular-nums">
            {{ stat.format(stat.value) }}<span class="text-sm font-normal text-slate-400 ml-1">{{ stat.unit }}</span>
          </div>
          <div v-else class="text-2xl font-bold text-slate-700">—</div>
        </div>
      </div>

      <!-- Stratigraphy — always shown -->
      <div class="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
        <div class="px-5 py-3 border-b border-white/5 bg-white/[0.03]">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stratigraafia</span>
        </div>
        <div class="grid grid-cols-2 divide-x divide-white/[0.04]">
          <div class="px-5 py-4">
            <div class="text-xs text-slate-500 mb-1">Lagi (top)</div>
            <div class="text-sm font-medium" :class="locality.stratigraphy_top_text ? 'text-white' : 'text-slate-700'">
              {{ locality.stratigraphy_top_text || '—' }}
            </div>
          </div>
          <div class="px-5 py-4">
            <div class="text-xs text-slate-500 mb-1">Alus (base)</div>
            <div class="text-sm font-medium" :class="locality.stratigraphy_base_text ? 'text-white' : 'text-slate-700'">
              {{ locality.stratigraphy_base_text || '—' }}
            </div>
          </div>
        </div>
      </div>

      <!-- Map + identifiers -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 rounded-2xl border border-white/8 overflow-hidden" style="height: 360px;">
          <ClientOnly>
            <LocalityMap :lat="locality.latitude" :lng="locality.longitude" :name="locality.name" :elevation="elevation" :depth="locality.depth" />
            <template #fallback>
              <div class="w-full h-full bg-white/[0.02] flex items-center justify-center">
                <div class="w-5 h-5 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin"/>
              </div>
            </template>
          </ClientOnly>
        </div>

        <!-- Identifiers — always all rows -->
        <div class="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden self-start">
          <div class="px-5 py-3 border-b border-white/5 bg-white/[0.03]">
            <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Identifikaatorid</span>
          </div>
          <dl class="divide-y divide-white/[0.04]">
            <div
                v-for="item in identifiers"
                :key="item.label"
                class="flex items-start justify-between gap-4 px-5 py-2.5"
            >
              <dt class="text-xs text-slate-500 font-mono shrink-0 pt-0.5">{{ item.label }}</dt>
              <dd class="text-xs font-mono text-right break-all" :class="item.value != null ? 'text-slate-300' : 'text-slate-700'">
                {{ item.value ?? '—' }}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- Remarks — always shown -->
      <div class="rounded-2xl border border-white/8 bg-white/[0.02] overflow-hidden">
        <div class="px-5 py-3 border-b border-white/5 bg-white/[0.03]">
          <span class="text-xs font-semibold text-slate-500 uppercase tracking-wider">Märkused</span>
        </div>
        <div class="px-5 py-4 space-y-3">
          <p class="text-sm leading-relaxed" :class="locality.remarks ? 'text-slate-300' : 'text-slate-700 italic'">
            {{ locality.remarks || 'Märkused puuduvad' }}
          </p>
          <div class="flex items-start gap-2">
            <svg class="w-3.5 h-3.5 mt-0.5 shrink-0" :class="locality.remarks_location ? 'text-amber-400/60' : 'text-slate-700'" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z"/>
            </svg>
            <p class="text-sm italic" :class="locality.remarks_location ? 'text-slate-400' : 'text-slate-700'">
              {{ locality.remarks_location || 'Asukoha märkus puudub' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Footer meta — always shown -->
      <div class="flex flex-wrap gap-x-6 gap-y-1 text-xs font-mono pt-2 border-t border-white/[0.04]">
        <span :class="locality.date_added ? 'text-slate-600' : 'text-slate-800'">
          Lisatud: {{ locality.date_added ? formatDate(locality.date_added) : '—' }}
        </span>
        <span :class="locality.date_changed ? 'text-slate-600' : 'text-slate-800'">
          Muudetud: {{ locality.date_changed ? formatDate(locality.date_changed) : '—' }}
        </span>
      </div>

    </main>
  </div>
</template>