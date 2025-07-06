<template>
  <div class="favorites-container container">
    <h2>Daftar Favorit Anda</h2>
    <div v-if="favoriteItems.length === 0" class="empty-favorites">
      <p>Anda belum memiliki item favorit.</p>
      <router-link to="/items" class="button btn-shop-now">Jelajahi Barang</router-link>
    </div>
    <div v-else>
      <div v-for="favoriteItem in favoriteItems" :key="favoriteItem.id" class="favorite-item-card">
        <img :src="getProductDetails(favoriteItem.itemId)?.imageUrl || 'https://via.placeholder.com/100x100?text=No+Image'" :alt="getProductDetails(favoriteItem.itemId)?.name" class="favorite-item-image" />
        <div class="favorite-item-info">
          <h3>{{ getProductDetails(favoriteItem.itemId)?.name || 'Memuat...' }}</h3>
          <p>Harga: Rp {{ getProductDetails(favoriteItem.itemId)?.price.toLocaleString('id-ID') }}</p>
        </div>
        <div class="item-actions">
          <router-link :to="`/items/${favoriteItem.itemId}`" class="button btn-view-detail">Lihat Detail</router-link>
          <button @click="removeFavorite(favoriteItem.id)" class="button btn-remove">Hapus dari Favorit</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import axios from 'axios';
import { useFavoriteStore } from '../stores/favoriteStore'; // Gantilah path jika berbeda

const favoriteStore = useFavoriteStore();
const allItems = ref([]);

const favoriteItems = computed(() => favoriteStore.favorites);

const fetchAllItems = async () => {
  try {
    const response = await axios.get('http://localhost:3000/items');
    allItems.value = response.data;
  } catch (error) {
    console.error('Gagal mengambil data items:', error);
  }
};

const getProductDetails = (itemId) => {
  return allItems.value.find(item => item.id === itemId);
};

const removeFavorite = (favoriteId) => {
  favoriteStore.removeFavorite(favoriteId);
};

onMounted(() => {
  favoriteStore.fetchFavoriteItems();
  fetchAllItems();
});
</script>



<style scoped>
.favorites-container {
  padding: 20px;
  max-width: 900px;
  margin-top: 20px;
  background-color: #f8f9fa;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

h2 {
  text-align: center;
  color: #343a40;
  margin-bottom: 30px;
  font-size: 2.2em;
}

.empty-favorites {
  text-align: center;
  margin-top: 50px;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.empty-favorites p {
  font-size: 1.1em;
  color: #6c757d;
  margin-bottom: 20px;
}

.button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s ease, transform 0.2s ease;
}
.button:hover {
  transform: translateY(-2px);
}

.btn-shop-now {
  background-color: #28a745;
  color: white;
  display: inline-block;
}
.btn-shop-now:hover {
  background-color: #218838;
}

.favorite-item-card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
  padding: 15px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  gap: 20px;
}

.favorite-item-image {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 5px;
}

.favorite-item-info {
  flex-grow: 1;
}

.favorite-item-info h3 {
  margin: 0 0 5px 0;
  color: #343a40;
  font-size: 1.3em;
}

.favorite-item-info p {
  margin: 0;
  color: #6c757d;
}

.item-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap; /* Allow buttons to wrap */
}

.btn-view-detail {
  background-color: #007bff;
  color: white;
}
.btn-view-detail:hover {
  background-color: #0056b3;
}

.btn-remove {
  background-color: #dc3545;
  color: white;
}
.btn-remove:hover {
  background-color: #c82333;
}

/* Responsive adjustments */
@media (max-width: 600px) {
  .favorite-item-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  .favorite-item-info {
    width: 100%;
  }
  .item-actions {
    width: 100%;
    justify-content: center; /* Center buttons when stacked */
  }
  .item-actions .button {
    flex-grow: 1; /* Make buttons take equal width */
  }
}
</style>
