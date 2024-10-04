const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'My API for CSE341 Week 4',
    description: 'Clientel API',
    version: '1.2.0',
  },
  host: 'localhost:8080',
  basePath: '/',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  securityDefinitions: {
    oauth2: {
      type: 'oauth2',
      description: 'OAuth2 flow to authenticate',
      flow: 'accessCode',
      authorizationUrl: 'https://example.com/oauth/authorize',
      tokenUrl: 'https://example.com/oauth/token',
      scopes: {
        'read:user': 'Read user data',
        'write:user': 'Modify user data',
        'delete:user': 'Delete user data',
      },
    },
  },
  security: [
    {
      oauth2: ['read:user', 'write:user'],
    },
  ],
  paths: {
    '/user/': {
      get: {
        description: 'Retrieve a list of users',
        security: [{ oauth2: ['read:user'] }],
        responses: {
          200: {
            description: 'OK',
          },
          404: {
            description: 'Not Found',
          },
        },
      },
      post: {
        description: 'Create a new user',
        security: [{ oauth2: ['write:user'] }],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'User information',
            schema: {
              type: 'object',
              properties: {
                firstName: {
                  type: 'string',
                  example: 'Arnold',
                },
                lastName: {
                  type: 'string',
                  example: 'Katru',
                },
                email: {
                  type: 'string',
                  example: 'arnold@example.com',
                },
                favoriteColor: {
                  type: 'string',
                  example: 'Blue',
                },
                birthday: {
                  type: 'string',
                  example: '1998-08-14',
                },
                nickname: {
                  type: 'string',
                  example: 'Arnie',
                },
                gender: {
                  type: 'string',
                  example: 'Male',
                },
              },
            },
          },
        ],
        responses: {
          201: {
            description: 'Created',
          },
          400: {
            description: 'Bad Request',
          },
          500: {
            description: 'Internal Server Error',
          },
        },
      },
    },
    '/user/{id}': {
      get: {
        description: 'Retrieve a user by ID',
        security: [{ oauth2: ['read:user'] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            type: 'string',
          },
        ],
        responses: {
          200: {
            description: 'OK',
          },
        },
      },
      put: {
        description: 'Update user information',
        security: [{ oauth2: ['write:user'] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            type: 'string',
          },
          {
            in: 'body',
            name: 'body',
            description: 'User data to update',
            schema: {
              type: 'object',
              properties: {
                firstName: {
                  type: 'string',
                  example: 'Arnold',
                },
                lastName: {
                  type: 'string',
                  example: 'Katru',
                },
                email: {
                  type: 'string',
                  example: 'arnold@example.com',
                },
                favoriteColor: {
                  type: 'string',
                  example: 'Blue',
                },
                birthday: {
                  type: 'string',
                  example: '1998-08-14',
                },
                nickname: {
                  type: 'string',
                  example: 'Arnie',
                },
                gender: {
                  type: 'string',
                  example: 'Male',
                },
              },
            },
          },
        ],
        responses: {
          204: {
            description: 'No Content',
          },
          400: {
            description: 'Bad Request',
          },
          500: {
            description: 'Internal Server Error',
          },
        },
      },
      delete: {
        description: 'Delete a user by ID',
        security: [{ oauth2: ['delete:user'] }],
        parameters: [
          {
            in: 'path',
            name: 'id',
            required: true,
            type: 'string',
          },
        ],
        responses: {
          204: {
            description: 'No Content',
          },
          500: {
            description: 'Internal Server Error',
          },
        },
      },
    },
    '/clients/': {
      get: {
        description: 'Retrieve a list of clients',
        security: [{ oauth2: ['read:user'] }],
        responses: {
          200: {
            description: 'OK',
          },
          404: {
            description: 'Not Found',
          },
        },
      },
      post: {
        description: 'Create a new client',
        security: [{ oauth2: ['write:user'] }],
        parameters: [
          {
            in: 'body',
            name: 'body',
            description: 'Client information',
            schema: {
              type: 'object',
              properties: {
                firstName: {
                  type: 'string',
                  example: 'Arnold',
                },
                lastName: {
                  type: 'string',
                  example: 'Katru',
                },
                email: {
                  type: 'string',
                  example: 'arnold@example.com',
                },
                favoriteColor: {
                  type: 'string',
                  example: 'Blue',
                },
                birthday: {
                  type: 'string',
                  example: '1998-08-14',
                },
                nickname: {
                  type: 'string',
                  example: 'Arnie',
                },
                gender: {
                  type: 'string',
                  example: 'Male',
                },
              },
            },
          },
        ],
        responses: {
          201: {
            description: 'Created',
          },
          400: {
            description: 'Bad Request',
          },
        },
      },
    },
  },
};

const outputFile = './swagger.json';
const endpointsFiles = ['./app.js'];

swaggerAutogen(outputFile, endpointsFiles, doc);
