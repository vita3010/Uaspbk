<template>
  <div class="container item-detail-view">
    <div v-if="itemStore.loading" class="loading-message">Memuat detail barang...</div>
    <div v-else-if="itemStore.error" class="error-message">{{ itemStore.error }}</div>
    <div v-else-if="!itemStore.currentItem" class="not-found-message">Barang tidak ditemukan.</div>

    <div v-else class="detail-card">
      <template v-if="!isEditing">
        <img :src="itemStore.currentItem.imageUrl || 'https://via.placeholder.com/400x300/CCCCCC/FFFFFF?text=No+Image'" :alt="itemStore.currentItem.name" class="detail-image" />
        <h2>{{ itemStore.currentItem.name }}</h2>
        <p class="detail-description">{{ itemStore.currentItem.description }}</p>
        <p class="detail-price">Harga: **Rp {{ itemStore.currentItem.price.toLocaleString('id-ID') }}**</p>
        <p class="detail-category">Kategori: {{ itemStore.currentItem.category }}</p>

        <div class="actions">
          <!-- New: Tombol Tambah ke Keranjang -->
          <button @click="addToCart(itemStore.currentItem)" class="button add-to-cart-button">
            🛒 Tambah ke Keranjang
          </button>
          <!-- New: Tombol Tambah ke Favorit -->
          <button @click="addFavorite(itemStore.currentItem)" class="button add-to-favorite-button">
            ❤️ Tambah ke Favorit
          </button>

          <template v-if="authStore.isAdmin">
            <button @click="isEditing = true" class="button edit-button">Edit Barang</button>
            <button @click="confirmDelete" class="button delete-button">Hapus Barang</button>
          </template>
          <p v-else-if="authStore.isAuthenticated" class="info-message">Login sebagai Admin untuk mengedit atau menghapus barang ini.</p>
          <p v-else class="info-message">Login untuk opsi edit/hapus.</p>
        </div>
      </template>

      <template v-else>
        <h2>Edit Barang</h2>
        <form @submit.prevent="saveChanges" class="edit-form">
          <div class="form-group">
            <label for="editName">Nama Barang:</label>
            <input id="editName" v-model="editedItem.name" required />
          </div>
          <div class="form-group">
            <label for="editDescription">Deskripsi:</label>
            <textarea id="editDescription" v-model="editedItem.description" required></textarea>
          </div>
          <div class="form-group">
            <label for="editPrice">Harga (Rp):</label>
            <input id="editPrice" v-model.number="editedItem.price" type="number" min="0" required />
          </div>
          <div class="form-group">
            <label for="editCategory">Kategori:</label>
            <input id="editCategory" v-model="editedItem.category" required />
          </div>
          <div class="form-group">
            <label for="editImageUrl">URL Gambar:</label>
            <input id="editImageUrl" v-model="editedItem.imageUrl" placeholder="URL Gambar" type="url" />
          </div>
          <div class="form-actions">
            <button type="submit" class="button success-button">Simpan Perubahan</button>
            <button type="button" @click="cancelEdit" class="button back-button">Batal</button>
          </div>
        </form>
      </template>
    </div>

    <router-link to="/items" class="button back-to-list-button">Kembali ke Daftar Barang</router-link>
  </div>
</template>
<script setup>
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useItemStore } from '../stores/itemStore';
import { useAuthStore } from '../stores/authStore';
import { useCartStore } from '../stores/cartStore';
import { useFavoriteStore } from '../stores/favoriteStore'; // ✅ Tambah ini

const route = useRoute();
const router = useRouter();
const itemStore = useItemStore();
const authStore = useAuthStore();
const cartStore = useCartStore(); // ✅ Pakai Pinia
const favoriteStore = useFavoriteStore(); // ✅ Pakai Pinia

const isEditing = ref(false);
const editedItem = ref({});

watch(() => itemStore.currentItem, (newItem) => {
  if (newItem) {
    editedItem.value = { ...newItem };
  }
}, { immediate: true });

onMounted(async () => {
  const itemId = route.params.id;
  if (itemId) {
    await itemStore.fetchItemById(itemId);
  }
});

const addToCart = (itemData) => {
  cartStore.addToCart(itemData); // ✅ Panggil dari Pinia
  alert(`${itemData.name} ditambahkan ke keranjang!`);
};

const addFavorite = (itemData) => {
  favoriteStore.addFavorite(itemData); // ✅ Panggil dari Pinia
  alert(`${itemData.name} ditambahkan ke favorit!`);
};

const saveChanges = async () => {
  if (!authStore.isAdmin) {
    alert('Anda tidak memiliki izin untuk menyimpan perubahan.');
    return;
  }
  if (editedItem.value.name && editedItem.value.description && editedItem.value.price > 0 && editedItem.value.category) {
    const success = await itemStore.updateItem(editedItem.value.id, editedItem.value);
    if (success) {
      isEditing.value = false;
    }
  } else {
    alert('Harap lengkapi semua field dengan benar!');
  }
};

const cancelEdit = () => {
  isEditing.value = false;
  if (itemStore.currentItem) {
    editedItem.value = { ...itemStore.currentItem };
  }
};

const confirmDelete = async () => {
  if (!authStore.isAdmin) {
    alert('Anda tidak memiliki izin untuk menghapus barang ini.');
    return;
  }
  if (confirm('Apakah Anda yakin ingin menghapus barang ini?')) {
    const success = await itemStore.deleteItem(itemStore.currentItem.id);
    if (success) {
      router.push('/items');
    }
  }
};
</script>

<style scoped>
.item-detail-view {
  padding: 20px;
}

.detail-card {
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  padding: 30px;
  margin-bottom: 30px;
}

/* GAYA UNTUK GAMBAR DETAIL (PASTIKAN INI ADA) */
.detail-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin-bottom: 25px;
  display: block;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}
.detail-card h2 {
  color: #343a40;
  font-size: 2em;
  margin-bottom: 15px;
}
.detail-description {
  font-size: 1.1em;
  color: #495057;
  line-height: 1.6;
  margin-bottom: 15px;
}
.detail-price {
  font-size: 1.5em;
  color: #28a745;
  font-weight: bold;
  margin-bottom: 10px;
}
.detail-category {
  font-size: 1em;
  color: #888;
  font-style: italic;
  margin-bottom: 25px;
}

.actions {
  display: flex;
  flex-wrap: wrap; /* Allow buttons to wrap on smaller screens */
  gap: 15px;
  margin-top: 20px;
}

.button {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1em;
  text-align: center;
  text-decoration: none;
  transition: background-color 0.3s ease, transform 0.2s ease; /* Added transform for hover effect */
}
.button:hover {
  transform: translateY(-2px); /* Slight lift on hover */
}

/* New: Gaya untuk tombol Tambah ke Keranjang */
.add-to-cart-button {
  background-color: #007bff; /* Biru */
  color: white;
}
.add-to-cart-button:hover {
  background-color: #0056b3;
}

/* New: Gaya untuk tombol Tambah ke Favorit */
.add-to-favorite-button {
  background-color: #ffc107; /* Kuning */
  color: #333;
}
.add-to-favorite-button:hover {
  background-color: #e0a800;
}

.edit-button {
  background-color: #ffc107;
  color: #333;
}
.edit-button:hover {
  background-color: #e0a800;
}
.delete-button {
  background-color: #dc3545;
  color: white;
}
.delete-button:hover {
  background-color: #c82333;
}

/* Gaya untuk form edit */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-top: 20px;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-group label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #343a40;
}
.edit-form input[type="text"],
.edit-form input[type="number"],
.edit-form input[type="url"], /* Added type="url" for image URL input */
.edit-form textarea {
  padding: 10px;
  border: 1px solid #b0d8f9;
  border-radius: 5px;
  font-size: 1em;
  width: 100%;
  box-sizing: border-box;
}
.edit-form textarea {
  resize: vertical;
  min-height: 80px;
}
.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}
.success-button {
  background-color: #28a745;
  color: white;
}
.success-button:hover {
  background-color: #218838;
}
.back-button {
  background-color: #6c757d;
  color: white;
}
.back-button:hover {
  background-color: #5a6268;
}

.back-to-list-button {
  display: inline-block;
  margin-top: 20px;
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  text-decoration: none;
}
.back-to-list-button:hover {
  background-color: #0056b3;
}

.loading-message, .error-message, .not-found-message {
  text-align: center;
  padding: 40px;
  font-size: 1.2em;
  color: #6c757d;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}
.error-message {
  color: #dc3545;
}
.not-found-message {
  color: #ffc107;
}
.info-message { /* Gaya baru untuk pesan info */
  text-align: center;
  color: #007bff;
  font-style: italic;
  margin-top: 15px;
}

/* Responsive adjustments for buttons */
@media (max-width: 600px) {
  .actions {
    flex-direction: column; /* Stack buttons vertically on small screens */
  }
  .button {
    width: 100%; /* Make buttons full width */
  }
}
</style>
