<template>
  <div class="container mx-auto py-6">
    <h2 class="text-xl font-semibold mb-4">Add a New Student</h2>

    <div class="bg-white p-6 rounded shadow-md w-2/3 mx-auto">
      <form @submit.prevent="addStudent">
        <div class="mb-4">
          <label
            for="studentName"
            class="block text-sm font-medium text-gray-700 text-left"
            >Student Name</label
          >
          <input
            id="studentName"
            v-model="studentName"
            type="text"
            placeholder="Enter Student Name"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div class="mb-4">
          <label
            for="studentEmail"
            class="block text-sm font-medium text-gray-700 text-left"
            >Student Email</label
          >
          <input
            id="studentEmail"
            v-model="studentEmail"
            type="email"
            placeholder="Enter Student Email"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>
        <div class="mb-4">
          <label
            for="assignTeacher"
            class="block text-sm font-medium text-gray-700 text-left"
            >Assign Teacher</label
          >
          <select
            id="assignTeacher"
            v-model="teacherId"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <!-- Placeholder option -->
            <option disabled value="">Select a Teacher</option>

            <!-- Dynamic teacher options -->
            <option
              v-for="teacher in teachers"
              :key="teacher.teacher_id"
              :value="teacher.teacher_id"
            >
              {{ teacher.teacher_name }}
            </option>
          </select>
        </div>
        <div class="mb-4">
          <label
            for="progressGrade"
            class="block text-sm font-medium text-gray-700 text-left"
          >
            Progress Grade
          </label>
          <select
            id="progressGrade"
            v-model="progressGrade"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="" disabled>Select a Grade</option>
            <option v-for="grade in grades" :key="grade" :value="grade">
              {{ grade }}
            </option>
          </select>
        </div>

        <div class="mb-4">
          <label
            for="finalGrade"
            class="block text-sm font-medium text-gray-700 text-left"
          >
            Final Grade
          </label>
          <select
            id="finalGrade"
            v-model="finalGrade"
            class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="" disabled>Select a Grade</option>
            <option v-for="grade in grades" :key="grade" :value="grade">
              {{ grade }}
            </option>
          </select>
        </div>

        <button
          type="submit"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Student
        </button>
      </form>
      <p v-if="message" class="mt-4 text-green-500">{{ message }}</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'InputStudentsPage',
  data() {
    return {
      studentName: '',
      studentEmail: '',
      teacherId: null,
      progressGrade: '',
      finalGrade: '',
      message: null,
      teachers: [],
      grades: [
        'A+',
        'A',
        'A-',
        'B+',
        'B',
        'B-',
        'C+',
        'C',
        'C-',
        'D+',
        'D',
        'D-',
        'F',
      ],
    };
  },
  methods: {
    async fetchTeachers() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/teachers', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.teachers = response.data;
      } catch (error) {
        console.error('Error fetching teachers:', error);
      }
    },
    async addStudent() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.post(
          'http://localhost:3000/students',
          {
            name: this.studentName,
            email: this.studentEmail,
            teacherId: this.teacherId || null,
            progressGrade: this.progressGrade || null,
            finalGrade: this.finalGrade || null,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.message = response.data.message;
        this.studentName = '';
        this.studentEmail = '';
        this.teacherId = null;
        this.progressGrade = '';
        this.finalGrade = '';
      } catch (error) {
        console.error('Error adding student:', error);
        this.message = 'Failed to add student.';
      }
    },
  },
  mounted() {
    this.fetchTeachers();
  },
};
</script>

<style scoped>
.container {
  max-width: 600px; /* Adjusted for narrower form */
  margin: 0 auto;
}
</style>
