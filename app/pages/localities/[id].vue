<script setup lang="ts">

const route = useRoute();
const id = route.params.id;

</script>

<template>
  <locality :id="id" />
</template>