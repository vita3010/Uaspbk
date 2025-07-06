// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import ItemListView from '../views/ItemListView.vue';
import ItemDetailView from '../views/ItemDetailView.vue';
import AddItemView from '../views/AddItemView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import CartView from '../views/CartView.vue'; // New: Import CartView
import FavoritesView from '../views/FavoritesView.vue'; // New: Import FavoritesView

import { useAuthStore } from '../stores/authStore';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/items',
      name: 'items',
      component: ItemListView
    },
    {
      path: '/items/:id',
      name: 'item-detail',
      component: ItemDetailView,
      props: true
    },
    { // Rute yang dilindungi (hanya bisa diakses jika sudah login dan admin)
      path: '/items/add',
      name: 'add-item',
      component: AddItemView,
      meta: { requiresAuth: true, requiredRoles: ['admin'] }
    },
    { // Rute Login
      path: '/login',
      name: 'login',
      component: LoginView
    },
    { // Rute Register
      path: '/register',
      name: 'register',
      component: RegisterView
    },
    { // New: Rute Keranjang
      path: '/cart',
      name: 'cart',
      component: CartView
    },
    { // New: Rute Favorit
      path: '/favorites',
      name: 'favorites',
      component: FavoritesView
    }
  ]
});

// Navigation Guard - Pastikan ini ada dan benar
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiredRoles = to.meta.requiredRoles;

  if (requiresAuth && !authStore.isAuthenticated) {
    // Jika rute membutuhkan autentikasi dan pengguna belum login
    next('/login');
  } else if (requiresAuth && authStore.isAuthenticated && requiredRoles) {
    // Jika rute membutuhkan autentikasi dan peran tertentu
    if (!requiredRoles.includes(authStore.currentUser.role)) {
      alert('Anda tidak memiliki akses ke halaman ini.');
      next('/items');
    } else {
      next();
    }
  } else if ((to.name === 'login' || to.name === 'register') && authStore.isAuthenticated) {
    // Jika pengguna sudah login dan mencoba mengakses halaman login/register
    next('/items');
  } else {
    // Lanjutkan navigasi
    next();
  }
});

export default router;
