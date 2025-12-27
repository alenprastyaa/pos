<template>
    <AdminLayout>
        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-semibold text-title"> Data Produk </h1>
                    <p class="text-subtitle"> Kelola inventaris produk dan harga di semua toko. </p>
                </div>
                <div class="flex items-center gap-3">
                    <button @click="downloadProductsExcel"
                        class="btn-secondary-blue flex items-center gap-2 px-4 py-2 rounded-lg transition"
                        :disabled="loadingDownload">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"> </path>
                        </svg>
                        {{ loadingDownload ? 'Mempersiapkan...' : 'Download Excel' }}
                    </button>

                    <button @click="openUploadModal"
                        class="btn-secondary-emerald flex items-center gap-2 px-4 py-2 rounded-lg transition">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12">
                            </path>
                        </svg>
                        Upload Excel
                    </button>

                    <button @click="openCreateModal"
                        class="btn-primary flex items-center gap-2 px-4 py-2 rounded-lg transition">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 4V16M4 10H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                        </svg>
                        Tambah Produk
                    </button>
                </div>
            </div>

            <div class="flex gap-4">
                <div class="flex-1">
                    <input ref="barcodeInputFocus" v-model="searchProduct" type="text"
                        placeholder="Cari produk (nama/barcode)..."
                        class="input-field h-11 w-full rounded-lg px-4 py-2.5 text-sm shadow-sm focus:outline-none" />
                </div>
            </div>
            <div class="card-container overflow-hidden rounded-xl border">
                <div class="max-w-full overflow-x-auto">
                    <table class="min-w-full divide-y divide-border">
                        <thead>
                            <tr class="table-header border-b border-divider">
                                <th class="px-5 py-3 text-left sm:px-6">
                                    <p class="font-medium text-xs uppercase tracking-wider th-text">No</p>
                                </th>
                                <th class="px-5 py-3 text-left sm:px-6">
                                    <p class="font-medium text-xs uppercase tracking-wider th-text">Nama Produk</p>
                                </th>
                                <th class="px-5 py-3 text-left sm:px-6">
                                    <p class="font-medium text-xs uppercase tracking-wider th-text">Barcode</p>
                                </th>
                                <th class="px-5 py-3 text-left sm:px-6">
                                    <p class="font-medium text-xs uppercase tracking-wider th-text">Stok</p>
                                </th>
                                <th class="px-5 py-3 text-left sm:px-6">
                                    <p class="font-medium text-xs uppercase tracking-wider th-text">Harga Beli</p>
                                </th>
                                <th class="px-5 py-3 text-left sm:px-6">
                                    <p class="font-medium text-xs uppercase tracking-wider th-text">Harga Jual Ritel
                                    </p>
                                </th>
                                <th class="px-5 py-3 text-left sm:px-6">
                                    <p class="font-medium text-xs uppercase tracking-wider th-text">Harga Jual Biasa
                                    </p>
                                </th>
                                <th class="px-5 py-3 text-left sm:px-6" v-if="isSuperAdmin">
                                    <p class="font-medium text-xs uppercase tracking-wider th-text">Toko</p>
                                </th>
                                <th class="px-5 py-3 text-left sm:px-6">
                                    <p class="font-medium text-xs uppercase tracking-wider th-text">Aksi</p>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-border bg-white">
                            <tr v-if="loading" class="border-t border-divider">
                                <td :colspan="isSuperAdmin ? 9 : 8" class="px-5 py-4 text-center sm:px-6">
                                    <p class="text-muted">Memuat data...</p>
                                </td>
                            </tr>
                            <tr v-else-if="productList.length === 0" class="border-t border-divider">
                                <td :colspan="isSuperAdmin ? 9 : 8" class="px-5 py-4 text-center sm:px-6">
                                    <p class="text-muted">Tidak ada data produk</p>
                                </td>
                            </tr>
                            <tr v-for="(produk, index) in productList" :key="produk.id"
                                class="border-t border-divider row-hover">
                                <td class="px-5 py-3 sm:px-6">
                                    <p class="text-body text-sm">
                                        {{ (pagination.current_page - 1) * pagination.per_page + index + 1 }}
                                    </p>
                                </td>
                                <td class="px-5 py-3 sm:px-6">
                                    <p class="text-body font-medium text-sm">
                                        {{ produk.nama_produk }}
                                    </p>
                                </td>
                                <td class="px-5 py-3 sm:px-6">
                                    <p class="text-muted text-sm">{{ produk.barcode }}</p>
                                </td>
                                <td class="px-5 py-3 sm:px-6">
                                    <p class="text-body text-sm">
                                        {{ produk.stok_produk }}
                                    </p>
                                </td>
                                <td class="px-5 py-3 sm:px-6">
                                    <p class="text-body text-sm">
                                        {{ formatRupiah(produk.harga_beli) }}
                                    </p>
                                </td>
                                <td class="px-5 py-3 sm:px-6">
                                    <p class="text-body text-sm">
                                        {{ formatRupiah(produk.harga_jual_ritel) }}
                                    </p>
                                </td>
                                <td class="px-5 py-3 sm:px-6">
                                    <p class="text-body text-sm">
                                        {{ formatRupiah(produk.harga_jual_biasa) }}
                                    </p>
                                </td>
                                <td class="px-5 py-3 sm:px-6" v-if="isSuperAdmin">
                                    <p class="text-muted text-sm">
                                        {{ produk.user?.toko?.nama_toko || 'N/A' }}
                                    </p>
                                </td>
                                <td class="px-5 py-3 sm:px-6">
                                    <div class="flex gap-2">
                                        <button @click="openEditModal(produk)"
                                            class="btn-icon-blue px-3 py-1 rounded-lg transition text-sm">
                                            Edit
                                        </button>
                                        <button @click="deleteProductConfirm(produk.id)"
                                            class="btn-icon-red px-3 py-1 rounded-lg transition text-sm">
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="flex items-center justify-between p-4 border-t border-divider bg-subtle">
                    <p class="text-sm text-muted">
                        Menampilkan {{ productList.length }} dari {{ pagination.total }} data.
                    </p>
                    <div v-if="pagination.total_pages > 1" class="flex items-center space-x-2">
                        <button @click="changePage(pagination.current_page - 1)"
                            :disabled="pagination.current_page === 1"
                            class="btn-pagination px-3 py-1 text-sm rounded-lg border transition">
                            Sebelumnya
                        </button>
                        <span class="text-sm text-body">
                            Halaman {{ pagination.current_page }} dari {{ pagination.total_pages }}
                        </span>
                        <button @click="changePage(pagination.current_page + 1)"
                            :disabled="pagination.current_page === pagination.total_pages"
                            class="btn-pagination px-3 py-1 text-sm rounded-lg border transition">
                            Berikutnya
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center modal-overlay">
                <div class="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
                    <div class="flex items-center justify-between mb-4 border-b border-divider pb-3">
                        <h2 class="text-xl font-semibold text-title">
                            {{ isEditing ? 'Edit Produk' : 'Tambah Produk Baru' }}
                        </h2>
                        <button @click="closeModal" class="btn-close">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" />
                            </svg>
                        </button>
                    </div>

                    <form @submit.prevent="submitForm" class="space-y-4">
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-body">
                                Barcode<span class="text-danger">*</span>
                            </label>
                            <input ref="barcodeInput" v-model="formData.barcode" type="text"
                                placeholder="Masukkan barcode" required :disabled="isEditing"
                                class="input-field h-11 w-full rounded-lg px-4 py-2.5 text-sm" />
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-body">
                                Nama Produk<span class="text-danger">*</span>
                            </label>
                            <input v-model="formData.nama_produk" type="text" placeholder="Masukkan nama produk"
                                required class="input-field h-11 w-full rounded-lg px-4 py-2.5 text-sm" />
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-body">
                                Stok Produk<span class="text-danger">*</span>
                            </label>
                            <input v-model.number="formData.stok_produk" type="number" min="0" placeholder="Stok awal"
                                required class="input-field h-11 w-full rounded-lg px-4 py-2.5 text-sm" />
                        </div>

                        <div class="grid grid-cols-3 gap-4">
                            <div>
                                <label class="mb-1.5 block text-sm font-medium text-body">
                                    Harga Beli<span class="text-danger">*</span>
                                </label>
                                <input type="text" placeholder="Harga Beli" required
                                    :value="formData.harga_beli > 0 ? formatToRupiah(formData.harga_beli) : ''"
                                    @input="handlePriceInput($event, 'harga_beli')" @focus="handlePriceFocus"
                                    @blur="handlePriceBlur($event, 'harga_beli')"
                                    class="input-field h-11 w-full rounded-lg px-4 py-2.5 text-sm" />
                            </div>

                            <div>
                                <label class="mb-1.5 block text-sm font-medium text-body">
                                    Jual Ritel<span class="text-danger">*</span>
                                </label>
                                <input type="text" placeholder="Harga Jual Ritel" required
                                    :value="formData.harga_jual_ritel > 0 ? formatToRupiah(formData.harga_jual_ritel) : ''"
                                    @input="handlePriceInput($event, 'harga_jual_ritel')" @focus="handlePriceFocus"
                                    @blur="handlePriceBlur($event, 'harga_jual_ritel')"
                                    class="input-field h-11 w-full rounded-lg px-4 py-2.5 text-sm" />
                            </div>

                            <div>
                                <label class="mb-1.5 block text-sm font-medium text-body">
                                    Jual Biasa<span class="text-danger">*</span>
                                </label>
                                <input type="text" placeholder="Harga Jual Biasa" required
                                    :value="formData.harga_jual_biasa > 0 ? formatToRupiah(formData.harga_jual_biasa) : ''"
                                    @input="handlePriceInput($event, 'harga_jual_biasa')" @focus="handlePriceFocus"
                                    @blur="handlePriceBlur($event, 'harga_jual_biasa')"
                                    class="input-field h-11 w-full rounded-lg px-4 py-2.5 text-sm" />
                            </div>
                        </div>

                        <div v-if="isSuperAdmin && !isEditing" class="pt-2">
                            <label class="mb-1.5 block text-sm font-medium text-body">
                                Toko Tujuan<span class="text-danger">*</span>
                            </label>
                            <select v-model="formData.toko_id" required
                                class="input-field h-11 w-full rounded-lg px-4 py-2.5 text-sm bg-white">
                                <option value="" disabled>Pilih Toko</option>
                                <option v-for="toko in tokoListDropdown" :key="toko.id" :value="toko.id">
                                    {{ toko.nama_toko }}
                                </option>
                            </select>
                            <p v-if="loadingToko" class="text-xs text-muted mt-1">Memuat data toko...</p>
                        </div>

                        <div class="flex gap-3 pt-4 border-t border-divider mt-4">
                            <button type="button" @click="closeModal"
                                class="btn-cancel flex-1 px-4 py-2 rounded-lg transition">
                                Batal
                            </button>
                            <button type="submit" :disabled="isSubmitting"
                                class="btn-primary flex-1 px-4 py-2 rounded-lg transition disabled:opacity-50">
                                {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div v-if="showUploadModal"
                class="fixed inset-0 z-50 flex items-center justify-center modal-overlay backdrop-blur-sm">
                <div class="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
                    <div class="flex items-center justify-between mb-4 border-b border-divider pb-3">
                        <h2 class="text-xl font-semibold text-title">
                            Upload Produk via Excel
                        </h2>
                        <button @click="closeUploadModal" class="btn-close">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" />
                            </svg>
                        </button>
                    </div>

                    <form @submit.prevent="submitUploadExcel" class="space-y-4">
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-body">
                                Pilih File (.xlsx)<span class="text-danger">*</span>
                            </label>
                            <input type="file" ref="fileInput" @change="handleFileUpload" accept=".xlsx, .xls" required
                                class="input-field input-file w-full text-sm rounded-lg cursor-pointer focus:outline-none" />
                            <p class="mt-1 text-sm text-muted">
                                **Pastikan format header kolom sesuai dengan template.**
                            </p>
                        </div>

                        <div v-if="isSuperAdmin" class="pt-2">
                            <label class="mb-1.5 block text-sm font-medium text-body">
                                Toko Tujuan Upload<span class="text-danger">*</span>
                            </label>
                            <select v-model="uploadTokoId" required
                                class="input-field h-11 w-full rounded-lg px-4 py-2.5 text-sm bg-white">
                                <option value="" disabled>Pilih Toko</option>
                                <option v-for="toko in tokoListDropdown" :key="toko.id" :value="toko.id">
                                    {{ toko.nama_toko }}
                                </option>
                            </select>
                        </div>

                        <div v-else class="pt-2">
                            <p class="text-sm text-muted">Produk akan diupload ke toko Anda:
                                <span class="font-semibold text-title">{{ userData?.toko.nama_toko || 'Memuat...'
                                }}</span>
                            </p>
                        </div>

                        <div class="flex gap-3 pt-4 border-t border-divider mt-4">
                            <button type="button" @click="closeUploadModal"
                                class="btn-cancel flex-1 px-4 py-2 rounded-lg transition">
                                Batal
                            </button>
                            <button type="submit" :disabled="isUploading || !fileToUpload"
                                class="btn-secondary-emerald flex-1 px-4 py-2 rounded-lg transition disabled:opacity-50">
                                {{ isUploading ? 'Mengunggah...' : 'Upload Data' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<style scoped>
/* TYPOGRAPHY */
.text-title {
    color: #111827;
    /* Gray 900 */
}

.text-subtitle {
    color: #4b5563;
    /* Gray 600 */
}

.text-body {
    color: #1f2937;
    /* Gray 800 */
}

.text-muted {
    color: #6b7280;
    /* Gray 500 */
}

.text-danger {
    color: #dc2626;
    /* Red 600 */
}

.th-text {
    color: #6b7280;
    /* Gray 500 */
}

/* BACKGROUNDS & BORDERS */
.bg-white {
    background-color: #ffffff;
}

.bg-subtle {
    background-color: #f9fafb;
    /* Gray 50 */
}

.border-divider {
    border-color: #e5e7eb;
    /* Gray 200 */
}

.divide-border> :not([hidden])~ :not([hidden]) {
    border-color: #e5e7eb;
}

/* LAYOUT CONTAINERS */
.card-container {
    background-color: #ffffff;
    border: 1px solid #e5e7eb;
}

/* TABLE */
.table-header {
    background-color: #f9fafb;
}

.row-hover:hover {
    background-color: #f9fafb;
}

/* FORMS & INPUTS */
.input-field {
    background-color: #ffffff;
    border: 1px solid #d1d5db;
    /* Gray 300 */
    color: #111827;
}

.input-field:focus {
    border-color: #2563eb;
    /* Blue 600 */
    outline: none;
    box-shadow: 0 0 0 1px #2563eb;
}

.input-field:disabled {
    background-color: #f3f4f6;
    /* Gray 100 */
    cursor: not-allowed;
}

/* Specific style for file input background */
.input-file {
    background-color: #f9fafb;
    /* Gray 50 */
}

/* BUTTONS */
.btn-primary {
    background-color: #2563eb;
    color: #ffffff;
}

.btn-primary:hover {
    background-color: #1d4ed8;
}

.btn-secondary-blue {
    background-color: #eff6ff;
    color: #2563eb;
}

.btn-secondary-blue:hover {
    background-color: #dbeafe;
}

.btn-secondary-emerald {
    background-color: #ecfdf5;
    color: #059669;
}

.btn-secondary-emerald:hover {
    background-color: #d1fae5;
}

.btn-cancel {
    background-color: #f3f4f6;
    color: #374151;
}

.btn-cancel:hover {
    background-color: #e5e7eb;
}

/* Button Icons (Table) */
.btn-icon-blue {
    background-color: #eff6ff;
    color: #2563eb;
}

.btn-icon-blue:hover {
    background-color: #dbeafe;
}

.btn-icon-red {
    background-color: #fef2f2;
    color: #dc2626;
}

.btn-icon-red:hover {
    background-color: #fee2e2;
}

/* Button Pagination */
.btn-pagination {
    border: 1px solid #d1d5db;
    background-color: #ffffff;
    color: #374151;
}

.btn-pagination:hover:not(:disabled) {
    background-color: #f3f4f6;
}

.btn-pagination:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Close Button (Modal) */
.btn-close {
    color: #6b7280;
    /* text-gray-500 */
    transition: color 0.2s;
}

.btn-close:hover {
    color: #1f2937;
    /* text-gray-800 */
}

/* UTILS */
.modal-overlay {
    background-color: rgba(0, 0, 0, 0.4);
}
</style>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface Toko {
    id: string
    nama_toko: string
}

interface UserData {
    id: string
    full_name: string
    role_name: 'superadmin' | 'admin' | 'staff'
    toko_id: string
    toko: Toko
}

interface Product {
    id: string
    nama_produk: string
    barcode: string
    stok_produk: number
    harga_beli: string
    harga_jual_ritel: string
    harga_jual_biasa: string
    user_id: string
    toko_id: string
    createdAt: string
    updatedAt: string
    user?: { toko?: Toko }
}

interface Pagination {
    total: number
    current_page: number
    per_page: number
    total_pages: number
}

interface ProductFormData {
    id?: string
    nama_produk: string
    barcode: string
    stok_produk: number
    harga_beli: number
    harga_jual_ritel: number
    harga_jual_biasa: number
    toko_id?: string
}



const userData = ref<UserData | null>(null)
const productList = ref<Product[]>([])
const tokoListDropdown = ref<Toko[]>([])
const loading = ref(false)
const loadingToko = ref(false)
const isSubmitting = ref(false)
const showModal = ref(false)
const isEditing = ref(false)

const searchQuery = ref('')
const tokoFilter = ref('')
const barcodeInput = ref<HTMLInputElement | null>(null)
watch(
    () => showModal.value,
    (newVal) => {
        if (newVal && !isEditing.value) {
            nextTick(() => {
                barcodeInput.value?.focus()
            })
        }
    }
)

const pagination = ref<Pagination>({
    total: 0,
    current_page: 1,
    per_page: 10,
    total_pages: 1,
})

const initialFormData: ProductFormData = {
    nama_produk: '',
    barcode: '',
    stok_produk: 0,
    harga_beli: 0,
    harga_jual_ritel: 0,
    harga_jual_biasa: 0,
    toko_id: '',
}
const formData = ref<ProductFormData>({ ...initialFormData })

const loadingDownload = ref(false)
const showUploadModal = ref(false)
const isUploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const fileToUpload = ref<File | null>(null)
const uploadTokoId = ref('')

const isSuperAdmin = computed(() => {
    return userData.value?.role_name === 'superadmin'
})


const debounce = (fn: Function, delay: number) => {
    let timeoutId: ReturnType<typeof setTimeout>
    return function (this: any, ...args: any[]) {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
            fn.apply(this, args)
        }, delay)
    }
}

const getAuthHeader = () => {
    const token = localStorage.getItem('authToken')
    return {
        Authorization: `Bearer ${token}`,
    }
}

const formatRupiah = (number: string | number) => {
    if (number === null || number === undefined) return 'Rp 0'
    const value = typeof number === 'string' ? parseFloat(number) : number
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(value)
}

const fetchUserData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/my/data`, {
            headers: getAuthHeader(),
        })
        if (response.data.success) {
            userData.value = response.data.data
        }
    } catch (error) {
        console.error('Fetch user data error:', error)
    }
}

const fetchToko = async () => {
    loadingToko.value = true
    try {
        const response = await axios.get(`${API_BASE_URL}/toko`, {
            headers: getAuthHeader(),
        })

        if (response.data.success) {
            tokoListDropdown.value = response.data.data
        }
    } catch (error) {
        console.error('Fetch Toko error:', error)
    } finally {
        loadingToko.value = false
    }
}

const fetchProducts = async () => {
    loading.value = true
    try {
        const params: any = {
            page: pagination.value.current_page,
            per_page: pagination.value.per_page,
            search: searchQuery.value,
        }

        if (isSuperAdmin.value && tokoFilter.value) {
            params.toko_id = tokoFilter.value
        }

        const response = await axios.get(`${API_BASE_URL}/produk`, {
            params,
            headers: getAuthHeader(),
        })

        if (response.data.success && response.data.data) {
            const data = response.data.data
            productList.value = data.data
            pagination.value = {
                total: data.total,
                current_page: data.current_page,
                per_page: data.per_page,
                total_pages: data.total_pages,
            }
        } else {
            productList.value = []
            pagination.value = { total: 0, current_page: 1, per_page: pagination.value.per_page, total_pages: 1 }
        }
    } catch (error: any) {
        console.error('Fetch Product error:', error)
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Gagal mengambil data produk',
        })
        router.push("/signin")
    } finally {
        loading.value = false
    }
}

const changePage = (page: number) => {
    if (page > 0 && page <= pagination.value.total_pages) {
        pagination.value.current_page = page
        fetchProducts()
    }
}

const debouncedFetchProducts = debounce(() => {
    pagination.value.current_page = 1
    fetchProducts()
}, 300)

const openCreateModal = async () => {
    isEditing.value = false
    formData.value = { ...initialFormData }

    if (isSuperAdmin.value && tokoListDropdown.value.length === 0) {
        await fetchToko()
    }

    if (!isSuperAdmin.value && userData.value?.toko_id) {
        formData.value.toko_id = userData.value.toko_id
    }

    showModal.value = true
}

const openEditModal = (product: Product) => {
    isEditing.value = true
    formData.value = {
        id: product.id,
        nama_produk: product.nama_produk,
        barcode: product.barcode,
        stok_produk: product.stok_produk,
        harga_beli: parseFloat(product.harga_beli),
        harga_jual_ritel: parseFloat(product.harga_jual_ritel),
        harga_jual_biasa: parseFloat(product.harga_jual_biasa),
    }
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    formData.value = { ...initialFormData }
    isEditing.value = false
}

const validateForm = () => {
    const data = formData.value

    if (!data.nama_produk || !data.barcode) {
        return 'Nama produk dan Barcode wajib diisi.'
    }

    if (data.stok_produk < 0) {
        return 'Stok tidak boleh negatif.'
    }

    if (data.harga_beli <= 0 || data.harga_jual_ritel <= 0 || data.harga_jual_biasa <= 0) {
        return 'Semua harga harus bernilai positif (> 0).'
    }

    if (!isEditing.value && isSuperAdmin.value && !data.toko_id) {
        return 'Toko tujuan wajib dipilih untuk produk baru oleh Super Admin.'
    }

    if (!isEditing.value && !isSuperAdmin.value && !userData.value?.toko_id) {
        return 'Gagal menentukan toko Anda. Coba muat ulang halaman.'
    }


    return null
}

const submitForm = async () => {
    const validationError = validateForm()
    if (validationError) {
        Swal.fire({
            icon: 'warning',
            title: 'Validasi Gagal',
            text: validationError,
        })
        return
    }

    isSubmitting.value = true

    const payload: any = {
        nama_produk: formData.value.nama_produk,
        barcode: formData.value.barcode,
        stok_produk: formData.value.stok_produk,
        harga_beli: formData.value.harga_beli,
        harga_jual_ritel: formData.value.harga_jual_ritel,
        harga_jual_biasa: formData.value.harga_jual_biasa,
    }

    if (!isEditing.value) {
        if (isSuperAdmin.value && formData.value.toko_id) {
            payload.toko_id = formData.value.toko_id
        } else if (!isSuperAdmin.value && userData.value?.toko_id) {
            payload.toko_id = userData.value.toko_id
        }
    }


    try {
        let response
        let url = `${API_BASE_URL}/produk`

        if (isEditing.value) {
            url = `${API_BASE_URL}/produk/${formData.value.id}`
            response = await axios.put(url, payload, { headers: getAuthHeader() })
        } else {
            response = await axios.post(url, payload, { headers: getAuthHeader() })
        }

        if (response.data.success) {
            await Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: response.data.message || `Produk berhasil di${isEditing.value ? 'ubah' : 'tambah'}`,
                timer: 1500,
            })

            closeModal()
            fetchProducts()
        }
    } catch (error: any) {
        console.error('Submit error:', error)
        Swal.fire({
            icon: 'error',
            title: `Error ${isEditing.value ? 'Update' : 'Tambah'}`,
            text: error.response?.data?.message || 'Gagal menyimpan data produk',
        })
    } finally {
        isSubmitting.value = false
    }
}

const deleteProductConfirm = (id: string) => {
    Swal.fire({
        title: 'Hapus Produk?',
        text: 'Data produk akan dihapus secara permanen',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Hapus',
        cancelButtonText: 'Batal',
    }).then((result) => {
        if (result.isConfirmed) {
            deleteProduct(id)
        }
    })
}

const deleteProduct = async (id: string) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/produk/${id}`, {
            headers: getAuthHeader(),
        })

        if (response.data.success) {
            await Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: response.data.message || 'Produk berhasil dihapus',
                timer: 1500,
            })
            fetchProducts()
        }
    } catch (error: any) {
        console.error('Delete error:', error)
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Gagal menghapus produk',
        })
    }
}

const downloadProductsExcel = async () => {
    loadingDownload.value = true;
    try {
        const response = await axios.get(`${API_BASE_URL}/produk/download/excel`, {
            headers: getAuthHeader(),
        });

        if (response.data.success && response.data.data?.path) {
            const url = response.data.data.path;
            const originalName = response.data.data.originalName || 'products.xlsx';

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', originalName);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            Swal.fire('Berhasil', 'File Excel berhasil dibuat dan akan diunduh.', 'success');
        } else {
            throw new Error('Respons tidak valid atau path download tidak ditemukan.');
        }
    } catch (error: any) {
        console.error('Download error:', error);
        Swal.fire('Error', error.response?.data?.message || 'Gagal mendownload file Excel produk.', 'error');
    } finally {
        loadingDownload.value = false;
    }
}

const openUploadModal = async () => {
    fileToUpload.value = null;
    if (fileInput.value) fileInput.value.value = '';

    if (isSuperAdmin.value && tokoListDropdown.value.length === 0) {
        await fetchToko();
    }

    if (isSuperAdmin.value && tokoListDropdown.value.length > 0) {
        uploadTokoId.value = tokoListDropdown.value[0].id;
    }

    if (!isSuperAdmin.value && userData.value?.toko_id) {
        uploadTokoId.value = userData.value.toko_id;
    }

    showUploadModal.value = true;
}

const closeUploadModal = () => {
    showUploadModal.value = false;
    fileToUpload.value = null;
    if (fileInput.value) fileInput.value.value = '';
    uploadTokoId.value = '';
}

const handleFileUpload = (event: Event) => {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
        fileToUpload.value = target.files[0];
    } else {
        fileToUpload.value = null;
    }
}

const submitUploadExcel = async () => {
    if (!fileToUpload.value) {
        Swal.fire('Peringatan', 'Mohon pilih file Excel untuk diunggah.', 'warning');
        return;
    }
    if (isSuperAdmin.value && !uploadTokoId.value) {
        Swal.fire('Peringatan', 'Super Admin wajib memilih Toko Tujuan.', 'warning');
        return;
    }
    if (!isSuperAdmin.value && !userData.value?.toko_id) {
        Swal.fire('Error', 'Data toko Anda tidak termuat. Coba muat ulang halaman.', 'error');
        return;
    }

    isUploading.value = true;

    const formDataPayload = new FormData();
    formDataPayload.append('file', fileToUpload.value);

    if (uploadTokoId.value) {
        formDataPayload.append('toko_id', uploadTokoId.value);
    }


    try {
        const response = await axios.post(
            `${API_BASE_URL}/produk/excel/upload-excel`,
            formDataPayload,
            {
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        if (response.data.success) {
            await Swal.fire({
                icon: 'success',
                title: 'Upload Berhasil',
                text: response.data.message || 'Produk berhasil diunggah dari Excel.',
                timer: 2000,
            });
            closeUploadModal();
            fetchProducts();
        } else {
            throw new Error(response.data.message || 'Terjadi kesalahan saat mengunggah file.');
        }

    } catch (error: any) {
        console.error('Upload error:', error);
        Swal.fire({
            icon: 'error',
            title: 'Upload Gagal',
            text: error.response?.data?.message || 'Gagal mengunggah file Excel produk.',
        });
    } finally {
        isUploading.value = false;
    }
}
watch(
    searchQuery,
    () => {
        debouncedFetchProducts()
    },
    { immediate: false }
)

watch(
    tokoFilter,
    () => {
        pagination.value.current_page = 1
        fetchProducts()
    },
    { immediate: false }
)


const formatToRupiah = (value: number | string): string => {
    if (!value) return ''
    const numValue = typeof value === 'string' ? parseFloat(value.replace(/\D/g, '')) : value
    if (isNaN(numValue)) return ''

    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(numValue)
}


const parseRupiah = (value: string): number => {
    const numValue = parseInt(value.replace(/\D/g, ''), 10)
    return isNaN(numValue) ? 0 : numValue
}



const handlePriceInput = (event: Event, fieldName: keyof ProductFormData) => {
    const input = event.target as HTMLInputElement
    const rawValue = input.value.replace(/\D/g, '') // Hapus semua non-digit
    const numValue = parseInt(rawValue, 10) || 0
    if (fieldName === 'harga_beli') {
        formData.value.harga_beli = numValue
    } else if (fieldName === 'harga_jual_ritel') {
        formData.value.harga_jual_ritel = numValue
    } else if (fieldName === 'harga_jual_biasa') {
        formData.value.harga_jual_biasa = numValue
    }
    input.value = numValue > 0 ? formatToRupiah(numValue) : ''
}

const handlePriceBlur = (event: Event, fieldName: keyof ProductFormData) => {
    const input = event.target as HTMLInputElement
    const numValue = parseRupiah(input.value)
    if (fieldName === 'harga_beli') {
        formData.value.harga_beli = numValue
    } else if (fieldName === 'harga_jual_ritel') {
        formData.value.harga_jual_ritel = numValue
    } else if (fieldName === 'harga_jual_biasa') {
        formData.value.harga_jual_biasa = numValue
    }

    input.value = numValue > 0 ? formatToRupiah(numValue) : ''
}

const handlePriceFocus = (event: Event) => {
    const input = event.target as HTMLInputElement
    const numValue = parseRupiah(input.value)
    input.value = numValue.toString()
}
const searchProduct = ref('')
const barcodeInputFocus = ref<HTMLInputElement | null>(null)

watch(
    searchProduct,
    () => {
        pagination.value.current_page = 1
        debouncedFetchProductsBySearch()
    },
    { immediate: false }
)

const debouncedFetchProductsBySearch = debounce(() => {
    searchQuery.value = searchProduct.value
    fetchProducts()
}, 500)



onMounted(async () => {
    await fetchUserData()
    if (isSuperAdmin.value) {
        await fetchToko()
    }
    await fetchProducts()
    nextTick(() => {
        barcodeInputFocus.value?.focus()
    })
})

</script>
