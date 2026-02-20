<script setup lang="ts">
import {useLocality} from "~/composable/useLocalities";


const props = defineProps<{
  id: number | string;
}>();

const locality = await useLocality(props.id);


</script>

<template>
  <h1>{{locality.name}} / {{locality.name_en}}</h1>
  <li v-for="[key, value] in Object.entries(locality)">
    {{key}} : {{value}}
  </li>
</template>