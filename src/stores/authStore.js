// src/stores/authStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('loggedInUser')) || null,
    isLoggedIn: !!localStorage.getItem('loggedInUser'),
    authError: null,
    authLoading: false,
  }),
  actions: {
    async register(username, password) {
      this.authLoading = true;
      this.authError = null;
      try {
        const existingUsers = await axios.get(`http://localhost:3000/users?username=${username}`);
        if (existingUsers.data.length > 0) {
          this.authError = 'Username sudah terdaftar.';
          alert('Username sudah terdaftar. Silakan gunakan username lain.');
          return false;
        }

        const response = await axios.post('http://localhost:3000/users', {
          username,
          password,
          role: 'user'
        });
        alert('Registrasi berhasil! Silakan login.');
        return true;
      } catch (error) {
        this.authError = 'Registrasi gagal: ' + error.message;
        console.error('Registration failed:', error);
        alert('Registrasi gagal. Silakan coba lagi.');
        return false;
      } finally {
        this.authLoading = false;
      }
    },

    async login(username, password) {
      this.authLoading = true;
      this.authError = null;
      try {
        const response = await axios.get(`http://localhost:3000/users?username=${username}&password=${password}`);
        if (response.data.length > 0) {
          const userData = response.data[0];
          this.user = { id: userData.id, username: userData.username, role: userData.role };
          this.isLoggedIn = true;
          localStorage.setItem('loggedInUser', JSON.stringify(this.user));
          alert('Login berhasil!');
          return true;
        } else {
          this.authError = 'Username atau password salah.';
          alert('Username atau password salah.');
          return false;
        }
      } catch (error) {
        this.authError = 'Login gagal: ' + error.message;
        console.error('Login failed:', error);
        alert('Login gagal. Silakan coba lagi.');
        return false;
      } finally {
        this.authLoading = false;
      }
    },

    logout() {
      this.user = null;
      this.isLoggedIn = false;
      this.authError = null;
      localStorage.removeItem('loggedInUser');
      alert('Anda telah logout.');
    }
  },
  getters: {
    isAuthenticated: (state) => state.isLoggedIn,
    currentUser: (state) => state.user,
    isAdmin: (state) => state.user && state.user.role === 'admin',
    isUser: (state) => state.user && state.user.role === 'user'
  },
});