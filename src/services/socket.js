import { io } from 'socket.io-client';
import { getAuthToken } from './api';
let socket = null;
export function getSocket() {
    if (!socket) {
        const token = getAuthToken();
        socket = io(window.location.origin, {
            auth: { token },
            autoConnect: true,
            reconnectionAttempts: 5,
        });
    }
    return socket;
}
export function reconnectSocketWithToken() {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
    return getSocket();
}
