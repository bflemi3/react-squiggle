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

This example simulates an async form submission. By default, fields are validated on blur and when the form is submitted.

```jsx
import React from 'react'
import { useField, useForm, validators } from 'react-squiggle'

const MyForm = () => {
    const form = useForm({
        onSubmit: async (formData) => {
            // simulate async form submit
            await timeout(2000);

            // simulate 400 from the server
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
            value => !/[a-zA-Z\s]*/.test(value) && 'Name can contain only letters and spaces'
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
   ...,
    validateOn: 'change'
});
```

### Field validation only on submit

```jsx
const nameField = useField({
    ...,
    validateOn: 'submit'
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
        // You can also use the `matchesField` validator provided with the library
        // validators.matchesField(`Woops, this doesn't match your password`, passwordField)
    ]
});
```

## `useField`

```typescript
useField({  
    form: object, 
    initialValue?: any = ''
    name: string,
    validatesOn?: string = 'blur'
    validations?: Array<(value, formData) => string> = []
})
```

### Props

#### `form: object`

The form api provided from `useForm`.

#### `initialValue?: any = ''`

The initial value of the field. If left blank, the default value is an empty string.

#### `name: string`

The name of the field

#### `validatesOn?: string = 'blur'`

Determines when the field is validated. Possible values are `blur` - occurs when the field is blurred; `change` - occurs when the field's `onChange` event is fired; `submit` - occurs only when the forms is submitted. Default value is `blur`.

#### `validations?: Array<(value, formData) => string>`

A collection of functions that give the current value of the field and the rest of the form values. The function should return a message when the field is invalid, otherwise `null`, `undefined` or `false`.

### API

`useField` provides an api to be used with an HTML element or React component.

#### `bind: { name, value, onChange, onBlur? }`

The bind property is meant to be bound with the HTML element or React component directly. If `validateOn` is set to 'blur' then `onBlur` will be provided as well.
```jsx
const field = useField({ name: 'firstName', form });
return <input {...field.bind} type='text' />
```

#### `id: string`

The value of `name` provided to the useField constructor.

#### `value: any`

The value of the field.

#### `pristine: bool = true`

Will be true until the field is touched by the user. 

#### `validating: bool = false`

Will only be true while the field is being validated.

#### `valid: bool = true`

Initially true. Will be false if the field is determined invalid from its validation functions.

#### `validate: () => void`

Manually triggers field validation. 

#### `errors: string[]`

Contains all invalid messages. Will be an empty array when the field is valid.

#### `setErrors: (errors: string[]) => void`

Manually sets errors for the field. This method will also set valid to false.

## `useForm`

```typescript
useForm({ onSubmit: (formData: object) => void })
```

### Props

#### `onSubmit: (formData: object) => void`

The `onSubmit` method for the form. If the form is not valid this function will not be called. Instead form submission will halt and all errors will be displayed.

### API

useForm provides an api to be used with a `form` element or React component.

#### `addField: (field: object) => void`

Adds a field to the form. `useField` calls this method internally when a new field is created.

#### `bind: { onSubmit: (formData: object) => void}`

The bind property is meant to be bound with an HTML form element or React component directly.
```jsx
const form = useForm({ onSubmit: formData => { ...} });
return <form {...form.bind}> ... </form>
```

#### `error: string`

Any errors that occur related to form submission will be found here.

#### `removeField: (name: string) => void`

Removes a field from the form. 

#### `setErrors: (errors: object = { [key: string]: string | string[] }) => void`

This method will set error messages for each key/value pair given. Each key of the errors argument should be the name of a field registered with the form. The value for each key can be an error message or collection of error messages. The matching fields, and the form, will be set to invalid as well.

#### `submitting: bool = false`

Will only be true while the form is being submitted, meaning the user has submitted the form. The form remains in a submitted state while field validation occurs as well as actual form submission. If the form is found invalid, submitting will go back to false and form submission will end.

#### `valid: bool = false`

The validity of the form. `valid` is evaluated with each form submission and when `setErrors` is invoked.

#### `validating: bool = false`

Will only be true while the form is validating fields during a form submission.

## `validators`

This library comes with a set of common validators. Each validator accepts [at least] an optional invalid message and returns a validator function `(value, formData) => string`. If a custom invalid message isn't provided, each validator has a default invalid message.

#### `between(message?, [min, max]): (value, formData) => string`

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

#### `betweenLength(message?, [min, max]): (value, formData) => string`

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

#### `decimal(message?): (value, formData) => string`

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

#### `email(message?): (value, formData) => string`

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

#### `integer(message?): (value, formData) => string`

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

#### `matchesField(message?, field): (value, formData) => string`

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

#### `max(message?, max): (value, formData) => string`

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

#### `maxLength(message?, max): (value, formData) => string`

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

#### `min(message?, min): (value, formData) => string`

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

#### `minLength(message?, min): (value, formData) => string`

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

#### `required(message?): (value, formData) => string`

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

#### `string(message?): (value, formData) => string`

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
