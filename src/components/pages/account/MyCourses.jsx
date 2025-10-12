import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../common/Layout'
import UserSidebar from '../../common/UserSidebar'
import CourseEdit from '../../common/CourseEdit'
import axiosInstance from '../../../api/axios'
import toast from 'react-hot-toast'

const MyCourses = () => {
    const [courses,setCourses]=useState([]);
    const getCourses = ()=>{
        axiosInstance.get('courses/my')
        .then(response => {
            setCourses(response.data);
        })
    }

    const deleteCourse = (id) => {
        if(!confirm('Are you sure?')){
            return;
        }
        axiosInstance.delete(`/courses/${id}`)
        .then(response =>{
            toast.success('Delete successful.');
            setCourses(courses.filter(course => course.id !== id))
        })
    }

    useEffect(()=>{
        getCourses();
    },[])
  return (
    <>
        <Layout>
            <section className='section-4'>
                <div className='container'>
                    <div className='row'>
                        <div className='col-md-12 mt-5 mb-3'>
                            <div className='d-flex justify-content-between'>
                                <h2 className='h4 mb-0 pb-0'>My Courses</h2>
                                <Link to="/account/course/create" className='btn btn-primary'>Create</Link>
                            </div>
                        </div>
                        <div className='col-lg-3 account-sidebar'>
                            <UserSidebar/>
                        </div>
                        <div className='col-lg-9'>
                            <div className='row gy-4'>
                                {
                                    courses && courses.map(course=>{
                                        return(
                                            <CourseEdit course={course} deleteCourse={deleteCourse}/>                  
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

export default MyCourses
