<template>
	<div class="min-vh-100 bg-light d-flex align-items-center py-5">
		<div class="container">
			<div class="row justify-content-center">
				<div class="col-12 col-md-10 col-lg-8 col-xl-7">

					<!-- Header -->
					<div class="text-center mb-4">
						<div
							class="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 bg-success bg-opacity-10 border border-success border-opacity-25"
							style="width:74px;height:74px;">
							<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#2d8a4e" viewBox="0 0 16 16">
								<path
									d="M8 0a.5.5 0 0 1 .5.5V1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0V2h-1a.5.5 0 0 1 0-1h1V.5A.5.5 0 0 1 8 0z" />
								<path d="M4 4h8a2 2 0 0 1 2 2v5a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V6a2 2 0 0 1 2-2z" />
							</svg>
						</div>
						<h3 class="fw-bold text-success mb-1">Let’s analyze your finances 💸</h3>
						<p class="text-secondary small mb-0">
							Answer a few quick questions so Mintly can understand your income, expenses, and savings.
						</p>
					</div>

					<!-- Form card -->
					<div class="card border-0 shadow-sm rounded-4 overflow-hidden">
						<div class="card-body p-4 p-md-5">
							<div v-if="errorMsg" class="alert alert-danger rounded-3 py-2 small mb-4">
								{{ errorMsg }}
							</div>

							<!-- Income -->
							<div class="mb-4">
								<div class="d-flex align-items-center gap-2 mb-3">
									<div class="rounded-3 d-flex align-items-center justify-content-center bg-success bg-opacity-10"
										style="width:36px;height:36px;">
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#2d8a4e" viewBox="0 0 16 16">
											<path
												d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4z" />
										</svg>
									</div>
									<div>
										<h6 class="fw-bold mb-0 text-dark">Income</h6>
										<p class="small text-secondary mb-0">Tell us how much money comes in each month.</p>
									</div>
								</div>

								<label class="form-label small fw-semibold text-secondary">Monthly income</label>
								<div class="input-group">
									<span class="input-group-text bg-light border-0 rounded-start-3">$</span>
									<input type="number" class="form-control bg-light border-0 rounded-end-3"
										v-model="form.monthly_income" placeholder="e.g. 3000" />
								</div>
							</div>

							<!-- Expenses -->
							<div class="mb-4">
								<div class="d-flex align-items-center gap-2 mb-3">
									<div class="rounded-3 d-flex align-items-center justify-content-center bg-success bg-opacity-10"
										style="width:36px;height:36px;">
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#2d8a4e" viewBox="0 0 16 16">
											<path
												d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0V4zm0 2h16v6a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6zm3 3a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2H3z" />
										</svg>
									</div>
									<div>
										<h6 class="fw-bold mb-0 text-dark">Monthly expenses</h6>
										<p class="small text-secondary mb-0">Enter your usual spending each month.</p>
									</div>
								</div>

								<div class="row g-3">
									<div class="col-12 col-md-6">
										<label class="form-label small fw-semibold text-secondary">Rent</label>
										<div class="input-group">
											<span class="input-group-text bg-light border-0 rounded-start-3">$</span>
											<input type="number" class="form-control bg-light border-0 rounded-end-3" v-model="form.rent"
												placeholder="0" />
										</div>
									</div>

									<div class="col-12 col-md-6">
										<label class="form-label small fw-semibold text-secondary">Food</label>
										<div class="input-group">
											<span class="input-group-text bg-light border-0 rounded-start-3">$</span>
											<input type="number" class="form-control bg-light border-0 rounded-end-3" v-model="form.food"
												placeholder="0" />
										</div>
									</div>

									<div class="col-12 col-md-6">
										<label class="form-label small fw-semibold text-secondary">Transport</label>
										<div class="input-group">
											<span class="input-group-text bg-light border-0 rounded-start-3">$</span>
											<input type="number" class="form-control bg-light border-0 rounded-end-3" v-model="form.transport"
												placeholder="0" />
										</div>
									</div>

									<div class="col-12 col-md-6">
										<label class="form-label small fw-semibold text-secondary">Bills</label>
										<div class="input-group">
											<span class="input-group-text bg-light border-0 rounded-start-3">$</span>
											<input type="number" class="form-control bg-light border-0 rounded-end-3" v-model="form.bills"
												placeholder="0" />
										</div>
									</div>

									<div class="col-12 col-md-6">
										<label class="form-label small fw-semibold text-secondary">Entertainment</label>
										<div class="input-group">
											<span class="input-group-text bg-light border-0 rounded-start-3">$</span>
											<input type="number" class="form-control bg-light border-0 rounded-end-3"
												v-model="form.entertainment" placeholder="0" />
										</div>
									</div>

									<div class="col-12 col-md-6">
										<label class="form-label small fw-semibold text-secondary">Other expenses</label>
										<div class="input-group">
											<span class="input-group-text bg-light border-0 rounded-start-3">$</span>
											<input type="number" class="form-control bg-light border-0 rounded-end-3"
												v-model="form.other_expenses" placeholder="0" />
										</div>
									</div>
								</div>
							</div>

							<!-- Savings -->
							<div class="mb-4">
								<div class="d-flex align-items-center gap-2 mb-3">
									<div class="rounded-3 d-flex align-items-center justify-content-center bg-success bg-opacity-10"
										style="width:36px;height:36px;">
										<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#2d8a4e" viewBox="0 0 16 16">
											<path
												d="M8 0a5.53 5.53 0 0 0-4.473 2.23C2.565 3.477 2 4.962 2 6.5c0 1.386.45 2.788 1.252 4.086.79 1.278 1.907 2.468 3.248 3.414.848.6 1.4 1.223 1.5 1.5.1-.277.652-.9 1.5-1.5 1.341-.946 2.458-2.136 3.248-3.414C13.55 9.288 14 7.886 14 6.5c0-1.538-.565-3.023-1.527-4.27A5.53 5.53 0 0 0 8 0z" />
										</svg>
									</div>
									<div>
										<h6 class="fw-bold mb-0 text-dark">Savings goal</h6>
										<p class="small text-secondary mb-0">How much would you like to save every month?</p>
									</div>
								</div>

								<label class="form-label small fw-semibold text-secondary">Target savings</label>
								<div class="input-group">
									<span class="input-group-text bg-light border-0 rounded-start-3">$</span>
									<input type="number" class="form-control bg-light border-0 rounded-end-3"
										v-model="form.target_savings" placeholder="e.g. 500" />
								</div>
							</div>

							<!-- Preview -->
							<div class="bg-success bg-opacity-10 rounded-4 p-3 mb-4">
								<div class="small fw-semibold text-success mb-2">Quick preview</div>
								<div class="row g-2 small">
									<div class="col-6">
										<div class="text-secondary">Income</div>
										<div class="fw-bold text-dark">${{ previewIncome }}</div>
									</div>
									<div class="col-6">
										<div class="text-secondary">Expenses</div>
										<div class="fw-bold text-dark">${{ previewExpenses }}</div>
									</div>
									<div class="col-12">
										<div class="text-secondary">Estimated remaining</div>
										<div class="fw-bold" :class="previewRemaining >= 0 ? 'text-success' : 'text-danger'">
											${{ previewRemaining }}
										</div>
									</div>
								</div>
							</div>

							<!-- Actions -->
							<div class="d-flex flex-column flex-md-row gap-2">
								<button class="btn fw-semibold rounded-3 py-2 text-white flex-fill" style="background-color:#2d8a4e;"
									@click="submitAnalysis" :disabled="loading">
									<span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
									{{ loading ? 'Analyzing...' : 'Analyze & Go to Dashboard' }}
								</button>

								<button class="btn btn-light fw-semibold rounded-3 py-2 px-4" @click="resetForm" :disabled="loading">
									Reset
								</button>
							</div>
						</div>
					</div>

				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'AnalysisFormPage',
	data() {
		return {
			loading: false,
			errorMsg: '',
			form: {
				monthly_income: '',
				rent: '',
				food: '',
				transport: '',
				bills: '',
				entertainment: '',
				other_expenses: '',
				target_savings: ''
			}
		}
	},
	computed: {
		previewIncome() {
			return Number(this.form.monthly_income || 0).toFixed(2)
		},
		previewExpenses() {
			const total =
				Number(this.form.rent || 0) +
				Number(this.form.food || 0) +
				Number(this.form.transport || 0) +
				Number(this.form.bills || 0) +
				Number(this.form.entertainment || 0) +
				Number(this.form.other_expenses || 0)

			return total.toFixed(2)
		},
		previewRemaining() {
			return (
				Number(this.form.monthly_income || 0) -
				Number(this.previewExpenses || 0)
			).toFixed(2)
		}
	},
	methods: {
		resetForm() {
			this.form = {
				monthly_income: '',
				rent: '',
				food: '',
				transport: '',
				bills: '',
				entertainment: '',
				other_expenses: '',
				target_savings: ''
			}
			this.errorMsg = ''
		},

		async submitAnalysis() {
			this.loading = true
			this.errorMsg = ''

			try {
				const response = await fetch('http://localhost:8080/analysis/analyze', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json'
					},
					credentials: 'include',
					body: JSON.stringify(this.form)
				})

				const data = await response.json()

				if (data.success) {
					localStorage.setItem('mintlyAnalysis', JSON.stringify(data.data))
					this.$router.push('/view/app/dashboard')
				} else {
					this.errorMsg =
						typeof data.message === 'object'
							? Object.values(data.message).join(', ')
							: data.message
				}
			} catch (error) {
				console.error(error)
				this.errorMsg = 'Something went wrong while analyzing your finances.'
			}

			this.loading = false
		}
	}
}
</script>