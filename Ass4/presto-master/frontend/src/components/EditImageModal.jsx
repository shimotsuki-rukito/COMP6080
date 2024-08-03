import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ModalBackground = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'block' : 'none')};
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

const EditImageModal = ({ isOpen, imageProps: externalImageProps, onSubmit, onClose }) => {
  const [imageProps, setImageProps] = useState({
    src: '',
    alt: ''
  });

  useEffect(() => {
    if (isOpen) {
      setImageProps({
        src: externalImageProps.src || '',
        alt: externalImageProps.alt || ''
      });
    }
  }, [externalImageProps, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setImageProps(prevProps => ({ ...prevProps, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
        <h2>Edit Textbox</h2>
        <form onSubmit={handleSubmit}>
          Image:
          <br />
          <input type="file" accept="image/*" onChange={handleFileChange} /><br></br>
          <br />
          Description:
          <br />
          <input name="alt" placeholder="Description (alt text)" value={imageProps.alt} onChange={handleChange} /><br></br>
          <br />
          <button type="submit">Save Changes</button>
        </form>
      </ModalContent>
    </ModalBackground>
  );
};

export default EditImageModal;
