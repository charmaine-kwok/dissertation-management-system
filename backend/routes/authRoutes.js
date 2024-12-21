/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API for user authentication
 */

const express = require('express');
const { login } = require('../controllers/authController');
const router = express.Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     tags: [Authentication]
 *     requestBody:
 *       description: User credentials for authentication
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: User authenticated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 role:
 *                   type: string
 *       400:
 *         description: Invalid credentials.
 *       500:
 *         description: Internal server error.
 */
router.post('/login', login);

module.exports = router;
