const escapeRegex = string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

async function searching(FloorDesign, query) {
  if (!query || !query.trim()) return []

  const regex = new RegExp(escapeRegex(query.trim()), 'i')
  const docs = await FloorDesign.find({
    $or: [{ left: { $regex: regex } }, { right: { $regex: regex } }],
  })
    .limit(10)
    .lean()

  const seen = new Set()
  const results = []

  for (const d of docs) {
    if (d.left && regex.test(d.left) && !seen.has(d.left.toLowerCase())) {
      seen.add(d.left.toLowerCase())
      results.push({ label: d.left, dot: d.dot })
    }
    if (d.right && regex.test(d.right) && !seen.has(d.right.toLowerCase())) {
      seen.add(d.right.toLowerCase())
      results.push({ label: d.right, dot: d.dot })
    }
  }

  return results
}

module.exports = { searching }
