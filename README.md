# Livingdocs to WoodWing Exporter
This exporter can read articles from Livingdocs, transform this articles to WoodWing Digital Articles and export it to WoodWing.

# How to run it
The application can be run as express application or as serverless application on aws.

## Serverless
- Install the Serverless CLI `npm install -g serverless`
- Set the environment variables in the config.yml
- Set the aws Key
   - `export AWS_ACCESS_KEY_ID=<your-key-here>`
   - `export AWS_SECRET_ACCESS_KEY=<your-secret-key-here>`
- Deploy the service `serverless deploy`

### Run local
Run `serverless offline` and it will be started on localhost

Only the function link is working offline `http://localhost:3002/2015-03-31/functions/exportDocument/invocations`

## Express
- Set the Environment Variables
- Start the application with `node index`

## Configuration

### Environment Variables
```
LD_TOKEN: ''
LD_SERVER_URL: 'https://server.livingdocs.io'
USE_WW_ASSETS: 'false' // use WoodWing Assets
WW_TEMPLATE_ID: '12811'
WW_CATEGORY_ID: '574'
WW_PUBLICATION_ID: '62'
WW_USER: ''
WW_PASSWORD: ''
```

### Mapping
The components from livingdocs have to be mapped to the WoodWing Article Components. The default mapping is done for the living-times design in livingdocs to the standard design in WoodWing Studio.

To change the mapping open the mappings.js file and there you can change the mapping.
