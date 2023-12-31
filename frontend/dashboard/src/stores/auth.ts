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

export const useAuthStore = defineStore('auth', {
    state: getAuthData,
    actions: {
        updateStore(userId, accessToken, refreshToken): void {
            this.userId = userId;
            this.accessToken = accessToken;
            this.refreshToken = refreshToken;

            localStorage.setItem("AUTH_STORE", JSON.stringify({userId: this.userId, accessToken: this.accessToken, refreshToken: this.refreshToken}));
        },
        async signUp(name: string, email: string, password: string): Promise<void> {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/auth/signup`,
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
                const response = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/auth/signin`,
                    { email, password }
                );

                const { userId, accessToken, refreshToken } = response.data;
                this.updateStore(userId, accessToken, refreshToken);
            } catch (error) {
                console.error("SignUp Error", error);
                throw error;
            }
        },
    }
});