import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
  height: 30px;
  padding: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  margin-left: 10px;
  border-radius: 5px;
`;

const NewPresentationButton = ({ onClick }) => {
  return <Button onClick={onClick}>New Presentation</Button>;
};

export default NewPresentationButton;
