<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Banner Section -->
    <header
      class="bg-blue-500 text-white py-4 flex items-center justify-center relative"
    >
      <h1 class="text-3xl font-bold">{{ title }}</h1>
      <button
        @click="logout"
        class="absolute right-6 bg-red-500 px-4 py-2 rounded text-white hover:bg-red-600 font-bold"
      >
        Logout
      </button>
    </header>

    <!-- Dynamic Tabs -->
    <div class="bg-white shadow-lg py-10">
      <div
        class="container mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center"
      >
        <div
          v-for="tab in tabs"
          :key="tab.name"
          @click="navigateTo(tab.route)"
          :class="[
            'cursor-pointer p-6 rounded-lg shadow transition',
            isActiveTab(tab.route)
              ? 'bg-blue-500 text-white'
              : 'bg-gray-100 hover:bg-gray-200',
          ]"
        >
          <h2 class="text-xl font-bold mb-4">{{ tab.label }}</h2>
          <p>{{ tab.description }}</p>
        </div>
      </div>
    </div>

    <!-- Dynamic Content -->
    <div class="container mx-auto py-6">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DashboardLayout',
  props: {
    title: {
      type: String,
      required: true,
    },
    tabs: {
      type: Array,
      required: true,
    },
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route);
    },
    isActiveTab(route) {
      return this.$route.path === route;
    },
    logout() {
      // Clear the token and user data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Redirect to the login page
      this.$router.push('/');
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
