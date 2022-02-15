import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/client-detail/:id?',
    name: 'Client Details',
    component: () => import(/* webpackChunkName: "about" */ '../views/Client/ClientDetailPage.vue')
  },
  {
    path: '/client-create/:id?',
    name: 'Client Create/Edit',
    component: () => import(/* webpackChunkName: "about" */ '../views/Client/ClientCreate.vue')
  },
  {
    path: '/settings',
    name: 'Settings',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Settings.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
