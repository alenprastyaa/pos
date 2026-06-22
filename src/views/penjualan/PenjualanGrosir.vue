<template>
    <AdminLayout>
        <div class="page-container min-h-screen">

            <!-- Top Input Panel -->
            <div class="top-panel px-5 pt-4 pb-3">
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <!-- Cari Produk -->
                    <div class="input-card p-4 rounded-2xl relative">
                        <label class="input-label flex items-center gap-2 mb-2">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Cari Produk
                        </label>
                        <input @keypress="preventNumber" ref="barcodeInputRef" v-model="productSearchInput" type="text"
                            placeholder="Ketik nama produk..." @input="searchProducts(productSearchInput)"
                            @keydown="handleSearchKeydown" :disabled="role_name !== 'admin'"
                            class="pos-input w-full h-11 px-4 rounded-xl" />

                        <div v-if="showSearchResults && searchResults.length > 0" ref="searchDropdownRef"
                            class="search-dropdown absolute left-4 right-4 mt-1 rounded-xl shadow-2xl z-20 max-h-72 overflow-y-auto">
                            <div v-for="(product, index) in searchResults" :key="product.barcode"
                                @click="selectProductFromSearch(product)"
                                :class="index === selectedSearchIndex ? 'search-item-active' : 'search-item'"
                                class="px-4 py-2.5 cursor-pointer transition-all border-b border-gray-50 last:border-0">
                                <div class="flex justify-between items-center">
                                    <span class="font-semibold text-sm text-gray-800">{{ product.nama_produk }}</span>
                                    <span
                                        class="price-tag text-xs font-bold px-2 py-1 rounded-lg ml-2 whitespace-nowrap">
                                        {{ formatRupiah(product.harga_jual_ritel) }}
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
                            @keydown.enter.prevent="focusToPayButton" class="pos-input w-full h-11 rounded-xl px-4">
                            <option value="" disabled>Pilih Pelanggan...</option>
                            <option v-if="loadingPelanggan" disabled>Memuat...</option>
                            <option v-for="pelanggan in pelangganList" :key="pelanggan.id" :value="pelanggan.id">
                                {{ pelanggan.nama_pelanggan }}
                            </option>
                        </select>

                        <div v-if="selectedPelangganId"
                            class="hutang-badge mt-3 px-4 py-2 rounded-xl flex justify-between items-center">
                            <span class="text-sm font-semibold text-gray-700">Hutang</span>
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
                        <p class="text-sm font-bold text-amber-700">
                            Transaksi Pending ({{ pendingTransactions.length }})
                        </p>
                    </div>
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div v-for="t in pendingTransactions" :key="t.id"
                            class="pending-card rounded-xl p-3 cursor-pointer transition-all"
                            :class="t.id === currentPendingId ? 'pending-card-active' : 'pending-card-inactive'">
                            <p class="text-sm font-bold text-gray-800 truncate">{{ t.nama_pelanggan
                            }}</p>
                            <p class="text-sm font-extrabold text-amber-600 mt-0.5">{{
                                formatRupiah(t.total) }}</p>
                            <p class="text-xs text-gray-600 mt-0.5 mb-2">{{ t.tanggal_simpan }}</p>
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
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                    </div>
                    <div>
                        <p class="text-xs font-bold text-rose-100 uppercase tracking-wider">Total Belanja</p>
                        <p class="text-xs text-rose-200">{{ transactionItems.length }} item</p>
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
                                <th
                                    class="px-4 py-3 text-left text-white text-xs font-semibold uppercase tracking-wider w-10">
                                    No</th>
                                <th
                                    class="px-4 py-3 text-left text-white text-xs font-semibold uppercase tracking-wider">
                                    Produk</th>
                                <th
                                    class="px-4 py-3 text-center text-white text-xs font-semibold uppercase tracking-wider w-28">
                                    Qty</th>
                                <th
                                    class="px-4 py-3 text-right text-white text-xs font-semibold uppercase tracking-wider">
                                    Harga</th>
                                <th
                                    class="px-4 py-3 text-right text-white text-xs font-semibold uppercase tracking-wider">
                                    Subtotal</th>
                                <th
                                    class="px-4 py-3 text-center text-white text-xs font-semibold uppercase tracking-wider w-16">
                                    Hapus</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="transactionItems.length === 0">
                                <td colspan="6" class="px-6 py-16 text-center">
                                    <div class="flex flex-col items-center justify-center space-y-3">
                                        <div
                                            class="empty-cart-icon w-20 h-20 rounded-full flex items-center justify-center">
                                            <svg class="w-10 h-10 opacity-40" fill="none" stroke="currentColor"
                                                viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                            </svg>
                                        </div>
                                        <p class="text-gray-600 font-semibold">Keranjang masih kosong
                                        </p>
                                        <p class="text-gray-500 text-sm">Cari produk untuk memulai
                                            transaksi</p>
                                    </div>
                                </td>
                            </tr>
                            <tr v-for="(item, index) in transactionItems" :key="item.barcode"
                                class="cart-row transition-colors">
                                <td class="px-4 py-3 text-sm font-bold text-gray-500">{{ index + 1 }}
                                </td>
                                <td class="px-4 py-3">
                                    <div class="text-sm font-bold text-gray-900">{{ item.nama_produk
                                    }}</div>
                                    <div class="text-xs text-gray-500 font-mono">{{ item.barcode }}
                                    </div>
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <input v-model.number="item.qty" type="number" min="1"
                                        @change="updateItem(item.barcode, item.qty)"
                                        class="qty-input w-20 text-center rounded-lg py-1.5 text-sm font-bold" />
                                </td>
                                <td class="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                                    {{ formatRupiah(item.harga_jual_ritel) }}
                                </td>
                                <td class="px-4 py-3 text-right text-sm font-extrabold subtotal-text">
                                    {{ formatRupiah(item.qty * item.harga_jual_ritel) }}
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
                            <h3 class="text-lg font-extrabold text-gray-800">Proses Pembayaran</h3>
                            <p class="text-xs text-gray-600">Masukkan nominal pembayaran</p>
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
                        <label
                            class="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 block">
                            Uang Diterima
                        </label>
                        <div class="relative">
                            <span
                                class="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-black text-rose-500">Rp</span>
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
                        <div class="flex justify-between text-sm text-gray-700">
                            <span>Pelanggan</span>
                            <span class="font-bold text-gray-900">{{
                                getPelangganName(selectedPelangganId) }}</span>
                        </div>
                        <div class="flex justify-between text-sm text-gray-700">
                            <span>Total Belanja</span>
                            <span class="font-bold text-gray-900">{{ formatRupiah(totalBelanja)
                            }}</span>
                        </div>
                        <div class="flex justify-between text-sm text-gray-700">
                            <span>Hutang Lama</span>
                            <span class="font-bold"
                                :class="hutangPelanggan > 0 ? 'text-red-600' : 'text-emerald-600'">
                                {{ formatRupiah(hutangPelanggan) }}
                            </span>
                        </div>
                        <div class="divider my-1"></div>
                        <div class="flex justify-between text-base font-bold text-gray-900">
                            <span>Total Harus Dibayar</span>
                            <span>{{ formatRupiah(totalYangHarusDibayar) }}</span>
                        </div>
                        <div class="flex justify-between text-sm text-gray-700">
                            <span>Uang Masuk</span>
                            <span class="font-bold text-gray-900">{{ formatRupiah(uangPembayaran)
                            }}</span>
                        </div>
                        <!-- Kembalian / Kurang Bayar -->
                        <div class="kembalian-box rounded-xl p-3 mt-1"
                            :class="kembalian >= 0 ? 'kembalian-positive' : 'kembalian-negative'">
                            <div class="flex justify-between items-center">
                                <span class="text-sm font-bold uppercase tracking-wider">
                                    {{ kembalian >= 0 ? 'Kembalian' : 'Sisa Hutang' }}
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
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                d="M5 13l4 4L19 7" />
                        </svg>
                        {{ isSubmitting ? 'MEMPROSES...' : 'PROSES TRANSAKSI (ENTER)' }}
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
const PENDING_TRANSACTIONS_KEY = 'pendingTransactions'
const hutangPelanggan = ref(0)
const role_name = localStorage.getItem('role_name')

const showPaymentModal = ref(false)

interface Toko {
    id: string
    nama_toko: string
    alamat: string
}

interface KasirData {
    full_name: string
    role_name: string
    toko: Toko
}

interface Pelanggan {
    id: string
    nama_pelanggan: string
}

interface CartItem {
    barcode: string
    qty: number
    nama_produk: string
    harga_jual_ritel: number
}

interface PendingTransaction {
    id: number
    pelanggan_id: string
    nama_pelanggan: string
    items: CartItem[]
    tanggal_simpan: string
    total: number
}

interface TransaksiPayload {
    pelanggan_id: string
    pembayaran: number
    items: { barcode: string; qty: number }[]
}

interface TransaksiResponseData {
    transaksi: {
        id: string
        total_harga: number
        total_bayar: number
        total_kembalian: number
        sisa_hutang: number
        kasir_name: string
        createdAt: string
    }
    pelanggan: {
        nama_pelanggan: string
    }
}

const selectedSearchIndex = ref<number>(-1)
const pelangganList = ref<Pelanggan[]>([])
const loadingPelanggan = ref(false)
const isSubmitting = ref(false)

const selectedPelangganId = ref('')
const uangPembayaran = ref(0)
const barcodeInputRef = ref<HTMLInputElement | null>(null)
const pelangganSelectRef = ref<HTMLSelectElement | null>(null)
const transactionItems = ref<CartItem[]>([])

const pendingTransactions = ref<PendingTransaction[]>([])
const currentPendingId = ref<number | null>(null)

const kasirData = ref<KasirData | null>(null)
const productSearchInput = ref('')
const searchResults = ref<CartItem[]>([])
const showSearchResults = ref(false)
const getAuthHeader = () => {
    const token = localStorage.getItem('authToken')
    return { Authorization: `Bearer ${token}` }
}
const isSuperAdmin = computed(() => kasirData.value?.role_name === 'superadmin')
const uangPembayaranDisplay = ref('')
const totalYangHarusDibayar = computed(() => {
    const hutang = Number(hutangPelanggan.value) || 0
    const belanja = Number(totalBelanja.value) || 0
    return hutang + belanja
})

const pembayaranInputRef = ref<HTMLInputElement | null>(null)
const submitButtonRef = ref<HTMLButtonElement | null>(null)
const bayarBtnRef = ref<HTMLButtonElement | null>(null)
const searchDropdownRef = ref<HTMLElement | null>(null)

const preventNumber = (e: KeyboardEvent) => {
    if (/\d/.test(e.key)) {
        e.preventDefault()
    }
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

const handlePembayaranInput = (event: Event) => {
    const input = event.target as HTMLInputElement
    formatInputRupiah(input.value)
}

const handlePembayaranFocus = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (uangPembayaran.value > 0) {
        input.value = uangPembayaran.value.toString()
    }
}

const handlePembayaranBlur = (event: Event) => {
    const input = event.target as HTMLInputElement
    if (uangPembayaran.value > 0) {
        input.value = uangPembayaranDisplay.value
    }
}

const handlePembayaranKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter') {
        event.preventDefault()
        nextTick(() => {
            submitButtonRef.value?.focus()
            submitButtonRef.value?.click()
        })
    }
}

const focusToPayButton = () => {
    if (bayarBtnRef.value) {
        bayarBtnRef.value.focus()
    }
}

const openPaymentModal = () => {
    if (!selectedPelangganId.value) {
        Swal.fire('Peringatan', 'Mohon pilih pelanggan terlebih dahulu.', 'warning')
        return
    }
    if (transactionItems.value.length === 0) {
        Swal.fire('Peringatan', 'Keranjang belanja masih kosong.', 'warning')
        return
    }
    showPaymentModal.value = true
    nextTick(() => {
        if (pembayaranInputRef.value) {
            pembayaranInputRef.value.focus()
        }
    })
}

const closePaymentModal = () => {
    showPaymentModal.value = false
    nextTick(() => {
        barcodeInputRef.value?.focus()
    })
}

const searchProducts = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
        searchResults.value = []
        showSearchResults.value = false
        return
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/produk`, {
            params: { search: searchTerm },
            headers: getAuthHeader(),
        })

        if (response.data.success && response.data.data.data) {
            searchResults.value = response.data.data.data.map((product: any) => ({
                barcode: product.barcode,
                qty: 1,
                nama_produk: product.nama_produk,
                harga_jual_ritel: parseFloat(product.harga_jual_ritel),
            }))
            showSearchResults.value = true
            selectedSearchIndex.value = -1
        }
    } catch (error) {
        console.error('Error searching products:', error)
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

const handleSearchKeydown = (event: KeyboardEvent) => {
    if (!showSearchResults.value || searchResults.value.length === 0) return

    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault()
            selectedSearchIndex.value = Math.min(
                selectedSearchIndex.value + 1,
                searchResults.value.length - 1,
            )
            scrollActiveItemIntoView()
            break
        case 'ArrowUp':
            event.preventDefault()
            selectedSearchIndex.value = Math.max(selectedSearchIndex.value - 1, -1)
            scrollActiveItemIntoView()
            break
        case 'Enter':
            event.preventDefault()
            if (selectedSearchIndex.value >= 0) {
                selectProductFromSearch(searchResults.value[selectedSearchIndex.value])
            }
            break
        case 'Escape':
            event.preventDefault()
            showSearchResults.value = false
            selectedSearchIndex.value = -1
            break
    }
}

const selectProductFromSearch = async (product: CartItem) => {
    const qty = await promptQuantity(product)

    if (qty !== null) {
        addOrUpdateItem(product, qty)
        Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: `${qty} ${product.nama_produk} ditambahkan`,
            timer: 100,
            showConfirmButton: false,
        })
    }

    productSearchInput.value = ''
    searchResults.value = []
    showSearchResults.value = false
    selectedSearchIndex.value = -1

    nextTick(() => {
        barcodeInputRef.value?.focus()
    })
}

const formatRupiah = (number: number) => {
    if (number === null || number === undefined || isNaN(number)) return 'Rp 0'
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number)
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

const getPelangganName = (id: string) => {
    const pelanggan = pelangganList.value.find((p) => p.id === id)
    return pelanggan ? pelanggan.nama_pelanggan : 'Umum / Tidak Dikenal'
}

const totalBelanja = computed(() => {
    return transactionItems.value.reduce((sum, item) => sum + item.qty * item.harga_jual_ritel, 0)
})

const kembalian = computed(() => {
    const bayar = Number(uangPembayaran.value) || 0
    const total = Number(totalYangHarusDibayar.value) || 0
    return bayar - total
})

const fetchKasirData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/my/data`, {
            headers: getAuthHeader(),
        })
        if (response.data.success) {
            kasirData.value = {
                full_name: response.data.data.full_name,
                role_name: response.data.data.role_name,
                toko: {
                    id: response.data.data.toko.id,
                    nama_toko: response.data.data.toko.nama_toko,
                    alamat: response.data.data.toko.alamat,
                },
            }
        }
    } catch (error) {
        console.error('Gagal mengambil data kasir:', error)
    }
}

const fetchHutangPelanggan = async (pelangganId: string) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/pelanggan/${pelangganId}`, {
            headers: getAuthHeader(),
        })
        if (response.data.success && response.data.data) {
            hutangPelanggan.value = Number(response.data.data.hutang) || 0
        }
    } catch (error) {
        console.error('Gagal mengambil hutang pelanggan:', error)
        hutangPelanggan.value = 0
    }
}

watch(selectedPelangganId, async (newValue) => {
    if (newValue) {
        await fetchHutangPelanggan(newValue)
    } else {
        hutangPelanggan.value = 0
    }
})

const fetchPelanggan = async () => {
    loadingPelanggan.value = true
    try {
        const response = await axios.get(`${API_BASE_URL}/pelanggan`, {
            headers: getAuthHeader(),
        })
        if (response.data.success) {
            pelangganList.value = response.data.data
        }
    } catch (error) {
        console.error('Gagal mengambil data pelanggan:', error)
    } finally {
        loadingPelanggan.value = false
    }
}

const resetForm = () => {
    selectedPelangganId.value = ''
    uangPembayaran.value = 0
    uangPembayaranDisplay.value = ''
    transactionItems.value = []
    currentPendingId.value = null
    closePaymentModal()
    nextTick(() => {
        barcodeInputRef.value?.focus()
        productSearchInput.value = ''
        searchResults.value = []
        showSearchResults.value = false
    })
}
const addOrUpdateItem = (product: CartItem, qty: number = 1) => {
    const existingItem = transactionItems.value.find((item) => item.barcode === product.barcode)
    if (existingItem) {
        existingItem.qty += qty
        transactionItems.value = [
            existingItem,
            ...transactionItems.value.filter((item) => item.barcode !== product.barcode),
        ]
    } else {
        transactionItems.value.unshift({
            barcode: product.barcode,
            qty: qty,
            nama_produk: product.nama_produk,
            harga_jual_ritel: parseFloat(product.harga_jual_ritel.toString()),
        })
    }
}
const updateItem = (barcode: string, newQty: number) => {
    const item = transactionItems.value.find((i) => i.barcode === barcode)
    if (item) {
        if (newQty <= 0 || isNaN(newQty)) {
            removeItem(barcode)
        } else {
            item.qty = newQty
        }
    }
}

const removeItem = (barcode: string) => {
    transactionItems.value = transactionItems.value.filter((item) => item.barcode !== barcode)
}

const confirmRemoveItem = async (item: CartItem) => {
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

const saveToLocalStorage = () => {
    try {
        localStorage.setItem(PENDING_TRANSACTIONS_KEY, JSON.stringify(pendingTransactions.value))
    } catch (e) {
        console.error('Error saving pending transactions:', e)
    }
}

const loadPendingTransactions = () => {
    try {
        const data = localStorage.getItem(PENDING_TRANSACTIONS_KEY)
        pendingTransactions.value = data ? JSON.parse(data) : []
    } catch (e) {
        console.error('Error loading pending transactions:', e)
        pendingTransactions.value = []
    }
}

const saveCurrentTransaction = async () => {
    if (transactionItems.value.length === 0) {
        Swal.fire('Peringatan', 'Keranjang belanja kosong.', 'warning')
        return
    }

    if (!selectedPelangganId.value) {
        Swal.fire('Peringatan', 'Pelanggan harus dipilih untuk menyimpan transaksi pending.', 'warning')
        return
    }

    const selectedPelanggan = pelangganList.value.find((p) => p.id === selectedPelangganId.value)
    const namaPelanggan = selectedPelanggan
        ? selectedPelanggan.nama_pelanggan
        : 'Pelanggan Tidak Dikenal'

    const newTransaction: PendingTransaction = {
        id: Date.now(),
        pelanggan_id: selectedPelangganId.value,
        nama_pelanggan: namaPelanggan,
        items: [...transactionItems.value],
        tanggal_simpan: new Date().toLocaleString('id-ID'),
        total: totalBelanja.value,
    }

    pendingTransactions.value.push(newTransaction)
    saveToLocalStorage()
    Swal.fire('Berhasil', 'Transaksi telah disimpan sebagai pending.', 'success')
    resetForm()
}

const loadTransaction = (transaction: PendingTransaction) => {
    resetForm()

    selectedPelangganId.value = transaction.pelanggan_id
    transactionItems.value = transaction.items
    uangPembayaran.value = 0

    currentPendingId.value = transaction.id

    Swal.fire(
        'Dimuat',
        `Transaksi untuk ${transaction.nama_pelanggan} telah dimuat ke keranjang.`,
        'info',
    )
    removePendingTransaction(currentPendingId.value, false)
}

const removePendingTransaction = (id: number, showSuccess: boolean = true) => {
    pendingTransactions.value = pendingTransactions.value.filter((t) => t.id !== id)
    saveToLocalStorage()
    if (showSuccess) {
        Swal.fire('Berhasil', 'Transaksi pending telah dihapus.', 'success')
    }
}
const generateReceiptHTML = (
    trx: TransaksiResponseData['transaksi'],
    pelangganName: string,
    items: CartItem[],
    kasirFullName: string,
    tokoName: string,
    tokoAlamat: string,
): string => {
    // Setup Variable
    const total_bayar = trx.total_bayar;
    const total_harga = trx.total_harga;
    const kembalian = trx.total_kembalian;
    const sisa_hutang = trx.sisa_hutang;

    // Helper Formatter
    const formatCurrency = (number: number) => {
        return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(number);
    };

    // Format Tanggal
    const tanggalDisplay = typeof formatDateTime !== 'undefined'
        ? formatDateTime(trx.createdAt)
        : new Date(trx.createdAt).toLocaleString('id-ID');

    // STYLE DISAMAKAN: Arial, 1px spacing, 1.5 line-height
    return `
    <div style="
        width: 280px; 
        font-family: Arial, Helvetica, sans-serif; 
        font-size: 12px; 
        letter-spacing: 1px; 
        line-height: 1.5; 
        padding: 10px; 
        text-align: center; 
        margin-left: 20px; 
        color: #000;
    ">
        
        <div style="margin-bottom: 12px;">
            <div style="font-weight: bold; font-size: 15px; margin-bottom: 5px;">${tokoName.toUpperCase()}</div>
            <div style="font-size: 11px;">
                ${tokoAlamat.replace(/\n/g, '<br>')}
            </div>
        </div>

        <div style="border-top: 2px dashed #000; border-bottom: 2px dashed #000; padding: 10px 0; margin: 10px 0;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span>ID: ${trx.id.substring(0, 8)}</span>
                <span>Kasir: ${kasirFullName}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span>Tgl:</span>
                <span>${tanggalDisplay}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px;">
                <span>Plg:</span>
                <span>${pelangganName}</span>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px; margin: 10px 0 5px 0; border-bottom: 1px dashed #000; padding-bottom: 5px;">
            <span style="flex: 1; text-align: left;">ITEM</span>
            <span style="width: 30px; text-align: center;">QTY</span>
            <span style="width: 60px; text-align: right;">HARGA</span>
            <span style="width: 60px; text-align: right;">TOTAL</span>
        </div>

        <div style="margin-bottom: 10px;">
            ${items.map((item) => `
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 8px; align-items: flex-start;">
                    <span style="flex: 1; text-align: left; word-break: break-word; padding-right: 5px;">
                        ${item.nama_produk}
                    </span>
                    <span style="width: 30px; text-align: center;">${item.qty}</span>
                    <span style="width: 60px; text-align: right;">${formatCurrency(item.harga_jual_ritel)}</span>
                    <span style="width: 60px; text-align: right;">${formatCurrency(item.qty * item.harga_jual_ritel)}</span>
                </div>
            `).join('')}
        </div>

        <div style="border-top: 2px dashed #000; margin: 10px 0; padding-top: 10px;">
            
            <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: bold; margin-bottom: 6px;">
                <span>TOTAL BELANJA:</span>
                <span>Rp ${formatCurrency(total_harga)}</span>
            </div>

            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span>Tunai:</span>
                <span>Rp ${formatCurrency(total_bayar)}</span>
            </div>

            ${kembalian > 0 ? `
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                    <span>Kembali:</span>
                    <span>Rp ${formatCurrency(kembalian)}</span>
                </div>
            ` : ''}

            ${sisa_hutang > 0 ? `
                <div style="display: flex; justify-content: space-between; font-size: 11px; font-weight: bold;">
                    <span>Hutang:</span>
                    <span>Rp ${formatCurrency(sisa_hutang)}</span>
                </div>
            ` : ''}

        </div>

        <div style="margin-top: 15px; font-size: 11px; line-height: 1.6; color: #333;">
            <div>Terima Kasih Atas Kunjungan Anda</div>
            <div style="margin: 4px 0;">Periksa barang sebelum dibeli</div>
            <div style="font-size: 10px;">Barang yang sudah dibeli<br>tidak bisa ditukar atau dikembalikan</div>
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
    const printContent = generateReceiptHTML(
        trx,
        pelangganName,
        items,
        kasirFullName,
        tokoName,
        tokoAlamat,
    );

    const fullHtml = `<!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Struk #${trx.id.substring(0, 8)}</title>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    body { font-family: Arial, Helvetica, sans-serif; background: #fff; color: #000; }
                    @media print {
                        @page { margin: 0; size: auto; }
                        body { width: 100%; background-color: #fff; }
                    }
                </style>
            </head>
            <body onload="window.print(); setTimeout(() => window.close(), 1000);">
                ${printContent}
            </body>
        </html>`

    const blob = new Blob([fullHtml], { type: 'text/html; charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const opened = window.open(url, '_blank', 'width=400,height=600')
    if (!opened) {
        Swal.fire('Error', 'Gagal membuka jendela cetak. Periksa setelan pop-up browser Anda.', 'error')
        URL.revokeObjectURL(url)
        return
    }
    setTimeout(() => URL.revokeObjectURL(url), 30000)
};

const submitTransaksi = async () => {
    if (!selectedPelangganId.value) {
        Swal.fire('Peringatan', 'Pelanggan harus dipilih.', 'warning')
        return
    }

    if (transactionItems.value.length === 0) {
        Swal.fire('Peringatan', 'Keranjang belanja kosong.', 'warning')
        return
    }
    if (!kasirData.value) {
        Swal.fire(
            'Error',
            'Data kasir/toko belum dimuat. Mohon refresh halaman atau cek koneksi API.',
            'error',
        )
        return
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
        allowEscapeKey: false,
    })

    if (!confirmResult.isConfirmed) {
        return
    }

    const sisaBayar = kembalian.value

    if (sisaBayar < 0) {
        const hutangAmount = Math.abs(sisaBayar)
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
            allowEscapeKey: false,
        })

        if (!result.isConfirmed) {
            return
        }
    }

    const itemsForPrint = [...transactionItems.value]

    const itemsPayload = transactionItems.value.map((item) => ({
        barcode: item.barcode,
        qty: item.qty,
    }))

    const payload: TransaksiPayload = {
        pelanggan_id: selectedPelangganId.value,
        pembayaran: uangPembayaran.value,
        items: itemsPayload,
    }

    isSubmitting.value = true

    try {
        const response = await axios.post<
            any,
            { data: { success: boolean; data: TransaksiResponseData; message?: string } }
        >(`${API_BASE_URL}/transaksi/create/ritel`, payload, {
            headers: getAuthHeader(),
        })

        if (response.data.success) {
            const dataTransaksi = response.data.data.transaksi
            const sisaHutangAkhir = dataTransaksi.sisa_hutang || 0
            const kembalianAkhir = dataTransaksi.total_kembalian || 0
            const namaPelanggan = response.data.data.pelanggan.nama_pelanggan

            printStruk(
                dataTransaksi,
                namaPelanggan,
                itemsForPrint,
                kasirData.value!.full_name,
                kasirData.value!.toko.nama_toko,
                kasirData.value!.toko.alamat,
            )

            let title: string
            let message: string
            let icon: 'success' | 'warning' | 'error'

            if (sisaHutangAkhir > 0) {
                icon = 'warning'
                title = 'Transaksi Tercatat sebagai Hutang!'
                message = `<p class="text-lg font-bold mt-2">Pelanggan: ${namaPelanggan}</p>
                   <p class="text-xl font-bold mt-1 text-red-600">Sisa Hutang: ${formatRupiah(sisaHutangAkhir)}</p>`
            } else if (sisaHutangAkhir === 0) {
                if (kembalianAkhir > 0) {
                    icon = 'success'
                    title = 'Transaksi Berhasil!'
                    message = `<p class="text-lg font-bold mt-2">Total Belanja: ${formatRupiah(totalBelanja.value)}</p>
                       <p class="text-lg font-bold mt-1">Uang Bayar: ${formatRupiah(uangPembayaran.value)}</p>
                       <p class="text-xl font-bold mt-2 text-green-600">Kembalian: ${formatRupiah(kembalianAkhir)}</p>`
                } else {
                    icon = 'success'
                    title = 'Transaksi Berhasil!'
                    message = `<p class="text-lg font-bold mt-2">Pembayaran Lunas Pas!</p>`
                }
                router.push('/penjualan-grosir')
            } else {
                icon = 'error'
                title = 'Error Logika Transaksi!'
                message = `<p class="text-lg font-bold mt-2">Terdeteksi error internal. Hubungi Admin.</p>`
            }

            Swal.fire({
                icon: icon,
                title: title,
                html: message,
                confirmButtonText: 'OK',
                confirmButtonColor: '#0891b2',
                allowOutsideClick: false,
                allowEscapeKey: false,
                didOpen: () => {
                    const confirmBtn = document.querySelector('.swal2-confirm') as HTMLButtonElement
                    if (confirmBtn) {
                        confirmBtn.focus()
                    }
                },
            }).then(() => {
                if (currentPendingId.value !== null) {
                    removePendingTransaction(currentPendingId.value, false)
                }

                fetchHutangPelanggan(selectedPelangganId.value)
                resetForm()
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Transaksi Gagal',
                text: response.data.message || 'Terjadi kesalahan saat memproses transaksi.',
            })
        }
    } catch (error: any) {
        console.error('Error transaksi:', error)
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Gagal terhubung ke server.',
        })
    } finally {
        isSubmitting.value = false
    }
}
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
            const input = document.getElementById('qty-input') as HTMLInputElement
            if (input) {
                input.focus()
                input.select()

                input.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault()
                        Swal.clickConfirm()
                    }
                })
            }
        },
        preConfirm: () => {
            const input = document.getElementById('qty-input') as HTMLInputElement
            const qty = parseInt(input.value)

            if (!qty || qty <= 0 || isNaN(qty)) {
                Swal.showValidationMessage('Masukkan jumlah yang valid (minimal 1)')
                return false
            }
            return qty
        },
    })

    if (result.isConfirmed && result.value) {
        return result.value
    }
    return null
}

onMounted(async () => {
    await fetchKasirData()
    await fetchPelanggan()
    loadPendingTransactions()
    barcodeInputRef.value?.focus()
})
</script>
<style scoped>
/* ===== BASE ===== */
.page-container {
    background: linear-gradient(160deg, #fff1f2 0%, #f8fafc 60%, #fdf4ff 100%);
}

/* ===== TOP PANEL ===== */
.top-panel {
    background: transparent;
}

.input-card {
    background: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 4px 16px rgba(190, 18, 60, 0.06);
    border: 1px solid rgba(226, 232, 240, 0.8);
    transition: box-shadow 0.2s;
}

.input-card:focus-within {
    box-shadow: 0 4px 24px rgba(190, 18, 60, 0.12);
    border-color: rgba(190, 18, 60, 0.25);
}

.input-label {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #5c0a14;
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
    border-color: #be123c;
    box-shadow: 0 0 0 3px rgba(190, 18, 60, 0.12);
}

.pos-input:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.pos-input::placeholder {
    color: #94a3b8;
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
    background: #fff1f2;
}

.search-item-active {
    background: #be123c;
    border-left: 4px solid #9f1239;
}

.search-item-active span {
    color: white !important;
}

.search-item-active .price-tag {
    background: rgba(255, 255, 255, 0.25);
    color: white !important;
}

.search-item .price-tag {
    background: #d1fae5;
    color: #065f46;
}

/* ===== HUTANG BADGE ===== */
.hutang-badge {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
}

.hutang-danger {
    color: #dc2626;
}

.hutang-safe {
    color: #16a34a;
}

/* ===== PENDING SECTION ===== */
.pending-section {
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    border: 1px solid #fde68a;
}

.pending-dot {
    background: #f59e0b;
}

.pending-card {
    background: white;
    border: 1.5px solid #e2e8f0;
    transition: all 0.2s;
}

.pending-card:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
}

.pending-card-active {
    border-color: #be123c;
    background: #fff1f2;
    box-shadow: 0 0 0 2px rgba(190, 18, 60, 0.15);
}

.pending-card-inactive {
    border-color: #e2e8f0;
}

.btn-load {
    background: linear-gradient(135deg, #be123c, #9f1239);
    color: white;
    box-shadow: 0 2px 8px rgba(190, 18, 60, 0.3);
}

.btn-load:hover {
    filter: brightness(1.08);
}

.btn-del {
    background: #f1f5f9;
    color: #374151;
    font-weight: 600;
}

.btn-del:hover {
    background: #fee2e2;
    color: #b91c1c;
}

/* ===== TOTAL BAR ===== */
.total-bar {
    background: linear-gradient(135deg, #4c0519 0%, #881337 50%, #be123c 100%);
    border-bottom: none;
}

.total-icon {
    background: rgba(255, 255, 255, 0.15);
}

.total-amount {
    color: white;
    letter-spacing: -0.02em;
    text-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

/* ===== CART TABLE ===== */
.cart-table {
    background: white;
    border: 1px solid #e2e8f0;
    border-top: none;
}

.table-head {
    background: linear-gradient(90deg, #881337, #be123c);
}

.cart-row {
    border-bottom: 1px solid #f1f5f9;
}

.cart-row:last-child {
    border-bottom: none;
}

.cart-row:hover {
    background: #fff5f6;
}

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
    border-color: #be123c;
    box-shadow: 0 0 0 3px rgba(190, 18, 60, 0.1);
    background: white;
}

.subtotal-text {
    color: #9f1239;
}

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
    box-shadow: 0 -8px 32px rgba(0, 0, 0, 0.08);
}

.btn-bayar {
    background: linear-gradient(135deg, #be123c 0%, #9f1239 100%);
    color: white;
    box-shadow: 0 4px 20px rgba(190, 18, 60, 0.4);
    letter-spacing: 0.03em;
}

.btn-bayar:hover:not(:disabled) {
    background: linear-gradient(135deg, #9f1239 0%, #881337 100%);
    box-shadow: 0 6px 28px rgba(190, 18, 60, 0.5);
    transform: translateY(-1px);
}

.btn-bayar:active:not(:disabled) {
    transform: translateY(0);
}

.btn-pending-action {
    background: white;
    color: #1e293b;
    border: 1.5px solid #cbd5e1;
}

.btn-pending-action:hover:not(:disabled) {
    border-color: #be123c;
    color: #be123c;
    background: #fff1f2;
}

/* ===== MODAL ===== */
.modal-backdrop {
    background: rgba(15, 23, 42, 0.7);
    backdrop-filter: blur(4px);
}

.modal-card {
    background: white;
    border: 1px solid rgba(226, 232, 240, 0.8);
}

.modal-header {
    background: linear-gradient(135deg, #f8fafc 0%, #fff1f2 100%);
    border-bottom: 1px solid #e2e8f0;
}

.modal-icon {
    background: linear-gradient(135deg, #be123c, #9f1239);
}

.close-btn {
    color: #475569;
    background: #f1f5f9;
}

.close-btn:hover {
    color: #b91c1c;
    background: #fee2e2;
}

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
    border-color: #be123c;
    box-shadow: 0 0 0 4px rgba(190, 18, 60, 0.1);
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

.kembalian-box {
    transition: all 0.3s;
}

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
.modal-footer {
    background: white;
}

.btn-confirm {
    background: linear-gradient(135deg, #be123c 0%, #9f1239 100%);
    color: white;
    box-shadow: 0 4px 20px rgba(190, 18, 60, 0.35);
    letter-spacing: 0.03em;
}

.btn-confirm:hover:not(:disabled) {
    background: linear-gradient(135deg, #9f1239 0%, #881337 100%);
    box-shadow: 0 6px 28px rgba(190, 18, 60, 0.45);
    transform: translateY(-1px);
}

.btn-confirm:active:not(:disabled) {
    transform: translateY(0);
}

/* ============================================================
   DARK MODE OVERRIDES
   ============================================================ */

:global(.dark) .page-container {
    background: linear-gradient(160deg, #1a0008 0%, #111827 60%, #150a1a 100%);
}

:global(.dark) .input-card {
    background: linear-gradient(180deg, #1a1f31 0%, #111827 100%);
    border-color: #3f3143;
    box-shadow: 0 10px 30px rgba(2, 6, 23, 0.42);
}

:global(.dark) .input-card:focus-within {
    border-color: rgba(190, 18, 60, 0.4);
    box-shadow: 0 12px 32px rgba(190, 18, 60, 0.12);
}

:global(.dark) .input-label {
    color: #fda4af;
}

:global(.dark) .pos-input {
    background: #0f172a;
    border-color: #334155;
    color: #f1f5f9;
    color-scheme: dark;
}

:global(.dark) .pos-input:focus {
    background: #0f172a;
    border-color: #be123c;
}

:global(.dark) .pos-input::placeholder {
    color: #64748b;
}

:global(.dark) .pos-input option {
    background: #1e293b;
    color: #f1f5f9;
}

:global(.dark) .search-dropdown {
    background: #1e293b;
    border-color: #334155;
}

:global(.dark) .search-item {
    background: #1e293b;
}

:global(.dark) .search-item:hover {
    background: #2d1a1e;
}

:global(.dark) .search-item.border-gray-50 {
    border-bottom-color: #334155;
}

:global(.dark) .search-item span {
    color: #e2e8f0;
}

:global(.dark) .search-item-active {
    background: #be123c;
    border-left-color: #f43f5e;
}

:global(.dark) .search-item .price-tag {
    background: #064e3b;
    color: #6ee7b7;
}

:global(.dark) .hutang-badge {
    background: rgba(18, 12, 24, 0.88);
    border-color: #3f3143;
}

:global(.dark) .pending-section {
    background: linear-gradient(135deg, #1c1506 0%, #27190a 100%);
    border-color: #78350f;
}

:global(.dark) .pending-section .text-amber-700 {
    color: #fbbf24 !important;
}

:global(.dark) .pending-section .text-amber-600 {
    color: #f59e0b !important;
}

:global(.dark) .pending-card {
    background: linear-gradient(180deg, #1a1f31 0%, #111827 100%);
    border-color: #3f3143;
    box-shadow: inset 0 1px 0 rgba(251, 113, 133, 0.04);
}

:global(.dark) .pending-card-active {
    background: linear-gradient(180deg, #320814 0%, #1a0c12 100%);
    border-color: #be123c;
    box-shadow: 0 0 0 1px rgba(244, 63, 94, 0.18), 0 12px 28px rgba(190, 18, 60, 0.16);
}

:global(.dark) .btn-del {
    background: #263548;
    color: #94a3b8;
}

:global(.dark) .btn-del:hover {
    background: #3b1a1a;
    color: #f87171;
}

:global(.dark) .total-bar {
    background: linear-gradient(135deg, #2d0510 0%, #4c0519 50%, #7f1d1d 100%);
}

:global(.dark) .cart-table {
    background: linear-gradient(180deg, #1a1f31 0%, #111827 100%);
    border-color: #3f3143;
    box-shadow: 0 18px 40px rgba(2, 6, 23, 0.35);
}

:global(.dark) .table-head {
    background: linear-gradient(90deg, #4c0519, #881337);
}

:global(.dark) .cart-row {
    border-bottom-color: #334155;
}

:global(.dark) .cart-row:hover {
    background: #2d0510;
}

:global(.dark) .empty-cart-icon {
    background: radial-gradient(circle at top, #3d2a33 0%, #201822 100%);
}

:global(.dark) .qty-input {
    background: #0f172a;
    border-color: #334155;
    color: #f1f5f9;
    color-scheme: dark;
}

:global(.dark) .qty-input:focus {
    background: #0f172a;
    border-color: #be123c;
}

:global(.dark) .subtotal-text {
    color: #fb7185;
}

:global(.dark) .del-btn {
    color: #64748b;
}

:global(.dark) .del-btn:hover {
    color: #f87171;
    background: #3b1a1a;
}

:global(.dark) .action-bar {
    background: rgba(17, 24, 39, 0.92);
    border-top-color: #3f3143;
    box-shadow: 0 -12px 32px rgba(2, 6, 23, 0.45);
    backdrop-filter: blur(14px);
}

:global(.dark) .btn-pending-action {
    background: linear-gradient(180deg, #241b2b 0%, #1a1f31 100%);
    color: #e2e8f0;
    border-color: #3f3143;
}

:global(.dark) .btn-pending-action:hover:not(:disabled) {
    border-color: #be123c;
    color: #fb7185;
    background: #2d0510;
}

:global(.dark) .modal-card {
    background: linear-gradient(180deg, #1a1f31 0%, #111827 100%);
    border-color: #3f3143;
    box-shadow: 0 24px 60px rgba(2, 6, 23, 0.5);
}

:global(.dark) .modal-header {
    background: linear-gradient(135deg, #201b2d 0%, #2d0510 100%);
    border-bottom-color: #3f3143;
}

:global(.dark) .close-btn {
    color: #64748b;
    background: #263548;
}

:global(.dark) .close-btn:hover {
    color: #f87171;
    background: #3b1a1a;
}

:global(.dark) .page-container .text-gray-900,
:global(.dark) .modal-card .text-gray-900 {
    color: #f9fafb !important;
}

:global(.dark) .page-container .text-gray-800,
:global(.dark) .modal-card .text-gray-800 {
    color: #f3f4f6 !important;
}

:global(.dark) .page-container .text-gray-700,
:global(.dark) .modal-card .text-gray-700 {
    color: #d1d5db !important;
}

:global(.dark) .page-container .text-gray-600,
:global(.dark) .modal-card .text-gray-600 {
    color: #9ca3af !important;
}

:global(.dark) .page-container .text-gray-500,
:global(.dark) .modal-card .text-gray-500 {
    color: #94a3b8 !important;
}

:global(.dark) .payment-input-wrap,
:global(.dark) .summary-box,
:global(.dark) .modal-footer {
    background: rgba(18, 12, 24, 0.88);
    border-color: #3f3143;
}

:global(.dark) .payment-input {
    background: #111827;
    border-color: #334155;
    color: #f8fafc;
    color-scheme: dark;
}

:global(.dark) .page-container .text-rose-500 {
    color: #fda4af !important;
}

:global(.dark) .divider {
    background: linear-gradient(90deg, transparent, #334155, transparent);
}

</style>
