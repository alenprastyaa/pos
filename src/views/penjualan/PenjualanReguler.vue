<template>
    <AdminLayout>
        <div class="page-container min-h-screen">

            <!-- Top Input Panel -->
            <div class="top-panel px-5 pt-4 pb-3">
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <!-- Barcode -->
                    <div class="input-card p-4 rounded-2xl">
                        <label class="input-label flex items-center gap-2 mb-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                            </svg>
                            Scan Barcode
                        </label>
                        <input ref="barcodeInputRef" v-model="quickBarcodeInput" type="text"
                            @keyup.enter="handleBarcodeScan" :disabled="role_name !== 'admin'"
                            placeholder="Scan barcode di sini..."
                            class="pos-input w-full h-11 px-4 rounded-xl" />
                    </div>

                    <!-- Cari Produk -->
                    <div class="input-card p-4 rounded-2xl relative">
                        <label class="input-label flex items-center gap-2 mb-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Cari Produk Manual
                        </label>
                        <input v-model="productSearchInput" type="text"
                            placeholder="Ketik nama produk..." @input="searchProducts(productSearchInput)"
                            @keydown="handleSearchKeydown" :disabled="role_name !== 'admin'"
                            class="pos-input w-full h-11 px-4 rounded-xl" />

                        <div v-if="showSearchResults && searchResults.length > 0"
                            ref="searchDropdownRef"
                            class="search-dropdown absolute left-4 right-4 mt-1 rounded-xl shadow-2xl z-20 max-h-72 overflow-y-auto">
                            <div v-for="(product, index) in searchResults" :key="product.barcode"
                                @click="selectProductFromSearch(product)"
                                :class="index === selectedSearchIndex ? 'search-item-active' : 'search-item'"
                                class="px-4 py-2.5 cursor-pointer transition-all border-b border-gray-50 last:border-0">
                                <div class="flex justify-between items-center">
                                    <span class="font-semibold text-sm text-gray-800">{{ product.nama_produk }}</span>
                                    <span class="price-tag text-xs font-bold px-2 py-1 rounded-lg ml-2 whitespace-nowrap">
                                        {{ formatRupiah(product.harga_jual_reguler) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Pilih Pelanggan -->
                    <div class="input-card p-4 rounded-2xl">
                        <label class="input-label flex items-center gap-2 mb-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Pilih Pelanggan
                        </label>
                        <select ref="pelangganSelectRef" v-model="selectedPelangganId" required
                            @keydown.enter.prevent="focusToPayButton"
                            class="pos-input w-full h-11 rounded-xl px-4">
                            <option value="" disabled>Pilih Pelanggan...</option>
                            <option v-if="loadingPelanggan" disabled>Memuat...</option>
                            <option v-for="pelanggan in pelangganList" :key="pelanggan.id" :value="pelanggan.id">
                                {{ pelanggan.nama_pelanggan }}
                            </option>
                        </select>

                        <div v-if="selectedPelangganId" class="hutang-badge mt-3 px-4 py-2 rounded-xl flex justify-between items-center">
                            <span class="text-sm font-semibold text-gray-700 dark:text-gray-300">Hutang</span>
                            <span class="text-base font-extrabold"
                                :class="hutangPelanggan > 0 ? 'hutang-danger' : 'hutang-safe'">
                                {{ formatRupiah(hutangPelanggan) }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Pending Transactions -->
            <div v-if="pendingTransactions.length > 0" class="px-5 py-2">
                <div class="pending-section rounded-2xl p-4">
                    <div class="flex items-center gap-2 mb-3">
                        <div class="pending-dot w-2 h-2 rounded-full animate-pulse"></div>
                        <p class="text-sm font-bold text-amber-700 dark:text-amber-400">
                            Transaksi Pending ({{ pendingTransactions.length }})
                        </p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div v-for="t in pendingTransactions" :key="t.id"
                            class="pending-card rounded-xl p-3 cursor-pointer transition-all"
                            :class="t.id === currentPendingId ? 'pending-card-active' : 'pending-card-inactive'">
                            <p class="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">{{ t.nama_pelanggan }}</p>
                            <p class="text-sm font-extrabold text-amber-600 dark:text-amber-400 mt-0.5">{{ formatRupiah(t.total) }}</p>
                            <p class="text-xs text-gray-600 dark:text-gray-400 mt-0.5 mb-2">{{ t.tanggal_simpan }}</p>
                            <div class="flex gap-2">
                                <button @click="loadTransaction(t)"
                                    class="btn-load flex-1 text-xs py-1.5 rounded-lg font-semibold transition-all">
                                    Muat
                                </button>
                                <button @click="removePendingTransaction(t.id)"
                                    class="btn-del flex-1 text-xs py-1.5 rounded-lg font-semibold transition-all">
                                    Hapus
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Total Bar -->
            <div class="total-bar mx-5 mt-2 px-6 py-4 rounded-t-2xl flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <div class="total-icon w-10 h-10 rounded-xl flex items-center justify-center">
                        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-xs font-bold text-cyan-100 uppercase tracking-wider">Total Belanja</p>
                        <p class="text-xs text-cyan-200">{{ transactionItems.length }} item</p>
                    </div>
                </div>
                <span class="total-amount text-4xl font-black">{{ formatRupiah(totalBelanja) }}</span>
            </div>

            <!-- Cart Table -->
            <div class="cart-table mx-5 mb-28 rounded-b-2xl overflow-hidden shadow-sm">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead>
                            <tr class="table-head">
                                <th class="px-4 py-3 text-left text-white text-xs font-semibold uppercase tracking-wider w-10">No</th>
                                <th class="px-4 py-3 text-left text-white text-xs font-semibold uppercase tracking-wider">Produk</th>
                                <th class="px-4 py-3 text-center text-white text-xs font-semibold uppercase tracking-wider w-28">Qty</th>
                                <th class="px-4 py-3 text-right text-white text-xs font-semibold uppercase tracking-wider">Harga</th>
                                <th class="px-4 py-3 text-right text-white text-xs font-semibold uppercase tracking-wider">Subtotal</th>
                                <th class="px-4 py-3 text-center text-white text-xs font-semibold uppercase tracking-wider w-16">Hapus</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="transactionItems.length === 0">
                                <td colspan="6" class="px-6 py-16 text-center">
                                    <div class="flex flex-col items-center justify-center space-y-3">
                                        <div class="empty-cart-icon w-20 h-20 rounded-full flex items-center justify-center">
                                            <svg class="w-10 h-10 opacity-40" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <p class="text-gray-600 dark:text-gray-400 font-semibold">Keranjang masih kosong</p>
                                        <p class="text-gray-500 dark:text-gray-500 text-sm">Scan barcode atau cari produk untuk memulai</p>
                                    </div>
                                </td>
                            </tr>
                            <tr v-for="(item, index) in transactionItems" :key="item.barcode"
                                class="cart-row transition-colors">
                                <td class="px-4 py-3 text-sm font-bold text-gray-500 dark:text-gray-500">{{ index + 1 }}</td>
                                <td class="px-4 py-3">
                                    <div class="text-sm font-bold text-gray-900 dark:text-gray-100">{{ item.nama_produk }}</div>
                                    <div class="text-xs text-gray-500 dark:text-gray-500 font-mono">{{ item.barcode }}</div>
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <input v-model.number="item.qty" type="number" min="1"
                                        @change="updateItem(item.barcode, item.qty)"
                                        class="qty-input w-20 text-center rounded-lg py-1.5 text-sm font-bold" />
                                </td>
                                <td class="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    {{ formatRupiah(item.harga_jual_reguler) }}
                                </td>
                                <td class="px-4 py-3 text-right text-sm font-extrabold subtotal-text">
                                    {{ formatRupiah(item.qty * item.harga_jual_reguler) }}
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <button type="button" @click="confirmRemoveItem(item)"
                                        class="del-btn p-2 rounded-xl transition-all">
                                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Bottom Action Bar -->
            <div class="action-bar fixed bottom-0 left-0 right-0 z-30">
                <div class="max-w-7xl mx-auto px-5 py-3">
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <button type="button" ref="bayarBtnRef" @click="openPaymentModal"
                            :disabled="transactionItems.length === 0 || !selectedPelangganId"
                            class="md:col-span-2 h-14 btn-bayar rounded-2xl text-lg font-extrabold flex items-center justify-center gap-3 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>BAYAR SEKARANG</span>
                        </button>

                        <button type="button" @click.prevent="saveCurrentTransaction"
                            :disabled="transactionItems.length === 0 || !selectedPelangganId"
                            class="h-14 btn-pending-action rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                            </svg>
                            <span>Simpan Pending</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Payment Modal -->
        <div v-if="showPaymentModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div class="modal-backdrop absolute inset-0 transition-opacity" @click="closePaymentModal"></div>

            <div class="modal-card w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden">
                <!-- Modal Header -->
                <div class="modal-header px-6 py-5 flex justify-between items-center">
                    <div class="flex items-center gap-3">
                        <div class="modal-icon w-10 h-10 rounded-xl flex items-center justify-center">
                            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 class="text-lg font-extrabold text-gray-800 dark:text-gray-100">Proses Pembayaran</h3>
                            <p class="text-xs text-gray-600 dark:text-gray-400">Masukkan nominal pembayaran</p>
                        </div>
                    </div>
                    <button @click="closePaymentModal" class="close-btn p-2 rounded-xl transition-all">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="p-6 space-y-5">
                    <!-- Input Pembayaran -->
                    <div class="payment-input-wrap rounded-2xl p-4">
                        <label class="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2 block">
                            Uang Diterima
                        </label>
                        <div class="relative">
                            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-cyan-500">Rp</span>
                            <input ref="pembayaranInputRef" :value="uangPembayaranDisplay || uangPembayaran || ''"
                                @input="handlePembayaranInput" @focus="handlePembayaranFocus"
                                @blur="handlePembayaranBlur" @keydown.enter="handlePembayaranKeydown" type="text"
                                required placeholder="0"
                                class="payment-input w-full h-16 pl-14 pr-4 rounded-xl text-4xl font-black text-gray-900"
                                autofocus />
                        </div>
                    </div>

                    <!-- Rincian -->
                    <div class="summary-box rounded-2xl p-4 space-y-2.5">
                        <div class="flex justify-between text-sm text-gray-700 dark:text-gray-400">
                            <span>Total Belanja</span>
                            <span class="font-bold text-gray-900 dark:text-gray-100">{{ formatRupiah(totalBelanja) }}</span>
                        </div>
                        <div class="flex justify-between text-sm text-gray-700 dark:text-gray-400">
                            <span>Hutang Lama</span>
                            <span class="font-bold" :class="hutangPelanggan > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'">
                                {{ formatRupiah(hutangPelanggan) }}
                            </span>
                        </div>
                        <div class="divider my-1"></div>
                        <div class="flex justify-between text-base font-bold text-gray-900 dark:text-gray-100">
                            <span>Total Harus Dibayar</span>
                            <span>{{ formatRupiah(totalYangHarusDibayar) }}</span>
                        </div>
                        <div class="flex justify-between text-sm text-gray-700 dark:text-gray-400">
                            <span>Uang Masuk</span>
                            <span class="font-bold text-gray-900 dark:text-gray-100">{{ formatRupiah(uangPembayaran) }}</span>
                        </div>
                        <!-- Kembalian / Kurang Bayar -->
                        <div class="kembalian-box rounded-xl p-3 mt-1"
                            :class="kembalian >= 0 ? 'kembalian-positive' : 'kembalian-negative'">
                            <div class="flex justify-between items-center">
                                <span class="text-sm font-bold uppercase tracking-wider">
                                    {{ kembalian >= 0 ? 'Kembalian' : 'Kurang Bayar' }}
                                </span>
                                <span class="text-2xl font-black">{{ formatRupiah(Math.abs(kembalian)) }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Modal Footer -->
                <div class="modal-footer px-6 pb-6">
                    <button ref="submitButtonRef" type="submit" @click.prevent="submitTransaksi"
                        :disabled="isSubmitting || totalBelanja === 0"
                        class="w-full h-14 btn-confirm rounded-2xl text-base font-extrabold flex items-center justify-center gap-3 transition-all disabled:opacity-40">
                        <svg v-if="isSubmitting" class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                        </svg>
                        {{ isSubmitting ? 'MEMPROSES...' : 'SELESAIKAN TRANSAKSI (ENTER)' }}
                    </button>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick, watch } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const PENDING_TRANSACTIONS_KEY = 'pendingTransactions_eceran' // Key beda dgn grosir biar gak clash
const successAudio = new Audio('/barcode.mp3')

// --- State Variables ---
const role_name = localStorage.getItem('role_name')
const kasirData = ref<any>(null)

// Transaksi Data
const transactionItems = ref<any[]>([])
const DEFAULT_PELANGGAN_ID = '02525cd7-3459-4093-bf68-60859ef43600'
const selectedPelangganId = ref(DEFAULT_PELANGGAN_ID)
const pelangganList = ref<any[]>([])
const loadingPelanggan = ref(false)
const hutangPelanggan = ref(0)
const pendingTransactions = ref<any[]>([])
const currentPendingId = ref<number | null>(null)

// Inputs
const quickBarcodeInput = ref('')
const productSearchInput = ref('')
const searchResults = ref<any[]>([])
const showSearchResults = ref(false)
const selectedSearchIndex = ref(-1)

// Pembayaran
const showPaymentModal = ref(false)
const uangPembayaran = ref(0)
const uangPembayaranDisplay = ref('')
const isSubmitting = ref(false)

// Refs DOM Elements
const barcodeInputRef = ref<HTMLInputElement | null>(null)
const pembayaranInputRef = ref<HTMLInputElement | null>(null)
const submitButtonRef = ref<HTMLButtonElement | null>(null)
const bayarBtnRef = ref<HTMLButtonElement | null>(null)
const searchDropdownRef = ref<HTMLElement | null>(null)

// --- Computed Properties ---
const totalBelanja = computed(() => {
    return transactionItems.value.reduce((sum, item) => sum + item.qty * item.harga_jual_reguler, 0)
})

const totalYangHarusDibayar = computed(() => {
    return (Number(hutangPelanggan.value) || 0) + totalBelanja.value
})

const kembalian = computed(() => {
    return (Number(uangPembayaran.value) || 0) - totalYangHarusDibayar.value
})

// --- API Helpers ---
const getAuthHeader = () => {
    const token = localStorage.getItem('authToken')
    return { Authorization: `Bearer ${token}` }
}

// --- Formatters ---
const formatRupiah = (number: number) => {
    if (number === null || number === undefined || isNaN(number)) return 'Rp 0'
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number)
}

const formatInputRupiah = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    const numberValue = parseInt(numbers) || 0
    uangPembayaran.value = numberValue
    if (numbers === '') {
        uangPembayaranDisplay.value = ''
    } else {
        uangPembayaranDisplay.value = new Intl.NumberFormat('id-ID').format(numberValue)
    }
}

const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

// --- Data Fetching ---
const fetchKasirData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/my/data`, { headers: getAuthHeader() })
        if (response.data.success) {
            kasirData.value = response.data.data
        }
    } catch (error) {
        console.error(error)
    }
}

const fetchPelanggan = async () => {
    loadingPelanggan.value = true
    try {
        const response = await axios.get(`${API_BASE_URL}/pelanggan`, { headers: getAuthHeader() })
        if (response.data.success) pelangganList.value = response.data.data
    } catch (error) {
        console.error(error)
    } finally {
        loadingPelanggan.value = false
    }
}

const fetchHutangPelanggan = async (id: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/pelanggan/${id}`, {
            headers: getAuthHeader(),
        })
        if (response.data.success) hutangPelanggan.value = Number(response.data.data.hutang) || 0
    } catch (error) {
        hutangPelanggan.value = 0
    }
}

watch(selectedPelangganId, (newVal) => {
    if (newVal) fetchHutangPelanggan(newVal)
    else hutangPelanggan.value = 0
})

// --- Product Logic (Barcode & Manual) ---
const handleBarcodeScan = async () => {
    const barcode = quickBarcodeInput.value.trim()
    if (!barcode) return

    try {
        const response = await axios.post(
            `${API_BASE_URL}/transaksi/scan`,
            { barcode },
            { headers: getAuthHeader() },
        )
        if (response.data.success && response.data.data) {
            const product = response.data.data
            try {
                successAudio.play()
            } catch (e) { }

            // Mapping harga: Prioritas harga_jual_reguler, fallback ke harga_jual_biasa jika field beda
            const price = parseFloat(product.harga_jual_reguler || product.harga_jual_biasa || 0)

            addOrUpdateItem({ ...product, harga_jual_reguler: price }, 1)

            Swal.fire({
                icon: 'success',
                title: 'Masuk Keranjang',
                text: product.nama_produk,
                timer: 800,
                showConfirmButton: false,
                toast: true,
                position: 'top-end',
            })
        } else {
            Swal.fire({ icon: 'error', title: 'Tidak Ditemukan', timer: 1000, showConfirmButton: false })
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Produk tidak ditemukan',
            timer: 1000,
            showConfirmButton: false,
        })
    }

    quickBarcodeInput.value = ''
    nextTick(() => barcodeInputRef.value?.focus())
}

const searchProducts = async (term: string) => {
    if (!term.trim()) {
        searchResults.value = []
        showSearchResults.value = false
        return
    }
    try {
        const response = await axios.get(`${API_BASE_URL}/produk`, {
            params: { search: term },
            headers: getAuthHeader(),
        })
        if (response.data.success) {
            searchResults.value = response.data.data.data.map((p: any) => ({
                ...p,
                harga_jual_reguler: parseFloat(p.harga_jual_reguler || p.harga_jual_biasa || 0),
            }))
            showSearchResults.value = true
            selectedSearchIndex.value = -1
        }
    } catch (e) {
        searchResults.value = []
    }
}

const scrollActiveItemIntoView = () => {
    nextTick(() => {
        const dropdown = searchDropdownRef.value
        if (!dropdown) return
        const active = dropdown.querySelector('.search-item-active') as HTMLElement | null
        if (active) active.scrollIntoView({ block: 'nearest' })
    })
}

const handleSearchKeydown = (e: KeyboardEvent) => {
    if (!showSearchResults.value) return
    if (e.key === 'ArrowDown') {
        e.preventDefault()
        selectedSearchIndex.value = Math.min(
            selectedSearchIndex.value + 1,
            searchResults.value.length - 1,
        )
        scrollActiveItemIntoView()
    } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        selectedSearchIndex.value = Math.max(selectedSearchIndex.value - 1, -1)
        scrollActiveItemIntoView()
    } else if (e.key === 'Enter' && selectedSearchIndex.value >= 0) {
        e.preventDefault()
        selectProductFromSearch(searchResults.value[selectedSearchIndex.value])
    } else if (e.key === 'Escape') {
        showSearchResults.value = false
    }
}

const selectProductFromSearch = async (product: any) => {
    const { value: qty } = await Swal.fire({
        title: 'Jumlah Barang',
        text: product.nama_produk,
        input: 'number',
        inputValue: 1,
        inputAttributes: {
            autocapitalize: 'off',
            autocomplete: 'off',
        },
        showCancelButton: true,
        confirmButtonColor: '#0891b2',
        didOpen: () => {
            const input = Swal.getInput()
            if (input) {
                input.focus()
                input.select()
            }
        },
    })

    if (qty && parseInt(qty) > 0) {
        addOrUpdateItem(product, parseInt(qty))
        productSearchInput.value = ''
        showSearchResults.value = false
        barcodeInputRef.value?.focus()
    }
}
// --- Cart Logic ---
const addOrUpdateItem = (product: any, qty: number) => {
    const existing = transactionItems.value.find((i) => i.barcode === product.barcode)
    if (existing) {
        existing.qty += qty
        // Pindah ke atas agar terlihat update-nya
        transactionItems.value = [
            existing,
            ...transactionItems.value.filter((i) => i.barcode !== product.barcode),
        ]
    } else {
        transactionItems.value.unshift({
            barcode: product.barcode,
            nama_produk: product.nama_produk,
            harga_jual_reguler: product.harga_jual_reguler,
            qty: qty,
        })
    }
}

const updateItem = (barcode: string, newQty: number) => {
    const item = transactionItems.value.find((i) => i.barcode === barcode)
    if (item) {
        if (newQty <= 0) removeItem(barcode)
        else item.qty = newQty
    }
}

const removeItem = (barcode: string) => {
    transactionItems.value = transactionItems.value.filter((i) => i.barcode !== barcode)
}

const confirmRemoveItem = async (item: any) => {
    const result = await Swal.fire({
        title: 'Hapus Barang?',
        text: item.nama_produk,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, Hapus',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#be123c',
        cancelButtonColor: '#64748b',
        reverseButtons: true,
    })
    if (result.isConfirmed) removeItem(item.barcode)
}

// --- Payment & Modal Logic ---
const handlePembayaranInput = (event: Event) =>
    formatInputRupiah((event.target as HTMLInputElement).value)
const handlePembayaranFocus = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (uangPembayaran.value > 0) input.value = uangPembayaran.value.toString()
}
const handlePembayaranBlur = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (uangPembayaran.value > 0) input.value = uangPembayaranDisplay.value
}
const handlePembayaranKeydown = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
        e.preventDefault()
        submitButtonRef.value?.click()
    }
}

const openPaymentModal = () => {
    if (!selectedPelangganId.value) return Swal.fire('Info', 'Pilih pelanggan dulu', 'info')
    if (transactionItems.value.length === 0) return Swal.fire('Info', 'Keranjang kosong', 'info')

    showPaymentModal.value = true
    nextTick(() => pembayaranInputRef.value?.focus())
}

const closePaymentModal = () => {
    showPaymentModal.value = false
    nextTick(() => barcodeInputRef.value?.focus())
}

const focusToPayButton = () => {
    bayarBtnRef.value?.focus()
}

// --- Pending Transactions ---
const loadPendingTransactions = () => {
    const data = localStorage.getItem(PENDING_TRANSACTIONS_KEY)
    if (data) pendingTransactions.value = JSON.parse(data)
}

const saveCurrentTransaction = () => {
    if (!selectedPelangganId.value || transactionItems.value.length === 0) return
    const pelanggan = pelangganList.value.find((p) => p.id === selectedPelangganId.value)

    const trx = {
        id: Date.now(),
        pelanggan_id: selectedPelangganId.value,
        nama_pelanggan: pelanggan?.nama_pelanggan || 'Unknown',
        items: [...transactionItems.value],
        tanggal_simpan: new Date().toLocaleString(),
        total: totalBelanja.value,
    }

    pendingTransactions.value.push(trx)
    localStorage.setItem(PENDING_TRANSACTIONS_KEY, JSON.stringify(pendingTransactions.value))

    Swal.fire({
        icon: 'success',
        title: 'Disimpan Pending',
        toast: true,
        position: 'top-end',
        timer: 1500,
        showConfirmButton: false,
    })
    resetForm()
}

const loadTransaction = (t: any) => {
    selectedPelangganId.value = t.pelanggan_id
    transactionItems.value = t.items
    currentPendingId.value = t.id
    removePendingTransaction(t.id, false)
}

const removePendingTransaction = (id: number, notify = true) => {
    pendingTransactions.value = pendingTransactions.value.filter((t) => t.id !== id)
    localStorage.setItem(PENDING_TRANSACTIONS_KEY, JSON.stringify(pendingTransactions.value))
    if (notify)
        Swal.fire({
            icon: 'success',
            title: 'Dihapus',
            toast: true,
            position: 'top-end',
            timer: 1000,
            showConfirmButton: false,
        })
}

// --- Submit & Print ---
const submitTransaksi = async () => {
    if (isSubmitting.value) return

    // Konfirmasi jika kurang bayar (hutang)
    if (kembalian.value < 0) {
        const result = await Swal.fire({
            title: 'Kurang Bayar!',
            html: `Kurang: <b style="color:red">${formatRupiah(Math.abs(kembalian.value))}</b><br>Catat sebagai Hutang?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hutang',
            confirmButtonColor: '#d33',
        })
        if (!result.isConfirmed) return
    }

    isSubmitting.value = true
    const payload = {
        pelanggan_id: selectedPelangganId.value,
        pembayaran: uangPembayaran.value,
        items: transactionItems.value.map((i) => ({ barcode: i.barcode, qty: i.qty })),
    }

    try {
        // Menggunakan endpoint /reguler sesuai konteks "Eceran"
        const response = await axios.post(`${API_BASE_URL}/transaksi/create/reguler`, payload, {
            headers: getAuthHeader(),
        })

        if (response.data.success) {
            const trxData = response.data.data.transaksi
            const plgData = response.data.data.pelanggan

            // Cetak Struk
            printStruk(
                trxData,
                plgData.nama_pelanggan,
                transactionItems.value,
                kasirData.value.full_name,
                kasirData.value.toko.nama_toko,
                kasirData.value.toko.alamat,
            )

            // Tampilkan Kembalian
            await Swal.fire({
                icon: 'success',
                title: 'Transaksi Berhasil',
                html: `Kembalian: <b style="font-size: 1.5em; color: green">${formatRupiah(trxData.total_kembalian)}</b>`,
                timer: 3000,
            })

            resetForm()
            if (currentPendingId.value) removePendingTransaction(currentPendingId.value, false)
            fetchHutangPelanggan(selectedPelangganId.value) // refresh hutang
        } else {
            Swal.fire('Gagal', response.data.message, 'error')
        }
    } catch (error: any) {
        Swal.fire('Error', error.response?.data?.message || 'Terjadi kesalahan', 'error')
    } finally {
        isSubmitting.value = false
    }
}

const resetForm = () => {
    selectedPelangganId.value = DEFAULT_PELANGGAN_ID
    transactionItems.value = []
    uangPembayaran.value = 0
    uangPembayaranDisplay.value = ''
    currentPendingId.value = null
    closePaymentModal()
}

// --- Printing Logic ---
const printStruk = (
    trx: any,
    plgName: string,
    items: any[],
    kasir: string,
    toko: string,
    alamat: string,
) => {
    const html = `
    <!DOCTYPE html>
    <html>
        <head>
            <meta charset="UTF-8">
            <title>Struk #${trx.id.substring(0, 8)}</title>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                body { 
                    font-family: Arial, Helvetica, sans-serif; 
                    background: #fff; 
                    color: #000;
                    padding: 10px;
                }
                @media print {
                    @page { margin: 0; size: auto; }
                    body { margin: 0; }
                }
            </style>
        </head>
        <body onload="window.print(); setTimeout(() => window.close(), 1000);">
            <div style="
                width: 280px; 
                font-family: Arial, Helvetica, sans-serif; 
                font-size: 12px; 
                letter-spacing: 1px; 
                line-height: 1.5; 
                text-align: center; 
                margin-left: 20px;
            ">
                
                <div style="margin-bottom: 12px;">
                    <div style="font-weight: bold; font-size: 15px; margin-bottom: 5px;">${toko.toUpperCase()}</div>
                    <div style="font-size: 11px;">
                        ${alamat.replace(/\n/g, '<br>')}
                    </div>
                </div>

                <div style="border-top: 2px dashed #000; border-bottom: 2px dashed #000; padding: 10px 0; margin: 10px 0;">
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                        <span>ID: ${trx.id.substring(0, 8)}</span>
                        <span>Kasir: ${kasir}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                        <span>Tgl:</span>
                        <span>${formatDateTime(trx.createdAt)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 11px;">
                        <span>Plg:</span>
                        <span>${plgName}</span>
                    </div>
                </div>

                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px; margin: 10px 0 5px 0; border-bottom: 1px dashed #000; padding-bottom: 5px;">
                    <span style="flex: 1; text-align: left;">ITEM</span>
                    <span style="width: 30px; text-align: center;">QTY</span>
                    <span style="width: 60px; text-align: right;">HARGA</span>
                    <span style="width: 60px; text-align: right;">TOTAL</span>
                </div>

                <div style="margin-bottom: 10px;">
                    ${items.map((i) => `
                        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 8px; align-items: flex-start;">
                            <span style="flex: 1; text-align: left; word-break: break-word; padding-right: 5px;">
                                ${i.nama_produk}
                            </span>
                            <span style="width: 30px; text-align: center;">${i.qty}</span>
                            <span style="width: 60px; text-align: right;">${formatRupiah(i.harga_jual_reguler)}</span>
                            <span style="width: 60px; text-align: right;">${formatRupiah(i.qty * i.harga_jual_reguler)}</span>
                        </div>
                    `).join('')}
                </div>

                <div style="border-top: 2px dashed #000; margin: 10px 0; padding-top: 10px;">
                    <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: bold; margin-bottom: 6px;">
                        <span>TOTAL BELANJA:</span>
                        <span>${formatRupiah(trx.total_harga)}</span>
                    </div>

                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                        <span>Tunai:</span>
                        <span>${formatRupiah(trx.total_bayar)}</span>
                    </div>

                    ${trx.total_kembalian > 0 ? `
                        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                            <span>Kembali:</span>
                            <span>${formatRupiah(trx.total_kembalian)}</span>
                        </div>
                    ` : ''}

                    ${trx.sisa_hutang > 0 ? `
                        <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: bold;">
                            <span>Hutang:</span>
                            <span>${formatRupiah(trx.sisa_hutang)}</span>
                        </div>
                    ` : ''}
                </div>

                <div style="margin-top: 15px; font-size: 11px; line-height: 1.6; color: #333;">
                    <div>Terima Kasih Atas Kunjungan Anda</div>
                    <div style="margin: 4px 0;">Periksa barang sebelum dibeli</div>
                    <div style="font-size: 10px;">Barang yang sudah dibeli<br>tidak bisa ditukar atau dikembalikan</div>
                </div>
            </div>
        </body>
    </html>`;

    const blob = new Blob([html], { type: 'text/html; charset=utf-8' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank', 'width=400,height=600')
    setTimeout(() => URL.revokeObjectURL(url), 30000)
};

// --- Lifecycle ---
onMounted(() => {
    fetchKasirData()
    fetchPelanggan()
    loadPendingTransactions()
    nextTick(() => barcodeInputRef.value?.focus())
})
</script>

<style scoped>
/* ===== BASE ===== */
.page-container {
    background: linear-gradient(160deg, #f0f4ff 0%, #f8fafc 60%, #ecfdf5 100%);
}

/* ===== TOP PANEL ===== */
.top-panel {
    background: transparent;
}

.input-card {
    background: white;
    box-shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(6,182,212,0.06);
    border: 1px solid rgba(226, 232, 240, 0.8);
    transition: box-shadow 0.2s;
}
.input-card:focus-within {
    box-shadow: 0 4px 24px rgba(6,182,212,0.14);
    border-color: rgba(6,182,212,0.3);
}

.input-label {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #1e3a5f;
}

/* ===== INPUTS ===== */
.pos-input {
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    color: #0f172a;
    font-size: 0.875rem;
    font-weight: 600;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    appearance: none;
    -webkit-appearance: none;
}
.pos-input:focus {
    background: white;
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6,182,212,0.15);
}
.pos-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* ===== SEARCH DROPDOWN ===== */
.search-dropdown {
    background: white;
    border: 1px solid #e2e8f0;
    top: 100%;
}

.search-item {
    background: white;
}
.search-item:hover {
    background: #f0f9ff;
}
.search-item-active {
    background: #0891b2;
    border-left: 4px solid #0e7490;
}
.search-item-active span {
    color: white !important;
}
.search-item-active .price-tag {
    background: rgba(255, 255, 255, 0.25);
    color: white !important;
}

.price-tag {
    background: #d1fae5;
    color: #065f46;
}

/* ===== HUTANG BADGE ===== */
.hutang-badge {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
}
.hutang-danger { color: #dc2626; }
.hutang-safe   { color: #16a34a; }

/* ===== PENDING SECTION ===== */
.pending-section {
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    border: 1px solid #fde68a;
}
.pending-dot { background: #f59e0b; }

.pending-card {
    background: white;
    border: 1.5px solid #e2e8f0;
    transition: all 0.2s;
}
.pending-card:hover { box-shadow: 0 4px 16px rgba(0,0,0,0.08); transform: translateY(-1px); }
.pending-card-active {
    border-color: #06b6d4;
    background: #ecfeff;
    box-shadow: 0 0 0 2px rgba(6,182,212,0.2);
}
.pending-card-inactive { border-color: #e2e8f0; }

.btn-load {
    background: linear-gradient(135deg, #0891b2, #0e7490);
    color: white;
    box-shadow: 0 2px 8px rgba(8,145,178,0.3);
}
.btn-load:hover { filter: brightness(1.08); }

.btn-del {
    background: #f1f5f9;
    color: #374151;
    font-weight: 600;
}
.btn-del:hover { background: #fee2e2; color: #b91c1c; }

/* ===== TOTAL BAR ===== */
.total-bar {
    background: linear-gradient(135deg, #0c4a6e 0%, #0e7490 50%, #0891b2 100%);
    border-bottom: none;
}

.total-icon {
    background: rgba(255,255,255,0.15);
}

.total-amount {
    color: white;
    letter-spacing: -0.02em;
    text-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

/* ===== CART TABLE ===== */
.cart-table {
    background: white;
    border: 1px solid #e2e8f0;
    border-top: none;
}

.table-head {
    background: linear-gradient(90deg, #0e7490, #0891b2);
}

.cart-row {
    border-bottom: 1px solid #f1f5f9;
}
.cart-row:last-child { border-bottom: none; }
.cart-row:hover { background: #f8fdff; }

.empty-cart-icon {
    background: #f1f5f9;
}

.qty-input {
    border: 1.5px solid #e2e8f0;
    background: #f8fafc;
    color: #0f172a;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
}
.qty-input:focus {
    border-color: #06b6d4;
    box-shadow: 0 0 0 3px rgba(6,182,212,0.12);
    background: white;
}

.subtotal-text { color: #0369a1; }

.del-btn {
    color: #64748b;
    transition: all 0.15s;
}
.del-btn:hover {
    color: #b91c1c;
    background: #fee2e2;
    transform: scale(1.1);
}

/* ===== ACTION BAR ===== */
.action-bar {
    background: white;
    border-top: 1px solid #e2e8f0;
    box-shadow: 0 -8px 32px rgba(0,0,0,0.08);
}

.btn-bayar {
    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
    color: white;
    box-shadow: 0 4px 20px rgba(8,145,178,0.4);
    letter-spacing: 0.03em;
}
.btn-bayar:hover:not(:disabled) {
    background: linear-gradient(135deg, #0e7490 0%, #155e75 100%);
    box-shadow: 0 6px 28px rgba(8,145,178,0.5);
    transform: translateY(-1px);
}
.btn-bayar:active:not(:disabled) { transform: translateY(0); }

.btn-pending-action {
    background: white;
    color: #1e293b;
    border: 1.5px solid #cbd5e1;
}
.btn-pending-action:hover:not(:disabled) {
    border-color: #0891b2;
    color: #0369a1;
    background: #f0f9ff;
}

/* ===== MODAL ===== */
.modal-backdrop {
    background: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(4px);
}

.modal-card {
    background: white;
    border: 1px solid rgba(226,232,240,0.8);
}

.modal-header {
    background: linear-gradient(135deg, #f8fafc 0%, #f0f9ff 100%);
    border-bottom: 1px solid #e2e8f0;
}

.modal-icon {
    background: linear-gradient(135deg, #0891b2, #0e7490);
}

.close-btn {
    color: #475569;
    background: #f1f5f9;
}
.close-btn:hover { color: #b91c1c; background: #fee2e2; }

/* ===== PAYMENT INPUT ===== */
.payment-input-wrap {
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
}

.payment-input {
    background: white;
    border: 2px solid #e2e8f0;
    outline: none;
    color: #0f172a;
    transition: border-color 0.2s, box-shadow 0.2s;
}
.payment-input:focus {
    border-color: #06b6d4;
    box-shadow: 0 0 0 4px rgba(6,182,212,0.12);
}

/* ===== SUMMARY BOX ===== */
.summary-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
}

.divider {
    height: 1px;
    background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
}

.kembalian-box { transition: all 0.3s; }
.kembalian-positive {
    background: linear-gradient(135deg, #ecfdf5, #d1fae5);
    border: 1.5px solid #6ee7b7;
    color: #065f46;
}
.kembalian-negative {
    background: linear-gradient(135deg, #fff1f2, #fee2e2);
    border: 1.5px solid #fca5a5;
    color: #991b1b;
}

/* ===== CONFIRM BUTTON ===== */
.modal-footer { background: white; }

.btn-confirm {
    background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
    color: white;
    box-shadow: 0 4px 20px rgba(8,145,178,0.35);
    letter-spacing: 0.03em;
}
.btn-confirm:hover:not(:disabled) {
    background: linear-gradient(135deg, #0e7490 0%, #155e75 100%);
    box-shadow: 0 6px 28px rgba(8,145,178,0.45);
    transform: translateY(-1px);
}
.btn-confirm:active:not(:disabled) { transform: translateY(0); }

/* ============================================================
   DARK MODE OVERRIDES
   ============================================================ */

:global(.dark) .page-container {
    background: linear-gradient(160deg, #0f172a 0%, #111827 60%, #0c1a14 100%);
}

/* Input Cards */
:global(.dark) .input-card {
    background: #1e293b;
    border-color: #334155;
    box-shadow: 0 1px 3px rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.2);
}
:global(.dark) .input-card:focus-within {
    border-color: rgba(6,182,212,0.5);
    box-shadow: 0 4px 24px rgba(6,182,212,0.12);
}
:global(.dark) .input-label {
    color: #7dd3fc;
}

/* Inputs */
:global(.dark) .pos-input {
    background: #0f172a;
    border-color: #334155;
    color: #f1f5f9;
}
:global(.dark) .pos-input:focus {
    background: #0f172a;
    border-color: #06b6d4;
}
:global(.dark) .pos-input option {
    background: #1e293b;
    color: #f1f5f9;
}

/* Search Dropdown */
:global(.dark) .search-dropdown {
    background: #1e293b;
    border-color: #334155;
}
:global(.dark) .search-item {
    background: #1e293b;
}
:global(.dark) .search-item:hover {
    background: #263548;
}
:global(.dark) .search-item span {
    color: #e2e8f0;
}
:global(.dark) .search-item-active {
    background: #0891b2;
    border-left-color: #22d3ee;
}
:global(.dark) .search-item .price-tag {
    background: #064e3b;
    color: #6ee7b7;
}

/* Hutang Badge */
:global(.dark) .hutang-badge {
    background: #0f172a;
    border-color: #334155;
}

/* Pending Section */
:global(.dark) .pending-section {
    background: linear-gradient(135deg, #1c1506 0%, #27190a 100%);
    border-color: #78350f;
}
:global(.dark) .pending-card {
    background: #1e293b;
    border-color: #334155;
}
:global(.dark) .pending-card-active {
    background: #0c2233;
    border-color: #06b6d4;
}
:global(.dark) .btn-del {
    background: #263548;
    color: #94a3b8;
}
:global(.dark) .btn-del:hover {
    background: #3b1a1a;
    color: #f87171;
}

/* Total Bar — tetap gelap sudah ok, tambah sedikit lebih pekat */
:global(.dark) .total-bar {
    background: linear-gradient(135deg, #0c2a3e 0%, #0c4a6e 50%, #075985 100%);
}

/* Cart Table */
:global(.dark) .cart-table {
    background: #1e293b;
    border-color: #334155;
}
:global(.dark) .table-head {
    background: linear-gradient(90deg, #0c4a6e, #0369a1);
}
:global(.dark) .cart-row {
    border-bottom-color: #334155;
}
:global(.dark) .cart-row:hover {
    background: #263548;
}
:global(.dark) .empty-cart-icon {
    background: #263548;
}
:global(.dark) .qty-input {
    background: #0f172a;
    border-color: #334155;
    color: #f1f5f9;
}
:global(.dark) .qty-input:focus {
    background: #0f172a;
    border-color: #06b6d4;
}
:global(.dark) .subtotal-text {
    color: #38bdf8;
}
:global(.dark) .del-btn {
    color: #64748b;
}
:global(.dark) .del-btn:hover {
    color: #f87171;
    background: #3b1a1a;
}

/* Action Bar */
:global(.dark) .action-bar {
    background: #1e293b;
    border-top-color: #334155;
    box-shadow: 0 -8px 32px rgba(0,0,0,0.4);
}
:global(.dark) .btn-pending-action {
    background: #263548;
    color: #e2e8f0;
    border-color: #334155;
}
:global(.dark) .btn-pending-action:hover:not(:disabled) {
    border-color: #06b6d4;
    color: #38bdf8;
    background: #0c2233;
}

/* Modal */
:global(.dark) .modal-card {
    background: #1e293b;
    border-color: #334155;
}
:global(.dark) .modal-header {
    background: linear-gradient(135deg, #1e293b 0%, #0c2233 100%);
    border-bottom-color: #334155;
}
:global(.dark) .close-btn {
    color: #64748b;
    background: #263548;
}
:global(.dark) .close-btn:hover {
    color: #f87171;
    background: #3b1a1a;
}

/* Payment Input */
:global(.dark) .payment-input-wrap {
    background: #0f172a;
    border-color: #334155;
}
:global(.dark) .payment-input {
    background: #0f172a;
    border-color: #334155;
    color: #f1f5f9;
}
:global(.dark) .payment-input:focus {
    border-color: #06b6d4;
}

/* Summary Box */
:global(.dark) .summary-box {
    background: #0f172a;
    border-color: #334155;
}
:global(.dark) .divider {
    background: linear-gradient(90deg, transparent, #334155, transparent);
}
:global(.dark) .kembalian-positive {
    background: linear-gradient(135deg, #052e16, #064e3b);
    border-color: #065f46;
    color: #6ee7b7;
}
:global(.dark) .kembalian-negative {
    background: linear-gradient(135deg, #1f0708, #3b1a1a);
    border-color: #7f1d1d;
    color: #fca5a5;
}

/* Modal Footer */
:global(.dark) .modal-footer {
    background: #1e293b;
}
</style>
