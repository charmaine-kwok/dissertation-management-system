<template>
  <DashboardLayout :title="bannerText" :tabs="tabs" />
</template>

<script>
import DashboardLayout from '../layouts/DashboardLayout.vue';

export default {
  name: 'TeacherDashboard',
  components: {
    DashboardLayout,
  },
  data() {
    return {
      bannerText: 'Teacher Dashboard',
      tabs: [
        {
          name: 'ViewStudents',
          label: 'View Student List',
          description: 'See the students assigned to you and manage grades.',
          route: '/teacher-dashboard/view-students',
        },
      ],
    };
  },
};
</script>
