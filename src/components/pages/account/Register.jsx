import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../../common/Layout'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { apiUrl } from '../../common/Config'
import toast from 'react-hot-toast'

const Register = () => {

    const { register, handleSubmit, formState: { errors }, setError } = useForm();

    const navigate = useNavigate();

    const registerSubmit = (data) => {
        axios.post(`${apiUrl}/register`, data)
            .then(response => {
                toast.success("Registration successful. Please login.");
                navigate('/account/login');
            })
            .catch(error => {
                toast.error(error.response?.data?.message || "Registration failed");
                const errors = error.response?.data?.errors;
                Object.keys(errors).forEach(key => {
                    setError(key, { message: errors[key][0] })
                })
            });
    }
    return (
        <>
            <Layout>
                <div className='container py-5 mt-5'>
                    <div className='d-flex align-items-center justify-content-center'>
                        <form onSubmit={handleSubmit(registerSubmit)}>
                            <div className='card border-0 shadow register'>
                                <div className='card-body p-4'>
                                    <h3 className='border-bottom pb-3 mb-3'>Register</h3>

                                    <div className='mb-3'>
                                        <label className='form-label' htmlFor="name">Name</label>
                                        <input
                                            {...register('name', {
                                                required: 'Name is required',
                                                minLength: { value: 3, message: 'Name must be at least 3 characters' },
                                                maxLength: { value: 50, message: 'Name must be at most 50 characters' }
                                            })}
                                            type="text"
                                            className={`form-control`}
                                            placeholder='Name' />
                                        {errors.name && <span className='text-danger'>{errors.name.message}</span>}
                                    </div>


                                    <div className='mb-3'>
                                        <label className='form-label' htmlFor="email">Email</label>
                                        <input
                                            {...register('email',
                                                {
                                                    required: 'Email is required',
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: 'Invalid email address'
                                                    },

                                                    maxLength: { value: 150, message: 'Email must be at most 50 characters' }

                                                })}
                                            type="text" className={`form-control`}
                                            placeholder='Email' />
                                        {errors.email && <span className='text-danger'>{errors.email.message}</span>}

                                    </div>

                                    <div className='mb-3'>
                                        <label className='form-label' htmlFor="password">Password</label>
                                        <input
                                            {...register('password', { 
                                                required: 'Password is required' ,
                                                minLength: { value: 8, message: 'Password must be at least 8 characters' }
                                            })}
                                            type="password"
                                            className={`form-control`}
                                            placeholder='Password' />
                                        {errors.password && <span className='text-danger'>{errors.password.message}</span>}
                                    </div>

                                    <div>
                                        <button type='submit' className='btn btn-primary w-100'>Register</button>
                                    </div>

                                    <div className='d-flex justify-content-center py-3'>
                                        Already have account? &nbsp;<Link className='text-secondary' to={`/account/login`}> Login</Link>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </Layout>
        </>
    )
}

export default Register
