<template>
  <AdminLayout>
    <div class="page-container py-2 space-y-2 min-h-screen">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 p-4">
        <div class="lg:col-span-2 space-y-4">
          <div>
            <label class="block text-xl font-semibold label-text mb-2"> Scan Barcode </label>
            <input
              ref="barcodeInputRef"
              v-model="quickBarcodeInput"
              type="text"
              @keyup.enter="handleBarcodeScan"
              :disabled="role_name !== 'admin'"
              placeholder="Scan barcode di sini..."
              class="input-field w-full h-12 px-4 text-xl rounded-lg transition"
            />
          </div>

          <div class="relative">
            <label class="block text-xl font-semibold label-text mb-2"> Cari Produk Manual </label>
            <input
              v-model="productSearchInput"
              type="text"
              style="font-size: 14px"
              placeholder="Ketik nama produk..."
              @input="searchProducts(productSearchInput)"
              @keydown="handleSearchKeydown"
              :disabled="role_name !== 'admin'"
              class="input-field w-full h-12 px-4 text-xl rounded-lg transition"
            />

            <div
              v-if="showSearchResults && searchResults.length > 0"
              class="dropdown-container absolute top-full left-0 right-0 mt-2 rounded-lg shadow-xl z-20 max-h-screen overflow-y-auto"
            >
              <div
                v-for="(product, index) in searchResults"
                :key="product.barcode"
                @click="selectProductFromSearch(product)"
                :class="index === selectedSearchIndex ? 'dropdown-item-active' : 'dropdown-item'"
                class="px-4 py-3 cursor-pointer last:border-b-0 transition border-b border-gray-100"
              >
                <div class="dropdown-text">
                  <div class="font-bold text-lg text-gray-800">
                    {{ product.nama_produk }}
                  </div>
                  <div class="flex justify-between mt-1">
                    <span class="text-sm text-gray-500">{{
                      formatRupiah(product.harga_jual_reguler)
                    }}</span>
                    <span class="text-green-600 font-bold text-md">
                      {{ formatRupiah(product.harga_jual_reguler) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <label class="block text-xl font-semibold label-text mb-2 ml-1"> Pilih Pelanggan </label>
          <select
            ref="pelangganSelectRef"
            v-model="selectedPelangganId"
            required
            style="font-size: 14px"
            @keydown.enter.prevent="focusToPayButton"
            class="input-field w-full h-12 rounded-lg px-4 transition"
          >
            <option value="" disabled>Pilih Pelanggan...</option>
            <option v-if="loadingPelanggan" disabled>Memuat...</option>
            <option v-for="pelanggan in pelangganList" :key="pelanggan.id" :value="pelanggan.id">
              {{ pelanggan.nama_pelanggan }}
            </option>
          </select>

          <div v-if="selectedPelangganId" class="mt-4 card-section p-4 rounded-lg border">
            <div class="flex justify-between items-center">
              <span class="text-lg font-semibold text-gray-600">Hutang:</span>
              <span
                class="text-xl font-bold"
                :class="hutangPelanggan > 0 ? 'text-danger' : 'text-success'"
              >
                {{ formatRupiah(hutangPelanggan) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="pendingTransactions.length > 0" class="space-y-3 px-4">
        <div class="flex items-center gap-2">
          <div class="w-1 h-6 indicator-bar rounded"></div>
          <p class="text-sm font-bold text-title">
            Transaksi Pending ({{ pendingTransactions.length }})
          </p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <div
            v-for="t in pendingTransactions"
            :key="t.id"
            class="p-3 border rounded-lg transition cursor-pointer pending-card hover:shadow-md"
            :class="t.id === currentPendingId ? 'pending-card-active' : 'pending-card-inactive'"
          >
            <div class="mb-2">
              <p class="text-sm font-bold text-gray-800 truncate">{{ t.nama_pelanggan }}</p>
              <p class="text-md font-bold text-orange-600 mt-1">{{ formatRupiah(t.total) }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ t.tanggal_simpan }}</p>
            </div>
            <div class="flex gap-2 justify-end">
              <button
                @click="loadTransaction(t)"
                class="btn-primary-small text-xs px-3 py-1.5 rounded font-medium transition"
              >
                Muat
              </button>
              <button
                @click="removePendingTransaction(t.id)"
                class="btn-secondary-small text-xs px-3 py-1.5 rounded font-medium transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      </div>

      <div
        class="px-6 py-4 bg-footer border-t flex justify-between items-center mx-4 rounded-t-lg mt-4"
      >
        <span class="text-2xl font-semibold text-gray-600">Total Belanja</span>
        <span class="text-4xl font-bold text-gray-900">{{ formatRupiah(totalBelanja) }}</span>
      </div>

      <div class="card-section rounded-b-lg shadow-sm border overflow-hidden p-0 mx-4 mb-24">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead>
              <tr class="table-header border-b">
                <th class="px-4 py-3 text-left text-white font-semibold">No</th>
                <th class="px-4 py-3 text-left text-white font-semibold">Produk</th>
                <th class="px-4 py-3 text-center text-white font-semibold">Qty</th>
                <th class="px-4 py-3 text-right text-white font-semibold">Harga</th>
                <th class="px-4 py-3 text-right text-white font-semibold">Subtotal</th>
                <th class="px-4 py-3 text-center text-white font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              <tr v-if="transactionItems.length === 0">
                <td colspan="6" class="px-6 py-12 text-center text-gray-400">
                  <div class="flex flex-col items-center justify-center space-y-2">
                    <svg
                      class="w-12 h-12 opacity-40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.5"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    <p class="text-lg">Keranjang kosong</p>
                  </div>
                </td>
              </tr>
              <tr
                v-for="(item, index) in transactionItems"
                :key="item.barcode"
                class="hover:bg-blue-50 transition-colors"
              >
                <td class="px-4 py-3 text-lg font-bold text-gray-700">{{ index + 1 }}</td>
                <td class="px-4 py-3">
                  <div class="text-lg font-semibold text-gray-800">{{ item.nama_produk }}</div>
                  <div class="text-xs text-gray-500">{{ item.barcode }}</div>
                </td>
                <td class="px-4 py-3 text-center">
                  <input
                    v-model.number="item.qty"
                    type="number"
                    min="1"
                    @change="updateItem(item.barcode, item.qty)"
                    class="w-20 text-center border-2 border-gray-300 rounded-md py-1 text-lg font-bold focus:border-cyan-500 focus:outline-none"
                  />
                </td>
                <td class="px-4 py-3 text-right text-lg font-medium text-gray-700">
                  {{ formatRupiah(item.harga_jual_reguler) }}
                </td>
                <td class="px-4 py-3 text-right text-lg font-bold text-gray-900">
                  {{ formatRupiah(item.qty * item.harga_jual_reguler) }}
                </td>
                <td class="px-4 py-3 text-center">
                  <button
                    type="button"
                    @click="removeItem(item.barcode)"
                    class="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div
        class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-30"
      >
        <div class="max-w-7xl mx-auto p-4">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              ref="bayarBtnRef"
              @click="openPaymentModal"
              :disabled="transactionItems.length === 0 || !selectedPelangganId"
              class="md:col-span-2 h-14 btn-submit text-xl font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span>BAYAR SEKARANG </span>
            </button>

            <button
              type="button"
              @click.prevent="saveCurrentTransaction"
              :disabled="transactionItems.length === 0 || !selectedPelangganId"
              class="btn-pending h-14 text-lg font-semibold rounded-xl flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                />
              </svg>
              <span>Simpan Pending</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showPaymentModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        class="absolute inset-0 bg-gray-900 bg-opacity-75 transition-opacity"
        @click="closePaymentModal"
      ></div>

      <div
        class="bg-white w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 overflow-hidden transform transition-all scale-100"
      >
        <div class="bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
          <h3 class="text-2xl font-bold text-gray-800">Pembayaran</h3>
          <button
            @click="closePaymentModal"
            class="text-gray-400 hover:text-red-500 transition-colors"
          >
            <svg class="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-6">
          <div>
            <label class="block text-lg font-medium text-gray-700 mb-2">
              Uang Diterima <span class="text-red-500">*</span>
            </label>
            <div class="relative">
              <span
                class="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400"
                >Rp</span
              >
              <input
                ref="pembayaranInputRef"
                :value="uangPembayaranDisplay || uangPembayaran || ''"
                @input="handlePembayaranInput"
                @focus="handlePembayaranFocus"
                @blur="handlePembayaranBlur"
                @keydown.enter="handlePembayaranKeydown"
                type="text"
                required
                placeholder="0"
                class="w-full h-16 pl-14 pr-4 rounded-xl border-2 border-gray-300 focus:border-cyan-500 focus:ring-0 text-4xl font-bold text-gray-900 transition-colors"
                autofocus
              />
            </div>
          </div>

          <div class="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-3">
            <div class="flex justify-between text-gray-600">
              <span>Total Belanja:</span>
              <span class="font-bold text-gray-900">{{ formatRupiah(totalBelanja) }}</span>
            </div>
            <div class="flex justify-between text-gray-600">
              <span>Hutang Lama:</span>
              <span
                class="font-bold"
                :class="hutangPelanggan > 0 ? 'text-red-600' : 'text-green-600'"
              >
                {{ formatRupiah(hutangPelanggan) }}
              </span>
            </div>
            <div class="h-px bg-gray-300 my-2"></div>
            <div class="flex justify-between text-xl font-bold text-gray-800">
              <span>Total Harus Dibayar:</span>
              <span>{{ formatRupiah(totalYangHarusDibayar) }}</span>
            </div>
            <div class="flex justify-between text-lg text-gray-700">
              <span>Uang Masuk:</span>
              <span>{{ formatRupiah(uangPembayaran) }}</span>
            </div>
            <div class="bg-white p-3 rounded-lg border border-gray-200 mt-2">
              <div
                class="flex justify-between text-2xl font-extrabold"
                :class="kembalian >= 0 ? 'text-green-600' : 'text-red-600'"
              >
                <span>{{ kembalian >= 0 ? 'KEMBALIAN' : 'KURANG BAYAR' }}</span>
                <span>{{ formatRupiah(Math.abs(kembalian)) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="px-6 py-4 bg-gray-50 border-t">
          <button
            ref="submitButtonRef"
            type="submit"
            @click.prevent="submitTransaksi"
            :disabled="isSubmitting || totalBelanja === 0"
            class="w-full h-14 btn-submit text-xl font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
          >
            <svg v-if="isSubmitting" class="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
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
const selectedPelangganId = ref('')
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
      } catch (e) {}

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

const handleSearchKeydown = (e: KeyboardEvent) => {
  if (!showSearchResults.value) return
  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedSearchIndex.value = Math.min(
      selectedSearchIndex.value + 1,
      searchResults.value.length - 1,
    )
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedSearchIndex.value = Math.max(selectedSearchIndex.value - 1, -1)
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
  selectedPelangganId.value = ''
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
    <html>
        <head>
            <title>Struk #${trx.id.substring(0, 8)}</title>
            <style>
                body { font-family: 'Times New Roman', monospace; width: 100%; margin: 0; padding: 5px; font-size: 11px; color: #000; }
                .center { text-align: center; }
                .header { margin-bottom: 10px; }
                .meta { border-bottom: 1px dashed #000; padding-bottom: 5px; margin-bottom: 5px; }
                .flex { display: flex; justify-content: space-between; }
                .items { border-bottom: 1px dashed #000; padding-bottom: 5px; margin-bottom: 5px; }
                .item-row { margin-bottom: 2px; }
                .totals { font-weight: bold; }
            </style>
        </head>
        <body onload="window.print(); setTimeout(window.close, 500);">
            <div class="center header">
                <b>${toko.toUpperCase()}</b><br>${alamat}
            </div>
            <div class="meta">
                <div class="flex"><span>${formatDateTime(trx.createdAt)}</span><span>${trx.id.substring(0, 8)}</span></div>
                <div class="flex"><span>Kasir: ${kasir}</span><span>Plg: ${plgName}</span></div>
            </div>
            <div class="items">
                ${items
                  .map(
                    (i) => `
                    <div class="item-row">
                        <div>${i.nama_produk}</div>
                        <div class="flex">
                            <span>${i.qty} x ${formatRupiah(i.harga_jual_reguler)}</span>
                            <span>${formatRupiah(i.qty * i.harga_jual_reguler)}</span>
                        </div>
                    </div>
                `,
                  )
                  .join('')}
            </div>
            <div class="totals">
                <div class="flex"><span>TOTAL</span><span>${formatRupiah(trx.total_harga)}</span></div>
                <div class="flex"><span>BAYAR</span><span>${formatRupiah(trx.total_bayar)}</span></div>
                <div class="flex"><span>KEMBALI</span><span>${formatRupiah(trx.total_kembalian)}</span></div>
                ${trx.sisa_hutang > 0 ? `<div class="flex" style="margin-top:5px"><span>SISA HUTANG</span><span>${formatRupiah(trx.sisa_hutang)}</span></div>` : ''}
            </div>
            <div class="center" style="margin-top: 15px;">Terima Kasih</div>
        </body>
    </html>`

  const popup = window.open('', '', 'width=400,height=600')
  if (popup) {
    popup.document.write(html)
    popup.document.close()
  }
}

// --- Lifecycle ---
onMounted(() => {
  fetchKasirData()
  fetchPelanggan()
  loadPendingTransactions()
  nextTick(() => barcodeInputRef.value?.focus())
})
</script>

<style scoped>
/* Main Layout Colors */
.page-container {
  background-color: #f8fafc;
}

/* Text Colors */
.text-title {
  color: #1e293b;
}
.label-text {
  color: #334155;
}
.text-danger {
  color: #dc2626;
}
.text-success {
  color: #16a34a;
}

/* Cards & Sections */
.card-section {
  background-color: white;
  border-color: #e2e8f0;
}
.bg-footer {
  background-color: #f1f5f9;
}

/* Inputs */
.input-field {
  background-color: white;
  border: 2px solid #cbd5e1;
  color: #0f172a;
}
.input-field:focus {
  outline: none;
  border-color: #06b6d4; /* Cyan-500 */
  box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.2);
}

/* Dropdown */
.dropdown-container {
  background: white;
  border: 1px solid #e2e8f0;
}
.dropdown-item:hover {
  background-color: #f0f9ff;
}
.dropdown-item-active {
  background-color: #00f2ff;
  border-left: 4px solid #06b6d4;
}

/* Pending Cards */
.indicator-bar {
  background-color: #f59e0b;
}
.pending-card {
  background: white;
  border-color: #e2e8f0;
}
.pending-card:hover {
  border-color: #06b6d4;
}
.pending-card-active {
  border-color: #06b6d4;
  background-color: #ecfeff;
}

/* Table */
.table-header {
  background-color: #0e7490; /* Cyan-700 - Grosir Style Darker */
}

/* Buttons (Grosir Style: Cyan Base) */
.btn-submit {
  background-color: #0891b2; /* Cyan-600 */
  color: white;
}
.btn-submit:hover:not(:disabled) {
  background-color: #0e7490;
}
.btn-submit:disabled {
  background-color: #cbd5e1;
  color: #64748b;
}

.btn-pending {
  background-color: white;
  color: #475569;
  border: 2px solid #cbd5e1;
}
.btn-pending:hover:not(:disabled) {
  border-color: #64748b;
  background-color: #f8fafc;
}

.btn-primary-small {
  background-color: #06b6d4;
  color: white;
}
.btn-primary-small:hover {
  background-color: #0891b2;
}

.btn-secondary-small {
  background-color: #e2e8f0;
  color: #475569;
}
.btn-secondary-small:hover {
  background-color: #cbd5e1;
}
</style>
