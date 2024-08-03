import React from 'react';
import styled from 'styled-components';

const ModalWrapper = styled.div`
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
const ErrorModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <ModalWrapper>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        {children}
      </ModalContent>
    </ModalWrapper>
  );
}

export default ErrorModal;
