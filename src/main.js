import { createApp } from 'vue'
import { createRouter, createWebHashHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from './App.vue'
import Home from './views/Home.vue'
import Divination from './views/Divination.vue'
import Result from './views/Result.vue'
import Settings from './views/Settings.vue'
import './style.css'

const routes = [
  { path: '/', component: Home },
  { path: '/divination', component: Divination },
  { path: '/result', component: Result },
  { path: '/settings', component: Settings }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

const pinia = createPinia()

createApp(App)
  .use(router)
  .use(pinia)
  .mount('#app')