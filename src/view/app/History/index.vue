<template>
	<div class="page-shell">
		<div class="page-container">
		<div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-3">
			<div>
				<h2 class="mb-1 fw-bold text-dark">Transaction History</h2>
				<p class="text-secondary small mb-0">View all your saved financial analysis records.</p>
			</div>
			<div class="d-flex gap-2 flex-wrap">
				<button 
					class="btn btn-outline-success rounded-3 small fw-semibold px-3"
					@click="exportToPdf"
					:disabled="history.length === 0 || exporting"
				>
					<span v-if="exporting" class="spinner-border spinner-border-sm me-2"></span>
					Export PDF
				</button>
				<button 
					class="btn btn-outline-success rounded-3 small fw-semibold px-3"
					@click="exportToCsv"
					:disabled="history.length === 0 || exporting"
				>
					<span v-if="exporting" class="spinner-border spinner-border-sm me-2"></span>
					Export CSV
				</button>
			</div>
		</div>

		<div class="card border-0 shadow-sm rounded-4 page-section-card">
			<div class="card-body p-4 page-section-body">
				<!-- Filters -->
				<div class="row g-3 mb-4">
					<div class="col-12 col-md-5">
						<label class="form-label small fw-semibold text-secondary">Search</label>
						<input type="text" class="form-control rounded-3 bg-light border-0" v-model="searchQuery"
							placeholder="Search by advice or values..." />
					</div>

					<div class="col-12 col-md-3">
						<label class="form-label small fw-semibold text-secondary">Savings Status</label>
						<select class="form-select rounded-3 bg-light border-0" v-model="statusFilter">
							<option value="">All</option>
							<option value="good">Good</option>
							<option value="warning">Warning</option>
							<option value="critical">Critical</option>
						</select>
					</div>

					<div class="col-12 col-md-4">
						<label class="form-label small fw-semibold text-secondary">Month</label>
						<input type="month" class="form-control rounded-3 bg-light border-0" v-model="monthFilter" />
					</div>
				</div>

				<!-- Loading -->
				<div v-if="loadingHistory" class="text-center py-5 text-secondary">
					<span class="spinner-border spinner-border-sm me-2"></span>
					Loading history...
				</div>

				<!-- Error -->
				<div v-else-if="historyError" class="alert alert-danger rounded-3 small mb-0">
					{{ historyError }}
				</div>

				<!-- Empty -->
				<div v-else-if="filteredHistory.length === 0" class="text-center py-5">
					<h6 class="fw-bold text-dark mb-1">No history found</h6>
					<p class="text-secondary small mb-0">
						There are no saved analysis records matching your filters.
					</p>
				</div>

				<!-- Table -->
				<div v-else class="table-responsive desktop-table">
					<table class="table align-middle mb-0">
						<thead>
							<tr class="text-secondary small">
								<th class="fw-semibold">Date</th>
								<th class="fw-semibold">Income</th>
								<th class="fw-semibold">Expenses</th>
								<th class="fw-semibold">Savings</th>
								<th class="fw-semibold">Remaining</th>
								<th class="fw-semibold">Status</th>
								<th class="fw-semibold">Advice</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item in filteredHistory" :key="item.id">
								<td class="fw-semibold text-dark">{{ formatDate(item.created_at) }}</td>
								<td>{{ formatMoney(item.monthly_income) }}</td>
								<td>{{ formatMoney(item.total_expenses) }}</td>
								<td>{{ formatMoney(item.actual_savings) }}</td>
								<td
									:class="Number(item.remaining_balance) >= 0 ? 'text-success fw-semibold' : 'text-danger fw-semibold'">
									{{ formatMoney(item.remaining_balance) }}
								</td>
								<td>
									<span class="badge rounded-pill px-3 py-2" :style="getStatusStyle(item)">
										{{ getStatusLabel(item) }}
									</span>
								</td>
								<td class="text-secondary small" style="max-width: 280px;">
									{{ item.advice || '-' }}
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div class="mobile-card-list">
					<div v-for="item in filteredHistory" :key="`${item.id}-mobile`" class="history-mobile-card">
						<div class="d-flex justify-content-between align-items-start gap-3 mb-3">
							<div>
								<div class="fw-semibold text-dark">{{ formatDate(item.created_at) }}</div>
								<div class="small text-secondary mt-1">Saved analysis record</div>
							</div>
							<span class="badge rounded-pill px-3 py-2" :style="getStatusStyle(item)">
								{{ getStatusLabel(item) }}
							</span>
						</div>

						<div class="row g-3 small">
							<div class="col-6">
								<div class="text-secondary">Income</div>
								<div class="fw-semibold text-dark">{{ formatMoney(item.monthly_income) }}</div>
							</div>
							<div class="col-6">
								<div class="text-secondary">Expenses</div>
								<div class="fw-semibold text-dark">{{ formatMoney(item.total_expenses) }}</div>
							</div>
							<div class="col-6">
								<div class="text-secondary">Savings</div>
								<div class="fw-semibold text-dark">{{ formatMoney(item.actual_savings) }}</div>
							</div>
							<div class="col-6">
								<div class="text-secondary">Remaining</div>
								<div :class="Number(item.remaining_balance) >= 0 ? 'text-success fw-semibold' : 'text-danger fw-semibold'">
									{{ formatMoney(item.remaining_balance) }}
								</div>
							</div>
							<div class="col-12">
								<div class="text-secondary mb-1">Advice</div>
								<div class="small text-dark history-mobile-advice">{{ item.advice || '-' }}</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Summary -->
				<div v-if="filteredHistory.length > 0" class="row g-3 mt-4">
					<div class="col-6 col-lg-3">
						<div class="bg-light rounded-4 p-3">
							<div class="small text-secondary">Total Records</div>
							<div class="fw-bold fs-5">{{ filteredHistory.length }}</div>
						</div>
					</div>
					<div class="col-6 col-lg-3">
						<div class="bg-light rounded-4 p-3">
							<div class="small text-secondary">Avg Income</div>
							<div class="fw-bold fs-5">{{ formatMoney(avgIncome) }}</div>
						</div>
					</div>
					<div class="col-6 col-lg-3">
						<div class="bg-light rounded-4 p-3">
							<div class="small text-secondary">Avg Expenses</div>
							<div class="fw-bold fs-5">{{ formatMoney(avgExpenses) }}</div>
						</div>
					</div>
					<div class="col-6 col-lg-3">
						<div class="bg-light rounded-4 p-3">
							<div class="small text-secondary">Avg Savings</div>
							<div class="fw-bold fs-5">{{ formatMoney(avgSavings) }}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		</div>
	</div>
</template>

<script>
import axios from 'axios'

export default {
	name: 'History',
	data() {
		return {
			loadingHistory: false,
			historyError: '',
			history: [],
			searchQuery: '',
			statusFilter: '',
			monthFilter: '',
			exporting: false
		}
	},
	computed: {
		filteredHistory() {
			return this.history.filter((item) => {
				const matchesSearch =
					!this.searchQuery ||
					String(item.advice || '').toLowerCase().includes(this.searchQuery.toLowerCase()) ||
					String(item.monthly_income).includes(this.searchQuery) ||
					String(item.total_expenses).includes(this.searchQuery) ||
					String(item.actual_savings).includes(this.searchQuery) ||
					String(item.remaining_balance).includes(this.searchQuery)

				const status = this.getStatusKey(item)
				const matchesStatus = !this.statusFilter || status === this.statusFilter

				const matchesMonth =
					!this.monthFilter ||
					(item.created_at && item.created_at.slice(0, 7) === this.monthFilter)

				return matchesSearch && matchesStatus && matchesMonth
			})
		},
		avgIncome() {
			if (!this.filteredHistory.length) return 0
			const total = this.filteredHistory.reduce((sum, item) => sum + Number(item.monthly_income || 0), 0)
			return total / this.filteredHistory.length
		},
		avgExpenses() {
			if (!this.filteredHistory.length) return 0
			const total = this.filteredHistory.reduce((sum, item) => sum + Number(item.total_expenses || 0), 0)
			return total / this.filteredHistory.length
		},
		avgSavings() {
			if (!this.filteredHistory.length) return 0
			const total = this.filteredHistory.reduce((sum, item) => sum + Number(item.actual_savings || 0), 0)
			return total / this.filteredHistory.length
		}
	},
	methods: {
		async loadHistoryData() {
			this.loadingHistory = true
			this.historyError = ''

			try {
				const response = await axios.get('http://localhost:8080/analysis/history', {
					withCredentials: true
				})

				if (response.data.success && response.data.data) {
					this.history = response.data.data
					console.log('Loaded history:', this.history)
				} else {
					this.history = []
				}
			} catch (error) {
				console.error('Failed to load history:', error)
				this.historyError =
					error.response?.data?.message || 'Could not load your history.'
				this.history = []
			} finally {
				this.loadingHistory = false
			}
		},
		formatMoney(value) {
			return `$${Number(value || 0).toFixed(2)}`
		},
		formatDate(dateString) {
			if (!dateString) return '-'
			return new Date(dateString).toLocaleDateString('en-GB', {
				day: '2-digit',
				month: 'short',
				year: 'numeric'
			})
		},
		getStatusKey(item) {
			const remaining = Number(item.remaining_balance || 0)
			const savings = Number(item.actual_savings || 0)

			if (remaining < 0) return 'critical'
			if (savings === 0) return 'warning'
			return 'good'
		},
		getStatusLabel(item) {
			const status = this.getStatusKey(item)
			if (status === 'critical') return 'Critical'
			if (status === 'warning') return 'Warning'
			return 'Good'
		},
		getStatusStyle(item) {
			const status = this.getStatusKey(item)

			if (status === 'critical') {
				return 'background:#fdecea; color:#e53935;'
			}
			if (status === 'warning') {
				return 'background:#fff8e1; color:#f59e0b;'
			}
			return 'background:#e8f5ee; color:#2d8a4e;'
		},
		async exportToPdf() {
			this.exporting = true
			try {
				const link = document.createElement('a')
				link.href = 'http://localhost:8080/analysis/export-pdf'
				link.setAttribute('target', '_blank')
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)
			} catch (error) {
				console.error('Error exporting PDF:', error)
				alert('Failed to export PDF. Please try again.')
			} finally {
				this.exporting = false
			}
		},
		async exportToCsv() {
			this.exporting = true
			try {
				const response = await axios.get('http://localhost:8080/analysis/export-csv', {
					withCredentials: true,
					responseType: 'blob'
				})
				const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
				const link = document.createElement('a')
				const url = URL.createObjectURL(blob)
				link.setAttribute('href', url)
				link.setAttribute('download', 'analysis_history_' + new Date().toISOString().slice(0, 10) + '.csv')
				document.body.appendChild(link)
				link.click()
				document.body.removeChild(link)
				URL.revokeObjectURL(url)
			} catch (error) {
				console.error('Error exporting CSV:', error)
				alert('Failed to export CSV. Please try again.')
			} finally {
				this.exporting = false
			}
		}
	},
	mounted() {
		this.loadHistoryData()
	}
}
</script>

<style scoped>
.history-mobile-card {
	background: #f8faf8;
	border: 1px solid rgba(45, 138, 78, 0.08);
	border-radius: 1rem;
	padding: 1rem;
}

.history-mobile-advice {
	line-height: 1.5;
}
</style>
