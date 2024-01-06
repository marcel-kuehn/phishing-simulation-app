import { useAuthStore } from "@/stores/auth";
import { type RouteLocationNormalized, type NavigationGuardNext } from "vue-router";
import router from ".";

export const authGuard = async (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => {
    const authStore = useAuthStore();

    if(to.meta?.public) {
        return next();
    }

    try {
        await authStore.verifySession();
        next();
    }
    catch(e) {
        router.push({name: 'sign-in'});
    }
  };