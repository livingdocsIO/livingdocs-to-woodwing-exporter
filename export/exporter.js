
const {transformDocument} = require('./article_transformation')
const {getLivingdoc, getMedia} = require('./livingdocs_api')
const {createArticle, createFile, saveObject, createDossier, uploadImage, login, logout, linkAssetImage} = require('./woodwing/api')

const useWoodwingAssets = `${process.env.USE_WW_ASSETS}` === 'true' || false
const publication = {id: process.env.WW_PUBLICATION_ID}
const category = {id: process.env.WW_CATEGORY_ID}
const template = {id: process.env.WW_TEMPLATE_ID}
const username = process.env.WW_USER
const password = process.env.WW_PASSWORD

exports.exportDocument = async function (event) {
  const {livingdoc, title, imageComponents} = await getLivingdoc({
    projectId: event.projectId, documentId: event.publicationEvent.documentId})
  const ticket = await login({user: username, password: password})
  const dossierId = await createDossier({ticket, articleName: title, publication, category})

  const uploadedImages = []
  if (!useWoodwingAssets) {
    for (let i = 0; i < imageComponents.length; i++) {
      const imageComponent = imageComponents[i]
      try {
        const imageId = await uploadImage({
          ticket,
          dossierId,
          publication,
          category,
          originalUrl: imageComponent.directives.image[0].content.originalUrl})
        uploadedImages.push({
          imageComponent,
          id: imageId})
      } catch (err) {
        console.error('image could not be uploaded')
      }
    }
  } else {
    for (let i = 0; i < imageComponents.length; i++) {
      try {
        const mediaId = imageComponents[i].directives.image[0].content.mediaId
        // todo: check on all image directives
        const media =
          await getMedia({mediaId})
        let id = media.externalId
        if (media.systemName === 'WoodWing') {
          id = await linkAssetImage(
            {ticket, id: media.externalId, name: media.asset.filename, dossierId})
        }
        uploadedImages.push({
          imageComponent: imageComponents[i], id: id, system: media.system})
      } catch (err) {
        console.error(`image could not be linked: ${err}`)
      }
    }
  }

  let savedFileResponse

  try {
    const document = await transformDocument({livingdoc, uploadedImages})

    const createdArticle =
      await createArticle({ticket, articleName: title, publication, category, dossierId, template})
    const customFileUrl =
      await createFile({ticket, document})

    savedFileResponse = await saveObject({ticket, metadata: createdArticle.MetaData, customFileUrl})
  } catch (err) {
    console.error('article could not be created and saved')
  }

  await logout({ticket})
  return savedFileResponse
}
