import { io, type Socket } from "socket.io-client"
import { loadIdentity } from "./chat"
import { DEFAULT_CHAT_API_URL } from "./upstream"

/**
 * Socket server URL.
 * Prefer explicit public API host — Next rewrites don't proxy WebSockets reliably.
 */
const socketServerUrl = () =>
  (
    process.env.NEXT_PUBLIC_CHAT_API_URL ||
    process.env.NEXT_PUBLIC_CHAT_SOCKET_URL ||
    DEFAULT_CHAT_API_URL
  ).replace(/\/$/, "")

let socket: Socket | null = null

export const getCustomerSocket = (): Socket => {
  if (!socket) {
    socket = io(socketServerUrl(), {
      path: "/socket.io",
      transports: ["polling", "websocket"],
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelayMax: 5000,
      reconnectionDelay: 800,
    })
  }
  return socket
}

export const connectCustomerSocket = () => {
  const s = getCustomerSocket()
  if (!s.connected) s.connect()
  return s
}

export const joinConversation = (conversationId: string) => {
  if (!conversationId) return
  const s = connectCustomerSocket()
  // The backend only lets the visitor who owns the chat listen in (matched by phone).
  s.emit("join:conversation", { conversationId, phone: loadIdentity()?.phone })
}

export const disconnectCustomerSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
