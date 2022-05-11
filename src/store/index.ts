import { ClientsDB } from '@/modules/ClientsDB'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export interface State {
  clientsdb: ClientsDB | null
}

const store = new Vuex.Store<State>({
  state: {
    clientsdb: window.electron.clients.get()
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})

export class StoreUtils {
  static findClientById(id:string) {
    return store.state.clientsdb?.clients.find(client => client.id === id);
  }
  static findReminderById(id:string) {
      return store.state.clientsdb?.clients.flatMap(client => client.reminders).find(reminder => reminder.id === id);
  }
}

let timer = null as number | null;

store.watch( (state, getters) => JSON.stringify(state.clientsdb), (newValue, oldValue) => {
  if (timer) {
    clearTimeout(timer);
  }
  timer = window.setTimeout(() => {
    console.log("help")
    window.electron.clients.write(store.state.clientsdb as ClientsDB);
  }, 50) 
});

window.electron.ipc.receive("clients-changed", (event:any) => {
  // console.log("clientsdb received")
  store.state.clientsdb = event;
});

// export const StoreManager = new Vue({
//   // reactive getter that reads the clientsdb global variable as a string
//   computed: {
//     storestate(): ClientsDB {
//       return store.state.clientsdb as ClientsDB;
//     },
//   },
//   // watch the string value of clientsdb for changes, if changes are detected, tell the backend to write to the clients database file.
//   watch: {
//     storestate: {
//       deep: true,
//       handler(val: ClientsDB) {
//         if (val != oldval) {
//           console.log("store changed")
//           window.electron.clients.write(store.state.clientsdb as ClientsDB)
//         }
//       }
//     }
//   },
//   // when a change is detected in the clients database file, the clientsdb global variable is refreshed with new information.
//   created() {
//     window.electron.ipc.receive("clients-changed", (event:any) => {
//       store.state.clientsdb = event;
//     });
//   }
// });

export default store;