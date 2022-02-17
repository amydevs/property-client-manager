import Vue from "vue"
export default new Vue({
    data() {
        return {
            clientsdb: window.electron.clients.get()
        }
    },
    watch: {
        clientsdbstring(val:string, oldval:string) {
            if (val !== oldval && this.clientsdb) {
                window.electron.clients.write(this.clientsdb)
            }
        }
    },
    computed: {
        clientsdbstring(): string {
            return JSON.stringify(this.clientsdb);
        },
    },
    created() {
        window.electron.ipc.receive("clients-changed", (event:any) => {
            console.log("changed")
            this.clientsdb = event;
        });
    }
})