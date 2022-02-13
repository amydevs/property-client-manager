<template>
  <div class="text-center">
    <v-progress-circular
      v-if="!loaded"
      :size="50"
      indeterminate
      color="primary"
    ></v-progress-circular>
    <ClientContainer :clients="clientsdb.clients" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ClientContainer from '@/components/ClientContainer.vue'
import { TClient } from '@/modules/ClientsDB'

export default Vue.extend({
  name: 'Home',

  components: {
    ClientContainer
  },
  data: () => {
    return {
      clientsdb: window.electron.clients.get(),
      loaded: true
    }
  },
  mounted() {
    console.log(this.$data.clientsdb)
  }
})
</script>
