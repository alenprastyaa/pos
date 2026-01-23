<template>
    <AdminLayout>
        <div class=" py-2 space-y-2">
            <div class="flex justify-end">
                <input v-model="search" @input="debouncedSearch" type="text" placeholder="Cari nama pelanggan..." class="w-64 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600   
               bg-white dark:bg-white text-sm focus:ring-2 focus:ring-blue-500" />
            </div>

            <hr class="border-gray-200 dark:border-gray-700">
            <div
                class="bg-white dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-700/30">
                        <tr>
                            <th
                                class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Tanggal
                            </th>
                            <th
                                class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                ID Transaksi
                            </th>
                            <th
                                class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Pelanggan
                            </th>
                            <th
                                class="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Total Qty
                            </th>
                            <th
                                class="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Total Harga
                            </th>
                            <th
                                class="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        <tr v-if="transactions.length === 0 && !loading">
                            <td colspan="6" class="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                                Belum ada riwayat transaksi.
                            </td>
                        </tr>
                        <tr v-else-if="loading">
                            <td colspan="6" class="px-4 py-8 text-center text-blue-500 dark:text-blue-400">
                                Memuat data...
                            </td>
                        </tr>
                        <tr v-for="trx in transactions" :key="trx.id"
                            class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td class="px-4 py-2 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                                {{ formatDate(trx.createdAt) }}
                            </td>
                            <td class="px-4 py-2 whitespace-nowrap text-xs font-mono text-gray-700 dark:text-gray-300">
                                {{ trx.id.substring(0, 8) }}...
                            </td>
                            <td class="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                {{ getPelangganName(trx.pelanggan_id) }}
                            </td>
                            <td
                                class="px-4 py-2 whitespace-nowrap text-center text-sm text-gray-700 dark:text-gray-300">
                                {{ trx.total_qty }} ({{ trx.total_item }} item)
                            </td>
                            <td
                                class="px-4 py-2 whitespace-nowrap text-right text-sm font-semibold text-gray-900 dark:text-white">
                                {{ formatRupiah(parseFloat(trx.total_harga)) }}
                            </td>
                            <td class="px-4 py-2 whitespace-nowrap text-center text-sm font-medium space-x-2">
                                <button @click="openDetailModal(trx)"
                                    class="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-200 p-1 rounded inline-flex items-center gap-1">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    Detail
                                </button>
                                <button @click="printStruk(trx)"
                                    class="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-200 p-1 rounded inline-flex items-center gap-1">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4H9a2 2 0 00-2 2v2a2 2 0 002 2h10a2 2 0 002-2v-2a2 2 0 00-2-2m-6-4H9V9m6 0V9m-6 4h.01M15 9h.01" />
                                    </svg>
                                    Print
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div class="flex justify-end items-center gap-3 py-4 px-1">

                    <button @click="prevPage" :disabled="page <= 1"
                        class="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded disabled:opacity-50">
                        Sebelumnya
                    </button>

                    <p class="text-gray-700 dark:text-gray-300">
                        Hal {{ page }} / {{ totalPage }}
                    </p>

                    <button @click="nextPage" :disabled="page >= totalPage"
                        class="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded disabled:opacity-50">
                        Selanjutnya
                    </button>

                </div>


            </div>

        </div>

        <!-- Modal Detail Transaksi -->
        <div v-if="isModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div
                class="relative p-6 w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl transform transition-all">
                <div class="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
                    <h3 class="text-xl font-semibold text-gray-900 dark:text-white">Detail Transaksi</h3>
                    <button @click="closeModal"
                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-700 dark:hover:text-white">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>

                <div v-if="selectedTransaction" class="mt-4 space-y-4">
                    <div class="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p class="font-medium text-gray-700 dark:text-gray-300">ID Transaksi:</p>
                            <p class="font-mono text-gray-900 dark:text-white">{{ selectedTransaction.id }}</p>
                        </div>
                        <div>
                            <p class="font-medium text-gray-700 dark:text-gray-300">Tanggal:</p>
                            <p class="text-gray-900 dark:text-white">{{ formatDateTime(selectedTransaction.createdAt) }}
                            </p>
                        </div>
                        <div>
                            <p class="font-medium text-gray-700 dark:text-gray-300">Pelanggan:</p>
                            <p class="font-bold text-blue-600 dark:text-blue-400">{{
                                getPelangganName(selectedTransaction.pelanggan_id) }}</p>
                        </div>
                        <div>
                            <p class="font-medium text-gray-700 dark:text-gray-300">Total Harga:</p>
                            <p class="text-xl font-bold text-green-600 dark:text-green-400">
                                {{ formatRupiah(parseFloat(selectedTransaction.total_harga)) }}
                            </p>
                        </div>
                    </div>

                    <h4
                        class="font-semibold text-gray-900 dark:text-white mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        Rincian Produk
                    </h4>
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead class="bg-gray-50 dark:bg-gray-700/30">
                                <tr>
                                    <th
                                        class="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300">
                                        Produk</th>
                                    <th
                                        class="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300">
                                        Qty</th>
                                    <th
                                        class="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300">
                                        Harga Satuan</th>
                                    <th
                                        class="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300">
                                        Subtotal</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                <tr v-for="detail in selectedTransaction.transaksi_details" :key="detail.id">
                                    <td class="px-4 py-2 text-sm text-gray-900 dark:text-white">
                                        {{ detail.produk?.nama_produk || 'Produk Tidak Diketahui' }}
                                    </td>
                                    <td class="px-4 py-2 text-center text-sm text-gray-700 dark:text-gray-300">{{
                                        detail.qty }}</td>
                                    <td class="px-4 py-2 text-right text-sm text-gray-700 dark:text-gray-300">
                                        {{ formatRupiah(parseFloat(detail.harga)) }}
                                    </td>
                                    <td
                                        class="px-4 py-2 text-right text-sm font-semibold text-gray-900 dark:text-white">
                                        {{ formatRupiah(parseFloat(detail.subtotal)) }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>

        <!-- Hidden Print Area -->
        <div id="print-area" style="display: none;"></div>

    </AdminLayout>
</template>
<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import { useRouter } from 'vue-router'
const router = useRouter()

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const search = ref("");
let searchTimeout: any = null;

const debouncedSearch = () => {
    if (searchTimeout) clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        page.value = 1;
        fetchTransactions();
    }, 400);
};

// --- Interfaces yang Diperluas ---

interface Produk {
    id: string;
    nama_produk: string;
}

interface TransaksiDetail {
    id: string;
    transaksi_id: string;
    barcode: string;
    harga: string;
    qty: number;
    subtotal: string;
    produk: Produk | null;
}

interface Transaksi {
    id: string;
    pelanggan_id: string;
    total_item: number;
    total_qty: number;
    total_harga: string;
    total_bayar: string;
    total_kembalian: string;
    kasir_name: string;
    createdAt: string;
    transaksi_details: TransaksiDetail[];
}

interface Pelanggan {
    id: string;
    nama_pelanggan: string;
}

// Tambahan Interface untuk data Kasir dan Toko
interface Toko {
    nama_toko: string;
    alamat: string;
}

interface KasirData {
    full_name: string;
    toko: Toko;
}

// --- States (ref) ---

const transactions = ref<Transaksi[]>([]);
const pelangganList = ref<Pelanggan[]>([]);
const loading = ref(false);
const isModalOpen = ref(false);
const selectedTransaction = ref<Transaksi | null>(null);
const page = ref(1);
const limit = ref(10);
const totalPage = ref(1);

// STATE BARU UNTUK DATA KASIR/TOKO
const kasirData = ref<KasirData | null>(null);


// --- Utils & Formatters ---

const getAuthHeader = () => {
    const token = localStorage.getItem('authToken');
    return { Authorization: `Bearer ${token}` };
};

const formatRupiah = (number: number) => {
    if (number === null || number === undefined || isNaN(number)) return '0';
    return new Intl.NumberFormat('id-ID', {
        minimumFractionDigits: 0,
    }).format(number);
};

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
};

const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const getPelangganName = (id: string) => {
    const pelanggan = pelangganList.value.find(p => p.id === id);
    return pelanggan ? pelanggan.nama_pelanggan : 'Umum / Tidak Dikenal';
};

// --- Data Fetching ---

/**
 * FUNGSI BARU: Mengambil data Kasir (full_name) dan Toko (nama_toko, alamat)
 */
const fetchKasirData = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/user/my/data`, {
            headers: getAuthHeader(),
        });
        if (response.data.success) {
            kasirData.value = {
                full_name: response.data.data.full_name,
                toko: {
                    nama_toko: response.data.data.toko.nama_toko,
                    alamat: response.data.data.toko.alamat,
                }
            };
        }
    } catch (error) {
        console.error('Gagal mengambil data kasir/toko:', error);
    }
};

const fetchPelanggan = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/pelanggan`, {
            headers: getAuthHeader(),
        });
        if (response.data.success) {
            pelangganList.value = response.data.data;
        }
    } catch (error) {
        console.error('Gagal mengambil data pelanggan:', error);
    }
};

const fetchTransactions = async () => {
    loading.value = true;
    try {
        const response = await axios.get(`${API_BASE_URL}/transaksi`, {
            headers: getAuthHeader(),
            params: {
                page: page.value,
                limit: limit.value,
                search: search.value
            }
        });

        if (response.data.success) {
            transactions.value = response.data.data.transaksi.map((trx: Transaksi) => ({
                ...trx,
                total_bayar: trx.total_bayar || '0',
                total_kembalian: trx.total_kembalian || '0',
                kasir_name: trx.kasir_name || 'Admin',
            }));
            totalPage.value = response.data.data.totalPage;
            page.value = response.data.data.currentPage;
            limit.value = response.data.data.limit;
        }
    } catch (error: any) {
        console.error('Gagal mengambil data transaksi:', error);

        const errorMessage =
            error.response?.data?.message ||
            error.message ||
            'Gagal memuat data riwayat transaksi.';

        Swal.fire('Error', errorMessage, 'error');
        router.push("/signin");
    } finally {
        loading.value = false;
    }

};

const generateReceiptHTML = (trx: Transaksi): string => {
    const total_bayar = parseFloat(trx.total_bayar || '0');
    const total_harga = parseFloat(trx.total_harga);
    const kembalian = total_bayar - total_harga;
    const hutang = total_harga - total_bayar;

    const tokoName = kasirData.value?.toko.nama_toko.toUpperCase() || 'TOKO DEFAULT';
    const tokoAlamat = kasirData.value?.toko.alamat || 'Alamat tidak tersedia';
    const kasirNameDisplay = trx.kasir_name || kasirData.value?.full_name || 'Admin';

    return `
        <div style="width: 280px; font-family: monospace; font-size: 12px; padding: 10px; text-align: center; margin-left:10px">
            <div style="margin-bottom: 10px;">
                <div style="font-weight: bold; font-size: 14px; margin-bottom: 5px;">${tokoName}</div>
                <div style="font-size: 11px; line-height: 1.4;">
                    ${tokoAlamat.replace(/\n/g, '<br>')}
                </div>
            </div>

            <div style="border-top: 2px dashed #000; border-bottom: 2px dashed #000; padding: 8px 0; margin: 8px 0;">
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
                    <span><strong>ID:</strong> ${trx.id.substring(0, 8)}</span>
                    <span><strong>Kasir:</strong> ${kasirNameDisplay}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px;">
                    <span><strong>Tanggal:</strong></span>
                    <span>${formatDateTime(trx.createdAt)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 11px; margin-top: 3px;">
                    <span><strong>Pelanggan:</strong></span>
                    <span>${getPelangganName(trx.pelanggan_id)}</span>
                </div>
            </div>

            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px; margin: 8px 0 4px 0; border-bottom: 1px dashed #000; padding-bottom: 4px;">
                <span style="flex: 1; text-align: left;">ITEM</span>
                <span style="width: 30px; text-align: center;">QTY</span>
                <span style="width: 50px; text-align: right;">HARGA</span>
                <span style="width: 50px; text-align: right;">TOTAL</span>
            </div>

            <div>
                ${trx.transaksi_details.map(detail => `
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 4px;">
                        <span style="flex: 1; text-align: left; word-break: break-word;">${detail.produk?.nama_produk || 'Unknown'}</span>
                        <span style="width: 30px; text-align: center;">${detail.qty}</span>
                        <span style="width: 50px; text-align: right;">${formatRupiah(parseFloat(detail.harga))}</span>
                        <span style="width: 50px; text-align: right;">${formatRupiah(parseFloat(detail.subtotal))}</span>
                    </div>
                `).join('')}
            </div>

            <div style="border-top: 2px dashed #000; margin: 8px 0; padding-top: 8px;">
                
                <!-- TOTAL BELANJA -->
                <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 12px; margin-bottom: 4px;">
                    <span>TOTAL BELANJA:</span>
                    <span>Rp ${formatRupiah(total_harga)}</span>
                </div>

                <!-- TUNAI -->
                ${total_bayar > 0 ? `
                    <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 2px;">
                        <span>Tunai:</span>
                        <span>Rp ${formatRupiah(total_bayar)}</span>
                    </div>
                ` : ''}

                <!-- KEMBALIAN -->
                ${kembalian > 0 ? `
                    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px; color: #2ecc71;">
                        <span>Kembali:</span>
                        <span>Rp ${formatRupiah(kembalian)}</span>
                    </div>
                ` : ''}

                <!-- HUTANG -->
                ${hutang > 0 ? `
                    <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 11px; color: #e74c3c;">
                        <span>Hutang:</span>
                        <span>Rp ${formatRupiah(hutang)}</span>
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



const printStruk = (trx: Transaksi) => {
    // Fungsi ini tidak perlu diubah, karena ia memanggil generateReceiptHTML yang sudah diperbaiki
    const printContent = generateReceiptHTML(trx);

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

const openDetailModal = (trx: Transaksi) => {
    selectedTransaction.value = trx;
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
};

const nextPage = () => {
    if (page.value < totalPage.value) {
        page.value++;
        fetchTransactions();
    }
};

const prevPage = () => {
    if (page.value > 1) {
        page.value--;
        fetchTransactions();
    }
};

// --- Lifecycle Hook ---
onMounted(async () => {
    // Panggil fungsi baru untuk memuat data kasir dan toko
    await fetchKasirData();
    await fetchPelanggan();
    await fetchTransactions();
});
</script>