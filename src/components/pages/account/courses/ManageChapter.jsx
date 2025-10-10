import React, { useEffect, useReducer, useState } from 'react'
import { useForm } from 'react-hook-form';
import { Link, useParams } from 'react-router-dom';
import axiosInstance from '../../../../api/axios';
import toast from 'react-hot-toast';
import Accordion from 'react-bootstrap/Accordion';
import UpdateChapterModal from './UpdateChapterModal';
import AddLessonModal from './AddLessonModal';
import { BsPencilSquare } from 'react-icons/bs';
import { FaTrashAlt } from 'react-icons/fa';
import LessonSortModal from './LessonSortModal';
import ChapterSortModal from './ChapterSortModal';


const ManageChapter = ({ course }) => {
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, formState: { errors }, reset, setError } = useForm();
    const [chapterData, setChapterData] = useState(null);
    const [chaptersData, setChaptersData] = useState([]);
    const [lessons, setLessons] = useState([]);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = (chapter) => {
        setChapterData(chapter);
        setShow(true);
    }

    //Add lesson modal
    const [showLessonAddModal, setShowLessonAddModal] = useState(false);
    const handleCloseLessonAddModal = () => setShowLessonAddModal(false);
    const handleShowLessonAddModal = (chapter) => {
        setShowLessonAddModal(true);
    }
    //Sort lesson modal
    const [showLessonSortModal, setShowLessonSortModal] = useState(false);
    const handleCloseLessonSortModal = () => setShowLessonSortModal(false);
    const handleShowLessonSortModal = (lessons) => {
        setLessons(lessons);
        setShowLessonSortModal(true);
        console.log('less',lessons);

    }

    //Sort chapter modal
    const [showChapterSortModal, setShowChapterSortModal] = useState(false);
    const handleCloseChapterSortModal = () => setShowChapterSortModal(false);
    const handleShowChapterSortModal = (allChapters) => {
        console.log('chapt',allChapters);
        setChaptersData(allChapters);
        console.log('chap',chaptersData);
        setShowChapterSortModal(true);

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
            case 'DELETE_LESSON':
                return state.map(chapter => ({
                    ...chapter,
                    lessons: chapter.lessons?.filter(lesson => lesson.id !== action.payload) || []
                }));
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

    const addLessonToChapter = (lesson) => {
        setChapters({
            type: 'UPDATE_CHAPTER',
            payload: {
                ...chapters.find(c => Number(c.id) === Number(lesson.chapter_id)),
                lessons: [
                    ...(chapters.find(c => Number(c.id) === Number(lesson.chapter_id))?.lessons || []),
                    lesson
                ]
            }
        });
    };


    const deleteChapter = (id) => {
        if (!confirm('Are you sure you want to delete this chapter?')) {
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

    const deleteLesson = (id) => {
        if (!confirm('Are you sure you want to delete this lesson?')) {
            return;
        }
        axiosInstance.delete('/lessons/' + id)
            .then(response => {
                toast.success('Lesson deleted successfully');
                setChapters({ type: 'DELETE_LESSON', payload: id });
            })
            .catch(error => {
                console.log(error);
            })
    }
    return (
        <>
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="card-title mb-0">Chapters</h5>
                    <div>
                    <a className='btn btn-sm btn-primary' onClick={() => handleShowLessonAddModal(null)}>Add Lesson</a>
                    <Link onClick={() => handleShowChapterSortModal(chapters)} className='btn btn-sm btn-warning ms-2'>Reorder list</Link>
                    </div>
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
                                            <div className='d-flex justify-content-between align-items-center mb-2'>
                                                <h5>Lessons</h5>
                                                <Link onClick={() => handleShowLessonSortModal(chapter.lessons)} className='text-primary'>Reorder list</Link>
                                            </div>

                                            {
                                                chapter.lessons && chapter.lessons.map(lesson => {
                                                    return (
                                                        <div className='card shadow mb-2 p-2 d-flex'>
                                                            <div className='d-flex justify-content-between w-100'>
                                                                <div className='ps-2'>
                                                                    {lesson.title}
                                                                </div>
                                                                <div className='d-flex'>
                                                                    {
                                                                        lesson.duration > 0 &&
                                                                        <small className='fw-bold text-muted me-2'>20 min</small>
                                                                    }
                                                                    {
                                                                        lesson.is_free_preview > 0 &&
                                                                        <span className='badge bg-success me-2'>Preview</span>
                                                                    }
                                                                    <Link to={`/account/course/edit/${course.id}/lesson/edit/${lesson.id}`} className='text-primary me-2'>
                                                                        <BsPencilSquare />
                                                                    </Link>
                                                                    <Link className='text-danger' onClick={() => deleteLesson(lesson.id)}>
                                                                        <FaTrashAlt />
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                            <br />
                                            <button className='btn btn-warning btn-sm' onClick={() => handleShow(chapter)}>Update</button>
                                            <button className='btn btn-danger ms-2 btn-sm' onClick={() => deleteChapter(chapter.id)}>Delete</button>
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

            <AddLessonModal addLessonToChapter={addLessonToChapter} showLessonAddModal={showLessonAddModal} handleCloseLessonAddModal={handleCloseLessonAddModal} chapters={chapters} />

            <LessonSortModal showLessonSortModal={showLessonSortModal} handleCloseLessonSortModal={handleCloseLessonSortModal} lessonData={lessons} setChapters={setChapters} />

            <ChapterSortModal showChapterSortModal={showChapterSortModal} handleCloseChapterSortModal={handleCloseChapterSortModal} allChaptersData={chaptersData} setChapters={setChapters} />

        </>
    )
}

export default ManageChapter