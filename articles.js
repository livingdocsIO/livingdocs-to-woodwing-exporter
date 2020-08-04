const axios = require('axios')
const createArticleUrl = 'https://afdww0818.rzl.a-f.ch/Enterprise/index.php?protocol=JSON&method=CreateObjects'
const createFileUrl = 'https://afdww0818.rzl.a-f.ch/Enterprise/transferindex.php'
const saveFileUrl = 'https://afdww0818.rzl.a-f.ch/Enterprise/index.php?protocol=JSON'
const { v4: uuidv4 } = require('uuid');
const ticket = "ee26bc66dBdL0FuzhGKLLnxsllBcyJ0QwaOBWP5k"

exports.create = async function (req, res) {
    res.setHeader('Content-Type', 'application/json')
    const wwCreateArticleResponse = await axios({
        url: createArticleUrl,
        method: 'POST',
        data: {
            "method":"CreateObjects",
            "params":[
                {
                    "Lock":false,
                    "Objects":[
                        {
                            "__classname__":"Object",
                            "MetaData":{
                                "__classname__":"MetaData",
                                "BasicMetaData":{
                                    "__classname__":"BasicMetaData",
                                    "Name":"Testartikel_MAN",
                                    "Publication":{
                                        "Name":"Livingdocs",
                                        "Id":"62",
                                        "__classname__":"Publication"
                                    },
                                    "Category":{
                                        "Name":"Inhalt",
                                        "Id":"575",
                                        "__classname__":"Category"
                                    },
                                    "Type":"Article"
                                },
                                "WorkflowMetaData":{
                                    "__classname__":"WorkflowMetaData",
                                    "State":{
                                        "Name":"A | Created","Id":"2141",
                                        "__classname__":"State"
                                    }
                                },
                                "ExtraMetaData":[
                                    {
                                        "__classname__":"ExtraMetaData",
                                        "Property":"Dossier",
                                        "Values":["0"]
                                    },
                                    {
                                        "__classname__":"ExtraMetaData",
                                        "Property":"C_WPCAT",
                                        "Values":["Headline"]
                                    },
                                    {
                                        "__classname__":"ExtraMetaData",
                                        "Property":"C_SOURCELANGUAGE",
                                        "Values":["de-CH"]
                                    },
                                    {
                                        "__classname__":"ExtraMetaData",
                                        "Property":"C_TARGETLANGUAGE",
                                        "Values":[]
                                    },
                                    {
                                        "Property":"C_CS_FILEFORMATVERSION",
                                        "Values":["2.2"],
                                        "__classname__":"ExtraMetaData"
                                    },
                                    {
                                        "Property":"C_CS_ARTICLE_TEMPLATE_ID",
                                        "Values":["12811"],
                                        "__classname__":"ExtraMetaData"
                                    }
                                ],
                                "ContentMetaData":{
                                    "__classname__":"ContentMetaData",
                                    "Format":"application/ww-digital+json"
                                }
                            }                            
                        }
                    ],
                    "Ticket": ticket
                }],
                "id":21,
                "jsonrpc":"2.0"
            }
        })
        let createdFileResponse
        const customFileUrl = `${createFileUrl}?fileguid=${uuidv4()}&format=application%2Fww-digital%2Bjson`
        try {
            createdFileResponse = await axios({
                url: `${customFileUrl}&ticket=${ticket}`,
                method: 'PUT',
                data: {
                    version: '2.2',
                    comments: {},
                    data: {
                        content: [
                            {
                                content: {
                                    text:[
                                        {insert:"This is a custom text"}
                                    ]
                                },
                                id:"doc-1ebnma9vh0",
                                identifier:"title",
                                styles:{}
                            }
                        ]
                    }
                }
            })
        } catch (err) {
            console.log(err)
            throw err
        }

        if (createdFileResponse.status === 200) {
            const metadata = wwCreateArticleResponse.data.result.Objects[0].MetaData
            const savedFileResponse = await axios({
                url: saveFileUrl,
                method: 'POST',
                data: {
                    id: 21,
                    jsonrpc: "2.0",
                    method: "SaveObjects",
                    params: [{
                        CreateVersion: true,
                        ForceCheckIn: false,
                        Objects: [{
                            Files: [{
                                FileUrl: customFileUrl,
                                Rendition: "native",
                                Type: "application/ww-digital+json",
                                __classname__: "Attachment"
                            }],
                            Metadata: {
                                BasicMetaData: {
                                    ID: metadata.BasicMetaData.ID,
                                    Name: metadata.BasicMetaData.Name,
                                    Type: metadata.BasicMetaData.Type,
                                    __classname__: metadata.BasicMetaData.__classname__
                                },
                                ContentMetaData: {
                                    LengthChars: "0",
                                    LengthParas: "0",
                                    LengthWords: "0",
                                    PlainContent: "foo12312343434343 bar dfgf dfgdfg dsfdf wewererw werwer werwer foo bar ladjfljsf wer gfdg New Test",
                                    __classname__: "ContentMetaData"
                                },
                                ExtraMetaData: [
                                    {Property: "C_CS_FILEFORMATVERSION", Values: ["2.2"], __classname__: "ExtraMetaData"},
                                    {Property: "C_CS_STYLEID", Values: ["d1ea331a-a869-4b31-bf6c-c2d2705f5f5a"], __classname__: "ExtraMetaData"},
                                    {Property: "C_CS_DE_COMPONENT_NAMES", Values: ["title,subtitle,marginal,intro,body-start,marginal-h1,body"], __classname__: "ExtraMetaData"}
                                ],
                                WorkflowMetaData: {
                                    State: {
                                        Color: "FFCCFF",
                                        DefaultRouteTo: null,
                                        Id: "2141",
                                        Name: "A | Created",
                                        Produce: null,
                                        Type: "Article",
                                        __classname__: "State"
                                    },
                                    Version: "0.2",
                                    __classname__: "WorkflowMetaData"
                                }
                            },
                            __classname__: "Object"
                        }],
                        Unlock: false,
                        Ticket: ticket
                    }]
                }
            })
            if (savedFileResponse.status === 200) return res.send(savedFileResponse.data.result)
            throw new Error('BROKEN')
        }

    
        res.send('failed to save file')
  }