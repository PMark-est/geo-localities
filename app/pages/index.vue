<script setup lang="ts">
import {useLocalities} from "~/composable/useLocalities";

const data = await useLocalities();
</script>

<template>
  <li v-for="item in data.results">
    <NuxtLink :to="{ name: 'localities-id', params: { id: item.id } }">
      <h1>{{item.id}}, {{item.name}}, {{item.country}}</h1>
    </NuxtLink>
  </li>
</template>