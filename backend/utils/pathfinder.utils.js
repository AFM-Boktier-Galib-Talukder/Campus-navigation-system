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
  return [] // No path found
}

function generateDirections(graph, path) {
  const directions = []
  for (let i = 0; i < path.length - 1; i++) {
    const current = graph[path[i]]
    const next = graph[path[i + 1]]
    let direction = `Move to dot ${next.dot}`

    if (
      current.left &&
      current.connection.includes(next.dot) &&
      current.connection[0] === next.dot
    ) {
      direction += ` (left: ${current.left})`
    } else if (
      current.right &&
      current.connection.includes(next.dot) &&
      current.connection[1] === next.dot
    ) {
      direction += ` (right: ${current.right})`
    } else if (current.up === next.dot) {
      direction += ` (↑ stairs/lift to floor ${Math.floor(next.dot / 10)})`
    } else if (current.down === next.dot) {
      direction += ` (↓ stairs/lift to floor ${Math.floor(next.dot / 10)})`
    }
    directions.push(direction)
  }
  return directions
}

module.exports = { buildGraph, findShortestPath, generateDirections }
