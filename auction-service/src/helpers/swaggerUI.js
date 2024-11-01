const fs = require('fs');
const path = require('path');

async function swaggerUI() {
    const swaggerFilePath = path.join(__dirname, '..', '..', 'swagger.json');

    let swaggerJson;
    try {
        const swaggerContent = fs.readFileSync(swaggerFilePath, 'utf8');
        swaggerJson = JSON.parse(swaggerContent);
    } catch (error) {
        return {
            statusCode: 500,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({message: 'Error reading or parsing swagger.json', error: error.message})
        };
    }

    const swaggerSpec = JSON.stringify(swaggerJson);
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Swagger UI</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.min.css" integrity="sha512-+9UD8YSD9GF7FzOH38L9S6y56aYNx3R4dYbOCgvTJ2ZHpJScsahNdaMQJU/8osUiz9FPu0YZ8wdKf4evUbsGSg==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    </head>
    <body>
      <div id="swagger-ui"></div>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-bundle.min.js" integrity="sha512-7ihPQv5ibiTr0DW6onbl2MIKegdT6vjpPySyIb4Ftp68kER6Z7Yiub0tFoMmCHzZfQE9+M+KSjQndv6NhYxDgg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
      <script>
        document.addEventListener('DOMContentLoaded', () => {
          SwaggerUIBundle({
            spec: ${swaggerSpec},
            dom_id: '#swagger-ui'
          });
        });
      </script>
    </body>
    </html>
  `;

    return {
        statusCode: 200,
        headers: {"Content-Type": "text/html"},
        body: html
    };
}

module.exports.handler = swaggerUI;