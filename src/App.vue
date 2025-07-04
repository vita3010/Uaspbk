<template>
  <div id="app-wrapper">
    <header class="app-header">
      <nav class="main-nav container">
        <router-link to="/" class="nav-brand">BarangBekas.com</router-link>
        <div class="nav-links">
          <router-link to="/" class="nav-item">Home</router-link>
          <router-link to="/items" class="nav-item">Barang Bekas</router-link>

          <template v-if="authStore.isAuthenticated">
            <span class="nav-item nav-user">Halo, {{ authStore.currentUser.username }} ({{ authStore.currentUser.role }})</span>
            <router-link v-if="authStore.isAdmin" to="/items/add" class="nav-item admin-link">Tambah Barang</router-link>
            <button @click="authStore.logout()" class="button nav-button">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="nav-item">Login</router-link>
            <router-link to="/register" class="nav-item">Daftar</router-link>
          </template>
          </div>
      </nav>
    </header>

    <main class="app-main">
      <router-view />
    </main>

    <footer class="app-footer">
      <div class="container">
        &copy; {{ new Date().getFullYear() }} BarangBekas.com. Semua Hak Dilindungi.
      </div>
    </footer>
  </div>
</template>

<script setup>
// BAGIAN YANG PERLU DIPASTIKAN ADA DAN BENAR
import { useAuthStore } from './stores/authStore';

const authStore = useAuthStore();
//------------------------------------------
</script>

<style scoped>
/* Pastikan Anda memindahkan gaya global dari sini ke style.css jika belum */
/* Gaya untuk App.vue dan navigasi */
.app-header {
  background-color: #343a40;
  color: white;
  padding: 15px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.main-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  font-size: 1.8em;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 20px; /* Spasi antar item navigasi */
}

.nav-links .nav-item {
  color: white;
  text-decoration: none;
  font-size: 1.1em;
  transition: color 0.3s ease;
}

.nav-links .nav-item:hover,
.nav-links .nav-item.router-link-active {
  color: #007bff;
}

.nav-links .nav-user {
  color: #a2e0ff; /* Warna berbeda untuk username */
  font-weight: bold;
}

.nav-links .admin-link { /* Gaya khusus untuk link admin */
  background-color: #0d6efd;
  color: white;
  padding: 8px 15px;
  border-radius: 5px;
  text-decoration: none;
  font-size: 0.95em;
  transition: background-color 0.3s ease;
}
.nav-links .admin-link:hover {
  background-color: #0a58ca;
}

.nav-button { /* Gaya untuk tombol Logout */
  background-color: #dc3545;
  color: white;
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  border: none;
  font-size: 1em;
  transition: background-color 0.3s ease;
}
.nav-button:hover {
  background-color: #c82333;
}

.app-main {
  flex-grow: 1;
  padding: 20px 0;
}

.app-footer {
  background-color: #343a40;
  color: white;
  padding: 20px 0;
  text-align: center;
  font-size: 0.9em;
  margin-top: auto;
}
</style>