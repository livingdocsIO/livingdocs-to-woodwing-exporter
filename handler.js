const exporter = require('./export/exporter')

module.exports.exportDocument = async event => {
  let content
  // offline mode has directly the json
  if (event.body) {
    content = JSON.parse(event.body)
  } else {
    content = event
  }

  await exporter.exportDocument(content)

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      input: event
    })
  }

  return response
}
