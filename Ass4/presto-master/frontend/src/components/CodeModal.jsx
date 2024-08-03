import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import ErrorModal from './ErrorModal';

const ModalContainer = styled.div`
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

const CloseButton = styled.button`
  position: absolute;
  top: 0px;
  right: 0px;
  color: #aaa;
  background-color: transparent;
  border: none;
  font-size: 28px;
  cursor: pointer;
`;

const Label = styled.label`
  margin-bottom: 5px;
`;

const StyledInput = styled.input`
  margin-bottom: 10px;
`;

const StyledTextArea = styled.textarea`
  margin-bottom: 10px;
  height: 120px;
  width: 240px;
`;

const CodeModal = ({ isOpen, onSubmit, onClose }) => {
  const [errorModalOpen, setErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const closeErrorModal = () => {
    setErrorModalOpen(false);
  };

  const [codeProps, setCodeProps] = useState({
    width: '',
    height: '',
    content: '',
    fontSize: '',
  });

  useEffect(() => {
    if (isOpen) {
      setCodeProps({
        width: '',
        height: '',
        content: '',
        fontSize: '',
      });
    }
  }, [isOpen]);

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
    if (codeProps.width <= 0 || codeProps.width > 100 || codeProps.height <= 0 || codeProps.height > 100) {
      setErrorMessage('Width and height must be between 0 and 100.');
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
    <ModalContainer isOpen={isOpen}>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>Add Code</h2>
        <form onSubmit={handleSubmit}>
          <Label>
            Width:
            <br />
            <StyledInput name="width" placeholder="Width (%)" onChange={handleChange} />
          </Label>
          <br />
          <Label>
            Height:
            <br />
            <StyledInput name="height" placeholder="Height (%)" onChange={handleChange} />
          </Label>
          <br />
          <Label>
            Content:
            <br />
            <StyledTextArea name="content" placeholder="Code Content" onChange={handleChange} />
          </Label>
          <br />
          <Label>
            Font Size:
            <br />
            <StyledInput name="fontSize" placeholder="Font Size (em)" onChange={handleChange} />
          </Label>
          <br />
          <button type="submit">Add Code</button>
        </form>
      </ModalContent>
      <ErrorModal isOpen={errorModalOpen} onClose={closeErrorModal}>
        <p>{errorMessage}</p>
      </ErrorModal>
    </ModalContainer>
  );
};

export default CodeModal;
