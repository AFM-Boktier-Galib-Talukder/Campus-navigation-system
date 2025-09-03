function buildGraph(nodes) {
  const graph = {}
  nodes.forEach(node => {
    graph[node.dot] = node
  })
  return graph
}

module.exports = { buildGraph }
