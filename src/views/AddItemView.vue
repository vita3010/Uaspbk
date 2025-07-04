<template>
  <div class="container add-item-view">
    <h2>Tambahkan Barang Baru</h2>

    <form @submit.prevent="submitNewItem" class="add-item-form">
      <div class="form-group">
        <label for="itemName">Nama Barang:</label>
        <input id="itemName" v-model="newItem.name" placeholder="Contoh: Sepeda Lipat" required />
      </div>
      <div class="form-group">
        <label for="itemDesc">Deskripsi:</label>
        <textarea id="itemDesc" v-model="newItem.description" placeholder="Jelaskan kondisi barang" required></textarea>
      </div>
      <div class="form-group">
        <label for="itemPrice">Harga (Rp):</label>
        <input id="itemPrice" v-model.number="newItem.price" type="number" placeholder="Contoh: 500000" min="0" required />
      </div>
      <div class="form-group">
        <label for="itemCategory">Kategori:</label>
        <input id="itemCategory" v-model="newItem.category" placeholder="Contoh: Elektronik, Furniture" required />
      </div>
      <div class="form-group">
        <label for="itemImageUrl">URL Gambar:</label>
        <input id="itemImageUrl" v-model="newItem.imageUrl" placeholder="URL gambar barang (misal: dari Imgur)" type="url" />
      </div>
      <button type="submit" class="button success-button">Tambah Barang</button>
    </form>

    <router-link to="/items" class="button back-button">Kembali ke Daftar Barang</router-link>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useItemStore } from '../stores/itemStore';

const itemStore = useItemStore();
const router = useRouter();

const newItem = ref({
  name: '',
  description: '',
  price: 0,
  category: '',
  imageUrl: ''
});

const submitNewItem = async () => {
  if (newItem.value.name && newItem.value.description && newItem.value.price > 0 && newItem.value.category) {
    const itemToSubmit = { ...newItem.value };
    if (!itemToSubmit.imageUrl) {
        itemToSubmit.imageUrl = 'https://via.placeholder.com/200x150/CCCCCC/FFFFFF?text=No+Image';
    }

    await itemStore.addItem(itemToSubmit);
    newItem.value = { name: '', description: '', price: 0, category: '', imageUrl: '' };
    router.push('/items');
  } else {
    alert('Harap lengkapi field Nama, Deskripsi, Harga, dan Kategori dengan benar!');
  }
};
</script>

<style scoped>
.add-item-view {
  padding: 20px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  margin-top: 20px;
}

.add-item-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 25px;
  border: 1px dashed #007bff;
  border-radius: 10px;
  background-color: #e9f5ff;
  margin-bottom: 30px;
}
.add-item-form .form-group {
  display: flex;
  flex-direction: column;
}
.add-item-form label {
  font-weight: bold;
  margin-bottom: 5px;
  color: #343a40;
}
.add-item-form input[type="text"],
.add-item-form input[type="number"],
.add-item-form textarea {
  padding: 10px;
  border: 1px solid #b0d8f9;
  border-radius: 5px;
  font-size: 1em;
  width: 100%;
  box-sizing: border-box;
}
.add-item-form textarea {
  resize: vertical;
  min-height: 80px;
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
.success-button {
  background-color: #28a745;
  color: white;
  margin-top: 10px;
}
.success-button:hover {
  background-color: #218838;
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