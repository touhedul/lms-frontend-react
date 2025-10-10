import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { MdDragIndicator } from 'react-icons/md';
import { BsPencilSquare } from 'react-icons/bs';
import { FaTrashAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axiosInstance from '../../../../api/axios';

const ChapterSortModal = ({ showChapterSortModal, handleCloseChapterSortModal, allChaptersData, setChapters }) => {

    const [chaptersData, setChaptersData] = useState([]);
    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const reorderedItems = Array.from(chaptersData);
        const [movedItem] = reorderedItems.splice(result.source.index, 1);
        reorderedItems.splice(result.destination.index, 0, movedItem);

        setChaptersData(reorderedItems);
        saveOrder(reorderedItems);
    };

    const saveOrder = (sortedChapters) => {
        axiosInstance.post('/chapter-order', { 'chapters': sortedChapters })
            .then(response => {
                toast.success('Chapter order updated successfully');

                setChapters({ type: 'SET_CHAPTERS', payload: response.data });
            })
            .catch(error => {
                console.log(error);
            })

    }

    useEffect(() => {
        if (allChaptersData) {
            setChaptersData(allChaptersData);
        }
    }, [allChaptersData])


    return (
        <>

            <Modal show={showChapterSortModal} onHide={handleCloseChapterSortModal}>
                <form>
                    <Modal.Header closeButton>
                        <Modal.Title>Chapter Sort</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        <DragDropContext onDragEnd={handleDragEnd} >
                            <Droppable droppableId="list">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                        {
                                            chaptersData.map((chapter, index) => (
                                                <Draggable key={chapter.id} draggableId={`${chapter.id}`} index={index}>

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
                                                                        {chapter.title}
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
                        <Button variant="secondary" onClick={handleCloseChapterSortModal}>
                            Close
                        </Button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    )
}

export default ChapterSortModal