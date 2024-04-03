export default {
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: "JWT"
      }
    },
    name: {
      type: 'string',
      description: 'Lastname and Firstname',
      example: "John Not-Doe",
    },
    username: {
      type: 'string',
      description: 'admin username',
      example: "admin@admin",
    },
    oldUsername: {
      type: 'string',
      description: 'former admin username',
      example: "admin@admin",
    },
    newUsername: {
      type: 'string',
      description: 'new admin username',
      example: "admin@admin",
    },
    newPassword: {
      type: 'string',
      description: 'new admin password',
      example: "admin_secret",
    },
    otp: {
      type: 'number',
      description: 'otp from email',
      example: 567098,
    },
    email: {
      type: 'string',
      description: 'Valid email to receive verification mail',
      example: "usevalid_email@gmail.com",
    },
    withdrawalOwnerEmail: {
      type: 'string',
      description: 'Email of the owner of the withdrawal object',
      example: "usevalid_email@gmail.com",
    },
    id: {
      type: 'string',
      description: 'The withdrawal _id',
      example: "6098xxxxxxxxxxxxxx",
    },
    status: {
      type: 'string',
      description: 'Status of the withdrawal must be either Approved or Failed',
      example: "Approved",
    },
    password: {
      type: 'string',
      description: 'Minimum of 8 chars password',
      example: "securepass",
    },
    amount: {
      type: 'number',
      description: 'The amount we are charging for the course',
      example: 500,
    },
    description: {
      type: 'string',
      description: 'A code for the program being subscribed for',
      example: "_WebDevIntro",
    },
    studentAnswer: {
      type: 'string',
      description: 'The answer the user submits',
      example: "<p>This is a paragraph tag</p>",
    },
    bankName:{
      type:'string',
      description:'The name of the bank users wants to receive funds',
      example:'Heritage Bank'
    },
    accountName:{
      type:'string',
      description:'The name of the account users wants to receive funds',
      example:'Johnny Doe'
    },
    accountNumber:{
      type:'string',
      description:'The bank account number users wants to receive funds',
      example:'1234XXXXXXXX'
    },

    bankInformation:{
      type:'object',
      example:{
        accountNumber:"1234XXXXX",
        accountName:"John Doe",
        bankName:"Heritage Bank",
      }
    },

    schemas: {
      Login: {
        type: 'object',
        properties: {
          email: {
            $ref: '#/components/email',
          },
          password: {
            $ref: '#/components/password',
          },
        },
      },
      EmailOnly: {
        type: 'object',
        properties: {
          email: {
            $ref: '#/components/email',
          }
        },
      },
      AdminLogin: {
        type: 'object',
        properties: {
          username: {
            $ref: '#/components/username',
          },
          password: {
            $ref: '#/components/password',
          },
        },
      },
      AdminUpdate: {
        type: 'object',
        properties: {
          newUsername: {
            $ref: '#/components/newUsername',
          },
          oldUsername: {
            $ref: '#/components/oldUsername',
          },
          otp: {
            $ref: '#/components/otp',
          },
          newPassword: {
            $ref: '#/components/newPassword',
          },
        },
      },
      Registration: {
        type: 'object',
        properties: {
          name: {
            $ref: '#/components/name',
          },
          email: {
            $ref: '#/components/email',
          },
          password: {
            $ref: '#/components/password',
          },
        },
      },
      Payment: {
        type: 'object',
        properties: {
          amount: {
            $ref: '#/components/amount',
          },
          description: {
            $ref: '#/components/description',
          },
        },
      },
      SubmitExercise: {
        type: 'object',
        properties: {
          studentAnswer: {
            $ref: '#/components/studentAnswer',
          },
        },
      },
      WithdrawalEdit:{
        type:'object',
        properties:{
          email:{
            $ref:'#/components/withdrawalOwnerEmail'
          },
          id:{
            $ref:'#/components/id'
          },
          status:{
            $ref:'#/components/status'
          }
        }
      },
  
      WithdrawalCreate:{
        type:'object',
        properties:{
          bankInformation:{
              $ref:'#/components/bankInformation'
            }
          }
        }
      
       
    },
  },
};
