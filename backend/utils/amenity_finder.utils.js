const FloorDesign = require('../models/floorDesign.model')

// Predefined amenity mappings organized by floor
const AMENITY_MAPPINGS = {
  maleWashroom: {
    1: 17, // Floor 1 - Male Washroom at dot 17 (right side)
    // Floor 2 - Male Washroom at dot 27 (right side)
    3: 37, // Floor 3 - Male Washroom at dot 37 (right side)
  },
  femaleWashroom: {
    1: 17, // Floor 1 - Female Wash 2: 27,room at dot 17 (left side)
    2: 27, // Floor 2 - Female Washroom at dot 27 (left side)
    3: 37, // Floor 3 - Female Washroom at dot 37 (left side)
  },
  fireExit: {
    1: 13, // Floor 1 - Fire Exit at dot 13
    2: 23, // Floor 2 - Fire Exit at dot 23
    3: 33, // Floor 3 - Fire Exit at dot 33
  },
}

/**
 * Resolves the destination dot number for amenities based on the start point floor
 * @param {string} amenityType - Type of amenity (Male Washroom, Female Washroom, FireExit, Medical Center)
 * @param {number} startDot - The starting point dot number
 * @returns {Promise<number|null>} - The destination dot number or null if not found
 */
async function resolveAmenityDestination(amenityType, startDot) {
  if (!startDot || !amenityType) return null

  const startFloor = Math.floor(startDot / 10)

  const amenityTypeLower = amenityType.toLowerCase()

  switch (amenityTypeLower) {
    case 'male washroom':
      return AMENITY_MAPPINGS.maleWashroom[startFloor] || null

    case 'female washroom':
      return AMENITY_MAPPINGS.femaleWashroom[startFloor] || null

    case 'fireexit':
      return AMENITY_MAPPINGS.fireExit[startFloor] || null

    case 'medical center':
      // For medical center, use dot finder to get exact location
      return await findDotForMedicalCenter()

    default:
      console.log(`Unknown amenity type: ${amenityType}`)
      return null
  }
}

/**
 * Finds the dot number for Medical Center using the dot finder logic
 * @returns {Promise<number|null>} - The medical center dot number
 */
async function findDotForMedicalCenter() {
  try {
    const doc = await FloorDesign.findOne({
      $or: [
        { left: { $regex: '^Medical Center$', $options: 'i' } },
        { right: { $regex: '^Medical Center$', $options: 'i' } },
      ],
    })
    return doc ? doc.dot : null
  } catch (error) {
    console.error('Error finding Medical Center:', error)
    return null
  }
}

/**
 * Helper function to escape regex special characters
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

module.exports = {
  resolveAmenityDestination,
  findDotForMedicalCenter,
  AMENITY_MAPPINGS,
}
