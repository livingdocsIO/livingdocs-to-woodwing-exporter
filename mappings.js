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
  targetType: 'body',
  directiveMappings: [{source: 'text', target: 'text'}]
},
{
  sourceType: 'subtitle',
  targetType: 'crosshead',
  directiveMappings: [{source: 'title', target: 'text'}]
},
{
  sourceType: 'inline-title',
  targetType: 'crosshead',
  directiveMappings: [{source: 'title', target: 'text'}]
},
{
  sourceType: 'quote',
  targetType: 'quote',
  directiveMappings: [{source: 'text', target: 'text'}, {source: 'author', target: 'author'}]
},
{
  sourceType: 'image',
  targetType: 'image',
  directiveMappings: [{source: 'image', target: 'image'},
    {source: 'caption', target: 'caption'},
    {source: 'source', target: 'credit'}]
}]
