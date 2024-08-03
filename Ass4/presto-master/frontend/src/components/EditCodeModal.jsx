import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ErrorModal from './ErrorModal';

const ModalBackground = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  position: relative;
  background-color: white;
  padding: 20px;
  font-family: Arial;
  display: flex;
  flex-direction: column;
  gap: 10px;
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

const ContentTextarea = styled.textarea`
  height: 120px;
  width: 240px;
`;

const EditCodeModal = ({ isOpen, codeProps: externalCodeProps, onSubmit, onClose }) => {
  const [errorModalOpen, setErrorModalOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const closeErrorModal = () => {
    setErrorModalOpen(false);
  };

  const [codeProps, setCodeProps] = useState({
    content: '',
    fontSize: '',
  });

  useEffect(() => {
    if (isOpen) {
      setCodeProps({
        content: externalCodeProps.content || '',
        fontSize: externalCodeProps.fontSize || '',
      });
    }
  }, [externalCodeProps, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCodeProps(prevProps => ({ ...prevProps, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!codeProps.content.trim()) {
      setErrorMessage('Content cannot be empty.');
      setErrorModalOpen(true);
      return;
    }
    if (codeProps.fontSize <= 0) {
      setErrorMessage('Font size must be greater than 0.');
      setErrorModalOpen(true);
      return;
    }
    onSubmit(codeProps);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalBackground isOpen={isOpen}>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>Edit Code</h2>
        <form onSubmit={handleSubmit}>
          Content:
          <br />
          <ContentTextarea
            name="content"
            placeholder="Code Content"
            value={codeProps.content}
            onChange={handleChange}
          /><br></br>
          Font Size:
          <br />
          <input name="fontSize" placeholder="Font Size (em)" value={codeProps.fontSize} onChange={handleChange} /><br></br>
          <br />
          <button type="submit">Edit Code</button>
        </form>
      </ModalContent>
      <ErrorModal isOpen={errorModalOpen} onClose={closeErrorModal}>
        <p>{errorMessage}</p>
      </ErrorModal>
    </ModalBackground>
  );
};

export default EditCodeModal;
