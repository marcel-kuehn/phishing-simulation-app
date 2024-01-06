import { defineStore } from "pinia";
import { api } from "./auth";

export interface User {
    _id: string;
    name: string;
}

export interface UserStore {
    user: User | null,
}

const getDefaultData = (): UserStore => ({
    user: null,
});

export const useUserStore = defineStore('user', {
    state: getDefaultData,
    actions: {
        async getUser(): Promise<void> {
            try {
                const response = await api.get(
                    `/users/me`,
                );

                this.user = response.data;
            } catch (error) {
                console.error("Could not get user", error);
                throw error;
            }
        },
    }
});