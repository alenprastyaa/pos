<template>
  <div class="relative">
    <button
      type="button"
      @click="toggleDropdown"
      class="relative flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 transition-all hover:border-rose-300 hover:text-rose-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-rose-500"
    >
      <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C8.67 6.165 8 7.388 8 9v5.159c0 .538-.214 1.055-.595 1.436L6 17h5m4 0a3 3 0 11-6 0m6 0H9"
        />
      </svg>
      <span
        v-if="unreadCount > 0"
        class="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-rose-600 px-1 text-[10px] font-bold text-white"
      >
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="dropdownOpen"
        class="absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900"
      >
        <div class="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-gray-800">
          <div>
            <p class="text-sm font-extrabold text-gray-900 dark:text-white">Notifikasi</p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ connected ? 'Realtime aktif' : 'Menghubungkan...' }}
            </p>
          </div>
          <button
            type="button"
            @click="markNotificationsAsRead"
            class="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400"
          >
            Tandai dibaca
          </button>
        </div>

        <div class="max-h-96 overflow-y-auto">
          <div v-if="notifications.length === 0" class="px-4 py-8 text-center">
            <p class="text-sm font-medium text-gray-600 dark:text-gray-300">Belum ada notifikasi.</p>
          </div>

          <button
            v-for="item in notifications"
            :key="item.id"
            type="button"
            @click="openNotification(item)"
            class="flex w-full items-start gap-3 border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-rose-50 dark:border-gray-800 dark:hover:bg-white/5"
          >
            <span class="mt-1 flex h-9 w-9 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-300">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C8.67 6.165 8 7.388 8 9v5.159c0 .538-.214 1.055-.595 1.436L6 17h5m4 0a3 3 0 11-6 0m6 0H9"
                />
              </svg>
            </span>

            <div class="min-w-0 flex-1">
              <div class="flex items-center justify-between gap-2">
                <p class="truncate text-sm font-bold text-gray-900 dark:text-white">
                  {{ item.title }}
                </p>
                <span class="whitespace-nowrap text-[11px] text-gray-400 dark:text-gray-500">
                  {{ formatRelativeTime(item.createdAt) }}
                </span>
              </div>
              <p class="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-gray-300">
                {{ item.message }}
              </p>
              <p class="mt-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
                {{ item.orderCode ? `#${item.orderCode}` : 'Notifikasi' }}
              </p>
            </div>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useRealtimeNotifications } from '@/composables/useRealtimeNotifications'
import type { RealtimeNotification } from '@/composables/useRealtimeNotifications'

const router = useRouter()
const dropdownOpen = ref(false)

const {
  notifications,
  unreadCount,
  connected,
  connectRealtimeNotifications,
  closeRealtimeNotifications,
  markNotificationsAsRead,
  formatRelativeTime,
} = useRealtimeNotifications()

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
  if (dropdownOpen.value) {
    markNotificationsAsRead()
  }
}

const openNotification = (item: RealtimeNotification) => {
  dropdownOpen.value = false
  if (item.link) {
    router.push(item.link)
  }
}

onMounted(() => {
  connectRealtimeNotifications()
})

onBeforeUnmount(() => {
  closeRealtimeNotifications()
})
</script>
