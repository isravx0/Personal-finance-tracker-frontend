import { createWebHistory, createRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'

const routes = [
	{
		path: '/', 
		component: () => import('../view/public/Login.vue'),
	},
	{
		path: '/view/public/login', 
		component: () => import('../view/public/Login.vue'),
	},
	{ 
		path: '/view/public/register', 
		component: () => import('../view/public/Register.vue'),
	},
	{
		path: '/view/public/forgot-password',
		component: () => import('../view/public/ForgotPassword.vue'),
	},
	{
		path: '/view/public/reset-password',
		component: () => import('../view/public/ResetPassword.vue'),
	},
	{
		path: '/view/app/dashboard',
		component: () => import('../view/app/Dashboard/index.vue'),
	},
	{
		path: '/view/app/financial-analysis',
		component: () => import('../view/app/FinancialAnalysis/index.vue'),
	},
	{
		path: '/view/app/history',
		component: () => import('../view/app/History/index.vue'),
	},
	{
		path: '/view/app/profile',
		component: () => import('../view/app/Profile/index.vue'),
	},
]

export const router = createRouter({
	history: createWebHistory(),
	routes,
})

// Route guard
router.beforeEach(async (to, from, next) => {
	const userStore = useUserStore()

	if (!userStore.hasCheckedAuth) {
		await userStore.fetchUser()
	}

	if (to.meta.requiresAuth && !userStore.isAuthenticated) {
		return next('/view/public/login')
	}

	if ((to.path === '/view/public/login' || to.path === '/view/public/register' || to.path === '/view/public/forgot-password' || to.path === '/view/public/reset-password') && userStore.isAuthenticated) {
		return next('/view/app/dashboard')
	}

	next()
})