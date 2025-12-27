<template>
    <AdminLayout>
        <div class="py-3 space-y-5">

            <div class="flex justify-between items-center">
                <p class="text-xl font-bold text-title">Kelola Data Pelanggan</p>

                <button @click="openModal(null)"
                    class="btn-primary font-semibold py-2 px-4 rounded-lg shadow-md flex items-center gap-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                    </svg>
                    Tambah Pelanggan
                </button>
            </div>

            <hr class="border-divider">

            <div class="card-container rounded-lg shadow border border-divider overflow-x-auto">
                <table class="min-w-full divide-y divide-divider">
                    <thead class="table-header">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">No</th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nama Pelanggan
                            </th>
                            <th class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Alamat</th>
                            <th class="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">Sisa Hutang
                            </th>
                            <th class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-divider">
                        <tr v-if="pelangganList.length === 0 && !loading">
                            <td colspan="6" class="px-6 py-4 text-center text-muted">
                                Belum ada data pelanggan.
                            </td>
                        </tr>

                        <tr v-for="(pelanggan, index) in pelangganList" :key="pelanggan.id" class="table-row-hover">
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-main">
                                {{ index + 1 }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm text-body">
                                {{ pelanggan.nama_pelanggan }}
                            </td>
                            <td class="px-6 py-4 whitespace-normal text-sm text-body max-w-sm">
                                {{ pelanggan.alamat }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-sm font-semibold text-right"
                                :class="parseFloat(pelanggan.hutang) > 0 ? 'text-danger' : 'text-success'">
                                {{ formatRupiah(parseFloat(pelanggan.hutang)) }}
                            </td>
                            <td class="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                <div class="flex justify-center space-x-2">
                                    <button @click="openModal(pelanggan)" class="btn-icon-edit p-1 rounded">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
                                            </path>
                                        </svg>
                                    </button>
                                    <button @click="deletePelanggan(pelanggan.id)" class="btn-icon-delete p-1 rounded">
                                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16">
                                            </path>
                                        </svg>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>

        <div v-if="isModalOpen"
            class="fixed inset-0 z-50 flex items-center justify-center modal-overlay backdrop-blur-sm">

            <div class="relative p-6 w-full max-w-lg mx-auto bg-white rounded-lg shadow-xl transform transition-all">
                <div class="flex justify-between items-center pb-3 border-b border-divider">
                    <h3 class="text-lg font-semibold text-title">{{ isEditMode ? 'Edit' : 'Tambah' }} Pelanggan</h3>
                    <button @click="closeModal"
                        class="text-muted bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
                        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd"></path>
                        </svg>
                    </button>
                </div>

                <form @submit.prevent="savePelanggan" class="mt-4 space-y-4">
                    <div>
                        <label for="nama_pelanggan" class="block mb-2 text-sm font-medium text-title">Nama
                            Pelanggan</label>
                        <input type="text" id="nama_pelanggan" v-model="form.nama_pelanggan" required
                            class="input-field w-full rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500" />
                    </div>

                    <div>
                        <label for="alamat" class="block mb-2 text-sm font-medium text-title">Alamat</label>
                        <textarea id="alamat" v-model="form.alamat"
                            class="input-field w-full rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500"></textarea>
                    </div>

                    <div class="flex justify-end pt-4 border-t border-divider">
                        <button type="submit" :disabled="isSaving"
                            class="btn-primary font-semibold py-2 px-4 rounded-lg shadow-md disabled:bg-gray-400 flex items-center gap-2">
                            <svg v-if="isSaving" class="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
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
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import { useRouter } from 'vue-router';

// LOGIC TIDAK BERUBAH
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const router = useRouter()

interface Pelanggan {
    id: string;
    nama_pelanggan: string;
    alamat: string;
    hutang: string;
    user_id?: string;
    toko_id?: string;
    createdAt?: string;
    updatedAt?: string;
}

// --- States ---
const pelangganList = ref<Pelanggan[]>([]);
const loading = ref(false);
const isModalOpen = ref(false);
const isEditMode = ref(false);
const isSaving = ref(false);
const form = ref<Partial<Pelanggan>>({
    id: '',
    nama_pelanggan: '',
    alamat: '',
    hutang: '0',
});

const getAuthHeader = () => {
    const token = localStorage.getItem('authToken');
    return { Authorization: `Bearer ${token}` };
};

const formatRupiah = (number: number) => {
    if (number === null || number === undefined || isNaN(number)) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
    }).format(number);
};

const fetchPelanggan = async () => {
    loading.value = true;
    try {
        const response = await axios.get(`${API_BASE_URL}/pelanggan`, {
            headers: getAuthHeader(),
        });
        if (response.data.success) {
            pelangganList.value = response.data.data.map((p: any) => ({
                ...p,
                hutang: String(p.hutang || '0'),
            }));
        }
    } catch (error: any) {
        const errorMessage = error.response?.data?.message
        router.push("/signin")
        Swal.fire('Error', errorMessage, 'error');
    } finally {
        loading.value = false; // Pastikan loading dimatikan
    }
};

const savePelanggan = async () => {
    if (!form.value.nama_pelanggan) {
        Swal.fire('Peringatan', 'Nama Pelanggan harus diisi.', 'warning');
        return;
    }

    isSaving.value = true;

    try {
        let response;
        const payload = {
            nama_pelanggan: form.value.nama_pelanggan,
            alamat: form.value.alamat,
        };

        if (isEditMode.value) {
            response = await axios.put(`${API_BASE_URL}/pelanggan/${form.value.id}`, payload, {
                headers: getAuthHeader(),
            });
        } else {
            response = await axios.post(`${API_BASE_URL}/pelanggan`, payload, {
                headers: getAuthHeader(),
            });
        }

        if (response.data.success) {
            Swal.fire('Berhasil', `Data pelanggan berhasil di${isEditMode.value ? 'update' : 'tambah'}.`, 'success');
            closeModal();
            fetchPelanggan();
        } else {
            Swal.fire('Gagal', response.data.message || 'Terjadi kesalahan saat menyimpan data.', 'error');
        }

    } catch (error: any) {
        console.error('Error saving pelanggan:', error);
        const errorMessage = error.response?.data?.message || 'Gagal terhubung ke server.';
        Swal.fire('Error', errorMessage, 'error');
    } finally {
        isSaving.value = false;
    }
};

const deletePelanggan = async (id: string) => {
    const result = await Swal.fire({
        title: 'Anda Yakin?',
        text: "Data pelanggan yang dihapus tidak dapat dikembalikan!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Hapus!',
        cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
        try {
            const response = await axios.delete(`${API_BASE_URL}/pelanggan/delete/${id}`, {
                headers: getAuthHeader(),
            });

            if (response.data.success) {
                Swal.fire('Dihapus!', 'Data pelanggan berhasil dihapus.', 'success');
                fetchPelanggan();
            } else {
                Swal.fire('Gagal', response.data.message || 'Terjadi kesalahan saat menghapus data.', 'error');
            }
        } catch (error: any) {
            console.error('Error deleting pelanggan:', error);
            const errorMessage = error.response?.data?.message || 'Gagal terhubung ke server.';
            Swal.fire('Error', errorMessage, 'error');
        }
    }
};


const openModal = (pelanggan: Pelanggan | null) => {
    if (pelanggan) {
        isEditMode.value = true;
        form.value = {
            id: pelanggan.id,
            nama_pelanggan: pelanggan.nama_pelanggan,
            alamat: pelanggan.alamat,
            hutang: pelanggan.hutang
        };
    } else {
        isEditMode.value = false;
        form.value = { id: '', nama_pelanggan: '', alamat: '', hutang: '0' };
    }
    isModalOpen.value = true;
};

const closeModal = () => {
    isModalOpen.value = false;
    form.value = { id: '', nama_pelanggan: '', alamat: '', hutang: '0' };
};

onMounted(() => {
    fetchPelanggan();
});
</script>
