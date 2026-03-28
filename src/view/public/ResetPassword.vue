<template>
	<div class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
		<div class="col-11 col-sm-7 col-md-5 col-lg-3">
			<!-- Header -->
			<div class="text-center mb-4">
				<div class="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 bg-success bg-opacity-10 border border-success border-opacity-25" style="width:72px;height:72px;">
					<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#2d8a4e" viewBox="0 0 16 16">
						<path d="M8 1a4 4 0 0 0-4 4v2H3.5A1.5 1.5 0 0 0 2 8.5v5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 12.5 7H12V5a4 4 0 0 0-4-4zm-3 6V5a3 3 0 1 1 6 0v2H5z"/>
					</svg>
				</div>

				<!-- Step 1 heading -->
				<template v-if="!passwordReset">
					<h3 class="fw-bold text-success mb-1">Reset password 🔒</h3>
					<p class="text-secondary small">Enter your new password below.</p>
				</template>

				<!-- Step 2 heading -->
				<template v-else>
					<h3 class="fw-bold text-success mb-1">Password updated ✅</h3>
					<p class="text-secondary small">Your password has been reset successfully.</p>
				</template>
			</div>

			<!-- Card -->
			<div class="card border-0 shadow-sm rounded-4 p-2">
				<div class="card-body">
					<!-- Step 1: Reset form -->
					<template v-if="!passwordReset">
						<div v-if="errorMsg" class="alert alert-danger py-2 small rounded-3">
							{{ errorMsg }}
						</div>

						<div class="mb-3">
							<label class="form-label small fw-semibold text-secondary">New password</label>
							<input type="password" class="form-control rounded-3 border-0 bg-light" v-model="newPassword" placeholder="Enter new password" :class="{ 'is-invalid': submitted && !newPassword }"/>
							<div class="invalid-feedback">Please enter a new password.</div>
						</div>

						<div class="mb-4">
							<label class="form-label small fw-semibold text-secondary">Confirm password</label>
							<input type="password" class="form-control rounded-3 border-0 bg-light" v-model="confirmPassword" placeholder="Confirm new password" :class="{ 'is-invalid': submitted && (!confirmPassword || newPassword !== confirmPassword) }"/>
							<div class="invalid-feedback">
								{{ !confirmPassword ? 'Please confirm your password.' : 'Passwords do not match.' }}
							</div>
						</div>

						<div class="d-grid">
							<button class="btn fw-semibold rounded-3 py-2 text-white" style="background-color: #2d8a4e;" @click="resetPassword" :disabled="loading">
								<span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
								{{ loading ? 'Updating...' : 'Reset password' }}
							</button>
						</div>
					</template>

					<!-- Step 2: Success -->
					<template v-else>
						<div class="text-center py-2">
							<div class="bg-success bg-opacity-10 rounded-3 p-3 mb-4">
								<p class="text-secondary small mb-0">
									You can now sign in with your new password.
								</p>
							</div>
							<div class="d-grid">
								<a href="/view/public/login" class="btn fw-semibold rounded-3 py-2 text-white text-decoration-none" style="background-color: #2d8a4e;">
									Back to sign in
								</a>
							</div>
						</div>
					</template>
				</div>
			</div>

			<!-- Footer -->
			<p class="text-center text-secondary small mt-3">
				Remembered it?
				<a href="/view/public/login" class="text-success fw-semibold text-decoration-none">Back to sign in</a>
			</p>
		</div>
	</div>
</template>

<script>
export default {
	name: 'ResetPasswordPage',
	data() {
		return {
			newPassword: '',
			confirmPassword: '',
			loading: false,
			submitted: false,
			passwordReset: false,
			errorMsg: ''
		}
	},
	methods: {
		async resetPassword() {
			this.submitted = true
			this.errorMsg = ''

			if (!this.newPassword || !this.confirmPassword) {
				this.errorMsg = 'Please fill in all fields.'
				return
			}

			if (this.newPassword !== this.confirmPassword) {
				this.errorMsg = 'Passwords do not match.'
				return
			}

			this.loading = true

			try {
				const response = await fetch('http://localhost:8080/user/resetPassword', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
                        token: this.$route.query.token,
						password: this.newPassword,
						confirmPassword: this.confirmPassword
					})
				})

				const data = await response.json()

				if (data.success) {
					this.passwordReset = true
				} else {
					if (typeof data.message === 'object') {
						this.errorMsg = Object.values(data.message).join(', ')
					} else {
						this.errorMsg = data.message || 'Failed to reset password.'
					}
				}
			} catch (error) {
				console.error('Reset password error:', error)
				this.errorMsg = 'An error occurred. Please try again.'
			}

			this.loading = false
		}
	}
}
</script>