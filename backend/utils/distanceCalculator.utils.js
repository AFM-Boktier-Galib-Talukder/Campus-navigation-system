function pathDistance(path) {
  const metersPerNode = 5
  return path.length * metersPerNode
}

function floorDistance(path) {
  const firstFloor = Math.floor(path[0] / 10)
  const lastFloor = Math.floor(path[path.length - 1] / 10)
  return Math.abs(lastFloor - firstFloor)
}

function generateTime(path) {
  const timePerNode = 0.53 // minutes per node
  const floorChangePenalty = 1 // additional minutes per floor change
  const totalTime =
    timePerNode * (path.length - 1) + floorDistance(path) * floorChangePenalty
  return `${totalTime.toFixed(2)} minutes`
}

module.exports = {
  pathDistance,
  floorDistance,
  generateTime,
}
