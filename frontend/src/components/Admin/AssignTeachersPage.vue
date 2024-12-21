<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Content Section -->
    <div class="container mx-auto py-6">
      <h2 class="text-xl font-semibold mb-4">Manage Assignments</h2>

      <!-- Search Bar -->
      <div class="relative mb-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by Student Name, ID, or Teacher Name"
          class="w-full border rounded px-4 py-2"
        />
      </div>

      <!-- Filter Buttons -->
      <div class="mb-4 flex space-x-4">
        <button
          @click="showAllStudents"
          :class="[
            'px-4 py-2 rounded',
            filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200',
          ]"
        >
          Show All Students
        </button>
        <button
          @click="filterUnassigned"
          :class="[
            'px-4 py-2 rounded',
            filter === 'unassigned' ? 'bg-blue-500 text-white' : 'bg-gray-200',
          ]"
        >
          Show Unassigned Students
        </button>
        <button
          @click="filterAssigned"
          :class="[
            'px-4 py-2 rounded',
            filter === 'assigned' ? 'bg-blue-500 text-white' : 'bg-gray-200',
          ]"
        >
          Show Assigned Students
        </button>
      </div>

      <!-- Students List -->
      <div class="bg-white p-6 rounded shadow-md">
        <h3 class="text-lg font-semibold mb-4">Students</h3>
        <table class="w-full border-collapse border border-gray-200">
          <thead>
            <tr class="bg-gray-100">
              <th class="border border-gray-300 px-4 py-2">Student ID</th>
              <th class="border border-gray-300 px-4 py-2">Name</th>
              <th class="border border-gray-300 px-4 py-2">Assigned Teacher</th>
              <th class="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="student in filteredStudents"
              :key="student.id"
              class="odd:bg-white even:bg-gray-50"
            >
              <td class="border border-gray-300 px-4 py-2">
                {{ student.student_id }}
              </td>
              <td class="border border-gray-300 px-4 py-2">
                {{ student.student_name }}
              </td>
              <td class="border border-gray-300 px-4 py-2">
                {{ student.teacher_name || 'Unassigned' }}
              </td>
              <td class="border border-gray-300 px-4 py-2">
                <button
                  @click="openAssignPopup(student)"
                  class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Assign Teacher
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Popup Modal -->
    <div
      v-if="showPopup"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded shadow-md w-96">
        <h3 class="text-lg font-semibold mb-4">
          Assign Teacher to {{ selectedStudent.student_name }}
        </h3>
        <select
          v-model="selectedTeacherId"
          class="w-full border border-gray-300 rounded-md mb-4"
        >
          <option disabled value="">Select a Teacher</option>
          <option
            v-for="teacher in teachers"
            :value="teacher.teacher_id"
            :key="teacher.teacher_id"
          >
            {{ teacher.teacher_name }}
          </option>
        </select>

        <div class="flex justify-end">
          <button
            @click="closePopup"
            class="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            @click="assignTeacher"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div
      v-if="showConfirmationPopup"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded shadow-md w-80 text-center">
        <h3 class="text-lg font-semibold mb-4 text-green-600">
          Assignment Saved!
        </h3>
        <button
          @click="closeConfirmationPopup"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'AssignTeachers',
  data() {
    return {
      students: [],
      teachers: [],
      searchQuery: '', // For search functionality
      showPopup: false,
      showConfirmationPopup: false,
      selectedStudent: null,
      selectedTeacherId: null,
      filter: 'all',
    };
  },
  computed: {
    filteredStudents() {
      // Filter students based on search query and filter criteria
      const query = this.searchQuery.toLowerCase();
      let students = this.students;

      if (this.filter === 'unassigned') {
        students = students.filter((student) => !student.teacher_name);
      } else if (this.filter === 'assigned') {
        students = students.filter((student) => student.teacher_name);
      }

      if (!query) return students;

      return students.filter(
        (student) =>
          student.student_name.toLowerCase().includes(query) ||
          student.student_id.toString().includes(query) ||
          (student.teacher_name &&
            student.teacher_name.toLowerCase().includes(query))
      );
    },
  },
  methods: {
    async fetchStudents() {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3000/students', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        this.students = response.data.map((student) => ({
          ...student,
          teacher_name: student.teacher_name || 'Unassigned', // Default value if no teacher assigned
        }));
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    },
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
    showAllStudents() {
      this.filter = 'all';
    },
    filterUnassigned() {
      this.filter = 'unassigned';
    },
    filterAssigned() {
      this.filter = 'assigned';
    },
    openAssignPopup(student) {
      this.selectedStudent = student;
      this.showPopup = true;
    },
    closePopup() {
      this.showPopup = false;
      this.selectedStudent = null;
      this.selectedTeacherId = null;
    },
    closeConfirmationPopup() {
      this.showConfirmationPopup = false; // Close the confirmation modal
      this.fetchStudents(); // Refresh students after confirmation
    },
    async assignTeacher() {
      try {
        const token = localStorage.getItem('token');
        await axios.post(
          'http://localhost:3000/students/assign-teacher',
          {
            studentId: this.selectedStudent.student_id,
            teacherId: this.selectedTeacherId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.closePopup(); // Close the assignment modal
        this.showConfirmationPopup = true; // Show confirmation modal
      } catch (error) {
        console.error('Error assigning teacher:', error);
      }
    },
  },
  mounted() {
    this.fetchStudents();
    this.fetchTeachers();
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}
button {
  transition: all 0.3s;
}
</style>
