const axios = require('axios')
const {v4: uuidv4} = require('uuid')
const baseUrl = 'https://afdww0818.rzl.a-f.ch/Enterprise/'
const indexUrl = `${baseUrl}index.php?protocol=JSON`
const createFileUrl = `${baseUrl}transferindex.php`
const articleFormat = 'application/ww-digital+json'
const fileRendition = 'native'
const jsonrpc = '2.0'

async function request ({url, method, data}) {
  let response
  try {
    response = await axios({url, method, data})
  } catch (err) {
    console.error(`request for url: ${url} failed with error: ${err}`)
    throw err
  }

  return response
}

async function login ({user, password}) {
  const loginData = {
    jsonrpc,
    id: 1,
    method: 'LogOn',
    params: [{
      User: user,
      Password: password,
      ClientName: '2ced8e79-2135-4822-82bb-24f3cad96b62',
      ClientAppName: 'Livingdocs Exporter',
      ClientAppVersion: '0.0.1'
    }]
  }

  const logonResponse = await request({
    url: indexUrl,
    method: 'POST',
    data: loginData
  })

  return logonResponse.data.result.Ticket
}

async function logout ({ticket}) {
  const logoutData = {
    jsonrpc,
    id: 1,
    method: 'LogOff',
    params: [{
      Ticket: ticket
    }]
  }
  const logoutResponse = await request({
    url: indexUrl,
    method: 'POST',
    data: logoutData
  })
  return logoutResponse
}

async function lockObject ({id, ticket}) {
  const lockData = {
    jsonrpc,
    id: 1,
    method: 'LockObjects',
    params: [{
      Ticket: ticket,
      HaveVersions: [{
        ID: id,
        Version: '0.1',
        __classname__: 'ObjectVersion'
      }]
    }]
  }
  const lockResponse = await request({
    url: indexUrl,
    method: 'POST',
    data: lockData
  })
  return lockResponse
}

async function unlockObject ({id, ticket}) {
  const unlockData = {
    jsonrpc,
    id: 1,
    method: 'UnlockObjects',
    params: [{
      IDs: [id],
      Ticket: ticket
    }]
  }
  const unlockResponse = await request({
    url: indexUrl,
    method: 'POST',
    data: unlockData
  })
  return unlockResponse
}

async function linkAssetImage ({ticket, id, name, dossier}) {
  const linkAssetData = {
    method: 'CreateObjectRelations',
    params: [{
      Relations: [{
        __classname__: 'Relation',
        Child: `_ELVIS_${id}`,
        ChildInfo: {
          ID: `_ELVIS_${id}`,
          Name: `${name}`,
          Type: 'Image',
          Format: 'image/jpeg',
          __classname__: 'ObjectInfo'
        },
        Parent: dossier.ID,
        ParentInfo: {
          Format: '',
          ID: dossier.ID,
          Name: dossier.Name,
          Type: dossier.Type,
          __classname__: 'ObjectInfo'
        },
        Type: 'Contained'
      }],
      Ticket: ticket
    }],
    id: 1,
    jsonrpc
  }
  const wwCreateImageResponse = await request({
    url: indexUrl,
    method: 'POST',
    data: linkAssetData
  })

  return wwCreateImageResponse.data.result.Relations[0].Child
}

async function linkAssetToDocument ({ticket, id, name, dossier, article}) {
  const linkAssetData = {
    method: 'CreateObjectRelations',
    params: [{
      Relations: [{
        __classname__: 'Relation',
        Child: `${id}`,
        ChildInfo: {
          ID: `${id}`,
          Name: `${name}`,
          Type: 'Image',
          Format: 'image/jpeg',
          __classname__: 'ObjectInfo'
        },
        Parent: article.ID,
        ParentInfo: {
          Format: 'application/ww-digital+json',
          ID: article.ID,
          Name: article.Name,
          Type: article.Type,
          __classname__: 'ObjectInfo'
        },
        Type: 'Placed'
      }],
      Ticket: ticket
    }],
    id: 1,
    jsonrpc
  }
  const wwCreateImageResponse = await request({
    url: indexUrl,
    method: 'POST',
    data: linkAssetData
  })

  return wwCreateImageResponse.data.result.Relations[0].Child
}


async function uploadImage ({ticket, originalUrl, dossierId, publication, category}) {
  // todo: check on type image
  const customFileUrl =
    await transferImage(originalUrl, ticket)
  const response = await createImageObject({
    customFileUrl, ticket, dossierId, publication, category})

  return response.data.result.Objects[0].MetaData.BasicMetaData.ID
}

async function transferImage (downloadUrl, ticket) {
  const customFileUrl =
    `${createFileUrl}?fileguid=${uuidv4()}&format=image%2Fjpeg`

  const downStream = await axios({
    method: 'GET',
    responseType: 'stream',
    url: downloadUrl
  })

  const contentType = downStream.headers['content-type']
  const contentLength = downStream.headers['content-length']
  if (contentType === null || contentLength === null) {
    throw new Error('Invalid headers')
  }

  await axios({
    url: `${customFileUrl}&ticket=${ticket}`,
    method: 'PUT',
    data: downStream.data,
    headers: {
      'Content-Type': contentType,
      'Content-Length': contentLength
    }
  })

  return customFileUrl
}

async function createImageObject ({customFileUrl, ticket, dossierId, publication, category}) {
  const createImageData = {
    method: 'CreateObjects',
    params: [{
      Lock: false,
      Objects: [
        {
          __classname__: 'Object',
          Files: [{
            FileUrl: customFileUrl,
            Rendition: fileRendition,
            Type: 'image/jpeg',
            __classname__: 'Attachment'
          }],
          MetaData: {
            __classname__: 'MetaData',
            BasicMetaData: {
              __classname__: 'BasicMetaData',
              Name: 'testimage',
              Publication: {
                Id: publication.id,
                __classname__: 'Publication'
              },
              Category: {
                Id: category.id,
                __classname__: 'Category'
              },
              Type: 'Image'
            }
          },
          Relations: [{
            __classname__: 'Relation',
            Parent: dossierId,
            Type: 'Contained'
          }]
        }
      ],
      Ticket: ticket
    }],
    id: 1,
    jsonrpc
  }
  const wwCreateImageResponse = await request({
    url: indexUrl,
    method: 'POST',
    data: createImageData
  })
  return wwCreateImageResponse
}

async function createFile ({ticket, document, type}) {
  const customFileUrl =
    `${createFileUrl}?fileguid=${uuidv4()}&format=application%2Fww-digital%2Bjson`
  const createFileData = {
    version: '2.2',
    data: document,
    comments: {}
  }

  try {
    await request({
      url: `${customFileUrl}&ticket=${ticket}`,
      method: 'PUT',
      data: createFileData
    })
  } catch (err) {
    console.error(`file couldn't be created: ${err}`)
    throw err
  }

  return customFileUrl
}

async function createDossier ({ticket, articleName, publication, category}) {
  const createDossierData = {
    method: 'CreateObjects',
    params: [{
      Lock: false,
      Objects: [{
        __classname__: 'Object',
        MetaData: {
          __classname__: 'MetaData',
          BasicMetaData: {
            __classname__: 'BasicMetaData',
            Name: articleName,
            Publication: {
              Id: publication.id,
              __classname__: 'Publication'
            },
            Category: {
              Id: category.id,
              __classname__: 'Category'
            },
            Type: 'Dossier'
          },
          WorkflowMetaData: {
            __classname__: 'WorkflowMetaData'
          },
          RightsMetaData: {
            __classname__: 'RightsMetaData'
          },
          SourceMetaData: {
            __classname__: 'SourceMetaData'
          },
          ContentMetaData: {
            __classname__: 'ContentMetaData'
          },
          ExtraMetaData: []
        }
      }],
      'Ticket': ticket
    }],
    id: 1,
    jsonrpc
  }
  const wwCreateDossierResponse = await request({
    url: indexUrl,
    method: 'POST',
    data: createDossierData
  })
  return wwCreateDossierResponse.data.result.Objects[0].MetaData.BasicMetaData
}

async function createArticle ({ticket, articleName, publication, category, dossierId, template}) {
  const createArticleData = {
    method: 'CreateObjects',
    params: [{
      Lock: false,
      Objects: [
        {
          __classname__: 'Object',
          MetaData: {
            __classname__: 'MetaData',
            BasicMetaData: {
              __classname__: 'BasicMetaData',
              Name: articleName,
              Publication: {
                Id: publication.id,
                __classname__: 'Publication'
              },
              Category: {
                Id: category.id,
                __classname__: 'Category'
              },
              Type: 'Article'
            },
            ExtraMetaData: [
              {
                Property: 'C_CS_ARTICLE_TEMPLATE_ID',
                Values: [template.id],
                __classname__: 'ExtraMetaData'
              }
            ],
            ContentMetaData: {
              __classname__: 'ContentMetaData',
              Format: articleFormat
            }
          },
          Relations: [{
            __classname__: 'Relation',
            Parent: dossierId,
            Type: 'Contained'
          }]
        }
      ],
      Ticket: ticket
    }],
    id: 1,
    jsonrpc
  }
  const createdArticleResponse = await request({
    url: indexUrl,
    method: 'POST',
    data: createArticleData
  })

  return createdArticleResponse.data.result.Objects[0]
}

async function saveObject ({ticket, metadata, customFileUrl}) {
  const saveObjectData = {
    id: 1,
    jsonrpc,
    method: 'SaveObjects',
    params: [{
      CreateVersion: true,
      ForceCheckIn: false,
      Objects: [{
        Files: [{
          FileUrl: customFileUrl,
          Rendition: fileRendition,
          Type: articleFormat,
          __classname__: 'Attachment'
        }],
        MetaData: metadata,
        __classname__: 'Object'
      }],
      Unlock: false,
      Ticket: ticket
    }]
  }
  await lockObject({id: metadata.BasicMetaData.ID, ticket})
  const savedFileResponse = await request({
    url: indexUrl,
    method: 'POST',
    data: saveObjectData
  })
  await unlockObject({id: metadata.BasicMetaData.ID, ticket})
  return savedFileResponse
}

module.exports = {
  saveObject,
  createArticle,
  createFile,
  unlockObject,
  lockObject,
  createDossier,
  uploadImage,
  login,
  logout,
  linkAssetImage,
  linkAssetToDocument}
