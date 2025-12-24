<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center text-gray-700 dark:text-gray-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      @click.prevent="toggleDropdown">
      <span class="block mr-1 font-medium text-theme-sm">{{ user.full_name || 'Loading...' }}</span>

      <ChevronDownIcon :class="{ 'rotate-180': dropdownOpen }" class="w-5 h-5 transition-transform" />
    </button>

    <div v-if="dropdownOpen"
      class="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark z-50">
      <div class="p-2">
        <span class="block font-bold text-gray-800 text-base dark:text-white/90">
          {{ user.full_name || 'User' }}
        </span>
        <span class="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400 truncate">
          {{ user.email || 'N/A' }}
        </span>
      </div>

      <ul class="flex flex-col gap-1 pt-4 pb-3 border-t border-gray-200 dark:border-gray-800 mt-2">
        <li v-for="item in menuItems" :key="item.href">
          <router-link :to="item.href" @click="closeDropdown"
            class="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300 transition-colors">
            <component :is="item.icon"
              class="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
            {{ item.text }}
          </router-link>
        </li>
      </ul>
      <a href="#" @click.prevent="signOut"
        class="flex items-center gap-3 px-3 py-2 mt-1 font-medium text-red-600 rounded-lg group text-theme-sm hover:bg-red-50 dark:text-red-400 dark:hover:bg-white/5 dark:hover:text-red-300 transition-colors">
        <LogoutIcon class="w-5 h-5 text-red-500 group-hover:text-red-700 dark:group-hover:text-red-300" />
        Sign out
      </a>
    </div>
  </div>
</template>

<script setup>
import { UserCircleIcon, ChevronDownIcon, LogoutIcon, SettingsIcon, InfoCircleIcon } from '@/icons'
import { RouterLink } from 'vue-router'
import { ref, onMounted, onUnmounted, reactive } from 'vue'
import axios from 'axios'
import Swal from 'sweetalert2'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const dropdownOpen = ref(false)
const dropdownRef = ref(null)
const user = reactive({
  full_name: '',
  email: '',
  id: null
})

const menuItems = [
  { href: '/profile', icon: UserCircleIcon, text: 'Edit profile' },
  { href: '/settings', icon: SettingsIcon, text: 'Account settings' },
  { href: '/support', icon: InfoCircleIcon, text: 'Support' },
]

// --- Helper Functions ---
const getAuthHeader = () => {
  const token = localStorage.getItem('authToken');
  return { Authorization: `Bearer ${token}` };
};

const fetchUserData = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/user/my/data`, {
      headers: getAuthHeader(),
    });

    if (response.data.success && response.data.data) {
      user.full_name = response.data.data.full_name;
      user.email = response.data.data.email;
      user.id = response.data.data.id;
    } else {
      console.error('Failed to load user data:', response.data.message);
    }

  } catch (error) {
    console.error('Error fetching user data for dropdown:', error);
  }
};


// --- Dropdown Logic ---
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const signOut = () => {
  localStorage.removeItem('authToken');
  window.location.href = '/';

  Swal.fire({
    icon: 'success',
    title: 'Logout Berhasil',
    text: 'Anda telah berhasil keluar dari sistem.',
    timer: 1500,
    showConfirmButton: false,
  });

  closeDropdown()
}

// --- Outside Click Handler ---
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

onMounted(() => {
  fetchUserData();
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>