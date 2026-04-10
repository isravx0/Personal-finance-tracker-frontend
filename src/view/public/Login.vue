<template>
	<div class="auth-shell">
		<div class="auth-panel">
			<!-- Header -->
			<div class="text-center mb-4">
				<div class="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 bg-success bg-opacity-10 border border-success border-opacity-25" style="width:72px;height:72px;">
					<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#2d8a4e" viewBox="0 0 16 16">
						<path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4z"/>
					</svg>
				</div>
				<h3 class="fw-bold text-success mb-1">Good to see you 🌿</h3>
				<p class="text-secondary small">Sign in to continue</p>
			</div>

			<!-- Card -->
			<div class="card border-0 shadow-sm rounded-4 p-2 page-section-card">
				<div class="card-body">
					<!-- Error -->
					<div v-if="errorMsg" class="alert alert-danger py-2 small rounded-3">{{ errorMsg }}</div>

					<!-- Username -->
					<div class="mb-3">
						<label class="form-label small fw-semibold text-secondary">Username</label>
						<input type="text" class="form-control rounded-3 border-0 bg-light" v-model="username" placeholder="Your username" :class="{ 'is-invalid': submitted && !username }"/>
						<div class="invalid-feedback">Required.</div>
					</div>

					<!-- Password -->
					<div class="mb-4">
						<div class="d-flex justify-content-between">
							<label class="form-label small fw-semibold text-secondary">Password</label>
							<a href="/view/public/forgot-password" class="small text-success text-decoration-none">Forgot?</a>
						</div>
						<input type="password" class="form-control rounded-3 border-0 bg-light" v-model="password" placeholder="Your password" :class="{ 'is-invalid': submitted && !password }"/>
						<div class="invalid-feedback">Required.</div>
					</div>

					<!-- Button -->
					<div class="d-grid">
						<button class="btn fw-semibold rounded-3 py-2 text-white" style="background-color: #2d8a4e;" @click="login" :disabled="loading">
							<span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
							{{ loading ? 'Signing in...' : 'Sign in' }}
						</button>
					</div>

				</div>
			</div>

			<!-- Footer -->
			<p class="text-center text-secondary small mt-3">
				No account?
				<a href="/view/public/register" class="text-success fw-semibold text-decoration-none">Sign up</a>
			</p>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import { useUserStore } from '@/stores/userStore'

export default {
	name: 'LoginPage',
	setup() {
		const userStore = useUserStore()
		return { userStore }
	},
	data() {
		return {
			username: '',
			password: '',
			loading: false,
			submitted: false,
			errorMsg: ''
		}
	},
	methods: {
		async login() {
			this.submitted = true
			this.errorMsg = ''
			if (!this.username || !this.password) {
				this.errorMsg = 'Please fill in all fields.'
				return
			}
			this.loading = true
			try {
				const response = await axios.post('http://localhost:8080/user/login', {
					username: this.username,
					password: this.password
				}, { withCredentials: true })

				if (response.data.success && response.data.requires_2fa) {
					this.$router.push('/view/public/verify-two-factor')
					return
				}
			} catch (error) {
				this.errorMsg = 'An error occurred. Please try again.'
			} finally {
				this.loading = false
			}
		}
	}
}
</script>
