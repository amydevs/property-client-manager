<template>
  <v-container>
    <v-card>
      <v-list>
        <template v-for="(setting, i) in settings">
          <v-list-item :key="i">
              <v-list-item-content>
                <v-list-item-title>{{setting.title}}</v-list-item-title>
                <v-list-item-subtitle>{{setting.subtitle}}</v-list-item-subtitle>

                <v-text-field v-if="setting.type == 'directory'"
                    :placeholder="setting.placeholder"
                    class="mt-3"
                    outlined
                    :hint="setting.hint"
                    append-icon="mdi-dots-horizontal-circle"
                    :rules="setting.rules"
                    v-model="setting.value"
                    hide-details="auto"
                    :ref="`${i}-picker`"
                    @change="setting.cb"
                    @click:append="openTDialog(setting, $refs[`${i}-picker`][0])"
                ></v-text-field>

              </v-list-item-content>
              <v-switch
                v-if="setting.type == 'bool'"
                v-model="setting.value"
                @change="setting.cb"
                flat
              ></v-switch>
          </v-list-item>
          <v-divider v-if="settings.length-1 !== i" :key="`divfor-${i}`"/>
        </template>
      </v-list>
    </v-card>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue'
  export default Vue.extend({
    name: 'Settings',
    data() {
      return {
        settings: [
          {
            type: 'directory',
            title: "Set Folder Path",
            subtitle: "Set Folder Path For Clients Here",
            placeholder: "C:\\Program Files\\Steam\\steamapps\\common\\Muse Dash\\",
            hint: "Please Press Enter After Typing in Your Path!",
            cb(v: string) {
              const existsBool = window.electron.fs.existsSync(v)
              if (existsBool) {
                console.log("Set Clients Path")
                window.electron.store.set("clientsPath", v)
                window.electron.ipc.invoke("clients-init")
              }
            },
            rules: [
              (v:string) => {
                const existsBool = window.electron.fs.existsSync(v)
                return existsBool || 'Folder Path does not exist.'
              }
            ],
            value: window.electron.store.get('clientsPath'),
          },
          {
            type: "bool",
            title: "Enable Light Mode",
            subtitle: "Switch the Toggle to Enable Light Mode",
            value: window.electron.store.get('lightMode'),
            cb: (v:boolean) => {
              this.$vuetify.theme.dark = !v;
              window.electron.store.set('lightMode', v)
            }
          }
        ]
      }
    },
    methods: {
      async openTDialog(e:any, i: any) {
        this.$nextTick(() => {
          setTimeout(() => {
            i.focus()
            const folders = window.electron.dialog.openDialog()
            if (folders) {
              e.value = folders[0]
            }
          })
        })
      },
    },
    async mounted() {
    }
  })
</script>
