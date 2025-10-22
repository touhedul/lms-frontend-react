import React, { useEffect, useState } from 'react'
import axiosInstance from '../../api/axios';

const FeaturedCategories = () => {

    const [categories,setCategories] = useState([]);

    const getCategories = ()=>{
        axiosInstance.get('/categories')
        .then((res)=>{
            setCategories(res.data);
        })
        .catch((err)=>{
            console.log(err);
        })
    }

    useEffect(()=>{
        getCategories();
    },[]);
  return (
    <section className='section-2'>
        <div className="container">
            <div className='section-title py-3  mt-4'>
                <h2 className='h3'>Explore Categories</h2>
                <p>Discover categories designed to help you excel in your professional and personal growth.</p>
            </div>
            <div className='row gy-3'>
                {
                    categories.map(category=>{
                        return (
                            <div className='col-6 col-md-6 col-lg-3' >
                                <div className='card shadow border-0'>
                                    <div className='card-body'><a href="">{category.name}</a></div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>      
        </div>
    </section>
  )
}

export default FeaturedCategories
