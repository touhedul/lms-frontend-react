import React, { useEffect, useState } from 'react'


import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../../../api/axios';
import toast from 'react-hot-toast';

const UpdateOutcomeModal = ({ show, handleClose, outcomeData, outcomes, setOutcomes }) => {

    const { register, handleSubmit, formState: { errors }, setError, reset } = useForm();

    const [loading, setLoading] = useState(false);

    const updateOutcome = (data) => {
        setLoading(true);
        axiosInstance.put('/outcomes/' + outcomeData.id, data)
            .then(response => {
                toast.success('Outcome updated successfully');
                const updatedOutcomes = outcomes.map(outcome => 
                    outcome.id === outcomeData.id ? response.data : outcome
                );
                setOutcomes(updatedOutcomes);
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
        if (outcomeData) {
            reset({
                text: outcomeData.text
            });
        }

    }, [outcomeData])
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <form onSubmit={handleSubmit(updateOutcome)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Outcome</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
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

export default UpdateOutcomeModal