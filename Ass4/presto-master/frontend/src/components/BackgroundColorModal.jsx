import React, { useState } from 'react';
import styled from 'styled-components';
import ErrorModal from './ErrorModal';

const ModalContainer = styled.div`
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

const ColorPickerContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

const ColorPicker = styled.input`
  margin-right: 10px;
`;

const ResetButton = styled.button`
  margin-left: 10px;
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

const BackgroundColorModal = ({ id, currentSlideIndex, store, onClose, onApply }) => {
  const [errorModalOpen, setErrorModalOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const closeErrorModal = () => {
    setErrorModalOpen(false);
  };

  const index = Object.keys(store[id].slides)[currentSlideIndex];
  const [currentSlideIsGradient, setCurrentSlideIsGradient] = useState(store[id].slides[index].currentGradientColor !== '');
  const [defaultIsGradient, setDefaultIsGradient] = useState(store[id].defaultGradientColor !== '');
  const [currentBgColor, setCurrentBgColor] = useState(store[id].slides[index].currentBackgroundColor);
  const [currentGradColor, setCurrentGradColor] = useState(store[id].slides[index].currentGradientColor);
  const [defaultBgColor, setDefaultBgColor] = useState(store[id].defaultBackgroundColor);
  const [defaultGradColor, setDefaultGradColor] = useState(store[id].defaultGradientColor);

  const handleCurrentSlideGradientChange = (e) => {
    if (e.target.checked && currentBgColor === '') {
      setErrorMessage('Please set the current background color first.');
      setErrorModalOpen(true);
      return;
    }

    if (!e.target.checked) {
      setCurrentGradColor('');
    }
    setCurrentSlideIsGradient(e.target.checked);
  };

  const handleDefaultGradientChange = (e) => {
    if (e.target.checked && defaultBgColor === '') {
      setErrorMessage('Please set the default background color first.');
      setErrorModalOpen(true);
      return;
    }
    if (!e.target.checked) {
      setDefaultGradColor('');
    }
    setDefaultIsGradient(e.target.checked);
  };

  const handleApply = () => {
    onApply(defaultBgColor, defaultGradColor, currentBgColor, currentGradColor);
  };

  const handleResetColor = (setColor, colorPicker) => {
    setColor('');
    colorPicker('');
  };

  return (
    <ModalContainer>
      <ModalContent>
        <h2>Set Background Color</h2>
        <ColorPickerContainer>
          <label>Default slide background color: </label>
          <ColorPicker
            type="color"
            value={defaultBgColor || '#ffffff'}
            onChange={(e) => setDefaultBgColor(e.target.value)}
          />
          <ResetButton onClick={() => handleResetColor(setDefaultBgColor, setDefaultGradColor)}>Reset</ResetButton>
        </ColorPickerContainer>
        <ColorPickerContainer>
          <input
            type="checkbox"
            id="defaultGradientCheckbox"
            checked={defaultIsGradient}
            onChange={handleDefaultGradientChange}
          />
          <label htmlFor="defaultGradientCheckbox">Add default gradient color: </label>
          {defaultIsGradient && (
            <ColorPickerContainer>
              <ColorPicker
                type="color"
                value={defaultGradColor || '#ffffff'}
                onChange={(e) => setDefaultGradColor(e.target.value)}
              />
              <ResetButton onClick={() => handleResetColor(setDefaultGradColor, setDefaultGradColor)}>Reset</ResetButton>
            </ColorPickerContainer>
          )}
        </ColorPickerContainer>
        <ColorPickerContainer>
          <label>Current slide background color:</label>
          <ColorPicker
            type="color"
            value={currentBgColor || '#ffffff'}
            onChange={(e) => setCurrentBgColor(e.target.value)}
          />
          <ResetButton onClick={() => handleResetColor(setCurrentBgColor, setCurrentGradColor)}>Reset</ResetButton>
        </ColorPickerContainer>
        <ColorPickerContainer>
          <input
            type="checkbox"
            id="currentSlideGradientCheckbox"
            checked={currentSlideIsGradient}
            onChange={handleCurrentSlideGradientChange}
          />
          <label htmlFor="currentSlideGradientCheckbox">Add current gradient color: </label>
          {currentSlideIsGradient && (
            <ColorPickerContainer>
              <ColorPicker
                type="color"
                value={currentGradColor || '#ffffff'}
                onChange={(e) => setCurrentGradColor(e.target.value)}
              />
              <ResetButton onClick={() => handleResetColor(setCurrentGradColor, setCurrentGradColor)}>Reset</ResetButton>
            </ColorPickerContainer>
          )}
        </ColorPickerContainer>
        <br />
        <button onClick={handleApply}>Apply</button>
        <CloseButton onClick={onClose}>&times;</CloseButton>
      </ModalContent>
      <ErrorModal isOpen={errorModalOpen} onClose={closeErrorModal}>
        <p>{errorMessage}</p>
      </ErrorModal>
    </ModalContainer>
  );
};

export default BackgroundColorModal;
