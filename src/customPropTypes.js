import PropTypes from 'prop-types'

export const useFieldPropType = PropTypes.shape({
    bind: PropTypes.object,
    value: PropTypes.oneOf([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date), PropTypes.array]),
    errors: PropTypes.array,
    setErrors: PropTypes.func,
    valid: PropTypes.bool,
    validating: PropTypes.bool,
    pristine: PropTypes.bool
});

export const formPropType = PropTypes.shape({
    bind: PropTypes.object,
    addField: PropTypes.func
});