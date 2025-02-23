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


export const isValidToken = (accessToken: string) => {
    if (!accessToken) {
        return false;
    }

    const decoded = jwtDecode(accessToken);
    const currentTime = Date.now() / 1000;
    return decoded.exp > currentTime;
};

export const tokenExpired = async (exp: number) => {
    let expiredTimer;

    const currentTime = Date.now();

    const timeLeft = exp * 1000 - currentTime - 100000;
    clearTimeout(expiredTimer);

    expiredTimer = setTimeout(async () => {

        setSession(null)

    }, timeLeft);
};

export const setSession = async (
    accessToken?: string | null,
) => {
    if (accessToken) {
        axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        // This function below will handle when token is expired
        const { exp } = jwtDecode(accessToken); // ~1 day
        tokenExpired(exp);
    } else {
        delete axios.defaults.headers.common.Authorization;
        window.location.href = "/auth/login";
    }
};
