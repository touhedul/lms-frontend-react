import React, { useEffect, useState } from 'react'
import { set, useForm } from 'react-hook-form'
import axiosInstance from '../../../../api/axios';
import toast from 'react-hot-toast';
import { Link, useParams } from 'react-router-dom';
import { MdDragIndicator } from 'react-icons/md';
import { BsPencilSquare } from 'react-icons/bs';
import { FaTrashAlt } from 'react-icons/fa';
import UpdateOutcomeModal from './UpdateOutcomeModal';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";


const ManageOutcome = () => {

    const { register, handleSubmit, formState: { errors }, setError, reset } = useForm();
    const [loading, setLoading] = useState(false);
    const [outcomes, setOutcomes] = useState([]);
    const [outcomeData, setOutcomeData] = useState(null);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const handleShow = (outcome) => {
        setOutcomeData(outcome);
        setShow(true);
    }

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(outcomes);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        setOutcomes(reorderedItems);
        saveOrder(reorderedItems);
    };

    const saveOrder = (sortedOutcomes) => {
        axiosInstance.post('/outcome-order',{'outcomes':sortedOutcomes})
            .then(response => {
            })
            .catch(error => {
                console.log(error);
            })
        
    }

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

    const deleteOutcome = (id) => {
        axiosInstance.delete('/outcomes/' + id)
            .then(response => {
                toast.success('Outcome deleted successfully');
                const newOutcomes = outcomes.filter(outcome => outcome.id !== id);
                setOutcomes(newOutcomes);
                // getOutcomes();
            })
            .catch(error => {
                console.log(error);
                const errors = error.response?.data?.errors;
                Object.keys(errors).forEach(key => {
                    setError(key, { message: errors[key][0] })
                })
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
        <>
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

                    <DragDropContext onDragEnd={handleDragEnd} >
                        <Droppable droppableId="list">
                            {(provided) => (
                                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                    {
                                        outcomes.map((outcome, index) => (
                                            <Draggable key={outcome.id} draggableId={`${outcome.id}`} index={index}>

                                                {(provided) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        className="mt-2 border px-3 py-2 bg-white shadow-lg  rounded"
                                                    >

                                                            <div className='card-body p-2 d-flex'>
                                                                <div><MdDragIndicator /></div>
                                                                <div className='d-flex justify-content-between w-100'>
                                                                    <div className='ps-2'>
                                                                        {outcome.text}
                                                                    </div>
                                                                    <div className='d-flex'>
                                                                        <Link onClick={() => handleShow(outcome)} className='text-primary me-1'>
                                                                            <BsPencilSquare />
                                                                        </Link>
                                                                        <Link onClick={() => deleteOutcome(outcome.id)} className='text-danger'>
                                                                            <FaTrashAlt />
                                                                        </Link>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>
            <UpdateOutcomeModal show={show} handleClose={handleClose} outcomeData={outcomeData} outcomes={outcomes} setOutcomes={setOutcomes} />
        </>
    )
}

export default ManageOutcome