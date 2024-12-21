<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Banner Section -->
    <header class="bg-blue-500 text-white py-4">
      <h1 class="text-center text-3xl font-bold">
        Computer Science Dissertation Management Platform
      </h1>
    </header>

    <!-- Login Section -->
    <div class="flex items-center justify-center h-[calc(100vh-64px)]">
      <form @submit.prevent="login" class="bg-white p-8 rounded shadow-md w-96">
        <h2 class="text-2xl font-bold mb-6">Login</h2>
        <input
          v-model="email"
          type="text"
          placeholder="Email"
          class="border rounded w-full px-4 py-2 mb-4"
        />
        <div class="relative">
          <input
            :type="showPassword ? 'text' : 'password'"
            v-model="password"
            placeholder="Password"
            class="border rounded w-full px-4 py-2 mb-4 pr-12"
          />
          <button
            type="button"
            @click="togglePasswordVisibility"
            class="absolute inset-y-0 right-2 flex items-center justify-center text-gray-500 hover:text-blue-500 focus:outline-none"
          >
            <span v-if="showPassword">
              <i class="fas fa-eye" aria-hidden="true"></i>
            </span>
            <span v-else>
              <i class="fas fa-eye-slash" aria-hidden="true"></i>
            </span>
          </button>
        </div>

        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 w-full rounded hover:bg-blue-600"
        >
          Login
        </button>
        <p v-if="error" class="text-red-500 mt-4">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      showPassword: false,
      error: null,
    };
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async login() {
      try {
        const response = await axios.post('http://localhost:3000/login', {
          email: this.email,
          password: this.password,
        });

        // Store the token in localStorage
        localStorage.setItem('token', response.data.token);

        // Redirect based on role
        if (response.data.role === 'teacher') {
          this.$router.push('/teacher-dashboard');
        } else if (response.data.role === 'admin') {
          this.$router.push('/admin-dashboard');
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'An error occurred.';
      }
    },
  },
};
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

button {
  background: none;
  border: none;
  cursor: pointer;
}
</style>
