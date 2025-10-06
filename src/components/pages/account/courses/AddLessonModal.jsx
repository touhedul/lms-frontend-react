import React, { useEffect, useState } from 'react'


import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../../../api/axios';
import toast from 'react-hot-toast';

const AddLessonModal = ({ addLessonToChapter,showLessonAddModal,handleCloseLessonAddModal,chapters}) => {

    const { register, handleSubmit, formState: { errors }, setError, reset } = useForm();

    const [loading, setLoading] = useState(false);

    const addLesson = (data) => {
        setLoading(true);
        axiosInstance.post('/lessons', data)
            .then(response => {
                toast.success('Lesson added successfully');
                console.log('Lesson added:', response.data);
                addLessonToChapter(response.data);
                reset();
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
                handleCloseLessonAddModal();
            })
    }


    return (
        <>
            <Modal show={showLessonAddModal} onHide={handleCloseLessonAddModal}>
                <form onSubmit={handleSubmit(addLesson)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Lesson</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Select Chapter */}
                        <div className="mb-3">
                            <select className='form-control' {...register('chapter_id',{required:'This is required'})}>
                                <option value="">Select Chapter</option>
                                {
                                    chapters.map(chapter => (
                                        <option value={chapter.id}> {chapter.title}</option>
                                    ))
                                }
                            </select>
                            {errors.chapter_id && <p className="text-danger">{errors.chapter_id.message}</p>}
                        </div>
                        {/* Title */}
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Lessaon"
                                {...register('title', { required: 'This is required' })}
                            />
                            {errors.title && <p className="text-danger">{errors.title.message}</p>}
                        </div>

                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseLessonAddModal}>
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

export default AddLessonModal