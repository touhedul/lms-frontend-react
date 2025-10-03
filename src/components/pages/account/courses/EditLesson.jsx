import React from 'react'
import UserSidebar from '../../../common/UserSidebar'
import { useForm } from "react-hook-form";
import Layout from '../../../common/Layout';
import { Link } from 'react-router-dom';

const EditLesson = () => {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        console.log(data);
        alert("Form submitted! Check console for data.");
    };
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
                                <h2 className='h4 mb-0 pb-0'>Edit Lesson</h2>
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
                                                <h5 className="card-title mb-0">Lesson Details</h5>
                                            </div>
                                            <div className="card-body">
                                                <form onSubmit={handleSubmit(onSubmit)}>
                                                    {/* Title */}
                                                    <div className="mb-3">
                                                        <label className="form-label">Title</label>
                                                        <input
                                                            type="text"
                                                            className={`form-control ${errors.title ? "is-invalid" : ""}`}
                                                            {...register("title", { required: "Title is required" })}
                                                            placeholder="Enter course title"
                                                        />
                                                        {errors.title && (
                                                            <div className="invalid-feedback">{errors.title.message}</div>
                                                        )}
                                                    </div>

                                                    {/* Chapter */}
                                                    <div className="mb-3">
                                                        <label className="form-label">Chapter</label>
                                                        <select
                                                            className="form-select"
                                                            {...register("chapter", { required: "Chapter is required" })}
                                                        >
                                                            <option value="">Select Chapter</option>
                                                            <option value="module1">Module 1: Getting Started with Web Development</option>
                                                            <option value="module2">Module 2: HTML & CSS Basics</option>
                                                            <option value="module3">Module 3: JavaScript Introduction</option>
                                                        </select>
                                                        {errors.chapter && (
                                                            <div className="text-danger">{errors.chapter.message}</div>
                                                        )}
                                                    </div>

                                                    {/* Duration */}
                                                    <div className="mb-3">
                                                        <label className="form-label">Duration (in minutes)</label>
                                                        <input
                                                            type="number"
                                                            className={`form-control ${errors.duration ? "is-invalid" : ""}`}
                                                            {...register("duration", {
                                                                required: "Duration is required",
                                                                min: { value: 1, message: "Must be at least 1 minute" },
                                                            })}
                                                            placeholder="Enter duration"
                                                        />
                                                        {errors.duration && (
                                                            <div className="invalid-feedback">{errors.duration.message}</div>
                                                        )}
                                                    </div>

                                                    {/* Description */}
                                                    <div className="mb-3">
                                                        <label className="form-label">Description</label>
                                                        <textarea
                                                            className={`form-control ${errors.description ? "is-invalid" : ""}`}
                                                            rows="4"
                                                            {...register("description", {
                                                                required: "Description is required",
                                                            })}
                                                            placeholder="Enter course description"
                                                        ></textarea>
                                                        {errors.description && (
                                                            <div className="invalid-feedback">{errors.description.message}</div>
                                                        )}
                                                    </div>

                                                    {/* Status */}
                                                    <div className="mb-3">
                                                        <label className="form-label">Status</label>
                                                        <select
                                                            className="form-select"
                                                            {...register("status", { required: "Status is required" })}
                                                        >
                                                            <option value="active">Active</option>
                                                            <option value="inactive">Inactive</option>
                                                            <option value="draft">Draft</option>
                                                        </select>
                                                        {errors.status && (
                                                            <div className="text-danger">{errors.status.message}</div>
                                                        )}
                                                    </div>

                                                    {/* Submit Button */}
                                                    <button type="submit" className="btn btn-primary">
                                                        Save
                                                    </button>
                                                </form>
                                            </div>
                                        </div>

                                        <br />
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

export default EditLesson