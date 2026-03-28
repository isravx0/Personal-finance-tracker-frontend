<template>
  <div>
    <navbar v-if="userStore.isAuthenticated" />
    <!-- Main content -->
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import { useUserStore } from './stores/userStore'

const userStore = useUserStore()

onMounted(() => {
  userStore.fetchUser()
})
</script>

<style scoped>

</style>
