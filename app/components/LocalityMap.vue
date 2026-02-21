<!-- components/LocalityMap.vue -->
<script setup lang="ts">
import { onMounted, ref } from 'vue';

const props = defineProps<{
  lat: number | null | undefined;
  lng: number | null | undefined;
  name: string;
  elevation?: number | null;
  depth?: number | null;
}>();

const mapEl = ref<HTMLElement | null>(null);
const hasCoords = props.lat != null && props.lng != null;

onMounted(async () => {
  if (!hasCoords) return;

  const L = (await import('leaflet')).default;
  await import('leaflet/dist/leaflet.css');

  const map = L.map(mapEl.value!, {
    center: [props.lat!, props.lng!],
    zoom: 12,
    zoomControl: true,
    attributionControl: false,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
  }).addTo(map);

  const icon = L.divIcon({
    className: '',
    html: `
      <div style="position:relative;width:24px;height:24px;">
        <div style="
          position:absolute;inset:0;
          background:rgba(251,191,36,0.15);
          border-radius:50%;
          animation:ping 1.6s ease-out infinite;
        "></div>
        <div style="
          position:absolute;top:50%;left:50%;
          transform:translate(-50%,-50%);
          width:10px;height:10px;
          background:#fbbf24;
          border:2px solid #0e1117;
          border-radius:50%;
          box-shadow:0 0 8px rgba(251,191,36,0.5);
        "></div>
      </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });

  const popupLines = [
    `<strong style="color:#fff;font-size:13px;">${props.name}</strong>`,
    props.elevation != null ? `<span style="color:#94a3b8;">Kõrgus: <span style="color:#fbbf24;">${props.elevation.toFixed(1)} m</span></span>` : '',
    props.depth != null ? `<span style="color:#94a3b8;">Sügavus: <span style="color:#fbbf24;">${props.depth} m</span></span>` : '',
  ].filter(Boolean).join('<br/>');

  L.marker([props.lat!, props.lng!], { icon })
      .addTo(map)
      .bindPopup(popupLines, { className: 'locality-popup' })
      .openPopup();
});
</script>

<template>
  <div v-if="hasCoords" ref="mapEl" class="w-full h-full" />
  <div
      v-else
      class="w-full h-full flex flex-col items-center justify-center gap-3 bg-white/[0.02] border border-white/8 rounded-2xl"
  >
    <svg class="w-8 h-8 text-slate-700" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"/>
      <path stroke-linecap="round" stroke-linejoin="round" d="M3 3l18 18" class="text-slate-600"/>
    </svg>
    <div class="text-center">
      <p class="text-sm font-medium text-slate-600">Koordinaadid puuduvad</p>
      <p class="text-xs text-slate-700 mt-0.5">Kaart pole saadaval</p>
    </div>
  </div>
</template>

<style>
@keyframes ping {
  0%   { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(2.2); opacity: 0; }
}
.leaflet-control-zoom a {
  background: #1a1f2e !important;
  color: #94a3b8 !important;
  border-color: rgba(255,255,255,0.08) !important;
}
.leaflet-control-zoom a:hover {
  background: #fbbf24 !important;
  color: #0e1117 !important;
}
.locality-popup .leaflet-popup-content-wrapper {
  background: #1a1f2e;
  color: #e2e8f0;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
  padding: 10px 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  line-height: 1.7;
}
.locality-popup .leaflet-popup-content { margin: 0; }
.locality-popup .leaflet-popup-tip-container { display: none; }
</style>