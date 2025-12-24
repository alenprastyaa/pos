<template>
    <AdminLayout>
        <div class="py-2 space-y-2 bg-gray-50 dark:bg-gray-950 min-h-screen">
            <!-- <div class="border-b border-gray-200 dark:border-gray-800 pb-2">
                <p class="text-xl  dark:text-gray-50 tracking-tight uppercase text-red-600">
                    Transaksi Penjualan Grosir
                </p>
            </div> -->
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div class="lg:col-span-2 relative">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Cari Produk
                    </label>
                    <input @keypress="preventNumber" ref="barcodeInputRef" v-model="productSearchInput" type="text"
                        style="font-size: 12px;" placeholder="Ketik nama produk..."
                        @input="searchProducts(productSearchInput)" @keydown="handleSearchKeydown"
                        :disabled="role_name !== 'admin'" class="w-full h-8 px-4 rounded-lg border border-gray-300 dark:border-gray-700 
                        bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100
                        placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2
                        focus:ring-cyan-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500
                        dark:disabled:bg-gray-800 dark:disabled:text-gray-400 transition" />
                    <div v-if="showSearchResults && searchResults.length > 0"
                        class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-10 max-h-200 overflow-y-auto">
                        <div v-for="(product, index) in searchResults" :key="product.barcode"
                            @click="selectProductFromSearch(product)"
                            :class="index === selectedSearchIndex ? 'bg-yellow-300 dark:bg-cyan-900/20 border-l-4 border-cyan-500' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'"
                            class="px-2 py-1 cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-b-0 transition">
                            <div style="font-size: 12px;" class=" text-gray-900 dark:text-gray-100">{{
                                product.nama_produk }}</div>
                            <!-- <div class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ product.barcode }} • {{
                                formatRupiah(product.harga_jual_ritel) }}</div> -->
                        </div>
                    </div>
                </div>

                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Pilih Pelanggan
                    </label>
                    <select v-model="selectedPelangganId" required style="font-size: 12px;"
                        class="w-full h-8 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition">
                        <option value="" disabled>Pilih Pelanggan...</option>
                        <option v-if="loadingPelanggan" disabled>Memuat...</option>
                        <option v-for="pelanggan in pelangganList" :key="pelanggan.id" :value="pelanggan.id">
                            {{ pelanggan.nama_pelanggan }}
                        </option>
                    </select>
                </div>
            </div>

            <!-- Customer Debt Info -->
            <div v-if="selectedPelangganId"
                class="p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div class="flex justify-between items-center">
                    <span class="text-sm font-medium text-gray-600 dark:text-gray-400">Hutang Pelanggan</span>
                    <span class="text-lg"
                        :class="hutangPelanggan > 0 ? 'text-red-600 dark:text-red-500' : 'text-emerald-600 dark:text-emerald-500'">
                        {{ formatRupiah(hutangPelanggan) }}
                    </span>
                </div>
            </div>

            <!-- Pending Transactions -->
            <div v-if="pendingTransactions.length > 0" class="space-y-3">
                <div class="flex items-center gap-2">
                    <div class="w-1 h-6 bg-amber-500 rounded"></div>
                    <p class="text-sm font-bold text-gray-900 dark:text-gray-100">
                        Transaksi Pending ({{ pendingTransactions.length }})
                    </p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div v-for="t in pendingTransactions" :key="t.id"
                        class="p-4 bg-white dark:bg-gray-900 border-2 rounded-lg transition cursor-pointer"
                        :class="{ 'border-cyan-500 bg-yellow-300 dark:bg-cyan-900/10': t.id === currentPendingId, 'border-amber-200 dark:border-amber-800 hover:border-amber-400 dark:hover:border-amber-600': t.id !== currentPendingId }">
                        <div class="mb-3">
                            <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">{{ t.nama_pelanggan }}</p>
                            <p class="text-lg font-bold text-amber-600 dark:text-amber-500 mt-1">{{
                                formatRupiah(t.total) }}</p>
                            <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">{{ t.tanggal_simpan }}</p>
                        </div>
                        <div class="flex gap-2 justify-end">
                            <button @click="loadTransaction(t)"
                                class="text-sm bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1.5 rounded-md font-medium transition">
                                Muat
                            </button>
                            <button @click="removePendingTransaction(t.id)"
                                class="text-sm bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 px-3 py-1.5 rounded-md font-medium transition">
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Transaction Table -->
            <div
                class="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="bg-gray-100 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                                <th style="font-size: 12px;"
                                    class="px-6 py-4 text-left  text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    No</th>
                                <th style="font-size: 12px;"
                                    class="px-6 py-4 text-left  text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Produk</th>
                                <th style="font-size: 12px;"
                                    class="px-6 py-4 text-center  text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Qty</th>
                                <th style="font-size: 12px;"
                                    class="px-6 py-4 text-right  text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Harga</th>
                                <th style="font-size: 12px;"
                                    class="px-6 py-4 text-right  text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    Subtotal</th>
                                <th style="font-size: 12px;"
                                    class="px-6 py-4 text-center  text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
                            <tr v-if="transactionItems.length === 0">
                                <td colspan="6" class="px-6 py-12 text-center text-gray-400 dark:text-gray-500">
                                    <div class="space-y-2">
                                        <svg class="w-12 h-12 mx-auto opacity-40" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                        </svg>
                                        <p class="text-sm">Belum ada produk ditambahkan</p>
                                    </div>
                                </td>
                            </tr>
                            <tr v-for="(item, index) in transactionItems" :key="item.barcode"
                                class="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition">

                                <td class="px-6 py-1 text-sm text-gray-900 dark:text-gray-100 font-medium">
                                    {{ index + 1 }}
                                </td>

                                <td class="px-6 py-1">
                                    <div style="font-size: 12px;"
                                        class="text-gray-900 dark:text-gray-100 leading-tight">
                                        {{ item.nama_produk }}
                                    </div>
                                </td>

                                <td class="px-6 py-1 text-center">
                                    <input v-model.number="item.qty" type="number" min="1"
                                        @change="updateItem(item.barcode, item.qty)"
                                        class="w-20 text-center text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-700 rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-800 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition" />
                                </td>

                                <td class="px-6 py-1 text-right text-sm text-gray-700 dark:text-gray-300">
                                    {{ formatRupiah(item.harga_jual_ritel) }}
                                </td>

                                <td class="px-6 py-1 text-right text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {{ formatRupiah(item.qty * item.harga_jual_ritel) }}
                                </td>

                                <td class="px-6 py-1 text-center">
                                    <button type="button" @click="removeItem(item.barcode)"
                                        class="text-gray-400 hover:text-red-600 dark:hover:text-red-500 p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition">
                                        <svg width="18" height="18" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor" stroke-width="2">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- Total -->
                <div
                    class="px-6 py-2 bg-gray-100 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <span class="text-base text-gray-700 dark:text-gray-300">Total Belanja</span>
                    <span class="text-xl text-cyan-600 dark:text-cyan-500">{{ formatRupiah(totalBelanja)
                    }}</span>
                </div>
            </div>

            <!-- Payment Section -->
            <div class="space-y-4 mt-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Jumlah Bayar <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                        <span
                            class="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-gray-500 dark:text-gray-400">
                            Rp
                        </span>
                        <input :value="uangPembayaranDisplay || uangPembayaran || ''" @input="handlePembayaranInput"
                            @focus="handlePembayaranFocus" @blur="handlePembayaranBlur" type="text" required
                            placeholder="0" class="w-full h-10 pl-12 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 
                bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 
                placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 
                focus:border-transparent transition" />
                    </div>
                </div>

                <!-- Payment Summary -->
                <!-- Payment Summary -->
                <div
                    class="p-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3">
                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">Hutang Lama:</span>
                        <span class="font-semibold"
                            :class="hutangPelanggan > 0 ? 'text-red-600 dark:text-red-500' : 'text-emerald-600 dark:text-emerald-500'">
                            {{ formatRupiah(hutangPelanggan) }}
                        </span>
                    </div>

                    <div class="flex justify-between text-sm">
                        <span class="text-gray-600 dark:text-gray-400">Total Belanja:</span>
                        <span class="font-semibold text-gray-900 dark:text-gray-100">
                            {{ formatRupiah(totalBelanja) }}
                        </span>
                    </div>

                    <!-- Total yang harus dibayar -->
                    <div class="flex justify-between text-base  border-t border-gray-200 dark:border-gray-700 pt-3"
                        :class="totalYangHarusDibayar > 0 ? 'text-orange-600 dark:text-orange-500' : 'text-gray-900 dark:text-gray-100'">
                        <span>Total yang Harus Dibayar:</span>
                        <span>{{ formatRupiah(totalYangHarusDibayar) }}</span>
                    </div>

                    <div class="flex justify-between text-sm border-t border-gray-200 dark:border-gray-700 pt-3">
                        <span class="text-gray-600 dark:text-gray-400">Uang Bayar:</span>
                        <span class="font-semibold text-gray-900 dark:text-gray-100">
                            {{ formatRupiah(uangPembayaran) }}
                        </span>
                    </div>

                    <div class="flex justify-between text-base border-t border-gray-200 dark:border-gray-700 pt-3 "
                        :class="kembalian >= 0 ? 'text-emerald-600 dark:text-emerald-500' : 'text-red-600 dark:text-red-500'">
                        <span>{{ kembalian >= 0 ? 'Kembalian' : 'Sisa Hutang' }}</span>
                        <span>{{ formatRupiah(Math.abs(kembalian)) }}</span>
                    </div>
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button type="button" @click.prevent="saveCurrentTransaction"
                    :disabled="transactionItems.length === 0 || !selectedPelangganId" class="h-12 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-300 dark:disabled:bg-gray-700 
                    text-white font-medium rounded-lg flex items-center justify-center gap-2 transition">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Simpan (Pending)
                </button>

                <button type="submit" @click.prevent="submitTransaksi"
                    :disabled="isSubmitting || totalBelanja === 0 || !selectedPelangganId" class="md:col-span-2 h-12 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-300 dark:disabled:bg-gray-700
                    text-white text-base font-semibold rounded-lg flex items-center justify-center gap-2
                    shadow-sm transition transform hover:scale-[1.01]">
                    <svg v-if="isSubmitting" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                    {{ isSubmitting ? 'Memproses...' : 'Proses Transaksi' }}
                </button>
            </div>

        </div>
    </AdminLayout>
</template>
<script setup lang="ts">
import { ref, onMounted, computed, nextTick, watch } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import AdminLayout from '@/components/layout/AdminLayout.vue';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const PENDING_TRANSACTIONS_KEY = 'pendingTransactions';
const hutangPelanggan = ref(0);
const role_name = localStorage.getItem("role_name")

interface Toko {
    id: string;
    nama_toko: string;
    alamat: string;
}

interface KasirData {
    full_name: string;
    role_name: string; // TAMBAHAN
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
    harga_jual_ritel: number;
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

const selectedSearchIndex = ref<number>(-1);
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
const getAuthHeader = () => {
    const token = localStorage.getItem('authToken');
    return { Authorization: `Bearer ${token}` };
};
const isSuperAdmin = computed(() => kasirData.value?.role_name === 'superadmin');
const tokoList = ref<Toko[]>([]);
const selectedTokoId = ref('');
const loadingToko = ref(false);
const uangPembayaranDisplay = ref(''); // TAMBAHKAN INI
const totalYangHarusDibayar = computed(() => {
    const hutang = Number(hutangPelanggan.value) || 0;
    const belanja = Number(totalBelanja.value) || 0;
    return hutang + belanja;
});

const preventNumber = (e: KeyboardEvent) => {
    if (/\d/.test(e.key)) {
        e.preventDefault();
    }
};
const formatInputRupiah = (value: string) => {
    // Hapus semua karakter non-digit
    const numbers = value.replace(/\D/g, '');

    // Convert ke number
    const numberValue = parseInt(numbers) || 0;

    // Update nilai asli
    uangPembayaran.value = numberValue;

    // Format untuk display
    if (numbers === '') {
        uangPembayaranDisplay.value = '';
    } else {
        uangPembayaranDisplay.value = new Intl.NumberFormat('id-ID').format(numberValue);
    }
};

const handlePembayaranInput = (event: Event) => {
    const input = event.target as HTMLInputElement;
    formatInputRupiah(input.value);
};

const handlePembayaranFocus = (event: Event) => {
    const input = event.target as HTMLInputElement;
    // Saat focus, tampilkan angka tanpa format untuk kemudahan edit
    if (uangPembayaran.value > 0) {
        input.value = uangPembayaran.value.toString();
    }
};

const handlePembayaranBlur = (event: Event) => {
    const input = event.target as HTMLInputElement;
    // Saat blur, tampilkan dengan format rupiah
    if (uangPembayaran.value > 0) {
        input.value = uangPembayaranDisplay.value;
    }
};

const filterText = () => {
    productSearchInput.value = productSearchInput.value.replace(/[0-9]/g, "");
};
const searchProducts = async (searchTerm: string) => {
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
                harga_jual_ritel: parseFloat(product.harga_jual_ritel),
            }));
            showSearchResults.value = true;
            selectedSearchIndex.value = -1;
        }
    } catch (error) {
        console.error('Error searching products:', error);
        searchResults.value = [];
    }
};
const handleSearchKeydown = (event: KeyboardEvent) => {
    if (!showSearchResults.value || searchResults.value.length === 0) return;

    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault();
            selectedSearchIndex.value = Math.min(
                selectedSearchIndex.value + 1,
                searchResults.value.length - 1
            );
            break;
        case 'ArrowUp':
            event.preventDefault();
            selectedSearchIndex.value = Math.max(selectedSearchIndex.value - 1, -1);
            break;
        case 'Enter':
            event.preventDefault();
            if (selectedSearchIndex.value >= 0) {
                selectProductFromSearch(searchResults.value[selectedSearchIndex.value]);
            }
            break;
        case 'Escape':
            event.preventDefault();
            showSearchResults.value = false;
            selectedSearchIndex.value = -1;
            break;
    }
};
const fetchTokoList = async () => {
    loadingToko.value = true;
    try {
        const response = await axios.get(`${API_BASE_URL}/toko`, {
            headers: getAuthHeader(),
        });
        if (response.data.success) {
            tokoList.value = response.data.data;
        }
    } catch (error) {
        console.error('Gagal mengambil data toko:', error);
    } finally {
        loadingToko.value = false;
    }
};

const selectProductFromSearch = async (product: CartItem) => {
    const qty = await promptQuantity(product);

    if (qty !== null) {
        addOrUpdateItem(product, qty);
        Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: `${qty} ${product.nama_produk} ditambahkan`,
            timer: 1500,
            showConfirmButton: false
        });
    }

    productSearchInput.value = '';
    searchResults.value = [];
    showSearchResults.value = false;
    selectedSearchIndex.value = -1;

    nextTick(() => {
        barcodeInputRef.value?.focus();
    });
};

const formatRupiah = (number: number) => {
    if (number === null || number === undefined || isNaN(number)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

const formatDateTime = (dateString: string) => {
    // Digunakan untuk struk
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getPelangganName = (id: string) => {
    const pelanggan = pelangganList.value.find(p => p.id === id);
    return pelanggan ? pelanggan.nama_pelanggan : 'Umum / Tidak Dikenal';
};

// --- Computed Properties ---
const totalBelanja = computed(() => {
    return transactionItems.value.reduce((sum, item) => sum + (item.qty * item.harga_jual_ritel), 0);
});


const kembalian = computed(() => {
    const bayar = Number(uangPembayaran.value) || 0;
    const total = Number(totalYangHarusDibayar.value) || 0;
    return bayar - total;
});

const fetchKasirData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/my/data`, {
            headers: getAuthHeader(),
        });
        if (response.data.success) {
            kasirData.value = {
                full_name: response.data.data.full_name,
                role_name: response.data.data.role_name, // TAMBAHAN BARIS INI
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
            // PENTING: Pastikan convert ke number dengan benar
            hutangPelanggan.value = Number(response.data.data.hutang) || 0;
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
const addOrUpdateItem = (product: any, qty: number = 1) => {
    const existingItem = transactionItems.value.find(item => item.barcode === product.barcode);
    if (existingItem) {
        existingItem.qty += qty;
        // Pindahkan item yang diupdate ke paling atas
        transactionItems.value = [
            existingItem,
            ...transactionItems.value.filter(item => item.barcode !== product.barcode)
        ];
    } else {
        // Tambahkan item baru di paling atas
        transactionItems.value.unshift({
            barcode: product.barcode,
            qty: qty,
            nama_produk: product.nama_produk,
            harga_jual_ritel: parseFloat(product.harga_jual_ritel),
        });
    }
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


const handleBarcodeScan = async () => {
    const barcode = quickBarcodeInput.value.trim();
    if (!barcode) return;

    const product = await lookupProductByBarcode(barcode);
    if (product) {
        addOrUpdateItem(product);
        Swal.fire({
            icon: 'success',
            title: `${product.nama_produk} ditambahkan`,
            text: `${product.nama_produk} berhasil ditambahkan ke keranjang`,
            timer: 1500,
            showConfirmButton: false
        });
    } else {
        Swal.fire('Tidak Ditemukan', `Produk dengan barcode ${barcode} tidak ditemukan.`, 'error');
    }

    quickBarcodeInput.value = '';
    nextTick(() => {
        barcodeInputRef.value?.focus();
    });
};
// --- Pending Transaction Logic ---
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
        Swal.fire('Peringatan', 'Pelanggan harus dipilih untuk menyimpan transaksi pending.', 'warning');
        return;
    }

    const selectedPelanggan = pelangganList.value.find(p => p.id === selectedPelangganId.value);
    const namaPelanggan = selectedPelanggan ? selectedPelanggan.nama_pelanggan : 'Pelanggan Tidak Dikenal';

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
    Swal.fire('Berhasil', 'Transaksi telah disimpan sebagai pending.', 'success');
    resetForm();
};

const loadTransaction = (transaction: PendingTransaction) => {
    resetForm();

    selectedPelangganId.value = transaction.pelanggan_id;
    transactionItems.value = transaction.items;
    uangPembayaran.value = 0;

    currentPendingId.value = transaction.id;

    Swal.fire('Dimuat', `Transaksi untuk ${transaction.nama_pelanggan} telah dimuat ke keranjang.`, 'info');
    removePendingTransaction(currentPendingId.value, false);
};

const removePendingTransaction = (id: number, showSuccess: boolean = true) => {
    pendingTransactions.value = pendingTransactions.value.filter(t => t.id !== id);
    saveToLocalStorage();
    if (showSuccess) {
        Swal.fire('Berhasil', 'Transaksi pending telah dihapus.', 'success');
    }
};

// --- Print Struk Logic ---

/**
 * FUNGSI DIPERBAIKI: Generate HTML Struk dengan data Kasir dan Toko
 */
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

            <div style="border-top: 2px dashed #000; border-bottom: 2px dashed #000; padding: 8px 0; margin: 8px 0;">
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
                    <span><strong>ID:</strong> ${trx.id.substring(0, 8)}</span>
                    <span><strong>Kasir:</strong> ${kasirFullName}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px;">
                    <span><strong>Tanggal:</strong></span>
                    <span>${formatDateTime(trx.createdAt)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 3px;">
                    <span><strong>Pelanggan:</strong></span>
                    <span>${pelangganName}</span>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px; margin: 8px 0 4px 0; border-bottom: 1px dashed #000; padding-bottom: 4px;">
                <span style="flex: 1; text-align: left;">ITEM</span>
                <span style="width: 30px; text-align: center;">QTY</span>
                <span style="width: 50px; text-align: right;">HARGA</span>
                <span style="width: 50px; text-align: right;">TOTAL</span>
            </div>

            <div>
                ${items.map(item => `
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                        <span style="flex: 1; text-align: left; word-break: break-word;">${item.nama_produk}</span>
                        <span style="width: 30px; text-align: center;">${item.qty}</span>
                        <span style="width: 50px; text-align: right;">${formatCurrency(item.harga_jual_ritel)}</span>
                        <span style="width: 50px; text-align: right;">${formatCurrency(item.qty * item.harga_jual_ritel)}</span>
                    </div>
                `).join('')}
            </div>

            <div style="border-top: 2px dashed #000; margin: 8px 0; padding-top: 8px;">
    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 12px; margin-bottom: 4px;">
        <span>TOTAL BELANJA:</span>
        <span>Rp ${formatCurrency(total_harga)}</span>
    </div>

    <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
        <span>Tunai:</span>
        <span>Rp ${formatCurrency(total_bayar)}</span>
    </div>
    
    ${kembalian > 0 ? `
        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px; color: #2ecc71;">
            <span>Kembali:</span>
            <span>Rp ${formatCurrency(kembalian)}</span>
        </div>
    ` : ''}

    ${sisa_hutang > 0 ? `
        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px; color: #e74c3c; margin-top: 5px;">
            <span>SISA HUTANG:</span>
            <span>Rp ${formatCurrency(sisa_hutang)}</span>
        </div>
    ` : ''}
    </div>


            <div style="margin-top: 10px; font-size: 11px; line-height: 1.6;">
                <div>Terima Kasih Atas Kunjungan Anda</div>
                <div>Periksa barang sebelum dibeli</div>
                <div style="font-size: 10px; color: #666;">Barang yang sudah dibeli<br>tidak bisa ditukar atau dikembalikan</div>
            </div>
        </div>
    `;
};

/**
 * FUNGSI DIPERBAIKI: Print Struk yang menerima data Kasir dan Toko
 */
const printStruk = (
    trx: TransaksiResponseData['transaksi'],
    pelangganName: string,
    items: CartItem[],
    kasirFullName: string,
    tokoName: string,
    tokoAlamat: string,
) => {
    const printContent = generateReceiptHTML(trx, pelangganName, items, kasirFullName, tokoName, tokoAlamat);

    const printWindow = window.open("", "", "width=350,height=700,scrollbars=yes");
    if (!printWindow) {
        Swal.fire('Error', 'Gagal membuka jendela cetak. Periksa setelan pop-up browser Anda.', 'error');
        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Struk Transaksi ${trx.id.substring(0, 8)}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { 
                        font-family: 'Courier New', monospace; 
                        font-size: 12px;
                        background: #f5f5f5;
                        padding: 10px;
                    }
                    @media print {
                        body { padding: 0; background: white; }
                        @page { margin: 0; size: 80mm auto; }
                    }
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
        Swal.fire('Peringatan', 'Pelanggan harus dipilih.', 'warning');
        return;
    }

    if (transactionItems.value.length === 0) {
        Swal.fire('Peringatan', 'Keranjang belanja kosong.', 'warning');
        return;
    }
    if (!kasirData.value) {
        Swal.fire('Error', 'Data kasir/toko belum dimuat. Mohon refresh halaman atau cek koneksi API.', 'error');
        return;
    }
    if (isSuperAdmin.value && !selectedTokoId.value) {
        Swal.fire('Peringatan', 'Toko harus dipilih untuk melakukan penjualan.', 'warning');
        return;
    }


    const confirmResult = await Swal.fire({
        icon: 'question',
        title: 'Konfirmasi Transaksi',
        html: `<div class="text-left">
                   <p class="mb-3"><strong>Total Belanja:</strong> ${formatRupiah(totalBelanja.value)}</p>
                   <p class="mb-3"><strong>Uang Bayar:</strong> ${formatRupiah(uangPembayaran.value)}</p>
                   <p class="mb-4"><strong>Kembalian/Hutang:</strong> <span class="${kembalian.value < 0 ? 'text-red-600 font-bold ' : 'text-green-600 font-bold'}">${formatRupiah(Math.abs(kembalian.value))}</span></p>
                   <hr class="my-3">
                   <p class="text-sm text-gray-600">Periksa kembali data di atas sebelum melanjutkan.</p>
               </div>`,
        showCancelButton: true,
        confirmButtonText: 'Ya, Lanjutkan',
        cancelButtonText: 'Batalkan',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        allowOutsideClick: false,
        allowEscapeKey: false
    });

    if (!confirmResult.isConfirmed) {
        return;
    }

    // STEP 2: Cek Kurang Bayar (Logika tetap sama)
    const sisaBayar = kembalian.value;

    if (sisaBayar < 0) {
        const hutangAmount = Math.abs(sisaBayar);
        const result = await Swal.fire({
            icon: 'warning',
            title: 'Kurang Bayar!',
            html: `<p>Pembayaran <strong>kurang</strong> sebesar <strong>${formatRupiah(hutangAmount)}</strong>.</p>
                   <p class="mt-2 text-red-500 font-semibold">Transaksi ini akan dicatat sebagai <strong>Hutang</strong>.</p>
                   <p class="text-sm mt-3">Lanjutkan proses transaksi?</p>`,
            showCancelButton: true,
            confirmButtonText: 'Ya, Catat Hutang',
            cancelButtonText: 'Batalkan Transaksi',
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            allowOutsideClick: false,
            allowEscapeKey: false
        });

        if (!result.isConfirmed) {
            return;
        }
    }

    // Capture items for printing before sending payload
    const itemsForPrint = [...transactionItems.value];

    const itemsPayload = transactionItems.value.map(item => ({
        barcode: item.barcode,
        qty: item.qty
    }));

    const payload: TransaksiPayload = {
        pelanggan_id: selectedPelangganId.value,
        pembayaran: uangPembayaran.value,
        items: itemsPayload
    };

    isSubmitting.value = true;

    try {
        const response = await axios.post<any, { data: { success: boolean, data: TransaksiResponseData, message?: string } }>(`${API_BASE_URL}/transaksi/create/ritel`, payload, {
            headers: getAuthHeader(),
        });

        if (response.data.success) {
            const dataTransaksi = response.data.data.transaksi;
            const sisaHutangAkhir = dataTransaksi.sisa_hutang || 0;
            const kembalianAkhir = dataTransaksi.total_kembalian || 0;
            const namaPelanggan = response.data.data.pelanggan.nama_pelanggan;

            // --- AUTO PRINT CALL DENGAN DATA KASIR BARU ---
            printStruk(
                dataTransaksi,
                namaPelanggan,
                itemsForPrint,
                kasirData.value!.full_name, // Pasti ada karena divalidasi di awal
                kasirData.value!.toko.nama_toko,
                kasirData.value!.toko.alamat,
            );

            // --- Logic Notifikasi Swal.fire ---
            let title: string;
            let message: string;
            let icon: 'success' | 'warning' | 'error';

            if (sisaHutangAkhir > 0) {
                icon = 'warning';
                title = 'Transaksi Tercatat sebagai Hutang!';
                message = `<p class="text-lg font-bold mt-2">Pelanggan: ${namaPelanggan}</p>
                           <p class="text-xl font-bold mt-1 text-red-600">Sisa Hutang: ${formatRupiah(sisaHutangAkhir)}</p>`;
            } else if (sisaHutangAkhir === 0) {
                if (kembalianAkhir > 0) {
                    icon = 'success';
                    title = 'Transaksi Berhasil!';
                    message = `<p class="text-lg font-bold mt-2">Total Belanja: ${formatRupiah(totalBelanja.value)}</p>
                               <p class="text-lg font-bold mt-1">Uang Bayar: ${formatRupiah(uangPembayaran.value)}</p>
                               <p class="text-xl font-bold mt-2 text-green-600">Kembalian: ${formatRupiah(kembalianAkhir)}</p>`;
                } else {
                    icon = 'success';
                    title = 'Transaksi Berhasil!';
                    message = `<p class="text-lg font-bold mt-2">Pembayaran Lunas Pas!</p>`;
                }
            } else {
                icon = 'error';
                title = 'Error Logika Transaksi!';
                message = `<p class="text-lg font-bold mt-2">Terdeteksi error internal. Hubungi Admin.</p>`;
            }

            Swal.fire({
                icon: icon,
                title: title,
                html: message,
            });

            if (currentPendingId.value !== null) {
                removePendingTransaction(currentPendingId.value, false);
            }

            await fetchHutangPelanggan(selectedPelangganId.value);
            resetForm();

        } else {
            Swal.fire({
                icon: 'error',
                title: 'Transaksi Gagal',
                text: response.data.message || 'Terjadi kesalahan saat memproses transaksi.',
            });
        }
    } catch (error: any) {
        console.error('Error transaksi:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Gagal terhubung ke server.',
        });
    } finally {
        isSubmitting.value = false;
    }
};
const promptQuantity = async (product: CartItem) => {
    const result = await Swal.fire({
        title: 'Jumlah Barang',
        html: `
            <p class="mb-3 text-gray-700">${product.nama_produk}</p>
            <input id="qty-input" type="number" min="1" value="1" 
                class="swal2-input w-full text-center text-lg font-semibold" 
                autofocus>
        `,
        showCancelButton: true,
        confirmButtonText: 'Tambahkan',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#0891b2',
        cancelButtonColor: '#6b7280',
        allowOutsideClick: false,
        didOpen: () => {
            const input = document.getElementById('qty-input') as HTMLInputElement;
            input?.focus();
            input?.select();
        },
        preConfirm: () => {
            const input = document.getElementById('qty-input') as HTMLInputElement;
            const qty = parseInt(input.value);

            if (!qty || qty <= 0 || isNaN(qty)) {
                Swal.showValidationMessage('Masukkan jumlah yang valid (minimal 1)');
                return false;
            }
            return qty;
        }
    });

    if (result.isConfirmed && result.value) {
        return result.value;
    }
    return null;
};


// --- Lifecycle Hook ---
onMounted(async () => {
    // Panggil fungsi baru untuk memuat data kasir dan toko
    await fetchKasirData();
    await fetchPelanggan();
    loadPendingTransactions();
    barcodeInputRef.value?.focus();
});
</script>