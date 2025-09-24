import React, { useEffect, useState } from 'react'


import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../../../api/axios';
import toast from 'react-hot-toast';

const UpdateRequirementModal = ({ show, handleClose, requirementData, requirements, setRequirements }) => {

    const { register, handleSubmit, formState: { errors }, setError, reset } = useForm();

    const [loading, setLoading] = useState(false);

    const updateRequirement = (data) => {
        setLoading(true);
        axiosInstance.put('/requirements/' + requirementData.id, data)
            .then(response => {
                toast.success('Requirement updated successfully');
                const updatedRequirements = requirements.map(requirement => 
                    requirement.id === requirementData.id ? response.data : requirement
                );
                setRequirements(updatedRequirements);
            })
            .catch(error => {
                console.log(error);
                const errors = error.response?.data?.errors;
                Object.keys(errors).forEach(key => {
                    setError(key, { message: errors[key][0] })
                })
            })
            .finally(() => {
                handleClose();
                setLoading(false);
            })
    }

    useEffect(() => {
        if (requirementData) {
            reset({
                text: requirementData.text
            });
        }

    }, [requirementData])
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <form onSubmit={handleSubmit(updateRequirement)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Requirement</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
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

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button disabled={loading} variant="primary" type='submit'>
                             {
                                loading ? 'Saving...' : 'Save'
                            }
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}

export default UpdateRequirementModal