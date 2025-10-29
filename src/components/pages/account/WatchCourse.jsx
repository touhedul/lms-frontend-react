import React, { useEffect, useState } from 'react'
import Accordion from 'react-bootstrap/Accordion';
import { MdSlowMotionVideo } from "react-icons/md";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import ProgressBar from 'react-bootstrap/ProgressBar';
import Layout from '../../common/Layout';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../api/axios';


const WatchCourse = () => {
    const params = useParams();
    const [course, setCourse] = useState({});
    const [activeLesson, setActiveLesson] = useState({});
    const fetchCourse = () => {
        axiosInstance.get(`/watch-course/${params.id}`)
            .then(response => {
                setCourse(response.data.course);
                setActiveLesson(response.data.activeLesson);
            })
            .catch(error => {
                console.log(error);
            })
    }

    useEffect(() => {
        fetchCourse();
    }, [])
    return (
        <>
            <Layout>
                <section className='section-5 mt-5'>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-md-8'>
                                <div className='video'>
                                    <video width="100%" height="500" controls>
                                        <source src="movie.mp4" type="video/mp4" />
                                        <source src="movie.ogg" type="video/ogg" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                                <div className='meta-content'>
                                    <div className='d-flex justify-content-between align-items-center border-bottom pb-2 mb-3 pt-1'>
                                        <h3 className='pt-2'>
                                            {
                                                activeLesson && activeLesson.title
                                            }
                                        </h3>
                                        <div>
                                            <a href="" className='btn btn-primary px-3'>
                                                Mark as complete <IoMdCheckmarkCircleOutline size={20} /> </a>
                                        </div>
                                    </div>
                                    <div>
                                        <p>In this chapter we will learn about html basics</p>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div className='card rounded-0'>
                                    <div className='card-body'>
                                        <div className='h6'>
                                            <strong>{course?.title}</strong>
                                        </div>
                                        <div className='py-2'>
                                            <ProgressBar now={0} />
                                            <div className='pt-2'>
                                                0% complete
                                            </div>
                                        </div>
                                        <Accordion defaultActiveKey="0" flush>
                                            {
                                                course.chapters && course.chapters.map(chapter => {

                                                    return (
                                                        <Accordion.Item eventKey="0">
                                                            <Accordion.Header>{chapter.title}</Accordion.Header>
                                                            <Accordion.Body className='pt-2 pb-0 ps-0'>
                                                                <ul className='lessons mb-0'>
                                                                    {
                                                                        chapter.lessons && chapter.lessons.map(lesson => {
                                                                            return (
                                                                                <li className='pb-2'>
                                                                                    <a href="">
                                                                                        <MdSlowMotionVideo size={20} /> {lesson.title}
                                                                                    </a>
                                                                                </li>
                                                                            )
                                                                        })
                                                                    }
                                                                </ul>
                                                            </Accordion.Body>
                                                        </Accordion.Item>
                                                    )
                                                }
                                                )
                                            }
                                        </Accordion>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    )
}

export default WatchCourse
