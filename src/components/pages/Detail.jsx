import React, { useEffect, useState } from 'react'
import { Rating } from 'react-simple-star-rating'
import ReactPlayer from 'react-player'
import { Accordion, Badge, ListGroup, Card } from "react-bootstrap";
import Layout from '../common/Layout'
import { useParams } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import Loading from '../common/Loading';
import toast from 'react-hot-toast';

const Detail = () => {
    const [rating, setRating] = useState(4.0);
    const params = useParams();
    const [course, setCourse] = useState({});
    const [loading, setLoading] = useState(false);
    const [enrollLoading, setEnrollLoading] = useState(false);

    const fetchCourse = () => {
        setLoading(true);
        axiosInstance.get(`/course/${params.id}`)
            .then(response => {
                setCourse(response.data);
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const enroll = () =>{
        setEnrollLoading(true);
        axiosInstance.post(`/enroll/${params.id}`)
        .then(response => {
            console.log(response.status);
            toast.success('Enroll Successfully');
        })
        .catch(error => {
            if(error.status == 400){
                toast.error('You are already enrolled');
            }
            if(error.status == 401){
                toast.error('Please Login First');
            }
        })
        .finally(() => {
            setEnrollLoading(false);
        })  
    }

    useEffect(() => {
        fetchCourse();
    }, [])

    return (
        <>
            <Layout>
                {
                    loading && <Loading />
                }
                {
                    loading == false &&

                    <div className='container pb-5 pt-3'>
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item"><a href="/">Home</a></li>
                                <li className="breadcrumb-item"><a href="/courses">Courses</a></li>
                                <li className="breadcrumb-item active" aria-current="page">{course.title}</li>
                            </ol>
                        </nav>
                        <div className='row my-5'>
                            <div className='col-lg-8'>
                                <h2>{course.title}</h2>
                                <div className='d-flex'>
                                    <div className='mt-1'>
                                        <span className="badge bg-green">{course.category?.name}</span>
                                    </div>
                                    <div className='d-flex ps-3'>
                                        <div className="text pe-2 pt-1">5.0</div>
                                        <Rating initialValue={rating} size={20} />
                                    </div>
                                </div>
                                <div className="row mt-4">
                                    {/* <div className="col">
                            <span className="text-muted d-block">Last Updates</span>
                            <span className="fw-bold">Aug 2021</span>
                        </div> */}
                                    <div className="col">
                                        <span className="text-muted d-block">Level</span>
                                        <span className="fw-bold">{course.level?.name}</span>
                                    </div>
                                    <div className="col">
                                        <span className="text-muted d-block">Language</span>
                                        <span className="fw-bold">{course.language?.name}</span>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-md-12 mt-4'>
                                        <div className='border bg-white rounded-3 p-4'>
                                            <h3 className='mb-3  h4'>Overview</h3>
                                            <p>{course.description} </p>
                                        </div>
                                    </div>
                                    <div className='col-md-12 mt-4'>
                                        <div className='border bg-white rounded-3 p-4'>
                                            <h3 className='mb-3 h4'>What you will learn</h3>
                                            <ul className="list-unstyled mt-3">
                                                {
                                                    course.outcomes?.map(outcome => {
                                                        return (
                                                            <li className="d-flex align-items-center mb-2">
                                                                <span className="text-success me-2">&#10003;</span>
                                                                <span>{outcome.text}</span>
                                                            </li>
                                                        );
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </div>

                                    <div className='col-md-12 mt-4'>
                                        <div className='border bg-white rounded-3 p-4'>
                                            <h3 className='mb-3 h4'>Requirements</h3>
                                            <ul className="list-unstyled mt-3">
                                                {
                                                    course.requirements?.map(requirement => {
                                                        return (
                                                            <li className="d-flex align-items-center mb-2">
                                                                <span className="text-success me-2">&#10003;</span>
                                                                <span>{requirement.text}</span>
                                                            </li>
                                                        );
                                                    })
                                                }
                                            </ul>
                                        </div>
                                    </div>

                                    <div className='col-md-12 mt-4'>
                                        <div className='border bg-white rounded-3 p-4'>
                                            <h3 className="h4 mb-3">Course Structure</h3>
                                            <Accordion defaultActiveKey="0" id="courseAccordion">

                                                {
                                                    course.chapters?.map(chapter => {
                                                        return (
                                                            <Accordion.Item eventKey="0">
                                                                <Accordion.Header>
                                                                    {chapter.title} 
                                                                </Accordion.Header>
                                                                <Accordion.Body>
                                                                    <ListGroup>
                                                                        {
                                                                            chapter.lessons?.map(lesson => {
                                                                                return (

                                                                                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                                                                                        <span>{lesson.title}</span>
                                                                                    </ListGroup.Item>
                                                                                );
                                                                            })
                                                                        }
                                                                    </ListGroup>
                                                                </Accordion.Body>
                                                            </Accordion.Item>
                                                        );
                                                    })
                                                }
                                            </Accordion>
                                        </div>
                                    </div>
{/* 
                                    <div className='col-md-12 mt-4'>
                                        <div className='border bg-white rounded-3 p-4'>
                                            <h3 className='mb-3 h4'>Reviews</h3>
                                            <p>Our student says about this course</p>

                                            <div className='mt-4'>
                                                <div className="d-flex align-items-start mb-4 border-bottom pb-3">
                                                    <img src="https://placehold.co/50" alt="User" className="rounded-circle me-3" />
                                                    <div>
                                                        <h6 className="mb-0">Mohit Singh <span className="text-muted fs-6">Jan 2, 2025</span></h6>
                                                        <div className="text-warning mb-2">
                                                            <Rating initialValue={rating} size={20} />
                                                        </div>
                                                        <p className="mb-0">Quisque et quam lacus amet. Tincidunt auctor phasellus purus faucibus lectus mattis.</p>
                                                    </div>
                                                </div>

                                                <div className="d-flex align-items-start mb-4  pb-3">
                                                    <img src="https://placehold.co/50" alt="User" className="rounded-circle me-3" />
                                                    <div>
                                                        <h6 className="mb-0">mark Doe <span className="text-muted fs-6">Jan 10, 2025</span></h6>
                                                        <div className="text-warning mb-2">
                                                            <Rating initialValue={rating} size={20} />
                                                        </div>
                                                        <p className="mb-0">Quisque et quam lacus amet. Tincidunt auctor phasellus purus faucibus lectus mattis.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                            <div className='col-lg-4'>
                                <div className='border rounded-3 bg-white p-4 shadow-sm'>
                                    <Card.Body>
                                        <h3 className="fw-bold">${course.cross_price}</h3>
                                        <div className="text-muted text-decoration-line-through">${course.price}</div>
                                        {/* Buttons */}
                                        <div className="mt-4">
                                            <button onClick={enroll} className="btn btn-primary w-100">
                                                <i className="bi bi-ticket"></i> 
                                                {
                                                    enrollLoading ? 'Enrolling...' : 'Enroll Now'
                                                }
                                            </button>
                                        </div>
                                    </Card.Body>
                                    {/* <Card.Footer className='mt-4'>
                                        <h6 className="fw-bold">This course includes</h6>
                                        <ListGroup variant="flush">

                                            <ListGroup.Item className='ps-0'>
                                                <i className="bi bi-infinity text-primary me-2"></i>
                                                Full lifetime access
                                            </ListGroup.Item>
                                            <ListGroup.Item className='ps-0'>
                                                <i className="bi bi-tv text-primary me-2"></i>
                                                Access on mobile and TV
                                            </ListGroup.Item>
                                            <ListGroup.Item className='ps-0'>
                                                <i className="bi bi-award-fill text-primary me-2"></i>
                                                Certificate of completion
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Card.Footer> */}
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </Layout>
        </>
    )
}

export default Detail
