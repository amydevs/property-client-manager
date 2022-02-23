import Vue from "vue"
export default new Vue({
    // initialize clients database global variable
    data() {
        return {
            clientsdb: window.electron.clients.get()
        }
    },
    // reactive getter that reads the clientsdb global variable as a string
    computed: {
        clientsdbstring(): string {
            return JSON.stringify(this.clientsdb);
        },
    },
    // watch the string value of clientsdb for changes, if changes are detected, tell the backend to write to the clients database file.
    watch: {
        clientsdbstring(val:string, oldval:string) {
            if (val !== oldval && this.clientsdb) {
                window.electron.clients.write(this.clientsdb)
            }
        }
    },
    // when a change is detected in the clients database file, the clientsdb global variable is refreshed with new information.
    created() {
        window.electron.ipc.receive("clients-changed", (event:any) => {
            console.log("changed")
            this.clientsdb = event;
        });
    }
})