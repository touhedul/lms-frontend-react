import React, { useEffect, useState } from 'react'
import Course from '../common/Course'
import Layout from '../common/Layout'
import axiosInstance from '../../api/axios'
import { useSearchParams } from 'react-router-dom'

const Courses = () => {
    const [rating, setRating] = useState(4.0)

    const [searchParams, setSearchParams] = useSearchParams();

    const [categories, setCategories] = useState([]);
    const [levels, setLevels] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [courses, setCourses] = useState([]);

    const [categoryChecked, setCategoryChecked] = useState(() => {
        const categoryIds = searchParams.get('category_ids');
        return categoryIds ? categoryIds.split(',') : [];
    });
    const [languageChecked, setLanguageChecked] = useState(() => {
        const languageIds = searchParams.get('language_ids');
        return languageIds ? languageIds.split(',') : [];
    });

    const [checkedLevels, setCheckedLevels] = useState(() => {
        const levelIds = searchParams.get('level_ids');
        return levelIds ? levelIds.split(',') : [];
    });

    const handleCategoryChecked = (e) => {
        const { checked, value } = e.target;
        if (checked) {
            setCategoryChecked([...categoryChecked, value]);
        } else {
            setCategoryChecked(categoryChecked.filter(categoryId => categoryId !== value));
        }
    }
    const handleLanguageChecked = (e) => {
        const { checked, value } = e.target;
        if (checked) {
            setLanguageChecked([...languageChecked, value]);
        } else {
            setLanguageChecked(languageChecked.filter(languageId => languageId !== value));
        }
    }

    const handleLevelChecked = (e) => {
        const { checked, value } = e.target;
        if (checked) {
            setCheckedLevels([...checkedLevels, value]);
        } else {
            setCheckedLevels(checkedLevels.filter(level => level !== value));
        }
    }
    const getCategories = () => {
        axiosInstance.get('/categories')
            .then((res) => {
                setCategories(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }
    const getLevels = () => {
        axiosInstance.get('/levels')
            .then((res) => {
                setLevels(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }
    const getLanguages = () => {
        axiosInstance.get('/languages')
            .then((res) => {
                setLanguages(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    const fetchCourses = () => {
        let search = [];
        let params = "";

        if (categoryChecked.length > 0) {
            search.push(['category_ids', categoryChecked]);
        }
        if (languageChecked.length > 0) {
            search.push(['language_ids', languageChecked]);
        }

        if (checkedLevels.length > 0) {
            search.push(['level_ids', checkedLevels]);
        }

        if (search.length > 0) {
            params = new URLSearchParams(search);
            setSearchParams(params);
        }
        const url = '/all-courses?' + params;
        console.log('Fetching courses from ', url);
        axiosInstance.get(url)
            .then((res) => {
                console.log('Courses fetched: ', res.data);
                setCourses(res.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    useEffect(() => {
        getCategories();
        getLevels();
        getLanguages();
        fetchCourses();
    }, [categoryChecked, checkedLevels, languageChecked]);

    return (
        <Layout>
            <div className='container pb-5 pt-3'>
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a href="#">Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Courses</li>
                    </ol>
                </nav>
                <div className='row'>
                    <div className='col-lg-3'>
                        <div className='sidebar mb-5 card border-0'>
                            <div className='card-body shadow'>
                                <input type="text" className='form-control' placeholder='Search by keyword' />
                                <div className='pt-3'>
                                    <h3 className='h5 mb-2'>Category</h3>
                                    <ul>
                                        {
                                            categories.map(category => {
                                                return (
                                                    <li key={category.id}>
                                                        <div className="form-check">
                                                            <input
                                                                defaultChecked={
                                                                    searchParams.get('category_ids') ? searchParams.get('category_ids').includes(category.id) : false
                                                                }
                                                                onClick={(e) => handleCategoryChecked(e)} className="form-check-input" type="checkbox" value={category.id} id={`category-${category.id}`} />
                                                            <label className="form-check-label" htmlFor={`category-${category.id}`}>
                                                                {category.name}
                                                            </label>
                                                        </div>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                                <div className='mb-3'>
                                    <h3 className='h5  mb-2'>Level</h3>
                                    <ul>
                                        {
                                            levels.map(level => {
                                                return (
                                                    <li key={level.id}>
                                                        <div className="form-check">
                                                            <input
                                                                defaultChecked={
                                                                    searchParams.get('level_ids') ? searchParams.get('level_ids').includes(level.id) : false
                                                                }
                                                                onClick={(e) => handleLevelChecked(e)}
                                                                className="form-check-input" type="checkbox" value={level.id} id={`level-${level.id}`} />
                                                            <label className="form-check-label" htmlFor={`level-${level.id}`}>
                                                                {level.name}
                                                            </label>
                                                        </div>
                                                    </li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                                <div className='mb-3'>
                                    <h3 className='h5 mb-2'>Language</h3>
                                    <ul>
                                        {
                                            languages.map(language => {
                                                return (

                                                    <li key={language.id}>
                                                        <div className="form-check">
                                                            <input
                                                            defaultChecked={
                                                                    searchParams.get('language_ids') ? searchParams.get('language_ids').includes(language.id) : false
                                                                }
                                                                onClick={(e) => handleLanguageChecked(e)}
                                                            className="form-check-input" type="checkbox" value={language.id} />
                                                            <label className="form-check-label" htmlFor="flexCheckDefault31">
                                                                {language.name}
                                                            </label>
                                                        </div>
                                                    </li>
                                                );
                                            })
                                        }
                                       
                                    </ul>
                                </div>
                                <a href="" className='clear-filter'>Clear All Filters</a>
                            </div>
                        </div>
                    </div>
                    <div className='col-lg-9'>
                        <section className='section-3'>
                            <div className='d-flex justify-content-between mb-3 align-items-center'>
                                <div className='h5 mb-0'>
                                    {/* 10 courses found */}
                                </div>
                                <div>
                                    <select name="" id="" className='form-select'>
                                        <option value="0">Newset First</option>
                                        <option value="1">Oldest First</option>
                                    </select>
                                </div>
                            </div>
                            <div className="row gy-4">

                                {
                                    courses.map(course => {
                                        return (
                                            <Course
                                                key={course.id}
                                                title={course.title}
                                                level={course.level}
                                                enrolled={course.enrolled}
                                                customClasses="col-lg-4 col-md-6"
                                                course={course}
                                            />
                                        )
                                    })
                                }
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Courses
