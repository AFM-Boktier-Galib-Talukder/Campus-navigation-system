const Billboard = require('../models/billboard.model')
const Report = require('../models/report.model')

async function createBillboard(req, res) {
  try {
    const {
      imageBase64,
      title,
      venue,
      date,
      time,
      description,
      hostedBy,
      createdBy,
      reportId, 
    } = req.body
    if (
      !imageBase64 ||
      !title ||
      !venue ||
      !date ||
      !time ||
      !description ||
      !hostedBy
    ) {
      return res.status(400).json({ error: 'All fields are required' })
    }

   
    const doc = await Billboard.create({
      imageBase64,
      title,
      venue,
      date,
      time,
      description,
      hostedBy,
      createdBy,
    })

   
    if (reportId) {
      await Report.findByIdAndDelete(reportId)
    }

    res
      .status(201)
      .json({ id: doc._id, message: 'Billboard created successfully' })
  } catch (err) {
    console.error('Error creating billboard:', err)
    res.status(500).json({ error: 'Failed to create billboard' })
  }
}

async function listBillboards(req, res) {
  try {
    const items = await Billboard.find({}).sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch billboards' })
  }
}

module.exports = { createBillboard, listBillboards }
