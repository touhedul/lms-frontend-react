import React, { useContext } from 'react'
import { FaChartBar, FaDesktop, FaUserLock   } from "react-icons/fa";
import { BsMortarboardFill } from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
const UserSidebar = () => {
    const {logout} = useContext(AuthContext);

    const navigate = useNavigate();

    const logoutSubmit = ()=>{
        logout();
        toast.success("Logout successful");
        navigate('/account/login');    
    }
  return (
    <div className='card border-0 shadow-lg'>
        <div className='card-body  p-4'>
            <ul>
                <li className='d-flex align-items-center'>
                    <Link to="/account/dashboard"><FaChartBar  size={16} className='me-2 ' /> Dashboard</Link>
                </li>
               
                <li  className='d-flex align-items-center'>
                    <Link to="/account/my-learning"><BsMortarboardFill  size={16} className='me-2' /> My Learning</Link>
                </li>
                <li  className='d-flex align-items-center'>
                    <Link to="/account/my-courses"><FaDesktop  size={16} className='me-2'/> My Courses</Link>
                </li>
                <li  className='d-flex align-items-center '>
                    <Link href="#"><FaUserLock  size={16}  className='me-2'/> Change Password</Link>
                </li>
                <li>
                    <Link onClick={logoutSubmit} className='text-danger'><MdLogout  size={16} className='me-2'/> Logout</Link>
                </li>
            </ul>
        </div>                             
    </div>
  )
}

export default UserSidebar
