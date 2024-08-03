import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const StyledTextBox = styled.div`
  position: absolute;
  left: ${({ left }) => left}%;
  top: ${({ top }) => top}%;
  width: ${({ width }) => width}%;
  height: ${({ height }) => height}%;
  font-size: ${({ fontSize }) => fontSize}em;
  font-family: ${({ fontFamily }) => fontFamily};
  color: ${({ color }) => color};
  border: 1px solid #ccc;
  overflow: hidden;
  whiteSpace: nowrap;
`;

const ResizeHandle = styled.div`
  position: absolute;
  width: 5px;
  height: 5px;
  background-color: #00f;
  cursor: ${(props) => props.cursor};
  ${(props) => props.position};
`;

const Textbox = ({ id, left, top, width, height, content, fontSize, fontFamily, color, onEdit, onDelete, updateTextbox, slideContentWidth, slideContentHeight }) => {
  const [clicked, setClicked] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [moving, setMoving] = useState(false);
  const [initialWidth, setInitialWidth] = useState(parseFloat(width));
  const [initialHeight, setInitialHeight] = useState(parseFloat(height));
  const [initialX, setInitialX] = useState(parseFloat(left));
  const [initialY, setInitialY] = useState(parseFloat(top));
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [newWidth, setNewWidth] = useState(initialWidth);
  const [newHeight, setNewHeight] = useState(initialHeight);
  const [newX, setNewX] = useState(initialX);
  const [newY, setNewY] = useState(initialY);

  const handleMouseDown = (e, direction) => {
    e.preventDefault();
    setStartX(e.clientX);
    setStartY(e.clientY);
    setResizing(direction);
  };

  const handleMouseMove = (e) => {
    if (!resizing && moving) {
      handleDrag(e);
      return;
    }

    let dx = e.clientX - startX;
    let dy = e.clientY - startY;

    dx /= (slideContentWidth / 100.0);
    dy /= (slideContentHeight / 100.0);

    let newWidth = initialWidth;
    let newHeight = initialHeight;
    let newX = initialX;
    let newY = initialY;

    switch (resizing) {
      case 'se':
        newWidth += dx;
        newHeight += dy;
        break;
      case 'sw':
        newWidth -= dx;
        newHeight += dy;
        newX += dx;
        break;
      case 'ne':
        newWidth += dx;
        newHeight -= dy;
        newY += dy;
        break;
      case 'nw':
        newWidth -= dx;
        newHeight -= dy;
        newX += dx;
        newY += dy;
        break;
      default:
        break;
    }

    if (newX < 0) {
      newX = 0;
      newWidth = initialX - newX + initialWidth;
    }
    if (newY < 0) {
      newY = 0;
      newHeight = initialY - newY + initialHeight;
    }
    if (newX + newWidth > 100) {
      newWidth = 100 - newX;
    }
    if (newY + newHeight > 100) {
      newHeight = 100 - newY;
    }

    if (newWidth <= 1) {
      newWidth = 1;
      if (resizing === 'se' || resizing === 'ne') {
        newX = initialX;
      } else {
        newX = initialX + initialWidth - 1;
      }
    }
    if (newHeight <= 1) {
      newHeight = 1;
      if (resizing === 'se' || resizing === 'sw') {
        newY = initialY;
      } else {
        newY = initialY + initialHeight - 1;
      }
    }

    setNewWidth(newWidth);
    setNewHeight(newHeight);
    setNewX(newX);
    setNewY(newY);
  };

  const handleDrag = (e) => {
    let dx = e.clientX - startX;
    let dy = e.clientY - startY;
    dx /= (slideContentWidth / 100.0);
    dy /= (slideContentHeight / 100.0);

    const newX = initialX + dx;
    const newY = initialY + dy;

    setNewX(Math.max(0, Math.min(100 - initialWidth, newX)));
    setNewY(Math.max(0, Math.min(100 - initialHeight, newY)));
  };

  const handleMouseUp = () => {
    if (resizing || moving) {
      setClicked(false);
    }
    setInitialWidth(newWidth);
    setInitialHeight(newHeight);
    setInitialX(newX);
    setInitialY(newY);
    setResizing(false);
    setMoving(false);

    updateTextbox(id, { left: newX, top: newY, width: newWidth, height: newHeight });
  };

  const handleClickOutside = (e) => {
    const textboxWrapper = document.getElementById(id);
    if (textboxWrapper && !textboxWrapper.contains(e.target)) {
      setClicked(false);
    }
  };

  const handleMouseDownWrapper = (e) => {
    if (clicked) {
      setMoving(true);
    }
    e.preventDefault();
    if (e.button === 0) {
      setClicked(true);
    }
    setStartX(e.clientX);
    setStartY(e.clientY);
  };

  useEffect(() => {
    const handleDocumentMouseMove = (e) => {
      handleMouseMove(e);
    };

    const handleDocumentMouseUp = () => {
      handleMouseUp();
    };

    document.addEventListener('mousemove', handleDocumentMouseMove);
    document.addEventListener('mouseup', handleDocumentMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseup', handleDocumentMouseUp);
    };
  });

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <StyledTextBox
      id={id}
      fontSize={fontSize}
      fontFamily={fontFamily}
      left={initialX}
      top={initialY}
      width={initialWidth}
      height={initialHeight}
      color={color}
      onMouseDown={handleMouseDownWrapper}
      onDoubleClick={() => onEdit(id)}
      onContextMenu={(e) => {
        e.preventDefault();
        onDelete(id);
      }}
    >
      {clicked && (
        <>
          <ResizeHandle
            className="resize-handle se"
            cursor="se-resize"
            position={{ bottom: 0, right: 0 }}
            onMouseDown={(e) => handleMouseDown(e, 'se')}
          />
          <ResizeHandle
            className="resize-handle sw"
            cursor="sw-resize"
            position={{ bottom: 0, left: 0 }}
            onMouseDown={(e) => handleMouseDown(e, 'sw')}
          />
          <ResizeHandle
            className="resize-handle ne"
            cursor="ne-resize"
            position={{ top: 0, right: 0 }}
            onMouseDown={(e) => handleMouseDown(e, 'ne')}
          />
          <ResizeHandle
            className="resize-handle nw"
            cursor="nw-resize"
            position={{ top: 0, left: 0 }}
            onMouseDown={(e) => handleMouseDown(e, 'nw')}
          />
        </>
      )}
      {content}
    </StyledTextBox>
  );
};

const TextBoxes = ({ token, textboxes, currentSlideIndex, presentationID, store, setStore, setShowAddTextModal, setShowEditTextModal, setEditingTextbox, slideContentWidth, slideContentHeight }) => {
  const currentSlideId = Object.keys(store[presentationID].slides)[currentSlideIndex];
  const onEdit = (uuid) => {
    const textboxToEdit = store[presentationID].slides[currentSlideId].textboxes.find(textbox => textbox.uuid === uuid);
    setEditingTextbox({ ...textboxToEdit, id: uuid });
    setShowAddTextModal(false);
    setShowEditTextModal(true);
  };

  const onDelete = async (uuid) => {
    const updatedStore = { ...store };
    updatedStore[presentationID].slides[currentSlideId].textboxes = updatedStore[presentationID].slides[currentSlideId].textboxes.filter(textbox => textbox.uuid !== uuid);

    await axios.put('http://localhost:5005/store', {
      store: { ...updatedStore },
    }, {
      headers: {
        Authorization: token,
      }
    });

    setStore(updatedStore);
  };

  const updateTextbox = async (uuid, newAttributes) => {
    if (store && store[presentationID] && store[presentationID].slides) {
      const updatedStore = { ...store };
      updatedStore[presentationID].slides[currentSlideId].textboxes = updatedStore[presentationID].slides[currentSlideId].textboxes.map((textbox) => {
        if (textbox.uuid === uuid) {
          return { ...textbox, ...newAttributes };
        }
        return textbox;
      });

      await axios.put('http://localhost:5005/store', {
        store: { ...updatedStore },
      }, {
        headers: {
          Authorization: token,
        }
      });

      setStore(updatedStore);
    }
  };

  return (
    <>
      {textboxes.map((textbox) => (
        <Textbox
          key={textbox.uuid}
          id={textbox.uuid}
          {...textbox}
          onEdit={onEdit}
          onDelete={onDelete}
          updateTextbox={updateTextbox}
          slideContentWidth={slideContentWidth}
          slideContentHeight={slideContentHeight}
        />
      ))}
    </>
  );
};

export default TextBoxes;
