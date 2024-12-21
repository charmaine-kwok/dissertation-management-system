import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

import { createApp } from 'vue'; // Import Vue
import App from './App.vue'; // Import the root App component
import router from './router'; // Import the router
import './assets/tailwind.css'; // Import Tailwind CSS

const app = createApp(App);

// Global Navigation Guard for Dynamic Titles
router.beforeEach((to, from, next) => {
  const title = to.meta.title || 'Default Title';
  document.title = `${title} | Dissertation Management System`;
  next();
});

app.use(router).mount('#app');
