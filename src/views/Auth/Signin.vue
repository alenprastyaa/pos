<template>
  <FullScreenLayout>
    <div class="signin-root w-full h-screen flex">

      <!-- ── LEFT: Decorative Panel ── -->
      <div class="deco-panel hidden lg:flex flex-col justify-between w-1/2 h-full p-10 relative overflow-hidden">

        <!-- Background orbs -->
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>

        <!-- Top brand -->
        <div class="relative z-10 flex items-center gap-3">
          <div class="brand-icon">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <span class="text-white font-bold text-lg tracking-tight">Hakimah Toko</span>
        </div>

        <!-- Center content -->
        <div class="relative z-10 space-y-6">
          <!-- Big icon -->
          <div class="pos-illustration">
            <svg class="w-16 h-16 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M9 7H6a2 2 0 00-2 2v9a2 2 0 002 2h9a2 2 0 002-2v-3M9 7V5a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2h-2M9 7h6"/>
            </svg>
          </div>
          <div>
            <h2 class="text-3xl font-black text-white leading-tight">Sistem Kasir<br/>Modern & Cepat</h2>
            <p class="mt-3 text-white/60 text-sm leading-relaxed max-w-xs">
              Kelola transaksi penjualan, stok produk, dan laporan keuangan toko Anda dalam satu platform.
            </p>
          </div>

          <!-- Feature chips -->
          <div class="flex flex-wrap gap-2">
            <div class="feature-chip">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              Penjualan Reguler
            </div>
            <div class="feature-chip">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              Penjualan Grosir
            </div>
            <div class="feature-chip">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              Laporan Real-time
            </div>
            <div class="feature-chip">
              <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>
              Manajemen Stok
            </div>
          </div>
        </div>

        <!-- Bottom copyright -->
        <p class="relative z-10 text-white/30 text-xs">© 2025 Hakimah Toko POS</p>
      </div>

      <!-- ── RIGHT: Form Panel ── -->
      <div class="form-panel flex-1 flex items-center justify-center p-6">

        <!-- Mobile brand (shown only on small screens) -->
        <div class="absolute top-6 left-6 flex items-center gap-2 lg:hidden">
          <div class="brand-icon-sm">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
            </svg>
          </div>
          <span class="text-gray-800 dark:text-white font-bold text-sm">Hakimah Toko</span>
        </div>

        <!-- Form Card -->
        <div class="form-card w-full max-w-sm">

          <!-- Header -->
          <div class="mb-8">
            <div class="badge-pos mb-4">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
              Akses Kasir
            </div>
            <h1 class="form-title">Selamat Datang</h1>
            <p class="form-subtitle">Masuk ke dashboard POS Anda</p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-5">

            <!-- Email -->
            <div class="space-y-1.5">
              <label for="email" class="field-label">Email</label>
              <div class="input-wrap" :class="{ 'input-disabled': isLoading }">
                <div class="input-icon">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"/>
                  </svg>
                </div>
                <input v-model="email" type="email" id="email" name="email"
                  placeholder="email@example.com"
                  :disabled="isLoading"
                  class="field-input" />
              </div>
            </div>

            <!-- Password -->
            <div class="space-y-1.5">
              <label for="password" class="field-label">Password</label>
              <div class="input-wrap" :class="{ 'input-disabled': isLoading }">
                <div class="input-icon">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                  </svg>
                </div>
                <input v-model="password" :type="showPassword ? 'text' : 'password'"
                  id="password" placeholder="••••••••"
                  :disabled="isLoading"
                  class="field-input" />
                <button type="button" @click="togglePasswordVisibility"
                  :disabled="isLoading"
                  class="eye-btn">
                  <svg v-if="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                  </svg>
                  <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Submit -->
            <button type="submit" :disabled="isLoading" class="submit-btn w-full">
              <span v-if="!isLoading" class="flex items-center justify-center gap-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                    d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                </svg>
                Masuk ke Dashboard
              </span>
              <span v-else class="flex items-center justify-center gap-2">
                <svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                  <path class="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Memproses...
              </span>
            </button>

          </form>

          <!-- Footer -->
          <p class="mt-8 text-center text-xs text-gray-400 dark:text-gray-600">
            © 2025 Hakimah Toko POS · All rights reserved
          </p>
        </div>
      </div>

    </div>
  </FullScreenLayout>
</template>

<style scoped>
/* ── Root ── */
.signin-root {
  background: #f8fafc;
}
.dark .signin-root { background: #0f172a; }

/* ── Decorative Panel ── */
.deco-panel {
  background: linear-gradient(145deg, #0c4a6e 0%, #0369a1 40%, #0891b2 75%, #06b6d4 100%);
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  pointer-events: none;
}
.orb-1 {
  width: 320px; height: 320px;
  background: rgba(6, 182, 212, 0.25);
  top: -80px; right: -80px;
}
.orb-2 {
  width: 240px; height: 240px;
  background: rgba(14, 116, 144, 0.35);
  bottom: 60px; left: -60px;
}
.orb-3 {
  width: 180px; height: 180px;
  background: rgba(255, 255, 255, 0.08);
  top: 45%; right: 20%;
}

.brand-icon {
  width: 40px; height: 40px;
  border-radius: 12px;
  background: rgba(255,255,255,0.15);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.2);
  display: flex; align-items: center; justify-content: center;
}

.pos-illustration {
  width: 80px; height: 80px;
  border-radius: 24px;
  background: rgba(255,255,255,0.12);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255,255,255,0.18);
  display: flex; align-items: center; justify-content: center;
}

.feature-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 12px;
  border-radius: 20px;
  background: rgba(255,255,255,0.12);
  border: 1px solid rgba(255,255,255,0.2);
  color: rgba(255,255,255,0.85);
  font-size: 0.72rem;
  font-weight: 600;
}

/* ── Form Panel ── */
.form-panel {
  background: #f8fafc;
  position: relative;
}
.dark .form-panel { background: #0f172a; }

.brand-icon-sm {
  width: 30px; height: 30px;
  border-radius: 8px;
  background: linear-gradient(135deg, #0891b2, #0e7490);
  display: flex; align-items: center; justify-content: center;
}

/* ── Form Card ── */
.form-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 24px;
  padding: 36px 32px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04);
}
.dark .form-card {
  background: #1e293b;
  border-color: #334155;
  box-shadow: 0 4px 24px rgba(0,0,0,0.4);
}

/* ── Badge ── */
.badge-pos {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 20px;
  background: linear-gradient(135deg, #ecfeff, #e0f2fe);
  border: 1px solid #a5f3fc;
  color: #0369a1;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.dark .badge-pos {
  background: linear-gradient(135deg, #0c2233, #0c3348);
  border-color: #164e63;
  color: #38bdf8;
}

.form-title {
  font-size: 1.6rem;
  font-weight: 800;
  color: #0f172a;
  letter-spacing: -0.03em;
  line-height: 1.2;
  margin-top: 8px;
}
.dark .form-title { color: #f1f5f9; }

.form-subtitle {
  font-size: 0.85rem;
  color: #64748b;
  margin-top: 4px;
}
.dark .form-subtitle { color: #94a3b8; }

/* ── Field Label ── */
.field-label {
  display: block;
  font-size: 0.78rem;
  font-weight: 700;
  color: #374151;
  letter-spacing: 0.02em;
}
.dark .field-label { color: #cbd5e1; }

/* ── Input Wrapper ── */
.input-wrap {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}
.dark .input-wrap {
  background: #0f172a;
  border-color: #334155;
}
.input-wrap:focus-within {
  border-color: #0891b2;
  box-shadow: 0 0 0 3px rgba(8,145,178,0.12);
  background: white;
}
.dark .input-wrap:focus-within {
  background: #0f172a;
  box-shadow: 0 0 0 3px rgba(8,145,178,0.2);
}
.input-disabled { opacity: 0.5; pointer-events: none; }

.input-icon {
  padding: 0 12px;
  color: #94a3b8;
  display: flex; align-items: center;
  flex-shrink: 0;
}
.dark .input-icon { color: #475569; }

.field-input {
  flex: 1;
  height: 46px;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.875rem;
  font-weight: 500;
  color: #0f172a;
  padding: 0 12px 0 0;
}
.dark .field-input { color: #f1f5f9; }
.field-input::placeholder { color: #cbd5e1; }
.dark .field-input::placeholder { color: #475569; }

.eye-btn {
  padding: 0 14px;
  color: #94a3b8;
  display: flex; align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.15s;
  flex-shrink: 0;
  height: 46px;
}
.eye-btn:hover { color: #0891b2; }
.dark .eye-btn { color: #475569; }
.dark .eye-btn:hover { color: #38bdf8; }

/* ── Submit Button ── */
.submit-btn {
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
  color: white;
  font-size: 0.875rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(8,145,178,0.4);
  transition: all 0.2s;
  letter-spacing: 0.02em;
}
.submit-btn:hover:not(:disabled) {
  background: linear-gradient(135deg, #0e7490 0%, #155e75 100%);
  box-shadow: 0 6px 24px rgba(8,145,178,0.5);
  transform: translateY(-1px);
}
.submit-btn:active:not(:disabled) { transform: translateY(0); }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }
</style>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import Swal from 'sweetalert2'
import CommonGridShape from '@/components/common/CommonGridShape.vue'
import FullScreenLayout from '@/components/layout/FullScreenLayout.vue'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
const router = useRouter()
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const isLoading = ref(false)

const togglePasswordVisibility = () => {
  if (!isLoading.value) {
    showPassword.value = !showPassword.value
  }
}

const handleSubmit = async () => {
  // Validasi input
  if (!email.value || !password.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Validasi Gagal',
      text: 'Email dan password tidak boleh kosong!',
      confirmButtonColor: '#3085d6',
    })
    return
  }

  isLoading.value = true

  try {
    const response = await axios.post(`${API_BASE_URL}/user/auth/login`, {
      email: email.value,
      password: password.value,
    })

    if (response.data.success) {
      localStorage.setItem('authToken', response.data.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.data.user))
      localStorage.setItem('role_name', response.data.data.user.role_name);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.data.token}`
      await Swal.fire({
        icon: 'success',
        title: 'Login Berhasil',
        text: response.data.message,
        confirmButtonColor: '#3085d6',
        timer: 1500,
        timerProgressBar: true,
      })

      router.push('/')
    }
  } catch (error: any) {
    console.error('Login error:', error)

    const errorMessage = error.response?.data?.message || 'Terjadi kesalahan saat login. Silakan coba lagi.'

    Swal.fire({
      icon: 'error',
      title: 'Login Gagal',
      text: errorMessage,
      confirmButtonColor: '#d33',
    })
  } finally {
    isLoading.value = false
  }
}
</script>