<template>
  <div class="cart-container">
    <h2>Keranjang Anda</h2>

    <div v-if="cartItems.length === 0" class="empty-cart">
      <p>Keranjang masih kosong.</p>
    </div>

    <div v-else class="cart-list">
      <div v-for="item in cartItems" :key="item.id" class="cart-item-card">
        <div class="item-info">
          <h3>{{ item.name }}</h3>
          <p>Harga: Rp {{ item.price.toLocaleString('id-ID') }}</p>
          <p>Jumlah: {{ item.quantity }}</p>
        </div>
        <button @click="removeFromCart(item.itemId)" class="btn-remove">Hapus</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useCartStore } from '../stores/cartStore';
import { computed, onMounted } from 'vue';

const cartStore = useCartStore();
const cartItems = computed(() => cartStore.cart);

const removeFromCart = (itemId) => {
  cartStore.removeFromCart(itemId);
};

onMounted(() => {
  cartStore.fetchCartItems();
});
</script>

<style scoped>
.cart-container {
  max-width: 800px;
  margin: 30px auto;
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 10px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

h2 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
}

.empty-cart {
  text-align: center;
  color: #6c757d;
  font-size: 1.1em;
  padding: 40px;
  background-color: #fff;
  border-radius: 8px;
}

.cart-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.cart-item-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #ffffff;
  padding: 15px 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.item-info h3 {
  margin: 0 0 5px;
  font-size: 1.2em;
  color: #333;
}

.item-info p {
  margin: 2px 0;
  color: #555;
}

.btn-remove {
  background-color: #dc3545;
  border: none;
  color: white;
  padding: 10px 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-remove:hover {
  background-color: #c82333;
}

/* Responsive layout */
@media (max-width: 600px) {
  .cart-item-card {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }

  .btn-remove {
    align-self: stretch;
    width: 100%;
  }
}
</style>
