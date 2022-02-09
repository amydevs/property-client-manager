<template>
  <div class="text-center">
    <v-progress-circular
      v-if="!loaded"
      :size="50"
      indeterminate
      color="primary"
    ></v-progress-circular>
    <ClientContainer :clients="clients" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ClientContainer from '@/components/ClientContainer.vue'
import { Client } from '@/types/Client'

export default Vue.extend({
  name: 'Home',

  components: {
    ClientContainer
  },
  data: () => {
    return {
      clients: [
        {
          name: "A"
        },
        {
          name: "A"
        }
      ] as Client[],
      loaded: true
    }
  }
})
</script>
