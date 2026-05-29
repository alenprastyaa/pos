<template>
  <AdminLayout>
    <div class="page-container min-h-screen">
      <div class="top-panel px-5 pt-4 pb-3">
        <div class="input-card p-4 rounded-2xl space-y-4">
          <div class="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 class="text-xl font-bold text-gray-900">Order Masuk</h1>
              <p class="text-sm text-gray-500">Kelola order yang masuk ke toko Anda.</p>
            </div>

            <div class="flex flex-wrap gap-2">
              <button
                type="button"
                @click="applyFilters"
                class="btn-confirm h-11 px-4 text-sm font-semibold rounded-2xl transition-all"
              >
                Cari
              </button>
              <button
                type="button"
                @click="clearFilters"
                class="btn-refresh h-11 px-4 text-sm font-semibold rounded-2xl transition-all"
              >
                Reset
              </button>
              <button
                type="button"
                @click="fetchIncomingOrders"
                class="btn-bayar h-11 px-4 text-sm font-semibold rounded-2xl transition-all"
              >
                Refresh
              </button>
            </div>
          </div>

          <div class="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div class="xl:col-span-7">
              <label class="input-label flex items-center gap-2 mb-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </label>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari kode order atau nama toko..."
                @keyup.enter="applyFilters"
                class="pos-input w-full h-11 px-4 rounded-xl"
              />
            </div>

            <div class="xl:col-span-2">
              <label class="input-label flex items-center gap-2 mb-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2l-7 7v5l-4 2v-7L3 6V4z" />
                </svg>
                Limit
              </label>
              <select v-model.number="pageSize" @change="applyFilters" class="pos-input w-full h-11 px-4 rounded-xl">
                <option :value="5">5 / halaman</option>
                <option :value="10">10 / halaman</option>
                <option :value="25">25 / halaman</option>
                <option :value="50">50 / halaman</option>
              </select>
            </div>

            <div class="xl:col-span-3">
              <label class="input-label flex items-center gap-2 mb-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Filter Hari
              </label>
              <flat-pickr
                v-model="selectedDate"
                :config="flatpickrConfig"
                placeholder="Pilih tanggal..."
                class="pos-input w-full h-11 px-4 rounded-xl"
              />
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <button
              type="button"
              @click="setQuickDate('')"
              :class="selectedDate === '' ? 'day-chip-active' : 'day-chip'"
              class="day-chip h-10 px-4 rounded-full text-sm font-semibold transition-all"
            >
              Semua Hari
            </button>
            <button
              type="button"
              @click="setQuickDate(todayDateKey)"
              :class="selectedDate === todayDateKey ? 'day-chip-active' : 'day-chip'"
              class="day-chip h-10 px-4 rounded-full text-sm font-semibold transition-all"
            >
              Hari Ini
            </button>
            <button
              type="button"
              @click="setQuickDate(yesterdayDateKey)"
              :class="selectedDate === yesterdayDateKey ? 'day-chip-active' : 'day-chip'"
              class="day-chip h-10 px-4 rounded-full text-sm font-semibold transition-all"
            >
              Kemarin
            </button>
            <div v-if="selectedDate" class="day-chip-summary h-10 px-4 rounded-full text-sm font-semibold flex items-center">
              Filter aktif: {{ selectedDate }}
            </div>
          </div>
        </div>
      </div>

      <div class="px-5 pb-4">
        <div class="space-y-4">
          <div class="input-card rounded-2xl px-4 py-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between text-sm">
            <div class="text-gray-600">
              Menampilkan <span class="font-semibold text-gray-900">{{ paginationStart }}</span>
              - <span class="font-semibold text-gray-900">{{ paginationEnd }}</span>
              dari <span class="font-semibold text-gray-900">{{ totalData }}</span> order
            </div>
            <div class="text-gray-500">
              Halaman <span class="font-semibold text-gray-900">{{ currentPage }}</span>
              dari <span class="font-semibold text-gray-900">{{ totalPage }}</span>
            </div>
          </div>

          <div v-if="groupedIncomingOrders.length === 0 && !isLoadingOrders" class="cart-table rounded-2xl p-8 text-center text-sm text-gray-500 shadow-sm">
            Belum ada order masuk.
          </div>

          <div v-if="isLoadingOrders" class="cart-table rounded-2xl p-8 text-center text-sm text-gray-500 shadow-sm">
            Memuat order masuk...
          </div>

          <div v-for="group in groupedIncomingOrders" :key="group.dateKey" class="cart-table rounded-2xl overflow-hidden shadow-sm">
            <div class="px-5 py-4 border-b border-gray-200 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div class="min-w-0">
                <div class="flex items-center gap-2 flex-wrap">
                  <h2 class="text-base font-semibold text-gray-900">{{ group.label }}</h2>
                  <span class="day-count-badge">{{ group.totalOrder }} order</span>
                </div>
                <p class="text-sm text-gray-500">
                  {{ group.dateKey }} • Total qty {{ group.totalQty }} • {{ formatRupiah(group.totalHarga) }}
                </p>
              </div>
              <div class="day-summary-grid grid grid-cols-3 gap-2 text-sm">
                <div class="day-summary-pill">
                  <p class="text-[11px] uppercase tracking-wider text-gray-500">Order</p>
                  <p class="font-bold text-gray-900">{{ group.totalOrder }}</p>
                </div>
                <div class="day-summary-pill">
                  <p class="text-[11px] uppercase tracking-wider text-gray-500">Qty</p>
                  <p class="font-bold text-gray-900">{{ group.totalQty }}</p>
                </div>
                <div class="day-summary-pill">
                  <p class="text-[11px] uppercase tracking-wider text-gray-500">Nilai</p>
                  <p class="font-bold text-gray-900">{{ formatRupiah(group.totalHarga) }}</p>
                </div>
              </div>
            </div>

            <div class="divide-y divide-gray-100">
              <div v-for="order in group.orders" :key="order.id" class="px-5 py-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div class="min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h3 class="text-base font-semibold text-gray-900">{{ order.order_code }}</h3>
                    <span :class="statusClass(order.status)">{{ statusLabel(order.status) }}</span>
                  </div>
                  <p class="text-sm text-gray-500 truncate">
                    Dari {{ order.source_toko?.nama_toko || '-' }}
                  </p>
                  <p class="text-xs text-gray-400">
                    {{ formatDate(order.createdAt) }}
                  </p>
                </div>

                <div class="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p class="text-gray-500">Item</p>
                      <p class="font-semibold text-gray-900">{{ order.total_item }}</p>
                    </div>
                    <div>
                      <p class="text-gray-500">Qty</p>
                      <p class="font-semibold text-gray-900">{{ order.total_qty }}</p>
                    </div>
                  </div>

                  <div class="flex items-center gap-3">
                    <p class="text-sm font-semibold text-gray-700">{{ formatRupiah(order.total_harga) }}</p>
                    <button type="button" @click="printOrder(order)"
                      class="btn-confirm rounded-xl px-3 py-2 text-sm font-medium transition">
                      Print
                    </button>
                    <button v-if="order.status === 'pending' && canManageIncoming" type="button" @click="openReviewModal(order)"
                      class="btn-load rounded-xl px-3 py-2 text-sm font-medium transition">
                      Review
                    </button>
                    <div v-if="order.status === 'pending' && canManageIncoming" class="flex gap-2">
                      <button type="button" @click="rejectOrder(order.id)"
                        class="btn-del rounded-xl px-3 py-2 text-sm font-medium transition">
                        Tolak
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="groupedIncomingOrders.length > 0" class="input-card rounded-2xl px-4 py-3 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <p class="text-sm text-gray-600">
              Tampilkan data per halaman untuk memudahkan membaca order harian.
            </p>
            <div class="flex flex-wrap items-center gap-2">
              <button
                type="button"
                :disabled="currentPage === 1"
                @click="goToPage(currentPage - 1)"
                class="pagination-btn h-10 px-4 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Sebelumnya
              </button>

              <button
                v-for="page in visiblePages"
                :key="page"
                type="button"
                @click="goToPage(page)"
                :class="page === currentPage ? 'pagination-btn-active' : 'pagination-btn'"
                class="h-10 min-w-10 px-4 rounded-xl text-sm font-semibold transition-all"
              >
                {{ page }}
              </button>

              <button
                type="button"
                :disabled="currentPage === totalPage"
                @click="goToPage(currentPage + 1)"
                class="pagination-btn h-10 px-4 rounded-xl text-sm font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Berikutnya
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showReviewModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="qty-modal-backdrop absolute inset-0 transition-opacity" @click="closeReviewModal"></div>

      <div class="review-modal-card w-full max-w-5xl rounded-3xl shadow-2xl relative z-10 overflow-hidden">
        <div class="qty-modal-header px-6 py-5 flex justify-between items-center">
          <div class="flex items-center gap-3 min-w-0">
            <div class="qty-modal-icon w-10 h-10 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                  d="M9 12h6m-3-3v6m7-6v6a2 2 0 01-2 2h-1l-2 3h-4l-2-3H6a2 2 0 01-2-2v-6m16 0V8a2 2 0 00-2-2h-3l-2-3H9L7 6H4a2 2 0 00-2 2v4" />
              </svg>
            </div>
            <div class="min-w-0">
              <h3 class="text-lg font-extrabold text-gray-800 truncate">
                Review Order {{ selectedReviewOrder?.order_code || '-' }}
              </h3>
              <p class="text-xs text-gray-600 truncate">
                Dari {{ selectedReviewOrder?.source_toko?.nama_toko || '-' }} ke {{ selectedReviewOrder?.target_toko?.nama_toko || '-' }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button type="button" @click="printReviewOrder" class="btn-confirm rounded-xl px-4 py-2 text-sm font-semibold transition">
              Print Order Lengkap
            </button>
            <button type="button" @click="closeReviewModal" class="qty-close-btn p-2 rounded-xl transition-all">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6 grid grid-cols-1 xl:grid-cols-3 gap-5">
          <div class="xl:col-span-2 space-y-4">
            <div class="review-box rounded-2xl p-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-gray-500">Kode Order</p>
                  <p class="font-bold text-gray-900">{{ selectedReviewOrder?.order_code || '-' }}</p>
                </div>
                <div>
                  <p class="text-gray-500">Status</p>
                  <span :class="statusClass(selectedReviewOrder?.status || 'pending')">
                    {{ statusLabel(selectedReviewOrder?.status || 'pending') }}
                  </span>
                </div>
                <div>
                  <p class="text-gray-500">Tanggal</p>
                  <p class="font-bold text-gray-900">{{ formatDate(selectedReviewOrder?.createdAt || '') }}</p>
                </div>
                <div>
                  <p class="text-gray-500">Dari</p>
                  <p class="font-bold text-gray-900">{{ selectedReviewOrder?.source_toko?.nama_toko || '-' }}</p>
                </div>
              </div>
            </div>

            <div class="review-box rounded-2xl overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="table-head">
                      <th class="px-4 py-3 text-left text-white text-xs font-semibold uppercase tracking-wider w-12">No</th>
                      <th class="px-4 py-3 text-left text-white text-xs font-semibold uppercase tracking-wider">Produk</th>
                      <th class="px-4 py-3 text-left text-white text-xs font-semibold uppercase tracking-wider w-32">Barcode</th>
                      <th class="px-4 py-3 text-center text-white text-xs font-semibold uppercase tracking-wider w-24">Qty</th>
                      <th class="px-4 py-3 text-right text-white text-xs font-semibold uppercase tracking-wider">Harga</th>
                      <th class="px-4 py-3 text-right text-white text-xs font-semibold uppercase tracking-wider">Subtotal</th>
                      <th v-if="isReviewEditable" class="px-4 py-3 text-center text-white text-xs font-semibold uppercase tracking-wider w-24">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(detail, index) in activeReviewDetails" :key="detail.id || `${detail.barcode}-${index}`" class="cart-row">
                      <td class="px-4 py-3 text-sm font-bold text-gray-500">{{ index + 1 }}</td>
                      <td class="px-4 py-3">
                        <div class="text-sm font-bold text-gray-900">{{ detail.nama_produk }}</div>
                      </td>
                      <td class="px-4 py-3 text-sm font-mono text-gray-500">{{ detail.barcode }}</td>
                      <td class="px-4 py-3 text-center">
                        <input
                          v-if="isReviewEditable"
                          v-model.number="detail.qty"
                          type="number"
                          min="1"
                          class="qty-input w-20 text-center rounded-lg py-1.5 text-sm font-bold"
                          @change="updateReviewItemQty(index, detail.qty)"
                        />
                        <span v-else class="text-sm font-semibold text-gray-700">{{ detail.qty }}</span>
                      </td>
                      <td class="px-4 py-3 text-right text-sm font-semibold text-gray-700">{{ formatRupiah(detail.harga) }}</td>
                      <td class="px-4 py-3 text-right text-sm font-extrabold subtotal-text">{{ formatRupiah(detail.subtotal) }}</td>
                      <td v-if="isReviewEditable" class="px-4 py-3 text-center">
                        <button
                          type="button"
                          @click="removeReviewItem(index)"
                          class="del-btn p-2 rounded-xl transition-all"
                        >
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                    <tr v-if="activeReviewDetails.length === 0">
                      <td :colspan="isReviewEditable ? 7 : 6" class="px-6 py-10 text-center text-sm text-gray-500">
                        Semua item sudah dihapus. Tambahkan lagi sebelum approve.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="space-y-4">
            <div class="review-summary rounded-2xl p-4 space-y-3">
              <div class="flex justify-between text-sm text-gray-700">
                <span>Total Item</span>
                <span class="font-bold">{{ reviewTotalItem }}</span>
              </div>
              <div class="flex justify-between text-sm text-gray-700">
                <span>Total Qty</span>
                <span class="font-bold">{{ reviewTotalQty }}</span>
              </div>
              <div class="divider my-1"></div>
              <div class="flex justify-between text-base font-bold text-gray-900">
                <span>Total Harga</span>
                <span>{{ formatRupiah(reviewTotalHarga) }}</span>
              </div>
            </div>

            <div class="space-y-3">
              <button v-if="isReviewEditable" type="button" @click="approveSelectedOrder"
                :disabled="activeReviewDetails.length === 0"
                class="w-full h-14 btn-load rounded-2xl text-base font-extrabold flex items-center justify-center gap-3 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                SETUJUI
              </button>
              <button type="button" @click="printReviewOrder"
                class="w-full h-14 btn-bayar rounded-2xl text-base font-extrabold flex items-center justify-center gap-3 transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2h-2m-8 8H5a2 2 0 01-2-2v-4a2 2 0 012-2h2m8 8V7a2 2 0 00-2-2H9a2 2 0 00-2 2v10m8 0a2 2 0 01-2 2H9a2 2 0 01-2-2m8 0H7" />
                </svg>
                PRINT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import flatPickr from 'vue-flatpickr-component'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import './order-theme.css'

interface Toko {
  id: string
  nama_toko: string
}

interface Order {
  id: string
  order_code: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  total_item: number
  total_qty: number
  total_harga: number
  createdAt: string
  source_toko?: Toko
  target_toko?: Toko
  order_details?: OrderDetail[]
  OrderDetails?: OrderDetail[]
  orderDetails?: OrderDetail[]
  note?: string | null
}

interface OrderDetail {
  id?: string
  produk_id?: string
  barcode: string
  nama_produk: string
  harga: number
  qty: number
  subtotal: number
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const flatpickrConfig = {
  dateFormat: 'Y-m-d',
  altInput: true,
  altFormat: 'd F Y',
  disableMobile: true,
}
const localDateFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Jakarta',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
})
const getLocalDateKey = (date: Date) => localDateFormatter.format(date)
const todayDateKey = getLocalDateKey(new Date())
const yesterdayDate = new Date()
yesterdayDate.setDate(yesterdayDate.getDate() - 1)
const yesterdayDateKey = getLocalDateKey(yesterdayDate)

const currentUser = ref<any>(null)
const incomingOrders = ref<Order[]>([])
const searchQuery = ref('')
const selectedDate = ref('')
const pageSize = ref(10)
const currentPage = ref(1)
const totalData = ref(0)
const totalPage = ref(1)
const isLoadingOrders = ref(false)
const showReviewModal = ref(false)
const selectedReviewOrder = ref<Order | null>(null)
const selectedReviewDetails = ref<OrderDetail[]>([])
const editableReviewDetails = ref<OrderDetail[]>([])

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('authToken')}`,
})

const canManageIncoming = computed(() => Boolean(currentUser.value?.toko_id) || currentUser.value?.role_name === 'superadmin')
const isReviewEditable = computed(() => selectedReviewOrder.value?.status === 'pending')
const activeReviewDetails = computed(() => {
  return isReviewEditable.value ? editableReviewDetails.value : selectedReviewDetails.value
})
const reviewTotalItem = computed(() => activeReviewDetails.value.length)
const reviewTotalQty = computed(() =>
  activeReviewDetails.value.reduce((sum, item) => sum + Number(item.qty || 0), 0),
)
const reviewTotalHarga = computed(() =>
  activeReviewDetails.value.reduce((sum, item) => sum + Number(item.subtotal || 0), 0),
)
const paginationStart = computed(() => {
  if (totalData.value === 0) return 0
  return (currentPage.value - 1) * pageSize.value + 1
})
const paginationEnd = computed(() => {
  return Math.min(currentPage.value * pageSize.value, totalData.value)
})

const groupedIncomingOrders = computed(() => {
  const dateLabel = (dateString: string) => {
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return '-'

    const key = getLocalDateKey(date)
    if (key === todayDateKey) return 'Hari ini'
    if (key === yesterdayDateKey) return 'Kemarin'

    return new Intl.DateTimeFormat('id-ID', {
      timeZone: 'Asia/Jakarta',
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date)
  }

  const map = new Map<string, {
    dateKey: string
    label: string
    orders: Order[]
    totalOrder: number
    totalQty: number
    totalHarga: number
  }>()

  for (const order of incomingOrders.value) {
    const date = new Date(order.createdAt)
    if (Number.isNaN(date.getTime())) continue

    const dateKey = getLocalDateKey(date)
    if (!map.has(dateKey)) {
      map.set(dateKey, {
        dateKey,
        label: dateLabel(order.createdAt),
        orders: [],
        totalOrder: 0,
        totalQty: 0,
        totalHarga: 0,
      })
    }

    const group = map.get(dateKey)
    if (!group) continue

    group.orders.push(order)
    group.totalOrder += 1
    group.totalQty += Number(order.total_qty || 0)
    group.totalHarga += Number(order.total_harga || 0)
  }

  return Array.from(map.values())
})

const visiblePages = computed(() => {
  const total = Math.max(totalPage.value, 1)
  const pages = new Set<number>()

  pages.add(1)
  pages.add(total)
  pages.add(currentPage.value - 1)
  pages.add(currentPage.value)
  pages.add(currentPage.value + 1)

  return Array.from(pages)
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b)
})

const formatRupiah = (value: number | string) => {
  const numberValue = Number(value || 0)
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(numberValue)
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const getDateKey = (dateString: string) => {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

const statusClass = (status: string) => {
  if (status === 'approved' || status === 'completed') {
    return 'inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700'
  }
  if (status === 'rejected') {
    return 'inline-flex items-center rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700'
  }
  return 'inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700'
}

const statusLabel = (status: string) => {
  switch (status) {
    case 'approved':
      return 'APPROVED'
    case 'rejected':
      return 'REJECTED'
    case 'completed':
      return 'COMPLETED'
    default:
      return 'PENDING'
  }
}

const getOrderDetails = (order: Order | null) => {
  if (!order) return []
  return order.order_details || order.OrderDetails || order.orderDetails || []
}

const cloneOrderDetails = (details: OrderDetail[]) => {
  return details.map((detail) => ({
    ...detail,
    qty: Number(detail.qty || 0),
    harga: Number(detail.harga || 0),
    subtotal: Number(detail.subtotal || 0),
  }))
}

const fetchCurrentUser = async () => {
  const response = await axios.get(`${API_BASE_URL}/user/my/data`, { headers: authHeaders() })
  if (response.data.success) {
    currentUser.value = response.data.data
  }
}

const fetchIncomingOrders = async () => {
  try {
    isLoadingOrders.value = true
    const params: Record<string, string | number> = {
      direction: 'incoming',
      page: currentPage.value,
      limit: pageSize.value,
    }

    const search = searchQuery.value.trim()
    if (search) {
      params.search = search
    }

    if (selectedDate.value) {
      params.date = selectedDate.value
    }

    const response = await axios.get(`${API_BASE_URL}/order`, {
      headers: authHeaders(),
      params,
    })

    if (response.data.success) {
      const payload = response.data.data
      if (Array.isArray(payload)) {
        incomingOrders.value = payload
        totalData.value = payload.length
        totalPage.value = payload.length > 0 ? 1 : 1
      } else {
        incomingOrders.value = payload.orders || []
        totalData.value = Number(payload.totalData || 0)
        totalPage.value = Math.max(Number(payload.totalPage || 1), 1)
        currentPage.value = Math.min(Number(payload.currentPage || currentPage.value), totalPage.value)
        pageSize.value = Number(payload.limit || pageSize.value)
      }
    }
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Gagal memuat order masuk',
    })
  } finally {
    isLoadingOrders.value = false
  }
}

const applyFilters = async () => {
  currentPage.value = 1
  await fetchIncomingOrders()
}

const clearFilters = async () => {
  searchQuery.value = ''
  selectedDate.value = ''
  currentPage.value = 1
  await fetchIncomingOrders()
}

const goToPage = async (page: number) => {
  if (page < 1 || page > totalPage.value || page === currentPage.value) return
  currentPage.value = page
  await fetchIncomingOrders()
}

const setQuickDate = async (value: string) => {
  selectedDate.value = value
  await applyFilters()
}

const openReviewModal = (order: Order) => {
  selectedReviewOrder.value = order
  selectedReviewDetails.value = cloneOrderDetails(getOrderDetails(order))
  editableReviewDetails.value = cloneOrderDetails(getOrderDetails(order))
  showReviewModal.value = true
}

const closeReviewModal = () => {
  showReviewModal.value = false
  selectedReviewOrder.value = null
  selectedReviewDetails.value = []
  editableReviewDetails.value = []
}

const removeReviewItem = (index: number) => {
  if (!isReviewEditable.value) return
  editableReviewDetails.value = editableReviewDetails.value.filter((_, itemIndex) => itemIndex !== index)
}

const updateReviewItemQty = (index: number, qty: number) => {
  if (!isReviewEditable.value) return

  const nextQty = Number(qty || 0)
  if (nextQty < 1) {
    removeReviewItem(index)
    return
  }

  editableReviewDetails.value = editableReviewDetails.value.map((item, itemIndex) => {
    if (itemIndex !== index) return item
    return {
      ...item,
      qty: nextQty,
      subtotal: nextQty * Number(item.harga || 0),
    }
  })
}

const buildReviewHtml = () => {
  if (!selectedReviewOrder.value) return ''

  const order = selectedReviewOrder.value
  const details = activeReviewDetails.value
  const totalHarga = Number(reviewTotalHarga.value || 0)
  const totalQty = Number(reviewTotalQty.value || 0)
  const totalItem = Number(reviewTotalItem.value || 0)

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
            <div style="font-weight: bold; font-size: 15px; margin-bottom: 5px;">${(order.target_toko?.nama_toko || 'TOKO').toUpperCase()}</div>
            <div style="font-size: 11px;">REVIEW ORDER MASUK</div>
        </div>

        <div style="border-top: 2px dashed #000; border-bottom: 2px dashed #000; padding: 10px 0; margin: 10px 0;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span>ID: ${order.id.substring(0, 8)}</span>
                <span>Status: ${statusLabel(order.status)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span>Tgl:</span>
                <span>${formatDate(order.createdAt)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px;">
                <span>Dari:</span>
                <span>${order.source_toko?.nama_toko || '-'}</span>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px; margin: 10px 0 5px 0; border-bottom: 1px dashed #000; padding-bottom: 5px;">
            <span style="flex: 1; text-align: left;">ITEM</span>
            <span style="width: 30px; text-align: center;">QTY</span>
            <span style="width: 60px; text-align: right;">HARGA</span>
            <span style="width: 60px; text-align: right;">TOTAL</span>
        </div>

        <div style="margin-bottom: 10px;">
            ${details.map((item) => `
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 8px; align-items: flex-start;">
                    <span style="flex: 1; text-align: left; word-break: break-word; padding-right: 5px;">
                        ${item.nama_produk}
                    </span>
                    <span style="width: 30px; text-align: center;">${item.qty}</span>
                    <span style="width: 60px; text-align: right;">${formatRupiah(Number(item.harga || 0))}</span>
                    <span style="width: 60px; text-align: right;">${formatRupiah(Number(item.subtotal || 0))}</span>
                </div>
            `).join('')}
        </div>

        <div style="border-top: 2px dashed #000; margin: 10px 0; padding-top: 10px;">
            <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: bold; margin-bottom: 6px;">
                <span>TOTAL ITEM:</span>
                <span>${totalItem}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span>TOTAL QTY:</span>
                <span>${totalQty}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: bold; margin-bottom: 6px;">
                <span>TOTAL HARGA:</span>
                <span>${formatRupiah(totalHarga)}</span>
            </div>
        </div>

        <div style="margin-top: 15px; font-size: 11px; line-height: 1.6; color: #333;">
            <div>Terima Kasih Atas Review Anda</div>
            <div style="margin: 4px 0;">Periksa order sebelum diproses</div>
            <div style="font-size: 10px;">Order yang sudah disetujui<br>silakan review dan cetak laporan</div>
        </div>
    </div>
  `
}

const printReviewOrder = () => {
  const html = buildReviewHtml()
  if (!html) return

  const fullHtml = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Review Order ${selectedReviewOrder.value?.order_code || ''}</title>
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
        ${html}
      </body>
    </html>`

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const win = window.open(url, '_blank', 'width=400,height=600')
  if (!win) {
    Swal.fire('Error', 'Pop-up print diblokir browser.', 'error')
    URL.revokeObjectURL(url)
    return
  }
  setTimeout(() => URL.revokeObjectURL(url), 30000)
}

const approveSelectedOrder = async () => {
  if (!selectedReviewOrder.value) return
  if (activeReviewDetails.value.length === 0) {
    Swal.fire('Peringatan', 'Order tidak boleh kosong.', 'warning')
    return
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/order/${selectedReviewOrder.value.id}/approve`,
      {
        items: activeReviewDetails.value.map((item) => ({
          produk_id: item.produk_id,
          barcode: item.barcode,
          qty: item.qty,
          harga: item.harga,
        })),
      },
      { headers: authHeaders() },
    )

    if (response.data.success) {
      selectedReviewOrder.value = response.data.data
      selectedReviewDetails.value = cloneOrderDetails(getOrderDetails(response.data.data))
      editableReviewDetails.value = cloneOrderDetails(getOrderDetails(response.data.data))
      await Swal.fire({
        icon: 'success',
        title: 'Order disetujui',
        text: 'Order sudah direview. Silakan print jika diperlukan.',
        timer: 1600,
      })
      await fetchIncomingOrders()
    }
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: error.response?.data?.message || 'Gagal menyetujui order',
    })
  }
}

const buildOrderPrintHtml = (order: Order) => {
  const details = getOrderDetails(order)
  const totalHarga = Number(order.total_harga || 0)
  const totalQty = Number(order.total_qty || 0)
  const totalItem = Number(order.total_item || 0)
  const tanggalDisplay = formatDate(order.createdAt)
  const statusText = statusLabel(order.status)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(value)
  }

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
            <div style="font-weight: bold; font-size: 15px; margin-bottom: 5px;">${(order.target_toko?.nama_toko || 'TOKO').toUpperCase()}</div>
            <div style="font-size: 11px;">REVIEW ORDER MASUK</div>
        </div>

        <div style="border-top: 2px dashed #000; border-bottom: 2px dashed #000; padding: 10px 0; margin: 10px 0;">
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span>ID: ${order.id.substring(0, 8)}</span>
                <span>Status: ${statusText}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span>Tgl:</span>
                <span>${tanggalDisplay}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px;">
                <span>Dari:</span>
                <span>${order.source_toko?.nama_toko || '-'}</span>
            </div>
        </div>

        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px; margin: 10px 0 5px 0; border-bottom: 1px dashed #000; padding-bottom: 5px;">
            <span style="flex: 1; text-align: left;">ITEM</span>
            <span style="width: 30px; text-align: center;">QTY</span>
            <span style="width: 60px; text-align: right;">HARGA</span>
            <span style="width: 60px; text-align: right;">TOTAL</span>
        </div>

        <div style="margin-bottom: 10px;">
            ${details.map((item) => `
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 8px; align-items: flex-start;">
                    <span style="flex: 1; text-align: left; word-break: break-word; padding-right: 5px;">
                        ${item.nama_produk}
                    </span>
                    <span style="width: 30px; text-align: center;">${item.qty}</span>
                    <span style="width: 60px; text-align: right;">${formatCurrency(Number(item.harga || 0))}</span>
                    <span style="width: 60px; text-align: right;">${formatCurrency(Number(item.subtotal || 0))}</span>
                </div>
            `).join('')}
        </div>

        <div style="border-top: 2px dashed #000; margin: 10px 0; padding-top: 10px;">
            <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: bold; margin-bottom: 6px;">
                <span>TOTAL ITEM:</span>
                <span>${totalItem}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                <span>TOTAL QTY:</span>
                <span>${totalQty}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: bold; margin-bottom: 6px;">
                <span>TOTAL HARGA:</span>
                <span>${formatCurrency(totalHarga)}</span>
            </div>
        </div>

        <div style="margin-top: 15px; font-size: 11px; line-height: 1.6; color: #333;">
            <div>Terima Kasih Atas Review Anda</div>
            <div style="margin: 4px 0;">Periksa order sebelum diproses</div>
            <div style="font-size: 10px;">Order yang sudah disetujui<br>silakan review dan cetak laporan</div>
        </div>
    </div>
  `
}

const printOrder = (order: Order) => {
  const printContent = buildOrderPrintHtml(order)
  const fullHtml = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Order ${order.order_code}</title>
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

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const opened = window.open(url, '_blank', 'width=400,height=600')
  if (!opened) {
    Swal.fire('Error', 'Gagal membuka jendela cetak. Periksa setelan pop-up browser Anda.', 'error')
    URL.revokeObjectURL(url)
    return
  }
  setTimeout(() => URL.revokeObjectURL(url), 30000)
}

const approveOrder = async (id: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/order/${id}/approve`, {}, { headers: authHeaders() })
    if (response.data.success) {
      openReviewModal(response.data.data)
    }
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: error.response?.data?.message || 'Gagal menyetujui order',
    })
  }
}

const rejectOrder = async (id: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/order/${id}/reject`, {}, { headers: authHeaders() })
    if (response.data.success) {
      await Swal.fire({ icon: 'success', title: 'Order ditolak', timer: 1400 })
      await fetchIncomingOrders()
    }
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: error.response?.data?.message || 'Gagal menolak order',
    })
  }
}

onMounted(async () => {
  try {
    await Promise.all([fetchCurrentUser(), fetchIncomingOrders()])
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Gagal memuat halaman order masuk',
    })
  }
})
</script>
