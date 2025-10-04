import React, { use, useEffect, useRef, useMemo, useState } from 'react'
import UserSidebar from '../../../common/UserSidebar'
import { set, useForm } from "react-hook-form";
import Layout from '../../../common/Layout';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../../../../api/axios';
import JoditEditor from 'jodit-react';
import toast from 'react-hot-toast';

const EditLesson = ({ placeholder }) => {

    const params = useParams();
    const [course, setCourse] = useState(null);
    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(false);
    const [checked, setChecked] = useState(false);

    const editor = useRef(null);
    const [content, setContent] = useState('');

    const config = useMemo(() => ({
        readonly: false, // all options from https://xdsoft.net/jodit/docs/,
        placeholder: placeholder || ''
    }),
        [placeholder]
    );


    const fetchCourse = () => {
        axiosInstance.get(`/courses/${params.courseId}`)
            .then(response => {
                setCourse(response.data);
            })
            .catch(error => {
                console.log(error);
            })
    }
    const fetchLesson = () => {
        axiosInstance.get(`/lessons/${params.lessonId}`)
            .then(response => {
                setLesson(response.data);
                setChecked(response.data.is_free_preview);
                setContent(response.data.description);
                reset({
                    title: response.data.title,
                    chapter_id: response.data.chapter_id,
                    duration: response.data.duration,
                    status: response.data.status,
                });
            })
            .catch(error => {
                console.log(error);
            })
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm();

    const onSubmit = (data) => {
        data.description = content;
        data.is_free_preview = checked;
        setLoading(true);
        axiosInstance.put(`/lessons/${params.lessonId}`, data)
            .then(response => {
                toast.success('Lesson updated successfully');
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
            });
    };

    useEffect(() => {
        fetchLesson();
        fetchCourse();
    }, [])
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
                                                            {...register("chapter_id", { required: "Chapter is required" })}
                                                        >
                                                            <option value="">Select Chapter</option>
                                                            {
                                                                course && course.chapters && course.chapters.map(chapter => (
                                                                    <option value={chapter.id} key={chapter.id}>{chapter.title}</option>
                                                                ))
                                                            }
                                                        </select>
                                                        {errors.chapter_id && (
                                                            <div className="text-danger">{errors.chapter_id.message}</div>
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

                                                        <JoditEditor
                                                            ref={editor}
                                                            value={content}
                                                            config={config}
                                                            tabIndex={1} // tabIndex of textarea
                                                            onBlur={newContent => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
                                                            onChange={newContent => { }}
                                                        />
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
                                                            <option value="1">Active</option>
                                                            <option value="0">Inactive</option>
                                                        </select>
                                                        {errors.status && (
                                                            <div className="text-danger">{errors.status.message}</div>
                                                        )}
                                                    </div>


                                                    {/* Free Lesson */}
                                                    <div className="mb-3">
                                                        <label className="form-label">Free Lesson</label>
                                                        <input
                                                            checked={checked}
                                                            onChange={(e) => setChecked(e.target.checked)}
                                                            type="checkbox" className='form-check-input ms-2'
                                                        />
                                                        {errors.is_free_preview && (
                                                            <div className="invalid-feedback">{errors.is_free_preview.message}</div>
                                                        )}
                                                    </div>

                                                    {/* Submit Button */}
                                                    <button disabled={loading} type="submit" className="btn btn-primary">
                                                        {
                                                            loading ? 'Saving...' : 'Save'
                                                        }
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