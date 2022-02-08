<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      temporary
      app
    >
      <v-list
        dense nav
      >
        <v-list-item-group color='primary' mandatory>
            <v-list-item
                v-for="item in items"
                :key="item.title"
                
                router :to="item.route"
            >
              <v-list-item-icon>
                  <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-icon>
              <v-list-item-title>
                {{ item.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list-item-group>
        </v-list>
    </v-navigation-drawer>
    
    <v-app-bar
      ref="appbar"
      app
      dense
      fixed
      clipped-right
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-app-bar-title>{{ currentRouteName }}</v-app-bar-title>
      <v-spacer></v-spacer>
      <v-btn icon @click="$electron.window.handle('minimize')">
        <v-icon>mdi-window-minimize</v-icon>
      </v-btn>
      <v-btn icon @click="$electron.window.handle('maximize')">
        <v-icon>mdi-window-maximize</v-icon>
      </v-btn>
      <v-btn icon @click="$electron.window.handle('close')">
        <v-icon>mdi-window-close</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main :style="`height: calc(100vh - ${appbarHeight}px);`" class="">
      <keep-alive include="Home">
        <router-view :key="$route.fullPath" />
      </keep-alive>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',

  data: () => ({
    appbarHeight: 48,
    drawer: false,
    len: 0,
    perc: 0,
    items: [
      {icon: 'mdi-home', title:'Home', route:'/'},
      {icon: 'mdi-tools', title:'Library', route:'/library'},
      {icon: 'mdi-cog', title:'Settings', route:'/settings'}
    ],
  }),
  computed: {
    currentRouteName() {
      return this.$route.name;
    }
  }
});
</script>
