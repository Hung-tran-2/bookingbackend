const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Retrieve a paginated list of all users
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user by ID
 *     description: Retrieve a specific user by their ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:id', userController.getUserById);

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new user
 *     description: Create a new user account (chỉ nhận 4 trường - full_name, email, password, phone)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - full_name
 *               - email
 *               - password
 *             properties:
 *               full_name:
 *                 type: string
 *                 example: Nguyễn Văn A
 *                 description: Họ tên đầy đủ
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *                 description: Email (bắt buộc)
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *                 description: Mật khẩu (tối thiểu 6 ký tự)
 *               phone:
 *                 type: string
 *                 example: "0123456789"
 *                 description: Số điện thoại (tùy chọn)
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', userController.createUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update user
 *     description: Update an existing user's information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               full_name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               phone:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [user, staff, admin]
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete user
 *     description: Delete a user from the system
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User deleted successfully
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', userController.deleteUser);

module.exports = router;
