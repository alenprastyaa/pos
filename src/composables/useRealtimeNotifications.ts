import { computed, ref } from 'vue'

export interface RealtimeNotification {
  id: string
  type: string
  title: string
  message: string
  link?: string
  orderId?: string
  orderCode?: string
  status?: string
  createdAt: string
}

interface RealtimePayload {
  type: string
  notification?: RealtimeNotification
  notifications?: RealtimeNotification[]
  incomingOrderCount?: number
  unreadCount?: number
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const notifications = ref<RealtimeNotification[]>([])
const unreadCount = ref(0)
export const incomingOrderCount = ref(0)
const connected = ref(false)
const connecting = ref(false)

let eventSource: EventSource | null = null

const authToken = () => localStorage.getItem('authToken')

const connectRealtimeNotifications = () => {
  if (eventSource || connecting.value) return

  const token = authToken()
  if (!token) return

  connecting.value = true
  eventSource = new EventSource(
    `${API_BASE_URL}/realtime/stream?token=${encodeURIComponent(token)}`,
  )

  eventSource.onopen = () => {
    connected.value = true
    connecting.value = false
  }

  eventSource.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data) as RealtimePayload

      if (payload.type === 'snapshot') {
        notifications.value = payload.notifications || []
        incomingOrderCount.value = payload.incomingOrderCount || 0
        unreadCount.value = payload.unreadCount || notifications.value.length
        return
      }

      if (payload.notification) {
        notifications.value = [payload.notification, ...notifications.value].slice(0, 8)
        unreadCount.value += 1
      }

      if (typeof payload.incomingOrderCount === 'number') {
        incomingOrderCount.value = payload.incomingOrderCount
      }
    } catch (error) {
      console.error('Gagal memproses notifikasi realtime:', error)
    }
  }

  eventSource.onerror = () => {
    connected.value = false
    connecting.value = false
  }
}

const closeRealtimeNotifications = () => {
  if (eventSource) {
    eventSource.close()
    eventSource = null
  }
  connected.value = false
  connecting.value = false
}

const markNotificationsAsRead = () => {
  unreadCount.value = 0
}

const formatRelativeTime = (value?: string) => {
  if (!value) return ''

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const diff = Date.now() - date.getTime()
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < minute) return 'Baru saja'
  if (diff < hour) return `${Math.floor(diff / minute)} menit lalu`
  if (diff < day) return `${Math.floor(diff / hour)} jam lalu`

  return date.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function useRealtimeNotifications() {
  return {
    notifications,
    unreadCount: computed(() => unreadCount.value),
    incomingOrderCount: computed(() => incomingOrderCount.value),
    connected,
    connectRealtimeNotifications,
    closeRealtimeNotifications,
    markNotificationsAsRead,
    formatRelativeTime,
  }
}
