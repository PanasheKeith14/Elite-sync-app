const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getAllServices = async (req, res) => {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      include: {
        business: {
          select: { id: true, name: true, category: true }
        }
      }
    });
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const getServiceById = async (req, res) => {
  try {
    const service = await prisma.service.findUnique({
      where: { id: req.params.id },
      include: { business: true }
    });
    if (!service) return res.status(404).json({ error: 'Service not found' });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const createService = async (req, res) => {
  try {
    const { name, description, durationMin, price, businessId } = req.body;
    if (!name || !durationMin || !price || !businessId) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const service = await prisma.service.create({
      data: { name, description, durationMin, price, businessId }
    });
    res.status(201).json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

const updateService = async (req, res) => {
  try {
    const service = await prisma.service.update({
      where: { id: req.params.id },
      data: req.body
    });
    res.json(service);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

const deleteService = async (req, res) => {
  try {
    await prisma.service.update({
      where: { id: req.params.id },
      data: { isActive: false }
    });
    res.json({ message: 'Service deactivated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getAllServices, getServiceById, createService, updateService, deleteService };