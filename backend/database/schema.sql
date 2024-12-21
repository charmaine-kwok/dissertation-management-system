-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique identifier for each user
    name TEXT NOT NULL,                   -- Name of the user
    email TEXT NOT NULL UNIQUE,           -- Unique email for the user
    password TEXT NOT NULL,               -- Encrypted password
    role TEXT NOT NULL                    -- Role (e.g., 'admin', 'teacher', 'student')
);

-- Teachers Table
CREATE TABLE IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique identifier for each teacher
    user_id INTEGER NOT NULL,             -- Foreign key linking to the 'users' table
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

-- Students Table
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- Unique identifier for each student
    user_id INTEGER NOT NULL,             -- Foreign key linking to the 'users' table
    teacher_id INTEGER,                   -- Foreign key linking to the 'teachers' table
    progress_grade TEXT,                  -- Progress grade for the student
    final_grade TEXT,                     -- Final grade for the student
    finalized BOOLEAN DEFAULT FALSE,      -- Whether the record is finalized
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers (id) ON DELETE SET NULL
);

-- Insert users into the users table
INSERT OR IGNORE INTO users (name, email, password, role) VALUES
('Admin User', 'admin@example.com', '$2b$10$Ah9vcDSEgkhpJEzKacuzneP2IowN6Zmvx1A9QVNPFB377qfFRQqye', 'admin'),
('Teacher One', 'teacher1@example.com', '$2b$10$aOpH/T71EAlCchzZisJA0uz6tE0dPgkSJ8h3c73kxm7Ecvg0CtrDq', 'teacher'),
('Teacher Two', 'teacher2@example.com', '$2b$10$AiKHIDxR8oAkLkZSO5/Rze3SvgamkDBvPMLkKUkU9cyxA9nBwJ.t6', 'teacher'),
('Student One', 'student1@example.com', '$2b$10$WNADeWJGuh58mSwFhT12d.H4y/3byGYX/PKgPlOpZv/v7ikt.pZqO', 'student'),
('Student Two', 'student2@example.com', '$2b$10$1z7CFYIw2NAns2PYjlayYeZZe/TQ1fsc/Xe8eLIjNxPFaB2Z/zqr2', 'student');

-- Insert teachers into the teachers table
INSERT OR IGNORE INTO teachers (user_id) VALUES
((SELECT id FROM users WHERE email = 'teacher1@example.com')),
((SELECT id FROM users WHERE email = 'teacher2@example.com'));

-- Insert students into the students table and link to their teachers
INSERT OR IGNORE INTO students (user_id, teacher_id, progress_grade, final_grade, finalized) VALUES
((SELECT id FROM users WHERE email = 'student1@example.com'), (SELECT id FROM teachers WHERE user_id = (SELECT id FROM users WHERE email = 'teacher1@example.com')), NULL, NULL, FALSE),
((SELECT id FROM users WHERE email = 'student2@example.com'), (SELECT id FROM teachers WHERE user_id = (SELECT id FROM users WHERE email = 'teacher2@example.com')), NULL, NULL, FALSE);
