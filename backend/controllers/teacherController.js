const db = require('../database/db');

// Fetch all teachers
const getAllTeachers = (req, res) => {
  const query = `
        SELECT 
          teachers.id AS teacher_id,
          users.name AS teacher_name,
          users.email AS email
        FROM teachers
        INNER JOIN users ON teachers.user_id = users.id;
      `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching teachers:', err);
      return res.status(500).send({ message: 'Internal server error' });
    }
    res.send(rows);
  });
};

const getTeacherStudents = (req, res) => {
  const userId = req.user.id; // Extract `id` from the authenticated user's JWT

  // Step 1: Retrieve the teacher's ID from the `teachers` table
  const getTeacherIdQuery = `SELECT id FROM teachers WHERE user_id = ?`;

  db.get(getTeacherIdQuery, [userId], (err, teacher) => {
    if (err) {
      console.error('Database error while retrieving teacher ID:', err);
      return res.status(500).send({ message: 'Internal server error' });
    }

    if (!teacher) {
      console.warn(`No teacher found for user ID: ${userId}`);
      return res.status(404).send({ message: 'Teacher not found' });
    }

    const teacherId = teacher.id;

    // Step 2: Fetch students assigned to this teacher
    const query = `
      SELECT 
          students.id AS student_id,
          users.name AS student_name,
          students.progress_grade,
          students.final_grade,
          students.finalized
      FROM 
          students
      INNER JOIN 
          users ON students.user_id = users.id
      WHERE 
          students.teacher_id = ?;
    `;

    db.all(query, [teacherId], (err, rows) => {
      if (err) {
        console.error('Database error while fetching students:', err);
        return res.status(500).send({ message: 'Internal server error' });
      }

      if (rows.length === 0) {
        console.info(`No students found for teacher ID: ${teacherId}`);
        return res
          .status(404)
          .send({ message: 'No students assigned to this teacher' });
      }

      // Send the list of students
      res.status(200).send(rows);
    });
  });
};

module.exports = { getAllTeachers, getTeacherStudents };
