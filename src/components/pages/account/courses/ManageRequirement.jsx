import React, { useEffect, useState } from 'react'
import { set, useForm } from 'react-hook-form'
import axiosInstance from '../../../../api/axios';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import { MdDragIndicator } from 'react-icons/md';
import { BsPencilSquare } from 'react-icons/bs';
import { FaTrashAlt } from 'react-icons/fa';
import UpdateRequirementModal from './UpdateRequirementModal';

const ManageRequirement = () => {

    const { register, handleSubmit, formState: { errors }, setError, reset } = useForm();
    const [loading, setLoading] = useState(false);
    const [requirements, setRequirements] = useState([]);
    const [requirementData, setRequirementData] = useState(null);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const handleShow = (requirement) => {
        setRequirementData(requirement);
        setShow(true);
    }
        

    const params = useParams();

    const addRequirement = (data) => {
        setLoading(true);
        data.course_id = params.id;
        axiosInstance.post('/requirements', data)
            .then(response => {
                toast.success('Requirement added successfully');
                reset();
                const newRequirement = response.data;
                setRequirements([...requirements, newRequirement]);
                // getRequirements();
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

    const deleteRequirement = (id) => {
        axiosInstance.delete('/requirements/'+id)
            .then(response => {
                toast.success('Requirement deleted successfully');
                const newRequirements = requirements.filter(requirement => requirement.id !== id);
                setRequirements(newRequirements);
                // getRequirements();
            })
            .catch(error => {
                console.log(error);
                const errors = error.response?.data?.errors;
                Object.keys(errors).forEach(key => {
                    setError(key, { message: errors[key][0] })
                })
            })

    }



    const getRequirements = () => {
        axiosInstance.get('/requirements?course_id=' + params.id)
            .then(response => {
                setRequirements(response.data);
            })
    }

    useEffect(() => {
        getRequirements();
    }, [])
    return (
        <>
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title mb-0">Requirements</h5>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit(addRequirement)}>
                        {/* Title */}
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Requirement"
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
                    {requirements && requirements.map((requirement) => (
                        <div className='card shadow mb-2' key={requirement.id}>
                            <div className='card-body p-2 d-flex'>
                                <div><MdDragIndicator /></div>
                                <div className='d-flex justify-content-between w-100'>
                                    <div className='ps-2'>
                                        {requirement.text}
                                    </div>
                                    <div className='d-flex'>
                                        <Link onClick={()=>handleShow(requirement)} className='text-primary me-1'>
                                            <BsPencilSquare />
                                        </Link>
                                        <Link onClick={()=>deleteRequirement(requirement.id)} className='text-danger'>
                                            <FaTrashAlt />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                    ))}
                </div>
            </div>
            <UpdateRequirementModal show={show} handleClose={handleClose} requirementData={requirementData} requirements={requirements} setRequirements={setRequirements} />
        </>
    )
}

export default ManageRequirement