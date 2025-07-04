import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useItemStore } from '../stores/itemStore';
import axios from 'axios';

vi.mock('axios');

describe('itemStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.resetAllMocks();
  });

  // Ulangi test fetchItems, handles fetch error, addItem, handles add item error, totalItems
  // (Pastikan semua test sebelumnya masih berfungsi setelah perubahan di store)

  it('fetches items correctly and updates state', async () => {
    const mockItems = [
      { id: 1, name: 'Baju Bekas', price: 50000, category: 'Pakaian' },
      { id: 2, name: 'Celana Bekas', price: 75000, category: 'Pakaian' }
    ];
    axios.get.mockResolvedValueOnce({ data: mockItems });

    const store = useItemStore();
    expect(store.items).toEqual([]);
    expect(store.loading).toBe(false);

    await store.fetchItems();

    expect(store.items.length).toBe(2);
    expect(store.items[0].name).toBe('Baju Bekas');
    expect(store.loading).toBe(false);
    expect(store.error).toBe(null);
    expect(axios.get).toHaveBeenCalledWith('http://localhost:3000/items');
  });

  it('handles fetch error correctly', async () => {
    const errorMessage = 'Network connection lost';
    axios.get.mockRejectedValueOnce(new Error(errorMessage));

    const store = useItemStore();
    await store.fetchItems();

    expect(store.items).toEqual([]);
    expect(store.loading).toBe(false);
    expect(store.error).toBe('Gagal mengambil data barang: ' + errorMessage);
  });

  it('adds an item to the store via API call', async () => {
    const newItemData = { name: 'Tas Bekas', description: 'Kondisi 90%', price: 100000, category: 'Aksesoris' };
    const apiResponse = { id: 3, ...newItemData };

    axios.post.mockResolvedValueOnce({ data: apiResponse });

    const store = useItemStore();
    store.items = [];

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    await store.addItem(newItemData);

    expect(store.items.length).toBe(1);
    expect(store.items[0]).toEqual(apiResponse);
    expect(axios.post).toHaveBeenCalledWith('http://localhost:3000/items', newItemData);
    expect(alertMock).toHaveBeenCalledWith('Barang berhasil ditambahkan!');

    alertMock.mockRestore();
  });

  it('handles add item error', async () => {
    const errorMessage = 'Validation failed';
    axios.post.mockRejectedValueOnce(new Error(errorMessage));

    const store = useItemStore();
    const initialItems = [...store.items];

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    await store.addItem({ name: 'Invalid Item', price: 0, category: '' });

    expect(store.items).toEqual(initialItems);
    expect(store.error).toBe('Gagal menambahkan barang: ' + errorMessage);
    expect(alertMock).toHaveBeenCalledWith('Gagal menambahkan barang. Silakan coba lagi.');

    alertMock.mockRestore();
  });

  it('updates an item in the store via API call', async () => {
    const store = useItemStore();
    store.items = [{ id: 1, name: 'Old Name', description: 'Old Desc', price: 100, category: 'Cat' }];
    const updatedData = { name: 'New Name', description: 'New Desc', price: 200, category: 'New Cat' };
    axios.put.mockResolvedValueOnce({ data: { id: 1, ...updatedData } });

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const success = await store.updateItem(1, updatedData);

    expect(success).toBe(true);
    expect(store.items[0].name).toBe('New Name');
    expect(store.currentItem.name).toBe('New Name'); // Jika currentItem di set
    expect(axios.put).toHaveBeenCalledWith('http://localhost:3000/items/1', updatedData);
    expect(alertMock).toHaveBeenCalledWith('Barang berhasil diperbarui!');
    alertMock.mockRestore();
  });

  it('deletes an item from the store via API call', async () => {
    const store = useItemStore();
    store.items = [{ id: 1, name: 'Item to delete' }];
    axios.delete.mockResolvedValueOnce({});

    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

    const success = await store.deleteItem(1);

    expect(success).toBe(true);
    expect(store.items.length).toBe(0);
    expect(store.currentItem).toBe(null);
    expect(axios.delete).toHaveBeenCalledWith('http://localhost:3000/items/1');
    expect(alertMock).toHaveBeenCalledWith('Barang berhasil dihapus!');
    alertMock.mockRestore();
  });

  it('calculates totalItems getter correctly', () => {
    const store = useItemStore();
    store.items = [{id: 1}, {id: 2}, {id: 3}];
    expect(store.totalItems).toBe(3);
  });

  // Test baru untuk setter setSearchTerm dan setSelectedCategory
  it('sets searchTerm correctly', () => {
    const store = useItemStore();
    store.setSearchTerm('sepeda');
    expect(store.searchTerm).toBe('sepeda');
  });

  it('sets selectedCategory correctly', () => {
    const store = useItemStore();
    store.setSelectedCategory('Elektronik');
    expect(store.selectedCategory).toBe('Elektronik');
  });

  // Test baru untuk filteredItems getter
  it('filters items by search term', () => {
    const store = useItemStore();
    store.items = [
      { id: 1, name: 'Meja Belajar', description: 'Kayu jati', category: 'Furniture' },
      { id: 2, name: 'Kursi Gaming', description: 'Ergonomis', category: 'Furniture' },
      { id: 3, name: 'Monitor Bekas', description: 'Layar LCD', category: 'Elektronik' }
    ];
    store.setSearchTerm('meja');
    expect(store.filteredItems.length).toBe(1);
    expect(store.filteredItems[0].name).toBe('Meja Belajar');

    store.setSearchTerm('kayu'); // Mencari di deskripsi
    expect(store.filteredItems.length).toBe(1);
    expect(store.filteredItems[0].name).toBe('Meja Belajar');
  });

  it('filters items by selected category', () => {
    const store = useItemStore();
    store.items = [
      { id: 1, name: 'Meja Belajar', description: 'Kayu jati', category: 'Furniture' },
      { id: 2, name: 'Kursi Gaming', description: 'Ergonomis', category: 'Furniture' },
      { id: 3, name: 'Monitor Bekas', description: 'Layar LCD', category: 'Elektronik' }
    ];
    store.setSelectedCategory('Furniture');
    expect(store.filteredItems.length).toBe(2);
    expect(store.filteredItems[0].name).toBe('Meja Belajar');
    expect(store.filteredItems[1].name).toBe('Kursi Gaming');

    store.setSelectedCategory('Elektronik');
    expect(store.filteredItems.length).toBe(1);
    expect(store.filteredItems[0].name).toBe('Monitor Bekas');

    store.setSelectedCategory('Semua Kategori');
    expect(store.filteredItems.length).toBe(3); // Kembali ke semua item
  });

  it('filters items by search term and category together', () => {
    const store = useItemStore();
    store.items = [
      { id: 1, name: 'Meja Makan', description: 'Kayu', category: 'Furniture' },
      { id: 2, name: 'Meja Belajar', description: 'Plastik', category: 'Furniture' },
      { id: 3, name: 'Kursi Gaming', description: 'Ergonomis', category: 'Furniture' },
      { id: 4, name: 'TV Bekas', description: 'LCD', category: 'Elektronik' }
    ];

    store.setSelectedCategory('Furniture');
    store.setSearchTerm('Meja');
    expect(store.filteredItems.length).toBe(2);
    expect(store.filteredItems[0].name).toBe('Meja Makan');
    expect(store.filteredItems[1].name).toBe('Meja Belajar');

    store.setSearchTerm('Makan');
    expect(store.filteredItems.length).toBe(1);
    expect(store.filteredItems[0].name).toBe('Meja Makan');
  });

  it('gets unique categories correctly', () => {
    const store = useItemStore();
    store.items = [
      { id: 1, category: 'Furniture' },
      { id: 2, category: 'Buku' },
      { id: 3, category: 'Elektronik' },
      { id: 4, category: 'Furniture' },
      { id: 5, category: 'Buku' },
      { id: 6, category: null } // Kategori null harus diabaikan
    ];
    // Pastikan 'Semua Kategori' selalu ada dan urut
    expect(store.uniqueCategories).toEqual(['Buku', 'Elektronik', 'Furniture', 'Semua Kategori']);
  });
});