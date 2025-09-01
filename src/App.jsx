
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './components/pages/Home'
import Courses from './components/pages/Courses'
import Detail from './components/pages/Detail'
import Login from './components/pages/account/Login'
import Register from './components/pages/account/Register'
import ChangePassword from './components/pages/account/ChangePassword'
import EnrolledCourses from './components/pages/account/EnrolledCourses'
import MyCourses from './components/pages/account/MyCourses'
import WatchCourse from './components/pages/account/WatchCourse'


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/courses' element={<Courses />} />
          <Route path='/detail' element={<Detail />} />
          <Route path='/account/login' element={<Login />} />
          <Route path='/account/register' element={<Register />} />
          <Route path='/account/change-password' element={<ChangePassword />} />
          <Route path='/account/enrolled-courses' element={<EnrolledCourses />} />
          <Route path='/account/my-courses' element={<MyCourses />} />
          <Route path='/account/watch-course' element={<WatchCourse />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
