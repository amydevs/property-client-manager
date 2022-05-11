<template>
  <div class="text-center">
    <v-progress-circular
      v-if="!loaded"
      :size="50"
      indeterminate
      color="primary"
    ></v-progress-circular>
    <ClientContainer :clients="$store.state.clientsdb.clients" />
    <v-btn
      fab 
      fixed
      right
      bottom
      color="primary"
      :to="{path: '/client-create'}"
    >
      <v-icon dark>
          mdi-plus
      </v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import ClientContainer from '@/components/Client/ClientContainer.vue'
import { Client } from '@/modules/ClientsDB'

export default Vue.extend({
  name: 'Home',

  components: {
    ClientContainer
  },
  data() {
    return {
      loaded: true,
      delFunc: null as null | (() => void),
    }
  },
  mounted() {
  },
  beforeDestroy() {
  },
})
</script>
