function pathDistance(path) {
  const metersPerNode = 1
  return path.length * metersPerNode
}

function generateTime(path) {
  const timePerNode = 0.2 

  const totalTime = timePerNode * (path.length - 1)
  return `${totalTime.toFixed(2)} minutes`
}

module.exports = {
  pathDistance,
  generateTime,
}
