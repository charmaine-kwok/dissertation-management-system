<template>
  <DashboardLayout :title="bannerText" :tabs="tabs" />
</template>

<script>
import DashboardLayout from '../layouts/DashboardLayout.vue';

export default {
  name: 'AdminDashboard',
  components: {
    DashboardLayout,
  },
  data() {
    return {
      bannerText: 'Admin Dashboard',
      tabs: [
        {
          name: 'InputStudents',
          label: 'Input Student Lists',
          description: 'Manage the list of students in the system.',
          route: '/admin-dashboard/input-students',
        },
        {
          name: 'AssignTeachers',
          label: 'Assign Students to Teachers',
          description: 'Allocate students to responsible teachers.',
          route: '/admin-dashboard/assign-teachers',
        },
        {
          name: 'StudentStatus',
          label: 'Show Student Status',
          description: 'View the progress and grades of all students.',
          route: '/admin-dashboard/student-status',
        },
      ],
    };
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
