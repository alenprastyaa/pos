<template>
    <AdminLayout>
        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
                        Daftar Toko
                    </h1>
                </div>
                <button @click="openCreateModal"
                    class="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 4V16M4 10H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    </svg>
                    Tambah Toko
                </button>
            </div>
            <div
                class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
                <div class="max-w-full overflow-x-auto custom-scrollbar">
                    <table class="min-w-full">
                        <thead>
                            <tr class="border-b border-gray-200 dark:border-gray-700">
                                <th class="px-5 py-3 text-left sm:px-6">
                                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">No</p>
                                </th>
                                <th class="px-5 py-3 text-left sm:px-6">
                                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Nama Toko</p>
                                </th>
                                <th class="px-5 py-3 text-left sm:px-6">
                                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Alamat</p>
                                </th>
                                <th class="px-5 py-3 text-left sm:px-6">
                                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Tanggal Dibuat
                                    </p>
                                </th>
                                <th class="px-5 py-3 text-left sm:px-6">
                                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Aksi</p>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                            <tr v-if="loading" class="border-t border-gray-100 dark:border-gray-800">
                                <td colspan="5" class="px-5 py-4 text-center sm:px-6">
                                    <p class="text-gray-500">Memuat data...</p>
                                </td>
                            </tr>
                            <tr v-else-if="tokoList.length === 0" class="border-t border-gray-100 dark:border-gray-800">
                                <td colspan="5" class="px-5 py-4 text-center sm:px-6">
                                    <p class="text-gray-500">Tidak ada data toko</p>
                                </td>
                            </tr>
                            <tr v-for="(toko, index) in tokoList" :key="toko.id"
                                class="border-t border-gray-100 dark:border-gray-800">
                                <td class="px-5 py-4 sm:px-6">
                                    <p class="text-gray-800 text-theme-sm dark:text-white/90">{{ index + 1 }}</p>
                                </td>
                                <td class="px-5 py-4 sm:px-6">
                                    <p class="text-gray-800 font-medium text-theme-sm dark:text-white/90">{{
                                        toko.nama_toko
                                    }}</p>
                                </td>
                                <td class="px-5 py-4 sm:px-6">
                                    <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ toko.alamat }}</p>
                                </td>
                                <td class="px-5 py-4 sm:px-6">
                                    <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{
                                        formatDate(toko.createdAt)
                                    }}</p>
                                </td>
                                <td class="px-5 py-4 sm:px-6">
                                    <div class="flex gap-2">
                                        <button @click="openEditModal(toko)"
                                            class="px-3 py-1 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 dark:bg-blue-500/15 dark:text-blue-400 transition">
                                            Edit
                                        </button>
                                        <button @click="deleteTokoConfirm(toko.id)"
                                            class="px-3 py-1 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 dark:bg-red-500/15 dark:text-red-400 transition">
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
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                <div class="bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6">
                    <div class="flex items-center justify-between mb-4">
                        <h2 class="text-xl font-semibold text-gray-900 dark:text-white">
                            {{ isEditing ? 'Edit Toko' : 'Tambah Toko' }}
                        </h2>
                        <button @click="closeModal" class="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" />
                            </svg>
                        </button>
                    </div>

                    <form @submit.prevent="submitForm" class="space-y-4">
                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Nama Toko<span class="text-red-500">*</span>
                            </label>
                            <input v-model="formData.nama_toko" type="text" placeholder="Masukkan nama toko"
                                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Alamat<span class="text-red-500">*</span>
                            </label>
                            <textarea v-model="formData.alamat" placeholder="Masukkan alamat toko" rows="3"
                                class="dark:bg-dark-900 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"></textarea>
                        </div>

                        <div class="flex gap-3 pt-4">
                            <button type="button" @click="closeModal"
                                class="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition">
                                Batal
                            </button>
                            <button type="submit" :disabled="isSubmitting"
                                class="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
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
import { ref, onMounted } from 'vue'
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