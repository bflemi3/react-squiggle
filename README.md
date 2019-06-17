# react-squiggle

> A set of React hooks to help you validate forms.

[![NPM](https://img.shields.io/npm/v/react-squiggle.svg)](https://www.npmjs.com/package/react-squiggle) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-squiggle
# OR
yarn add react-squiggle
```

## General Usage

```jsx
import { useField, useForm, validators } from 'react-squiggle'
```

### A simple example

This example simulates an async form submission. By default, fields are validated on blur and when the form is submitted.

```jsx
const MyForm = () => {
    const form = useForm({
        onSubmit: async (formData, valid) => {
            if(!valid) alert('This form is not valid!');

            // simulate async form submit
            await timeout(2000);

            // simulate 400 from server
            if(formData.email.length < 10) {
                form.setErrors({ email: 'Email must be at least 10 characters' });
                return;
            }

            const values = Object.entries(formData).map(([key, value]) => `${key} = ${value}`)
            console.log(`Success! Form submitted with values = ${values.join(' | ')}`);
        }
    });

    const nameField = useField({
        name: 'name',
        form,
        validations: [
            validators.required('Name is required'),
            value => !/[a-zA-Z\s]*/.test(value) && 'Name must contain only letters and spaces'
        ]
    });

    return (
        <form {...form.bind}>
            <label htmlFor='name'>Enter your name</label>
            <input 
                required
                {...nameField.bind}
                type='text'
                id='name'
                name='name'
            />
            <button type='submit'>Submit</button>
        </form>
    )
}
```

### Field validation on change

```jsx
const nameField = useField({
    name: 'name',
    form,
    validateOn: 'change',
    validations: [
        validators.required('Name is required'),
        value => !/[a-zA-Z\s]*/.test(value) && 'Name must contain only letters and spaces'
    ]
});
```

### Field validation only on submit

```jsx
const nameField = useField({
    name: 'name',
    form,
    validateOn: 'submit',
    validations: [
        validators.required('Name is required'),
        value => !/[a-zA-Z\s]*/.test(value) && 'Name must contain only letters and spaces'
    ]
});
```

### Dependent field validation

```jsx
const PASSWORD_REGEX = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/;

const passwordField = useField({
    name: 'password',
    form,
    validations: [
        validators.required(),
        value => !PASSWORD_REGEX.test(value) && 'Password must contain at least 1 letter, 1 number and 1 special character !#$%&"'
    ]
});

const confirmPasswordField = useField({
    name: 'confirmPassword',
    form,
    validations: [
        (value, { password }) => value !== password && `Woops, this doesn't match your password`
        // you can also use the `matchesField` validator provided with the library
        // validators.matchesField(`Woops, this doesn't match your password`, passwordField)
    ]
});
```

## useField Usage

```
useField({ name, form, validations? = [], validatesOn? = 'blur', initialValue? = '' })
```

useField provides an api to be used in a react component.

### bind: { name, value, onChange, onBlur? }

The bind property is meant to be bound with the react component directly. If `validateOn` is set to 'blur' then onBlur will be provided as well.
```jsx
const field = useField({ name: 'firstName', form });
return <input {...field.bind} type='text' />
```

## Out-of-the-box Validations

This library comes with a set of common validators. Each validator accepts [at least] an optional invalid message and returns a validator function `(value, formData) => string`. If a custom invalid message isn't provided, each validator has a default invalid message.

### validators.between(message?, [min, max]): (value, formData) => string

Default message: 
> Must be between {min} and {max}

```js
const integerField = useField({
    ...,
    validations: [
        validators.integer(),
        validators.between(undefined, [1, 100])
    ]
});
```

### validators.betweenLength(message?, [min, max]): (value, formData) => string

Default message: 
> Must have length between {min} and {max}

```js
const stringField = useField({
    ...,
    validations: [
        validators.string(),
        validators.betweenLength(undefined, [1, 10])
    ]
});
```

### validators.decimal(message?): (value, formData) => string

Default message: 
> Enter a valid decimal

```js
const numberField = useField({
    ...,
    validations: [
        validators.decimal('Woops, invalid decimal')
    ]
});
```

### validators.email(message?): (value, formData) => string

Default message: 
> Enter a valid email

```js
const emailField = useField({
    ...,
    validations: [
        validators.email('Invalid email')
    ]
});

```

### validators.integer(message?): (value, formData) => string

Default message: 
> Enter a valid whole number

```js
const numberField = useField({
    ...,
    validations: [
        validators.integer()
    ]
});
```

### validators.matchesField(message?, field): (value, formData) => string

Default message: 
> Must match {field.id}

```js
const confirmPasswordField = useField({
    ...,
    validations: [
        validators.matchesField(`Woops, this doesn't match your password`, passwordField)
    ]
});
```

### validators.max(message?, max): (value, formData) => string

Default message: 
> Cannot be greater than {max}

```js
const integerField = useField({
    ...,
    validations: [
        validators.integer(),
        validators.max(undefined, 50)
    ]
});
```

### validators.maxLength(message?, max): (value, formData) => string

Default message: 
> Cannot have length greater than {max}

```js
const stringField = useField({
    ...,
    validations: [
        validators.string(),
        validators.maxLength(undefined, 50)
    ]
});
```

### validators.min(message?, min): (value, formData) => string

Default message: 
> Cannot be less than {min}

```js
const integerField = useField({
    ...,
    validations: [
        validators.integer(),
        validators.min(undefined, 50)
    ]
});
```

### validators.minLength(message?, min): (value, formData) => string

Default message: 
> Cannot have length less than {min}

```js
const stringField = useField({
    ...,
    validations: [
        validators.string(),
        validators.minLength(undefined, 5)
    ]
});
```

### validators.required(message?): (value, formData) => string

Default message:
> Field is required

```js
const nameField = useField({
    ...,
    validations: [
        validators.required('Name is required')
    ]
});

```

### validators.string(message?): (value, formData) => string

Default message: 
> Enter a valid string

```js
const stringField = useField({
    ...,
    validations: [
        validators.string()
    ]
});

```

## License

MIT © [bflemi3](https://github.com/bflemi3)
