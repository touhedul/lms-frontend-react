import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { MdDragIndicator } from 'react-icons/md';
import { BsPencilSquare } from 'react-icons/bs';
import { FaTrashAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axiosInstance from '../../../../api/axios';

const LessonSortModal = ({ showLessonSortModal, handleCloseLessonSortModal, lessonData, setChapters }) => {

    const [lessons, setLessons] = useState([]);
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(lessons);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        setLessons(reorderedItems);
        saveOrder(reorderedItems);
    };

    const saveOrder = (sortedLessons) => {
        axiosInstance.post('/lesson-order', { 'lessons': sortedLessons })
            .then(response => {
                toast.success('Lesson order updated successfully');

                setChapters({ type: 'UPDATE_CHAPTER', payload: response.data });
            })
            .catch(error => {
                console.log(error);
            })

    }

    useEffect(() => {
        if (lessonData) {
            setLessons(lessonData);
        }
    }, [lessonData])


    return (
        <>

            <Modal show={showLessonSortModal} onHide={handleCloseLessonSortModal}>
                <form>
                    <Modal.Header closeButton>
                        <Modal.Title>Lesson Sort</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <DragDropContext onDragEnd={handleDragEnd} >
                            <Droppable droppableId="list">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                        {
                                            lessons.map((lesson, index) => (
                                                <Draggable key={lesson.id} draggableId={`${lesson.id}`} index={index}>

                                                    {(provided) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className="mt-2 border px-3 py-2 bg-white shadow-lg  rounded"
                                                        >

                                                            <div className='card-body p-2 d-flex'>
                                                                <div><MdDragIndicator /></div>
                                                                <div className='d-flex justify-content-between w-100'>
                                                                    <div className='ps-2'>
                                                                        {lesson.title}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseLessonSortModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}

export default LessonSortModal