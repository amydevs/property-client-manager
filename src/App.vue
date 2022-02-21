<template>
  <v-app>

    <!-- navigation bar / draggable area -->
    <v-app-bar
      ref="appbar"
      app
      dense
      fixed
      clipped-right
    >
      <!-- button for opening navigation drawer and title of current page -->
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>{{ currentRouteName }}</v-app-bar-title>
      <!-- window draggable area -->
      <v-spacer></v-spacer>
       <!-- buttons for window controls -->
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

    <!-- navigation drawer -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      app
    >
      <v-list
        dense nav
      >
        <!-- for each item in the menuItems variable, create a new button for navigating to the page associated with the button -->
        <v-list-item-group color='primary' mandatory>
            <v-list-item
                v-for="item in menuItems"
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

    <v-main :style="`height: calc(100vh - ${appbarHeight}px);`" class="">
      <keep-alive include="Home">
        <router-view :key="$route.fullPath" />
      </keep-alive>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import ResizeObserver from 'resize-observer-polyfill';
import Vue from 'vue';
import { RawLocation } from 'vue-router';

export default Vue.extend({
  name: 'App',
  mounted() {
    // appbar observer
    const appbaro = new ResizeObserver((e) => {
      this.appbarHeight = e[0].contentRect.width;
    });
    if (this.$refs.appbar) {
      appbaro.observe((this.$refs.appbar as any).$el);
    }
    window.electron.ipc.receive("router-push", (event:RawLocation | string) => {
      this.$router.push(event);
    });
  },
  data: () => ({
    appbarHeight: 48,
    drawer: false,
    len: 0,
    perc: 0,
    menuItems: [
      {icon: 'mdi-home', title:'Home', route:'/'},
      {icon: 'mdi-cog', title:'Settings', route:'/settings'}
    ],
  }),
  computed: {
    // reactive getter for name of current route.
    currentRouteName(): string | null | undefined {
      return this.$route.name;
    }
  }
});
</script>

<style lang="scss">
nav * {
  -webkit-app-region: no-drag;
}
.v-toolbar__content {
  * {
    -webkit-app-region: no-drag;
  }
  -webkit-app-region: drag;
}
html{
  overflow-y: hidden !important;
  .v-main__wrap {
    overflow-y: auto !important;
  }
}
:root {
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  ::-webkit-scrollbar-corner {
      background: rgba(0,0,0,0);
  }
  ::-webkit-scrollbar-thumb {
      background-color: white;
      min-width: 32px;
      min-height: 32px;
  }
  ::-webkit-scrollbar-track {
      background-color: #272727;
  }
}
</style>
