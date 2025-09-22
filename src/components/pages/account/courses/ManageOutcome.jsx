import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import axiosInstance from '../../../../api/axios';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { MdDragIndicator } from 'react-icons/md';
import { BsPencilSquare } from 'react-icons/bs';
import { FaTrashAlt } from 'react-icons/fa';

const ManageOutcome = () => {

    const { register, handleSubmit, formState: { errors }, setError, reset } = useForm();
    const [loading, setLoading] = useState(false);
    const [outcomes, setOutcomes] = useState([]);

    const params = useParams();

    const addOutcome = (data) => {
        setLoading(true);
        data.course_id = params.id;
        axiosInstance.post('/outcomes', data)
            .then(response => {
                toast.success('Outcome added successfully');
                reset();
                const newOutcome = response.data;
                setOutcomes([...outcomes, newOutcome]);
                // getOutcomes();
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

    const getOutcomes = () => {
        axiosInstance.get('/outcomes?course_id=' + params.id)
            .then(response => {
                setOutcomes(response.data);
            })
    }

    useEffect(() => {
        getOutcomes();
    }, [])
    return (
        <div className="card">
            <div className="card-header">
                <h5 className="card-title mb-0">Outcomes</h5>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit(addOutcome)}>
                    {/* Title */}
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Outcome"
                            {...register('text', { required: 'This is required' })}
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
                {outcomes && outcomes.map((outcome) => (
                    <div className='card shadow mb-2' key={outcome.id}>
                        <div className='card-body p-2 d-flex'>
                            <div><MdDragIndicator /></div>
                            <div className='d-flex justify-content-between w-100'>
                                <div className='ps-2'>
                                    {outcome.text}
                                </div>
                                <div className='d-flex'>
                                    <a href='' className='text-primary me-1'>
                                        <BsPencilSquare />
                                    </a>
                                    <a href='' className='text-danger'>
                                        <FaTrashAlt />
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                ))}
            </div>
        </div>
    )
}

export default ManageOutcome