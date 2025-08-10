const FloorDesign = require('../models/floorDesign.model')

async function findDotForRoom(roomName) {
  if (!roomName || typeof roomName !== 'string') return null
  const trimmed = roomName.trim()
  if (!trimmed) return null

  // Exact, case-insensitive match on either left or right
  const doc = await FloorDesign.findOne({
    $or: [
      { left: { $regex: `^${escapeRegex(trimmed)}$`, $options: 'i' } },
      { right: { $regex: `^${escapeRegex(trimmed)}$`, $options: 'i' } },
    ],
  })
  return doc ? doc.dot : null
}

async function findDotsForRooms(startRoom, endRoom) {
  const [startDot, endDot] = await Promise.all([
    findDotForRoom(startRoom),
    findDotForRoom(endRoom),
  ])
  return { startDot, endDot }
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

module.exports = {
  findDotForRoom,
  findDotsForRooms,
}


