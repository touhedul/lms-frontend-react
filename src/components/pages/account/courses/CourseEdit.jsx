import React, { useEffect, useState } from 'react'
import Layout from '../../../common/Layout'
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useParams } from 'react-router-dom';
import UserSidebar from '../../../common/UserSidebar';

import axiosInstance from '../../../../api/axios';
import toast from 'react-hot-toast';
import ManageOutcome from './ManageOutcome';
import ManageRequirement from './ManageRequirement';
import CoverImage from './CoverImage';
import ManageChapter from './ManageChapter';

const CourseEdit = () => {
    const { register, handleSubmit, formState: { errors }, setError, reset } = useForm();
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [languages, setLanguages] = useState([]);
    const params = useParams();
    const [course, setCourse] = useState({});
    const [courseStatus,setCourseStatus] = useState(false);

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

    const getCourse = () => {
        axiosInstance.get('/courses/'+params.id) // Change 1 to dynamic course ID when needed
            .then(response => {
                const course = response.data;
                reset({
                    title: course.title,
                    category_id: course.category_id,
                    level_id: course.level_id,
                    language_id: course.language_id,
                    description: course.description,
                    price: course.price,
                    cross_price: course.cross_price,
                });
                setCourse(course);
                setCourseStatus(course.status);
            })
            .catch(error => {
                console.log(error);
            })
    }
    useEffect(() => {
        getCourse();
        getMetadata();
    }, [])

    const courseEdit = (data) => {
        setLoading(true);
        axiosInstance.put('/courses/'+params.id, data)
            .then(response => {
                toast.success("Course Updated Successfully");
                
            })
            .catch(error => {
                console.log(error);
                const errors = error.response?.data?.errors;
                Object.keys(errors).forEach(key => {
                    setError(key, { message: errors[key][0] })
                })
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const publishUnpublishCourse = ()=>{
        axiosInstance.post(`/courses/publish-unpublish/${course.id}`)
        .then(response=>{
            toast.success('Success');
            setCourseStatus(response.data.status);
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
                                {
                                    courseStatus == true && 
                                    <button onClick={publishUnpublishCourse} className='btn btn-warning'>Unpublish</button>
                                }
                                {
                                    courseStatus == false && 
                                    <button onClick={publishUnpublishCourse} className='btn btn-primary'>Publish</button>
                                }
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
                                                            {...register("title", { required: "This field is required" })}
                                                        />
                                                        {errors.title && (
                                                            <small className="text-danger">{errors.title.message}</small>
                                                        )}
                                                    </div>

                                                    {/* Category */}
                                                    <div className="mb-3">
                                                        <label className="form-label">Category</label>
                                                        <select className="form-select" {...register("category_id", { required: "This field is required" })}>
                                                            <option value="">Select a Category</option>
                                                            {
                                                                categories && categories.map((category) => (
                                                                    <option key={category.id} value={category.id}>{category.name}</option>
                                                                ))
                                                            }
                                                        </select>
                                                        {errors.category && (
                                                            <small className="text-danger">{errors.category.message}</small>
                                                        )}
                                                    </div>

                                                    {/* Level */}
                                                    <div className="mb-3">
                                                        <label className="form-label">Level</label>
                                                        <select className="form-select" {...register("level_id", { required: "This field is required" })}>
                                                            <option value="">Select a Level</option>
                                                            {
                                                                levels && levels.map((level) => (
                                                                    <option key={level.id} value={level.id}>{level.name}</option>
                                                                ))
                                                            }
                                                        </select>
                                                        {errors.level && (
                                                            <small className="text-danger">{errors.level.message}</small>
                                                        )}
                                                    </div>

                                                    {/* Language */}
                                                    <div className="mb-3">
                                                        <label className="form-label">Language</label>
                                                        <select className="form-select" {...register("language_id", { required: "This field is required" })}>
                                                            <option value="">Select a Language</option>
                                                            {
                                                                languages && languages.map((language) => (
                                                                    <option key={language.id} value={language.id}>{language.name}</option>
                                                                ))
                                                            }
                                                        </select>
                                                        {errors.language && (
                                                            <small className="text-danger">{errors.language.message}</small>
                                                        )}
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
                                                        {errors.description && (
                                                            <small className="text-danger">{errors.description.message}</small>
                                                        )}
                                                    </div>

                                                    {/* Pricing Section */}
                                                    <h6 className="mb-3">Pricing</h6>
                                                    <div className="mb-3">
                                                        <label className="form-label">Sell Price</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Sell Price"
                                                            {...register("price", { required: "This field is required" })}
                                                        />
                                                        {errors.price && (
                                                            <small className="text-danger">{errors.price.message}</small>
                                                        )}
                                                    </div>

                                                    <div className="mb-4">
                                                        <label className="form-label">Cross Price</label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            placeholder="Cross Price"
                                                            {...register("cross_price")}
                                                        />
                                                        {errors.cross_price && (
                                                            <small className="text-danger">{errors.cross_price.message}</small>
                                                        )}
                                                    </div>

                                                    {/* Submit Button */}
                                                    <button disabled={loading} type="submit" className="btn btn-success w-100">

                                                        {
                                                            loading == true ? 'Updating...' : 'Update'
                                                        }
                                                    </button>
                                                </form>
                                            </div>
                                        </div>

                                        <br />
                                        <ManageChapter course={course} />
                                    </div>
                                    <div className='col-md-5'>

                                          <ManageOutcome />
                                          <br />
                                          <ManageRequirement />
                                          <br />
                                          <CoverImage course={course} setCourse={setCourse}/>
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