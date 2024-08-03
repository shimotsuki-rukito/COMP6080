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

const EditVideoModal = ({ isOpen, videoProps: externalVideoProps, onSubmit, onClose }) => {
  const [errorModalOpen, setErrorModalOpen] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');

  const closeErrorModal = () => {
    setErrorModalOpen(false);
  };

  const [videoProps, setVideoProps] = useState({
    src: '',
    autoplay: false
  });

  useEffect(() => {
    if (isOpen) {
      setVideoProps({
        src: externalVideoProps.src || '',
        autoplay: externalVideoProps.autoplay || false
      });
    }
  }, [isOpen, externalVideoProps]);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setVideoProps(prevProps => ({
      ...prevProps,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let videoId;
    if (videoProps.src.includes('youtube.com/watch?v=')) {
      videoId = videoProps.src.split('v=')[1].split('&')[0];
    } else if (videoProps.src.includes('youtube.com/embed/')) {
      videoId = videoProps.src.split('embed/')[1].split('?')[0];
    } else {
      setErrorMessage('Invalid URL.');
      setErrorModalOpen(true);
      return;
    }

    let embedUrl = `https://www.youtube.com/embed/${videoId}`;

    if (videoProps.autoplay) {
      embedUrl += '?autoplay=1&mute=1';
    }

    const newVideoProps = {
      ...videoProps,
      src: embedUrl
    };

    onSubmit(newVideoProps);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <ModalBackground isOpen={isOpen}>
      <ModalContent>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <h2>Edit Video</h2>
        <form onSubmit={handleSubmit}>
          Video URL:
          <br />
          <input name="src" placeholder="YouTube Video URL" value={videoProps.src} onChange={handleChange} /><br></br>
          <br />
          <label>
            Autoplay
            <input type="checkbox" name="autoplay" checked={videoProps.autoplay} onChange={handleChange} />
          </label><br></br>
          <br />
          <button type="submit">Edit Video</button>
        </form>
      </ModalContent>
      <ErrorModal isOpen={errorModalOpen} onClose={closeErrorModal}>
        <p>{errorMessage}</p>
      </ErrorModal>
    </ModalBackground>
  );
};

export default EditVideoModal;
