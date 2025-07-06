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
  getters: {
    isAuthenticated: (state) => state.isLoggedIn,
    currentUser: (state) => state.user,
    isAdmin: (state) => state.user?.role === 'admin',
    isUser: (state) => state.user?.role === 'user'
  },
  actions: {
    async register(username, password) {
      this.authLoading = true;
      this.authError = null;
      try {
        const res = await axios.get(`http://localhost:3000/users?username=${username}`);
        if (res.data.length > 0) {
          this.authError = 'Username sudah terdaftar.';
          alert(this.authError);
          return false;
        }

        await axios.post('http://localhost:3000/users', {
          username,
          password,
          role: 'user'
        });
        alert('Registrasi berhasil! Silakan login.');
        return true;
      } catch (err) {
        this.authError = 'Registrasi gagal: ' + err.message;
        console.error(err);
        alert(this.authError);
        return false;
      } finally {
        this.authLoading = false;
      }
    },

    async login(username, password) {
      this.authLoading = true;
      this.authError = null;
      try {
        const res = await axios.get(`http://localhost:3000/users?username=${username}&password=${password}`);
        if (res.data.length > 0) {
          this.user = res.data[0];
          this.isLoggedIn = true;
          localStorage.setItem('loggedInUser', JSON.stringify(this.user));
          alert('Login berhasil!');
          return true;
        } else {
          this.authError = 'Username atau password salah.';
          alert(this.authError);
          return false;
        }
      } catch (err) {
        this.authError = 'Login gagal: ' + err.message;
        console.error(err);
        alert(this.authError);
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
  }
});
