<template>
	<div class="min-vh-100 d-flex align-items-center justify-content-center bg-light">
		<div class="col-11 col-sm-7 col-md-5 col-lg-3">
			<!-- Header -->
			<div class="text-center mb-4">
				<div class="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 bg-success bg-opacity-10 border border-success border-opacity-25" style="width:72px;height:72px;">
					<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#2d8a4e" viewBox="0 0 16 16">
						<path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.708 2.825L15 11.105V5.383zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741zM1 11.105l4.708-2.897L1 5.383v5.722z"/>
					</svg>
				</div>

				<!-- Step 1 heading -->
				<template v-if="!emailSent">
					<h3 class="fw-bold text-success mb-1">Forgot password? 🔑</h3>
					<p class="text-secondary small">Enter your email and we'll send a reset link.</p>
				</template>

				<!-- Step 2 heading -->
				<template v-else>
					<h3 class="fw-bold text-success mb-1">Check your inbox 📬</h3>
					<p class="text-secondary small">We sent a reset link to <strong>{{ Email }}</strong></p>
				</template>
			</div>

			<!-- Card -->
			<div class="card border-0 shadow-sm rounded-4 p-2">
				<div class="card-body">
					<!-- Step 1: Email form -->
					<template v-if="!emailSent">
						<div v-if="errorMsg" class="alert alert-danger py-2 small rounded-3">{{ errorMsg }}</div>

						<div class="mb-4">
							<label class="form-label small fw-semibold text-secondary">Email address</label>
							<input
								type="email"
								class="form-control rounded-3 border-0 bg-light"
								v-model="Email"
								placeholder="you@example.com"
								:class="{ 'is-invalid': submitted && !Email }"
							/>
							<div class="invalid-feedback">Please enter your email.</div>
						</div>

						<div class="d-grid">
							<button class="btn fw-semibold rounded-3 py-2 text-white" style="background-color: #2d8a4e;" @click="sendReset" :disabled="loading">
								<span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
								{{ loading ? 'Sending...' : 'Send reset link' }}
							</button>
						</div>
					</template>

					<!-- Step 2: Confirmation -->
					<template v-else>
						<div class="text-center py-2">
							<div class="bg-success bg-opacity-10 rounded-3 p-3 mb-4">
								<p class="text-secondary small mb-1">Didn't receive it? Check your spam folder or</p>
								<a href="#" class="text-success fw-semibold text-decoration-none small" @click.prevent="resend">
									resend the email
								</a>
							</div>
							<div class="d-grid">
								<button
									class="btn fw-semibold rounded-3 py-2 text-white" style="background-color: #2d8a4e;" @click="emailSent = false; Email = ''; submitted = false">
									Try a different email
								</button>
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
	name: 'ForgotPasswordPage',
	data() {
		return {
			Email: '',
			loading: false,
			submitted: false,
			emailSent: false,
			errorMsg: ''
		}
	},
	methods: {
		async sendReset() {
			this.submitted = true
			this.errorMsg = ''

			if (!this.Email) {
				this.errorMsg = 'Please enter your email address.'
				return
			}

			this.loading = true
			try {
				const response = await fetch('http://localhost:8080/user/forgetPassword', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						email: this.Email
					})
				})

				const data = await response.json()

				if (data.success) {
					this.emailSent = true
				} else {
					// Handle different error types
					if (typeof data.message === 'object') {
						// Validation errors
						this.errorMsg = Object.values(data.message).join(', ')
					} else {
						this.errorMsg = data.message
					}
				}
			} catch (error) {
				console.error('Reset password error:', error)
				this.errorMsg = 'An error occurred. Please try again.'
			}
			this.loading = false
		},
		async resend() {
			this.loading = true
			try {
				const response = await fetch('http://localhost:8080/user/forgetPassword', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify({
						email: this.Email
					})
				})

				const data = await response.json()

				if (data.success) {
					alert('Reset link resent!')
				} else {
					alert('Failed to resend reset link. Please try again.')
				}
			} catch (error) {
				console.error('Resend error:', error)
				alert('An error occurred. Please try again.')
			}
			this.loading = false
		}
	}
}
</script>