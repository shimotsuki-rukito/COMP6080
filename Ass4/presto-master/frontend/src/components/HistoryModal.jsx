import React from 'react';
import styled from 'styled-components';

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

const Span = styled.span`
  margin-right: 10px;
`;

const HistoryModal = ({ isOpen, onClose, history, onRestore }) => {
  if (!isOpen) return null;

  return (
    <ModalBackground isOpen={isOpen}>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>Revision History</h2>
        {history.map((entry, index) => (
          <div key={index}>
            <Span>{new Date(entry.timestamp).toLocaleString()}</Span>
            <button onClick={() => onRestore(index)}>Restore</button>
          </div>
        ))}
      </ModalContent>
    </ModalBackground>
  );
};

export default HistoryModal;
