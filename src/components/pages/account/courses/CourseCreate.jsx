import React, { useEffect } from 'react'
import Layout from '../../../common/Layout'
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import UserSidebar from '../../../common/UserSidebar';

import axiosInstance from '../../../../api/axios';
import toast from 'react-hot-toast';
import { useState } from 'react';

const CourseCreate = () => {
    const { register, handleSubmit, formState: { errors }, setError,reset } = useForm();
    const navigate = useNavigate();
   
   

    const courseCreate = (data) => {
        axiosInstance.post('/courses', data)
            .then(response => {
                toast.success("Course Created Successfully");
                navigate('/account/course/edit/'+response.data.id);
            })
            .catch(error => {
                console.log(error);
                const errors = error.response?.data?.errors;
                Object.keys(errors).forEach(key => {
                    setError(key, { message: errors[key][0] })
                })
            })
    }

    
    return (
        <Layout>

            <section className='section-4'>
                <div className='container pb-5 pt-3'>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/account">Account</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">Create Course</li>
                        </ol>
                    </nav>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <div className='d-flex justify-content-between'>
                                <h2 className='h4 mb-0 pb-0'>Create Course</h2>
                            </div>
                        </div>
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>
                        <div className='col-lg-9'>

                            <div className="container mt-4">
                                <div className="row">
                                    <div className="card">
                                        <div className="card-body">
                                            <form onSubmit={handleSubmit(courseCreate)}>
                                                <div className="form-group mb-3">
                                                    <label className="form-label">Course Title</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        {...register("title", {
                                                            required: "Course title is required",
                                                            minLength: {
                                                                value: 3,
                                                                message: "Course title must be at least 3 characters"
                                                            },
                                                            maxLength: {
                                                                value: 255,
                                                                message: "Course title must not exceed 255 characters"
                                                            }
                                                        })}
                                                    />
                                                    {errors.title && (
                                                        <small className="text-danger">{errors.title.message}</small>
                                                    )}
                                                </div>
                                                <button type="submit" className="btn btn-primary w-100">
                                                    Save
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}

export default CourseCreate