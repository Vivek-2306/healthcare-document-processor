import * as yup from 'yup';

export const loginSchema = yup.object({
    email: yup
        .string()
        .email('Invalid email address')
        .required('Email is required'),
    password: yup
        .string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
});

export const registerSchema = yup.object({
    email: yup
        .string()
        .email('Invalid email address')
        .required('Email is required'),
    password: yup
        .string()
        .min(8, 'Password must be at least 8 characters')
        .required('Password is required'),
    confirm_password: yup
        .string()
        .oneOf([yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
    full_name: yup
        .string()
        .min(2, 'Full name must be at least 2 characters')
        .required('Full name is required'),
});

export const passwordChangeSchema = yup.object({
    current_password: yup.string().required('Current password is required'),
    new_password: yup
        .string()
        .min(8, 'Password must be at least 8 characters')
        .required('New password is required'),
    confirm_password: yup
        .string()
        .oneOf([yup.ref('new_password')], 'Passwords must match')
        .required('Confirm password is required'),
});