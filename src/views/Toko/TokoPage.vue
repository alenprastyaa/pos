<template>
    <AdminLayout>
        <div class="space-y-6">
            <section
                class="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] sm:p-8">
                <div class="absolute inset-0 bg-gradient-to-br from-sky-50 via-white to-cyan-50 dark:from-sky-500/10 dark:via-gray-900 dark:to-cyan-500/10"></div>
                <div class="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div class="max-w-2xl">
                        <span
                            class="inline-flex items-center rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                            Manajemen Toko
                        </span>
                        <h1 class="mt-4 text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
                            Daftar Toko
                        </h1>
                        <p class="mt-2 max-w-xl text-sm leading-6 text-gray-600 dark:text-gray-400">
                            Kelola seluruh cabang toko, alamat, dan data pembuatan dalam satu tampilan yang lebih rapi.
                        </p>
                    </div>

                    <div class="flex flex-wrap gap-3">
                        <div class="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-900/70">
                            <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Total toko</p>
                            <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{{ totalToko }}</p>
                        </div>
                        <div class="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-900/70">
                            <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Terakhir dibuat</p>
                            <p class="mt-1 text-sm font-medium text-gray-900 dark:text-white">
                                {{ latestTokoLabel }}
                            </p>
                        </div>
                        <button @click="openCreateModal"
                            class="inline-flex items-center gap-2 rounded-2xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 transition hover:-translate-y-0.5 hover:bg-sky-700">
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 4V16M4 10H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                            </svg>
                            Tambah Toko
                        </button>
                    </div>
                </div>
            </section>

            <div
                class="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
                <div class="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
                    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 class="text-base font-semibold text-gray-900 dark:text-white">Data Toko</h2>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                Informasi toko yang terdaftar di sistem.
                            </p>
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            Tersedia {{ totalToko }} data
                        </p>
                    </div>
                </div>

                <div class="max-w-full overflow-x-auto custom-scrollbar">
                    <table class="min-w-full">
                        <thead class="bg-gray-50/80 dark:bg-gray-900/50">
                            <tr class="border-b border-gray-200 dark:border-gray-800">
                                <th class="px-5 py-4 text-left sm:px-6">
                                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">No</p>
                                </th>
                                <th class="px-5 py-4 text-left sm:px-6">
                                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Nama Toko</p>
                                </th>
                                <th class="px-5 py-4 text-left sm:px-6">
                                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Alamat</p>
                                </th>
                                <th class="px-5 py-4 text-left sm:px-6">
                                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Tanggal Dibuat</p>
                                </th>
                                <th class="px-5 py-4 text-left sm:px-6">
                                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Aksi</p>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                            <tr v-if="loading">
                                <td colspan="5" class="px-5 py-12 text-center sm:px-6">
                                    <div class="flex flex-col items-center gap-3">
                                        <div class="h-10 w-10 animate-spin rounded-full border-2 border-sky-600 border-t-transparent"></div>
                                        <p class="text-gray-500">Memuat data...</p>
                                    </div>
                                </td>
                            </tr>
                            <tr v-else-if="tokoList.length === 0">
                                <td colspan="5" class="px-5 py-12 text-center sm:px-6">
                                    <div class="mx-auto max-w-sm">
                                        <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-600 dark:bg-sky-500/10 dark:text-sky-300">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path d="M3 9.5L12 4l9 5.5V20a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V9.5Z"
                                                    stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" />
                                            </svg>
                                        </div>
                                        <h3 class="text-base font-semibold text-gray-900 dark:text-white">Belum ada toko</h3>
                                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            Tambahkan toko pertama untuk mulai mengelola data cabang.
                                        </p>
                                        <button @click="openCreateModal"
                                            class="mt-4 inline-flex items-center gap-2 rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700">
                                            Tambah Toko
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-for="(toko, index) in tokoList" :key="toko.id"
                                class="group transition hover:bg-gray-50/80 dark:hover:bg-white/[0.03]">
                                <td class="px-5 py-4 sm:px-6">
                                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ index + 1 }}</p>
                                </td>
                                <td class="px-5 py-4 sm:px-6">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sky-100 text-sm font-semibold text-sky-700 dark:bg-sky-500/15 dark:text-sky-300">
                                            {{ getStoreInitial(toko.nama_toko) }}
                                        </div>
                                        <div>
                                            <p class="font-medium text-gray-900 text-theme-sm dark:text-white">{{ toko.nama_toko }}</p>
                                            <p class="text-xs text-gray-500 dark:text-gray-400">Cabang aktif</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-5 py-4 sm:px-6">
                                    <p class="max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">{{ toko.alamat }}</p>
                                </td>
                                <td class="px-5 py-4 sm:px-6">
                                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(toko.createdAt) }}</p>
                                </td>
                                <td class="px-5 py-4 sm:px-6">
                                    <div class="flex flex-wrap gap-2">
                                        <button @click="openEditModal(toko)"
                                            class="inline-flex items-center rounded-xl bg-sky-50 px-3 py-2 text-sm font-medium text-sky-700 transition hover:bg-sky-100 dark:bg-sky-500/15 dark:text-sky-300 dark:hover:bg-sky-500/25">
                                            Edit
                                        </button>
                                        <button @click="deleteTokoConfirm(toko.id)"
                                            class="inline-flex items-center rounded-xl bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 dark:bg-red-500/15 dark:text-red-300 dark:hover:bg-red-500/25">
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-if="showModal"
                class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">
                <div class="w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-gray-900">
                    <div class="flex items-start justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-800">
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-[0.22em] text-sky-600 dark:text-sky-300">
                                Form Toko
                            </p>
                            <h2 class="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                                {{ isEditing ? 'Edit Toko' : 'Tambah Toko' }}
                            </h2>
                        </div>
                        <button @click="closeModal" class="rounded-full p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-200">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" />
                            </svg>
                        </button>
                    </div>

                    <form @submit.prevent="submitForm" class="space-y-5 px-6 py-6">
                        <div class="grid gap-5">
                            <div>
                                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nama Toko<span class="text-red-500">*</span>
                                </label>
                                <input v-model="formData.nama_toko" type="text" placeholder="Masukkan nama toko"
                                    class="h-11 w-full rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-sky-700" />
                            </div>

                            <div>
                                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Alamat<span class="text-red-500">*</span>
                                </label>
                                <textarea v-model="formData.alamat" placeholder="Masukkan alamat toko" rows="4"
                                    class="w-full rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-sky-300 focus:outline-none focus:ring-4 focus:ring-sky-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-sky-700"></textarea>
                            </div>
                        </div>

                        <div class="flex gap-3 pt-2">
                            <button type="button" @click="closeModal"
                                class="flex-1 rounded-2xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                                Batal
                            </button>
                            <button type="submit" :disabled="isSubmitting"
                                class="flex-1 rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-sky-600/20 transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60">
                                {{ isSubmitting ? 'Menyimpan...' : 'Simpan' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import AdminLayout from '@/components/layout/AdminLayout.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface Toko {
    id: string
    nama_toko: string
    alamat: string
    createdAt: string
    updatedAt: string
}

interface FormData {
    id: string
    nama_toko: string
    alamat: string
}

const tokoList = ref<Toko[]>([])
const loading = ref(false)
const isSubmitting = ref(false)
const showModal = ref(false)
const isEditing = ref(false)

const formData = ref<FormData>({
    id: '',
    nama_toko: '',
    alamat: '',
})

const totalToko = computed(() => tokoList.value.length)
const latestTokoLabel = computed(() => {
    const latest = tokoList.value[0]
    return latest ? formatDate(latest.createdAt) : '-'
})

const getAuthHeader = () => {
    const token = localStorage.getItem('authToken')
    return {
        Authorization: `Bearer ${token}`,
    }
}

const fetchToko = async () => {
    loading.value = true
    try {
        const response = await axios.get(`${API_BASE_URL}/toko`, {
            headers: getAuthHeader(),
        })
        if (response.data.success) {
            tokoList.value = response.data.data
        }
    } catch (error: any) {
        console.error('Fetch error:', error)
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Gagal mengambil data toko',
        })
        router.push("/signin")
    } finally {
        loading.value = false
    }
}

const openCreateModal = () => {
    isEditing.value = false
    formData.value = { id: '', nama_toko: '', alamat: '' }
    showModal.value = true
}

const getStoreInitial = (name: string) => {
    const trimmed = name.trim()
    return trimmed ? trimmed.charAt(0).toUpperCase() : 'T'
}

const openEditModal = (toko: Toko) => {
    isEditing.value = true
    formData.value = {
        id: toko.id,
        nama_toko: toko.nama_toko,
        alamat: toko.alamat,
    }
    showModal.value = true
}

const closeModal = () => {
    showModal.value = false
    formData.value = { id: '', nama_toko: '', alamat: '' }
}

const submitForm = async () => {
    if (!formData.value.nama_toko || !formData.value.alamat) {
        Swal.fire({
            icon: 'warning',
            title: 'Validasi Gagal',
            text: 'Nama toko dan alamat harus diisi!',
        })
        return
    }

    isSubmitting.value = true

    try {
        let response

        if (isEditing.value) {
            // Update toko
            response = await axios.put(
                `${API_BASE_URL}/toko/${formData.value.id}`,
                {
                    nama_toko: formData.value.nama_toko,
                    alamat: formData.value.alamat,
                },
                {
                    headers: getAuthHeader(),
                }
            )
        } else {
            // Create toko
            response = await axios.post(
                `${API_BASE_URL}/toko`,
                {
                    nama_toko: formData.value.nama_toko,
                    alamat: formData.value.alamat,
                },
                {
                    headers: getAuthHeader(),
                }
            )
        }

        if (response.data.success) {
            await Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: response.data.message,
                timer: 1500,
            })

            closeModal()
            fetchToko()
        }
    } catch (error: any) {
        console.error('Submit error:', error)
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Gagal menyimpan data toko',
        })
    } finally {
        isSubmitting.value = false
    }
}

const deleteTokoConfirm = (id: string) => {
    Swal.fire({
        title: 'Hapus Toko?',
        text: 'Data toko akan dihapus secara permanen',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Hapus',
        cancelButtonText: 'Batal',
    }).then((result) => {
        if (result.isConfirmed) {
            deleteToko(id)
        }
    })
}

const deleteToko = async (id: string) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/toko/${id}`, {
            headers: getAuthHeader(),
        })

        if (response.data.success) {
            await Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: response.data.message,
                timer: 1500,
            })

            fetchToko()
        }
    } catch (error: any) {
        console.error('Delete error:', error)
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Gagal menghapus toko',
        })
    }
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

onMounted(() => {
    fetchToko()
})
</script>
