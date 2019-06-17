import { useMemo } from 'react'
import { isNil, isString } from 'lodash'

const EMAIL_REGEX = /.*/;
const INTEGER_REGEX = /^[1-9]\d*$/;
const DECIMAL_REGEX = /^[1-9]\d*(\.\d+)?$/;

export default ({
    between: (message = `Must be between ${min} and ${max}`, [min, max]) => value => (value > max || value < min) && message,
    betweenLength: (message = `Must have length between ${min} and ${max}`, [min, max]) => value => 
        (value.length > max || value.length < min) && message,
    decimal: (message = 'Enter a valid decimal') => value => !DECIMAL_REGEX.test(value) && message,
    email: (message = 'Enter a valid email') => value => !EMAIL_REGEX.test(value) && message,
    integer: (message = 'Enter a valid whole number') => value => !INTEGER_REGEX.test(value) && message,
    matchesField: (message = `Must match ${field.id}`, field) => (value, fieldData) => {
        const matchingField = fieldData[field.id];
        return matchingField && value !== matchingField && message;
    },
    max: (message = `Cannot be greater than ${max}`, max) => value => value > max && message,
    maxLength: (message = `Cannot have length greater than ${max}`, max) => value => value.length > max && message,
    min: (message = `Cannot be less than ${min}`, min) => value => value < min && message,
    minLength: (message = `Cannot have length less than ${min}`, min) => value => value.length < min && message,
    required: (message = 'Field is required') => value => isNil(value) && message,
    string: (message = 'Enter a valid string') => value => !isString(value) && message,
})