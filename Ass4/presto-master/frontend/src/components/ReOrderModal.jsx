import React from 'react';
import styled from 'styled-components';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const ModalBackground = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  position: relative;
  height: 80%;
  width: 300px;
  background-color: white;
  padding: 20px;
  font-family: Arial;
  display: flex;
  flex-direction: column;
  gap: 10px;
  overflow-y: auto;
`;

const CloseButton = styled.span`
  position: absolute;
  top: 0px;
  right: 5px;
  color: #aaa;
  background-color: transparent;
  border: none;
  font-size: 28px;
  cursor: pointer;
`;

const SlideItem = styled.div`
  margin: 10px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid black;
  ${({ isDragging }) => isDragging && 'background-color: lightgrey;'}
  ${({ dragStyle }) => dragStyle && dragStyle}
`;

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const ReOrderModal = ({ isOpen, store, id, onClose, onReorder }) => {
  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const items = reorder(
      store && store[id] && store[id].slides && Object.values(store[id].slides),
      result.source.index,
      result.destination.index
    );
    onReorder(items);
  };

  return (
    <ModalBackground isOpen={isOpen}>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>Re-arrange</h2>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {store && store[id] && store[id].slides && Object.values(store[id].slides).map((slide, index) => (
                  <Draggable key={slide.id} draggableId={String(slide.id)} index={index}>
                    {(provided, snapshot) => (
                      <SlideItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        isDragging={snapshot.isDragging}
                        dragStyle={provided.draggableProps.style}>
                        {`Slide ${index + 1}`}
                      </SlideItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </ModalContent>
    </ModalBackground>
  );
}

export default ReOrderModal;
