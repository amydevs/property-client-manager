import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      show: true,
      icon: 'mdi-home'
    }
  },
  {
    path: '/client-detail/:id?',
    name: 'Client Details',
    component: () => import(/* webpackChunkName: "about" */ '../views/Client/ClientDetailPage.vue'),
  },
  {
    path: '/client-create/:id?',
    name: 'Client Create/Edit',
    component: () => import(/* webpackChunkName: "about" */ '../views/Client/ClientCreate.vue'),
  },
  {
    path: '/calendar/',
    name: 'Calendar Overview',
    component: () => import(/* webpackChunkName: "about" */ '../views/Calendar.vue'),
    meta: {
      show: true,
      icon: 'mdi-calendar-account'
    }
  },
  {
    path: '/settings',
    name: 'Settings',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Settings.vue'),
    meta: {
      show: true,
      icon: 'mdi-cog'
    }
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
