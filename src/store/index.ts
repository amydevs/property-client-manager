import { ClientsDB } from '@/modules/ClientsDB'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// Defines the type of the database storage accessible in the frontend.
export interface State {
  clientsdb: ClientsDB | null,
  imgKey: string,
}

// Initialize the database storage accessible in the frontend.
const store = new Vuex.Store<State>({
  state: {
    clientsdb: window.electron.clients.get(),
    imgKey: "",
  }
})

// Exports static helper functions to access the database in the frontend.
export class StoreUtils {
  static findClientById(id:string) {
    return store.state.clientsdb?.clients.find(client => client.id === id);
  }
  static findReminderById(id:string) {
      return store.state.clientsdb?.clients.flatMap(client => client.reminders).find(reminder => reminder.id === id);
  }
}

// initializes a variable with null value, that is to be used to store the id's of timers
let timer = null as number | null;
store.watch( (state, getters) => JSON.stringify(state.clientsdb), (newValue, oldValue) => {
  // if a timer's id is stored in cache, cancel the execution of the function that is to be run when the timer reaches zero.
  if (timer) {
    clearTimeout(timer);
  }

  // create a new timer that tells the backend to write changes the database's changes to disk when it reaches zero.
  timer = window.setTimeout(() => {
    window.electron.clients.write(store.state.clientsdb as ClientsDB);
  }, 50) 
});

// when a change is deteced on the database in the backend, the changes are written to the frontend copy of the database.
window.electron.ipc.receive("clients-changed", (event:any) => {
  store.state.clientsdb = event;
});

export default store;