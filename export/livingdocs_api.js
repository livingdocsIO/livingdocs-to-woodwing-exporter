const liSDK = require('@livingdocs/node-sdk')

// eslint-disable-next-line max-len
const token = `${process.env.LD_TOKEN}`
const livingdocsServerUrl = `${process.env.LD_SERVER_URL}`

async function getPublication ({documentId, liClient}) {
  const publication = await liClient.getPublication({documentId: documentId})
  return publication
}

async function getLivingdoc ({projectId, documentId}) {
  try {
    const liClient = new liSDK.Client({
      url: livingdocsServerUrl,
      accessToken: token
    })

    const publication = await getPublication({documentId, liClient})
    const design = await liClient.getProjectDesign()
    const livingdoc = liSDK.document.create({content: publication.content, design})
    const imageComponents = getAllImageComponents({componentTree: livingdoc.componentTree})
    return {livingdoc, title: publication.metadata.title, imageComponents}
  } catch (err) {
    console.error(`Couldn't create livingdoc: ${err}`)
  }
}

async function getMedia ({mediaId}) {
  const liClient = new liSDK.Client({
    url: livingdocsServerUrl,
    accessToken: token
  })
  const media = await liClient.getMedia({id: mediaId})
  return media
}

function getAllImageComponents ({componentTree}) {
  let imageComponents = []
  componentTree.design.eachStructure((structure) => {
    if (structure.directives.count('image') > 0) {
      const components = componentTree.find(structure.name)
      imageComponents = [...imageComponents, ...components]
    }
  })

  return imageComponents
}

module.exports = {getLivingdoc, getMedia}
