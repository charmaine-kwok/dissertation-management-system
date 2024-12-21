<template>
  <div class="min-h-screen bg-gray-100">
    <h2 class="text-xl font-bold mb-4">Students Assigned to You</h2>

    <!-- Search Bar -->
    <div class="mb-4">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by Student ID or Name"
        class="border rounded w-full px-4 py-2"
      />
    </div>

    <!-- Students List -->
    <div class="bg-white p-6 rounded shadow-md">
      <table class="w-full border-collapse border border-gray-200">
        <thead>
          <tr class="bg-gray-100">
            <th class="border border-gray-300 px-4 py-2">Student ID</th>
            <th class="border border-gray-300 px-4 py-2">Name</th>
            <th class="border border-gray-300 px-4 py-2">Progress Grade</th>
            <th class="border border-gray-300 px-4 py-2">Final Grade</th>
            <th class="border border-gray-300 px-4 py-2">Status</th>
            <th class="border border-gray-300 px-4 py-2 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="student in filteredStudents"
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
              {{ student.progress_grade || 'N/A' }}
            </td>
            <td class="border border-gray-300 px-4 py-2">
              {{ student.final_grade || 'N/A' }}
            </td>
            <td class="border border-gray-300 px-4 py-2">
              {{ student.finalized ? 'Finalized' : 'In Progress' }}
            </td>
            <td class="border border-gray-300 px-4 py-2 text-center">
              <div class="flex justify-center space-x-2">
                <button
                  @click="openGradeModal(student)"
                  :disabled="student.finalized"
                  class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                  Change Grade
                </button>
                <button
                  @click="finalizeStudent(student)"
                  :disabled="
                    student.finalized ||
                    !student.progress_grade ||
                    !student.final_grade
                  "
                  class="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 disabled:bg-gray-400"
                >
                  Submit
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Grade Modal -->
    <div
      v-if="showGradeModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded shadow-md w-96">
        <h3 class="text-lg font-semibold mb-4">
          Update Grades for {{ selectedStudent.student_name }}
        </h3>
        <div class="mb-4">
          <label
            for="progressGrade"
            class="block text-sm font-medium text-gray-700"
            >Progress Grade</label
          >
          <select
            id="progressGrade"
            v-model="progressGrade"
            class="w-full border border-gray-300 rounded-md"
          >
            <option disabled value="">Select Grade</option>
            <option>A+</option>
            <option>A</option>
            <option>A-</option>
            <option>B+</option>
            <option>B</option>
            <option>B-</option>
            <option>C+</option>
            <option>C</option>
            <option>C-</option>
            <option>D</option>
            <option>F</option>
          </select>
        </div>
        <div class="mb-4">
          <label
            for="finalGrade"
            class="block text-sm font-medium text-gray-700"
            >Final Grade</label
          >
          <select
            id="finalGrade"
            v-model="finalGrade"
            class="w-full border border-gray-300 rounded-md"
          >
            <option disabled value="">Select Grade</option>
            <option>A+</option>
            <option>A</option>
            <option>A-</option>
            <option>B+</option>
            <option>B</option>
            <option>B-</option>
            <option>C+</option>
            <option>C</option>
            <option>C-</option>
            <option>D</option>
            <option>F</option>
          </select>
        </div>
        <div class="flex justify-end">
          <button
            @click="closeGradeModal"
            class="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            @click="saveGrades"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>

    <!-- Confirmation Modal -->
    <div
      v-if="showConfirmationModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded shadow-md w-80 text-center">
        <h3 class="text-lg font-semibold mb-4 text-green-600">
          Grades Saved Successfully!
        </h3>
        <p>The student's grades have been saved successfully.</p>
        <button
          @click="closeConfirmationModal"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
        >
          Close
        </button>
      </div>
    </div>

    <!-- Popup for Successful Finalization -->
    <div
      v-if="showFinalizedModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
    >
      <div class="bg-white p-6 rounded shadow-md w-80 text-center">
        <h3 class="text-lg font-semibold mb-4 text-green-600">
          Successfully Finalized!
        </h3>
        <p>The student's grades have been submitted successfully.</p>
        <button
          @click="closeFinalizedModal"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      students: [],
      searchQuery: '',
      showGradeModal: false,
      showConfirmationModal: false,
      showFinalizedModal: false,
      selectedStudent: null,
      progressGrade: null,
      finalGrade: null,
    };
  },
  computed: {
    filteredStudents() {
      const query = this.searchQuery.toLowerCase();
      return this.students.filter(
        (student) =>
          student.student_name.toLowerCase().includes(query) ||
          student.student_id.toString().includes(query)
      );
    },
  },
  methods: {
    async fetchStudents() {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:3000/teacher/students',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      this.students = response.data;
    },
    openGradeModal(student) {
      this.selectedStudent = student;
      this.progressGrade = student.progress_grade || '';
      this.finalGrade = student.final_grade || '';
      this.showGradeModal = true;
    },
    closeGradeModal() {
      this.showGradeModal = false;
    },
    closeConfirmationModal() {
      this.showConfirmationModal = false;
    },
    closeFinalizedModal() {
      this.showFinalizedModal = false;
    },
    async saveGrades() {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3000/students/${this.selectedStudent.student_id}`,
        {
          progressGrade: this.progressGrade,
          finalGrade: this.finalGrade,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      this.closeGradeModal();
      this.showConfirmationModal = true;
      this.fetchStudents(); // Refresh student list
    },
    async finalizeStudent(student) {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3000/students/${student.student_id}/finalize`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      this.showFinalizedModal = true;
      this.fetchStudents(); // Refresh student list
    },
  },
  mounted() {
    this.fetchStudents();
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
.flex.space-x-2 > * + * {
  margin-left: 0.5rem;
}
</style>
