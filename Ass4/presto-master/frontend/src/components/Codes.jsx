import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import hljs from 'highlight.js';
import 'highlight.js/styles/default.css';

const StyledCode = styled.div`
  position: absolute;
  left: ${({ left }) => left}%;
  top: ${({ top }) => top}%;
  width: ${({ width }) => width}%;
  height: ${({ height }) => height}%;
`;

const StyledPre = styled.pre`
  position: absolute;
  width: 100%;
  height: 100%;
  font-size: ${({ fontSize }) => fontSize}em;
  white-space: pre;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
  overflow: auto;
  margin: 0;
  padding: 0;
`;

const ResizeHandle = styled.div`
  position: absolute;
  width: 5px;
  height: 5px;
  background-color: #00f;
  cursor: ${(props) => props.cursor};
  ${(props) => props.position};
`;

const LanguageIndicator = styled.div`
  background-color: darkgrey;
`;

const CodeContent = styled.code`
  margin: 0;
  padding: 0;
`;

const CodeBlock = ({ id, left, top, width, height, fontSize, content, onEdit, onDelete, updateCodeBlock, slideContentWidth, slideContentHeight }) => {
  const contentRef = useRef(null);
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

  useEffect(() => {
    if (contentRef.current) {
      delete contentRef.current.dataset.highlighted;
      hljs.highlightBlock(contentRef.current);
    }
  }, [content]);

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

    if (newWidth < 3) {
      newWidth = 3;
      if (resizing === 'se' || resizing === 'ne') {
        newX = initialX;
      } else {
        newX = initialX + initialWidth - 3;
      }
    }
    if (newHeight < 3) {
      newHeight = 3;
      if (resizing === 'se' || resizing === 'sw') {
        newY = initialY;
      } else {
        newY = initialY + initialHeight - 3;
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

    updateCodeBlock(id, { left: newX, top: newY, width: newWidth, height: newHeight });
  };

  const handleClickOutside = (e) => {
    const codeWrapper = document.getElementById(id);
    if (codeWrapper && !codeWrapper.contains(e.target)) {
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
    <StyledCode
      id={id}
      left={initialX}
      top={initialY}
      width={initialWidth}
      height={initialHeight}
    >
    <StyledPre
      fontSize={fontSize}
      onMouseDown={handleMouseDownWrapper}
      onDoubleClick={() => onEdit(id)}
      onContextMenu={(e) => {
        e.preventDefault();
        onDelete(id);
      }}
    >
      <LanguageIndicator>{detectLanguage(content)}</LanguageIndicator>
      <CodeContent ref={contentRef} className={`language-${detectLanguage(content)}`}>
        {content}
      </CodeContent>
    </StyledPre>
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
    </StyledCode>
  );
};

const detectLanguage = (code) => {
  const languages = ['javascript', 'python', 'c'];

  let maxRelevance = 0;
  let detectedLanguage = 'plaintext';

  languages.forEach((lang) => {
    const result = hljs.highlight(code, { language: lang, ignoreIllegals: true });
    if (result.relevance > maxRelevance) {
      maxRelevance = result.relevance;
      detectedLanguage = lang;
    }
  });

  return detectedLanguage;
};

const Codes = ({ token, codes, currentSlideIndex, presentationID, store, setStore, setShowAddCodeModal, setShowEditCodeModal, setEditingCode, slideContentWidth, slideContentHeight }) => {
  const currentSlideId = Object.keys(store[presentationID].slides)[currentSlideIndex];
  const onEdit = (uuid) => {
    const codeToEdit = store[presentationID].slides[currentSlideId].codes.find(code => code.uuid === uuid);
    setEditingCode({ ...codeToEdit, id: uuid });
    setShowAddCodeModal(false);
    setShowEditCodeModal(true);
  };

  const onDelete = async (uuid) => {
    const updatedStore = { ...store };
    updatedStore[presentationID].slides[currentSlideId].codes = updatedStore[presentationID].slides[currentSlideId].codes.filter(code => code.uuid !== uuid);

    await axios.put('http://localhost:5005/store', {
      store: { ...updatedStore },
    }, {
      headers: {
        Authorization: token,
      }
    });

    setStore(updatedStore);
  };

  const updateCodeBlock = async (uuid, newAttributes) => {
    if (store && store[presentationID] && store[presentationID].slides) {
      const updatedStore = { ...store };
      updatedStore[presentationID].slides[currentSlideId].codes = updatedStore[presentationID].slides[currentSlideId].codes.map((code) => {
        if (code.uuid === uuid) {
          return { ...code, ...newAttributes };
        }
        return code;
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
      {codes.map((code) => (
        <CodeBlock
          key={code.uuid}
          id={code.uuid}
          {...code}
          onEdit={onEdit}
          onDelete={onDelete}
          updateCodeBlock={updateCodeBlock}
          slideContentWidth={slideContentWidth}
          slideContentHeight={slideContentHeight}
        />
      ))}
    </>
  );
};

export default Codes;
