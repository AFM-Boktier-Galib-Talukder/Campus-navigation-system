const FacultyDeskNode = require('../models/facultyDeskPath.model')

async function findDotForFaculty(initial) {
  if (!initial || typeof initial !== 'string') return null
  const trimmed = initial.trim().toUpperCase()
  if (!trimmed) return null

  try {
    const node = await FacultyDeskNode.findOne({
      $or: [{ left: trimmed }, { right: trimmed }],
    })

    return node ? node.dot : null
  } catch (error) {
    console.error('Error finding faculty dot:', error)
    return null
  }
}

async function findDotsForFaculties(startInitial, endInitial) {
  const [startDot, endDot] = await Promise.all([
    findDotForFaculty(startInitial),
    findDotForFaculty(endInitial),
  ])
  return { startDot, endDot }
}

module.exports = {
  findDotForFaculty,
  findDotsForFaculties,
}
