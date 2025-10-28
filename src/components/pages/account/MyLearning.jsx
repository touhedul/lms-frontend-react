import React from 'react'
import Layout from '../../common/Layout'
import CourseEnrolled from '../../common/CourseEnrolled'
import UserSidebar from '../../common/UserSidebar'
import { useState, useEffect } from 'react'
import axiosInstance from '../../../api/axios'

const MyLearning = () => {
    const [enrollments, setEnrollments] = useState([]);
    const fetchEnrollments = () => {
        axiosInstance.get('/enrollments')
            .then(response => {
                setEnrollments(response.data);
            })
            .catch(error => {
                console.log(error);
            });
    }
    useEffect(() => {
        fetchEnrollments();
    }, []);
  return (
    <>
        <Layout>
            <section className='section-4'>
                <div className='container'>
                    <div className='row'>
                        <div className='d-flex justify-content-between  mt-5 mb-3'>
                            <h2 className='h4 mb-0 pb-0'>My Learning</h2>
                            {/* <a href="#" className='btn btn-primary'>Create</a> */}
                        </div>
                        <div className='col-lg-3 account-sidebar'>
                           <UserSidebar/>
                        </div>
                        <div className='col-lg-9'>
                            <div className='row gy-4'>
                                {
                                    enrollments.map(enrollment =>{
                                        return(

                                            <CourseEnrolled enrollment={enrollment} key={enrollment.id}/>                            
                                        );
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    </>
  )
}

export default MyLearning
