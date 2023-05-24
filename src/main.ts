import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { VueQueryPlugin } from "vue-query";
import { fa } from 'vuetify/iconsets/fa'
import { mdi, aliases } from 'vuetify/iconsets/mdi'
import { setupCalendar, Calendar, DatePicker } from 'v-calendar'

import App from './App.vue'
import router from './router'

//import './assets/main.css'
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';
import "@fortawesome/fontawesome-free/css/all.css"; 

import 'v-calendar/style.css';


const app = createApp(App)

const vuetify = createVuetify({
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
        fa
      }
    }
  });

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(VueQueryPlugin)
// Use plugin defaults (optional)
app.use(setupCalendar, {})

// Use the components
app.component('VCalendar', Calendar)
app.component('VDatePicker', DatePicker)
app.mount('#app')
