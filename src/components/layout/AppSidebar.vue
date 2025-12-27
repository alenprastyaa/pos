<template>
  <aside :class="[
    'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
    {
      'w-[290px]': true,
      'translate-x-0': isMobileOpen || isExpanded,
      '-translate-x-full': !(isMobileOpen || isExpanded),
    },
  ]">

    <div class="py-8 flex justify-start">
      <router-link to="/">
        <p class="dark:text-white mt-3 text-2xl font-bold">
          TOKO HAKIMAH
        </p>
      </router-link>
    </div>

    <div class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex">

            <h2 class="mb-4 text-xs uppercase flex leading-[20px] text-gray-400 justify-start">
              {{ menuGroup.title }}
            </h2>

            <ul class="flex flex-col gap-4">
              <li v-for="(item, index) in menuGroup.items" :key="item.name">

                <button v-if="item.subItems" @click="toggleSubmenu(groupIndex, index)" :class="[
                  'menu-item group w-full justify-start',
                  {
                    'menu-item-active': isSubmenuOpen(groupIndex, index),
                    'menu-item-inactive': !isSubmenuOpen(groupIndex, index),
                  },
                ]">
                  <span :class="[
                    isSubmenuOpen(groupIndex, index)
                      ? 'menu-item-icon-active'
                      : 'menu-item-icon-inactive',
                  ]">
                    <component :is="item.icon" />
                  </span>
                  <span class="menu-item-text">{{ item.name }}</span>

                  <ChevronDownIcon :class="[
                    'ml-auto w-5 h-5 transition-transform duration-200',
                    {
                      'rotate-180 text-brand-500': isSubmenuOpen(groupIndex, index),
                    },
                  ]" />
                </button>

                <router-link v-else-if="item.path" :to="item.path" :class="[
                  'menu-item group justify-start',
                  {
                    'menu-item-active': isActive(item.path),
                    'menu-item-inactive': !isActive(item.path),
                  },
                ]">
                  <span :class="[
                    isActive(item.path)
                      ? 'menu-item-icon-active'
                      : 'menu-item-icon-inactive',
                  ]">
                    <component :is="item.icon" />
                  </span>
                  <span class="menu-item-text">{{ item.name }}</span>
                </router-link>

                <transition @enter="startTransition" @after-enter="endTransition" @before-leave="startTransition"
                  @after-leave="endTransition">
                  <div v-show="isSubmenuOpen(groupIndex, index)">
                    <ul class="mt-2 space-y-1 ml-9">
                      <li v-for="subItem in item.subItems" :key="subItem.name">
                        <router-link :to="subItem.path" :class="[
                          'menu-dropdown-item',
                          {
                            'menu-dropdown-item-active': isActive(subItem.path),
                            'menu-dropdown-item-inactive': !isActive(subItem.path),
                          },
                        ]">
                          {{ subItem.name }}

                          <span class="flex items-center gap-1 ml-auto">
                            <span v-if="subItem.new" :class="[
                              'menu-dropdown-badge',
                              isActive(subItem.path) ? 'menu-dropdown-badge-active' : 'menu-dropdown-badge-inactive'
                            ]">new</span>
                            <span v-if="subItem.pro" :class="[
                              'menu-dropdown-badge',
                              isActive(subItem.path) ? 'menu-dropdown-badge-active' : 'menu-dropdown-badge-inactive'
                            ]">pro</span>
                          </span>
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <SidebarWidget />
    </div>
  </aside>

  <div v-if="isMobileOpen" @click="isMobileOpen = false"
    class="fixed inset-0 bg-black bg-opacity-50 z-[99998] transition-opacity lg:hidden">
  </div>
</template>

<script setup>
// PERBAIKAN 1: Tambahkan 'watch' di import
import { ref, computed, watch } from "vue";
import { useRoute } from "vue-router";

import {
  GridIcon,
  CalenderIcon,
  UserCircleIcon,
  ChatIcon,
  MailIcon,
  DocsIcon,
  PieChartIcon,
  ChevronDownIcon,
  HorizontalDots,
  PageIcon,
  TableIcon,
  ListIcon,
  PlugInIcon,
} from "../../icons";
import SidebarWidget from "./SidebarWidget.vue";
import { useSidebar } from "@/composables/useSidebar";
import CheckIcon from "@/icons/CheckIcon.vue";
import MailBox from "@/icons/MailBox.vue";
import TaskIcon from "@/icons/TaskIcon.vue";
import PlusIcon from "@/icons/PlusIcon.vue";
import DraftIcon from "@/icons/DraftIcon.vue";
import BoxCubeIcon from "@/icons/BoxCubeIcon.vue";

const role_name = localStorage.getItem("role_name")
const route = useRoute();

// Mengambil state dari composable
const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar();

// PERBAIKAN 2: Watch Route Change
// Fungsi ini akan berjalan setiap kali URL berubah (pindah halaman)
watch(
  () => route.path,
  () => {
    // Jika user sedang dalam tampilan mobile (isMobileOpen true), tutup sidebar
    if (isMobileOpen.value) {
      isMobileOpen.value = false;
    }
    // Opsional: Tutup submenu juga saat pindah halaman jika diinginkan
    // openSubmenu.value = null; 
  }
);

const menuGroups = [
  {
    title: "Menu",
    items: [
      {
        icon: GridIcon,
        name: "Dashboard",
        path: "/",
      },
      ...(role_name === "superadmin"
        ? [
          {
            icon: CalenderIcon,
            name: "Toko",
            path: "/toko",
          }
        ]
        : []),
      ...(role_name === "superadmin"
        ? [
          {
            icon: UserCircleIcon,
            name: "User",
            path: "/user",
          }
        ]
        : []),
      {
        icon: UserCircleIcon,
        name: "Pelanggan",
        path: "/pelanggan",
      },
      {
        icon: MailBox,
        name: "Produk",
        path: "/produk",
      },
      {
        icon: TaskIcon,
        name: "Penjualan",
        subItems: [
          { name: "Penjualan Eceran", path: "/penjualan-eceran" },
          { name: "Penjualan Grosir", path: "/penjualan-grosir" },
        ],
      },
      {
        icon: BoxCubeIcon,
        name: "History Transaksi",
        path: "/history",
      },
      {
        icon: UserCircleIcon,
        name: "User Profile",
        path: "/profile",
      },
    ],
  },
];

const isActive = (path) => route.path === path;

const toggleSubmenu = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  openSubmenu.value = openSubmenu.value === key ? null : key;
};

const isAnySubmenuRouteActive = computed(() => {
  return menuGroups.some((group) =>
    group.items.some(
      (item) =>
        item.subItems && item.subItems.some((subItem) => isActive(subItem.path))
    )
  );
});

const isSubmenuOpen = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`;
  return (
    openSubmenu.value === key ||
    (isAnySubmenuRouteActive.value &&
      menuGroups[groupIndex].items[itemIndex].subItems?.some((subItem) =>
        isActive(subItem.path)
      ))
  );
};

const startTransition = (el) => {
  el.style.height = "auto";
  const height = el.scrollHeight;
  el.style.height = "0px";
  el.offsetHeight; // force reflow
  el.style.height = height + "px";
};

const endTransition = (el) => {
  el.style.height = "";
};
</script>