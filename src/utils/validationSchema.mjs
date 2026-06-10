export const createUserValidationSchema ={
    user_name:{
        notEmpty:{
            errorMessage:"user name must not be empty"
        },
        isLength:{
            options:{min:3,max:12},
            errorMessage:"user name length not required"
        },
        isString:{
            errorMessage:"user name must be string"
        }
    },
    age:{
        notEmpty:{
            errorMessage:" age must not be empty"
        }

    },

    password: {
        notEmpty: {
            errorMessage: "Password must not be empty"
        },
        isLength: {
            options: { min: 2, max: 20 },
            errorMessage: "Password must be between 6 and 20 characters"
        },
        isString: {
            errorMessage: "Password must be a string"
        }
    }

};