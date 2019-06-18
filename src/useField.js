import { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { isNil, debounce } from 'lodash'
import { formPropType } from './customPropTypes'

const initialState = {
    value: '',
    errors: [],
    valid: true,
    validating: false,
    pristine: true
};

const useField = ({ name, form, validators, initialValue, validateOn }) => {
    const [state, setState] = useState({ ...initialState, ...(isNil(initialValue) ? {} : { value: initialValue }) });

    useEffect(
        () => {
            form.addField(field);
            return () => form.removeField(name)
        },
        []
    )

    // memoize the bind property since it only needs to change if name or validateOn changes.
    const bind = useMemo(() => ({
        name,
        onChange,
        ...(validateOn === 'blur' ? { onBlur } : {})
    }), [name, validateOn]);

    // validate the new value async in case any validators are themselves async
    const debouncedValidate = debounce(async value => {
        setState(state => ({ ...state, validating: true }));
        const errors = await Promise.all(validators.map(v => v(value)));
        setState(state => ({ ...state, errors, valid: !errors.length, validating: false }));
    }, 200);

    // onChange will only validate if validateOn is set to 'change'
    const onChange = ({ target: { value } }) => {
        setState({ ...state, pristine: false, value });
        if (validateOn === 'change') debouncedValidate(value);        
    }

    // onBlur will only be a property of bind (and thus called) if validateOn is set to 'blur'
    const onBlur = ({ target: { value } }) => debouncedValidate(value);

    // manually set errors
    const setErrors = (errors = []) => {
        const _errors = Array.isArray(errors) ? errors : [errors];
        setState({ ...state, errors: _errors, valid: !_errors.length });
    }

    const validate = () => debouncedValidate(state.value);

    const { value, errors, valid, pristine, validating } = state;
    const field = {
        id: name,
        bind: { ...bind, value },
        value,
        pristine,
        validating,
        valid,
        validate,
        errors,
        setErrors
    };

    return field;
}

useField.propTypes = {
    name: PropTypes.string.isRequired,
    form: formPropType.isRequired,
    initialValue: PropTypes.oneOf([PropTypes.string, PropTypes.number, PropTypes.array]),
    validateOn: PropTypes.oneOf(['blur', 'change', 'submit']),
    validators: PropTypes.arrayOf(PropTypes.func)
}

useField.defaultProps = {
    initialValue: '',
    validateOn: 'blur', 
    validators: []
}

export default useField;