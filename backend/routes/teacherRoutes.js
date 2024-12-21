/**
 * @swagger
 * tags:
 *   name: Teachers
 *   description: API for teacher-related operations
 */

const express = require('express');
const router = express.Router();
const {
  authenticateToken,
  authorizeRoles,
} = require('../middleware/authMiddleware');
const {
  getAllTeachers,
  getTeacherStudents,
} = require('../controllers/teacherController');

/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Get a list of all teachers
 *     tags: [Teachers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of teachers retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   teacher_id:
 *                     type: integer
 *                     example: 1
 *                   teacher_name:
 *                     type: string
 *                     example: "John Doe"
 *                   email:
 *                     type: string
 *                     example: "johndoe@example.com"
 *       403:
 *         description: Forbidden - Admin access required.
 *       500:
 *         description: Internal server error.
 */
router.get(
  '/teachers',
  authenticateToken,
  authorizeRoles('admin'),
  getAllTeachers
);

/**
 * @swagger
 * /teacher/students:
 *   get:
 *     summary: Get students assigned to a teacher
 *     description: Fetch all students assigned to the logged-in teacher.
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Teachers
 *     responses:
 *       200:
 *         description: A list of students assigned to the teacher
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   student_id:
 *                     type: integer
 *                     description: The ID of the student
 *                     example: 2
 *                   student_name:
 *                     type: string
 *                     description: The name of the student
 *                     example: "Student Two"
 *                   progress_grade:
 *                     type: string
 *                     description: The progress grade of the student
 *                     example: "C"
 *                   final_grade:
 *                     type: string
 *                     description: The final grade of the student
 *                     example: "B"
 *                   finalized:
 *                     type: boolean
 *                     description: Indicates whether the student's grades are finalized
 *                     example: true
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.get(
  '/teacher/students',
  authenticateToken,
  authorizeRoles('teacher'),
  getTeacherStudents
);

module.exports = router;
