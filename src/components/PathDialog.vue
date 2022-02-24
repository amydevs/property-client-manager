<template>
    <v-dialog
      v-model="dialog"
      width="500"
      persistent
    >

      <v-card>
        <v-toolbar
          color="primary"
          dark
          class="text-h5"
        >Set Clients Folder Path</v-toolbar>
        <v-card-text class="pt-3">
            Your Folder for Storing Clients' Information and Documents has not been set. Please set it here. (It is recommended that you create a new empty folder somewhere for this purpose)
            <v-text-field
                ref="pathfield"
                label="Clients Folder Path"
                placeholder="C:\Program Files\Steam\steamapps\common\Muse Dash\"
                class="mt-3"
                outlined
                hide-details="auto"
                append-icon="mdi-dots-horizontal-circle"
                v-model="clientsPath"
                :rules="rules"
                @click:append="openTDialog"
            ></v-text-field>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            text
            @click="exit"
          >
            Enter
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>
<script lang="ts">
  import Vue from 'vue'
  import path from 'path'
  
  export default Vue.extend({
    name: 'PathDialogue',
    data () {
      return {
        clientsPath: path.join(window.electron.app.getDocumentsPath(), "clients_folder"),
        dialog: false,
        rules: [
          () => window.electron.fs.existsSync(this.$data.clientsPath) || "Clients Folder Path Does Not Exist"
        ],
      }
    },
    async mounted() {
      if (!window.electron.fs.existsSync(window.electron.store.get("clientsPath"))) {
        this.dialog = true
      }
    },
    methods: {
      async openTDialog() {
        const folders = window.electron.dialog.openDialog()
        if (folders) {
          this.clientsPath = folders[0]
        }
      },
      async exit() {
        if (window.electron.fs.existsSync(this.clientsPath)) {
            
            window.electron.store.set("clientsPath", this.clientsPath)
            await window.electron.ipc.invoke("clients-init")
            this.dialog = false
        }
        else {
            await this.$nextTick(() => {
                setTimeout(() => {
                    (this.$refs.pathfield as any).$refs.input.focus()
                });
                this.clientsPath += " "
            });
            await this.$nextTick(() => {
                this.clientsPath = this.clientsPath.slice(0, -1)
            });
            console.log("Invalid Path")
        }
      },
    }
  })
</script>