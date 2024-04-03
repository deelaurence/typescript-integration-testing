export default {
  paths: {
    '/auth/register': {
      post: {

        tags: ['Onboarding'],
        description: 'Register',
        operationId: 'registration',

        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Registration',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'A redirect link is sent returned, redirect the client to that link',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
    '/auth/login': {
      post: {

        tags: ['Onboarding'],
        description: 'Login',
        operationId: 'login',

        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Login',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'A token is generated, redirect the client to that link',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
    '/auth/verify-email-password-reset': {
      post: {

        tags: ['Forgot password'],
        description: 'Link sent to verify user email to initiate password reset',
        operationId: 'forgotPasswordEmailVerificatgion',

        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/EmailOnly',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Email is sent to the mailbox user registerd with to initiate password reset',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
    '/auth/update-password': {
      post: {

        tags: ['Forgot password'],
        description: 'Users can update password when their mail has been verified',
        operationId: 'forgotPasswordUpdatePAssword',

        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Login',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Password reset sucessful',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
    '/auth/google/onboard': {
      get: {

        tags: ['Google'],
        description: 'Register and or authenticate users using google auth',
        operationId: 'googleauth',

        responses: {
          200: {
            description: 'A redirect link is generated',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },

    
    '/metrics/loguser': {
      get: {
        tags: ['Metrics'],
        description: 'Log users metrics',
        operationId: 'logusersmetrics',


        responses: {
          200: {
            description: 'User logged ',
          },
          500: {
            description: 'User already logged',
          },
        },
      },
    },
    '/metrics/getlogs': {
      get: {
        tags: ['Metrics'],
        description: 'Log users metrics',
        operationId: 'logusersmetrics',
        parameters: [
          {
            in: 'query',
            name: 'day',
            schema: {
              type: 'string',
            },
            required: false,
            description: 'Get a specific day e.g 3 means the third day of every month TIP: Add the month query to get for the exact day and month',
          },
          {
            in: 'query',
            name: 'month',
            schema: {
              type: 'string',
            },
            required: false,
            description: 'If supplied get the log for a particular month e.g november will get all the users that visited in november',
          },
          {
            in: 'query',
            name: 'year',
            schema: {
              type: 'string',
            },
            required: false,
            description: 'If supplied the get metrics for that year',
          },
          {
            in: 'query',
            name: 'recentdays',
            schema: {
              type: 'string',
            },
            required: false,
            description: 'Get recent visits, e.g 1 will get the visits in the last 24hrs and 2 will get for the last 48 hrs',
          },
        ],

        responses: {
          200: {
            description: 'A list of users',
          },
          500: {
            description: 'Server error',
          },
        },
      },
    },
  },
}
