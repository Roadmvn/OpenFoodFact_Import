import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import VueApexCharts from 'vue3-apexcharts'
import './index.css'

// Font Awesome
import '@fortawesome/fontawesome-free/css/all.css'

// Nettoyer le localStorage au démarrage
localStorage.clear()

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(VueApexCharts)

app.mount('#app')
