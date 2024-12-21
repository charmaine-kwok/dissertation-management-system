<template>
  <div class="container mx-auto py-6">
    <h2 class="text-2xl font-bold mb-4">Student Status</h2>

    <!-- Search Bar -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by Student Name, Teacher Name, or Student ID"
        class="border rounded w-full px-4 py-2 mb-4"
      />
    </div>

    <!-- Filter Buttons -->
    <div class="mb-4 flex space-x-4">
      <button
        @click="filterBy('all')"
        :class="[
          'px-4 py-2 rounded',
          filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200',
        ]"
      >
        Show All
      </button>
      <button
        @click="filterBy('in-progress')"
        :class="[
          'px-4 py-2 rounded',
          filter === 'in-progress' ? 'bg-blue-500 text-white' : 'bg-gray-200',
        ]"
      >
        Show In Progress
      </button>
      <button
        @click="filterBy('finalized')"
        :class="[
          'px-4 py-2 rounded',
          filter === 'finalized' ? 'bg-blue-500 text-white' : 'bg-gray-200',
        ]"
      >
        Show Finalized
      </button>
    </div>

    <table class="w-full border-collapse border border-gray-200">
      <thead>
        <tr class="bg-gray-100">
          <th class="border border-gray-300 px-4 py-2">Student ID</th>
          <th class="border border-gray-300 px-4 py-2">Student Name</th>
          <th class="border border-gray-300 px-4 py-2">Teacher</th>
          <th class="border border-gray-300 px-4 py-2">Progress Grade</th>
          <th class="border border-gray-300 px-4 py-2">Final Grade</th>
          <th class="border border-gray-300 px-4 py-2">Status</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="student in filteredAndSearchedStudents"
          :key="student.student_id"
          class="odd:bg-white even:bg-gray-50"
        >
          <td class="border border-gray-300 px-4 py-2">
            {{ student.student_id }}
          </td>
          <td class="border border-gray-300 px-4 py-2">
            {{ student.student_name }}
          </td>
          <td class="border border-gray-300 px-4 py-2">
            {{ student.teacherName || 'Unassigned' }}
          </td>
          <td class="border border-gray-300 px-4 py-2">
            {{ student.progress_grade || 'N/A' }}
          </td>
          <td class="border border-gray-300 px-4 py-2">
            {{ student.final_grade || 'N/A' }}
          </td>
          <td class="border border-gray-300 px-4 py-2">
            {{ student.finalized ? 'Finalized' : 'In Progress' }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'StudentStatusPage',
  data() {
    return {
      students: [],
      filter: 'all', // Default filter
      searchQuery: '', // Search query
    };
  },
  computed: {
    filteredAndSearchedStudents() {
      // Apply filter
      let filtered = [];
      if (this.filter === 'finalized') {
        filtered = this.students.filter((student) => student.finalized);
      } else if (this.filter === 'in-progress') {
        filtered = this.students.filter((student) => !student.finalized);
      } else {
        filtered = this.students;
      }

      // Apply search
      return filtered.filter((student) => {
        const query = this.searchQuery.toLowerCase();
        return (
          student.student_id.toString().includes(this.searchQuery) ||
          (student.student_name &&
            student.student_name.toLowerCase().includes(query)) ||
          (student.teacherName &&
            student.teacherName.toLowerCase().includes(query))
        );
      });
    },
  },
  methods: {
    async fetchStudentStatuses() {
      try {
        const token = localStorage.getItem('token'); // Retrieve token for authorization
        const response = await axios.get('http://localhost:3000/students', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Map teacher ID to teacher name
        this.students = response.data.map((student) => ({
          ...student,
          teacherName: student.teacher_name || null, // Backend should return teacher_name
        }));
      } catch (error) {
        console.error('Error fetching student statuses:', error);
      }
    },
    filterBy(status) {
      this.filter = status;
    },
  },
  mounted() {
    this.fetchStudentStatuses();
  },
};
</script>

<style>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
button {
  transition: all 0.3s;
}
</style>
