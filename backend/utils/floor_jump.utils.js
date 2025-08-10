const {
    buildGraph,
    findShortestPath,
    generateDirections,
    generateDistance,
  } = require('../utils/pathfinder.utils')
  
  const stair = [14, 24, 34];
  const lift = [16, 26, 36];
  
  function floor_jump(graph, start, end, choice) {
    start = parseInt(start);
    end = parseInt(end);

    const startFloor = Math.floor(start / 10); // 1-based floors
    const endFloor = Math.floor(end / 10);

    const normalized = String(choice).toLowerCase();
    const connectorsByFloor = normalized === 'stair' ? stair : lift; // index: floor-1

    // Build the vertical connector sequence only across floors between start and end (inclusive),
    // starting from startFloor connector to endFloor connector.
    const step = endFloor > startFloor ? 1 : -1;
    const connectors = [];
    for (let f = startFloor; f !== endFloor; f += step) {
      const idx = f - 1;
      if (idx < 0 || idx >= connectorsByFloor.length) return [];
      connectors.push(connectorsByFloor[idx]);
    }
    const endIdx = endFloor - 1;
    if (endIdx < 0 || endIdx >= connectorsByFloor.length) return [];
    connectors.push(connectorsByFloor[endIdx]);

    // Stitch shortest paths between start -> first connector -> ... -> last connector -> end
    let path = [start];
    let current = start;
    for (const nextNode of connectors) {
      const segment = findShortestPath(graph, current, nextNode);
      if (segment.length === 0) return [];
      path = path.concat(segment.slice(1));
      current = nextNode;
    }
    const finalSegment = findShortestPath(graph, current, end);
    if (finalSegment.length === 0) return [];
    path = path.concat(finalSegment.slice(1));

    return path;
  }
  
  module.exports = {
    floor_jump,
  }
  