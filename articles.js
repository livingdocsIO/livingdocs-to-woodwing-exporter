const exporter = require('./export/exporter')
exports.create = async function (req, res) {
  res.setHeader('Content-Type', 'application/json')
  const savedFileResponse = exporter.exportDocument(req.body)
  if (savedFileResponse.status === 200) return res.send(savedFileResponse.data.result)
  console.error('failed to save file')
}
