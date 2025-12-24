<template>
  <div>
    <div class="p-5 mb-6 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Informasi Profil & Akun
          </h4>

          <div v-if="loading" class="text-blue-500 dark:text-blue-400">Memuat data profil...</div>

          <div v-else-if="userData" class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Nama Lengkap</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ userData.full_name }}</p>
            </div>

            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Role</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90 capitalize">{{ userData.role_name }}</p>
            </div>

            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Email</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ userData.email }}</p>
            </div>

            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Status Akun</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90 capitalize">{{ userData.status }}</p>
            </div>

            <div v-if="userData.toko" class="lg:col-span-2">
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Toko</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                {{ userData.toko.nama_toko }}
                <span>(ID: {{ userData.toko.id.substring(0, 8) }}...)</span>
              </p>
            </div>

            <div v-if="userData.toko" class="lg:col-span-2">
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Alamat Toko</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">{{ userData.toko.alamat }}</p>
            </div>

            <div v-if="!userData.toko" class="lg:col-span-2">
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Toko</p>
              <p class="text-sm font-medium text-gray-600 dark:text-gray-500 italic">Tidak ada toko yang terdaftar</p>
            </div>
          </div>

          <div v-else class="text-red-500 dark:text-red-400">Gagal memuat data.</div>
        </div>


      </div>
    </div>

    <Modal v-if="isProfileInfoModal" @close="isProfileInfoModal = false">
      <template #body>
        <div
          class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <button @click="isProfileInfoModal = false"
            class="transition-color absolute right-5 top-5 z-999 flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300">
            <svg class="fill-current" width="24" height="24" viewBox="0 0 24 24" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M6.04289 16.5418C5.65237 16.9323 5.65237 17.5655 6.04289 17.956C6.43342 18.3465 7.06658 18.3465 7.45711 17.956L11.9987 13.4144L16.5408 17.9565C16.9313 18.347 17.5645 18.347 17.955 17.9565C18.3455 17.566 18.3455 16.9328 17.955 16.5423L13.4129 12.0002L17.955 7.45808C18.3455 7.06756 18.3455 6.43439 17.955 6.04387C17.5645 5.65335 16.9313 5.65335 16.5408 6.04387L11.9987 10.586L7.45711 6.04439C7.06658 5.65386 6.43342 5.65386 6.04289 6.04439C5.65237 6.43491 5.65237 7.06808 6.04289 7.4586L10.5845 12.0002L6.04289 16.5418Z"
                fill="currentColor" />
            </svg>
          </button>
          <div class="px-2 pr-14">
            <h4 class="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit Akun Pengguna
            </h4>
            <p class="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Perbarui nama lengkap dan email Anda.
            </p>
          </div>

          <form @submit.prevent="saveProfile" class="flex flex-col">
            <div class="custom-scrollbar h-auto max-h-[450px] overflow-y-auto p-2">
              <div class="mt-7">
                <h5 class="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Informasi Personal
                </h5>

                <div class="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">

                  <div class="col-span-2 lg:col-span-1">
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Nama Lengkap
                    </label>
                    <input type="text" v-model="editForm.full_name" required
                      class="h-11 w-full rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-blue-500 focus:outline-hidden focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-blue-800" />
                  </div>

                  <div class="col-span-2 lg:col-span-1">
                    <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
                      Email Address
                    </label>
                    <input type="email" v-model="editForm.email" required
                      class="h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-blue-500 focus:outline-hidden focus:ring-3 focus:ring-blue-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-blue-800" />
                  </div>

                  <div class="col-span-2">
                    <h6 class="mb-2 text-sm font-medium text-gray-800 dark:text-white/90 mt-4">Informasi Tambahan</h6>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Nama Toko:
                      {{ userData.toko?.nama_toko || "Tidak ada toko terdaftar" }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">Role Anda: {{ userData.role_name }}</p>
                  </div>

                </div>
              </div>
            </div>

            <div class="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <button @click="isProfileInfoModal = false" type="button"
                class="flex w-full justify-center rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] sm:w-auto">
                Tutup
              </button>
              <button type="submit" :disabled="isSaving"
                class="flex w-full justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 sm:w-auto disabled:bg-gray-400">
                <svg v-if="isSaving" class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                  </path>
                </svg>
                {{ isSaving ? 'Menyimpan...' : 'Simpan Perubahan' }}
              </button>
            </div>
          </form>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'
import Modal from './Modal.vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const userData = ref(null)
const editForm = ref({
  full_name: '',
  email: '',
})
const loading = ref(false)
const isSaving = ref(false)
const isProfileInfoModal = ref(false)

const getAuthHeader = () => {
  const token = localStorage.getItem('authToken')
  return { Authorization: `Bearer ${token}` }
}

const fetchProfileData = async () => {
  loading.value = true
  try {
    const response = await axios.get(`${API_BASE_URL}/user/my/data`, {
      headers: getAuthHeader(),
    })

    if (response.data.success) {
      userData.value = response.data.data
    } else {
      Swal.fire('Gagal', response.data.message || 'Gagal memuat data profil.', 'error')
    }

  } catch (error) {
    console.error('Error fetching profile data:', error)
    const errorMessage =
      error.response?.data?.message
    error.message
    'Gagal terhubung ke server untuk memuat data profil.'
    Swal.fire('Error', errorMessage, 'error')
    router.push("/signin")

  } finally {
    loading.value = false
  }
}


const openEditModal = () => {
  if (userData.value) {
    editForm.value.full_name = userData.value.full_name
    editForm.value.email = userData.value.email
    isProfileInfoModal.value = true
  } else {
    Swal.fire('Peringatan', 'Data profil belum dimuat. Silakan coba lagi.', 'warning')
  }
}

const saveProfile = async () => {
  if (!editForm.value.full_name || !editForm.value.email) {
    Swal.fire('Peringatan', 'Nama lengkap dan Email harus diisi.', 'warning')
    return
  }

  isSaving.value = true

  try {
    const response = await axios.put(`${API_BASE_URL}/user/update/profile`, editForm.value, {
      headers: getAuthHeader(),
    })

    if (response.data.success) {
      Swal.fire('Berhasil!', response.data.message || 'Profil berhasil diperbarui.', 'success')
      isProfileInfoModal.value = false
      await fetchProfileData()
    } else {
      Swal.fire('Gagal', response.data.message || 'Terjadi kesalahan saat menyimpan perubahan.', 'error')
    }

  } catch (error) {
    console.error('Error saving profile:', error)
    const errorMessage = error.response?.data?.message || 'Gagal terhubung ke server untuk menyimpan data.'
    Swal.fire('Error', errorMessage, 'error')
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  fetchProfileData()
})
</script>