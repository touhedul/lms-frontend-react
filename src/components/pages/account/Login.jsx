import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Layout from '../../common/Layout'
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { apiUrl } from '../../common/Config';
import toast from 'react-hot-toast';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
    const { register, handleSubmit, formState: { errors }, setError } = useForm();
    const {login} = useContext(AuthContext);
    const navigate = useNavigate();
    const loginSubmit = (data) => {
        axios.post(`${apiUrl}/login`, data)
        .then(response => {
            const userInfo = {
                id: response.data.user.id,
                name: response.data.user.name,
                email: response.data.user.email,
                token: response.data.token
            };
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            toast.success("Login successful");
            login(userInfo);
            navigate('/account/dashboard');

        })
        .catch(error => {
            toast.error(error.response?.data?.message || "Login failed");
            const errors = error.response?.data?.errors;
            Object.keys(errors).forEach(key => {
                setError(key, { message: errors[key][0] })
            })
        })
    }
    return (
        <>
            <Layout>
                <div className='container py-5 mt-5'>
                    <div className='d-flex align-items-center justify-content-center'>
                        <form onSubmit={handleSubmit(loginSubmit)}>
                            <div className='card border-0 shadow login'>
                                <div className='card-body p-4'>
                                    <h3 className='border-bottom pb-3 mb-3'>Login</h3>
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
                                                })}
                                            type="text" className='form-control' placeholder='Email' />
                                        {errors.email && <p className='text-danger'>{errors.email.message}</p>}
                                    </div>

                                    <div className='mb-3'>
                                        <label className='form-label' htmlFor="password">Password</label>
                                        <input
                                            {
                                            ...register('password', {
                                                required: "Password is required"
                                            })
                                            }
                                            type="password" className='form-control'
                                            placeholder='Password' />
                                        {errors.password && <p className='text-danger'>{errors.password.message}</p>}
                                    </div>

                                    <div className='d-flex justify-content-between align-items-center'>
                                        <button type='submit' className='btn btn-primary'>Login</button>
                                        <Link to={`/account/register`} className='text-secondary'>Register Here</Link>
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

export default Login
