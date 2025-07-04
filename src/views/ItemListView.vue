<template>
  <div class="container item-list-view">
    <h2>Daftar Barang Bekas</h2>

    <div class="filter-controls">
      <input
        type="text"
        v-model="itemStore.searchTerm"
        @input="itemStore.setSearchTerm($event.target.value)"
        placeholder="Cari nama, deskripsi, atau kategori..."
        class="search-input"
      />

      <select
        v-model="itemStore.selectedCategory"
        @change="itemStore.setSelectedCategory($event.target.value)"
        class="category-select"
      >
        <option v-for="category in itemStore.uniqueCategories" :key="category" :value="category">
          {{ category }}
        </option>
      </select>
    </div>

    <div v-if="itemStore.loading" class="loading-message">
      Memuat daftar barang...
    </div>
    <div v-else-if="itemStore.error" class="error-message">
      Terjadi kesalahan: {{ itemStore.error }}
    </div>
    <div v-else>
      <div v-if="itemStore.filteredItems.length === 0" class="no-items-message">
        Tidak ada barang yang cocok dengan kriteria pencarian/filter Anda.
      </div>
      <ul v-else class="item-grid">
        <li v-for="item in itemStore.filteredItems" :key="item.id" class="item-card">
          <img :src="item.imageUrl || 'https://via.placeholder.com/200x150/CCCCCC/FFFFFF?text=No+Image'" :alt="item.name" class="item-image" />
          <h3>{{ item.name }}</h3>
          <p class="description">{{ item.description }}</p>
          <p class="price">Harga: **Rp {{ item.price.toLocaleString('id-ID') }}**</p>
          <p class="category">Kategori: <em>{{ item.category }}</em></p>
          <router-link :to="{ name: 'item-detail', params: { id: item.id } }" class="button detail-button">Lihat Detail</router-link>
        </li>
      </ul>
    </div>

    <p class="total-items">Total Barang Terdaftar: **{{ itemStore.totalItems }}** (Menampilkan: {{ itemStore.filteredItems.length }})</p>

    <hr class="divider">

    <router-link to="/items/add" class="button add-new-item-button">Tambah Barang Baru</router-link>

    <router-link to="/" class="button back-button">Kembali ke Home</router-link>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useItemStore } from '../stores/itemStore';

const itemStore = useItemStore();

onMounted(() => {
  itemStore.fetchItems();
  if (!itemStore.selectedCategory) {
    itemStore.setSelectedCategory('Semua Kategori');
  }
});
</script>

<style scoped>
/* Tambahkan gaya untuk kontrol filter */
.filter-controls {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  justify-content: center;
  flex-wrap: wrap;
}

.search-input, .category-select {
  padding: 10px 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1em;
  min-width: 200px;
}
.search-input {
  flex-grow: 1;
  max-width: 400px;
}

.loading-message, .error-message, .no-items-message {
  text-align: center;
  padding: 20px;
  font-size: 1.1em;
  color: #6c757d;
}
.error-message {
  color: #dc3545;
  font-weight: bold;
}

.item-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 25px;
  list-style: none;
  padding: 0;
  margin-top: 30px;
}

.item-card {
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  background-color: white;
  /* Pastikan flex-direction column untuk menata elemen termasuk gambar */
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Menjaga tombol di bawah */
}
.item-card h3 {
  margin-top: 0;
  color: #343a40;
  font-size: 1.4em;
  margin-bottom: 10px;
}
.item-card .description {
  font-size: 0.95em;
  color: #495057;
  line-height: 1.5;
  flex-grow: 1; /* Memastikan deskripsi mengambil ruang yang tersedia */
}
.item-card .price {
  font-size: 1.2em;
  color: #28a745;
  font-weight: bold;
  margin-top: 15px;
  margin-bottom: 5px;
}
.item-card .category {
  font-size: 0.85em;
  color: #888;
  font-style: italic;
}

/* GAYA UNTUK GAMBAR (PASTIKAN INI ADA) */
.item-image {
  max-width: 100%;
  height: 150px; /* Tinggi yang konsisten untuk semua gambar */
  object-fit: cover; /* Penting agar gambar tidak terdistorsi dan mengisi kotak */
  border-radius: 8px;
  margin-bottom: 15px;
  display: block; /* Menghilangkan ruang kosong di bawah gambar */
}

.total-items {
  text-align: right;
  margin-top: 20px;
  font-size: 1.1em;
  color: #343a40;
}

.divider {
  border: 0;
  height: 1px;
  background: #eee;
  margin: 40px 0;
}

.button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s ease;
}
.detail-button {
  display: block;
  margin-top: 15px;
  background-color: #007bff;
  color: white;
  text-decoration: none;
  padding: 8px 15px;
  border-radius: 5px;
  text-align: center;
}
.detail-button:hover {
  background-color: #0056b3;
}
.add-new-item-button {
  display: inline-block;
  background-color: #20c997;
  color: white;
  text-decoration: none;
  padding: 12px 25px;
  border-radius: 5px;
  margin: 20px auto;
  display: block;
  width: fit-content;
  transition: background-color 0.3s ease;
}
.add-new-item-button:hover {
  background-color: #17a2b8;
}
.back-button {
  background-color: #6c757d;
  color: white;
  margin-top: 20px;
  display: inline-block;
  width: fit-content;
}
.back-button:hover {
  background-color: #5a6268;
}
</style>