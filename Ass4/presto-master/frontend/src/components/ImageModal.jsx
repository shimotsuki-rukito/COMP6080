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

const ImageModal = ({ isOpen, onSubmit, onClose }) => {
  const [errorModalOpen, setErrorModalOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const closeErrorModal = () => {
    setErrorModalOpen(false);
  };

  const [imageProps, setImageProps] = useState({
    width: '',
    height: '',
    src: '',
    alt: ''
  });

  useEffect(() => {
    if (isOpen) {
      setImageProps({
        width: '',
        height: '',
        src: '',
        alt: ''
      });
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setImageProps(prevProps => ({ ...prevProps, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!imageProps.src) {
      setErrorMessage('Please select an image.');
      setErrorModalOpen(true);
      return;
    } else if (imageProps.width <= 0 || imageProps.width > 100 || imageProps.height <= 0 || imageProps.height > 100) {
      setErrorMessage('Width and height must be between 0 and 100.');
      setErrorModalOpen(true);
      return;
    }
    onSubmit(imageProps);
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageProps((prevProps) => ({
          ...prevProps,
          src: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <ModalBackground isOpen={isOpen}>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>Add Image</h2>
        <form onSubmit={handleSubmit}>
        Width:
        <br />
        <input name="width" placeholder="Width" onChange={handleChange} /><br></br>
        <br />
        Height:
        <br />
        <input name="height" placeholder="Height" onChange={handleChange} /><br></br>
        <br />
        Image:
        <br />
        <input type="file" accept="image/*" onChange={handleFileChange} /><br></br>
        <br />
        Description:
        <br />
        <input name="alt" placeholder="Description (text)" onChange={handleChange} /><br></br>
        <br />
        <button type="submit">Add Image</button>
      </form>
      </ModalContent>
      <ErrorModal isOpen={errorModalOpen} onClose={closeErrorModal}>
        <p>{errorMessage}</p>
      </ErrorModal>
    </ModalBackground>
  );
};

export default ImageModal;
