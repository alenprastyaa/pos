<template>
    <AdminLayout>
        <div class="page-container min-h-screen py-4 px-2 space-y-4 bg-gray-100">

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div class="lg:col-span-2 relative">
                    <label class="block text-base font-bold text-black mb-2 uppercase tracking-wide">
                        Cari Produk (Scan Barcode)
                    </label>
                    <div class="relative">
                        <input @keypress="preventNumber" ref="barcodeInputRef" v-model="productSearchInput" type="text"
                            placeholder="KETIK NAMA PRODUK / SCAN BARCODE..."
                            @input="searchProducts(productSearchInput)" @keydown="handleSearchKeydown"
                            :disabled="role_name !== 'admin'"
                            class="w-full h-12 px-4 rounded-lg border-2 border-gray-400 focus:border-cyan-700 focus:ring-2 focus:ring-cyan-200 text-lg font-bold text-black placeholder-gray-500 transition shadow-sm" />

                        <div class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    <div v-if="showSearchResults && searchResults.length > 0"
                        class="absolute top-full left-0 right-0 mt-1 rounded-lg border-2 border-gray-800 bg-white shadow-2xl z-50 max-h-80 overflow-y-auto">
                        <div v-for="(product, index) in searchResults" :key="product.barcode"
                            @click="selectProductFromSearch(product)"
                            :class="index === selectedSearchIndex ? 'bg-cyan-100 border-l-8 border-cyan-700' : 'hover:bg-gray-100 border-l-8 border-transparent'"
                            class="px-4 py-3 cursor-pointer border-b border-gray-300 transition-colors">
                            <div class="flex justify-between items-center">
                                <div class="font-bold text-lg text-black">
                                    {{ product.nama_produk }}
                                </div>
                                <div class="text-green-800 font-extrabold text-lg bg-green-100 px-2 py-1 rounded">
                                    {{ formatRupiah(product.harga_jual_ritel) }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <label class="block text-base font-bold text-black mb-2 uppercase tracking-wide">
                        Pilih Pelanggan
                    </label>
                    <select v-model="selectedPelangganId" required
                        class="w-full h-12 rounded-lg px-4 border-2 border-gray-400 focus:border-cyan-700 text-lg font-bold text-black bg-white shadow-sm">
                        <option value="" disabled class="text-gray-500">-- Pilih Pelanggan --</option>
                        <option v-if="loadingPelanggan" disabled>Memuat Data...</option>
                        <option v-for="pelanggan in pelangganList" :key="pelanggan.id" :value="pelanggan.id">
                            {{ pelanggan.nama_pelanggan }}
                        </option>
                    </select>
                </div>
            </div>

            <div v-if="selectedPelangganId"
                class="p-4 rounded-lg border-l-8 shadow-sm flex justify-between items-center bg-white"
                :class="hutangPelanggan > 0 ? 'border-red-600 bg-red-50' : 'border-green-600 bg-green-50'">
                <span class="text-lg font-bold text-gray-800">STATUS HUTANG:</span>
                <span class="text-2xl font-black px-4 py-1 rounded"
                    :class="hutangPelanggan > 0 ? 'text-red-700 bg-red-100' : 'text-green-800 bg-green-100'">
                    {{ formatRupiah(hutangPelanggan) }}
                </span>
            </div>

            <div v-if="pendingTransactions.length > 0"
                class="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-400 space-y-3">
                <div class="flex items-center gap-3 border-b-2 border-yellow-200 pb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-700" fill="none"
                        viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p class="text-lg font-black text-gray-900 uppercase">
                        Transaksi Pending ({{ pendingTransactions.length }})
                    </p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div v-for="t in pendingTransactions" :key="t.id"
                        class="p-4 border-2 rounded-lg cursor-pointer shadow-sm relative group"
                        :class="t.id === currentPendingId ? 'bg-yellow-100 border-yellow-600 ring-2 ring-yellow-400' : 'bg-white border-gray-300 hover:border-blue-400'">
                        <div class="mb-4">
                            <p class="text-base font-bold text-black border-b border-dashed border-gray-400 pb-1 mb-1">
                                {{ t.nama_pelanggan }}</p>
                            <p class="text-xl font-black text-blue-800">{{ formatRupiah(t.total) }}</p>
                            <p class="text-sm font-semibold text-gray-600 mt-1 flex items-center gap-1">
                                <span>🕒</span> {{ t.tanggal_simpan }}
                            </p>
                        </div>
                        <div class="flex gap-2">
                            <button @click="loadTransaction(t)"
                                class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-2 rounded font-bold uppercase tracking-wider shadow">
                                MUAT
                            </button>
                            <button @click="removePendingTransaction(t.id)"
                                class="bg-red-100 hover:bg-red-200 text-red-700 border border-red-300 text-sm px-3 py-2 rounded font-bold shadow">
                                HAPUS
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg shadow-md border-2 border-gray-300 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-800 text-white">
                            <tr>
                                <th
                                    class="px-4 py-3 text-left font-bold text-sm uppercase tracking-wider border-r border-gray-600 w-12">
                                    No</th>
                                <th
                                    class="px-4 py-3 text-left font-bold text-sm uppercase tracking-wider border-r border-gray-600">
                                    Nama Produk</th>
                                <th
                                    class="px-4 py-3 text-center font-bold text-sm uppercase tracking-wider border-r border-gray-600 w-32">
                                    Qty</th>
                                <th
                                    class="px-4 py-3 text-right font-bold text-sm uppercase tracking-wider border-r border-gray-600 w-48">
                                    Harga Satuan</th>
                                <th
                                    class="px-4 py-3 text-right font-bold text-sm uppercase tracking-wider border-r border-gray-600 w-48">
                                    Subtotal</th>
                                <th class="px-4 py-3 text-center font-bold text-sm uppercase tracking-wider w-16">Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y-2 divide-gray-200">
                            <tr v-if="transactionItems.length === 0">
                                <td colspan="6" class="px-6 py-16 text-center bg-gray-50">
                                    <div class="flex flex-col items-center justify-center opacity-50">
                                        <svg class="w-20 h-20 text-gray-400 mb-4" fill="none" stroke="currentColor"
                                            viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                        <p class="text-xl font-bold text-gray-500 uppercase">Keranjang Kosong</p>
                                        <p class="text-base text-gray-500">Scan barcode atau cari produk untuk memulai
                                        </p>
                                    </div>
                                </td>
                            </tr>
                            <tr v-for="(item, index) in transactionItems" :key="item.barcode"
                                class="hover:bg-cyan-50 transition-colors"
                                :class="index % 2 === 0 ? 'bg-white' : 'bg-gray-100'">
                                <td
                                    class="px-4 py-3 text-base text-black font-bold text-center border-r border-gray-200">
                                    {{ index + 1 }}</td>
                                <td class="px-4 py-3 border-r border-gray-200">
                                    <div class="text-lg font-bold text-black">{{ item.nama_produk }}</div>
                                    <div class="text-xs text-gray-600 font-mono mt-1">CODE: {{ item.barcode }}</div>
                                </td>
                                <td class="px-4 py-3 text-center border-r border-gray-200">
                                    <input v-model.number="item.qty" type="number" min="1"
                                        @change="updateItem(item.barcode, item.qty)"
                                        class="w-24 text-center border-2 border-gray-400 rounded-md px-2 py-2 text-xl font-bold text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                                </td>
                                <td
                                    class="px-4 py-3 text-right text-lg text-gray-800 font-semibold border-r border-gray-200">
                                    {{ formatRupiah(item.harga_jual_ritel) }}
                                </td>
                                <td
                                    class="px-4 py-3 text-right text-xl font-black text-black border-r border-gray-200 bg-gray-50">
                                    {{ formatRupiah(item.qty * item.harga_jual_ritel) }}
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <button type="button" @click="removeItem(item.barcode)"
                                        class="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm border border-red-200">
                                        <svg width="24" height="24" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor" stroke-width="2.5">
                                            <path stroke-linecap="round" stroke-linejoin="round"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div
                    class="px-6 py-4 bg-gray-900 text-white flex justify-between items-center border-t-4 border-gray-700">
                    <span class="text-xl font-bold uppercase tracking-wide">Total Belanja Sementara</span>
                    <span class="text-3xl font-black text-cyan-400 tracking-wider">{{ formatRupiah(totalBelanja)
                    }}</span>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <div class="lg:col-span-1">
                    <div
                        class="bg-white p-6 rounded-xl border-2 border-gray-300 shadow-md h-full flex flex-col justify-center">
                        <label class="block text-lg font-black text-black mb-3 uppercase">
                            Jumlah Uang Diterima <span class="text-red-600">*</span>
                        </label>
                        <div class="relative">
                            <span
                                class="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold text-gray-500">Rp</span>
                            <input ref="pembayaranInputRef" :value="uangPembayaranDisplay || uangPembayaran || ''"
                                @input="handlePembayaranInput" @focus="handlePembayaranFocus"
                                @blur="handlePembayaranBlur" @keydown.enter="handlePembayaranKeydown" type="text"
                                required placeholder="0"
                                class="w-full h-16 pl-14 pr-4 rounded-xl border-4 border-gray-800 focus:border-cyan-600 text-3xl font-black text-right text-black shadow-inner transition tracking-widest bg-yellow-50 focus:bg-white" />
                        </div>
                        <p class="text-sm text-gray-500 mt-2 font-semibold italic text-right">*Tekan ENTER untuk proses
                        </p>
                    </div>
                </div>

                <div class="lg:col-span-2">
                    <div class="bg-white p-6 border-2 border-gray-300 rounded-xl shadow-md space-y-4">
                        <div class="flex justify-between items-end border-b-2 border-dashed border-gray-300 pb-2">
                            <span class="text-gray-600 font-bold text-lg uppercase">Total Belanja</span>
                            <span class="text-2xl font-black text-black">{{ formatRupiah(totalBelanja) }}</span>
                        </div>

                        <div class="flex justify-between items-end border-b-2 border-dashed border-gray-300 pb-2">
                            <span class="text-gray-600 font-bold text-lg uppercase">Hutang Lama</span>
                            <span class="text-2xl font-black"
                                :class="hutangPelanggan > 0 ? 'text-red-600' : 'text-green-600'">
                                {{ formatRupiah(hutangPelanggan) }}
                            </span>
                        </div>

                        <div class="flex justify-between items-end bg-gray-100 p-3 rounded-lg border border-gray-200">
                            <span class="text-gray-900 font-black text-xl uppercase">Total Tagihan</span>
                            <span class="text-3xl font-black text-orange-600">{{ formatRupiah(totalYangHarusDibayar)
                            }}</span>
                        </div>

                        <div class="flex justify-between items-center pt-2 mt-2 border-t-4 border-gray-800">
                            <span class="text-2xl font-black uppercase"
                                :class="kembalian >= 0 ? 'text-green-700' : 'text-red-600'">
                                {{ kembalian >= 0 ? 'KEMBALIAN' : 'SISA HUTANG' }}
                            </span>
                            <span class="text-5xl font-black tracking-tighter"
                                :class="kembalian >= 0 ? 'text-green-700' : 'text-red-600'">
                                {{ formatRupiah(Math.abs(kembalian)) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pb-8">
                <button ref="submitButtonRef" type="submit" @click.prevent="submitTransaksi"
                    :disabled="isSubmitting || totalBelanja === 0 || !selectedPelangganId"
                    class="md:col-span-2 h-16 text-xl font-black text-white rounded-xl shadow-lg transition transform hover:-translate-y-1 flex items-center justify-center gap-3 uppercase tracking-wider border-b-4"
                    :class="isSubmitting || totalBelanja === 0 ? 'bg-gray-400 border-gray-500 cursor-not-allowed' : 'bg-cyan-600 border-cyan-800 hover:bg-cyan-500'">

                    <svg v-if="isSubmitting" class="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>

                    <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>

                    {{ isSubmitting ? 'MEMPROSES...' : 'BAYAR & CETAK STRUK (ENTER)' }}
                </button>

                <button type="button" @click.prevent="saveCurrentTransaction"
                    :disabled="transactionItems.length === 0 || !selectedPelangganId"
                    class="h-16 text-lg font-bold text-gray-800 bg-white border-4 border-gray-800 rounded-xl hover:bg-yellow-50 flex items-center justify-center gap-2 shadow-lg transition uppercase">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5">
                        <path stroke-linecap="round" stroke-linejoin="round"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Simpan Pending
                </button>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup lang="ts">
// (LOGIC SCRIPT TIDAK ADA PERUBAHAN SIGNIFIKAN, TETAP SAMA SEPERTI SEBELUMNYA)
import { ref, onMounted, computed, nextTick, watch } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import { useRouter } from 'vue-router';
const router = useRouter()

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
const uangPembayaranDisplay = ref('');
const totalYangHarusDibayar = computed(() => {
    const hutang = Number(hutangPelanggan.value) || 0;
    const belanja = Number(totalBelanja.value) || 0;
    return hutang + belanja;
});

// REFS BARU UNTUK FOKUS OTOMATIS
const pembayaranInputRef = ref<HTMLInputElement | null>(null);
const submitButtonRef = ref<HTMLButtonElement | null>(null);

const preventNumber = (e: KeyboardEvent) => {
    if (/\d/.test(e.key)) {
        e.preventDefault();
    }
};
const formatInputRupiah = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    const numberValue = parseInt(numbers) || 0;
    uangPembayaran.value = numberValue;
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
    if (uangPembayaran.value > 0) {
        input.value = uangPembayaran.value.toString();
    }
};

const handlePembayaranBlur = (event: Event) => {
    const input = event.target as HTMLInputElement;
    if (uangPembayaran.value > 0) {
        input.value = uangPembayaranDisplay.value;
    }
};

// HANDLER BARU UNTUK ENTER DI INPUT PEMBAYARAN
const handlePembayaranKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        // Pindahkan fokus ke tombol dan klik otomatis
        nextTick(() => {
            submitButtonRef.value?.focus();
            submitButtonRef.value?.click();
        });
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
            hutangPelanggan.value = Number(response.data.data.hutang) || 0;
        }
    } catch (error) {
        console.error('Gagal mengambil hutang pelanggan:', error);
        hutangPelanggan.value = 0;
    }
};

// MODIFIKASI WATCH UNTUK AUTO-FOCUS KE INPUT PEMBAYARAN
watch(selectedPelangganId, async (newValue) => {
    if (newValue) {
        await fetchHutangPelanggan(newValue);
        // Setelah data hutang diambil, pindahkan fokus ke input pembayaran
        nextTick(() => {
            pembayaranInputRef.value?.focus();
        });
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
    uangPembayaranDisplay.value = '';
    transactionItems.value = [];
    quickBarcodeInput.value = '';
    currentPendingId.value = null;
    nextTick(() => {
        barcodeInputRef.value?.focus();
        productSearchInput.value = '';
        searchResults.value = [];
        showSearchResults.value = false;
    });
};
const addOrUpdateItem = (product: any, qty: number = 1) => {
    const existingItem = transactionItems.value.find(item => item.barcode === product.barcode);
    if (existingItem) {
        existingItem.qty += qty;
        transactionItems.value = [
            existingItem,
            ...transactionItems.value.filter(item => item.barcode !== product.barcode)
        ];
    } else {
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
        // GANTI INI: Langsung tambah 1 tanpa prompt
        addOrUpdateItem(product, 1);

        // Notifikasi Toast Kecil
        Swal.fire({
            icon: 'success',
            title: 'Masuk Keranjang',
            text: `1x ${product.nama_produk}`,
            timer: 1000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    } else {
        Swal.fire({
            title: 'Tidak Ditemukan',
            text: `Barcode: ${barcode}`,
            icon: 'error',
            timer: 1500,
            showConfirmButton: false
        });
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
        <div style="
            font-family: Arial, Helvetica, sans-serif; 
            font-size: 11px; 
            color: #000; 
            width: 100%;
            padding-left: 22px; /* PENTING: Jarak aman agar kiri tidak potong */
            padding-right: 5px;
        ">
            <div style="text-align: center; margin-bottom: 10px;">
                <div style="font-size: 14px; margin-bottom: 5px;">${tokoName.toUpperCase()}</div>
                <div style="font-size: 10px; line-height: 1.2;">
                    ${tokoAlamat.replace(/\n/g, '<br>')}
                </div>
            </div>

            <div style="border-bottom: 1px solid #000; padding-bottom: 5px; margin-bottom: 5px;">
                <div style="display: flex; justify-content: space-between;">
                    <span>ID: ${trx.id.substring(0, 8)}</span>
                    <span>${formatDateTime(trx.createdAt)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 2px;">
                    <span>Kasir: ${kasirFullName}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Plg: ${pelangganName}</span>
                </div>
            </div>

            <div style="display: flex; border-bottom: 1px solid #000; padding-bottom: 2px; margin-bottom: 5px; font-size: 10px;">
                <span style="flex: 1; text-align: left;">ITEM</span>
                <span style="width: 25px; text-align: center;">Qty</span>
                <span style="width: 55px; text-align: right;">Hrg</span>
                <span style="width: 60px; text-align: right;">Total</span>
            </div>

            <div style="margin-bottom: 5px; border-bottom: 1px solid #000; padding-bottom: 5px;">
                ${items.map(item => `
                    <div style="margin-bottom: 4px;">
                        <div style="margin-bottom: 1px;">
                            ${item.nama_produk}
                        </div>
                        <div style="display: flex; font-size: 10px;">
                            <span style="flex: 1;"></span> <span style="width: 25px; text-align: center;">${item.qty}</span>
                            <span style="width: 55px; text-align: right;">${formatCurrency(item.harga_jual_ritel)}</span>
                            <span style="width: 60px; text-align: right;">${formatCurrency(item.qty * item.harga_jual_ritel)}</span>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 3px; font-size: 12px;">
                    <span>TOTAL:</span>
                    <span>Rp ${formatCurrency(total_harga)}</span>
                </div>

                <div style="display: flex; justify-content: space-between; margin-bottom: 1px;">
                    <span>Tunai:</span>
                    <span>Rp ${formatCurrency(total_bayar)}</span>
                </div>
                
                ${kembalian > 0 ? `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 1px;">
                        <span>Kembali:</span>
                        <span>Rp ${formatCurrency(kembalian)}</span>
                    </div>
                ` : ''}

                ${sisa_hutang > 0 ? `
                    <div style="display: flex; justify-content: space-between; margin-top: 5px; font-size: 11px;">
                        <span>SISA HUTANG:</span>
                        <span>Rp ${formatCurrency(sisa_hutang)}</span>
                    </div>
                ` : ''}
            </div>

            <div style="margin-top: 15px; text-align: center; font-size: 10px;">
                <div>Terima Kasih</div>
                <div style="margin-top: 2px;">Barang yang dibeli tidak dapat ditukar/dikembalikan</div>
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

    const printWindow = window.open("", "", "width=400,height=600");
    if (!printWindow) {
        Swal.fire('Error', 'Gagal membuka jendela cetak. Periksa setelan pop-up browser Anda.', 'error');
        return;
    }

    printWindow.document.write(`
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Struk #${trx.id.substring(0, 8)}</title>
                <style>
                    /* Reset CSS */
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    
                    body { 
                        font-family: Arial, Helvetica, sans-serif;
                        background: #fff;
                        color: #000;
                    }

                    /* PENTING: CSS Print */
                    @media print {
                        @page {
                            margin: 0; /* Hapus margin browser */
                            size: auto;
                        }
                        
                        body {
                            /* Padding CSS mengambil alih margin fisik */
                            width: 100%;
                        }
                    }
                </style>
            </head>
            <body onload="window.print(); setTimeout(() => window.close(), 1000);">
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

        // CARI BAGIAN INI DALAM FUNGSI submitTransaksi (sekitar baris 700-800)

        if (response.data.success) {
            const dataTransaksi = response.data.data.transaksi;
            const sisaHutangAkhir = dataTransaksi.sisa_hutang || 0;
            const kembalianAkhir = dataTransaksi.total_kembalian || 0;
            const namaPelanggan = response.data.data.pelanggan.nama_pelanggan;

            printStruk(
                dataTransaksi,
                namaPelanggan,
                itemsForPrint,
                kasirData.value!.full_name,
                kasirData.value!.toko.nama_toko,
                kasirData.value!.toko.alamat,
            );

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
                router.push("/penjualan-grosir")
            } else {
                icon = 'error';
                title = 'Error Logika Transaksi!';
                message = `<p class="text-lg font-bold mt-2">Terdeteksi error internal. Hubungi Admin.</p>`;
            }

            // ===== GANTI BAGIAN INI MULAI DARI SWAL.FIRE =====
            Swal.fire({
                icon: icon,
                title: title,
                html: message,
                confirmButtonText: 'OK',
                confirmButtonColor: '#0891b2',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    const confirmBtn = document.querySelector('.swal2-confirm') as HTMLButtonElement;
                    if (confirmBtn) {
                        confirmBtn.focus();
                    }
                }
            }).then((result) => {
                if (currentPendingId.value !== null) {
                    removePendingTransaction(currentPendingId.value, false);
                }

                fetchHutangPelanggan(selectedPelangganId.value);
                resetForm();
            });

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
            <p class="mb-3 text-gray-700 font-medium">${product.nama_produk}</p>
            <input id="qty-input" type="number" min="1" value="1" 
                class="swal2-input w-full text-center text-lg font-bold text-gray-800" 
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
            if (input) {
                input.focus();
                input.select();

                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        Swal.clickConfirm();
                    }
                });
            }
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

onMounted(async () => {
    await fetchKasirData();
    await fetchPelanggan();
    loadPendingTransactions();
    barcodeInputRef.value?.focus();
});
</script>

<style scoped>
/* Scoped styles have been minimized as we now rely heavily on Tailwind classes 
   for the visual overhaul. Custom overrides are kept for specificity. */
</style>