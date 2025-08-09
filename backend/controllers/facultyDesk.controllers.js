const Faculty = require('../models/facultyDesk.model')

// Get all faculty members
const getAllFaculty = async (req, res) => {
  try {
    const faculty = await Faculty.find().sort({ department: 1, faculty: 1 })
    res.status(200).json(faculty)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get faculty by ID
const getFacultyById = async (req, res) => {
  try {
    const faculty = await Faculty.findById(req.params.id)
    if (!faculty) {
      return res.status(404).json({ message: 'Faculty not found' })
    }
    res.status(200).json(faculty)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Create new faculty member
const createFaculty = async (req, res) => {
  try {
    const newFaculty = new Faculty(req.body)
    const savedFaculty = await newFaculty.save()
    res.status(201).json(savedFaculty)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Update faculty member
const updateFaculty = async (req, res) => {
  try {
    const updatedFaculty = await Faculty.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    if (!updatedFaculty) {
      return res.status(404).json({ message: 'Faculty not found' })
    }
    res.status(200).json(updatedFaculty)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
}

// Delete faculty member
const deleteFaculty = async (req, res) => {
  try {
    const deletedFaculty = await Faculty.findByIdAndDelete(req.params.id)
    if (!deletedFaculty) {
      return res.status(404).json({ message: 'Faculty not found' })
    }
    res.status(200).json({ message: 'Faculty deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getAllFaculty,
  getFacultyById,
  createFaculty,
  updateFaculty,
  deleteFaculty,
}
