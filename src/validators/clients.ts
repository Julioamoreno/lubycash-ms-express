import { checkSchema } from 'express-validator';

export default checkSchema({
    full_name: {
      optional: {
        options: {
          nullable: false,
        },
      },
      isString: {
        errorMessage: 'The field phone must be a string.',
      },
      isLength: {
        errorMessage: 'Password should be at least 6 chars long',
        options: { min: 6 },
      }
    },
    email:{
      isEmail: {
        errorMessage: 'The field must be an email.',
      },
    },
    phone:{
      isString: {
        errorMessage: 'The field phone must be a string.',
      }
    },
    cpf_number: {
      isString: {
        errorMessage: 'The field cpf_number must be a string.',
      },
      isLength: {
        errorMessage: 'The field cpf_number should be at most 11 chars string',
        options: { max: 11 }
      }
    },
    address: {
      isString: {
        errorMessage: 'The field address must be a string.',
      }
    },
    city: {
      isString: {
        errorMessage: 'The field city must be a string.',
      }
    },
    state: {
      isString: {
        errorMessage: 'The field state must be a string.',
      }
    },
    zipcode: {
      isString: {
        errorMessage: 'The field zipcode must be a string.',
      }
    },
    average_salary: {
      isDecimal: {
        errorMessage: 'The field average_salary must be a float.',
      }
    }
});
