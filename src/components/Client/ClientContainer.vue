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
        <div class="d-flex justify-space-between mt-3">
          <v-select
            v-model="filter"
            dense
            :items="filters"
            label="Filter By"
            hide-details="auto"
            outlined
            :append-outer-icon="!sortReverse ? `mdi-arrow-down` : `mdi-arrow-up`"
            @click:append-outer="sortReverse = !sortReverse"
          ></v-select>
        </div>
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

  const filters = ["Date of Next Appointment" , "First Name", "Last Name", "Email"] as const;

  export default Vue.extend({
    name: 'ChartsContainer',    
    data() {
      return {
        search: '',
        filters: filters,
        filter: filters[1] as typeof filters[number],
        sortReverse: false,
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
        const len = this.search.length
        
        var returnVal = [...this.clients]
        const getLowestTimeOr0 = (reminders: Reminder[], inf: boolean = false) => {
          const val = inf ? Infinity : 0;
          return reminders.length === 0 ? val : new Date( reminders.reduce((a1, b1) => new Date(a1.date).getTime() < new Date(b1.date).getTime() ? a1 : b1 ).date ).getTime();
        }

        switch (this.filter) {
          case "Date of Next Appointment":
            returnVal.sort((a,b) => {
              return getLowestTimeOr0(a.reminders, true)
              - 
              getLowestTimeOr0(b.reminders, true);
            })
            break;
          case "First Name":
            returnVal.sort((a,b) => {
              return a.fname.localeCompare(b.fname)
            })
            break;
          case "Last Name":
            returnVal.sort((a,b) => {
              return a.lname.localeCompare(b.lname)
            })
            break;
          case "Email":
            returnVal.sort((a,b) => {
              return a.email.localeCompare(b.email)
            })
            break;
        }

        if (this.sortReverse) {
          returnVal.reverse()
        }
        

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
