const middy = require('@middy/core')
const jsonBodyParser = require('@middy/http-json-body-parser')
const httpErrorHandler = require('@middy/http-error-handler')
const httpEventNormalizer = require('@middy/http-event-normalizer')

const commonMiddleware = (handler) => {
  return middy(handler)
    .use(jsonBodyParser())
    .use(httpEventNormalizer())
    .use(httpErrorHandler())
}

module.exports = commonMiddleware
