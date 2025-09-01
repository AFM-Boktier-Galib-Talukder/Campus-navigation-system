function buildGraph(nodes) {
  const graph = {}
  nodes.forEach(node => {
    graph[node.dot] = node
  })
  return graph
}

function findShortestPath(graph, start, end) {
  const queue = [[start]]
  const visited = new Set([start])

  while (queue.length > 0) {
    const path = queue.shift()
    const node = path[path.length - 1]

    if (node === end) return path

    const neighbors = graph[node]?.connection || []
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor)
        queue.push([...path, neighbor])
      }
    }
  }
  return []
}

function generateDirections(graph, path) {
  const directions = []
  for (let i = 0; i < path.length - 1; i++) {
    const current = graph[path[i]]
    const next = graph[path[i + 1]]
    let direction = 'Move forward.\n'

    const isForwardDirection = path[i] < path[i + 1]

    if (current.connection.includes(next.dot)) {
      if (isForwardDirection) {
        direction += `You can see ${current.left} on your left and ${current.right} on your right.`
      } else {
        direction += `You can see ${current.right} on your left and ${current.left} on your right.`
      }
    } else if (current.up === next.dot) {
      direction += `Take stairs/lift up to floor ${Math.floor(next.dot / 10)}.`
    } else if (current.down === next.dot) {
      direction += `Take stairs/lift down to floor ${Math.floor(next.dot / 10)}.`
    }

    directions.push(direction)
  }

  // Add final destination message
  if (path.length > 0) {
    const finalNode = graph[path[path.length - 1]]
    if (finalNode) {
      directions.push(
        `Move forward and reach your destination.\nYou can see ${finalNode.left} on your left and ${finalNode.right} on your right.`
      )
    }
  }

  return directions
}

function floorDistance(path) {
  const firstNumber = path[0]
  const lastNumber = path[path.length - 1]

  const firstDigitFirst = Math.floor(firstNumber / 10)
  const firstDigitLast = Math.floor(lastNumber / 10)

  const additionalDistance = Math.abs(firstDigitLast - firstDigitFirst)
  return additionalDistance
}

function generateDistance(path) {
  const distance = (0.33 * (path.length - 1) + floorDistance(path)).toFixed(2)
  return parseFloat(distance)
}

module.exports = {
  buildGraph,
  findShortestPath,
  generateDirections,
  generateDistance,
  floorDistance,
}
