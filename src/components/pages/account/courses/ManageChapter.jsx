import React, { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../../api/axios';
import toast from 'react-hot-toast';
import Accordion from 'react-bootstrap/Accordion';
import UpdateChapterModal from './UpdateChapterModal';


const ManageChapter = ({ course }) => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm();

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const [chapterData, setChapterData] = useState(null);
    
    // const [chapters, setChapters] = useState([]);

    const handleShow = (chapter) => {
        
        setChapterData(chapter);
        setShow(true);
    }

    const chapterReducer = (state, action) => {
        switch (action.type) {
            case 'SET_CHAPTERS':
                return action.payload;
            case 'ADD_CHAPTER':
                return [...state, action.payload];

            case 'UPDATE_CHAPTER':
                return state.map(chapter => {
                    if (chapter.id == action.payload.id) {
                        return action.payload;
                    }
                    return chapter;
                })
            case 'DELETE_CHAPTER':
                return state.filter(chapter => chapter.id !== action.payload);
            default:
                return state;
        }
    }
    const [chapters, setChapters] = useReducer(chapterReducer, []);

    useEffect(() => {
        if (course.chapters) {
            setChapters({ type: 'SET_CHAPTERS', payload: course.chapters });
        }
    }, [course])

    const params = useParams();

    const addChapter = (data) => {
        setLoading(true);
        data.course_id = params.id;
        axiosInstance.post('/chapters', data)
            .then(response => {
                toast.success('Chapter added successfully');
                reset();
                setChapters({ type: 'ADD_CHAPTER', payload: response.data });
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

    const deleteChapter = (id) => {
        if(!confirm('Are you sure you want to delete this chapter?')){
            return;
        }
        axiosInstance.delete('/chapters/' + id)
            .then(response => {
                toast.success('Chapter deleted successfully');
                setChapters({ type: 'DELETE_CHAPTER', payload: id });
            })
            .catch(error => {
                console.log(error);
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


                    <Accordion>
                        {
                            chapters.map((chapter, index) => {
                                return (
                                    <Accordion.Item eventKey={index}>
                                        <Accordion.Header>{chapter.title}</Accordion.Header>
                                        <Accordion.Body>
                                            <button className='btn btn-warning btn-sm' onClick={() => handleShow(chapter)}>Update</button>
                                            <button className='btn btn-danger ms-2 btn-sm' onClick={()=>deleteChapter(chapter.id)}>Delete</button>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                );
                            }
                            )
                        }
                    </Accordion>
                </div>
            </div>

            <UpdateChapterModal show={show} handleClose={handleClose} chapterData={chapterData} chapters={chapters} setChapters={setChapters} />
        </>
    )
}

export default ManageChapter