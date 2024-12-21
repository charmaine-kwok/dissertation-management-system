const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');
const teacherRoutes = require('./routes/teacherRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use(authRoutes);
app.use(studentRoutes);
app.use(teacherRoutes);

module.exports = app;
