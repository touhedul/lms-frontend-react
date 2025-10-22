import React, { useState } from 'react'
import Course from './Course'
import axiosInstance from '../../api/axios';

const FeaturedCourses = () => {
    const [featuredCourses,setFeaturedCourses] = useState([]);
    const getFeaturedCourses = ()=>{
        axiosInstance.get('/featured-courses')
        .then((res)=>{
            console.log(res.data);
            setFeaturedCourses(res.data);
        })
        .catch((err)=>{
            console.log(err);
        })
    }
    useState(()=>{
        getFeaturedCourses();
    },[]);
    return (
        <section className='section-3 my-5'>    
            <div className="container">
                <div className='section-title py-3  mt-4'>
                    <h2 className='h3'>Featured Courses</h2>
                    <p>Discover courses designed to help you excel in your professional and personal growth.</p>
                </div>
                <div className="row gy-4">
                    {
                        featuredCourses.map(course=>{
                            return(
                                <Course 
                                    key={course.id}
                                    title={course.title}
                                    level={course.level}
                                    enrolled={course.enrolled}
                                    course={course}
                                    customClasses="col-lg-3 col-md-6"
                                />
                            )
                        })
                    }
                    
                </div>
            </div>
        </section>
    )
}

export default FeaturedCourses
