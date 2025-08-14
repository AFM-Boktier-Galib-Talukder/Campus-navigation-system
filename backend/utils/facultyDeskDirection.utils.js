export function getDirectionMessages(graph, path, endInitial) {
  const messages = []
  const lastNode = graph[path[path.length - 1]]

  for (let i = 0; i < path.length - 1; i++) {
    const currentDot = path[i]
    const nextDot = path[i + 1]
    const currentNode = graph.find(node => node.dot === currentDot)
    const nextNode = graph.find(node => node.dot === nextDot)

    if (!currentNode || !nextNode) continue

    if (i === 0 && currentDot === 0) {
      messages.push('Start from the entrance.')
      continue
    }

    if (nextNode === lastNode) {
      if (nextNode.left.includes(endInitial)) {
        messages.push(
          `Go ahead & turn left.\nYou have reached ${endInitial}'s Desk.`
        )
      } else {
        messages.push(
          `Go ahead & turn right.\nYou have reached ${endInitial}'s Desk.`
        )
      }
      messages.push(`You have reached your destination!`)
    } else if (nextNode.left && nextNode.right) {
      messages.push(
        `Move forward.\nYou can see ${nextNode.right} desk on right and ${nextNode.left} desk on left.`
      )
    } else {
      messages.push('Move forward.')
    }
  }

  return messages
}
