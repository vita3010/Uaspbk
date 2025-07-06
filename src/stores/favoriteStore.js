// stores/favoriteStore.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useFavoriteStore = defineStore('favorite', {
  state: () => ({
    favorites: []
  }),

  getters: {
    favoriteItemCount: (state) => state.favorites.length
  },

  actions: {
    async fetchFavoriteItems() {
      try {
        const res = await axios.get('http://localhost:3000/favorites');
        this.favorites = res.data;
      } catch (err) {
        console.error('Gagal mengambil data favorit:', err);
      }
    },

    async addFavorite(item) {
      // Cek apakah item sudah ada
      const existing = this.favorites.find(fav => fav.itemId === item.id);
      if (existing) {
        alert('Item sudah ada di favorit.');
        return;
      }

      try {
        const newFavorite = {
          itemId: item.id
        };
        const res = await axios.post('http://localhost:3000/favorites', newFavorite);
        this.favorites.push(res.data);
      } catch (err) {
        console.error('Gagal menambahkan ke favorit:', err);
      }
    },

    async removeFavorite(favoriteId) {
      try {
        await axios.delete(`http://localhost:3000/favorites/${favoriteId}`);
        this.favorites = this.favorites.filter(fav => fav.id !== favoriteId);
      } catch (err) {
        console.error('Gagal menghapus favorit:', err);
      }
    }
  }
});
