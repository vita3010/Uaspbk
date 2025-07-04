<template>
  <div class="container auth-view">
    <h2>Daftar Akun Baru</h2>
    <form @submit.prevent="handleRegister" class="auth-form">
      <div class="form-group">
        <label for="regUsername">Username:</label>
        <input type="text" id="regUsername" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="regPassword">Password:</label>
        <input type="password" id="regPassword" v-model="password" required />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Konfirmasi Password:</label>
        <input type="password" id="confirmPassword" v-model="confirmPassword" required />
      </div>
      <button type="submit" class="button success-button" :disabled="authStore.authLoading">
        <span v-if="authStore.authLoading">Memuat...</span>
        <span v-else>Daftar</span>
      </button>
      <p v-if="authStore.authError" class="error-message">{{ authStore.authError }}</p>
    </form>
    <p>Sudah punya akun? <router-link to="/login">Login di sini</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const authStore = useAuthStore();
const router = useRouter();

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    authStore.authError = 'Password dan konfirmasi password tidak cocok.';
    alert('Password dan konfirmasi password tidak cocok.');
    return;
  }
  authStore.authError = null; // Clear any previous error before trying to register

  const success = await authStore.register(username.value, password.value);
  if (success) {
    router.push('/login'); // Navigasi ke halaman login setelah registrasi berhasil
  }
};
</script>

<style scoped>
/* Gaya yang sama dengan LoginView untuk form autentikasi */
.auth-view {
  max-width: 400px;
  margin: 50px auto;
  padding: 30px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  text-align: center;
}
.auth-view h2 {
  color: #343a40;
  margin-bottom: 25px;
}
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}
.form-group label {
  text-align: left;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
  display: block;
}
.form-group input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
  box-sizing: border-box;
}
.success-button {
  background-color: #28a745;
  color: white;
  padding: 12px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.success-button:hover:not(:disabled) {
  background-color: #218838;
}
.success-button:disabled {
  background-color: #98d1a8;
  cursor: not-allowed;
}
.error-message {
  color: #dc3545;
  font-size: 0.9em;
  margin-top: -10px;
}
.auth-view p {
  margin-top: 15px;
  color: #666;
}
.auth-view a {
  color: #007bff;
  text-decoration: none;
}
.auth-view a:hover {
  text-decoration: underline;
}
</style>