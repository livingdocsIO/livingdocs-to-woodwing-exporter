function getPublication () {
  return {
    systemdata: {
      projectId: 4,
      channelId: 5,
      documentId: 9,
      contentType: 'regular',
      documentType: 'article',
      publicationId: 19,
      updatedAt: '2020-08-06T07:05:20.983Z',
      layout: 'regular',
      design: {
        name: 'living-times',
        version: '1.0.2'
      }
    },
    metadata: {
      title: 'test12345678901234567',
      language: {
        label: 'German',
        locale: 'de',
        groupId: 'LFFhpsvHfvQU'
      },
      description: 'test',
      dependencies: {},
      imatrics: {
        contentVersion: '88.2',
        concepts: [
          {
            weight: 1,
            title: 'Meinrad Andermatt',
            type: 'imatrics-entity',
            uuid: 'default'
          },
          {
            weight: 1,
            title: 'Popular Recommended Stories',
            type: 'imatrics-entity',
            uuid: 'default'
          }
        ]
      }
    },
    content: [
      {
        identifier: 'living-times.article-container',
        id: 'doc-1edbka9ie0',
        position: 'fixed',
        containers: {
          header: [
            {
              identifier: 'living-times.head',
              id: 'doc-1edbka9ie1',
              content: {
                title: 'test12345678901234567',
                text: 'test lead',
                author: 'Meinrad Andermatt'
              }
            }
          ],
          main: [
            {
              identifier: 'living-times.image',
              id: 'doc-1edbka9if0'
            },
            {
              identifier: 'living-times.paragraph',
              id: 'doc-1edbka9if1',
              content: {
                text: 'test'
              }
            },
            {
              identifier: 'living-times.teaser-author',
              id: 'doc-1edbka9if2',
              content: {
                embed: {
                  service: 'teaser',
                  params: {
                    layout: 'author-embed'
                  }
                }
              }
            }
          ],
          'sidebar-ads-top': [
            {
              identifier: 'living-times.free-html',
              id: 'doc-1edbka9ig0'
            }
          ],
          sidebar: [
            {
              identifier: 'living-times.sidebar-title',
              id: 'doc-1edbka9ig1',
              content: {
                title: 'Most Popular'
              }
            },
            {
              identifier: 'living-times.teaser-sidebar',
              id: 'doc-1edbka9ig2',
              content: {
                embed: {
                  service: 'teaser',
                  params: {
                    layout: 'sidebar-embed'
                  }
                }
              }
            },
            {
              identifier: 'living-times.teaser-sidebar',
              id: 'doc-1edbka9ig3',
              content: {
                embed: {
                  service: 'teaser',
                  params: {
                    layout: 'sidebar-embed'
                  }
                }
              }
            },
            {
              identifier: 'living-times.teaser-sidebar',
              id: 'doc-1edbka9ig4',
              content: {
                embed: {
                  service: 'teaser',
                  params: {
                    layout: 'sidebar-embed'
                  }
                }
              }
            },
            {
              identifier: 'living-times.teaser-sidebar',
              id: 'doc-1edbka9ig5',
              content: {
                embed: {
                  service: 'teaser',
                  params: {
                    layout: 'sidebar-embed'
                  }
                }
              }
            }
          ],
          'sidebar-ads-bottom': [
            {
              identifier: 'living-times.free-html',
              id: 'doc-1edbka9ig6'
            }
          ],
          footer: [
            {
              identifier: 'living-times.2-col-teaser-stack',
              id: 'doc-1edbka9ig7',
              content: {
                title: 'Recommended Stories',
                'teaser1-left': {
                  service: 'teaser',
                  params: {
                    layout: 'card'
                  }
                },
                'teaser2-left': {
                  service: 'teaser',
                  params: {
                    layout: 'card'
                  }
                },
                'teaser3-left': {
                  service: 'teaser',
                  params: {
                    layout: 'card'
                  }
                },
                'teaser4-left': {
                  service: 'teaser',
                  params: {
                    layout: 'card'
                  }
                },
                'teaser1-right': {
                  service: 'teaser',
                  params: {
                    layout: 'card'
                  }
                },
                'teaser2-right': {
                  service: 'teaser',
                  params: {
                    layout: 'card'
                  }
                },
                'teaser3-right': {
                  service: 'teaser',
                  params: {
                    layout: 'card'
                  }
                },
                'teaser4-right': {
                  service: 'teaser',
                  params: {
                    layout: 'card'
                  }
                }
              }
            }
          ]
        }
      }
    ]
  }
}

module.exports = {getPublication}
