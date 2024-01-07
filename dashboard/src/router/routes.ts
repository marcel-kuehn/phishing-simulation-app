import type { RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { public: true }
  },
  {
    path: '/sign-up',
    name: 'sign-up',
    component: () => import('../views/SignUpView.vue'),
    meta: { public: true }
  },
  {
    path: '/sign-in',
    name: 'sign-in',
    component: () => import('../views/SignInView.vue'),
    meta: { public: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue')
  },
  {
    path: '/dashboard/mail-lists',
    name: 'maillists',
    component: () => import('../views/MailListsView.vue')
  },
  {
    path: '/dashboard/campaigns',
    name: 'campaigns',
    component: () => import('../views/CampaignsView.vue')
  },
  {
    path: '/daashboard/settings',
    name: 'settings',
    component: () => import('../views/SettingsView.vue')
  }
]
