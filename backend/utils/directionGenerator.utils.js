function generateDirections(graph, path) {
  const directions = []
  let i = 1 // Start from index 1 to skip first node

  while (i < path.length - 1) {
    const current = graph[path[i]]
    const next = graph[path[i + 1]]

    // Check for vertical movement (stair/lift)
    if (current.up === next.dot || current.down === next.dot) {
      const liftNodes = [16, 26, 36]
      const transportType = liftNodes.includes(current.dot) ? 'lift' : 'stair'

      // Add direction to reach the stair/lift (generic name)
      const currentPos = current.dot % 10
      const nextPos = next.dot % 10
      let stairLiftSide = ''

      if (
        current.left &&
        (current.left.includes('stair') || current.left.includes('lift'))
      ) {
        stairLiftSide = nextPos < currentPos ? 'left' : 'right' // Swap if moving backward
      } else if (
        current.right &&
        (current.right.includes('stair') || current.right.includes('lift'))
      ) {
        stairLiftSide = nextPos < currentPos ? 'right' : 'left' // Swap if moving backward
      }

      directions.push(
        `Move forward.\nYou can see ${transportType} on your ${stairLiftSide}.`
      )

      // Find the final destination floor by looking ahead through all floor changes
      let finalFloor = Math.floor(current.dot / 10)
      let j = i

      // Skip through all consecutive floor changes to find the final floor
      while (j < path.length - 1) {
        const currentNode = graph[path[j]]
        const nextNode = graph[path[j + 1]]

        if (
          currentNode.up === nextNode.dot ||
          currentNode.down === nextNode.dot
        ) {
          finalFloor = Math.floor(nextNode.dot / 10)
          j++
        } else {
          break
        }
      }

      // Determine if we're going up or down overall
      const startFloor = Math.floor(current.dot / 10)
      const isUp = finalFloor > startFloor

      // Add the floor change direction to final destination
      directions.push(
        `Go ${isUp ? 'up' : 'down'} using ${transportType} to floor ${finalFloor}.`
      )

      // Skip to after all the floor changes
      i = j + 1
      continue
    }

    // Check for horizontal movement
    if (current.connection.includes(next.dot)) {
      const currentPos = current.dot % 10
      const nextPos = next.dot % 10

      let direction = 'Move forward.'

      // Add left/right information if available and not empty
      if (current.left || current.right) {
        const leftInfo = current.left || 'nothing'
        const rightInfo = current.right || 'nothing'

        // If moving backward (to lower node number), swap left/right
        if (nextPos < currentPos) {
          direction += `\nYou can see ${rightInfo} on your left and ${leftInfo} on your right.`
        } else {
          direction += `\nYou can see ${leftInfo} on your left and ${rightInfo} on your right.`
        }
      }

      directions.push(direction)
    }

    i++
  }

  // Add final destination message
  const lastNode = graph[path[path.length - 1]]
  if (lastNode) {
    let arrivalMessage = `Move forward and reach your destination.`

    if (lastNode.left || lastNode.right) {
      const leftInfo = lastNode.left || 'nothing'
      const rightInfo = lastNode.right || 'nothing'
      arrivalMessage += `\nYou can see ${leftInfo} on your left and ${rightInfo} on your right.`
    }

    directions.push(arrivalMessage)
  }

  return directions
}

module.exports = {
  generateDirections,
}
