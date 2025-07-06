import { defineStore } from 'pinia';
import axios from 'axios'; // kalau kamu juga pakai axios di file ini

export const useCartStore = defineStore('cart', {
  state: () => ({
    cart: []
  }),
  getters: {
    cartItemCount: (state) => state.cart.length
  },
  actions: {
    async fetchCartItems() {
      try {
        const res = await axios.get('http://localhost:3000/carts');
        this.cart = res.data;
      } catch (err) {
        console.error('Gagal mengambil data keranjang:', err);
      }
    },
    async addToCart(item) {
      const existing = this.cart.find(i => i.itemId === item.id);
      if (existing) {
        existing.quantity += 1;
        await axios.patch(`http://localhost:3000/carts/${existing.id}`, {
          quantity: existing.quantity
        });
      } else {
        const newCartItem = {
          itemId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1
        };
        const res = await axios.post('http://localhost:3000/carts', newCartItem);
        this.cart.push(res.data);
      }
    },
    async removeFromCart(itemId) {
      const item = this.cart.find(i => i.itemId === itemId);
      if (item) {
        await axios.delete(`http://localhost:3000/carts/${item.id}`);
        this.cart = this.cart.filter(i => i.itemId !== itemId);
      }
    }
  }
});
