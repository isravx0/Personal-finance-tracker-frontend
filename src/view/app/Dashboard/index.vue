<template>
	<div class="page-shell">
		<div class="page-container dashboard-main">
				<!-- Top bar -->
				<div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3 dashboard-topbar">
					<div>
						<h4 class="fw-bold text-dark mb-0">
							Good morning, {{ userStore.user?.name || "User" }} 🌿
						</h4>
						<p class="text-secondary small mb-0">Here’s your latest financial overview</p>
					</div>
					<div class="d-flex align-items-center gap-2">
						<span class="badge rounded-pill px-3 py-2 small dashboard-date-badge"
							style="background-color: #e8f5ee; color: #2d8a4e">
							{{ today }}
						</span>
					</div>
				</div>

				<!-- Loading -->
				<div v-if="loadingAnalysis" class="card border-0 shadow-sm rounded-4 mb-4">
					<div class="card-body p-4 text-center text-secondary">
						<span class="spinner-border spinner-border-sm me-2"></span>
						Loading your financial data...
					</div>
				</div>

				<!-- Error -->
				<div v-if="analysisError" class="alert alert-danger rounded-4 small mb-4">
					{{ analysisError }}
				</div>

				<!-- Stat Cards -->
				<div class="row g-3 mb-4">
					<div class="col-6 col-sm-6 col-xl-3" v-for="stat in stats" :key="stat.label">
						<div class="card border-0 shadow-sm rounded-4 h-100 page-section-card">
							<div class="card-body p-3">
								<div class="d-flex justify-content-between align-items-start mb-2">
									<span class="small fw-semibold text-secondary">{{ stat.label }}</span>
									<div class="rounded-3 d-flex align-items-center justify-content-center"
										:style="`background-color:${stat.bg}; width:34px; height:34px;`">
										<span v-html="stat.icon"></span>
									</div>
								</div>
								<div class="fs-4 fw-bold text-dark dashboard-stat-value">{{ stat.value }}</div>
								<div class="small mt-1" :class="stat.up ? 'text-success' : 'text-danger'">
									{{ stat.up ? "▲" : "▼" }} {{ stat.change }}
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Insight -->
				<div v-if="analysisAdvice" class="card border-0 shadow-sm rounded-4 mb-4 page-section-card">
					<div class="card-body p-4 page-section-body">
						<div class="d-flex align-items-start gap-3">
							<div class="rounded-3 d-flex align-items-center justify-content-center bg-success bg-opacity-10"
								style="width: 42px; height: 42px">
								<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="#2d8a4e"
									viewBox="0 0 16 16">
									<path
										d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm3.354-9.354-4 4a.5.5 0 0 1-.708 0l-2-2 .708-.708L7 9.293l3.646-3.647.708.708z" />
								</svg>
							</div>
							<div>
								<h6 class="fw-bold text-dark mb-1">Mintly Insight</h6>
								<p class="text-secondary small mb-0">{{ analysisAdvice }}</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Charts -->
				<div class="row g-3 mb-4">
					<!-- Line Chart -->
					<div class="col-12 col-lg-8">
						<div class="card border-0 shadow-sm rounded-4 h-100 page-section-card">
							<div class="card-body p-4 page-section-body">
								<div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3 dashboard-chart-toolbar">
									<h6 class="fw-bold text-dark mb-0">Income vs Expenses Overview</h6>
									<div class="d-flex gap-2 flex-wrap dashboard-periods">
										<button v-for="p in ['Current', 'Goal', 'Balance']" :key="p"
											class="btn btn-sm rounded-3 px-3" :style="activePeriod === p
													? 'background-color:#2d8a4e; color:white;'
													: 'background-color:#f0f0f0; color:#666;'
												" @click="activePeriod = p">
											{{ p }}
										</button>
									</div>
								</div>
								<div class="responsive-chart responsive-chart--tall">
									<canvas ref="lineChart"></canvas>
								</div>
							</div>
						</div>
					</div>

					<!-- Doughnut Chart -->
					<div class="col-12 col-lg-4">
						<div class="card border-0 shadow-sm rounded-4 h-100 page-section-card">
							<div class="card-body p-4 page-section-body">
								<h6 class="fw-bold text-dark mb-3">Expense Breakdown</h6>
								<div class="responsive-chart">
									<canvas ref="doughnutChart"></canvas>
								</div>
								<div class="mt-3">
									<div class="d-flex justify-content-between small text-secondary mb-1"
										v-for="s in sources" :key="s.label">
										<span>
											<span class="me-1" :style="`color:${s.color}`">●</span>{{ s.label }}
										</span>
										<span class="fw-semibold text-dark">{{ s.amount }}</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Bottom row -->
				<div class="row g-3">
					<!-- Bar Chart -->
					<div class="col-12 col-lg-5">
						<div class="card border-0 shadow-sm rounded-4 h-100 page-section-card">
							<div class="card-body p-4 page-section-body">
								<h6 class="fw-bold text-dark mb-3">Budget Snapshot</h6>
								<div class="responsive-chart">
									<canvas ref="barChart"></canvas>
								</div>
							</div>
						</div>
					</div>

					<!-- Expenses Table -->
					<div class="col-12 col-lg-7">
						<div class="card border-0 shadow-sm rounded-4 h-100 page-section-card">
							<div class="card-body p-4 page-section-body">
								<div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
									<h6 class="fw-bold text-dark mb-0">Monthly Expenses</h6>
									<a href="#" class="small text-success text-decoration-none fw-semibold">Latest
										analysis</a>
								</div>
								<div class="table-responsive desktop-table">
									<table class="table table-borderless align-middle small mb-0">
										<thead>
											<tr class="text-secondary">
												<th class="fw-semibold">Category</th>
												<th class="fw-semibold">Amount</th>
												<th class="fw-semibold">Status</th>
												<th class="fw-semibold">Period</th>
											</tr>
										</thead>
										<tbody>
											<tr v-for="tx in transactions" :key="tx.id" class="border-top">
												<td>
													<div class="d-flex align-items-center gap-2">
														<div class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
															:style="`background-color:${tx.color}; width:30px; height:30px; font-size:12px;`">
															{{ tx.name[0] }}
														</div>
														<span class="fw-semibold text-dark">{{ tx.name }}</span>
													</div>
												</td>
												<td class="fw-semibold">{{ tx.amount }}</td>
												<td>
													<span class="badge rounded-pill px-2 py-1" :style="tx.status === 'Normal'
															? 'background:#e8f5ee; color:#2d8a4e;'
															: tx.status === 'High'
																? 'background:#fff8e1; color:#f59e0b;'
																: 'background:#fdecea; color:#e53935;'
														">
														{{ tx.status }}
													</span>
												</td>
												<td class="text-secondary">{{ tx.date }}</td>
											</tr>
										</tbody>
									</table>
								</div>
								<div class="mobile-card-list">
									<div v-for="tx in transactions" :key="`${tx.id}-mobile`" class="dashboard-expense-card">
										<div class="d-flex align-items-center justify-content-between gap-3 mb-3">
											<div class="d-flex align-items-center gap-2 min-w-0">
												<div
													class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
													:style="`background-color:${tx.color}; width:34px; height:34px; font-size:13px;`"
												>
													{{ tx.name[0] }}
												</div>
												<div class="min-w-0">
													<div class="fw-semibold text-dark text-truncate">{{ tx.name }}</div>
													<div class="text-secondary small">{{ tx.date }}</div>
												</div>
											</div>
											<div class="fw-bold text-dark text-end">{{ tx.amount }}</div>
										</div>
										<div>
											<span
												class="badge rounded-pill px-3 py-2"
												:style="tx.status === 'Normal'
													? 'background:#e8f5ee; color:#2d8a4e;'
													: tx.status === 'High'
														? 'background:#fff8e1; color:#f59e0b;'
														: 'background:#fdecea; color:#e53935;'"
											>
												{{ tx.status }}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Empty state -->
				<div v-if="!loadingAnalysis && !hasAnalysis" class="card border-0 shadow-sm rounded-4 mt-4">
					<div class="card-body p-4 text-center">
						<h6 class="fw-bold text-dark mb-2">No analysis data yet</h6>
						<p class="text-secondary small mb-0">
							Complete your budget analysis first to see your real financial dashboard.
						</p>
					</div>
				</div>
		</div>
	</div>
</template>

<script>
import axios from "axios";
import { Chart, registerables } from "chart.js";
import { useUserStore } from "@/stores/userStore";

Chart.register(...registerables);

export default {
	name: "Dashboard",
	setup() {
		const userStore = useUserStore();
		return { userStore };
	},
	data() {
		return {
			activeNav: "Dashboard",
			activePeriod: "Current",
			today: new Date().toLocaleDateString("en-GB", {
				day: "numeric",
				month: "long",
				year: "numeric",
			}),
			loadingAnalysis: false,
			analysisError: "",
			analysisAdvice: "",
			hasAnalysis: false,

			navItems: [
				{
					label: "Dashboard",
					icon: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16"><path d="M8 4a.5.5 0 0 1 .5.5V6a.5.5 0 0 1-1 0V4.5A.5.5 0 0 1 8 4zM3.732 5.732a.5.5 0 0 1 .707 0l.915.914a.5.5 0 1 1-.708.708l-.914-.915a.5.5 0 0 1 0-.707zM2 10a.5.5 0 0 1 .5-.5h1.586a.5.5 0 0 1 0 1H2.5A.5.5 0 0 1 2 10zm9.5 0a.5.5 0 0 1 .5-.5h1.5a.5.5 0 0 1 0 1H12a.5.5 0 0 1-.5-.5zm.754-4.246a.389.389 0 0 0-.527-.02L9.52 7.95A2.51 2.51 0 0 1 10 9.5 2.5 2.5 0 1 1 5 9.5a2.51 2.51 0 0 1 .545-1.557l-1.427-2.35a.385.385 0 0 0-.315-.193.39.39 0 0 0-.34.158l-1.5 2.25a.39.39 0 0 0 .654.436l.938-1.406A3.49 3.49 0 0 0 4.5 9.5 3.5 3.5 0 1 0 11.5 9.5c0-.601-.158-1.162-.428-1.655l1.28-1.108a.39.39 0 0 0 .064-.527z"/></svg>',
				},
				{
					label: "Analysis",
					icon: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16"><path d="M4 11H2v3h2v-3zm5-4H7v7h2V7zm5-5v12h-2V2h2zm-2-1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1h-2zM6 7a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7zm-5 4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-3z"/></svg>',
				},
				{
					label: "Transactions",
					icon: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0V4zm0 2h16v6a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6zm3 3a1 1 0 0 0 0 2h2a1 1 0 0 0 0-2H3z"/></svg>',
				},
				{
					label: "Budget",
					icon: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16"><path d="M0 5a2 2 0 0 1 2-2h12a1 1 0 0 1 1 1v1H0V5zm0 2h15v4a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V7zm12 1a1 1 0 1 0 0 2h1V8h-1z"/></svg>',
				},
				{
					label: "Settings",
					icon: '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="currentColor" viewBox="0 0 16 16"><path d="M8 4.754a3.246 3.246 0 1 0 0 6.492 3.246 3.246 0 0 0 0-6.492zM5.754 8a2.246 2.246 0 1 1 4.492 0 2.246 2.246 0 0 1-4.492 0z"/><path d="M9.796 1.343c-.527-1.79-3.065-1.79-3.592 0l-.094.319a.873.873 0 0 1-1.255.52l-.292-.16c-1.64-.892-3.433.902-2.54 2.541l.159.292a.873.873 0 0 1-.52 1.255l-.319.094c-1.79.527-1.79 3.065 0 3.592l.319.094a.873.873 0 0 1 .52 1.255l-.16.292c-.892 1.64.901 3.434 2.541 2.54l.292-.159a.873.873 0 0 1 1.255.52l.094.319c.527 1.79 3.065 1.79 3.592 0l.094-.319a.873.873 0 0 1 1.255-.52l.292.16c1.64.892 3.433-.902 2.54-2.541l-.159-.292a.873.873 0 0 1 .52-1.255l.319-.094c1.79-.527 1.79-3.065 0-3.592l-.319-.094a.873.873 0 0 1-.52-1.255l.16-.292c.892-1.64-.901-3.433-2.541-2.54l-.292.159a.873.873 0 0 1-1.255-.52l-.094-.319z"/></svg>',
				},
			],

			stats: [
				{
					label: "Monthly Income",
					value: "€0.00",
					change: "Waiting for analysis",
					up: true,
					bg: "#e8f5ee",
					icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#2d8a4e" viewBox="0 0 16 16"><path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4z"/></svg>',
				},
				{
					label: "Total Expenses",
					value: "€0.00",
					change: "Waiting for analysis",
					up: false,
					bg: "#fdecea",
					icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#e53935" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0V4zm0 2h16v6a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6z"/></svg>',
				},
				{
					label: "Savings",
					value: "€0.00",
					change: "Waiting for analysis",
					up: true,
					bg: "#e3f0ff",
					icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#3b82f6" viewBox="0 0 16 16"><path d="M8 0a5.53 5.53 0 0 0-4.473 2.23C2.565 3.477 2 4.962 2 6.5c0 1.386.45 2.788 1.252 4.086.79 1.278 1.907 2.468 3.248 3.414.848.6 1.4 1.223 1.5 1.5.1-.277.652-.9 1.5-1.5 1.341-.946 2.458-2.136 3.248-3.414C13.55 9.288 14 7.886 14 6.5c0-1.538-.565-3.023-1.527-4.27A5.53 5.53 0 0 0 8 0z"/></svg>',
				},
				{
					label: "Remaining Balance",
					value: "€0.00",
					change: "Waiting for analysis",
					up: true,
					bg: "#fff8e1",
					icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f59e0b" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm3.5-8.5a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0v3h3z"/></svg>',
				},
			],

			sources: [
				{ label: "Rent", amount: "€0.00", color: "#2d8a4e" },
				{ label: "Food", amount: "€0.00", color: "#3b82f6" },
				{ label: "Transport", amount: "€0.00", color: "#f59e0b" },
				{ label: "Bills", amount: "€0.00", color: "#e91e63" },
				{ label: "Entertainment", amount: "€0.00", color: "#8b5cf6" },
				{ label: "Other", amount: "€0.00", color: "#14b8a6" },
			],

			transactions: [
				{ id: 1, name: "Rent", amount: "€0.00", status: "Normal", date: "Monthly", color: "#2d8a4e" },
				{ id: 2, name: "Food", amount: "€0.00", status: "Normal", date: "Monthly", color: "#3b82f6" },
				{ id: 3, name: "Transport", amount: "€0.00", status: "Normal", date: "Monthly", color: "#f59e0b" },
				{ id: 4, name: "Bills", amount: "€0.00", status: "Normal", date: "Monthly", color: "#e91e63" },
				{ id: 5, name: "Entertainment", amount: "€0.00", status: "Normal", date: "Monthly", color: "#8b5cf6" },
				{ id: 6, name: "Other Expenses", amount: "€0.00", status: "Normal", date: "Monthly", color: "#14b8a6" },
			],

			lineChartInstance: null,
			barChartInstance: null,
			doughnutChartInstance: null,
		};
	},
	async mounted() {
		await this.userStore.fetchUser();
		this.initCharts();
		await this.loadAnalysisData();
	},
	methods: {
		formatMoney(value) {
			return `€${Number(value || 0).toFixed(2)}`;
		},

		getExpenseStatus(amount, income) {
			const value = Number(amount || 0);
			const totalIncome = Number(income || 0);

			if (!totalIncome) return "Normal";

			const ratio = value / totalIncome;

			if (ratio >= 0.3) return "Critical";
			if (ratio >= 0.15) return "High";
			return "Normal";
		},

		async loadAnalysisData() {
			this.loadingAnalysis = true;
			this.analysisError = "";

			try {
				const response = await axios.get("http://localhost:8080/analysis/latest", {
					withCredentials: true,
				});

				if (response.data.success && response.data.data) {
					const analysis = response.data.data;
					this.hasAnalysis = true;

					this.stats = [
						{
							label: "Monthly Income",
							value: this.formatMoney(analysis.monthly_income),
							change: "Latest analysis",
							up: true,
							bg: "#e8f5ee",
							icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#2d8a4e" viewBox="0 0 16 16"><path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718H4z"/></svg>',
						},
						{
							label: "Total Expenses",
							value: this.formatMoney(analysis.total_expenses),
							change: "Latest analysis",
							up: false,
							bg: "#fdecea",
							icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#e53935" viewBox="0 0 16 16"><path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v1H0V4zm0 2h16v6a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6z"/></svg>',
						},
						{
							label: "Savings",
							value: this.formatMoney(analysis.actual_savings),
							change: "Available to save",
							up: Number(analysis.actual_savings) >= Number(analysis.target_savings || 0),
							bg: "#e3f0ff",
							icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#3b82f6" viewBox="0 0 16 16"><path d="M8 0a5.53 5.53 0 0 0-4.473 2.23C2.565 3.477 2 4.962 2 6.5c0 1.386.45 2.788 1.252 4.086.79 1.278 1.907 2.468 3.248 3.414.848.6 1.4 1.223 1.5 1.5.1-.277.652-.9 1.5-1.5 1.341-.946 2.458-2.136 3.248-3.414C13.55 9.288 14 7.886 14 6.5c0-1.538-.565-3.023-1.527-4.27A5.53 5.53 0 0 0 8 0z"/></svg>',
						},
						{
							label: "Remaining Balance",
							value: this.formatMoney(analysis.remaining_balance),
							change: "After monthly expenses",
							up: Number(analysis.remaining_balance) >= 0,
							bg: "#fff8e1",
							icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#f59e0b" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm3.5-8.5a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3a.5.5 0 0 1 1 0v3h3z"/></svg>',
						},
					];

					this.sources = [
						{ label: "Rent", amount: this.formatMoney(analysis.rent), color: "#2d8a4e" },
						{ label: "Food", amount: this.formatMoney(analysis.food), color: "#3b82f6" },
						{ label: "Transport", amount: this.formatMoney(analysis.transport), color: "#f59e0b" },
						{ label: "Bills", amount: this.formatMoney(analysis.bills), color: "#e91e63" },
						{ label: "Entertainment", amount: this.formatMoney(analysis.entertainment), color: "#8b5cf6" },
						{ label: "Other", amount: this.formatMoney(analysis.other_expenses), color: "#14b8a6" },
					];

					this.transactions = [
						{
							id: 1,
							name: "Rent",
							amount: this.formatMoney(analysis.rent),
							status: this.getExpenseStatus(analysis.rent, analysis.monthly_income),
							date: "Monthly",
							color: "#2d8a4e",
						},
						{
							id: 2,
							name: "Food",
							amount: this.formatMoney(analysis.food),
							status: this.getExpenseStatus(analysis.food, analysis.monthly_income),
							date: "Monthly",
							color: "#3b82f6",
						},
						{
							id: 3,
							name: "Transport",
							amount: this.formatMoney(analysis.transport),
							status: this.getExpenseStatus(analysis.transport, analysis.monthly_income),
							date: "Monthly",
							color: "#f59e0b",
						},
						{
							id: 4,
							name: "Bills",
							amount: this.formatMoney(analysis.bills),
							status: this.getExpenseStatus(analysis.bills, analysis.monthly_income),
							date: "Monthly",
							color: "#e91e63",
						},
						{
							id: 5,
							name: "Entertainment",
							amount: this.formatMoney(analysis.entertainment),
							status: this.getExpenseStatus(analysis.entertainment, analysis.monthly_income),
							date: "Monthly",
							color: "#8b5cf6",
						},
						{
							id: 6,
							name: "Other Expenses",
							amount: this.formatMoney(analysis.other_expenses),
							status: this.getExpenseStatus(analysis.other_expenses, analysis.monthly_income),
							date: "Monthly",
							color: "#14b8a6",
						},
					];

					this.analysisAdvice = analysis.advice || "";
					this.updateCharts(analysis);
				} else {
					this.hasAnalysis = false;
				}
			} catch (error) {
				console.error("Failed to load analysis:", error);
				this.analysisError =
					error.response?.data?.message || "Could not load your latest analysis.";
				this.hasAnalysis = false;
			} finally {
				this.loadingAnalysis = false;
			}
		},

		updateCharts(analysis) {
			if (this.lineChartInstance) {
				this.lineChartInstance.destroy();
				this.lineChartInstance = null;
			}

			if (this.doughnutChartInstance) {
				this.doughnutChartInstance.destroy();
				this.doughnutChartInstance = null;
			}

			if (this.barChartInstance) {
				this.barChartInstance.destroy();
				this.barChartInstance = null;
			}

			// Line chart
			this.lineChartInstance = new Chart(this.$refs.lineChart, {
				type: "line",
				data: {
					labels: ["Income", "Expenses", "Target Savings", "Actual Savings", "Remaining"],
					datasets: [
						{
							label: "Financial Overview",
							data: [
								Number(analysis.monthly_income || 0),
								Number(analysis.total_expenses || 0),
								Number(analysis.target_savings || 0),
								Number(analysis.actual_savings || 0),
								Number(analysis.remaining_balance || 0),
							],
							borderColor: "#2d8a4e",
							backgroundColor: "rgba(45,138,78,0.08)",
							borderWidth: 2.5,
							tension: 0.4,
							fill: true,
							pointBackgroundColor: "#2d8a4e",
							pointRadius: 4,
						},
					],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: { display: false },
					},
					scales: {
						y: {
							grid: { color: "rgba(0,0,0,0.04)" },
							ticks: {
								callback: (v) => "€" + v,
								color: "#999",
								font: { size: 11 },
							},
							border: { display: false },
						},
						x: {
							grid: { display: false },
							ticks: { color: "#999", font: { size: 11 } },
							border: { display: false },
						},
					},
				},
			});

			// Doughnut chart
			this.doughnutChartInstance = new Chart(this.$refs.doughnutChart, {
				type: "doughnut",
				data: {
					labels: ["Rent", "Food", "Transport", "Bills", "Entertainment", "Other"],
					datasets: [
						{
							data: [
								Number(analysis.rent || 0),
								Number(analysis.food || 0),
								Number(analysis.transport || 0),
								Number(analysis.bills || 0),
								Number(analysis.entertainment || 0),
								Number(analysis.other_expenses || 0),
							],
							backgroundColor: ["#2d8a4e", "#3b82f6", "#f59e0b", "#e91e63", "#8b5cf6", "#14b8a6"],
							borderWidth: 0,
							hoverOffset: 6,
						},
					],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					cutout: "72%",
					plugins: {
						legend: { display: false },
					},
				},
			});

			// Bar chart
			this.barChartInstance = new Chart(this.$refs.barChart, {
				type: "bar",
				data: {
					labels: ["Income", "Expenses", "Savings"],
					datasets: [
						{
							label: "Budget",
							data: [
								Number(analysis.monthly_income || 0),
								Number(analysis.total_expenses || 0),
								Number(analysis.actual_savings || 0),
							],
							backgroundColor: "rgba(45,138,78,0.15)",
							borderColor: "#2d8a4e",
							borderWidth: 2,
							borderRadius: 6,
						},
					],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: {
						legend: { display: false },
					},
					scales: {
						y: {
							grid: { color: "rgba(0,0,0,0.04)" },
							ticks: {
								color: "#999",
								font: { size: 11 },
								callback: (v) => "€" + v,
							},
							border: { display: false },
						},
						x: {
							grid: { display: false },
							ticks: { color: "#999", font: { size: 11 } },
							border: { display: false },
						},
					},
				},
			});
		},

		initCharts() {
			this.lineChartInstance = new Chart(this.$refs.lineChart, {
				type: "line",
				data: {
					labels: ["Income", "Expenses", "Target Savings", "Actual Savings", "Remaining"],
					datasets: [
						{
							label: "Financial Overview",
							data: [0, 0, 0, 0, 0],
							borderColor: "#2d8a4e",
							backgroundColor: "rgba(45,138,78,0.08)",
							borderWidth: 2.5,
							tension: 0.4,
							fill: true,
							pointBackgroundColor: "#2d8a4e",
							pointRadius: 4,
						},
					],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: { legend: { display: false } },
					scales: {
						y: {
							grid: { color: "rgba(0,0,0,0.04)" },
							ticks: {
								callback: (v) => "€" + v,
								color: "#999",
								font: { size: 11 },
							},
							border: { display: false },
						},
						x: {
							grid: { display: false },
							ticks: { color: "#999", font: { size: 11 } },
							border: { display: false },
						},
					},
				},
			});

			this.doughnutChartInstance = new Chart(this.$refs.doughnutChart, {
				type: "doughnut",
				data: {
					labels: this.sources.map((s) => s.label),
					datasets: [
						{
							data: [0, 0, 0, 0, 0, 0],
							backgroundColor: this.sources.map((s) => s.color),
							borderWidth: 0,
							hoverOffset: 6,
						},
					],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					cutout: "72%",
					plugins: { legend: { display: false } },
				},
			});

			this.barChartInstance = new Chart(this.$refs.barChart, {
				type: "bar",
				data: {
					labels: ["Income", "Expenses", "Savings"],
					datasets: [
						{
							label: "Budget",
							data: [0, 0, 0],
							backgroundColor: "rgba(45,138,78,0.15)",
							borderColor: "#2d8a4e",
							borderWidth: 2,
							borderRadius: 6,
						},
					],
				},
				options: {
					responsive: true,
					maintainAspectRatio: false,
					plugins: { legend: { display: false } },
					scales: {
						y: {
							grid: { color: "rgba(0,0,0,0.04)" },
							ticks: {
								color: "#999",
								font: { size: 11 },
								callback: (v) => "€" + v,
							},
							border: { display: false },
						},
						x: {
							grid: { display: false },
							ticks: { color: "#999", font: { size: 11 } },
							border: { display: false },
						},
					},
				},
			});
		},
	},
};
</script>

<style scoped>
.dashboard-main {
	padding: 0;
}

.dashboard-date-badge {
	white-space: nowrap;
}

.min-w-0 {
	min-width: 0;
}

.dashboard-expense-card {
	background: #f8faf8;
	border: 1px solid rgba(45, 138, 78, 0.08);
	border-radius: 1rem;
	padding: 1rem;
}

@media (max-width: 767.98px) {
	.dashboard-topbar {
		align-items: flex-start !important;
	}

	.dashboard-stat-value {
		font-size: 1.55rem !important;
	}

	.dashboard-chart-toolbar {
		align-items: stretch !important;
	}

	.dashboard-periods {
		display: grid !important;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		width: 100%;
	}

	.dashboard-periods .btn {
		width: 100%;
		padding-inline: 0.5rem;
	}
}
</style>
