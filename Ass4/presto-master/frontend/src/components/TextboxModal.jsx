import React, { useState, useEffect } from 'react';
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

const TextboxModal = ({ isOpen, onSubmit, onClose }) => {
  const [errorModalOpen, setErrorModalOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const closeErrorModal = () => {
    setErrorModalOpen(false);
  };

  const [textboxProps, setTextboxProps] = useState({
    width: '',
    height: '',
    content: '',
    fontSize: '',
    color: ''
  });

  useEffect(() => {
    if (isOpen) {
      setTextboxProps({
        width: '',
        height: '',
        content: '',
        fontSize: '',
        color: ''
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTextboxProps(prevProps => ({ ...prevProps, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!textboxProps.content.trim()) {
      setErrorMessage('Content cannot be empty.');
      setErrorModalOpen(true);
      return;
    }
    if (textboxProps.width <= 0 || textboxProps.width > 100 || textboxProps.height <= 0 || textboxProps.height > 100) {
      setErrorMessage('Width and height must be between 0 and 100.');
      setErrorModalOpen(true);
      return;
    }
    if (textboxProps.fontSize <= 0) {
      setErrorMessage('Font size must be greater than 0.');
      setErrorModalOpen(true);
      return;
    }
    onSubmit(textboxProps);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalBackground isOpen={isOpen}>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>Add Textbox</h2>
        <form onSubmit={handleSubmit}>
          Width:
          <br />
          <input name="width" placeholder="Width (%)" onChange={handleChange} /><br></br>
          <br />
          Height:
          <br />
          <input name="height" placeholder="Height (%)" onChange={handleChange} /><br></br>
          <br />
          Text Content:
          <br />
          <input name="content" placeholder="Text Content" onChange={handleChange} /><br></br>
          <br />
          Font Size:<br />
          <input name="fontSize" placeholder="Font Size (em)" onChange={handleChange} /><br></br>
          <br />
          Color:<br />
          <input name="color" placeholder="Color (HEX)" onChange={handleChange} /><br></br>
          <br />
          <button type="submit">Add textbox</button>
        </form>
      </ModalContent>
      <ErrorModal isOpen={errorModalOpen} onClose={closeErrorModal}>
        <p>{errorMessage}</p>
      </ErrorModal>
    </ModalBackground>
  );
};

export default TextboxModal;
