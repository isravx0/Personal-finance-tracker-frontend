<template>
	<div class="auth-shell">
		<div class="auth-panel">
			<div class="text-center mb-4">
				<div
					class="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 bg-success bg-opacity-10 border border-success border-opacity-25"
					style="width:72px;height:72px;"
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#2d8a4e" viewBox="0 0 16 16">
						<path d="M8 0c-.69 0-1.364.116-2.001.333A7.994 7.994 0 0 0 0 8c0 2.082.794 3.979 2.099 5.401A7.97 7.97 0 0 0 8 16a7.97 7.97 0 0 0 5.901-2.599A7.964 7.964 0 0 0 16 8c0-3.314-2.018-6.16-4.893-7.367A7.964 7.964 0 0 0 8 0zm0 1c1.294 0 2.536.39 3.59 1.126C13.664 3.57 15 5.663 15 8c0 1.77-.68 3.446-1.913 4.72A6.971 6.971 0 0 1 8 15a6.971 6.971 0 0 1-5.087-2.28A6.964 6.964 0 0 1 1 8c0-2.63 1.443-5.018 3.762-6.235A6.975 6.975 0 0 1 8 1z"/>
						<path d="M7.5 4a.5.5 0 0 1 .5.5v3.293l2.146 2.147a.5.5 0 0 1-.707.707l-2.293-2.293A.5.5 0 0 1 7 8V4.5A.5.5 0 0 1 7.5 4z"/>
					</svg>
				</div>
				<h3 class="fw-bold text-success mb-1">Verify your sign in</h3>
				<p class="text-secondary small mb-0">
					Enter the verification code we sent to your email address.
				</p>
			</div>

			<div class="card border-0 shadow-sm rounded-4 p-2 page-section-card">
				<div class="card-body">
					<div v-if="errorMsg" class="alert alert-danger py-2 small rounded-3">{{ errorMsg }}</div>
					<div v-if="successMsg" class="alert alert-success py-2 small rounded-3">{{ successMsg }}</div>

					<div class="bg-success bg-opacity-10 rounded-4 p-3 mb-4">
						<div class="small fw-semibold text-success mb-1">Two-factor authentication</div>
						<p class="text-secondary small mb-0">
							Use the most recent 6-digit code from your inbox. If it expires, you can resend it below.
						</p>
					</div>

					<div class="mb-3">
						<label class="form-label small fw-semibold text-secondary">Verification code</label>
						<input
							ref="codeInput"
							v-model="code"
							type="text"
							inputmode="numeric"
							autocomplete="one-time-code"
							maxlength="6"
							class="form-control rounded-3 border-0 bg-light text-center two-factor-code-input"
							placeholder="000000"
							:class="{ 'is-invalid': submitted && code.length !== 6 }"
							@input="sanitizeCode"
							@keyup.enter="verifyCode"
						/>
						<div class="invalid-feedback">Please enter the 6-digit code.</div>
					</div>

					<div class="d-grid gap-2">
						<button
							class="btn fw-semibold rounded-3 py-2 text-white"
							style="background-color: #2d8a4e;"
							@click="verifyCode"
							:disabled="loading"
						>
							<span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
							{{ loading ? 'Verifying...' : 'Verify code' }}
						</button>

						<button
							class="btn btn-light fw-semibold rounded-3 py-2"
							@click="resendCode"
							:disabled="resending"
						>
							<span v-if="resending" class="spinner-border spinner-border-sm me-2"></span>
							{{ resending ? 'Resending...' : 'Resend code' }}
						</button>
					</div>
				</div>
			</div>

			<p class="text-center text-secondary small mt-3 mb-0">
				Entered the wrong account?
				<a href="/view/public/login" class="text-success fw-semibold text-decoration-none">Back to sign in</a>
			</p>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import { useUserStore } from '@/stores/userStore'

export default {
	name: 'VerifyTwoFactorPage',
	setup() {
		const userStore = useUserStore()
		return { userStore }
	},
	data() {
		return {
			code: '',
			loading: false,
			resending: false,
			submitted: false,
			errorMsg: '',
			successMsg: ''
		}
	},
	methods: {
		sanitizeCode() {
			this.code = this.code.replace(/\D/g, '').slice(0, 6)
		},
		async verifyCode() {
			this.submitted = true
			this.errorMsg = ''
			this.successMsg = ''

			if (this.code.length !== 6) {
				this.errorMsg = 'Please enter the 6-digit verification code.'
				return
			}

			this.loading = true

			try {
				const response = await axios.post(
					'http://localhost:8080/user/verifyTwoFactor',
					{ code: this.code },
					{ withCredentials: true }
				)

				if (response.data.success) {
					this.successMsg = 'Verification successful. Redirecting to your dashboard...'
					await this.userStore.fetchUser()
					// set user in Pinia store
					this.userStore.setUser(response.data.user)
					// Redirect to dashboard
					this.$router.push('/view/app/dashboard')
				} else {
					this.errorMsg = response.data.message || 'Failed to verify the code.'
				}
			} catch (error) {
				this.errorMsg =
					error.response?.data?.message || 'An error occurred while verifying the code.'
			} finally {
				this.loading = false
			}
		},
		async resendCode() {
			this.errorMsg = ''
			this.successMsg = ''
			this.resending = true

			try {
				const response = await axios.post(
					'http://localhost:8080/user/resendTwoFactorCode',
					{},
					{ withCredentials: true }
				)

				if (response.data.success) {
					this.successMsg = response.data.message || 'A new verification code has been sent.'
				} else {
					this.errorMsg = response.data.message || 'Failed to resend the code.'
				}
			} catch (error) {
				this.errorMsg =
					error.response?.data?.message || 'An error occurred while resending the code.'
			} finally {
				this.resending = false
			}
		}
	},
	mounted() {
		this.$refs.codeInput?.focus()
	}
}
</script>

<style scoped>
.two-factor-code-input {
	font-size: 1.5rem;
	font-weight: 700;
	letter-spacing: 0.45rem;
	padding-left: 1rem;
	text-indent: 0.45rem;
}

@media (max-width: 575.98px) {
	.two-factor-code-input {
		font-size: 1.3rem;
		letter-spacing: 0.32rem;
		text-indent: 0.32rem;
	}
}
</style>
