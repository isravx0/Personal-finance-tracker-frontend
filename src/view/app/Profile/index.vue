<template>
	<div class="page-shell">
		<div class="page-container">
				<div class="mb-4">
					<h4 class="fw-bold text-dark mb-1">My Profile</h4>
					<p class="text-secondary small mb-0">Manage your personal information and account details.</p>
				</div>

				<div class="row g-4">
					<!-- Profile Summary -->
					<div class="col-12 col-lg-4">
						<div class="card border-0 shadow-sm rounded-4 h-100 page-section-card">
							<div class="card-body p-4 page-section-body text-center">
								<div
									class="rounded-circle d-inline-flex align-items-center justify-content-center text-white fw-bold mb-3"
									style="width: 82px; height: 82px; background-color: #2d8a4e; font-size: 28px"
								>
									{{ userInitials }}
								</div>

								<h5 class="fw-bold text-dark mb-1">{{ form.name || 'User Name' }}</h5>
								<p class="text-secondary small mb-3">{{ form.email || 'user@email.com' }}</p>

								<div class="bg-light rounded-4 p-3 text-start">
									<div class="small text-secondary mb-1">Username</div>
									<div class="fw-semibold text-dark mb-3">{{ form.username || '-' }}</div>

									<div class="small text-secondary mb-1">Email</div>
									<div class="fw-semibold text-dark mb-3">{{ form.email || '-' }}</div>

									<div class="small text-secondary mb-1">Status</div>
									<div class="fw-semibold text-success">Active</div>
								</div>
							</div>
						</div>
					</div>

					<!-- Edit Form -->
					<div class="col-12 col-lg-8">
						<div class="card border-0 shadow-sm rounded-4 page-section-card">
							<div class="card-body p-4 page-section-body">
								<div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
									<h5 class="fw-bold text-dark mb-0">Edit Profile</h5>
									<span
										class="badge rounded-pill px-3 py-2 small"
										style="background-color: #e8f5ee; color: #2d8a4e"
									>
										Account Settings
									</span>
								</div>

								<div v-if="successMsg" class="alert alert-success rounded-3 py-2 small">
									{{ successMsg }}
								</div>

								<div v-if="errorMsg" class="alert alert-danger rounded-3 py-2 small">
									{{ errorMsg }}
								</div>

								<div v-if="loadingProfile" class="text-secondary small mb-3">
									<span class="spinner-border spinner-border-sm me-2"></span>
									Loading profile...
								</div>

								<form @submit.prevent="updateProfile">
									<div class="row g-3">
										<div class="col-12 col-md-6">
											<label class="form-label small fw-semibold text-secondary">Full name</label>
											<input
												type="text"
												class="form-control rounded-3 border-0 bg-light"
												v-model="form.name"
												placeholder="Enter your full name"
											/>
										</div>

										<div class="col-12 col-md-6">
											<label class="form-label small fw-semibold text-secondary">Username</label>
											<input
												type="text"
												class="form-control rounded-3 border-0 bg-light"
												v-model="form.username"
												placeholder="Enter your username"
											/>
										</div>

										<div class="col-12">
											<label class="form-label small fw-semibold text-secondary">Email address</label>
											<input
												type="email"
												class="form-control rounded-3 border-0 bg-light"
												v-model="form.email"
												placeholder="Enter your email"
											/>
										</div>

										<div class="col-12 col-md-6">
											<label class="form-label small fw-semibold text-secondary">New password</label>
											<input
												type="password"
												class="form-control rounded-3 border-0 bg-light"
												v-model="form.password"
												placeholder="Leave empty to keep current password"
											/>
										</div>

										<div class="col-12 col-md-6">
											<label class="form-label small fw-semibold text-secondary">Confirm password</label>
											<input
												type="password"
												class="form-control rounded-3 border-0 bg-light"
												v-model="form.confirmPassword"
												placeholder="Confirm new password"
											/>
										</div>
									</div>

									<div class="d-flex flex-column flex-sm-row gap-2 mt-4 profile-actions">
										<button
											type="submit"
											class="btn fw-semibold rounded-3 py-2 px-4 text-white"
											style="background-color: #2d8a4e"
											:disabled="saving"
										>
											<span v-if="saving" class="spinner-border spinner-border-sm me-2"></span>
											{{ saving ? 'Saving...' : 'Save Changes' }}
										</button>

										<button
											type="button"
											class="btn btn-light fw-semibold rounded-3 py-2 px-4"
											@click="loadProfile"
											:disabled="saving"
										>
											Reset
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios'
import { useUserStore } from '@/stores/userStore'

export default {
	name: 'Profile',
	setup() {
		const userStore = useUserStore()
		return { userStore }
	},
	data() {
		return {
			activeNav: 'Profile',
			loadingProfile: false,
			saving: false,
			errorMsg: '',
			successMsg: '',
			form: {
				name: '',
				username: '',
				email: '',
				password: '',
				confirmPassword: ''
			},
			navItems: [
				{
					label: 'Dashboard',
					icon: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V4.5A.5.5 0 0 1 8 4zM3.732 5.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707zM2 10a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 10zm9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5zm.754-4.246a.389.389 0 0 0-.527-.02L9.52 7.95A2.51 2.51 0 0 1 10 9.5 2.5 2.5 0 1 1 5 9.5a2.51 2.51 0 0 1 .545-1.557l-1.427-2.35a.385.385 0 0 0-.315-.193.39.39 0 0 0-.34.158l-1.5 2.25a.39.39 0 0 0 .654.436l.938-1.406A3.49 3.49 0 0 0 4.5 9.5 3.5 3.5 0 1 0 11.5 9.5c0-.601-.158-1.162-.428-1.655l1.28-1.108a.39.39 0 0 0 .064-.527z"/></svg>'
				},
				{
					label: 'Profile',
					icon: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4z"/></svg>'
				},
				{
					label: 'Settings',
					icon: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16"><path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/><path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.892 3.433-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.892-1.64-.901-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319z"/></svg>'
				}
			]
		}
	},
	computed: {
		userInitials() {
			if (!this.form.name) return 'U'
			return this.form.name
				.split(' ')
				.map(part => part[0])
				.join('')
				.slice(0, 2)
				.toUpperCase()
		}
	},
	methods: {
		async loadProfile() {
			this.loadingProfile = true
			this.errorMsg = ''
			this.successMsg = ''

			try {
				const response = await axios.get('http://localhost:8080/user/session', {
					withCredentials: true
				})

				if (response.data.success && response.data.user) {
					const user = response.data.user
					this.form.name = user.name || ''
					this.form.username = user.username || ''
					this.form.email = user.email || ''
					this.form.password = ''
					this.form.confirmPassword = ''
				} else {
					this.errorMsg = 'Could not load profile data.'
				}
			} catch (error) {
				this.errorMsg = error.response?.data?.message || 'Failed to load profile.'
			} finally {
				this.loadingProfile = false
			}
		},

		async updateProfile() {
			this.errorMsg = ''
			this.successMsg = ''

			if (!this.form.name || !this.form.username || !this.form.email) {
				this.errorMsg = 'Please fill in all required fields.'
				return
			}

			if (this.form.password && this.form.password !== this.form.confirmPassword) {
				this.errorMsg = 'Passwords do not match.'
				return
			}

			this.saving = true

			try {
				const response = await axios.post(
					'http://localhost:8080/user/updateProfile',
					{
						name: this.form.name,
						username: this.form.username,
						email: this.form.email,
						password: this.form.password,
						confirmPassword: this.form.confirmPassword
					},
					{
						withCredentials: true
					}
				)

				if (response.data.success) {
					this.successMsg = response.data.message || 'Profile updated successfully.'
					await this.userStore.fetchUser()
					this.form.password = ''
					this.form.confirmPassword = ''
				} else {
					this.errorMsg = response.data.message
				}
			} catch (error) {
				this.errorMsg =
					error.response?.data?.message || 'Failed to update profile.'
			} finally {
				this.saving = false
			}
		}
	},
	mounted() {
		this.loadProfile()
	}
}
</script>

<style scoped>
@media (max-width: 767.98px) {
	.profile-actions .btn {
		width: 100%;
	}
}
</style>
