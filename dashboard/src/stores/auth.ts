import { defineStore } from "pinia";
import axios from 'axios';
export interface AuthStore {
    userId: string;
    accessToken: string;
    refreshToken: string;
}

const getDefaultAuthData = (): AuthStore => ({
    userId: "",
    accessToken: "",
    refreshToken: ""
});

const getAuthData = (): AuthStore => {
    const authData = localStorage.getItem('AUTH_STORE');

    return authData ? JSON.parse(authData) : getDefaultAuthData()
}

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});
  
api.interceptors.request.use(
    (config) => {
        const token = getAuthData().accessToken;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


export const useAuthStore = defineStore('auth', {
    state: getAuthData,
    actions: {
        updateStore(userId: string, accessToken: string, refreshToken: string): void {
            this.userId = userId;
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;

            localStorage.setItem("AUTH_STORE", JSON.stringify({userId: this.userId, accessToken: this.accessToken, refreshToken: this.refreshToken}));
        },
        async signUp(name: string, email: string, password: string): Promise<void> {
            try {
                const response = await api.post(
                    `/auth/signup`,
                    { name, email, password }
                );

                const { userId, accessToken, refreshToken } = response.data;
                this.updateStore(userId, accessToken, refreshToken);
            } catch (error) {
                console.error("SignUp Error", error);
                throw error;
            }
        },
        async signIn(email: string, password: string): Promise<void> {
            try {
                const response = await api.post(
                    `/auth/signin`,
                    { email, password }
                );

                const { userId, accessToken, refreshToken } = response.data;
                this.updateStore(userId, accessToken, refreshToken);
            } catch (error) {
                console.error("SignUp Error", error);
                throw error;
            }
        },
        async verifySession(): Promise<void> {
            try {
                await api.get(
                    `/auth/verify-session`,
                );                
            } catch (error) {
                console.error("Session Invalid", error);
                this.updateStore("", "", "");
                throw error;
            }
        },
        async refreshSession(): Promise<void> {
            if(this.refreshToken === "") return;

            try {
                const response = await api.post(
                    `/auth/session-refresh`,
                    { refreshToken: this.refreshToken }
                );                
                const { userId, accessToken, refreshToken } = response.data;
                this.updateStore(userId, accessToken, refreshToken);
            } catch (error) {
                console.error("Session Invalid", error);
                this.updateStore("", "", "");
            }
        }
    }
});

export const startSessionRefreshLoop = async () => {
    const authStore = useAuthStore();
    await authStore.refreshSession();
    setInterval(authStore.refreshSession, 60000);
};