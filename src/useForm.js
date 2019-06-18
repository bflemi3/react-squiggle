import { useReducer, useRef } from 'react'
import PropTypes from 'prop-types'
import isEmpty from 'lodash/isEmpty'

const initialState = {
    valid: false,
    validating: false,
    submitting: false,
    error: null
}

const toFormData = (data, f) => ({ ...data, [f.id]: f.value });

const reducer = (state, action) => {
    switch(action.type) {
        case 'SUBMIT_START':
            return { ...state, validating: true, submitting: true, error: null };
        
        case 'SUBMIT_VALIDATE_DONE':
            return { 
                ...state, 
                validating: false, 
                valid: action.valid,
                ...(action.valid ? {} : { submitting: false })  
            };

        case 'SUBMIT_REQUEST_DONE':
            return { ...state, submitting: false, error: action.error || null };

        default:
            throw new Error(`'${action.type}' is not a valid action type.`);
    }
}

const useForm = ({ onSubmit }) => {
    const fields = useRef([]);
    const [state, dispatch] = useReducer(reducer, initialState);

    const _onSubmit = async e => {
        dispatch({ type: 'SUBMIT_START' });

        // validate fields
        await Promise.all(fields.current.map(f => f.validate()));
        const valid = fields.current.every(f => f.valid);
        dispatch({ type: 'SUBMIT_VALIDATE_DONE', valid })

        // if not valid short circuit - don't submit form
        if(!valid) return;

        // otherwise submit the form
        try {
            const formData = fields.current.reduce(toFormData, {});
            await Promise.resolve(onSubmit(formData));
            dispatch({ type: 'SUBMIT_REQUEST_DONE' });
        } catch (e) {
            console.error(e.message);
            dispatch({ type: 'SUBMIT_REQUEST_DONE', error: 'There was a problem submitting the form.' });
        }
    }

    const addField = field => { fields.current.push(field) }

    const removeField = name => { fields.current = fields.current.filter(f => f.id !== name) }

    const setErrors = (errors = {}) => {
        Object.entries(errors).forEach(([fieldName, messages]) => {
            const field = fields.current.find(f => f.id === fieldName);
            if(field) field.setErrors(messages);
        });
        dispatch({ type: 'SUBMIT_VALIDATE_DONE', valid: isEmpty(errors) })
    } 

    return {
        ...state,
        addField,
        removeField,
        setErrors,
        bind: { onSubmit: _onSubmit }
    }
}

useForm.propTypes = {
    onSubmit: PropTypes.func.isRequired
}

export default useForm;