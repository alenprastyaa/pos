<template>
  <AdminLayout>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main class="py-6">

        <div v-if="isLoading" class="text-center py-20">
          <svg class="animate-spin h-8 w-8 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          <p class="mt-4 text-gray-600 dark:text-gray-300">Memuat data dashboard...</p>
        </div>

        <div v-else-if="error"
          class="text-center py-20 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 p-6 rounded-lg bg-red-50 dark:bg-red-900/10">
          <p class="font-semibold text-lg">Gagal Memuat Data</p>
          <p class="mt-2">{{ error }}</p>
          <p class="text-sm mt-1">Pastikan Anda sudah login dan token <strong>"authToken"</strong> tersedia di
            LocalStorage.</p>
        </div>

        <div v-else>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div
              class="overflow-hidden rounded-xl border border-gray-200 px-4 pb-3 pt-3 dark:border-gray-800 dark:bg-white/[0.03] sm:px-5 shadow-sm hover:shadow-md transition">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Penjualan Hari Ini</p>
                  <p class="text-xl font-bold text-gray-900 dark:text-white mt-1">Rp {{
                    formatCurrency(dashboardData?.data?.summary?.totalPenjualanHariIni) }}</p>
                </div>
                <div class="rounded-full p-2">
                  <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd"
                      d="M12 14a3 3 0 0 1 3-3h4a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-4a3 3 0 0 1-3-3Zm3-1a1 1 0 1 0 0 2h4v-2h-4Z"
                      clip-rule="evenodd" />
                    <path fill-rule="evenodd"
                      d="M12.293 3.293a1 1 0 0 1 1.414 0L16.414 6h-2.828l-1.293-1.293a1 1 0 0 1 0-1.414ZM12.414 6 9.707 3.293a1 1 0 0 0-1.414 0L5.586 6h6.828ZM4.586 7l-.056.055A2 2 0 0 0 3 9v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2h-4a5 5 0 0 1 0-10h4a2 2 0 0 0-1.53-1.945L17.414 7H4.586Z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <p class="text-xs text-green-600 dark:text-green-400">↑ 12% dari kemarin</p>
            </div>

            <div
              class="overflow-hidden rounded-xl border border-gray-200 bg-white px-4 pb-3 pt-3 dark:border-gray-800 dark:bg-white/[0.03] sm:px-5 shadow-sm hover:shadow-md transition">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Transaksi Hari Ini</p>
                  <p class="text-xl font-bold text-gray-900 dark:text-white mt-1">{{
                    dashboardData?.data?.summary?.totalTransaksiHariIni
                    }}
                  </p>
                </div>
                <div class="rounded-full p-2">
                  <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M4 19v2c0 .5523.44772 1 1 1h14c.5523 0 1-.4477 1-1v-2H4Z" />
                    <path fill="currentColor" fill-rule="evenodd"
                      d="M9 3c0-.55228.44772-1 1-1h8c.5523 0 1 .44772 1 1v3c0 .55228-.4477 1-1 1h-2v1h2c.5096 0 .9376.38314.9939.88957L19.8951 17H4.10498l.90116-8.11043C5.06241 8.38314 5.49047 8 6.00002 8H12V7h-2c-.55228 0-1-.44772-1-1V3Zm1.01 8H8.00002v2.01H10.01V11Zm.99 0h2.01v2.01H11V11Zm5.01 0H14v2.01h2.01V11Zm-8.00998 3H10.01v2.01H8.00002V14ZM13.01 14H11v2.01h2.01V14Zm.99 0h2.01v2.01H14V14ZM11 4h6v1h-6V4Z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <p class="text-xs text-blue-600 dark:text-blue-400">{{ dashboardData?.data?.summary?.totalPelanggan }}
                pelanggan</p>
            </div>

            <div
              class="overflow-hidden rounded-xl border border-gray-200 bg-white px-4 pb-3 pt-3 dark:border-gray-800 dark:bg-white/[0.03] sm:px-5 shadow-sm hover:shadow-md transition">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Stok Unit</p>
                  <p class="text-xl font-bold text-gray-900 dark:text-white mt-1">{{
                    dashboardData?.data?.summary?.totalStok }}</p>
                </div>
                <div class="rounded-full p-2">
                  <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd"
                      d="M12 4a1 1 0 1 0 0 2 1 1 0 0 0 0-2Zm-2.952.462c-.483.19-.868.432-1.19.71-.363.315-.638.677-.831.93l-.106.14c-.21.268-.36.418-.574.527C6.125 6.883 5.74 7 5 7a1 1 0 0 0 0 2c.364 0 .696-.022 1-.067v.41l-1.864 4.2a1.774 1.774 0 0 0 .821 2.255c.255.133.538.202.825.202h2.436a1.786 1.786 0 0 0 1.768-1.558 1.774 1.774 0 0 0-.122-.899L8 9.343V8.028c.2-.188.36-.38.495-.553.062-.079.118-.15.168-.217.185-.24.311-.406.503-.571a1.89 1.89 0 0 1 .24-.177A3.01 3.01 0 0 0 11 7.829V20H5.5a1 1 0 1 0 0 2h13a1 1 0 1 0 0-2H13V7.83a3.01 3.01 0 0 0 1.63-1.387c.206.091.373.19.514.29.31.219.532.465.811.78l.025.027.02.023v1.78l-1.864 4.2a1.774 1.774 0 0 0 .821 2.255c.255.133.538.202.825.202h2.436a1.785 1.785 0 0 0 1.768-1.558 1.773 1.773 0 0 0-.122-.899L18 9.343v-.452c.302.072.633.109 1 .109a1 1 0 1 0 0-2c-.48 0-.731-.098-.899-.2-.2-.12-.363-.293-.651-.617l-.024-.026c-.267-.3-.622-.7-1.127-1.057a5.152 5.152 0 0 0-1.355-.678 3.001 3.001 0 0 0-5.896.04Z"
                      clip-rule="evenodd" />
                  </svg>
                </div>
              </div>
              <p class="text-xs text-orange-600 dark:text-orange-400">{{ dashboardData?.data?.summary?.totalProduk }}
                produk</p>
            </div>

            <div
              class="overflow-hidden rounded-xl border border-gray-200 bg-white px-4 pb-3 pt-3 dark:border-gray-800 dark:bg-white/[0.03] sm:px-5 shadow-sm hover:shadow-md transition">
              <div class="flex items-center justify-between mb-3">
                <div>
                  <p class="text-xs font-medium text-gray-500 dark:text-gray-400">Total Piutang</p>
                  <p class="text-xl font-bold text-gray-900 dark:text-white mt-1">Rp {{
                    formatCurrency(dashboardData?.data?.summary?.totalPiutang) }}</p>
                </div>
                <div class="rounded-full p-2">
                  <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 17.345a4.76 4.76 0 0 0 2.558 1.618c2.274.589 4.512-.446 4.999-2.31.487-1.866-1.273-3.9-3.546-4.49-2.273-.59-4.034-2.623-3.547-4.488.486-1.865 2.724-2.899 4.998-2.31.982.236 1.87.793 2.538 1.592m-3.879 12.171V21m0-18v2.2" />
                  </svg>
                </div>
              </div>
              <p
                :class="['text-xs', dashboardData?.data?.summary?.totalPiutang > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400']">
                Status: {{ dashboardData?.data?.summary?.totalPiutang > 0 ? 'Ada Piutang' : 'Lancar' }}
              </p>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
            <div
              class="lg:col-span-2 overflow-hidden rounded-xl border border-gray-200 bg-white px-4 pb-3 pt-3 dark:border-gray-800 dark:bg-white/[0.03] sm:px-5 shadow-sm">
              <div class="mb-4">
                <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">Grafik Penjualan</h3>
              </div>
              <div v-if="!chartLoading && chartSeries.length > 0 && chartSeries[0].data.length > 0" class="w-full">
                <apexchart type="line" height="300" :options="chartOptions" :series="chartSeries"></apexchart>
              </div>
              <div v-else class="text-center py-10 text-gray-400">
                <p>Tidak ada data penjualan untuk grafik.</p>
              </div>
            </div>

            <div
              class="overflow-hidden rounded-xl border border-gray-200 bg-white px-4 pb-3 pt-3 dark:border-gray-800 dark:bg-white/[0.03] sm:px-5 shadow-sm">
              <h3 class="text-base font-semibold text-gray-800 dark:text-white/90 mb-4">
                Ringkasan Bulan Ini
              </h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center py-1 border-b border-gray-200 dark:border-gray-700">
                  <span class="text-gray-600 dark:text-gray-400 text-xs">Total Stok</span>
                  <span class="font-semibold text-gray-900 dark:text-white text-sm">
                    {{ dashboardData?.data?.summary?.totalStok }}
                  </span>
                </div>
                <div class="flex justify-between items-center py-1 border-b border-gray-200 dark:border-gray-700">
                  <span class="text-gray-600 dark:text-gray-400 text-xs">Total Produk</span>
                  <span class="font-semibold text-gray-900 dark:text-white text-sm">
                    {{ dashboardData?.data?.summary?.totalProduk }}
                  </span>
                </div>
                <div class="flex justify-between items-center py-1 border-b border-gray-200 dark:border-gray-700">
                  <span class="text-gray-600 dark:text-gray-400 text-xs">Penjualan Hari Ini</span>
                  <span class="font-semibold text-gray-900 dark:text-white text-sm">
                    Rp {{ formatCurrency(dashboardData?.data?.summary?.totalPenjualanHariIni) }}
                  </span>
                </div>
                <div class="flex justify-between items-center py-1 border-b border-gray-200 dark:border-gray-700">
                  <span class="text-gray-600 dark:text-gray-400 text-xs">Transaksi Hari Ini</span>
                  <span class="font-semibold text-gray-900 dark:text-white text-sm">
                    {{ dashboardData?.data?.summary?.totalTransaksiHariIni }}
                  </span>
                </div>
                <div class="flex justify-between items-center py-1 border-b border-gray-200 dark:border-gray-700">
                  <span class="text-gray-600 dark:text-gray-400 text-xs">Penjualan Bulan Ini</span>
                  <span class="font-semibold text-gray-900 dark:text-white text-sm">
                    Rp {{ formatCurrency(dashboardData?.data?.summary?.totalPenjualanBulanIni) }}
                  </span>
                </div>
                <div class="flex justify-between items-center py-1 border-b border-gray-200 dark:border-gray-700">
                  <span class="text-gray-600 dark:text-gray-400 text-xs">Penjualan Tahun Ini</span>
                  <span class="font-semibold text-gray-900 dark:text-white text-sm">
                    Rp {{ formatCurrency(dashboardData?.data?.summary?.totalPenjualanTahunIni) }}
                  </span>
                </div>
                <div class="flex justify-between items-center py-1 border-b border-gray-200 dark:border-gray-700">
                  <span class="text-gray-600 dark:text-gray-400 text-xs">Total Piutang</span>
                  <span class="font-semibold text-gray-900 dark:text-white text-sm">
                    Rp {{ formatCurrency(dashboardData?.data?.summary?.totalPiutang) }}
                  </span>
                </div>
                <div class="flex justify-between items-center pt-1">
                  <span class="text-gray-600 dark:text-gray-400 text-xs">Total Pelanggan</span>
                  <span class="font-semibold text-gray-900 dark:text-white text-sm">
                    {{ dashboardData?.data?.summary?.totalPelanggan }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            class="overflow-hidden rounded-xl border border-gray-200 bg-white px-4 pb-3 pt-3 dark:border-gray-800 dark:bg-white/[0.03] sm:px-5 shadow-sm mb-6">
            <div class="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 class="text-base font-semibold text-gray-800 dark:text-white/90">Transaksi Terbaru</h3>
              </div>
              <div class="flex items-center gap-2">

              </div>
            </div>

            <div class="max-w-full overflow-x-auto custom-scrollbar">
              <table class="min-w-full">
                <thead>
                  <tr class="border-t border-gray-100 dark:border-gray-800">
                    <th class="py-2 text-left">
                      <p class="font-medium text-gray-500 text-xs dark:text-gray-400">ID Transaksi</p>
                    </th>
                    <th class="py-2 text-left">
                      <p class="font-medium text-gray-500 text-xs dark:text-gray-400">Pelanggan</p>
                    </th>
                    <th class="py-2 text-left">
                      <p class="font-medium text-gray-500 text-xs dark:text-gray-400">Total Harga</p>
                    </th>
                    <th class="py-2 text-left">
                      <p class="font-medium text-gray-500 text-xs dark:text-gray-400">Bayar</p>
                    </th>
                    <th class="py-2 text-left">
                      <p class="font-medium text-gray-500 text-xs dark:text-gray-400">Kembalian</p>
                    </th>
                    <th class="py-2 text-left">
                      <p class="font-medium text-gray-500 text-xs dark:text-gray-400">Waktu</p>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="transaksi in dashboardData?.data?.dataAktivitas?.transaksiTerakhir" :key="transaksi.id"
                    class="border-t border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition">
                    <td class="py-2 whitespace-nowrap">
                      <p class="font-medium text-gray-800 text-sm dark:text-white/90">{{ transaksi.id.substring(0, 8)
                        }}...
                      </p>
                    </td>
                    <td class="py-2 whitespace-nowrap">
                      <p class="text-gray-500 text-sm dark:text-gray-400">{{ transaksi.pelanggan.nama_pelanggan }}</p>
                    </td>
                    <td class="py-2 whitespace-nowrap">
                      <p class="text-gray-900 dark:text-white font-semibold text-sm">Rp {{
                        formatCurrency(transaksi.total_harga) }}</p>
                    </td>
                    <td class="py-2 whitespace-nowrap">
                      <p class="text-gray-500 text-sm dark:text-gray-400">Rp {{ formatCurrency(transaksi.total_bayar) }}
                      </p>
                    </td>
                    <td class="py-2 whitespace-nowrap">
                      <p class="text-green-600 dark:text-green-400 font-semibold text-sm">Rp {{
                        formatCurrency(transaksi.total_kembalian) }}
                      </p>
                    </td>
                    <td class="py-2 whitespace-nowrap">
                      <p class="text-gray-500 text-sm dark:text-gray-400">{{ formatTime(transaksi.createdAt) }}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div
              class="overflow-hidden rounded-xl border border-gray-200 bg-white px-4 pb-3 pt-3 dark:border-gray-800 dark:bg-white/[0.03] sm:px-5 shadow-sm">
              <div class="mb-4">
                <h3 class="text-base font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
                  <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd"
                      d="M4 4a1 1 0 0 1 1-1h14a1 1 0 1 1 0 2v14a1 1 0 1 1 0 2H5a1 1 0 1 1 0-2V5a1 1 0 0 1-1-1Zm5 2a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1H9Zm5 0a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1h-1Zm-5 4a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1H9Zm5 0a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1h-1Zm-3 4a2 2 0 0 0-2 2v3h2v-3h2v3h2v-3a2 2 0 0 0-2-2h-2Z"
                      clip-rule="evenodd" />
                  </svg>
                  Stok Rendah
                </h3>
              </div>
              <div v-if="dashboardData?.data?.dataAktivitas?.produkStokRendah?.length > 0" class="space-y-3">
                <div v-for="produk in dashboardData?.data?.dataAktivitas?.produkStokRendah" :key="produk.id"
                  class="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-800">
                  <div>
                    <p class="font-semibold text-gray-900 dark:text-white text-sm">{{ produk.nama_produk }}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">Stok tersisa</p>
                  </div>
                  <span
                    class="inline-flex items-center justify-center bg-red-600 text-white font-bold rounded-full w-8 h-8 text-sm">{{
                      produk.stok_produk }}</span>
                </div>
              </div>
              <div v-else class="text-center py-5 text-gray-500 dark:text-gray-400">Semua stok produk terlihat aman!
              </div>
            </div>

            <div
              class="overflow-hidden rounded-xl border border-gray-200 bg-white px-4 pb-3 pt-3 dark:border-gray-800 dark:bg-white/[0.03] sm:px-5 shadow-sm">
              <div class="mb-4">
                <h3 class="text-base font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
                  <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                    <path fill-rule="evenodd"
                      d="M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H6Zm7.25-2.095c.478-.86.75-1.85.75-2.905a5.973 5.973 0 0 0-.75-2.906 4 4 0 1 1 0 5.811ZM15.466 20c.34-.588.535-1.271.535-2v-1a5.978 5.978 0 0 0-1.528-4H18a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2h-4.535Z"
                      clip-rule="evenodd" />
                  </svg>
                  Pelanggan Terbaru
                </h3>
              </div>
              <div v-if="dashboardData?.data?.dataAktivitas?.pelangganTerbaru?.length > 0" class="space-y-3">
                <div v-for="pelanggan in dashboardData?.data?.dataAktivitas?.pelangganTerbaru" :key="pelanggan.id"
                  class="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-800 transition">
                  <div>
                    <p class="font-semibold text-gray-900 dark:text-white text-sm">{{ pelanggan.nama_pelanggan }}</p>
                    <p class="text-xs text-gray-600 dark:text-gray-400 mt-1">{{ pelanggan.alamat }}</p>
                  </div>
                  <span
                    class="inline-flex items-center justify-center bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-bold rounded-full w-8 h-8 text-xs">{{
                      pelanggan.nama_pelanggan.charAt(0) }}</span>
                </div>
              </div>
              <div v-else class="text-center py-5 text-gray-500 dark:text-gray-400">Tidak ada data pelanggan terbaru.
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import VueApexCharts from 'vue3-apexcharts'
const router = useRouter()
const apexchart = VueApexCharts

const dashboardData = ref(null)
const isLoading = ref(true)
const error = ref(null)
const chartLoading = ref(true)
const API_URL = import.meta.env.VITE_API_BASE_URL

const chartSeries = ref([])
const chartOptions = ref({})


const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0'
  const num = parseFloat(value)
  if (isNaN(num)) return '0'
  return new Intl.NumberFormat('id-ID', { minimumFractionDigits: 0 }).format(num)
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
}

const averageTransaction = computed(() => {
  const summary = dashboardData.value?.data?.summary
  if (!summary || !summary.totalTransaksiHariIni || summary.totalTransaksiHariIni === 0) {
    return 0
  }
  const totalSales = parseFloat(summary.totalPenjualanBulanIni)
  const totalTransactions = summary.totalTransaksiHariIni

  if (isNaN(totalSales) || totalTransactions === 0) return 0

  return Math.floor(totalSales / totalTransactions)
})

// --- Fungsi Chart (Diperbarui untuk ApexCharts) ---

const setupApexChart = (data) => {
  if (!data || data.length === 0) {
    chartLoading.value = false
    chartSeries.value = []
    return
  }

  const labels = data.map(d => {
    const date = new Date(d.day)
    return date.toLocaleDateString('id-ID', { month: 'short', day: 'numeric' })
  })

  const seriesData = data.map(d => parseInt(d.totalSales) || 0)

  chartSeries.value = [{
    name: 'Total Penjualan',
    data: seriesData
  }]

  chartOptions.value = {
    chart: {
      type: 'line',
      // PERUBAHAN DI SINI: height dikurangi menjadi 300
      height: 300,
      toolbar: { show: false }
    },
    colors: ['#2563eb'],
    stroke: {
      curve: 'smooth',
      width: 3
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: labels,
      labels: {
        style: { colors: '#4b5563', fontSize: '11px' }
      }
    },
    yaxis: {
      title: { text: 'Penjualan (Rp)', style: { color: '#4b5563' } },
      labels: {
        formatter: (value) => 'Rp ' + value.toLocaleString('id-ID', { minimumFractionDigits: 0 }),
        style: { colors: '#4b5563', fontSize: '11px' }
      }
    },
    tooltip: {
      y: {
        formatter: (value) => 'Rp ' + value.toLocaleString('id-ID', { minimumFractionDigits: 0 })
      }
    },
    grid: {
      borderColor: '#f3f4f6'
    }
  }

  chartLoading.value = false
}

// --- Fetch Data Dashboard ---

const fetchDashboard = async () => {
  isLoading.value = true
  chartLoading.value = true
  error.value = null

  const authToken = localStorage.getItem('authToken')

  if (!authToken) {
    isLoading.value = false
    error.value = 'Token otentikasi "authToken" tidak ditemukan di LocalStorage. Akses ditolak.'
    router.push("/signin")
    return
  }

  try {
    const response = await axios.get(`${API_URL}/dashboard`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.data.success) {
      dashboardData.value = response.data
      setupApexChart(response.data.data.salesChartData)
    } else {
      error.value = response.data.message || 'Gagal mengambil data dashboard.'

    }
  } catch (err) {
    console.error('Fetch error:', err)
    if (axios.isAxiosError(err)) {
      if (err.response) {
        error.value = `Error ${err.response.status}: ${err.response.data?.message || 'Terjadi kesalahan pada server.'}`
      } else if (err.request) {
        error.value = 'Tidak ada respons dari server. Pastikan API berjalan di http://localhost:3900'
      } else {
        error.value = err.message
      }
    } else {
      error.value = 'Terjadi kesalahan tidak terduga saat mengambil data.'
    }
    chartLoading.value = false
  } finally {
    isLoading.value = false
  }
}

// --- Lifecycle Hook ---

onMounted(() => {
  fetchDashboard()
})
</script>

<style scoped>
/* Style tetap sama */
.custom-scrollbar::-webkit-scrollbar {
  height: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>