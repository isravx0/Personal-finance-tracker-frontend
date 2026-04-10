<template>
	<nav class="navbar navbar-expand-lg bg-white shadow-sm px-3 px-lg-4 py-2 mb-1 mintly-navbar">
		<!-- Brand -->
		<router-link class="navbar-brand d-flex align-items-center gap-2 text-decoration-none mintly-navbar__brand" to="/view/app/dashboard">
			<div class="d-flex align-items-center justify-content-center mintly-navbar__logo-wrap">
				<img src="/public/images/logo-1.png" alt="Logo" class="mintly-navbar__logo">
	  		</div>
		</router-link>

		<!-- Toggler -->
		<button class="navbar-toggler border-0 shadow-none" type="button" @click="menuOpen = !menuOpen">
			<span class="navbar-toggler-icon"></span>
		</button>

		<!-- Collapsible -->
		<div class="navbar-collapse mintly-navbar__collapse" :class="menuOpen ? 'show' : 'collapse'">
	 		<!-- Center Links -->
			<ul class="navbar-nav mx-auto gap-1 my-3 my-lg-0 mintly-navbar__links">
				<li class="nav-item" v-for="item in navLinks" :key="item.route">
					<router-link
						:to="item.route"
						class="nav-link px-3 py-2 rounded-3 small fw-semibold mintly-navbar__link"
						:class="$route.path === item.route ? 'text-white mintly-navbar__link--active' : 'text-secondary'"
						@click="closeMenus"
					>
					{{ item.label }}
					</router-link>
				</li>
			</ul>

			<!-- Right Side -->
			<div class="d-flex align-items-center gap-2 mt-3 mt-lg-0 position-relative mintly-navbar__actions">

				<!-- Profile -->
				<div class="position-relative w-100 w-lg-auto">
					<button class="btn p-0 border-0 d-flex align-items-center gap-2 mintly-navbar__profile-button" @click="toggleProfile">
						<div class="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold" style="width:36px;height:36px;background-color:#2d8a4e;font-size:13px;">
							{{ userStore.user?.name ? userStore.user.name.charAt(0).toUpperCase() : 'U' }}
						</div>
						<span class="small fw-semibold text-dark mintly-navbar__profile-name">{{ userStore.user?.name || 'User' }}</span>
						<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#999" viewBox="0 0 16 16" class="mintly-navbar__profile-caret">
							<path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
						</svg>
				</button>

				<div v-if="showProfile" class="position-absolute end-0 mt-2 bg-white rounded-4 shadow py-2 mintly-navbar__dropdown" style="width:220px; z-index:1000;">
						<div class="px-3 py-2 border-bottom mb-1">
							<div class="small fw-bold text-dark">{{ userStore.user?.name || 'User' }}</div>
							<div class="text-secondary" style="font-size:11px;">{{ userStore.user?.email || 'user@mintly.com' }}</div>
						</div>

						<a href="#" class="dropdown-item small py-2 px-3 text-secondary d-flex align-items-center gap-2" v-for="opt in profileOptions" :key="opt.label" @click.prevent="handleProfileOption(opt.label)">
							<span v-html="opt.icon"></span>
							{{ opt.label }}
						</a>

						<div class="border-top mt-1 pt-1">
			  				<a href="/view/public/login" class="dropdown-item small py-2 px-3 d-flex align-items-center gap-2" style="color:#e53935;" @click.prevent="signOut">
								<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16">
									<path fill-rule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
				  					<path fill-rule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
								</svg>
								Sign out
							</a>
						</div>
		  			</div>
				</div>
	  		</div>
		</div>
	</nav>
</template>

<script>
import axios from 'axios'
import { useUserStore } from '../stores/userStore'

export default {
	name: 'Navbar',
  	data() {
		return {
			menuOpen: false,
			showProfile: false,
			searchQuery: '',
			navLinks: [
				{
					label: 'Dashboard',
					route: '/view/app/dashboard'
				},
				{
					label: 'Financial Analysis',
					route: '/view/app/financial-analysis'
				},
				{
					label: 'History',
					route: '/view/app/history'
				}
			],
			profileOptions: [
				{
					label: 'My Profile',
					route: '/view/app/profile',
					icon: '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4z"/></svg>'
				},
			]
		}
	},
	computed: {
		userStore() {
			return useUserStore()
		}
	},
	methods: {
		toggleProfile() {
			this.showProfile = !this.showProfile
		},
		closeMenus() {
			this.menuOpen = false
			this.showProfile = false
		},
		handleProfileOption(option) {
			this.closeMenus()
			if (option === 'My Profile') {
				this.$router.push('/view/app/profile')
			}
		},

		async signOut() {
			this.submitted = true
			this.errorMsg = ''
			this.loading = true
			try {
				const response = await axios.post(
					'http://localhost:8080/user/logout',
					{},
					{
						withCredentials: true
					}
				)
				if (response.data.success) {
					// remove user in Pinia
					this.userStore.clearUser()
					// Redirect to login page
					this.closeMenus()
					this.$router.push('/view/public/login')
				} else {
					this.errorMsg = response.data.message
				}
			} catch (error) {
				this.errorMsg = 'An error occurred. Please try again.'
			} finally {
				this.loading = false
			}
		}
	},
	mounted() {
		// Fetch user from session
		this.userStore.fetchUser();
	},
}
</script>

<style scoped>
.mintly-navbar {
	position: sticky;
	top: 0;
	z-index: 1000;
}

.mintly-navbar__brand {
	min-width: 0;
}

.mintly-navbar__logo-wrap {
	width: 150px;
	height: 70px;
}

.mintly-navbar__logo {
	width: 100%;
	height: auto;
	max-height: 100%;
	object-fit: contain;
}

.mintly-navbar__link--active {
	background-color: #2d8a4e;
}

.mintly-navbar__profile-name {
	display: none;
	max-width: 10rem;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.mintly-navbar__profile-caret {
	display: none;
}

@media (min-width: 576px) {
	.mintly-navbar__profile-name,
	.mintly-navbar__profile-caret {
		display: inline-block;
	}
}

@media (max-width: 991.98px) {
	.mintly-navbar__logo-wrap {
		width: 120px;
		height: 56px;
	}

	.mintly-navbar__collapse {
		padding-top: 0.75rem;
	}

	.mintly-navbar__links,
	.mintly-navbar__actions {
		width: 100%;
	}

	.mintly-navbar__link {
		padding: 0.85rem 1rem !important;
	}

	.mintly-navbar__profile-button {
		width: 100%;
		justify-content: space-between;
		padding: 0.85rem 1rem !important;
		background: #f6f8f6;
		border-radius: 1rem;
	}

	.mintly-navbar__profile-name,
	.mintly-navbar__profile-caret {
		display: inline-block;
	}

	.mintly-navbar__profile-name {
		flex: 1;
		text-align: left;
	}

	.mintly-navbar__dropdown {
		position: static !important;
		width: 100% !important;
		margin-top: 0.75rem !important;
	}
}
</style>
