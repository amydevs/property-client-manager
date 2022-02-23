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
            Your Folder for Storing Clients' Information and Documents has not been set. Please set it here:
            <v-text-field
                label="Game Path"
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
  
  export default Vue.extend({
    name: 'PathDialogue',
    data () {
      return {
        clientsPath: "C:\\",
        dialog: false,
        rules: [
          () => window.electron.fs.existsSync(this.$data.clientsPath) || "Game Path Does Not Exist"
        ]
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
      exit() {
        if (window.electron.fs.existsSync(this.clientsPath)) {
          window.electron.store.set("clientsPath", this.clientsPath)
          window.electron.ipc.invoke("clients-init")
          this.dialog = false
        }
        else {
          console.log("Invalid Path")
        }
      },
    }
  })
</script>