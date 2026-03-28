import axios from 'axios'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserStore = defineStore('user', () => {
	const user = ref(null)
	const isLoading = ref(false)
	const error = ref(null)
	const isAuthenticated = ref(false)
	const hasCheckedAuth = ref(false)

	const fetchUser = async () => {
		isLoading.value = true
		error.value = null

		try {
			const response = await axios.get('http://localhost:8080/user/session', {
				withCredentials: true
			})

			if (response.data.success && response.data.user) {
				user.value = response.data.user
				isAuthenticated.value = true
			} else {
				user.value = null
				isAuthenticated.value = false
			}
		} catch (err) {
			user.value = null
			isAuthenticated.value = false
			error.value = err.response?.data?.message || err.message
			console.error('Failed to fetch user:', err)
		} finally {
			isLoading.value = false
			hasCheckedAuth.value = true
		}
	}

	const setUser = (userData) => {
		user.value = userData
		isAuthenticated.value = true
		hasCheckedAuth.value = true
	}

	const clearUser = () => {
		user.value = null
		isAuthenticated.value = false
		error.value = null
		hasCheckedAuth.value = true
	}

	return {
		user,
		isLoading,
		error,
		isAuthenticated,
		hasCheckedAuth,
		fetchUser,
		setUser,
		clearUser
	}
})