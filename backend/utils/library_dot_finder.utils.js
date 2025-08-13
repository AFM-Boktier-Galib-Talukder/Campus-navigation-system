const LibraryDesign = require('../models/library.model')

async function findLibraryDotForRoom(roomName) {
  if (!roomName || typeof roomName !== 'string') return null
  const trimmed = roomName.trim()
  if (!trimmed) return null

  const doc = await LibraryDesign.findOne({
    $or: [
      { left: { $regex: `^${escapeRegex(trimmed)}$`, $options: 'i' } },
      { right: { $regex: `^${escapeRegex(trimmed)}$`, $options: 'i' } },
    ],
  })
  return doc ? doc.dot : null
}

async function findLibraryDotsForRooms(startRoom, endRoom) {
  const [startDot, endDot] = await Promise.all([
    findLibraryDotForRoom(startRoom),
    findLibraryDotForRoom(endRoom),
  ])
  return { startDot, endDot }
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

module.exports = {
  findLibraryDotForRoom,
  findLibraryDotsForRooms,
}


