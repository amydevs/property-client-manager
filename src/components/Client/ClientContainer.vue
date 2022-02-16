<template>
  <div>
  <v-container>
    <v-row class="justify-center">
      <v-card width="100%" class="ma-3 pa-4">
        <v-text-field
            v-model="search"
            label="Search"
            outlined
            clearable
            hide-details="auto"            
            :rules="[() => (length != 0 || 'No Clients Found...')]"
        ></v-text-field>
      </v-card>
      <ClientComp v-for="(client, i) in searchFilter" :client="client" :key="i" />
    </v-row>
  </v-container>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import ClientComp from '@/components/Client/Client.vue'
  import { Client, Reminder } from '@/modules/ClientsDB'

  export default Vue.extend({
    name: 'ChartsContainer',    
    data() {
      return {
        search: '',
        length: 1,
      }
    },
    components: {
      ClientComp
    },
    props: {
      clients: {
        type: Array as () => Client[]
      }
    },
    computed: {
      searchFilter(): Client[] {
        const len = this.search.length as number
        
        var returnVal = this.clients
        const getLowestTimeOr0 = (reminders: Reminder[], inf: boolean = false) => {
          const val = inf ? Infinity : 0;
          return reminders.length === 0 ? val : new Date( reminders.reduce((a1, b1) => a1.date.getTime() < b1.date.getTime() ? a1 : b1 ).date ).getTime();
        }
        this.clients.sort((a,b) => {
          return getLowestTimeOr0(a.reminders, true)
          - 
          getLowestTimeOr0(b.reminders, true);
        })

        const lowercaseSearch = this.search.toLowerCase()
        returnVal = returnVal.filter(e => {
          var searchBool = true
          if (len !== 0) {
            searchBool =  (
              e.fname.toLowerCase().includes(lowercaseSearch)
            )
          }
          return searchBool
        })
        this.length = returnVal.length
        return returnVal
      }
    }
  })
</script>
