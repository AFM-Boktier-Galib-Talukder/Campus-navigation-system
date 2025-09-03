function generateDirections(graph, path) {
  const directions = []
  let i = 1

  while (i < path.length - 1) {
    const current = graph[path[i]]
    const next = graph[path[i + 1]]

    if (current.up === next.dot || current.down === next.dot) {
      const liftNodes = [16, 26, 36]
      const transportType = liftNodes.includes(current.dot) ? 'lift' : 'stair'

      const currentPos = current.dot % 10
      const nextPos = next.dot % 10
      let stairLiftSide = ''

      if (
        current.left &&
        (current.left.includes('stair') || current.left.includes('lift'))
      ) {
        stairLiftSide = nextPos < currentPos ? 'left' : 'right'
      } else if (
        current.right &&
        (current.right.includes('stair') || current.right.includes('lift'))
      ) {
        stairLiftSide = nextPos < currentPos ? 'right' : 'left'
      }

      directions.push(
        `Go ahead & turn ${stairLiftSide}.\nYou can see ${transportType} .`
      )

      let finalFloor = Math.floor(current.dot / 10)
      let j = i

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

      const startFloor = Math.floor(current.dot / 10)
      const isUp = finalFloor > startFloor

      directions.push(
        `Go ${isUp ? 'up' : 'down'} using ${transportType} to floor ${finalFloor}.`
      )

      i = j + 1
      continue
    }

    if (current.connection.includes(next.dot)) {
      const currentPos = current.dot % 10
      const nextPos = next.dot % 10

      let direction = 'Move forward.'

      if (current.left || current.right) {
        const leftInfo = current.left || 'nothing'
        const rightInfo = current.right || 'nothing'

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
