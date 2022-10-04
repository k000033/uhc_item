import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'element-plus/dist/index.css'
import * as Icons from '@element-plus/icons'
import ElementPlus from "element-plus";
const app = createApp(App)
Object.keys(Icons).forEach(key => {
    app.component(key, Icons[key])
  })
app.use(ElementPlus).use(store).use(router).mount('#app')
