const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createProject = async (req, res) => {
  const { name, description, status } = req.body;

  if (!req.user || !req.user.id) {
    return res.status(403).json({ message: 'User not authenticated' });
  }

  try {
    const project = await prisma.project.create({
      data: {
        name,
        description,
        status,
        userId: req.user.id, // Ensure this is set from JWT middleware
      },
    });
    res.json(project);
  } catch (error) {
    console.error('Error creating project:', error); // Log the error for debugging
    res.status(400).json({ error: 'Error creating project' });
  }
};

// Get all projects for the current user
exports.getProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: {
        userId: req.user.id,
      },
    });
    res.json(projects);
  } catch (error) {
    res.status(400).json({ error: 'Error fetching projects' });
  }
};

// Update a project by id
exports.updateProject = async (req, res) => {
  const { id } = req.params;
  const { name, description, status } = req.body;

  try {
    const project = await prisma.project.update({
      where: {
        id: id, // Ensure id is an integer
        userId: req.user.id, // Make sure the project belongs to the user
      },
      data: {
        name,
        description,
        status,
      },
    });
    res.json(project);
  } catch (error) {
    res.status(400).json({ error: 'Error updating project' });
  }
};

// Delete a project by id
exports.deleteProject = async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.project.delete({
      where: {
        id: id, // Ensure id is an integer
        userId: req.user.id, // Make sure the project belongs to the user
      },
    });
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Error deleting project' });
  }
};
