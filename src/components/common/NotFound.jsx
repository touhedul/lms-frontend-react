import React from 'react'

const NotFound = ({text}) => {
  return (
    <div className='col-12'>
        <div className='card shadow text-center border-0 py-0'>
            <h2>
                {text ? text : 'Records not found'}
            </h2>
        </div>
    </div>
  )
}

export default NotFound