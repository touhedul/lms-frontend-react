import React, { useEffect, useState } from 'react'
import Layout from '../../../common/Layout'
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import UserSidebar from '../../../common/UserSidebar';

import axiosInstance from '../../../../api/axios';
import toast from 'react-hot-toast';

const CourseEdit = () => {
    const { register, handleSubmit, formState: { errors }, setError, reset } = useForm();
    const navigate = useNavigate();
     const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [languages, setLanguages] = useState([]);

     const getMetadata = () => {
        axiosInstance.get('/course-metadata')
            .then(response => {
                setCategories(response.data.categories);
                setLevels(response.data.levels);
                setLanguages(response.data.languages);
            })
            .catch(error => {
                console.log(error);
            })
    }
    useEffect(()=>{
            getMetadata();
        },[])

    const courseEdit = (data) => {
        axiosInstance.post('/courses', data)
            .then(response => {
                toast.success("Course Created Successfully");
                reset();
                navigate('/account/course/edit/' + response.data.id);
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
                            <li className="breadcrumb-item active" aria-current="page">Edit Course</li>
                        </ol>
                    </nav>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <div className='d-flex justify-content-between'>
                                <h2 className='h4 mb-0 pb-0'>Edit Course</h2>
                            </div>
                        </div>
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar />
                        </div>
                        <div className='col-lg-9'>

                            <div className="container mt-4">
                                <div className="row">
                                    <div className='col-md-7'>

                                        <div className="card">
                                            <div className="card-header">
                                                <h5 className="card-title mb-0">Course Details</h5>
                                            </div>
                                            <div className="card-body">
                                                <form onSubmit={handleSubmit(courseEdit)}>
                                                    {/* Title */}
                                                    <div className="mb-3">
                                                        <label className="form-label">Title</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Title"
                                                            {...register("title")}
                                                        />
                                                    </div>

                                                    {/* Category */}
                                                    <div className="mb-3">
                                                        <label className="form-label">Category</label>
                                                        <select className="form-select" {...register("category")}>
                                                            <option value="">Select a Category</option>
                                                            {
                                                                categories && categories.map((category) => (
                                                                    <option key={category.id} value={category.id}>{category.name}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>

                                                    {/* Level */}
                                                    <div className="mb-3">
                                                        <label className="form-label">Level</label>
                                                        <select className="form-select" {...register("level")}>
                                                            <option value="">Select a Level</option>
                                                            {
                                                                levels && levels.map((level) => (
                                                                    <option key={level.id} value={level.id}>{level.name}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>

                                                    {/* Language */}
                                                    <div className="mb-3">
                                                        <label className="form-label">Language</label>
                                                        <select className="form-select" {...register("language")}>
                                                            <option value="">Select a Language</option>
                                                            {
                                                                languages && languages.map((language) => (
                                                                    <option key={language.id} value={language.id}>{language.name}</option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>

                                                    {/* Description */}
                                                    <div className="mb-4">
                                                        <label className="form-label">Description</label>
                                                        <textarea
                                                            className="form-control"
                                                            rows="3"
                                                            placeholder="Description"
                                                            {...register("description")}
                                                        ></textarea>
                                                    </div>

                                                    {/* Pricing Section */}
                                                    <h6 className="mb-3">Pricing</h6>
                                                    <div className="mb-3">
                                                        <label className="form-label">Sell Price</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Sell Price"
                                                            {...register("sell_price")}
                                                        />
                                                    </div>

                                                    <div className="mb-4">
                                                        <label className="form-label">Cross Price</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Cross Price"
                                                            {...register("cross_price")}
                                                        />
                                                    </div>

                                                    {/* Submit Button */}
                                                    <button type="submit" className="btn btn-success w-100">
                                                        Update
                                                    </button>
                                                </form>
                                            </div>
                                        </div>

                                    </div>
                                    <div className='col-md-5'>

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

export default CourseEdit