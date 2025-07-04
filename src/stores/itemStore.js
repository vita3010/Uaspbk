// src/stores/itemStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useItemStore = defineStore('item', {
  state: () => ({
    items: [],
    currentItem: null,
    loading: false,
    error: null,
    searchTerm: '', // <-- State baru untuk pencarian
    selectedCategory: null, // <-- State baru untuk filter kategori
  }),
  actions: {
    async fetchItems() {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.get('http://localhost:3000/items');
        this.items = response.data;
      } catch (error) {
        this.error = 'Gagal mengambil data barang: ' + error.message;
        console.error('Error fetching items:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchItemById(id) {
      this.loading = true;
      this.error = null;
      this.currentItem = null;
      try {
        const response = await axios.get(`http://localhost:3000/items/${id}`);
        this.currentItem = response.data;
      } catch (error) {
        this.error = `Gagal mengambil data barang dengan ID ${id}: ` + error.message;
        console.error(`Error fetching item with ID ${id}:`, error);
      } finally {
        this.loading = false;
      }
    },
    async addItem(newItem) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.post('http://localhost:3000/items', newItem);
        this.items.push(response.data);
        alert('Barang berhasil ditambahkan!');
      } catch (error) {
        this.error = 'Gagal menambahkan barang: ' + error.message;
        console.error('Error adding item:', error);
        alert('Gagal menambahkan barang. Silakan coba lagi.');
      } finally {
        this.loading = false;
      }
    },
    async updateItem(id, updatedItemData) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axios.put(`http://localhost:3000/items/${id}`, updatedItemData);
        const index = this.items.findIndex(item => item.id == id);
        if (index !== -1) {
          this.items[index] = response.data;
        }
        this.currentItem = response.data;
        alert('Barang berhasil diperbarui!');
        return true;
      } catch (error) {
        this.error = `Gagal memperbarui barang dengan ID ${id}: ` + error.message;
        console.error(`Error updating item with ID ${id}:`, error);
        alert('Gagal memperbarui barang. Silakan coba lagi.');
        return false;
      } finally {
        this.loading = false;
      }
    },
    async deleteItem(id) {
      this.loading = true;
      this.error = null;
      try {
        await axios.delete(`http://localhost:3000/items/${id}`);
        this.items = this.items.filter(item => item.id != id);
        this.currentItem = null;
        alert('Barang berhasil dihapus!');
        return true;
      } catch (error) {
        this.error = `Gagal menghapus barang dengan ID ${id}: ` + error.message;
        console.error(`Error deleting item with ID ${id}:`, error);
        alert('Gagal menghapus barang. Silakan coba lagi.');
        return false;
      } finally {
        this.loading = false;
      }
    },
    // Aksi baru untuk mengatur search term
    setSearchTerm(term) {
      this.searchTerm = term;
    },
    // Aksi baru untuk mengatur selected category
    setSelectedCategory(category) {
      this.selectedCategory = category;
    }
  },
  getters: {
    totalItems: (state) => state.items.length,
    // Getter baru yang menggabungkan filter dan pencarian
    filteredItems: (state) => {
      let filtered = state.items;

      // Filter berdasarkan kategori
      if (state.selectedCategory && state.selectedCategory !== 'Semua Kategori') {
        filtered = filtered.filter(item =>
          item.category && item.category.toLowerCase() === state.selectedCategory.toLowerCase()
        );
      }

      // Filter berdasarkan search term
      if (state.searchTerm) {
        const lowerCaseSearchTerm = state.searchTerm.toLowerCase();
        filtered = filtered.filter(item =>
          item.name.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.description.toLowerCase().includes(lowerCaseSearchTerm) ||
          item.category.toLowerCase().includes(lowerCaseSearchTerm)
        );
      }
      return filtered;
    },
    // Getter baru untuk mendapatkan daftar kategori unik
    uniqueCategories: (state) => {
      const categories = new Set(['Semua Kategori']); // Tambahkan opsi 'Semua Kategori'
      state.items.forEach(item => {
        if (item.category) {
          categories.add(item.category);
        }
      });
      return Array.from(categories).sort(); // Urutkan secara alfabetis
    }
  },
});