const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Create a task under a project
exports.createTask = async (req, res) => {
  const { title, description, status, assignedUserId } = req.body;
  const { projectId } = req.params;

  try {
    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        projectId: projectId, // Ensure projectId is treated as a number
        assignedUserId,
      },
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: 'Error creating task', details: error.message });
  }
};

// List tasks for a project
exports.getTasks = async (req, res) => {
  const { projectId } = req.params;

  try {
    const tasks = await prisma.task.findMany({
      where: {
        projectId: projectId, // Ensure projectId is treated as a number
      },
    });
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching tasks', details: error.message });
  }
};

// Get filtered tasks by status and assignedUserId
exports.getFilteredTasks = async (req, res) => {
  const { status, assignedUserId } = req.query;

  try {
    const filters = {};

    // Add filter for status if provided
    if (status) {
      filters.status = status;
    }

    // Add filter for assignedUserId if provided
    if (assignedUserId) {
      filters.assignedUserId = assignedUserId;
    }

    // Fetch tasks based on filters
    const tasks = await prisma.task.findMany({
      where: filters,
    });

    res.json(tasks);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching tasks', details: error.message });
  }
};


exports.updateTask = async (req, res) => {
  const { id } = req.params; // Extract task ID from the URL parameters
  const { title, description, status, assignedUserId } = req.body;

  try {
    // Check if the assigned user exists (if assignedUserId is provided)
    if (assignedUserId) {
      const assignedUser = await prisma.user.findUnique({
        where: { id: assignedUserId },
      });
      if (!assignedUser) {
        return res.status(400).json({ error: 'Assigned user does not exist' });
      }
    }

    // Update the task
    const updatedTask = await prisma.task.update({
      where: {
        id: id, // Use the task ID
      },
      data: {
        title,
        description,
        status,
        assignedUserId,
      },
    });

    res.json(updatedTask);
  } catch (error) {
    res.status(400).json({
      error: 'Error updating task',
      details: error.message,
    });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  const { id } = req.params; // id is a string (UUID)

  try {
    await prisma.task.delete({
      where: {
        id: id, // Ensure id is treated as a string (UUID)
      },
    });
    res.status(200).json({ message: 'Task successfully deleted' });
  } catch (error) {
    res.status(400).json({ error: 'Error deleting task', details: error.message });
  }
};
