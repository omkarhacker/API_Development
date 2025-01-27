const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const { body, validationResult } = require('express-validator');
const prisma = new PrismaClient();

// Create User
exports.createUser = [
  body('email').isEmail().withMessage('Enter a valid email'),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: 'Email already exists' });
    }
  },
];

// Login User
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    
    expiresIn: '1h',
    
  });
  console.log(process.env.JWT_SECRET),

  res.json({ token });
};

// Get All Users
exports.getUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
};

// Update User
exports.updateUser = [
    body('email').isEmail().withMessage('Enter a valid email'),
    async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
  
      const { id } = req.params; // Use ID as a string
      const { name, email, password } = req.body;
  
      try {
        // Hash the password if provided
        const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
  
        // Prepare the data object for the update
        const data = { name, email };
        if (hashedPassword) {
          data.password = hashedPassword;
        }
  
        // Update the user
        const user = await prisma.user.update({
          where: { id: id }, // UUID is used directly as a string
          data: data,
        });
  
        // If update is successful, return the updated user
        res.json(user);
  
      } catch (error) {
        console.error(error); // Log the exact error message
  
        // Handle specific Prisma errors
        if (error.code === 'P2002') {
          // Prisma error code for unique constraint violation (email already exists)
          return res.status(400).json({ error: 'Email already exists' });
        }
  
        // Handle other errors (like user not found)
        res.status(400).json({ error: 'User not found or email already exists' });
      }
    },
  ];
  
  
// Delete User
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await prisma.user.delete({
      where: { id:id },
    });
    res.json({ message: 'User deleted successfully', user });
  } catch (error) {
    res.status(400).json({ error: 'User not found' });
  }
};
