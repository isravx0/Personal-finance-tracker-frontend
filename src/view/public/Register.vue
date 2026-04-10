<template>
	<div class="auth-shell">
		<div class="auth-panel">

			<!-- Header -->
			<div class="text-center mb-4">
				<div class="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 bg-success bg-opacity-10 border border-success border-opacity-25" style="width:72px;height:72px;">
						<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#2d8a4e" viewBox="0 0 16 16">
						<path d="M6 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H1s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C9.516 10.68 8.029 10 6 10c-2.03 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z"/>
						<path fill-rule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
						</svg>
					</div>
					<h3 class="fw-bold text-success mb-1">Create an account 🌱</h3>
					<p class="text-secondary small">Join us today, it's free!</p>
				</div>

				<!-- Card -->
				<div class="card border-0 shadow-sm rounded-4 p-2 page-section-card">
					<div class="card-body">

					<div v-if="errorMsg" class="alert alert-danger py-2 small rounded-3">{{ errorMsg }}</div>
					<div v-if="successMsg" class="alert alert-success py-2 small rounded-3">{{ successMsg }}</div>

					<!-- Full Name -->
					<div class="mb-3">
						<label class="form-label small fw-semibold text-secondary">Full Name</label>
						<input type="text" class="form-control rounded-3 border-0 bg-light" v-model="name" placeholder="Jane Doe" :class="{ 'is-invalid': submitted && !name }"/>
						<div class="invalid-feedback">Required.</div>
					</div>

					<!-- email -->
					<div class="mb-3">
						<label class="form-label small fw-semibold text-secondary">email</label>
						<input type="email" class="form-control rounded-3 border-0 bg-light" v-model="email" placeholder="you@example.com" :class="{ 'is-invalid': submitted && !email }"/>
						<div class="invalid-feedback">Required.</div>
					</div>

					<!-- username -->
					<div class="mb-3">
						<label class="form-label small fw-semibold text-secondary">username</label>
						<input type="text" class="form-control rounded-3 border-0 bg-light" v-model="username" placeholder="Your username" :class="{ 'is-invalid': submitted && !username }"/>
						<div class="invalid-feedback">Required.</div>
					</div>

					<!-- Password -->
					<div class="mb-3">
						<label class="form-label small fw-semibold text-secondary">Password</label>
						<input type="password" class="form-control rounded-3 border-0 bg-light" v-model="password" placeholder="Min. 8 characters" :class="{ 'is-invalid': submitted && !password }"/>
						<div class="invalid-feedback">Required.</div>
					</div>

					<!-- Confirm Password -->
					<div class="mb-4">
						<label class="form-label small fw-semibold text-secondary">Confirm Password</label>
						<input type="password" class="form-control rounded-3 border-0 bg-light" v-model="confirmPassword" placeholder="Repeat your password" :class="{ 'is-invalid': submitted && !passwordsMatch }"/>
						<div class="invalid-feedback">Passwords don't match.</div>
					</div>

					<!-- Button -->
					<div class="d-grid">
						<button class="btn fw-semibold rounded-3 py-2 text-white" style="background-color: #2d8a4e;" @click="register" :disabled="loading">
							<span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
							{{ loading ? 'Creating account...' : 'Create account' }}
						</button>
					</div>
				</div>
			</div>
			<!-- Footer -->
			<p class="text-center text-secondary small mt-3">
				Already have an account?
				<a href="/view/public/login" class="text-success fw-semibold text-decoration-none">Sign in</a>
			</p>
		</div>
	</div>
</template>

<script>
	import axios from 'axios'

	export default {
		name: 'RegisterPage',
		data() {
			return {
				name: '',
				email: '',
				username: '',
				password: '',
				confirmPassword: '',
				loading: false,
				submitted: false,
				errorMsg: '',
				successMsg: ''
			}
		},
		computed: {
			passwordsMatch() {
				return this.password === this.confirmPassword
			}
		},
		methods: {
		async register() {
			this.submitted = true
			this.errorMsg = ''
			this.successMsg = ''

			if (!this.name || !this.email || !this.username || !this.password || !this.confirmPassword) {
				this.errorMsg = 'Please fill in all fields.'
				return
			}
			if (!this.passwordsMatch) {
				this.errorMsg = 'Passwords do not match.'
				return
			}
			
			this.loading = true
			try {
				const response = await axios.post('http://localhost:8080/user/register', {
					name: this.name,
					email: this.email,
					username: this.username,
					password: this.password,
					confirmPassword: this.confirmPassword
				})
				if (response.data.success) {
					this.successMsg = response.data.message
					// redirect to login after 1 second
					setTimeout(() => {
						this.$router.push('/view/public/login')
					}, 1000)
				} else {
					this.errorMsg = response.data.message
				}
			} catch (error) {
				if (error.response?.data?.message) {
					this.errorMsg = JSON.stringify(error.response.data.message);
				} else {
					this.errorMsg = error.message || 'An error occurred. Please try again.'
				}
			}
			this.loading = false
		}
		}
	}
</script>
