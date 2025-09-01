const FloorDesign = require('../models/floorDesign.model')

async function findSingleDot(model, roomName) {
  if (!roomName || typeof roomName !== 'string') return null
  const trimmed = roomName.trim()
  if (!trimmed) return null

  const doc = await model.findOne({
    $or: [
      { left: { $regex: `^${escapeRegex(trimmed)}$`, $options: 'i' } },
      { right: { $regex: `^${escapeRegex(trimmed)}$`, $options: 'i' } },
    ],
  })
  return doc ? doc.dot : null
}

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

function parseDot(input) {
  if (/^\d+$/.test(String(input))) {
    return parseInt(input)
  }
  return null
}

async function findDots(model, start, end) {
  let startDot = parseDot(start)
  let endDot = parseDot(end)

  if (startDot === null) {
    startDot = await findSingleDot(model, start)
  }

  if (endDot === null) {
    endDot = await findSingleDot(model, end)
  }

  console.log(
    'from dot_finder.utils_______start dot',
    startDot,
    '___End dot',
    endDot
  )

  return { startDot, endDot }
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
  findSingleDot,
  findDots,
  findDotForRoom,
  findDotsForRooms,
}
