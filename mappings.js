exports.mappings = [{
  sourceType: 'head',
  targetType: 'title',
  directiveMappings: [{source: 'title', target: 'text'}]
},
{
  sourceType: 'head',
  targetType: 'intro',
  directiveMappings: [{source: 'text', target: 'text'}]
},
{
  sourceType: 'paragraph',
  targetType: 'body-crosshead',
  directiveMappings: [{source: 'text', target: 'text'}]
},
{
  sourceType: 'image',
  targetType: 'image',
  directiveMappings: [{source: 'image', target: 'image'}, {source: 'caption', target: 'caption'}]
}]
