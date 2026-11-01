const API_BASE = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '') + '/api';
export function getAuthToken() {
    return localStorage.getItem('lnc_token');
}
export function setAuthToken(token) {
    localStorage.setItem('lnc_token', token);
}
export function clearAuthToken() {
    localStorage.removeItem('lnc_token');
    localStorage.removeItem('lnc_role');
}
export async function apiRequest(endpoint, options = {}) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE}${endpoint}`, {
        ...options,
        headers,
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
    }
    return data;
}
// Format paise to Rupees display string (e.g. ₹169.00 or ₹169)
export function formatCurrency(paise) {
    const rupees = paise / 100;
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: rupees % 1 === 0 ? 0 : 2,
        maximumFractionDigits: 2,
    }).format(rupees);
}
