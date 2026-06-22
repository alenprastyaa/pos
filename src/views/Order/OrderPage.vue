<template>
  <AdminLayout>
    <div class="page-container min-h-screen">
      <div class="top-panel px-5 pt-4 pb-3">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="input-card p-4 rounded-2xl">
            <label class="input-label flex items-center gap-2 mb-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 21c4.97 0 9-4.03 9-9s-4.03-9-9-9-9 4.03-9 9 4.03 9 9 9z" />
              </svg>
              Toko Tujuan
            </label>
            <select v-model="selectedTargetTokoId" @change="onTargetChange"
              class="pos-input w-full h-11 px-4 rounded-xl">
              <option value="" disabled>Pilih toko tujuan</option>
              <option v-for="toko in availableTokoList" :key="toko.id" :value="toko.id">
                {{ toko.nama_toko }}
              </option>
            </select>
          </div>

          <div class="input-card p-4 rounded-2xl relative">
            <label class="input-label flex items-center gap-2 mb-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Cari Produk
            </label>
            <input ref="searchInputRef" v-model="searchQuery" type="text" placeholder="Ketik nama produk..."
              :disabled="!selectedTargetTokoId" @input="searchProducts(searchQuery)" @keydown="handleSearchKeydown"
              class="pos-input w-full h-11 px-4 rounded-xl" />

            <div v-if="showSearchResults && searchResults.length > 0" ref="searchDropdownRef"
              class="search-dropdown absolute left-4 right-4 mt-1 rounded-xl shadow-2xl z-20 max-h-72 overflow-y-auto">
              <div v-for="(product, index) in searchResults" :key="product.id" @click="selectProductFromSearch(product)"
                :class="index === selectedSearchIndex ? 'search-item-active' : 'search-item'"
                class="px-4 py-2.5 cursor-pointer transition-all border-b border-gray-50 last:border-0">
                <div class="flex justify-between items-center">
                  <span class="font-semibold text-sm text-gray-800">{{ product.nama_produk }}</span>
                  <span class="price-tag text-xs font-bold px-2 py-1 rounded-lg ml-2 whitespace-nowrap">
                    {{ formatRupiah(product.harga_jual_ritel ?? product.harga_jual_biasa ?? 0) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="px-5 pb-4">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="lg:col-span-2">
            <div class="cart-table rounded-2xl overflow-hidden shadow-sm">
              <div class="overflow-x-auto">
                <table class="w-full">
                  <thead>
                    <tr class="table-head">
                      <th class="px-4 py-3 text-left text-white text-xs font-semibold uppercase tracking-wider w-10">No
                      </th>
                      <th class="px-4 py-3 text-left text-white text-xs font-semibold uppercase tracking-wider">Produk
                      </th>
                      <th class="px-4 py-3 text-center text-white text-xs font-semibold uppercase tracking-wider w-28">
                        Qty</th>
                      <th class="px-4 py-3 text-right text-white text-xs font-semibold uppercase tracking-wider">Harga
                      </th>
                      <th class="px-4 py-3 text-right text-white text-xs font-semibold uppercase tracking-wider">
                        Subtotal</th>
                      <th class="px-4 py-3 text-center text-white text-xs font-semibold uppercase tracking-wider w-16">
                        Hapus</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="cart.length === 0">
                      <td colspan="6" class="px-6 py-16 text-center">
                        <div class="flex flex-col items-center justify-center space-y-3">
                          <div class="empty-cart-icon w-20 h-20 rounded-full flex items-center justify-center">
                            <svg class="w-10 h-10 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M12 5v14m7-7H5" />
                            </svg>
                          </div>
                          <p class="text-gray-600 font-semibold">Keranjang masih kosong</p>
                          <p class="text-gray-500 text-sm">Cari produk lalu pilih dengan Enter</p>
                        </div>
                      </td>
                    </tr>
                    <tr v-for="(item, index) in cart" :key="item.produk_id" class="cart-row transition-colors">
                      <td class="px-4 py-3 text-sm font-bold text-gray-500">{{ index + 1 }}</td>
                      <td class="px-4 py-3">
                        <div class="text-sm font-bold text-gray-900">{{ item.nama_produk }}</div>
                        <div class="text-xs text-gray-500 font-mono">{{ item.barcode }}</div>
                      </td>
                      <td class="px-4 py-3 text-center">
                        <input v-model.number="item.qty" type="number" min="1"
                          class="qty-input w-20 text-center rounded-lg py-1.5 text-sm font-bold" />
                      </td>
                      <td class="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                        {{ formatRupiah(item.harga) }}
                      </td>
                      <td class="px-4 py-3 text-right text-sm font-extrabold subtotal-text">
                        {{ formatRupiah(item.qty * item.harga) }}
                      </td>
                      <td class="px-4 py-3 text-center">
                        <button type="button" @click="removeFromCart(item.produk_id)"
                          class="del-btn p-2 rounded-xl transition-all">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          </div>

          <div class="space-y-4">
            <div class="total-bar px-6 py-4 rounded-t-2xl flex justify-between items-center">
              <div class="flex items-center gap-3">
                <div class="total-icon w-10 h-10 rounded-xl flex items-center justify-center">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div>
                  <p class="text-xs font-bold text-rose-100 uppercase tracking-wider">Total Belanja</p>
                  <p class="text-xs text-rose-200">{{ cart.length }} item</p>
                </div>
              </div>
              <span class="total-amount text-4xl font-black">{{ formatRupiah(totalHarga) }}</span>
            </div>

            <div class="cart-table mx-0 rounded-b-2xl overflow-hidden shadow-sm">
              <div class="p-4">
                <button type="button" @click="submitOrder" :disabled="!canSubmit"
                  class="w-full h-14 btn-bayar rounded-2xl text-lg font-extrabold flex items-center justify-center gap-3 transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span>{{ submitting ? 'MENGIRIM...' : 'KIRIM ORDER' }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="px-5 pb-6">
        <div class="my-order-card rounded-2xl overflow-hidden shadow-sm">
          <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <div>
              <h3 class="text-lg font-extrabold text-gray-900">My Order</h3>
              <p class="text-sm text-gray-500">Daftar order yang kamu kirim ke toko lain</p>
            </div>
            <button type="button" @click="fetchMyOrders"
              class="btn-refresh inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 4v6h6M20 20v-6h-6M20 10a8 8 0 00-14.83-4M4 14a8 8 0 0014.83 4" />
              </svg>
              Refresh
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="table-head">
                  <th class="px-4 py-3 text-left text-white text-xs font-semibold uppercase tracking-wider w-12">No</th>
                  <th class="px-4 py-3 text-left text-white text-xs font-semibold uppercase tracking-wider">Kode Order
                  </th>
                  <th class="px-4 py-3 text-left text-white text-xs font-semibold uppercase tracking-wider">Tujuan</th>
                  <th class="px-4 py-3 text-center text-white text-xs font-semibold uppercase tracking-wider w-28">
                    Status</th>
                  <th class="px-4 py-3 text-center text-white text-xs font-semibold uppercase tracking-wider w-28">
                    Detail</th>
                  <th class="px-4 py-3 text-right text-white text-xs font-semibold uppercase tracking-wider">Total Item
                  </th>
                  <th class="px-4 py-3 text-right text-white text-xs font-semibold uppercase tracking-wider">Total Qty
                  </th>
                  <th class="px-4 py-3 text-right text-white text-xs font-semibold uppercase tracking-wider">Total Harga
                  </th>
                  <th class="px-4 py-3 text-left text-white text-xs font-semibold uppercase tracking-wider w-40">Tanggal
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="myOrdersLoading">
                  <td colspan="9" class="px-6 py-12 text-center text-gray-500">
                    Memuat data order...
                  </td>
                </tr>
                <tr v-else-if="myOrders.length === 0">
                  <td colspan="9" class="px-6 py-12 text-center">
                    <div class="flex flex-col items-center justify-center gap-2">
                      <p class="font-semibold text-gray-700">Belum ada order yang kamu kirim.</p>
                      <p class="text-sm text-gray-500">Order yang dikirim akan muncul di sini.</p>
                    </div>
                  </td>
                </tr>
                <tr v-for="(order, index) in myOrders" :key="order.id" class="cart-row transition-colors">
                  <td class="px-4 py-3 text-sm font-bold text-gray-500">{{ index + 1 }}</td>
                  <td class="px-4 py-3">
                    <div class="text-sm font-bold text-gray-900">{{ order.order_code }}</div>
                    <div class="text-xs text-gray-500">{{ order.note || 'Tanpa catatan' }}</div>
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-700">
                    {{ order.target_toko?.nama_toko || '-' }}
                  </td>
                  <td class="px-4 py-3 text-center">
                    <span :class="statusBadgeClass(order.status)">
                      {{ statusLabel(order.status) }}
                    </span>
                  </td>
                  <td class="px-4 py-3 text-center">
                    <button type="button" @click="openOrderDetailModal(order)"
                      :disabled="getOrderDetails(order).length === 0"
                      class="btn-refresh inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition-all disabled:cursor-not-allowed disabled:opacity-40">
                      <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
                      </svg>
                      Detail
                    </button>
                  </td>
                  <td class="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    {{ order.total_item || 0 }}
                  </td>
                  <td class="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                    {{ order.total_qty || 0 }}
                  </td>
                  <td class="px-4 py-3 text-right text-sm font-extrabold subtotal-text">
                    {{ formatRupiah(order.total_harga || 0) }}
                  </td>
                  <td class="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                    {{ formatDateTime(order.createdAt) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showOrderDetailModal && selectedDetailOrder"
      class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="qty-modal-backdrop absolute inset-0 transition-opacity" @click="closeOrderDetailModal"></div>

      <div class="qty-modal-card w-full max-w-3xl rounded-3xl shadow-2xl relative z-10 overflow-hidden">
        <div class="qty-modal-header px-6 py-5 flex justify-between items-center">
          <div class="flex items-center gap-3 min-w-0">
            <div class="qty-modal-icon w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                  d="M9 12h6m-6 4h6M7 3h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V21H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
              </svg>
            </div>
            <div class="min-w-0">
              <h3 class="text-lg font-extrabold text-gray-800">Detail Order</h3>
              <p class="text-xs text-gray-600 truncate">
                {{ selectedDetailOrder.order_code }} - {{ selectedDetailOrder.target_toko?.nama_toko || '-' }}
              </p>
            </div>
          </div>
          <button type="button" @click="closeOrderDetailModal" class="qty-close-btn p-2 rounded-xl transition-all">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-4">
          <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div class="qty-summary rounded-2xl p-4">
              <p class="text-xs font-bold uppercase tracking-wider text-gray-500">Total Item</p>
              <p class="mt-1 text-xl font-black text-gray-900">{{ selectedDetailOrder.total_item || 0 }}</p>
            </div>
            <div class="qty-summary rounded-2xl p-4">
              <p class="text-xs font-bold uppercase tracking-wider text-gray-500">Total Qty</p>
              <p class="mt-1 text-xl font-black text-gray-900">{{ selectedDetailOrder.total_qty || 0 }}</p>
            </div>
            <div class="qty-summary rounded-2xl p-4">
              <p class="text-xs font-bold uppercase tracking-wider text-gray-500">Total Harga</p>
              <p class="mt-1 text-xl font-black subtotal-text">{{ formatRupiah(selectedDetailOrder.total_harga || 0) }}
              </p>
            </div>
          </div>

          <div class="cart-table rounded-2xl overflow-hidden">
            <div class="max-h-[55vh] overflow-auto">
              <table class="w-full">
                <thead>
                  <tr class="table-head">
                    <th class="px-4 py-3 text-left text-white text-xs font-semibold uppercase tracking-wider w-12">No
                    </th>
                    <th class="px-4 py-3 text-left text-white text-xs font-semibold uppercase tracking-wider">Produk
                    </th>
                    <th class="px-4 py-3 text-center text-white text-xs font-semibold uppercase tracking-wider w-20">Qty
                    </th>
                    <th class="px-4 py-3 text-right text-white text-xs font-semibold uppercase tracking-wider">Harga
                    </th>
                    <th class="px-4 py-3 text-right text-white text-xs font-semibold uppercase tracking-wider">Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(detail, detailIndex) in getOrderDetails(selectedDetailOrder)"
                    :key="detail.id || `${selectedDetailOrder.id}-${detail.produk_id}-${detail.barcode}`"
                    class="cart-row transition-colors">
                    <td class="px-4 py-3 text-sm font-bold text-gray-500">{{ detailIndex + 1 }}</td>
                    <td class="px-4 py-3">
                      <div class="text-sm font-bold text-gray-900">{{ detail.nama_produk }}</div>
                      <div class="text-xs text-gray-500 font-mono">{{ detail.barcode || '-' }}</div>
                    </td>
                    <td class="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      {{ detail.qty || 0 }}
                    </td>
                    <td class="px-4 py-3 text-right text-sm font-semibold text-gray-700">
                      {{ formatRupiah(detail.harga || 0) }}
                    </td>
                    <td class="px-4 py-3 text-right text-sm font-extrabold subtotal-text">
                      {{ formatRupiah(getDetailSubtotal(detail)) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showQtyModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="qty-modal-backdrop absolute inset-0 transition-opacity" @click="closeQtyModal"></div>

      <div class="qty-modal-card w-full max-w-md rounded-3xl shadow-2xl relative z-10 overflow-hidden">
        <div class="qty-modal-header px-6 py-5 flex justify-between items-center">
          <div class="flex items-center gap-3">
            <div class="qty-modal-icon w-10 h-10 rounded-xl flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                  d="M12 8c-1.657 0-3 1.119-3 2.5S10.343 13 12 13s3 1.119 3 2.5S13.657 18 12 18m0-10V6m0 12v-2" />
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-extrabold text-gray-800">Input Qty</h3>
              <p class="text-xs text-gray-600 truncate max-w-[220px]">
                {{ selectedQtyProduct?.nama_produk || '-' }}
              </p>
            </div>
          </div>
          <button type="button" @click="closeQtyModal" class="qty-close-btn p-2 rounded-xl transition-all">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="p-6 space-y-5">
          <div class="qty-input-wrap rounded-2xl p-4">
            <label class="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 block">
              Jumlah yang dipesan
            </label>
            <input ref="qtyInputRef" v-model.number="qtyValue" type="number" min="1" step="1"
              class="qty-modal-input w-full h-16 px-4 rounded-xl text-4xl font-black text-gray-900" placeholder="1"
              @keydown.enter.prevent="confirmQtyModal" @keydown.esc.prevent="closeQtyModal" />
          </div>

          <div class="qty-summary rounded-2xl p-4 space-y-2.5">
            <div class="flex justify-between text-sm text-gray-700">
              <span>Harga</span>
              <span class="font-bold text-gray-900">
                {{ formatRupiah(selectedQtyProductPrice) }}
              </span>
            </div>
            <div class="flex justify-between text-sm text-gray-700">
              <span>Qty</span>
              <span class="font-bold text-gray-900">{{ qtyValue || 0 }}</span>
            </div>
            <div class="divider my-1"></div>
            <div class="flex justify-between text-base font-bold text-gray-900">
              <span>Total</span>
              <span>{{ formatRupiah(selectedQtyProductSubtotal) }}</span>
            </div>
          </div>
        </div>

        <div class="qty-modal-footer px-6 pb-6">
          <button type="button" @click="confirmQtyModal"
            class="w-full h-14 btn-confirm rounded-2xl text-base font-extrabold flex items-center justify-center gap-3 transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span>TAMBAHKAN (ENTER)</span>
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useRealtimeNotifications } from '@/composables/useRealtimeNotifications'
import './order-theme.css'

interface Toko {
  id: string
  nama_toko: string
}

interface Produk {
  id: string
  nama_produk: string
  barcode: string
  stok_produk: number
  harga_jual_biasa?: number
  harga_jual_ritel?: number
}

interface CartItem {
  produk_id: string
  nama_produk: string
  barcode: string
  harga: number
  qty: number
}

interface OrderDetail {
  id?: string
  produk_id: string
  barcode: string
  nama_produk: string
  harga: number
  qty: number
  subtotal?: number
}

interface OrderSummary {
  id: string
  order_code: string
  note?: string | null
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  total_item: number
  total_qty: number
  total_harga: number
  createdAt: string
  target_toko?: {
    nama_toko: string
  } | null
  order_details?: OrderDetail[]
  OrderDetails?: OrderDetail[]
  orderDetails?: OrderDetail[]
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const currentUser = ref<any>(null)
const tokoList = ref<Toko[]>([])
const targetProducts = ref<Produk[]>([])
const selectedTargetTokoId = ref('')
const searchQuery = ref('')
const searchResults = ref<Produk[]>([])
const showSearchResults = ref(false)
const selectedSearchIndex = ref<number>(-1)
const searchInputRef = ref<HTMLInputElement | null>(null)
const searchDropdownRef = ref<HTMLElement | null>(null)
const showQtyModal = ref(false)
const showOrderDetailModal = ref(false)
const qtyInputRef = ref<HTMLInputElement | null>(null)
const selectedQtyProduct = ref<Produk | null>(null)
const selectedDetailOrder = ref<OrderSummary | null>(null)
const qtyValue = ref<number>(1)
const myOrders = ref<OrderSummary[]>([])
const myOrdersLoading = ref(false)
const cart = ref<CartItem[]>([])
const submitting = ref(false)
const { notifications } = useRealtimeNotifications()

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem('authToken')}`,
})

const availableTokoList = computed(() => {
  const myTokoId = currentUser.value?.toko?.id || currentUser.value?.toko_id
  return tokoList.value.filter((toko) => toko.id !== myTokoId)
})

const totalQty = computed(() => cart.value.reduce((sum, item) => sum + Number(item.qty || 0), 0))
const totalHarga = computed(() => cart.value.reduce((sum, item) => sum + Number(item.qty || 0) * Number(item.harga || 0), 0))
const canSubmit = computed(() => selectedTargetTokoId.value && cart.value.length > 0 && !submitting.value)
const selectedQtyProductPrice = computed(() => {
  if (!selectedQtyProduct.value) return 0
  return Number(selectedQtyProduct.value.harga_jual_ritel ?? selectedQtyProduct.value.harga_jual_biasa ?? 0)
})
const selectedQtyProductSubtotal = computed(() => selectedQtyProductPrice.value * Number(qtyValue.value || 0))

const formatRupiah = (value: number | string) => {
  const numberValue = Number(value || 0)
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(numberValue)
}

const formatDateTime = (value: string) => {
  return new Date(value).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

const statusLabel = (status: OrderSummary['status']) => {
  switch (status) {
    case 'pending':
      return 'PENDING'
    case 'approved':
      return 'APPROVED'
    case 'rejected':
      return 'REJECTED'
    case 'completed':
      return 'COMPLETED'
    default:
      return status
  }
}

const statusBadgeClass = (status: OrderSummary['status']) => {
  const base =
    'inline-flex items-center justify-center rounded-full px-3 py-1 text-[11px] font-extrabold tracking-wider'

  switch (status) {
    case 'pending':
      return `${base} bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300`
    case 'approved':
      return `${base} bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300`
    case 'rejected':
      return `${base} bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300`
    case 'completed':
      return `${base} bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300`
    default:
      return `${base} bg-gray-100 text-gray-700 dark:bg-gray-500/15 dark:text-gray-300`
  }
}

const getOrderDetails = (order: OrderSummary | null) => {
  if (!order) return []
  return order.order_details || order.OrderDetails || order.orderDetails || []
}

const getDetailSubtotal = (detail: OrderDetail) => {
  return Number(detail.subtotal ?? Number(detail.qty || 0) * Number(detail.harga || 0))
}

const openOrderDetailModal = (order: OrderSummary) => {
  selectedDetailOrder.value = order
  showOrderDetailModal.value = true
}

const closeOrderDetailModal = () => {
  showOrderDetailModal.value = false
  selectedDetailOrder.value = null
}

const fetchCurrentUser = async () => {
  const response = await axios.get(`${API_BASE_URL}/user/my/data`, { headers: authHeaders() })
  if (response.data.success) {
    currentUser.value = response.data.data
  }
}

const fetchTokoList = async () => {
  const response = await axios.get(`${API_BASE_URL}/toko`, { headers: authHeaders() })
  if (response.data.success) {
    tokoList.value = response.data.data
  }
}

const fetchMyOrders = async () => {
  myOrdersLoading.value = true
  try {
    const response = await axios.get(`${API_BASE_URL}/order`, {
      headers: authHeaders(),
      params: {
        direction: 'outgoing',
      },
    })

    if (response.data.success) {
      myOrders.value = response.data.data || []
    }
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Gagal mengambil daftar order saya',
    })
  } finally {
    myOrdersLoading.value = false
  }
}

const reloadTargetProducts = async () => {
  if (!selectedTargetTokoId.value) {
    targetProducts.value = []
    searchResults.value = []
    showSearchResults.value = false
    selectedSearchIndex.value = -1
    return
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/produk/toko/${selectedTargetTokoId.value}`, {
      headers: authHeaders(),
    })

    if (response.data.success) {
      targetProducts.value = response.data.data
      searchProducts(searchQuery.value)
    }
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Gagal mengambil produk toko tujuan',
    })
  }
}

const onTargetChange = async () => {
  cart.value = []
  searchQuery.value = ''
  searchResults.value = []
  showSearchResults.value = false
  selectedSearchIndex.value = -1
  closeQtyModal()
  await reloadTargetProducts()
}

const scrollActiveItemIntoView = () => {
  nextTick(() => {
    const dropdown = searchDropdownRef.value
    if (!dropdown) return

    const active = dropdown.querySelector('.search-item-active') as HTMLElement | null
    if (active) active.scrollIntoView({ block: 'nearest' })
  })
}

const searchProducts = async (searchTerm: string) => {
  const q = searchTerm.trim().toLowerCase()

  if (!selectedTargetTokoId.value || !q) {
    searchResults.value = []
    showSearchResults.value = false
    selectedSearchIndex.value = -1
    return
  }

  if (targetProducts.value.length === 0) {
    await reloadTargetProducts()
  }

  searchResults.value = targetProducts.value.filter((product) =>
    `${product.nama_produk} ${product.barcode}`.toLowerCase().includes(q),
  )
  showSearchResults.value = searchResults.value.length > 0
  selectedSearchIndex.value = searchResults.value.length > 0 ? 0 : -1
  scrollActiveItemIntoView()
}

const handleSearchKeydown = (event: KeyboardEvent) => {
  if (!showSearchResults.value || searchResults.value.length === 0) return

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      selectedSearchIndex.value = Math.min(selectedSearchIndex.value + 1, searchResults.value.length - 1)
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

const addToCart = (product: Produk, qty = 1) => {
  const existing = cart.value.find((item) => item.produk_id === product.id)
  const harga = Number(product.harga_jual_ritel ?? product.harga_jual_biasa ?? 0)

  if (existing) {
    existing.qty += qty
    existing.harga = harga
    return
  }

  cart.value.push({
    produk_id: product.id,
    nama_produk: product.nama_produk,
    barcode: product.barcode,
    harga,
    qty,
  })
}

const selectProductFromSearch = async (product: Produk) => {
  selectedQtyProduct.value = product
  qtyValue.value = 1
  showQtyModal.value = true

  searchQuery.value = ''
  searchResults.value = []
  showSearchResults.value = false
  selectedSearchIndex.value = -1

  nextTick(() => {
    qtyInputRef.value?.focus()
    qtyInputRef.value?.select()
  })
}

const closeQtyModal = () => {
  showQtyModal.value = false
  selectedQtyProduct.value = null
  qtyValue.value = 1
  nextTick(() => {
    searchInputRef.value?.focus()
  })
}

const confirmQtyModal = () => {
  if (!selectedQtyProduct.value) return

  const qty = Number(qtyValue.value)
  if (!qty || qty < 1) {
    Swal.fire({
      icon: 'warning',
      title: 'Qty tidak valid',
      text: 'Masukkan qty minimal 1',
    })
    nextTick(() => {
      qtyInputRef.value?.focus()
      qtyInputRef.value?.select()
    })
    return
  }

  addToCart(selectedQtyProduct.value, qty)
  closeQtyModal()
  searchQuery.value = ''
  searchResults.value = []
  showSearchResults.value = false
  selectedSearchIndex.value = -1
  nextTick(() => {
    searchInputRef.value?.focus()
  })
}

const removeFromCart = (produkId: string) => {
  cart.value = cart.value.filter((item) => item.produk_id !== produkId)
}

const submitOrder = async () => {
  if (!canSubmit.value) return

  submitting.value = true
  try {
    const response = await axios.post(
      `${API_BASE_URL}/order`,
      {
        target_toko_id: selectedTargetTokoId.value,
        items: cart.value.map((item) => ({
          produk_id: item.produk_id,
          qty: item.qty,
          harga: item.harga,
        })),
      },
      { headers: authHeaders() },
    )

    if (response.data.success) {
      await Swal.fire({
        icon: 'success',
        title: 'Order terkirim',
        text: response.data.message,
        timer: 1500,
      })
      cart.value = []
      await fetchMyOrders()
    }
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: error.response?.data?.message || 'Gagal mengirim order',
    })
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  try {
    await Promise.all([fetchCurrentUser(), fetchTokoList(), fetchMyOrders()])
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || 'Gagal memuat halaman order',
    })
  }
})

watch(
  () => notifications.value[0]?.id,
  (newId, oldId) => {
    if (!newId || newId === oldId) return
    const latest = notifications.value[0]
    if (latest?.type?.startsWith('order:')) {
      fetchMyOrders()
    }
  },
)
</script>
