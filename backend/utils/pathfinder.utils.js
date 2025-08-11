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

module.exports = {
  findShortestPath,
}
