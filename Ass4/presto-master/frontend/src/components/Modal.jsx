import React from 'react';
import styled from 'styled-components';

const ModalBackground = styled.div`
  display: ${({ ismodalopen }) => (ismodalopen ? 'flex' : 'none')};
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

const StyledTextArea = styled.textarea`
  height: 120px;
  width: 240px;
`;

const Label = styled.label`
  margin-bottom: 5px;
`;

const Modal = ({ ismodalopen, closeModal, PresentationName, setPresentationName, createPresentation, Description, setDescription, Thumbnail, setThumbnail }) => {
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    if (file) {
      reader.readAsDataURL(file);
    }

    reader.onloadend = () => {
      setThumbnail(reader.result);
    };
  };

  return (
    <ModalBackground ismodalopen={ismodalopen}>
      <ModalContent>
        <CloseButton onClick={closeModal}>&times;</CloseButton>
        <h2>Create New Presentation</h2>
        <Label>
          Presentation Name:
          <br />
          <input
            type="text"
            placeholder="Presentation Name"
            value={PresentationName}
            onChange={(e) => setPresentationName(e.target.value)}
          />
        </Label>
        <Label>
          Description:
          <br />
          <StyledTextArea
            placeholder="Description"
            value={Description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Label>
        <Label>
          Thumbnail:
          <br />
          <input
            type="file"
            accept="image/*"
            value={Thumbnail ? Thumbnail.name : ''}
            onChange={handleThumbnailChange}
          />
        </Label>
        <button onClick={createPresentation}>Create</button>
      </ModalContent>
    </ModalBackground>
  );
};

export default Modal;
