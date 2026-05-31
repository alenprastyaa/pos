<template>
  <AdminLayout>
    <div class="dashboard-wrap min-h-screen px-5 py-6">

      <!-- Loading -->
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-32 gap-4">
        <div class="spinner"></div>
        <p class="text-sm text-gray-500 dark:text-gray-400 font-medium">Memuat data dashboard...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="error-card rounded-2xl p-6 text-center max-w-lg mx-auto mt-16">
        <div class="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
          <svg class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <p class="font-bold text-gray-800 dark:text-gray-100 text-base">Gagal Memuat Data</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ error }}</p>
      </div>

      <div v-else class="space-y-5">

        <!-- ── SUPER ADMIN REPORT ── -->
        <div v-if="isSuperAdmin" class="report-shell rounded-3xl border border-sky-100 bg-white/90 p-5 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/70">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div class="max-w-2xl">
              <p class="text-xs font-semibold uppercase tracking-[0.28em] text-sky-600 dark:text-sky-300">Super Admin Report</p>
              <h2 class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">Laporan Penjualan Hari Ini per Toko</h2>
              <p class="mt-2 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Ringkasan otomatis seluruh toko berdasarkan transaksi pada rentang <span class="font-semibold text-gray-700 dark:text-gray-200">{{ reportRangeLabel }}</span>. Rata-rata transaksi saat ini Rp {{ formatCurrency(averageTransaction) }}.
              </p>
            </div>

            <div class="flex flex-col gap-3">
              <div class="flex flex-wrap items-end gap-3">
                <label class="flex flex-col gap-1">
                  <span class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Dari</span>
                  <input
                    v-model="reportStartDate"
                    type="date"
                    class="h-11 rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-700 shadow-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                  />
                </label>
                <label class="flex flex-col gap-1">
                  <span class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Sampai</span>
                  <input
                    v-model="reportEndDate"
                    type="date"
                    class="h-11 rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-700 shadow-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
                  />
                </label>
                <button
                  @click="fetchDailyReport"
                  :disabled="reportLoading"
                  class="inline-flex h-11 items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-4 text-sm font-semibold text-sky-700 transition hover:-translate-y-0.5 hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-300"
                >
                  <span v-if="reportLoading" class="h-4 w-4 animate-spin rounded-full border-2 border-sky-500 border-t-transparent"></span>
                  <span v-else class="h-2 w-2 rounded-full bg-sky-500"></span>
                  Tampilkan
                </button>
              </div>

              <div class="flex flex-wrap gap-3">
                <button
                  @click="downloadDailyReportPdf"
                  :disabled="reportDownloading"
                  class="inline-flex items-center gap-2 rounded-2xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                >
                  <span v-if="reportDownloading" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-gray-900"></span>
                  <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 16v-8m0 8l-3-3m3 3l3-3m6 2.25V19a2 2 0 01-2 2H6a2 2 0 01-2-2v-3.75m16-5.25V7a2 2 0 00-2-2H8.5a2 2 0 00-1.414.586l-2.5 2.5A2 2 0 004 8.5V11"/>
                  </svg>
                  PDF
                </button>
                <button
                  @click="downloadDailyReportExcel"
                  :disabled="reportExcelDownloading"
                  class="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span v-if="reportExcelDownloading" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6M9 8h6M5 4h14a2 2 0 012 2v12a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z"/>
                  </svg>
                  Excel
                </button>
                <button
                  @click="downloadDailyReportCsv"
                  :disabled="reportCsvDownloading"
                  class="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span v-if="reportCsvDownloading" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5h6M9 12h6M9 19h6M4 5h.01M4 12h.01M4 19h.01"/>
                  </svg>
                  CSV
                </button>
              </div>
            </div>
          </div>

          <div v-if="reportError" class="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {{ reportError }}
          </div>

          <div v-else-if="reportLoading" class="mt-4 flex items-center gap-3 rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800/50 dark:text-gray-400">
            <span class="h-4 w-4 animate-spin rounded-full border-2 border-sky-500 border-t-transparent"></span>
            Memuat ringkasan penjualan harian...
          </div>

          <div v-else class="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div class="rounded-2xl border border-gray-200 bg-gradient-to-br from-sky-50 to-white p-4 shadow-sm dark:border-gray-700 dark:from-sky-500/10 dark:to-slate-900">
              <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Total Penjualan</p>
              <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">Rp {{ formatCurrency(reportData?.data?.summary?.totalSales) }}</p>
              <p class="mt-1 text-xs text-sky-600 dark:text-sky-300">{{ reportData?.data?.summary?.totalTransactions || 0 }} transaksi hari ini</p>
            </div>
            <div class="rounded-2xl border border-gray-200 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm dark:border-gray-700 dark:from-emerald-500/10 dark:to-slate-900">
              <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Transaksi</p>
              <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{{ reportData?.data?.summary?.totalTransactions || 0 }}</p>
              <p class="mt-1 text-xs text-emerald-600 dark:text-emerald-300">{{ reportData?.data?.summary?.totalActiveStores || 0 }} toko aktif</p>
            </div>
            <div class="rounded-2xl border border-gray-200 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm dark:border-gray-700 dark:from-amber-500/10 dark:to-slate-900">
              <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Toko Aktif</p>
              <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{{ reportData?.data?.summary?.totalActiveStores || 0 }}</p>
              <p class="mt-1 text-xs text-amber-600 dark:text-amber-300">{{ reportData?.data?.summary?.totalStores || 0 }} toko terdaftar</p>
            </div>
            <div class="rounded-2xl border border-gray-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm dark:border-gray-700 dark:from-slate-500/10 dark:to-slate-900">
              <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Toko Terbaik</p>
              <p class="mt-2 truncate text-2xl font-semibold text-gray-900 dark:text-white">{{ reportData?.data?.summary?.bestStoreName || '-' }}</p>
              <p class="mt-1 text-xs text-slate-600 dark:text-slate-300">Omzet Rp {{ formatCurrency(reportData?.data?.summary?.bestStoreSales) }}</p>
            </div>
          </div>

          <div v-if="reportData?.data?.rows?.length" class="mt-5 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
            <div class="flex items-center justify-between gap-3">
              <div>
                <h3 class="section-title">Grafik Omzet per Toko</h3>
                <p class="section-sub">Visualisasi penjualan pada rentang {{ reportRangeLabel }}</p>
              </div>
              <div class="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                {{ reportData?.data?.summary?.totalActiveStores || 0 }} toko aktif
              </div>
            </div>
            <div class="mt-4">
              <apexchart type="bar" height="320" :options="storeSalesChartOptions" :series="storeSalesChartSeries"></apexchart>
            </div>
          </div>
        </div>

        <div v-if="isSuperAdmin" class="dash-card rounded-2xl p-5">
          <div class="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h3 class="section-title">Jadwal Email Otomatis</h3>
              <p class="section-sub">Laporan PDF penjualan harian dan Excel produk semua toko akan dikirim otomatis sesuai jadwal ini.</p>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              <span v-if="emailSettingLoading">Memuat pengaturan...</span>
              <span v-else-if="emailReportSetting.enabled">Aktif</span>
              <span v-else>Nonaktif</span>
            </div>
          </div>

          <div v-if="emailSettingError" class="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-300">
            {{ emailSettingError }}
          </div>
          <div v-if="emailSettingSuccess" class="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
            {{ emailSettingSuccess }}
          </div>

          <div class="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <label class="flex flex-col gap-2">
              <span class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Jam Kirim</span>
              <input
                v-model="emailReportSetting.send_time"
                type="time"
                class="h-11 rounded-2xl border border-gray-200 bg-white px-4 text-sm text-gray-700 shadow-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              />
            </label>

            <label class="flex flex-col gap-2 lg:col-span-2">
              <span class="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">Email Tujuan</span>
              <textarea
                v-model="emailReportSetting.recipient_email"
                rows="3"
                placeholder="email1@domain.com, email2@domain.com"
                class="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm outline-none transition focus:border-sky-300 focus:ring-4 focus:ring-sky-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100"
              />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Pisahkan beberapa email dengan koma, titik koma, atau baris baru.
              </p>
            </label>
          </div>

          <div class="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <label class="inline-flex items-center gap-3 text-sm text-gray-700 dark:text-gray-200">
              <input
                v-model="emailReportSetting.enabled"
                type="checkbox"
                class="h-4 w-4 rounded border-gray-300 text-sky-600 focus:ring-sky-500"
              />
              Aktifkan pengiriman otomatis setiap hari
            </label>

            <button
              @click="saveEmailReportSetting"
              :disabled="emailSettingSaving || emailSettingLoading"
              class="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
            >
              <span v-if="emailSettingSaving" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent dark:border-gray-900"></span>
              <svg v-else class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              Simpan Jadwal
            </button>
          </div>
        </div>

        <!-- ── KPI CARDS ── -->
        <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

          <!-- Penjualan Hari Ini -->
          <div class="kpi-card rounded-2xl p-5 flex items-center gap-4">
            <div class="kpi-icon kpi-cyan">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="kpi-label">Penjualan Hari Ini</p>
              <p class="kpi-value">Rp {{ formatCurrency(dashboardData?.data?.summary?.totalPenjualanHariIni) }}</p>
              <p class="kpi-sub text-emerald-600 dark:text-emerald-400">
                <span class="inline-flex items-center gap-0.5">
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 15l7-7 7 7"/></svg>
                  Hari ini
                </span>
              </p>
            </div>
          </div>

          <!-- Total Transaksi -->
          <div class="kpi-card rounded-2xl p-5 flex items-center gap-4">
            <div class="kpi-icon kpi-violet">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="kpi-label">Transaksi Hari Ini</p>
              <p class="kpi-value">{{ dashboardData?.data?.summary?.totalTransaksiHariIni ?? 0 }}</p>
              <p class="kpi-sub text-violet-600 dark:text-violet-400">
                {{ dashboardData?.data?.summary?.totalPelanggan }} pelanggan
              </p>
            </div>
          </div>

          <!-- Total Stok -->
          <div class="kpi-card rounded-2xl p-5 flex items-center gap-4">
            <div class="kpi-icon kpi-amber">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="kpi-label">Total Stok Unit</p>
              <p class="kpi-value">{{ dashboardData?.data?.summary?.totalStok ?? 0 }}</p>
              <p class="kpi-sub text-amber-600 dark:text-amber-400">
                {{ dashboardData?.data?.summary?.totalProduk }} produk
              </p>
            </div>
          </div>

          <!-- Total Piutang -->
          <div class="kpi-card rounded-2xl p-5 flex items-center gap-4">
            <div class="kpi-icon" :class="dashboardData?.data?.summary?.totalPiutang > 0 ? 'kpi-red' : 'kpi-green'">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"/>
              </svg>
            </div>
            <div class="flex-1 min-w-0">
              <p class="kpi-label">Total Piutang</p>
              <p class="kpi-value">Rp {{ formatCurrency(dashboardData?.data?.summary?.totalPiutang) }}</p>
              <p class="kpi-sub" :class="dashboardData?.data?.summary?.totalPiutang > 0 ? 'text-red-500 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'">
                {{ dashboardData?.data?.summary?.totalPiutang > 0 ? '⚠ Ada piutang' : '✓ Lancar' }}
              </p>
            </div>
          </div>
        </div>

        <!-- ── REPORT TABLE ── -->
        <div v-if="isSuperAdmin" class="dash-card rounded-2xl p-5">
          <div class="flex flex-col gap-3 border-b border-gray-100 pb-4 dark:border-gray-800 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 class="section-title">Rincian Penjualan per Toko</h3>
              <p class="section-sub">Data hari ini yang juga dipakai untuk PDF laporan</p>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ reportData?.data?.rows?.length || 0 }} toko ditampilkan
            </div>
          </div>

          <div v-if="reportLoading" class="flex items-center gap-3 py-10 text-sm text-gray-500 dark:text-gray-400">
            <span class="h-4 w-4 animate-spin rounded-full border-2 border-sky-500 border-t-transparent"></span>
            Memuat laporan toko...
          </div>

          <div v-else class="overflow-x-auto custom-scrollbar">
            <table class="min-w-full">
              <thead>
                <tr class="trx-head">
                  <th class="trx-th text-left">#</th>
                  <th class="trx-th text-left">Toko</th>
                  <th class="trx-th text-right">Trx</th>
                  <th class="trx-th text-right">Item</th>
                  <th class="trx-th text-right">Qty</th>
                  <th class="trx-th text-right">Omzet</th>
                  <th class="trx-th text-right">Bayar</th>
                  <th class="trx-th text-right">Sisa</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in reportData?.data?.rows || []" :key="row.tokoId" class="trx-row">
                  <td class="trx-td">
                    <span class="id-badge">{{ index + 1 }}</span>
                  </td>
                  <td class="trx-td">
                    <div class="min-w-0">
                      <p class="text-sm font-semibold text-gray-800 dark:text-gray-100">{{ row.namaToko }}</p>
                      <p class="truncate text-xs text-gray-500 dark:text-gray-400">{{ row.alamatToko }}</p>
                    </div>
                  </td>
                  <td class="trx-td text-right">
                    <span class="text-sm font-semibold text-gray-900 dark:text-white">{{ row.totalTransactions }}</span>
                  </td>
                  <td class="trx-td text-right">
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ row.totalItem }}</span>
                  </td>
                  <td class="trx-td text-right">
                    <span class="text-sm text-gray-600 dark:text-gray-400">{{ row.totalQty }}</span>
                  </td>
                  <td class="trx-td text-right">
                    <span class="text-sm font-semibold text-sky-600 dark:text-sky-300">Rp {{ formatCurrency(row.totalSales) }}</span>
                  </td>
                  <td class="trx-td text-right">
                    <span class="text-sm text-emerald-600 dark:text-emerald-300">Rp {{ formatCurrency(row.totalBayar) }}</span>
                  </td>
                  <td class="trx-td text-right">
                    <span class="text-sm" :class="row.totalSisaHutang > 0 ? 'text-red-500 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'">
                      Rp {{ formatCurrency(row.totalSisaHutang) }}
                    </span>
                  </td>
                </tr>
                <tr v-if="(reportData?.data?.rows?.length || 0) === 0">
                  <td colspan="8" class="px-5 py-10 text-center text-sm text-gray-500 dark:text-gray-400">
                    Belum ada transaksi hari ini.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ── CHART + RINGKASAN ── -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">

          <!-- Chart -->
          <div class="dash-card lg:col-span-2 rounded-2xl p-5">
            <div class="flex items-center justify-between mb-4">
              <div>
                <h3 class="section-title">Grafik Penjualan</h3>
                <p class="section-sub">30 hari terakhir</p>
              </div>
              <div class="chart-badge px-3 py-1 rounded-full text-xs font-semibold">Live</div>
            </div>
            <div v-if="!chartLoading && chartSeries.length > 0 && chartSeries[0].data.length > 0">
              <apexchart type="line" height="280" :options="chartOptions" :series="chartSeries"></apexchart>
            </div>
            <div v-else class="flex flex-col items-center justify-center py-16 gap-3">
              <div class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                </svg>
              </div>
              <p class="text-sm text-gray-400">Belum ada data grafik</p>
            </div>
          </div>

          <!-- Ringkasan -->
          <div class="dash-card rounded-2xl p-5">
            <h3 class="section-title mb-1">Ringkasan</h3>
            <p class="section-sub mb-4">Statistik keseluruhan</p>
            <div class="space-y-1">
              <div class="summary-row">
                <span class="summary-label">Stok</span>
                <span class="summary-value">{{ dashboardData?.data?.summary?.totalStok }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Produk</span>
                <span class="summary-value">{{ dashboardData?.data?.summary?.totalProduk }}</span>
              </div>
              <div class="summary-divider"></div>
              <div class="summary-row">
                <span class="summary-label">Penjualan Hari Ini</span>
                <span class="summary-value text-cyan-600 dark:text-cyan-400">Rp {{ formatCurrency(dashboardData?.data?.summary?.totalPenjualanHariIni) }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Transaksi Hari Ini</span>
                <span class="summary-value">{{ dashboardData?.data?.summary?.totalTransaksiHariIni }}</span>
              </div>
              <div class="summary-divider"></div>
              <div class="summary-row">
                <span class="summary-label">Penjualan Bulan Ini</span>
                <span class="summary-value font-bold text-gray-900 dark:text-white">Rp {{ formatCurrency(dashboardData?.data?.summary?.totalPenjualanBulanIni) }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Penjualan Tahun Ini</span>
                <span class="summary-value font-bold text-gray-900 dark:text-white">Rp {{ formatCurrency(dashboardData?.data?.summary?.totalPenjualanTahunIni) }}</span>
              </div>
              <div class="summary-divider"></div>
              <div class="summary-row">
                <span class="summary-label">Piutang</span>
                <span class="summary-value" :class="dashboardData?.data?.summary?.totalPiutang > 0 ? 'text-red-500' : 'text-emerald-500'">
                  Rp {{ formatCurrency(dashboardData?.data?.summary?.totalPiutang) }}
                </span>
              </div>
              <div class="summary-row">
                <span class="summary-label">Total Pelanggan</span>
                <span class="summary-value">{{ dashboardData?.data?.summary?.totalPelanggan }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ── TRANSAKSI TERBARU ── -->
        <div class="dash-card rounded-2xl p-5">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="section-title">Transaksi Terbaru</h3>
              <p class="section-sub">Aktivitas kasir hari ini</p>
            </div>
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <div class="overflow-x-auto custom-scrollbar">
            <table class="w-full">
              <thead>
                <tr class="trx-head">
                  <th class="trx-th text-left">ID</th>
                  <th class="trx-th text-left">Pelanggan</th>
                  <th class="trx-th text-right">Total</th>
                  <th class="trx-th text-right">Bayar</th>
                  <th class="trx-th text-right">Kembalian</th>
                  <th class="trx-th text-right">Waktu</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="t in dashboardData?.data?.dataAktivitas?.transaksiTerakhir" :key="t.id"
                  class="trx-row">
                  <td class="trx-td">
                    <span class="id-badge">{{ t.id.substring(0, 8) }}</span>
                  </td>
                  <td class="trx-td">
                    <div class="flex items-center gap-2">
                      <div class="avatar-xs">{{ t.pelanggan.nama_pelanggan.charAt(0) }}</div>
                      <span class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ t.pelanggan.nama_pelanggan }}</span>
                    </div>
                  </td>
                  <td class="trx-td text-right">
                    <span class="text-sm font-bold text-gray-900 dark:text-white">Rp {{ formatCurrency(t.total_harga) }}</span>
                  </td>
                  <td class="trx-td text-right">
                    <span class="text-sm text-gray-600 dark:text-gray-400">Rp {{ formatCurrency(t.total_bayar) }}</span>
                  </td>
                  <td class="trx-td text-right">
                    <span class="kembalian-pill" :class="t.total_kembalian > 0 ? 'pill-green' : 'pill-gray'">
                      Rp {{ formatCurrency(t.total_kembalian) }}
                    </span>
                  </td>
                  <td class="trx-td text-right">
                    <span class="text-xs text-gray-500 dark:text-gray-400 font-mono">{{ formatTime(t.createdAt) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ── STOK RENDAH + PELANGGAN TERBARU ── -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

          <!-- Stok Rendah -->
          <div class="dash-card rounded-2xl p-5">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                <svg class="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                </svg>
              </div>
              <div>
                <h3 class="section-title">Stok Rendah</h3>
                <p class="section-sub">Perlu segera diisi ulang</p>
              </div>
            </div>
            <div v-if="dashboardData?.data?.dataAktivitas?.produkStokRendah?.length > 0" class="space-y-2">
              <div v-for="produk in dashboardData?.data?.dataAktivitas?.produkStokRendah" :key="produk.id"
                class="stock-row rounded-xl p-3 flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 min-w-0">
                  <div class="stock-icon">
                    <svg class="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                  </div>
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{{ produk.nama_produk }}</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">Stok tersisa</p>
                  </div>
                </div>
                <div class="stock-count-badge">{{ produk.stok_produk }}</div>
              </div>
            </div>
            <div v-else class="flex flex-col items-center py-8 gap-2">
              <div class="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Semua stok aman</p>
            </div>
          </div>

          <!-- Pelanggan Terbaru -->
          <div class="dash-card rounded-2xl p-5">
            <div class="flex items-center gap-2 mb-4">
              <div class="w-8 h-8 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <h3 class="section-title">Pelanggan Terbaru</h3>
                <p class="section-sub">Bergabung baru-baru ini</p>
              </div>
            </div>
            <div v-if="dashboardData?.data?.dataAktivitas?.pelangganTerbaru?.length > 0" class="space-y-2">
              <div v-for="pelanggan in dashboardData?.data?.dataAktivitas?.pelangganTerbaru" :key="pelanggan.id"
                class="pelanggan-row rounded-xl p-3 flex items-center gap-3 transition-all">
                <div class="avatar-md">{{ pelanggan.nama_pelanggan.charAt(0) }}</div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{{ pelanggan.nama_pelanggan }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ pelanggan.alamat || '—' }}</p>
                </div>
                <svg class="w-4 h-4 text-gray-300 dark:text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </div>
            </div>
            <div v-else class="text-center py-8">
              <p class="text-sm text-gray-400">Tidak ada pelanggan terbaru</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import VueApexCharts from 'vue3-apexcharts'
import Swal from 'sweetalert2'
const router = useRouter()
const apexchart = VueApexCharts

const dashboardData = ref(null)
const reportData = ref(null)
const isLoading = ref(true)
const error = ref(null)
const chartLoading = ref(true)
const reportLoading = ref(false)
const reportDownloading = ref(false)
const reportExcelDownloading = ref(false)
const reportCsvDownloading = ref(false)
const reportError = ref(null)
const emailSettingLoading = ref(false)
const emailSettingSaving = ref(false)
const emailSettingError = ref(null)
const emailSettingSuccess = ref(null)
const emailReportSetting = ref({
  send_time: '22:00',
  enabled: true,
  recipient_email: ''
})
const API_URL = import.meta.env.VITE_API_BASE_URL
const currentUserRole = ref(localStorage.getItem('role_name') || 'superadmin')
const isSuperAdmin = computed(() => currentUserRole.value === 'superadmin')
const getJakartaInputDate = (date = new Date()) =>
  new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Jakarta', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date)
const reportStartDate = ref(getJakartaInputDate())
const reportEndDate = ref(getJakartaInputDate())

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
  const totalSales = parseFloat(summary.totalPenjualanHariIni)
  const totalTransactions = summary.totalTransaksiHariIni

  if (isNaN(totalSales) || totalTransactions === 0) return 0

  return Math.floor(totalSales / totalTransactions)
})

const getAuthToken = () => localStorage.getItem('authToken')

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getAuthToken()}`
})

const getReportParams = () => ({
  start_date: reportStartDate.value,
  end_date: reportEndDate.value,
})

const reportRangeLabel = computed(() => {
  if (!reportStartDate.value || !reportEndDate.value) return 'Hari ini'
  const formatPrettyDate = (dateString) => {
    const date = new Date(`${dateString}T00:00:00Z`)
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' })
  }
  return reportStartDate.value === reportEndDate.value
    ? formatPrettyDate(reportStartDate.value)
    : `${formatPrettyDate(reportStartDate.value)} - ${formatPrettyDate(reportEndDate.value)}`
})

const formatStoreChartLabel = (name) => (name && name.length > 24 ? `${name.slice(0, 24)}...` : name || '-')

const buildReportFilename = (extension) => {
  const start = reportStartDate.value || new Date().toISOString().slice(0, 10)
  const end = reportEndDate.value || start
  const toLocalFileDate = (value) => {
    const [year, month, day] = String(value).split('-')
    if (!year || !month || !day) return value
    return `${day}-${month}-${year}`
  }
  const suffix = start === end ? toLocalFileDate(start) : `${toLocalFileDate(start)}_sampai_${toLocalFileDate(end)}`
  return `laporan-penjualan-harian_${suffix}.${extension}`
}

const storeSalesChartSeries = computed(() => [{
  name: 'Omzet per Toko',
  data: reportData.value?.data?.rows?.map((row) => Number(row.totalSales) || 0) || []
}])

const storeSalesChartOptions = computed(() => ({
  chart: {
    type: 'bar',
    height: 320,
    toolbar: { show: false },
  },
  plotOptions: {
    bar: {
      horizontal: true,
      borderRadius: 10,
      distributed: true,
      barHeight: '56%',
    },
  },
  dataLabels: {
    enabled: true,
    formatter: (value) => `Rp ${formatCurrency(value)}`,
    offsetX: 10,
    style: {
      fontSize: '11px',
      colors: ['#0f172a'],
    },
  },
  colors: ['#0ea5e9', '#14b8a6', '#f59e0b', '#8b5cf6', '#ef4444', '#22c55e', '#6366f1'],
  xaxis: {
    categories: reportData.value?.data?.rows?.map((row) => formatStoreChartLabel(row.namaToko)) || [],
    labels: {
      formatter: (value) => `Rp ${formatCurrency(value)}`,
      style: { colors: '#475569', fontSize: '11px' },
    },
  },
  yaxis: {
    labels: {
      style: { colors: '#475569', fontSize: '11px' },
    },
  },
  tooltip: {
    y: {
      formatter: (value) => `Rp ${formatCurrency(value)}`,
    },
  },
  grid: {
    borderColor: '#e2e8f0',
  },
  legend: {
    show: false,
  },
}))

const fetchDailyReport = async () => {
  if (!isSuperAdmin.value) return

  reportLoading.value = true
  reportError.value = null

  const authToken = getAuthToken()
  if (!authToken) {
    reportLoading.value = false
    router.push('/signin')
    return
  }

  try {
    const response = await axios.get(`${API_URL}/dashboard/laporan-penjualan-harian`, {
      headers: getAuthHeaders(),
      params: getReportParams(),
    })

    if (response.data.success) {
      reportData.value = response.data
    } else {
      reportError.value = response.data.message || 'Gagal memuat laporan penjualan.'
    }
  } catch (err) {
    console.error('Fetch report error:', err)
    if (axios.isAxiosError(err)) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('authToken')
        router.push('/signin')
        return
      }

      reportError.value = err.response?.data?.message || 'Tidak dapat memuat laporan penjualan harian.'
    } else {
      reportError.value = 'Terjadi kesalahan tidak terduga saat memuat laporan.'
    }
  } finally {
    reportLoading.value = false
  }
}

const downloadReportFile = async (endpoint, extension, mimeType, successTitle) => {
  if (!isSuperAdmin.value) return

  const authToken = getAuthToken()
  if (!authToken) {
    router.push('/signin')
    return
  }

  try {
    const response = await axios.get(`${API_URL}${endpoint}`, {
      headers: getAuthHeaders(),
      responseType: 'blob',
      params: getReportParams(),
    })

    const blob = new Blob([response.data], { type: mimeType })
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = buildReportFilename(extension)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(downloadUrl)

    await Swal.fire({
      icon: 'success',
      title: successTitle,
      text: `Laporan periode ${reportRangeLabel.value} sudah diunduh.`,
      timer: 1800,
      showConfirmButton: false,
    })
  } catch (err) {
    console.error('Download report error:', err)
    let message = 'Gagal mengunduh laporan.'

    if (axios.isAxiosError(err)) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('authToken')
        router.push('/signin')
        return
      }

      message = err.response?.data?.message || message
    }

    await Swal.fire({
      icon: 'error',
      title: 'Unduhan gagal',
      text: message,
    })
  }
}

const downloadDailyReportPdf = async () => {
  reportDownloading.value = true
  try {
    await downloadReportFile('/dashboard/laporan-penjualan-harian/pdf', 'pdf', 'application/pdf', 'PDF berhasil dibuat')
  } finally {
    reportDownloading.value = false
  }
}

const downloadDailyReportExcel = async () => {
  reportExcelDownloading.value = true
  try {
    await downloadReportFile(
      '/dashboard/laporan-penjualan-harian/excel',
      'xlsx',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Excel berhasil dibuat'
    )
  } finally {
    reportExcelDownloading.value = false
  }
}

const downloadDailyReportCsv = async () => {
  reportCsvDownloading.value = true
  try {
    await downloadReportFile('/dashboard/laporan-penjualan-harian/csv', 'csv', 'text/csv;charset=utf-8', 'CSV berhasil dibuat')
  } finally {
    reportCsvDownloading.value = false
  }
}

const fetchEmailReportSetting = async () => {
  if (!isSuperAdmin.value) return

  emailSettingLoading.value = true
  emailSettingError.value = null
  emailSettingSuccess.value = null

  try {
    const response = await axios.get(`${API_URL}/dashboard/email-report-setting`, {
      headers: getAuthHeaders(),
    })

    if (response.data.success && response.data.data) {
      emailReportSetting.value = {
        send_time: response.data.data.send_time || '22:00',
        enabled: Boolean(response.data.data.enabled),
        recipient_email: response.data.data.recipient_email || ''
      }
    } else {
      emailSettingError.value = response.data.message || 'Gagal memuat pengaturan email.'
    }
  } catch (err) {
    console.error('Fetch email setting error:', err)
    if (axios.isAxiosError(err)) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('authToken')
        router.push('/signin')
        return
      }
      emailSettingError.value = err.response?.data?.message || 'Tidak dapat memuat pengaturan email.'
    } else {
      emailSettingError.value = 'Terjadi kesalahan tidak terduga saat memuat pengaturan email.'
    }
  } finally {
    emailSettingLoading.value = false
  }
}

const saveEmailReportSetting = async () => {
  if (!isSuperAdmin.value) return

  emailSettingSaving.value = true
  emailSettingError.value = null
  emailSettingSuccess.value = null

  try {
    const response = await axios.put(`${API_URL}/dashboard/email-report-setting`, emailReportSetting.value, {
      headers: getAuthHeaders(),
    })

    if (response.data.success) {
      emailReportSetting.value = {
        send_time: response.data.data.send_time || emailReportSetting.value.send_time,
        enabled: Boolean(response.data.data.enabled),
        recipient_email: response.data.data.recipient_email || ''
      }
      emailSettingSuccess.value = response.data.message || 'Pengaturan berhasil disimpan.'
      await Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: emailSettingSuccess.value,
        timer: 1800,
        showConfirmButton: false,
      })
    } else {
      emailSettingError.value = response.data.message || 'Gagal menyimpan pengaturan email.'
    }
  } catch (err) {
    console.error('Save email setting error:', err)
    if (axios.isAxiosError(err)) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('authToken')
        router.push('/signin')
        return
      }
      emailSettingError.value = err.response?.data?.message || 'Tidak dapat menyimpan pengaturan email.'
    } else {
      emailSettingError.value = 'Terjadi kesalahan tidak terduga saat menyimpan pengaturan email.'
    }

    await Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: emailSettingError.value || 'Tidak dapat menyimpan pengaturan email.',
    })
  } finally {
    emailSettingSaving.value = false
  }
}

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
const fetchDashboard = async () => {
  isLoading.value = true
  chartLoading.value = true
  error.value = null

  const authToken = localStorage.getItem('authToken')

  // PERBAIKAN 1: Jika tidak ada token, langsung lempar ke signin
  if (!authToken) {
    isLoading.value = false
    router.push('/signin')
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
      // Logic error dari backend (misal success: false)
      localStorage.removeItem('authToken') // Hapus token yg mungkin rusak
      router.push("/signin")
    }
  } catch (err) {
    console.error('Fetch error:', err)

    if (axios.isAxiosError(err)) {
      // PERBAIKAN 2: Cek status code 401 (Unauthorized)
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        localStorage.removeItem('authToken') // Hapus token tidak valid
        router.push('/signin') // Lempar ke login
        return
      }

      if (err.response) {
        error.value = `Error ${err.response.status}: ${err.response.data?.message || 'Terjadi kesalahan pada server.'}`
      } else if (err.request) {
        error.value = 'Tidak ada respons dari server. Pastikan API berjalan.'
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

onMounted(() => {
  fetchDashboard()
  if (isSuperAdmin.value) {
    fetchDailyReport()
    fetchEmailReportSetting()
  }
})
</script>

<style scoped>
/* ── Base ── */
.dashboard-wrap {
  background: linear-gradient(160deg, #f0f4ff 0%, #f8fafc 50%, #f0fdf4 100%);
}
.dark .dashboard-wrap {
  background: linear-gradient(160deg, #0f172a 0%, #111827 60%, #0c1a0f 100%);
}

/* ── Loading Spinner ── */
.spinner {
  width: 36px; height: 36px;
  border: 3px solid #e2e8f0;
  border-top-color: #0891b2;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
.dark .spinner { border-color: #334155; border-top-color: #22d3ee; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Error Card ── */
.error-card {
  background: white;
  border: 1px solid #fee2e2;
}
.dark .error-card { background: #1e293b; border-color: #7f1d1d; }

/* ── Dash Card (base card) ── */
.dash-card {
  background: white;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04);
  transition: box-shadow 0.2s;
}
.dark .dash-card {
  background: #1e293b;
  border-color: #334155;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
}
.dash-card:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.08); }
.dark .dash-card:hover { box-shadow: 0 4px 24px rgba(0,0,0,0.4); }

/* ── Section headers ── */
.section-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #0f172a;
}
.dark .section-title { color: #f1f5f9; }
.section-sub {
  font-size: 0.7rem;
  color: #94a3b8;
  margin-top: 1px;
}

/* ── Chart badge ── */
.chart-badge {
  background: linear-gradient(135deg, #ecfdf5, #d1fae5);
  color: #059669;
  border: 1px solid #a7f3d0;
}
.dark .chart-badge { background: #064e3b; color: #6ee7b7; border-color: #065f46; }

/* ── KPI Cards ── */
.kpi-card {
  background: white;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04);
  transition: all 0.2s;
}
.dark .kpi-card { background: #1e293b; border-color: #334155; }
.kpi-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.1); }
.dark .kpi-card:hover { box-shadow: 0 8px 24px rgba(0,0,0,0.4); }

.kpi-icon {
  width: 48px; height: 48px;
  border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.kpi-cyan  { background: linear-gradient(135deg, #0891b2, #0e7490); color: white; box-shadow: 0 4px 12px rgba(8,145,178,0.35); }
.kpi-violet{ background: linear-gradient(135deg, #7c3aed, #6d28d9); color: white; box-shadow: 0 4px 12px rgba(124,58,237,0.35); }
.kpi-amber { background: linear-gradient(135deg, #d97706, #b45309); color: white; box-shadow: 0 4px 12px rgba(217,119,6,0.35); }
.kpi-red   { background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; box-shadow: 0 4px 12px rgba(220,38,38,0.35); }
.kpi-green { background: linear-gradient(135deg, #16a34a, #15803d); color: white; box-shadow: 0 4px 12px rgba(22,163,74,0.35); }

.kpi-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: #64748b;
}
.dark .kpi-label { color: #94a3b8; }
.kpi-value {
  font-size: 1.2rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
  margin-top: 3px;
  letter-spacing: -0.02em;
}
.dark .kpi-value { color: #f1f5f9; }
.kpi-sub {
  font-size: 0.7rem;
  font-weight: 600;
  margin-top: 4px;
}

/* ── Ringkasan ── */
.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}
.summary-label {
  font-size: 0.75rem;
  color: #64748b;
}
.dark .summary-label { color: #94a3b8; }
.summary-value {
  font-size: 0.8rem;
  font-weight: 600;
  color: #334155;
}
.dark .summary-value { color: #cbd5e1; }
.summary-divider {
  height: 1px;
  background: linear-gradient(90deg, transparent, #e2e8f0, transparent);
  margin: 4px 0;
}
.dark .summary-divider { background: linear-gradient(90deg, transparent, #334155, transparent); }

/* ── Transaction Table ── */
.trx-head { border-bottom: 1px solid #f1f5f9; }
.dark .trx-head { border-bottom-color: #334155; }
.trx-th {
  padding: 8px 12px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
}
.trx-row {
  border-bottom: 1px solid #f8fafc;
  transition: background 0.15s;
}
.dark .trx-row { border-bottom-color: #1e293b; }
.trx-row:last-child { border-bottom: none; }
.trx-row:hover { background: #f8fafc; }
.dark .trx-row:hover { background: #263548; }
.trx-td { padding: 10px 12px; white-space: nowrap; }

.id-badge {
  display: inline-block;
  background: #f1f5f9;
  color: #475569;
  font-size: 0.72rem;
  font-family: monospace;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
}
.dark .id-badge { background: #334155; color: #94a3b8; }

.avatar-xs {
  width: 28px; height: 28px;
  border-radius: 8px;
  background: linear-gradient(135deg, #0891b2, #0e7490);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

.kembalian-pill {
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 20px;
}
.pill-green { background: #d1fae5; color: #065f46; }
.dark .pill-green { background: #064e3b; color: #6ee7b7; }
.pill-gray  { background: #f1f5f9; color: #64748b; }
.dark .pill-gray  { background: #334155; color: #94a3b8; }

/* ── Stock Row ── */
.stock-row {
  background: #fff5f5;
  border: 1px solid #fee2e2;
}
.dark .stock-row { background: #1f0708; border-color: #7f1d1d; }

.stock-icon {
  width: 32px; height: 32px;
  border-radius: 8px;
  background: #fee2e2;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.dark .stock-icon { background: #3b1a1a; }

.stock-count-badge {
  min-width: 36px; height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: white;
  font-size: 0.85rem;
  font-weight: 800;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(220,38,38,0.35);
  flex-shrink: 0;
}

/* ── Pelanggan Row ── */
.pelanggan-row {
  border: 1px solid #f1f5f9;
  cursor: pointer;
}
.dark .pelanggan-row { border-color: #334155; }
.pelanggan-row:hover { background: #f8fafc; border-color: #e2e8f0; }
.dark .pelanggan-row:hover { background: #263548; border-color: #475569; }

.avatar-md {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: white;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}

/* ── Scrollbar ── */
.custom-scrollbar::-webkit-scrollbar { height: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
.dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
</style>
