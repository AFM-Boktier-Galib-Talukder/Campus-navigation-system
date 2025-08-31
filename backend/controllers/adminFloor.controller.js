const FloorDesign = require('../models/floorDesign.model')

// Get all floor dots with search functionality
const getAllFloorDots = async (req, res) => {
  try {
    const { search } = req.query
    let query = {}

    if (search && search.trim()) {
      const searchRegex = new RegExp(
        search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
        'i'
      )
      query = {
        $or: [
          { left: { $regex: searchRegex } },
          { right: { $regex: searchRegex } },
        ],
      }
    }

    const floors = await FloorDesign.find(query).sort({ dot: 1 }).lean()
    res.json({ success: true, data: floors })
  } catch (error) {
    console.error('Error fetching floor dots:', error)
    res
      .status(500)
      .json({ success: false, error: 'Failed to fetch floor data' })
  }
}

// Update a specific floor dot
const updateFloorDot = async (req, res) => {
  try {
    const { dotId } = req.params
    const { connection, left, right, up, down } = req.body

    // Validation
    if (!connection || !Array.isArray(connection) || connection.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Connection array is required and cannot be empty',
      })
    }

    // Validate connection array contains only integers
    const invalidConnections = connection.filter(
      conn => !Number.isInteger(conn)
    )
    if (invalidConnections.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Connection array must contain only integers',
      })
    }

    // Validate left and right are strings (can be empty)
    if (typeof left !== 'string' || typeof right !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Left and right values must be strings',
      })
    }

    // Validate up and down are either null or integers
    if (up !== null && !Number.isInteger(up)) {
      return res.status(400).json({
        success: false,
        error: 'Up value must be null or an integer',
      })
    }

    if (down !== null && !Number.isInteger(down)) {
      return res.status(400).json({
        success: false,
        error: 'Down value must be null or an integer',
      })
    }

    const updatedFloor = await FloorDesign.findOneAndUpdate(
      { dot: parseInt(dotId) },
      {
        connection,
        left: left.trim(),
        right: right.trim(),
        up,
        down,
      },
      { new: true, runValidators: true }
    )

    if (!updatedFloor) {
      return res.status(404).json({
        success: false,
        error: 'Floor dot not found',
      })
    }

    res.json({
      success: true,
      message: 'Floor dot updated successfully',
      data: updatedFloor,
    })
  } catch (error) {
    console.error('Error updating floor dot:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to update floor dot',
    })
  }
}

// Get a specific floor dot by ID
const getFloorDotById = async (req, res) => {
  try {
    const { dotId } = req.params
    const floor = await FloorDesign.findOne({ dot: parseInt(dotId) }).lean()

    if (!floor) {
      return res.status(404).json({
        success: false,
        error: 'Floor dot not found',
      })
    }

    res.json({ success: true, data: floor })
  } catch (error) {
    console.error('Error fetching floor dot:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to fetch floor dot',
    })
  }
}

module.exports = {
  getAllFloorDots,
  updateFloorDot,
  getFloorDotById,
}
