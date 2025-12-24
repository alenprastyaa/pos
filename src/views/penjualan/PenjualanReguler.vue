<template>
    <AdminLayout>
        <div class="py-2 space-y-2">
            <div class="border-b border-gray-200 dark:border-gray-800 pb-2">
                <p class="text-lg font-bold dark:text-gray-50 tracking-tight uppercase text-blue-500">
                    Transaksi Penjualan Eceran
                </p>
            </div>

            <div class="flex flex-col space-y-2 md:flex-row md:space-x-3 md:space-y-0 items-end">
                <div class="flex-1 w-full relative">
                    <div class="flex space-x-2">
                        <input ref="barcodeInputRef" v-model="quickBarcodeInput" type="text"
                            placeholder="Scan/ketik barcode..." @keyup.enter="handleBarcodeScan"
                            :disabled="role_name !== 'admin'" class="flex-1 h-9 px-3 rounded border-2 border-blue-400 dark:border-blue-600
                            bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white
                            placeholder-gray-500 dark:placeholder-gray-400 focus:ring-1
                            focus:ring-blue-500 disabled:bg-gray-200 disabled:text-gray-500
                            dark:disabled:bg-gray-700 dark:disabled:text-gray-400" />
                    </div>
                </div>

                <div class="flex-1 w-full relative">
                    <input v-model="productSearchInput" type="text"
                        placeholder="Cari nama produk (Panah Bawah utk pilih)..."
                        @input="searchProducts(productSearchInput)" @keydown.down.prevent="navigateSearch('down')"
                        @keydown.up.prevent="navigateSearch('up')" @keydown.enter.prevent="handleSearchEnter"
                        :disabled="role_name !== 'admin'" class="w-full h-9 px-3 rounded border-2 border-blue-400 dark:border-blue-600
                        bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white
                        placeholder-gray-500 dark:placeholder-gray-400 focus:ring-1
                        focus:ring-blue-500 disabled:bg-gray-200 disabled:text-gray-500
                        dark:disabled:bg-gray-700 dark:disabled:text-gray-400" />

                    <div v-if="showSearchResults && searchResults.length > 0"
                        class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded shadow-lg z-50 max-h-200 overflow-y-auto">
                        <div v-for="(product, index) in searchResults" :key="product.barcode"
                            @click="selectProductFromSearch(product)" :class="[
                                'p-2 cursor-pointer border-b dark:border-gray-700 last:border-b-0 text-sm',
                                index === selectedSearchIndex
                                    ? 'bg-yellow-200 dark:bg-yellow-700 text-black dark:text-white'
                                    : 'hover:bg-green-50 dark:hover:bg-green-900/30 text-gray-900 dark:text-white'
                            ]">
                            <div class="font-medium truncate">{{ product.nama_produk }}</div>
                            <div class="text-xs text-gray-500 dark:text-gray-300">{{ product.barcode }} - {{
                                formatRupiah(product.harga_jual_biasa) }}</div>
                        </div>
                    </div>
                </div>

                <select v-model="selectedPelangganId" required
                    class="flex-1 w-full md:w-auto h-9 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-2 text-sm text-gray-900 dark:text-white focus:ring-1 focus:ring-blue-500">
                    <option value="" disabled>Pilih Pelanggan</option>
                    <option v-if="loadingPelanggan" disabled>Memuat...</option>
                    <option v-for="pelanggan in pelangganList" :key="pelanggan.id" :value="pelanggan.id">
                        {{ pelanggan.nama_pelanggan }}
                    </option>
                </select>
            </div>

            <div v-if="selectedPelangganId"
                class="p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded">
                <div class="flex justify-between items-center text-sm">
                    <span class="font-medium text-blue-700 dark:text-blue-300">Hutang Pelanggan</span>
                    <span class="font-bold text-base"
                        :class="hutangPelanggan > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
                        {{ formatRupiah(hutangPelanggan) }}
                    </span>
                </div>
            </div>

            <div v-if="pendingTransactions.length > 0" class="space-y-1 pt-1">
                <p class="text-xs font-bold text-gray-900 dark:text-white flex items-center gap-1">
                    <svg class="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z"
                            clip-rule="evenodd"></path>
                    </svg>
                    Pending ({{ pendingTransactions.length }})
                </p>
                <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    <div v-for="t in pendingTransactions" :key="t.id"
                        class="p-2 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded shadow-sm flex flex-col justify-between"
                        :class="{ 'ring-1 ring-blue-500': t.id === currentPendingId }">
                        <div>
                            <p class="text-xs text-yellow-800 dark:text-yellow-200 truncate font-semibold">{{
                                t.nama_pelanggan }}</p>
                            <p class="text-[10px] text-gray-600 dark:text-gray-400">{{ formatRupiah(t.total) }}</p>
                        </div>
                        <div class="flex justify-end gap-1 mt-1">
                            <button @click="loadTransaction(t)"
                                class="text-[10px] bg-blue-500 hover:bg-blue-600 text-white px-1.5 py-0.5 rounded">
                                Muat
                            </button>
                            <button @click="removePendingTransaction(t.id)"
                                class="text-[10px] bg-red-500 hover:bg-red-600 text-white px-1.5 py-0.5 rounded">
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <hr class="border-gray-200 dark:border-gray-700">

            <div
                class="bg-white dark:bg-gray-800 rounded shadow border border-gray-200 dark:border-gray-700 overflow-x-auto">

                <div class="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
                    <div v-if="transactionItems.length === 0"
                        class="px-3 py-6 text-center text-xs text-gray-400 dark:text-gray-500">
                        Belum ada produk.
                    </div>
                    <div v-for="(item, index) in transactionItems" :key="item.barcode"
                        class="p-2 dark:hover:bg-gray-700/50 space-y-1">
                        <div class="flex justify-between items-center">
                            <div class="font-semibold text-sm text-gray-900 dark:text-white truncate">{{ index + 1 }}.
                                {{ item.nama_produk }}</div>
                            <button type="button" @click="removeItem(item.barcode)" class="text-red-500 p-1">
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                        <div class="grid grid-cols-3 gap-1 text-xs">
                            <div class="col-span-1 text-gray-500">Barcode: {{ item.barcode }}</div>
                            <div class="col-span-2 text-right">{{ formatRupiah(item.harga_jual_biasa) }}</div>
                        </div>
                        <div
                            class="flex justify-between items-center pt-1 border-t border-gray-100 dark:border-gray-700/50">
                            <div class="flex items-center space-x-1">
                                <span class="text-xs text-gray-700 dark:text-gray-300">Qty:</span>
                                <input v-model.number="item.qty" type="number" min="1"
                                    @change="updateItem(item.barcode, item.qty)"
                                    class="w-12 text-center border rounded px-1 py-0.5 text-xs bg-white dark:bg-gray-700" />
                            </div>
                            <div class="font-bold text-sm text-blue-600 dark:text-blue-400">{{ formatRupiah(item.qty *
                                item.harga_jual_biasa) }}</div>
                        </div>
                    </div>
                </div>

                <table class="min-w-full hidden md:table">
                    <thead class="bg-gray-50 dark:bg-gray-700/30 text-gray-600 dark:text-gray-300 text-xs uppercase">
                        <tr>
                            <th class="px-3 py-2 text-left w-10">No</th>
                            <th class="px-3 py-2 text-left">Produk</th>
                            <th class="px-3 py-2 text-center w-24">Qty</th>
                            <th class="px-3 py-2 text-right w-32">Harga</th>
                            <th class="px-3 py-2 text-right w-32">Subtotal</th>
                            <th class="px-3 py-2 text-center w-10"></th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                        <tr v-if="transactionItems.length === 0">
                            <td colspan="6" class="px-3 py-6 text-center text-sm text-gray-400">Belum ada produk.</td>
                        </tr>
                        <tr v-for="(item, index) in transactionItems" :key="item.barcode"
                            class="dark:hover:bg-gray-700/50">
                            <td class="px-3 py-1.5 text-xs text-gray-900 dark:text-white">{{ index + 1 }}</td>
                            <td class="px-3 py-1.5">
                                <div class="font-medium text-sm text-gray-900 dark:text-white">{{ item.nama_produk }}
                                </div>
                                <!-- <div class="text-[10px] text-gray-500 dark:text-gray-400">{{ item.barcode }}</div> -->
                            </td>
                            <td class="px-3 py-1.5 text-center">
                                <input v-model.number="item.qty" type="number" min="1"
                                    @change="updateItem(item.barcode, item.qty)"
                                    class="w-14 text-center text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded px-1 py-1 text-xs bg-white dark:bg-gray-700" />
                            </td>
                            <td class="px-3 py-1.5 text-right text-xs text-gray-700 dark:text-gray-200">{{
                                formatRupiah(item.harga_jual_biasa) }}</td>
                            <td class="px-3 py-1.5 text-right font-semibold text-sm text-gray-900 dark:text-white">{{
                                formatRupiah(item.qty * item.harga_jual_biasa) }}</td>
                            <td class="px-3 py-1.5 text-center">
                                <button type="button" @click="removeItem(item.barcode)"
                                    class="text-red-500 hover:text-red-700 p-1">
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div
                    class="px-3 py-2 flex justify-between items-center bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-600 font-bold text-base text-gray-900 dark:text-white">
                    <span>Total Belanja</span>
                    <span class="text-blue-600 dark:text-blue-400">{{ formatRupiah(totalBelanja) }}</span>
                </div>
            </div>

            <div class="flex flex-col md:flex-row gap-3 items-center pt-1">
                <div class="w-full md:w-1/2">
                    <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Jumlah Bayar <span
                            class="text-red-500">*</span></label>
                    <input v-model.number="uangPembayaran" type="number" min="0" required placeholder="Rp 0"
                        class="w-full h-10 px-3 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-base font-bold text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500" />
                </div>

                <div class="w-full md:w-1/2">
                    <div v-if="uangPembayaran > 0" class="h-10 flex items-center justify-between px-3 rounded"
                        :class="kembalian >= 0 ? 'bg-green-50 dark:bg-green-900/20 text-green-700' : 'bg-red-50 dark:bg-red-900/20 text-red-700'">
                        <span class="text-sm font-medium">{{ kembalian >= 0 ? 'Kembalian' : 'Kurang Bayar' }}</span>
                        <span class="text-base font-bold">{{ formatRupiah(Math.abs(kembalian)) }}</span>
                    </div>
                    <div v-else
                        class="h-10 flex items-center px-3 text-xs text-gray-500 italic bg-gray-50 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                        Input pembayaran untuk lihat kembalian
                    </div>
                </div>
            </div>

            <div class="flex gap-2 pt-2">
                <button type="button" @click.prevent="saveCurrentTransaction"
                    :disabled="transactionItems.length === 0 || !selectedPelangganId" class="flex-1 h-10 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 
                    text-white text-sm font-medium rounded flex items-center justify-center gap-2 transition">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                        </path>
                    </svg>
                    Simpan (Pending)
                </button>

                <button type="submit" @click.prevent="submitTransaksi"
                    :disabled="isSubmitting || totalBelanja === 0 || !selectedPelangganId || uangPembayaran < totalBelanja"
                    class="flex-[2] h-10 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600
                    text-white text-sm font-bold rounded flex items-center justify-center gap-2 shadow transition hover:scale-[1.01]">
                    <svg v-if="isSubmitting" class="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    {{ isSubmitting ? 'Proses' : 'Proses Transaksi' }}
                </button>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, watch, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import AdminLayout from '@/components/layout/AdminLayout.vue';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const PENDING_TRANSACTIONS_KEY = 'pendingTransactions';
const hutangPelanggan = ref(0);
const role_name = localStorage.getItem("role_name")

const successAudio = new Audio('/barcode.mp3');

interface Toko {
    id: string;
    nama_toko: string;
    alamat: string;
}

interface KasirData {
    full_name: string;
    role_name: string;
    toko: Toko;
}

interface Pelanggan {
    id: string;
    nama_pelanggan: string;
}

interface CartItem {
    barcode: string;
    qty: number;
    nama_produk: string;
    harga_jual_biasa: number;
}

interface PendingTransaction {
    id: number;
    pelanggan_id: string;
    nama_pelanggan: string;
    items: CartItem[];
    tanggal_simpan: string;
    total: number;
}

interface TransaksiPayload {
    pelanggan_id: string;
    pembayaran: number;
    items: { barcode: string, qty: number }[];
}

interface TransaksiResponseData {
    transaksi: {
        id: string;
        total_harga: number;
        total_bayar: number;
        total_kembalian: number;
        sisa_hutang: number;
        kasir_name: string;
        createdAt: string;
    };
    pelanggan: {
        nama_pelanggan: string;
    };
}

const pelangganList = ref<Pelanggan[]>([]);
const loadingPelanggan = ref(false);
const isSubmitting = ref(false);

const selectedPelangganId = ref('');
const uangPembayaran = ref(0);
const quickBarcodeInput = ref('');
const barcodeInputRef = ref<HTMLInputElement | null>(null);
const transactionItems = ref<CartItem[]>([]);

const pendingTransactions = ref<PendingTransaction[]>([]);
const currentPendingId = ref<number | null>(null);

const kasirData = ref<KasirData | null>(null);
const productSearchInput = ref('');
const searchResults = ref<CartItem[]>([]);
const showSearchResults = ref(false);
const selectedSearchIndex = ref(-1);

const getAuthHeader = () => {
    const token = localStorage.getItem('authToken');
    return { Authorization: `Bearer ${token}` };
};

const totalBelanja = computed(() => {
    return transactionItems.value.reduce((sum, item) => sum + (item.qty * item.harga_jual_biasa), 0);
});

const kembalian = computed(() => {
    let selisih = uangPembayaran.value - totalBelanja.value;
    if (selisih >= 0 && hutangPelanggan.value > 0) {
        selisih = selisih - hutangPelanggan.value;
    }
    return selisih;
});

const formatRupiah = (number: number) => {
    if (number === null || number === undefined || isNaN(number)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const fetchKasirData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/my/data`, {
            headers: getAuthHeader(),
        });
        if (response.data.success) {
            kasirData.value = {
                full_name: response.data.data.full_name,
                role_name: response.data.data.role_name,
                toko: {
                    id: response.data.data.toko.id,
                    nama_toko: response.data.data.toko.nama_toko,
                    alamat: response.data.data.toko.alamat,
                }
            };
        }
    } catch (error) {
        console.error('Gagal mengambil data kasir:', error);
    }
};

const fetchHutangPelanggan = async (pelangganId: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/pelanggan/${pelangganId}`, {
            headers: getAuthHeader(),
        });
        if (response.data.success && response.data.data) {
            hutangPelanggan.value = response.data.data.hutang || 0;
        }
    } catch (error) {
        console.error('Gagal mengambil hutang pelanggan:', error);
        hutangPelanggan.value = 0;
    }
};
watch(selectedPelangganId, async (newValue) => {
    if (newValue) {
        await fetchHutangPelanggan(newValue);
    } else {
        hutangPelanggan.value = 0;
    }
});

const fetchPelanggan = async () => {
    loadingPelanggan.value = true;
    try {
        const response = await axios.get(`${API_BASE_URL}/pelanggan`, {
            headers: getAuthHeader(),
        });
        if (response.data.success) {
            pelangganList.value = response.data.data;
        }
    } catch (error) {
        console.error('Gagal mengambil data pelanggan:', error);
    } finally {
        loadingPelanggan.value = false;
    }
};

const searchProducts = async (searchTerm: string) => {
    selectedSearchIndex.value = -1;
    if (!searchTerm.trim()) {
        searchResults.value = [];
        showSearchResults.value = false;
        return;
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/produk`, {
            params: { search: searchTerm },
            headers: getAuthHeader(),
        });

        if (response.data.success && response.data.data.data) {
            searchResults.value = response.data.data.data.map((product: any) => ({
                barcode: product.barcode,
                qty: 1,
                nama_produk: product.nama_produk,
                harga_jual_biasa: parseFloat(product.harga_jual_biasa),
            }));
            showSearchResults.value = true;
        }
    } catch (error) {
        console.error('Error searching products:', error);
        searchResults.value = [];
    }
};

const navigateSearch = (direction: 'up' | 'down') => {
    if (!showSearchResults.value || searchResults.value.length === 0) return;

    if (direction === 'down') {
        if (selectedSearchIndex.value < searchResults.value.length - 1) {
            selectedSearchIndex.value++;
        } else {
            selectedSearchIndex.value = 0;
        }
    } else if (direction === 'up') {
        if (selectedSearchIndex.value > 0) {
            selectedSearchIndex.value--;
        } else {
            selectedSearchIndex.value = searchResults.value.length - 1;
        }
    }
};

const handleSearchEnter = () => {
    if (showSearchResults.value && selectedSearchIndex.value !== -1) {
        selectProductFromSearch(searchResults.value[selectedSearchIndex.value]);
    }
};

const resetForm = () => {
    selectedPelangganId.value = '';
    uangPembayaran.value = 0;
    transactionItems.value = [];
    quickBarcodeInput.value = '';
    currentPendingId.value = null;
    nextTick(() => {
        barcodeInputRef.value?.focus();
    });
};

// --- LOGIC BARU: Add Item dengan Quantity ---

const addOrUpdateItem = (product: any, inputQty: number) => {
    const existingItem = transactionItems.value.find(item => item.barcode === product.barcode);
    if (existingItem) {
        existingItem.qty += inputQty;
        // Pindahkan item ke paling atas agar terlihat oleh user
        transactionItems.value = [existingItem, ...transactionItems.value.filter(i => i.barcode !== product.barcode)];
    } else {
        // Masukkan item baru di paling atas dengan QTY dari input user
        transactionItems.value.unshift({
            barcode: product.barcode,
            qty: inputQty,
            nama_produk: product.nama_produk,
            harga_jual_biasa: parseFloat(product.harga_jual_biasa),
        });
    }
};
const promptQuantity = async (product: any) => {
    const { value: qty, isConfirmed } = await Swal.fire({
        title: 'Masukkan Jumlah',
        html: `Produk: <strong>${product.nama_produk}</strong><br>Harga: ${formatRupiah(product.harga_jual_biasa)}`,
        input: 'number',
        inputValue: 1,
        inputAttributes: {
            min: '1',
            step: '1'
        },
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Masuk Keranjang',
        cancelButtonText: 'Batal',
        didOpen: () => {
            const input = Swal.getInput();

            // 1. Fokus dan blok angka agar user bisa langsung ketik timpa
            input?.focus();
            input?.select();

            // 2. Event Listener Khusus untuk tombol ENTER
            input?.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    // Mencegah perilaku default browser (jika ada)
                    e.preventDefault();
                    // Paksa klik tombol Confirm (OK)
                    Swal.clickConfirm();
                }
            });
        }
    });

    if (isConfirmed && qty) {
        const parsedQty = parseInt(qty);
        if (parsedQty > 0) {
            addOrUpdateItem(product, parsedQty);
            return true;
        }
    }
    return false;
};

const updateItem = (barcode: string, newQty: number) => {
    const item = transactionItems.value.find(i => i.barcode === barcode);
    if (item) {
        if (newQty <= 0 || isNaN(newQty)) {
            removeItem(barcode);
        } else {
            item.qty = newQty;
        }
    }
};

const removeItem = (barcode: string) => {
    transactionItems.value = transactionItems.value.filter(item => item.barcode !== barcode);
};

const lookupProductByBarcode = async (barcode: string) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/transaksi/scan`,
            { barcode },
            { headers: getAuthHeader() }
        );
        if (response.data.success && response.data.data) {
            return response.data.data;
        }
        return null;
    } catch (error: any) {
        console.error('Lookup product error:', error);
        return null;
    }
};

const selectProductFromSearch = async (product: CartItem) => {
    // 1. Tampilkan prompt Qty terlebih dahulu
    const isAdded = await promptQuantity(product);

    // 2. Jika user menekan OK/Enter
    if (isAdded) {
        productSearchInput.value = '';
        searchResults.value = [];
        showSearchResults.value = false;
        selectedSearchIndex.value = -1;
    } else {
        // Jika batal, kembalikan fokus ke search (opsional)
        // productSearchInput.value = ''; 
    }
};

const handleBarcodeScan = async () => {
    const barcode = quickBarcodeInput.value.trim();
    if (!barcode) return;

    const product = await lookupProductByBarcode(barcode);
    if (product) {
        try {
            successAudio.play();
        } catch (e) {
            console.warn('Gagal memutar audio', e);
        }

        // Tampilkan Popup Qty
        const isAdded = await promptQuantity(product);

        if (isAdded) {
            Swal.fire({
                icon: 'success',
                title: 'Ditambahkan',
                text: `${product.nama_produk}`,
                timer: 1000,
                showConfirmButton: false,
                toast: true,
                position: 'top-end'
            });
        }
    } else {
        Swal.fire('Tidak Ditemukan', `Barcode: ${barcode}`, 'error');
    }

    quickBarcodeInput.value = '';
    nextTick(() => {
        barcodeInputRef.value?.focus();
    });
};

const saveToLocalStorage = () => {
    try {
        localStorage.setItem(PENDING_TRANSACTIONS_KEY, JSON.stringify(pendingTransactions.value));
    } catch (e) {
        console.error('Error saving pending transactions:', e);
    }
};

const loadPendingTransactions = () => {
    try {
        const data = localStorage.getItem(PENDING_TRANSACTIONS_KEY);
        pendingTransactions.value = data ? JSON.parse(data) : [];
    } catch (e) {
        console.error('Error loading pending transactions:', e);
        pendingTransactions.value = [];
    }
};

const saveCurrentTransaction = async () => {
    if (transactionItems.value.length === 0) {
        Swal.fire('Peringatan', 'Keranjang belanja kosong.', 'warning');
        return;
    }

    if (!selectedPelangganId.value) {
        Swal.fire('Peringatan', 'Pilih pelanggan dahulu.', 'warning');
        return;
    }

    const selectedPelanggan = pelangganList.value.find(p => p.id === selectedPelangganId.value);
    const namaPelanggan = selectedPelanggan ? selectedPelanggan.nama_pelanggan : 'Pelanggan';

    const newTransaction: PendingTransaction = {
        id: Date.now(),
        pelanggan_id: selectedPelangganId.value,
        nama_pelanggan: namaPelanggan,
        items: [...transactionItems.value],
        tanggal_simpan: new Date().toLocaleString('id-ID'),
        total: totalBelanja.value
    };

    pendingTransactions.value.push(newTransaction);
    saveToLocalStorage();
    Swal.fire({ title: 'Tersimpan (Pending)', icon: 'success', timer: 1000, showConfirmButton: false, toast: true, position: 'top-end' });
    resetForm();
};

const loadTransaction = (transaction: PendingTransaction) => {
    resetForm();
    selectedPelangganId.value = transaction.pelanggan_id;
    transactionItems.value = transaction.items;
    uangPembayaran.value = 0;
    currentPendingId.value = transaction.id;
    removePendingTransaction(currentPendingId.value, false);
};

const removePendingTransaction = (id: number, showSuccess: boolean = true) => {
    pendingTransactions.value = pendingTransactions.value.filter(t => t.id !== id);
    saveToLocalStorage();
};

const generateReceiptHTML = (
    trx: TransaksiResponseData['transaksi'],
    pelangganName: string,
    items: CartItem[],
    kasirFullName: string,
    tokoName: string,
    tokoAlamat: string,
): string => {
    const total_bayar = trx.total_bayar;
    const total_harga = trx.total_harga;
    const kembalian = trx.total_kembalian;
    const sisa_hutang = trx.sisa_hutang;

    const formatCurrency = (number: number) => {
        return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(number);
    };

    return `
        <div style="width: 280px; font-family: monospace; font-size: 12px; padding: 10px; text-align: center;">
            <div style="margin-bottom: 10px;">
                <div style="font-weight: bold; font-size: 14px; margin-bottom: 5px;">${tokoName.toUpperCase()}</div>
                <div style="font-size: 11px; line-height: 1.4;">
                    ${tokoAlamat.replace(/\n/g, '<br>')}
                </div>
            </div>

            <div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 5px 0; margin: 5px 0;">
                <div style="display: flex; justify-content: space-between; font-size: 11px;">
                    <span>ID: ${trx.id.substring(0, 8)}</span>
                    <span>${formatDateTime(trx.createdAt)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 2px;">
                    <span>Kasir: ${kasirFullName}</span>
                    <span>Plg: ${pelangganName}</span>
                </div>
            </div>

            <div style="border-bottom: 1px dashed #000; padding-bottom: 4px;">
                ${items.map(item => `
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 4px;">
                        <span style="flex: 1; text-align: left;">${item.nama_produk}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px;">
                        <span style="width: 30px; text-align: right;">${item.qty}x</span>
                        <span style="width: 60px; text-align: right;">${formatCurrency(item.harga_jual_biasa)}</span>
                        <span style="flex: 1; text-align: right;">${formatCurrency(item.qty * item.harga_jual_biasa)}</span>
                    </div>
                `).join('')}
            </div>

            <div style="margin-top: 8px;">
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 12px;">
                    <span>TOTAL:</span>
                    <span>Rp ${formatCurrency(total_harga)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 2px;">
                    <span>Tunai:</span>
                    <span>Rp ${formatCurrency(total_bayar)}</span>
                </div>
                ${kembalian > 0 ? `
                    <div style="display: flex; justify-content: space-between; font-size: 11px;">
                        <span>Kembali:</span>
                        <span>Rp ${formatCurrency(kembalian)}</span>
                    </div>
                ` : ''}
                ${sisa_hutang > 0 ? `
                    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px; margin-top: 4px;">
                        <span>SISA HUTANG:</span>
                        <span>Rp ${formatCurrency(sisa_hutang)}</span>
                    </div>
                ` : ''}
            </div>

            <div style="margin-top: 15px; font-size: 10px; text-align: center;">
                -- Terima Kasih --
            </div>
        </div>
    `;
};

const printStruk = (
    trx: TransaksiResponseData['transaksi'],
    pelangganName: string,
    items: CartItem[],
    kasirFullName: string,
    tokoName: string,
    tokoAlamat: string,
) => {
    const printContent = generateReceiptHTML(trx, pelangganName, items, kasirFullName, tokoName, tokoAlamat);

    const printWindow = window.open("", "", "width=350,height=600,scrollbars=yes");
    if (!printWindow) return;

    printWindow.document.write(`
        <html>
            <head>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: monospace; font-size: 12px; }
                </style>
            </head>
            <body onload="window.print(); setTimeout(() => window.close(), 500);">
                ${printContent}
            </body>
        </html>
    `);
    printWindow.document.close();
};

const submitTransaksi = async () => {
    if (!selectedPelangganId.value) {
        Swal.fire('Error', 'Pilih pelanggan.', 'error');
        return;
    }

    if (transactionItems.value.length === 0) {
        Swal.fire('Error', 'Keranjang kosong.', 'error');
        return;
    }

    const confirmResult = await Swal.fire({
        title: 'Proses Transaksi?',
        html: `Total: <b>${formatRupiah(totalBelanja.value)}</b><br>Bayar: <b>${formatRupiah(uangPembayaran.value)}</b>`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya',
        cancelButtonText: 'Batal'
    });

    if (!confirmResult.isConfirmed) return;

    if (kembalian.value < 0) {
        const hutangResult = await Swal.fire({
            title: 'Kurang Bayar (Hutang)',
            text: `Kurang: ${formatRupiah(Math.abs(kembalian.value))}. Lanjut?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hutang'
        });
        if (!hutangResult.isConfirmed) return;
    }

    const itemsForPrint = [...transactionItems.value];
    const payload: TransaksiPayload = {
        pelanggan_id: selectedPelangganId.value,
        pembayaran: uangPembayaran.value,
        items: transactionItems.value.map(item => ({ barcode: item.barcode, qty: item.qty }))
    };

    isSubmitting.value = true;

    try {
        const response = await axios.post(`${API_BASE_URL}/transaksi/create/reguler`, payload, {
            headers: getAuthHeader(),
        });

        if (response.data.success) {
            const dataTransaksi = response.data.data.transaksi;

            printStruk(
                dataTransaksi,
                response.data.data.pelanggan.nama_pelanggan,
                itemsForPrint,
                kasirData.value!.full_name,
                kasirData.value!.toko.nama_toko,
                kasirData.value!.toko.alamat,
            );

            Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: `Kembalian: ${formatRupiah(dataTransaksi.total_kembalian)}`,
                timer: 2000,
                showConfirmButton: false
            });

            if (currentPendingId.value !== null) {
                removePendingTransaction(currentPendingId.value, false);
            }

            await fetchHutangPelanggan(selectedPelangganId.value);
            resetForm();
        } else {
            Swal.fire('Gagal', response.data.message, 'error');
        }
    } catch (error: any) {
        Swal.fire('Error', error.response?.data?.message || 'Server Error', 'error');
    } finally {
        isSubmitting.value = false;
    }
};

onMounted(async () => {
    await fetchKasirData();
    await fetchPelanggan();
    loadPendingTransactions();
    barcodeInputRef.value?.focus();
});
</script>