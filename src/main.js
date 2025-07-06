// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);      // Aktifkan Pinia (state management)
app.use(router);     // Aktifkan router (navigasi halaman)
app.mount('#app');   // Render aplikasi ke elemen HTML dengan id="app"
