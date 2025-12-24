<template>
    <AdminLayout>
        <div class="space-y-6">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
                        Data User
                    </h1>
                    <p class="text-gray-600 dark:text-gray-400">
                        Kelola data pengguna sistem
                    </p>
                </div>
                <button @click="openCreateModal" :disabled="!isSuperAdmin"
                    :class="{ 'opacity-50 cursor-not-allowed': !isSuperAdmin }"
                    class="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 4V16M4 10H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                    </svg>
                    Tambah User
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
                                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Nama Lengkap
                                    </p>
                                </th>
                                <th class="px-5 py-3 text-left sm:px-6">
                                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Email</p>
                                </th>
                                <th class="px-5 py-3 text-left sm:px-6">
                                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Role</p>
                                </th>
                                <th class="px-5 py-3 text-left sm:px-6">
                                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Toko</p>
                                </th>
                                <th class="px-5 py-3 text-left sm:px-6">
                                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Status</p>
                                </th>
                                <th class="px-5 py-3 text-left sm:px-6">
                                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Dibuat</p>
                                </th>
                                <th class="px-5 py-3 text-left sm:px-6">
                                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Aksi</p>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                            <tr v-if="loading" class="border-t border-gray-100 dark:border-gray-800">
                                <td colspan="8" class="px-5 py-4 text-center sm:px-6">
                                    <p class="text-gray-500">Memuat data...</p>
                                </td>
                            </tr>
                            <tr v-else-if="userList.length === 0" class="border-t border-gray-100 dark:border-gray-800">
                                <td colspan="8" class="px-5 py-4 text-center sm:px-6">
                                    <p class="text-gray-500">Tidak ada data user</p>
                                </td>
                            </tr>
                            <tr v-for="(user, index) in userList" :key="user.id"
                                class="border-t border-gray-100 dark:border-gray-800">
                                <td class="px-5 py-4 sm:px-6">
                                    <p class="text-gray-800 text-theme-sm dark:text-white/90">{{ index + 1 }}</p>
                                </td>
                                <td class="px-5 py-4 sm:px-6">
                                    <p class="text-gray-800 font-medium text-theme-sm dark:text-white/90">{{
                                        user.full_name
                                        }}</p>
                                </td>
                                <td class="px-5 py-4 sm:px-6">
                                    <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ user.email }}</p>
                                </td>
                                <td class="px-5 py-4 sm:px-6">
                                    <span :class="getRoleClass(user.role_name)">
                                        {{ user.role_name }}
                                    </span>
                                </td>
                                <td class="px-5 py-4 sm:px-6">
                                    <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ user.toko_name || '-'
                                        }}</p>
                                </td>
                                <td class="px-5 py-4 sm:px-6">
                                    <span :class="getStatusClass(user.status)">
                                        {{ user.status }}
                                    </span>
                                </td>
                                <td class="px-5 py-4 sm:px-6">
                                    <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{
                                        formatDate(user.created_at)
                                        }}</p>
                                </td>
                                <td class="px-5 py-4 sm:px-6">
                                    <div class="flex gap-2">
                                        <button :disabled="!isSuperAdmin"
                                            :class="isSuperAdmin ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-500/15 dark:text-blue-400' : 'text-gray-400 bg-gray-100 opacity-50 cursor-not-allowed'"
                                            @click="isSuperAdmin ? openEditModal(user) : null"
                                            class="px-3 py-1 rounded-lg transition">
                                            Edit
                                        </button>
                                        <button :disabled="!isSuperAdmin"
                                            :class="isSuperAdmin ? 'text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-500/15 dark:text-red-400' : 'text-gray-400 bg-gray-100 opacity-50 cursor-not-allowed'"
                                            @click="isSuperAdmin ? deleteUserConfirm(user.id) : null"
                                            class="px-3 py-1 rounded-lg transition">
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
                            {{ isEditing ? 'Edit User' : 'Tambah User Baru' }}
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
                                Nama Lengkap<span class="text-red-500">*</span>
                            </label>
                            <input v-model="formData.full_name" type="text" placeholder="Masukkan nama lengkap" required
                                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Email<span class="text-red-500">*</span>
                            </label>
                            <input v-model="formData.email" type="email" placeholder="Masukkan email" required
                                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Password<span class="text-red-500" v-if="!isEditing">*</span>
                                <span class="text-gray-400" v-if="isEditing">(Kosongkan jika tidak diubah)</span>
                            </label>
                            <input v-model="formData.password" type="password" placeholder="Masukkan password"
                                :required="!isEditing"
                                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800" />
                        </div>

                        <div>
                            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Role<span class="text-red-500">*</span>
                            </label>
                            <select v-model="formData.role_name" required
                                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                                <option value="" disabled>Pilih Role</option>
                                <option value="superadmin">Super Admin</option>
                                <option value="admin">Admin</option>
                                <option value="staff">Staff</option>
                            </select>
                        </div>

                        <div v-if="formData.role_name === 'admin' || formData.role_name === 'staff'">
                            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                                Toko<span class="text-red-500">*</span>
                            </label>
                            <select v-model="formData.toko_id" required
                                class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800">
                                <option value="" disabled>Pilih Toko</option>
                                <option v-for="toko in tokoListDropdown" :key="toko.id" :value="toko.id">
                                    {{ toko.nama_toko }}
                                </option>
                            </select>
                            <p v-if="loadingToko" class="text-xs text-gray-500 mt-1">Memuat data toko...</p>
                        </div>

                        <div v-else-if="formData.role_name === 'superadmin'">
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                *User **Super Admin** tidak memerlukan **Toko ID**.
                            </p>
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
import { ref, onMounted, computed, watch } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import AdminLayout from '@/components/layout/AdminLayout.vue'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

interface User {
    id: string
    toko_id: string | null
    status: 'active' | 'inactive' | 'pending'
    full_name: string
    email: string
    role_name: 'superadmin' | 'admin' | 'staff'
    created_at: string
    toko_name?: string
}

interface Toko {
    id: string
    nama_toko: string
}

interface UserFormData {
    id?: string
    full_name: string
    email: string
    password?: string
    role_name: 'superadmin' | 'admin' | 'staff' | ''
    toko_id: string | null
}

const currentUserRole = ref<'superadmin' | 'admin'>('superadmin')
const isSuperAdmin = computed(() => currentUserRole.value === 'superadmin')

const userList = ref<User[]>([])
const tokoListDropdown = ref<Toko[]>([])
const loading = ref(false)
const loadingToko = ref(false)
const isSubmitting = ref(false)
const showModal = ref(false)
const isEditing = ref(false)

const initialFormData: UserFormData = {
    full_name: '',
    email: '',
    password: '',
    role_name: '',
    toko_id: null,
}
const formData = ref<UserFormData>({ ...initialFormData })

const getAuthHeader = () => {
    const token = localStorage.getItem('authToken')
    return {
        Authorization: `Bearer ${token}`,
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

const getRoleClass = (role: string) => {
    switch (role.toLowerCase()) {
        case 'superadmin':
            return 'inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10 dark:bg-purple-400/10 dark:text-purple-400 dark:ring-purple-400/30'
        case 'admin':
            return 'inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/20'
        case 'staff':
            return 'inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20 dark:bg-yellow-400/10 dark:text-yellow-400 dark:ring-yellow-400/20'
        default:
            return 'inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10'
    }
}

const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
        case 'active':
            return 'inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/20'
        case 'inactive':
            return 'inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/20'
        default:
            return 'inline-flex items-center rounded-md bg-gray-50 px-2 py-1 text-xs font-medium text-gray-600 ring-1 ring-inset ring-gray-500/10'
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
    } catch (error: any) {
        console.error('Fetch Toko error:', error)
    } finally {
        loadingToko.value = false
    }
}

const fetchUser = async () => {
    loading.value = true
    try {
        const response = await axios.get(`${API_BASE_URL}/user`, {
            headers: getAuthHeader(),
        })

        if (response.data.success) {
            const users = response.data.data as User[]

            const tokoMap = new Map(tokoListDropdown.value.map(toko => [toko.id, toko.nama_toko]))

            userList.value = users.map(user => ({
                ...user,
                toko_name: user.toko_id ? tokoMap.get(user.toko_id) : undefined,
            }))
        }
    } catch (error: any) {
        console.error('Fetch User error:', error)
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Gagal mengambil data user',
        })
    } finally {
        loading.value = false
    }
}

const openCreateModal = async () => {
    if (!isSuperAdmin.value) return
    if (tokoListDropdown.value.length === 0 && !loadingToko.value) {
        await fetchToko()
    }
    isEditing.value = false
    formData.value = { ...initialFormData }
    showModal.value = true
}

const openEditModal = async (user: User) => {
    if (!isSuperAdmin.value) return
    if (tokoListDropdown.value.length === 0 && !loadingToko.value) {
        await fetchToko()
    }
    isEditing.value = true
    formData.value = {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        password: '',
        role_name: user.role_name,
        toko_id: user.toko_id || '',
    }
    showModal.value = true
}

const deleteUserConfirm = (id: string) => {
    if (!isSuperAdmin.value) return
    Swal.fire({
        title: 'Hapus User?',
        text: 'Data user akan dihapus secara permanen',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Hapus',
        cancelButtonText: 'Batal',
    }).then((result) => {
        if (result.isConfirmed) {
            deleteUser(id)
        }
    })
}

const deleteUser = async (id: string) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/user/${id}`, {
            headers: getAuthHeader(),
        })

        if (response.data.success) {
            await Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: response.data.message || 'User berhasil dihapus',
                timer: 1500,
            })
            fetchUser()
        }
    } catch (error: any) {
        console.error('Delete error:', error)
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Gagal menghapus user',
        })
    }
}

const closeModal = () => {
    showModal.value = false
    formData.value = { ...initialFormData }
    isEditing.value = false
}

const validateForm = () => {
    const data = formData.value

    if (!data.full_name || !data.email || !data.role_name) {
        return 'Nama lengkap, email, dan role wajib diisi.'
    }

    if (!isEditing.value && !data.password) {
        return 'Password wajib diisi untuk registrasi user baru.'
    }

    if ((data.role_name === 'admin' || data.role_name === 'staff') && !data.toko_id) {
        return 'Role Admin/Staff harus memilih Toko.'
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

    let payload: any = {
        full_name: formData.value.full_name,
        email: formData.value.email,
        role_name: formData.value.role_name,
    }

    if (formData.value.password && formData.value.password.length > 0) {
        payload.password = formData.value.password
    }

    if (formData.value.role_name !== 'superadmin') {
        payload.toko_id = formData.value.toko_id
    }

    try {
        let response
        let url = `${API_BASE_URL}/user`

        if (isEditing.value) {
            // EDIT / UPDATE
            url = `${API_BASE_URL}/user/${formData.value.id}`
            response = await axios.put(url, payload, { headers: getAuthHeader() })
        } else {
            // CREATE / REGISTER
            url = `${API_BASE_URL}/user/auth/register`
            response = await axios.post(url, payload, { headers: getAuthHeader() })
        }

        if (response.data.success) {
            await Swal.fire({
                icon: 'success',
                title: 'Berhasil',
                text: response.data.message || 'Data user berhasil disimpan',
                timer: 1500,
            })

            closeModal()
            fetchUser()
        }
    } catch (error: any) {
        console.error('Submit error:', error)
        Swal.fire({
            icon: 'error',
            title: `Error ${isEditing.value ? 'Update' : 'Registrasi'}`,
            text: error.response?.data?.message || 'Gagal menyimpan data user',
        })
    } finally {
        isSubmitting.value = false
    }
}

watch(() => formData.value.role_name, (newRole) => {
    if (newRole === 'superadmin') {
        formData.value.toko_id = null
    } else if (newRole === 'admin' || newRole === 'staff') {
        if (formData.value.toko_id === null) {
            formData.value.toko_id = '' as any;
        }
    }
});


onMounted(async () => {
    await fetchToko()
    await fetchUser()

})
</script>