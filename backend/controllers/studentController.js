const db = require('../database/db');
const bcrypt = require('bcrypt');

const getStudents = (req, res) => {
  const query = `
    SELECT 
      students.id AS student_id,
      users.name AS student_name,
      teachers.id AS teacher_id,
      teacher_users.name AS teacher_name,
      students.progress_grade,
      students.final_grade,
      students.finalized
    FROM students
    LEFT JOIN users ON students.user_id = users.id
    LEFT JOIN teachers ON students.teacher_id = teachers.id
    LEFT JOIN users AS teacher_users ON teachers.user_id = teacher_users.id;
    `;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error('Error fetching students:', err);
      return res.status(500).send({ message: 'Internal server error' });
    }
    res.send(rows);
  });
};

const assignTeacher = (req, res) => {
  const { studentId, teacherId } = req.body;

  if (!studentId || !teacherId) {
    return res
      .status(400)
      .send({ message: 'Both studentId and teacherId are required' });
  }

  // Check if both student and teacher exist
  db.get('SELECT * FROM students WHERE id = ?', [studentId], (err, student) => {
    if (err) {
      console.error('Error fetching student:', err);
      return res.status(500).send({ message: 'Internal server error' });
    }

    if (!student) {
      return res.status(404).send({ message: 'Student not found' });
    }

    db.get(
      'SELECT * FROM teachers WHERE id = ?',
      [teacherId],
      (err, teacher) => {
        if (err) {
          console.error('Error fetching teacher:', err);
          return res.status(500).send({ message: 'Internal server error' });
        }

        if (!teacher) {
          return res.status(404).send({ message: 'Teacher not found' });
        }

        // Perform the assignment
        db.run(
          'UPDATE students SET teacher_id = ? WHERE id = ?',
          [teacherId, studentId],
          function(err) {
            if (err) {
              console.error('Error assigning teacher:', err);
              return res
                .status(500)
                .send({ message: 'Failed to assign teacher' });
            }

            if (this.changes === 0) {
              return res.status(404).send({ message: 'Student not found' });
            }

            res.send({ message: 'Teacher assigned successfully' });
          }
        );
      }
    );
  });
};

const addStudent = (req, res) => {
  const { name, email, teacherId, progressGrade, finalGrade } = req.body;
  const defaultPassword = 'password'; // Default password
  const hashedPassword = bcrypt.hashSync(defaultPassword, 10);

  // Insert into users table
  db.run(
    `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'student')`,
    [name, email, hashedPassword],
    function(err) {
      if (err) {
        console.error('Error inserting into users:', err);
        return res.status(500).send({ message: 'Failed to add student' });
      }

      const userId = this.lastID; // Get the inserted user's ID

      // Insert into students table
      db.run(
        `INSERT INTO students (user_id, teacher_id, progress_grade, final_grade) VALUES (?, ?, ?, ?)`,
        [userId, teacherId || null, progressGrade || null, finalGrade || null],
        function(err) {
          if (err) {
            console.error('Error inserting into students:', err);
            return res.status(500).send({ message: 'Failed to add student' });
          }

          res.send({ message: 'Student added successfully' });
        }
      );
    }
  );
};

const updateGrades = (req, res) => {
  const { progressGrade, finalGrade } = req.body;
  const studentId = req.params.id;

  db.run(
    `UPDATE students SET progress_grade = ?, final_grade = ? WHERE id = ?`,
    [progressGrade || null, finalGrade || null, studentId],
    function(err) {
      if (err) {
        console.error('Error updating grades:', err);
        return res.status(500).send({ message: 'Failed to update grades' });
      }
      res.send({ message: 'Grades updated successfully' });
    }
  );
};

const finalizeStudent = (req, res) => {
  const studentId = req.params.id;

  db.get(
    `SELECT progress_grade, final_grade FROM students WHERE id = ?`,
    [studentId],
    (err, student) => {
      if (err) {
        console.error('Error fetching student:', err);
        return res.status(500).send({ message: 'Internal server error' });
      }

      if (!student || !student.progress_grade || !student.final_grade) {
        return res.status(400).send({
          message: 'Cannot finalize: Missing progress or final grade.',
        });
      }

      db.run(
        `UPDATE students SET finalized = 1 WHERE id = ?`,
        [studentId],
        function(err) {
          if (err) {
            console.error('Error finalizing student:', err);
            return res
              .status(500)
              .send({ message: 'Failed to finalize record' });
          }
          res.send({ message: 'Student record finalized successfully' });
        }
      );
    }
  );
};

module.exports = {
  getStudents,
  assignTeacher,
  addStudent,
  updateGrades,
  finalizeStudent,
};
