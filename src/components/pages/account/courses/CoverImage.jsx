import React, { useState } from 'react'
import { FilePond, registerPlugin } from 'react-filepond'
import 'filepond/dist/filepond.min.css'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview, FilePondPluginFileValidateType)
import toast from 'react-hot-toast'
import { apiUrl } from '../../../common/Config'



const CoverImage = ({course,setCourse}) => {
    const [files, setFiles] = useState([]);
    const userInfo = localStorage.getItem('userInfo');
    const token = userInfo ? JSON.parse(userInfo).token : null;
    return (
        <>
            <div className="card">
                <div className="card-header">
                    <h5 className="card-title mb-0">Cover Image</h5>
                </div>
                <div className="card-body">

                    <FilePond
                        acceptedFileTypes={['image/jpeg', 'image/jpg', 'image/png']}
                        credits={false}
                        files={files}
                        onupdatefiles={setFiles}
                        allowMultiple={false}
                        maxFiles={1}
                        server={{
                            process: {
                                url: `${apiUrl}/courses/${course.id}/upload-image`,
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${token}`
                                },
                                onload: (response) => {
                                    response = JSON.parse(response);
                                    toast.success("Image uploaded successfully");
                                    const updateCourseData = { ...course, image: response.image };
                                    setCourse(updateCourseData)
                                    setFiles([]);
                                },
                                onerror: (errors) => {
                                    console.log(errors)
                                },
                            },
                        }}
                        name="image"
                        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
                    />
                    <br />
                    {
                        course.image &&
                        <div className="text-center">
                            <img src={course.image} alt="Course Cover" style={{ maxWidth: '200px' }} />
                        </div>
                    }
                </div>
            </div>
        </>
    )
}

export default CoverImage