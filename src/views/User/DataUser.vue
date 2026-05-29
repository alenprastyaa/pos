<template>
    <AdminLayout>
        <div class="space-y-6">
            <section
                class="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] sm:p-8">
                <div class="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-fuchsia-50 dark:from-violet-500/10 dark:via-gray-900 dark:to-fuchsia-500/10"></div>
                <div class="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div class="max-w-2xl">
                        <span
                            class="inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                            Manajemen User
                        </span>
                        <h1 class="mt-4 text-2xl font-semibold text-gray-900 dark:text-white sm:text-3xl">
                            Data User
                        </h1>
                        <p class="mt-2 max-w-xl text-sm leading-6 text-gray-600 dark:text-gray-400">
                            Kelola akun pengguna, role, status, dan penugasan toko dengan tampilan yang lebih ringkas.
                        </p>
                    </div>

                    <div class="flex flex-wrap gap-3">
                        <div class="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-900/70">
                            <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Total user</p>
                            <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{{ totalUsers }}</p>
                        </div>
                        <div class="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 shadow-sm backdrop-blur dark:border-gray-700 dark:bg-gray-900/70">
                            <p class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Active</p>
                            <p class="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{{ activeUsers }}</p>
                        </div>
                        <button @click="openCreateModal" :disabled="!isSuperAdmin"
                            :class="[
                                'inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold shadow-lg transition',
                                isSuperAdmin
                                    ? 'bg-violet-600 text-white shadow-violet-600/20 hover:-translate-y-0.5 hover:bg-violet-700'
                                    : 'cursor-not-allowed bg-gray-300 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                            ]">
                            <svg width="18" height="18" viewBox="0 0 20 20" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 4V16M4 10H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                            </svg>
                            Tambah User
                        </button>
                    </div>
                </div>
            </section>

            <div class="grid gap-4 sm:grid-cols-3">
                <div class="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Super Admin</p>
                    <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{{ superAdminUsers }}</p>
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Role dengan akses penuh</p>
                </div>
                <div class="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Admin</p>
                    <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{{ adminUsers }}</p>
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Biasanya terhubung ke toko</p>
                </div>
                <div class="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
                    <p class="text-sm text-gray-500 dark:text-gray-400">Staff</p>
                    <p class="mt-2 text-2xl font-semibold text-gray-900 dark:text-white">{{ staffUsers }}</p>
                    <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">Akun operasional harian</p>
                </div>
            </div>

            <div
                class="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
                <div class="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
                    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 class="text-base font-semibold text-gray-900 dark:text-white">Daftar Pengguna</h2>
                            <p class="text-sm text-gray-500 dark:text-gray-400">
                                Pengguna yang terdaftar di sistem POS.
                            </p>
                        </div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">
                            Tersedia {{ totalUsers }} data
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
                                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Nama Lengkap</p>
                                </th>
                                <th class="px-5 py-4 text-left sm:px-6">
                                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Email</p>
                                </th>
                                <th class="px-5 py-4 text-left sm:px-6">
                                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Role</p>
                                </th>
                                <th class="px-5 py-4 text-left sm:px-6">
                                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Toko</p>
                                </th>
                                <th class="px-5 py-4 text-left sm:px-6">
                                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Status</p>
                                </th>
                                <th class="px-5 py-4 text-left sm:px-6">
                                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Dibuat</p>
                                </th>
                                <th class="px-5 py-4 text-left sm:px-6">
                                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Aksi</p>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 dark:divide-gray-800">
                            <tr v-if="loading">
                                <td colspan="8" class="px-5 py-12 text-center sm:px-6">
                                    <div class="flex flex-col items-center gap-3">
                                        <div class="h-10 w-10 animate-spin rounded-full border-2 border-violet-600 border-t-transparent"></div>
                                        <p class="text-gray-500">Memuat data...</p>
                                    </div>
                                </td>
                            </tr>
                            <tr v-else-if="userList.length === 0">
                                <td colspan="8" class="px-5 py-12 text-center sm:px-6">
                                    <div class="mx-auto max-w-sm">
                                        <div class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <path d="M12 13a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm8 8v-1a7 7 0 0 0-14 0v1"
                                                    stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                                            </svg>
                                        </div>
                                        <h3 class="text-base font-semibold text-gray-900 dark:text-white">Belum ada user</h3>
                                        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            Tambahkan akun baru untuk mulai mengelola akses pengguna.
                                        </p>
                                        <button @click="openCreateModal" :disabled="!isSuperAdmin"
                                            :class="[
                                                'mt-4 inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition',
                                                isSuperAdmin
                                                    ? 'bg-violet-600 text-white hover:bg-violet-700'
                                                    : 'cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-gray-800 dark:text-gray-400'
                                            ]">
                                            Tambah User
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-for="(user, index) in userList" :key="user.id"
                                class="group transition hover:bg-gray-50/80 dark:hover:bg-white/[0.03]">
                                <td class="px-5 py-4 sm:px-6">
                                    <p class="text-sm font-medium text-gray-900 dark:text-white">{{ index + 1 }}</p>
                                </td>
                                <td class="px-5 py-4 sm:px-6">
                                    <div class="flex items-center gap-3">
                                        <div
                                            class="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-sm font-semibold text-violet-700 dark:bg-violet-500/15 dark:text-violet-300">
                                            {{ getInitials(user.full_name) }}
                                        </div>
                                        <div>
                                            <p class="font-medium text-gray-900 text-theme-sm dark:text-white">{{ user.full_name }}</p>
                                            <p class="text-xs text-gray-500 dark:text-gray-400">ID: {{ user.id.slice(0, 8) }}</p>
                                        </div>
                                    </div>
                                </td>
                                <td class="px-5 py-4 sm:px-6">
                                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ user.email }}</p>
                                </td>
                                <td class="px-5 py-4 sm:px-6">
                                    <span :class="getRoleClass(user.role_name)">
                                        {{ user.role_name }}
                                    </span>
                                </td>
                                <td class="px-5 py-4 sm:px-6">
                                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ user.toko_name || '-' }}</p>
                                </td>
                                <td class="px-5 py-4 sm:px-6">
                                    <span :class="getStatusClass(user.status)">
                                        {{ user.status }}
                                    </span>
                                </td>
                                <td class="px-5 py-4 sm:px-6">
                                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(user.created_at) }}</p>
                                </td>
                                <td class="px-5 py-4 sm:px-6">
                                    <div class="flex flex-wrap gap-2">
                                        <button :disabled="!isSuperAdmin"
                                            :class="[
                                                'rounded-xl px-3 py-2 text-sm font-medium transition',
                                                isSuperAdmin
                                                    ? 'bg-violet-50 text-violet-700 hover:bg-violet-100 dark:bg-violet-500/15 dark:text-violet-300 dark:hover:bg-violet-500/25'
                                                    : 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                                            ]"
                                            @click="isSuperAdmin ? openEditModal(user) : null">
                                            Edit
                                        </button>
                                        <button :disabled="!isSuperAdmin"
                                            :class="[
                                                'rounded-xl px-3 py-2 text-sm font-medium transition',
                                                isSuperAdmin
                                                    ? 'bg-red-50 text-red-700 hover:bg-red-100 dark:bg-red-500/15 dark:text-red-300 dark:hover:bg-red-500/25'
                                                    : 'cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                                            ]"
                                            @click="isSuperAdmin ? deleteUserConfirm(user.id) : null">
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
                <div class="w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-gray-900">
                    <div class="flex items-start justify-between border-b border-gray-200 px-6 py-5 dark:border-gray-800">
                        <div>
                            <p class="text-xs font-semibold uppercase tracking-[0.22em] text-violet-600 dark:text-violet-300">
                                Form User
                            </p>
                            <h2 class="mt-1 text-xl font-semibold text-gray-900 dark:text-white">
                                {{ isEditing ? 'Edit User' : 'Tambah User Baru' }}
                            </h2>
                            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                Atur identitas akun, role, dan toko yang terhubung.
                            </p>
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
                        <div class="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Nama Lengkap<span class="text-red-500">*</span>
                                </label>
                                <input v-model="formData.full_name" type="text" placeholder="Masukkan nama lengkap" required
                                    class="h-11 w-full rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-violet-300 focus:outline-none focus:ring-4 focus:ring-violet-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-violet-700" />
                            </div>

                            <div>
                                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email<span class="text-red-500">*</span>
                                </label>
                                <input v-model="formData.email" type="email" placeholder="Masukkan email" required
                                    class="h-11 w-full rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-violet-300 focus:outline-none focus:ring-4 focus:ring-violet-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-violet-700" />
                            </div>
                        </div>

                        <div class="grid gap-5 sm:grid-cols-2">
                            <div>
                                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Password<span class="text-red-500" v-if="!isEditing">*</span>
                                    <span class="text-gray-400" v-if="isEditing">(Kosongkan jika tidak diubah)</span>
                                </label>
                                <input v-model="formData.password" type="password" placeholder="Masukkan password"
                                    :required="!isEditing"
                                    class="h-11 w-full rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm placeholder:text-gray-400 focus:border-violet-300 focus:outline-none focus:ring-4 focus:ring-violet-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-violet-700" />
                            </div>

                            <div>
                                <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Role<span class="text-red-500">*</span>
                                </label>
                                <select v-model="formData.role_name" required
                                    class="h-11 w-full rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm focus:border-violet-300 focus:outline-none focus:ring-4 focus:ring-violet-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white/90 dark:focus:border-violet-700">
                                    <option value="" disabled>Pilih Role</option>
                                    <option value="superadmin">Super Admin</option>
                                    <option value="admin">Admin</option>
                                    <option value="staff">Staff</option>
                                </select>
                            </div>
                        </div>

                        <div v-if="formData.role_name === 'admin' || formData.role_name === 'staff'"
                            class="rounded-2xl border border-dashed border-violet-200 bg-violet-50/60 p-4 dark:border-violet-500/20 dark:bg-violet-500/10">
                            <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Toko<span class="text-red-500">*</span>
                            </label>
                            <select v-model="formData.toko_id" required
                                class="h-11 w-full rounded-2xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 shadow-sm focus:border-violet-300 focus:outline-none focus:ring-4 focus:ring-violet-500/10 dark:border-gray-700 dark:bg-gray-950 dark:text-white/90 dark:focus:border-violet-700">
                                <option value="" disabled>Pilih Toko</option>
                                <option v-for="toko in tokoListDropdown" :key="toko.id" :value="toko.id">
                                    {{ toko.nama_toko }}
                                </option>
                            </select>
                            <p v-if="loadingToko" class="mt-2 text-xs text-gray-500">Memuat data toko...</p>
                        </div>

                        <div v-else-if="formData.role_name === 'superadmin'"
                            class="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                            <p class="text-sm leading-6 text-gray-500 dark:text-gray-400">
                                Super Admin tidak memerlukan Toko ID.
                            </p>
                        </div>

                        <div class="flex gap-3 pt-2">
                            <button type="button" @click="closeModal"
                                class="flex-1 rounded-2xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                                Batal
                            </button>
                            <button type="submit" :disabled="isSubmitting"
                                class="flex-1 rounded-2xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-600/20 transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60">
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

const currentUserRole = ref<'superadmin' | 'admin' | 'staff'>(
    (localStorage.getItem('role_name') as 'superadmin' | 'admin' | 'staff') || 'superadmin'
)
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

const totalUsers = computed(() => userList.value.length)
const activeUsers = computed(() => userList.value.filter((user) => user.status === 'active').length)
const superAdminUsers = computed(() => userList.value.filter((user) => user.role_name === 'superadmin').length)
const adminUsers = computed(() => userList.value.filter((user) => user.role_name === 'admin').length)
const staffUsers = computed(() => userList.value.filter((user) => user.role_name === 'staff').length)

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

const getInitials = (name: string) => {
    return name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || '')
        .join('')
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
