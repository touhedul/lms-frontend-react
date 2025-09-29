import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../../api/axios';
import toast from 'react-hot-toast';

const ManageChapter = () => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm();

    const params = useParams();

    const addChapter = (data) => {
        setLoading(true);
        data.course_id = params.id;
        axiosInstance.post('/chapters', data)
            .then(response => {
                toast.success('Chapter added successfully');
                reset();
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
  return (
    <>
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title mb-0">Chapters</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(addChapter)}>
                        {/* Title */}
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Chapters"
                                {...register('title', { required: 'This is required' })}
                            />
                            {errors.text && <p className="text-danger">{errors.text.message}</p>}
                        </div>

                        <button disabled={loading} type="submit" className="btn btn-success w-100">
                            {
                                loading ? 'Saving...' : 'Save'
                            }
                        </button>
                    </form>

                    <hr />
                </div>
            </div>
        </>
  )
}

export default ManageChapter