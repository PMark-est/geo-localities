<script setup lang="ts">

// 4h kulunud
// kysi api kohta
import {usePagination} from "~/composable/usePagination";
import {useLocalities} from "~/composable/useLocalities";
import {useSearch} from "~/composable/useSearch";

const {searchInput, debouncedSearch} = useSearch();
const { page, limit, offset } = usePagination(10, searchInput);
const { items, total, pending } = useLocalities(offset, limit, debouncedSearch);


const limits = ref([10, 20, 50, 100]);

</script>

<template>
  <div>
    Näidata
    <USelectMenu
        v-model="limit"
        :items="limits"
        variant="ghost"
    />
  </div>
  <UInput v-model="searchInput" placeholder="Otsi">
    <template v-if="searchInput?.length" #trailing>
      <UButton
          color="neutral"
          variant="link"
          size="sm"
          icon="i-lucide-circle-x"
          aria-label="Clear input"
          @click="searchInput = ''"
      />
    </template>
  </UInput>
  <ul>
    <li v-for="item in items">
      <NuxtLink :to="{ name: 'localities-id', params: { id: item.id } }">
        <h1>{{ item.id }}, {{ item.name }}, {{ item.country }}</h1>
      </NuxtLink>
    </li>
  </ul>
  <UPagination
      v-model:page="page"
      :total="total"
  />
</template>