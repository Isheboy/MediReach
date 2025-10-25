const Facility = require('../models/Facility');

const getAllFacilities = async (req, res) => {
  try {
    const facilities = await Facility.find().sort({ name: 1 });
    res.json(facilities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFacilityById = async (req, res) => {
  try {
    const { id } = req.params;
    const facility = await Facility.findById(id);
    
    if (!facility) {
      return res.status(404).json({ error: 'Facility not found' });
    }
    
    res.json(facility);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createFacility = async (req, res) => {
  try {
    const { name, address, contactNumber, services } = req.body;
    
    const facility = new Facility({
      name,
      address,
      contactNumber,
      services
    });
    
    await facility.save();
    res.status(201).json(facility);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateFacility = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, contactNumber, services } = req.body;
    
    const facility = await Facility.findByIdAndUpdate(
      id,
      { name, address, contactNumber, services },
      { new: true, runValidators: true }
    );
    
    if (!facility) {
      return res.status(404).json({ error: 'Facility not found' });
    }
    
    res.json(facility);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteFacility = async (req, res) => {
  try {
    const { id } = req.params;
    const facility = await Facility.findByIdAndDelete(id);
    
    if (!facility) {
      return res.status(404).json({ error: 'Facility not found' });
    }
    
    res.json({ message: 'Facility deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility
};
