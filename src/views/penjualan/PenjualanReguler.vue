<template>
    <AdminLayout>
        <div class="page-container">
            <div class="header-section">
                <p class="page-title">
                    Transaksi Penjualan Eceran
                </p>
            </div>

            <div class="input-row">
                <div class="input-wrapper">
                    <div class="flex-row">
                        <input ref="barcodeInputRef" v-model="quickBarcodeInput" type="text"
                            placeholder="Scan/ketik barcode..." @keyup.enter="handleBarcodeScan"
                            :disabled="role_name !== 'admin'" class="input-field primary-border" />
                    </div>
                </div>

                <div class="input-wrapper relative">
                    <input v-model="productSearchInput" type="text"
                        placeholder="Cari nama produk (Panah Bawah utk pilih)..."
                        @input="searchProducts(productSearchInput)" @keydown.down.prevent="navigateSearch('down')"
                        @keydown.up.prevent="navigateSearch('up')" @keydown.enter.prevent="handleSearchEnter"
                        :disabled="role_name !== 'admin'" class="input-field primary-border" />

                    <div v-if="showSearchResults && searchResults.length > 0"
                        class="search-dropdown border rounded-md bg-white shadow-lg">

                        <div v-for="(product, index) in searchResults" :key="product.barcode"
                            @click="selectProductFromSearch(product)" :class="[
                                'px-3 py-2 cursor-pointer transition',
                                index === selectedSearchIndex ? 'bg-blue-100 search-item-active' : 'search-item-default'
                            ]">

                            <div class="font-semibold text-sm">{{ product.nama_produk }}</div>

                            <div class="text-xs text-gray-600">
                                {{ product.barcode }} - {{ formatRupiah(product.harga_jual_biasa) }}
                            </div>
                        </div>
                    </div>
                </div>

                <select v-model="selectedPelangganId" required class="select-field"
                    @keydown.enter.prevent="focusToPayment">
                    <option value="" disabled>Pilih Pelanggan</option>
                    <option v-if="loadingPelanggan" disabled>Memuat...</option>
                    <option v-for="pelanggan in pelangganList" :key="pelanggan.id" :value="pelanggan.id">
                        {{ pelanggan.nama_pelanggan }}
                    </option>
                </select>
            </div>

            <div v-if="selectedPelangganId" class="debt-card">
                <div class="debt-content">
                    <span class="debt-label">Hutang Pelanggan</span>
                    <span class="debt-value" :class="hutangPelanggan > 0 ? 'text-danger' : 'text-success'">
                        {{ formatRupiah(hutangPelanggan) }}
                    </span>
                </div>
            </div>

            <div v-if="pendingTransactions.length > 0" class="pending-section">
                <p class="pending-header">
                    <svg class="icon-warning" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z"
                            clip-rule="evenodd"></path>
                    </svg>
                    Pending ({{ pendingTransactions.length }})
                </p>
                <div class="pending-grid">
                    <div v-for="t in pendingTransactions" :key="t.id" class="pending-card"
                        :class="{ 'active-pending': t.id === currentPendingId }">
                        <div>
                            <p class="pending-customer">{{ t.nama_pelanggan }}</p>
                            <p class="pending-total">{{ formatRupiah(t.total) }}</p>
                        </div>
                        <div class="pending-actions">
                            <button @click="loadTransaction(t)" class="btn-xs btn-blue">
                                Muat
                            </button>
                            <button @click="removePendingTransaction(t.id)" class="btn-xs btn-red">
                                Hapus
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <hr class="divider">

            <div class="table-container">

                <div class="mobile-list">
                    <div v-if="transactionItems.length === 0" class="empty-state">
                        Belum ada produk.
                    </div>
                    <div v-for="(item, index) in transactionItems" :key="item.barcode" class="mobile-item">
                        <div class="mobile-item-header">
                            <div class="item-title">{{ index + 1 }}. {{ item.nama_produk }}</div>
                            <button type="button" @click="removeItem(item.barcode)" class="btn-icon-red">
                                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </button>
                        </div>
                        <div class="mobile-item-details">
                            <div class="item-barcode">Barcode: {{ item.barcode }}</div>
                            <div class="item-price">{{ formatRupiah(item.harga_jual_biasa) }}</div>
                        </div>
                        <div class="mobile-item-footer">
                            <div class="qty-control">
                                <span class="qty-label">Qty:</span>
                                <input v-model.number="item.qty" type="number" min="1"
                                    @change="updateItem(item.barcode, item.qty)" class="qty-input" />
                            </div>
                            <div class="item-subtotal">{{ formatRupiah(item.qty * item.harga_jual_biasa) }}</div>
                        </div>
                    </div>
                </div>

                <table class="desktop-table">
                    <thead>
                        <tr>
                            <th class="th-no">No</th>
                            <th class="th-product">Produk</th>
                            <th class="th-qty">Qty</th>
                            <th class="th-price">Harga</th>
                            <th class="th-subtotal">Subtotal</th>
                            <th class="th-action"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="transactionItems.length === 0">
                            <td colspan="6" class="empty-table">Belum ada produk.</td>
                        </tr>
                        <tr v-for="(item, index) in transactionItems" :key="item.barcode">
                            <td>{{ index + 1 }}</td>
                            <td>
                                <div class="table-product-name">{{ item.nama_produk }}</div>
                            </td>
                            <td class="td-center">
                                <input v-model.number="item.qty" type="number" min="1"
                                    @change="updateItem(item.barcode, item.qty)" class="table-qty-input" />
                            </td>
                            <td class="td-right table-price">{{ formatRupiah(item.harga_jual_biasa) }}</td>
                            <td class="td-right table-subtotal">{{ formatRupiah(item.qty * item.harga_jual_biasa) }}
                            </td>
                            <td class="td-center">
                                <button type="button" @click="removeItem(item.barcode)" class="btn-icon-red">
                                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="table-footer">
                    <span>Total Belanja</span>
                    <span class="total-amount">{{ formatRupiah(totalBelanja) }}</span>
                </div>
            </div>

            <div class="payment-row">
                <div class="payment-input-group">
                    <label class="input-label">
                        Jumlah Bayar <span class="text-danger">*</span>
                    </label>

                    <input ref="paymentInputRef" :value="formatRupiahInput(uangPembayaran)"
                        @input="handleInputUangPembayaran" @keydown.enter.prevent="submitTransaksi" type="text"
                        inputmode="numeric" required placeholder="Rp 0" class="payment-field" />
                </div>

                <div class="payment-info-group">
                    <div v-if="uangPembayaran > 0" class="change-display"
                        :class="kembalian >= 0 ? 'bg-success-light text-success-dark' : 'bg-danger-light text-danger-dark'">
                        <span class="change-label">{{ kembalian >= 0 ? 'Kembalian' : 'Kurang Bayar' }}</span>
                        <span class="change-value">{{ formatRupiah(Math.abs(kembalian)) }}</span>
                    </div>
                    <div v-else class="change-placeholder">
                        Input pembayaran untuk lihat kembalian
                    </div>
                </div>
            </div>

            <div class="action-row">
                <button type="button" @click.prevent="saveCurrentTransaction"
                    :disabled="transactionItems.length === 0 || !selectedPelangganId" class="btn-action btn-pending">
                    <svg class="icon-sm" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z">
                        </path>
                    </svg>
                    Simpan (Pending)
                </button>

                <button type="submit" @click.prevent="submitTransaksi"
                    :disabled="isSubmitting || totalBelanja === 0 || !selectedPelangganId || uangPembayaran < totalBelanja && kembalian >= 0"
                    class="btn-action btn-process">
                    <svg v-if="isSubmitting" class="spinner" fill="none" viewBox="0 0 24 24">
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
const paymentInputRef = ref<HTMLInputElement | null>(null);
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

const addOrUpdateItem = (product: any, inputQty: number) => {
    const existingItem = transactionItems.value.find(item => item.barcode === product.barcode);
    if (existingItem) {
        existingItem.qty += inputQty;
        transactionItems.value = [existingItem, ...transactionItems.value.filter(i => i.barcode !== product.barcode)];
    } else {
        transactionItems.value.unshift({
            barcode: product.barcode,
            qty: inputQty,
            nama_produk: product.nama_produk,
            harga_jual_biasa: parseFloat(product.harga_jual_biasa),
        });
    }
};
const formatRupiahInput = (number: number) => {
    if (number === 0) return '';
    return 'Rp ' + number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const handleInputUangPembayaran = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const rawValue = target.value.replace(/\D/g, '');
    uangPembayaran.value = rawValue ? parseInt(rawValue) : 0;
};

const focusToPayment = () => {
    paymentInputRef.value?.focus();
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
            input?.focus();
            input?.select();
            input?.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
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
    const isAdded = await promptQuantity(product);
    if (isAdded) {
        productSearchInput.value = '';
        searchResults.value = [];
        showSearchResults.value = false;
        selectedSearchIndex.value = -1;
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

        addOrUpdateItem(product, 1);

        Swal.fire({
            icon: 'success',
            title: 'Masuk Keranjang',
            text: `${product.nama_produk}`,
            timer: 1000,
            showConfirmButton: false,
            toast: true,
            position: 'top-end'
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Tidak Ditemukan',
            text: `Barcode: ${barcode}`,
            showConfirmButton: false,
            timer: 1500
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
        <div style="
            font-family: Arial, Helvetica, sans-serif; 
            font-size: 11px; 
            width: 100%; 
            padding-left: 17px; 
            padding-right: 5px;
            color: #000;
        ">
            <div style="text-align: center; margin-bottom: 10px;">
                <div style="font-size: 14px; margin-bottom: 5px;">${tokoName.toUpperCase()}</div>
                <div style="font-size: 10px; line-height: 1.2;">
                    ${tokoAlamat.replace(/\n/g, '<br>')}
                </div>
            </div>

            <div style="border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 5px 0; margin: 5px 0;">
                <div style="display: flex; justify-content: space-between; font-size: 11px;">
                    <span>ID: ${trx.id.substring(0, 8)}</span>
                    <span>${formatDateTime(trx.createdAt)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 2px;">
                    <span>Kasir: ${kasirFullName}</span>
                    <span>Plg: ${pelangganName}</span>
                </div>
            </div>

            <div style="border-bottom: 1px solid #000; padding-bottom: 5px;">
                ${items.map(item => `
                    <div style="margin-top: 5px;">
                        <div style="text-align: left; font-size: 11px; margin-bottom: 2px;">
                            ${item.nama_produk}
                        </div>
                        <div style="display: flex; justify-content: space-between; font-size: 11px;">
                            <span style="width: 30px; text-align: left;">${item.qty}x</span>
                            <span style="width: 70px; text-align: right;">${formatCurrency(item.harga_jual_biasa)}</span>
                            <span style="flex: 1; text-align: right;">${formatCurrency(item.qty * item.harga_jual_biasa)}</span>
                        </div>
                    </div>
                `).join('')}
            </div>

            <div style="margin-top: 8px;">
                <div style="display: flex; justify-content: space-between; font-size: 12px; margin-bottom: 2px;">
                    <span>TOTAL:</span>
                    <span>Rp ${formatCurrency(total_harga)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
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
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 4px;">
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

    const printWindow = window.open("", "", "width=400,height=600,scrollbars=yes");
    if (!printWindow) return;

    printWindow.document.write(`
        <html>
            <head>
                <style>
                    * { margin: 0; padding: 0; box-sizing: border-box; }
                    
                    body { 
                        font-family: Arial, Helvetica, sans-serif; 
                        font-size: 11px;
                        background: #fff;
                    }

                    @media print {
                        @page {
                            margin: 0;
                            size: auto;
                        }
                        body {
                            padding: 5px;
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
        Swal.fire('Error', 'Pilih pelanggan.', 'error');
        return;
    }

    if (transactionItems.value.length === 0) {
        Swal.fire('Error', 'Keranjang kosong.', 'error');
        return;
    }

    // Workflow langsung proses jika enter dari kolom bayar
    if (kembalian.value < 0) {
        const hutangResult = await Swal.fire({
            title: 'Kurang Bayar (Hutang)',
            text: `Kurang: ${formatRupiah(Math.abs(kembalian.value))}. Lanjut?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, Hutang'
        });
        if (!hutangResult.isConfirmed) return;
    } else {
        // Konfirmasi standard (bisa dihapus jika ingin lebih cepat lagi)
        const confirmResult = await Swal.fire({
            title: 'Proses Transaksi?',
            html: `Total: <b>${formatRupiah(totalBelanja.value)}</b><br>Bayar: <b>${formatRupiah(uangPembayaran.value)}</b>`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Ya',
            cancelButtonText: 'Batal'
        });
        if (!confirmResult.isConfirmed) return;
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

<style scoped>
.page-container {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.header-section {
    border-bottom: 1px solid #e5e7eb;
    padding-bottom: 0.5rem;
}

.page-title {
    font-size: 1.125rem;
    font-weight: 700;
    letter-spacing: -0.025em;
    text-transform: uppercase;
    color: #3b82f6;
}

.input-row {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-end;
}

@media (min-width: 768px) {
    .input-row {
        flex-direction: row;
        gap: 0.75rem;
        margin-bottom: 0;
    }
}

.input-wrapper {
    flex: 1;
    width: 100%;
}

.flex-row {
    display: flex;
    gap: 0.5rem;
}

.input-field {
    width: 100%;
    height: 2.25rem;
    padding-left: 0.75rem;
    padding-right: 0.75rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    color: #111827;
    background-color: #ffffff;
    border: 2px solid transparent;
}

.input-field:focus {
    outline: none;
    box-shadow: 0 0 0 1px #3b82f6;
}

.input-field:disabled {
    background-color: #e5e7eb;
    color: #6b7280;
}

.primary-border {
    border-color: #60a5fa;
}

.select-field {
    flex: 1;
    width: 100%;
    height: 2.25rem;
    border-radius: 0.25rem;
    border: 1px solid #d1d5db;
    background-color: #ffffff;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    font-size: 0.875rem;
    color: #111827;
}

.select-field:focus {
    outline: none;
    box-shadow: 0 0 0 1px #3b82f6;
}

@media (min-width: 768px) {
    .select-field {
        width: auto;
    }
}

.search-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin-top: 0.25rem;
    background-color: #ffffff;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    z-index: 100;
}

.search-item {
    padding: 0.5rem;
    cursor: pointer;
    border-bottom: 1px solid #e5e7eb;
    font-size: 0.875rem;
}

.search-item:last-child {
    border-bottom: none;
}

.search-item-active {
    background-color: #fef08a;
    color: #000000;
}

.search-item-default {
    background-color: #ffffff;
    color: #111827;
}

.search-item-default:hover {
    background-color: #f0fdf4;
}

.product-name {
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.product-meta {
    font-size: 0.75rem;
    color: #6b7280;
}

.debt-card {
    padding: 0.5rem;
    background-color: #eff6ff;
    border: 1px solid #93c5fd;
    border-radius: 0.25rem;
}

.debt-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
}

.debt-label {
    font-weight: 500;
    color: #1d4ed8;
}

.debt-value {
    font-weight: 700;
    font-size: 1rem;
}

.pending-section {
    padding-top: 0.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.pending-header {
    font-size: 0.75rem;
    font-weight: 700;
    color: #111827;
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.icon-warning {
    width: 1rem;
    height: 1rem;
    color: #eab308;
}

.pending-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 0.5rem;
}

@media (min-width: 768px) {
    .pending-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

@media (min-width: 1024px) {
    .pending-grid {
        grid-template-columns: repeat(6, 1fr);
    }
}

.pending-card {
    padding: 0.5rem;
    background-color: #fefce8;
    border: 1px solid #fde047;
    border-radius: 0.25rem;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.active-pending {
    box-shadow: 0 0 0 1px #3b82f6;
}

.pending-customer {
    font-size: 0.75rem;
    color: #854d0e;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 600;
}

.pending-total {
    font-size: 10px;
    color: #4b5563;
}

.pending-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.25rem;
    margin-top: 0.25rem;
}

.btn-xs {
    font-size: 10px;
    padding: 0.125rem 0.375rem;
    border-radius: 0.25rem;
    color: #ffffff;
    border: none;
    cursor: pointer;
}

.btn-blue {
    background-color: #3b82f6;
}

.btn-blue:hover {
    background-color: #2563eb;
}

.btn-red {
    background-color: #ef4444;
}

.btn-red:hover {
    background-color: #dc2626;
}

.divider {
    border-top: 1px solid #e5e7eb;
    margin: 0;
}

.table-container {
    background-color: #ffffff;
    border-radius: 0.25rem;
    box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
    border: 1px solid #e5e7eb;
    overflow-x: auto;
}

.mobile-list {
    display: block;
}

@media (min-width: 768px) {
    .mobile-list {
        display: none;
    }
}

.mobile-item {
    padding: 0.5rem;
    border-bottom: 1px solid #f3f4f6;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.mobile-item-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.item-title {
    font-weight: 600;
    font-size: 0.875rem;
    color: #111827;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.mobile-item-details {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.25rem;
    font-size: 0.75rem;
}

.item-barcode {
    grid-column: span 1;
    color: #6b7280;
}

.item-price {
    grid-column: span 2;
    text-align: right;
}

.mobile-item-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 0.25rem;
    border-top: 1px solid #f3f4f6;
}

.qty-control {
    display: flex;
    align-items: center;
    gap: 0.25rem;
}

.qty-label {
    font-size: 0.75rem;
    color: #374151;
}

.qty-input {
    width: 3rem;
    text-align: center;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    padding: 0.125rem 0.25rem;
    font-size: 0.75rem;
    background-color: #ffffff;
}

.item-subtotal {
    font-weight: 700;
    font-size: 0.875rem;
    color: #2563eb;
}

.desktop-table {
    display: none;
    width: 100%;
    border-collapse: collapse;
}

@media (min-width: 768px) {
    .desktop-table {
        display: table;
    }
}

.desktop-table thead {
    background-color: #f9fafb;
    color: #4b5563;
    font-size: 0.75rem;
    text-transform: uppercase;
}

.desktop-table th {
    padding: 0.5rem 0.75rem;
    text-align: left;
    font-weight: 600;
}

.th-no {
    width: 2.5rem;
}

.th-qty {
    text-align: center;
    width: 6rem;
}

.th-price {
    text-align: right;
    width: 8rem;
}

.th-subtotal {
    text-align: right;
    width: 8rem;
}

.th-action {
    text-align: center;
    width: 2.5rem;
}

.desktop-table td {
    padding: 0.375rem 0.75rem;
    border-bottom: 1px solid #f3f4f6;
    font-size: 0.875rem;
    color: #111827;
}

.td-center {
    text-align: center;
}

.td-right {
    text-align: right;
}

.table-product-name {
    font-weight: 500;
}

.table-qty-input {
    width: 3.5rem;
    text-align: center;
    color: #111827;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    padding: 0.25rem;
    font-size: 0.75rem;
    background-color: #ffffff;
}

.table-price {
    font-size: 0.75rem;
    color: #374151;
}

.table-subtotal {
    font-weight: 600;
    font-size: 0.875rem;
}

.btn-icon-red {
    color: #ef4444;
    padding: 0.25rem;
    background: none;
    border: none;
    cursor: pointer;
}

.btn-icon-red:hover {
    color: #b91c1c;
}

.table-footer {
    padding: 0.5rem 0.75rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #f9fafb;
    border-top: 1px solid #e5e7eb;
    font-weight: 700;
    font-size: 1rem;
    color: #111827;
}

.total-amount {
    color: #2563eb;
}

.payment-row {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    align-items: center;
    padding-top: 0.25rem;
}

@media (min-width: 768px) {
    .payment-row {
        flex-direction: row;
    }
}

.payment-input-group,
.payment-info-group {
    width: 100%;
}

@media (min-width: 768px) {

    .payment-input-group,
    .payment-info-group {
        width: 50%;
    }
}

.input-label {
    display: block;
    font-size: 0.75rem;
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.25rem;
}

.payment-field {
    width: 100%;
    height: 2.5rem;
    padding: 0 0.75rem;
    border-radius: 0.25rem;
    border: 1px solid #d1d5db;
    background-color: #ffffff;
    font-size: 1rem;
    font-weight: 700;
    color: #111827;
}

.payment-field:focus {
    outline: none;
    box-shadow: 0 0 0 2px #3b82f6;
}

.change-display {
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0.75rem;
    border-radius: 0.25rem;
}

.bg-success-light {
    background-color: #f0fdf4;
}

.text-success-dark {
    color: #15803d;
}

.bg-danger-light {
    background-color: #fef2f2;
}

.text-danger-dark {
    color: #b91c1c;
}

.change-label {
    font-size: 0.875rem;
    font-weight: 500;
}

.change-value {
    font-size: 1rem;
    font-weight: 700;
}

.change-placeholder {
    height: 2.5rem;
    display: flex;
    align-items: center;
    padding: 0 0.75rem;
    font-size: 0.75rem;
    color: #6b7280;
    font-style: italic;
    background-color: #f9fafb;
    border-radius: 0.25rem;
    border: 1px solid #e5e7eb;
}

.action-row {
    display: flex;
    gap: 0.5rem;
    padding-top: 0.5rem;
}

.btn-action {
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border-radius: 0.25rem;
    font-size: 0.875rem;
    border: none;
    cursor: pointer;
    transition: transform 0.1s;
}

.btn-action:hover {
    transform: scale(1.01);
}

.btn-action:disabled {
    background-color: #d1d5db;
    cursor: not-allowed;
    transform: none;
}

.btn-pending {
    flex: 1;
    background-color: #ef4444;
    color: #ffffff;
    font-weight: 500;
}

.btn-pending:hover:not(:disabled) {
    background-color: #dc2626;
}

.btn-process {
    flex: 2;
    background-color: #2563eb;
    color: #ffffff;
    font-weight: 700;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

.btn-process:hover:not(:disabled) {
    background-color: #1d4ed8;
}

.icon-sm {
    width: 1rem;
    height: 1rem;
}

.spinner {
    animation: spin 1s linear infinite;
    height: 1rem;
    width: 1rem;
}

@keyframes spin {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}

.text-danger {
    color: #dc2626;
}

.text-success {
    color: #16a34a;
}

.empty-state {
    padding: 1.5rem 0.75rem;
    text-align: center;
    font-size: 0.75rem;
    color: #9ca3af;
}
</style>