<template>
  <div class="min-h-screen flex flex-col">
    <app-sidebar />

    <Backdrop />

    <div class="flex-1 transition-all duration-300 ease-in-out w-full">
      <app-header />

      <div class="p-4">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'
import Backdrop from './Backdrop.vue'

// Kita tidak perlu lagi mengimport useSidebar di sini 
// karena layout tidak lagi berubah ukuran berdasarkan status sidebar.
</script>