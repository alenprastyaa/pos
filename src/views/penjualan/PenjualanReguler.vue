<template>
    <AdminLayout>
        <div class="py-3 space-y-3">
            <div class="border-b border-gray-200 dark:border-gray-800 pb-4">
                <p class="text-2xl sm:text-3xl font-bold dark:text-gray-50 tracking-tight uppercase text-blue-500">
                    Transaksi Penjualan Eceran
                </p>
            </div>

            <div class="flex flex-col space-y-3 md:flex-row md:space-x-4 md:space-y-0 items-end">
                <div class="flex-1 w-full relative">
                    <div class="flex space-x-2">
                        <input ref="barcodeInputRef" v-model="quickBarcodeInput" type="text"
                            placeholder="Scan/ketik barcode, tekan Enter" @keyup.enter="handleBarcodeScan"
                            :disabled="role_name !== 'admin' || isCameraScannerActive" class="flex-1 h-12 px-4 rounded-lg border-2 border-blue-400 dark:border-blue-600
                            bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-white
                            placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2
                            focus:ring-blue-500 disabled:bg-gray-200 disabled:text-gray-500
                            dark:disabled:bg-gray-700 dark:disabled:text-gray-400" />

                        <button type="button"
                            @click="isCameraScannerActive ? stopCameraScanner() : startCameraScanner()"
                            :disabled="role_name !== 'admin'" class="h-12 w-12 flex-shrink-0 rounded-lg transition"
                            :class="[isCameraScannerActive
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-green-500 hover:bg-green-600 text-white']">
                            <svg v-if="!isCameraScannerActive" class="w-6 h-6 mx-auto" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.218A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.218A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z">
                                </path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <svg v-else class="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>

                <div class="flex-1 w-full relative">
                    <input v-model="productSearchInput" type="text" placeholder="Cari produk berdasarkan nama..."
                        @input="searchProducts(productSearchInput)"
                        :disabled="role_name !== 'admin' || isCameraScannerActive" class="w-full h-12 px-4 rounded-lg border-2 border-blue-400 dark:border-blue-600
                        bg-white dark:bg-gray-800 text-base text-gray-900 dark:text-white
                        placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2
                        focus:ring-blue-500 disabled:bg-gray-200 disabled:text-gray-500
                        dark:disabled:bg-gray-700 dark:disabled:text-gray-400" />
                    <div v-if="showSearchResults && searchResults.length > 0 && !isCameraScannerActive"
                        class="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-64 overflow-y-auto">
                        <div v-for="product in searchResults" :key="product.barcode"
                            @click="selectProductFromSearch(product)"
                            class="p-3 cursor-pointer hover:bg-green-50 dark:hover:bg-green-900/30 border-b dark:border-gray-700 last:border-b-0">
                            <div class="font-medium text-gray-900 dark:text-white truncate">{{ product.nama_produk }}
                            </div>
                            <div class="text-xs text-gray-500 dark:text-gray-400">{{ product.barcode }} - {{
                                formatRupiah(product.harga_jual_biasa) }}</div>
                        </div>
                    </div>
                </div>

                <select v-model="selectedPelangganId" required
                    class="flex-1 w-full md:w-auto h-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                    <option value="" disabled>Pilih Pelanggan</option>
                    <option v-if="loadingPelanggan" disabled>Memuat...</option>
                    <option v-for="pelanggan in pelangganList" :key="pelanggan.id" :value="pelanggan.id">
                        {{ pelanggan.nama_pelanggan }}
                    </option>
                </select>
            </div>

            <div v-if="isCameraScannerActive"
                class="bg-gray-100 dark:bg-gray-900 p-3 rounded-lg border border-blue-400 dark:border-blue-600 space-y-3">

                <div class="flex items-center space-x-2">
                    <label for="camera-select"
                        class="text-sm font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">
                        Pilih Kamera:
                    </label>
                    <select id="camera-select" v-model="selectedCameraId" @change="restartCameraScanner"
                        class="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 text-gray-900 dark:text-white focus:ring-blue-500">
                        <option v-if="availableCameras.length === 0" disabled value="">Memuat Kamera...</option>
                        <option v-for="camera in availableCameras" :key="camera.id" :value="camera.id">
                            {{ camera.label || `Kamera #${camera.id.substring(0, 4)}` }}
                        </option>
                    </select>
                </div>

                <p class="text-sm font-semibold mb-2 text-center"
                    :class="scannerError ? 'text-red-500' : 'text-blue-600 dark:text-blue-400'">
                    {{ scannerError || scannerMessage }}
                </p>

                <div id="scanner-container" class="w-full md:w-96 md:mx-auto"
                    style="height: 250px; overflow: hidden; position: relative;">
                </div>
            </div>

            <div v-if="selectedPelangganId"
                class="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 rounded-lg">
                <div class="flex justify-between items-center">
                    <span class="font-medium text-blue-700 dark:text-blue-300">Hutang Pelanggan</span>
                    <span class="font-bold text-lg"
                        :class="hutangPelanggan > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
                        {{ formatRupiah(hutangPelanggan) }}
                    </span>
                </div>
            </div>

            <div v-if="pendingTransactions.length > 0" class="space-y-2 pt-2">
                <p class="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z"
                            clip-rule="evenodd"></path>
                    </svg>
                    Transaksi Pending ({{ pendingTransactions.length }})
                </p>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    <div v-for="t in pendingTransactions" :key="t.id"
                        class="p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg shadow-md flex flex-col justify-between"
                        :class="{ 'ring-2 ring-blue-500': t.id === currentPendingId }">
                        <div>
                            <p class="text-sm text-yellow-800 dark:text-yellow-200 truncate">{{ t.nama_pelanggan }} - {{
                                formatRupiah(t.total) }}</p>
                            <p class="text-xs text-gray-600 dark:text-gray-400">{{ t.tanggal_simpan }}</p>
                        </div>
                        <div class="flex justify-end gap-1 mt-2">
                            <button @click="loadTransaction(t)"
                                class="text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded">
                                Muat
                            </button>
                            <button @click="removePendingTransaction(t.id)"
                                class="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <hr class="border-gray-200 dark:border-gray-700">

            <div
                class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-x-auto">

                <div class="md:hidden divide-y divide-gray-100 dark:divide-gray-700">
                    <div v-if="transactionItems.length === 0"
                        class="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                        Belum ada produk. Scan barcode untuk menambah produk.
                    </div>
                    <div v-for="(item, index) in transactionItems" :key="item.barcode"
                        class="p-3 dark:hover:bg-gray-700/50 space-y-2">
                        <div class="flex justify-between items-center">
                            <div class="font-semibold text-gray-900 dark:text-white truncate">{{ index + 1 }}. {{
                                item.nama_produk }}</div>
                            <button type="button" @click="removeItem(item.barcode)"
                                class="text-red-500 hover:text-red-700 dark:hover:text-red-400 flex-shrink-0 p-1 rounded">
                                <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                        <div class="grid grid-cols-3 gap-2 text-sm">
                            <div class="col-span-1 text-gray-500 dark:text-gray-400">Barcode</div>
                            <div class="col-span-2 text-gray-900 dark:text-white">{{ item.barcode }}</div>

                            <div class="col-span-1 text-gray-500 dark:text-gray-400">Harga Satuan</div>
                            <div class="col-span-2 text-gray-900 dark:text-white">{{ formatRupiah(item.harga_jual_biasa)
                            }}</div>
                        </div>
                        <div
                            class="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700/50">
                            <div class="flex items-center space-x-2">
                                <span class="text-gray-700 dark:text-gray-300">Qty:</span>
                                <input v-model.number="item.qty" type="number" min="1"
                                    @change="updateItem(item.barcode, item.qty)"
                                    class="w-16 text-center text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700" />
                            </div>
                            <div class="font-bold text-md text-blue-600 dark:text-blue-400">{{
                                formatRupiah(item.qty * item.harga_jual_biasa) }}</div>
                        </div>
                    </div>
                </div>

                <table class="min-w-full hidden md:table">
                    <thead class="bg-gray-50 dark:bg-gray-700/30 text-gray-600 dark:text-gray-300 text-sm">
                        <tr>
                            <th class="px-4 py-2 text-left">No</th>
                            <th class="px-4 py-2 text-left">Produk</th>
                            <th class="px-4 py-2 text-center">Qty</th>
                            <th class="px-4 py-2 text-right">Harga</th>
                            <th class="px-4 py-2 text-right">Subtotal</th>
                            <th class="px-4 py-2 text-center"></th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100 dark:divide-gray-700">
                        <tr v-if="transactionItems.length === 0">
                            <td colspan="6" class="px-4 py-8 text-center text-gray-400 dark:text-gray-500">
                                Belum ada produk. Scan barcode untuk menambah produk.
                            </td>
                        </tr>
                        <tr v-for="(item, index) in transactionItems" :key="item.barcode"
                            class="dark:hover:bg-gray-700/50">
                            <td class="px-4 py-2 text-sm text-gray-900 dark:text-white">{{ index + 1 }}</td>
                            <td class="px-4 py-2">
                                <div class="font-medium text-gray-900 dark:text-white">{{ item.nama_produk }}</div>
                                <div class="text-xs text-gray-500 dark:text-gray-400">{{ item.barcode }}</div>
                            </td>
                            <td class="px-4 py-2 text-center">
                                <input v-model.number="item.qty" type="number" min="1"
                                    @change="updateItem(item.barcode, item.qty)"
                                    class="w-16 text-center text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-700" />
                            </td>
                            <td class="px-4 py-2 text-right text-sm text-gray-700 dark:text-gray-200">{{
                                formatRupiah(item.harga_jual_biasa) }}</td>
                            <td class="px-4 py-2 text-right font-semibold text-gray-900 dark:text-white">{{
                                formatRupiah(item.qty * item.harga_jual_biasa) }}</td>
                            <td class="px-4 py-2 text-center">
                                <button type="button" @click="removeItem(item.barcode)"
                                    class="text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1 rounded">
                                    <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div
                    class="px-4 py-3 flex justify-between items-center bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-600 font-semibold text-lg text-gray-900 dark:text-white">
                    <span>Total Belanja</span>
                    <span class="text-blue-600 dark:text-blue-400">{{ formatRupiah(totalBelanja) }}</span>
                </div>
            </div>

            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Jumlah Bayar <span
                    class="text-red-500 dark:text-red-400">*</span></label>
            <input v-model.number="uangPembayaran" type="number" min="0" required placeholder="Masukkan jumlah uang"
                class="w-full h-12 px-4 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500" />

            <div v-if="selectedPelangganId && uangPembayaran > 0"
                class="space-y-2 p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div class="flex justify-between text-sm">
                    <span class="text-gray-700 dark:text-gray-300">Hutang Lama:</span>
                    <span class="font-medium"
                        :class="hutangPelanggan > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'">
                        {{ formatRupiah(hutangPelanggan) }}
                    </span>
                </div>
                <div class="flex justify-between text-sm border-t border-gray-300 dark:border-gray-600 pt-2">
                    <span class="text-gray-700 dark:text-gray-300">Total Belanja:</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ formatRupiah(totalBelanja) }}</span>
                </div>
                <div class="flex justify-between text-sm">
                    <span class="text-gray-700 dark:text-gray-300">Uang Bayar:</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ formatRupiah(uangPembayaran) }}</span>
                </div>
                <div class="flex justify-between text-sm border-t border-gray-300 dark:border-gray-600 pt-2 font-semibold"
                    :class="kembalian >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'">
                    <span>{{ kembalian >= 0 ? 'Kembalian' : 'Kurang Bayar' }}:</span>
                    <span>{{ formatRupiah(Math.abs(kembalian)) }}</span>
                </div>
            </div>

            <div v-else-if="uangPembayaran > 0" class="flex justify-between p-3 rounded-lg"
                :class="kembalian >= 0 ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'">
                <span class="font-medium"
                    :class="kembalian >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'">
                    {{ kembalian >= 0 ? 'Kembalian' : 'Kurang Bayar' }}
                </span>
                <span class="font-bold"
                    :class="kembalian >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'">
                    {{ formatRupiah(Math.abs(kembalian)) }}
                </span>
            </div>

            <div class="flex flex-col space-y-3 pt-2 sm:flex-row sm:space-x-3 sm:space-y-0">

                <button type="button" @click.prevent="saveCurrentTransaction"
                    :disabled="transactionItems.length === 0 || !selectedPelangganId || isCameraScannerActive" class="w-full sm:flex-[0.8] h-11 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 
           text-white font-medium rounded-lg flex items-center justify-center gap-2 transition">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                        </path>
                    </svg>
                    Simpan (Pending)
                </button>

                <button type="submit" @click.prevent="submitTransaksi"
                    :disabled="isSubmitting || totalBelanja === 0 || !selectedPelangganId || uangPembayaran < totalBelanja || isCameraScannerActive"
                    class="w-full sm:flex-[1.3] h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-600
           text-white text-base font-semibold rounded-xl flex items-center justify-center gap-2
           shadow-lg shadow-blue-300/40 dark:shadow-blue-900/40 transition transform hover:scale-[1.02]">

                    <svg v-if="isSubmitting" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 
                    7.938l3-2.647z"></path>
                    </svg>

                    {{ isSubmitting ? 'Memproses...' : 'Proses Transaksi' }}
                </button>
            </div>


        </div>
    </AdminLayout>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted, computed, nextTick, watch, onUnmounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import { Html5Qrcode } from "html5-qrcode"; // <-- PERBAIKAN: Hapus Html5QrcodeSupportedDevices

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const PENDING_TRANSACTIONS_KEY = 'pendingTransactions';
const hutangPelanggan = ref(0);
const role_name = localStorage.getItem("role_name")

// --- State Baru untuk html5-qrcode dan Kamera ---
const html5QrCode = ref<Html5Qrcode | null>(null);
const isCameraScannerActive = ref(false);
const scannerError = ref<string | null>(null);
const scannerMessage = ref('Siap memindai...');

const lastScannedBarcode = ref<string | null>(null);
const scanTimeout = ref<number | null>(null); // Untuk mencegah double scan

// State baru untuk pemilihan kamera
interface CameraDevice {
    id: string;
    label: string;
}
const availableCameras = ref<CameraDevice[]>([]);
const selectedCameraId = ref('');


// --- Tambahkan Objek Audio Untuk Suara Sukses Scan ---
// PASTIKAN FILE success_beep.mp3 ADA DI FOLDER public/audio/
const successAudio = new Audio('/barcode.mp3');

// --- Interface Data (Tidak Berubah) ---
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

// --- State Management (Tidak Berubah) ---
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

const tokoList = ref<Toko[]>([]);
const selectedTokoId = ref('');
const loadingToko = ref(false);

// --- Computed & Helper Functions (Tidak Berubah) ---
const getAuthHeader = () => {
    const token = localStorage.getItem('authToken');
    return { Authorization: `Bearer ${token}` };
};

const isSuperAdmin = computed(() => kasirData.value?.role_name === 'superadmin');

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

// --- Data Fetching (Tidak Berubah) ---

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

// --- Cart Management (Tidak Berubah) ---

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

const addOrUpdateItem = (product: any) => {
    const existingItem = transactionItems.value.find(item => item.barcode === product.barcode);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        transactionItems.value.push({
            barcode: product.barcode,
            qty: 1,
            nama_produk: product.nama_produk,
            harga_jual_biasa: parseFloat(product.harga_jual_biasa),
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

const selectProductFromSearch = (product: CartItem) => {
    addOrUpdateItem(product);
    productSearchInput.value = '';
    searchResults.value = [];
    showSearchResults.value = false;
};

// --- Barcode Scanning Logic (MODIFIKASI UTAMA DI SINI) ---

const handleBarcodeScan = async () => {
    // Dipanggil oleh: 1. Tombol Enter/Keyboard, 2. Kamera Scan

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

    // PENTING: Kosongkan input setelah diproses
    quickBarcodeInput.value = '';

    nextTick(() => {
        // Hanya fokus pada input manual jika scanner kamera TIDAK aktif
        if (!isCameraScannerActive.value) {
            barcodeInputRef.value?.focus();
        }
        // Jika scanner aktif, fokus tetap di kamera
    });
};

const listCameras = async () => {
    try {
        // Dapatkan daftar kamera
        const cameras = await Html5Qrcode.getCameras();
        availableCameras.value = cameras.map(cam => ({ id: cam.id, label: cam.label }));

        if (cameras.length > 0) {
            // Coba temukan kamera belakang (environment) secara default
            const backCamera = cameras.find(cam =>
                cam.label.toLowerCase().includes('back') ||
                cam.label.toLowerCase().includes('environment') ||
                cam.label.toLowerCase().includes('belakang')
            );

            // Set default: Kamera belakang jika ada, jika tidak, kamera pertama
            selectedCameraId.value = backCamera ? backCamera.id : cameras[0].id;
        } else {
            scannerError.value = "Tidak ada kamera yang terdeteksi.";
        }
    } catch (error) {
        scannerError.value = "Gagal mengakses daftar kamera. Periksa izin.";
        console.error('Failed to list cameras:', error);
    }
}

const startCameraScanner = async (cameraId: string | null = null) => {
    quickBarcodeInput.value = '';

    // Hentikan scanner yang sedang berjalan
    if (html5QrCode.value && html5QrCode.value.isScanning) {
        await stopCameraScanner();
    }

    isCameraScannerActive.value = true;
    scannerError.value = null;
    scannerMessage.value = 'Memuat kamera...';

    await nextTick();

    const scannerId = "scanner-container";

    if (!html5QrCode.value) {
        html5QrCode.value = new Html5Qrcode(scannerId);
    }

    // Muat daftar kamera dan set default jika belum ada
    if (availableCameras.value.length === 0) {
        await listCameras();
    }

    // Tentukan ID kamera yang akan digunakan
    const finalCameraId = cameraId || selectedCameraId.value;

    if (!finalCameraId && availableCameras.value.length > 0) {
        // Jika belum ada ID terpilih, gunakan ID default (sudah diset di listCameras)
        selectedCameraId.value = availableCameras.value[0].id;
    } else if (!finalCameraId) {
        scannerError.value = "Tidak ada kamera yang tersedia untuk memulai pemindaian.";
        isCameraScannerActive.value = false;
        return;
    }


    const config = {
        fps: 10,
        // Ukuran qrbox disesuaikan untuk area fokus barcode
        qrbox: { width: 250, height: 150 },
        aspectRatio: 1.777,
        disableFlip: false // Penting untuk kamera depan/belakang
    };

    try {
        await html5QrCode.value.start(
            finalCameraId || selectedCameraId.value,
            config,
            (decodedText, decodedResult) => {
                if (decodedText) {
                    handleSuccessfulScan(decodedText);
                }
            },
            (errorMessage) => {
                // Ignore continuous scan failure messages
            }
        );

        scannerMessage.value = 'Kamera aktif. Arahkan barcode ke area pemindaian di tengah.';
    } catch (error: any) {
        console.error('Camera Access Error:', error);
        scannerError.value = `Error akses kamera: ${error.message}. Pilih kamera lain jika ada.`;
        isCameraScannerActive.value = false;
    }
};

const restartCameraScanner = async () => {
    if (selectedCameraId.value) {
        await startCameraScanner(selectedCameraId.value);
    }
}


const handleSuccessfulScan = (barcode: string) => {
    // PENTING: Logika Throttling agar kamera tetap aktif tapi tidak double scan

    // 1. Cek duplikasi: Jika barcode sama dan baru dipindai dalam 2 detik terakhir, abaikan.
    if (barcode === lastScannedBarcode.value) {
        return;
    }

    // --- LOGIKA TAMBAHAN: PUTAR SUARA ---
    try {
        // Memastikan suara diputar sebelum memproses data
        successAudio.play();
    } catch (e) {
        console.warn('Gagal memutar audio, mungkin karena batasan browser (autoplay).', e);
    }
    // ------------------------------------

    // Setel timeout untuk mencegah duplikasi (throttle)
    if (scanTimeout.value !== null) {
        clearTimeout(scanTimeout.value);
    }
    lastScannedBarcode.value = barcode;

    // Reset status throttling setelah 2 detik
    scanTimeout.value = window.setTimeout(() => {
        lastScannedBarcode.value = null;
        scanTimeout.value = null;
    }, 2000);

    // 2. Lakukan simulasi "auto enter"
    quickBarcodeInput.value = barcode;
    handleBarcodeScan();

    // Kamera tetap menyala
};


const stopCameraScanner = async () => {
    if (html5QrCode.value && isCameraScannerActive.value) {
        try {
            if (html5QrCode.value.isScanning) {
                await html5QrCode.value.stop();
            }
        } catch (error) {
            console.error("Html5Qrcode stop error:", error);
        }

        isCameraScannerActive.value = false;
        scannerMessage.value = 'Siap memindai...';
        scannerError.value = null;

        // Bersihkan timeout throttling saat menutup scanner
        if (scanTimeout.value !== null) {
            clearTimeout(scanTimeout.value);
            scanTimeout.value = null;
        }
        lastScannedBarcode.value = null;

        nextTick(() => {
            barcodeInputRef.value?.focus();
        });
    }
};

// --- Pending Transaction Logic (Tidak Berubah) ---
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
};

const removePendingTransaction = (id: number, showSuccess: boolean = true) => {
    pendingTransactions.value = pendingTransactions.value.filter(t => t.id !== id);
    saveToLocalStorage();
    if (showSuccess) {
        Swal.fire('Berhasil', 'Transaksi pending telah dihapus.', 'success');
    }
};

// --- Print Struk Logic (Tidak Berubah) ---
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
                        <span style="width: 50px; text-align: right;">${formatCurrency(item.harga_jual_biasa)}</span>
                        <span style="width: 50px; text-align: right;">${formatCurrency(item.qty * item.harga_jual_biasa)}</span>
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

// --- Submit Transaksi (Tidak Berubah) ---
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

    const confirmResult = await Swal.fire({
        icon: 'question',
        title: 'Konfirmasi Transaksi',
        html: `<div class="text-left">
                   <p class="mb-3"><strong>Total Belanja:</strong> ${formatRupiah(totalBelanja.value)}</p>
                   <p class="mb-3"><strong>Uang Bayar:</strong> ${formatRupiah(uangPembayaran.value)}</p>
                   <p class="mb-4"><strong>Kembalian/Hutang:</strong> <span class="${kembalian.value < 0 ? 'text-red-600 font-bold' : 'text-green-600 font-bold'}">${formatRupiah(Math.abs(kembalian.value))}</span></p>
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
        const response = await axios.post<any, { data: { success: boolean, data: TransaksiResponseData, message?: string } }>(`${API_BASE_URL}/transaksi/create/reguler`, payload, {
            headers: getAuthHeader(),
        });

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


// --- Lifecycle Hooks (Tidak Berubah) ---
onMounted(async () => {
    await fetchKasirData();
    await fetchPelanggan();
    loadPendingTransactions();
    // Inisiasi daftar kamera saat dimuat, agar dropdown siap
    listCameras();
    barcodeInputRef.value?.focus();
});

// Pastikan menghentikan scanner saat komponen dihancurkan
onUnmounted(() => {
    stopCameraScanner();
});
</script>