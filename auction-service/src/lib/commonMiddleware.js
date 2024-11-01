const middy = require('@middy/core');
const jsonBodyParser = require('@middy/http-json-body-parser');
const httpErrorHandler = require('@middy/http-error-handler');
const httpEventNormalizer = require('@middy/http-event-normalizer');

/**
 * Common middleware for Lambda functions.
 *
 * This middleware handles JSON body parsing, normalizes HTTP events,
 * and manages error responses. It can be extended with additional middleware.
 *
 * @param {Function} handler - The Lambda function handler.
 * @param {Array} additionalMiddleware - Optional additional middleware to apply.
 * @returns {Function} - The wrapped handler with middleware.
 */
const commonMiddleware = (handler, additionalMiddleware = []) => {
    const middlewares = [
        jsonBodyParser(),
        httpEventNormalizer(),
        httpErrorHandler(),
        ...additionalMiddleware // Include any additional middleware
    ];

    return middy(handler).use(middlewares);
};

module.exports = commonMiddleware;
