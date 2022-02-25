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
        ></v-text-field> <!-- textfield that displays a warning if no clients are found -->
        <div class="d-flex justify-space-between mt-3">
          <v-select
            v-model="sortBy"
            dense
            :items="sorts"
            label="Filter By"
            hide-details="auto"
            outlined
            :append-outer-icon="!sortReverse ? `mdi-arrow-down` : `mdi-arrow-up`"
            @click:append-outer="sortReverse = !sortReverse"
          ></v-select> <!-- sort by dropdown menu -->
        </div>
      </v-card>
      <ClientComp v-for="(client, i) in searchFilter" :client="client" :key="i" />
    </v-row>
  </v-container>
  </div>
</template>
<script lang="ts">
  // imports boilerplate modules relating to the VueJS framework
  import Vue from 'vue'
  import ClientComp from '@/components/Client/Client.vue'
  import { Client, Reminder } from '@/modules/ClientsDB'

  // an array of ways the data can be sorted
  const sorts = ["Date of Next Reminder" , "First Name", "Last Name", "Email"] as const;

  export default Vue.extend({
    name: 'ChartsContainer',
    data() {
      return {
        search: '', // the search string, determined by the search input textbox
        sorts: sorts, // an array of ways the data can be sorted, displayed by the sort dropdown menu
        sortBy: sorts[0] as typeof sorts[number], // currently selected sort method, determined by the sort dropdown menu
        sortReverse: false, // whether the sort order is reversed, determined by the toggle button next to the sort dropdown menu
        length: 1, // the number of clients that are in the filtered out array of clients
      }
    },
    // imported component that represents a single client
    components: {
      ClientComp
    },
    props: {
      // array of clients is passed into the module
      clients: {
        type: Array as () => Client[]
      }
    },
    computed: {
      searchFilter(): Client[] {
        // create a variable that is the length of the search string
        const len = this.search.length
        
        // creates a copy of the array, so that the original reference to the array that is passed in is not mutated
        var returnVal = this.clients.slice()

        // nested function to get reminder with closest date, or else, return either infinite or 0 based on the value of 'inf'
        const getLowestTimeOr0 = (reminders: Reminder[], inf: boolean = false) => {
          const val = inf ? Infinity : 0;
          return reminders.length === 0 ? val : new Date( reminders.reduce((a1, b1) => new Date(a1.date).getTime() < new Date(b1.date).getTime() ? a1 : b1 ).date ).getTime();
        }

        // Switch case of values accepted by the dropdown menu, running the function that is called to sort the array
        switch (this.sortBy) {
          case "Date of Next Reminder":
            // compares each client, and sorts them based on the date of the next reminder
            returnVal.sort((a,b) => {
              return getLowestTimeOr0(a.reminders, true)
              - 
              getLowestTimeOr0(b.reminders, true);
            })
            break;
          case "First Name":
            // compares each client, and sorts them based on their first name
            returnVal.sort((a,b) => {
              return a.fname.localeCompare(b.fname)
            })
            break;
          case "Last Name":
            // compares each client, and sorts them based on their last name
            returnVal.sort((a,b) => {
              return a.lname.localeCompare(b.lname)
            })
            break;
          case "Email":
            // compares each client, and sorts them based on their email
            returnVal.sort((a,b) => {
              return a.email.localeCompare(b.email)
            })
            break;
        }

        // boolean determines whether the array of clients is reversed or not
        if (this.sortReverse) {
          returnVal.reverse()
        }
        
        // Compares the lowercase version of the search string to lowercase versions each client's first name, last name, and email in the array of clients
        const lowercaseSearch = this.search.toLowerCase()
        returnVal = returnVal.filter(e => {
          var searchBool = true
          if (len !== 0) {
            // concatinates the booleans, if any of the conditions are satisifed, the concatinated value is returned as True. Hence, those that do not return true are filtered out.
            searchBool =  (
              e.fname.toLowerCase().includes(lowercaseSearch) ||
              e.lname.toLowerCase().includes(lowercaseSearch) ||
              e.email.toLowerCase().includes(lowercaseSearch) ||
              e.phone.toLowerCase().includes(lowercaseSearch) ||
              e.id.toLowerCase() === lowercaseSearch
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
