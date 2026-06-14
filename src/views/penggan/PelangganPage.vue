<template>
  <AdminLayout>
    <div class="py-3 space-y-5">
      <div class="page-header rounded-2xl border border-divider p-5 shadow-sm">
        <div>
          <p class="text-xl font-bold text-title">Kelola Data Pelanggan</p>
          <p class="mt-1 text-sm text-muted">Pantau daftar pelanggan dan sisa hutang toko.</p>
        </div>

        <button
          @click="openModal(null)"
          class="btn-primary font-semibold py-2.5 px-4 rounded-xl shadow-sm flex items-center gap-2"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          Tambah Pelanggan
        </button>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div class="summary-card rounded-2xl border border-divider p-4">
          <p class="text-xs font-bold uppercase tracking-wider text-muted">Total Pelanggan</p>
          <p class="mt-1 text-2xl font-black text-title">{{ pelangganList.length }}</p>
        </div>
        <div class="summary-card rounded-2xl border border-divider p-4">
          <p class="text-xs font-bold uppercase tracking-wider text-muted">Punya Hutang</p>
          <p class="mt-1 text-2xl font-black text-danger">{{ pelangganWithDebt }}</p>
        </div>
        <div class="summary-card rounded-2xl border border-divider p-4">
          <p class="text-xs font-bold uppercase tracking-wider text-muted">Total Hutang</p>
          <p class="mt-1 text-2xl font-black text-title">{{ formatRupiah(totalDebt) }}</p>
        </div>
      </div>

      <div class="card-container rounded-2xl shadow-sm border border-divider overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead class="table-header border-b border-divider">
              <tr>
                <th class="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider w-16">
                  No
                </th>
                <th class="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider">
                  Nama Pelanggan
                </th>
                <th class="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider">
                  Alamat
                </th>
                <th class="px-5 py-3 text-right text-xs font-bold uppercase tracking-wider">
                  Sisa Hutang
                </th>
                <th class="px-5 py-3 text-center text-xs font-bold uppercase tracking-wider w-44">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-divider">
              <tr v-if="loading">
                <td colspan="5" class="px-6 py-10 text-center">
                  <p class="text-sm font-semibold text-muted">Memuat data pelanggan...</p>
                </td>
              </tr>
              <tr v-if="pelangganList.length === 0 && !loading">
                <td colspan="5" class="px-6 py-10 text-center text-muted">
                  Belum ada data pelanggan.
                </td>
              </tr>

              <tr
                v-for="(pelanggan, index) in pelangganList"
                :key="pelanggan.id"
                class="table-row-hover"
              >
                <td class="px-5 py-4 whitespace-nowrap text-sm font-bold text-muted">
                  {{ index + 1 }}
                </td>
                <td class="px-5 py-4 whitespace-nowrap">
                  <div class="flex items-center gap-3">
                    <div
                      class="avatar-circle flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black"
                    >
                      {{ pelanggan.nama_pelanggan?.charAt(0)?.toUpperCase() || '?' }}
                    </div>
                    <div class="min-w-0">
                      <p class="truncate text-sm font-bold text-main">
                        {{ pelanggan.nama_pelanggan }}
                      </p>
                      <p class="text-xs text-muted">Pelanggan toko</p>
                    </div>
                  </div>
                </td>
                <td class="px-5 py-4 whitespace-normal text-sm text-body max-w-md">
                  {{ pelanggan.alamat || '-' }}
                </td>
                <td class="px-5 py-4 whitespace-nowrap text-right">
                  <span
                    :class="
                      parseFloat(pelanggan.hutang) > 0 ? 'debt-badge-danger' : 'debt-badge-success'
                    "
                    class="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-bold"
                  >
                    {{ formatRupiah(parseFloat(pelanggan.hutang)) }}
                  </span>
                </td>
                <td class="px-5 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div class="flex justify-center gap-2">
                    <button
                      @click="openModal(pelanggan)"
                      class="action-btn action-edit rounded-xl px-3 py-2"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        ></path>
                      </svg>
                      <span>Edit</span>
                    </button>
                    <button
                      @click="deletePelanggan(pelanggan.id)"
                      class="action-btn action-delete rounded-xl px-3 py-2"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        ></path>
                      </svg>
                      <span>Hapus</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div
      v-if="isModalOpen"
      class="fixed inset-0 z-[100000] flex items-center justify-center modal-overlay backdrop-blur-sm p-4"
    >
      <div
        class="relative p-6 w-full max-w-lg mx-auto bg-white rounded-2xl shadow-xl transform transition-all"
      >
        <div class="flex justify-between items-center pb-3 border-b border-divider">
          <h3 class="text-lg font-semibold text-title">
            {{ isEditMode ? 'Edit' : 'Tambah' }} Pelanggan
          </h3>
          <button
            @click="closeModal"
            class="text-muted bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </button>
        </div>

        <form @submit.prevent="savePelanggan" class="mt-4 space-y-4">
          <div>
            <label for="nama_pelanggan" class="block mb-2 text-sm font-medium text-title"
              >Nama Pelanggan</label
            >
            <input
              type="text"
              id="nama_pelanggan"
              v-model="form.nama_pelanggan"
              required
              class="input-field w-full rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label for="alamat" class="block mb-2 text-sm font-medium text-title">Alamat</label>
            <textarea
              id="alamat"
              v-model="form.alamat"
              class="input-field w-full rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-divider">
            <button
              type="button"
              @click="closeModal"
              class="btn-secondary font-semibold py-2 px-4 rounded-xl flex items-center gap-2"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="isSaving"
              class="btn-primary font-semibold py-2 px-4 rounded-xl shadow-sm disabled:bg-gray-400 flex items-center gap-2"
            >
              <svg v-if="isSaving" class="animate-spin h-5 w-5" viewBox="0 0 24 24">
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
              {{ isSaving ? 'Menyimpan...' : 'Simpan' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useRouter } from 'vue-router'

// LOGIC TIDAK BERUBAH
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const router = useRouter()

interface Pelanggan {
  id: string
  nama_pelanggan: string
  alamat: string
  hutang: string
  user_id?: string
  toko_id?: string
  createdAt?: string
  updatedAt?: string
}

// --- States ---
const pelangganList = ref<Pelanggan[]>([])
const loading = ref(false)
const isModalOpen = ref(false)
const isEditMode = ref(false)
const isSaving = ref(false)
const form = ref<Partial<Pelanggan>>({
  id: '',
  nama_pelanggan: '',
  alamat: '',
  hutang: '0',
})

const pelangganWithDebt = computed(() => {
  return pelangganList.value.filter((pelanggan) => Number(pelanggan.hutang || 0) > 0).length
})

const totalDebt = computed(() => {
  return pelangganList.value.reduce((sum, pelanggan) => sum + Number(pelanggan.hutang || 0), 0)
})

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken')
  return { Authorization: `Bearer ${token}` }
}

const formatRupiah = (number: number) => {
  if (number === null || number === undefined || isNaN(number)) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(number)
}

const fetchPelanggan = async () => {
  loading.value = true
  try {
    const response = await axios.get(`${API_BASE_URL}/pelanggan`, {
      headers: getAuthHeader(),
    })
    if (response.data.success) {
      pelangganList.value = response.data.data.map((p: any) => ({
        ...p,
        hutang: String(p.hutang || '0'),
      }))
    }
  } catch (error: any) {
    const errorMessage = error.response?.data?.message
    router.push('/signin')
    Swal.fire('Error', errorMessage, 'error')
  } finally {
    loading.value = false // Pastikan loading dimatikan
  }
}

const savePelanggan = async () => {
  if (!form.value.nama_pelanggan) {
    Swal.fire('Peringatan', 'Nama Pelanggan harus diisi.', 'warning')
    return
  }

  isSaving.value = true

  try {
    let response
    const payload = {
      nama_pelanggan: form.value.nama_pelanggan,
      alamat: form.value.alamat,
    }

    if (isEditMode.value) {
      response = await axios.put(`${API_BASE_URL}/pelanggan/${form.value.id}`, payload, {
        headers: getAuthHeader(),
      })
    } else {
      response = await axios.post(`${API_BASE_URL}/pelanggan`, payload, {
        headers: getAuthHeader(),
      })
    }

    if (response.data.success) {
      Swal.fire(
        'Berhasil',
        `Data pelanggan berhasil di${isEditMode.value ? 'update' : 'tambah'}.`,
        'success',
      )
      closeModal()
      fetchPelanggan()
    } else {
      Swal.fire('Gagal', response.data.message || 'Terjadi kesalahan saat menyimpan data.', 'error')
    }
  } catch (error: any) {
    console.error('Error saving pelanggan:', error)
    const errorMessage = error.response?.data?.message || 'Gagal terhubung ke server.'
    Swal.fire('Error', errorMessage, 'error')
  } finally {
    isSaving.value = false
  }
}

const deletePelanggan = async (id: string) => {
  const result = await Swal.fire({
    title: 'Anda Yakin?',
    text: 'Data pelanggan yang dihapus tidak dapat dikembalikan!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Ya, Hapus!',
    cancelButtonText: 'Batal',
  })

  if (result.isConfirmed) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/pelanggan/delete/${id}`, {
        headers: getAuthHeader(),
      })

      if (response.data.success) {
        Swal.fire('Dihapus!', 'Data pelanggan berhasil dihapus.', 'success')
        fetchPelanggan()
      } else {
        Swal.fire(
          'Gagal',
          response.data.message || 'Terjadi kesalahan saat menghapus data.',
          'error',
        )
      }
    } catch (error: any) {
      console.error('Error deleting pelanggan:', error)
      const errorMessage = error.response?.data?.message || 'Gagal terhubung ke server.'
      Swal.fire('Error', errorMessage, 'error')
    }
  }
}

const openModal = (pelanggan: Pelanggan | null) => {
  if (pelanggan) {
    isEditMode.value = true
    form.value = {
      id: pelanggan.id,
      nama_pelanggan: pelanggan.nama_pelanggan,
      alamat: pelanggan.alamat,
      hutang: pelanggan.hutang,
    }
  } else {
    isEditMode.value = false
    form.value = { id: '', nama_pelanggan: '', alamat: '', hutang: '0' }
  }
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  form.value = { id: '', nama_pelanggan: '', alamat: '', hutang: '0' }
}

onMounted(() => {
  fetchPelanggan()
})
</script>

<style scoped>
/* DEFINISI WARNA NATIVE CSS (HEX) */

/* Warna Teks */
.text-title {
  color: #111827;
  /* Gray 900 */
}

.text-main {
  color: #111827;
  /* Gray 900 */
}

.text-body {
  color: #374151;
  /* Gray 700 */
}

.text-muted {
  color: #6b7280;
  /* Gray 500 */
}

.text-danger {
  color: #dc2626;
  /* Red 600 */
}

.text-success {
  color: #16a34a;
  /* Green 600 */
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

.summary-card {
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.04);
}

/* Background & Border */
.bg-white {
  background-color: #ffffff;
}

.card-container {
  background-color: #ffffff;
  border-color: #e5e7eb;
  /* Gray 200 */
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
}

.border-divider {
  border-color: #e5e7eb;
  /* Gray 200 */
}

.divide-divider > :not([hidden]) ~ :not([hidden]) {
  border-color: #e5e7eb;
  /* Gray 200 */
}

/* Table Styles */
.table-header {
  background-color: #f8fafc;
}

.table-header th {
  color: #6b7280;
  /* Gray 500 */
}

.table-row-hover:hover {
  background-color: #f8fafc;
}

.avatar-circle {
  background: #eff6ff;
  color: #2563eb;
}

.debt-badge-danger {
  background: #fef2f2;
  color: #dc2626;
}

.debt-badge-success {
  background: #ecfdf5;
  color: #059669;
}

/* Buttons */
.btn-primary {
  background-color: #2563eb;
  /* Blue 600 */
  color: #ffffff;
  transition: background-color 0.2s;
}

.btn-primary:hover {
  background-color: #1d4ed8;
  /* Blue 700 */
}

.btn-primary:disabled {
  background-color: #9ca3af;
  /* Gray 400 */
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f3f4f6;
  color: #374151;
  transition: background-color 0.2s;
}

.btn-secondary:hover {
  background-color: #e5e7eb;
}

/* Icon Buttons */
.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.8125rem;
  font-weight: 700;
  transition:
    background-color 0.2s,
    color 0.2s,
    transform 0.2s;
}

.action-btn:hover {
  transform: translateY(-1px);
}

.action-edit {
  background: #eff6ff;
  color: #2563eb;
}

.action-edit:hover {
  background: #dbeafe;
  color: #1d4ed8;
}

.action-delete {
  background: #fef2f2;
  color: #dc2626;
}

.action-delete:hover {
  background: #fee2e2;
  color: #b91c1c;
}

/* Form Inputs */
.input-field {
  border: 1px solid #d1d5db;
  /* Gray 300 */
  color: #111827;
  /* Gray 900 */
  background-color: #ffffff;
}

/* Modal Overlay (Background Semi-transparent) */
.modal-overlay {
  background-color: rgba(0, 0, 0, 0.3);
}
</style>
