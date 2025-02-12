import axios from "../axios";
import Cookies from 'js-cookie'

export function jwtDecode(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url?.replace(/-/g, '+').replace(/_/g, '/');
    if (!base64) return JSON.parse('{}');
    const jsonPayload = decodeURIComponent(
        window
            .atob(base64)
            .split('')
            .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
            .join(''),
    );

    return JSON.parse(jsonPayload);
}

export const getAccessToken = () => {
    const token = Cookies.get('token')
    if(token) return token
    return false
}

export const isValidToken = (accessToken: string) => {
    if (!accessToken) {
        return false;
    }

    const decoded = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
};


export const setSession = async (
    accessToken?: string | null,
) => {
    if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
    } else {
        window.location.href = "/auth/login";
        localStorage.removeItem('accessToken');
    }
};
