const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./dissertation.db');

const passwords = [
  'adminpassword',
  'teacher1password',
  'teacher2password',
  'student1password',
  'student2password',
];

const users = [
  { name: 'Admin User', email: 'admin@example.com', role: 'admin' },
  { name: 'Teacher One', email: 'teacher1@example.com', role: 'teacher' },
  { name: 'Teacher Two', email: 'teacher2@example.com', role: 'teacher' },
  { name: 'Student One', email: 'student1@example.com', role: 'student' },
  { name: 'Student Two', email: 'student2@example.com', role: 'student' },
];

const teachers = [
  {
    userId: 2,
    department: 'Computer Science',
    specialization: 'Machine Learning',
  },
  { userId: 3, department: 'Mathematics', specialization: 'Algebra' },
];

const students = [
  {
    userId: 4,
    teacherId: 1,
    progress_grade: null,
    final_grade: null,
    is_finalized: 0,
  },
  {
    userId: 5,
    teacherId: 2,
    progress_grade: null,
    final_grade: null,
    is_finalized: 0,
  },
];

const reports = [
  {
    studentId: 1,
    report_type: 'progress',
    file_path: '/path/to/progress_report1.pdf',
  },
  {
    studentId: 1,
    report_type: 'final',
    file_path: '/path/to/final_report1.pdf',
  },
  {
    studentId: 2,
    report_type: 'progress',
    file_path: '/path/to/progress_report2.pdf',
  },
  {
    studentId: 2,
    report_type: 'final',
    file_path: '/path/to/final_report2.pdf',
  },
];

async function hashPasswordsAndInsertUsers() {
  try {
    // Hash passwords and insert users
    for (let i = 0; i < users.length; i++) {
      const hashedPassword = await bcrypt.hash(passwords[i], 10);
      const { name, email, role } = users[i];
      db.run(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role],
        function(err) {
          if (err) console.error(`Error inserting user ${name}:`, err.message);
          else console.log(`User ${name} added successfully.`);
        }
      );
    }
  } catch (err) {
    console.error('Error hashing passwords:', err);
  }
}

function insertTeachers() {
  teachers.forEach((teacher) => {
    const { userId, department, specialization } = teacher;
    db.run(
      'INSERT INTO teachers (user_id, department, specialization) VALUES (?, ?, ?)',
      [userId, department, specialization],
      function(err) {
        if (err) console.error('Error inserting teacher:', err.message);
        else console.log(`Teacher with user_id ${userId} added successfully.`);
      }
    );
  });
}

function insertStudents() {
  students.forEach((student) => {
    const {
      userId,
      teacherId,
      progress_grade,
      final_grade,
      is_finalized,
    } = student;
    db.run(
      'INSERT INTO students (user_id, teacher_id, progress_grade, final_grade, is_finalized) VALUES (?, ?, ?, ?, ?)',
      [userId, teacherId, progress_grade, final_grade, is_finalized],
      function(err) {
        if (err) console.error('Error inserting student:', err.message);
        else console.log(`Student with user_id ${userId} added successfully.`);
      }
    );
  });
}

function insertReports() {
  reports.forEach((report) => {
    const { studentId, report_type, file_path } = report;
    db.run(
      'INSERT INTO reports (student_id, report_type, file_path) VALUES (?, ?, ?)',
      [studentId, report_type, file_path],
      function(err) {
        if (err) console.error('Error inserting report:', err.message);
        else
          console.log(`Report for student_id ${studentId} added successfully.`);
      }
    );
  });
}

async function insertDummyData() {
  await hashPasswordsAndInsertUsers();
  setTimeout(() => {
    insertTeachers();
    insertStudents();
    insertReports();
  }, 500); // Wait for users to be inserted
}

insertDummyData();
