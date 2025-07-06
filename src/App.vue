<template>
  <div id="app-wrapper">
    <header class="app-header">
      <nav class="main-nav container">
        <router-link to="/" class="nav-brand">BarangBekas.com</router-link>
        <div class="nav-links">
          <router-link to="/" class="nav-item">Home</router-link>
          <router-link to="/items" class="nav-item">Barang Bekas</router-link>

          <!-- New: Keranjang (Cart) Link -->
          <router-link to="/cart" class="nav-item nav-icon-link">
            🛒 Keranjang ({{ cartItemCount }})
          </router-link>
          <!-- New: Favorit (Favorites) Link -->
          <router-link to="/favorites" class="nav-item nav-icon-link">
            ❤️ Favorit ({{ favoriteItemCount }})
          </router-link>

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
import { computed, onMounted } from 'vue';
import { useAuthStore } from './stores/authStore';
import { useCartStore } from './stores/cartStore';
import { useFavoriteStore } from './stores/favoriteStore'; // ✅ Tambahkan ini

const authStore = useAuthStore();
const cartStore = useCartStore();
const favoriteStore = useFavoriteStore(); // ✅ Tambahkan ini

const cartItemCount = computed(() => cartStore.cartItemCount);
const favoriteItemCount = computed(() => favoriteStore.favoriteItemCount); // ✅ Ganti ini

onMounted(() => {
  cartStore.fetchCartItems();
  favoriteStore.fetchFavoriteItems(); // ✅ Ganti ini
});
</script>

<style scoped>
/* Pastikan Anda memindahkan gaya global dari sini ke style.css jika belum */
/* Gaya untuk App.vue dan navigasi */
#app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh; /* Memastikan footer tetap di bawah */
}

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
  max-width: 1200px; /* Batasi lebar container */
  margin: 0 auto; /* Pusatkan container */
  padding: 0 20px; /* Padding samping */
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
  white-space: nowrap; /* Mencegah teks melipat */
}

.nav-links .nav-item:hover,
.nav-links .nav-item.router-link-active {
  color: #007bff;
}

/* Gaya khusus untuk link ikon (Keranjang, Favorit) */
.nav-links .nav-icon-link {
  display: flex;
  align-items: center;
  gap: 5px; /* Spasi antara ikon dan teks */
  font-weight: bold;
}

.nav-links .nav-user {
  color: #a2e0ff; /* Warna berbeda untuk username */
  font-weight: bold;
  white-space: nowrap;
}

.nav-links .admin-link { /* Gaya khusus untuk link admin */
  background-color: #0d6efd;
  color: white;
  padding: 8px 15px;
  border-radius: 5px;
  text-decoration: none;
  font-size: 0.95em;
  transition: background-color 0.3s ease;
  white-space: nowrap;
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
  white-space: nowrap;
}
.nav-button:hover {
  background-color: #c82333;
}

.app-main {
  flex-grow: 1; /* Memastikan main content mengambil sisa ruang */
  padding: 20px 0;
}

.app-footer {
  background-color: #343a40;
  color: white;
  padding: 20px 0;
  text-align: center;
  font-size: 0.9em;
  /* margin-top: auto; Ini sudah di handle oleh flex-direction column dan flex-grow pada app-main */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .main-nav {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .nav-links {
    flex-wrap: wrap; /* Izinkan item melipat ke baris berikutnya */
    justify-content: center; /* Pusatkan item saat melipat */
    width: 100%;
    gap: 10px;
    margin-top: 10px;
  }
  .nav-links .nav-item,
  .nav-links .nav-icon-link,
  .nav-links .nav-user,
  .nav-links .admin-link,
  .nav-links .nav-button {
    font-size: 0.9em;
    padding: 6px 10px;
  }
}
</style>
