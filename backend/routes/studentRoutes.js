/**
 * @swagger
 * tags:
 *   name: Students
 *   description: API for managing students
 */

const express = require('express');
const {
  getStudents,
  assignTeacher,
  addStudent,
  updateGrades,
  finalizeStudent,
} = require('../controllers/studentController');
const {
  authenticateToken,
  authorizeRoles,
} = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /students:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all students.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   student_id:
 *                     type: integer
 *                     description: The ID of the student.
 *                     example: 1
 *                   student_name:
 *                     type: string
 *                     description: The name of the student.
 *                     example: "Student One"
 *                   teacher_id:
 *                     type: integer
 *                     description: The ID of the teacher assigned to the student.
 *                     example: 1
 *                   teacher_name:
 *                     type: string
 *                     description: The name of the teacher assigned to the student.
 *                     example: "Teacher One"
 *                   progress_grade:
 *                     type: string
 *                     description: The progress grade of the student.
 *                     example: "A"
 *                   final_grade:
 *                     type: string
 *                     description: The final grade of the student.
 *                     example: "B+"
 *                   finalized:
 *                     type: boolean
 *                     description: Whether the student's record is finalized.
 *                     example: false
 *       401:
 *         description: Unauthorized access.
 *       403:
 *         description: Forbidden, insufficient role.
 */
router.get(
  '/students',
  authenticateToken,
  authorizeRoles('admin'),
  getStudents
);

/**
 * @swagger
 * /students/assign-teacher:
 *   post:
 *     summary: Assign a teacher to a student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Student and teacher assignment data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studentId:
 *                 type: integer
 *               teacherId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Teacher assigned successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized access.
 *       403:
 *         description: Forbidden, insufficient role.
 */
router.post(
  '/students/assign-teacher',
  authenticateToken,
  authorizeRoles('admin'),
  assignTeacher
);

/**
 * @swagger
 * /students:
 *   post:
 *     summary: Add a new student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Student data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               teacherId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Student added successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized access.
 *       403:
 *         description: Forbidden, insufficient role.
 */
router.post(
  '/students',
  authenticateToken,
  authorizeRoles('admin'),
  addStudent
);

/**
 * @swagger
 * /students/{id}:
 *   put:
 *     summary: Update student grades
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Student ID
 *     requestBody:
 *       description: Grades data
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               progressGrade:
 *                 type: string
 *               finalGrade:
 *                 type: string
 *     responses:
 *       200:
 *         description: Grades updated successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized access.
 *       403:
 *         description: Forbidden, insufficient role.
 */
router.put(
  '/students/:id',
  authenticateToken,
  authorizeRoles('teacher'),
  updateGrades
);

/**
 * @swagger
 * /students/{id}/finalize:
 *   put:
 *     summary: Finalize a student's record
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Student ID
 *     responses:
 *       200:
 *         description: Student record finalized successfully.
 *       400:
 *         description: Bad request.
 *       401:
 *         description: Unauthorized access.
 *       403:
 *         description: Forbidden, insufficient role.
 */
router.put(
  '/students/:id/finalize',
  authenticateToken,
  authorizeRoles('teacher'),
  finalizeStudent
);

module.exports = router;
