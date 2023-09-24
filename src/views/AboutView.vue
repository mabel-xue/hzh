<template>
  <div class="about">
    <n-space vertical>
      <n-input v-model:value="city" />
      <n-input v-model:value="date" />
      <n-button @click="handleSave">test</n-button>
    </n-space>
  </div>
</template>

<script setup lang="ts">
import { NInput, NButton, NSpace } from 'naive-ui'
import { saveBooked } from '@/apis';
import { ref } from 'vue';

const authed = ref(process.env.NODE_ENV === 'development')

const city = ref()
const date = ref()
const handleSave = async () => {
  if (city.value && (/^\d{4}$/).test(date.value)) {
    await saveBooked({
      city: city.value,
      date: date.value
    })
  }
}

</script>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
