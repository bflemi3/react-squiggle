import React from 'react'
import { Paper, Typography, Button } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { useField, useForm, validators } from 'react-squiggle'

import Field from './components/Field'
import { timeout } from './utils'

const PASSWORD_REGEX = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/;

const useStyles = makeStyles(theme => ({
    paper: {
        maxWidth: 900,
        padding: theme.spacing(3),
        display: 'flex'
    }
}));

export default () => {
    const classes = useStyles();

    const form = useForm({
        onSubmit: async (formData) => {
            // simulate async form submit
            await timeout(2000);

            // simulate possible 400 from server
            if (formData.email.length < 10) {
                form.setErrors({ email: 'Email must be at least 10 characters' });
                return;
            }

            console.log(`Form submitted with values = ${Object.entries(formData).map(([key, value]) => `${key} = ${value}`).join(' | ')}`);
        }
    })

    const emailField = useField({
        name: 'email', 
        form,
        validations: [
            validators.required(),
            validators.email('Enter a valid email')
        ]
    });

    const passwordField = useField({
        name: 'password',
        form,
        validateOn: 'change',
        validations: [
            validators.required(),
            (value, form) => !PASSWORD_REGEX.test(value) && 'Invalid password'
        ]
    });

    const confirmPasswordField = useField({
        name: 'confirmPassword',
        form,
        validations: [
            (value, { password }) => value !== password && 'Must match your password'
        ]
    });

    return (
        <Paper classNames={classes.paper}>
            <Typography variant='h1' component='h1'>
                Async form submission
            </Typography>

            <form {...form.bind}>
                <Field
                    required
                    {...emailField.bind}
                    name='email'
                    label='Email (validated on blur)'
                    autoComplete='email'
                />

                <Field
                    required
                    {...passwordField.bind}
                    type='password'
                    name='password'
                    label='Password (validated as you type)'
                    helperText='Must be at least 8 characters long and contain at least 1 letter, 1 number and 1 special character !#$%&? "'
                />

                <Field
                    required
                    {...confirmPasswordField.bind}
                    type='password'
                    name='confirmPassword'
                    label='Confirm Password (validated on blur)'
                />

                <Button type='submit' color='primary'>Submit</Button>
            </form>
        </Paper>
    )
}
