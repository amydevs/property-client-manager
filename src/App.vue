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
import ResizeObserver from 'resize-observer-polyfill';
import Vue from 'vue';

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
  },
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

<style lang="scss">
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
