<template>
  <div class="container home-view">
    <h1>Selamat Datang di Toko Barang Bekas Online!</h1>
    <p>Temukan barang bekas berkualitas dengan harga terjangkau dan berikan kesempatan kedua untuk barang yang masih layak pakai.</p>
    <router-link to="/items" class="button primary-button">Lihat Semua Barang</router-link>
  </div>
</template>

<script setup>
</script>

<style scoped>
.home-view {
  text-align: center;
  padding: 50px 20px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-top: 40px;
}
.home-view h1 {
  color: #343a40;
  margin-bottom: 20px;
}
.home-view p {
  color: #6c757d;
  font-size: 1.1em;
  margin-bottom: 30px;
}
.primary-button {
  display: inline-block;
  padding: 12px 25px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}
.primary-button:hover {
  background-color: #0056b3;
}
</style>