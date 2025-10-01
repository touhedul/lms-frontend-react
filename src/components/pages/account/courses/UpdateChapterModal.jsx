import React, { useEffect, useState } from 'react'


import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../../../api/axios';
import toast from 'react-hot-toast';

const UpdateChapterModal = ({ show, handleClose, chapterData, chapters, setChapters }) => {

    const { register, handleSubmit, formState: { errors }, setError, reset } = useForm();

    const [loading, setLoading] = useState(false);

    const updateChapter = (data) => {
        setLoading(true);
        axiosInstance.put('/chapters/' + chapterData.id, data)
            .then(response => {
                toast.success('Chapter updated successfully');
                
                setChapters({ type: 'UPDATE_CHAPTER', payload: response.data });
                // const updatedChapters = chapters.map(chapter => 
                //     chapter.id === chapterData.id ? response.data : chapter
                // );
                // setChapters(updatedChapters);
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
        if (chapterData) {
            reset({
                title: chapterData.title
            });
        }

    }, [chapterData])
    return (
        <>
            <Modal show={show} onHide={handleClose}>
                <form onSubmit={handleSubmit(updateChapter)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Update Chapter</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* Title */}
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Chapter"
                                {...register('title', { required: 'This is required' })}
                            />
                            {errors.title && <p className="text-danger">{errors.title.message}</p>}
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

export default UpdateChapterModal