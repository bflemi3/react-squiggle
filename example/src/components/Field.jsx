import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { FormControl, InputLabel, Input, InputAdornment, FormHelperText } from '@material-ui/core'
import { LoadingIcon } from '@material-ui/icons'

const useStyles = makeStyles(theme => ({
    '@keyframes rotate': {
        to: { transform: 'rotate(360deg)' }
    },
    field: {},
    rotate: {
        animation: 'rotate 1s linear infinite'
    }
}));

export default ({
    name,
    label,
    onChange,
    errors,
    validating
}) => {
    const classes = useStyles();

    return (
        <FormControl className={classes.field} error={showErrors}>
            <InputLabel htmlFor={name}>{label}</InputLabel>
            <Input
                id={name}
                value={value}
                onChange={onChange}
                onBlur={() => !pristine && validate()}
                endAdornment={
                    <InputAdornment position='end'>
                        {validating && <LoadingIcon className={classes.rotate} />}
                    </InputAdornment>
                }
                {...other}
            />
            <FormHelperText component='div'>
                {showErrors &&
                    errors.map(errorMsg => <div key={errorMsg}>{errorMsg}</div>)}
            </FormHelperText>
        </FormControl>
    )
}