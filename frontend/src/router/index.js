import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../components/Auth/LoginPage.vue';
import AdminDashboard from '../components/Admin/AdminDashboard.vue';
import InputStudentsPage from '../components/Admin/InputStudentsPage.vue';
import AssignTeachersPage from '../components/Admin/AssignTeachersPage.vue';
import StudentStatusPage from '../components/Admin/StudentStatusPage.vue';
import TeacherDashboard from '../components/Teacher/TeacherDashboard.vue';
import ViewStudentsPage from '../components/Teacher/ViewStudentsPage.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage,
    meta: { title: 'Login' },
  },
  {
    path: '/admin-dashboard',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { title: 'Admin Dashboard' },
    children: [
      {
        path: 'input-students',
        name: 'InputStudents',
        component: InputStudentsPage,
        meta: { title: 'Input Students' },
      },
      {
        path: 'assign-teachers',
        name: 'AssignTeachers',
        component: AssignTeachersPage,
        meta: { title: 'Assign Teachers' },
      },
      {
        path: 'student-status',
        name: 'StudentStatus',
        component: StudentStatusPage,
        meta: { title: 'Student Status' },
      },
    ],
  },
  {
    path: '/teacher-dashboard',
    name: 'TeacherDashboard',
    component: TeacherDashboard,
    meta: { title: 'Teacher Dashboard' },
    children: [
      {
        path: 'view-students',
        name: 'ViewStudents',
        component: ViewStudentsPage,
        meta: { title: 'View Students' },
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Global Navigation Guard for Dynamic Titles
router.beforeEach((to, from, next) => {
  const title = to.meta.title || 'Default Title';
  document.title = `${title} | Dissertation Management System`;
  next();
});

export default router;
