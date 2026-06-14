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
let reconnectTimer: ReturnType<typeof setTimeout> | null = null
let reconnectAttempts = 0
let activeSubscribers = 0
let manualClose = false
let currentToken = ''

const MAX_NOTIFICATIONS = 8
const MAX_RECONNECT_DELAY = 30000
const MAX_READ_NOTIFICATION_KEYS = 300

const authToken = () => localStorage.getItem('authToken')

const decodeAuthUserId = () => {
  const token = authToken()
  if (!token) return 'guest'

  try {
    const payload = token.split('.')[1]
    if (!payload) return token.slice(-16)
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decoded = JSON.parse(window.atob(normalizedPayload))
    return decoded.id || decoded.userId || token.slice(-16)
  } catch {
    return token.slice(-16)
  }
}

const readStorageKey = () => `pos_read_notifications_${decodeAuthUserId()}`

const notificationReadKey = (notification: RealtimeNotification) => {
  if (notification.orderId || notification.orderCode) {
    return `order:${notification.orderId || notification.orderCode}:${notification.status || notification.type}`
  }

  return `notification:${notification.id}`
}

const readNotificationKeys = () => {
  try {
    const raw = localStorage.getItem(readStorageKey())
    const parsed = raw ? JSON.parse(raw) : []
    return new Set<string>(Array.isArray(parsed) ? parsed : [])
  } catch {
    return new Set<string>()
  }
}

const saveReadNotificationKeys = (keys: Set<string>) => {
  const limitedKeys = Array.from(keys).slice(-MAX_READ_NOTIFICATION_KEYS)
  localStorage.setItem(readStorageKey(), JSON.stringify(limitedKeys))
}

const hasReadNotificationState = () => {
  return localStorage.getItem(readStorageKey()) !== null
}

const isNotificationRead = (notification: RealtimeNotification) => {
  return readNotificationKeys().has(notificationReadKey(notification))
}

const recalculateUnreadCount = () => {
  const readKeys = readNotificationKeys()
  unreadCount.value = notifications.value.filter(
    (notification) => !readKeys.has(notificationReadKey(notification)),
  ).length
}

const normalizeNotifications = (items: RealtimeNotification[]) => {
  const seen = new Set<string>()
  return items
    .filter((item) => {
      if (!item?.id || seen.has(item.id)) return false
      seen.add(item.id)
      return true
    })
    .slice(0, MAX_NOTIFICATIONS)
}

const prependNotification = (notification: RealtimeNotification) => {
  notifications.value = normalizeNotifications([notification, ...notifications.value])
}

const clearReconnectTimer = () => {
  if (!reconnectTimer) return
  clearTimeout(reconnectTimer)
  reconnectTimer = null
}

const resetConnection = () => {
  if (eventSource) {
    eventSource.onopen = null
    eventSource.onmessage = null
    eventSource.onerror = null
    eventSource.close()
    eventSource = null
  }
  connected.value = false
  connecting.value = false
}

const scheduleReconnect = () => {
  if (manualClose || activeSubscribers === 0 || reconnectTimer) return

  const token = authToken()
  if (!token) return

  const delay = Math.min(1000 * 2 ** reconnectAttempts, MAX_RECONNECT_DELAY)
  reconnectAttempts += 1

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null
    connectRealtimeNotifications(false)
  }, delay)
}

const connectRealtimeNotifications = (registerSubscriber = true) => {
  if (registerSubscriber) {
    activeSubscribers += 1
  }

  if (eventSource || connecting.value) return

  const token = authToken()
  if (!token) return

  if (currentToken && currentToken !== token) {
    manualClose = true
    clearReconnectTimer()
    resetConnection()
    notifications.value = []
    unreadCount.value = 0
    incomingOrderCount.value = 0
  }

  clearReconnectTimer()
  manualClose = false
  currentToken = token
  connecting.value = true
  eventSource = new EventSource(
    `${API_BASE_URL}/realtime/stream?token=${encodeURIComponent(token)}`,
  )

  eventSource.onopen = () => {
    connected.value = true
    connecting.value = false
    reconnectAttempts = 0
  }

  eventSource.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data) as RealtimePayload

      if (payload.type === 'snapshot') {
        notifications.value = normalizeNotifications(payload.notifications || [])
        incomingOrderCount.value = payload.incomingOrderCount || 0
        if (!hasReadNotificationState()) {
          const readKeys = readNotificationKeys()
          for (const notification of notifications.value) {
            readKeys.add(notificationReadKey(notification))
          }
          saveReadNotificationKeys(readKeys)
        }
        recalculateUnreadCount()
        return
      }

      if (payload.notification) {
        const isNewNotification = !notifications.value.some(
          (item) => item.id === payload.notification?.id,
        )
        const wasRead = isNotificationRead(payload.notification)
        prependNotification(payload.notification)
        if (isNewNotification && !wasRead) {
          unreadCount.value += 1
        }
      }

      if (typeof payload.incomingOrderCount === 'number') {
        incomingOrderCount.value = payload.incomingOrderCount
      }
    } catch (error) {
      console.error('Gagal memproses notifikasi realtime:', error)
    }
  }

  eventSource.onerror = () => {
    resetConnection()
    scheduleReconnect()
  }
}

const closeRealtimeNotifications = () => {
  activeSubscribers = Math.max(activeSubscribers - 1, 0)
  if (activeSubscribers > 0) return

  manualClose = true
  clearReconnectTimer()
  resetConnection()
}

const markNotificationsAsRead = () => {
  const readKeys = readNotificationKeys()
  for (const notification of notifications.value) {
    readKeys.add(notificationReadKey(notification))
  }
  saveReadNotificationKeys(readKeys)
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
