<template>
  <div class="container auth-view">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin" class="auth-form">
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" id="username" v-model="username" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button type="submit" class="button primary-button" :disabled="authStore.authLoading">
        <span v-if="authStore.authLoading">Memuat...</span>
        <span v-else>Login</span>
      </button>
      <p v-if="authStore.authError" class="error-message">{{ authStore.authError }}</p>
    </form>
    <p>Belum punya akun? <router-link to="/register">Daftar di sini</router-link></p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/authStore';

const username = ref('');
const password = ref('');
const authStore = useAuthStore();
const router = useRouter();

const handleLogin = async () => {
  const success = await authStore.login(username.value, password.value);
  if (success) {
    router.push('/items');
  }
};
</script>

<style scoped>
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
.primary-button {
  background-color: #007bff;
  color: white;
  padding: 12px 20px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.primary-button:hover:not(:disabled) {
  background-color: #0056b3;
}
.primary-button:disabled {
  background-color: #a0cbed;
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